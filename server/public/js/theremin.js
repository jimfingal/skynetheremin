define(['underscore', 'js/synth.js', 'js/userinput.js'],

function(_, SkynetSynth, UserInput, $) {

  var leap_interface;
  var vertical_bands = 10;

  var synth;
  var user_input;
  var canvas;

  // Constructor
  var Skynetheremin = function(li) {

    synth = SkynetSynth;
    user_input = UserInput;

    leap_interface = li;

    leap_interface.setCommandCallback('power', synth.togglePower);
    leap_interface.addMessageCallback(Skynetheremin.updateSound);

    user_input.setMouseCallback(function(x, y) {
      if (!synth.isOn()) {
        synth.togglePower();
      }
      Skynetheremin.updateSound([{'x': x / 200, 'y': y / 500}]);
    });

  };

  var getInputProperties = function(inputs, property) {
    var values = [];
    _.forEach(inputs, function(input) {
      values.push(input[property]);
    });
    return values;
  };

  var getNote = function(input_percent) {
    var note = Math.round(input_percent * vertical_bands);
    note = note + user_input.jitterAmount();
    return note;
  };

  var setNotes = function(values) {
    var notes = _.map(values, getNote);
    synth.handleInputs(notes);
  };

  var setVolume = function(values) {
    var min = Math.min(_.map(values, Math.abs));
    var volumeValue = 1 - min;
    synth.setVolume(volumeValue);
  };

 Skynetheremin.updateSound = function(inputs) {

    if (synth.isOn()) {
      var y_inputs = getInputProperties(inputs, 'y');
      var x_inputs = getInputProperties(inputs, 'x');

      setNotes(y_inputs);
      setVolume(x_inputs);
    }
  };

  Skynetheremin.prototype.getAnalyzer = function() {
    return synth.getAnalyzer();
  };

  return Skynetheremin;

});
