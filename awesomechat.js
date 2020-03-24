const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const converRoute = require('./route/conversation .route');
const messRouter = require('./route/message.route');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const users = {};
require('./config/passport');

// controller
const userController = require('./controller/user.controller');
//connect mongo
mongoose.connect("mongodb://localhost:27017/testdb", {useNewUrlParser: "true"});
mongoose.connection.on("error", (err) => {
    console.log("err", err);
});
mongoose.connection.on("connected", (err, res) => {
    console.log("mongoose is connected");
});

/* Cài đặt template ejs */
app.use(express.static(__dirname + '/public'));
app.engine('ejs', require('ejs-locals'));
app.set("view engine", "ejs");
app.set("views", './view');

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
app.use('/conversation', converRoute);
app.use('/message', messRouter);

app.get('/home', isLoggedIn,function(req,res){
    res.render('homepage')
});
app.get('/',async function(req,res){
    // User.find(function (err, result) {
    //     if (err){
    //         res.send(err);
    //     }
    //     res.render('chatui', {users: result});
    // });
    let listUser = await userController.getUser();
    console.log(listUser);
    res.render('chatui', {
        users: listUser
    });
});

app.get('/users', userController.getUser);



// route middleware để kiểm tra một user đã đăng nhập hay chưa?
function isLoggedIn(req, res, next) {
    // Nếu một user đã xác thực, cho đi tiếp
    if (req.isAuthenticated())
        return next();
    // Nếu chưa, đưa về trang chủ
    res.redirect('/');
}

const User = require('./model/user');
const Conversation = require('./model/conversation');
const Message = require('./model/message');

io.sockets.on('connection', function (socket) {
    console.log('socket.io is connecting');
    socket.on('join-chat', function (data) {
        Conversation.findOne({participants: data}, async function (err, conversation) {
            // console.log(conversation);
            if (err) {
                throw err;
            }
            if (!conversation) {
                console.log(data);
                const {participants} = data;
                let conversation = new Conversation({
                    participants: data
                });
                let result = await conversation.save();
                // console.log(result);
                socket.conversationId = result._id;
                socket.join(result._id);
                let message = 'create group chat is success';
                socket.emit('success-data', message);
            } else {
                let message = 'group chat is already exist';
                socket.emit('error-data', message);
                Message.find({conversationId: conversation.id}, function (err, message) {
                    // console.log(data);

                    socket.conversationId = conversation.id;
                    if (err) throw  err;
                    if (message) {
                        message.forEach(element => {
                            socket.emit('send-message-room', element.body);

                        });
                    }
                });
            }
        });
    });

    socket.on('send-message', async function (data) {
        let message = new Message({
            userId: data.userId,
            conversationId: socket.conversationId,
            body: data.body
        });
        console.log(data);
        let savedMess = await message.save();

        socket.emit('new-message', savedMess.body);
    });
    // socket.on('new user', function (name, data) {
    //     if (name in users) {
    //         data(false);
    //     } else {
    //         data(true);
    //         socket.nickname = name;
    //         users[socket.nickname] = socket;
    //         console.log('add nickName');
    //         updateNickNames();
    //     }
    //
    // });
    //
    // function updateNickNames() {
    //     io.sockets.emit('usernames', Object.keys(users));
    // }
    //
    // socket.on('open-chatbox', function (data) {
    //     users[data].emit('openbox', {nick: socket.nickname});
    // });
    // socket.on('send message', function (data, sendto) {
    //     users[sendto].emit('new message', {msg: data, nick: socket.nickname, sendto: sendto});
    //     users[socket.nickname].emit('new message', {msg: data, nick: socket.nickname, sendto: sendto});
    //
    //     console.log(data);
    //     console.log(sendto);
    // });
    socket.on('disconnect', function (data) {
        if (!socket.nickname) return;
        delete users[socket.nickname];
        updateNickNames();
    });
});

server.listen(3000);
