#!/usr/bin/env coffee
path = require 'path'

Hue = require path.resolve()

hue = new Hue
console.log hue
hue.on 'ready', ->
  console.log 'ready!'

  light = hue.light 3
  light.getInfo (err, res) ->
    console.log res
    light.setInfo
      name: 'スタンド'
    light.setState
      hue: 60000
    , (err, res) ->
      console.log res

