'use strict'

target = process.argv[2]

if target is undefined
  console.log 'Must have a host. Ex: http://localhost:4000'
  process.kill();

Cylon = require 'cylon'
_ = require 'underscore'
keypress = require 'keypress'
io = require 'socket.io-client'
socket = io.connect target

class MessageHandler

  message = 'inputs': [], 'commands': []
  frame_keypresses = {}

  resetMessage = (message) ->
    message.inputs.length = 0;
    message.commands.length = 0;

  resetKeypresses = () ->
    _.forEach _.keys(frame_keypresses), (key) ->
      delete frame_keypresses[key]

  setupKeyboardInput = () ->
    keypress process.stdin
    process.stdin.setRawMode true
    process.stdin.resume()

    process.stdin.on 'keypress', (ch, key) ->
      Logger.debug 'got "keypress"', key
      if key && key.ctrl && key.name is 'c'
        process.kill()
      else
        frame_keypresses[key.name] = true

  constructor: () ->
    setupKeyboardInput()

  messageFromFrame: (frame) ->

    resetMessage message

    _.forEach frame.hands, (hand) ->
      message.inputs.push x: hand.palmX, y: hand.palmY, z: hand.palmZ

    if 'space' of frame_keypresses
      message.commands.push 'power'

    resetKeypresses()

    message


handler = new MessageHandler

process_frame = (my) ->

  my.leapmotion.on 'connect', () -> Logger.info 'Connected'

  my.leapmotion.on 'start', () -> Logger.info('Started')

  my.leapmotion.on 'frame', (frame) ->
    message = handler.messageFromFrame frame

    if message.commands.length or message.inputs.length
      Logger.debug message

    socket.emit 'send', message


robot_settings =
  connection:
    name: 'leapmotion',
    adaptor: 'leapmotion',
    port: '127.0.0.1:6437'
  device:
    name: 'leapmotion',
    driver: 'leapmotion'
  work: process_frame

Cylon.robot(robot_settings).start();
