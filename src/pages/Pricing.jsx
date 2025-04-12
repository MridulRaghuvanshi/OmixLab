import { useTheme } from "../context/ThemeContext";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { buyCourse } from "../services/operations/studentFeaturesAPI";
import { apiConnector } from "../services/apiconnector";
import { subscriptionEndpoints } from "../services/apis";

// Function to load the Razorpay script
const loadScript = (src) => {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => {
      script.remove();
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const PricingCard = ({ title, price, features, level }) => {
  const { isDarkMode } = useTheme();
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const monthlyPrice = Math.round(price / 12);

  const handleSubscription = async () => {
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (user?.accountType === "Educator") {
      toast.error("Educators cannot purchase subscriptions");
      return;
    }

    const toastId = toast.loading("Processing subscription...");

    try {
      // Create subscription data
      const subscriptionData = {
        planName: title,
        price: parseInt(price),
        level: level,
      };

      // Create subscription order
      const response = await apiConnector(
        "POST",
        subscriptionEndpoints.SUBSCRIPTION_API,
        subscriptionData,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const { orderId, amount, currency } = response.data.data;

      // Load Razorpay script
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      // Initialize Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_hKQBqNbBT98Kkw",
        amount: amount,
        currency: currency,
        name: "OmixLab",
        description: `${title} Subscription Plan`,
        order_id: orderId,
        prefill: {
          name: user.firstName + " " + user.lastName,
          email: user.email,
        },
        handler: async function (response) {
          // Verify payment
          try {
            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: amount,
              courses: [], // Subscription doesn't need courses
            };

            const verifyResponse = await apiConnector(
              "POST",
              subscriptionEndpoints.VERIFY_PAYMENT_API,
              verifyData,
              {
                Authorization: `Bearer ${token}`,
              }
            );

            console.log("Verification Response:", verifyResponse);

            if (verifyResponse.data.success) {
              toast.success("Subscription activated successfully!");
              navigate("/dashboard/enrolled-courses");
            } else {
              throw new Error(verifyResponse.data.message);
            }
          } catch (error) {
            console.log("PAYMENT VERIFY ERROR............", error);
            toast.error(error.message || "Could not verify payment");
          }
        },
        theme: {
          color: "#00FFB2",
        },
      };

      // Initialize Razorpay
      const razorpay = new window.Razorpay(options);
      
      // Handle payment failures
      razorpay.on("payment.failed", function(response) {
        toast.error(`Payment failed: ${response.error.description}`);
      });

      razorpay.open();

    } catch (error) {
      console.log("SUBSCRIPTION_API ERROR............", error);
      toast.error(error.message || "Could not initiate subscription");
    } finally {
      toast.dismiss(toastId);
    }
  };
  
  return (
    <div className={`relative rounded-xl p-6 ${isDarkMode 
      ? 'bg-[#1C1F2E]'
      : 'bg-white'} 
      shadow-lg transition-all duration-300 hover:scale-105`}>
      <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{title}</h3>
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₹{monthlyPrice}</span>
          <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>/month</span>
        </div>
        <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Billed annually at ₹{price}/year
        </p>
        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Cancel anytime
        </p>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <svg className="w-5 h-5 mr-2 text-[#00FFB2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <button 
        onClick={handleSubscription}
        className={`w-full py-3 rounded-lg font-semibold transition-colors duration-300 ${
          isDarkMode
            ? 'bg-[#00FFB2] text-[#0A0F1C] hover:bg-[#00FFB2]/90'
            : 'bg-[#00FFB2] text-gray-900 hover:bg-[#00FFB2]/90'
        }`}>
        Get Started
      </button>
    </div>
  );
};

const Pricing = () => {
  const { isDarkMode } = useTheme();

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handlePodcastSubscription = async () => {
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (user?.accountType === "Educator") {
      toast.error("Educators cannot purchase podcast subscriptions");
      return;
    }

    const toastId = toast.loading("Processing podcast subscription...");

    try {
      // Create podcast subscription data
      const subscriptionData = {
        planName: "Podcast Plan",
        price: 199,
        level: "Podcast",
        type: "podcast" // To differentiate from course subscriptions
      };

      // Create subscription order
      const response = await apiConnector(
        "POST",
        subscriptionEndpoints.SUBSCRIPTION_API,
        subscriptionData,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const { orderId, amount, currency } = response.data.data;

      // Load Razorpay script
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      // Initialize Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_hKQBqNbBT98Kkw",
        amount: amount,
        currency: currency,
        name: "OmixLab",
        description: "Podcast Subscription Plan",
        order_id: orderId,
        prefill: {
          name: user.firstName + " " + user.lastName,
          email: user.email,
        },
        theme: {
          color: "#00FFB2",
          hide_topbar: false,
          backdrop_color: isDarkMode ? "#0A0F1C" : "#f9fafb",
        },
        modal: {
          confirm_close: true,
          animation: true,
        },
        handler: async function (response) {
          // Verify payment
          try {
            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: amount,
              type: "podcast"
            };

            const verifyResponse = await apiConnector(
              "POST",
              subscriptionEndpoints.VERIFY_PAYMENT_API,
              verifyData,
              {
                Authorization: `Bearer ${token}`,
              }
            );

            if (verifyResponse.data.success) {
              toast.success("Podcast subscription activated successfully!");
              navigate("/podcasts");
            } else {
              throw new Error(verifyResponse.data.message);
            }
          } catch (error) {
            console.log("PAYMENT VERIFY ERROR............", error);
            toast.error(error.message || "Could not verify podcast subscription payment");
          }
        }
      };

      // Initialize Razorpay
      const razorpay = new window.Razorpay(options);
      
      // Handle payment failures
      razorpay.on("payment.failed", function(response) {
        toast.error(`Payment failed: ${response.error.description}`);
      });

      razorpay.on("modal.closed", function() {
        toast.dismiss(toastId);
      });

      razorpay.open();

    } catch (error) {
      console.log("PODCAST SUBSCRIPTION ERROR............", error);
      toast.error(error.message || "Could not initiate podcast subscription");
    } finally {
      toast.dismiss(toastId);
    }
  };
  
  const plans = [
    {
      title: "Beginner",
      price: "499",
      level: "Beginner",
      features: [
        "Access to basic courses",
        "Community forum access",
        "Basic progress tracking",
        "Email support",
        "Course Certificate Included"
      ]
    },
    {
      title: "Intermediate",
      price: "999",
      level: "Intermediate",
      features: [
        "All Beginner features",
        "Advanced course access",
        "Practice exercises",
        "Priority email support",
        "Course Certificate Included"
      ]
    },
    {
      title: "Advanced",
      price: "1499",
      level: "Advanced",
      features: [
        "All Intermediate features",
        "Expert-led workshops",
        "Live Q&A sessions",
        "Personalized learning path",
        "1-on-1 mentoring sessions",
        "Course Certificate Included"
      ]
    },
    {
      title: "Expert",
      price: "2499",
      level: "Expert",
      features: [
        "All Advanced features",
        "Industry projects",
        "Career guidance",
        "Job placement assistance",
        "Lifetime course access",
        "Course Certificate Included"
      ]
    }
  ];

  return (
    <div className={`min-h-screen py-16 ${isDarkMode ? 'bg-[#0A0F1C]' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Choose Your Learning Path
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Unlock your potential with our flexible pricing plans
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>

        {/* Podcast Plan Section */}
        <div id="podcast-plan-section" className="max-w-7xl mx-auto mt-20">
          <div className="text-center mb-8">
            <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Podcast Plan
            </h2>
            <p className={`text-lg mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Join our podcast community and get exclusive benefits
            </p>
          </div>
          <div className="grid grid-cols-1 max-w-7xl mx-auto">
            <div className={`relative rounded-xl p-6 ${isDarkMode 
              ? 'bg-[#1C1F2E]'
              : 'bg-white'} 
              shadow-lg transition-all duration-300 hover:scale-105 w-full max-w-[320px] mx-auto`}>
              <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Podcast Plan
              </h3>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₹199</span>
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>/year</span>
                </div>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Cancel anytime
                </p>
              </div>
              <ul className="space-y-3 mb-6">
                {[
                  "Free resources",
                  "Early access to podcast episodes",
                  "10–15% discount on courses",
                  "Access to community groups",
                  "Podcast attendee badge",
                  "Workshop alumni access"
                ].map((feature, index) => (
                  <li key={index} className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <svg className="w-5 h-5 mr-2 text-[#00FFB2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={handlePodcastSubscription}
                className={`w-full py-3 rounded-lg font-semibold transition-colors duration-300 ${
                  isDarkMode
                    ? 'bg-[#00FFB2] text-[#0A0F1C] hover:bg-[#00FFB2]/90'
                    : 'bg-[#00FFB2] text-gray-900 hover:bg-[#00FFB2]/90'
                }`}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing