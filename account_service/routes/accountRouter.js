const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// Auth status check
router.get('/status', accountController.checkLogin);

router.post('/register', accountController.register);
router.post('/login', accountController.login);
router.post('/logout', accountController.logout);

router.delete('/', accountController.deleteAccount);

module.exports = router;