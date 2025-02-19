import jwt from "jsonwebtoken";
import UserDetails from "../models/userModel.js";




// const userMiddleware = async (req, res, next) => {
    // const token = req.header('x-auth-token');
//     const authHeader = req.header.authorization;
//     console.log(authHeader);
    

//     if(!authHeader || !authHeader.startWith("Bearer")){
//         return res.status(401).json({ error: 'No token, authorization denied' });

//     }
//     // 
//     const token = authHeader.split(" ")[1];
//     console.log("Token: " + token);
    
//     // 
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log("decoded :" + decoded);
        
//         const num = (req.userId = decoded.id);

//         console.log("userId : " + num);
        
//         next();
        
//     } catch (error) {
//         res.status(400).json({ message: 'Invalid token' });
//     }
// };


const userMiddleware = async (req, res, next) => {
    
        const token = req.header('Authorization');
        if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });
        
    try{
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.userId = decoded.id; // Store decoded token payload

        const userExists = await UserDetails.findById(decoded.id);

        if (!userExists) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.userExists = {id: userExists.id, isAdmin: userExists.isAdmin};
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
// module.exports = userMiddleware;
export default userMiddleware;