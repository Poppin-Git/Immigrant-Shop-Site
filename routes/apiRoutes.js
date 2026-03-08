const express = require('express');
const { requireAuthAPI } = require('../middleware/authMiddleware');
const { getCurrentUser } = require('../controllers/apiController');

const router = express.Router();

// GET /api/user/me - Get current user info (requires auth)
router.get('/user/me', requireAuthAPI, getCurrentUser);

// GET /api/settings/whatsapp-checkout - Get WhatsApp checkout settings (public)
router.get('/settings/whatsapp-checkout', async (req, res) => {
  try {
    const db = require('../firebase');
    const settingsDoc = await db.collection('settings').doc('whatsapp-checkout').get();
    
    if (settingsDoc.exists) {
      const settings = settingsDoc.data();
      res.json({
        whatsappNumber: settings.whatsappNumber || '1234567890',
        messageTemplate: settings.messageTemplate || 'default'
      });
    } else {
      // Return default settings if not configured
      res.json({
        whatsappNumber: '1234567890',
        messageTemplate: 'default'
      });
    }
  } catch (error) {
    console.error('Error fetching WhatsApp settings:', error);
    // Return defaults on error
    res.json({
      whatsappNumber: '1234567890',
      messageTemplate: 'default'
    });
  }
});

module.exports = router;
