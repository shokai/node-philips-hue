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

conf_file = "#{process.env.HOME}/.philips-hue.json"

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
  ['--conf [FILEPATH]', "set config file path (default - #{conf_file})"]
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

parser.on 'conf', (opt, value) ->
  conf_file = value

parser.on 'lights', ->
  hue.on 'ready', ->
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

if process.argv.length < 3
  parser.on_switches.help.call()
parser.parse process.argv

hue.loadConfigFile conf_file, (err, conf) ->
  return console.error err if err
  debug hue
  hue.emit 'ready'

hue.once 'ready', ->

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
    if option.state.hue?
      option.state.effect ||= 'none'
    if typeof option.light is 'number'
      hue.light(option.light).setState option.state, print_api_response
      return
    hue.lights (err, lights) ->
      for number, data of lights
        hue.light(number).setState option.state, print_api_response
      return
