'use strict';

// var Hue = require('philips-hue');
var Hue = require('../');

var hue = new Hue;
var configFile = process.env.HOME+'/.philips-hue.json';

hue
  .login(configFile)
  .then(function(conf){
    return hue.light(1).off();
  })
  .then(function(res){
    console.log(res);
  })
  .catch(function(err){
    console.error(err.stack || err);
  });
