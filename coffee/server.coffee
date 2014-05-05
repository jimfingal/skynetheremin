express = require 'express'
http = require 'http'
path = require 'path'
io = require 'socket.io'

app = express()

app.configure () ->
  app.set 'port', process.env.PORT || 3000;
  app.set 'views', __dirname + '/views'
  app.set 'view engine', 'jade'
  app.use express.favicon()
  app.use express.logger('dev')
  app.use express.bodyParser()
  app.use app.router
  app.use express.static(path.join(__dirname, 'public'))


app.get '/', (req, res) ->
  res.render 'index', title: 'Synth'

server = http.createServer app
serverio = io.listen(server).set('log level', 2)
server.listen app.get('port')
console.log 'listening on port ' + app.get('port')

serverio.sockets.on 'connection', (socket) ->
  socket.on 'send', (data) ->
      serverio.sockets.emit 'receive', data
