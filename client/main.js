var socket = io();

const join_form = document.querySelector("#join-room");
const name_input = document.querySelector("#name-input");
const room_input = document.querySelector("#room-input");
const room_container = document.querySelector(".rooms-container");


window.addEventListener('load', function() {
    socket.emit('rooms');
});

socket.on('rooms', function(data) {
    var rooms = data.rooms;
    for (var i = 0; i < rooms.length; i++) {
        var r = document.createElement('div');
        r.classList.add('room');
        r.textContent = rooms[i].value;
        room_container.appendChild(r);
    }
});