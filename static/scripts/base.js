let chat_list = document.querySelector('.chat-list')
let chat_info = document.querySelector('.chat-info')
let chat_content = document.querySelector('.chat-content')
let currentChatName = null

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
        console.log(element.message_history.messages[0].text)
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
        const chat_card = document.createElement('template')
        html = `<div class="chat-card">
            <div class="chat-card-icon">
                <img src="${element.group_icon}" alt="">
            </div>
            <div class="chat-card-info">
                <div class="chat-card-name-date">
                    <span class="chat-card-name">${element.group_name}</span>
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


getChatList()

// function chatCardFromHTML(image_addres, chat_name, last_msg_tmstp, last_msg) {
//     html = `
//     <div class="chat-card">
//         <div class="chat-icon">
//             <img src="${image_addres}" alt="">
//         </div>
//         <div class="chat-info">
//             <div class="chat-name-date">
//                 <span class="chat-name">${chat_name}</span>
//                 <span class="lastmgs">${last_msg_tmstp}</span>
//             </div>
//             <div class="chat-lastmsg-unread">
//                 ${last_msg}
//             </div>
//         </div>
//     </div>
//     `
//     // Process the HTML string.
//     html = html.trim();
//     if (!html) return null;

//     // Then set up a new template element.
//     const template = document.createElement('template');
//     template.innerHTML = html;
//     const result = template.content.children;

//     // Then return either an HTMLElement or HTMLCollection,
//     // based on whether the input HTML had one or more roots.
//     if (result.length === 1) return result[0];
//     return result;
// }

// console.log(chat_list_data,2)