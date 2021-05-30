const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;

socket.on('message', (message) => {
  console.log(message, 'message');

  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: message.createdAt
  });

  $messages.insertAdjacentHTML('beforeend', html);
});

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();


  const message = e.target.elements.message.value;

  if (message === '') return;

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

