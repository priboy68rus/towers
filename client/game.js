var socket = io();

const ready_btn = document.querySelector("#ready-btn");
const restart_btn = document.querySelector("#restart-btn");
const submit_btn = document.querySelector("#submit-btn");
const players_list_table = document.querySelector(".players-list tbody");
const header = document.querySelector(".header");
const counter = document.querySelector("#counter");


var st = "wait";
var player_name = "";
var room_name = "";
var towers_count = 10;
var max_soldiers = 50;
var soldiers_sum = 0;
var player_score = 0;
var enemy_score = 0;

var player_data;
var enemy_data;



window.addEventListener('load', function() {
    joinRoom();
    
    ready_btn.addEventListener('click', function() {
        toggleStatus();
    });
    
    submit_btn.addEventListener('click', function() {
        collectPlayerInputs();
        if (validatePlayerInputs()){
            
            socket.emit("played", {data: player_data});
            
            st = "inputdone";
            setState("inputdone");
            sendStatus();
            if (enemy_data != null) {
                setState("results");
                st = "results";
                sendStatus();
            }
        } else {
            counter.style.color = "red";
            setTimeout(() => counter.style.color ="black", 1000)
        }
    });
    
    restart_btn.addEventListener('click', function() {
        st = "wait";
        sendStatus();
        setState("wait");
    });
    
    var inps = document.querySelectorAll("#player-inputs-container input");
    for (var i = 0; i < inps.length; i++) {
        inps[i].addEventListener('input', function() {
            collectPlayerInputs();
            updateCounter();
        });
    }
    
    setState("wait");
});

function setState(state) {
    
    showContentByState(state);
    
    if (state == "input") {
        
        // toggleStatus();

    } else if (state == "wait") {
        
        player_data = null;
        enemy_data = null;
        clearLabels();
        sum = 0;
        updateCounter();
        submit_btn.disabled = false;

        st = "wait";
        sendStatus();
        ready_btn.classList.remove("button-primary");

    } else if (state == "results") {
        
        showPlayerData();
        showEnemyData();
        updateResults();

    } else if (state == "inputdone") {

        submit_btn.disabled = true;
        showPlayerData();
    }
}

function showContentByState(state) {
    var elements = document.querySelectorAll(".game");
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].classList.contains(state)) {
            //show
            elements[i].classList.remove("hidden");
            elements[i].classList.add("shown");
        } else {
            //hide
            elements[i].classList.remove("shown");
            elements[i].classList.add("hidden");
        }
    }
}

function joinRoom() {
    var param = new URLSearchParams(window.location.search);
    player_name = param.get('name');
    room_name = param.get('room');
    
    socket.emit('join', {'name': player_name, 'room': room_name});
    header.innerHTML = `You are in <b>${room_name}</b> as <b>${player_name}</b>`;
}

function toggleStatus() {
    if (st == "wait") {
        st = "ready";
    } else if (st == "ready") {
        st = "wait";
    }
    sendStatus();
    ready_btn.classList.toggle('button-primary');
}

function setTableContent(data) {
    var rows = document.querySelectorAll("tbody tr");
    for (var i = 0; i < rows.length; i++) {
        rows[i].parentNode.removeChild(rows[i]);
    }
    
    for (var i = 0; i < data.length; i++) {
        var tr = document.createElement("tr");
        var _player_name = data[i].name;
        if (player_name == _player_name) {
            _player_name = `<b>${_player_name}</b>`;
        }
        tr.innerHTML = `<td>${_player_name}</td><td>${formatStatus(data[i].status)}</td>`;
        players_list_table.appendChild(tr);
    }
}

function formatStatus(status) {
    if (status == 'wait') {
        return 'Waiting...';
    } else if (status == 'ready') {
        return 'Ready!';
    } else if (status == 'input') {
        return 'Sending soldiers...';
    } else if (status == 'inputdone') {
        return 'Soldiers sent!';
    } else if (status == 'results') {
        return 'Looking at results...';
    } else {
        return status;
    }
} 


function collectPlayerInputs() {
    var inps = document.querySelectorAll("#player-inputs-container input");
    player_data = [];
    sum = 0;
    for (var i = 0; i < inps.length; i++) {
        player_data.push(inps[i].value);
        sum += parseInt(player_data[i]);
    }
}

function showPlayerData() {
    var pl_labels = document.querySelectorAll(".player-label");

    for (var i = 0; i < player_data.length; i++) {
        pl_labels[i].textContent = player_data[i];
    }
}

function showEnemyData() {
    var en_labels = document.querySelectorAll(".enemy-label");

    for (var i = 0; i < enemy_data.length; i++) {
        en_labels[i].textContent = enemy_data[i];
    }
}

function updateResults() {
    var tl = document.querySelectorAll(".tower-label");
    player_score = 0;
    enemy_score = 0;

    for (var i = 0; i < player_data.length; i++) {
        if (parseInt(player_data[i]) > parseInt(enemy_data[i])) {
            tl[i].style.color = "rgb(0, 201, 0)";
            player_score += (i + 1);
        } else if (parseInt(player_data[i]) < parseInt(enemy_data[i])) {
            tl[i].style.color = "red";
            enemy_score += (i + 1);
        } else if (parseInt(player_data[i]) == parseInt(enemy_data[i])) {
            tl[i].style.color = "black";
        }
    }

    if (player_score > enemy_score) {
        counter.textContent = `${player_score} vs ${enemy_score}  You won!`;
    } else if (player_score < enemy_score) {
        counter.textContent = `${player_score} vs ${enemy_score}  You lost!`;
    } else {
        counter.textContent = `${player_score} vs ${enemy_score}  Tie!`;
    }
}

function updateCounter() {
    counter.textContent = `${sum}/50`;
}

function clearLabels() {
    var ps = document.querySelectorAll("#player-inputs-container input");
    for (var i = 0; i < ps.length; i++) {
        ps[i].value = 0;
    }
    var tl = document.querySelectorAll(".tower-label");
    for (var i = 0; i < tl.length; i++) {
        tl[i].style.color = "black";
    }
}

function validatePlayerInputs() {
    var sum = 0;
    
    for (i = 0; i < player_data.length; i++) {
        sum += parseInt(player_data[i]);
        if (parseInt(player_data[i]) < 0 || parseInt(player_data[i]) > 50) {
            return false;
        }
    }
    if (sum != 50) {
        return false;
    }
    
    return true;
}


function sendStatus() {
    socket.emit('statusChange', {status: st});
}

//---------------------------------------------
// socket.io thing
//---------------------------------------------

socket.on('connect', function() {
    console.log('connected');
});

socket.on('disconnect', function() {
    console.log('disconnected');
});

socket.on('updateUserList', function(data) {
    console.log(data);
    setTableContent(data);

    if (data.length < 2) {
        st = "wait";
        sendStatus();
        setState("wait");
    }
});

socket.on('roomReady', function() {
    setState("input");
    st = "input";
    sendStatus();
});

socket.on('played', function(d) {
    enemy_data = d.data;
    
    if (st == 'inputdone') {
        st = "results";
        sendStatus();
        setState("results");
    }
    
});