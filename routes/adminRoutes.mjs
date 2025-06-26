import express from "express";
import {
  getSystemStats,
  getUsersByRole,
  getTopRatedDrivers,
  getMostBookedVehicles,
} from "../controllers/adminController.mjs";

import { protect } from "../middleware/auth.mjs"; 
import restrictTo from "../middleware/role.mjs";

const router = express.Router();

router.get("/stats", protect, restrictTo("admin"), getSystemStats);
router.get("/users/:role", protect, restrictTo("admin"), getUsersByRole);
router.get("/top-drivers", protect, restrictTo("admin"), getTopRatedDrivers);
router.get(
  "/top-vehicles",
  protect,
  restrictTo("admin"),
  getMostBookedVehicles
);

export default router;
