require.config({
    'baseUrl': '.',
    'paths': {
      'jquery': 'bower_components/jquery/dist/jquery.min',
      'jquery-ui': 'bower_components/jquery-ui/ui/jquery-ui',
      'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap.min',
      'underscore' : 'bower_components/underscore/underscore',
      'socket.io' : 'bower_components/socket.io-client/dist/socket.io.min',
      // Comment out this line to go back to loading
      // the non-optimized main.js source file.
      'main': 'main-built'
    },
    'shim': {
        'jquery': {
            exports: 'jQuery'
        },
        'jquery-ui': {
            deps: ['jquery']
        },
        'bootstrap': {
          deps: ['jquery']
        }
    },
});
require(["main"]);
