const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const isAuthenticated = require('../middlewares/authentication')

router.get('/', isAuthenticated, expenseController.getAllExpense);
router.post('/', isAuthenticated, expenseController.addExpense);
router.put('/', isAuthenticated, expenseController.updateExpense);
router.delete('/', isAuthenticated, expenseController.deleteExpense);

module.exports = router;