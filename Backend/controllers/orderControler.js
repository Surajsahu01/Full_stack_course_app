import User from "../models/courseModel.js";
import Order from "../models/orderModel.js";
import Purchase from "../models/purchaseModel.js";
import UserDetails from "../models/userModel.js";

// export const OrderData = async (req, res) => {
//     const order = req.body;

//     try {
//         const orderData = await Order.create(order);
        
//         console.log("Order Data:", orderData);

//         const userId = orderData?.userId;
//         const courseId = orderData?.courseId;


//         const userName = await UserDetails.findById(userId);
//         const course = await User.findById(courseId);
//         res.status(201).json({message: "Order details", orderData});
        
//         if(orderData){
//             const newPurchase = new Purchase({
//                 userId,
//                 userName: userName.firstname,
//                 courseId,
//                 courseName: course.title,
//             });
//             await newPurchase.save();

//             // await Purchase.create({
//             //     userId,
//             //     userName: userName.firstname,
//             //     courseId,
//             //     courseName: course.title,
//             // });
//         }

//     }
//     catch (error) {
//         console.log("Error in order:", error);
//         res.status(500).json({error:"Error in Order"});
        
//     }

// };

export const OrderData = async (req, res) => {
    const order = req.body;
    
    try {
        const orderData = await Order.create(order);
        const userId = orderData?.user;
        const courseId = orderData?.course;
        const orders = await Order.find({ user: userId }).populate("course");
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const createOrder = async (req, res) => {
    try {
        const { paymentIntentId, courseId } = req.body;
        // const userId = await UserDetails.findById(req.user.id);

        const course = await User.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        const newOrder = new Order({
            user: userId,
            course: courseId,
            paymentId: paymentIntentId,
            amount: course.price,
            status: "Completed",
        });

        await newOrder.save();
        res.status(201).json({ success: true, message: "Order placed successfully", order: newOrder });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};