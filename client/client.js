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
  'inputs' : [],
  'commands' : [],
};

function resetMessage(message) {
    message.inputs.length = 0;
    message.commands.length = 0;
  }

function messageFromFrame(frame) {

  resetMessage(message);

  _.forEach(frame.hands, function(hand) {
    message.inputs.push({ x: hand.palmX, y: hand.palmY, z: hand.palmZ });
  });

  _.forEach(frame.gestures, function(gesture) {

    if (gesture.type === 'keyTap') {
       message.commands.push('power');
    }
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

      var message = messageFromFrame(frame);

      if (message.commands.length || message.inputs.length) {
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
