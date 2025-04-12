const User = require("../models/User");
const CourseProgress = require("../models/CourseProgress");
const { uploadToCloudinary } = require("../utils/imageUploader");
const Course = require("../models/Course");

// Delete User Account
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete user's course progress
    await CourseProgress.deleteMany({ userId: userId });

    // Delete user account
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteAccount:", error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting account",
      error: error.message,
    });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, contactNumber, about } = req.body;
    const userId = req.user.id;

    // Find user and update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        email,
        contactNumber,
        about,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating profile",
      error: error.message,
    });
  }
};

// Get User Details
exports.getAllUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const userDetails = await User.findById(userId)
      .populate("courses")
      .populate("subscription")
      .exec();

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    console.error("Error in getAllUserDetails:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching user details",
      error: error.message,
    });
  }
};

// Get Enrolled Courses
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const userCourses = await User.findById(userId)
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Enrolled courses fetched successfully",
      data: userCourses.courses,
    });
  } catch (error) {
    console.error("Error in getEnrolledCourses:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching enrolled courses",
      error: error.message,
    });
  }
};

// Update Display Picture
exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;

    const image = await uploadToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Display picture updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Error in updateDisplayPicture:", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating display picture",
      error: error.message,
    });
  }
};

// Educator Dashboard
exports.EducatorDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const educatorCourses = await Course.find({ instructor: userId })
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Educator dashboard data fetched successfully",
      data: educatorCourses,
    });
  } catch (error) {
    console.error("Error in EducatorDashboard:", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching educator dashboard data",
      error: error.message,
    });
  }
};
