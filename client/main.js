var socket = io();

const join_form = document.querySelector("#join-room");
const name_input = document.querySelector("#name-input");
const room_input = document.querySelector("#room-input");
const room_container = document.querySelector(".rooms-container");
const no_rooms = document.querySelector(".no-rooms");


window.addEventListener('load', function() {
    socket.emit('rooms');

    if (Cookies.get('name') != null) {
        name_input.value = Cookies.get('name');
    }

    name_input.addEventListener('input', function() {
        Cookies.set('name', name_input.value);
    });
});

socket.on('rooms', function(data) {
    var rooms = data.rooms;

    var room_elements = document.querySelectorAll('.room');
    for (var i = 0; i < room_elements.length; i++) {
        room_elements[i].parentNode.removeChild(room_elements[i]);
    }

    if (rooms.length > 0) {
        no_rooms.style.display = 'none';
    } else {
        no_rooms.style.display = 'block';
    }

    for (var i = 0; i < rooms.length; i++) {
        var r = document.createElement('div');
        r.classList.add('room');
        r.textContent = rooms[i].value;
        r.addEventListener('click', function(e) {
            room_input.value = e.target.textContent;
        });
        room_container.appendChild(r);
    }
});