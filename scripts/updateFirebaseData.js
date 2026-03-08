#!/usr/bin/env node

/**
 * Firebase Database Update Script
 * This script helps update document fields in Firestore database
 * Usage: node scripts/updateFirebaseData.js [collection] [document] [field] [value]
 */

const db = require('../firebase');

async function updateData() {
  try {
    const args = process.argv.slice(2);
    
    if (args.length < 4) {
      console.log('Usage: node scripts/updateFirebaseData.js [collection] [document] [field] [value]');
      console.log('Example: node scripts/updateFirebaseData.js settings system siteTitle "My App"');
      process.exit(1);
    }

    const [collection, document, field, ...valueParts] = args;
    const value = valueParts.join(' ');

    // Try to parse value as JSON if it looks like it
    let parsedValue = value;
    if (value === 'true' || value === 'false') {
      parsedValue = value === 'true';
    } else if (!isNaN(value)) {
      parsedValue = parseFloat(value);
    } else if (value.startsWith('{') || value.startsWith('[')) {
      try {
        parsedValue = JSON.parse(value);
      } catch (e) {
        // Keep as string
      }
    }

    console.log(`\n📝 Updating ${collection}/${document}/${field}`);
    console.log(`   Value: ${JSON.stringify(parsedValue)}`);
    console.log(`   Type: ${typeof parsedValue}\n`);

    const updateObj = {};
    updateObj[field] = parsedValue;

    await db.collection(collection).doc(document).set(updateObj, { merge: true });
    
    console.log('✅ Update successful!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating data:', error.message);
    process.exit(1);
  }
}

updateData();
