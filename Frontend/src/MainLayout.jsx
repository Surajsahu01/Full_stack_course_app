// import React, { useState } from "react";
// import { BrowserRouter as  Routes, Route, useLocation } from "react-router-dom";

// import Login from "./components/Login";
// import Signup from "./components/Signup";
// import Home from "./components/Home";
// import { Toaster } from "react-hot-toast";
// import Courses from "./components/Courses";
// import Buy from "./components/Buy";
// import Purchases from "./components/Purchases";
// import Sidebar from "./components/Sidebar";

// const MainLayout = () => {
//     const location = useLocation();
//     const showSidebar = ["/courses", "/purchases"].includes(location.pathname);
  
//     return (
//         <div className="flex h-screen w-full overflow-hidden">
//         {/* Sidebar should not be inside Routes */}
//         {showSidebar && <Sidebar />}
  
//         {/* Main content area */}
//         <div className={`flex-1 p-5 transition-all duration-300`}>
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/signup" element={<Signup />} />
//             <Route path="/courses" element={<Courses />} />
//             <Route path="/buy/:courseId" element={<Buy />} />
//             <Route path="/purchases" element={<Purchases />} />
//           </Routes>
//           <Toaster />
//         </div>
//       </div>
//     );
//   };
  

// export default MainLayout;