import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Buy = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);

    // const user = JSON.parse(localStorage.getItem("user"));
    

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleBuy = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        
        if (!user || !user.token) {
            toast.error("Please login to buy this course");
            navigate("/login");  // Redirect to login page
            return;
        }

        try {
            setLoading(true);
            const token = user.token;
            const response = await axios.post(
                `http://localhost:5000/api/users/buy/${courseId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );

            toast.success(response.data.message || "Course Purchased Successfully");
            navigate("/purchases");
        } catch (error) {
            if (error.response?.status === 400) {
                toast.error("User already purchased this course");
                navigate("/purchases");
            } else {
                toast.error(error?.response?.data?.errors || "Something went wrong");
            }
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <button
                onClick={handleBuy}
                disabled={loading}
                className={`px-6 py-3 rounded-md text-white 
                     ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
            >
                {loading ? "Processing..." : "Buy Course"}
            </button>
        </div>
    );
};

export default Buy;