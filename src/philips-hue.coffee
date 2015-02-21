## node modules
fs     = require 'fs'
crypto = require 'crypto'

## npm libs
request = require 'request'
events  = require 'eventemitter2'
debug   = require('debug')('philips-hue')


module.exports = class PhilipsHue extends events.EventEmitter2

  constructor: ->
    @conf_file = process.env.HOME+'/.hue-korg.json'
    debug "config file: #{@conf_file}"
    @app_name = 'hue-korg-controller'
    fs.exists @conf_file, (exists) =>
      if exists
        conf = require @conf_file
        return unless @bridge = conf.bridge
        return unless @user   = conf.user
        @emit 'ready'
        return
      @getBridges (err, bridges) =>
        return console.error err if err
        debug "found bridges: #{JSON.stringify bridges}"
        @bridge = bridges[0]
        unless /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test @bridge
          return console.error "invalid bridge address \"#{@bridge}\""
        @configure (err, user) =>
          return console.error err if err
          @user = user
          conf = {bridge: @bridge, user: @user}
          fs.writeFile @conf_file, JSON.stringify(conf), (err) =>
            return console.error err if err
            @emit 'ready'

  generateUserName: ->
    crypto.createHash('md5')
    .update "#{@app_name} #{process.env.USER} #{Date.now()}"
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

  configure: (callback = ->) ->
    debug 'conigure'
    user = @generateUserName()
    request.post
      url: "http://#{@bridge}/api"
      form: JSON.stringify
        devicetype: @app_name
        username: user
    , (err, res, body) ->
      return callback err if err
      return callback "statusCode:#{res.statusCode}" if res.statusCode isnt 200
      try
        data = JSON.parse body
        return callback data[0].error if data[0].error?
        callback null, user
      catch err
        callback err

  lights: ->
    request.get "http://#{@bridge}/api/#{@user}/lights", (err, res, body) ->
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
    request.get "http://#{@hue.bridge}/api/#{@hue.user}/lights/#{@number}", (err, res, body) ->
      return callback err if err
      return callback "statusCode:#{res.statusCode}" if res.statusCode isnt 200
      try
        data = JSON.parse body
        callback null, data
      catch err
        callback err

  setInfo: (put_data, callback = ->) ->
    request.put
      url: "http://#{@hue.bridge}/api/#{@hue.user}/lights/#{@number}"
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
    debug "setState #{JSON.stringify put_data}"
    request.put
      url: "http://#{@hue.bridge}/api/#{@hue.user}/lights/#{@number}/state"
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
    @set {on: true}, callback

  off: (callback = ->) ->
    @set {on: false}, callback
