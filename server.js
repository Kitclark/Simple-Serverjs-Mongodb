// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Middleware to parse JSON
app.use(express.json());

// MongoDB URI from .env or fallback
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern-app';

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// Define schema & model
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true }
});
const User = mongoose.model('User', userSchema);

// Test route
app.get('/', (req, res) => {
  res.send('Hello, MERN Stack!');
});

// ✅ POST route with duplicate email check
app.post('/add-user', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).send('⚠️ Name and email are required.');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('⚠️ This email is already registered.');
    }

    const newUser = new User({ name, email });
    await newUser.save();
    res.send('✅ User added!');
  } catch (err) {
    console.error('❌ Error saving user:', err.message);
    res.status(500).send('❌ Server error');
  }
});

// 🔄 Flexible UPDATE route by ID, email, or name
app.put('/update-user', async (req, res) => {
  try {
    const { id, email, name, newName, newEmail } = req.body;

    // Determine search criteria
    const criteria = id ? { _id: id } : email ? { email } : name ? { name } : null;
    if (!criteria) return res.status(400).send('⚠️ Provide id, email, or name to update.');

    // Set fields to update
    const updates = {};
    if (newName) updates.name = newName;
    if (newEmail) updates.email = newEmail;

    const updatedUser = await User.findOneAndUpdate(criteria, updates, { new: true });

    if (!updatedUser) return res.status(404).send('❌ User not found.');
    res.send(`✅ User updated: ${JSON.stringify(updatedUser)}`);
  } catch (err) {
    console.error('❌ Error updating user:', err.message);
    res.status(500).send('❌ Server error');
  }
});

// 🗑️ Flexible DELETE route by ID, email, or name
app.delete('/delete-user', async (req, res) => {
  try {
    const { id, email, name } = req.body;

    const criteria = id ? { _id: id } : email ? { email } : name ? { name } : null;
    if (!criteria) return res.status(400).send('⚠️ Provide id, email, or name to delete.');

    const deletedUser = await User.findOneAndDelete(criteria);

    if (!deletedUser) return res.status(404).send('❌ User not found.');
    res.send(`🗑️ User deleted: ${JSON.stringify(deletedUser)}`);
  } catch (err) {
    console.error('❌ Error deleting user:', err.message);
    res.status(500).send('❌ Server error');
  }
});


// 🔍 GET all users
app.get('/user', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.json(users); // Send them as JSON
  } catch (err) {
    console.error('❌ Error fetching users:', err.message);
    res.status(500).send('❌ Server error');
  }
});


// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
