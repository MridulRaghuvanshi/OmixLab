import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, ChevronDown, ChevronUp, Loader, Mail, Phone } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "👋 Hi! I'm your OmixLab assistant. How can I help you today?",
      options: [
        { text: '📚 Course Information', value: 'courses' },
        { text: '🛠️ Technical Support', value: 'support' },
        { text: '💳 Payment Help', value: 'payment' },
        { text: '📝 Study Materials', value: 'materials' }
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const courseResponses = {
    courses: {
      content: "We offer courses in multiple levels:",
      details: [
        "🔰 Beginner (₹499) - Perfect for starting your journey",
        "📈 Intermediate (₹999) - Build on your basic knowledge",
        "🚀 Advanced (₹1499) - Master complex concepts",
        "⭐ Expert (₹2499) - Become an industry professional"
      ],
      followUp: "Which level interests you?",
      options: [
        { text: "Tell me about Beginner level", value: "beginner_details" },
        { text: "Intermediate course details", value: "intermediate_details" },
        { text: "Advanced course info", value: "advanced_details" },
        { text: "Expert level specifics", value: "expert_details" }
      ]
    },
    support: {
      content: "I can help you with technical issues. What are you experiencing?",
      options: [
        { text: "Video not playing", value: "video_issue" },
        { text: "Login problems", value: "login_issue" },
        { text: "Course access", value: "access_issue" },
        { text: "Other technical issue", value: "other_tech" }
      ]
    },
    payment: {
      content: "I can assist you with payment-related queries:",
      options: [
        { text: "Payment methods", value: "payment_methods" },
        { text: "Refund policy", value: "refund" },
        { text: "Payment failed", value: "payment_failed" },
        { text: "Course pricing", value: "pricing" }
      ]
    },
    materials: {
      content: "Our study materials include:",
      details: [
        "📹 HD Video lectures",
        "📖 Comprehensive notes",
        "💻 Practical assignments",
        "🎯 Real-world projects"
      ],
      options: [
        { text: "Access materials", value: "access_materials" },
        { text: "Download options", value: "downloads" },
        { text: "Project details", value: "projects" }
      ]
    }
  };

  const getDetailedResponse = (value) => {
    const responses = {
      beginner_details: {
        content: "Our Beginner course (₹499) includes:",
        details: [
          "✅ 12 weeks of structured learning",
          "✅ Basic concepts and fundamentals",
          "✅ Hands-on practice exercises",
          "✅ 24/7 forum support",
          "✅ Certificate upon completion"
        ],
        options: [
          { text: "View curriculum", value: "beginner_curriculum" },
          { text: "Start free trial", value: "free_trial" },
          { text: "Enroll now", value: "enroll_beginner" },
          { text: "Talk to an advisor", value: "contact_support" }
        ]
      },
      video_issue: {
        content: "Let's fix your video playback issue. Try these steps:",
        details: [
          "1. Check your internet connection",
          "2. Clear browser cache",
          "3. Try a different browser",
          "4. Ensure you're using the latest version"
        ],
        options: [
          { text: "Still having issues", value: "contact_support" },
          { text: "Problem solved", value: "issue_resolved" }
        ]
      },
      payment_methods: {
        content: "We accept the following payment methods:",
        details: [
          "💳 Credit/Debit Cards",
          "🏦 Net Banking",
          "📱 UPI",
          "💰 EMI options available"
        ],
        options: [
          { text: "Payment security", value: "security_info" },
          { text: "Start payment", value: "initiate_payment" },
          { text: "Payment support", value: "contact_support" }
        ]
      },
      payment_failed: {
        content: "I'm sorry to hear about the payment issue. Let's help you resolve this:",
        details: [
          "1. Check if your card has sufficient balance",
          "2. Ensure your bank allows online transactions",
          "3. Try a different payment method",
          "4. Contact your bank if the amount is debited"
        ],
        options: [
          { text: "Try different payment method", value: "payment_methods" },
          { text: "Contact support team", value: "contact_support" },
          { text: "Back to main menu", value: "main_menu" }
        ]
      },
      other_tech: {
        content: "For technical issues not listed here, our support team is ready to help you.",
        details: [
          "Our technical team is available during business hours",
          "Average response time: 2-4 hours",
          "We can assist through email or phone"
        ],
        options: [
          { text: "Contact Support Now", value: "contact_support" },
          { text: "Back to main menu", value: "main_menu" }
        ]
      }
    };
    return responses[value] || {
      content: "I understand you're interested in this topic. Let me connect you with our support team for detailed assistance.",
      options: [
        { text: "Contact Support", value: "contact_support" },
        { text: "Back to main menu", value: "main_menu" }
      ]
    };
  };

  const simulateTyping = () => {
    setIsTyping(true);
    return new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
  };

  const handleContactSupport = () => {
    setMessages(prev => [...prev, {
      type: 'bot',
      content: "Here's how you can reach our support team:",
      details: [
        "📧 Email: support@omixlab.com",
        "📞 Phone: +91 1234567890",
        "⏰ Hours: Monday to Friday, 9 AM - 6 PM IST"
      ],
      options: [
        { text: "Go to Contact Page", value: "navigate_contact" },
        { text: "Send Email", value: "send_email" },
        { text: "Back to main menu", value: "main_menu" }
      ]
    }]);
  };

  const handleSpecialActions = (value) => {
    switch(value) {
      case 'contact_support':
        handleContactSupport();
        break;
      case 'navigate_contact':
        navigate('/contact');
        setIsOpen(false);
        break;
      case 'send_email':
        window.location.href = 'mailto:support@omixlab.com?subject=Support Request';
        break;
      case 'main_menu':
        setMessages(prev => [...prev, {
          type: 'bot',
          content: "How can I help you today?",
          options: [
            { text: '📚 Course Information', value: 'courses' },
            { text: '🛠️ Technical Support', value: 'support' },
            { text: '💳 Payment Help', value: 'payment' },
            { text: '📝 Study Materials', value: 'materials' }
          ]
        }]);
        break;
      default:
        return false;
    }
    return true;
  };

  const handleSendMessage = async (userMessage, isOption = false) => {
    if (!isOption) {
      setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    }
    setInputMessage('');

    await simulateTyping();

    const lowerCaseMessage = userMessage.toLowerCase();
    
    // Check for special actions first
    if (handleSpecialActions(lowerCaseMessage)) {
      setIsTyping(false);
      return;
    }

    // Regular response handling
    let response;
    if (courseResponses[lowerCaseMessage]) {
      response = courseResponses[lowerCaseMessage];
    } else {
      response = getDetailedResponse(lowerCaseMessage);
    }

    setIsTyping(false);
    setMessages(prev => [...prev, {
      type: 'bot',
      content: response.content,
      details: response.details,
      options: response.options || courseResponses.courses.options
    }]);
  };

  const handleOptionClick = (option) => {
    setMessages(prev => [...prev, {
      type: 'user',
      content: option.text
    }]);
    handleSendMessage(option.value, true);
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
        } p-3 rounded-full shadow-lg flex items-center gap-2 transition-all duration-300`}
      >
        <MessageCircle size={24} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
        <span className={`${isOpen ? 'hidden' : 'block'} font-medium`}>Need Help?</span>
        {isOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`absolute bottom-16 right-0 w-96 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-lg shadow-xl overflow-hidden`}>
          {/* Header */}
          <div className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-600'} text-white flex justify-between items-center`}>
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <h3 className="font-semibold">OmixLab Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-75">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                    : isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  {message.details && (
                    <ul className="mt-2 space-y-1">
                      {message.details.map((detail, idx) => (
                        <li key={idx} className="text-sm">{detail}</li>
                      ))}
                    </ul>
                  )}
                  {message.options && message.type === 'bot' && (
                    <div className="mt-3 space-y-2">
                      {message.options.map((option, optIndex) => (
                        <button
                          key={optIndex}
                          onClick={() => handleOptionClick(option)}
                          className={`block w-full text-left text-sm p-2 rounded transition-colors ${
                            isDarkMode
                              ? 'hover:bg-gray-600 bg-gray-800'
                              : 'hover:bg-gray-200 bg-white'
                          }`}
                        >
                          {option.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader className="animate-spin" size={16} />
                <span>Typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (inputMessage.trim()) handleSendMessage(inputMessage);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className={`flex-1 p-2 rounded-lg ${
                  isDarkMode
                    ? 'bg-gray-700 text-white placeholder-gray-400'
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                }`}
              />
              <button
                type="submit"
                disabled={isTyping}
                className={`p-2 rounded-lg ${
                  isDarkMode
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white transition-colors ${isTyping ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;