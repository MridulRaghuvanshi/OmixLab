const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  planName: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "cancelled", "expired"],
    default: "active",
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    default: function() {
      // Set end date to 1 year from start date
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      return date;
    },
  },
}, { timestamps: true });

module.exports = mongoose.model("Subscription", subscriptionSchema); 