import React from "react";
import { useTheme } from "../../../context/ThemeContext";

const Stats = [
  { count: "5K", label: "Active Students" },
  { count: "10+", label: "Mentors" },
  { count: "200+", label: "Courses" },
  { count: "50+", label: "Awards" },
];

const StatsComponenet = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`${isDarkMode ? "bg-[rgb(39,39,42)]" : "bg-[#E5FFF7]"}`}>
      {/* Stats */}
      <div className={`flex flex-col gap-10 justify-between w-11/12 max-w-maxContent mx-auto ${isDarkMode ? "text-white" : "text-gray-900"}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 text-center">
          {Stats.map((data, index) => {
            return (
              <div className="flex flex-col py-10" key={index}>
                <h2 className={`text-3xl md:text-4xl font-bold tracking-tight ${
                  isDarkMode ? "text-[rgb(244,244,245)]" : "text-gray-900"
                }`}>
                  {data.count}
                </h2>
                <p className={`text-base md:text-lg font-medium mt-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                  {data.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatsComponenet;