const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { authenticateToken } = require('../../middleware/auth');

// Login endpoint - Simple admin check for demo
router.post('/login', async (req, res) => {
  try {
    // Ensure database connection for serverless
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const database = require('../../config/database');
      await database.connect();
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Simple validation: password must be 'admin123'
    if (password !== 'admin123') {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if email contains 'admin' to grant admin role
    const isAdmin = email.toLowerCase().includes('admin');
    const role = isAdmin ? 'admin' : 'user';

    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Create new user
      user = new User({
        email: email.toLowerCase(),
        name: email.split('@')[0],
        role: role,
        isVerified: true,
        isActive: true
      });
      await user.save();
    } else {
      // Update role if email contains admin
      if (isAdmin && user.role !== 'admin') {
        user.role = 'admin';
      }
      user.lastLoginAt = new Date();
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    console.error('Login error stack:', error.stack);
    res.status(500).json({ 
      error: 'Authentication failed',
      message: error.message 
    });
  }
});

// Register endpoint  
router.post('/register', async (req, res) => {
  try {
    // This will be implemented with your preferred auth method
    res.json({ message: 'Auth register endpoint - to be implemented' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Logout endpoint
router.post('/logout', async (req, res) => {
  try {
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

module.exports = router;