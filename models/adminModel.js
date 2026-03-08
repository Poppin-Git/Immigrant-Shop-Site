const db = require('../firebase');
const admin = require('firebase-admin');

// Get recent logs
const getRecentLogs = async (limit = 50) => {
  try {
    const snapshot = await db
      .collection('logs')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw new Error(`Failed to get logs: ${error.message}`);
  }
};

// Get logs by type
const getLogsByType = async (type, limit = 50) => {
  try {
    const snapshot = await db
      .collection('logs')
      .where('type', '==', type)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw new Error(`Failed to get logs by type: ${error.message}`);
  }
};

// Get logs by user ID
const getLogsByUserId = async (userId, limit = 50) => {
  try {
    const snapshot = await db
      .collection('logs')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw new Error(`Failed to get logs by user ID: ${error.message}`);
  }
};

// Add log entry
const addLog = async (type, message, userId = null, metadata = {}) => {
  try {
    const docRef = await db.collection('logs').add({
      type,
      message,
      userId,
      metadata,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    throw new Error(`Failed to add log: ${error.message}`);
  }
};

// Get all users (admins)
const getAllUsers = async () => {
  try {
    const snapshot = await db.collection('users').orderBy('createdAt', 'desc').get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw new Error(`Failed to get users: ${error.message}`);
  }
};

module.exports = {
  getRecentLogs,
  getLogsByType,
  getLogsByUserId,
  addLog,
  getStats,
  getAllUsers
};
