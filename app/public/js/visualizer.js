define(['js/easing.js', 'lib/animationshim.js'], function(easing) {

  var easing_functions = easing;
  var analyzer_node;

  var canvas_width, canvas_height;
  var canvas, canvas_2d;
  var bin_count, bar_width, num_bins_displayed;
  var colors;

  var initializeColors = function() {

      var c1 = 205, c2 = 147, c3 = 176;
      var colors = [];

      colors.push([c1, c2, c2]);
      colors.push([c1, c2, c3]);
      colors.push([c1, c2, c1]);
      colors.push([c3, c2, c1]);
      colors.push([c2, c2, c1]);
      colors.push([c2, c3, c1]);
      colors.push([c2, c1, c1]);
      colors.push([c2, c1, c3]);
      colors.push([c2, c1, c2]);
      colors.push([c3, c1, c2]);

      colors = colors.reverse();

      return colors;
  };

  var getFillStyle = function(percent) {

    var alpha = easing_functions.easeOutCubic(percent, 0, 1, 1);
    var index = Math.floor(easing_functions.easeInCubic(percent, 0, 1, 1) * 10);
    var color_set = colors[index];
    var r = color_set[0], g = color_set[1], b = color_set[2];

    var fill = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
    return fill;
  };

  var drawSpectrum = function() {

    canvas_2d.clearRect(0, 0, canvas_width, canvas_height);
    var frequency_domain = new Uint8Array(bin_count);
    analyzer_node.getByteFrequencyData(frequency_domain);

    for (var i = 0; i < num_bins_displayed; i++) {

      var percent = frequency_domain[i] / 256;
      canvas_2d.fillStyle = getFillStyle(percent);

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

    colors = initializeColors();

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
