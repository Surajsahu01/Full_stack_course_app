
import cloudinary from 'cloudinary';
import User from "../models/courseModel.js"
import fs from 'fs';
import Purchase from '../models/purchaseModel.js';

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


export const addUser = async (req, res) => {
    const adminId = req.adminId;
    const { title, description, price } = req.body;

    try {
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
        const user = {
            title,
            description,
            price,
            image: {
                public_id: cloudinaryResult.public_id,
                url: cloudinaryResult.url,
            },
            creatorId: adminId,
        };

        // Save user to the database
        const newUser = await User.create(user);
        res.status(201).json({
            message: 'User created successfully',
            newUser,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllUsers = async (req, res) => {
        try {
            const users = await User.find();
    
            // Conditional check if no users are found
            if (users.length === 0) {
                return res.status(404).json({ message: 'No users found' });
            }
    
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

export const updateCourse = async(req, res) => {
    const adminId = req.adminId;
    const { courseId } = req.params;
    const { title, description, price, image} = req.body;

    try {
        const courseSearh = await User.findById(courseId);
        if(!courseSearh){
            res.status(404).json({error: "course not found"})
        }
        const course = await User.updateOne(
            {
                _id: courseId,
                creatorId: adminId,
            },
            {
                title,
                description,
                price,
                image:{
                    public_id: image?.public_id,
                    url: image?.url,
                },
            }
        );
        res.status(201).json({message:"Course Update Succecfully", course})
        
    } catch (error) {
        res.status(500).json({error:"Error is course updating"})
        console.log("Error is course updating", error);
        
    }
};
    

export const deletCourse = async(req, res) =>{
    const adminId = req.adminId;
    const {courseId} = req.params;
    try {
        const courseSearh = await User.findById(courseId);
        if(!courseSearh){
            res.status(404).json({error: "course not found"})
        }
        const course = await User.findByIdAndDelete({
            _id: courseId,
            creatorId: adminId,
        })
        if(!course){
            return res.status(404).json({error:"Course not Found"})
        }
        res.status(200).json({message:"Course delete successfully"})
        
    } catch (error) {
        res.status(505).json({error:"Error is course deleting"})
       console.log("Error is course deleting", error);
        
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


// export const buyCourse = async(req,res) => {
    
    // const {userId} = req;
    // const {courseId} = req.params;

    // try {
    //     const course = await User.findById(courseId);
    //     if(!course){
    //         return res.status(400).json({error: "Course Not Found"});
    //     }
    //     const existingParchase = await Purchase.findOne({userId, courseId});
    //     if(existingParchase){
    //         res.status(200).json({message: "User has already purchase this course."});
    //     }
        
    //     const newPurchase = new Purchase({userId,courseId});
    //     await newPurchase.save();
    //     res.status(201).json({message:"cousre add successfull", newPurchase})
       

    // } catch (error) {
    //     res.status(500).json({
    //         error: "Error in course buying"
    //     })
    //     console.log("Error in course buying", error);
        
        
    // }


export const buyCourse = async(req,res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id; // Retrieved from auth middleware

        // Check if the course exists
        const course = await User.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        // Check if the user already purchased the course
        const existingPurchase = await Purchase.findOne({ userId, courseId });
        if (existingPurchase) {
            return res.status(400).json({ message: 'You have already purchased this course' });
        }

        // Create a new purchase record
        const newPurchase = new Purchase({ userId, courseId });
        await newPurchase.save();

        res.status(201).json({ message: 'Course purchased successfully', purchase: newPurchase });
    } 
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
        console.log("server error", error);
        
    }

};