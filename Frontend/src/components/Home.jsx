import React from "react";
import logo from '../assets/download.png'
import { Link } from "react-router-dom";


const Home = () => {
  return (
    // <div className="flex justify-center items-center h-screen text-3xl font-bold text-gray-700">
    //   Welcome to Home Page
    // </div>
    

    <div className="bg-gradient-to-r from-black to-blue-950">
      <div className=" text-white container mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between py-4 ">
          <div className="flex items-center space-x-2 ">
            <img src={logo} alt="" className="h-10 w-10 rounded-full "/>
            <h1 className="text-xl text-orange-500 font-bold ">CourseHaven</h1>
            {/* <Link to="/home" className="text-xl text-orange-500 font-bold " >CourseHaven</Link> */}
          </div>


          <div className="flex space-x-2 ">
            <Link to="/login"  className="bg-transparent text-white py-2 px-4 border border-white rounded hover:text-gray-300">Login</Link>
            <Link to="/Signup" className="bg-transparent text-white py-2 px-4 border border-white rounded hover:text-gray-300">Signup</Link>
          </div>
        </header>

      
        {/* Main section */}
        {/* <div className="h-screen">

        </div> */}

        {/* Footer */}
      </div>
    </div>
    
  );
};

export default Home;
