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