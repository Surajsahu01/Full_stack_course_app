import cloudinary from 'cloudinary';
import User from "../models/courseModel.js"
import Purchase from '../models/purchaseModel.js';
import UserDetails from '../models/userModel.js';
import Admin from '../models/adminModel.js';

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

export const addCourses = async (req, res) => {
    const adminId = req.adminId;
    const { title, description, price } = req.body;

    try {
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });  
        }
        // console.log("admin", admin.firstname);
        
        // Validate input fields
        if (!title || !description || !price) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Image file is required' });
        }

        // Upload the file to Cloudinary
        const cloudinaryResult = await cloudinary.v2.uploader.upload(req.file.path);
        if (!cloudinaryResult || cloudinaryResult.error) {
            return res.status(400).json({ error: 'Error uploading file to Cloudinary' });
        }

        // Create user object
        const user = new User({
            title,
            description,
            price,
            image: {
                public_id: cloudinaryResult.public_id,
                url: cloudinaryResult.url,
            },
            creatorId: adminId,
            creatorName: admin.firstname,
            creatorEmail: admin.email,

        });

        // Save user to the database
        await user.save();
        res.status(201).json({
            message: 'Course created successfully',
            user,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateCourse = async (req, res) => {
    const adminId = req.adminId;
    const { courseId } = req.params;
    const { title, description, price } = req.body;

    if (!title || !description || !price) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const courseSearch = await User.findById(courseId);

        if (courseSearch.creatorId.toString() !== adminId) {
            return res.status(403).json({ error: 'You are not authorized to update this course' });
        }
        
        if (!courseSearch) {
        return res.status(404).json({ errors: "Course not found" });
        }
        
        let imageData = courseSearch.image;

        if (req.file) {
            const cloudinaryResult = await cloudinary.v2.uploader.upload(req.file.path);
            if (!cloudinaryResult || cloudinaryResult.error) {
                return res.status(400).json({ error: "Error uploading file" });
            }
            imageData = { public_id: cloudinaryResult.public_id, url: cloudinaryResult.secure_url };
        }
        
        const course = await User.findOneAndUpdate(
            {
                _id: courseId,
                creatorId: adminId,
            },
            {
              title,
              description,
              price,
              image: imageData
            },
            { new: true, runValidators: true  }
          );
        if (!course) {
            return res.status(404).json({ error: "Course update failed" });
        }
          
          res.status(201).json({ message: "Course updated successfully", course });
    } catch (error) {
        res.status(500).json({ errors: "Error in course updating" });
        console.log("Error in course updating ", error);
    }
};
    
export const deletCourse = async(req, res) =>{
    const adminId = req.adminId;
    const {courseId} = req.params;
    try {
        const course = await User.findById(courseId);
        if(!course){
            res.status(404).json({error: "course not found"})
        }
        // const course = await User.findByIdAndDelete({
        //     _id: courseId,
        //     creatorId: adminId,
        // })
        // if(!course){
        //     return res.status(404).json({error:"Course not Found"})
        // }

        if (course.creatorId.toString() !== adminId) {
            return res.status(403).json({ error: 'You are not authorized to delete this course' });
            
        }
        await User.findByIdAndDelete(courseId);
        res.status(200).json({message:"Course delete successfully"})
        
    } catch (error) {
        res.status(505).json({error:"Error is course deleting"})
       console.log("Error is course deleting", error);
        
    }

};

export const getAllCourse = async (req, res) => {
        
    try {
        // const adminId = req.adminId; 

        // if (!adminId) {
        //     return res.status(403).json({ message: "Unauthorized access" });
        // }

        const course = await User.find();

        // Conditional check if no users are found
        if (course.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.status(200).json(course);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const courseDetails = async(req, res) =>{
    const {courseId} = req.params;
    try {
        const course = await User.findById(courseId);
        if(!course){
            return res.status(404).json({error:"Course is not found"});
        }
        res.status(200).json({course})
        
    } catch (error) {
        res.status(500).json({
            error:"Error is gatting course datilas"
        })
        
    }
}

import Stripe from "stripe"
import { create } from 'domain';
const stripe = new Stripe(process.env.STRIP_KEY);
// console.log(process.env.STRIP_KEY);

export const buyCourse = async(req,res) => {
        const {courseId} = req.body;
      
    try {
        // console.log("User ID from middleware:", req.userId); // Debugging
        const userId = req.userId; // Retrieved from auth middleware
        // const userName = await UserDetails.findById(userId);
        const course = await User.findById(courseId);

        if (!userId) {
            return res.status(400).json({ message: "User ID is missing" });
        }
         // Retrieved from auth middleware
        // Check if the course exists
        if (!course){
            return res.status(404).json({errors: "Course not found"});
        } 
        // Check if the user already purchased the course
        const existingPurchase = await Purchase.findOne({ userId, courseId });
        if (existingPurchase) {
            return res.status(400).json({ errors: 'You have already purchased this course' });
        }

        const amount = course.price;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            payment_method_types: ["card"],
            
          });
          res.status(201).json({
            message: 'Payment initiated',
            course,
            clientSecret: paymentIntent.client_secret
        });

    } 
    catch (error) {
        res.status(500).json({ errors: 'Server error', error: error.message });
        console.log("server error", error);
        
    }

};

export const confirmPurchase = async (req, res) => {
    const { paymentIntentId, courseId } = req.body;

    try {
        const userId = req.userId; // Retrieved from auth middleware
        const user = await UserDetails.findById(userId);
        const course = await User.findById(courseId);

        // Fetch user details
        const userinfo = await UserDetails.findById(userId).select("firstname lastname email");
        // console.log("Fetched User Data:", userinfo); // Debugging

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!userId) {
            return res.status(400).json({ message: "User ID is missing" });
        }

        if (!course) {
            return res.status(404).json({ errors: "Course not found" });
        }

        // Confirm the payment
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({ errors: 'Payment not successful' });
        }

        // Create a new purchase record
        const newPurchase = new Purchase({
            userId,
            userName: `${user.firstname} ${user.lastname}`, // Assuming first and last name exist
            userEmail: user.email,
            courseId,
            courseName: course.title,
            coursePrice: course.price,
            paymentId: paymentIntentId, // Save Stripe Payment ID
        });
        await newPurchase.save();

        res.status(201).json({ message: 'Course purchased successfully', purchase: newPurchase });
    } catch (error) {
        res.status(500).json({ errors: 'Server error', error: error.message });
        console.log("server error", error);
    }
};
