import React from "react";
import logo from '../assets/download.png'
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";



const Home = () => {
  return (
    // <div className="flex justify-center items-center h-screen text-3xl font-bold text-gray-700">
    //   Welcome to Home Page
    // </div>
    

    <div className="bg-gradient-to-r from-black to-blue-950">
      <div className="h-screen text-white container mx-auto">
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
        <section className="text-center py-20">
            <h1 className="text-4xl text-orange-600 font-bold">CoursHaven</h1>
            <br />
            <p className="text-gray-500">Lorem ipsum dolor sit amet, consectetur adipisicing elit. </p>
            <div className="py-6 space-x-8">
              <button className="bg-green-500 font-semibold cursor-pointer py-2 px-4 duration-200 border-black rounded hover:bg-white hover:text-black ">Explore Course</button>
              <button className=" bg-white text-black font-semibold cursor-pointer py-2 px-4 duration-200 border-black rounded hover:bg-green-500 hover:text-white ">Courses Videos</button>
            </div>
         </section>


         {/* slider */}
         <section>

         </section>


        {/* Footer */}

      <hr />
      <footer className="py-8">
        <div className=" grid grid-cols-1 md:grid-cols-3">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2 ">
                <img src={logo} alt="" className="h-7 w-7 rounded-full "/>
                <h1 className="text-[18px] text-orange-500 font-bold ">CourseHaven</h1>

             </div>

              <div className="mt-2 ml-2 md:ml-8">
                    <p className="mb-2">Follow us</p>
                        <div className="flex space-x-4 ">
                            <a href="">
                              <FaFacebook className="hover:text-blue-400"/>
                              </a>
                            <a href="">
                              <FaInstagram className="hover:text-pink-800"/>
                              </a>
                            <a href="">
                              <FaTwitter className="hover:text-blue-400"/>
                              </a>
                        </div>
                  </div>
              </div>

            <div className="items-center flex flex-col ">
                <h1 className="text-xl font-semibold mb-4 ">
                  Conects
                </h1>
                <ul className="space-y-2 text-gray-400">
                  <li className="hover:text-white duration-300 cursor-pointer">Youtube- Learn </li>
                  <li className="hover:text-white duration-300 cursor-pointer">Telegam- Learn</li>
                  <li className="hover:text-white duration-300 cursor-pointer">Github-  Learn</li>
                </ul>
              </div>


              <div className="items-center flex flex-col ">
                <h1 className="text-xl font-semibold mb-4 ">Copyright &#169; 2024
                </h1>
                <ul className="px-1 space-y-2 text-gray-400">
                  <li className="hover:text-white duration-300 cursor-pointer">Term & Condition </li>
                  <li className="hover:text-white duration-300 cursor-pointer">Privacy Policy</li>
                  <li className="hover:text-white duration-300 cursor-pointer">Refund & Concellection</li>
                </ul>
              </div>
            
        </div>
      </footer>
        
      </div>
    </div>
    
  );
};

export default Home;
