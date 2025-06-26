const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    licenseNumber: { type: String, required: true },
    yearsOfExperience: { type: Number, required: true },
    verified: { type: Boolean, default: false },
    assignedVehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
    rating: { type: Number, default: 5.0 },
    totalRides: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);
