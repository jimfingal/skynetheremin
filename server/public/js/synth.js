var Skynetheramin = (function() {

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

  function frequencyFromNote(n) {
    return Math.pow(2, n / 12) * 440.0
  }

  function noteFromFrequency(f) {
    return Math.round(12 * Math.log(f / 440.0) * Math.LOG2E, 0)
  }


  var major_scale = [0, 1, 3, 5, 7, 8, 10, 12];

  function transposeNoteToMajorScale(n) {

      var octaves = Math.floor(n / 7);
      var leftover = n % 7;

      var note_in_scale = major_scale[leftover];

      return octaves * 12 + note_in_scale;

  }

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
        oscillator = myAudioContext.createOscillator();
        gainNode = myAudioContext.createGainNode();
      
        oscillator.type = 'sine';

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
                     rate: 1.5,
                     feedback: 0.2,
                     delay: 0.0045,
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


        gainNode.gain.value = 0;
        oscillator.start(0);

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

    var notespace = 15;
    var fraction = value / range.max;

    var note = Math.round(fraction * notespace);

    var scaled = transposeNoteToMajorScale(note);

    var freq = frequencyFromNote(scaled);
    
    return freq;
  };
  
  Skynetheramin.setFrequency = function(value, range) {
    var frequencyValue = Skynetheramin.calculateFrequency(value, range);
    oscillator.frequency.value = frequencyValue;
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

})();


// Initialize the page.
window.onload = function() {
  var loc = window.location;
  var url = location.protocol + "//" + location.hostname + ":" + location.port;
  var socket = io.connect(url);
  var skynet = new Skynetheramin(socket);
}
