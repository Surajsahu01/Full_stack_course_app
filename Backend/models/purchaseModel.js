import mongoose from 'mongoose';


const purchaseSchema = new mongoose.Schema({
    userId: 
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'UserDetails', 
        required: true 
    },
    userName: { 
        type: String, 
        required: true 
    },
    userEmail: {
        type: String,
        required: true
    },
    courseId: 
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    courseName: { 
        type: String, 
        required: true 
    },
    coursePrice: { 
        type: Number, 
        required: true 
    },
    paymentId: {
        type: String,
        required: true,
        unique: true, // Ensure no duplicate payments
    },
    purchasedAt: 
    { 
        type: Date, 
        default: Date.now 
    }
    
    
});

// export const Course = mongoose.model("Course", CourseSchema);
const Purchase = mongoose.model('Purchase', purchaseSchema);
export default Purchase;