'use strict';
var path = require('path')

// var Hue = require('philips-hue');
var Hue = require(path.resolve(__dirname, '../'));

var hue = new Hue
var conf_file = process.env.HOME+'/.philips-hue.json';

hue.loadConfigFile(conf_file, function(err, conf){
  if(err) return console.error(err);

  for(var i = 1; i <= 3; i++){
    hue.light(i).off(function(err, res){
      if(err) console.error(err);
      console.log(res);
    });
  }
});
