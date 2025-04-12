import { toast } from "react-hot-toast";
import { studentEndpoints, courseEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";
import logo from "../../assets/Logo/Logo-Full-Light.png";

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

    if (!courses || courses.length === 0) {
      toast.error("No courses selected");
      return;
    }

    // Extract course IDs
    const courseIds = courses.map(course => {
      if (typeof course === 'object' && course !== null) {
        return course.id || course._id;
      }
      return course;
    });
    
    // Get course price if not provided
    let amount = totalAmount;
    if (!amount && courseIds.length === 1) {
      try {
        console.log("Fetching course details for price:", courseIds[0]);
        const singleCourseResponse = await apiConnector("GET", 
          `${COURSE_DETAILS_API}/${courseIds[0]}`, 
          null, 
          { Authorization: `Bearer ${token}` }
        );
        
        if (singleCourseResponse.data.success) {
          amount = singleCourseResponse.data.data.courseDetails.price;
          console.log("Retrieved course price:", amount);
        } else {
          throw new Error("Could not fetch course price");
        }
      } catch (error) {
        console.error("Error fetching course price:", error);
        toast.error("Could not fetch course price. Please try again.");
        return;
      }
    }
    
    console.log("Initiating payment for courses:", courseIds, "Total amount:", amount);

    // Create order
    const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, {
      courses: courseIds,
      amount: amount,
    }, {
      Authorization: `Bearer ${token}`,
    });

    console.log("Order response:", orderResponse.data);

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message || "Could not create order");
    }

    const { orderId, currency } = orderResponse.data;

    // Prepare course names for description
    const courseNames = courses.map(course => course.courseName || "Course").join(", ");

    // Initialize Razorpay options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_hKQBqNbBT98Kkw", // Fallback to test key
      amount: orderResponse.data.amount, // Use the amount from the order response
      currency,
      name: "OmixLab",
      description: courseNames.length > 30 
        ? `Purchase of ${courses.length} courses` 
        : `Purchase: ${courseNames}`,
      image: logo,
      order_id: orderId,
      prefill: {
        name: `${userDetails.firstName} ${userDetails.lastName || ""}`.trim(),
        email: userDetails.email,
        contact: userDetails.contactNumber || "",
      },
      notes: {
        courseIds: JSON.stringify(courseIds),
      },
      theme: {
        color: "#00FFB2",
      },
      handler: async function(response) {
        try {
          console.log("Payment successful, verifying...", response);
          
          const verificationResponse = await apiConnector("POST", COURSE_VERIFY_API, {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            courses: courseIds,
            amount: amount,
          }, {
            Authorization: `Bearer ${token}`,
          });

          if (!verificationResponse.data.success) {
            throw new Error(verificationResponse.data.message || "Payment verification failed");
          }

          // Send success email
          await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount: amount,
            courses: courseIds,
          }, {
            Authorization: `Bearer ${token}`,
          });

          toast.success("Payment successful! You are now enrolled in the courses.");
          dispatch(resetCart());
          navigate("/dashboard/enrolled-courses");
        } catch (error) {
          console.error("Payment verification failed:", error);
          toast.error(error.message || "Payment verification failed. Please contact support.");
        }
      }
    };

    // Create Razorpay instance
    const paymentObject = new window.Razorpay(options);
    
    // Handle payment failures
    paymentObject.on("payment.failed", function(response) {
      toast.error(`Payment failed: ${response.error.description}`);
    });

    // Open Razorpay
    paymentObject.open();

  } catch (error) {
    console.error("BUY_COURSE_API ERROR:", error);
    toast.error(error.message || "Could not initiate payment.");
  } finally {
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
  }
}