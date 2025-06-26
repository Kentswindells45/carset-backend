import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import compression from "compression";

import connectDB from "./config/db.mjs";
import rateLimit from "./middleware/rateLimit.mjs";
import { errorHandler } from "./middleware/errorHandler.mjs";

import userRoutes from "./routes/userRoutes.mjs";
import vehicleRoutes from "./routes/vehicleRoutes.mjs";
import driverRoutes from "./routes/driverRoutes.mjs";
import bookingRoutes from "./routes/bookingRoutes.mjs";
import paymentRoutes from "./routes/paymentRoutes.mjs";
import reviewRoutes from "./routes/reviewRoutes.mjs";
import adminRoutes from "./routes/adminRoutes.mjs";

dotenv.config();
const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(compression());
app.use(rateLimit); 

app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);
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
