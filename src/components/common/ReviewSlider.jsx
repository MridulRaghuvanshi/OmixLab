import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"
import { useTheme } from "../../context/ThemeContext"

// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "../../App.css"
// Icons
import { FaStar } from "react-icons/fa"
// Import required modules
import { Autoplay, FreeMode, Pagination } from "swiper/modules"


// Get apiFunction and the endpoint
import { apiConnector } from "../../services/apiconnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const truncateWords = 15
  const { isDarkMode } = useTheme()

  const placeholderReviews = [
    {
      user: {
        firstName: "Sarah",
        lastName: "Chen",
        image: null
      },
      course: {
        courseName: "R Programming for Bioinformatics"
      },
      rating: 5.0,
      review: "The course structure is excellent! The way complex bioinformatics concepts are broken down makes learning R programming intuitive and practical. The hands-on exercises with real genomic data analysis were particularly helpful."
    },
    {
      user: {
        firstName: "Michael",
        lastName: "Rodriguez",
        image: null
      },
      course: {
        courseName: "Advanced Data Analysis in R"
      },
      rating: 4.8,
      review: "As a research scientist, this platform has been invaluable. The statistical analysis modules and visualization techniques in R have directly improved my research workflow. The community support is outstanding!"
    },
    {
      user: {
        firstName: "Emily",
        lastName: "Thompson",
        image: null
      },
      course: {
        courseName: "Genomic Data Visualization"
      },
      rating: 5.0,
      review: "The interactive visualizations and real-time coding environment made learning complex genomic data visualization techniques much more approachable. The instructor's expertise in both R and bioinformatics is evident."
    },
    {
      user: {
        firstName: "David",
        lastName: "Kumar",
        image: null
      },
      course: {
        courseName: "Statistical Methods in R"
      },
      rating: 4.9,
      review: "Perfect blend of theory and practical application. The course projects helped me understand how to apply statistical concepts to real biological data. The R programming exercises are well-designed and challenging."
    },
    {
      user: {
        firstName: "Lisa",
        lastName: "Zhang",
        image: null
      },
      course: {
        courseName: "Machine Learning for Genomics"
      },
      rating: 5.0,
      review: "Exceptional course content! The integration of machine learning concepts with genomic analysis using R has transformed how I approach my research projects. The practical examples are incredibly relevant."
    }
  ]

  useEffect(() => {
    ;(async () => {
      const { data } = await apiConnector(
        "GET",
        ratingsEndpoints.REVIEWS_DETAILS_API
      )
      if (data?.success) {
        setReviews(data?.data)
      } else {
        setReviews(placeholderReviews)
      }
    })()
  }, [])

  const displayReviews = reviews.length > 0 ? reviews : placeholderReviews

  return (
    <div className="w-full px-4">
      <div className="text-center mb-8">
        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          What Our Learners Say
        </h2>
        <p className={`text-base md:text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          Hear from our community of bioinformatics enthusiasts
        </p>
      </div>

      <div className="my-[50px] h-[250px] max-w-maxContentTab lg:max-w-maxContent mx-auto">
        <Swiper
          slidesPerView={1}
          spaceBetween={25}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="w-full"
        >
          {displayReviews.map((review, i) => {
            return (
              <SwiperSlide key={i}>
                <div className={`flex flex-col gap-4 p-6 rounded-xl h-full ${
                  isDarkMode 
                    ? "bg-gray-800/50 hover:bg-gray-800/70" 
                    : "bg-white hover:bg-gray-50"
                } transition-all duration-300 shadow-lg`}>
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        review?.user?.image
                          ? review?.user?.image
                          : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                      }
                      alt=""
                      className="h-12 w-12 rounded-full object-cover border-2 border-[#00FFB2]"
                    />
                    <div className="flex flex-col">
                      <h3 className={`font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}>
                        {`${review?.user?.firstName} ${review?.user?.lastName}`}
                      </h3>
                      <p className={`text-sm ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}>
                        {review?.course?.courseName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <h4 className={`font-semibold ${
                      isDarkMode ? "text-[#00FFB2]" : "text-[#00916E]"
                    }`}>
                      {review.rating.toFixed(1)}
                    </h4>
                    <ReactStars
                      count={5}
                      value={review.rating}
                      size={20}
                      edit={false}
                      activeColor={isDarkMode ? "#00FFB2" : "#00916E"}
                      emptyIcon={<FaStar />}
                      fullIcon={<FaStar />}
                    />
                  </div>

                  <p className={`font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  } line-clamp-3`}>
                    {review?.review.split(" ").length > truncateWords
                      ? `${review?.review
                          .split(" ")
                          .slice(0, truncateWords)
                          .join(" ")} ...`
                      : `${review?.review}`}
                  </p>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider