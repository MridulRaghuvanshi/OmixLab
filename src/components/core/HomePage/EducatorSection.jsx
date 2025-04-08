import React from 'react'
import CTAButton from "../../../components/core/HomePage/Button";
import { FaArrowRight } from "react-icons/fa";
import Educator from "../../../assets/Images/Educator.png";
import HighlightText from './HighlightText';

const InstructorSection = () => {
  return (
    <div>
        <div className="flex flex-col lg:flex-row items-center justify-between my-20">
        {/* Image Section */}
          <div className="lg:w-[50%] flex justify-center">
            <img
              src={Educator}
              alt=""
              className="shadow-lg rounded-lg"
            />
          </div>
          <div className="lg:w-[50%] flex flex-col gap-6">
            <h1 className="text-4xl font-semibold ">
              Become an
              <HighlightText text={"Educator"} />
            </h1>

            <p className="text-gray-500 text-base leading-6">
              Educators from around the world teach millions of students on
              OmixLab. We provide the tools and skills to teach what you
              love.
            </p>
          {/* Call to Action Button */}
            <div className="w-fit">
              <CTAButton active={true} linkto={"/signup"}>
                <div className="flex items-center gap-2">
                  Start Teaching Today
                  <FaArrowRight />
                </div>
              </CTAButton>
            </div>
          </div>
        </div>
    </div>
  )
}

export default InstructorSection