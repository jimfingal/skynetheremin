define(['underscore',
       'js/mixer.js',
       'js/synth.js',
       'js/userinput.js'],
function(_, mixer, SkynetSynth, UserInput, $) {

  var leap_interface;
  var vertical_bands = 10;

  var skynet_synth;
  var user_synth;

  var SKYNET = 'SKYNET', USER = 'USER';

  var user_input;
  var canvas;

  // Constructor
  var Skynetheremin = function(li) {

    skynet_synth = new SkynetSynth();
    user_synth = new SkynetSynth();

    mixer.addChannel(skynet_synth, SKYNET);
    mixer.addChannel(user_synth, USER);

    user_input = UserInput;

    leap_interface = li;

    leap_interface.setCommandCallback('power', skynet_synth.togglePower);
    leap_interface.addMessageCallback(Skynetheremin.updateSound);

    var mouseSound = function(x, y) {
      // Opposite of LEAP: pitch up as X goes up; volume up as Y goes up
      Skynetheremin.updateSound([{'x': y / window.innerHeight, 'y': x / window.innerWidth}], USER);
    };

    // Comment out to disable debug mouse;
    user_input.setMousedown(function(x, y) {
      if (!user_synth.isOn()) {
        user_synth.togglePower();
      }
      mouseSound(x, y);
    });

    user_input.setMousemove(function(x, y) {
      mouseSound(x, y);
    });

    user_input.setMouseup(function(x, y) {
      if (user_synth.isOn()) {
        user_synth.togglePower();
      }
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

  var setNotes = function(synth, values) {
    var notes = _.map(values, getNote);
    synth.handleInputs(notes);
  };

  var setVolume = function(synth, values) {
    var min = Math.min(_.map(values, Math.abs));
    var volumeValue = 1 - min;
    synth.setVolume(volumeValue);
  };

 Skynetheremin.updateSound = function(inputs, channel) {

    var which_synth = channel || SKYNET;
    var this_synth = mixer.getChannel(which_synth);

    if (this_synth.isOn()) {
      var y_inputs = getInputProperties(inputs, 'y');
      var x_inputs = getInputProperties(inputs, 'x');

      setNotes(this_synth, y_inputs);
      setVolume(this_synth, x_inputs);
    }
  };

  Skynetheremin.prototype.getAnalyzer = function() {
    return mixer.getAnalyzer();
  };

  return Skynetheremin;

});
