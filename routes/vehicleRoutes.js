const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  addVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");

router
  .route("/")
  .get(getAllVehicles) 
  .post(protect, addVehicle); 

router
  .route("/:id")
  .get(getVehicleById) 
  .put(protect, updateVehicle) 
  .delete(protect, deleteVehicle); 

module.exports = router;
