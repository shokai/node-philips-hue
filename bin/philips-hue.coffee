#!/usr/bin/env coffee

fs   = require 'fs'
path = require 'path'

debug    = require('debug')('philips-hue:app')
optparse = require 'optparse'
option =
  info: {}
  state: {}
  light: null

Hue = require path.resolve __dirname, '../'
hue = new Hue

print_api_response = (err, res) ->
  return console.error err if err
  console.log res

parser = new optparse.OptionParser [
  ['-h', '--help', 'show help']
  ['--lights', 'show lights state']
  ['--light [NUMBER]', 'specify light by Number']
  ['--bri [NUMBER]', 'brightness (0~255)']
  ['--hue [NUMBER]', 'hue (0~65535)']
  ['--sat [NUMBER]', 'saturation (0~255)']
  ['--alert [STRING]', '"none" or "lselect"']
  ['--effect [STRING]', '"none" or "colorloop"']
  ['--name [STRING]', 'set light\'s name']
]

parser.on 'help', ->
  pkg = require "#{__dirname}/../package.json"
  parser.banner = """
  philips-hue v#{pkg.version} - #{pkg.homepage}

  Usage:
    % philips-hue --lights
    % philips-hue on
    % philips-hue off
    % philips-hue on --light 1
    % philips-hue --bri 120 --hue 30000 --sat 180
    % philips-hue --bri 120 --hue 30000 --sat 180 --light 2
    % philips-hue --effect colorloop
    % philips-hue --alert lselect
  """
  console.log parser.toString()
  return process.exit 0

parser.on 'lights', ->
  hue.lights (err, lights) ->
    return console.error err if err
    for i, data of lights
      console.log "[#{i}] #{data.name}\t#{JSON.stringify data.state}"

parser.on 'light', (opt, light) ->
  option.light = light

for i in ['bri', 'hue', 'sat', 'alert', 'effect']
  do (i) ->
    parser.on i, (opt, value) ->
      debug "#{i} <= #{value}"
      option.state[i] = value

for i in ['name']
  do (i) ->
    parser.on i, (opt, value) ->
      debug "#{i} <= #{value}"
      option.info[i] = value

read_config_or_create = (callback = ->) ->
  conf_file = "#{process.env.HOME}/.philips-hue.json"
  fs.exists conf_file, (exists) ->
    if exists
      conf = require conf_file
      return callback null, conf
    hue.getBridges (err, bridges) ->
      return callback err if err
      console.log "found bridges: #{JSON.stringify bridges}"
      bridge = bridges[0]
      unless /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test bridge
        return callback "invalid bridge address \"#{bridge}\""
      hue.auth bridge, (err, username) ->
        return callback err if err
        conf = {bridge: bridge, username: username}
        fs.writeFile conf_file, JSON.stringify(conf), (err) ->
          return callback err if err
          callback null, conf

read_config_or_create (err, conf) ->
  return console.error err if err
  hue.bridge   = conf.bridge
  hue.username = conf.username
  debug hue

  if process.argv.length < 3
    parser.on_switches.help.call()
  parser.parse process.argv

  switch process.argv[2]
    when 'on'
      option.state.on = true
    when 'off'
      option.state.on = false

  debug option
  if Object.keys(option.state).length < 1 and
     Object.keys(option.info).length < 1 and option.light
    return hue.light(option.light).getInfo print_api_response
  if Object.keys(option.info).length > 0
    if typeof option.light isnt 'number'
      console.error 'option "--light" is required'
      return
    return hue.light(option.light).setInfo option.info, print_api_response
  if Object.keys(option.state).length > 0
    unless option.state.on?
      option.state.effect ||= 'none'
      option.state.alert  ||= 'none'
    if typeof option.light is 'number'
      hue.light(option.light).setState option.state, print_api_response
      return
    hue.lights (err, lights) ->
      for number, data of lights
        hue.light(number).setState option.state, print_api_response
      return
