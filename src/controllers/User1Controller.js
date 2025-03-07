const bcrypt = require("bcrypt");
const Patient = require("../models/PatientModel");
const Doctor = require("../models/DoctorModel");
const Admin = require("../models/AdminModel");

const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check existence of Patient user
      let foundUser = await Patient.findOne({ email }).populate('roleId');
      let userType = "Patient";
  
      // not in Patient, check in Doctor collection
      if (!foundUser) {
        foundUser = await Doctor.findOne({ email });
        userType = "Doctor";
      }

      if (!foundUser) {
        foundUser = await Admin.findOne({ email });
        userType = "Admin";
      }
  
      // if user does not exist in both
      if (!foundUser) {
        return res.status(404).json({ message: "Email not found." });
      }
  
      // Compare entered password with the stored password
      const isMatch = await bcrypt.compare(password, foundUser.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials." });
      }
  
      res.status(200).json({
        message: `Login successful. Welcome ${userType}!`,
        userType,
        data:{
          userId:foundUser._id,
          username: foundUser.username,
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Error during login.", error: error.message });
    }
  };
  

  const signup = async (req, res) => {
    try {
      const {email, password,name, contact, gender, userType } = req.body;
  
      // Cjeck if email is already registered in any collection
      const existingPatient = await Patient.findOne({ email });
      const existingDoctor = await Doctor.findOne({ email });
      const existingAdmin = await Admin.findOne({ email });
  
      if (existingPatient || existingDoctor || existingAdmin) {
        return res.status(400).json({ message: "Email already registered." });
      }
  
      // hash password before storing
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      let newUser;
      
      if (userType === "Patient") {
        newUser = await Patient.create({ ...req.body, password: hashedPassword });
      } else if (userType === "Doctor") {
        newUser = await Doctor.create({ ...req.body, password: hashedPassword });
      }else if (userType === "Admin") {
        newUser = await Admin.create({ ...req.body, password: hashedPassword });
      } else {
        return res.status(400).json({ message: "Invalid user type. Must be 'Patient' or 'Doctor'." });
      }
  
      res.status(201).json({ message: `${userType} registered successfully.`, data: newUser });
    } catch (error) {
      res.status(500).json({ message: "Error creating user.", error: error.message });
    }
  };

  const getAllUsers = async (req, res) => {
    try {
      const Patients = await Patient.find();
      const Doctors = await Doctor.find();
      const Admins = await Admin.find();
  
      res.status(200).json({
        message: "Users retrieved successfully.",
        Patients,
        Doctors,
        Admins,
    
      });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving users.", error: error.message });
    }
  };
  
  //--------------> Delete User by ID (For Both Patients and Doctors)
  const deleteUser = async (req, res) => {
    try {
      let deletedUser = await Patient.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        deletedUser = await Doctor.findByIdAndDelete(req.params.id);
      }
      if (!deletedUser) {
        deletedUser = await Admin.findByIdAndDelete(req.params.id);
      }
  
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found." });
      }
  
      res.status(200).json({ message: "User deleted successfully.", data: deletedUser });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user.", error: error.message });
    }
  };
  
  //-------------> Get User by ID
  const getUserById = async (req, res) => {
    try {
      let user = await Patient.findById(req.params.id);
      let userType = "Patient";
  
      if (!user) {
        user = await Doctor.findById(req.params.id);
        userType = "Doctor";
      }

      if (!user) {
        user = await Admin.findById(req.params.id);
        userType = "Admin";
      }
  
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      res.status(200).json({ message: `${userType} retrieved successfully.`, data: user });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving user.", error: error.message });
    }
  };
  
  module.exports = {
    login,signup,getAllUsers,deleteUser,getUserById,
  };