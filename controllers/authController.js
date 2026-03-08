const bcrypt = require('bcrypt');
const { createUser, getUserByEmail, listUsers, updateUser } = require('../models/userModel');

/**
 * Validate password strength
 * Requirements: 8+ chars, uppercase, lowercase, number, special character
 */
const validatePassword = (password) => {
  const errors = [];
  
  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*, etc.)');
  }
  
  return errors;
};

/**
 * Show login page
 */
const showLogin = (req, res) => {
  res.render('auth/login', { 
    title: 'Login',
    error: null 
  });
};

/**
 * Process login (admin-only)
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res.render('auth/login', {
        title: 'Admin Login',
        error: 'Email and password are required.'
      });
    }

    // Get user by email
    const user = await getUserByEmail(email);

    if (!user) {
      return res.render('auth/login', {
        title: 'Admin Login',
        error: 'Invalid credentials.'
      });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.render('auth/login', {
        title: 'Admin Login',
        error: 'Access denied. Admin login only.'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.render('auth/login', {
        title: 'Admin Login',
        error: 'Account is deactivated.'
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return res.render('auth/login', {
        title: 'Admin Login',
        error: 'Invalid credentials.'
      });
    }

    // Set session
    req.session.userId = user.id;
    req.session.email = user.email;
    req.session.role = user.role;

    // Track last login timestamp
    try {
      const db = require('../firebase');
      await db.collection('users').doc(user.id).update({
        lastLogin: new Date()
      });
    } catch (e) {
      console.log('Could not update lastLogin:', e.message);
    }

    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    res.render('auth/login', {
      title: 'Admin Login',
      error: 'An error occurred. Please try again.'
    });
  }
};

/**
 * Show register form
 */
const showRegister = (req, res) => {
  res.render('auth/register', { 
    title: 'Register',
    error: null 
  });
};

/**
 * Process registration (admin-only, creates new admin)
 * Allows first admin to be created without authentication
 */
const register = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // Validate
    if (!email || !password || !confirmPassword) {
      return res.render('auth/register', {
        title: 'Create Admin',
        error: 'All fields are required.'
      });
    }

    // Validate password strength
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.render('auth/register', {
        title: 'Create Admin',
        error: passwordErrors.join('; ')
      });
    }

    if (password !== confirmPassword) {
      return res.render('auth/register', {
        title: 'Create Admin',
        error: 'Passwords do not match.'
      });
    }

    // Check if email already exists
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.render('auth/register', {
        title: 'Create Admin',
        error: 'Email is already registered.'
      });
    }

    // Check if this is the first admin (no users exist)
    const allUsers = await listUsers();
    const isFirstAdmin = allUsers.length === 0;

    // If not first admin, require admin authentication
    if (!isFirstAdmin && (!req.session.userId || req.session.role !== 'admin')) {
      return res.status(403).render('error', { message: 'Access denied. Admin authentication required.' });
    }

    // Create admin user
    const user = await createUser({ email, password });

    // If this was the first admin, set session and redirect to dashboard
    if (isFirstAdmin) {
      req.session.userId = user.id;
      req.session.userEmail = user.email;
      req.session.role = user.role;
      return res.redirect('/admin/dashboard');
    }

    // Redirect to admin users page
    res.redirect('/admin/users');
  } catch (error) {
    console.error('Registration error:', error);
    res.render('auth/register', {
      title: 'Create Admin',
      error: 'An error occurred. Please try again.'
    });
  }
};

/**
 * Logout user
 */
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/');
    }
    res.redirect('/auth/login');
  });
};

/**
 * Show change password form
 */
const showChangePassword = async (req, res) => {
  try {
    const data = {
      title: 'Change Password',
      email: req.session.email
    };
    const path = require('path');
    const ejs = require('ejs');
    const body = await ejs.renderFile(path.join(__dirname, '../views/admin/changePassword.ejs'), data);
    res.render('layouts/adminLayout', { body, title: 'Change Password' });
  } catch (error) {
    console.error('Change password form error:', error);
    res.status(500).send('Error loading password change form');
  }
};

/**
 * Process change password
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.session.userId;

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.render('admin/changePassword', {
        title: 'Change Password',
        email: req.session.email,
        error: 'All fields are required.'
      });
    }

    // Get current user
    const { getUserById } = require('../models/userModel');
    const user = await getUserById(userId);

    if (!user) {
      return res.render('admin/changePassword', {
        title: 'Change Password',
        email: req.session.email,
        error: 'User not found.'
      });
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!passwordMatch) {
      return res.render('admin/changePassword', {
        title: 'Change Password',
        email: req.session.email,
        error: 'Current password is incorrect.'
      });
    }

    // Validate new password strength
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      return res.render('admin/changePassword', {
        title: 'Change Password',
        email: req.session.email,
        error: passwordErrors.join('; ')
      });
    }

    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      return res.render('admin/changePassword', {
        title: 'Change Password',
        email: req.session.email,
        error: 'New passwords do not match.'
      });
    }

    // Hash new password and update
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const db = require('../firebase');
    await db.collection('users').doc(userId).update({
      passwordHash: passwordHash,
      updatedAt: new Date()
    });

    // Show success and redirect after 2 seconds
    const path = require('path');
    const ejs = require('ejs');
    const body = await ejs.renderFile(path.join(__dirname, '../views/admin/changePassword.ejs'), {
      title: 'Change Password',
      email: req.session.email,
      success: 'Password changed successfully! Redirecting...'
    });
    res.render('layouts/adminLayout', { body, title: 'Change Password' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).send('Error changing password');
  }
};

module.exports = {
  showLogin,
  showRegister,
  register,
  login,
  logout,
  showChangePassword,
  changePassword,
  validatePassword
};
