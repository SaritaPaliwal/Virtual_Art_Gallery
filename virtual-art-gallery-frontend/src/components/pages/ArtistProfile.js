import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function ArtistProfile() {
  const { id } = useParams();
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/art/artist/${id}/artworks`
        );
        setArtworks(data);
      } catch (error) {
        console.error("Error fetching artworks:", error);
      }
    };
    fetchArtworks();
  }, [id]);

  if (!artworks.length) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-gray-100 to-blue-50">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-800">
            No artworks found for this artist.
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-3xl p-10">
        <h1 className="text-6xl font-extrabold text-center text-gray-900 mb-12">
          Artworks by Artist {}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {artworks.map((art, index) => (
            <div
              key={index}
              className="group relative bg-gray-100 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500"
            >
              <img
                src={`http://localhost:5000/${art.imageUrl}`}
                alt={art.title}
                className="h-72 w-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <h2 className="text-white text-2xl font-bold drop-shadow-lg">
                  {art.title}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ArtistProfile;
