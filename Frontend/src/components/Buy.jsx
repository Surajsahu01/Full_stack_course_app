import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

const Buy = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState(null);
    const [clientSecret, setClientSecret] = useState("");
    const [error, setError] = useState("");
    const [cardError, setCardError] = useState("");
    const [paymentId, setPaymentId] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));
    
    const stripe = useStripe();
    const elements = useElements();
    
    // useEffect(() => { 
    //     if (user && user.token) {
    //         setIsLoggedIn(true);
    //     } else {
    //         setIsLoggedIn(false);
    //     }
    // }, []);

    useEffect(() => {
        const fetchBuyCourse = async () => {
            const user = JSON.parse(localStorage.getItem("user"));
        
            if (!user || !user.token) {
                toast.error("Please login to buy this course");
                navigate("/login");  // Redirect to login page
                return;
            }

            try {
                const token = user.token;
                const response = await axios.post(
                    `http://localhost:5000/api/users/buy/${courseId}`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true,
                    }
                );
                setCourse(response.data.course);
                setClientSecret(response.data.clientSecret);
                setLoading(false);
            } catch (error) {
                if (error.response?.status === 400) {
                    setError("User already purchased this course");
                    toast.error("User already purchased this course");
                    navigate("/purchases");  // Redirect to purchase page
                } else {
                    setError(error?.response?.data?.errors || "Something went wrong");
                }
            }
        };
        fetchBuyCourse();
    }, [courseId]);

    const handleBuy = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            console.log("Stripe or Element not found");
            return;
        }

        setLoading(true);

        const card = elements.getElement(CardElement);

        if (card == null) {
            console.log("Card Element null");
            setLoading(false);
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (error) {
            console.log('Stripe payment method error', error);
            setLoading(false);
            setCardError(error.message);
            return; // Stop further execution if there's an error
        } else {
            console.log('Payment method created', paymentMethod);
        }

        if (!clientSecret) {
            console.log("No client secret found");
            setLoading(false);
            return;
        }

        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    name: user?.user?.firstname,
                    email: user?.user?.email,
                },
            },
        });

        if (confirmError) {
            setCardError(confirmError.message);
            setLoading(false);
            return;
        }

        if (paymentIntent.status === 'succeeded') {
            setPaymentId(paymentIntent.id);
            try {
                const response = await axios.post(
                    `http://localhost:5000/api/users/confirmPurchase`,
                    {
                        paymentIntentId: paymentIntent.id,
                        courseId: courseId,
                    },
                    {
                        headers: { Authorization: `Bearer ${user.token}` },
                        withCredentials: true,
                    }
                );
                console.log("Purchase confirmed", response.data);
                navigate("/purchases");  // Redirect to purchase page after successful payment
            } catch (error) {
                console.error("Error confirming purchase", error);
                setError("Error confirming purchase");
            }
        }

        setLoading(false);
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : course ? (
                <>
                    <h1 className="text-2xl font-bold mb-4">{course.name}</h1>
                    <p className="text-lg mb-4">Price: ${course.price}</p>
                    <form onSubmit={handleBuy} className="w-full max-w-md">
                        <CardElement className="p-4 border border-gray-300 rounded-md mb-4" />
                        {cardError && <p className="text-red-500 mb-4">{cardError}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full px-6 py-3 rounded-md text-white 
                                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                        >
                            {loading ? "Processing..." : "Buy Course"}
                        </button>
                    </form>
                    {paymentId && (
                        <div className="mt-4 p-4 border border-green-500 rounded-md">
                            <p className="text-green-500">Payment successful! Your Payment ID: {paymentId}</p>
                        </div>
                    )}
                </>
            ) : (
                <p>Loading course details...</p>
            )}
        </div>
    );
};

export default Buy;