define(['js/easing.js', 'lib/animationshim.js'], function(easing) {

  var easing_functions = easing;
  var analyzer_node;

  var CANVAS_WIDTH = 1024, CANVAS_HEIGHT = 500;
  var canvas, canvas_2d;
  var bin_count, bin_halved, bar_width;

  var drawSpectrum = function() {

      canvas_2d.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      var frequency_domain = new Uint8Array(bin_count);
      analyzer_node.getByteFrequencyData(frequency_domain);

      for (var i = 0; i < bin_halved; i++) {

        var percent = frequency_domain[i] / 256;

        var alpha = easing_functions.easeInQuint(percent, 0, 1, 1);
        canvas_2d.fillStyle = 'rgba(204,147,147,' + alpha + ')';

        var bar_height = Math.round(CANVAS_HEIGHT * percent);
        var offset_y = Math.round(CANVAS_HEIGHT - bar_height);
        var offset_x = Math.round(i * bar_width);
        canvas_2d.fillRect(offset_x, offset_y, bar_width, bar_height);
      }

  };

  var animateSpectrum = function reAnimate() {
      window.requestAnimationFrame(reAnimate);
      drawSpectrum();
  };

  // Constructor
  var SkynetVisualizer = function(analyzer) {

    analyzer_node = analyzer;

    canvas = document.querySelector('canvas');
    canvas_2d = canvas.getContext('2d');

    // Copy since used frequently
    bin_count = analyzer_node.frequencyBinCount;
    bin_halved = bin_count / 2;
    bar_width = CANVAS_WIDTH / bin_halved;

    animateSpectrum();

  };

  return SkynetVisualizer;

});
