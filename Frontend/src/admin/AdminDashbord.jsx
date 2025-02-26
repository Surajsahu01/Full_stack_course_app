import React, { useEffect, useState } from 'react'
import AdminSidebar from './AdminSidebar'
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminDashbord = () => {

      const [isLogedIn, setIsLogedIn] = useState(false);
      const [userName, setUserName] = useState("");
      const navigate = useNavigate();
      const admin = JSON.parse(localStorage.getItem("AdminUser"));

  useEffect(()=>{
        const token = localStorage.getItem("AdminUser");
        
        if(token){
          setIsLogedIn(true);
          let storedUserName = localStorage.getItem("AdminId");
          if (storedUserName) {
            storedUserName = storedUserName.replace(/['"]+/g, ''); // Remove extra quotes
            storedUserName = storedUserName.charAt(0).toUpperCase() + storedUserName.slice(1).toLowerCase(); // Capitalize first letter
          }
          setUserName(storedUserName || "");
          
        }else{
          setIsLogedIn(false);
        }
      },[isLogedIn]);

  return (
    <div className='flex h-screen '>
      {
        admin?
        <>
        <AdminSidebar/>
          <div className='flex w-full items-center justify-center text-3xl '>
            <h1>Welcome {userName} !</h1>
          </div>
        </>
          :
          <div className='flex flex-col w-full items-center justify-center text-3xl '>
            <h1>Please Login First !</h1>
            
            <Link to={"/admin/login"}
            className="bg-orange-500 text-black py-2 px-6 mt-4 border border-none rounded-full hover:text-gray-300 text-xl">
              Login
            </Link>
          </div>
      }
      
    </div>
  )
}

export default AdminDashbord