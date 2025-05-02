const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, min: 0, required: true },
  date: { type: Date, default: Date.now },
  description: { type: String, required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false },
});

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;