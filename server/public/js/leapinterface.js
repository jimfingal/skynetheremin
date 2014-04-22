define(function() {

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

    var LeapInterface = function(s) {
      this.socket = s;
      this.command_callbacks = {};
      this.message_callbacks = [];

      var that = this;

      this.socket.on('send', function(message) {
        that.processMessage(message);
      });

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

    LeapInterface.prototype.setCommandCallback = function(command, callback) {
      this.command_callbacks[command] = callback;
    };

    LeapInterface.prototype.addMessageCallback = function(callback) {
      this.message_callbacks.push(callback);
    };

    LeapInterface.prototype.processMessage = function(message) {

      var that = this;

      if (message.commands && message.commands.length) {

        _.each(message.commands, function(command) {

          if (_.has(that.command_callbacks, command)) {

            var callback = that.command_callbacks[command];
            callback();
          
          }

        });
      }

      if (message.inputs.length > 0) {

        _.each(message.inputs, function(input) {

          var percentages = getInputInPercentages(input);

          _.each(that.message_callbacks, function(callback) {
            callback(percentages);
          });

        });
      }
    };

    return LeapInterface;

});
