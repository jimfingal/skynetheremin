define(function() {

  var oscillator, scuzzOscillator, finalOutput;
  var oscVolume, scuzzVolume, finalVolume;
  var filter, delay, feedback, compressor;

  var ScuzzSource = function(context, frequency, type) {


      finalVolume = context.createGainNode();
      finalOutput = context.createGainNode();

      oscillator = context.createOscillator();
      oscillator.type = 'sine';
      oscVolume = context.createGainNode();
      oscVolume.gain.value = 0.5;


      scuzzOscillator = context.createOscillator();
      scuzzOscillator.frequency.value = 400;
      scuzzOscillator.type = 'sine';
      scuzz = context.createGainNode();
      scuzz.gain.value = 147;

      compressor = context.createDynamicsCompressor();

      /*
      filter = context.createBiquadFilter();
      filter.type = 'lowpass';

      delay = context.createDelayNode();
      delay.delayTime.value = 190;

      feedbackGain = context.createGainNode();
      feedbackGain.gain.value = 10;
      */


      scuzzOscillator.connect(scuzz);
      scuzz.connect(oscillator.detune);

      oscillator.connect(oscVolume);
      oscVolume.connect(compressor);

      /*
      oscVolume.connect(filter);

      filter.connect(compressor);
      filter.connect(delay);

      feedbackGain.connect(delay);

      delay.connect(feedbackGain);
      delay.connect(compressor);
      */

      compressor.connect(finalVolume);
      finalVolume.connect(finalOutput);

      scuzzOscillator.start(0);
      oscillator.start(0);

  };

  ScuzzSource.prototype.connect = function(destination) {
    finalOutput.connect(destination);
  };

  ScuzzSource.prototype.volumeNode = function() {
    return finalVolume;
  };

  ScuzzSource.prototype.setFrequency = function(freq) {
    return oscillator.frequency.setValueAtTime(freq, 0);
  };

  return ScuzzSource;
});
