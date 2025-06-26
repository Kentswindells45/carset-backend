const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  payForBooking,
  getUserTransactions,
  getOwnerEarnings,
} = require("../controllers/paymentController");

router.post("/pay", protect, payForBooking);
router.get("/me", protect, getUserTransactions);
router.get("/owner", protect, getOwnerEarnings);

module.exports = router;
