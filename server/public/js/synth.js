define(['Tuna', 'js/soundhelper.js', 'js/voice.js'], 
       function(Tuna, SoundHelper, Voice) {

    var audioContext = new webkitAudioContext();

    var playing;

    var effectChain;

    var globalVolume;

    var oscillator;

    var voices;

    var SkynetSynth = function() {
         // Create an audio context.

        playing = false;

        effectChain = audioContext.createGainNode();

        globalVolume = audioContext.createGainNode(); 
        globalVolume.gain.value = 0;

        oscillator = new Voice(audioContext);
        oscillator.connect(effectChain);

        effectChain.connect(globalVolume);
        globalVolume.connect(audioContext.destination);

        voices = new Array();

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
       oscillator.setFrequency(value);
    };

    SkynetSynth.prototype.setVolume = function(value) {
       globalVolume.gain.value = value;
    };

    SkynetSynth.prototype.isPlaying = function() {
        return playing;
    };



    var fade = function rFade(node, value, limit, interval, stop_after) {

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

    var playSound = function() {
        playing = true;
    };

    var stopSound = function() {
        playing = false;
        fade(globalVolume, -0.3, 0, 0.1, true);
    };

    SkynetSynth.prototype.toggleSound = function() {
        if (playing) {
          stopSound();
        } else {
          playSound();
        }
    };

    return SkynetSynth;


});
