const userModel = require('../models/userModel');

// GET /api/user/me
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await userModel.getUserById(req.session.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Don't send password hash
    const { passwordHash, ...userWithoutPassword } = user;

    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getCurrentUser
};
