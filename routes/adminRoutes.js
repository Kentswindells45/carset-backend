const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  getSystemStats,
  getUsersByRole,
  getTopRatedDrivers,
  getMostBookedVehicles,
} = require("../controllers/adminController");

// All routes protected — consider adding adminOnly middleware
router.use(protect);

router.get("/stats", getSystemStats);
router.get("/users/:role", getUsersByRole);
router.get("/top-drivers", getTopRatedDrivers);
router.get("/top-vehicles", getMostBookedVehicles);

module.exports = router;
