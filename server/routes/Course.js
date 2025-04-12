// Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controllers

// Course Controllers Import
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  editCourse,
  getEducatorCourses,
  deleteCourse,
} = require("../controllers/Course")


// Categories Controllers Import
const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require("../controllers/Category")

// Sections Controllers Import
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section")

// Sub-Sections Controllers Import
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection")

// Rating Controllers Import
const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReview")

const {
  updateCourseProgress
} = require("../controllers/CourseProgress");

// Importing Middlewares
const { auth, isEducator, isStudent, isAdmin } = require("../middlewares/auth")

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Educators
router.post("/createCourse", auth, isEducator, createCourse)
//Add a Section to a Course
console.log("createSection:", createSection);
router.post("/addSection", auth, isEducator, createSection)
// Update a Section
router.post("/updateSection", auth, isEducator, updateSection)
// Delete a Section
router.post("/deleteSection", auth, isEducator, deleteSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isEducator, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isEducator, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isEducator, createSubSection)
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)
// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// Edit Course routes
router.post("/editCourse", auth, isEducator, editCourse)
// Get all Courses Under a Specific Educator
router.get("/getEducatorCourses", auth, isEducator, getEducatorCourses)
// Delete a Course
router.delete("/deleteCourse/:courseId", deleteCourse)

//(req, res) => {
  //console.log("DELETE:", req.params.courseId);
  //res.send("DELETE request");


router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

// ********************************************************************************************************
//                                      Category routes (Only for Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

module.exports = router