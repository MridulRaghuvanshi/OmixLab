import React from "react"
import copy from "copy-to-clipboard"
import { toast } from "react-hot-toast"
import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { useTheme } from "../../../context/ThemeContext"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import { addToCart } from "../../../slices/cartSlice"

function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
  const { isDarkMode } = useTheme()
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    thumbnail: ThumbnailImage,
    price: CurrentPrice,
    _id: courseId,
  } = course

  const handleShare = () => {
    copy(window.location.href)
    toast.success("Link copied to clipboard")
  }

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }
    if (token) {
      dispatch(addToCart(course))
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add To Cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  // console.log("Student already enrolled ", course?.studentsEnroled, user?._id)

  return (
    <>
      <div
        className={`flex flex-col gap-4 rounded-md p-4 ${
          isDarkMode ? "bg-[#1C1F2E]" : "bg-white"
        }`}
      >
        {/* Course Image */}
        <img
          src={ThumbnailImage}
          alt={course?.courseName}
          className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
        />

        <div className="px-4">
          <div className="space-x-3 pb-4 text-3xl font-semibold">
            <span className="text-[#00FFB2]">₹ {CurrentPrice}</span>
          </div>
          <div className="flex flex-col gap-4">
            {/* Buy Plan Button */}
            <Link to="/pricing" className="w-full">
              <button
                className="w-full rounded-md bg-[#00FFB2] px-6 py-3 text-center text-[#0A0F1C] font-semibold hover:bg-[#00FFB2]/90"
              >
                Buy Plan
              </button>
            </Link>
            <p className={`text-center text-sm ${
              isDarkMode ? "text-[#00FFB2]" : "text-[#008C62]"
            }`}>
              Save up to 70% with our subscription plans!
            </p>

            {/* Buy Now Button */}
            <button
              onClick={handleBuyCourse}
              className={`w-full rounded-md border px-6 py-3 text-center font-semibold ${
                isDarkMode
                  ? "border-white/10 text-white hover:bg-white/5"
                  : "border-gray-300 text-gray-900 hover:bg-gray-100"
              }`}
            >
              Buy Now
            </button>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`w-full rounded-md border px-6 py-3 text-center font-semibold ${
                isDarkMode
                  ? "border-white/10 text-white hover:bg-white/5"
                  : "border-gray-300 text-gray-900 hover:bg-gray-100"
              }`}
            >
              Add to Cart
            </button>
          </div>
          <div>
            <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
              30-Day Money-Back Guarantee
            </p>
          </div>

          <div className={`flex flex-col gap-3 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            <p className="text-xl font-semibold">This Course Includes:</p>
            <div className="flex gap-2">
              <span>
                <i className="fas fa-video"></i>
              </span>
              <span>8 hours on-demand video</span>
            </div>
            <div className="flex gap-2">
              <span>
                <i className="fas fa-file"></i>
              </span>
              <span>Full Lifetime access</span>
            </div>
            <div className="flex gap-2">
              <span>
                <i className="fas fa-mobile-alt"></i>
              </span>
              <span>Access on Mobile and TV</span>
            </div>
            <div className="flex gap-2">
              <span>
                <i className="fas fa-certificate"></i>
              </span>
              <span>Certificate of completion</span>
            </div>
          </div>
          <div className="text-center">
            <button
              className={`mx-auto flex items-center gap-2 py-6 text-[#00FFB2] ${
                isDarkMode ? "hover:text-[#00FFB2]/90" : "hover:text-[#00FFB2]/90"
              }`}
              onClick={handleShare}
            >
              <i className="fas fa-share"></i>
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseDetailsCard