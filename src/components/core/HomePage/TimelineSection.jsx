import React from "react";
import TimeLineImage from "../../../assets/Images/TimelineImage.png";
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg";

const TimeLine = [
    {
      Logo: Logo1,
      Heading: "Leadership",
      Description: "Fully committed to the success company",
    },
    {
      Logo: Logo2,
      Heading: "Responsibility",
      Description: "Students will always be our top priority",
    },
    {
      Logo: Logo3,
      Heading: "Flexibility",
      Description: "The ability to switch is an important skills",
    },
    {
      Logo: Logo4,
      Heading: "Solve the problem",
      Description: "Code your way to a solution",
    },
  ];


const TimelineSection = () => {
  return (
    <div>
      <div className="lg:w-[80%] flex flex-col lg:flex-row gap-16 lg:gap-24 items-center py-20 px-10 lg:px-24 bg-gray-100 mx-auto">
        <div className="lg:w-[45%] flex flex-col gap-10 lg:gap-6">
          {TimeLine.map((ele, i) => {
            return (
              <div className="flex flex-col lg:gap-4" key={i}>
                <div className="flex gap-6 items-center" key={i}>
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md shadow-gray-300">
                    <img src={ele.Logo} alt={ele.Heading} className="w-12 h-12" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{ele.Heading}</h2>
                    <p className="text-gray-700 text-base">{ele.Description}</p>
                  </div>
                </div>
                <div
                  className={`hidden ${
                    TimeLine.length - 1 === i ? "hidden" : "lg:block"
                  }   border-dotted border-r border-[rgb(245,245,245)] bg-[rgb(63,63,63)] w-[26px]`}
                ></div>
              </div>
            );
          })}
        </div>
        <div className="relative w-full lg:w-auto h-fit shadow-lg shadow-gray-500 rounded-2xl overflow-hidden">
          <div className="absolute lg:left-1/2 lg:bottom-0 transform lg:-translate-x-1/2 lg:translate-y-1/2 flex lg:flex-row flex-col items-center text-white py-6 px-8 lg:px-14 lg:py-12 gap-6 lg:gap-10 ">
            {/* Section 1 */}
            <div className="flex flex-col items-center">
              <h1 className="text-4xl font-extrabold"></h1>
              <h1 className="text-sm text-green-300">
              
              </h1>
            </div>

            {/* Section 2 */}
            <div className="flex flex-col items-center">
              <h1 className="text-4xl font-extrabold"></h1>
              <h1 className="text-sm text-green-300">
              </h1>
            </div>
            <div></div>
          </div>
          <img
            src={TimeLineImage}
            alt="timelineImage"
            className="w-full h-[400px] lg:h-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default TimelineSection;