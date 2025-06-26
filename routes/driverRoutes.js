const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  registerDriver,
  verifyDriver,
  assignDriver,
  getDrivers,
  getDriverById,
} = require("../controllers/driverController");

router.get("/", getDrivers);
router.get("/:id", getDriverById);

router.post("/register", protect, registerDriver);
router.put("/:id/verify", protect, verifyDriver);
router.post("/assign", protect, assignDriver);

module.exports = router;
