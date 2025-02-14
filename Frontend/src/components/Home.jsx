import React, { useEffect,useState } from "react";
import logo from '../assets/download.png'
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaTwitter } from "react-icons/fa";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";

const Home = () => {
  
   
  const [courses, setCourses]=useState([]);

  const [isLogedIn, setIsLogedIn] = useState(false);
  

  useEffect(()=>{
    const token = localStorage.getItem("user");
    if(token){
      setIsLogedIn(true);
    }else{
      setIsLogedIn(false);

    }
  },[])

  const handelLogout = async()=>{
    try {
      const response = await axios.get("http://localhost:4002/api/users/logout",{
        withCredentials: true,
      })
      toast.success("Logout Successfull",response.data.messsage);
      localStorage.removeItem("user");
      setIsLogedIn(false);
    } catch (error) {
      console.log("Error in loging out", error);
      toast.error(error.response.data.error || "Error in loging out");
    }
  };

  useEffect(()=>{
    const fetchCourses = async()=>{
      try {
        const response = await axios.get("http://localhost:4002/api/users/show",
          {
            withCredentials: true
          }
        );
        
        console.log(response.data);
        setCourses(response.data);
      } catch (error) {
        console.log("error in fetching",error);
      }
    };
    fetchCourses();

  },[]);

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 3,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  

  return (
    
    <div className="bg-gradient-to-r from-black to-blue-950">
      <div className="min-h-screen text-white container mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between py-4 ">
          <div className="flex items-center space-x-2 ">
            <img src={logo} alt="" className="h-10 w-10 rounded-full "/>
            <h1 className="text-xl text-orange-500 font-bold ">CourseHaven</h1>
            {/* <Link to="/home" className="text-xl text-orange-500 font-bold " >CourseHaven</Link> */}
          </div>


          <div className="flex space-x-2 ">
            {isLogedIn? (
              <button onClick={handelLogout}
            className="bg-transparent text-white py-2 px-4 border border-white rounded hover:text-gray-300">
              Logout
            </button>
            ): 
            (< div className="flex space-x-4 ">
            <Link 
            to="/login"  
            className="bg-transparent text-white py-2 px-4 border border-white rounded hover:text-gray-300">
              Login
              </Link>
              

            <Link 
            to="/Signup" 
            className="bg-transparent text-white py-2 px-4 border border-white rounded hover:text-gray-300">
              Signup
              </Link>
            </div>
            )
            }
            
          </div>
        </header>
      
        {/* Main section */}
        <section className="text-center py-20">
            <h1 className="text-4xl text-orange-600 font-bold">CoursHaven</h1>
            <br />
            <p className="text-gray-500">Lorem ipsum dolor sit amet, consectetur adipisicing elit. </p>
            <div className="py-6 space-x-8">
              <Link to={"/courses"}
              className="bg-green-500 font-semibold cursor-pointer py-2 px-4 duration-200
               border-black rounded hover:bg-white hover:text-black ">
                Explore Course
                </Link>

              <Link to={"/videos"}
              className=" bg-white text-black font-semibold cursor-pointer py-2 px-4 duration-200 
              border-black rounded hover:bg-green-500 hover:text-white ">
                Courses Videos
                </Link>
            </div>
         </section>


         {/* slider */}
         <section>
            <Slider {...settings}>
              {
                courses.map((course)=>(
                  <div key={course._id} className=" p-4 mb-12">
                    <div className="relative flex-shrink-0 w-64 transition-transform duration-300 transform hover:scale-105 ">
                      <div className="bg-gray-900 rounded-lg overflow-hidden w-[250px] h-[220px]">
                        
                        <img 
                        src={course.image.url} 
                        alt="" 
                        className=" mt-4 h-28 w-full object-contain"/>
                        
                        {/* <div className="p-2 text-center">
                          <h1 
                          className="text-xl font-semibold text-white">
                            {course.title}
                            </h1>
                        </div> */}
                        <div className="p-2 text-center overflow-hidden whitespace-nowrap cursor-grab active:cursor-grabbing select-none">
                          <h1 className="inline-block">{course.description}</h1>
                        </div>
                        {/* <div className=" text-center">
                          <h1>{course.price}</h1>
                        </div> */}
                        <div className="mt-2 bg-orange-500 text-white text-center py-2 px-4 rounded-full hover:bg-blue-500 duration-300">
                          <button>Enroll Now</button>
                        </div>
                      </div>
                    </div>
                  </div>

                ))

              }
                
          </Slider>

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
