const Booking = require("../models/Booking");
const Vehicle = require("../models/vehicle");

const isAvailable = async (vehicleId, startDate, endDate) => {
  const overlapping = await Booking.findOne({
    vehicle: vehicleId,
    status: { $ne: "cancelled" },
    $or: [
      { startDate: { $lte: endDate, $gte: startDate } },
      { endDate: { $gte: startDate, $lte: endDate } },
      { startDate: { $lte: startDate }, endDate: { $gte: endDate } },
    ],
  });
  return !overlapping;
};

exports.createBooking = async (req, res) => {
  const { vehicleId, startDate, endDate, durationType } = req.body;
  const client = req.user.id;

  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle || !vehicle.availability) {
    return res.status(400).json({ message: "Vehicle not available" });
  }

  const available = await isAvailable(vehicleId, startDate, endDate);
  if (!available)
    return res
      .status(400)
      .json({ message: "Vehicle already booked for this period" });

  const days =
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
  const totalPrice = Math.ceil(days) * vehicle.pricePerDay;

  const booking = await Booking.create({
    vehicle: vehicleId,
    client,
    startDate,
    endDate,
    durationType,
    totalPrice,
  });

  res.status(201).json(booking);
};

exports.getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ client: req.user.id })
    .populate("vehicle")
    .sort({ createdAt: -1 });
  res.json(bookings);
};

exports.getBookingsForOwner = async (req, res) => {
  const vehicles = await Vehicle.find({ owner: req.user.id }).select("_id");
  const bookings = await Booking.find({ vehicle: { $in: vehicles } })
    .populate("vehicle")
    .populate("client", "fullName email");
  res.json(bookings);
};

exports.updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const booking = await Booking.findById(id).populate("vehicle");
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  // Only owner of the vehicle can confirm/cancel/complete
  if (booking.vehicle.owner.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  booking.status = status;
  await booking.save();
  res.json(booking);
};
