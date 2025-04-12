import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-hot-toast"

import IconBtn from "../../../common/IconBtn"
import { useTheme } from "../../../../context/ThemeContext"
import { buyCourse } from "../../../../services/operations/studentFeaturesAPI"

export default function RenderTotalAmount() {
  const { total, cart } = useSelector((state) => state.cart)
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isDarkMode } = useTheme()

  const handleBuyCourse = () => {
    if (user?.accountType === "Educator") {
      toast.error("As an educator, you cannot purchase courses. You can only create and manage courses.");
      return;
    }
    const courses = cart.map((course) => course._id);
    buyCourse(token, courses, user, navigate, dispatch, total);
  }

  return (
    <div className={`min-w-[280px] rounded-md border-[1px] p-6 ${
      isDarkMode 
        ? "border-white/10 bg-[#1C1F2E]" 
        : "border-gray-200 bg-white"
    }`}>
      <p className={`mb-1 text-sm font-medium ${
        isDarkMode ? "text-gray-300" : "text-gray-600"
      }`}>Total:</p>
      <p className="mb-6 text-3xl font-medium text-[#00FFB2]">₹ {total}</p>
      
      {/* Buy Plan Button */}
      <Link to="/pricing" className="w-full mb-3 block">
        <IconBtn
          text="Buy Plan"
          customClasses="w-full justify-center bg-[#00FFB2] text-[#0A0F1C] hover:bg-[#00FFB2]/90"
        />
      </Link>
      <p className={`text-center text-sm ${
        isDarkMode ? "text-[#00FFB2]" : "text-[#008C62]"
      } mb-4`}>
        Save up to 70% with our subscription plans!
      </p>

      {/* Buy Now Button */}
      <IconBtn
        text="Buy Now"
        onclick={handleBuyCourse}
        customClasses={`w-full justify-center ${
          isDarkMode 
            ? "border border-white/10 text-white hover:bg-white/5" 
            : "border border-gray-300 text-gray-900 hover:bg-gray-100"
        }`}
      />
      
      <p className={`mt-4 text-center text-sm ${
        isDarkMode ? "text-gray-400" : "text-gray-600"
      }`}>
        30-Day Money-Back Guarantee
      </p>
    </div>
  )
}