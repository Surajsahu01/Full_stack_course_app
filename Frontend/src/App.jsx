import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Navbar from "./components/Navbar";
import Home from "./components/Home";

const App = () => {
  return (
    // <Router>
    //   <Home />
    //   <Routes>
    //     <Route path="/login" element={<Login />} />
    //     <Route path="/signup" element={<Signup />} />
    //   </Routes>
    // </Router>
    <>
    <Navbar />
    <Routes>
      {/* <Route path="/" element = {<Home/>} /> */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
    
  );
};

export default App;
