"use strict";

import fs from "fs";
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

function print_api_response(err, res){
  if(err) return console.error(err);
  console.log(res);
}

module.exports.handler = function(argv){
  var conf_file = `${process.env.HOME}/.philips-hue.json`;

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
    ['--conf [FILEPATH]', `set config file path (default - ${conf_file})`]
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
    conf_file = value
  });

  parser.on('lights', () => {
    hue.on('ready', () => {
      hue.lights((err, lights) => {
        if(err) return console.error(err);
        for(let i in lights){
          let data = lights[i];
          console.log(`[${i}] ${data.name}\t${JSON.stringify(data.state)}`);
        }
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

  hue.loadConfigFile(conf_file, (err, conf) => {
    if(err) return console.error(err);
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
      return hue.light(option.light).getInfo(print_api_response);
    }
    if(Object.keys(option.info).length > 0){
      if(typeof option.light !== 'number'){
        return console.error('option "--light" is required');
      }
      return hue.light(option.light).setInfo(option.info, print_api_response);
    }
    if(Object.keys(option.state).length > 0){
      if(option.state.hue && !option.state.effect){
        option.state.effect = 'none';
      }
      if(typeof option.light === 'number'){
        return hue.light(option.light).setState(option.state, print_api_response);
      }
      hue.lights((err, lights) => {
        for(let number in lights){
          hue.light(number).setState(option.state, print_api_response);
        }
        return
      });
    }
  });
};
