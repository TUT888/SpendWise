const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require("../models/user");

const checkLogin = (req, res) => {
  console.log("Request received at /status, session: ", req.session.user);
  if (req.session.user) {
    res.json({ 
      loggedIn: true, user: req.session.user
    });
  } else {
    res.json({ 
      loggedIn: false
    });
  }
}

const register = async (req, res) => {
  console.log("Request received at /register");
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
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

    return res.status(200).json({
      success: true,
      message: "Registration successful!",
    });
  } catch (err) {
    console.error("Failed with Internal Server Error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
};

const login = async (req, res) => {
  console.log("Request received at /login");
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Provided information is invalid",
      });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User email is invalid"
      })
    }
    const pwCheck = await bcrypt.compare(password, user.password);
    if (!pwCheck) {
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
    console.log("Session created:", req.session);

    return res.status(200).json({
      success: true,
      message: "Login successful!",
    });
  } catch (err) {
    console.error("Failed with Internal Server Error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
};

const logout = (req, res) => {
  console.log("Request received at /logout, session: ", req.session.user);
  req.session.destroy(err => {
    if (err) {
      console.error("Logout failed with Internal Server Error:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Internal Server Error" 
      });
    }
    console.error("Session destroyed, logout successful");
    res.clearCookie('connect.sid');
    res.status(200).json({ 
      success: true, 
      message: "Logged out successfully" 
    });
  });
};

module.exports = {
  checkLogin,
  register,
  login,
  logout
};