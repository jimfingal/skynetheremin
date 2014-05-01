define(function() {

    var ScuzzOscillator = function(context, base_frequency) {
      var output = context.createGainNode();
      var oscillator = context.createOscillator();
      var oscVolume = context.createGainNode();
      var scuzzOscillator = context.createOscillator();
      var scuzz = context.createGainNode();

      oscillator.type = 'sine';
      oscillator.frequency.value = base_frequency;
      oscVolume.gain.value = 0.5;

      scuzzOscillator.frequency.value = 400;
      scuzzOscillator.type = 'sine';
      scuzz.gain.value = 147;


      scuzzOscillator.connect(scuzz);
      scuzz.connect(oscillator.detune);
      oscillator.connect(oscVolume);
      oscVolume.connect(output);

      scuzzOscillator.start(0);
      oscillator.start(0);


      this.connect = function(target) {
         output.connect(target);
      };
    };


    var Envelope = function(context, attack, decay, sustain, release) {

      this.input = context.createGainNode();
      this.output = context.createGainNode();

      this.context = context;

      this.envelope = context.createGainNode();

      // Attack time is the time taken for initial run-up of level from nil
      // to peak beginning when the sound starts.
      this.attack = attack || 0.7;

      // Decay time is the time taken for the subsequent run down from the
      // attack level to the designated sustain level.
      this.decay = decay || 0.15;

      // Sustain level is the level during the main sequence of the
      // sound's duration
      this.sustain = sustain || 0.5;

      // Release time is the time taken for the level to decay from the sustain
      // level to zero after the sound stops.
      this.release = release || 0.2;


      this.envelope.gain.value = 0.0;

      this.input.connect(this.envelope);
      this.envelope.connect(this.output);

    };

    Envelope.prototype.connect = function(target) {
      this.output.connect(target);
    };

    Envelope.prototype.disconnect = function() {
      this.output.disconnect(0);
    };

    Envelope.prototype.rampUp = function() {

      var now = this.context.currentTime;
      var attack_end = now + this.attack;

      this.envelope.gain.cancelScheduledValues(now);
      this.envelope.gain.setValueAtTime(0.0, now);
      this.envelope.gain.linearRampToValueAtTime(1.0, attack_end);
      this.envelope.gain.setTargetAtTime(this.sustain,
                                        attack_end,
                                        this.decay + 0.001);

    };

    Envelope.prototype.rampDown = function() {

        var now = this.context.currentTime;
        var release = now + this.release;

        this.envelope.gain.cancelScheduledValues(now);
        // this is necessary because of the linear ramp
        this.envelope.gain.setValueAtTime(this.envelope.gain.value, now);
        this.envelope.gain.setTargetAtTime(0.0, now, this.release);

    };

  var Delay = function(audioContext) {
    //create the nodes we’ll use
    this.input = audioContext.createGainNode();
    var output = audioContext.createGainNode(),
        delay = audioContext.createDelayNode(),
        feedback = audioContext.createGainNode(),
        wetLevel = audioContext.createGainNode();

    //set some decent values
    delay.delayTime.value = 0.30; //150 ms delay
    feedback.gain.value = 0.05;
    wetLevel.gain.value = 0.55;
    //set up the routing
    this.input.connect(delay);
    this.input.connect(output);
    delay.connect(feedback);
    delay.connect(wetLevel);
    feedback.connect(delay);
    wetLevel.connect(output);

    this.connect = function(target) {
       output.connect(target);
    };
  };


  var ScuzzSource = function(context, frequency) {

    var volume = context.createGainNode();
    var output = context.createGainNode();

    var scuzz_oscillator = new ScuzzOscillator(context, frequency);
    var envelope = new Envelope(context, 1.5, 0.5, 0.5, 1);
    var delay = new Delay(context);

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



    var audionodes = {
      'Envelope': Envelope,
      'ScuzzSource': ScuzzSource
    };

    return audionodes;

});
