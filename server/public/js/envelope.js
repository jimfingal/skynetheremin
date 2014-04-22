define(function() {

    /*
    Attack time is the time taken for initial run-up of level from nil to peak, beginning when the key is first pressed.
    Decay time is the time taken for the subsequent run down from the attack level to the designated sustain level.
    Sustain level is the level during the main sequence of the sound's duration, until the key is released.
    Release time is the time taken for the level to decay from the sustain level to zero after the key is released.
    */

    var Envelope = function(context, attack, decay, sustain, hold, release) {

      this.context = context;

      this.envelope = context.createGain();
      this.attack = attack || 0.7;
      this.decay = decay || 0.15;
      this.sustain = sustain || 0.5;
      this.hold = hold || 1.0;
      this.release = release || 0.2;

      this.envelope.gain.value = 0.0;

    };

    Envelope.prototype.connect = function(source, destination) {

      this.source = source;
      this.destination = destination;

      this.source.connect(this.envelope);
      this.envelope.connect(this.destination);

    };

    Envelope.prototype.disconnect = function() {
      this.source.disconnect(0);
      this.envelope.disconnect(0);
    };

    Envelope.prototype.apply = function() {

      var now = this.context.currentTime;
      var attack_end = now + this.attack;

      this.envelope.gain.setValueAtTime(0.0, now);
      this.envelope.gain.linearRampToValueAtTime(1.0, attack_end);
      this.envelope.gain.setTargetAtTime(this.sustain,
                                        attack_end,
                                        this.decay + 0.001);

    };

    Envelope.prototype.off = function() {

        var now = this.context.currentTime;
        var release = now + this.release;

        this.envelope.gain.cancelScheduledValues(now);
        // this is necessary because of the linear ramp
        this.envelope.gain.setValueAtTime(this.envelope.gain.value, now);
        this.envelope.gain.setTargetValueAtTime(0.0, now, this.release);

        this.source.stop(release);

    };

    return Envelope;

});
