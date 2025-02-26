import React, { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import toast from "react-hot-toast";
import {Menu} from "lucide-react";
import { FaSearch } from "react-icons/fa";
import { BACKEND_URL } from "../utils/utils";



const Courses = () => {
    const [showSidebar, setShowSidebar] = useState(false);

    const [courses, setCourses]=useState([]);
    const [isLogedIn, setIsLogedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [userName, setUserName] = useState("");
    const [expandedCourse, setExpandedCourse] = useState(null);

    // console.log("Courses1:",courses);
    const toggleSidebar = () => {
      setShowSidebar(!showSidebar);
    }
    

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
    

      

      useEffect(()=>{
        const fetchCourses = async()=>{
            setLoading(true); 
          try {
            const response = await axios.get(`${BACKEND_URL}/course/show`,
              {
                withCredentials: true
              }
            );
            
            // console.log(response);
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
    <div className="flex h-full md:h-screen bg-gray-100">
      {/* Sidebar - Show only on larger screens or when toggled */}
      
        <Sidebar />
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
          {/* Hamburger Icon - Show only on mobile */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleSidebar}
          >
            <Menu size={28} />
          </button>

          <h2 className="text-xl font-bold">Courses</h2>

          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={handleSearch}
            className="p-2 border border-gray-300 rounded-md w-1/3"
          />

          {isLogedIn && (
            <div className="flex items-center space-x-4">
              <p className="text-gray-700 hover:text-gray-500">Welcome {userName}</p>
            </div>
          )}
        </nav>

        {/* Courses Section */}
        <div className="p-5">
          <h2 className="text-2xl font-bold mb-4">Available Courses</h2>

          {/* Loading Indicator */}
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white p-4 shadow-md rounded-lg text-center"
                  >
                    <img
                      src={course.image.url || "https://via.placeholder.com/120"}
                      alt={course.title}
                      className="w-50 h-30 object-cover mx-auto rounded-md mb-3"
                    />
                    <h3 className="text-sm font-semibold">{course.title}</h3>
                    <p className="text-gray-500 text-xs ">
                    {expandedCourse === course._id
                            ? course.description
                            : `${course.description.substring(0, 50)}...`}
                    </p>
                    <button
                          className="text-blue-500 text-sm mt-1"
                          onClick={() =>
                            setExpandedCourse(expandedCourse === course._id ? null : course._id)
                          }
                        >
                          {expandedCourse === course._id ? "Read Less" : "Read More"}
                        </button>
                    <p className="text-green-600 font-semibold mt-2 mb-4">
                      Rs.{course.price}
                    </p>

                    <Link
                      to={`/buy/${course._id}`}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Buy
                    </Link>
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