define(['Tuna', 'js/soundhelper.js'], function(Tuna, SoundHelper) {

    var SkynetSynth = function() {
         // Create an audio context.

        var myAudioContext = new webkitAudioContext();

        this.playing = false;
        this.gainNode = myAudioContext.createGainNode();
        this.oscillator = myAudioContext.createOscillator();
        this.oscillator.type = 'sine';


        var tuna = new Tuna(myAudioContext);

        var cabinet = new tuna.Cabinet({
            makeupGain: 1,                                 //0 to 20
            impulsePath: '/sound/impulse_guitar.wav',    //path to your speaker impulse
            bypass: 0
        });


        var delay = new tuna.Delay({
            feedback: 0.45,    //0 to 1+
            delayTime: 150,    //how many milliseconds should the wet signal be delayed? 
            wetLevel: 0.25,    //0 to 1+
            dryLevel: 1,       //0 to 1+
            cutoff: 20,        //cutoff frequency of the built in highpass-filter. 20 to 22050
            bypass: 0
        });

        var wahwah = new tuna.WahWah({
             automode: true,                //true/false
             baseFrequency: 0.5,            //0 to 1
             excursionOctaves: 2,           //1 to 6
             sweep: 0.2,                    //0 to 1
             resonance: 10,                 //1 to 100
             sensitivity: 0.5,              //-1 to 1
             bypass: 0
         });

        var compressor = new tuna.Compressor({
             threshold: 0.5,    //-100 to 0
             makeupGain: 1,     //0 and up
             attack: 1,         //0 to 1000
             release: 0,        //0 to 3000
             ratio: 4,          //1 to 20
             knee: 5,           //0 to 40
             automakeup: true,  //true/false
             bypass: 0
         });

        var chorus = new tuna.Chorus({
             rate: 6,
             feedback: 0.5,
             delay: 0.01,
             bypass: 0
        });


        cabinet.connect(myAudioContext.destination);
        delay.connect(cabinet.input);
        compressor.connect(delay.input);  
        //wahwah.connect(compressor.input);
        //chorus.connect(wahwah.input);  
        chorus.connect(compressor.input);  
        
        this.gainNode.connect(chorus.input);
        this.oscillator.connect(this.gainNode);
        //oscillator2.connect(gainNode);

        this.gainNode.gain.value = 0;
        this.oscillator.start(0);

    };

    SkynetSynth.prototype.setFrequency = function(value) {
       this.oscillator.frequency.value = value;
    };

    SkynetSynth.prototype.setVolume = function(value) {
       this.gainNode.gain.value = value;
    };

    SkynetSynth.prototype.isPlaying = function() {
        return this.playing;
    };

    SkynetSynth.prototype.playSound = function() {
        this.playing = true;
    };

    SkynetSynth.prototype.stopSound = function() {
        this.playing = false;
        this.fade(this.gainNode, -0.3, 0, 0.1, true);
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
