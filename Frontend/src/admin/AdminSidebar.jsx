import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaDownload, FaCog, FaSignInAlt, FaSignOutAlt,FaBars,FaTimes } from "react-icons/fa";
import { MdCreateNewFolder} from "react-icons/md";
import logo from "../assets/download.png";
import toast from "react-hot-toast";

const AdminSidebar = () => {

  const [isLogedIn, setIsLogedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("AdminUser");

  useEffect(() => {
    if (token) {
      setIsLogedIn(true);
      let storedUserName = localStorage.getItem("AdminId");
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
    <>
    {/* Hamburger Icon - Mobile */}
           <div className="relative">
              <button
                className="md:hidden absolute top-4 left-4 text-black p-2 z-50 bg-gray-300 rounded-full shadow-lg"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <FaBars size={24} />
              </button>
            </div>
    
          {/* Sidebar */}
          <div
            className={`fixed inset-y-0 left-0 transform ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out bg-gray-300 w-64 p-5 flex flex-col items-center rounded-r-2xl h-screen shadow-lg z-40`}
          >
            {/* Logo */}
            <img src={logo} alt="Logo" className="h-16 mb-6" />
            <p className='mb-6'>This is Admin Panel.</p>
    
            {/* Navigation Links */}
            <ul className="w-full space-y-3">
              {[
                { to: "/", label: "Home", icon: <FaHome /> },
                { to: "/admin/ourcourses", label: "My Courses", icon: <FaSearch /> },
                { to: "/admin/courses", label: "Create Courses", icon: <MdCreateNewFolder className='text-xl' /> },
                // { to: "/settings", label: "Settings", icon: <FaCog /> },
              ].map(({ to, label, icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        isActive ? "bg-gray-400 text-white" : "hover:bg-gray-200"
                      }`
                    }
                    onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile
                  >
                    {icon}
                    <span>{label}</span>
                  </NavLink>
                </li>
              ))}
    
              {!isLogedIn ? (
                <li>
                  <NavLink
                    to="/admin/login"
                    className={({ isActive }) =>
                      `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        isActive ? "bg-gray-400 text-white" : "hover:bg-gray-200"
                      }`
                    }
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <FaSignInAlt />
                    <span>Login</span>
                  </NavLink>
                </li>
              ) : (
                <li>
                  <button
                    className="flex items-center space-x-3 p-3 w-full text-left hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt />
                    <span>Logout {userName} </span>
                  </button>
                </li>
              )}
            </ul>
          </div>
    
          {/* Background Overlay for Mobile */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
    </>
  )
}

export default AdminSidebar