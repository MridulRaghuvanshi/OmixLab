// import React from 'react'
// import HighlightText from './HighlightText'
// import CTAButton from "../../../components/core/HomePage/Button";
// import Know_your_progress from "../../../assets/Images/Know_your_progress.png";
// import Compare_with_others from "../../../assets/Images/Compare_with_others.svg";
// import Plan_your_lessons from "../../../assets/Images/Plan_your_lessons.svg";

// const LearningLanguageSection = () => {
//   return (
//     <div>
//         <div className="text-4xl font-semibold text-center my-10">
//             Your swiss knife for
//             <HighlightText text={"learning any language"} />
//             <div className="text-center text-[rgb(63,63,70)] font-medium lg:w-[75%] mx-auto leading-6 text-base mt-3">
//               Using spin making learning multiple languages easy. with 20+
//               languages realistic voice-over, progress tracking, custom schedule
//               and more.
//             </div>
//             <div className="flex flex-col lg:flex-row items-center justify-center mt-8 lg:mt-0">
//               <img
//                 src={Know_your_progress}
//                 alt=""
//                 className="object-contain  lg:-mr-32 "
//               />
//               <img
//                 src={Compare_with_others}
//                 alt=""
//                 className="object-contain lg:-mb-10 lg:-mt-0 -mt-12"
//               />
//               <img
//                 src={Plan_your_lessons}
//                 alt=""
//                 className="object-contain  lg:-ml-36 lg:-mt-5 -mt-16"
//               />
//             </div>
//           </div>

//           <div className="w-fit mx-auto lg:mb-20 mb-8 -mt-5">
//             <CTAButton active={true} linkto={"/signup"}>
//               <div className="">Learn More</div>
//             </CTAButton>
//           </div>
//     </div>
//   )
// }

// export default LearningLanguageSection


import React from 'react';
import HighlightText from './HighlightText';
import CTAButton from "../../../components/core/HomePage/Button";
import Know_your_progress from "../../../assets/Images/Know_your_progress.svg";
import Compare_with_others from "../../../assets/Images/Compare_with_others.svg";
import Plan_your_lessons from "../../../assets/Images/Plan_your_lessons.svg";

const LearningLanguageSection = () => {
  return (
    <div className="bg-gray-50 py-16 px-6 md:px-12 lg:px-24 text-center">
      <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
      Your Swiss Army Knife for<HighlightText text={"Mastering Bioinformatics"} />
      </h2>
      <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
      Gain hands-on expertise in essential bioinformatics tools, track your progress, and compare your learning journey with peers.
      </p>
      <div className="flex flex-col lg:flex-row items-center justify-center mt-10 gap-8">
        <img
          src={Know_your_progress}
          alt="Know your progress"
          className="w-48 sm:w-56 md:w-64 lg:w-72 object-contain lg:-mr-16"
        />
        <img
          src={Compare_with_others}
          alt="Compare with others"
          className="w-48 sm:w-56 md:w-64 lg:w-72 object-contain my-6 lg:my-0"
        />
        <img
          src={Plan_your_lessons}
          alt="Plan your lessons"
          className="w-48 sm:w-56 md:w-64 lg:w-72 object-contain lg:-ml-16"
        />
      </div>
      <div className="mt-8">
        <CTAButton active={true} linkto={"/signup"}>
          <span className="text-lg font-semibold">Learn More</span></CTAButton>
        </div>
    </div>
  );
};

export default LearningLanguageSection;
