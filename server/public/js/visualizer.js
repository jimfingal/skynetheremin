define(['js/easing.js', 'lib/animationshim.js'], function(easing) {

  var easing_functions = easing;
  var analyzer_node;

  var canvas_width, canvas_height;
  var canvas, canvas_2d;
  var bin_count, bar_width, num_bins_displayed;

  var drawSpectrum = function() {

      canvas_2d.clearRect(0, 0, canvas_width, canvas_height);
      var frequency_domain = new Uint8Array(bin_count);
      analyzer_node.getByteFrequencyData(frequency_domain);

      for (var i = 0; i < num_bins_displayed; i++) {

        var percent = frequency_domain[i] / 256;

        var alpha = easing_functions.easeInQuint(percent, 0, 1, 1);
        canvas_2d.fillStyle = 'rgba(204,147,147,' + alpha + ')';

        var bar_height = Math.round(canvas_height * percent);
        var offset_y = Math.round(canvas_height - bar_height);
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
    bin_count = analyzer_node.frequencyBinCount;
    num_bins_displayed = bin_count / 6;

    canvas = document.querySelector('canvas');
    canvas_2d = canvas.getContext('2d');

    var resizeCanvas = function() {
      canvas_width = window.innerWidth;
      canvas_height = window.innerHeight;
      canvas_2d.canvas.width = canvas_width;
      canvas_2d.canvas.height = canvas_height;
      bar_width = canvas_width / num_bins_displayed;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, false);

    animateSpectrum();

  };

  return SkynetVisualizer;

});
