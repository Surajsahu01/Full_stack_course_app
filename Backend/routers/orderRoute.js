import express from 'express';
import { createOrder, OrderData } from '../controllers/orderControler.js';
import userMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

// router.get("/order", userMiddleware, OrderData);
router.get("/", userMiddleware, OrderData);
router.post("/create", userMiddleware, createOrder);

export default router;