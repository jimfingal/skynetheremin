define(['js/easing.js', 'lib/animationshim.js'], function(easing) {

  var easing_functions = easing;
  var analyzer_node;

  var WIDTH = 1200, HEIGHT = 500;
  var canvas, canvas_2d;
  var freqDomain;
  var bin_count, bin_halved;

 var drawSpectrum = function() {

      canvas_2d.clearRect(0, 0, WIDTH, HEIGHT);

      freqDomain = new Uint8Array(bin_count);
      analyzer_node.getByteFrequencyData(freqDomain);

      for (var i = 0; i < bin_halved; i++) {
        var value = freqDomain[i];
        var percent = value / 256;

        var height = (HEIGHT - 5) * percent;
        var offset = HEIGHT - height;
        var barWidth = WIDTH / bin_halved;

        var alpha = 3 * percent / 4;

        var alpha = easing_functions.easeInQuint(percent, 0, 1, 1);

        canvas_2d.fillStyle = 'rgba(204,147,147,' + alpha + ')';
        canvas_2d.fillRect(i * barWidth, offset, barWidth, height);
      }

  };

  var animateSpectrum = function reAnimate() {
      window.requestAnimationFrame(reAnimate);
      drawSpectrum();
  };

  // Constructor
  var SkynetVisualizer = function(analyzer) {

    analyzer_node = analyzer;
    bin_count = analyzer_node.frequencyBinCount;
    bin_halved = bin_count / 2;

    canvas = document.querySelector('canvas');
    canvas_2d = canvas.getContext('2d');

    animateSpectrum();

  };

  return SkynetVisualizer;

});
