import User from "../models/user.mjs";
import Vehicle from "../models/vehicle.mjs";
import Booking from "../models/Booking.mjs";
import Driver from "../models/Driver.mjs";
import Transaction from "../models/Transaction.mjs";

export const getSystemStats = async (req, res) => {
  try {
    const [users, vehicles, drivers, bookings, revenueData] = await Promise.all(
      [
        User.countDocuments(),
        Vehicle.countDocuments(),
        Driver.countDocuments(),
        Booking.countDocuments(),
        Transaction.aggregate([
          { $match: { status: "paid" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
      ]
    );

    res.json({
      totalUsers: users,
      totalVehicles: vehicles,
      totalDrivers: drivers,
      totalBookings: bookings,
      totalRevenue: revenueData[0]?.total || 0,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch stats", error: error.message });
  }
};

export const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const users = await User.find({ role });
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch users by role", error: error.message });
  }
};

export const getTopRatedDrivers = async (req, res) => {
  try {
    const topDrivers = await Driver.find()
      .populate("user", "fullName email")
      .sort({ rating: -1 })
      .limit(5);

    res.json(topDrivers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch top drivers", error: error.message });
  }
};

export const getMostBookedVehicles = async (req, res) => {
  try {
    const bookings = await Booking.aggregate([
      { $group: { _id: "$vehicle", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const vehicleIds = bookings.map((b) => b._id);
    const vehicles = await Vehicle.find({ _id: { $in: vehicleIds } });

    res.json({ vehicles, counts: bookings });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch most booked vehicles",
      error: error.message,
    });
  }
};
