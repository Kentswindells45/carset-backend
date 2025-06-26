import Driver from "../models/Driver.mjs";
import User from "../models/user.mjs";
import Vehicle from "../models/vehicle.mjs";

export const registerDriver = async (req, res) => {
  const { licenseNumber, experience } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (user.role !== "driver") {
      return res
        .status(403)
        .json({ message: "Only drivers can register here" });
    }

    const exists = await Driver.findOne({ user: req.user._id });
    if (exists)
      return res.status(400).json({ message: "Driver already registered" });

    const driver = await Driver.create({
      user: req.user._id,
      licenseNumber,
      experience,
    });

    res.status(201).json(driver);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Driver registration failed", error: error.message });
  }
};

export const assignDriver = async (req, res) => {
  const { driverId, vehicleId } = req.body;

  try {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle || vehicle.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You don’t own this vehicle" });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    driver.assignedVehicle = vehicleId;
    await driver.save();

    res.json({ message: "Driver assigned to vehicle", driver });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Assignment failed", error: error.message });
  }
};

export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().populate("user", "fullName email");
    res.json(drivers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get drivers", error: error.message });
  }
};
