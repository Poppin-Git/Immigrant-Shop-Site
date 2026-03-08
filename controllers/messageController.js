const { getAllMessages } = require('../models/messageModel');

// GET /admin/messages - Show all messages
const showMessages = async (req, res) => {
  try {
    const messages = await getAllMessages();
    res.render('admin/messages', { messages, title: 'Messages' });
  } catch (error) {
    console.error('Messages page error:', error);
    res.status(500).send('Error loading messages page');
  }
};

module.exports = {
  showMessages
};