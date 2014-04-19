define(function() {

    var range = {
      y: {
        min: 0,
        max: 500,
        spread: function() {
          return this.max - this.min;
        }
      },
      x: {
        min: -200,
        max: 200,
        spread: function() {
          return this.max - this.min;
        }
      }
    };

    var vdiv = 10;


    var leap_config = {};
    leap_config.range = range;
    leap_config.vertical_bands = vdiv;

    return leap_config;

});
