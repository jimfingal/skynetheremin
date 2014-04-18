var io = require('socket.io-client');
var socket = io.connect("http://localhost:4000/");
socket.emit('send', { message: "sent from command line" });
