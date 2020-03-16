const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../model/user');
const BCRYPT_SALT_ROUNDS = 12;

module.exports = app => {
    app.post('/register', (req, res, next) => {
        passport.authenticate('register', (err, user, info) => {
            if (err) {
                console.error(err);
            }
            if (info !== undefined) {
                console.error(info.message);
                res.status(403).send(info.message);
            }

        })(req, res, next);
    });
};