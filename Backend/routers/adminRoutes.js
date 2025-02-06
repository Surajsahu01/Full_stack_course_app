import express from "express"
import { adminLogin, adminLogout, adminSignup } from "../controllers/adminController.js";


const router = express.Router();

router.post('/signup', adminSignup);
router.post('/login', adminLogin);
router.get('/logout', adminLogout);


// module.exports = userRouter;
export default router;