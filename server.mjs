import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import compression from "compression";
import session from "express-session";
import passport from "passport";

import connectDB from "./config/db.mjs";
import rateLimit from "./middleware/rateLimit.mjs";
import { errorHandler } from "./middleware/errorHandler.mjs";

import userRoutes from "./routes/userRoutes.mjs";
import authRoutes from "./routes/authRoutes.mjs";
import vehicleRoutes from "./routes/vehicleRoutes.mjs";
import driverRoutes from "./routes/driverRoutes.mjs";
import bookingRoutes from "./routes/bookingRoutes.mjs";
import paymentRoutes from "./routes/paymentRoutes.mjs";
import reviewRoutes from "./routes/reviewRoutes.mjs";
import adminRoutes from "./routes/adminRoutes.mjs";

import initializePassport from "./config/passport.mjs"; 

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(compression());
app.use(rateLimit);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

