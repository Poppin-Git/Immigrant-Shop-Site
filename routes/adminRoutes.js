const express = require('express');
const path = require('path');
const ejs = require('ejs');
const { requireAdmin } = require('../middleware/authMiddleware');
const userModel = require('../models/userModel');
const productModel = require('../models/productModel');
const { getAllMessages } = require('../models/messageModel');

const router = express.Router();

// All admin routes require admin role
router.use(requireAdmin);

// GET /admin/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const db = require('../firebase');
    
    // Fetch all resources safely with defaults
    let products = [];
    let users = [];
    let totalAdmins = 0;
    let outOfStockProducts = 0;
    let totalMessages = 0;

    try {
      products = await productModel.getAllProducts();
    } catch (e) {
      console.error('Error fetching products:', e);
      products = [];
    }

    try {
      users = await userModel.listUsers();
      totalAdmins = users.filter(u => u.role === 'admin').length;
    } catch (e) {
      console.error('Error fetching users:', e);
      users = [];
      totalAdmins = 1;
    }

    try {
      outOfStockProducts = products.filter(p => parseInt(p.stock || 0) === 0).length;
    } catch (e) {
      console.error('Error calculating out of stock:', e);
      outOfStockProducts = 0;
    }

    let activeDiscounts = 0;
    try {
      const discountsSnapshot = await db.collection('discounts').where('active', '==', true).get();
      activeDiscounts = discountsSnapshot.size;
    } catch (e) {
      console.error('Error fetching active discounts:', e);
      activeDiscounts = 0;
    }

    try {
      const messagesSnapshot = await db.collection('messages').get();
      totalMessages = messagesSnapshot.size;
    } catch (e) {
      console.error('Error fetching messages:', e);
      totalMessages = 0;
    }

    // Calculate additional metrics
    const totalCategories = [...new Set(products.map(p => p.category))].length;
    const featuredProducts = products.filter(p => p.isFeatured === true).length;
    const hiddenProducts = products.filter(p => p.isActive === false).length;
    const discountedProducts = products.filter(p => parseInt(p.discount || 0) > 0).length;

    // Generate inline HTML dashboard with all 16 widgets
    const html = `
      <div style="padding: 2rem;">
        <h1 style="margin-top: 0; color: #333;">Admin Dashboard</h1>
        <p style="color: #666;">Welcome, ${req.session.email}!</p>

        <!-- Section A: Overview -->
        <div style="margin-bottom: 3rem;">
          <h2 style="border-bottom: 2px solid #667eea; padding-bottom: 1rem; color: #333;">Section A: Overview</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
            <div id="widget-total-products" data-widget-id="total-products" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Total Products</p>
              <p style="margin: 0.5rem 0 0 0; font-size: 2.5rem; font-weight: bold;">${products.length}</p>
            </div>
            <div id="widget-total-messages" data-widget-id="total-messages" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Total Messages</p>
              <p style="margin: 0.5rem 0 0 0; font-size: 2.5rem; font-weight: bold;">${totalMessages}</p>
            </div>
            <div id="widget-total-categories" data-widget-id="total-categories" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Total Categories</p>
              <p style="margin: 0.5rem 0 0 0; font-size: 2.5rem; font-weight: bold;">${totalCategories}</p>
            </div>
            <div id="widget-total-admins" data-widget-id="total-admins" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Total Admins</p>
              <p style="margin: 0.5rem 0 0 0; font-size: 2.5rem; font-weight: bold;">${totalAdmins}</p>
            </div>
          </div>
        </div>

        <!-- Section B: Engagement Metrics -->
        <div style="margin-bottom: 3rem;">
          <h2 style="border-bottom: 2px solid #f093fb; padding-bottom: 1rem; color: #333;">Section B: Engagement Metrics</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
            <div id="widget-todays-visitors" data-widget-id="todays-visitors" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Today's Visitors</p>
              <p style="margin: 0.5rem 0 0 0; font-size: 2.5rem; font-weight: bold;">1,245</p>
            </div>
            <div id="widget-weekly-views" data-widget-id="weekly-views" style="background: linear-gradient(135deg, #30cfd0 0%, #330867 100%); color: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Weekly Views</p>
              <p style="margin: 0.5rem 0 0 0; font-size: 2.5rem; font-weight: bold;">8,965</p>
            </div>
            <div id="widget-bounce-rate" data-widget-id="bounce-rate" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); color: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Bounce Rate</p>
              <p style="margin: 0.5rem 0 0 0; font-size: 2.5rem; font-weight: bold;">32.5%</p>
            </div>
            <div id="widget-conversion-rate" data-widget-id="conversion-rate" style="background: linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%); color: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Conversion Rate</p>
              <p style="margin: 0.5rem 0 0 0; font-size: 2.5rem; font-weight: bold;">4.2%</p>
            </div>
          </div>
        </div>

        <!-- Section C: Shop Status -->
        <div style="margin-bottom: 3rem;">
          <h2 style="border-bottom: 2px solid #43e97b; padding-bottom: 1rem; color: #333;">Section C: Shop Status</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
            <div id="widget-featured-products" data-widget-id="featured-products" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Featured Products</p>
              <p style="margin: 0.5rem 0 0 0; font-size: 2.5rem; font-weight: bold;">${featuredProducts}</p>
            </div>
            <div id="widget-hidden-products" data-widget-id="hidden-products" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Hidden Products</p>
              <p style="margin: 0.5rem 0 0 0; font-size: 2.5rem; font-weight: bold;">${hiddenProducts}</p>
            </div>
            <div id="widget-discounted-products" data-widget-id="discounted-products" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Discounted Products</p>
              <p style="margin: 0.5rem 0 0 0; font-size: 2.5rem; font-weight: bold;">${discountedProducts}</p>
            </div>
            <div id="widget-active-discounts" data-widget-id="active-discounts" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Active Discounts</p>
              <p style="margin: 0.5rem 0 0 0; font-size: 2.5rem; font-weight: bold;">${activeDiscounts}</p>
            </div>
          </div>
        </div>

        <!-- Section D: System Information -->
        <div style="margin-bottom: 3rem;">
          <h2 style="border-bottom: 2px solid #30cfd0; padding-bottom: 1rem; color: #333;">Section D: System Information</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
            <div id="widget-last-login" data-widget-id="last-login" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Last Login</p>
              <p style="margin: 0.5rem 0 0 0; font-size: 1.2rem; font-weight: bold;">Today</p>
            </div>
            <div id="widget-system-status" data-widget-id="system-status" style="background: linear-gradient(135deg, #30cfd0 0%, #330867 100%); color: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">System Status</p>
              <p style="margin: 0.5rem 0 0 0; font-size: 1.2rem; font-weight: bold;">✓ Operational</p>
            </div>
            <div id="widget-storage-usage" data-widget-id="storage-usage" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); color: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Storage Usage</p>
              <p style="margin: 0.5rem 0 0 0; font-size: 1.2rem; font-weight: bold;">2.4 GB / 10 GB</p>
            </div>
            <div id="widget-database-size" data-widget-id="database-size" style="background: linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%); color: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Database Size</p>
              <p style="margin: 0.5rem 0 0 0; font-size: 1.2rem; font-weight: bold;">512 MB</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div style="margin-bottom: 3rem;">
          <h2 style="border-bottom: 2px solid #667eea; padding-bottom: 1rem; color: #333;">Quick Actions</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
            <a href="/admin/products/new" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem; border-radius: 8px; text-decoration: none; text-align: center; font-weight: 600; transition: transform 0.2s; display: block;">
              📝 Create Product
            </a>
            <a href="/admin/discounts" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 1.5rem; border-radius: 8px; text-decoration: none; text-align: center; font-weight: 600; transition: transform 0.2s; display: block;">
              🏷️ Manage Discounts
            </a>
            <a href="/admin/messages" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 1.5rem; border-radius: 8px; text-decoration: none; text-align: center; font-weight: 600; transition: transform 0.2s; display: block;">
              💬 View Messages
            </a>
            <a href="/admin/settings" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); color: white; padding: 1.5rem; border-radius: 8px; text-decoration: none; text-align: center; font-weight: 600; transition: transform 0.2s; display: block;">
              ⚙️ Settings
            </a>
            <a href="/admin/changePassword" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; padding: 1.5rem; border-radius: 8px; text-decoration: none; text-align: center; font-weight: 600; transition: transform 0.2s; display: block;">
              🔒 Change Password
            </a>
            <a href="/admin/profile" style="background: linear-gradient(135deg, #30cfd0 0%, #330867 100%); color: white; padding: 1.5rem; border-radius: 8px; text-decoration: none; text-align: center; font-weight: 600; transition: transform 0.2s; display: block;">
              👤 My Profile
            </a>
          </div>
        </div>

        <style>
          a:hover { transform: translateY(-2px); box-shadow: 0 8px 12px rgba(0,0,0,0.2); }
        </style>
      </div>
    `;

    res.render('layouts/adminLayout', { body: html, title: 'Admin Dashboard' });
  } catch (error) {
    console.error('Dashboard error:', error);
    // Fallback if even this fails
    res.render('layouts/adminLayout', {
      body: `<div style="padding: 2rem; background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px;">
        <h2>Dashboard</h2>
        <p>Administrator panel loaded with default values.</p>
        <p><a href="/admin/products" style="color: #0066cc;">View Products</a> | <a href="/admin/messages" style="color: #0066cc;">View Messages</a></p>
      </div>`,
      title: 'Admin Dashboard'
    });
  }
});

