import express from 'express';

import dotenv from 'dotenv';
import connectDB from './database_connection/db.js';
import courseRouter from './routers/courseRouter.js';
import userRouter from "./routers/userRouter.js"
import adminRouter from "./routers/adminRoutes.js"
import cookieParser from 'cookie-parser';
// import fileUplode from "express-fileupload";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


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
