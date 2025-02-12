import React, { useState } from "react";
import logo from '../assets/download.png';
import { Link } from "react-router-dom";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", { email, password });
  };

    
  return (
    <div className="bg-gradient-to-r from-black to-blue-950 ">
      
    {/* <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
        
        <form onSubmit={handleSubmit} className="mt-4">
          <div>
            <label className="block text-gray-600">Email</label>
            <input 
              type="email"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 "
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-600">Password</label>
            <input 
              type="password"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-blue-600">
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account? 
          <a href="/signup" className="text-blue-500">Sign up</a>
          <br />
          <a href="/" className="text-blue-500">Home</a>
        </p>
      </div>
    </div> */}
    <div className="min-h-screen text-white container mx-auto ">
      {/* Navbar */}
      <header className="flex items-center justify-between py-4 ">
        <div className="flex items-center space-x-2 ">
          <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
          <h1 >
          <Link to="/" className="text-xl text-orange-500 font-bold">CourseHaven</Link>
          </h1>
        </div>

        <div className="flex gap-4">
          <Link to="/login" className="bg-transparent text-white py-2 px-4 border border-white rounded hover:text-gray-300">
            Login
          </Link>
          <Link to="/signup" className="bg-transparent text-white py-2 px-4 border border-white rounded hover:text-gray-300">
            Signup
          </Link>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex flex-grow justify-center items-center h-screen">
        <div className="w-full max-w-md bg-white/10 p-6 rounded-lg shadow-md backdrop-blur-lg">
          <h2 className="text-2xl font-bold text-center text-white">Login</h2>

          <form onSubmit={handleSubmit} className="mt-4">
            <div>
              <label className="block text-white">Email</label>
              <input 
                type="email"
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
                className="w-full px-4 py-2 mt-2 border border-white rounded-lg bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-blue-600">
              Login
            </button>
          </form>

          <p className="text-center text-gray-300 mt-4">
            Don't have an account? 
            <Link to="/signup" className="text-blue-400"> Sign up</Link>
            <br />
            
          </p>
        </div>
      </div>
    </div> 

    </div> 
  )
}

export default Login