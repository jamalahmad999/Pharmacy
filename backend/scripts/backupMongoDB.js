const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.error('❌ .env file not found at', envPath);
  process.exit(1);
}

// Import all models
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const Order = require('../models/Order');
const Prescription = require('../models/Prescription');

// Collections to backup
const collections = [
  { name: 'users', model: User },
  { name: 'products', model: Product },
  { name: 'categories', model: Category },
  { name: 'brands', model: Brand },
  { name: 'orders', model: Order },
  { name: 'prescriptions', model: Prescription },
];

// Create backup directory with timestamp
const backupDir = path.join(
  __dirname,
  '../backups',
  `backup_${new Date().toISOString().split('T')[0]}_${Date.now()}`
);

const backupData = async () => {
  try {
    // Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Create backup directory
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
      console.log(`📁 Created backup directory: ${backupDir}`);
    }

    let totalDocuments = 0;

    // Backup each collection
    for (const collection of collections) {
      try {
        console.log(`\n📥 Backing up ${collection.name}...`);
        
        // Find all documents in the collection
        const data = await collection.model.find({}).lean();
        
        // Write to JSON file
        const filePath = path.join(backupDir, `${collection.name}.json`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        
        console.log(
          `✅ ${collection.name}: ${data.length} documents backed up → ${filePath}`
        );
        totalDocuments += data.length;
      } catch (error) {
        console.error(
          `⚠️  Error backing up ${collection.name}:`,
          error.message
        );
      }
    }

    // Create a summary file
    const summary = {
      backupDate: new Date().toISOString(),
      totalCollections: collections.length,
      totalDocuments: totalDocuments,
      collections: collections.map((c) => ({
        name: c.name,
        fileName: `${c.name}.json`,
      })),
      mongodbUri: process.env.MONGODB_URI
        ? process.env.MONGODB_URI.split('@')[0] + '@***'
        : 'Not configured',
    };

    const summaryPath = path.join(backupDir, 'backup_summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf8');

    console.log('\n' + '='.repeat(50));
    console.log('🎉 Backup completed successfully!');
    console.log('='.repeat(50));
    console.log(`📊 Total documents backed up: ${totalDocuments}`);
    console.log(`📂 Backup location: ${backupDir}`);
    console.log(`📋 Summary file: ${summaryPath}`);
    console.log('='.repeat(50));

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');

    process.exit(0);
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    process.exit(1);
  }
};

// Run backup
backupData();
