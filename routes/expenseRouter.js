const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.get('/', expenseController.getAllExpense);
router.post('/', expenseController.addExpense);
router.put('/', expenseController.updateExpense);
router.delete('/', expenseController.deleteExpense);

module.exports = router;