'use strict';

// var Hue = require('philips-hue');
var Hue = require('../');

var hue = new Hue;
var configFile = process.env.HOME+'/.philips-hue.json';

hue
  .login(configFile)
  .then(function(conf){
    return Promise.all(
      [1, 2, 3].map(function(i){
        var state = {
          on: true,
          bri: Math.floor(Math.random()*255),
          hue: Math.floor(Math.random()*65535),
          sat: Math.floor(Math.random()*255)
        };
        console.log(state);
        return hue.light(i).setState(state).then(console.log);
      })
    );
  })
  .catch(function(err){
    console.error(err.stack || err);
  });



