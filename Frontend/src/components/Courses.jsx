import React, { useEffect,useState } from "react";
import logo from '../assets/download.png'
import { Link } from "react-router-dom";
// import { FaFacebook } from "react-icons/fa";
// import { FaInstagram } from "react-icons/fa6";
// import { FaTwitter } from "react-icons/fa";
import axios from "axios";
import Slider from "react-slick";
import toast from "react-hot-toast";
import { FaHome, FaSearch, FaDownload, FaCog, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";

const Courses = () => {

    const [courses, setCourses]=useState([]);
    const [isLogedIn, setIsLogedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [userName, setUserName] = useState("");

    // console.log("Courses1:",courses);
    

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
    

      const handleLogout = async()=>{
        try {
          const response = await axios.get("http://localhost:5000/api/users/logout",{
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
            setLoading(true); 
          try {
            const response = await axios.get("http://localhost:5000/api/users/show",
              {
                withCredentials: true
              }
            );
            
            console.log(response.data);
            setCourses(response.data);
            setFilteredCourses(response.data);
          } catch (error) {
            console.log("error in fetching",error);
            toast.error("Failed to load courses");
          }
          finally {
            setLoading(false); // Hide loader
          }
        };
        fetchCourses();
    
      },[]);

      const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = courses.filter((course) =>
          course.title.toLowerCase().includes(query)
        );
        setFilteredCourses(filtered);
      };


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-300 text-black p-5 flex flex-col items-center rounded-2xl">
        <img src={logo} alt="Logo" className="h-16 mb-6" />
        <ul className="w-full">
          <li className="mb-4 flex items-center space-x-3 p-2 hover:bg-gray-500 rounded">
            <FaHome />
            <Link to="/" className="w-full">Home</Link>
          </li>
          <li className="mb-4 flex items-center space-x-3 p-2 hover:bg-gray-500 rounded">
            <FaSearch />
            <Link to="/courses" className="w-full text-blue-6
            00">Courses</Link>
          </li>
          <li className="mb-4 flex items-center space-x-3 p-2 hover:bg-gray-500 rounded">
            <FaDownload />
            <Link to="/purchases" className="w-full">Purchases</Link>
          </li>
          <li className="mb-4 flex items-center space-x-3 p-2 hover:bg-gray-500 rounded">
            <FaCog />
            <Link to="/settings" className="w-full">Settings</Link>
          </li>
          {!isLogedIn ? (
            <li className="mb-4 flex items-center space-x-3 p-2 hover:bg-gray-500 rounded">
              <FaSignInAlt />
              <Link to="/login" className="w-full">Login</Link>
            </li>
          ) : (
            <li className="flex items-center space-x-3 p-2 hover:bg-red-600 rounded cursor-pointer" onClick={handleLogout}>
              <FaSignOutAlt />
              <span>Logout</span>
            </li>
          )}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Courses</h2>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={handleSearch}
            className="p-2  border border-gray-300 rounded-md w-1/3"
          />
          {
            isLogedIn && (
              <div  className="flex items-center space-x-4">
                <p className="text-gray-700 hover:text-gray-500">Welcome {userName}</p>
                {/* <Link to="/purchases" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Purchases</Link> */}
              </div>
              )
          }
        </nav>

        {/* Courses Section */}
        <div className="p-5">
          <h2 className="text-2xl font-bold mb-4">Available Courses</h2>

          {/* Loading Indicator */}
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
          ) :
           (

            <div className="grid grid-cols-4 gap-5">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <div key={course._id} className="bg-white p-6 shadow-md rounded-lg text-center">
                    <img
                      src={course.image.url || "https://via.placeholder.com/120"}
                      alt={course.title}
                      className="w-50 h-30 object-cover mx-auto rounded-md mb-3"
                    />
                    <h3 className="text-sm font-semibold">{course.title}</h3>
                    <p className="text-gray-500 text-xs truncate">{course.description}</p>
                    <p className="text-green-600 font-semibold mt-2 mb-4">Rs.{course.price}</p>
                    <Link to={`/buy/${course._id}`} className="bg-blue-500 text-white px-4 py-2  rounded-md hover:bg-blue-600">
                      Buy </Link>
                  </div>
                  
                ))
              ) : (
                <p>No courses found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Courses