import mongoose from 'mongoose';


const purchaseSchema = new mongoose.Schema({
    userId: 
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'UserDetails', 
        required: true 
    },
    courseId: 
    { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
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