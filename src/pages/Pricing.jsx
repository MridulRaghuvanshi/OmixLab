import { useTheme } from "../context/ThemeContext";

const PricingCard = ({ title, price, features }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`relative rounded-xl p-6 ${isDarkMode 
      ? 'bg-[#1C1F2E]'
      : 'bg-white'} 
      shadow-lg transition-all duration-300 hover:scale-105`}>
      <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{title}</h3>
      <div className="mb-6">
        <span className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>${price}</span>
        <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>/month</span>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <button className={`w-full py-3 rounded-lg font-semibold transition-colors duration-300 ${
        isDarkMode
          ? 'bg-[#2C2F3E] text-white hover:bg-[#3C3F4E]'
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      }`}>
        Get Started
      </button>
    </div>
  );
};

const Pricing = () => {
  const { isDarkMode } = useTheme();
  
  const plans = [
    {
      title: "Beginner",
      price: "29",
      features: [
        "Access to basic courses",
        "Community forum access",
        "Basic progress tracking",
        "Email support"
      ]
    },
    {
      title: "Intermediate",
      price: "49",
      features: [
        "All Beginner features",
        "Advanced course access",
        "Practice exercises",
        "Priority email support",
        "Course certificates"
      ]
    },
    {
      title: "Advanced",
      price: "80",
      features: [
        "All Intermediate features",
        "Expert-led workshops",
        "Live Q&A sessions",
        "Personalized learning path",
        "1-on-1 mentoring sessions"
      ]
    },
    {
      title: "Expert",
      price: "149",
      features: [
        "All Advanced features",
        "Industry projects",
        "Career guidance",
        "Job placement assistance",
        "Lifetime course access",
        "Private coaching"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
