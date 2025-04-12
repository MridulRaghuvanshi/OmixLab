import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../../../context/ThemeContext"
import { apiConnector } from "../../../services/apiconnector"
import { courseEndpoints } from "../../../services/apis"

export default function EnrolledCourses() {
  const { isDarkMode } = useTheme()
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useSelector((state) => state.profile)

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await apiConnector(
          "GET",
          courseEndpoints.GET_ALL_COURSE_API,
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        )

        if (response.data.success) {
          setEnrolledCourses(response.data.data)
        }
      } catch (error) {
        console.log("Could not fetch enrolled courses.")
      }
      setLoading(false)
    }

    fetchEnrolledCourses()
  }, [token])

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <>
      <div className="text-3xl text-white mb-8">
        <h1 className="mb-14 text-3xl font-medium text-white">My Courses</h1>
        {user?.subscription && (
          <div className={`mb-8 rounded-lg p-6 ${
            isDarkMode ? "bg-[#1C1F2E]" : "bg-white"
          }`}>
            <h2 className={`text-xl font-semibold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>
              Current Subscription
            </h2>
            <div className={`grid grid-cols-2 gap-4 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}>
              <div>
                <p className="font-medium">Plan:</p>
                <p className="text-[#00FFB2] font-semibold">{user.subscription.planName}</p>
              </div>
              <div>
                <p className="font-medium">Level:</p>
                <p className="text-[#00FFB2] font-semibold">{user.subscriptionLevel}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="my-8">
          <h2 className={`text-xl font-semibold mb-4 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}>
            Available Courses
          </h2>
          {enrolledCourses.length === 0 ? (
            <p className={`text-lg ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              {user?.subscription 
                ? "No courses available for your subscription level yet."
                : "Subscribe to a plan to access courses."}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {enrolledCourses.map((course) => (
                <div
                  key={course._id}
                  className={`cursor-pointer rounded-lg p-4 ${
                    isDarkMode ? "bg-[#1C1F2E]" : "bg-white"
                  }`}
                  onClick={() => {
                    navigate(`/view-course/${course._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`)
                  }}
                >
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="h-[200px] w-full rounded-lg object-cover"
                  />
                  <div className="mt-4">
                    <p className={`text-lg font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}>
                      {course.courseName}
                    </p>
                    <p className={`mt-2 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}>
                      {course.courseDescription}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`px-2 py-1 text-sm rounded-full ${
                        isDarkMode ? "bg-[#00FFB2]/10 text-[#00FFB2]" : "bg-[#00FFB2]/20 text-[#008C62]"
                      }`}>
                        {course.level}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}