define(['Tuna', 'js/envelope.js'], function(Tuna, Envelope) {


  var ScuzzSource = function(context, frequency, type) {

    // Private
      var oscillator, scuzzOscillator, finalOutput;
      var oscVolume, scuzzVolume, finalVolume;
      var filter, delay, feedback, compressor;
      var tuna;

      var envelope;
      var currentFreq;

      tuna = new Tuna(context);

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

      envelope = new Envelope(context, 1.5, 0.5, 0.5, 1);
      /*
      filter = context.createBiquadFilter();
      filter.type = 'lowpass';
      */

      /*

      delay = context.createDelayNode();
      delay.delayTime.value = 190;

      feedbackGain = context.createGainNode();
      feedbackGain.gain.value = 10;
      */
      delay = new tuna.Delay({
                feedback: 0.45,    //0 to 1+
                delayTime: 190,    //how many milliseconds should the wet signal be delayed? 
                wetLevel: 0.75,    //0 to 1+
                dryLevel: 0.9,       //0 to 1+
                cutoff: 20,        //cutoff frequency of the built in highpass-filter. 20 to 22050
                bypass: 0
            });


      scuzzOscillator.connect(scuzz);
      scuzz.connect(oscillator.detune);

      oscillator.connect(oscVolume);

      envelope.connect(oscVolume, delay.input);

      // oscVolume.connect(delay.input);

      /*
      filter.connect(compressor);
      filter.connect(delay);
      */

      delay.connect(compressor);

      compressor.connect(finalVolume);
      finalVolume.connect(finalOutput);

      scuzzOscillator.start(0);
      oscillator.start(0);


      var newObject = {};

      newObject.connect = function(destination) {
        finalOutput.connect(destination);
      };

      newObject.volumeNode = function() {
        return finalVolume;
      };


      newObject.setFrequency = function(freq) {

        if (freq != currentFreq) {
          oscillator.frequency.setValueAtTime(freq, 0);
          envelope.rampUp();
          currentFreq = freq;
        }
      };

      return newObject;
  };



  return ScuzzSource;
});
