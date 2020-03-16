const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const router = express.Router();
const PORT = 3000;
const app = express();
require('./config/passport');
/* Khai báo để sử dụng kịch bản passport */




mongoose.connect("mongodb://localhost:27017/testdb",{ useNewUrlParser :"true"});
mongoose.connection.on("error",(err)=>{
    console.log("err",err);
});

mongoose.connection.on("connected",(err,res) => {
    console.log("mongoose is connected");
});

/* Cài đặt template ejs */
// app.engine('ejs', require('ejs-locals'));
// app.set("view engine", "ejs");
// app.set("views", './view');

/* Cấu hình passport */
app.use(session({
    secret : 'secured_key',
    resave : false,
    saveUninitialized : false
}))
app.use(flash());
//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//middleware port
app.use(passport.initialize());
app.use(passport.session());

/* Khai báo các router cần dùng */
const userRegister = require('./route/register')(app);
const userLogin = require('./route/login')(app);

/* Cài đặt router */
app.get('/home', isLoggedIn,function(req,res){
    res.render('homepage')
})


// route middleware để kiểm tra một user đã đăng nhập hay chưa?
function isLoggedIn(req, res, next) {
    // Nếu một user đã xác thực, cho đi tiếp
    if (req.isAuthenticated())
        return next();
    // Nếu chưa, đưa về trang chủ
    res.redirect('/');
}


app.listen(PORT,() => {
    console.log(`app is listening to PORT ${PORT}`);
});