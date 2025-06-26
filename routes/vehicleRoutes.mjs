import express from "express";
import {
  createVehicle,
  getAllVehicles,
  getVehicleById,
} from "../controllers/vehicleController.mjs";

import { protect } from "../middleware/auth.mjs"; 
import restrictTo from "../middleware/role.mjs";

const router = express.Router();

router.get("/", getAllVehicles);
router.get("/:id", getVehicleById);

router.post("/", protect, restrictTo("owner"), createVehicle);

export default router;
