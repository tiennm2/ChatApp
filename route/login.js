const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/jwtConfig');
const User = require('../model/user');

module.exports = app => {
    app.post('/login', (req, res, next) => {
        passport.authenticate('login', (err, users, info) => {
            if (err) {
                console.error(`error ${err}`);
            }
            if (info !== undefined) {
                console.error(info.message);
                if (info.message === 'bad username') {
                    res.status(401).send(info.message);
                } else {
                    res.status(403).send(info.message);
                }
            } else {
                req.logIn(users, () => {
                    User.findOne({
                        where: {
                            'email': users.email,
                        },
                    }).then(user => {
                        const token = jwt.sign({ id: users._id }, jwtSecret.secret, {
                            expiresIn: 60 * 60,
                        });
                        res.header('auth-token', token);
                        res.status(200).send({
                            auth: true,
                            token,
                            message: 'user found & logged in',
                        });
                    });
                });
            }
        })(req, res, next);
    });
};
