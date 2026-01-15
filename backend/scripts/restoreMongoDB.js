const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const readline = require('readline');

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

// Collections mapping
const collections = {
  users: User,
  products: Product,
  categories: Category,
  brands: Brand,
  orders: Order,
  prescriptions: Prescription,
};

// Get backup directory from command line or use latest
const getBackupDir = () => {
  const backupDirArg = process.argv[2];
  if (backupDirArg && fs.existsSync(backupDirArg)) {
    return backupDirArg;
  }

  const backupsDir = path.join(__dirname, '../backups');
  if (!fs.existsSync(backupsDir)) {
    console.error('❌ No backups directory found');
    process.exit(1);
  }

  const backups = fs
    .readdirSync(backupsDir)
    .filter((f) => fs.statSync(path.join(backupsDir, f)).isDirectory())
    .sort()
    .reverse();

  if (backups.length === 0) {
    console.error('❌ No backup folders found');
    process.exit(1);
  }

  return path.join(backupsDir, backups[0]);
};

const askQuestion = (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase());
    });
  });
};

const restoreData = async () => {
  try {
    const backupDir = getBackupDir();
    console.log(`📂 Using backup directory: ${backupDir}`);

    // Read and display summary
    const summaryPath = path.join(backupDir, 'backup_summary.json');
    if (fs.existsSync(summaryPath)) {
      const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
      console.log('\n' + '='.repeat(50));
      console.log('📋 Backup Summary:');
      console.log('='.repeat(50));
      console.log(`Backup Date: ${summary.backupDate}`);
      console.log(`Total Collections: ${summary.totalCollections}`);
      console.log(`Total Documents: ${summary.totalDocuments}`);
      console.log(
        `Collections: ${summary.collections.map((c) => c.name).join(', ')}`
      );
      console.log('='.repeat(50) + '\n');
    }

    // Ask for confirmation
    const clearDB = await askQuestion(
      '⚠️  Clear existing data before restore? (yes/no): '
    );

    // Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    let totalRestored = 0;

    // Restore each collection
    for (const [collectionName, model] of Object.entries(collections)) {
      const filePath = path.join(backupDir, `${collectionName}.json`);

      if (!fs.existsSync(filePath)) {
        console.log(`⏭️  Skipping ${collectionName} (no backup file)`);
        continue;
      }

      try {
        console.log(`\n📤 Restoring ${collectionName}...`);

        // Clear collection if requested
        if (clearDB === 'yes') {
          await model.deleteMany({});
          console.log(`  🗑️  Cleared existing ${collectionName}`);
        }

        // Read backup file
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        if (data.length === 0) {
          console.log(`  ✅ ${collectionName}: No data to restore`);
          continue;
        }

        // Remove MongoDB internal fields to avoid conflicts
        const cleanData = data.map((doc) => {
          const cleaned = { ...doc };
          delete cleaned.__v;
          return cleaned;
        });

        // Insert documents
        const result = await model.insertMany(cleanData);
        console.log(
          `  ✅ ${collectionName}: ${result.length} documents restored`
        );
        totalRestored += result.length;
      } catch (error) {
        console.error(
          `  ⚠️  Error restoring ${collectionName}:`,
          error.message
        );
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('🎉 Restore completed!');
    console.log('='.repeat(50));
    console.log(`📊 Total documents restored: ${totalRestored}`);
    console.log('='.repeat(50));

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');

    process.exit(0);
  } catch (error) {
    console.error('❌ Restore failed:', error.message);
    process.exit(1);
  }
};

// Run restore
restoreData();
