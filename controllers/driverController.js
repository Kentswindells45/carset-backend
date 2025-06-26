const Driver = require("../models/Driver");
const Vehicle = require("../models/vehicle");

exports.registerDriver = async (req, res) => {
  const { licenseNumber, yearsOfExperience } = req.body;
  const user = req.user;

  if (user.role !== "driver") {
    return res.status(403).json({
      message: 'Only users with role "driver" can register as a driver',
    });
  }

  const existing = await Driver.findOne({ user: user.id });
  if (existing)
    return res.status(400).json({ message: "Already registered as driver" });

  const driver = await Driver.create({
    user: user.id,
    licenseNumber,
    yearsOfExperience,
  });

  res.status(201).json(driver);
};

exports.verifyDriver = async (req, res) => {
  const { id } = req.params;
  const driver = await Driver.findById(id);
  if (!driver) return res.status(404).json({ message: "Driver not found" });

  driver.verified = true;
  await driver.save();
  res.json({ message: "Driver verified", driver });
};

exports.assignDriver = async (req, res) => {
  const { driverId, vehicleId } = req.body;

  const driver = await Driver.findById(driverId);
  const vehicle = await Vehicle.findById(vehicleId);

  if (!driver || !vehicle)
    return res.status(404).json({ message: "Driver or vehicle not found" });

  driver.assignedVehicle = vehicle._id;
  await driver.save();

  res.json({ message: "Driver assigned to vehicle", driver });
};

exports.getDrivers = async (req, res) => {
  const drivers = await Driver.find().populate("user", "fullName email");
  res.json(drivers);
};

exports.getDriverById = async (req, res) => {
  const driver = await Driver.findById(req.params.id)
    .populate("user", "fullName email")
    .populate("assignedVehicle");

  if (!driver) return res.status(404).json({ message: "Driver not found" });
  res.json(driver);
};
