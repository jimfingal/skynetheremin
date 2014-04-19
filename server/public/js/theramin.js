define(['underscore', 'Tuna', 'js/soundhelper.js'], 

function(_, Tuna, SoundHelper) {

  // Variables
  var frequencyLabel;
  var volumeLabel;

  var myAudioContext;

  var oscillator;
  var gainNode;

  var tuna;

  var socket;

  var playing;

  var range;

  // Constructor
  var Skynetheramin = function(s) {
    frequencyLabel = document.getElementById('frequency');
    volumeLabel = document.getElementById('volume');
  
    // Create an audio context.
    myAudioContext = new webkitAudioContext();

    tuna = new Tuna(myAudioContext);

    socket = s;

    Skynetheramin.setupMessageListeners();

    playing = false;

    range = {
      y: {
        min: 0,
        max: 400,
        spread: function() {
          return this.max - this.min;
        }
      },
      x: {
        min: -200,
        max: 200,
        spread: function() {
          return this.max - this.min;
        }
      }
    }

    var initializeOscillator = function() {
        gainNode = myAudioContext.createGainNode();
      
        oscillator = myAudioContext.createOscillator();
        oscillator.type = 'sine';

        oscillator2  = myAudioContext.createOscillator(); 
        oscillator2.type = 'sine';

        var cabinet = new tuna.Cabinet({
            makeupGain: 1,                                 //0 to 20
            impulsePath: "/sound/impulse_guitar.wav",    //path to your speaker impulse
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
        gainNode.connect(chorus.input);
        oscillator.connect(gainNode);
        //oscillator2.connect(gainNode);

        gainNode.gain.value = 0;
        oscillator.start(0);
        //oscillator2.start(0);
    };

    initializeOscillator();
  };
    
  // Event Listeners
  Skynetheramin.setupMessageListeners = function() {
  
    socket.on('send', function (message) {
    
      if (message.gestures && message.gestures.length) {
        if (_.indexOf(message.gestures, 'keyTap') > -1) {
          Skynetheramin.toggleSound(message);
        }
      }
      if (message.hands.length > 0 && playing) {
        Skynetheramin.updateSound(message);
      }
    });

  };

  
  Skynetheramin.fade = function rFade(node, value, limit, interval, stop_after) {

    node.gain.value += value;
    if (value < 0 && node.gain.value > limit) {
      setTimeout(function() { rFade(node, value, limit, interval, stop_after) }, interval);
    } else if (value > 0 && node.gain.value < limit) {
      setTimeout(function() { rFade(node, value, limit, interval, stop_after) }, interval);
    } else if (stop_after) {
      node.gain.value = 0;
    }
  };

  // Play a note.
  Skynetheramin.playSound = function(message) {
      playing = true;
  };

  // Stop the audio.
  Skynetheramin.stopSound = function(event) {
    playing = false;
    Skynetheramin.fade(gainNode, -0.3, 0, 0.1, true);
  };

  Skynetheramin.toggleSound = function(message) {
    if (playing) {
      this.stopSound(message);
    } else {
      this.playSound(message);
    }
  }

  // Calculate the note frequency.
  Skynetheramin.calculateFrequency = function(value, range) {

    var notespace = 10;
    var fraction = value / range.max;

    var note = Math.round(fraction * notespace);

    var scaled = SoundHelper.transposeNoteToPentatonicScale(note);

    var freq = SoundHelper.frequencyFromNote(scaled);

    return freq;
  };
  
  Skynetheramin.setFrequency = function(value, range) {
    var frequencyValue = Skynetheramin.calculateFrequency(value, range);
    oscillator.frequency.value = frequencyValue;

    // Perfect Fifth
    oscillator2.frequency.value = SoundHelper.fifthFromFrequency(frequencyValue);


    frequencyLabel.innerHTML = Math.floor(frequencyValue) + ' Hz';
  };
 
  // Calculate the volume.
  Skynetheramin.calculateVolume = function(value, range) {
    var volumeLevel = 1 - (((100 / range.spread()) * (value - range.min)) / 100);
    return volumeLevel;
  };

  Skynetheramin.setVolume = function(value, range) {
    var volumeValue = Skynetheramin.calculateVolume(value, range);  
    gainNode.gain.value = volumeValue;
    volumeLabel.innerHTML = Math.floor(volumeValue * 100) + '%';
  };
  
  // Update the note frequency.
 Skynetheramin.updateSound = function(message) {
    if (message.hands) {
      Skynetheramin.setFrequency(message.hands[0].y, range.y);
      Skynetheramin.setVolume(message.hands[0].x, range.x);
    }
  }
  
  // Export Skynetheramin.
  return Skynetheramin;

});
