import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";

const Button = ({ children, active, linkto }) => {
  const { isDarkMode } = useTheme();

  return (
    <Link to={linkto}>
      <div
        className={`text-center text-[15px] px-6 py-3 rounded-full font-medium tracking-wide transition-all duration-300 hover:scale-95 shadow-lg
          ${
            active 
              ? "bg-[#00FFB2] text-[#0A0F1C] hover:bg-[#00FFB2]/90 shadow-[#00FFB2]/20" 
              : isDarkMode
                ? "border-2 border-[#00FFB2] text-[#00FFB2] hover:bg-[#00FFB2]/10 shadow-[#00FFB2]/10"
                : "border-2 border-[#00916E] text-[#00916E] hover:bg-[#E5FFF7] shadow-[#00916E]/20"
          }`}
      >
        {children}
      </div>
    </Link>
  );
};

export default Button;