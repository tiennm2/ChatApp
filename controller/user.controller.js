const User = require('../model/user');

function getUser(req, res){
    User.find(function (err, result) {
        if (err){
            res.send(err);
        }
        res.send(result);
    })
}

function getUserById(req, res) {
    User.findById({_id: req.params.id}, (err, result) => {
        if (err){
            res.json(err)
        }
        res.json({
            status: 'success',
            data: result
        })
    })
}

async function createUser(req, res) {
    let user = new User(req.body);
    try {
        let saved = await user.save();
        res.json({
            status: 'success',
            data: saved
        })
    }catch (err) {
        res.json(err);
    }
}

module.exports = {
    getUser,
    getUserById,
    createUser
};