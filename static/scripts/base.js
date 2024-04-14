let chat_list = document.querySelector('.chat-list')

async function getChatList() {
    const response = await fetch(
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
    data = await response.json()
    console.log(data)
    return data
}
let chat_list_data = getChatList()

function chatCarfFromHTML(image_addres, chat_name, last_msg_tmstp, last_msg) {
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

console.log(chat_list_data[0])