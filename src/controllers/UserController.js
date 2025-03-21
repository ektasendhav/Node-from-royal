const userModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const mailUtil = require("../utils/MailUtil")

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login Attempt:", email);

    const foundUser = await UserModel.findOne({ email }).populate("roleId");
    if (!foundUser) {
      return res.status(404).json({ message: "Email not found." });
    }

    

    const isMatch = bcrypt.compareSync(password, foundUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    res.status(200).json({
      message: "Login successful",
      data: foundUser,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in", error });
  }
};

// SIGNUP USER
const signup = async (req, res) => {
  try {
    const { email, password, ...otherData } = req.body;

    // Check if email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await userModel.create({ email, password: hashedPassword, ...otherData });

    res.status(201).json({
      message: "User created successfully.",
      data: newUser,
    });
    const createdUser = await userModel.create(req.body);

    await mailUtil.sendingMail(createdUser.email,"welcome to eadvertisement","this is welcome mail");

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// ADD USER (Ensure Password Encryption)
const addUser = async (req, res) => {
  try {
    const { password, ...otherData } = req.body;

    // Encrypt password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const savedUser = await userModel.create({ password: hashedPassword, ...otherData });

    res.status(201).json({
      message: "User saved successfully.",
      data: savedUser,
    });

  } catch (error) {
    console.error("Add User Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().populate("roleId");
    res.status(200).json({
      message: "Users fetched successfully.",
      data: users,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// GET USER BY ID
const getUserById = async (req, res) => {
  try {
    const foundUser = await userModel.findById(req.params.roleId);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "User fetched successfully.",
      data: foundUser,
    });

  } catch (error) {
    console.error("Get User By ID Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// DELETE USER BY ID
const deleteUserById = async (req, res) => {
  try {
    const deletedUser = await userModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "User deleted successfully.",
      data: deletedUser,
    });

  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  addUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  signup,
  loginUser,
};
