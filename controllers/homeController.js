const User = require("../models/user");

const renderView = (req, res) => {
  // User.insertOne({
  //   email: "abc@gmail.com",
  //   password: "123345",
  //   name: "Test" 
  // })
  res.render('home');
}

module.exports = {
  renderView
}