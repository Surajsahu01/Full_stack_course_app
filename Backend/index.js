import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import connectDB from './database_connection/db.js';
import courseRouter from './routers/courseRouter.js';
import userRouter from "./routers/userRouter.js"
import adminRouter from "./routers/adminRoutes.js"

// import fileUplode from "express-fileupload";
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: "GET,PUT,POST,DELETE"

}));

// Database Connection
connectDB();

// Routes
app.use('/api/users', userRouter);
app.use('/api/users', courseRouter);
app.use('/api/admin', adminRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
