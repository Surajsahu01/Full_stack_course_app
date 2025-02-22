import axios from 'axios';
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { FaHome, FaSearch, FaDownload, FaCog, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import logo from "../assets/download.png";
import toast from "react-hot-toast";

const AdminSidebar = () => {

  const [isLogedIn, setIsLogedIn] = useState(false);
  // const [userName, setUserName] = useState("");
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("AdminUser");
    if (token) {
      setIsLogedIn(true);
      let storedUserName = localStorage.getItem("AdminUser.firstname");
      if (storedUserName) {
        storedUserName = storedUserName.replace(/['"]+/g, "");
        storedUserName = storedUserName.charAt(0).toUpperCase() + storedUserName.slice(1).toLowerCase();
      }
      // setUserName(storedUserName || "");
    } else {
      setIsLogedIn(false);
    }
  }, []);


  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:5000/v1/admin/logout", {
        withCredentials: true,
      });
      toast.success("Logout Successful", response.data.message);
      localStorage.removeItem("AdminUser");
      setIsLogedIn(false);
    } catch (error) {
      console.log("Error in logging out", error);
      toast.error(error.response?.data?.error || "Error in logging out");
    }
  };

  const getLinkClass = (path) => {
    return location.pathname === path ? "text-blue-500 font-bold" : "text-black";
  };

  return (
    <div className="w-1/5 bg-gray-300 text-black p-5 flex flex-col items-center rounded-2xl">
    <img src={logo} alt="Logo" className="h-16 mb-6" />
    <ul className="w-full">
      <li className={`mb-4 flex items-center space-x-3 p-2 hover:text-gray-500 rounded ${getLinkClass("/")}`}>
        <FaHome />
        <Link to="/" className="w-full">Home</Link>
      </li>
      <li className={`mb-4 flex items-center space-x-3 p-2 hover:text-gray-500 rounded ${getLinkClass("/courses")}`}>
        <FaSearch />
        <Link to="/courses" className="w-full">Courses</Link>
      </li>
      <li className={`mb-4 flex items-center space-x-3 p-2 hover:text-gray-500 rounded ${getLinkClass("/purchases")}`}>
        <FaDownload />
        <Link to="/purchases" className="w-full">Purchases</Link>
      </li>
      <li className={`mb-4 flex items-center space-x-3 p-2 hover:text-gray-500 rounded ${getLinkClass("/settings")}`}>
        <FaCog />
        <Link to="/settings" className="w-full">Settings</Link>
      </li>
      {!isLogedIn ? (
        <li className={`mb-4 flex items-center space-x-3 p-2 hover:text-gray-500 rounded ${getLinkClass("/login")}`}>
          <FaSignInAlt />
          <Link to="/login" className="w-full">Login</Link>
        </li>
      ) : (
        <li className="flex items-center space-x-3 p-2 hover:text-red-600 rounded cursor-pointer" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </li>
      )}
    </ul>
  </div>
  )
}

export default AdminSidebar