import express from "express";
import {
  registerUser,
  verifyOTP,
  loginUser,
} from "../controllers/authController.mjs";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);

export default router;
