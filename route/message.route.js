const router = require('express').Router();
const messageController = require('../controller/message.controller');

router.get('/:conversationId', messageController.getMessageByConverId);
router.post('/', messageController.createMessage);

module.exports = router;