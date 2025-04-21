// models/User.js
const mongoose = require('mongoose');

// Create a Schema for the user model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
