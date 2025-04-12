// const jwt = require("jsonwebtoken");
// require("dotenv").config();
// const User = require("../models/User");




// //auth
// exports.auth = async(req,res,next)=>{
//   try {
//     //getting or extracting the token
//     console.log("hihihihi ",req.header("Authorization").replace("Bearer ", ""));
    
//     const token= req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "")
//     // console.log(token);
    
//     //if token missing or not found, then return response
//     if (!token){
//       return res.status(401).json({
//         success : false,
//         message:"token not found or missing",
//       })
//     }
//     //verify the token
//     try{ 
//       console.log(process.env.JWT_SECRET)
//       const decode = jwt.verify(token, process.env.JWT_SECRET);
//       console.log(decode);
//       req.user = decode;
//     }catch (err){
//       //if issue in verification
//       return res.status(401).json({
//         success:false,
//         message: "Token invalid",
//       });
//     }
//     next();

//   }catch (error){
//     return res.status(401).json({
//       success:false,
//       message:"While validation of token something found wrong",
//     })

//   }
// }


const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables
const User = require("../models/User");

exports.auth = async (req, res, next) => {
  try {
    // Extract token from different sources
    const authHeader = req.header("Authorization");
    const token = req.cookies.token || req.body.token || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null);

    // If token is missing
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found or missing",
      });
    }

    // Verify token
    try { 
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
      }

      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: err.message.includes("jwt expired") ? "Token has expired" : "Token invalid",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: " + error.message,
    });
  }
};


//isStudent
exports.isStudent = async (req,res,next) => {
  try {
    if(req.user.accountType !== "Student"){
      return res.status(401).json({
        success:false,
        message:"This is a protected route for Student only"
      })
    }
    next();


  }catch (error){
    return res.status(500).json({
      success:false,
      message : "user role cannot be verified, please try again"
    })
  }
}

//isEducator
exports.isEducator = async (req,res,next) => {
  try {
    if(req.user.accountType !== "Educator"){
      return res.status(401).json({
        success:false,
        message:"This is a protected route for Educator only"
      })
    }
    next();


  }catch (error){
    return res.status(500).json({
      success:false,
      message : "user role cannot be verified, please try again"
    })
  }
}


//isAdmin
exports.isAdmin = async (req,res,next) => {
  try {
    if(req.user.accountType !== "Admin"){
      return res.status(401).json({
        success:false,
        message:"This is a protected route for Admin only"
      })
    }
    next();


  }catch (error){
    return res.status(500).json({
      success:false,
      message : "user role cannot be verified, please try again"
    })
  }
}


//const User = require("../models/User");