const mongoose = require("mongoose");

// Define the Courses schema
const coursesSchema = new mongoose.Schema({
	courseName: {
		type: String,
		required: true,
		trim: true,
	},
	courseDescription: {
		
		type: String,
		required: true,
		trim: true,
	},
	Educator: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "user",
	},
	whatYouWillLearn: {
		type: String,
	},
	courseContent: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Section",
		},
	],
	ratingAndReviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "RatingAndReview",
		},
	],
	price: {
		type: Number,
	},
	thumbnail: {
		type: String,
	},
	introVideo: {
		type: String,
	},
	tag: {
		type: [String],
		required: true,
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		// required: true,
		ref: "Category",
	},
	studentsEnrolled: [
		{
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "user",
		},
	],
	instructions: {
		type: [String],
	},
	status: {
		type: String,
		enum: ["Draft", "Published"],
	},
	level: {
		type: String,
		required: true,
		enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
},);

// Export the Courses model
module.exports = mongoose.model("Course", coursesSchema);