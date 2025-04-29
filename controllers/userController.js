const { getToken } = require("../middleware/token");
const { encrypt, decrypt } = require("../middleware/enc");
const User = require("../models/User");

exports.signup = async (req, res) => {
    try {
      const {
          email,
          password,
      } = req.body;
      console.log(req.body);
  
      if (!email || !password) {
        return res.status(400).json({ message: "email and password are required" });
      }
  
      const hashedPassword = await encrypt(password) 
  
      const newUser = new User({
          email,
          password: hashedPassword,
      });
  
      await newUser.save();
      const token = getToken(newUser);
      res.status(201).json({
        status: "Success",
        message: "User created successfully",
        data: newUser,
        token: token
      });
    }
    catch (error) 
    {
      if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
        return res.status(409).json({
          status: "failed",
          message: "User with this email already exists"
        });
      }
      
      console.error("Registration failed:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password ) {
        return res.status(400).json({
          status: "failed",
          message: "Email and password are required",
        });
      }
  
      const user = await User.findOne({ 
        email, 
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const decryptedPassword = decrypt(user.password);
      const isPasswordValid = password === decryptedPassword;

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
      const token = getToken(user);
  
      return res.status(200).json({
        status: "success",
        message: "Customer logged in successfully",
        role: user.role,
        token: token,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  exports.getUserDetails = async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select('-password');
      
      if (!user) {
        return res.status(404).json({
          status: "failed",
          message: "User not found"
        });
      }
      
      res.status(200).json({
        status: "success",
        data: {
          _id: user._id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    } catch (error) {
      console.error("Get user details failed:", error.message);
      res.status(500).json({
        status: "failed",
        message: "Internal Server Error"
      });
    }
  };
  
  exports.updateUsername = async (req, res) => {
    try {
      const { username } = req.body;
      
      if (!username) {
        return res.status(400).json({
          status: "failed",
          message: "Username is required"
        });
      }
      
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { username: username },
        { new: true, runValidators: true }
      ).select('-password');
      
      if (!updatedUser) {
        return res.status(404).json({
          status: "failed",
          message: "User not found"
        });
      }
      
      res.status(200).json({
        status: "success",
        message: "Username updated successfully",
        data: updatedUser
      });
    } catch (error) {
      console.error("Username update failed:", error.message);
      res.status(500).json({
        status: "failed",
        message: "Internal Server Error"
      });
    }
  };