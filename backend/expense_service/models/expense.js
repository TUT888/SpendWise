const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, min: 0, required: true },
  description: { type: String, required: true },
  category_name: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;