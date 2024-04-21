let chat_list = document.querySelector('.chat-list')
// let chat_card = document.createElement('template')
// chat_card.innerHTML = `<div class="chat-card">
// <div class="chat-icon">
//     <img src="${image.src}" alt="">
// </div>
// <div class="chat-info">
//     <div class="chat-name-date">
//         <span class="chat-name">${groupchat.name}</span>
//         <span class="lastmgs">${groupchat.last_msg.timestamp}</span>
//     </div>
//     <div class="chat-lastmsg-unread">
//         ${groupchat.last_msg.text}
//     </div>
// </div>
// </div>`
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
        console.log(element.user1,element.user2)
        const chat_card = document.createElement('template')
        html = `<div class="chat-card">
            <div class="chat-icon">
                <img src="" alt="">
            </div>
            <div class="chat-info">
                <div class="chat-name-date">
                    <span class="chat-name">Chat with ${element.user1} and ${element.user2}</span>
                    <span class="lastmgs"></span>
                </div>
                <div class="chat-lastmsg-unread">
                    
                </div>
            </div>
        </div>`
        html = html.trim();
        chat_card.innerHTML = html
        console.log(chat_card.content.cloneNode(true).querySelector('div'))
        chat_list.append(chat_card.content.cloneNode(true).querySelector('div'))
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
        console.log(element.group_name)
        const chat_card = document.createElement('template')
        html = `<div class="chat-card">
            <div class="chat-icon">
                <img src="" alt="">
            </div>
            <div class="chat-info">
                <div class="chat-name-date">
                    <span class="chat-name">${element.group_name}</span>
                    <span class="lastmgs"></span>
                </div>
                <div class="chat-lastmsg-unread">
                    
                </div>
            </div>
        </div>`
        html = html.trim();
        chat_card.innerHTML = html
        console.log(chat_card.content.cloneNode(true).querySelector('div'))
        chat_list.append(chat_card.content.cloneNode(true).querySelector('div'))
    });
}
getChatList()

function chatCardFromHTML(image_addres, chat_name, last_msg_tmstp, last_msg) {
    html = `
    <div class="chat-card">
        <div class="chat-icon">
            <img src="${image_addres}" alt="">
        </div>
        <div class="chat-info">
            <div class="chat-name-date">
                <span class="chat-name">${chat_name}</span>
                <span class="lastmgs">${last_msg_tmstp}</span>
            </div>
            <div class="chat-lastmsg-unread">
                ${last_msg}
            </div>
        </div>
    </div>
    `
    // Process the HTML string.
    html = html.trim();
    if (!html) return null;

    // Then set up a new template element.
    const template = document.createElement('template');
    template.innerHTML = html;
    const result = template.content.children;

    // Then return either an HTMLElement or HTMLCollection,
    // based on whether the input HTML had one or more roots.
    if (result.length === 1) return result[0];
    return result;
}

// console.log(chat_list_data,2)