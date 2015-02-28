## node modules
events = require 'events'
fs     = require 'fs'
crypto = require 'crypto'

## npm libs
request = require 'request'
debug   = require('debug')('philips-hue')


module.exports = class PhilipsHue extends events.EventEmitter

  constructor: ->
    @devicetype = 'node-philips-hue'
    @bridge = null
    @username = null

  generateUserName: ->
    crypto.createHash('md5')
    .update "#{@devicetype} #{process.env.USER} #{Date.now()}"
    .digest 'hex'


  getBridges: (callback = ->) ->
    debug 'getBridges'
    request.get 'https://www.meethue.com/api/nupnp', (err, res, body) ->
      return callback err if err
      return callback "statusCode:#{res.statusCode}" if res.statusCode isnt 200
      try
        arr = JSON.parse body
        callback null, arr.map (i) -> i.internalipaddress
      catch err
        callback err

  auth: (bridge, callback = ->) ->
    debug "auth bridge:#{bridge}"
    username = @generateUserName()
    request.post
      url: "http://#{bridge}/api"
      form: JSON.stringify
        devicetype: @devicetype
        username: username
    , (err, res, body) ->
      return callback err if err
      return callback "statusCode:#{res.statusCode}" if res.statusCode isnt 200
      try
        data = JSON.parse body
        return callback data[0].error if data[0].error?
        callback null, username
      catch err
        callback err

  lights: (callback = ->) ->
    request.get "http://#{@bridge}/api/#{@username}/lights", (err, res, body) ->
      return callback err if err
      return callback "statusCode:#{res.statusCode}" if res.statusCode isnt 200
      try
        data = JSON.parse body
        callback null, data
      catch err
        callback err

  light: (num) ->
    return new Light(num, @)


class Light

  constructor: (@number=0, @hue) ->

  getInfo: (callback) ->
    url = "http://#{@hue.bridge}/api/#{@hue.username}/lights/#{@number}"
    debug "getInfo #{url}"
    request.get url, (err, res, body) ->
      return callback err if err
      return callback "statusCode:#{res.statusCode}" if res.statusCode isnt 200
      try
        data = JSON.parse body
        callback null, data
      catch err
        callback err

  setInfo: (put_data, callback = ->) ->
    url = "http://#{@hue.bridge}/api/#{@hue.username}/lights/#{@number}"
    debug "setInfo #{url} #{JSON.stringify put_data}"
    request.put
      url: url
      form: JSON.stringify put_data
    , (err, res, body) ->
      return callback err if err
      return callback "statusCode:#{res.statusCode}" if res.statusCode isnt 200
      try
        data = JSON.parse body
        callback null, data
      catch err
        callback err

  setState: (put_data, callback = ->) ->
    url = "http://#{@hue.bridge}/api/#{@hue.username}/lights/#{@number}/state"
    debug "setState #{url} #{JSON.stringify put_data}"
    request.put
      url: url
      form: JSON.stringify put_data
    , (err, res, body) ->
      return callback err if err
      return callback "statusCode:#{res.statusCode}" if res.statusCode isnt 200
      try
        data = JSON.parse body
        callback null, data
      catch err
        callback err

  on: (callback = ->) ->
    @setState {on: true}, callback

  off: (callback = ->) ->
    @setState {on: false}, callback
