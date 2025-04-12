import React from "react";
import { useTheme } from "../../context/ThemeContext";
import ContactUsForm from "./ContactUsForm";

const ContactForm = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`rounded-xl p-7 lg:p-14 flex gap-3 flex-col border ${
      isDarkMode 
        ? "border-[#00FFB2]/10" 
        : "border-gray-300"
    }`}>
      <h1 className={`text-3xl md:text-4xl font-bold tracking-tight leading-[1.15] text-center ${
        isDarkMode ? "text-gray-200" : "text-gray-800"
      }`}>
        Got a Idea? We&apos;ve got the skills. Let&apos;s team up
      </h1>
      <p className={`text-base md:text-lg font-normal ${
        isDarkMode ? "text-gray-300" : "text-gray-700"
      } leading-relaxed`}>
        Tell us more about yourself and what you&apos;re got in mind.
      </p>

      <div className="mt-7">
        <ContactUsForm />
      </div>
    </div>
  );
};

export default ContactForm;