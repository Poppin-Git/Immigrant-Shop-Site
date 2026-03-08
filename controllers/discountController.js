const { db } = require('../config/firebase');
const productModel = require('../models/productModel');

// Get all discounts
const getAllDiscounts = async () => {
  try {
    const snapshot = await db.collection('discounts').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching discounts:', error);
    return [];
  }
};

// Get discount by ID
const getDiscountById = async (id) => {
  try {
    const doc = await db.collection('discounts').doc(id).get();
    if (doc.exists) {
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching discount:', error);
    return null;
  }
};

// Create discount
const createDiscount = async (data) => {
  try {
    const discount = {
      name: data.name || '',
      code: data.code || '',
      type: data.type || 'percentage', // percentage or fixed
      value: parseFloat(data.value) || 0,
      maxUses: parseInt(data.maxUses) || null,
      currentUses: 0,
      expiryDate: data.expiryDate || null,
      description: data.description || '',
      active: data.active === 'on' || data.active === true,
      categories: data.categories || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const ref = await db.collection('discounts').add(discount);
    return { id: ref.id, ...discount };
  } catch (error) {
    console.error('Error creating discount:', error);
    return null;
  }
};

// Update discount
const updateDiscount = async (id, data) => {
  try {
    const discount = {
      name: data.name || '',
      code: data.code || '',
      type: data.type || 'percentage',
      value: parseFloat(data.value) || 0,
      maxUses: data.maxUses ? parseInt(data.maxUses) : null,
      expiryDate: data.expiryDate || null,
      description: data.description || '',
      active: data.active === 'on' || data.active === true,
      categories: data.categories || [],
      updatedAt: new Date()
    };

    await db.collection('discounts').doc(id).set(discount, { merge: true });
    return { id, ...discount };
  } catch (error) {
    console.error('Error updating discount:', error);
    return null;
  }
};

// Delete discount
const deleteDiscount = async (id) => {
  try {
    await db.collection('discounts').doc(id).delete();
    return true;
  } catch (error) {
    console.error('Error deleting discount:', error);
    return false;
  }
};

// Get discounted products count
const getDiscountedProductsCount = async () => {
  try {
    const products = await productModel.getAllProducts();
    return products.filter(p => p.discount && p.discount > 0).length;
  } catch (error) {
    console.error('Error counting discounted products:', error);
    return 0;
  }
};

// Show discounts list
const showDiscounts = async (req, res) => {
  try {
    const discounts = await getAllDiscounts();
    const products = await productModel.getAllProducts();
    const discountedCount = products.filter(p => p.discount && p.discount > 0).length;

    const data = {
      title: 'Discount Management',
      discounts: discounts || [],
      discountedCount: discountedCount
    };

    const ejs = require('ejs');
    const path = require('path');
    const body = await ejs.renderFile(path.join(__dirname, '../views/admin/discounts.ejs'), data);
    res.render('layouts/adminLayout', { body, title: 'Discount Management' });
  } catch (error) {
    console.error('Discount list error:', error);
    res.status(500).send('Error loading discounts');
  }
};

// Show create discount form
const showCreateDiscount = async (req, res) => {
  try {
    const data = {
      title: 'Create Discount'
    };

    const ejs = require('ejs');
    const path = require('path');
    const body = await ejs.renderFile(path.join(__dirname, '../views/admin/createDiscount.ejs'), data);
    res.render('layouts/adminLayout', { body, title: 'Create Discount' });
  } catch (error) {
    console.error('Create discount error:', error);
    res.status(500).send('Error loading form');
  }
};

// Create new discount (POST)
const createNewDiscount = async (req, res) => {
  try {
    const { name, code, type, value, maxUses, expiryDate, description, active } = req.body;

    if (!name || !code) {
      return res.status(400).send('Name and code are required');
    }

    const result = await createDiscount({
      name, code, type, value, maxUses, expiryDate, description, active
    });

    if (result) {
      res.redirect('/admin/discounts');
    } else {
      res.status(500).send('Error creating discount');
    }
  } catch (error) {
    console.error('Create discount error:', error);
    res.status(500).send('Error creating discount');
  }
};

// Show edit discount form
const showEditDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const discount = await getDiscountById(id);

    if (!discount) {
      return res.status(404).send('Discount not found');
    }

    const data = {
      title: 'Edit Discount',
      discount: discount
    };

    const ejs = require('ejs');
    const path = require('path');
    const body = await ejs.renderFile(path.join(__dirname, '../views/admin/editDiscount.ejs'), data);
    res.render('layouts/adminLayout', { body, title: 'Edit Discount' });
  } catch (error) {
    console.error('Edit discount error:', error);
    res.status(500).send('Error loading form');
  }
};

// Update discount (POST)
const updateDiscountHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, type, value, maxUses, expiryDate, description, active } = req.body;

    if (!name || !code) {
      return res.status(400).send('Name and code are required');
    }

    const result = await updateDiscount(id, {
      name, code, type, value, maxUses, expiryDate, description, active
    });

    if (result) {
      res.redirect('/admin/discounts');
    } else {
      res.status(500).send('Error updating discount');
    }
  } catch (error) {
    console.error('Update discount error:', error);
    res.status(500).send('Error updating discount');
  }
};

// Delete discount
const deleteDiscountHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteDiscount(id);

    if (result) {
      res.redirect('/admin/discounts');
    } else {
      res.status(500).send('Error deleting discount');
    }
  } catch (error) {
    console.error('Delete discount error:', error);
    res.status(500).send('Error deleting discount');
  }
};

module.exports = {
  getAllDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getDiscountedProductsCount,
  showDiscounts,
  showCreateDiscount,
  createNewDiscount,
  showEditDiscount,
  updateDiscountHandler,
  deleteDiscountHandler
};
