
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , io = require('socket.io');

var getSocket = function (app) {
  var server = http.createServer(app);
  var serverio = io.listen(server).set('log level', 2);
  server.listen(app.get('port'));
  return serverio;
}

// Apps that will listen to calls

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/', function(req, res){
  res.render('index', { title: 'Demo' });
});

app.get('/synth', function(req, res){
  res.render('synth', { title: 'Synth' });
});

var broadcastapp = express();

broadcastapp.configure(function(){
  broadcastapp.set('port', process.env.PORT || 4000);
  broadcastapp.use(broadcastapp.router);
});


// Sockets

var serverio = getSocket(app);

serverio.sockets.on('connection', function (socket) {
    socket.on('send', function (data) {
        serverio.sockets.emit('message', data);
    });
});

var adminio = getSocket(broadcastapp);

adminio.sockets.on('connection', function (socket) {
    socket.on('send', function (data) {
        serverio.sockets.emit('send', data);
    });
});



