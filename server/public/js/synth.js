var SynthPad = (function() {
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

  // Notes
  var lowNote = 261.63; // C4
  var highNote = 493.88; // B4


  // Constructor
  var SynthPad = function(s) {
    myCanvas = document.getElementById('synth-pad');
    frequencyLabel = document.getElementById('frequency');
    volumeLabel = document.getElementById('volume');
  
    // Create an audio context.
    myAudioContext = new webkitAudioContext();
    tuna = new Tuna(myAudioContext);

    socket = s;

    SynthPad.setupEventListeners();

    playing = false;

    range = {
      minY: 0,
      maxY: 400,
      minX: -200,
      maxX: 200,
      xRange: function() {
        return this.maxX - this.minX;
      },
      yRange: function() {
        return this.maxY - this.minY;
      }
    }
  };
  
  
  // Event Listeners
  SynthPad.setupEventListeners = function() {
  
    // Disables scrolling on touch devices.
    /*
    document.body.addEventListener('touchmove', function(event) {
      event.preventDefault();
    }, false);
  

    myCanvas.addEventListener('mousedown', SynthPad.playSound);
    myCanvas.addEventListener('touchstart', SynthPad.playSound);
  
    myCanvas.addEventListener('mouseup', SynthPad.stopSound);
    document.addEventListener('mouseleave', SynthPad.stopSound);
    myCanvas.addEventListener('touchend', SynthPad.stopSound);
    */

    socket.on('send', function (message) {
    
      if (message.gestures && message.gestures.length) {
        if (_.indexOf(message.gestures, 'keyTap') > -1) {
          SynthPad.toggleSound(message);
        }
      }

      if (message.hands.length > 0) {
        SynthPad.updateFrequency(message);
      }
    });

  };
  
  
  // Play a note.
  SynthPad.playSound = function(message) {
    oscillator = myAudioContext.createOscillator();
    gainNode = myAudioContext.createGainNode();
  
    oscillator.type = 'triangle';

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
  
    oscillator.start(0);
  
  };
  
  SynthPad.fade = function rFade(node, value, limit, interval, stop_after) {
    node.gain.value += value;
    if (value < 0 && node.gain.value > limit) {
      setTimeout(function() { rFade(node, value, limit, interval, stop_after) }, interval);
    } else if (value > 0 && node.gain.value < limit) {
      setTimeout(function() { rFade(node, value, limit, interval, stop_after) }, interval);
    } else if (stop_after) {
      oscillator.stop(0);
    }
  };
  
  // Stop the audio.
  SynthPad.stopSound = function(event) {
    SynthPad.fade(gainNode, -0.3, 0, 0.1, true);
  };

  SynthPad.toggleSound = function(message) {

    if (playing) {
      this.stopSound(message);
      playing = false;
    } else {
      this.playSound(message);
      playing = true;
    }
  }
   

  
  // Calculate the note frequency.
  SynthPad.calculateNote = function(posX) {
    var noteDifference = highNote - lowNote;
    var noteOffset = (noteDifference / range.xRange()) * (posX - range.minX);
    return lowNote + noteOffset;
  };
  
  
  // Calculate the volume.
  SynthPad.calculateVolume = function(posY) {
    var volumeLevel = 1 - (((100 / range.yRange()) * (posY - range.minY)) / 100);
    return volumeLevel;
  };
  
  
  // Fetch the new frequency and volume.
  SynthPad.calculateFrequency = function(x, y) {
    var noteValue = SynthPad.calculateNote(x);
    var volumeValue = SynthPad.calculateVolume(y);
  
    oscillator.frequency.value = noteValue;
    gainNode.gain.value = volumeValue;
  
    frequencyLabel.innerHTML = Math.floor(noteValue) + ' Hz';
    volumeLabel.innerHTML = Math.floor(volumeValue * 100) + '%';
  };
  
  
  // Update the note frequency.
 SynthPad.updateFrequency = function(message) {
    if (message.hands) {
      SynthPad.calculateFrequency(message.hands[0].y, message.hands[0].x);
    }
  }
  
  // Export SynthPad.
  return SynthPad;
})();


// Initialize the page.
window.onload = function() {
  var socket = io.connect(window.location.hostname);

  var synthPad = new SynthPad(socket);
}
