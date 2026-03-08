const express = require('express');
const { requireAdmin, requireAdminOrFirstSetup } = require('../middleware/authMiddleware');
const {
  showLogin,
  showRegister,
  register,
  login,
  logout
} = require('../controllers/authController');

const router = express.Router();

// GET /auth/login
router.get('/login', showLogin);

// POST /auth/login
router.post('/login', login);

// GET /auth/logout
router.get('/logout', logout);

// Admin-only registration routes (allows first admin setup)
router.get('/register', requireAdminOrFirstSetup, showRegister);
router.post('/register', requireAdminOrFirstSetup, register);

module.exports = router;
