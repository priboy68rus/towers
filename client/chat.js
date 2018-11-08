const chat_area = document.querySelector("#chat-area");
const chat_input = document.querySelector("#chat-input");
const chat_send = document.querySelector('#chat-send');

function Chat(player_name, max_count, sender) {
    this.username = player_name;
    this.message_count = 0;
    this.max_count = max_count;
    this.sender = sender;
    
    this.addMessage = function(data) {
        var msg = document.createElement("div");
        if (data.user == player_name) {
            msg.classList.add("my-msg");
            msg.innerHTML = `<p class="name">${data.user}</p>: <p>${data.msg}</p>`;
        } else if (data.user == "__system__") {
            msg.classList.add("system-msg");
            msg.innerHTML = `${data.msg}`;
        } else {
            msg.classList.add("other-msg");
            msg.innerHTML = `<p class="name">${data.user}</p>: <p>${data.msg}</p>`;
        }
        msg.classList.add("chat-msg");
        
        if (this.message_count == this.max_count) {
            chat_area.removeChild(chat_area.children[0]);
            chat_area.appendChild(msg);
        } else {
            chat_area.appendChild(msg);
            this.message_count++;
        }
    };

    this.sendMessage = function() {
        if (chat_input.value == "") {
            return;
        }
        this.sender.call(this, {user: this.username, msg: chat_input.value});
        this.addMessage({user: this.username, msg: chat_input.value});
        chat_input.value = "";
    }

}