import mongoose from "mongoose";
import Vehicle from "../models/vehicle.mjs";

export const createVehicle = async (req, res) => {
  try {
    const vehicleData = {
      ...req.body,
      owner: req.user._id,
    };

    const vehicle = new Vehicle(vehicleData);
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: "Failed to create vehicle", error: error.message });
  }
};

export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate("owner", "fullName email");
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vehicles", error: error.message });
  }
};

export const getVehicleById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid vehicle ID" });
    }
    const vehicle = await Vehicle.findById(req.params.id).populate(
      "owner",
      "fullName email"
    );
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching vehicle", error: err.message });
      
  }
};
