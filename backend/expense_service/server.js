require("dotenv").config();

// Setup server
const express = require("express");

const app = express();
const port = process.env.PORT || 3032;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require("./database/connectDB");
app.use("/api/expense", require('./routes/expenseRouter'))

// Start server
app.listen(port, () => {
  console.log("Server started: http://localhost:" + port);
});

module.exports = app;