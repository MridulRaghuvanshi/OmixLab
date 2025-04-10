// Icons Import
import { FaArrowRight } from "react-icons/fa"
import { Link } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"

// Image and Video Import
import Banner from "../assets/Images/banner.mp4"
// Component Imports
import Footer from "../components/common/Footer"
import ReviewSlider from "../components/common/ReviewSlider"
import CTAButton from "../components/core/HomePage/Button"
import CodeBlocks from "../components/core/HomePage/CodeBlocks"
import ExploreMore from "../components/core/HomePage/ExploreMore"
import HighlightText from "../components/core/HomePage/HighlightText"
import EducatorSection from "../components/core/HomePage/EducatorSection"
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection"
import TimelineSection from "../components/core/HomePage/TimelineSection"

function Home() {
  const { isDarkMode } = useTheme()

  return (
    <div className={`${isDarkMode ? "bg-[#0F1624]" : "bg-white"} font-['Inter'] min-h-screen`}>
      {/* Hero Section */}
      <div className="relative mx-auto w-11/12 max-w-maxContent">
        {/* Navigation Bar - Keep your existing navigation */}
        
        {/* Hero Content */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-20">
          {/* Left Side - Text Content */}
          <div className="flex-1 max-w-2xl">
            {/* Become an Educator Button */}
            <Link to={"/signup"}>
              <div className={`group mb-8 w-fit rounded-full ${
                isDarkMode ? "bg-[#1F1B4A]" : "bg-[#E5FFF7]"
              } p-1 font-medium shadow-lg transition-all duration-300 hover:scale-95`}>
                <div className={`flex flex-row items-center gap-2 rounded-full px-6 py-2 transition-all duration-300 ${
                  isDarkMode ? "group-hover:bg-[#2A2665] text-white" : "group-hover:bg-[#CCF4E6] text-gray-900"
                }`}>
                  <p className="text-sm font-medium">Become an Educator</p>
                  <FaArrowRight className={`${isDarkMode ? "text-[#00FFB2]" : "text-[#00916E]"} text-sm`} />
                </div>
              </div>
            </Link>

            {/* Main Heading */}
            <h1 className={`text-5xl lg:text-6xl font-bold leading-[1.15] mb-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>
              Empower Your Future with{" "}
              <span className="bg-gradient-to-r from-[#4776E6] via-[#8E54E9] to-[#4776E6] bg-clip-text text-transparent">
                R programming
              </span>
            </h1>

            {/* Description */}
            <p className={`text-lg mb-8 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              With our comprehensive online courses, you can learn at your own pace, wherever you are. 
              Gain access to extensive resources including practical projects, engaging quizzes, and 
              tailored feedback from seasoned educators.
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <CTAButton active={true} linkto={"/signup"}>
                <span className="flex items-center gap-2">
                  Learn More
                  <FaArrowRight />
                </span>
              </CTAButton>
              <CTAButton active={false} linkto={"/login"}>
                Book a Demo
              </CTAButton>
            </div>
          </div>

          {/* Right Side - Video in Phone Frame */}
          <div className="flex-1 flex justify-center items-center">
            {/* Phone Container */}
            <div className="relative">
              {/* Background Phone */}
              <div className="absolute right-4 top-4 w-[280px] h-[580px] bg-black rounded-[3rem] border-[8px] border-gray-800 shadow-xl overflow-hidden opacity-50 rotate-6">
                {/* Phone Notch */}
                <div className="absolute top-0 inset-x-0 h-6 bg-black rounded-b-3xl">
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-gray-800 rounded-full"></div>
                </div>
                {/* Video Container */}
                <video
                  className="w-full h-full object-cover scale-[1.02]"
                  muted
                  loop
                  autoPlay
                  playsInline
                >
                  <source src={Banner} type="video/mp4" />
                </video>
              </div>

              {/* Foreground Phone */}
              <div className="relative w-[280px] h-[580px] bg-black rounded-[3rem] border-[8px] border-gray-800 shadow-2xl overflow-hidden -rotate-3">
                {/* Phone Notch */}
                <div className="absolute top-0 inset-x-0 h-6 bg-black rounded-b-3xl z-10">
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-gray-800 rounded-full"></div>
                </div>
                {/* Video Container */}
                <video
                  className="w-full h-full object-cover scale-[1.02]"
                  muted
                  loop
                  autoPlay
                  playsInline
                >
                  <source src={Banner} type="video/mp4" />
                </video>
                {/* Phone Button */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gray-800 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1 */}
      <div className={`relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
        {/* Code Section 1 */}
        <div className="w-full">
          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className="text-3xl md:text-4xl font-bold tracking-tight">
                Unlock your
                <HighlightText text={"coding potential"} /> with our online
                courses
              </div>
            }
            subheading={
              "Learn from seasoned industry experts who bring real-world experience and a deep passion for teaching. Our interactive courses equip you with the skills to innovate and grow in the field of bioinformatics."
            }
            ctabtn1={{
              btnText: "Try it Yourself",
              link: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              link: "/signup",
              active: false,
            }}
            codeColor={"text-[#00FFB2]"}
            codeblock={`SELECT FROM genes g
LEFT JOIN proteins p ON g.gene_id = p.gene_id
LEFT JOIN gene_disease gd ON g.gene_id = gd.gene_id
LEFT JOIN diseases d ON gd.disease_id = d.disease_id
WHERE g.organism = 'Homo sapiens'
    AND g.chromosome = '17'
    AND g.start_position BETWEEN 40000000 AND 50000000
    AND g.gene_type = 'protein_coding';`}
            backgroundGradient={<div></div>}
          />
        </div>

        {/* Code Section 2 */}
        <div className="w-full">
          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className="w-[100%] text-3xl md:text-4xl font-bold tracking-tight lg:w-[50%]">
                Start
                <HighlightText text={"coding in seconds"} />
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={{
              btnText: "Continue Lesson",
              link: "/signup",
              active: true,
            }}
            ctabtn2={{
              btnText: "Learn More",
              link: "/signup",
              active: false,
            }}
            codeColor={"text-[#00FFB2]"}
            codeblock={`import React from "react";
import CTAButton from "./Button";
import TypeAnimation from "react-type";
import { FaArrowRight } from "react-icons/fa";

const Home = () => {
  return (
    <div>Home</div>
  )
}
export default Home;`}
            backgroundGradient={<div></div>}
          />
        </div>

        {/* Explore Section */}
        <ExploreMore />
      </div>

      {/* Section 2 */}
      <div className={`${isDarkMode ? "bg-[#1F1B4A]" : "bg-[#E5FFF7]"} ${isDarkMode ? "text-white" : "text-gray-900"} py-16`}>
        <div className={`homepage_bg h-[320px] ${!isDarkMode && "opacity-90"}`}>
          {/* Explore Full Category Section */}
          <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
            <div className="lg:h-[150px]"></div>
            <div className="flex flex-row gap-6 lg:mt-8">
              <CTAButton active={true} linkto={"/signup"}>
                <div className="flex items-center gap-2">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTAButton>
              <CTAButton active={false} linkto={"/login"}>
                Learn More
              </CTAButton>
            </div>
          </div>
        </div>

        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
          {/* Job that is in Demand - Section 1 */}
          <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
            <div className="text-3xl md:text-4xl font-bold tracking-tight lg:w-[45%]">
              Get the skills you need for a{" "}
              <HighlightText text={"job that is in demand."} />
            </div>
            <div className="flex flex-col items-start gap-10 lg:w-[40%]">
              <div className={`text-base md:text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"} leading-relaxed font-normal`}>
                OmixLab Shapes the Future.
                Success today isn't just about skills; it's about staying ahead with knowledge, adaptability, and innovation.
              </div>
              <CTAButton active={true} linkto={"/signup"}>
                <div className="flex items-center gap-2 text-[15px] tracking-wide">
                  Learn More
                  <FaArrowRight />
                </div>
              </CTAButton>
            </div>
          </div>

          {/* Timeline Section - Section 2 */}
          <TimelineSection />

          {/* Learning Language Section - Section 3 */}
          <LearningLanguageSection />
        </div>
      </div>

      {/* Section 3 */}
      <div className={`relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 ${
        isDarkMode 
          ? "bg-[#0F1624] text-white" 
          : "bg-white text-gray-900 shadow-lg border border-gray-100"
      }`}>
        {/* Become a Educator section */}
        <EducatorSection />

        {/* Reviews from Other Learners */}
        <ReviewSlider />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home