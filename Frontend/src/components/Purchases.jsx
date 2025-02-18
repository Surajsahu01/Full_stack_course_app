import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Sidebar from "./Sidebar";


const Purchases = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [purchase, setPurchase] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    // const [loading, setLoading] = useState(true);

   console.log("Purchases1:",purchase);
   
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("user"));
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user.token;
      const fectchPurchases = async () =>{
        if(!token){
          setErrorMessage("Please login to see your purchases");
          return;
        }
        try {
          
          const response = await axios.get("http://localhost:5000/api/users/purchase",{
            headers: {
               Authorization: `Bearer ${token}` 
              },
            withCredentials: true,
          });
          setPurchase(response.data.courseData);
          // setLoading(false);
          
          
          
        } catch (error) {
          console.log("Error in fetching purchases", error);
          setErrorMessage(error.response.data.error || "Error in fetching purchases");
          
        }
      };
      fectchPurchases();

    }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-5">
        <h1 className="text-2xl font-bold">Your Purchases</h1>
        {/* Purchases content here */}
      </div>
    </div>
  )
}

export default Purchases