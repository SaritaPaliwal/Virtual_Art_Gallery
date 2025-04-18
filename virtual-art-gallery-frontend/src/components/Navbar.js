import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from localStorage or other storage
    localStorage.removeItem("token");

    // Redirect to the home page
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-md fixed w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/Home" className="text-white text-2xl font-bold ">
          Virtual Art Gallery
        </Link>
        <div className="flex space-x-4">
          <Link to="/Home" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <Link to="/Gallery" className="text-gray-300 hover:text-white">
            Gallery
          </Link>
          <Link to="/Uploadart" className="text-gray-300 hover:text-white">
            Upload Art
          </Link>
          <button
            onClick={handleLogout}
            className="text-gray-300 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
