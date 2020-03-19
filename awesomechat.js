const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const converRoute = require('./route/conversation .route');
const messRouter = require('./route/message.route');


//connect mongo
mongoose.connect("mongodb://localhost:27017/testdb", {useNewUrlParser: "true"});
mongoose.connection.on("error", (err) => {
    console.log("err", err);
});

mongoose.connection.on("connected", (err, res) => {
    console.log("mongoose is connected");
});

//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const User = require('./model/user');
const Conversation = require('./model/conversation');
const Message = require('./model/message');


app.use('/conversation', converRoute);
app.use('/message', messRouter);

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
            } else {
                Message.find({conversationId: conversation.id}, function (err, message) {
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

    socket.on('disconnect', function (data) {
        // if (!socket.nickname) return;
        // delete users[socket.nickname];
        // updateNickNames();
    });
});

server.listen(3000);
