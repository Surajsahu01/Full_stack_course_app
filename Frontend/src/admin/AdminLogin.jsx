import React from 'react'
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import logo from "../assets/download.png";
import { BACKEND_URL } from "../utils/utils";
const AdminLogin = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errorMessege, setErrorMessege] = useState("");
  const [role, setRole] = useState("admin");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(`Logging in as ${role}:`, { email, password });
    navigate(role === "user" ? "/login" : "/admin/login");
  

    try {
      const response = await axios.post(`${BACKEND_URL}/admin/login`, {
        email,
        password,
      },
    {
      withCredentials: true,
      headers:{
        "Content-Type":"application/json",
      },
    })
      // console.log("Signup Data:", response.data.user.firstname);
      // console.log("loging Successfully:", response.data);

      localStorage.setItem("AdminUser", JSON.stringify(response.data));
      localStorage.setItem("AdminId", JSON.stringify(response.data.user.firstname));
      // alert(response.data.message); 
      toast.success(response.data.message);


      // window.location.href = "/login";
      navigate("/admin/dashboard");
    } catch (error) {
      if (error.response) {
        console.error("Error in login:", error.response.data);
        // alert(error.response.data.error);
        setErrorMessege(error.response.data.error);
      } else {
        console.error("login request failed", error);
        // alert("Something went wrong! Please try again.");
        setErrorMessege("Something went wrong! Please try again.");
      }
      
    }
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950 ">
        <div className="min-h-screen text-white container mx-auto ">
          {/* Navbar */}
          <header className="flex items-center justify-between py-4 ">
            <div className="flex items-center space-x-2 ">
              <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
              <h1 >
              <Link to="/" className="text-xl text-orange-500 font-bold">CourseHaven</Link>
              </h1>
            </div>
    
            <div className="flex gap-2">
              <Link to="/admin/signup" className="bg-transparent text-white py-2 px-4 border  rounded hover:text-gray-300">
                Signup
              </Link>
              <Link to="/admin/login" className="bg-orange-500 text-white py-2 px-4 border  rounded hover:text-gray-300">
                Join now
              </Link>
            </div>
          </header>
    
          {/* Login Form */}
          <div className="flex flex-grow justify-center items-center h-screen">
            <div className="w-full max-w-md bg-white/10 p-6 rounded-lg shadow-md backdrop-blur-lg">
              <h2 className="text-2xl font-bold text-center text-white">{role === "user" ? "User Login" : "Admin Login"}</h2>

                {/* Toggle Button */}
                      <div className="flex justify-center mt-4 mb-4">
                        <Link to={"/login"}
                          className={`${role === "user" 
                            ? "bg-white/11 text-richblack-5"
                            : "bg-transparent text-richblack-200"} py-2 px-5 rounded-full transition-all duration-200`}
                          onClick={() => setRole("user")}
                        >
                          User
                        </Link>
                        <Link to={"/admin/login"}
                          className={`${role === "admin" 
                            ? "bg-white/11 text-richblack-5"
                            : "bg-transparent text-richblack-200"} py-2 px-5 rounded-full transition-all duration-200`}
                          onClick={() => setRole("admin")}
                        >
                          Admin
                        </Link>
                        </div>
    
              <form onSubmit={handleSubmit} className="mt-4">
                <div>
                  <label className="block text-white">Email</label>
                  <input 
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 mt-2 border border-white rounded-lg bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-white">Password</label>
                  <input 
                    type="password"
                    id="password"
                    className="w-full px-4 py-2 mt-2 border border-white rounded-lg bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                  {
                    errorMessege && (
                      <div className="text-red-500 mt-2 text-center">
                        {errorMessege}
                      </div>
                    )
                  }
    
                <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-blue-600">
                  Login
                </button>
              </form>
    
              <p className="text-center text-gray-300 mt-4">
                Don't have an account? 
                <Link to="/admin/signup" className="text-blue-400"> Sign up</Link>
                <br />
                
              </p>
            </div>
          </div>
        </div> 
    
        </div> 
  )
}

export default AdminLogin