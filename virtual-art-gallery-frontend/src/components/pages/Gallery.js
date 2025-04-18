import React, { useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "tailwindcss/tailwind.css"; // Assuming you're using Tailwind CSS
import Navbar from "../Navbar";

function Gallery() {
  const [artworks, setArtworks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch artworks from the backend API
    const fetchArtworks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/art/artworks"
        );
        setArtworks(response.data);
      } catch (error) {
        console.error("Error fetching artworks:", error);
      }
    };

    fetchArtworks();
  }, []);

  useEffect(() => {
    if (artworks.length === 0) return;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true; // Enable shadow mapping
    document.getElementById("three-canvas").appendChild(renderer.domElement);

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 0.8);
    spotLight.position.set(10, 20, 10);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    scene.add(spotLight);

    // Camera Position
    camera.position.set(0, 20, 200); // Adjusted camera position for better 3D view

    const textureLoader = new THREE.TextureLoader();

    // Load the current artwork texture
    const currentArt = artworks[currentIndex];
    const fullUrl = `http://localhost:5000/${currentArt.imageUrl.replace(
      "\\",
      "/"
    )}`;

    textureLoader.load(
      fullUrl,
      (texture) => {
        const imageSize = 90;

        // Create the image plane with a canvas-like material
        const geometry = new THREE.PlaneGeometry(imageSize, imageSize);
        const material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.1,
          metalness: 0.1,
        });
        const plane = new THREE.Mesh(geometry, material);
        plane.castShadow = true;
        plane.receiveShadow = true;

        // Position the image in 3D space
        plane.position.set(0, 30, 60);
        plane.rotation.y = Math.random() * 0.2 - 0.1; // Random tilt along Y-axis
        plane.rotation.x = Math.random() * 0.2 - 0.1; // Random tilt along X-axis

        scene.add(plane);
      },
      undefined,
      (error) => {
        console.error(
          `Error loading texture for artwork ${currentArt.title}:`,
          error
        );
      }
    );

    // Add grid to the floor
    const gridHelper = new THREE.GridHelper(400, 50); // Adjusted grid size
    scene.add(gridHelper);

    // Orbit Controls for Camera Interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.enableRotate = true;

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener("resize", () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });

    return () => {
      const canvas = document.getElementById("three-canvas");
      if (canvas) canvas.innerHTML = ""; // Remove the canvas on cleanup
    };
  }, [artworks, currentIndex]);

  // Handle Previous Button
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : artworks.length - 1
    );
  };

  // Handle Next Button
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < artworks.length - 1 ? prevIndex + 1 : 0
    );
  };

  return (
    <>
      <Navbar />
      <div className="h-screen bg-gradient-to-b from-blue-900 to-gray-900 relative overflow-hidden">
        <div
          id="three-canvas"
          className="w-full h-full absolute top-0 left-0"
        ></div>
        {artworks.length > 0 && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center text-white animate-fade-in-up">
            <h2
              className="text-3xl font-bold transition-transform duration-500 ease-in-out"
              style={{ fontFamily: "Raleway, sans-serif", fontWeight: "700" }}
            >
              Title: {artworks[currentIndex].title}
            </h2>

            <p
              className="text-lg mt-2 transition-opacity duration-500 ease-in-out"
              style={{ fontFamily: "Raleway, sans-serif", fontWeight: "700" }}
            >
              Artist Name:{" "}
              <Link
                to={`/artist/${artworks[currentIndex].artist._id}/artworks`}
                className="text-blue-400 hover:text-blue-600 underline"
              >
                {artworks[currentIndex].artist.name}
              </Link>
            </p>
            <p
              className="text-sm mt-1 transition-opacity duration-500 ease-in-out"
              style={{ fontFamily: "Raleway, sans-serif", fontWeight: "400" }}
            >
              Description: {artworks[currentIndex].description}
            </p>
          </div>
        )}
        <div className="absolute bottom-20 left-10 text-white">
          <button
            onClick={handlePrevious}
            className="text-2xl bg-gray-700 hover:bg-gray-900 px-4 py-2 rounded shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Previous
          </button>
        </div>
        <div className="absolute bottom-20 right-10 text-white">
          <button
            onClick={handleNext}
            className="text-2xl bg-gray-700 hover:bg-gray-900 px-4 py-2 rounded shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Next
          </button>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-transparent to-black opacity-50 pointer-events-none animate-gradient-shift"></div>
      </div>
    </>
  );
}

export default Gallery;
