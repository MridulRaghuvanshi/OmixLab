import React from "react";

export const HighlightText = ({ text }) => {
  return (
    <span className="relative font-semibold px-3 py-1
bg-gradient-to-r from-indigo-500 via-sky-400 to-lime-400
text-transparent bg-clip-text transition-all duration-500 ease-in-out
before:content-[''] before:absolute before:-inset-0.5 before:bg-gray-400/20 
before:blur-md before:rounded-md before:opacity-50 
hover:before:scale-110 hover:before:opacity-70 
hover:rotate-[1deg] hover:scale-105 
after:content-[''] after:absolute after:inset-0 after:rounded-md 
after:shadow-[0_4px_12px_rgba(0,0,0,0.06)] 
hover:after:shadow-[0_8px_20px_rgba(0,0,0,0.12)] 
hover:translate-y-[-2px] hover:translate-x-[1px] 
active:scale-95
after:transition-all after:duration-500
hover:after:animate-pulse
">
      {text}
    </span>
  );
};

export default HighlightText;
