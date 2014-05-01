define(['lib/webaudioshim.js'], function() {

    var context = (function(Context) {
        return new Context();
    })(window.webkitAudioContext || window.AudioContext);

    return context;

});
