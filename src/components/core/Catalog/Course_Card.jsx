import React, { useEffect, useState } from 'react'
import RatingStars from '../../common/RatingStars'
import GetAvgRating from '../../../utils/avgRating';
import { Link } from 'react-router-dom';
import { HiUsers } from "react-icons/hi";

const Course_Card = ({course, Height}) => {


    const [avgReviewCount, setAvgReviewCount] = useState(0);

    useEffect(()=> {
        const count = GetAvgRating(course.ratingAndReviews);
        setAvgReviewCount(count);
    },[course])


    
  return (
    <>
      <Link to={`/courses/${course._id}`}>
        <div className="">
          <div className="rounded-lg">
            <img
              src={course?.thumbnail}
              alt="course thumnail"
              className={`${Height} w-full rounded-xl object-cover `}
            />
          </div>
          <div className="flex flex-col gap-2 px-1 py-3">
            <p className="text-xl text-[rgb(244,244,245)]">{course?.courseName}</p>
            <p className="text-sm text-[rgb(239,246,255)]">
              {course?.Educator?.firstName} {course?.Educator?.lastName}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-yellow-5">{avgReviewCount || 0}</span>
              <RatingStars Review_Count={avgReviewCount} />
              <span className="text-[rgb(101,101,111)]">
                {course?.ratingAndReviews?.length} Ratings
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xl text-[rgb(244,244,245)]">Rs. {course?.price}</p>
              {course?.level && (
                <div className="flex items-center gap-2 text-sm text-[rgb(161,161,170)]">
                  <HiUsers className="text-[rgb(161,161,170)]" />
                  <span>{course.level}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}

export default Course_Card