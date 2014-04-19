define(['underscore', 'js/synth.js', 'js/soundhelper.js', 'js/leapconfig.js'], 

function(_, SkynetSynth, SoundHelper, leapconfig) {

  var socket;
  var config;
  var synth;

  // Constructor
  var Skynetheramin = function(s) {
  
    socket = s;
    config = leapconfig;
    synth = new SkynetSynth();

    Skynetheramin.setupMessageListeners();

  };
    
  // Event Listeners
  Skynetheramin.setupMessageListeners = function() {
  
    socket.on('send', function (message) {
    
      if (message.commands && message.commands.length) {
        if (_.indexOf(message.commands, 'power') > -1) {
          synth.toggleSound();
        }
      }
      if (message.inputs.length > 0 && synth.isPlaying()) {
        Skynetheramin.updateSound(message.inputs[0]);
      }
    });

  };

  // Calculate the note frequency.
  Skynetheramin.calculateFrequency = function(value, range) {

    var fraction = value / range.max;
    var note = Math.round(fraction * config.vertical_bands);
    var scaled = SoundHelper.transposeNoteToPentatonicScale(note);
    var freq = SoundHelper.frequencyFromNote(scaled);

    return freq;
  };
  
  Skynetheramin.setFrequency = function(value, range) {
    var frequencyValue = Skynetheramin.calculateFrequency(value, range);
    synth.setFrequency(frequencyValue);
  };
 
  // Calculate the volume.
  Skynetheramin.calculateVolume = function(value, range) {
    var volumeLevel = 1 - (((100 / range.spread()) * (value - range.min)) / 100);
    return volumeLevel;
  };

  Skynetheramin.setVolume = function(value, range) {
    var volumeValue = Skynetheramin.calculateVolume(value, range);  
    synth.setVolume(volumeValue);
  };
  
  // Update the note frequency.
 Skynetheramin.updateSound = function(input) {
    Skynetheramin.setFrequency(input.y, config.range.y);
    Skynetheramin.setVolume(input.x, config.range.x);
  }
  
  // Export Skynetheramin.
  return Skynetheramin;

});
