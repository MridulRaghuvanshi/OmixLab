import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FiChevronDown } from 'react-icons/fi';
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
  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [categories, setCategories] = useState([
    { id: 'all', name: 'All Courses' }
  ]);

  const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' },
    { id: 'expert', name: 'Expert' },
  ];

  const hasAccessToLevel = (courseLevel) => {
    if (!user?.subscription?.level) return false;
    
    const levels = {
      "Beginner": ["Beginner"],
      "Intermediate": ["Beginner", "Intermediate"],
      "Advanced": ["Beginner", "Intermediate", "Advanced"],
      "Expert": ["Beginner", "Intermediate", "Advanced", "Expert"]
    };

    return levels[user.subscription.level]?.includes(courseLevel) || false;
  };

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
          const filteredCourses = filterCoursesHelper(groupedCourses, activeCategory, selectedLevel);
          setCourses(filteredCourses);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const filterCoursesHelper = (coursesToFilter, category, level) => {
    let filtered = [...coursesToFilter];
    
    // Filter by category if not 'all'
    if (category !== 'all') {
      filtered = filtered.filter(course => {
        const courseCategorySlug = course?.category?.name?.toLowerCase().replace(/\s+/g, '-');
        return courseCategorySlug === category;
      });
    }
    
    // Filter by level if not 'all'
    if (level !== 'all') {
      filtered = filtered.filter(course => {
        // Check if any level in the course matches the selected level
        return course.levels?.some(courseLevel => 
          courseLevel.level.toLowerCase() === level.toLowerCase()
        );
      });
    }
    
    return filtered;
  };

  useEffect(() => {
    const result = filterCoursesHelper(courses, activeCategory, selectedLevel);
    setCourses(result);
  }, [activeCategory, selectedLevel]);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleLevelSelect = (levelId) => {
    setSelectedLevel(levelId);
    setIsLevelDropdownOpen(false);
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

            {/* Level filter */}
            <div className="relative">
              <button
                onClick={() => setIsLevelDropdownOpen(!isLevelDropdownOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  isDarkMode
                    ? "bg-white/5 text-white hover:bg-white/10"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{levels.find(level => level.id === selectedLevel)?.name}</span>
                <FiChevronDown className={`transition-transform duration-300 ${isLevelDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isLevelDropdownOpen && (
                <div className={`absolute top-full left-0 mt-2 w-48 rounded-lg shadow-lg z-10 ${
                  isDarkMode ? "bg-[#1A1F2E] border border-white/10" : "bg-white"
                }`}>
                  {levels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => handleLevelSelect(level.id)}
                      className={`block w-full text-left px-4 py-2 first:rounded-t-lg last:rounded-b-lg transition-colors duration-200 ${
                        isDarkMode
                          ? "text-white hover:bg-white/5"
                          : "text-gray-700 hover:bg-gray-100"
                      } ${selectedLevel === level.id ? "bg-[#00FFB2] text-[#0A0F1C]" : ""}`}
                    >
                      {level.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Courses grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
            {courses?.length === 0 ? (
              <div className={`col-span-full flex flex-col items-center justify-center py-12 ${
                isDarkMode ? "text-white" : "text-gray-700"
              }`}>
                <p className="text-xl mb-4">No courses found</p>
                <p className="text-base text-center max-w-md">
                  Try adjusting your filters or check back later for new courses.
                </p>
              </div>
            ) : (
              courses?.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  height={"h-[250px]"}
                />
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Courses; 