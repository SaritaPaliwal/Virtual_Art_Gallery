import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/pages/Home";
import Gallery from "./components/pages/Gallery";
import UploadArt from "./components/pages/UploadArt";
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import ArtistProfile from "./components/pages/ArtistProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Gallery" element={<Gallery />} />
        <Route path="/Uploadart" element={<UploadArt />} />
        <Route path="/artist/:id/artworks" element={<ArtistProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
