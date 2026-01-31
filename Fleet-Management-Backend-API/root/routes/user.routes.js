import express from 'express';
import { regiterUser } from '../controllers/user.controller.js';

const router = express.Router();

router.post("/signup", regiterUser);

export default router;