import React from 'react'
import { useTheme } from '../../../context/ThemeContext'
import HighlightText from '../HomePage/HighlightText'

const Quote = () => {
  const { isDarkMode } = useTheme()

  return (
    <div className={`text-xl md:text-3xl lg:text-4xl font-bold tracking-tight mx-auto py-5 pb-20 text-center ${isDarkMode ? "text-white" : "text-gray-900"} leading-[1.15]`}>
      We are passionate about revolutionizing the way we learn. Our
      innovative platform <HighlightText text={"combines technology"} />,{" "}
      <span className="bg-gradient-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text">
        {" "}
        expertise
      </span>
      , and community to create an
      <span className="bg-gradient-to-b from-[#E65C00] to-[#F9D423] text-transparent bg-clip-text">
        {" "}
        unparalleled educational
        experience.
      </span> 
    </div>
  )
}

export default Quote