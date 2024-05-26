console.log('check')

let chatLog = document.querySelector(".chat-history")
let chatMessageInput = document.querySelector(".chat-input-box")
let chatMessageSend = document.querySelector(".chat-send-input")

let user = null

chatMessageInput.focus()


let chat_list = document.querySelector('.chat-list')
let chat_info = document.querySelector('.chat-info')
let chat_content = document.querySelector('.chat-content')
let currentChatName = null

let chatSocket = null

async function getChatList() {
    const responseP2P = await fetch(
        'http://127.0.0.1:8000/rest/chat_p2p/',
        {
            method: "GET",
            mode: 'cors',
            headers: {
                Accept: "application/json",
                'Content-Type': 'application/json',
            },
            credentials: "same-origin",
        }
    )
    data = await responseP2P.json()
    data.forEach(element => {
        const chat_card = document.createElement('template')
        html = `<div class="chat-card">
            <div class="chat-card-icon">
                <img src="" alt="">
            </div>
            <div class="chat-card-info">
                <div class="chat-card-name-date">
                    <span class="chat-card-name">Chat with ${element.user1} and ${element.user2}</span>
                    <span class="lastmgs">${getLastMessage(element).timestamp.slice(11,16)}</span>
                </div>
                <div class="chat-lastmsg-unread">
                    ${getLastMessage(element).text}
                </div>
            </div>
        </div>`
        html = html.trim();
        chat_card.innerHTML = html
        let child = chat_card.content.cloneNode(true).querySelector('div')

        child.addEventListener('click', async function(){
            console.log("p2p",element.id)
            chatSocket = connect("p2p",element.id)
            selectedChatName = child.querySelector('.chat-card-name').innerHTML
            if (currentChatName != selectedChatName){
                currentChatName = selectedChatName
                const chatDataResponse = await fetch(
                    `http://127.0.0.1:8000/rest/chat_p2p/${element.id}/`,
                    {
                        method: "GET",
                        mode: 'cors',
                        headers: {
                            Accept: "application/json",
                            'Content-Type': 'application/json',
                        },
                        credentials: "same-origin",
                    }
                )
                let chatData = await chatDataResponse.json()
                let icon = chat_info.querySelector('.chat-icon')
                let name = chat_info.querySelector('.chat-name')
                let image = document.createElement('img')
                image.src = chatData.group_icon
                image.className = 'chat-icon-img'
                icon=clearElement(icon)
                icon.append(image)
                name.innerHTML = chatData.group_name
                let history = chat_content.querySelector('.chat-history')
                history = clearElement(history)
                element.message_history.messages.forEach(message =>{
                    let elem = createMessageDisplay(message)
                    console.log(elem)
                    history.append(elem)
                })
            }
        })

        chat_list.append(child)
    });

    const responseGroup = await fetch(
        'http://127.0.0.1:8000/rest/chat_group/',
        {
            method: "GET",
            mode: 'cors',
            headers: {
                Accept: "application/json",
                'Content-Type': 'application/json',
            },
            credentials: "same-origin",
        }
    )
    data = await responseGroup.json()
    data.forEach(element => {
        console.log(element)
        const chat_card = document.createElement('template')
        html = `<div class="chat-card">
            <div class="chat-card-icon">
                <img src="${element.group_icon}" alt="">
            </div>
            <div class="chat-card-info">
                <div class="chat-card-name-date">
                    <span class="chat-card-name">${element.group_name}</span>
                    <span class="lastmgs">${getLastMessage(element) ? getLastMessage(element).timestamp.slice(11,16): ''}</span>
                </div>
                <div class="chat-lastmsg-unread">
                    ${getLastMessage(element) ? getLastMessage(element).text: ''}
                </div>
            </div>
        </div>`
        html = html.trim();
        chat_card.innerHTML = html
        let child = chat_card.content.cloneNode(true).querySelector('div')


        child.addEventListener('click', async function(){
            console.log("group",element.id)
            chatSocket = connect("group",element.id)
            selectedChatName = child.querySelector('.chat-card-name').innerHTML
            if (currentChatName != selectedChatName){
                currentChatName = selectedChatName
                const chatDataResponse = await fetch(
                    `http://127.0.0.1:8000/rest/chat_group/${element.id}/`,
                    {
                        method: "GET",
                        mode: 'cors',
                        headers: {
                            Accept: "application/json",
                            'Content-Type': 'application/json',
                        },
                        credentials: "same-origin",
                    }
                )
                let chatData = await chatDataResponse.json()
                let icon = chat_info.querySelector('.chat-icon')
                let name = chat_info.querySelector('.chat-name')
                let image = document.createElement('img')
                image.src = chatData.group_icon
                image.className = 'chat-icon-img'
                icon=clearElement(icon)
                icon.append(image)
                name.innerHTML = chatData.group_name

                let history = chat_content.querySelector('.chat-history')
                history = clearElement(history)

                element.message_history.messages.forEach(message =>{
                    let elem = createMessageDisplay(message)
                    console.log(elem)
                    history.append(elem)
                })
            }
        })
        chat_list.append(child)
    });
}


