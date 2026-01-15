const mongoose = require('mongoose');

// Cache the connection for serverless
let cachedConnection = null;

const connect = async () => {
  // Reuse existing connection in serverless environment
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('♻️  Reusing existing MongoDB connection');
    return cachedConnection;
  }

  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Increased for serverless
      socketTimeoutMS: 45000,
      maxPoolSize: 10, // Connection pool for serverless
      minPoolSize: 1,
    };

    cachedConnection = await mongoose.connect(process.env.MONGODB_URI, options);

    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  Mongoose disconnected from MongoDB');
      cachedConnection = null;
    });

    return cachedConnection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    cachedConnection = null;
    throw error;
  }
};

const disconnect = async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error.message);
    throw error;
  }
};

const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = { 
  connect, 
  disconnect,
  isConnected 
};