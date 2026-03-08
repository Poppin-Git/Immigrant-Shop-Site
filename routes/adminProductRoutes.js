const express = require('express');
const { requireAdmin } = require('../middleware/authMiddleware');
const {
  listProducts,
  showCreateForm,
  createNewProduct,
  showEditForm,
  updateExistingProduct,
  deleteExistingProduct
} = require('../controllers/productController');

const router = express.Router();

// All routes require admin
router.use(requireAdmin);

// GET /admin/products
router.get('/', listProducts);

// GET /admin/products/new
router.get('/new', showCreateForm);

// POST /admin/products/new
router.post('/new', createNewProduct);

// GET /admin/products/edit/:id
router.get('/edit/:id', showEditForm);

// POST /admin/products/edit/:id
router.post('/edit/:id', updateExistingProduct);

// POST /admin/products/delete/:id
router.post('/delete/:id', deleteExistingProduct);

module.exports = router;