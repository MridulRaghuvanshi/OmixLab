import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"

import IconBtn from "../../../common/IconBtn"
import { buyCourse } from "../../../../services/operations/studentFeaturesAPI"

export default function RenderTotalAmount() {
  const { total, cart } = useSelector((state) => state.cart)
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleBuyCourse = () => {
    if (user?.accountType === "Educator") {
      toast.error("As an educator, you cannot purchase courses. You can only create and manage courses.");
      return;
    }

    const courses = cart.map((course) => course._id);
    buyCourse(token, courses, user, navigate, dispatch, total);
  }
  
  return (
    <div className="min-w-[280px] rounded-md border-[1px] border-[rgb(39,39,42)] bg-[rgb(24,24,27)] p-6">
      <p className="mb-1 text-sm font-medium text-[rgb(203,213,225)]">Total:</p>
      <p className="mb-6 text-3xl font-medium text-yellow-100">₹ {total}</p>
      <IconBtn
        text="Buy Now"
        onclick={handleBuyCourse}
        customClasses="w-full justify-center"
      />
    </div>
  )
}