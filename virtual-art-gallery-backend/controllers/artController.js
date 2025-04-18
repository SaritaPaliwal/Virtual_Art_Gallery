const Art = require("../models/Art");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb("Images only!", false);
    }
  },
});

exports.uploadArt = [
  upload.single("image"),
  async (req, res) => {
    const { title, description } = req.body;
    try {
      const art = await Art.create({
        title,
        description,
        imageUrl: req.file.path,
        artist: req.user._id,
      });
      res.status(201).json(art);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
];

exports.getArtworks = async (req, res) => {
  try {
    const artworks = await Art.find().populate("artist", "name");
    res.status(200).json(artworks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// In artController.js

exports.getArtworksByArtistId = async (req, res) => {
  try {
    const artistId = req.params.id;
    const artworks = await Art.find({ artist: artistId }); // Fetch artworks by artist ID
    if (!artworks.length) {
      return res
        .status(404)
        .json({ message: "No artworks found for this artist cccc" });
    }
    res.status(200).json(artworks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE an artwork
exports.deleteArtwork = async (req, res) => {
  try {
    const art = await Art.findById(req.params.id);
    if (!art) return res.status(404).json({ error: "Artwork not found" });

    // Optional: Only the owner can delete
    if (art.artist.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Not authorized to delete this art" });
    }

    await art.deleteOne();
    res.status(200).json({ message: "Artwork deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE an artwork
exports.updateArtwork = async (req, res) => {
  try {
    const art = await Art.findById(req.params.id);
    if (!art) return res.status(404).json({ error: "Artwork not found" });

    // Optional: Only the owner can update
    if (art.artist.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Not authorized to update this art" });
    }

    const { title, description } = req.body;
    art.title = title || art.title;
    art.description = description || art.description;

    if (req.file) {
      // Delete the old image if it exists
      const oldImagePath = path.join(__dirname, "..", art.imageUrl); // Get the full path to the old image
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Delete the old image file
      }

      // Update image URL to the new uploaded image
      art.imageUrl = req.file.path; // Save the new image URL in the database
    }

    const updatedArt = await art.save();
    res.status(200).json(updatedArt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};