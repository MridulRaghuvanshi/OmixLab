import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/common/Footer';
import { apiConnector } from '../services/apiconnector';
import { courseEndpoints } from '../services/apis';
import Course_Card from '../components/core/Catalog/Course_Card';
import { useSelector } from 'react-redux';
import { getAllCourses, groupCoursesByTitleAndEducator } from "../services/operations/courseDetailsAPI.jsx";
import CourseCard from "../components/core/Course/CourseCard"

const Courses = () => {
  const { isDarkMode } = useTheme();
  const { loading } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [courses, setCourses] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [categories, setCategories] = useState([
    { id: 'all', name: 'All Courses' }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoryResponse = await apiConnector('GET', courseEndpoints.COURSE_CATEGORIES_API);
        if (categoryResponse?.data?.success) {
          const categoriesData = categoryResponse.data.data;
          setCategories([
            { id: 'all', name: 'All Courses' },
            ...categoriesData.map(category => ({
              id: category.name.toLowerCase().replace(/\s+/g, '-'),
              name: category.name
            }))
          ]);
        }

        // Fetch and group courses
        const result = await getAllCourses();
        if (result) {
          // Group courses by title and educator
          const groupedCourses = groupCoursesByTitleAndEducator(result);
          
          // Apply initial filters
          const filteredCourses = filterCoursesHelper(groupedCourses, activeCategory);
          setCourses(filteredCourses);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const filterCoursesHelper = (coursesToFilter, category) => {
    let filtered = [...coursesToFilter];
    
    // Filter by category if not 'all'
    if (category !== 'all') {
      filtered = filtered.filter(course => {
        const courseCategorySlug = course?.category?.name?.toLowerCase().replace(/\s+/g, '-');
        return courseCategorySlug === category;
      });
    }
    
    return filtered;
  };

  useEffect(() => {
    const result = filterCoursesHelper(courses, activeCategory);
    setCourses(result);
  }, [activeCategory]);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
  };

  if (loading) {
    return (
      <div className={`grid min-h-[calc(100vh-3.5rem)] place-items-center ${isDarkMode ? "bg-[#0A0F1C]" : "bg-gray-50"}`}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <div className={`w-full min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-[#0A0F1C]" : "bg-gray-50"}`}>
        {/* Hero section */}
        <div className={`w-full py-12 ${isDarkMode ? "bg-[#0A0F1C]" : "bg-white"}`}>
          <div className="w-11/12 max-w-maxContent mx-auto">
            <h1 className={`text-3xl md:text-4xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Choose your learning path
            </h1>
            <p className={`mt-4 text-lg max-w-2xl ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              Gain the knowledge and skills you need to advance. Explore courses tailored for scientists and researchers.
            </p>
          </div>
        </div>

        {/* Filters section */}
        <div className="w-11/12 max-w-maxContent mx-auto py-6">
          <div className="flex flex-wrap items-center gap-4 mb-8">
            {/* Categories filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    activeCategory === category.id
                      ? "bg-[#00FFB2] text-[#0A0F1C] font-medium"
                      : isDarkMode
                        ? "bg-white/5 text-white hover:bg-white/10"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Courses grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} height="h-[200px]" />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Courses; 