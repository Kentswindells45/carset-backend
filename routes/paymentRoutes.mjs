import express from "express";
import {
  createStripePayment,
  confirmPayment,
} from "../controllers/paymentController.mjs";

import { protect } from "../middleware/auth.mjs";

import restrictTo from "../middleware/role.mjs";

const router = express.Router();

router.post("/stripe", protect, restrictTo("client"), createStripePayment);
router.post("/confirm", protect, confirmPayment);

export default router;
