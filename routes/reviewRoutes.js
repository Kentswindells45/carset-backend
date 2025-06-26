const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  createReview,
  getVehicleReviews,
  getDriverReviews,
} = require("../controllers/reviewController");

router.post("/", protect, createReview); 
router.get("/vehicle/:vehicleId", getVehicleReviews);
router.get("/driver/:driverId", getDriverReviews);

module.exports = router;
