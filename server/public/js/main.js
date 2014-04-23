requirejs.config({
    'baseUrl': 'bower_components',
    'paths': {
      'js' : '../js',
      'lib' : '../lib',
      'jquery': 'jquery/dist/jquery.min',
      'jquery-ui': 'jquery-ui/ui/jquery-ui',
      'Tuna' : '../lib/tuna',
      'underscore' : 'underscore/underscore'
    },
    'shim': {
        'jquery': {
            exports: 'jQuery'
        },
        'jquery-ui': {
            deps: ['jquery']
        }
    }
});

requirejs(['socket.io/socket.io.js', 'js/theremin.js', 'js/visualizer.js', 'js/leapinterface'],
            function(io, Skynetheremin, SkynetVisualizer, LeapInterface) {
  var loc = window.location;
  var url = location.protocol + '//' + location.hostname + ':' + location.port;
  var socket = io.connect(url);
  var leap_interface = new LeapInterface(socket);
  var skynet = new Skynetheremin(leap_interface);
  var visualizer = new SkynetVisualizer(skynet.getAnalyzer());
});
