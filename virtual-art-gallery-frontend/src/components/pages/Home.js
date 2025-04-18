import React from "react";
import Navbar from "../Navbar";

function Home() {
  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-blue-900 via-black to-gray-900 h-screen flex flex-col items-center justify-center text-center text-white">
        <h1 className="text-6xl font-bold animate-fade-in-down">
          Virtual Art Gallery
        </h1>
        <p className="text-xl mt-4 animate-fade-in-up">
          Explore, Create, and Share Amazing Art
        </p>
        <div className="mt-8 animate-fade-in-up">
          <a
            href="/gallery"
            className="text-lg bg-white text-black px-6 py-3 rounded-full hover:bg-gray-300 transition"
          >
            Enter Gallery
          </a>
        </div>
      </div>
    </>
  );
}

export default Home;
