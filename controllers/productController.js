const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../models/productModel');

// GET /admin/products
const listProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.render('admin/products/list', {
      title: 'Manage Products',
      products: products
    });
  } catch (error) {
    console.error('List products error:', error);
    res.status(500).render('error', { message: 'Internal server error' });
  }
};

// GET /admin/products/new
const showCreateForm = async (req, res) => {
  try {
    const db = require('../firebase');
    // Get all active discounts
    const discountsSnapshot = await db.collection('discounts')
      .where('active', '==', true)
      .get();
    
    const discounts = discountsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.render('admin/products/new', {
      title: 'Create New Product',
      discounts: discounts
    });
  } catch (error) {
    console.error('Show create form error:', error);
    res.render('admin/products/new', {
      title: 'Create New Product',
      discounts: []
    });
  }
};

// POST /admin/products/new
const createNewProduct = async (req, res) => {
  try {
    const { name, description, price, imageUrl, category, isActive, discount, discount_ids } = req.body;
    
    // Handle discount_ids - can be string or array
    let discountIds = [];
    if (discount_ids) {
      discountIds = Array.isArray(discount_ids) ? discount_ids : [discount_ids];
    }

    const productData = {
      name,
      description,
      price: parseFloat(price),
      imageUrl: imageUrl || '',
      category: category || 'all',
      isActive: isActive === 'on',
      discount: parseFloat(discount) || 0,
      discountIds: discountIds || [],
      appliedDiscounts: [] // Will be populated with discount details
    };
    await createProduct(productData);
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).render('error', { message: 'Failed to create product' });
  }
};

// GET /admin/products/edit/:id
const showEditForm = async (req, res) => {
  try {
    const db = require('../firebase');
    const { id } = req.params;
    const product = await getProductById(id);
    if (!product) {
      return res.status(404).render('error', { message: 'Product not found' });
    }

    // Get all active discounts
    const discountsSnapshot = await db.collection('discounts')
      .where('active', '==', true)
      .get();
    
    const discounts = discountsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.render('admin/products/edit', {
      title: 'Edit Product',
      product: product,
      discounts: discounts
    });
  } catch (error) {
    console.error('Edit product error:', error);
    res.status(500).render('error', { message: 'Internal server error' });
  }
};

// POST /admin/products/edit/:id
const updateExistingProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, imageUrl, category, isActive, discount, discount_ids } = req.body;
    
    // Handle discount_ids - can be string or array
    let discountIds = [];
    if (discount_ids) {
      discountIds = Array.isArray(discount_ids) ? discount_ids : [discount_ids];
    }

    const productData = {
      name,
      description,
      price: parseFloat(price),
      imageUrl: imageUrl || '',
      category: category || 'all',
      isActive: isActive === 'on',
      discount: parseFloat(discount) || 0,
      discountIds: discountIds || [],
      appliedDiscounts: [] // Will be populated with discount details
    };
    await updateProduct(id, productData);
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).render('error', { message: 'Failed to update product' });
  }
};

// POST /admin/products/delete/:id
const deleteExistingProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteProduct(id);
    res.redirect('/admin/products');
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).render('error', { message: 'Failed to delete product' });
  }
};

module.exports = {
  listProducts,
  showCreateForm,
  createNewProduct,
  showEditForm,
  updateExistingProduct,
  deleteExistingProduct
};