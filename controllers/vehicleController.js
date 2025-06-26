const Vehicle = require("../models/vehicle");

exports.addVehicle = async (req, res) => {
  const { make, model, year, type, specs, pricePerDay } = req.body;
  const owner = req.user.id;

  const vehicle = await Vehicle.create({
    owner,
    make,
    model,
    year,
    type,
    specs,
    pricePerDay,
  });

  res.status(201).json(vehicle);
};

exports.getAllVehicles = async (req, res) => {
  const vehicles = await Vehicle.find().populate("owner", "fullName email");
  res.json(vehicles);
};

exports.getVehicleById = async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id).populate(
    "owner",
    "fullName email"
  );
  if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
  res.json(vehicle);
};

exports.updateVehicle = async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

  if (vehicle.owner.toString() !== req.user.id) {
    return res
      .status(403)
      .json({ message: "Not authorized to update this vehicle" });
  }

  Object.assign(vehicle, req.body);
  await vehicle.save();
  res.json(vehicle);
};

exports.deleteVehicle = async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

  if (vehicle.owner.toString() !== req.user.id) {
    return res
      .status(403)
      .json({ message: "Not authorized to delete this vehicle" });
  }

  await vehicle.remove();
  res.json({ message: "Vehicle deleted" });
};
