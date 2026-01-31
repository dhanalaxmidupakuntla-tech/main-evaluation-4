import express from "express";
import {createTrip, endTrip} from "../controllers/trip.controller.js";

const router = express.Router();
router.post("/create", createTrip);
router.post("/end/:tripId", endTrip);

export default router;