const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const { verifyToken } = require('../../middleware/auth');

// Get all users (admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Ensure database connection for serverless
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const database = require('../../config/database');
      await database.connect();
    }

    const users = await User.find()
      .select('-password -__v')
      .sort({ createdAt: -1 })
      .lean();
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch users',
      message: error.message 
    });
  }
});

// Get single user (admin only)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await User.findById(req.params.id).select('-__v');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user (admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { name, email, phone, role, isActive, isVerified } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, role, isActive, isVerified, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
