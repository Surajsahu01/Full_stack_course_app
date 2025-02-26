import React, { useState } from "react";
import logo from '../assets/download.png';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai'


const Signup = () => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  const [errorMessege, setErrorMessege] = useState("");
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate(role === "user" ? "/singup" : "/admin/signup");
    console.log(`Logging in as ${role}:`, { email, password });
    try {
      const response = await axios.post("http://localhost:5000/v1/users/signup", {
        firstname,
        lastname,
        email,
        password,
      },
    {
      withCredentials: true,
      headers:{
        "Content-Type":"application/json",
      },
    })
      // console.log("Signup Data:", {firstname,lastname, email, password });
      console.log("signup response:", response.data);
      alert(response.data.message);
      // setSuccessMessege(message.response.data.message); 

      // window.location.href = "/login";
      navigate("/login");
    } catch (error) {
      if (error.response) {
        console.error("Error in signup:", error.response.data);
        // alert(error.response.data.error);
        setErrorMessege(error.response.data.error)
      } else {
        console.error("Signup request failed", error);
        // alert("Something went wrong! Please try again.");
        setErrorMessege("Something went wrong! Please try again.");
      }
      
    }
  
  };
  return (
    <>
    
  <div className="bg-gradient-to-r from-black to-blue-950 ">
  <div className="min-h-screen text-white container mx-auto ">
      {/* Navbar */}
      <header className="flex items-center justify-between py-4 ">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
          <h1 >
              <Link to="/" className="text-xl text-orange-500 font-bold">CourseHaven</Link>
              </h1>
        </div>

        <div className="flex gap-4">
          <Link to="/login" className="bg-transparent text-white py-2 px-4 border border-white rounded hover:text-gray-300">
            Login
          </Link>
          <Link to="/signup" className="bg-orange-500 text-white py-2 px-4 border border-white rounded hover:text-gray-300">
            Join now
          </Link>
        </div>
      </header>

      {/* Signup Form */}
      <div className="flex flex-grow justify-center items-center h-screen">
        <div className="w-full max-w-md bg-white/10 p-6 rounded-lg shadow-md backdrop-blur-lg">
          <h2 className="text-2xl font-bold text-center text-white">{role === "user" ? "User Sign Up" : "Admin Sign Up"}</h2>
          <div className="flex justify-center mt-4 mb-4">
                                  <Link to={"/singup"}
                                    className={`${role === "user" 
                                      ? "bg-white/11 text-richblack-5"
                                      : "bg-transparent text-richblack-200"} py-2 px-5 rounded-full transition-all duration-200`}
                                    onClick={() => setRole("user")}
                                  >
                                    User
                                  </Link>
                                  <Link to={"/admin/signup"}
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
              <label className="block text-white">First Name</label>
              <input 
                type="text"
                id="firstname"
                className="w-full px-4 py-2 mt-2 mb-2 border border-white rounded-lg bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your first name"
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              </div>
              <div>
              <label className="block text-white">Last Name</label>
              <input 
                type="text"
                id="lastname"
                className="w-full px-4 py-2 mt-2 mb-2 border border-white rounded-lg bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your last name"
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              </div>
              
            <div>
              <label className="block text-white">Email</label>
              <input 
                type="email"
                id="email"
                className="w-full px-4 py-2 mt-2 mb-[-10px] border border-white rounded-lg bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                required
              />
            </div>
            

            {
              errorMessege && (
                <div className="text-red-500 mt-4  text-center">
                  {
                    errorMessege 
                  }
                </div>
              )
            }
            <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2  mt-5 rounded-lg hover:bg-blue-600 duration-300">
              Signup
            </button>
          </form>

          <p className="text-center text-gray-300 mt-2">
            Already have an account? 
            <Link to="/login" className="text-blue-400"> Login</Link>
          </p>
        </div>
      </div>
    </div>
  </div>


    </>
  );
};

export default Signup;
