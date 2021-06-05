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
const autoScroll = () => {
  const $newMessage = $messages.lastElementChild;

  // height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = $messages.offsetHeight;

  // Height of message container
  const containerHeight = $messages.scrollHeight;

  // how far have i scroller
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if(containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.on('message', (message) => {
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    username: message.username,
    createdAt: message.createdAt,
  });

  $messages.insertAdjacentHTML('beforeend', html);
  autoScroll();
});

socket.on('roomData', ({
  room,
  users,
}) => {
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

