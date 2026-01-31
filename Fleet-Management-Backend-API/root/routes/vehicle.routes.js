import express from "express";
import {addVehicle, assignDriver, assignVehicle, getVehicles} from "../controllers/vehicle.controller.js";
import {rateLimiter} from "../middleware/rateLimiter.middleware.js";
import { get } from "http";

const router = express.Router();

router.post("/add", rateLimiter, addVehicle);
router.patch("/assign-driver/:vehicleId", assignDriver);
router.get("/:vehicleId", getVehicles);

export default router;