function clearElement(element) {
    element.innerHTML = ""
    return element
}


function getLastMessage(chat) {
    let last_message = chat.message_history.messages.slice(-1)[0]
    return last_message
}


function createMessageDisplay(message) {
    let messageDisplay = document.createElement('template')
    html = `
        <div class="message-display">
            <div class="message-icon">
                <img src="" class="">
            </div>
            <div class="message-side-left">
                <div class="message-name">
                    <p>${message.author}</p>
                </div>
                <div class="message-content">
                    <div class="message-text">
                        <p>${message.text ? message.text : ''}</p>
                    </div>
                    <div class="message-media">
                        <p>${message.image ? message.image : ''}</p>
                    </div>
                    <div class="message-file">
                        <p>${message.file ? message.file : ''}</p>
                    </div>
                </div>
            </div>
        </div>`
    html = html.trim();
    messageDisplay.innerHTML = html
    return messageDisplay.content.cloneNode(true).querySelector('div')
}

login()
getChatList()


chatMessageInput.onkeyup = function(e) {
    if (e.keyCode === 13) {  // enter key
        chatMessageSend.click();
    }
};


chatMessageSend.onclick = function() {
    if (chatMessageInput.value.length === 0) return;
    chatSocket.send(JSON.stringify({
        "type":"message",
        "message": chatMessageInput.value,
        "author": user
    }));
    chatMessageInput.value = "";
};

function connect(roomType,roomID) {
    console.log("ws://" + window.location.host + "/ws/chat/"+ roomType + "/" + roomID + "/")
    let chatSocket = new WebSocket("ws://" + window.location.host + "/ws/chat/"+ roomType + "/" + roomID + "/");

    chatSocket.onopen = function(e) {
        console.log("Successfully connected to the WebSocket.");
    }

    chatSocket.onclose = function(e) {
        console.log("WebSocket connection closed unexpectedly. Trying to reconnect in 2s...");
        setTimeout(function() {
            console.log("Reconnecting...");
            connect(roomType,roomID);
        }, 2000);
    };

    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        let history = chat_content.querySelector('.chat-history')
        switch (data['type']) {
            case "chat_message":
                history.append(createMessageDisplay(data))
                history.scrollHeight
                break;
            default:
                console.error("Unknown message type!");
                break;
        }

        // scroll 'chatLog' to the bottom
        chatLog.scrollTop = chatLog.scrollHeight;
    };

    chatSocket.onerror = function(err) {
        console.log("WebSocket encountered an error: " + err.message);
        console.log("Closing the socket.");
        chatSocket.close();
    }
    return chatSocket
}


function login() {
    console.log(1)
    try{
        user = window.localStorage.getItem('email')
        console.log(user)
        if (user == null){
            throw user
        }
    }catch(error){
        console.log(error)
        email = prompt("Введите совой Email:")
        window.localStorage.setItem('email',email)
        user = email
    }
}
