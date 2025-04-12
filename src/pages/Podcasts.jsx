import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaPlay } from 'react-icons/fa';
import { BsStars } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { getUserDetails } from '../services/operations/profileAPI';

const Podcasts = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // Refresh user data when component mounts or token changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        setIsLoading(false);
        navigate('/login');
        return;
      }

      try {
        setIsLoading(true);
        await dispatch(getUserDetails(token, navigate));
      } catch (error) {
        console.error("Error fetching user details:", error);
        // Retry up to 3 times with increasing delay
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 1000 * (retryCount + 1));
        } else {
          toast.error("Failed to load user data. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token, dispatch, navigate, retryCount]);

  // Add debug logging
  useEffect(() => {
    console.log("Current user data:", user);
    console.log("Auth token:", token);
  }, [user, token]);

  const handlePodcastPlanClick = () => {
    navigate('/pricing');
    // Scroll to Podcast Plan section after navigation
    setTimeout(() => {
      const podcastPlanSection = document.getElementById('podcast-plan-section');
      if (podcastPlanSection) {
        podcastPlanSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const showSubscriptionPrompt = () => {
    toast((t) => (
      <div className="flex flex-col items-start gap-2">
        <p>You need to purchase the Podcast Plan to access this content.</p>
        <button
          onClick={() => {
            toast.dismiss(t.id);
            navigate('/pricing#podcast-plan');
          }}
          className={`px-4 py-2 rounded-lg font-semibold ${
            isDarkMode
              ? 'bg-[#00FFB2] text-[#0A0F1C] hover:bg-[#00FFB2]/90'
              : 'bg-[#00FFB2] text-gray-900 hover:bg-[#00FFB2]/90'
          }`}
        >
          Subscribe Now
        </button>
      </div>
    ), {
      duration: 5000,
      style: {
        background: isDarkMode ? '#1C1F2E' : 'white',
        color: isDarkMode ? 'white' : 'black',
      },
    });
  };

  const checkPodcastAccess = () => {
    if (!user) {
      console.log("No user found");
      return false;
    }
    
    // Add detailed logging
    console.log("Full user object:", user);
    
    // Check if user has an active subscription
    if (user?.subscription?.status === "active") {
      console.log("Found active subscription");
      // Check for Podcast Plan or Premium Plan
      if (user?.subscription?.planName === "Podcast Plan" || 
          user?.subscription?.planName === "Premium Plan") {
        console.log("Valid podcast plan found");
        return true;
      }
      console.log("Active subscription but not a podcast plan:", user?.subscription?.planName);
    } else {
      console.log("No active subscription found");
    }

    // Check subscription level as fallback
    if (user?.subscriptionLevel === "Podcast" || 
        user?.subscriptionLevel === "Premium") {
      console.log("Valid subscription level found:", user?.subscriptionLevel);
      return true;
    }
    console.log("No valid subscription level found");

    // Add debug logging
    console.log("Subscription status:", {
      subscriptionStatus: user?.subscription?.status,
      planName: user?.subscription?.planName,
      subscriptionLevel: user?.subscriptionLevel,
      subscriptionStartDate: user?.subscription?.startDate,
      subscriptionEndDate: user?.subscription?.endDate
    });

    return false;
  };

  const handlePlayPodcast = () => {
    if (!user) {
      toast.error("Please login to access podcasts");
      navigate("/login");
      return;
    }

    if (checkPodcastAccess()) {
      // For now, redirect to a placeholder YouTube video
      window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
    } else {
      showSubscriptionPrompt();
    }
  };

  const handleLatestEpisode = () => {
    if (!user) {
      toast.error("Please login to access podcasts");
      navigate("/login");
      return;
    }

    if (checkPodcastAccess()) {
      // For now, redirect to the latest episode (using the same placeholder)
      window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
    } else {
      showSubscriptionPrompt();
    }
  };

  const latestPodcasts = [
    {
      title: "Introduction to Bioinformatics",
      description: "Learn the basics of computational biology",
      image: "/assets/Images/podcast1.webp"
    },
    {
      title: "DNA Sequencing Technologies",
      description: "Modern approaches to genome sequencing",
      image: "/assets/Images/podcast2.webp"
    },
    {
      title: "Protein Structure Analysis",
      description: "Understanding protein folding and structure",
      image: "/assets/Images/podcast3.webp"
    },
    {
      title: "Genomic Data Analysis",
      description: "Processing and analyzing genomic data",
      image: "/assets/Images/podcast4.webp"
    }
  ];

  const popularPodcasts = Array(8).fill({
    title: "Start your journey in Bioinformatics",
    image: "/assets/Images/podcast-thumb.webp"
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-[#0F1624]' : 'bg-white'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00FFB2] mb-4"></div>
          <p className={`${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0F1624]' : 'bg-white'}`}>
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="lg:w-1/2">
            <div className="flex items-center gap-2 mb-4">
              <BsStars className="text-[#00FFB2]" />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                New episodes available
              </span>
            </div>
            <h1 className={`text-4xl lg:text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Find and listen to your Favorite{' '}
              <span className="text-[#00FFB2]">Educational</span> Podcasts
            </h1>
            <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Explore our curated collection of bioinformatics and computational biology podcasts.
              Learn from experts and stay updated with the latest developments.
            </p>
            <div className="flex items-center gap-4">
              <button 
                onClick={handlePodcastPlanClick}
                className="bg-[#00FFB2] hover:bg-[#00FFB2]/90 text-gray-900 px-6 py-3 rounded-full font-medium transition-all">
                Podcast Plan
              </button>
              <button 
                onClick={handleLatestEpisode}
                className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-800'} hover:text-[#00FFB2] transition-colors`}>
                <FaPlay /> Latest Episode
              </button>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <img
              src="/assets/Images/hero-podcast.webp"
              alt="Podcast Hero"
              className="rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Latest Podcasts Section */}
      <section className={`py-12 ${isDarkMode ? 'bg-[#0F1624]' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Latest Podcasts
            </h2>
            <button className="text-[#00FFB2] hover:text-[#00FFB2]/80 transition-colors">
              Explore more
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestPodcasts.map((podcast, index) => (
              <div key={index} className={`rounded-xl overflow-hidden ${isDarkMode ? 'bg-gray-800/50' : 'bg-white'} shadow-lg`}>
                <img src={podcast.image} alt={podcast.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {podcast.title}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {podcast.description}
                  </p>
                  <button 
                    onClick={handlePlayPodcast}
                    className="mt-4 flex items-center gap-2 text-[#00FFB2] hover:text-[#00FFB2]/80 transition-colors">
                    <FaPlay size={12} /> Play now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Podcasts Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Popular Podcasts
            </h2>
            <button className="text-[#00FFB2] hover:text-[#00FFB2]/80 transition-colors">
              See all
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularPodcasts.map((podcast, index) => (
              <div key={index} className={`rounded-xl overflow-hidden ${isDarkMode ? 'bg-gray-800/50' : 'bg-white'} shadow-lg`}>
                <img src={podcast.image} alt={podcast.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {podcast.title}
                  </h3>
                  <button 
                    onClick={handlePlayPodcast}
                    className="mt-4 flex items-center gap-2 text-[#00FFB2] hover:text-[#00FFB2]/80 transition-colors">
                    <FaPlay size={12} /> Play now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className={`py-12 ${isDarkMode ? 'bg-[#0F1624]' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/2">
              <img
                src="/assets/Images/community.webp"
                alt="Community"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                We Share what we love the most with Tech Community
              </h2>
              <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Join our community of bioinformatics enthusiasts and learn together through engaging podcast content.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className={`text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  <div className="text-2xl font-bold text-[#00FFB2]">45+</div>
                  <div className="text-sm">Episodes</div>
                </div>
                <div className={`text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  <div className="text-2xl font-bold text-[#00FFB2]">500+</div>
                  <div className="text-sm">Lovely Listeners</div>
                </div>
                <div className={`text-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  <div className="text-2xl font-bold text-[#00FFB2]">5+</div>
                  <div className="text-sm">Years Experience</div>
                </div>
              </div>
              <button className="bg-[#00FFB2] hover:bg-[#00FFB2]/90 text-gray-900 px-6 py-3 rounded-full font-medium transition-all">
                Know more
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className={`rounded-2xl ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'} p-8 text-center`}>
            <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              New Episodes will <span className="text-[#00FFB2]">always</span> be updated regularly
            </h2>
            <p className={`text-lg mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Subscribe to our newsletter to stay updated with the latest episodes and educational content.
            </p>
            <div className="flex max-w-md mx-auto gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className={`flex-1 px-4 py-2 rounded-full ${
                  isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
                } border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}
              />
              <button className="bg-[#00FFB2] hover:bg-[#00FFB2]/90 text-gray-900 px-6 py-2 rounded-full font-medium transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Podcasts;
