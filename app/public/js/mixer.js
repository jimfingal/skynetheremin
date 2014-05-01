define(['js/context.js'], function(context) {

    var input, volume, analyzer;
    var channels;

    var Mixer = function() {

        channels = {};

        input = context.createGainNode();
        volume = context.createGainNode();

        analyzer = context.createAnalyser();
        analyzer.smoothingTimeConstant = .85;

        input.connect(volume);
        volume.connect(analyzer);
        analyzer.connect(context.destination);

    };

    Mixer.prototype.addChannel = function(source, name) {
        source.connect(input);
        channels[name] = source;
    };

    Mixer.prototype.getChannel = function(name) {
        return channels[name];
    };

    Mixer.prototype.getAnalyzer = function() {
        return analyzer;
    };

    return new Mixer();

});
