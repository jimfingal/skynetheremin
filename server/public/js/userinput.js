define(['jquery', 'jquery-ui'], function($) {

  function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  var jitter = getRandomInt(-3, 3);
  //var jitter = 0;
  var mouseCallback;

  var setupJitterSlider = function() {

    // TODO: Knobs? http://anthonyterrien.com/knob/
    $('#jitter').slider({
      min: -50,
      max: 50,
      value: 0,
      orientation: 'horizontal',
      animate: true,

      slide: function(event, ui) {

        $('#amount').text(Math.round(ui.value / 10));
        jitter = Math.round(ui.value / 10);
      }
    });
    $('#amount').text(Math.round($('#jitter').slider('value') / 10));

  };

  var handleMouseInput = function(touch) {
    if (mouseCallback) {
      var x = touch.pageX - canvas.offsetLeft;
      var y = touch.pageY - canvas.offsetTop;
      mouseCallback(x, y);
    }
  };

  var setupMouseInput = function() {
    canvas = document.querySelector('#visualizer');
    canvas.addEventListener('mousedown', handleMouseInput);
  };

  var UserInput = function() {
    //setupJitterSlider();
    setupMouseInput();
  };

  UserInput.prototype.setMouseCallback = function(func) {
    return mouseCallback = func;
  };


  UserInput.prototype.jitterAmount = function() {
    return jitter;
  };

  var instance = new UserInput();

  return instance;

});
