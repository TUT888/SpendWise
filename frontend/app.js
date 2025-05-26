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
  let user = res.locals.user ? res.locals.user.email : "none";
  logger.info(`[FRONTEND] ${req_method} at ${req_url}: request received with login status ${res.locals.loggedIn}, user: ${user}`);
  next();
});

app.get('/', (req, res) => {
  res.render('home', { session: res.locals.user });
});

// ========== Register route ========== //
app.get('/register', (req, res) => {
  if (res.locals.loggedIn) return res.redirect('/');
  res.render('register', { session: res.locals.user });
});

app.post('/register', async (req, res) => {
  if (res.locals.loggedIn) return res.redirect('/');

  const cookies = req.headers.cookie;
  var response = await fetch(`${process.env.ACCOUNT_SERVICE_URL}/api/account/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies
    },
    body: JSON.stringify(req.body)
  });
  var result = await response.json();
  return res.status(response.status).json({ result });
});

// ========== Login route ========== //
app.get('/login', (req, res) => {
  if (res.locals.loggedIn) return res.redirect('/');
  res.render('login', { session: res.locals.user });
});

app.post('/login', async (req, res) => {
  if (res.locals.loggedIn) return res.redirect('/');

  const cookies = req.headers.cookie;
  var response = await fetch(`${process.env.ACCOUNT_SERVICE_URL}/api/account/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies
    },
    body: JSON.stringify(req.body)
  });

  const setCookieHeader = response.headers.get('set-cookie');
  if (setCookieHeader) {
    res.setHeader('set-cookie', setCookieHeader);
  }
  var result = await response.json();
  return res.status(response.status).json({ result });
});

// ========== Logout route ========== //
app.post('/logout', requireAuth, async (req, res) => {
  const cookies = req.headers.cookie;
  var response = await fetch(`${process.env.ACCOUNT_SERVICE_URL}/api/account/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies
    }
  });
  
  var result = await response.json();
  return res.status(response.status).json({ result });
});

// ========== Account route ========== //
app.get('/account', requireAuth, (req, res) => {
  res.render('account', { session: res.locals.user });
});

// ========== Expense route ========== //
app.get('/expense', requireAuth, async (req, res) => {
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
    all_expenses: expenseData.expense
  });
});
 
app.post('/expense', requireAuth, async (req, res) => {
  const cookies = req.headers.cookie;
  var response = await fetch(`${process.env.EXPENSE_SERVICE_URL}/api/expense`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies
    },
    body: JSON.stringify(req.body)
  });
  var result = await response.json();
  return res.status(response.status).json({ result });
});

app.put('/expense', requireAuth, async (req, res) => {
  const cookies = req.headers.cookie;
  var response = await fetch(`${process.env.EXPENSE_SERVICE_URL}/api/expense`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies
    },
    body: JSON.stringify(req.body)
  });
  var result = await response.json();
  return res.status(response.status).json({ result });
});

app.delete('/expense', requireAuth, async (req, res) => {
  const cookies = req.headers.cookie;
  var response = await fetch(`${process.env.EXPENSE_SERVICE_URL}/api/expense`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies
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