const { io } = require('socket.io-client');

const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('newEvent', (data) => {
  console.log('Received newEvent:', data);
});

socket.on('spotsFillingUp', (data) => {
  console.log('Received spotsFillingUp:', data);
});
