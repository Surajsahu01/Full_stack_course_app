import express from 'express';
import cors from "cors";
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
app.use(cookieParser()); 
app.use(express.urlencoded({ extended: true }));
// app.use(cors({
//     origin: "*", 
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"]

// }));

 // ✅ Add your frontend domain

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || process.env.FRONTEND_URL.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // ✅ Required for cookies, authentication, sessions
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


// Database Connection
connectDB();

// Routes
app.use('/v1/users', userRouter);
app.use('/v1/course', courseRouter);
app.use('/v1/admin', adminRouter);


const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
