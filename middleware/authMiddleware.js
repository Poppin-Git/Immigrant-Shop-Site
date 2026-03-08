const { listUsers } = require('../models/userModel');

/**
 * Middleware to require authentication
 */
const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.redirect('/auth/login');
  }
  next();
};

/**
 * Middleware to require admin role or allow first admin setup
 */
const requireAdminOrFirstSetup = async (req, res, next) => {
  try {
    // Check if any users exist
    const allUsers = await listUsers();
    const isFirstSetup = allUsers.length === 0;

    // If first setup, allow access
    if (isFirstSetup) {
      return next();
    }

    // Otherwise, require admin authentication
    if (!req.session || !req.session.userId) {
      return res.redirect('/auth/login');
    }
    if (req.session.role !== 'admin') {
      return res.status(403).send('Not authorized');
    }
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).send('Internal server error');
  }
};

/**
 * Middleware to require admin role
 */
const requireAdmin = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.redirect('/auth/login');
  }
  if (req.session.role !== 'admin') {
    return res.status(403).send('Not authorized');
  }
  next();
};

/**
 * Middleware to require authentication for API routes
 */
const requireAuthAPI = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

/**
 * Middleware to require admin role for API routes
 */
const requireAdminAPI = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (req.session.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

module.exports = {
  requireAuth,
  requireAdmin,
  requireAdminOrFirstSetup,
  requireAuthAPI,
  requireAdminAPI
};
