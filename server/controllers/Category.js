const { Mongoose } = require("mongoose");
const Category = require("../models/Category");
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

exports.createCategory = async (req, res) => {
	try {
		const { name, description } = req.body;
		if (!name) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}
		const CategorysDetails = await Category.create({
			name: name,
			description: description,
		});
		console.log(CategorysDetails);
		return res.status(200).json({
			success: true,
			message: "Categorys Created Successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: true,
			message: error.message,
		});
	}
};



exports.showAllCategories = async (req, res) => {
	try {
        console.log("INSIDE SHOW ALL CATEGORIES");
		const allCategorys = await Category.find({});
		res.status(200).json({
			success: true,
			data: allCategorys,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

//categoryPageDetails 

// exports.categoryPageDetails = async (req, res) => {
//     try {
//       const { categoryId } = req.body
//       console.log("PRINTING CATEGORY ID: ", categoryId);
//       // Get courses for the specified category
//       const selectedCategory = await Category.findById(categoryId)
//         .populate({
//           path: "courses",
//           match: { status: "Published" },
//           populate: "ratingAndReviews",
//         })
//         .exec()
  
//       console.log("SELECTED COURSE", selectedCategory)
//       // Handle the case when the category is not found
//       if (!selectedCategory) {
//         console.log("Category not found.")
//         return res
//           .status(404)
//           .json({ success: false, message: "Category not found" })
//       }
//       // Handle the case when there are no courses
//       if (selectedCategory.courses.length === 0) {
//         console.log("No courses found for the selected category.")
//         return res.status(404).json({
//           success: false,
//           message: "No courses found for the selected category.",
//         })
//       }
  
//       // Get courses for other categories
//       const categoriesExceptSelected = await Category.find({
//         _id: { $ne: categoryId },
//       })
//       let differentCategory = await Category.findOne(
//         categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
//           ._id
//       )
//         .populate({
//           path: "courses",
//           match: { status: "Published" },
//         })
//         .exec()
//         console.log("Different COURSE", differentCategory)
//       // Get top-selling courses across all categories
//       const allCategories = await Category.find()
//         .populate({
//           path: "courses",
//           match: { status: "Published" },
//           populate: {
//             path: "Educator",
//         },
//         })
//         .exec()
//       const allCourses = allCategories.flatMap((category) => category.courses)
//       const mostSellingCourses = allCourses
//         .sort((a, b) => b.sold - a.sold)
//         .slice(0, 10)
//        console.log("mostSellingCourses COURSE", mostSellingCourses)
//       res.status(200).json({
//         success: true,
//         data: {
//           selectedCategory,
//           differentCategory,
//           mostSellingCourses,
//         },
//       })
//     } catch (error) {
//       return res.status(500).json({
//         success: false,
//         message: "Internal server error",
//         error: error.message,
//       })
//     }
//   }

exports.categoryPageDetails = async (req, res) => {
  try {
      const { categoryId } = req.body;
      console.log("PRINTING CATEGORY ID: ", categoryId);

      // Validate categoryId
      if (!categoryId) {
          return res.status(400).json({ success: false, message: "Category ID is required" });
      }

      // Get courses for the specified category
      const selectedCategory = await Category.findById(categoryId)
          .populate({
              path: "courses",
              populate: "ratingAndReviews",
          })
          .exec();

      console.log("SELECTED CATEGORY:", selectedCategory);

      // Handle the case when the category is not found
      if (!selectedCategory) {
          return res.status(404).json({ success: false, message: "Category not found" });
      }

      // Handle the case when there are no courses
      if (!selectedCategory.courses || selectedCategory.courses.length === 0) {
          return res.status(404).json({ success: false, message: "No courses found for the selected category." });
      }

      // Get courses for other categories
      const categoriesExceptSelected = await Category.find({ _id: { $ne: categoryId } });

      let differentCategory = null;
      if (categoriesExceptSelected.length > 0) {
          // Define getRandomInt function properly
          function getRandomInt(max) {
              return Math.floor(Math.random() * max);
          }

          differentCategory = await Category.findById(
              categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id
          )
              .populate({
                  path: "courses",
                  match: { status: "Published" },
              })
              .exec();
      }

      console.log("DIFFERENT CATEGORY:", differentCategory);

      // Get top-selling courses across all categories
      const allCategories = await Category.find()
          .populate({
              path: "courses",
              match: { status: "Published" },
              populate: { path: "Educator" },
          })
          .exec();

      const allCourses = allCategories.flatMap((category) => category.courses || []);
      const mostSellingCourses = allCourses.length > 0
          ? allCourses.sort((a, b) => b.sold - a.sold).slice(0, 10)
          : [];

      console.log("TOP-SELLING COURSES:", mostSellingCourses);

      // Final response
      res.status(200).json({
          success: true,
          data: {
              selectedCategory,
              differentCategory,
              mostSellingCourses,
          },
      });

  } catch (error) {
      console.error("ERROR:", error);
      return res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message,
      });
  }
};

// const Category = require("../models/Category"); // Ensure this import


