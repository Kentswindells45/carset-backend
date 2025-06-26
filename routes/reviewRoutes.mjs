import express from "express";
import {
  createReview,
  getVehicleReviews,
  getDriverReviews,
} from "../controllers/reviewController.mjs";
import { protect } from "../middleware/auth.mjs";
import restrictTo from "../middleware/role.mjs";

const router = express.Router();

router.post("/", protect, restrictTo("client"), createReview);
router.get("/vehicle/:vehicleId", getVehicleReviews);
router.get("/driver/:driverId", getDriverReviews);

export default router;
