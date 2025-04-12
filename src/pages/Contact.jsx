import React from "react"
import { useTheme } from "../context/ThemeContext"

import Footer from "../components/common/Footer"
import ContactDetails from "../components/ContactPage/ContactDetails"
import ContactForm from "../components/ContactPage/ContactForm"
import ReviewSlider from "../components/common/ReviewSlider"

const Contact = () => {
  const { isDarkMode } = useTheme()

  return (
    <div className={`font-['Inter'] ${isDarkMode ? "bg-[#0F1624]" : "bg-white"}`}>
      <div className={`mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-5 ${isDarkMode ? "text-white" : "text-gray-900"} lg:flex-row`}>
        {/* Contact Details */}
        <div className="lg:w-[40%]">
          <ContactDetails />
        </div>

        {/* Contact Form */}
        <div className="lg:w-[60%]">
          <ContactForm />
        </div>
      </div>
      <div className={`relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 ${
        isDarkMode 
          ? "bg-[#0F1624] text-white" 
          : "bg-white text-gray-900"
      }`}>
        {/* Reviews from Other Learners */}
        <h1 className="text-center text-3xl md:text-4xl font-bold tracking-tight mt-8">
          Reviews from other learners
        </h1>
        <ReviewSlider />
      </div>
      <Footer />
    </div>
  )
}

export default Contact