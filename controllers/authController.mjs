import User from "../models/user.mjs";
import bcrypt from "bcrypt";
import sendEmail from "../utils/sendEmail.mjs";
import jwt from "jsonwebtoken";

export const loginWithPassport = (req, res) => {
  if (req.isAuthenticated()) {
    // Generate JWT
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      user: {
        id: req.user._id,
        email: req.user.email,
        fullName: req.user.fullName,
        role: req.user.role,
      },
      token, 
    });
  } else {
    res.status(401).json({ message: "Login failed" });
  }
};

export const logout = (req, res) => {
  req.logout((err) => {
    if (err)
      return res.status(500).json({ message: "Logout error", error: err });
    res.json({ message: "Logged out successfully" });
  });
};

export const isLoggedIn = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.status(401).json({ authenticated: false });
  }
};

export { loginWithPassport as loginUser };

export const registerUser = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      email,
      password: hashedPassword,
      fullName,
      role: "client",
      otp,
      verified: false,
    });

    await user.save();

    await sendEmail(email, "Your OTP Code", `Your OTP code is: ${otp}`);

    res.status(201).json({
      message:
        "User registered successfully. Please check your email for the OTP.",
      user: { id: user._id, email: user.email, fullName: user.fullName },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.verified = true;
    user.otp = undefined; 
    await user.save();

    res.json({
      message: "OTP verified successfully",
      user: { id: user._id, email: user.email, verified: user.verified },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "OTP verification failed", error: error.message });
  }
};
