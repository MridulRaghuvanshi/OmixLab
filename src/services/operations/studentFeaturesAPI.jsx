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
    console.log("Starting purchase process with data:", {
      courses,
      totalAmount,
      purchasedLevel,
      userDetails: {
        name: userDetails?.firstName + " " + (userDetails?.lastName || ""),
        email: userDetails?.email
      }
    });

    // Load Razorpay script
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      throw new Error("Razorpay SDK failed to load");
    }

    // Validate required parameters
    if (!token || !courses || !courses.length || !totalAmount || !purchasedLevel) {
      throw new Error(`Missing required parameters: ${[
        !token && 'token',
        (!courses || !courses.length) && 'courses',
        !totalAmount && 'totalAmount',
        !purchasedLevel && 'purchasedLevel'
      ].filter(Boolean).join(', ')}`);
    }

    // Create headers
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Create order
    console.log("Creating order with data:", {
      courses,
      amount: totalAmount,
      purchasedLevel
    });

    const orderResponse = await apiConnector(
      "POST", 
      COURSE_PAYMENT_API, 
      {
        courses: courses,
        amount: parseInt(totalAmount),
        purchasedLevel: purchasedLevel
      }, 
      headers
    );

    console.log("Order creation response:", orderResponse.data);

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message || "Could not create order");
    }

    // Configure Razorpay options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderResponse.data.amount,
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
        let verificationData = null;
        try {
          dispatch(setPaymentLoading(true));
          
          // Prepare verification data
          verificationData = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            courses: courses.map(course => course.toString()), // Ensure course IDs are strings
            amount: parseInt(totalAmount),
            purchasedLevel: purchasedLevel
          };

          console.log("=== Payment Verification Request ===");
          console.log("Endpoint:", COURSE_VERIFY_API);
          console.log("Headers:", {
            ...headers,
            Authorization: headers.Authorization ? "Bearer [REDACTED]" : "Missing"
          });
          console.log("Verification Data:", {
            ...verificationData,
            courses: verificationData.courses.map(c => ({
              id: c,
              isValid: mongoose.Types.ObjectId.isValid(c)
            }))
          });

          const verificationResponse = await apiConnector(
            "POST",
            COURSE_VERIFY_API,
            verificationData,
            headers
          );

          console.log("=== Payment Verification Response ===");
          console.log("Status:", verificationResponse.status);
          console.log("Response Data:", verificationResponse.data);

          if (!verificationResponse.data.success) {
            console.log("Payment Verification - Server Error Response:", verificationResponse.data);
            throw new Error(verificationResponse.data.message || "Payment verification failed");
          }

          // Send payment success email
          await apiConnector(
            "POST",
            SEND_PAYMENT_SUCCESS_EMAIL_API,
            {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              amount: totalAmount,
            },
            headers
          );

          toast.success(verificationResponse.data.message || "Payment Successful. You have been enrolled in the course.");
          navigate("/dashboard/enrolled-courses");
        } catch (error) {
          console.error("Payment verification failed. Full error:", error);
          console.error("Error response data:", error.response?.data);
          
          const errorMessage = error.response?.data?.message || error.message || "Payment verification failed";
          toast.error(errorMessage);

          // Add retry option for verification
          if (error.response?.status === 400 && verificationData) {
            const retryVerification = window.confirm("Payment verification failed. Would you like to retry?");
            if (retryVerification) {
              try {
                console.log("Retrying verification with data:", JSON.stringify(verificationData, null, 2));
                
                const retryResponse = await apiConnector(
                  "POST",
                  COURSE_VERIFY_API,
                  verificationData,
                  {
                    ...headers,
                    'Content-Type': 'application/json'
                  }
                );

                console.log("Retry verification response:", JSON.stringify(retryResponse.data, null, 2));

                if (retryResponse.data.success) {
                  toast.success("Payment verification successful on retry!");
                  navigate("/dashboard/enrolled-courses");
                  return;
                } else {
                  throw new Error(retryResponse.data.message || "Verification retry failed");
                }
              } catch (retryError) {
                console.error("Retry verification failed. Full error:", retryError);
                console.error("Retry error response data:", retryError.response?.data);
                toast.error(retryError.response?.data?.message || retryError.message || "Verification retry failed");
              }
            }
          }
        } finally {
          dispatch(setPaymentLoading(false));
        }
      },
      modal: {
        confirm_close: true,
        animation: true,
        ondismiss: function() {
          console.log("Payment modal dismissed");
          dispatch(setPaymentLoading(false));
          toast.dismiss(toastId);
        }
      },
      theme: {
        color: "#00FFB2",
      }
    };

    const paymentObject = new window.Razorpay(options);
    
    paymentObject.on('payment.failed', function(failureResponse) {
      console.error("Payment failed. Full error:", failureResponse);
      toast.error(`Payment failed: ${failureResponse.error.description || "Unknown error"}`);
      dispatch(setPaymentLoading(false));
    });

    console.log("Opening Razorpay modal with options:", {
      amount: options.amount,
      currency: options.currency,
      orderId: options.order_id
    });

    paymentObject.open();

  } catch (error) {
    console.error("BUY_COURSE_API ERROR. Full error:", error);
    console.error("Error response data:", error.response?.data);
    toast.error(error.response?.data?.message || error.message || "Failed to process purchase");
  } finally {
    dispatch(setPaymentLoading(false));
    toast.dismiss(toastId);
  }
}