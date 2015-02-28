'use strict';
var path = require('path')

// var Hue = require('philips-hue');
var Hue = require(path.resolve(__dirname, '../'));

var hue = new Hue
hue.devicetype = 'my-hue-app'

hue.getBridges(function(err, bridges){
  if(err) return console.error(err);
  console.log(bridges);

  var bridge = bridges[0];
  console.log("bridge: "+bridge);

  hue.auth(bridge, function(err, username){
    if(err) return console.error(err);
    console.log("username: "+username);
  });
});
