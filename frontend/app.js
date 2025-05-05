require("dotenv").config();

const isAuthenticated = require('./middlewares/authentication')
// Setup server
const express = require("express");

const app = express();
const port = process.env.PORT || 3000;
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup views
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Routing (default)
app.get('/', isAuthenticated, (req, res) => {
  res.render('home', { session: res.locals.user });
});
app.get('/register', isAuthenticated, (req, res) => {
  res.render('register', { session: res.locals.user });
});
app.get('/login', isAuthenticated, (req, res) => {
  res.render('login', { session: res.locals.user });
});

// Routing (authenticated)
app.get('/account', isAuthenticated, (req, res) => {
  res.render('account', { session: res.locals.user });
});
app.get('/expense', isAuthenticated, (req, res) => {
  res.render('expense', { session: res.locals.user });
});
app.get('/category', isAuthenticated, (req, res) => {
  res.render('category', { session: res.locals.user });
});

// Start server
app.listen(port, () => {
  console.log("Server started: http://localhost:" + port);
});

module.exports = app;