import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import connectDB from './database_connection/db.js';
import courseRouter from './routers/courseRouter.js';
import userRouter from "./routers/userRouter.js"
import adminRouter from "./routers/adminRoutes.js"
import cookieParser from 'cookie-parser';
import orderRouter from "./routers/orderRoute.js"

// import fileUplode from "express-fileupload";
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: "GET,PUT,POST,DELETE"

}));

// Database Connection
connectDB();

// Routes
app.use('/v1/users', userRouter);
app.use('/v1/course', courseRouter);
app.use('/v1/admin', adminRouter);
app.use('/v1/order', orderRouter);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
