import Review from "../models/Review.mjs";
import Booking from "../models/Booking.mjs";

export const createReview = async (req, res) => {
  const { bookingId, rating, comment } = req.body;

  try {
    const booking = await Booking.findById(bookingId).populate("vehicle");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const alreadyReviewed = await Review.findOne({ booking: bookingId });
    if (alreadyReviewed)
      return res
        .status(400)
        .json({ message: "You already submitted a review for this booking" });

    const review = await Review.create({
      booking: bookingId,
      client: req.user._id,
      vehicle: booking.vehicle._id,
      driver: booking.driver || null,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create review", error: error.message });
  }
};

export const getVehicleReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      vehicle: req.params.vehicleId,
    }).populate("client", "fullName");
    res.json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch reviews", error: error.message });
  }
};

export const getDriverReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ driver: req.params.driverId }).populate(
      "client",
      "fullName"
    );
    res.json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch reviews", error: error.message });
  }
};
