requirejs(['socket.io',
          'js/theremin.js',
          'js/visualizer.js',
          'js/leapinterface',
          'lib/pace.min',
          'bootstrap'],
  function(io,
           Skynetheremin,
           SkynetVisualizer,
           LeapInterface,
           pace) {

    pace.start();
    var loc = window.location;
    var url = location.protocol + '//' + location.hostname + ':' + location.port;
    var socket = io.connect(url);
    var leap_interface = new LeapInterface(socket);
    var skynet = new Skynetheremin(leap_interface);
    var visualizer = new SkynetVisualizer(skynet.getAnalyzer());
});
