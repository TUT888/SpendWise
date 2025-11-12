const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// Account base route: /api/account (defined in index.js)
router.post('/', accountController.createAccount);
router.delete('/', accountController.deleteAccount);

module.exports = router;