const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, required: false }
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;