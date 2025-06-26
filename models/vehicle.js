const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number },
    type: { type: String, enum: ["new", "used"], default: "used" },
    specs: {
      seats: Number,
      transmission: String,
      fuel: String,
      color: String,
    },
    pricePerDay: { type: Number, required: true },
    availability: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema);
