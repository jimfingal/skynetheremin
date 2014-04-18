
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , io = require('socket.io');

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
  res.render('index', { title: 'Express' });
});

var appserver = http.createServer(app);
var serverio = io.listen(appserver);
appserver.listen(app.get('port'));

serverio.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'welcome to the chat' });
    socket.on('send', function (data) {
        serverio.sockets.emit('message', data);
    });
});

var broadcastapp = express();

broadcastapp.configure(function(){
  broadcastapp.set('port', process.env.PORT || 4000);
  broadcastapp.use(broadcastapp.router);
});

var adminserver = http.createServer(broadcastapp);
var adminio = io.listen(adminserver);
adminserver.listen(broadcastapp.get('port'));

adminio.sockets.on('connection', function (socket) {
    socket.on('send', function (data) {
        serverio.sockets.emit('message', data);
    });
});



