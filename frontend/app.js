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
 
// Servies that inside Docker
const SERVICES_INTERNAL = {
  ACCOUNT: process.env.ACCOUNT_SERVICE_URL || "",
  CATEGORY: process.env.CATEGORY_SERVICE_URL || "",
  EXPENSE: process.env.EXPENSE_SERVICE_URL || ""
}
// Services that outside of Docker (localhost)
const SERVICES = {
  ACCOUNT: "http://localhost:" + process.env.ACCOUNT_SERVICE_URL.split(":").pop(),
  CATEGORY: "http://localhost:" + process.env.ACCOUNT_SERVICE_URL.split(":").pop(),
  EXPENSE: "http://localhost:" + process.env.ACCOUNT_SERVICE_URL.split(":").pop()
}

// Routing (default)
app.get('/', isAuthenticated, (req, res) => {
  res.render('home', {
    session: res.locals.user,
    service_api: SERVICES
  });
});
app.get('/register', isAuthenticated, (req, res) => {
  res.render('register', {
    session: res.locals.user,
    service_api: SERVICES
  });
});
app.get('/login', isAuthenticated, (req, res) => {
  res.render('login', {
    session: res.locals.user,
    service_api: SERVICES
  });
});

// Routing (authenticated)
app.get('/account', isAuthenticated, (req, res) => {
  res.render('account', {
    session: res.locals.user,
    service_api: SERVICES
  });
});
app.get('/expense', isAuthenticated, (req, res) => {
  res.render('expense', {
    session: res.locals.user,
    service_api: SERVICES
  });
});
app.get('/category', isAuthenticated, (req, res) => {
  res.render('category', {
    session: res.locals.user,
    service_api: SERVICES
  });
});

// Start server
app.listen(port, () => {
  console.log("Server started: http://localhost:" + port);
});

module.exports = app;