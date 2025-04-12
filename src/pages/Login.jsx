import React from "react";
import { useTheme } from "../context/ThemeContext";
import LoginForm from "../components/core/Auth/LoginForm";
import loginImg from "../assets/Images/login.webp";

const Login = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`w-full min-h-screen flex items-center justify-center ${isDarkMode ? "bg-[#0F1624]" : "bg-gray-50"}`}>
      <div className={`max-w-maxContent w-11/12 flex flex-col-reverse md:flex-row items-center justify-between gap-8 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
        {/* Login Form */}
        <div className={`w-full md:w-[45%] p-8 rounded-xl border ${
          isDarkMode ? "border-[#00FFB2]/10" : "border-gray-300"
        }`}>
          <h1 className={`text-3xl md:text-4xl font-bold tracking-tight leading-[1.15] mb-6 ${
            isDarkMode ? "text-gray-200" : "text-gray-800"
          }`}>
            Welcome Back
          </h1>
          <p className={`text-base md:text-lg font-normal mb-8 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          } leading-relaxed`}>
            Build skills for today, tomorrow, and beyond.{" "}
            <span className="text-[#00FFB2] italic">Education</span>{" "}
            is future-proof your career.
          </p>
          <LoginForm />
        </div>

        {/* Image */}
        <div className="w-full md:w-[45%] flex justify-center">
          <img
            src={loginImg}
            alt="Login Image"
            loading="lazy"
            className="max-w-full h-auto rounded-xl hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;