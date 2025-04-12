const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ Database Connected Successfully");
  } catch (error) {
    console.error("❌ Database Connection Failed:", error.message);
    process.exit(1); // Exit process if connection fails
  }
};

// const mongoose = require("mongoose");
// require("dotenv").config();

// exports.connect = async () => {
//   try {
//     mongoose.set("debug", true);  // Enable query debugging
//     await mongoose.connect(process.env.MONGODB_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 5000,  // Timeout after 5 seconds
//     });
//     console.log("✅ Database Connected Successfully");
//   } catch (error) {
//     console.error("❌ Database Connection Failed:", error);
//     process.exit(1);
//   }
// };
