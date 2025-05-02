const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require("../models/user");

const register = async (req, res) => {
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
  try {
    console.log("1");
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

module.exports = {
  register,
  login,
  // logout,
};
