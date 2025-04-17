import React from "react"
import { Link } from "react-router-dom"
import RatingStars from "../../common/RatingStars"
import GetAvgRating from "../../../utils/avgRating"
import { useTheme } from "../../../context/ThemeContext"

function CourseCard({ course, height }) {
  const { isDarkMode } = useTheme()
  
  if (!course) return null;

  // Calculate average rating across all levels
  const avgReviewCount = course.levels ? 
    GetAvgRating(course.levels.reduce((acc, c) => [...acc, ...(c.ratingAndReviews || [])], [])) :
    GetAvgRating(course.ratingAndReviews)
  
  // Get the price range for grouped courses
  const priceRange = course.levels ? {
    min: Math.min(...course.levels.map(c => c?.price || 0)),
    max: Math.max(...course.levels.map(c => c?.price || 0))
  } : { min: course?.price || 0, max: course?.price || 0 }
  
  // Get sorted levels
  const levels = course.levels ? 
    course.levels
      .filter(c => c?.level)
      .map(c => c.level)
      .sort((a, b) => {
        const order = { "Beginner": 0, "Intermediate": 1, "Advanced": 2, "Expert": 3 }
        return order[a] - order[b]
      }) : 
    [course.level].filter(Boolean)

  // Get total ratings count
  const totalRatings = course.levels ?
    course.levels.reduce((acc, c) => acc + (c.ratingAndReviews?.length || 0), 0) :
    course.ratingAndReviews?.length || 0

  // Get the main course ID (first level's ID)
  const mainCourseId = course.levels ? 
    course.levels[0]?._id || course._id : 
    course._id

  return (
    <Link to={`/courses/${mainCourseId}`}>
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-lg transition-transform duration-200 hover:scale-[1.02]`}>
        <div className={`relative ${height} w-full`}>
          <img
            src={course.thumbnail}
            alt={course.courseName}
            className="h-full w-full object-cover"
          />
          {course.levels && course.levels.length > 1 && (
            <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">
              {course.levels.length} Levels Available
            </div>
          )}
        </div>
        <div className="p-4">
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            {course.courseName}
          </h2>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
            By {course.Educator?.firstName || ''} {course.Educator?.lastName || ''}
          </p>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-sm ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`}>
              {avgReviewCount || 0}
            </span>
            <RatingStars Review_Count={avgReviewCount} />
            <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              ({totalRatings} ratings)
            </span>
          </div>
          <div className={`flex items-center justify-between ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <p className="text-lg font-bold">
              ₹{priceRange.min === priceRange.max ? 
                priceRange.min : 
                `${priceRange.min} - ${priceRange.max}`}
            </p>
            {levels.length > 0 && (
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {levels.length > 1 ? 
                  `${levels[0]} to ${levels[levels.length-1]}` : 
                  levels[0]}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CourseCard 