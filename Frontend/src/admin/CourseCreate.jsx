import React, { useEffect, useState } from 'react'
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../utils/utils';

const CourseCreate = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  // Get Admin Token & ID from localStorage
  const admin = JSON.parse(localStorage.getItem("AdminUser"));
  const token = admin?.token;
  console.log(token);
  
  useEffect(() =>{
    if(!token){
      toast.error("Please login to see your course", { duration: 3000 });
      navigate("/admin/login");
    }

  },[])
  const changeHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
    reader.readAsDataURL(file);
  }

  const handleCreateCourse = async (e) => {
    e.preventDefault();
      const formData = new FormData();
      formData.append("image", image);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
    try {
      
      const response = await axios.post(`${BACKEND_URL}/course/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true
      });
      console.log(response.data);
      toast.success(response.data.message || "Course added successfully!");
      navigate("/admin/ourcourses");
      setTitle("");
      setDescription("");
      setPrice("");
      setImage(null);
      setImagePreview(null);

    } catch (error) {
      console.log(error);  
      toast.error(error.response.data.error);
    }
  };

  return (
    <div className=' min-h-screen py-10'>
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h3 className="text-2xl font-semibold text-center mb-8">Add New Course</h3>
      <form onSubmit={handleCreateCourse} className="space-y-6">

        <div className='space-y-2'>
        <label className='block text-lg'>Title</label>
        <input
          type="text"
          placeholder="Enter Your Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-blue-400 "
        />

        </div>
        
        <div className='space-y-2'>
        <label className='block text-lg'>Description</label>
        <textarea
          placeholder="Course Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-blue-400 "
        />
        </div>
        
        <div className='space-y-2'>
        <label className='block text-lg'>Price</label>
        <input
          type="number"
          placeholder="Course Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-blue-400 "
        />
        </div>

        <div className='space-y-2'>
        <label className='block text-lg'>Course Image</label>
        <img 
        src={imagePreview?`${imagePreview}`:"/imgPL.webp"} 
        alt="Course Image"
        className="w-full max-w-sm h-auto object-cover rounded-md" />
        </div >
        <input
          type="file"
          placeholder='Course Image'
          accept="image/*"
          onChange={changeHandler}
          className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-blue-400 "
        />

        
        <button
          type="submit"
          className={`w-full px-3 py-2 text-white rounded ${loading ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-700"}`}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Add Course"}
        </button>
      
      </form>
  </div>

    </div>
    
  )
}

export default CourseCreate