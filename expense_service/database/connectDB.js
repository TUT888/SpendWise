const mongoose = require('mongoose');
const url = process.env.MONGO_URI;
console.log(url)

mongoose.connect(url);

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('Error connecting to MongoDB', err);
});