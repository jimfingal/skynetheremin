({
    'baseUrl': 'app/public',
    'paths': {
      'jquery': 'bower_components/jquery/dist/jquery.min',
      'jquery-ui': 'bower_components/jquery-ui/ui/jquery-ui',
      'bootstrap': 'bower_components/bootstrap/dist/js/bootstrap.min',
      'underscore' : 'bower_components/underscore/underscore',
      'socket.io' : 'bower_components/socket.io-client/dist/socket.io.min',
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
    name: "main",
    out: "app/public/main-built.js"
})
