import Booking from "../models/Booking.mjs";
import Vehicle from "../models/vehicle.mjs";

export const createBooking = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    const rentalDays = Math.ceil(
      (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = rentalDays * vehicle.pricePerDay;

    const booking = await Booking.create({
      vehicle: vehicleId,
      client: req.user._id,
      startDate,
      endDate,
      totalPrice,
    });

    res.status(201).json(booking);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create booking", error: error.message });
  }
};

export const getClientBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ client: req.user._id }).populate(
      "vehicle"
    );
    res.json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch bookings", error: error.message });
  }
};

export const getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: "vehicle",
        match: { owner: req.user._id },
      })
      .populate("client");

    const filtered = bookings.filter((b) => b.vehicle); 

    res.json(filtered);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to fetch owner bookings",
        error: error.message,
      });
  }
};
