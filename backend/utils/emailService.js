const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  // For development, use ethereal email (fake SMTP service)
  // For production, use real SMTP service (Gmail, SendGrid, AWS SES, etc.)
  
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // Production configuration
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    // Development configuration - using ethereal
    console.log('⚠️ No email configuration found. Using development mode.');
    return null;
  }
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"LifePharmacy" <noreply@lifepharmacy.com>',
    to: email,
    subject: 'Your LifePharmacy Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #002579 0%, #a92579 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
          }
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          .otp-box {
            background: #f8f9fa;
            border: 2px dashed #002579;
            border-radius: 8px;
            padding: 30px;
            margin: 30px 0;
          }
          .otp-code {
            font-size: 48px;
            font-weight: bold;
            color: #002579;
            letter-spacing: 8px;
            margin: 10px 0;
            font-family: 'Courier New', monospace;
          }
          .message {
            font-size: 16px;
            color: #666;
            margin: 20px 0;
          }
          .expiry {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px 16px;
            margin: 20px 0;
            text-align: left;
            color: #856404;
            font-size: 14px;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 13px;
            color: #666;
            border-top: 1px solid #dee2e6;
          }
          .security-note {
            background: #e7f3ff;
            border-left: 4px solid #2196F3;
            padding: 12px 16px;
            margin: 20px 0;
            text-align: left;
            font-size: 14px;
            color: #0c5460;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏥 LifePharmacy</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">UAE's Largest Pharmacy Network</p>
          </div>
          
          <div class="content">
            <h2 style="color: #002579; margin-bottom: 20px;">Verification Code</h2>
            <p class="message">
              Use the following code to complete your login:
            </p>
            
            <div class="otp-box">
              <p style="margin: 0; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 2px;">Your OTP Code</p>
              <div class="otp-code">${otp}</div>
            </div>
            
            <div class="expiry">
              <strong>⏰ Important:</strong> This code will expire in <strong>5 minutes</strong>
            </div>
            
            <div class="security-note">
              <strong>🔒 Security Tip:</strong> Never share this code with anyone. LifePharmacy will never ask for your verification code via phone or email.
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #999;">
              If you didn't request this code, please ignore this email or contact our support team.
            </p>
          </div>
          
          <div class="footer">
            <p style="margin: 5px 0;">© ${new Date().getFullYear()} LifePharmacy. All rights reserved.</p>
            <p style="margin: 5px 0;">Healthcare at Your Doorstep</p>
            <p style="margin: 5px 0;">
              <a href="#" style="color: #002579; text-decoration: none;">Contact Support</a> | 
              <a href="#" style="color: #002579; text-decoration: none;">Privacy Policy</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Your LifePharmacy verification code is: ${otp}. This code will expire in 5 minutes. Never share this code with anyone.`,
  };

  try {
    if (transporter) {
      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } else {
      // Development mode - just log the OTP
      console.log('📧 [DEV MODE] Email OTP for', email, ':', otp);
      return { success: true, devMode: true };
    }
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, userName) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"LifePharmacy" <noreply@lifepharmacy.com>',
    to: email,
    subject: 'Welcome to LifePharmacy! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #002579 0%, #a92579 100%);
            padding: 50px 20px;
            text-align: center;
            color: white;
          }
          .content {
            padding: 40px 30px;
          }
          .button {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #002579 0%, #a92579 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 13px;
            color: #666;
            border-top: 1px solid #dee2e6;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 32px;">Welcome to LifePharmacy! 🎉</h1>
          </div>
          
          <div class="content">
            <h2 style="color: #002579;">Hello ${userName || 'there'}!</h2>
            <p>Thank you for joining LifePharmacy, UAE's largest pharmacy network.</p>
            <p>You now have access to:</p>
            <ul style="line-height: 2;">
              <li>✅ Over 100,000 healthcare products</li>
              <li>✅ Fast delivery across UAE</li>
              <li>✅ Exclusive deals and discounts</li>
              <li>✅ Expert health consultation</li>
              <li>✅ Prescription management</li>
            </ul>
            <div style="text-align: center;">
              <a href="#" class="button">Start Shopping</a>
            </div>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} LifePharmacy. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Welcome to LifePharmacy! Thank you for joining us.`,
  };

  try {
    if (transporter) {
      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Welcome email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } else {
      console.log('📧 [DEV MODE] Welcome email for', email);
      return { success: true, devMode: true };
    }
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    throw error;
  }
};

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail,
};
