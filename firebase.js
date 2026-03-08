const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Load service account key from project root
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

// Check if service account key file exists
if (!fs.existsSync(serviceAccountPath)) {
  console.error('ERROR: serviceAccountKey.json not found!');
  console.error('Please follow these steps:');
  console.error('1. Download Firebase service account key from Firebase Console');
  console.error('   Go to: Project Settings → Service Accounts → Generate New Private Key');
  console.error('2. Save the file as serviceAccountKey.json in the project root');
  console.error('3. Make sure it is listed in .gitignore (DO NOT COMMIT)');
  console.error('4. Restart the application');
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = require(serviceAccountPath);
} catch (error) {
  console.error('ERROR: Failed to parse serviceAccountKey.json');
  console.error('Make sure the file is valid JSON');
  console.error('Error:', error.message);
  process.exit(1);
}

// Initialize Firebase Admin SDK
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('✓ Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('ERROR: Failed to initialize Firebase Admin SDK');
  console.error('Error:', error.message);
  process.exit(1);
}

// Export Firestore instance
const db = admin.firestore();

module.exports = db;
