import { toast } from "react-hot-toast";
import { studentEndpoints, courseEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { logout } from "./authAPI";

const { COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API } = studentEndpoints;
const { COURSE_DETAILS_API } = courseEndpoints;

// Function to load the Razorpay script
function loadScript(src) {
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
}

// Buy course function
export async function buyCourse(token, courses, userDetails, navigate, dispatch, totalAmount) {
  const toastId = toast.loading("Loading...");
  dispatch(setPaymentLoading(true));
  
  try {
    // Load Razorpay script
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    // Create headers
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Create order
    const orderResponse = await apiConnector(
      "POST", 
      COURSE_PAYMENT_API, 
      {
        courses: courses,
        amount: totalAmount,
      }, 
      headers
    );

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message || "Could not create order");
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: totalAmount,
      currency: orderResponse.data.currency || "INR",
      name: "OmixLab",
      description: courses.length > 1 
        ? `Purchase of ${courses.length} courses` 
        : "Course Purchase",
      order_id: orderResponse.data.orderId,
      prefill: {
        name: userDetails?.firstName + " " + (userDetails?.lastName || ""),
        email: userDetails?.email,
      },
      handler: async function(response) {
        try {
          const verificationResponse = await apiConnector(
            "POST",
            COURSE_VERIFY_API,
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              courses: courses,
              amount: totalAmount,
            },
            headers
          );

          if (!verificationResponse.data.success) {
            throw new Error(verificationResponse.data.message);
          }

          toast.success("Payment Successful. You have been enrolled in the course.");
          navigate("/dashboard/enrolled-courses");
        } catch (error) {
          console.error("Payment verification failed:", error);
          toast.error("Payment verification failed");
        }
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

  } catch (error) {
    console.error("BUY_COURSE_API ERROR:", error);
    toast.error("Failed to process purchase. Please try again.");
  } finally {
    dispatch(setPaymentLoading(false));
    toast.dismiss(toastId);
  }
}