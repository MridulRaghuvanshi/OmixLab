import React, { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import CourseCard from "./CourseCard";
import HighlightText from "./HighlightText";

const tabsName = [
  "Free",
  "New to coding",
  "Most popular",
  "Skills paths",
  "Career paths",
];

const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState(tabsName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(
    HomePageExplore[0].courses[0].heading
  );

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter((course) => course.tag === value);
    setCourses(result[0].courses);
    setCurrentCard(result[0].courses[0].heading);
  };

  return (
    <div>
      {/* Explore more section */}
      <div>
        <div className="text-4xl font-semibold text-center my-10">
          Unlock the
          <HighlightText text={"Power of Code"} />
          <p className="relative text-lg font-medium text-white text-center shadow-lg mt-2 px-6">
            Learn to Build Anything You Can Imagine
          </p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="hidden lg:flex gap-2 -mt-4 mx-auto bg-gray-900 text-gray-300 p-2 rounded-full shadow-md">
        {tabsName.map((ele, index) => {
          return (
            <div
              className={`text-lg px-6 py-2 rounded-full transition-all duration-200 font-medium ${
              currentTab === ele
                ? "bg-gray-800 text-white shadow-lg"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
              key={index}
              onClick={() => setMyCards(ele)}
            >
              {ele}
            </div>
          );
        })}
      </div>
      <div className="hidden lg:block lg:h-[200px]"></div>

      {/* Cards Group */}
      <div className="lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3">
        {courses.map((ele, index) => {
          return (
            <CourseCard
              key={index}
              cardData={ele}
              currentCard={currentCard}
              setCurrentCard={setCurrentCard}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ExploreMore;



// import React, { useState } from "react";
// import { HomePageExplore } from "../../../data/homepage-explore"; // ✅ Importing data for courses
// import {CourseCard} from "../../core/HomePage/CourseCard"; // ✅ Importing the CourseCard component
// import {HighlightText } from "./HighlightText"; // ✅ Importing HighlightText component

// // Tabs Names
// const tabsName = [
//   "Free",
//   "New to Coding",
//   "Most Popular",
//   "Skill Paths",
//   "Career Paths",
// ];

// const ExploreMore = () => {
//   // State to track selected tab
//   const [currentTab, setCurrentTab] = useState(tabsName[0]);
//   // State to store filtered courses
//   const [courses, setCourses] = useState(HomePageExplore[0].courses);
//   const [currentCard, setCurrentCard] = useState(
//     HomePageExplore[0].courses[0].heading
//   );

//   // Function to update courses based on selected tab
//   const setMyCards = (selectedTab) => {
//     setCurrentCard(null); // Reset selected card to avoid errors
//     setCurrentCard(HomePageExplore.find((course) => course.tag === selectedTab)?.courses[0]?.heading || "");
//     const newCourses = HomePageExplore.find((course) => course.heading === selectedTab)?.courses || [];
//     setCourses(newCourses);
//     setCurrentCard(newCourses.length > 0 ? newCourses[0].heading : "");
//   };

//   return (
//     <div className="flex flex-col items-center">
//       {/* Header Section */}
//       <div className="text-4xl font-semibold text-center my-10">
//         Unlock the
//         <HighlightText text={"Power of Code"} />
//         <p className="text-center text-[rgb(58,58,58)]">
//           Learn and build projects to enhance your coding skills!
//         </p>
//       </div>

//       {/* Tabs Section */}
//       <div className="hidden lg:flex gap-5 -mt-10 mx-auto w-max bg-[rgb(58,58,58)] text-white rounded-full py-2 px-5">
//         {tabsName.map((tab, index) => (
//           <div
//             key={index}
//             className={`cursor-pointer text-lg font-medium px-6 py-2 rounded-full ${
//               currentTab === tab ? "bg-yellow-300 text-black" : "hover:bg-gray-700 hover:text-white"
//             }`}
//             onClick={() => setMyCards(tab)}
//           >
//             {tab}
//           </div>
//         ))}
//       </div>
      
//       {/* Courses Display Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-10">
//         {courses.map((course, index) => (
//           <CourseCard
//             key={index} // ✅ Changed to a more appropriate key
//             cardData={course}
//             currentCard={currentCard}
//             setCurrentCard={setCurrentCard} // ✅ Passing setCurrentCard to allow updates from child
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ExploreMore;
