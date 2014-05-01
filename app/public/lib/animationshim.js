define(function() {

  window.requestAnimationFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame;

  window.cancelAnimationFrame = window.cancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelRequestAnimationFrame || window.oCancelAnimationFrame ||
        window.msCancelRequestAnimationFrame || window.msCancelAnimationFrame;
});
