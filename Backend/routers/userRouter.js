import express from "express"

import {userSignup, userLogin, userLogout, purchaeses, show } from "../controllers/userController.js";
import userMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/signup', userSignup);
router.post('/login', userLogin);
router.get('/logout',userLogout);
router.get('/purchase', userMiddleware , purchaeses);
router.get('/user/:userID', userMiddleware, show);
// module.exports = userRouter;
export default router;