const mongoose = require("mongoose");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const { instance } = require("../config/razorpay");

// Create a Razorpay order
exports.capturePayment = async (req, res) => {
  try {
    const { courses, amount } = req.body;

    // Validate input
    if (!courses || !Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid courses",
      });
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid amount",
      });
    }

    const userId = req.user.id;

    // Validate Razorpay instance
    if (!instance) {
      throw new Error("Razorpay instance not initialized");
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: `receipt_${Math.random().toString(36).substring(2, 7)}`,
      notes: {
        courses: JSON.stringify(courses),
        userId: userId,
      },
    };

    // Create order
    const order = await instance.orders.create(options);

    if (!order || !order.id) {
      throw new Error("Failed to create Razorpay order");
    }

    return res.status(200).json({
      success: true,
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.error("Error in capturePayment:", error);
    return res.status(500).json({
      success: false,
      message: "Could not initiate payment",
      error: error.message,
    });
  }
};

// Verify Razorpay payment and enroll in multiple courses
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      courses,
      amount,
      type // Add type parameter to distinguish podcast subscriptions
    } = req.body;

    // Validate required fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed: Missing payment details",
      });
    }

    // Verify the payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed: Invalid signature",
      });
    }

    // Verify the order exists
    const order = await instance.orders.fetch(razorpay_order_id);
    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed: Order not found",
      });
    }

    const userId = req.user.id;

    // Handle podcast subscription
    if (type === "podcast") {
      try {
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year from now

        const updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            $set: {
              'subscription.status': 'active',
              'subscription.planName': 'Podcast Plan',
              'subscription.startDate': startDate,
              'subscription.endDate': endDate,
              'subscriptionLevel': 'Podcast'
            }
          },
          { new: true }
        );

        if (!updatedUser) {
          throw new Error("Failed to update user subscription");
        }

        return res.status(200).json({
          success: true,
          message: "Podcast subscription activated successfully"
        });
      } catch (error) {
        console.error("Error updating subscription:", error);
        throw new Error("Failed to update subscription: " + error.message);
      }
    }

    // Handle course enrollment if courses are provided
    if (courses && courses.length > 0) {
      for (const courseId of courses) {
        try {
          const enrolledCourse = await Course.findOneAndUpdate(
            { _id: courseId },
            { $addToSet: { studentsEnrolled: userId } },
            { new: true }
          );

          if (!enrolledCourse) {
            console.error(`Course not found: ${courseId}`);
            continue;
          }

          await User.findOneAndUpdate(
            { _id: userId },
            { $addToSet: { courses: courseId } },
            { new: true }
          );

          // Send confirmation email per course
          const enrolledStudent = await User.findById(userId);
          await mailSender(
            enrolledStudent.email,
            "Congratulations from OmixLab",
            courseEnrollmentEmail(enrolledStudent.firstName, enrolledCourse.courseName)
          );
        } catch (courseError) {
          console.error(`Error enrolling in course ${courseId}:`, courseError);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: courses && courses.length > 0 
        ? "Payment verified and courses enrolled successfully"
        : "Payment verified successfully",
    });
  } catch (error) {
    console.error("Error in verifyPayment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during payment verification",
      error: error.message,
    });
  }
};

// Send payment success email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the required details",
    });
  }

  try {
    const enrolledStudent = await User.findById(userId);

    await mailSender(
      enrolledStudent.email,
      "Payment Received",
      `Payment of Rs.${amount / 100} has been received successfully for your course purchase. Your payment ID is ${paymentId} and order ID is ${orderId}.`
    );

    return res.status(200).json({
      success: true,
      message: "Payment success email sent",
    });
  } catch (error) {
    console.error("Error in sending mail:", error);
    return res.status(400).json({
      success: false,
      message: "Could not send email",
    });
  }
};

console.log("capturePayment:", exports.capturePayment);
console.log("verifyPayment:", exports.verifyPayment);
console.log("sendPaymentSuccessEmail:", exports.sendPaymentSuccessEmail);



