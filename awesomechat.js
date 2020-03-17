const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const users = {};
const converRoute = require('./route/conversation .route');
const messRouter = require('./route/message.route');
server.listen(process.env.PORT || 5000);

//connect mongo
mongoose.connect("mongodb://localhost:27017/testdb",{ useNewUrlParser :"true"});
mongoose.connection.on("error",(err)=>{
    console.log("err",err);
});

mongoose.connection.on("connected",(err,res) => {
    console.log("mongoose is connected");
});

//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const User = require('./model/user');
const Conversation = require('./model/conversation');
const Message = require('./model/message');
// User.create({
//     _id: new mongoose.Types.ObjectId(),
//     firstname: 'Tien',
//     lastname: 'Nguyen',
//     email: 'manhtien@gamil.com',
//     password: '123456789'
// });
// Conversation.create({
//     participants: [
//         '5e6f3ba125e45f567e90c1b2'
//     ],
// });
Message.create({
    userId: [
        '5e6f3ba125e45f567e90c1b2'
    ],
    conversationId: [
        '5e6f4f080f354f6215d4554f'
    ],
    body: 'helllo Nguyen Manh Tien'
});




app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", './view');

app.get('/', (req, res) => {
    res.render('chatui');
});

app.use('/conversation', converRoute);
app.use('/message', messRouter);

io.sockets.on('connection', function(socket){
    socket.on('new user', function(name, data){
        if (name in users){
            data(false);
        }else{
            data(true);
            socket.nickname = name;
            users[socket.nickname] = socket;
            console.log('add nickName');
            updateNickNames();
        }

    });

    function updateNickNames(){
        io.sockets.emit('usernames', Object.keys(users));
    }
    socket.on('open-chatbox', function(data){
        users[data].emit('openbox', {nick: socket.nickname});
    });
    socket.on('send message',function(data, sendto){
        users[sendto].emit('new message',{msg: data, nick: socket.nickname, sendto: sendto});
        users[socket.nickname].emit('new message',{msg: data, nick: socket.nickname, sendto: sendto});

        console.log(data);
        console.log(sendto);
    });
    socket.on('disconnect', function(data){
        if (!socket.nickname) return;
        delete users[socket.nickname];
        updateNickNames();
    });
});

app.listen(3000,() => {
    console.log(`app is listening to PORT 3000`);
});