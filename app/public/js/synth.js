define(['js/context.js',
       'js/theory.js',
       'js/audionodes.js'],
        function(context, musictheory, audionodes) {


    var getFrequencyFromNote = function(note) {
        var scaled = musictheory.transposeNoteToPentatonicScale(note);
        var freq = musictheory.frequencyFromNote(scaled);
        return freq;
    };

    var SkynetSynth = function() {

        var on = false;
        var notes_last_frame = [];
        var node_cache = {};

        var effectChain = context.createGainNode();
        var volume = context.createGainNode();
        var output = context.createGainNode();
        var envelope = new audionodes.Envelope(context, 0.2, 0.9, 0.9, 0.1);

        effectChain.connect(volume);
        volume.connect(envelope.input);
        envelope.connect(output);

        var turnOn = function() {
            on = true;
            envelope.rampUp();
        };

        var turnOff = function() {
            on = false;
            envelope.rampDown();
        };

        var fadeNote = function(note) {
            var node = node_cache[note];
            node.rampDown();
        };

        var setUpNode = function(note) {
            var freq = getFrequencyFromNote(note);
            var oscillator_node = new audionodes.ScuzzSource(context, freq);
            oscillator_node.connect(effectChain);
            return oscillator_node;
        };

        this.connect = function(target) {
            output.connect(target);
        };

        var playNote = function(note) {

            if (!_.has(node_cache, note)) {
                var node = setUpNode(note);
                node_cache[note] = node;
            }

            node_cache[note].rampUp();

        };

        this.isOn = function() {
            return on;
        };

        this.handleInputs = function(notes) {

            var no_longer_playing = _.difference(notes_last_frame, notes);
            var new_notes = _.difference(notes, notes_last_frame);

            _.map(no_longer_playing, fadeNote);
            _.map(new_notes, playNote);

            notes_last_frame = _.clone(notes);

        };

        this.setVolume = function(value) {
           volume.gain.value = value;
        };

        this.togglePower = function() {
            if (on) {
              turnOff();
            } else {
              turnOn();
            }
        };

    };

    return SkynetSynth;

});
