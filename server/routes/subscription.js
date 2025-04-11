const express = require("express");
const router = express.Router();

const { auth, isStudent } = require("../middlewares/auth");
const {
  createSubscription,
  verifySubscription,
  cancelSubscription,
  getAllSubscriptions,
} = require("../controllers/Subscription");

// Subscription routes
router.post("/create", auth, isStudent, createSubscription);
router.post("/verify", auth, verifySubscription);
router.post("/cancel", auth, cancelSubscription);
router.get("/", auth, getAllSubscriptions);

module.exports = router; 