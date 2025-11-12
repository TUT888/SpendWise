require("dotenv").config();

// Setup server
const express = require("express");
const app = express();
const port = process.env.PORT || 3080;
const path = require("path");
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Setup views
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Logging
const { logger } = require("./logger")

// Authentication
const checkLogin = require('./middlewares/checkLogin')
const requireAuth = require('./middlewares/requireAuth')

// ========== Start Routing ========== //
app.use(checkLogin);
app.use((req, res, next) => {
  let req_url = req.url;
  let req_method = req.method;
  let user = req.locals.user ? req.locals.user.email : "none";
  logger.info(`[FRONTEND] ${req_method} at ${req_url}: request received with login status ${req.locals && req.locals.loggedIn}, user: ${user}`);
  next();
});

app.get('/', (req, res) => {
  res.render('home', { session: req.locals.user });
});

// ========== Register route ========== //
app.get('/register', (req, res) => {
  if (req.locals && req.locals.loggedIn) return res.redirect('/');
  res.render('register', { session: req.locals.user });
});

app.post('/register', async (req, res) => {
  if (req.locals && req.locals.loggedIn) return res.redirect('/');

  var response = await fetch(`${process.env.ACCOUNT_SERVICE_URL}/api/account`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `Bearer ${req.locals?.token}`
    },
    body: JSON.stringify(req.body)
  });
  var result = await response.json();
  return res.status(response.status).json({ result });
});

// ========== Login route ========== //
app.get('/login', (req, res) => {
  if (req.locals && req.locals.loggedIn) return res.redirect('/');
  res.render('login', { session: req.locals.user });
});

app.post('/login', async (req, res) => {
  if (req.locals && req.locals.loggedIn) return res.redirect('/');

  var response = await fetch(`${process.env.ACCOUNT_SERVICE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req.body)
  });
  const data = await response.json();
  res.cookie('jwt_token', data.token, {
    httpOnly: true,
  })

  return res.status(response.status).json({ result: data });
});

// ========== Logout route ========== //
app.post('/logout', requireAuth, async (req, res) => {
  var response = await fetch(`${process.env.ACCOUNT_SERVICE_URL}/api/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${req.locals?.token}`
    }
  });
  
  var result = await response.json();
  return res.status(response.status).json({ result });
});

// ========== Account route ========== //
app.get('/account', requireAuth, (req, res) => {
  res.render('account', { session: req.locals.user });
});

// ========== Expense route ========== //
app.get('/expense', requireAuth, async (req, res) => {
  // get expense data
  var response = await fetch(`${process.env.EXPENSE_SERVICE_URL}/api/expense`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${req.locals?.token}`
    }
  });
  var expenseData = await response.json();

  // render
  res.render('expense', {
    session: req.locals.user,
    all_expenses: expenseData.expense
  });
});
 
app.post('/expense', requireAuth, async (req, res) => {
  var response = await fetch(`${process.env.EXPENSE_SERVICE_URL}/api/expense`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${req.locals?.token}`
    },
    body: JSON.stringify(req.body)
  });
  var result = await response.json();
  return res.status(response.status).json({ result });
});

app.put('/expense', requireAuth, async (req, res) => {
  var response = await fetch(`${process.env.EXPENSE_SERVICE_URL}/api/expense`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${req.locals?.token}`
    },
    body: JSON.stringify(req.body)
  });
  var result = await response.json();
  return res.status(response.status).json({ result });
});

app.delete('/expense', requireAuth, async (req, res) => {
  var response = await fetch(`${process.env.EXPENSE_SERVICE_URL}/api/expense`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${req.locals?.token}`
    },
    body: JSON.stringify(req.body)
  });
  var result = await response.json();
  return res.status(response.status).json({ result });
});

// Start server
app.listen(port, () => {
  console.log("Server started: http://localhost:" + port);
});

module.exports = app;