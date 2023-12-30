const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (user) => {
  return jwt.sign({ userId: user._id }, "secret_key", { expiresIn: "1d" });
};

const register = async (req, res) => {
  try {
    const { name, email, password, profileImage, phone } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      phone,
      name,
      profileImage,
      password: hashedPassword,
    });

    if (!user) {
      return res.status(500).json({ error: "User creation failed" });
    }

    const token = generateToken(user._id);
    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      token,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Registration failed", details: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken(user._id);
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      token,
      phone: user.phone,
      profileImage: user.profileImage,
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

const modifyDetails = async (req, res) => {
  const { name, profileImage } = req.body;

  try {
    // Find the user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    user.name = name || user.name;
    user.profileImage = profileImage || user.profileImage;

    // Save updated user details
    await user.save();

    return res
      .status(200)
      .json({ message: "User details updated successfully" });
  } catch (error) {
    console.error("Error in modifyDetails:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const deleteAccount = async (req, res) => {
  try {
    // Find the user and delete
    const deletedUser = await User.findByIdAndDelete(req.user._id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAccount:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { register, login, modifyDetails, deleteAccount };
