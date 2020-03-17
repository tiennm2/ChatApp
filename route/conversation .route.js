const router = require('express').Router();
const conversationController = require('../controller/conversation.controller');

router.get('/', conversationController.getConversation);

module.exports = router;
