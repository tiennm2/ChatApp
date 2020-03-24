const express = require('express');
const passport = require('passport');
const router = express.Router();
const userController = require('../controller/user.controller');

//register
router.route('/register')
    .get(function(req, res) {
        res.render('register');
    })
    .post(passport.authenticate('local.register', {
        successRedirect: '/home',
        failureRedirect: '/user/register',
        failureFlash: true }));

//login
router.route('/login')
    .get(function(req, res) {
        res.render('login');
    })
    .post(passport.authenticate('local.login', {
        successRedirect: '/home',
        failureRedirect: '/user/login',
        failureFlash: true }));


//get user
router.get('/', userController.getUser);
module.exports = router;