const db = require('../firebase');
const admin = require('firebase-admin');

// Get all active products
const getActiveProducts = async () => {
  try {
    const snapshot = await db.collection('products')
      .where('isActive', '==', true)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw new Error(`Failed to get products: ${error.message}`);
  }
};

// Get all products (for admin)
const getAllProducts = async () => {
  try {
    const snapshot = await db.collection('products')
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw new Error(`Failed to get all products: ${error.message}`);
  }
};

// Get product by ID
const getProductById = async (id) => {
  try {
    const doc = await db.collection('products').doc(id).get();
    if (doc.exists) {
      return {
        id: doc.id,
        ...doc.data()
      };
    }
    return null;
  } catch (error) {
    throw new Error(`Failed to get product: ${error.message}`);
  }
};

// Create product
const createProduct = async (data) => {
  try {
    const docRef = await db.collection('products').add({
      ...data,
      category: data.category || 'all',
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    throw new Error(`Failed to create product: ${error.message}`);
  }
};

// Update product
const updateProduct = async (id, data) => {
  try {
    await db.collection('products').doc(id).update({
      ...data,
      category: data.category || 'all',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    return true;
  } catch (error) {
    throw new Error(`Failed to update product: ${error.message}`);
  }
};

// Delete product
const deleteProduct = async (id) => {
  try {
    await db.collection('products').doc(id).delete();
    return true;
  } catch (error) {
    throw new Error(`Failed to delete product: ${error.message}`);
  }
};

module.exports = {
  getActiveProducts,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};