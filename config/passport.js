const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const jwtSecret = require('../config/jwtConfig');
const User = require('../model/user');

const BCRYPT_SALT_ROUNDS = 12;

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

//Passport register
passport.use('register', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
}, async function(req, email, password, done){
    User.findOne({
        'email' : email
    }, async function(err, user){
        if(err){
            return done(err)
        }
        if(user){
            console.log('email đã tồn tại');
            return done(null, false, {
                message : 'Email đã được sử dụng, vui lòng chọn email khác'
            })
        }

        let newUser = new User();
        newUser.firstname = req.body.first_name;
        newUser.lastname = req.body.last_name;
        newUser.email = email;
        newUser.password = bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
        bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then(hashedPassword => {
            User.create({
                firstname: req.body.first_name,
                lastname: req.body.last_name,
                password: hashedPassword,
                email: req.body.email,
            }).then(user => {
                console.log('user created');
                return done(null, user);
            });
        });
    })
}));

/* Passport login */
passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    try {
        User.findOne({
            'email': email
        }).then(user => {
            if (user === null) {
                return done(null, false, {message: 'bad email'})
            }
            bcrypt.compare(password, user.password).then(res => {
                if (res !== true) {
                    console.log('passwords do not match');
                    return done(null, false, {message: 'passwords do not match'});
                }
                console.log('user found & authenticated');
                return done(null, user);
            })
        })
    } catch (err) {
        if (err)
            return done(err);

    }
}));

const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: jwtSecret.secret,
};

passport.use(
    'jwt',
    new JWTstrategy(opts, (jwt_payload, done) => {
        try {
            User.findOne({
                where: {
                    _id: jwt_payload._id,
                },
            }).then(user => {
                if (user) {
                    console.log('user found in db in passport');
                    done(null, user);
                } else {
                    console.log('user not found in db');
                    done(null, false);
                }
            });
        } catch (err) {
            done(err);
        }
    }),
);
