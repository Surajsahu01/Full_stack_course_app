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
  const [userName, setUserName] = useState("");
  

  useEffect(()=>{
       const token = localStorage.getItem("user");
       if(token){
         setIsLogedIn(true);
         let storedUserName = localStorage.getItem("id");
         
         if (storedUserName) {
           storedUserName = storedUserName.replace(/['"]+/g, ''); // Remove extra quotes
           storedUserName = storedUserName.charAt(0).toUpperCase() + storedUserName.slice(1).toLowerCase(); // Capitalize first letter
         }
         setUserName(storedUserName || "");
         
       }else{
         setIsLogedIn(false);
       }
     },[]);


  const handelLogout = async()=>{
    try {
      const response = await axios.get("http://localhost:5000/v1/users/logout",{
        withCredentials: true,
      })
      toast.success("Logout Successfull",response.data.messsage);
      localStorage.removeItem("user");
      localStorage.removeItem("id");
      setIsLogedIn(false);
    } catch (error) {
      console.log("Error in loging out", error);
      toast.error(error.response.data.error || "Error in loging out");
    }
  };

  useEffect(()=>{
    const fetchCourses = async()=>{
      try {
        const response = await axios.get("http://localhost:5000/v1/course/show",
          {
            withCredentials: true
          }
        );
        
        // console.log(response.data);
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
    slidesToScroll: 2,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          centerMode: true
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true
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


          <div className="flex space-x-2  font-semibold size-sm">
            {isLogedIn? (
              <div className="flex space-x-4 ">
              <button onClick={handelLogout}
            className="bg-transparent text-white py-2 px-4 border border-white rounded hover:text-gray-300">
              Logout
            </button>
            {
              isLogedIn && (
                <div  className="flex items-center space-x-4">
                  <p className="text-gray-300 hover:text-gray-200">Welcome, {userName}</p>
                  {/* <Link to="/purchases" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Purchases</Link> */}
                </div>
                )
            }
            </div>
            ): 
            (< div className="flex space-x-2 mr-4">
            <Link 
            to="/login"  
            className="bg-transparent text-white py-2 px-4 border border-white  hover:text-gray-300 rounded-lg ">
              Login
              </Link>
              

            <Link 
            to="/Signup" 
            className="bg-transparent text-white py-2 px-4 border border-white rounded-lg hover:text-gray-300 ">
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
            <p className="text-gray-500">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque rem quod placeat necessitatibus corporis corrupti nisi quam eos! Eum ab laborum nostrum cumque neque, qui enim illo animi ea consequuntur reprehenderit molestias voluptatem fuga exercitationem necessitatibus fugit non saepe omnis error laudantium unde. Ex autem dolor numquam hic molestiae adipisci? </p>
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
                    <div className="bg-gray-900 rounded-lg overflow-hidden w-[250px] h-[260px] flex flex-col items-center">
                        
                        <img 
                        src={course.image.url} 
                        alt="" 
                        className="h-[140px] w-[235px] object-cover mt-2"/>
                        
                        <div className="p-2 text-center overflow-hidden whitespace-nowrap cursor-grab active:cursor-grabbing select-none">
                          <h1 className="inline-block text-white">{course.title}</h1>
                        </div>
                        
                        <div className="mt-auto bg-orange-500 text-white text-center py-2 px-4 rounded-full hover:bg-blue-500 duration-300 mb-4">
                          <Link to={`/buy/${course._id}`}>Enroll Now</Link>
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
      <footer className="py-8 bg-transparent text-white">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left container mx-auto px-6">
    
    {/* Left Section */}
    <div className="flex flex-col items-center md:items-start space-y-4">
      <div className="flex items-center space-x-2">
        <img src={logo} alt="Logo" className="h-7 w-7 rounded-full" />
        <h1 className="text-[18px] text-orange-500 font-bold">CourseHaven</h1>
      </div>
      <div className="mt-2">
        <p className="mb-2">Follow us</p>
        <div className="flex space-x-4">
          <a href="#"><FaFacebook className="hover:text-blue-400" /></a>
          <a href="#"><FaInstagram className="hover:text-pink-800" /></a>
          <a href="#"><FaTwitter className="hover:text-blue-400" /></a>
        </div>
      </div>
    </div>

    {/* Middle Section */}
    <div className="flex flex-col items-center md:items-center space-y-4">
      <h1 className="text-xl font-semibold">Connects</h1>
      <ul className="space-y-2 text-gray-400">
        <li className="hover:text-white duration-300 cursor-pointer">YouTube - Learn</li>
        <li className="hover:text-white duration-300 cursor-pointer">Telegram - Learn</li>
        <li className="hover:text-white duration-300 cursor-pointer">GitHub - Learn</li>
      </ul>
    </div>

    {/* Right Section */}
    <div className="flex flex-col items-center md:items-end space-y-4">
      <h1 className="text-xl font-semibold">Copyright &#169; 2024</h1>
      <ul className="space-y-2 text-gray-400">
        <li className="hover:text-white duration-300 cursor-pointer">Terms & Conditions</li>
        <li className="hover:text-white duration-300 cursor-pointer">Privacy Policy</li>
        <li className="hover:text-white duration-300 cursor-pointer">Refund & Cancellation</li>
      </ul>
    </div>

  </div>
</footer>
        
      </div>
    </div>
    
  );
};

export default Home;
