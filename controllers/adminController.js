const User = require("../models/user");
const Vehicle = require("../models/vehicle");
const Booking = require("../models/Booking");
const Driver = require("../models/Driver");
const Transaction = require("../models/Transaction");
const Review = require("../models/Review");

exports.getSystemStats = async (req, res) => {
  const [users, vehicles, drivers, bookings, revenueData] = await Promise.all([
    User.countDocuments(),
    Vehicle.countDocuments(),
    Driver.countDocuments(),
    Booking.countDocuments(),
    Transaction.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, total: { $sum: "$amountPaid" } } },
    ]),
  ]);

  res.json({
    totalUsers: users,
    totalVehicles: vehicles,
    totalDrivers: drivers,
    totalBookings: bookings,
    totalRevenue: revenueData[0]?.total || 0,
  });
};

exports.getUsersByRole = async (req, res) => {
  const { role } = req.params;
  const users = await User.find({ role });
  res.json(users);
};

exports.getTopRatedDrivers = async (req, res) => {
  const topDrivers = await Driver.find({ verified: true })
    .populate("user", "fullName email")
    .sort({ rating: -1 })
    .limit(5);
  res.json(topDrivers);
};

exports.getMostBookedVehicles = async (req, res) => {
  const bookings = await Booking.aggregate([
    { $group: { _id: "$vehicle", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  const vehicleIds = bookings.map((b) => b._id);
  const vehicles = await Vehicle.find({ _id: { $in: vehicleIds } });
  res.json({ vehicles, counts: bookings });
};
