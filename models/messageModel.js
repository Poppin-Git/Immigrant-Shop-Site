const db = require('../firebase');
const admin = require('firebase-admin');

// Create a new message
const createMessage = async (data) => {
  try {
    const docRef = await db.collection('messages').add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    throw new Error(`Failed to create message: ${error.message}`);
  }
};

// Get all messages
const getAllMessages = async () => {
  try {
    const snapshot = await db.collection('messages')
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw new Error(`Failed to get messages: ${error.message}`);
  }
};

module.exports = {
  createMessage,
  getAllMessages
};