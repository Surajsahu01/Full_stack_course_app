import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { BACKEND_URL } from '../utils/utils';

const UpdateCourse = () => {
  const { courseId } = useParams();

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

  useEffect(() =>{
    if (!token) {
      toast.error("Please log in as an admin.");
      navigate("/admin/login");
      return;
    }
    const fechCourse = async () =>{
      setLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/course/show/${courseId}`,{
          headers: {
            Authorization: `Bearer ${token}`, // if token is needed
          },
          withCredentials: true,
        });
        console.log(response.data);
        const { title, description, price } = response.data.course;
        setTitle(title || '');
        setDescription(description || '');
        setPrice(price || '');
        setImage(response.data.course.image.url || "/imgPL.webp");
        setImagePreview(response.data.course.image.url || "/imgPL.webp"); // Default image if none provided
        

      } catch (error) {
        console.log("Error in fetching course", error);
        toast.error('Failed to fetch course data.');
        
      }finally{
        setLoading(false);
      }
    }
    fechCourse();

  },[courseId, token, navigate])


  const changeHandler = (e) => {
    const file = e.target.files[0];
    if(file){
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
    reader.readAsDataURL(file);
  }
};  

  const handleUpdateCourse = async (e) => {
      e.preventDefault();
      setLoading(true);

      if (!title.trim() || !description.trim() || !price) {
        toast.error("All fields are required.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      if(image){
        formData.append("image", image);
      }

    try {
      
      const response = await axios.put(`${BACKEND_URL}/course/update/${courseId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // "Content-Type": "multipart/form-data",
        },
        withCredentials: true
      });
      console.log(response.data);
      toast.success(response.data.message || "Course apdated successfully!");
      navigate("/admin/ourcourses");
    } catch (error) {
      console.log(error);  
      toast.error(error.response.data.error || "Failed to update course data.");
    }finally{
      setLoading(false);
    }
  };
  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h3 className="text-2xl font-semibold text-center mb-8">Update Course</h3>
        <form onSubmit={handleUpdateCourse} className="space-y-6">

          <div className="space-y-2">
            <label className="block text-lg">Title</label>
            <input
              type="text"
              placeholder="Enter Course Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-blue-400"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg">Description</label>
            <textarea
              placeholder="Course Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-blue-400"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg">Price</label>
            <input
              type="number"
              placeholder="Course Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-blue-400"
              required
            />
          </div>

          <label className="block text-lg">Course Image</label>
          <div className="flex flex-col justify-center items-center">
            <img 
            src={imagePreview? `${imagePreview}` : "/imgPL.webp"} 
            alt="Course" 
            className="w-full max-w-fit h-auto object-cover rounded-md" />
            <input
              type="file"
              accept="image/*"
              onChange={changeHandler}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className={`w-full px-3 py-2 text-white rounded ${loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'}`}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Course'}
          </button>
        </form>
      </div>
    </div>
  );
};
  


export default UpdateCourse