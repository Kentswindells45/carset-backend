import express from "express";
import {
  createBooking,
  getClientBookings,
  getOwnerBookings,
} from "../controllers/bookingController.mjs";

import { protect } from "../middleware/auth.mjs"; 
import restrictTo from "../middleware/role.mjs";

const router = express.Router();

router.post("/", protect, restrictTo("client"), createBooking);
router.get("/my", protect, restrictTo("client"), getClientBookings);

router.get("/owner", protect, restrictTo("owner"), getOwnerBookings);

export default router;
