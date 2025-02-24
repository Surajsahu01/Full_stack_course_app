
import cloudinary from 'cloudinary';
import User from "../models/courseModel.js"
import fs from 'fs';
import Purchase from '../models/purchaseModel.js';
import UserDetails from '../models/userModel.js';
import Admin from '../models/adminModel.js';

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Add User
// export const addUser = async (req, res) => {
//     const { title, description, price } = req.body;
//     console.log(title, description, price);
    
//     try {
//         // Conditional validations
//         if (!title || !description || !price) {
//             return res.status(400).json({ error: 'All fields (name, email, address) are required' });
//         }
//         // const {image} = req.files
//         if (!req.file) {
//             return res.status(400).json({ error: 'Image file is required' });
//         }
//         // const allowedFlornt = ["image/jpg","image/png"]
//         // if(!allowedFlornt.includes(image.mimetype)){
//         //     return res.status(400).json({error: "Invalid file formte. Only PNG and JPG are allowerd"});
//         // }

//         // const localPath = req.file.path;

//         // Upload image to Cloudinary
//         // const cloudinaryResult = await cloudinary.v2.uploader.upload(localPath);
//         const cloudinaryResult = await cloudinary.v2.uploader.upload(req.file.path);
//         if(!cloudinaryResult || cloudinaryResult.error){
//             return res.status(400).json({error: "Error uploading file to cloude=inary"});
//         }


//         // Check if user already exists
//         // const existingUser = await User.findOne({ email });
//         // if (existingUser) {
//         //     fs.unlinkSync(localPath); // Remove the uploaded file
//         //     return res.status(409).json({ error: 'User with this email already exists' });
//         // }

//         // Create User
//         const user = {
//             title,
//             description,
//             price,
//             // image: cloudinaryResult.secure_url,
//             image:{
//                 public_id: cloudinaryResult.public_id,
//                 url: cloudinaryResult.url,
//             },
//             // localImagePath: localPath,
//         };

//         // await user.save();
//         // res.status(201).json({ message: 'User added successfully', user });

//         const course = await User.create(user);
//         res.json({
//             message:"Course created successfully",
//             course,
//         });

//         // Optionally delete the local file after successful upload
//         // fs.unlinkSync(localPath);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({error: "error creating course"})
        
//     }
// };

// // Get All Users
// export const getAllUsers = async (req, res) => {
//     try {
//         const users = await Course.find();

//         // Conditional check if no users are found
//         if (users.length === 0) {
//             return res.status(404).json({ message: 'No users found' });
//         }

//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Delete User by ID (Example of additional conditional logic)
// export const deleteUser = async (req, res) => {
//     try {
//         const { id } = req.params;

//         // Check if ID is provided
//         if (!id) {
//             return res.status(400).json({ error: 'User ID is required' });
//         }

//         const user = await User.findById(id);

//         // Check if user exists
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Remove user's local image file
//         if (user.localImagePath && fs.existsSync(user.localImagePath)) {
//             fs.unlinkSync(user.localImagePath);
//         }

//         // Delete user from the database
//         await user.deleteOne();
//         res.status(200).json({ message: 'User deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };


export const addCourses = async (req, res) => {
    const adminId = req.adminId;
    const { title, description, price } = req.body;

    try {
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });  
        }
        console.log("admin", admin.firstname);
        
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
            message: 'User created successfully',
            user,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateCourse = async(req, res) => {
    const adminId = req.adminId;
    const { courseId } = req.params;
    const { title, description, price, image} = req.body;

    try {
        // const course = await User.findById(courseId);
        // if(!course){
        //     res.status(404).json({error: "course not found"})
        // }

        // if(course.creatorId.toString() !== adminId){
        //     return res.status(403).json({error: "You are not authorized to update this course"});
        // }

        // Step 1: Check if the course exists
        const existingCourse = await User.findById(courseId);
        if (!existingCourse) {
            return res.status(404).json({ error: "Course not found" });
        }

        // Step 2: Ensure only the creator can update the course
        if (existingCourse.creatorId.toString() !== adminId) {
            return res.status(403).json({ error: "Unauthorized to update this course" });
        }

         // Step 3: Prepare update object
         const updateFields = {};
         if (title) updateFields.title = title;
         if (description) updateFields.description = description;
         if (price) updateFields.price = price;
 
         // Step 4: Handle image update using Cloudinary
        if (req.file) {  // If a new image file is uploaded
            // Delete old image from Cloudinary
            if (existingCourse.image && existingCourse.image.public_id) {
                await cloudinary.v2.uploader.destroy(existingCourse.image.public_id);
            }

            // Upload new image to Cloudinary
            const cloudinaryResult = await cloudinary.v2.uploader.upload(req.file.path);
            if (!cloudinaryResult || cloudinaryResult.error) {
                return res.status(400).json({ error: 'Error uploading file to Cloudinary' });
            }

            updateFields.image = {
                public_id: cloudinaryResult.public_id,
                url: cloudinaryResult.secure_url,
            };
        }

        // const course = await User.updateOne(
        //     {
        //         _id: courseId,
        //         creatorId: adminId,
        //     },
        //     {
        //         title,
        //         description,
        //         price,
        //         image:{
        //             public_id: image?.public_id,
        //             url: image?.url,
        //         },
        //     }
        // );


        // Step 5: Update the course and return the new updated document
        const updatedCourse = await User.findByIdAndUpdate(
            courseId,
            { $set: updateFields },
            { new: true, runValidators: true } // Ensures updated document is returned and validated
        );
        res.status(200).json({message:"Course Update Succecfully", updatedCourse })
        
    } catch (error) {
        res.status(500).json({error:"Error is course updating"})
        console.log("Error is course updating", error);
        
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


// import Stripe from "stripe"
// const stripe = new Stripe(process.env.STRIP_KEY);
// console.log(process.env.STRIP_KEY);

// export const buyCourse = async(req,res) => {
    
//     const {userId} = req;
//     const {courseId} = req.params;
//     const userName = await UserDetails.findById(userId);
//     const course = await User.findById(courseId);

//     try {
//         const course = await User.findById(courseId);
//         if(!course){
//             return res.status(404).json({error: "Course Not Found"});
//         }
//         const existingParchase = await Purchase.findOne({userId, courseId});
//         if(existingParchase){
//             res.status(400).json({error: "User has already purchase this course."});
//         }

//         // strip payment code gose here
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: course.price ,
//             payment_method_types: ['card'],
//             currency: "usd",
//             // automatic_payment_methods: {
//             //     enabled: true,
//             // },
//         });

        
//         const newPurchase = new Purchase({
//             userId,
//             userName: userName.firstname,
//             courseId,
//             courseName: course.title,
            
//             courseId});
//         await newPurchase.save();
//         res.status(201).json({message:"cousre add successfull", clientSecret: paymentIntent.client_secret});
       

//     } catch (error) {
//         res.status(500).json({
//             error: "Error in course buying"
//         })
//         console.log("Error in course buying", error);
        
        
//     }
// }


import Stripe from "stripe"
import { create } from 'domain';
const stripe = new Stripe(process.env.STRIP_KEY);
console.log(process.env.STRIP_KEY);

export const buyCourse = async(req,res) => {
        const {courseId} = req.params;
      
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
        console.log("Fetched User Data:", userinfo); // Debugging

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
