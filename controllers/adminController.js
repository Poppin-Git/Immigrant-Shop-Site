const userModel = require('../models/userModel');
const adminModel = require('../models/adminModel');

// GET /admin/dashboard
const getDashboard = async (req, res, next) => {
  try {
    const adminEmail = req.session.userEmail;

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      adminEmail: adminEmail
    });
  } catch (error) {
    next(error);
  }
};

// GET /admin/users
const getUsers = async (req, res, next) => {
  try {
    const users = await adminModel.getAllUsers();

    res.render('admin/users', {
      title: 'Manage Admins',
      users
    });
  } catch (error) {
    next(error);
  }
};

// GET /admin/logs
const getLogs = async (req, res, next) => {
  try {
    const logs = await adminModel.getRecentLogs(100);

    res.render('admin/logs', {
      title: 'System Logs',
      logs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getUsers,
  getLogs
};
