const RatingAndReview = require("../models/RatingAndReview");

const Course = require("../models/Course");

//createRating
exports.createRating = async (req,res)=>{
  try{
    //phele userid lena hoga
    const userId = req.user.id;
    //data ko search karna hoga req body se
    const {rating,review,courseId} = req.body ;
    //check if user is already enrolled or not.
    const courseDetails = await Course.findOne(
      {_id:courseId,
        studentsEnrolled:{$elemMatch:{$eq:userId}},
      },
    );
    if(!courseDetails) {
      return res.status(404).json({
        success:false,
        message:"Student is not enrolled in the course",
      });
    }
    //check if user is reviewed already the course or not.
    const alreadyReviewed = await RatingAndReview.findOne({
      user:userId,
      course:courseId,

    });
    if(alreadyReviewed){
      return res.status(403).json({
        success:false,
        message:"Course is already Reviewed by the User",
      });
    }
    //create rating and review
    const ratingReview = await RatingAndReview.create({
      rating, review,
      course:courseId,
      user:userId,
    });
    
    //update the course with current rating and review
    const updatedCourseDetails = await Course.findByIdAndUpdate({_id:courseId},{
      $push:{
        ratingAndReviews:ratingReview._id,
      }
    },
  {new:true})
  console.log(updatedCourseDetails);
    //return res.
    return res.status(200).json({
      success:true,
      message:"Rating and Review saved successfully",
      ratingReview,
    })
    




  }catch(error){
    console.log(error);
    return res.status(500).json({
      success:false,
      message:error.mesaage,
    })

  }
}


//getAverageRating ka handler function
exports.getAverageRating = async (req,res) => {
  try{
    //get course Id
    const courseId = req.body.courseId;
    //avg rating calculation
    
    const result = await RatingAndReview.aggregate([
      {
        $match:{
        course: new mongoose.Types.ObjectId(courseId),
      },
    },
    {
      $group:{
        _id:null,
        averageRating :{$avg:"$rating"},
      }

    }
      
    ])
    //return rating
    if(result.length>0){
      return res.status(200).json({
        success:true,
        averageRating:result[0].averageRating,
      })
    }

    //if no rating and review is their
     return res.status(200).json({
      success:true,
      message:"Avg rating is not available right now",
      averageRating:0,

     })


  }catch(error){
    console.log(error);
    return res.status(500).json({
      success:false,
      message:error.message
    })
  }
}



//AllRatings

exports.getAllRating = async(req,res)=>{
  try{
    const allReviews = await RatingAndReview.find({}).sort({rating:"desc"}).populate({
      path:"user",
      select:"firstName lastName email image",
    })
    .populate({
      path:"course",
      select:"courseName",
    })
    .exec();
    return res.status(200).json({
      success:true,
      message:"All reviews and rating fetched successfully",
      data:allReviews,
    });


     
  }catch(error){
    console.log(error);
    return res.status(500).json({
      success:false,
      message:error.message
    })
  }
}
