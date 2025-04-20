import { toast } from "react-hot-toast";
import { studentEndpoints, courseEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { logout } from "./authAPI";
import mongoose from "mongoose";

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
export async function buyCourse(token, courses, userDetails, navigate, dispatch, totalAmount, purchasedLevel) {
  const toastId = toast.loading("Loading...");
  dispatch(setPaymentLoading(true));
  
  try {
    // Get the course ID
    const courseId = courses[0];

    // Create headers
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // First verify if course exists and is available
    const courseDetailsResponse = await apiConnector(
      "POST",
      COURSE_DETAILS_API,
      { courseId },
      headers
    );

    if (!courseDetailsResponse.data.success) {
      toast.error("Course not found or not available");
      return;
    }

    // Load the Razorpay SDK
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    // Create payment order
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      {
        courses: [courseId],
        amount: totalAmount,
        level: purchasedLevel
      },
      headers
    );

    if (!orderResponse.data.success) {
      toast.error(orderResponse.data.message || "Could not create order");
      return;
    }

    // Configure Razorpay options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      currency: orderResponse.data.currency || "INR",
      amount: orderResponse.data.amount,
      order_id: orderResponse.data.orderId,
      name: "OmixLab",
      description: `${purchasedLevel} Level Course Purchase`,
      prefill: {
        name: userDetails?.firstName + " " + (userDetails?.lastName || ""),
        email: userDetails?.email
      },
      handler: async function(response) {
        try {
          dispatch(setPaymentLoading(true));

          // Send verification request
          const verificationResponse = await apiConnector(
            "POST",
            COURSE_VERIFY_API,
            {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              courses: [courseId],
              amount: totalAmount,
              purchasedLevel: purchasedLevel
            },
            headers
          );

          if (verificationResponse.data.success) {
            toast.success("Payment successful");
            navigate("/dashboard/enrolled-courses");
          } else {
            toast.error(verificationResponse.data.message || "Payment verification failed");
          }
        } catch (error) {
          console.error("Verification error:", error.response?.data);
          toast.error(error.response?.data?.message || "Payment verification failed");
        } finally {
          dispatch(setPaymentLoading(false));
        }
      },
      modal: {
        confirm_close: true,
        animation: true,
        ondismiss: function() {
          dispatch(setPaymentLoading(false));
          toast.dismiss(toastId);
        }
      },
      theme: {
        color: "#00FFB2"
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

  } catch (error) {
    console.error("Purchase error:", error);
    toast.error(error.message || "Failed to process purchase");
  } finally {
    dispatch(setPaymentLoading(false));
    toast.dismiss(toastId);
  }
}