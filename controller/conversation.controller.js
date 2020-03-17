const conversation = require('../model/conversation');

function getConversation(req, res) {
    conversation.find().populate('participants', 'email').exec((err, result) => {
        if(err){
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

module.exports = {
    getConversation
};