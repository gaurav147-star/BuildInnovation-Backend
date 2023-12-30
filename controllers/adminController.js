const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (user) => {
  return jwt.sign({ userId: user._id }, "secret_key", { expiresIn: "1d" });
};

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, profileImage, phone } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      email,
      phone,
      name,
      profileImage,
      password: hashedPassword,
      role: "Admin",
    };

    const user = await User.create(newUser);

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
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
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
      name: user.name,
      email: user.email,
      token,
      phone: user.phone,
      profileImage: user.profileImage,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.role === "Admin") {
      const nonAdminUsers = await User.find({ role: { $ne: "Admin" } }); // Fetch non-admin users

      res.json({ users: nonAdminUsers });
    } else {
      res.status(403).json({ error: "Access denied" }); // Non-admin user access restriction
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const modifyDetails = async (req, res) => {
  const { name, profileImage, userId } = req.body; // Include userId of the user whose details are to be modified

  try {
    // Check if the logged-in user is an admin
    const user = await User.findById(req.user._id);
    if (!user || user.role !== "Admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Find the user whose details need modification
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    userToUpdate.name = name || userToUpdate.name;
    userToUpdate.profileImage = profileImage || userToUpdate.profileImage;

    // Save updated user details
    await userToUpdate.save();

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
    // Check if the logged-in user is an admin
    const user = await User.findById(req.user._id);
    if (!user || user.role !== "Admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const userIdToDelete = req.body.userId; // Get the userId to be deleted from request body

    // Find the user by ID and delete
    const deletedUser = await User.findByIdAndDelete(userIdToDelete);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAccount:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  registerAdmin,
  login,
  getAllUsers,
  modifyDetails,
  deleteAccount,
};
