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
    
      if (message.gestures && message.gestures.length) {
        if (_.indexOf(message.gestures, 'keyTap') > -1) {
          synth.toggleSound();
        }
      }
      if (message.hands.length > 0 && synth.isPlaying()) {
        Skynetheramin.updateSound(message);
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
 Skynetheramin.updateSound = function(message) {
    if (message.hands) {
      Skynetheramin.setFrequency(message.hands[0].y, config.range.y);
      Skynetheramin.setVolume(message.hands[0].x, config.range.x);
    }
  }
  
  // Export Skynetheramin.
  return Skynetheramin;

});
