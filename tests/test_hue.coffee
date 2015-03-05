process.env.NODE_ENV = 'test'

path   = require 'path'
assert = require 'assert'

Hue = require path.resolve()
hue = new Hue

describe 'loading config file', ->

  it 'should have method "loadConfigFile"', ->
    assert.equal typeof hue.loadConfigFile, 'function'

  it 'should load config file', (done) ->
    hue.loadConfigFile "#{process.env.HOME}/.philips-hue.json", (err, conf) ->
      console.error if err
      assert.equal /^\d+\.\d+\.\d+\.\d+$/.test(conf.bridge), true
      assert.equal typeof conf.username, 'string'
      assert.equal typeof conf.devicetype, 'string'
      done()

describe 'Instance of Hue class', ->

  it 'should have property "bridge"', ->
    assert.equal typeof hue.bridge, 'string'

  it 'should have property "devicetype"', ->
    assert.equal typeof hue.devicetype, 'string'

  it 'should have property "username"', ->
    assert.equal typeof hue.username, 'string'

  it 'should have method "getBridges"', ->
    assert.equal typeof hue.getBridges, 'function'

  describe 'method "getBridges"', ->

    it 'should callback list of Address', (done) ->
      @timeout 5000
      hue.getBridges (err, bridges) ->
        console.error err if err
        assert.equal bridges instanceof Array, true
        done()

  it 'should have method "auth"', ->
    assert.equal typeof hue.auth, 'function'

  it 'should have method "lights"', ->
    assert.equal typeof hue.lights, 'function'

  describe 'method "lights"', ->

    it 'should callback status list of lights', (done) ->
      @timeout 5000
      hue.lights (err, lights) ->
        console.error err if err
        assert.equal typeof lights, 'object'
        done()

  it 'should have method "light"', ->
    assert.equal typeof hue.light, 'function'

  describe 'Instance of Light class', ->

    light = hue.light(1)

    it 'should have method "getInfo"', ->
      assert.equal typeof light.getInfo, 'function'

    it 'should have method "setInfo"', ->
      assert.equal typeof light.setInfo, 'function'

    it 'should have method "setState"', ->
      assert.equal typeof light.setState, 'function'

    it 'should have method "on"', ->
      assert.equal typeof light.on, 'function'

    it 'should have method "off"', ->
      assert.equal typeof light.off, 'function'

    it 'should blink', (done) ->
      @timeout 5000
      light.off (err, res) ->
        setTimeout ->
          light.on (err, res) ->
            done()
        , 1000
