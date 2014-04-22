define(['js/synth.js', 'jquery', 'jquery-ui'],

function(SkynetSynth, $) {

  var leap_interface;
  var synth;

  var vertical_bands = 10;

  function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //var jitter = getRandomInt(-3, 3);
  var jitter = 0;

  var setupJitterSlider = function() {

    $('#slider-range-max').slider({
      range: 'max',
      min: -5,
      max: 5,
      value: 0,
      slide: function(event, ui) {
        $('#amount').text(ui.value);
        jitter = ui.value;
      }
    });
    $('#amount').text($('#slider-range-max').slider('value'));

  };

  // Constructor
  var Skynetheremin = function(li) {

    leap_interface = li;

    synth = new SkynetSynth();

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
