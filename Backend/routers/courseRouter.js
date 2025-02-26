import express from 'express';
import multer from 'multer';

import { addCourses, buyCourse, confirmPurchase, courseDetails, deletCourse, getAllCourse, updateCourse} from '../controllers/courseController.js';
import userMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();
// Multer configuration for file uploads
const storage = multer.diskStorage({});
const upload = multer({ storage });

// const upload = multer({
//     dest: 'uploads/', // Temporary folder to store files
//     limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
// });

// Apply multer to the route
router.post('/create', upload.single('image'), adminMiddleware, addCourses);
router.put('/update/:courseId', upload.single('image'), adminMiddleware,updateCourse);
router.delete('/delete/:courseId', adminMiddleware,deletCourse);
router.get('/show', getAllCourse);
router.get('/show/:courseId', courseDetails);

router.post('/buy', userMiddleware, buyCourse)
router.post('/confirmPurchase', userMiddleware, confirmPurchase)
export default router;
