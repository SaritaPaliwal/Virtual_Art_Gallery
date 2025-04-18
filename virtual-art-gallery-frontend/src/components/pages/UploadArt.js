import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UploadArt() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      alert("Please login to upload your art");
      navigate("/"); // Redirect to login page
    }
  }, [navigate]);

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("image", file);

      try {
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };

        await axios.post(
          "http://localhost:5000/api/art/upload",
          formData,
          config
        );

        toast.success("Artwork uploaded successfully!", {
          position: "bottom-right", // Correct position value
          autoClose: 3000, // Toast duration: 3 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Clear form fields after the toast
        setTimeout(() => {
          setTitle("");
          setDescription("");
          setFile(null);
        }, 3000);
      } catch (error) {
        toast.error("Failed to upload artwork", {
          position: "top-right", // Correct position value
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  };

  if (!isAuthenticated) {
    return null; // Don't render anything if the user is not authenticated
  }

  return (
    <>
      <Navbar />
      <ToastContainer /> {/* This is necessary to display the toasts */}
      <div className="h-screen bg-gray-100 p-8 mt-15">
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
          <h1 className="text-3xl font-bold mb-6">Upload Artwork</h1>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">File</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition"
          >
            Upload
          </button>
        </div>
      </div>
    </>
  );
}

export default UploadArt;
