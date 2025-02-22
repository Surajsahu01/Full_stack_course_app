import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
        paymentId: { type: String, required: true },
        amount: { type: Number, required: true },
        status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
    },
    { timestamps: true }

);

const Order = mongoose.model("Order", orderSchema);
export default Order;