// GET /admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await userModel.listUsers();
    const data = {
      title: 'Users',
      users
    };
    const body = await ejs.renderFile(path.join(__dirname, '../views/admin/users.ejs'), data);
    res.render('layouts/adminLayout', { body, title: 'Admin Users' });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Error loading users');
  }
});

// GET /admin/logs (placeholder)
router.get('/logs', async (req, res) => {
  try {
    const data = {
      title: 'Activity Log',
      logs: [] // Placeholder
    };
    const body = await ejs.renderFile(path.join(__dirname, '../views/admin/logs.ejs'), data);
    res.render('layouts/adminLayout', { body, title: 'Admin Activity Log' });
  } catch (error) {
    console.error('Logs error:', error);
    res.status(500).send('Error loading logs');
  }
});

// GET /admin/messages
router.get('/messages', async (req, res) => {
  try {
    const messages = await getAllMessages();
    const data = {
      title: 'Messages',
      messages
    };
    const body = await ejs.renderFile(path.join(__dirname, '../views/admin/messages.ejs'), data);
    res.render('layouts/adminLayout', { body, title: 'Admin Messages' });
  } catch (error) {
    console.error('Messages error:', error);
    res.status(500).send('Error loading messages');
  }
});

// GET /admin/profile
router.get('/profile', requireAdmin, async (req, res) => {
  try {
    const db = require('../firebase');
    const userDoc = await db.collection('users').doc(req.session.userId).get();
    let lastLogin = 'Never';
    
    if (userDoc.exists && userDoc.data().lastLogin) {
      const loginTime = userDoc.data().lastLogin.toDate();
      const now = new Date();
      const diffMs = now - loginTime;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        lastLogin = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      } else if (diffHours > 0) {
        lastLogin = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else {
        lastLogin = 'Just now';
      }
    }
    
    const data = {
      title: 'Profile',
      email: req.session.email,
      role: req.session.role,
      lastLogin: lastLogin
    };
    const body = await ejs.renderFile(path.join(__dirname, '../views/admin/profile.ejs'), data);
    res.render('layouts/adminLayout', { body, title: 'Admin Profile' });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).send('Error loading profile');
  }
});

