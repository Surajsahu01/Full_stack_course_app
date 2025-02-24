import axios from 'axios';
import React, {  useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';


const OurCourse = () => {
  const [course, setCourse] = useState([]);
  // const [logging, setLoging] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("AdminUser"));
  const token = admin?.token;
  const adminId = admin?.user._id; // Extract adminId
  console.log(adminId);

  useEffect(() => {
        if (!token ) {
            toast.error("Please login to see your course", { duration: 3000 });
            navigate("/admin/login"); // Redirect to login page
            return;
        }

        setLoading(true);
 
  // fetch course
    const fetchCourse = async () => {
      try {
        const response = await axios.get("http://localhost:5000/v1/course/show", 
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
        }
      );
        const adminCourse = response.data.filter(user => user.creatorId === adminId);
        setCourse(adminCourse);
        console.log(adminCourse);
        
        // console.log(response.data);
        
        setLoading(false);
      } catch (error) {
        console.log("Error in fetching course", error);
        setLoading(false);
      }
    };
    fetchCourse();
  }, [adminId, token]);

// delete course
const deleteCourse = async (id) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/v1/course/delete/${id}`, 
    {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
    }
  );
    console.log(response.data);
    setCourse(course.filter((course) => course._id !== id));
    toast.success(response.data.message);
  } catch (error) {
    console.log("Error in deleting course", error);
    toast.error(error.response.data.error || "Error in deleting course");
  }
};


if(loading) {
  return <h1>Loading...</h1>
}
  

  return (
    <div className='bg-gray-100 h-screen p-8 space-y-4'>
      <h1 className='text-2xl font-bold text-center mb-8'>Our Course</h1>
      <Link 
      className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mb-4" 
      to="/admin/dashboard">
      Go to dashboard
      </Link>

      <div className='mt-10' >
      {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                  </div>
                ) :
                 (
      
                  <div className="grid grid-cols-4 gap-5">
                    {
                    course.length > 0 ? (
                      course.map((course) => (
                        <div key={course._id} className="bg-white p-6 shadow-md rounded-lg text-center">
                          <img
                            src={course.image.url || "https://via.placeholder.com/120"}
                            alt={course.title}
                            className="w-50 h-30 object-cover mx-auto rounded-md mb-3"
                          />
                          <h3 className="text-sm font-semibold">{course.title}</h3>
                          <p className="text-gray-500 text-xs truncate">{course.description}</p>
                          <p className="text-green-600 font-semibold mt-2 mb-4">Rs.{course.price}</p>
                          <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => deleteCourse(course._id)}
                          >
                            Delete
                          </button>
                          
                        </div>
                        
                      ))
                    ) : (
                      <p>No courses found.</p>
                    )}
                  </div>
                )}
      </div>
    </div>
  )
}

export default OurCourse