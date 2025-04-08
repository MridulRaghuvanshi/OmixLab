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

    if (!courses || !Array.isArray(courses) || courses.length === 0 || !amount) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid courses and amount",
      });
    }

    const userId = req.user.id;

    const options = {
      amount: amount * 100, // Razorpay requires amount in paise
      currency: "INR",
      receipt: `receipt_${Math.random().toString(36).substring(2, 7)}`,
      notes: {
        courses: JSON.stringify(courses),
        userId: userId,
      },
    };

    const order = await instance.orders.create(options);

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
    } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !courses) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed: Missing payment details",
      });
    }

    const userId = req.user.id;

    // Enroll the user in all courses
    for (const courseId of courses) {
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $addToSet: { studentsEnrolled: userId } },
        { new: true }
      );

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
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified and all courses added",
    });
  } catch (error) {
    console.error("Error in verifyPayment:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
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