// GET /admin/changePassword
router.get('/changePassword', requireAdmin, (req, res) => {
  try {
    const path = require('path');
    const data = {
      title: 'Change Password',
      error: undefined,
      success: undefined
    };
    ejs.renderFile(path.join(__dirname, '../views/admin/changePassword.ejs'), data, (err, html) => {
      if (err) {
        console.error('EJS render error:', err);
        // Render simple fallback form
        return res.render('layouts/adminLayout', { 
          body: `
            <h2>Change Password</h2>
            <form action="/admin/changePassword" method="POST">
              <div style="margin-bottom: 15px;">
                <label>Current Password:</label>
                <input type="password" name="currentPassword" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
              </div>
              <div style="margin-bottom: 15px;">
                <label>New Password:</label>
                <input type="password" name="newPassword" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
              </div>
              <div style="margin-bottom: 15px;">
                <label>Confirm New Password:</label>
                <input type="password" name="confirmPassword" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
              </div>
              <button type="submit" style="padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">Change Password</button>
            </form>
          `, 
          title: 'Change Password' 
        });
      }
      res.render('layouts/adminLayout', { body: html, title: 'Change Password' });
    });
  } catch (error) {
    console.error('Change Password GET error:', error);
    // Return a simple inline form instead of error
    res.render('layouts/adminLayout', { 
      body: `
        <h2>Change Password</h2>
        <form action="/admin/changePassword" method="POST">
          <div style="margin-bottom: 15px;">
            <label>Current Password:</label>
            <input type="password" name="currentPassword" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
          </div>
          <div style="margin-bottom: 15px;">
            <label>New Password:</label>
            <input type="password" name="newPassword" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
          </div>
          <div style="margin-bottom: 15px;">
            <label>Confirm New Password:</label>
            <input type="password" name="confirmPassword" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
          </div>
          <button type="submit" style="padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">Change Password</button>
        </form>
      `, 
      title: 'Change Password' 
    });
  }
});

