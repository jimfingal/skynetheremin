requirejs.config({
    "baseUrl": "bower_components",
    "paths": {
      "js" : "../js",
      "lib" : "../lib",
      "jquery": "http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min",
      "Tuna" : "../lib/tuna",
      "underscore" : "underscore/underscore"

    }
});

requirejs(['socket.io/socket.io.js', 'js/theramin.js', 'js/visualizer.js'], 
            function(io, Skynetheramin, SkynetVisualizer) {
  var loc = window.location;
  var url = location.protocol + "//" + location.hostname + ":" + location.port;
  var socket = io.connect(url);
  var skynet = new Skynetheramin(socket);
  var visualizer = new SkynetVisualizer(socket);
});
