const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require("../models/user");
const { logError, logInfo } = require("../logger");

const createAccount = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      logError(req.method, req.url, "registration failed, provided information is invalid");
      return res.status(400).json({
        success: false,
        message: "Provided information is invalid",
      });
    }

    const user = await User.findOne({ email: email });
    if (user) {
      logError(req.method, req.url, "registration failed, user email already existed");
      return res.status(400).json({
        success: false,
        message: "User email already existed"
      })
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.insertOne({
      name: name ,
      email: email,
      password: hashedPassword
    })

    logInfo(req.method, req.url, "registration successful");
    return res.status(200).json({
      success: true,
      message: "Registration successful!",
    });
  } catch (err) {
    logError(req.method, req.url, `registration failed with Internal Server Error: ${err}`);
    // console.error("Failed with Internal Server Error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      logError(req.method, req.url, "delete account failed, provided information is invalid");
      return res.status(400).json({
        success: false,
        message: "Provided information is invalid",
      });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      logError(req.method, req.url, "delete account failed, user email is invalid");
      return res.status(400).json({
        success: false,
        message: "User email is invalid"
      })
    }
    const pwCheck = await bcrypt.compare(password, user.password);
    if (!pwCheck) {
      logError(req.method, req.url, "delete account failed, user password is not match");
      return res.status(400).json({
        success: false,
        message: "User password is not match"
      })
    }

    // Delete
    const result = await User.deleteOne({ _id: user._id });
    
    logInfo(req.method, req.url, `delete account for user ${email} successful`);
    return res.status(200).json({
      success: true,
      message: "Delete expense successful!",
    });
  } catch (err) {
    // console.error("Failed with Internal Server Error:", err);
    logError(req.method, req.url, `delete account failed with Internal Server Error: ${err}`);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
};

module.exports = {
  createAccount,
  deleteAccount
};