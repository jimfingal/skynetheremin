define(['js/soundhelper.js', 'js/voice.js', 'js/scuzzsource.js'],
       function(SoundHelper, Voice, Scuzz) {

    var instance = null;

    var audioContext = new webkitAudioContext();

    var effectChain, globalVolume;
    var oscillator;
    var analyzer;

    var playing;
    var offset;

    var SkynetSynth = function() {

        if (instance !== null) {
            var error_msg = 'Cannot instantiate more than one SkynetSynth, ' +
                            'use SkynetSynth.getInstance()';
            throw new Error(error_msg);
        }

        playing = false;
        offset = SoundHelper.offset(); // What note we're tuned to

        oscillator = new Scuzz(audioContext);

        globalVolume = audioContext.createGainNode();
        globalVolume.gain.value = 0;

        analyzer = audioContext.createAnalyser();
        analyzer.smoothingTimeConstant = .85;

        oscillator.connect(globalVolume);
        globalVolume.connect(analyzer);
        analyzer.connect(audioContext.destination);


    };

    var setFrequency = function(value) {
       oscillator.setFrequency(value);
    };

    SkynetSynth.prototype.handleInput = function(input_note) {

        var scaled = SoundHelper.transposeNoteToPentatonicScale(input_note);
        scaled = scaled + offset;
        var freq = SoundHelper.frequencyFromNote(scaled);
        setFrequency(freq);
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

    SkynetSynth.prototype.getAnalyzer = function() {
        return analyzer;
    };

    SkynetSynth.getInstance = function() {
        if (instance === null) {
            instance = new SkynetSynth();
        }
        return instance;
    };

    return SkynetSynth.getInstance();

});
