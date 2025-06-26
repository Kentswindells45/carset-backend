const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  createBooking,
  getMyBookings,
  getBookingsForOwner,
  updateBookingStatus,
} = require("../controllers/bookingController");

router.post("/", protect, createBooking);
router.get("/me", protect, getMyBookings);
router.get("/owner", protect, getBookingsForOwner);
router.put("/:id/status", protect, updateBookingStatus);

module.exports = router;
