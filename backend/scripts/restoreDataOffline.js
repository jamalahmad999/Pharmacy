/**
 * MongoDB Data Restore Script - Offline Version
 * 
 * Usage:
 * 1. Install MongoDB locally (https://www.mongodb.com/try/download/community)
 * 2. Start MongoDB service
 * 3. Place your JSON backup files in a 'backup' folder next to this script
 * 4. Run: node restoreDataOffline.js
 * 
 * OR with custom backup path:
 * node restoreDataOffline.js /path/to/backup/folder
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

const restoreData = async () => {
  try {
    // Get backup directory
    let backupDir = process.argv[2];
    
    if (!backupDir) {
      backupDir = path.join(__dirname, 'backup');
    }

    if (!fs.existsSync(backupDir)) {
      console.error(`\n❌ Error: Backup folder not found at: ${backupDir}`);
      console.log('\n📝 Please either:');
      console.log('1. Create a "backup" folder in the same directory as this script');
      console.log('2. Or provide the backup path: node restoreDataOffline.js /path/to/backup\n');
      process.exit(1);
    }

    console.log('\n' + '='.repeat(60));
    console.log('🔄 MongoDB Data Restore Tool (Offline)');
    console.log('='.repeat(60));
    console.log(`📂 Backup Location: ${backupDir}\n`);

    // Get MongoDB connection string
    const defaultUri = 'mongodb://localhost:27017/lifepharmacy';
    const mongoUri = await askQuestion(
      `📌 Enter MongoDB connection URI\n   (default: ${defaultUri}): `
    );

    const connectionUri = mongoUri.trim() || defaultUri;

    console.log(`\n⏳ Connecting to MongoDB at: ${connectionUri}`);

    // Connect to MongoDB
    await mongoose.connect(connectionUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB\n');

    // Check for summary file
    const summaryPath = path.join(backupDir, 'backup_summary.json');
    if (fs.existsSync(summaryPath)) {
      const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
      console.log('📋 Backup Information:');
      console.log(`   Backup Date: ${summary.backupDate}`);
      console.log(`   Total Collections: ${summary.totalCollections}`);
      console.log(`   Total Documents: ${summary.totalDocuments}`);
      console.log(
        `   Collections: ${summary.collections.map((c) => c.name).join(', ')}`
      );
      console.log('');
    }

    // Ask for confirmation
    const confirm = await askQuestion(
      '⚠️  Restore data to MongoDB? (yes/no): '
    );

    if (confirm.toLowerCase() !== 'yes') {
      console.log('\n❌ Restore cancelled.\n');
      await mongoose.disconnect();
      rl.close();
      process.exit(0);
    }

    const askClear = await askQuestion(
      '🗑️  Clear existing collections before restore? (yes/no): '
    );

    // Get list of JSON files to restore
    const files = fs
      .readdirSync(backupDir)
      .filter((f) => f.endsWith('.json') && f !== 'backup_summary.json');

    if (files.length === 0) {
      console.error('\n❌ No JSON backup files found in the backup folder\n');
      await mongoose.disconnect();
      rl.close();
      process.exit(1);
    }

    console.log(
      `\n📥 Found ${files.length} collection(s) to restore: ${files.map((f) => f.replace('.json', '')).join(', ')}\n`
    );

    let totalRestored = 0;

    // Restore each collection
    for (const file of files) {
      const collectionName = path.basename(file, '.json');
      const filePath = path.join(backupDir, file);

      try {
        console.log(`⏳ Restoring "${collectionName}"...`);

        // Read JSON file
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContent);

        // Ensure data is an array
        const documents = Array.isArray(data) ? data : [data];

        // Get the collection directly
        const db = mongoose.connection.db;
        const collection = db.collection(collectionName);

        // Clear if requested
        if (askClear.toLowerCase() === 'yes') {
          await collection.deleteMany({});
        }

        // Insert documents
        if (documents.length > 0) {
          const result = await collection.insertMany(documents);
          const count = result.insertedIds.length;
          console.log(`   ✅ Restored ${count} documents`);
          totalRestored += count;
        } else {
          console.log(`   ℹ️  No documents to restore`);
        }
      } catch (error) {
        console.error(`   ❌ Error restoring "${collectionName}": ${error.message}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Restore Complete! Total documents inserted: ${totalRestored}`);
    console.log('='.repeat(60) + '\n');

    await mongoose.disconnect();
    rl.close();
  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message, '\n');
    await mongoose.disconnect();
    rl.close();
    process.exit(1);
  }
};

// Run the restore
restoreData();
