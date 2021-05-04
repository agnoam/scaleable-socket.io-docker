const io = require('socket.io-client')
const port = process.env.PORT || 5000;

const socket = io('http://localhost/'/* + port */, { transports: [ "websocket", "polling" ] });
let last;

function send () {
  last = Date.now();
  socket.emit('ping_from_client');
}

socket.on('connect', () => {
  console.log(`connect ${socket.id}`);
  send();
});

socket.on('disconnect', () => {
  console.log(`disconnect ${socket.id}`);
});

socket.on('new-message', (data) => {
  console.log(`${data.nickname}: ${data.message} @${data.server}`);
});