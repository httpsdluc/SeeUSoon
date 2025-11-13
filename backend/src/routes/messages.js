const express = require('express');
const router = express.Router();
const { 
  sendMessage, 
  getConversation, 
  getConversations,
  markAsRead 
} = require('../controllers/messagesController');

router.post('/', sendMessage);
router.get('/conversations/:user_id', getConversations);
router.get('/:user_id/:other_user_id', getConversation);
router.put('/read/:user_id/:other_user_id', markAsRead);

module.exports = router;
