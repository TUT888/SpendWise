require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

require("./database/connectDB");

// Routing
app.use("/", require('./routes/homeRouter'));
app.use("/api/account", require('./routes/accountRouter'))
app.use("/api/expense", require('./routes/expenseRouter'))
app.use("/api/category", require('./routes/categoryRouter'))

app.listen(port, () => {
  console.log("Server started: http://localhost:" + port);
});

module.exports = app;