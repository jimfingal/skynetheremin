define(['underscore'], function(_) {

    var range = {
      y: {
        min: 25,
        max: 500,
        spread: function() {
          return this.max - this.min;
        }
      },
      x: {
        min: 0,
        max: 200,
        spread: function() {
          return this.max - this.min;
        }
      }
    };

    var socket;
    var command_callbacks, message_callbacks;


    var LeapInterface = function(s) {
      socket = s;
      command_callbacks = {};
      message_callbacks = [];

      socket.on('send', function(message) {
        processMessage(message);
      });

    };

    LeapInterface.prototype.setCommandCallback = function(command, callback) {
      command_callbacks[command] = callback;
    };

    LeapInterface.prototype.addMessageCallback = function(callback) {
      message_callbacks.push(callback);
    };

    var processCommand = function(command) {
      if (_.has(that.command_callbacks, command)) {
        var callback = that.command_callbacks[command];
        callback();
      }
    };

    var getInputInPercentages = function(input) {

      var percentages = {};

      for (axis in range) {
        var val = input[axis];
        var percent = (val - range[axis].min) / range[axis].max;
        percentages[axis] = percent;
      }

      return percentages;

    };


    var processInputs = function(inputs) {
      if (inputs.length > 0) {
        _.each(message_callbacks, function(callback) {
          callback(inputs);
        });
      }
    };

    LeapInterface.prototype.processMessage = function(message) {

      _.each(message.commands, function(command) {
        processCommand(command);
      });

      var inputs = [];

      _.each(message.inputs, function(input) {
        var percentages = getInputInPercentages(input);
        inputs.push(percentages);
      });

      processInputs(inputs);

    };

    return LeapInterface;

});
