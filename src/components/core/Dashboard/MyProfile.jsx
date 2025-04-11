import { RiEditBoxLine } from "react-icons/ri"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { formattedDate } from "../../../utils/dateFormatter"
import IconBtn from "../../common/IconBtn"

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()

  return (
    <>
      <h1 className="mb-14 text-3xl font-medium text-[rgb(244,244,245)]">
        My Profile
      </h1>
      <div className="flex items-center justify-between rounded-md border-[1px] border-[rgb(39,39,42)] bg-[rgb(24,24,27)] p-8 px-12">
        <div className="flex items-center gap-x-4">
          <img
            src={user?.image}
            alt={`profile-${user?.firstName}`}
            className="aspect-square w-[78px] rounded-full object-cover"
          />
          <div className="space-y-1">
            <p className="text-lg font-semibold text-[rgb(235,235,235)]">
              {user?.firstName + " " + user?.lastName}
            </p>
            <p className="text-sm text-[rgb(153,153,153)]">{user?.email}</p>
            {user?.subscriptionLevel && (
              <p className="text-sm mt-1">
                <span className="text-[#00FFB2]">Active Plan: </span>
                <span className="text-[rgb(235,235,235)]">{user?.subscriptionLevel}</span>
              </p>
            )}
          </div>
        </div>
        <IconBtn
          text="Edit"
          onclick={() => {
            navigate("/dashboard/settings")
          }}
        >
          <RiEditBoxLine />
        </IconBtn>
      </div>
      <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-[rgb(39,39,42)] bg-[rgb(24,24,27)] p-8 px-12">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-[rgb(235,235,235)]">About</p>
          <IconBtn
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings")
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <p
          className={`${
            user?.additionalDetails?.about
              ? "text-[rgb(235,235,235)]"
              : "text-[rgb(141,141,146)]"
          } text-sm font-medium`}
        >
          {user?.additionalDetails?.about ?? "Write Something About Yourself"}
        </p>
      </div>
      <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-[rgb(39,39,42)] bg-[rgb(24,24,27)] p-8 px-12">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-[rgb(235,235,235)]">
            Personal Details
          </p>
          <IconBtn
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings")
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <div className="flex max-w-[500px] justify-between">
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-[rgb(61,61,66)]">First Name</p>
              <p className="text-sm font-medium text-[rgb(235,235,235)]">//5
                {user?.firstName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-[rgb(61,61,66)]">Email</p>
              <p className="text-sm font-medium  text-[rgb(235,235,235)]">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-[rgb(61,61,66)]">Gender</p>
              <p className="text-sm font-medium  text-[rgb(235,235,235)]">
                {user?.additionalDetails?.gender ?? "Add Gender"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-[rgb(61,61,66)]">Last Name</p>
              <p className="text-sm font-medium  text-[rgb(235,235,235)]">
                {user?.lastName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-[rgb(61,61,66)]">Phone Number</p>
              <p className="text-sm font-medium  text-[rgb(235,235,235)]">
                {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-[rgb(61,61,66)]">Date Of Birth</p>
              <p className="text-sm font-medium  text-[rgb(235,235,235)]">
                {formattedDate(user?.additionalDetails?.dateOfBirth) ??
                  "Add Date Of Birth"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}