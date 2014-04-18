var Cylon = require('cylon');
var io = require('socket.io-client');
var socket = io.connect("http://localhost:4000/");

Cylon.robot({
  connection: {
    name: 'leapmotion',
    adaptor: 'leapmotion',
    port: '127.0.0.1:6437'
  },

  device: {
    name: 'leapmotion',
    driver: 'leapmotion'
  },

  work: function(my) {
    my.leapmotion.on('connect', function() {
      Logger.info("Connected");
    });

    my.leapmotion.on('start', function() {
      Logger.info("Started");
    });

    my.leapmotion.on('hand', function(hand) {
      Logger.info(hand.toString());
      socket.emit('send', { x: hand.palmX, y: hand.palmY, z: hand.palmZ });
    });

    /*
    
    my.leapmotion.on('gesture', function(gesture) {
      Logger.info(gesture.toString());
    });

    my.leapmotion.on('frame', function(frame) {
      Logger.info(frame.toString());
    });
    my.leapmotion.on('pointable', function(pointable) {
      Logger.info(pointable.toString());
    });

    */
  }
}).start();
