const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({ name, email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt:", email, password);
  console.log("JWT Secret:", process.env.JWT_SECRET); // Log the JWT secret being used
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      console.log("Invalid credentials");
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("Token generated:", token);
    res.status(200).json({ token });
  } catch (error) {
    console.log("Error during login:", error.message);
    res.status(400).json({ error: error.message });
  }
};
