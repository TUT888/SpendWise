const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Auth base route: /api/auth (defined in index.js)
router.get('/status', authController.checkLogin);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;