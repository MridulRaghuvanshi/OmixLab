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
    // Log the exact request data received
    console.log("Payment Verification - Raw Request Body:", JSON.stringify(req.body));
    console.log("Payment Verification - User ID:", req.user?.id);
    console.log("Payment Verification - Headers:", req.headers);

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      courses,
      amount,
      purchasedLevel
    } = req.body;

    // Log each field individually for debugging
    console.log("Payment Verification - Extracted Fields:", {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      courses,
      amount,
      purchasedLevel
    });

    //chek if it is for padcast validation
    if (courses == "poadcast_plan_subscribe") {
      console.log("Payment Verification - Podcast Plan Subscription");
      const podcastPlan = await User.findByIdAndUpdate(
        req.user.id,
        { subscriptionLevel: "Premium" },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "Podcast plan subscription successful",
      });
    }

    // Validate required fields with detailed error messages
    const missingFields = [];
    if (!razorpay_payment_id) missingFields.push('razorpay_payment_id');
    if (!razorpay_order_id) missingFields.push('razorpay_order_id');
    if (!razorpay_signature) missingFields.push('razorpay_signature');
    if (!courses) missingFields.push('courses');
    if (!amount) missingFields.push('amount');
    if (!purchasedLevel) missingFields.push('purchasedLevel');

    if (missingFields.length > 0) {
      console.error("Missing required fields:", {
        missingFields,
        receivedData: req.body
      });
      return res.status(400).json({
        success: false,
        message: `Payment verification failed: Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate courses array
    if (!Array.isArray(courses)) {
      console.error("Invalid courses format:", courses);
      return res.status(400).json({
        success: false,
        message: "Courses must be an array"
      });
    }

    // Validate course IDs
    for (const courseId of courses) {
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        console.error("Invalid course ID:", courseId);
        return res.status(400).json({
          success: false,
          message: `Invalid course ID format: ${courseId}`
        });
      }
    }

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      console.error("Invalid amount:", amount);
      return res.status(400).json({
        success: false,
        message: "Invalid amount"
      });
    }

    // Validate purchased level
    const validLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    if (!validLevels.includes(purchasedLevel)) {
      console.error("Invalid level specified:", {
        receivedLevel: purchasedLevel,
        validLevels
      });
      return res.status(400).json({
        success: false,
        message: `Invalid course level specified. Must be one of: ${validLevels.join(', ')}`
      });
    }

    // Verify the payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    console.log("Payment Verification - Signature Check:", {
      expected: expectedSignature,
      received: razorpay_signature,
      match: expectedSignature === razorpay_signature,
      secretKeyPresent: !!process.env.RAZORPAY_KEY_SECRET
    });

    if (expectedSignature !== razorpay_signature) {
      console.error("Signature verification failed:", {
        expected: expectedSignature,
        received: razorpay_signature,
        orderBody: body
      });
      return res.status(400).json({
        success: false,
        message: "Payment verification failed: Invalid signature"
      });
    }

    // Verify the order exists
    try {
      console.log("Fetching order details:", razorpay_order_id);
      const order = await instance.orders.fetch(razorpay_order_id);
      console.log("Order details:", order);

      if (!order) {
        throw new Error("Order not found");
      }
    } catch (error) {
      console.error("Error fetching order:", {
        orderId: razorpay_order_id,
        error: error.message
      });
      return res.status(400).json({
        success: false,
        message: "Payment verification failed: Order not found"
      });
    }

    const userId = req.user.id;
    console.log("Fetching user details:", userId);
    
    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found:", userId);
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Define level hierarchy with numeric values for comparison
    const levelHierarchy = {
      'Beginner': {
        value: 1,
        access: ['Beginner']
      },
      'Intermediate': {
        value: 2,
        access: ['Beginner', 'Intermediate']
      },
      'Advanced': {
        value: 3,
        access: ['Beginner', 'Intermediate', 'Advanced']
      },
      'Expert': {
        value: 4,
        access: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
      }
    };

    const enrollmentResults = [];
    for (const courseId of courses) {
      try {
        // Log the course ID we're processing
        console.log("\n=== Processing Course Enrollment ===");
        console.log("Course ID:", courseId);
        console.log("User ID:", userId);
        console.log("Purchased Level:", purchasedLevel);

        // Get the main course with explicit error handling
        let mainCourse;
        try {
          mainCourse = await Course.findById(courseId).lean();
          console.log("Database query for course completed");
        } catch (dbError) {
          console.error("Database error finding course:", {
            courseId,
            error: dbError.message
          });
          enrollmentResults.push({
            courseId,
            success: false,
            message: "Database error finding course"
          });
          continue;
        }

        if (!mainCourse) {
          console.error("Course not found in database:", courseId);
          enrollmentResults.push({
            courseId,
            success: false,
            message: "Course not found in database"
          });
          continue;
        }

        console.log("Found course:", {
          id: mainCourse._id,
          name: mainCourse.courseName,
          educator: mainCourse.Educator,
          level: mainCourse.level
        });

        // Validate course has required fields
        if (!mainCourse.courseName || !mainCourse.Educator || !mainCourse.level) {
          console.error("Course missing required fields:", {
            id: mainCourse._id,
            hasName: !!mainCourse.courseName,
            hasEducator: !!mainCourse.Educator,
            hasLevel: !!mainCourse.level
          });
          enrollmentResults.push({
            courseId,
            success: false,
            message: "Course data incomplete"
          });
          continue;
        }

        // Find all course levels with explicit error handling
        let allCourseLevels;
        try {
          allCourseLevels = await Course.find({
            courseName: mainCourse.courseName,
            Educator: mainCourse.Educator,
            level: { $in: levelHierarchy[purchasedLevel].access }
          }).lean();
          
          console.log("Found course levels:", {
            count: allCourseLevels.length,
            levels: allCourseLevels.map(c => ({
              id: c._id.toString(),
              name: c.courseName,
              level: c.level
            }))
          });
        } catch (dbError) {
          console.error("Database error finding course levels:", {
            courseId,
            error: dbError.message
          });
          enrollmentResults.push({
            courseId,
            success: false,
            message: "Error finding course levels"
          });
          continue;
        }

        if (allCourseLevels.length === 0) {
          console.error("No available course levels found:", {
            courseName: mainCourse.courseName,
            educator: mainCourse.Educator,
            requestedLevels: levelHierarchy[purchasedLevel].access,
            purchasedLevel
          });
          enrollmentResults.push({
            courseId,
            success: false,
            message: `No course levels found for ${purchasedLevel} access`
          });
          continue;
        }

        // Check existing enrollments
        const existingEnrollments = allCourseLevels.filter(course => 
          course.studentsEnrolled?.includes(userId)
        );

        console.log("Enrollment check:", {
          userId,
          existingCount: existingEnrollments.length,
          existingLevels: existingEnrollments.map(c => c.level)
        });

        if (existingEnrollments.length > 0) {
          const currentHighestLevel = Math.max(...existingEnrollments.map(
            course => levelHierarchy[course.level].value
          ));

          if (levelHierarchy[purchasedLevel].value <= currentHighestLevel) {
            console.log("User already enrolled in same or higher level:", {
              courseId,
              currentHighestLevel,
              purchasedLevel
            });
            enrollmentResults.push({
              courseId,
              success: false,
              message: "Already enrolled in same or higher level"
            });
            continue;
          }
        }

        // Update user's subscription level if purchasing a higher level
        const currentLevel = user.subscriptionLevel ? levelHierarchy[user.subscriptionLevel].value : 0;
        const purchasedLevelValue = levelHierarchy[purchasedLevel].value;

        if (purchasedLevelValue > currentLevel) {
          console.log("Updating user subscription level:", {
            from: user.subscriptionLevel,
            to: purchasedLevel
          });
          await User.findByIdAndUpdate(
            userId,
            { subscriptionLevel: purchasedLevel },
            { new: true }
          );
        }

        // Enroll in all appropriate levels
        let enrolledInAnyLevel = false;
        for (const courseLevelDoc of allCourseLevels) {
          // Skip if already enrolled in this specific level
          if (courseLevelDoc.studentsEnrolled.includes(userId)) {
            console.log("Already enrolled in level:", {
              courseId: courseLevelDoc._id,
              level: courseLevelDoc.level
            });
            continue;
          }

          console.log("Enrolling in course level:", {
            courseId: courseLevelDoc._id,
            level: courseLevelDoc.level
          });

          // Add student to course's enrolled students
          await Course.findByIdAndUpdate(
            courseLevelDoc._id,
            { $addToSet: { studentsEnrolled: userId } },
            { new: true }
          );

          // Add course to user's enrolled courses
          await User.findByIdAndUpdate(
            userId,
            { $addToSet: { courses: courseLevelDoc._id } },
            { new: true }
          );

          enrolledInAnyLevel = true;
        }

        if (enrolledInAnyLevel) {
          // Send confirmation email
          const enrolledStudent = await User.findById(userId);
          await mailSender(
            enrolledStudent.email,
            `Course Enrollment Confirmation - ${mainCourse.courseName}`,
            courseEnrollmentEmail(
              enrolledStudent.firstName,
              `${mainCourse.courseName} (${purchasedLevel} Level and below)`
            )
          );

          enrollmentResults.push({
            courseId,
            success: true,
            message: "Successfully enrolled"
          });
        } else {
          enrollmentResults.push({
            courseId,
            success: false,
            message: "No new levels to enroll in"
          });
        }

      } catch (courseError) {
        console.error("Error enrolling in course:", {
          courseId,
          error: courseError.message,
          stack: courseError.stack
        });
        enrollmentResults.push({
          courseId,
          success: false,
          message: courseError.message || "Enrollment failed due to internal error"
        });
      }
    }

    // Check if any enrollments were successful
    const hasSuccessfulEnrollments = enrollmentResults.some(result => result.success);

    if (!hasSuccessfulEnrollments) {
      console.error("No successful enrollments");
      return res.status(400).json({
        success: false,
        message: "No successful enrollments",
        enrollmentResults
      });
    }

    console.log("Payment verification successful for user:", {
      userId,
      courses,
      purchasedLevel
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified and courses enrolled successfully",
      enrollmentResults
    });

  } catch (error) {
    console.error("Error in verifyPayment:", {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    return res.status(500).json({
      success: false,
      message: "Internal server error during payment verification",
      error: error.message
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



