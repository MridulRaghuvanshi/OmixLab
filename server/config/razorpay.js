const Razorpay = require("razorpay");
require("dotenv").config();

// Validate environment variables
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("Razorpay credentials are missing in environment variables");
}

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Verify the instance is created
if (!razorpayInstance) {
  throw new Error("Failed to initialize Razorpay instance");
}

exports.instance = razorpayInstance;
