const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');

const {Users} = require('./users');

const app = express();
const serv = http.createServer(app);
const io = socketIO(serv);

var users = new Users();

app.use(express.static(path.join(__dirname, 'client')));

io.on('connection', (socket) => {

    socket.on('rooms', () => {
        socket.emit('rooms', {rooms: users.getFreeRooms()})
    });


    socket.on('join', (data) => {
        
        if (users.getUserList(data.room).length > 1) {
            socket.emit('fullroom');
            socket.disconnect();
            return;
        }

        socket.join(data.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, data.name, data.room);

        io.to(data.room).emit('updateUserList', users.getUserList(data.room));


        io.emit('rooms', {rooms: users.getFreeRooms()})
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
        }
    });

    socket.on('statusChange', (data) => {
        var user = users.getUser(socket.id);

        

        if (user) {
            user.status = data.status;
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));

            if (users.isRoomReady(user.room)) {
                console.log('room ' + user.room + ' is ready');
                io.to(user.room).emit('roomReady');
            }
        }
    });

    socket.on('played', (data) => {
        var user = users.getUser(socket.id);

        console.log(user.name + " " + data.num);

        if (user) {
            socket.broadcast.to(user.room).emit('played', data);
        }
    });

});

serv.listen(80, () => {
    console.log('Started on port 80');
});