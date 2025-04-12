import React from "react";
import CTAButton from "./Button";
import { TypeAnimation } from "react-type-animation";
import { FaArrowRight } from "react-icons/fa";
import { useTheme } from "../../../context/ThemeContext";

const CodeBlocks = ({
  position,
  heading,
  subheading,
  ctabtn1,
  ctabtn2,
  codeblock,
  backgroundGradient,
  codeColor,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`flex ${position} my-20 justify-between flex-col lg:gap-10 gap-10`}>
      {/* Section 1  */}
      <div className="w-full md:w-1/2 flex flex-col gap-6">
        {heading && (
          <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {heading}
          </h2>
        )}

        {/* Sub Heading */}
        <div className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} text-base md:text-lg leading-relaxed w-4/5 mt-[-0.75rem] font-normal`}>
          {subheading}
        </div>

        {/* Button Group */}
        <div className="flex gap-5 mt-5">
          <CTAButton active={ctabtn1.active} linkto={ctabtn1.link}>
            <div className="flex items-center gap-2 text-[15px] tracking-wide">
              {ctabtn1.btnText}
              <FaArrowRight />
            </div>
          </CTAButton>
          <CTAButton active={ctabtn2.active} linkto={ctabtn2.link}>
            <span className="text-[15px] tracking-wide">{ctabtn2.btnText}</span>
          </CTAButton>
        </div>
      </div>

      {/* Section 2  Code Block*/}
      <div className={`h-fit code-border flex flex-row py-3 text-sm md:text-base leading-relaxed ${
        isDarkMode 
          ? "bg-[#0F1624]/80 border border-white/10" 
          : "bg-[#F8FFFC] border border-[#00916E]/20"
      }`}>
        {backgroundGradient}
        {/* Indexing */}
        <div className={`w-1/10 flex flex-col text-center select-none ${isDarkMode ? "text-gray-500" : "text-gray-600"} font-mono font-medium`}>
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p>6</p>
          <p>7</p>
          <p>8</p>
          <p>9</p>
          <p>10</p>
          <p>11</p>
        </div>

        {/* Codes */}
        <div className={`w-[90%] flex flex-col gap-2 font-mono font-medium ${isDarkMode ? codeColor : "text-[#00916E]"} pr-1`}>
          <TypeAnimation
            sequence={[codeblock, 2000, ""]}
            cursor={true}
            repeat={Infinity}
            style={{
              whiteSpace: "pre-line",
              display: "block",
              fontFamily: "Menlo, Monaco, 'Courier New', monospace",
              fontSize: "inherit",
              lineHeight: "inherit",
            }}
            omitDeletionAnimation={true}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeBlocks;