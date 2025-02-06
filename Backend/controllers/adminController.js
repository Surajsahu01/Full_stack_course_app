// import UserDetails from "../models/userModel.js";
import bcrypt from "bcryptjs"
import { z } from "zod";
import jwt from "jsonwebtoken"
import Admin from "../models/adminModel.js";


export const adminSignup = async(req, res) =>{
    const { firstname, lastname, email, password } = req.body;

    const adminSchema = z.object({
        firstname: z.string().min(3, {message: "fisrtName must be 3 chr log"}),
        lastname: z.string().min(3, {message: "lastName must be 3 chr log"}),
        email: z.string().email(),
        password: z.string().min(4, {message: "password must be 3 chr log"}),
      });

      const validatedData = adminSchema.safeParse(req.body);
      if(!validatedData.success){
        return res.status(400).json({error: validatedData.error.issues.map((err) => err.message) });
      }

        try {
            const existingUser = await Admin.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newAdmin = new Admin({ 
                firstname, 
                lastname, 
                email,
                password: hashedPassword });

            await newAdmin.save();
            res.status(201).json({ message: 'User registered successfully', newAdmin });
            
        } catch (error) {
            res.status(500).json({error:"Server Error"})
            console.log("error print", error);
            
            
        }
};

export const adminLogin = async(req, res) => {
    const {email, password} = req.body;
    try {
        
        const user = await Admin.findOne({email});
        if(!user){
            return res.status(400).json({error:"Invalid credentials"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({error:"Invalid credentials"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_admin_SECRET, { expiresIn: '1d' });

        

        const cookiesOptions = {
            expires: new Date(Date.now() + 24*60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
        };

        res.cookie("jwt", token);
        res.status(201).json({message:"Login Successfully.", user, token})

        // res.json({ token, user: { id: user._id, firstname: user.firstname, lastname: user.lastname, email: user.email, password: user.password } });
        
        
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }

};

export const adminLogout = (req, res)=>{
    try {
        if(!req.cookies.jwt){
            return res.status(401).json({error: "Kindly login First"})
        }
        res.clearCookie("jwt");
        res.status(200).json({message:"Logout successfuly"});

    } catch (error) {
        res.status(500).json({message:"Error in Logout"});
        console.log("Error in logout", error);
        
        
    }
}