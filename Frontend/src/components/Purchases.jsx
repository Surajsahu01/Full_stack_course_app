import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import toast from "react-hot-toast";
import Sidebar from "./Sidebar";

const Purchases = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [purchases, setPurchases] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;

        if (!token) {
            toast.error("Please login to see your purchases");
            navigate("/login"); // Redirect to login page
            return;
        }

        setIsLoggedIn(true);

        const fetchPurchases = async () => {
            try {
                const response = await axios.get("http://localhost:5000/v1/users/purchase", {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });
                setPurchases(response.data.courseData);
                console.log(response.data);
                
            } catch (error) {
                console.error("Error in fetching purchases", error);
                setErrorMessage(error.response?.data?.error || "Error in fetching purchases");
            } finally {
                setLoading(false);
            }
        };

        fetchPurchases();
    }, [navigate]); // Depend on navigate to avoid unnecessary re-renders

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <nav className="bg-white shadow-md p-4  flex justify-between items-center">
                    <h2 className="text-xl font-bold">My Purchases</h2>
                </nav>

                <div className="p-5">
                    <h2 className="text-2xl font-bold mb-4">Purchased Courses</h2>

                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                        </div>
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {purchases.length > 0 ? (
                                purchases.map((course) => (
                                    <div key={course._id} className="bg-white p-2 md:p-6 shadow-md rounded-lg text-center">
                                        <img
                                            src={course.image?.url || "https://via.placeholder.com/120"}
                                            alt={course.title}
                                            className="w-50 h-30 object-cover mx-auto rounded-md mb-3"
                                        />
                                        <h3 className="text-sm font-semibold">{course.title}</h3>
                                        <p className="text-gray-500 text-xs truncate">{course.description}</p>
                                        <p className="text-green-600 font-semibold mt-2 mb-4">Rs.{course.price}</p>
                                        <button className="bg-gray-400 text-white px-4 py-2 rounded-md cursor-not-allowed">
                                            Purchased
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p>No purchases found.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Purchases;
