import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import { Toaster } from "react-hot-toast";
import Courses from "./components/Courses";
import Buy from "./components/Buy";
import Purchases from "./components/Purchases";
import AdminSignup from "./admin/AdminSignup";
import AdminLogin from "./admin/AdminLogin";
import AdminDashbord from "./admin/AdminDashbord";
import CourseCreate from "./admin/CourseCreate";
import OurCourse from "./admin/OurCourse";
import UpdateCourse from "./admin/UpdateCourse";

const App = () => {

  const user = JSON.parse(localStorage.getItem("user"));
  const admin = JSON.parse(localStorage.getItem("AdminUser"));

  return (
    <> 
        <Routes>
          <Route path="/" element = {<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* other routes */}
          <Route path="/courses" element = {<Courses />} />
          <Route path="/buy/:courseId" element={<Buy />} />
          <Route path="/purchases" element={<Purchases />} />


          {/* Admin Routes */}
          <Route path="/admin/signup" element = {<AdminSignup />} />
          <Route path="/admin/login" element = {<AdminLogin />} />
          <Route path="/admin/dashboard" element = {<AdminDashbord />} />
          <Route path="/admin/courses" element = {<CourseCreate />} />
          <Route path="/admin/ourcourses" element = {<OurCourse />} />
          <Route path="/admin/updatecourse/:courseId" element = {<UpdateCourse />} />
        </Routes>
        <Toaster />
    </>
    
  );
};

export default App;
