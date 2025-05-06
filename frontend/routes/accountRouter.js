const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/authentication')
const { SERVICES } = require('../services')

router.get('/account', isAuthenticated, (req, res) => {
  res.render('account', {
    session: res.locals.user,
    service_api: SERVICES
  });
});

module.exports = router;