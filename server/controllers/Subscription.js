const User = require("../models/User");
const Subscription = require("../models/Subscription");
const { instance } = require("../config/razorpay");
const { mailSender } = require("../utils/mailSender");
const { subscriptionPurchaseEmail } = require("../mail/templates/subscriptionPurchase");
const mongoose = require("mongoose");
const crypto = require("crypto");

// Create a new subscription
exports.createSubscription = async (req, res) => {
  try {
    const { planName, price, level } = req.body;
    const userId = req.user.id;

    if (!planName || !price || !level) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Create a Razorpay order
    const options = {
      amount: price * 100, // amount in smallest currency unit
      currency: "INR",
      receipt: `sub_${Date.now().toString().slice(-8)}`,
      notes: {
        planName: planName,
        level: level,
        userId: userId,
      },
    };

    try {
      const order = await instance.orders.create(options);
      console.log("Razorpay Order Created:", order);

      return res.status(200).json({
        success: true,
        message: "Subscription order created successfully",
        data: {
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
        },
      });
    } catch (razorpayError) {
      console.error("Razorpay Order Creation Error:", razorpayError);
      return res.status(500).json({
        success: false,
        message: "Failed to create Razorpay order",
        error: razorpayError.message,
      });
    }
  } catch (error) {
    console.error("SUBSCRIPTION_CREATE_API ERROR", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create subscription",
      error: error.message,
    });
  }
};

// Verify subscription payment
exports.verifySubscription = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.user.id;

    // Verify payment signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Get order details
    const order = await instance.orders.fetch(razorpay_order_id);
    const { planName, level } = order.notes;

    // Create subscription record
    const subscription = await Subscription.create({
      user: userId,
      planName: planName,
      level: level,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount: order.amount / 100,
      status: "active",
    });

    // Update user's subscription and level
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        subscription: subscription._id,
        subscriptionLevel: level,
      },
      { new: true }
    ).populate('subscription');

    // Send confirmation email
    const user = await User.findById(userId);
    await mailSender(
      user.email,
      "Subscription Purchase Confirmation",
      subscriptionPurchaseEmail(user.firstName, planName)
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified and subscription activated successfully",
      data: {
        subscription: subscription,
        user: {
          subscriptionLevel: updatedUser.subscriptionLevel,
          subscription: updatedUser.subscription
        }
      }
    });
  } catch (error) {
    console.error("SUBSCRIPTION_VERIFY_API ERROR", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify subscription payment",
      error: error.message,
    });
  }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find and update subscription
    await Subscription.findOneAndUpdate(
      { user: userId, status: "active" },
      { status: "cancelled" }
    );

    // Update user's subscription status
    await User.findByIdAndUpdate(userId, {
      $unset: { subscription: 1, subscriptionLevel: 1 },
    });

    return res.status(200).json({
      success: true,
      message: "Subscription cancelled successfully",
    });
  } catch (error) {
    console.error("SUBSCRIPTION_CANCEL_API ERROR", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel subscription",
      error: error.message,
    });
  }
};

// Get all subscriptions for a user
exports.getAllSubscriptions = async (req, res) => {
  try {
    const userId = req.user.id;
    const subscriptions = await Subscription.find({ user: userId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "User subscriptions fetched successfully",
      data: subscriptions,
    });
  } catch (error) {
    console.error("GET_SUBSCRIPTIONS_API ERROR", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch subscriptions",
      error: error.message,
    });
  }
};
