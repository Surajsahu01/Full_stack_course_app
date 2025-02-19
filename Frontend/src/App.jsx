import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import { Toaster } from "react-hot-toast";
import Courses from "./components/Courses";
import Buy from "./components/Buy";
import Purchases from "./components/Purchases";

const App = () => {
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

        </Routes>
        <Toaster />
    </>
    
  );
};

export default App;
