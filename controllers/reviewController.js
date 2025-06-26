const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Vehicle = require("../models/vehicle");
const Driver = require("../models/Driver");

exports.createReview = async (req, res) => {
  const { bookingId, rating, comment } = req.body;
  const clientId = req.user.id;

  const existing = await Review.findOne({ booking: bookingId });
  if (existing) return res.status(400).json({ message: "Already reviewed" });

  const booking = await Booking.findById(bookingId).populate("vehicle");
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  if (booking.client.toString() !== clientId) {
    return res
      .status(403)
      .json({ message: "You can only review your own bookings" });
  }

  const driverDoc = await Driver.findOne({
    assignedVehicle: booking.vehicle._id,
  }).populate("user");

  const review = await Review.create({
    client: clientId,
    booking: bookingId,
    vehicle: booking.vehicle._id,
    driver: driverDoc?.user._id,
    rating,
    comment,
  });

  res.status(201).json({ message: "Review submitted", review });
};

exports.getVehicleReviews = async (req, res) => {
  const { vehicleId } = req.params;
  const reviews = await Review.find({ vehicle: vehicleId }).populate(
    "client",
    "fullName"
  );
  res.json(reviews);
};

exports.getDriverReviews = async (req, res) => {
  const { driverId } = req.params;
  const reviews = await Review.find({ driver: driverId }).populate(
    "client",
    "fullName"
  );
  res.json(reviews);
};
