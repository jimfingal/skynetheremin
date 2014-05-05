'use strict';

var target = process.argv[2];

if (target === undefined) {
  console.log('Must have a host. Ex: http://localhost:4000');
  process.kill();
}

var Cylon = require('cylon');
var _ = require('underscore');
var io = require('socket.io-client');
var socket = io.connect(target);
var keypress = require('keypress');

var MessageHandler = function() {

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

  var setupKeyboardInput = function() {
    keypress(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.resume();

    process.stdin.on('keypress', function(ch, key) {
      Logger.debug('got "keypress"', key);
      if (key && key.ctrl && key.name == 'c') {
        process.kill();
      } else {
        frame_keypresses[key.name] = true;
      }
    });

  };

  this.messageFromFrame = function(frame) {

    resetMessage(message);

    _.forEach(frame.hands, function(hand) {
      message.inputs.push({ x: hand.palmX, y: hand.palmY, z: hand.palmZ });
    });

    _.forEach(frame.gestures, function(gesture) {

      /*
      if (gesture.type === 'keyTap') {
         message.commands.push('power');
      }
      */

    });

    if ('space' in frame_keypresses) {
      message.commands.push('power');
    }

    resetKeypresses();

    return message;
  };

  setupKeyboardInput();

};

var handler = new MessageHandler();

var process_frame = function(my) {
  
  my.leapmotion.on('connect', function() {
    Logger.info('Connected');
  });

  my.leapmotion.on('start', function() {
    Logger.info('Started');
  });

  my.leapmotion.on('frame', function(frame) {

    var message = handler.messageFromFrame(frame);

    if (message.commands.length || message.inputs.length) {
      Logger.debug(message);
    }

    socket.emit('send', message);

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
