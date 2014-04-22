define(['jquery'], function($) {

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

    socket.on('send', function(message) {
      if (message.inputs.length > 0) {
        SkynetVisualizer.updateLabels(message.inputs[0]);
      }
    });

  };

  SkynetVisualizer.setFrequencyLabel = function(value) {
    frequencyLabel.innerHTML = value + 'y';
  };

  SkynetVisualizer.setVolumeLabel = function(value) {
    volumeLabel.innerHTML = value + 'x';
  };

  // Update the note frequency.
 SkynetVisualizer.updateLabels = function(input) {
    SkynetVisualizer.setFrequencyLabel(input.y);
    SkynetVisualizer.setVolumeLabel(input.x);
  };

  return SkynetVisualizer;

});
