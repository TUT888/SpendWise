require("dotenv").config();

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

// Routing
app.use(async (req, res, next) => {
  try {
    const cookies = req.headers.cookie;
    const response = await fetch('http://localhost:3030/api/account/status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      },
    });

    const data = await response.json();
    console.log(`Login status: ${data.loggedIn}`)

    res.locals.loggedIn = data.loggedIn;
    res.locals.user = data.user || null;
  } catch (err) {
    res.locals.loggedIn = false;
    res.locals.user = null;
  }
  next();
});

// Routing (default)
app.get('/', (req, res) => {
  res.render('home', { session: res.locals.user });
});
app.get('/register', (req, res) => {
  if (res.locals.loggedIn) {
    return res.redirect('/');
  }
  res.render('register', { session: res.locals.user });
});
app.get('/login', (req, res) => {
  if (res.locals.loggedIn) {
      return res.redirect('/');
  }
  res.render('login', { session: res.locals.user });
});

// Routing (authenticated)
app.get('/account', (req, res) => {
  if (!res.locals.loggedIn) {
      return res.redirect('/');
  }
  res.render('account', { session: res.locals.user });
});
app.get('/expense', (req, res) => {
  if (!res.locals.loggedIn) {
      return res.redirect('/');
  }
  res.render('expense', { session: res.locals.user });
});
app.get('/category', (req, res) => {
  if (!res.locals.loggedIn) {
      return res.redirect('/');
  }
  res.render('category', { session: res.locals.user });
});

// Start server
app.listen(port, () => {
  console.log("Server started: http://localhost:" + port);
});

module.exports = app;