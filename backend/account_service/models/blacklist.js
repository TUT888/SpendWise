const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  blacklistAt: { type: Date, required: true, default: Date.now }
});

const Blacklist = mongoose.model('Blacklist', blacklistSchema);
module.exports = Blacklist;