import React, { useEffect, useState } from "react"
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import { Check } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Player, BigPlayButton } from "video-react"
import "video-react/dist/video-react.css"

import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams, Link } from "react-router-dom"

import ConfirmationModal from "../components/common/ConfirmationModal"
import Footer from "../components/common/Footer"
import RatingStars from "../components/common/RatingStars"
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar"
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard"
import { formatDate } from "../services/formatDate"
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI"
import { buyCourse } from "../services/operations/studentFeaturesAPI"
import GetAvgRating from "../utils/avgRating"
import Error from "./Error"
import { toast } from "react-hot-toast"
import { useTheme } from "../context/ThemeContext"

function CourseDetails() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.profile)
  const { paymentLoading } = useSelector((state) => state.course)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isDarkMode } = useTheme()

  // Getting courseId from url parameter
  const { courseId } = useParams()
  // console.log(`course id: ${courseId}`)

  // Declear a state to save the course details
  const [response, setResponse] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)
  useEffect(() => {
    // Calling fetchCourseDetails fucntion to fetch the details
    ;(async () => {
      try {
        const res = await fetchCourseDetails(courseId)
        // console.log("course details res: ", res)
        setResponse(res)
      } catch (error) {
        console.log("Could not fetch Course Details")
      }
    })()
  }, [courseId])

  // console.log("response: ", response)

  // Calculating Avg Review count
  const [avgReviewCount, setAvgReviewCount] = useState(0)
  useEffect(() => {
    const count = GetAvgRating(response?.data?.courseDetails.ratingAndReviews)
    setAvgReviewCount(count)
  }, [response])
  // console.log("avgReviewCount: ", avgReviewCount)

  // // Collapse all
  // const [collapse, setCollapse] = useState("")
  const [isActive, setIsActive] = useState(Array(0))
  const handleActive = (id) => {
    // console.log("called", id)
    setIsActive(
      !isActive.includes(id)
        ? isActive.concat([id])
        : isActive.filter((e) => e != id)
    )
  }

  // Total number of lectures
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0)
  useEffect(() => {
    let lectures = 0
    response?.data?.courseDetails?.courseContent?.forEach((sec) => {
      lectures += sec.subSection.length || 0
    })
    setTotalNoOfLectures(lectures)
  }, [response])

  const courseLevels = [
    {
      title: "Beginner",
      subtitle: "Perfect for those just starting out",
      price: 499,
      duration: "4 weeks",
      lessons: 12,
      features: [
        "Basic Python syntax and data types",
        "Control flow and functions",
        "Simple data structures",
        "Basic file handling",
        "Certificate of completion"
      ]
    },
    {
      title: "Intermediate",
      subtitle: "For those with basic Python knowledge",
      price: 999,
      duration: "8 weeks",
      lessons: 24,
      features: [
        "Object-oriented programming",
        "Advanced data structures",
        "Error handling and debugging",
        "Basic algorithms",
        "Project-based learning",
        "Certificate of completion"
      ]
    },
    {
      title: "Advanced",
      subtitle: "For experienced Python developers",
      price: 1499,
      duration: "12 weeks",
      lessons: 36,
      features: [
        "Advanced OOP concepts",
        "Design patterns",
        "Testing and debugging",
        "Performance optimization",
        "Real-world projects",
        "1-on-1 mentoring",
        "Certificate of completion"
      ]
    },
    {
      title: "Expert",
      subtitle: "Master Python programming",
      price: 2499,
      duration: "16 weeks",
      lessons: 48,
      features: [
        "Advanced algorithms",
        "System design",
        "Performance optimization",
        "Security best practices",
        "Industry projects",
        "Career guidance",
        "Lifetime access",
        "Certificate of completion"
      ]
    }
  ];

  if (loading || !response) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }
  if (!response.success) {
    return <Error />
  }

  const {
    _id: course_id,
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    Educator,
    studentsEnrolled,
    createdAt,
  } = response.data?.courseDetails

  const handleBuyCourse = (selectedPrice) => {
    if (user?.accountType === "Educator") {
      toast.error("As an educator, you cannot purchase courses. You can only create and manage courses.");
      return;
    }

    if (!courseId) {
      console.error("courseId is undefined!");
      return toast.error("Course ID is missing.");
    }

    try {
      if (token) {
        // Pass the selected price
        buyCourse(token, [courseId], user, navigate, dispatch, selectedPrice);
        return;
      }

      setConfirmationModal({
        text1: "You are not logged in!",
        text2: "Please login to Purchase Course.",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(null),
      });
    } catch (error) {
      console.error("Error in handleBuyCourse:", error);
      toast.error("Failed to process purchase. Please try again.");
    }
  };

  if (paymentLoading) {
    // console.log("payment loading")
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className={`w-full ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header/Navigation Breadcrumb */}
      <div className="bg-blue-600 py-8 text-white">
        <div className="mx-auto w-11/12 max-w-maxContent">
          <div className="flex items-center text-sm mb-4">
            <Link to="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/courses" className="hover:underline">Courses</Link>
            <span className="mx-2">/</span>
            <span>Python Programming</span>
          </div>
          <h1 className="text-4xl font-bold">{courseName}</h1>
        </div>
      </div>

      {/* Course Details Section */}
      <div className="mx-auto w-11/12 max-w-maxContent py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Info */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Course Details</h2>
              <p className="text-lg mb-6">
                Master Python programming from the ground up with our comprehensive course. Whether you're a complete beginner or 
                an experienced developer looking to advance your skills, we offer four distinct learning paths to match your experience 
                level and goals.
              </p>
              <p className="text-lg">
                Python is one of the most popular programming languages used in data science, machine learning, web development, 
                automation, and more. Our course is designed by industry experts to provide you with practical skills that are in high 
                demand.
              </p>
            </div>

            {/* Video Preview */}
            <div className="mb-8">
              <Player
                playsInline
                poster={thumbnail}
                src={response.data?.courseDetails.previewVideo}
              >
                <BigPlayButton position="center" />
              </Player>
            </div>

            {/* Course Stats */}
            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <RatingStars Review_Count={avgReviewCount} />
                <span>({ratingAndReviews?.length} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineGlobeAlt />
                <span>English</span>
              </div>
              <div>
                <span>{totalNoOfLectures} total lectures</span>
              </div>
            </div>

            {/* What You'll Learn Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">What You'll Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.isArray(whatYouWillLearn) ? (
                  whatYouWillLearn.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-4 rounded-lg ${
                        isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                      }`}
                    >
                      <Check className="w-5 h-5 text-green-500 mt-1" />
                      <p>{item}</p>
                    </div>
                  ))
                ) : (
                  <div className={`col-span-2 p-4 rounded-lg ${
                    isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
                  }`}>
                    <p>Course learning outcomes will be available soon.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Course Content Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Course Content</h2>
              <div className="flex flex-wrap justify-between gap-2 mb-4">
                <div className="flex gap-2">
                  <span>{courseContent?.length} section(s)</span>
                  <span>{totalNoOfLectures} lecture(s)</span>
                </div>
                <div>
                  <button
                    className="text-yellow-25"
                    onClick={() => setIsActive([])}
                  >
                    Collapse all sections
                  </button>
                </div>
              </div>
              <div className="py-4">
                {courseContent?.map((course, index) => (
                  <CourseAccordionBar
                    course={course}
                    key={index}
                    isActive={isActive}
                    handleActive={handleActive}
                  />
                ))}
              </div>
            </div>

            {/* Course Level Comparison */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Course Level Comparison</h2>
              <div className="overflow-x-auto">
                <table className={`w-full ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  <thead>
                    <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <th className="py-4 px-6 text-left">Features</th>
                      {courseLevels.map((level, index) => (
                        <th key={index} className="py-4 px-6 text-left">{level.title}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="py-4 px-6">Price</td>
                      {courseLevels.map((level, index) => (
                        <td key={index} className="py-4 px-6">₹{level.price}</td>
                      ))}
                    </tr>
                    <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="py-4 px-6">Duration</td>
                      {courseLevels.map((level, index) => (
                        <td key={index} className="py-4 px-6">{level.duration}</td>
                      ))}
                    </tr>
                    <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="py-4 px-6">Lessons</td>
                      {courseLevels.map((level, index) => (
                        <td key={index} className="py-4 px-6">{level.lessons}</td>
                      ))}
                    </tr>
                    <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="py-4 px-6">Skill Level</td>
                      {courseLevels.map((level, index) => (
                        <td key={index} className="py-4 px-6">
                          {index === 0 && 'No experience needed'}
                          {index === 1 && 'Basic programming knowledge'}
                          {index === 2 && 'Experienced programmers'}
                          {index === 3 && 'Professional developers'}
                        </td>
                      ))}
                    </tr>
                    <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="py-4 px-6">Projects</td>
                      {courseLevels.map((level, index) => (
                        <td key={index} className="py-4 px-6">
                          {index === 0 && '3 small projects'}
                          {index === 1 && '5 medium projects'}
                          {index === 2 && '8 complex projects'}
                          {index === 3 && '10 industry-level projects'}
                        </td>
                      ))}
                    </tr>
                    <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="py-4 px-6">Support</td>
                      {courseLevels.map((level, index) => (
                        <td key={index} className="py-4 px-6">
                          {index === 0 && 'Forum access'}
                          {index === 1 && 'Forum + email support'}
                          {index === 2 && 'Forum + priority support'}
                          {index === 3 && '24/7 dedicated support'}
                        </td>
                      ))}
                    </tr>
                    <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="py-4 px-6">Career Benefits</td>
                      {courseLevels.map((level, index) => (
                        <td key={index} className="py-4 px-6">
                          {index === 0 && 'Basic portfolio projects'}
                          {index === 1 && 'Github portfolio setup'}
                          {index === 2 && 'Resume review & LinkedIn profile'}
                          {index === 3 && 'Job placement assistance'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Meet Your Educator Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Meet Your Educator</h2>
              <div className={`flex items-start gap-6 p-6 rounded-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <img
                  src={
                    Educator.image
                      ? Educator.image
                      : `https://api.dicebear.com/5.x/initials/svg?seed=${Educator.firstName} ${Educator.lastName}`
                  }
                  alt={`${Educator.firstName} ${Educator.lastName}`}
                  className="w-24 h-24 rounded-full"
                />
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    {Educator.firstName} {Educator.lastName}
                  </h3>
                  <p className="text-sm mb-2">{Educator?.additionalDetails?.designation}</p>
                  <p className="text-sm mb-4">{Educator?.additionalDetails?.experience} years of experience</p>
                  <p className="text-sm">{Educator?.additionalDetails?.about}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Course Cards */}
          <div className="lg:col-span-1">
            {courseLevels.map((level, index) => (
              <div
                key={index}
                className={`mb-4 rounded-lg p-6 ${
                  isDarkMode
                    ? 'bg-gray-800 hover:bg-gray-700'
                    : 'bg-white hover:bg-gray-50'
                } shadow-lg transition-all duration-300`}
              >
                <h3 className="text-xl font-bold mb-2">{level.title}</h3>
                <p className="text-sm mb-4">{level.subtitle}</p>
                <div className="mb-4">
                  <span className="text-3xl font-bold">₹{level.price}</span>
                  <span className="text-sm ml-2">INR</span>
                  <p className="text-sm mt-1">One-time payment</p>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Level: {level.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Duration: {level.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Videos: {level.lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Lifetime Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Access From Any Device</span>
                  </div>
                </div>
                <button
                  onClick={() => handleBuyCourse(level.price)}
                  className={`w-full py-2 rounded-md font-medium transition-colors ${
                    index === 0 ? 'bg-blue-600 hover:bg-blue-700' :
                    index === 1 ? 'bg-green-600 hover:bg-green-700' :
                    index === 2 ? 'bg-orange-600 hover:bg-orange-700' :
                    'bg-purple-600 hover:bg-purple-700'
                  } text-white`}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  )
}

export default CourseDetails