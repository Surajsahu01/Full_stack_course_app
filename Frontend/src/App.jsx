import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import { Toaster } from "react-hot-toast";
import Courses from "./components/Courses";
import Buy from "./components/Buy";
import Purchases from "./components/Purchases";
import Sidebar from "./components/Sidebar";

const MainLayout = () => {
  const location = useLocation();

  const showSidebar = ["/courses", "/purchases"].includes(location.pathname);
  return (
    <div className="flex"> 
      {showSidebar && <Sidebar />}

      <div className={showSidebar ? "ml-[20%] w-full p-5" : "w-full p-5"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* other routes */}
          <Route path="/courses" element={<Courses />} />
          <Route path="/buy/:courseId" element={<Buy />} />
          <Route path="/purchases" element={<Purchases />} />
        </Routes>
        <Toaster />
      </div>
    </div>
    
  );
};

const App = () => {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
};

export default App;
