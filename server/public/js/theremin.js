define(['underscore', 'js/synth.js', 'js/soundhelper.js'],

function(_, SkynetSynth, SoundHelper) {

  var leap_interface;
  var synth;

  var vertical_bands = 10;

  // Constructor
  var Skynetheremin = function(li) {

    leap_interface = li;
    synth = new SkynetSynth();

    leap_interface.setCommandCallback('power', synth.toggleSound);
    leap_interface.addMessageCallback(Skynetheremin.updateSound);

  };

  Skynetheremin.setFrequency = function(value) {
    var note = Math.round(value * vertical_bands);
    var scaled = SoundHelper.transposeNoteToPentatonicScale(note);
    var freq = SoundHelper.frequencyFromNote(scaled);
    synth.setFrequency(freq);
  };

  Skynetheremin.setVolume = function(value, range) {
    var volumeValue = 1 - Math.abs(value);
    synth.setVolume(volumeValue);
  };

  // Update the note frequency.
 Skynetheremin.updateSound = function(input) {
    if (synth.isPlaying()) {
      Skynetheremin.setFrequency(input.y);
      Skynetheremin.setVolume(input.x);
    }
  };

  // Export Skynetheremin.
  return Skynetheremin;

});
