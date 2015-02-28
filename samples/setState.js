'use strict';
var path = require('path')

// var Hue = require('philips-hue');
var Hue = require(path.resolve(__dirname, '../'));

var hue = new Hue

if(process.argv.length < 3){
  console.error("error: username required");
  console.error("node "+process.argv[1]+" a1b2cdef3456");
  process.exit(1);
}

hue.username = process.argv[2];

hue.getBridges(function(err, bridges){

  hue.bridge = bridges[0];

  for(var i = 1; i <= 3; i++){
    var state = {
      bri: Math.floor(Math.random()*255),
      hue: Math.floor(Math.random()*65535),
      sat: Math.floor(Math.random()*255)
    };
    console.log(state);
    hue.light(i).setState(state, function(err, res){
      if(err) console.error(err);
      console.log(res);
    });
  }
});
