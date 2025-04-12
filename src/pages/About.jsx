import React from "react"
import { useTheme } from "../context/ThemeContext"

import FoundingStory from "../assets/Images/FoundingStory.png"
import BannerImage1 from "../assets/Images/aboutus1.webp"
import BannerImage2 from "../assets/Images/aboutus2.webp"
import BannerImage3 from "../assets/Images/aboutus3.webp"
// import Footer from "../components/common/Footer"
import ContactFormSection from "../components/core/AboutPage/ContactFormSection"
import LearningGrid from "../components/core/AboutPage/LearningGrid"
import Quote from "../components/core/AboutPage/Quote"
import StatsComponenet from "../components/core/AboutPage/Stats"
import HighlightText from "../components/core/HomePage/HighlightText"
import ReviewSlider from "../components/common/ReviewSlider"
import Footer from "../components/common/Footer"

const About = () => {
  const { isDarkMode } = useTheme()

  return (
    <div className={`w-full font-['Inter'] ${isDarkMode ? "bg-[#0F1624]" : "bg-white"}`}>
      <section>
        <div className={`mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-center ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          <header className="mx-auto py-20 lg:w-[70%]">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15]">
              Driving Innovation in Online Education for a
              <HighlightText text={"Brighter Future"} />
            </h1>
            <p className={`mx-auto mt-3 text-center text-base md:text-lg font-normal ${isDarkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed lg:w-[95%]`}>
              OmixLab is at the forefront of driving innovation in online
              education. We're passionate about creating a brighter future by
              offering cutting-edge courses, leveraging emerging technologies,
              and nurturing a vibrant learning community.
            </p>
          </header>
          <div className="flex justify-center items-center w-full gap-5 mb-10"> 
            <img src={BannerImage1} alt="" className="w-1/3 h-[300px] rounded-xl object-cover hover:scale-105 transition-transform duration-300" />
            <img src={BannerImage2} alt="" className="w-1/3 h-[300px] rounded-xl object-cover hover:scale-105 transition-transform duration-300" />
            <img src={BannerImage3} alt="" className="w-1/3 h-[300px] rounded-xl object-cover hover:scale-105 transition-transform duration-300" />
          </div>
        </div>
      </section>

      <section className={`border-b ${isDarkMode ? "border-[#00FFB2]/10" : "border-gray-300"}`}>
        <div className={`mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          <div className="h-[100px]"></div>
          <Quote />
        </div>
      </section>

      <section>
        <div className={`mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          <div className="flex flex-col items-center gap-10 lg:flex-row justify-between">
            <div className="my-24 flex lg:w-[50%] flex-col gap-10">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#00FFB2] lg:w-[70%]">
                Our Founding Story
              </h2>
              <p className={`text-base md:text-lg font-normal ${isDarkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed lg:w-[95%]`}>
                Our e-learning platform was born out of a shared vision and
                passion for transforming education. It all began with a group of
                educators, technologists, and lifelong learners who recognized
                the need for accessible, flexible, and high-quality learning
                opportunities in a rapidly evolving digital world.
              </p>
              <p className={`text-base md:text-lg font-normal ${isDarkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed lg:w-[95%]`}>
                As experienced educators ourselves, we witnessed firsthand the
                limitations and challenges of traditional education systems. We
                believed that education should not be confined to the walls of a
                classroom or restricted by geographical boundaries. We
                envisioned a platform that could bridge these gaps and empower
                individuals from all walks of life to unlock their full
                potential.
              </p>
            </div>

            <div>
              <img
                src={FoundingStory}
                alt=""
                className="rounded-xl hover:scale-105 transition-transform duration-300"
                width={470}
                height={278}
              />
            </div>
          </div>
          <div className="flex flex-col items-center lg:gap-10 lg:flex-row justify-between">
            <div className="my-24 flex lg:w-[40%] flex-col gap-10">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#00FFB2] lg:w-[70%]">
                Our Vision
              </h2>
              <p className={`text-base md:text-lg font-normal ${isDarkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed lg:w-[95%]`}>
                We are committed to transforming bioinformatics education through innovation. Our goal is to create an intuitive and dynamic e-learning platform that blends cutting-edge technology with engaging content. By fostering an interactive learning experience, we empower learners to explore, experiment, and excel in the world of bioinformatics.
              </p>
            </div>
            <div className="my-24 flex lg:w-[40%] flex-col gap-10">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#00FFB2] lg:w-[70%]">
                Our Mission
              </h2>
              <p className={`text-base md:text-lg font-normal ${isDarkMode ? "text-gray-300" : "text-gray-700"} leading-relaxed lg:w-[95%]`}>
                Our mission extends beyond providing online courses—we strive to build a thriving community of learners. We believe knowledge flourishes through collaboration and shared experiences. By fostering meaningful connections through forums, live sessions, and networking opportunities, we create an environment where individuals can engage, grow, and innovate together in the field of bioinformatics.
              </p>
            </div>
          </div>
        </div>
      </section>

      <StatsComponenet />
      
      <section className={`mx-auto mt-20 w-11/12 max-w-maxContent flex flex-col justify-between gap-10 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
        <LearningGrid />
        <div className="w-full flex justify-center">
          <div className={`w-full md:w-3/4 lg:w-2/3 p-8 rounded-xl border ${
            isDarkMode ? "border-[#00FFB2]/10" : "border-gray-300"
          }`}>
            <ContactFormSection />
          </div>
        </div>
      </section>

      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
        <Footer />
      </div>
    </div>
  )
}

export default About