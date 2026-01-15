/**
 * Seed script to create initial admin user
 * Run with: node scripts/createAdmin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function createAdminUser() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@smartpharmacy.com' });
    
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      
      // Update to ensure role is admin
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Updated user role to admin');
      }
    } else {
      // Create new admin user
      const adminUser = new User({
        email: 'admin@smartpharmacy.com',
        name: 'Admin User',
        role: 'admin',
        isActive: true,
        isVerified: true
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully!');
      console.log('\n📋 Admin Credentials:');
      console.log('Email: admin@smartpharmacy.com');
      console.log('Password: admin123 (demo password - change in production)');
      console.log('\n⚠️  Note: This is a demo setup. In production:');
      console.log('   - Implement proper password hashing (bcrypt)');
      console.log('   - Use secure password management');
      console.log('   - Enable 2FA for admin accounts');
    }

    // Disconnect
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

// Run the script
createAdminUser();
