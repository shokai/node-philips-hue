'use strict';

// var Hue = require('philips-hue');
var Hue = require('../');

var hue = new Hue;
var conf_file = process.env.HOME+'/.philips-hue.json';

hue
  .login(conf_file)
  .then(function(conf){
    return hue.light(1).on();
  })
  .then(function(res){
    console.log(res);
  })
  .catch(function(err){
    console.error(err.stack || err);
  });
