const express = require('express');
const router = express.Router();
const otpStore = require('../../utils/otpStore');
const { sendSMS } = require('../../utils/smsService');
const { sendOTPEmail, sendWelcomeEmail } = require('../../utils/emailService');
const { validate, phoneSchema, otpSchema, emailSchema, emailOtpSchema } = require('../../middleware/validation');
const { rateLimiter } = require('../../middleware/auth');
const User = require('../../models/User');

// Send OTP via Email - with rate limiting and validation
router.post('/send-email', rateLimiter(3, 15 * 60 * 1000), validate(emailSchema), async (req, res) => {
  try {
    const { email } = req.body;

    const cleanEmail = email.trim().toLowerCase();
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with timestamp (expires in 5 minutes)
    otpStore.set(cleanEmail, {
      otp,
      timestamp: Date.now(),
      attempts: 0
    });

    // Send Email with OTP
    try {
      await sendOTPEmail(cleanEmail, otp);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // In development, continue even if email fails
      if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({ error: 'Failed to send email' });
      }
    }
    
    res.json({
      success: true,
      message: 'OTP sent to your email',
      // Remove this in production - only for development
      devOtp: process.env.NODE_ENV === 'development' ? otp : undefined
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify Email OTP - with validation
router.post('/verify-email', validate(emailOtpSchema), async (req, res) => {
  try {
    const { email, otp } = req.body;

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();
    
    const storedData = otpStore.get(cleanEmail);
    
    if (!storedData) {
      return res.status(400).json({
        error: 'OTP not found or expired'
      });
    }

    // Check if OTP is expired (5 minutes)
    const now = Date.now();
    if (now - storedData.timestamp > 5 * 60 * 1000) {
      otpStore.delete(cleanEmail);
      return res.status(400).json({
        error: 'OTP has expired'
      });
    }

    // Check attempts (max 3 attempts)
    if (storedData.attempts >= 3) {
      otpStore.delete(cleanEmail);
      return res.status(400).json({
        error: 'Too many attempts. Please request a new OTP'
      });
    }

    // Verify OTP
    if (storedData.otp !== cleanOtp) {
      storedData.attempts += 1;
      return res.status(400).json({
        error: 'Invalid OTP',
        attemptsLeft: 3 - storedData.attempts
      });
    }

    // OTP is valid - remove it from storage
    otpStore.delete(cleanEmail);

    // Check if user exists in database
    let user = await User.findOne({ email: cleanEmail });
    let isNewUser = false;

    if (!user) {
      // Create new user
      isNewUser = true;
      user = new User({
        email: cleanEmail,
        isVerified: true,
        lastLoginAt: new Date()
      });
      await user.save();
      console.log('✅ New user created:', cleanEmail);
    } else {
      // Update existing user
      user.lastLoginAt = new Date();
      user.isVerified = true;
      await user.save();
      console.log('✅ Existing user logged in:', cleanEmail);
    }

    // Send welcome email for new users
    if (isNewUser) {
      try {
        await sendWelcomeEmail(cleanEmail);
      } catch (error) {
        console.error('Failed to send welcome email:', error);
        // Don't fail the request if welcome email fails
      }
    }

    // Return user data
    const userData = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified,
      verifiedAt: now,
      isNewUser
    };

    res.json({
      success: true,
      message: 'Email verified successfully',
      user: userData
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Send OTP via Phone (legacy) - with rate limiting and validation
router.post('/send', rateLimiter(3, 15 * 60 * 1000), validate(phoneSchema), async (req, res) => {
  try {
    const { phone } = req.body;

    const cleanPhone = phone.trim();
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with timestamp (expires in 5 minutes)
    otpStore.set(cleanPhone, {
      otp,
      timestamp: Date.now(),
      attempts: 0
    });

    // Send SMS with OTP
    const smsMessage = `Your LifePharmacy verification code is: ${otp}. Valid for 5 minutes.`;
    
    try {
      await sendSMS(cleanPhone, smsMessage);
    } catch (smsError) {
      console.error('SMS sending failed:', smsError);
      // In development, continue even if SMS fails
      if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({ error: 'Failed to send SMS' });
      }
    }
    
    res.json({
      success: true,
      message: 'OTP sent successfully',
      // Remove this in production - only for development
      devOtp: process.env.NODE_ENV === 'development' ? otp : undefined
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP - with validation
router.post('/verify', validate(otpSchema), async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const cleanPhone = phone.trim();
    const cleanOtp = otp.trim();
    
    const storedData = otpStore.get(cleanPhone);
    
    if (!storedData) {
      return res.status(400).json({
        error: 'OTP not found or expired'
      });
    }

    // Check if OTP is expired (5 minutes)
    const now = Date.now();
    if (now - storedData.timestamp > 5 * 60 * 1000) {
      otpStore.delete(cleanPhone);
      return res.status(400).json({
        error: 'OTP has expired'
      });
    }

    // Check attempts (max 3 attempts)
    if (storedData.attempts >= 3) {
      otpStore.delete(cleanPhone);
      return res.status(400).json({
        error: 'Too many attempts. Please request a new OTP'
      });
    }

    // Verify OTP
    if (storedData.otp !== cleanOtp) {
      storedData.attempts += 1;
      return res.status(400).json({
        error: 'Invalid OTP'
      });
    }

    // OTP is valid - remove it from storage
    otpStore.delete(cleanPhone);

    // Create user session/token (simplified for demo)
    const user = {
      id: cleanPhone,
      phone: cleanPhone,
      verifiedAt: now
    };

    res.json({
      success: true,
      message: 'Phone number verified successfully',
      user
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

module.exports = router;