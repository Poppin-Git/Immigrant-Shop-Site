const db = require('../firebase');
const bcrypt = require('bcrypt');

// Constants
const USERS_COLLECTION = 'users';
const SALT_ROUNDS = 10;

/**
 * Create a new admin user in Firestore
 * @param {Object} params - { email, password }
 * @returns {Object} - { id, email, role, isActive }
 */
const createUser = async ({ email, password }) => {
  try {
    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create admin user document
    const docRef = await db.collection(USERS_COLLECTION).add({
      email,
      passwordHash,
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return {
      id: docRef.id,
      email,
      role: 'admin',
      isActive: true
    };
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Object|null} - user object or null
 */
const getUserByEmail = async (email) => {
  try {
    const snapshot = await db
      .collection(USERS_COLLECTION)
      .where('email', '==', email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    throw new Error(`Failed to get user by email: ${error.message}`);
  }
};

/**
 * Get user by ID
 * @param {string} id
 * @returns {Object|null} - user object or null
 */
const getUserById = async (id) => {
  try {
    const doc = await db.collection(USERS_COLLECTION).doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    throw new Error(`Failed to get user by ID: ${error.message}`);
  }
};

/**
 * Update user
 * @param {string} id
 * @param {Object} data
 * @returns {Object} - updated user object
 */
const updateUser = async (id, data) => {
  try {
    await db.collection(USERS_COLLECTION).doc(id).update({
      ...data,
      updatedAt: new Date()
    });

    return getUserById(id);
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

/**
 * List all users
 * @returns {Array} - array of user objects
 */
const listUsers = async () => {
  try {
    const snapshot = await db.collection(USERS_COLLECTION).get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw new Error(`Failed to list users: ${error.message}`);
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  listUsers
};
