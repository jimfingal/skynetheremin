requirejs.config({
    'baseUrl': 'bower_components',
    'paths': {
      'js' : '../js',
      'lib' : '../lib',
      'jquery': 'http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min',
      'jquery-ui': 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min',
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
