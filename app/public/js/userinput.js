define(['jquery', 'jquery-ui'], function($) {

  function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  var jitter = getRandomInt(-3, 3);
  //var jitter = 0;
  var mousedownCallback;
  var mouseupCallback;
  var mousemoveCallback;

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

  var handleCallback = function(callback, touch) {
    if (callback) {
      var x = touch.pageX - canvas.offsetLeft;
      var y = touch.pageY - canvas.offsetTop;
      callback(x, y);
    }
  };

  var handleMousedown = function(touch) {
    handleCallback(mousedownCallback, touch);
  };

  var handleMouseup = function(touch) {
    handleCallback(mouseupCallback, touch);
  };

  var handleMousemove = function(touch) {
    handleCallback(mousemoveCallback, touch);
  };

  var setupMouseInput = function() {
    canvas = document.querySelector('#visualizer');
    canvas.addEventListener('mousedown', handleMousedown);
    canvas.addEventListener('mouseup', handleMouseup);
    canvas.addEventListener('mousemove', handleMousemove);

  };

  var UserInput = function() {
    //setupJitterSlider();
    setupMouseInput();
  };

  UserInput.prototype.setMousedown = function(func) {
    return mousedownCallback = func;
  };

  UserInput.prototype.setMouseup = function(func) {
    return mouseupCallback = func;
  };

  UserInput.prototype.setMousemove = function(func) {
    return mousemoveCallback = func;
  };

  UserInput.prototype.jitterAmount = function() {
    return jitter;
  };

  var instance = new UserInput();

  return instance;

});
