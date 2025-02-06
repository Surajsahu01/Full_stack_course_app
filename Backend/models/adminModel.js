import mongoose from 'mongoose';


const adminSchema = new mongoose.Schema({
    firstname: { 
        type: String, 
        required: true 
    },
    lastname: { 
        type: String, 
        required: true
    },
    email: { 
        type: String,
        unique: true, 
        required: true 
    },
    password:{
        type: String,
        required: true
    }
    // isAdmin: 
    // { 
    //     type: Boolean, 
    //     default: false 
    // } 
    
});

// export const Course = mongoose.model("Course", CourseSchema);
const Admin = mongoose.model('Admin', adminSchema);
export default Admin;