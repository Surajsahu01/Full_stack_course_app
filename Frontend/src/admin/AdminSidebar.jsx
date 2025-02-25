import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { MdCreateNewFolder} from "react-icons/md";
import logo from "../assets/download.png";
import toast from "react-hot-toast";

const AdminSidebar = () => {

  const [isLogedIn, setIsLogedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const location = useLocation();
  const token = localStorage.getItem("AdminUser");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setIsLogedIn(true);
      let storedUserName = localStorage.getItem("id");
      if (storedUserName) {
        storedUserName = storedUserName.replace(/['"]+/g, "");
        storedUserName = storedUserName.charAt(0).toUpperCase() + storedUserName.slice(1).toLowerCase();
      }
      setUserName(storedUserName || "");
      
    } else {
      setIsLogedIn(false);
    }
  }, []);


  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:5000/v1/admin/logout", {
        withCredentials: true,
      });
      toast.success(`Logout Successful ${userName}`, response.data.message, { duration: 3000 } );
      localStorage.removeItem("AdminUser");
      localStorage.removeItem("id");
      navigate("/admin/login");
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
    <img src={logo} alt="Logo" className="h-16 mb-1" />

    <p className='mb-6'>This is Admin Panel.</p>

    <ul className="w-full">
      <li className={`mb-4 flex items-center space-x-3 p-2 hover:text-gray-500 rounded ${getLinkClass("/")}`}>
              <FaHome />
              <Link to="/" className="w-full">Home</Link>
            </li>
      <li className={`mb-4 flex items-center space-x-3 p-2 hover:text-gray-500 rounded ${getLinkClass("/admin/ourcourses")}`}>
      <FaSearch/>
        <Link to="/admin/ourcourses" className="w-full">My Courses</Link>
      </li>
      <li className={`mb-4 flex items-center space-x-3 p-2 hover:text-gray-500 rounded ${getLinkClass("/admin/courses")}`}>
      <MdCreateNewFolder className='text-xl' />
        <Link to="/admin/courses" className="w-full">Create Courses</Link>
      </li>
      {!isLogedIn ? (
        <li className={`mb-4 flex items-center space-x-3 p-2 hover:text-gray-500 rounded ${getLinkClass("/admin/login")}`}>
          <FaSignInAlt className='text-xl' />
          <Link to="/admin/login" className="w-full">Login</Link>
        </li>
      ) : (
        <li className="flex items-center space-x-3 p-2 hover:text-red-600 rounded cursor-pointer" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout {userName}</span>
        </li>
      )}
    </ul>

    
  </div>
  )
}

export default AdminSidebar