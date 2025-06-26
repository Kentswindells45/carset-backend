import express from "express";
import {
  registerDriver,
  assignDriver,
  getAllDrivers,
} from "../controllers/driverController.mjs";

import { protect } from "../middleware/auth.mjs"; 
import restrictTo from "../middleware/role.mjs";

const router = express.Router();

router.post("/register", protect, restrictTo("driver"), registerDriver);
router.get("/", protect, restrictTo("admin", "owner"), getAllDrivers);
router.post("/assign", protect, restrictTo("owner"), assignDriver);

export default router;
