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
    hue.light(i).on(function(err, res){
      if(err) console.error(err);
      console.log(res);
    });
  }
});
