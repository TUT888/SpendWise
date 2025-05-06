require("dotenv").config();

// Setup server
const express = require("express");

const app = express();
const port = process.env.PORT || 3080;
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup views
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Access API from outside of services network, access via browser (localhost)
const isAuthenticated = require('./middlewares/authentication')
const SERVICES = {
  ACCOUNT: "http://localhost:" + process.env.ACCOUNT_SERVICE_URL.split(":").pop(),
  EXPENSE: "http://localhost:" + process.env.EXPENSE_SERVICE_URL.split(":").pop()
}

// Routing
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

app.get('/account', isAuthenticated, (req, res) => {
  res.render('account', {
    session: res.locals.user,
    service_api: SERVICES
  });
});

app.get('/expense', isAuthenticated, async (req, res) => {
  const user_email = res.locals.user.email;
  const cookies = req.headers.cookie;
  // get expense data
  var response = await fetch(`${process.env.EXPENSE_SERVICE_URL}/api/expense?user_email=${user_email}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies
    }
  });
  var expenseData = await response.json();

  // render
  res.render('expense', {
    session: res.locals.user,
    service_api: SERVICES,
    all_expenses: expenseData.expense
  });
});

// Start server
app.listen(port, () => {
  console.log("Server started: http://localhost:" + port);
});

module.exports = app;