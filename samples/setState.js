'use strict';
var path = require('path')

// var Hue = require('philips-hue');
var Hue = require(path.resolve(__dirname, '../'));

var hue = new Hue
var conf_file = process.env.HOME+'/.philips-hue.json';

hue.loadConfigFile(conf_file, function(err, conf){
  if(err) return console.error(err);

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
