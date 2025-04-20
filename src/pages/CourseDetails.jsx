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
import { fetchCourseDetails, fetchRelatedCourseLevels } from "../services/operations/courseDetailsAPI.jsx"
import { buyCourse } from "../services/operations/studentFeaturesAPI"
import GetAvgRating from "../utils/avgRating"
import Error from "./Error"
import { toast } from "react-hot-toast"
import { useTheme } from "../context/ThemeContext"
import Chatbot from "../components/common/Chatbot"
import { logout } from "../services/operations/authAPI"

function CourseDetails() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.profile)
  const { paymentLoading } = useSelector((state) => state.course)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isDarkMode } = useTheme()

  // Add loading state
  const [isLoading, setIsLoading] = useState(true)

  // Getting courseId from url parameter
  const { courseId } = useParams()

  // State for selected course level
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [availableLevels, setAvailableLevels] = useState([])
  const [courseLevels, setCourseLevels] = useState([])
  const [response, setResponse] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)

  // Default level descriptions and features
  const defaultLevelData = {
    "Beginner": {
      subtitle: "Perfect for those just starting out",
      features: [
        "Basic Python syntax and data types",
        "Control flow and functions",
        "Simple data structures",
        "Basic file handling",
        "Certificate of completion"
      ]
    },
    "Intermediate": {
      subtitle: "For those with basic Python knowledge",
      features: [
        "Object-oriented programming",
        "Advanced data structures",
        "Error handling and debugging",
        "Basic algorithms",
        "Project-based learning",
        "Certificate of completion"
      ]
    },
    "Advanced": {
      subtitle: "For experienced Python developers",
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
    "Expert": {
      subtitle: "Master Python programming",
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
  };

  // Add this helper function near the top of the component
  const getLevelPrice = (level) => {
    const prices = {
      "Beginner": 499,
      "Intermediate": 999,
      "Advanced": 1499,
      "Expert": 2499
    };
    return prices[level] || 499;
  };

  // Add this helper function at the top of the component
  const getLevelInfo = (level, courseName) => {
    const info = {
      "Beginner": {
        description: `Perfect for those with no prior ${courseName} experience. Learn fundamentals, basic syntax, and start building simple applications.`,
        duration: "20hr 30m",
        lessons: "28 Lessons"
      },
      "Intermediate": {
        description: `For those with basic ${courseName} knowledge. Deepen your skills and learn more advanced concepts.`,
        duration: "35hr 45m",
        lessons: "42 Lessons"
      },
      "Advanced": {
        description: `For experienced programmers. Master complex ${courseName} concepts and build sophisticated applications.`,
        duration: "60hr 40m",
        lessons: "84 Lessons"
      },
      "Expert": {
        description: `For professional developers seeking mastery. Focus on specialized domains and cutting-edge ${courseName} applications.`,
        duration: "90hr 20m",
        lessons: "120 Lessons"
      }
    };
    return info[level] || info["Beginner"];
  };

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true)
      try {
        const courseData = await fetchCourseDetails(courseId)
        setResponse(courseData)
        
        if (courseData?.data?.courseDetails) {
          const courseDetails = courseData.data.courseDetails
          
          // Fetch related levels
          const relatedLevels = await fetchRelatedCourseLevels(
            courseDetails.courseName,
            courseDetails.Educator._id,
            courseId,
            token
          )

          // Combine and sort all levels
          const allLevels = [...relatedLevels]
          
          // Add current course if not already included
          if (!allLevels.find(level => level._id === courseDetails._id)) {
            allLevels.push({
              ...courseDetails,
              features: courseDetails.features || []
            })
          }

          // Sort by level difficulty
          allLevels.sort((a, b) => {
            const order = { "Beginner": 0, "Intermediate": 1, "Advanced": 2, "Expert": 3 }
            return order[a.level] - order[b.level]
          })
          
          setAvailableLevels(allLevels)
          
          // Create course level data with default descriptions and features
          const formattedLevels = allLevels.map((course) => ({
            title: course.level,
            subtitle: defaultLevelData[course.level]?.subtitle || `${course.courseName} - ${course.level} Level`,
            price: getLevelPrice(course.level),
            duration: course.duration || "8 weeks",
            lessons: course.courseContent?.reduce((total, section) => 
              total + (section.subSection?.length || 0), 0) || 0,
            features: course.features || 
              (course.whatYouWillLearn ? 
                typeof course.whatYouWillLearn === 'string' ? 
                  course.whatYouWillLearn.split(',').map(item => item.trim()) :
                  course.whatYouWillLearn :
                defaultLevelData[course.level]?.features || []),
            _id: course._id,
            courseContent: course.courseContent || [],
            thumbnail: course.thumbnail,
            Educator: course.Educator,
            ratingAndReviews: course.ratingAndReviews || [],
            level: course.level
          }))
          
          setCourseLevels(formattedLevels)
          
          // Find index of current course
          const currentIndex = allLevels.findIndex(course => course._id === courseId)
          setSelectedLevel(currentIndex !== -1 ? currentIndex : 0)
        }
      } catch (error) {
        console.error("Error fetching course details:", error)
        toast.error("Error loading course details")
      } finally {
        setIsLoading(false)
      }
    }

    if (courseId) {
      fetchDetails()
    }
  }, [courseId, token])

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

  if (isLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }
  if (!response) {
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

  const handleBuyCourse = async () => {
    if (!user) {
      toast.error("Please login to purchase the course");
      navigate("/login");
      return;
    }

    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (selectedLevel === null || !courseLevels[selectedLevel]) {
      toast.error("Please select a course level");
      return;
    }

    try {
      const selectedCourseLevel = courseLevels[selectedLevel];
      
      // Validate the selected level
      if (!selectedCourseLevel.level || !['Beginner', 'Intermediate', 'Advanced', 'Expert'].includes(selectedCourseLevel.level)) {
        throw new Error("Invalid course level selected");
      }

      // Validate course ID
      if (!selectedCourseLevel._id) {
        throw new Error("Invalid course selected");
      }

      // Validate price
      if (!selectedCourseLevel.price || selectedCourseLevel.price <= 0) {
        throw new Error("Invalid course price");
      }

      // Check if user already has access to this level
      if (user.subscriptionLevel) {
        const levelValues = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 };
        if (levelValues[user.subscriptionLevel] >= levelValues[selectedCourseLevel.level]) {
          toast.error("You already have access to this course level");
          return;
        }
      }

      console.log("Initiating purchase for:", {
        courseId: selectedCourseLevel._id,
        level: selectedCourseLevel.level,
        price: selectedCourseLevel.price
      });
      
      // Ensure we're using the correct course ID and level
      const courseId = selectedCourseLevel._id || course_id;
      const level = selectedCourseLevel.level;
      
      await buyCourse(
        token, 
        [courseId],
        user, 
        navigate, 
        dispatch, 
        selectedCourseLevel.price,
        level // Pass the level explicitly
      );
    } catch (error) {
      console.error("Error in handleBuyCourse:", error);
      toast.error(error.message || "Failed to process purchase. Please try again.");
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
            <span>{courseName}</span>
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
            <div className="mb-8 relative w-full aspect-video rounded-lg overflow-hidden">
              {response?.data?.courseDetails?.introVideo ? (
                    <Player 
                      playsInline 
                  poster={thumbnail}
                  src={response.data.courseDetails.introVideo}
                  className="rounded-lg w-full h-full object-cover"
                  fluid={true}
                  aspectRatio="auto"
                    >
                      <BigPlayButton position="center" />
                    </Player>
              ) : (
                <div className={`w-full h-full flex items-center justify-center ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <p className="text-center">
                    <BiInfoCircle className="w-8 h-8 mx-auto mb-2" />
                    No preview video available
                  </p>
                </div>
              )}
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

            {/* Course Requirements Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Course Requirements</h2>
              <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <ul className="list-disc pl-6 space-y-3">
                  <li>Basic understanding of computer operations</li>
                  <li>No prior programming experience needed for beginner level</li>
                  <li>A computer with internet connection</li>
                  <li>Willingness to learn and practice</li>
                </ul>
              </div>
            </div>

            {/* Course Benefits Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Course Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <h3 className="text-xl font-semibold mb-4">Career Opportunities</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-1" />
                      <span>Industry-recognized certification</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-1" />
                      <span>Portfolio-ready projects</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-1" />
                      <span>Job placement assistance</span>
                    </li>
                  </ul>
                </div>
                <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <h3 className="text-xl font-semibold mb-4">Learning Support</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-1" />
                      <span>24/7 Discord community access</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-1" />
                      <span>Weekly live Q&A sessions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-1" />
                      <span>1-on-1 mentoring sessions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Choose Your Skill Level Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Choose Your Skill Level</h2>
              <p className="text-lg mb-8">
                Select the appropriate skill level to accelerate your Python journey. Each tier builds upon the previous one, allowing you to progress at your own pace.
              </p>

              {/* Skill Level Navigation */}
              <div className={`flex mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg overflow-hidden`}>
                {!loading && availableLevels.length > 0 && (
                  availableLevels.map((level, index) => (
                    <button
                      key={level._id}
                      onClick={() => setSelectedLevel(index)}
                      className={`flex-1 py-3 px-4 text-center transition-colors ${
                        index === selectedLevel
                          ? isDarkMode ? 'bg-gray-700 shadow-md' : 'bg-white shadow-md'
                          : isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                      }`}
                    >
                      {level.level || level.title}
                    </button>
                  ))
                )}
              </div>

              {/* Course Level Details */}
              {!loading && availableLevels.length > 0 && selectedLevel !== null && availableLevels[selectedLevel] && (
                <div className={`grid md:grid-cols-2 gap-8 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'} rounded-lg p-8 mb-8`}>
                  {/* Left Column - Course Details */}
                  <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
                    <h3 className="text-2xl font-bold mb-2">
                      {`${courseName} ${availableLevels[selectedLevel]?.level} Level`}
                    </h3>
                    <p className="text-lg mb-6">
                      {getLevelInfo(availableLevels[selectedLevel]?.level, courseName).description}
                    </p>
                    <div className="flex items-center gap-8 mb-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                        <p className="font-semibold">
                          {getLevelInfo(availableLevels[selectedLevel]?.level, courseName).duration}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Lessons</p>
                        <p className="font-semibold">
                          {getLevelInfo(availableLevels[selectedLevel]?.level, courseName).lessons}
                        </p>
                      </div>
                    </div>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm ${
                      availableLevels[selectedLevel]?.level === "Beginner" ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                      availableLevels[selectedLevel]?.level === "Intermediate" ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                      availableLevels[selectedLevel]?.level === "Advanced" ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
                      'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                    }`}>
                      {availableLevels[selectedLevel]?.level}
                    </div>
                  </div>

                  {/* Right Column - Course Preview */}
                  <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
                    <div className="mb-6">
                      <h4 className="text-xl font-semibold mb-4">What you'll get</h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">HD Video Lessons</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Clear and concise explanations</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Hands-on Projects</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Build real-world applications</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Course Resources</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Code samples and materials</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Certificate</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Upon course completion</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleBuyCourse}
                      className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                        availableLevels[selectedLevel]?.level === "Beginner" ? 'bg-blue-600 hover:bg-blue-700' :
                        availableLevels[selectedLevel]?.level === "Intermediate" ? 'bg-green-600 hover:bg-green-700' :
                        availableLevels[selectedLevel]?.level === "Advanced" ? 'bg-orange-600 hover:bg-orange-700' :
                        'bg-purple-600 hover:bg-purple-700'
                      }`}
                    >
                      Enroll Now - ₹{getLevelPrice(availableLevels[selectedLevel]?.level)}
                    </button>
                  </div>
                </div>
              )}
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
              <div className={`flex flex-col md:flex-row items-start gap-6 p-6 rounded-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <div className="flex-shrink-0">
                <img
                  src={
                    Educator.image
                      ? Educator.image
                      : `https://api.dicebear.com/5.x/initials/svg?seed=${Educator.firstName} ${Educator.lastName}`
                  }
                    alt={`${Educator.firstName} ${Educator.lastName}`}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold mb-2">
                    {Educator.firstName} {Educator.lastName}
                  </h3>
                  <p className="text-sm mb-2">{Educator?.additionalDetails?.designation || "Course Instructor"}</p>
                  <p className="text-sm mb-4">{Educator?.additionalDetails?.experience || "5+"} years of experience</p>
                  <p className="text-sm">{Educator?.additionalDetails?.about || "Experienced educator passionate about teaching and helping students achieve their learning goals."}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {Educator?.additionalDetails?.expertise?.map((skill, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${
                          isDarkMode 
                            ? 'bg-gray-700 text-gray-300' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {skill}
                      </span>
                    )) || (
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        isDarkMode 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {courseName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            {/* FAQ Section */}
            <div className={`sticky top-4 space-y-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h3 className="text-lg font-semibold mb-2">How long do I have access to the course?</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      You get lifetime access to the course content, including all future updates.
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h3 className="text-lg font-semibold mb-2">Is there a certificate upon completion?</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      Yes, you'll receive a certificate of completion after finishing the course.
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <h3 className="text-lg font-semibold mb-2">What if I'm not satisfied with the course?</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      We offer a 30-day money-back guarantee if you're not satisfied with the course.
                    </p>
                  </div>
                </div>
              </div>

              {/* Chatbot Component */}
              <Chatbot />
            </div>
          </div>
        </div>

        {/* Student Testimonials Section */}
        <div className="mt-16 mb-12">
          <h2 className="text-2xl font-bold mb-8">What Our Students Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ratingAndReviews?.slice(0, 3).map((review, index) => (
              <div key={index} className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={review?.user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`}
                    alt={review?.user?.firstName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{review?.user?.firstName} {review?.user?.lastName}</h4>
                    <div className="flex items-center">
                      <RatingStars Review_Count={review?.rating} />
                    </div>
                  </div>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {review?.review || "This course has been incredibly helpful in advancing my programming skills."}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Course Highlights Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Course Highlights</h2>
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Comprehensive Curriculum</h3>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Structured learning path with practical examples and real-world applications
              </p>
            </div>

            <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Industry Recognition</h3>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Certificate recognized by top companies and industry experts
              </p>
            </div>
            
            <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'}`}>
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Community Support</h3>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Join a thriving community of learners and industry professionals
              </p>
            </div>
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