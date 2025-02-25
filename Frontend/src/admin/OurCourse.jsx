import axios from 'axios';
import React, {  useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';


const OurCourse = () => {
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("AdminUser"));
  const token = admin?.token;
  const adminId = admin?.user._id; // Extract adminId


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
        console.log("course:",adminCourse);
        
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
    <div className="bg-gray-100 min-h-screen p-8 space-y-4">
      <h1 className="text-4xl font-bold text-center mb-8">Our Courses</h1>
      <Link
        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mb-4"
        to="/admin/dashboard"
      >
        Go to Dashboard
      </Link>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {course.length > 0 ? (
              course.map((course) => (
                <div key={course._id} className="p-4 mb-10">
                  <div className="relative flex-shrink-0 w-80 transition-transform">
                    <div className="bg-white rounded-lg overflow-hidden w-80 h-auto shadow-lg">
                      <img
                        src={course?.image?.url || "https://via.placeholder.com/120"}
                        alt={course.title}
                        className="w-full h-40 object-cover mx-auto rounded-t-lg"
                      />
                      <div className="p-4">
                        <h3 className="text-xl font-semibold">{course.title}</h3>
                        <p className="text-gray-500 text-sm">
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
                        <p className="text-green-600 font-semibold px-2 mt-4">
                          Rs. {course.price}
                        </p>

                        <div className="flex justify-between mt-4">
                          <Link
                            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full ml-2"
                            to={`/admin/updatecourse/${course._id}`}
                          >
                            Update
                          </Link>

                          <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full mr-2"
                            onClick={() => deleteCourse(course._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
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