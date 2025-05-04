require("dotenv").config();

// Setup server
const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS for frontend origin
const cors = require('cors');
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true // for using cookies or authentication headers
}));

require("./database/connectDB");
app.use("/api/category", require('./routes/categoryRouter'))

// Start server
app.listen(port, () => {
  console.log("Server started: http://localhost:" + port);
});

module.exports = app;