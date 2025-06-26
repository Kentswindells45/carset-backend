import Vehicle from "../models/vehicle.mjs";

export const createVehicle = async (req, res) => {
  try {
    const {
      make,
      model,
      year,
      type,
      pricePerDay,
      location,
      description,
      images,
    } = req.body;

    const vehicle = await Vehicle.create({
      owner: req.user._id,
      make,
      model,
      year,
      type,
      pricePerDay,
      location,
      description,
      images,
    });

    res.status(201).json(vehicle);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create vehicle", error: err.message });
  }
};

export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ available: true }).populate(
      "owner",
      "fullName email"
    );
    res.json(vehicles);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch vehicles", error: err.message });
  }
};

export const getVehicleById = async (req, res) => {
  try {
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
