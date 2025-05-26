const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require("../models/user");
const { logError, logInfo } = require("../logger")

const checkLogin = (req, res) => {
  // console.log("Request received at /status, session: ", req.session.user);

  if (req.session.user) {
    logInfo(req.method, req.url, `request received, session available:  ${req.session.user.email}`);
    res.json({ 
      loggedIn: true, user: req.session.user
    });
  } else {
    logInfo(req.method, req.url, `request received, session unavailable`);
    res.json({ 
      loggedIn: false
    });
  }
}

const register = async (req, res) => {
  // console.log("Request received at /register");
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      logError(req.method, req.url, "registration failed, provided information is invalid");
      return res.status(400).json({
        success: false,
        message: "Provided information is invalid",
      });
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

const login = async (req, res) => {
  // console.log("Request received at /login");
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      logError(req.method, req.url, "login failed, provided information is invalid");
      return res.status(400).json({
        success: false,
        message: "Provided information is invalid",
      });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      logError(req.method, req.url, "login failed, user email is invalid");
      return res.status(400).json({
        success: false,
        message: "User email is invalid"
      })
    }
    const pwCheck = await bcrypt.compare(password, user.password);
    if (!pwCheck) {
      logError(req.method, req.url, "login failed, user password is not match");
      return res.status(400).json({
        success: false,
        message: "User password is not match"
      })
    }

    req.session.user = {
        id: user._id,
        email: user.email,
        name: user.name
    };
    // console.log("Session created:", req.session);
    logInfo(req.method, req.url, "session created, login successful");

    return res.status(200).json({
      success: true,
      message: "Login successful!",
    });
  } catch (err) {
    logError(req.method, req.url, `login failed with Internal Server Error: ${err}`);
    // console.error("Failed with Internal Server Error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
};

const logout = (req, res) => {
  // console.log("Request received at /logout, session: ", req.session.user);
  req.session.destroy(err => {
    if (err) {
      logError(req.method, req.url, `logout failed with Internal Server Error: ${err}`);
      // console.error("Logout failed with Internal Server Error:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Internal Server Error" 
      });
    }
    // console.error("Session destroyed, logout successful");
    logInfo(req.method, req.url, "session destroyed, logout successful");
    
    res.clearCookie('connect.sid');
    res.status(200).json({ 
      success: true, 
      message: "Logged out successfully" 
    });
  });
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
  checkLogin,
  register,
  login,
  logout,
  deleteAccount
};