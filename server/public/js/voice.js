define(function() {

  var DEFAULT_FREQUENCY = 440.0;
  var DEFAULT_WAVE = 'sine';

  var Voice = function(context, frequency, type) {

      this.originalFrequency = frequency || DEFAULT_FREQUENCY;
      this.oscillator = context.createOscillator();
      this.oscillator.type = type || DEFAULT_WAVE;
      this.oscillator.frequency.setValueAtTime(this.originalFrequency, 0);
      this.oscillator.start(0);

  };

  Voice.prototype.stop = function(timeout) {
    this.oscillator.stop(release);
  };

  Voice.prototype.setFrequency = function(freq) {
    this.oscillator.frequency.setValueAtTime(freq, 0);
  };

  Voice.prototype.connect = function(destination) {
    this.oscillator.connect(destination);
  };

  Voice.prototype.disconnect = function() {
    this.oscillator.disconnect(0);
  };

  return Voice;

});
