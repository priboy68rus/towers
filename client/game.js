var socket = io();

var st = false;

const ready_btn = document.querySelector("#ready-btn");
const restart_btn = document.querySelector("#restart-btn");
const msg = document.querySelector(".msg");
const num_input = document.querySelector("#num-input");
const num = document.querySelector("#num-input input");
const num_btn = document.querySelector("#num-input button");
const player_num = document.querySelector(".player-number");
const enemy_num = document.querySelector(".enemy-number");

window.addEventListener('load', function() {
    joinRoom();

    ready_btn.addEventListener('click', function() {
        toggleStatus();
    });

    num_btn.addEventListener('click', function() {
        setState("show", num.value);
        socket.emit("played", {num: num.value});
    });

    restart_btn.addEventListener('click', function() {
        setState("wait");
    })

    setState("wait");
});

function setState(state, player_data, enemy_data) {
    
    if (state == "input") {
        num.value = "";
        num_input.style.display = "block";
        ready_btn.style.display = "none";
        toggleStatus();
        return;
    }
    if (state == "wait") {

        ready_btn.style.display = "block";
        num_input.style.display = "none";
        player_num.style.display = "none";
        enemy_num.style.display = "none";
        restart_btn.style.display = "none";
        player_num.textContent = "";
        enemy_num.textContent = "";
        msg.textContent = "";
        return;
    }
    if (state = "show") {
        num_input.style.display = "none";
        if (player_data)
            player_num.textContent = player_data;
        if (enemy_data)
            enemy_num.textContent = enemy_data;

        
        player_num.style.display = "block";
        enemy_num.style.display = "block";

        showRestart();
        return;
    }
}

function joinRoom() {
    var param = new URLSearchParams(window.location.search);

    socket.emit('join', {'name': param.get('name'), 'room': param.get('room')});
}

function toggleStatus() {
    st = !st;
    socket.emit('statusChange', {status: st});
    ready_btn.classList.toggle('button-primary');
}


function showRestart() {
    if (player_num.textContent != "" &&  enemy_num.textContent != "") {
        restart_btn.style.display = "block";
    }
}

socket.on('connect', function() {
    console.log('connected');
});

socket.on('disconnect', function() {
    console.log('disconnected');
});

socket.on('updateUserList', function(data) {
    console.log(data);
});

socket.on('roomReady', function() {
    msg.textContent = 'room is ready';
    setState("input");
});

socket.on('played', function(data) {
    enemy_num.textContent = data.num;
    showRestart();
});