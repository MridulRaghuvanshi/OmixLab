import React from "react"
import * as Icon1 from "react-icons/bi"
import * as Icon3 from "react-icons/hi2"
import * as Icon2 from "react-icons/io5"
import { useTheme } from "../../context/ThemeContext"

const contactDetails = [
  {
    icon: "HiChatBubbleLeftRight",
    heading: "Chat on us",
    description: "Our friendly team is here to help.",
    details: "info@OmixLab.com",
  },
  {
    icon: "BiWorld",
    heading: "Visit us",
    description: "Come and say hello at our office HQ.",
    details:
      "Level 3, Augusta Point, Golf Course Road, Parsvnath Exotica, DLF Phase 5, Sector 53, Gurugram, Haryana 122002 ",
  },
  {
    icon: "IoCall",
    heading: "Call us",
    description: "Mon - Fri From 8am to 5pm",
    details: "+91 972 884 5669",
  },
]

const ContactDetails = () => {
  const { isDarkMode } = useTheme()

  return (
    <div className={`flex flex-col gap-6 rounded-xl p-4 lg:p-6 ${
      isDarkMode 
        ? "bg-[rgb(26,26,30)]" 
        : "bg-[#E5FFF7]"
    }`}>
      {contactDetails.map((ele, i) => {
        let Icon = Icon1[ele.icon] || Icon2[ele.icon] || Icon3[ele.icon]
        return (
          <div
            className={`flex flex-col gap-[2px] p-3 ${
              isDarkMode 
                ? "text-[rgb(169,169,174)]" 
                : "text-gray-600"
            }`}
            key={i}
          >
            <div className="flex flex-row items-center gap-3">
              <Icon size={25} className={isDarkMode ? "text-white" : "text-gray-900"} />
              <h2 className={`text-lg font-semibold ${
                isDarkMode 
                  ? "text-[rgb(245,245,245)]" 
                  : "text-gray-900"
              }`}>
                {ele?.heading}
              </h2>
            </div>
            <p className="text-base font-normal leading-relaxed">{ele?.description}</p>
            <p className="text-base font-medium mt-1">{ele?.details}</p>
          </div>
        )
      })}
    </div>
  )
}

export default ContactDetails