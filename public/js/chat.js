const socket = io();

// Elements

const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');

socket.on('message', (message) => {
  console.log(message, 'message');
});

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  $messageFormButton.setAttribute('disabled', 'disabled');

  const message = e.target.elements.message.value;

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

