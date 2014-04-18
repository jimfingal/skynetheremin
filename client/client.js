var target = process.argv[2];

if (target === undefined) {
  console.log("Must have a host. Ex: http://localhost:4000");
  process.kill();
}

var Cylon = require('cylon');
var _ = require('underscore');
var io = require('socket.io-client');
var socket = io.connect(target);

var message = {
  'hands' : [],
  'gestures' : [],
};

function resetMessage(message) {
    message.hands.length = 0;
    message.gestures.length = 0;
  }

function messageFromFrame(frame) {

  resetMessage(message);

  _.forEach(frame.hands, function(hand) {
    message.hands.push({ x: hand.palmX, y: hand.palmY, z: hand.palmZ });
  });

  _.forEach(frame.gestures, function(gesture) {
    message.gestures.push(gesture.type);
  });

  return message;
}

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

    my.leapmotion.on('frame', function(frame) {
      //Logger.info(frame.toString());

      var message = messageFromFrame(frame);
      if (message.gestures.length || message.hands.length) {
        console.log(message);
      }

      socket.emit('send', message);

    });


    /*

    my.leapmotion.on('hand', function(hand) {
      Logger.info(hand.toString());
      socket.emit('send', { x: hand.palmX, y: hand.palmY, z: hand.palmZ });

    });
    
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
