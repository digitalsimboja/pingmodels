const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

//get username and chatroom from the url

const {username} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

//message from server
socket.on('message', message =>{
    
    outputMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Mesage submit
chatForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    //message from client
    const msg  = e.target.elements.msg.value;

    //Emit the message to server
   socket.emit('chatMessage', msg);

   //clear the input
   e.target.elements.value = '';
   e.target.elements.focus();

})

//output message to DOM
function outputMessage(message){
    const div = document.createElement('div');

    div.classList.add('message')
    div.innerHTML = `<p class = "meta"> ${message.username} <span>${message.time}<span>
    <p class ="text"> ${message.text}</p>`;
    document.querySelector('.chat-messages').appendChild(div)
}
