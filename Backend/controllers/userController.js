// import User from "../models/courseModel";
import UserDetails from "../models/userModel.js";
import bcrypt from "bcryptjs"
import { z } from "zod";
import jwt from "jsonwebtoken"
import Purchase from "../models/purchaseModel.js";
import User from "../models/courseModel.js";

export const userSignup = async(req, res) =>{
    const { firstname, lastname, email, password } = req.body;

    const UserSchema = z.object({
        firstname: z.string().min(3, {message: "fisrtName must be 3 chr log"}),
        lastname: z.string().min(3, {message: "lastName must be 3 chr log"}),
        email: z.string().email(),
        password: z.string().min(4, {message: "password must be 3 chr log"}),
      });

      const validatedData = UserSchema.safeParse(req.body);
      if(!validatedData.success){
        return res.status(400).json({error: validatedData.error.issues.map((err) => err.message) });
      }

        try {
            const existingUser = await UserDetails.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new UserDetails({ firstname, lastname, email, password: hashedPassword });

            await user.save();
            res.status(201).json({ message: 'User registered successfully' });
            
        } catch (error) {
            res.status(500).json({error:"Server Error"})
            console.log("error print", error);
            
            
        }
};

export const userLogin = async(req, res) => {
    const {email, password} = req.body;
    try {
        
        const user = await UserDetails.findOne({email});
        if(!user){
            return res.status(400).json({error:"Email not found"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({error:"Passwod not match"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '1d' });

        const cookiesOptions = {
            expires: new Date(Date.now() + 24*60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        };

        res.cookie("jwt", token, cookiesOptions);
        res.json({
            message: "Login Successfully.", 
            token, 
            user: { id: user._id, firstname: user.firstname, lastname: user.lastname, email: user.email, password: user.password } });
        
        
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }

};

export const userLogout = (req, res)=>{

    try {
        // if(!req.cookies.jwt){
        //     return res.status(401).json({error: "Kindly login First"})
        // }
        
        // res.clearCookie("jwt");
        res.clearCookie("token", { 
            httpOnly: true, 
            secure: true,  // ✅ Required for HTTPS
            sameSite: "None"  // ✅ Needed for cross-origin requests
        });
        res.status(200).json({message:"Logout successfuly"});

    } catch (error) {
        res.status(500).json({message:"Error in Logout"});
        console.log("Error in logout", error);
        
        
    }
}

export const show = async(req, res) => {
    const userId = req.body;
    try {
        // const user = await UserDetails.findById(req.user.id).select("firstName email");
        const user = await UserDetails.findById(userId);
        // res.status(200).json(message: "user");
        res.status(200).json({message: "user data", firstname: user.firstname});
    } catch (error) {
        res.status(500).json({error: "Error in fetching"})
        console.log("Error in fetching", error);
        
    }
}

export const purchaeses = async(req,res) => {
    const userId = req.userId;

    try {

        const purchased = await Purchase.find({userId});

        let purchaedCourseId = [];

        for (let i=0; i<purchased.length; i++){
            purchaedCourseId.push(purchased[i].courseId)
        }

        const courseData = await User.find({
            _id: { $in: purchaedCourseId},
        })
        
        res.status(200).json({purchased, courseData})
    } catch (error) {
        res.status(500).json({errors: "error in purchaes"})
        
    }  
}
