const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options
const {
        username,
        room,
      } = Qs.parse(location.search, { ignoreQueryPrefix: true });

socket.on('message', (message) => {
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    username: message.username,
    createdAt: message.createdAt,
  });

  $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('roomData', ({
  room,
  users,
}) => {
  console.log(users, 'users');
  document.querySelector('#sidebar').innerHTML = Mustache.render(sidebarTemplate, {
    room,
    users,
  });

});

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();


  const message = e.target.elements.message.value;

  if(message === '') return;

  $messageFormButton.setAttribute('disabled', 'disabled');

  socket.emit('sendMessage', message, (error) => {
    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus();

    if(error) {
      return console.log(error);
    }

    console.log('Message delivered');
  });

});

socket.emit('join', {
  username,
  room,
}, (error) => {

  if(error) {
    alert(error);
    location.href = '/';
  }
});

