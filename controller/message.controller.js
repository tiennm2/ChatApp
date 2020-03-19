const Message = require('../model/message');

function getMessageByConverId(req, res) {
    Message.find({conversationId: req.params.conversationId}).populate('userId').exec((err, result) => {
        if (err) {
            res.json({
                status: 'error',
                message: err
            })
        }
        res.json({
            status: 'success',
            message: result
        })
    })
}

async function createMessage(req, res) {
    let message = new Message(req.body);
    try {
        let savedMessage = await message.save();
        res.json({
            status: 'success',
            data: savedMessage
        })
    }catch (err) {
        res.json(err);
    }
}

module.exports = {
    getMessageByConverId,
    createMessage
};