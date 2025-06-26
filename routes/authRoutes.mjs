import express from "express";
import passport from "passport";
import {
  loginWithPassport,
  logout,
  isLoggedIn,
} from "../controllers/authController.mjs";

const router = express.Router();

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/api/auth/login-failed" }),
  loginWithPassport
);

router.get("/login-failed", (req, res) => {
  res.status(401).json({ message: "Invalid email or password" });
});

router.get("/logout", logout);
router.get("/status", isLoggedIn);

export default router;
