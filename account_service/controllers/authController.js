const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const { logError, logInfo } = require("../logger");
const Blacklist = require('../models/blacklist');

// Used by other microservices
const checkLogin = async (req, res) => {
  const authHeader = req.header('Authorization')
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null
  if (!token) {
    logError(req.method, req.url, `request received, token not found`);
    return res.status(401).json({
      success: false,
      message: "Token not found",
    });
  }
  
  const blacklist = await Blacklist.findOne({ token: token })
  if (blacklist) {
    logError(req.method, req.url, `request received, token was blacklisted`);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  // Verify and response
  try {
    const jwtSecretKey = process.env.JWT_SECRET_KEY
    const userData = jwt.verify(token, jwtSecretKey)
    logInfo(req.method, req.url, `request received, token found for user ${userData}`);
    res.json({ 
      loggedIn: true, 
      user: userData
    });
  } catch (err) {
    logError(req.method, req.url, `authentication failed with Internal Server Error: ${err}`);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      logError(req.method, req.url, "login failed, provided information is invalid");
      return res.status(400).json({
        success: false,
        message: "Provided information is invalid",
      });
    }

    // Check user
    const user = await User.findOne({ email: email });
    if (!user) {
      logError(req.method, req.url, "login failed, user email is invalid");
      return res.status(401).json({
        success: false,
        message: "User email is invalid"
      })
    }
    const pwCheck = await bcrypt.compare(password, user.password);
    if (!pwCheck) {
      logError(req.method, req.url, "login failed, user password is not match");
      return res.status(401).json({
        success: false,
        message: "User password is not match"
      })
    }

    // JWT
    const jwtSecretKey = process.env.JWT_SECRET_KEY
    const userData = {
        id: user._id,
        email: user.email,
        name: user.name
    };
    const token = jwt.sign(userData, jwtSecretKey, {
      expiresIn: '1h'
    })
    logInfo(req.method, req.url, "JWT created, login successful");

    // Response
    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token: token
    });
  } catch (err) {
    logError(req.method, req.url, `login failed with Internal Server Error: ${err}`);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
};

const logout = async (req, res) => {
  const authHeader = req.header('Authorization')
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null
  
  if (!token) {
    logError(req.method, req.url, `request received, token not found`);
    return res.status(401).json({
      success: false,
      message: "Access denined",
    });
  }
  
  try {
    const newBlacklist = await Blacklist.insertOne({ token: token })
    logInfo(req.method, req.url, "blacklisted token, logout successful");
    res.status(200).json({ 
      success: true, 
      message: "Logged out successfully" 
    });
  } catch (err) {
    logError(req.method, req.url, `logout failed with Internal Server Error: ${err}`);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
};

module.exports = {
  checkLogin,
  login,
  logout,
};