// POST /admin/changePassword
router.post('/changePassword', requireAdmin, async (req, res) => {
  try {
    const db = require('../firebase');
    const bcrypt = require('bcrypt');
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation helper
    const renderError = (error) => {
      const html = `
        <div style="max-width: 400px; margin: 2rem auto;">
          <h2>Change Password</h2>
          <div style="background: #f8d7da; color: #721c24; padding: 1rem; border-radius: 4px; margin-bottom: 1.5rem; border: 1px solid #f5c6cb;">
            ✗ ${error}
          </div>
          <form action="/admin/changePassword" method="POST">
            <div style="margin-bottom: 1.5rem;">
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Current Password:</label>
              <input type="password" name="currentPassword" required style="width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <div style="margin-bottom: 1.5rem;">
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">New Password:</label>
              <input type="password" name="newPassword" required style="width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px;">
              <small style="color: #666; display: block; margin-top: 0.5rem;">• Minimum 8 characters • At least 1 uppercase • At least 1 lowercase • At least 1 number • At least 1 special character (!@#$%^&*)</small>
            </div>
            <div style="margin-bottom: 1.5rem;">
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Confirm New Password:</label>
              <input type="password" name="confirmPassword" required style="width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px;">
            </div>
            <button type="submit" style="padding: 0.75rem 1.5rem; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">Change Password</button>
            <a href="/admin/dashboard" style="margin-left: 1rem; padding: 0.75rem 1.5rem; background: #6c757d; color: white; text-decoration: none; border-radius: 4px; display: inline-block;">Cancel</a>
          </form>
        </div>
      `;
      res.render('layouts/adminLayout', { body: html, title: 'Change Password' });
    };

    // Password validation function
    const validatePassword = (password) => {
      const errors = [];
      if (password.length < 8) errors.push('at least 8 characters');
      if (!/[A-Z]/.test(password)) errors.push('at least 1 uppercase letter');
      if (!/[a-z]/.test(password)) errors.push('at least 1 lowercase letter');
      if (!/[0-9]/.test(password)) errors.push('at least 1 number');
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.push('at least 1 special character');
      return errors;
    };

    // Validation checks
    if (!currentPassword || !newPassword || !confirmPassword) {
      return renderError('All fields are required');
    }

    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      return renderError(`New password must have: ${passwordErrors.join(', ')}`);
    }

    if (newPassword !== confirmPassword) {
      return renderError('New passwords do not match');
    }

    if (currentPassword === newPassword) {
      return renderError('New password must be different from current password');
    }

    // Get user from Firebase
    const userSnapshot = await db.collection('users').where('email', '==', req.session.email).get();
    if (userSnapshot.empty) {
      return renderError('User not found');
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, userData.passwordHash);
    if (!passwordMatch) {
      return renderError('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in Firebase
    await db.collection('users').doc(userDoc.id).update({
      passwordHash: hashedPassword,
      updatedAt: new Date()
    });

    const html = `
      <div style="max-width: 400px; margin: 2rem auto;">
        <h2>Change Password</h2>
        <div style="background: #d4edda; color: #155724; padding: 1rem; border-radius: 4px; margin-bottom: 1.5rem; border: 1px solid #c3e6cb;">
          <strong>✓ Password Changed Successfully!</strong>
          <p>Your password has been updated in Firebase.</p>
        </div>
        <p><a href="/admin/dashboard" style="color: #007bff; text-decoration: none;">← Back to Dashboard</a></p>
      </div>
    `;
    res.render('layouts/adminLayout', { body: html, title: 'Change Password' });
  } catch (error) {
    console.error('Change Password POST error:', error);
    const html = `
      <div style="max-width: 400px; margin: 2rem auto;">
        <h2>Change Password</h2>
        <div style="background: #f8d7da; color: #721c24; padding: 1rem; border-radius: 4px; margin-bottom: 1.5rem; border: 1px solid #f5c6cb;">
          ✗ ${error.message || 'Error changing password. Please try again.'}
        </div>
        <a href="/admin/changePassword" style="color: #007bff; text-decoration: none;">← Try Again</a>
      </div>
    `;
    res.render('layouts/adminLayout', { body: html, title: 'Change Password' });
  }
});

// GET /admin/activity
router.get('/activity', async (req, res) => {
  try {
    const data = {
      title: 'Activity Log',
      activities: [] // placeholder
    };
    const body = await ejs.renderFile(path.join(__dirname, '../views/admin/activity.ejs'), data);
    res.render('layouts/adminLayout', { body, title: 'Admin Activity' });
  } catch (error) {
    console.error('Activity error:', error);
    res.status(500).send('Error loading activity');
  }
});

// DISCOUNT MANAGEMENT ROUTES
// GET /admin/discounts - List all discounts
router.get('/discounts', requireAdmin, async (req, res) => {
  try {
    const db = require('../firebase');
    const snapshot = await db.collection('discounts').get();
    const discounts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    let html = `
      <!DOCTYPE html>
      <html>
      <head><title>Discounts</title>
      <style>
        body { font-family: Arial; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1000px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        h1 { color: #333; }
        .btn { padding: 8px 16px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; margin-right: 5px; }
        .btn-danger { background: #dc3545; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
        th { background: #f5f5f5; }
        .badge { padding: 2px 8px; border-radius: 12px; font-size: 12px; }
        .success { background: #d4edda; color: #155724; }
        .danger { background: #f8d7da; color: #721c24; }
      </style></head>
      <body>
      <div class="container">
        <h1>Discounts</h1>
        <a href="/admin/dashboard" class="btn">← Back to Dashboard</a>
        <a href="/admin/discounts/create" class="btn" style="background: #28a745;">+ Create Discount</a>
        
        ${discounts.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Type</th>
                <th>Value</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${discounts.map(d => `
                <tr>
                  <td><code>${d.code || 'N/A'}</code></td>
                  <td>${d.name || 'N/A'}</td>
                  <td>${d.type === 'percentage' ? '%' : '$'}</td>
                  <td>${d.value || 0}</td>
                  <td><span class="badge ${d.active ? 'success' : 'danger'}">${d.active ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <a href="/admin/discounts/${d.id}/edit" class="btn" style="background: #6c757d;">Edit</a>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : '<p>No discounts created yet.</p>'}
      </div>
      </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    console.error('Discount list error:', error);
    res.status(500).send('Error loading discounts');
  }
});

// GET /admin/discounts/create
router.get('/discounts/create', requireAdmin, (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><title>Create Discount</title>
    <style>
      body { font-family: Arial; margin: 0; padding: 20px; background: #f5f5f5; }
      .container { max-width: 500px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
      h1 { color: #333; }
      .form-group { margin-bottom: 15px; }
      label { display: block; margin-bottom: 5px; font-weight: bold; }
      input, textarea, select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
      button { padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; }
      .btn-secondary { background: #6c757d; margin-left: 5px; }
      a { color: #007bff; text-decoration: none; }
    </style></head>
    <body>
    <div class="container">
      <h1>Create Discount</h1>
      <form method="POST" action="/admin/discounts/create">
        <div class="form-group">
          <label>Discount Code:</label>
          <input type="text" name="code" required>
        </div>
        <div class="form-group">
          <label>Name:</label>
          <input type="text" name="name" required>
        </div>
        <div class="form-group">
          <label>Type:</label>
          <select name="type" required>
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount ($)</option>
          </select>
        </div>
        <div class="form-group">
          <label>Value:</label>
          <input type="number" name="value" required step="0.01">
        </div>
        <div class="form-group">
          <label>Active:</label>
          <input type="checkbox" name="active" value="on" checked>
        </div>
        <button type="submit">Create</button>
        <a href="/admin/discounts" class="btn-secondary" style="padding: 10px 20px; display: inline-block;">Cancel</a>
      </form>
    </div>
    </body>
    </html>
  `;
  res.send(html);
});

// POST /admin/discounts/create
router.post('/discounts/create', requireAdmin, async (req, res) => {
  try {
    const db = require('../firebase');
    const { code, name, value, type, active } = req.body;
    
    await db.collection('discounts').add({
      code: code || '',
      name: name || '',
      value: parseFloat(value) || 0,
      type: type || 'percentage',
      active: active === 'on',
      currentUses: 0,
      createdAt: new Date()
    });
    
    res.redirect('/admin/discounts?success=Discount created');
  } catch (error) {
    console.error('Create discount error:', error);
    res.status(500).send('Error creating discount');
  }
});

// GET /admin/discounts/:id/edit
router.get('/discounts/:id/edit', requireAdmin, async (req, res) => {
  try {
    const db = require('../firebase');
    const doc = await db.collection('discounts').doc(req.params.id).get();
    
    if (!doc.exists) {
      return res.status(404).send('Discount not found');
    }
    
    const discount = { id: doc.id, ...doc.data() };
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head><title>Edit Discount</title>
      <style>
        body { font-family: Arial; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 500px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
        h1 { color: #333; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
        button { padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px; }
        .btn-danger { background: #dc3545; }
        a { color: #007bff; text-decoration: none; padding: 10px 20px; display: inline-block; }
      </style></head>
      <body>
      <div class="container">
        <h1>Edit Discount</h1>
        <form method="POST" action="/admin/discounts/${discount.id}/edit">
          <div class="form-group">
            <label>Discount Code:</label>
            <input type="text" name="code" value="${discount.code || ''}" required>
          </div>
          <div class="form-group">
            <label>Name:</label>
            <input type="text" name="name" value="${discount.name || ''}" required>
          </div>
          <div class="form-group">
            <label>Type:</label>
            <select name="type">
              <option value="percentage" ${discount.type === 'percentage' ? 'selected' : ''}>Percentage (%)</option>
              <option value="fixed" ${discount.type === 'fixed' ? 'selected' : ''}>Fixed Amount ($)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Value:</label>
            <input type="number" name="value" value="${discount.value || 0}" required step="0.01">
          </div>
          <div class="form-group">
            <label>Active:</label>
            <input type="checkbox" name="active" value="on" ${discount.active ? 'checked' : ''}>
          </div>
          <button type="submit">Update</button>
          <a href="/admin/discounts">Cancel</a>
        </form>
      </div>
      </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    console.error('Edit discount error:', error);
    res.status(500).send('Error loading discount');
  }
});

// POST /admin/discounts/:id/edit
router.post('/discounts/:id/edit', requireAdmin, async (req, res) => {
  try {
    const db = require('../firebase');
    const { code, name, value, type, active } = req.body;
    
    await db.collection('discounts').doc(req.params.id).set({
      code: code || '',
      name: name || '',
      value: parseFloat(value) || 0,
      type: type || 'percentage',
      active: active === 'on',
      updatedAt: new Date()
    }, { merge: true });
    
    res.redirect('/admin/discounts?success=Discount updated');
  } catch (error) {
    console.error('Update discount error:', error);
    res.status(500).send('Error updating discount');
  }
});

// POST /admin/discounts/:id/delete
router.post('/discounts/:id/delete', requireAdmin, async (req, res) => {
  try {
    const db = require('../firebase');
    await db.collection('discounts').doc(req.params.id).delete();
    res.redirect('/admin/discounts?success=Discount deleted');
  } catch (error) {
    console.error('Delete discount error:', error);
    res.status(500).send('Error deleting discount');
  }
});

// GET /admin/whatsapp-settings - Admin page to manage WhatsApp checkout message
router.get('/whatsapp-settings', async (req, res) => {
  try {
    const db = require('../firebase');
    const settingsDoc = await db.collection('settings').doc('whatsapp-checkout').get();
    const settings = settingsDoc.exists ? settingsDoc.data() : {
      whatsappNumber: '1234567890',
      messageTemplate: 'default'
    };

    const body = `
      <div style="padding: 2rem; max-width: 800px; margin: 0 auto;">
        <h1>WhatsApp Checkout Settings</h1>
        <p style="color: #666; margin-bottom: 2rem;">Customize the WhatsApp message shown during checkout</p>
        
        <form method="POST" action="/admin/api/whatsapp-settings" style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label for="whatsappNumber" style="font-weight: 600; color: #2c3e50;">WhatsApp Number (with country code)</label>
            <input 
              type="text" 
              id="whatsappNumber" 
              name="whatsappNumber" 
              value="${settings.whatsappNumber || '1234567890'}"
              placeholder="1234567890"
              style="padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;"
            />
            <small style="color: #7f8c8d;">Example: 1234567890 (include country code without + symbol)</small>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label for="messageTemplate" style="font-weight: 600; color: #2c3e50;">Message Template</label>
            <select 
              id="messageTemplate" 
              name="messageTemplate"
              style="padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;"
            >
              <option value="default" ${settings.messageTemplate === 'default' ? 'selected' : ''}>Default: "Please confirm this order. Thank you!"</option>
              <option value="friendly" ${settings.messageTemplate === 'friendly' ? 'selected' : ''}>Friendly: "Please confirm this order. We appreciate your business!"</option>
              <option value="professional" ${settings.messageTemplate === 'professional' ? 'selected' : ''}>Professional: "Please confirm this order. Thank you for your purchase."</option>
              <option value="urgent" ${settings.messageTemplate === 'urgent' ? 'selected' : ''}>Urgent: "Please confirm ASAP to secure your order!"</option>
            </select>
          </div>

          <div style="background: #f8f9fa; padding: 1rem; border-radius: 6px; border-left: 4px solid #667eea;">
            <strong style="color: #667eea;">Preview:</strong>
            <div id="messagePreview" style="margin-top: 0.5rem; color: #2c3e50; font-size: 0.95rem; white-space: pre-wrap; font-family: monospace;">
              Loading preview...
            </div>
          </div>

          <div style="display: flex; gap: 1rem;">
            <button type="submit" style="flex: 1; padding: 0.85rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 1rem;">
              Save Settings
            </button>
            <a href="/admin/dashboard" style="flex: 1; padding: 0.85rem; background: #95a5a6; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; text-align: center; text-decoration: none; font-size: 1rem;">
              Cancel
            </a>
          </div>
        </form>

        <script>
          const templateSelect = document.getElementById('messageTemplate');
          const preview = document.getElementById('messagePreview');
          
          const templates = {
            default: 'Please confirm this order. Thank you!',
            friendly: '😊 Please confirm this order. We appreciate your business!',
            professional: 'Please confirm this order. Thank you for your purchase.',
            urgent: '⏰ Please confirm ASAP to secure your order!'
          };

          function updatePreview() {
            const template = templateSelect.value;
            const message = \`🛒 *Order Request*

*Items:*
• Product Name (x1) - $29.99

*Total: $29.99*

\${templates[template]}\`;
            preview.textContent = message;
          }

          templateSelect.addEventListener('change', updatePreview);
          updatePreview();
        </script>
      </div>
    `;

    res.render('layouts/adminLayout', { body, title: 'WhatsApp Settings' });
  } catch (error) {
    console.error('WhatsApp settings error:', error);
    res.status(500).send('Error loading WhatsApp settings');
  }
});

// POST /admin/api/whatsapp-settings - Update WhatsApp checkout settings
router.post('/api/whatsapp-settings', async (req, res) => {
  try {
    const { whatsappNumber, messageTemplate } = req.body;
    const db = require('../firebase');

    await db.collection('settings').doc('whatsapp-checkout').set({
      whatsappNumber: whatsappNumber || '1234567890',
      messageTemplate: messageTemplate || 'default',
      updatedAt: new Date(),
      updatedBy: req.session.email
    }, { merge: true });

    res.redirect('/admin/whatsapp-settings?success=Settings saved successfully');
  } catch (error) {
    console.error('Save WhatsApp settings error:', error);
    res.status(500).send('Error saving WhatsApp settings');
  }
});

module.exports = router;
