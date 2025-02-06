import React from 'react'
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
        <header className="bg-blue-600 text-white py-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center px-4">
            <h1 className="text-2xl font-bold ">MyApp</h1>
            <nav>
                <ul className="flex space-x-4">
                <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
                <li><Link to="/login" className="hover:text-gray-300">Login</Link></li>
                <li><Link to="/signup" className="hover:text-gray-300">Signup</Link></li>
                </ul>
            </nav>
            </div>
        </header>   
    </div>
  )
}

export default Navbar