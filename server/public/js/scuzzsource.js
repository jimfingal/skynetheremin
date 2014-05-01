define(['js/audionodes.js'], function(audionodes) {


  var ScuzzSource = function(context, frequency) {

    var volume = context.createGainNode();
    var output = context.createGainNode();

    var scuzz_oscillator = new audionodes.ScuzzOscillator(context, frequency);
    var envelope = new audionodes.Envelope(context, 1.5, 0.5, 0.5, 1);
    var delay = new audionodes.Delay(context);

    scuzz_oscillator.connect(envelope.input);
    envelope.connect(delay.input);
    delay.connect(volume);
    volume.connect(output);

    this.connect = function(target) {
      output.connect(target);
    };

    this.volumeNode = function() {
      return volume;
    };

    this.rampUp = function() {
      envelope.rampUp();
    };

    this.rampDown = function() {
      envelope.rampDown();
    };

  };


  return ScuzzSource;
});
