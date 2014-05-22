'use strict';
var Cylon = require('cylon');
var _ = require('underscore');
var io = require('socket.io-client');
var keypress = require('keypress');
var bunyan = require('bunyan');


var argv = require('minimist')(process.argv.slice(2));
console.dir(argv);
var target = argv._[0] || 'http://skynetheremin.herokuapp.com/';
var loglevel = argv['debug'] ? 'debug' : 'info'; 


var socket = io.connect(target);
var log = bunyan.createLogger({
    name: 'skynetbroadcaster',
    stream: process.stdout,
    level: loglevel
  }
);


var sendMessage = function(message) {
  socket.emit('send', message);
}


var MessageHandler = function() {

  var power_on = false;

  var message = {
    'inputs' : [],
    'commands' : []
  };

  var frame_keypresses = {};

  var resetMessage = function(message) {
    message.inputs.length = 0;
    message.commands.length = 0;
  };

  var resetKeypresses = function() {
    _.forEach(_.keys(frame_keypresses), function(key) {
      delete frame_keypresses[key];
    });
  };

  var pushCommandFromCurrentPower = function() {

      if (power_on) {
        message.commands.push('poweron');
      } else {
        message.commands.push('poweroff');
      }

  };

  var exitProcess = function() {

    // Graceful closure -- turn off all clients
    if (power_on) {
      power_on = false;
      pushCommandFromCurrentPower();
      sendMessage(message);
    }

    process.kill();

  }

  var setupKeyboardInput = function() {
    keypress(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.resume();

    process.stdin.on('keypress', function(ch, key) {
      log.debug('got "keypress"', key);

      if (key && key.ctrl && key.name == 'c') {
        exitProcess();
      } else {
        frame_keypresses[key.name] = true;
      }
    });

  };



  var togglePower = function() {

      if (power_on) {
        power_on = false;
      } else {
        power_on = true;
      }
  };

  this.messageFromFrame = function(frame) {

    resetMessage(message);

    _.forEach(frame.hands, function(hand) {
      message.inputs.push({ x: hand.palmX, y: hand.palmY, z: hand.palmZ });
    });

    if ('space' in frame_keypresses) {
      togglePower();
    }

    pushCommandFromCurrentPower();

    resetKeypresses();

    return message;
  };

  setupKeyboardInput();

};

var handler = new MessageHandler();

var process_frame = function(my) {
  
  my.leapmotion.on('connect', function() {
    log.info('Connected');
  });

  my.leapmotion.on('start', function() {
    log.info('Started');
  });

  my.leapmotion.on('frame', function(frame) {

    var message = handler.messageFromFrame(frame);

    if (message.commands.length || message.inputs.length) {
      log.debug(message);
    }

    sendMessage(message);

  });

};

var robot_settings = {

  connection: {
    name: 'leapmotion',
    adaptor: 'leapmotion',
    port: '127.0.0.1:6437'
  },

  device: {
    name: 'leapmotion',
    driver: 'leapmotion'
  },

  work: process_frame
};


Cylon.robot(robot_settings).start();
