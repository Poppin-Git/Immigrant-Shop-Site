const userModel = require('../models/userModel');
const adminModel = require('../models/adminModel');

// GET /user/profile
const getProfile = async (req, res, next) => {
  try {
    const user = await userModel.getUserById(req.session.userId);

    if (!user) {
      return res.status(404).render('error', {
        title: 'User Not Found',
        status: 404,
        message: 'User profile could not be found.'
      });
    }

    res.render('user/profile', {
      title: 'User Profile',
      user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile
};
