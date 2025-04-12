// import React from "react";
// import { Link } from "react-router-dom"

// // Importing React Icons
// import { HiUsers } from "react-icons/hi";
// import { ImTree } from "react-icons/im";

// const CourseCard = ({cardData, currentCard, setCurrentCard}) => {
//   return (
//     <div
//     className={`w-[360px] lg:w-[30%] text-white h-[300px] box-border cursor-pointer transition-all duration-200 shadow-md 
//     ${currentCard === cardData?.heading ? "bg-white shadow-lg text-black scale-105" : "bg-gray-900"}`} 
//     onClick={() => setCurrentCard(cardData?.heading)} 
//   >
//   {/* Card Content Section */}
//       <div className="border-b-2 border-dashed border-gray-700 p-6 flex flex-col gap-3">
//         <div
//           className={` ${
//             currentCard === cardData?.heading && "text-[rgb(24,24,27)]"
//           } font-semibold text-[20px]`}
//         >
//           {cardData?.heading}
//         </div>

//         <div className="text-[rgb(140,140,160)]">{cardData?.description}</div>
//       </div>

//       <div
//         className={`flex justify-between ${
//           currentCard === cardData?.heading ? "text-blue-300" : "text-[rgb(167,167,180)]"
//         } px-6 py-3 font-medium`}
//       >
//         {/* Level */}
//         <div className="flex items-center gap-2 text-[16px]">
//           <HiUsers />
//           <p>{cardData?.level}</p>
//         </div>

//         {/* Flow Chart */}
//         <div className="flex items-center gap-2 text-[16px]">
//           <ImTree />
//           <p>{cardData?.lessionNumber} Lession</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseCard;


import React from "react";
import { Link } from "react-router-dom";  
import { HiUsers } from "react-icons/hi"; 
import { ImTree } from "react-icons/im"; 

export const CourseCard = ({ cardData, currentCard, setCurrentCard }) => {
  return (
    <div
      className={`w-[360px] lg:w-[30%] text-white h-[300px] box-border cursor-pointer transition-all duration-200 shadow-md 
      ${currentCard === cardData?.heading ? "bg-white shadow-lg text-black scale-105" : "bg-gray-900"}`} 
      onClick={() => setCurrentCard(cardData?.heading)} 
    >
      {/* Card Content Section */}
      <div className="border-b-2 border-dashed border-gray-700 p-6 flex flex-col gap-3">
        
        <h3
          className={`text-lg font-bold ${
            currentCard === cardData?.heading ? "text-black" : "text-[rgb(245,245,245)]"
          }`}
        >
          {cardData?.heading || "Default Title"} 
        </h3>

        {/* Description with default text */}
        <p className="text-gray-400 text-sm">
          {cardData?.description || "No description available."} 
        </p>
      </div>

      {/* Footer Section */}
      <div
        className={`flex justify-between p-3 text-sm font-medium ${
          currentCard === cardData?.heading ? "text-blue-300" : "text-gray-500"
        }`}
      >
        {/* Users / Level */}
        <div className="flex items-center gap-2">
          <HiUsers />
          <p>{cardData?.level || "Beginner"}</p>
        </div>

        {/* Course Modules */}
        <div className="flex items-center gap-2">
          <ImTree />
          <p>{cardData?.lessionNumber || "0"} Lessons</p> 
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
