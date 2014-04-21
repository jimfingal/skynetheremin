define(['Tuna', 'js/soundhelper.js', 'js/voice.js'], 
       function(Tuna, SoundHelper, Voice) {

    var audioContext = new webkitAudioContext();    

    /*
    Attack time is the time taken for initial run-up of level from nil to peak, beginning when the key is first pressed.
    Decay time is the time taken for the subsequent run down from the attack level to the designated sustain level.
    Sustain level is the level during the main sequence of the sound's duration, until the key is released.
    Release time is the time taken for the level to decay from the sustain level to zero after the key is released.
    */



    var SkynetSynth = function() {
         // Create an audio context.

        this.playing = false;

        this.effectChain = audioContext.createGainNode();

        this.globalVolume = audioContext.createGainNode(); 
        this.globalVolume.gain.value = 0;

        this.oscillator = new Voice(audioContext);
        this.oscillator.connect(this.effectChain);

        this.effectChain.connect(this.globalVolume);
        this.globalVolume.connect(audioContext.destination);

        this.voices = new Array();

    };

    /*
    SynetSynth.prototype.playNote = function(value) {
        if (this.voices[note] == null) {
            voices[note] = new Voice(note, velocity);
        }

        function noteOn( note, velocity ) {
    if (voices[note] == null) {
        // Create a new synth node
        voices[note] = new Voice(note, velocity);
        var e = document.getElementById( "k" + note );
        if (e)
            e.classList.add("pressed");
    }
}
    }
    */

    SkynetSynth.prototype.setFrequency = function(value) {
       this.oscillator.setFrequency(value);
    };

    SkynetSynth.prototype.setVolume = function(value) {
       this.globalVolume.gain.value = value;
    };

    SkynetSynth.prototype.isPlaying = function() {
        return this.playing;
    };

    SkynetSynth.prototype.playSound = function() {
        this.playing = true;
    };

    SkynetSynth.prototype.stopSound = function() {
        this.playing = false;
        this.fade(this.globalVolume, -0.3, 0, 0.1, true);
    };

    SkynetSynth.prototype.fade = function rFade(node, value, limit, interval, stop_after) {

        node.gain.value += value;
        if (value < 0 && node.gain.value > limit) {

          setTimeout(function() {
            rFade(node, value, limit, interval, stop_after);
          }, interval);

        } else if (value > 0 && node.gain.value < limit) {

          setTimeout(function() {
            rFade(node, value, limit, interval, stop_after);
          }, interval);

        } else if (stop_after) {
          node.gain.value = 0;
        }
    };

    SkynetSynth.prototype.toggleSound = function() {
        if (this.playing) {
          this.stopSound();
        } else {
          this.playSound();
        }
    };

    return SkynetSynth;


});
