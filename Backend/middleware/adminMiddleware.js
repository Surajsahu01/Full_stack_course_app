import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

const adminMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_admin_SECRET);
        req.adminId = decoded.id; // Store decoded token payload

        const userExists = await Admin.findById(decoded.id);

        if (!userExists) {
            return res.status(401).json({ message: 'User not found' });
        }

        // req.userExists = {id: userExists.id, isAdmin: userExists.isAdmin};
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
// module.exports = userMiddleware;
export default adminMiddleware;
