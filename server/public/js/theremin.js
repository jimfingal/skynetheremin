define(['underscore', 'js/synth.js', 'js/soundhelper.js', 'js/leapconfig.js'],

function(_, SkynetSynth, SoundHelper, leapconfig) {

  var socket;
  var config;
  var synth;

  // Constructor
  var Skynetheremin = function(s) {

    socket = s;
    config = leapconfig;
    synth = new SkynetSynth();

    Skynetheremin.setupMessageListeners();

  };

  // Event Listeners
  Skynetheremin.setupMessageListeners = function() {

    socket.on('send', function(message) {

      if (message.commands && message.commands.length) {
        if (_.indexOf(message.commands, 'power') > -1) {
          synth.toggleSound();
        }
      }
      if (message.inputs.length > 0 && synth.isPlaying()) {
        Skynetheremin.updateSound(message.inputs[0]);
      }
    });

  };

  // Calculate the note frequency.
  Skynetheremin.calculateFrequency = function(value, range) {

    var fraction = value / range.max;
    var note = Math.round(fraction * config.vertical_bands);
    var scaled = SoundHelper.transposeNoteToPentatonicScale(note);
    var freq = SoundHelper.frequencyFromNote(scaled);

    return freq;
  };

  Skynetheremin.setFrequency = function(value, range) {
    var frequencyValue = Skynetheremin.calculateFrequency(value, range);
    synth.setFrequency(frequencyValue);
  };

  // Calculate the volume.
  Skynetheremin.calculateVolume = function(value, range) {
    var volumeLevel = 1 - (((100 / range.spread()) * (value - range.min)) / 100);
    return volumeLevel;
  };

  Skynetheremin.setVolume = function(value, range) {
    var volumeValue = Skynetheremin.calculateVolume(value, range);
    synth.setVolume(volumeValue);
  };

  // Update the note frequency.
 Skynetheremin.updateSound = function(input) {
    Skynetheremin.setFrequency(input.y, config.range.y);
    Skynetheremin.setVolume(input.x, config.range.x);
  };

  // Export Skynetheremin.
  return Skynetheremin;

});
