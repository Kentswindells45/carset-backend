import express from "express";
import passport from "passport";
import {
  registerUser,
  verifyOTP,
  loginWithPassport, // <-- change here
} from "../controllers/authController.mjs";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", passport.authenticate("local"), loginWithPassport); // <-- and here

export default router;
