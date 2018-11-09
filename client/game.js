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
var chat;

var player_data;
var enemy_data;



window.addEventListener('load', function() {
    joinRoom();

    chat = new Chat(player_name, 6, msgSender);
    chat_send.addEventListener('click', function() {
        chat.sendMessage();
    })
    
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
        sum = 0;
        submit_btn.disabled = false;
        ready_btn.classList.remove("button-primary");
        st = "wait";
        sendStatus();
        clearLabels();
        updateCounter();

    } else if (state == "results") {
        
        showPlayerData();
        showEnemyData();
        updateResults();

    } else if (state == "inputdone") {

        submit_btn.disabled = true;
        showPlayerData();
    }
}


//---------------------------------------------
// socket.io thing
//---------------------------------------------

socket.on('connect', function() {
    console.log('connected');
    // chat.addMessage({user: "__system__", msg: "connected"});
});

socket.on('disconnect', function() {
    console.log('disconnected');
    // chat.addMessage({user: "__system__", msg: "disconnected"});
});

socket.on('updateUserList', function(data) {
    console.log(data);
    setTableContent(data);

    if (data.length < 2 && st != "wait" && st != "ready") {
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

socket.on('msg', function(data) {
    chat.addMessage(data);
});