export const buyCourse = async (token, courses, userDetails, navigate, dispatch, totalAmount, purchasedLevel) => {
  try {
    console.log("Starting buyCourse with params:", { courses, totalAmount, purchasedLevel });
    
    // Validate purchasedLevel
    const validLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    if (!purchasedLevel || !validLevels.includes(purchasedLevel)) {
      console.error("Invalid purchased level:", purchasedLevel);
      toast.error(`Invalid course level. Must be one of: ${validLevels.join(', ')}`);
      return;
    }
    
    // Create order
    const orderResponse = await axios.post(
      `${BASE_URL}/api/v1/payment/create-order`,
      {
        courses,
        amount: totalAmount,
        purchasedLevel
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Order created:", orderResponse.data);

    // Load Razorpay SDK
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderResponse.data.data.amount,
        currency: "INR",
        name: "OmixLab",
        description: "Course Purchase",
        order_id: orderResponse.data.data.id,
        prefill: {
          name: userDetails?.firstName + " " + userDetails?.lastName,
          email: userDetails?.email,
          contact: userDetails?.phoneNumber,
        },
        handler: async (response) => {
          try {
            console.log("Payment successful, verifying with params:", {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              purchasedLevel
            });

            const verifyResponse = await axios.post(
              `${BASE_URL}/api/v1/payment/verify`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                courses,
                amount: totalAmount,
                purchasedLevel
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            console.log("Payment verification response:", verifyResponse.data);

            if (verifyResponse.data.success) {
              toast.success("Payment successful! You are now enrolled in the course.");
              dispatch(setCart([]));
              navigate("/dashboard/enrolled-courses");
            } else {
              toast.error(verifyResponse.data.message || "Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error(error.response?.data?.message || "Payment verification failed");
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    };

    script.onerror = () => {
      toast.error("Failed to load payment gateway");
    };
  } catch (error) {
    console.error("Error in buyCourse:", error);
    toast.error(error.response?.data?.message || "Failed to create order");
  }
}; 