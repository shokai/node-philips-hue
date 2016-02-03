'use strict';

// var Hue = require('philips-hue');
var Hue = require('../');

var hue = new Hue;
hue.devicetype = 'my-hue-app';

hue.getBridges()
  .then(function(bridges){
    console.log(bridges);
    var bridge = bridges[0];
    console.log("bridge: "+bridge);
    return hue.auth(bridge);
  })
  .then(function(username){
    console.log("username: "+username);
  })
  .catch(function(err){
    console.error(err.stack || err);
  });

