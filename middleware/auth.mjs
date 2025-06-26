import jwt from "jsonwebtoken";
import User from "../models/user.mjs";
import Vehicle from "../models/vehicle.mjs";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ message: "Not authorized" });
  }
};

export const isVehicleOwner = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    if (vehicle.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    next();
  } catch (err) {
    console.error("Authorization error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
