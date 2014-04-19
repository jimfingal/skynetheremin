define(['js/leapconfig.js', 'jquery'], function(leapconfig, $) {

  // Variables
  var frequencyLabel;
  var volumeLabel;

  var socket;

  // Constructor
  var SkynetVisualizer = function(s) {

    socket = s;

    frequencyLabel = document.getElementById('frequency');
    volumeLabel = document.getElementById('volume');

    SkynetVisualizer.setupMessageListeners();

  };
    
  // Event Listeners
  SkynetVisualizer.setupMessageListeners = function() {
  
    socket.on('send', function (message) {
      if (message.hands.length > 0) {


        SkynetVisualizer.updateLabels(message);
      }
    });

  };
  
  SkynetVisualizer.setFrequencyLabel = function(value) {
    frequencyLabel.innerHTML = value + "y";
  };
 
  SkynetVisualizer.setVolumeLabel = function(value) {
    volumeLabel.innerHTML = value + 'x';
  };
  
  // Update the note frequency.
 SkynetVisualizer.updateLabels = function(message) {
    if (message.hands) {
      SkynetVisualizer.setFrequencyLabel(message.hands[0].y);
      SkynetVisualizer.setVolumeLabel(message.hands[0].x);
    }
  }
  
  return SkynetVisualizer;

});
