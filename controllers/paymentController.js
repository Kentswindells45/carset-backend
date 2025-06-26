const Transaction = require("../models/Transaction");
const Booking = require("../models/Booking");
const Vehicle = require("../models/vehicle");
const Driver = require("../models/Driver");
const { processStripePayment } = require("../services/paymentService");

exports.payForBooking = async (req, res) => {
  const { bookingId, paymentMethod, stripeToken } = req.body;
  const userId = req.user.id;

  const booking = await Booking.findById(bookingId).populate("vehicle");
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  if (booking.client.toString() !== userId)
    return res.status(403).json({ message: "Unauthorized" });

  const amount = booking.totalPrice;
  const ownerCommission = Math.round(amount * 0.8);
  const driverCommission = Math.round(amount * 0.2);

  let paymentResult = { status: "success" };
  if (paymentMethod === "stripe") {
    paymentResult = await processStripePayment(stripeToken, amount);
  }

  if (paymentResult.status !== "success") {
    return res
      .status(400)
      .json({ message: "Payment failed", error: paymentResult.error });
  }

  const vehicle = booking.vehicle;
  const driverDoc = await Driver.findOne({
    assignedVehicle: vehicle._id,
  }).populate("user");

  const transaction = await Transaction.create({
    booking: booking._id,
    client: booking.client,
    owner: vehicle.owner,
    driver: driverDoc ? driverDoc.user._id : null,
    amountPaid: amount,
    ownerCommission,
    driverCommission: driverDoc ? driverCommission : 0,
    paymentMethod,
    status: "success",
  });

  booking.status = "confirmed";
  await booking.save();

  res.json({ message: "Payment successful", transaction });
};

exports.getUserTransactions = async (req, res) => {
  const transactions = await Transaction.find({ client: req.user.id }).populate(
    "booking"
  );
  res.json(transactions);
};

exports.getOwnerEarnings = async (req, res) => {
  const earnings = await Transaction.find({
    owner: req.user.id,
    status: "success",
  });
  const total = earnings.reduce((sum, tx) => sum + tx.ownerCommission, 0);
  res.json({ total, transactions: earnings });
};
