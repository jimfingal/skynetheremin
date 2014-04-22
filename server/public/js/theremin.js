define(['js/synth.js', 'jquery', 'jquery-ui'],

function(SkynetSynth, $) {

  var leap_interface;
  var vertical_bands = 10;

  var synth;

  function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //var jitter = getRandomInt(-3, 3);
  var jitter = 0;

  var setupJitterSlider = function() {

    $('#jitter').slider({
      min: -50,
      max: 50,
      value: 0,
      orientation: 'horizontal',
      animate: true,

      slide: function(event, ui) {

        $('#amount').text(Math.round(ui.value / 10));
        jitter = Math.round(ui.value / 10);
      }
    });
    $('#amount').text(Math.round($('#jitter').slider('value') / 10));

  };

  // Constructor
  var Skynetheremin = function(li) {

    synth = SkynetSynth;

    leap_interface = li;

    leap_interface.setCommandCallback('power', synth.toggleSound);
    leap_interface.addMessageCallback(Skynetheremin.updateSound);

    setupJitterSlider();

  };

  Skynetheremin.setFrequency = function(input_percent) {
    var note = Math.round(input_percent * vertical_bands);
    note = note + jitter;
    synth.handleInput(note);
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

  Skynetheremin.prototype.getAnalyzer = function() {
    return synth.getAnalyzer();
  };

  // Export Skynetheremin.
  return Skynetheremin;

});
