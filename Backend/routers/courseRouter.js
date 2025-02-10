import express from 'express';
import multer from 'multer';

import { addUser, buyCourse, courseDetails, deletCourse, getAllUsers, updateCourse} from '../controllers/courseController.js';
import userMiddleware from '../middleware/authMiddleware.js'
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();
// Multer configuration for file uploads
const upload = multer({
    dest: 'uploads/', // Temporary folder to store files
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Apply multer to the route
router.post('/create', upload.single('image'), adminMiddleware, addUser);
router.put('/update/:courseId', adminMiddleware,updateCourse);
router.delete('/delete/:courseId', adminMiddleware,deletCourse);
router.get('/show', getAllUsers);
router.get('/show/:courseId', courseDetails);

router.post('/buy', userMiddleware, buyCourse)
export default router;
