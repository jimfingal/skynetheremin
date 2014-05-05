target = process.argv[2]

if not target
  console.log 'Must have a host. Ex: http://localhost:4000'
  process.kill();

Cylon = require 'cylon' 
_ = require 'underscore'
io = require 'socket.io-client'
socket = io.connect target


message =
  'inputs': []
  'commands': []


resetMessage = (message) ->
  message.inputs.length = 0
  message.commands.length = 0


messageFromFrame = (frame) ->

  resetMessage message

  _.forEach frame.hands, (hand) ->
    message.inputs.push(x: hand.palmX, y: hand.palmY, z: hand.palmZ);

  _.forEach frame.gestures, (gesture) ->

    if gesture.type is 'keyTap'
       message.commands.push 'power'
  
  message


leaprobot =
  connection:
    name: 'leapmotion',
    adaptor: 'leapmotion',
    port: '127.0.0.1:6437'

  device:
    name: 'leapmotion'
    driver: 'leapmotion'

  work: (my) ->
    my.leapmotion.on 'connect', () -> Logger.info 'Connected'

    my.leapmotion.on 'start', () -> Logger.info 'Started'

    my.leapmotion.on 'frame', (frame) ->
      message = messageFromFrame frame;

      if message.commands.length || message.inputs.length
        console.log message

      socket.emit 'send', message

Cylon.robot(leaprobot).start();
