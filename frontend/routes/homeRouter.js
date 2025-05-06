const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/authentication')
const { SERVICES } = require('../services')

router.get('/', isAuthenticated, (req, res) => {
  res.render('home', {
    session: res.locals.user,
    service_api: SERVICES
  });
});

router.get('/register', isAuthenticated, (req, res) => {
  res.render('register', {
    session: res.locals.user,
    service_api: SERVICES
  });
});

router.get('/login', isAuthenticated, (req, res) => {
  res.render('login', {
    session: res.locals.user,
    service_api: SERVICES
  });
});

module.exports = router;