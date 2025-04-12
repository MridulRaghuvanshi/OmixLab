import React, { useEffect, useState } from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogaPageData } from '../services/operations/pageAndComponentData';
import Course_Card from '../components/core/Catalog/Course_Card';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import { useSelector } from "react-redux"
import Error from "./Error"
import { useTheme } from '../context/ThemeContext';

const Catalog = () => {
    const { isDarkMode } = useTheme();
    const { loading } = useSelector((state) => state.profile)
    const { catalogName } = useParams()
    const [active, setActive] = useState(1)
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");

    //Fetch all categories
    useEffect(()=> {
        const getCategories = async() => {
            const res = await apiConnector("GET", categories.CATEGORIES_API);
            const category_id = 
            res?.data?.data?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
            setCategoryId(category_id);
        }
        getCategories();
    },[catalogName]);

    useEffect(() => {
        const getCategoryDetails = async() => {
            try{
                const res = await getCatalogaPageData(categoryId);
                console.log("PRinting res: ", res);
                setCatalogPageData(res);
            }
            catch(error) {
                console.log(error)
            }
        }
        if(categoryId) {
            getCategoryDetails();
        }
        
    },[categoryId]);


    if (loading || !catalogPageData) {
        return (
          <div className={`grid min-h-[calc(100vh-3.5rem)] place-items-center ${isDarkMode ? "bg-[#0F1624]" : "bg-gray-50"}`}>
            <div className="spinner"></div>
          </div>
        )
    }
    if (!loading && !catalogPageData.success) {
        return <Error />
    }
    
    return (
        <>
          {/* Hero Section */}
          <div className={`box-content px-4 ${isDarkMode ? "bg-[#0F1624]" : "bg-white"}`}>
            <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent">
              {/* Breadcrumb with hover effect */}
              <p className={`text-sm flex items-center gap-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                <span className="hover:text-[#00FFB2] transition-colors duration-200">Home</span>
                <span>/</span>
                <span className="hover:text-[#00FFB2] transition-colors duration-200">Catalog</span>
                <span>/</span>
                <span className="text-[#00FFB2]">
                  {catalogPageData?.data?.selectedCategory?.name}
                </span>
              </p>
              {/* Main heading with gradient accent */}
              <div className="relative">
                <h1 className={`text-3xl md:text-4xl font-bold leading-tight ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                  {catalogPageData?.data?.selectedCategory?.name}
                  <div className={`h-1 w-20 bg-gradient-to-r from-[#00FFB2] to-[#00FFB2]/40 mt-2 rounded-full`}></div>
                </h1>
              </div>
              {/* Description with improved readability */}
              <p className={`max-w-[870px] text-lg leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                {catalogPageData?.data?.selectedCategory?.description}
              </p>
            </div>
          </div>
    
          {/* Section 1 - Courses */}
          <div className={`mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent ${isDarkMode ? "bg-[#0F1624]" : "bg-white"}`}>
            {/* Section heading with accent */}
            <div className="relative mb-8">
              <div className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Courses to get you started
              </div>
              <div className={`h-1 w-16 bg-[#00FFB2] mt-2 rounded-full`}></div>
            </div>
            {/* Enhanced tab navigation */}
            <div className={`my-6 flex border-b ${isDarkMode ? "border-b-gray-700" : "border-b-gray-200"} text-sm font-medium`}>
              <p
                className={`px-6 py-3 ${
                  active === 1
                    ? "border-b-2 border-[#00FFB2] text-[#00FFB2] relative"
                    : isDarkMode ? "text-gray-300 hover:text-[#00FFB2]" : "text-gray-600 hover:text-[#00FFB2]"
                } cursor-pointer transition-colors duration-200`}
                onClick={() => setActive(1)}
              >
                Most Popular
                {active === 1 && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#00FFB2] to-transparent"></div>}
              </p>
              <p
                className={`px-6 py-3 ${
                  active === 2
                    ? "border-b-2 border-[#00FFB2] text-[#00FFB2] relative"
                    : isDarkMode ? "text-gray-300 hover:text-[#00FFB2]" : "text-gray-600 hover:text-[#00FFB2]"
                } cursor-pointer transition-colors duration-200`}
                onClick={() => setActive(2)}
              >
                New
                {active === 2 && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#00FFB2] to-transparent"></div>}
              </p>
            </div>
            {/* Course slider with enhanced container */}
            <div className={`p-4 rounded-xl ${isDarkMode ? "bg-gray-900/40" : "bg-gray-50"}`}>
              <CourseSlider
                Courses={catalogPageData?.data?.selectedCategory?.courses}
              />
            </div>
          </div>

          {/* Section 2 - Top Courses */}
          <div className={`mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent ${isDarkMode ? "bg-[#0F1624]" : "bg-white"}`}>
            {/* Section heading with accent */}
            <div className="relative mb-8">
              <div className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Top courses in {catalogPageData?.data?.differentCategory?.name}
              </div>
              <div className={`h-1 w-16 bg-[#00FFB2] mt-2 rounded-full`}></div>
            </div>
            {/* Course slider with enhanced container */}
            <div className={`p-4 rounded-xl ${isDarkMode ? "bg-gray-900/40" : "bg-gray-50"}`}>
              <CourseSlider
                Courses={catalogPageData?.data?.differentCategory?.courses}
              />
            </div>
          </div>
    
          {/* Section 3 - Frequently Bought */}
          <div className={`mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent ${isDarkMode ? "bg-[#0F1624]" : "bg-white"}`}>
            {/* Section heading with accent */}
            <div className="relative mb-8">
              <div className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Frequently Bought
              </div>
              <div className={`h-1 w-16 bg-[#00FFB2] mt-2 rounded-full`}></div>
            </div>
            {/* Course grid with enhanced container */}
            <div className={`p-6 rounded-xl ${isDarkMode ? "bg-gray-900/40" : "bg-gray-50"}`}>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {catalogPageData.length>0 && catalogPageData?.data?.mostSellingCourses
                  ?.slice(0, 4)
                  .map((course, i) => (
                    <Course_Card course={course} key={i} Height={"h-[400px]"} />
                  ))}
              </div>
            </div>
          </div>
    
          <Footer />
        </>
    )
}
    
export default Catalog