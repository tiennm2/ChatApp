const message = require('../model/message');

function getMessageByConverId(req, res) {
    message.find({conversationId: req.params.conversationId}).populate('userId').exec((err, result) => {
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
    getMessageByConverId
};