const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const database = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - MUST be before other middleware
app.use(cors({
  origin: '*', // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // Cache preflight for 10 minutes
}));

// Handle preflight requests
app.options('*', cors());

// Helmet middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/otp', require('./routes/otp'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/admin', require('./routes/admin/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/prescriptions', require('./routes/prescriptions'));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'LifePharmacy Backend API',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      products: '/api/products',
      admin: '/api/admin',
      auth: '/api/auth',
      otp: '/api/otp',
      orders: '/api/orders',
      prescriptions: '/api/prescriptions'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'lifepharmacy-backend',
    database: database.isConnected() ? 'connected' : 'disconnected'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize database and start server
async function startServer() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await database.connect();
    console.log('✅ MongoDB connected successfully!');
    console.log(`📊 Database: ${process.env.MONGODB_URI.split('@')[1].split('/')[0]}`);
    
    // Only start server if not running on Vercel (Vercel handles this)
    if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`🚀 LifePharmacy Backend Server Started`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📱 Server running on: http://localhost:${PORT}`);
        console.log(`🏥 Health check: http://localhost:${PORT}/health`);
        console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`✉️  Email service: ${process.env.EMAIL_USER ? 'Configured' : 'Development mode (console logs)'}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      });
    }
  } catch (error) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ FATAL ERROR: Failed to start server');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error(`💥 Error: ${error.message}`);
    
    if (error.message.includes('ECONNREFUSED') || error.message.includes('MongooseServerSelectionError')) {
      console.error('🔍 Database connection failed. Please check:');
      console.error('   1. MongoDB connection string in .env file');
      console.error('   2. Network connectivity');
      console.error('   3. MongoDB Atlas IP whitelist settings');
      console.error('   4. Username and password are correct');
    }
    
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Don't exit on Vercel, let it handle the error
    if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
      process.exit(1);
    }
  }
}

// Graceful shutdown (not needed on Vercel serverless)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await database.disconnect();
    console.log('✅ Database disconnected');
    console.log('👋 Server stopped');
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n🛑 SIGTERM received, shutting down...');
    await database.disconnect();
    process.exit(0);
  });
}

startServer();

// Export for Vercel serverless
module.exports = app;