"use strict";

import optparse from "optparse";
import pkg from "../package.json";

const debug = require('debug')('philips-hue:app');

var option = {
  info: {},
  state: {},
  light: null
};

import Hue from "../";
const hue = new Hue;

module.exports.handler = function(argv){
  var confFile = `${process.env.HOME}/.philips-hue.json`;

  const parser = new optparse.OptionParser([
    ['-h', '--help', 'show help'],
    ['--lights', 'show lights state'],
    ['--light [NUMBER]', 'specify light by Number'],
    ['--bri [NUMBER]', 'brightness (0~255)'],
    ['--hue [NUMBER]', 'hue (0~65535)'],
    ['--sat [NUMBER]', 'saturation (0~255)'],
    ['--alert [STRING]', '"none" or "lselect"'],
    ['--effect [STRING]', '"none" or "colorloop"'],
    ['--name [STRING]', 'set light\'s name'],
    ['--conf [FILEPATH]', `set config file path (default - ${confFile})`]
  ]);

  parser.on('help', function(){

    parser.banner =
`philips-hue v${pkg.version} - ${pkg.homepage}

Usage:
  % philips-hue --lights
  % philips-hue on
  % philips-hue off
  % philips-hue on --light 1
  % philips-hue --bri 120 --hue 30000 --sat 180
  % philips-hue --bri 120 --hue 30000 --sat 180 --light 2
  % philips-hue --effect colorloop
  % philips-hue --alert lselect`
    console.log(parser.toString());
    return process.exit(0);
  });


  parser.on('conf', (opt, value) => {
    confFile = value
  });

  parser.on('lights', () => {
    hue.on('ready', () => {
      hue.getLights()
        .then((lights) => {
          for(let i in lights){
            let data = lights[i];
            console.log(`[${i}] ${data.name}\t${JSON.stringify(data.state)}`);
          }
        })
        .catch(function(err){
          console.error(err.stack || err);
        });
    });
  });

  parser.on('light', (opt, light) => {
    option.light = light;
  });

  ['bri', 'hue', 'sat', 'alert', 'effect'].forEach((i) => {
    parser.on(i, (opt, value) => {
      debug(`${i} <= ${value}`);
      option.state[i] = value;
    });
  });

  ['name'].forEach((i) => {
    parser.on(i, (opt, value) => {
      debug(`${i} <= ${value}`);
      option.info[i] = value;
    });
  });

  if(argv < 1){
    parser.on_switches.help.call();
  }
  parser.parse(argv);

  hue.login(confFile)
    .then((conf) => {
      debug(hue);
      hue.emit('ready');
    });

  hue.once('ready', () => {

    switch(argv[0]){
    case 'on':
      option.state.on = true;
      break;
    case 'off':
      option.state.on = false;
      break;
    }

    debug(option);
    if(Object.keys(option.state).length < 1 &&
       Object.keys(option.info).length < 1 &&
       option.light){
      return hue.light(option.light).getInfo().then(console.log).catch(console.error);
    }
    if(Object.keys(option.info).length > 0){
      if(typeof option.light !== 'number'){
        return console.error('option "--light" is required');
      }
      return hue.light(option.light).setInfo(option.info).then(console.log).catch(console.error);
    }
    if(Object.keys(option.state).length > 0){
      if(option.state.hue && !option.state.effect){
        option.state.effect = 'none';
      }
      if(typeof option.light === 'number'){
        return hue.light(option.light).setState(option.state).then(console.log).catch(console.error);
      }
      hue
        .getLights()
        .then((lights) => {
          for(let number in lights){
            hue.light(number).setState(option.state).then(console.log).catch(console.error);
          }
        });
      return
    }
  });
};
