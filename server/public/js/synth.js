define(['js/theory.js',
       'js/audionodes.js',
       'lib/webaudioshim.js'],
        function(musictheory, audionodes) {

    var audioContext = (function(Context) {
        return new Context();
    })(window.webkitAudioContext || window.AudioContext);

    var effectChain, globalVolume;
    var oscillator;
    var analyzer;
    var envelope;

    var on;

    var notes_last_frame;
    var node_cache;

    var SkynetSynth = function() {

        on = false;
        notes_last_frame = [];
        node_cache = {};

        effectChain = audioContext.createGainNode();

        globalVolume = audioContext.createGainNode();
        globalVolume.gain.value = 0;

        envelope = new audionodes.Envelope(audioContext, 0.2, 0.9, 0.9, 0.1);

        analyzer = audioContext.createAnalyser();
        analyzer.smoothingTimeConstant = .85;

        effectChain.connect(globalVolume);
        globalVolume.connect(envelope.input);
        envelope.connect(analyzer);
        analyzer.connect(audioContext.destination);


    };

    var getFrequencyFromNote = function(note) {
        var scaled = musictheory.transposeNoteToPentatonicScale(note);
        var freq = musictheory.frequencyFromNote(scaled);
        return freq;
    };

    var fadeNote = function(note) {
        var node = node_cache[note];
        node.rampDown();
    };

    var setUpNode = function(note) {
        var freq = getFrequencyFromNote(note);
        var oscillator_node = new audionodes.ScuzzSource(audioContext, freq);
        oscillator_node.connect(effectChain);
        return oscillator_node;
    };

    var playNote = function(note) {

        if (!_.has(node_cache, note)) {
            var node = setUpNode(note);
            node_cache[note] = node;
        }

        node_cache[note].rampUp();

    };

    SkynetSynth.prototype.handleInputs = function(notes) {

        var no_longer_playing = _.difference(notes_last_frame, notes);
        var new_notes = _.difference(notes, notes_last_frame);

        _.map(no_longer_playing, fadeNote);
        _.map(new_notes, playNote);

        notes_last_frame = _.clone(notes);

    };

    SkynetSynth.prototype.setVolume = function(value) {
       globalVolume.gain.value = value;
    };

    SkynetSynth.prototype.isOn = function() {
        return on;
    };

    var turnOn = function() {
        on = true;
        envelope.rampUp();
    };

    var turnOff = function() {
        on = false;
        envelope.rampDown();
    };

    SkynetSynth.prototype.togglePower = function() {
        if (on) {
          turnOff();
        } else {
          turnOn();
        }
    };

    SkynetSynth.prototype.getAnalyzer = function() {
        return analyzer;
    };

    var instance = new SkynetSynth();

    return instance;

});
