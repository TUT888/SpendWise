const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/authentication')
const { SERVICES } = require('../services')

router.get('/expense', isAuthenticated, async (req, res) => {
  const user_email = res.locals.user.email;
  console.log(user_email);
  console.log(SERVICES.EXPENSE);
  const cookies = req.headers.cookie;
  // get expense data
  var response = await fetch(`${SERVICES.EXPENSE}/api/expense?user_email=${user_email}`, {
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
    service_api: SERVICES,
    all_expenses: expenseData.expense
  });
});

// router.post('/', isAuthenticated, expenseController.addExpense);
// router.put('/', isAuthenticated, expenseController.updateExpense);
// router.delete('/', isAuthenticated, expenseController.deleteExpense);

module.exports = router;