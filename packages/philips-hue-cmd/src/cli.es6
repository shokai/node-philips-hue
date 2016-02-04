/* eslint no-console: 0 */

"use strict";

import "babel-polyfill";
import minimist from "minimist";
import pkg from "../package.json";

const debug = require('debug')('philips-hue:cli');

import Hue from "philips-hue";
const hue = new Hue;

module.exports.handler = async function(_argv){

  var argv = minimist(_argv, {
    default: {
      config: `${process.env.HOME}/.philips-hue.json`
    },
    alias: {
      'help': 'h'
    }
  });

  debug(argv);

  const banner =
`philips-hue v${pkg.version} - https://www.npmjs.com/package/philips-hue-cmd

Usage:
  % philips-hue lights
  % philips-hue on
  % philips-hue off
  % philips-hue on --light 1
  % philips-hue --bri 120 --hue 30000 --sat 180
  % philips-hue --bri 120 --hue 30000 --sat 180 --light 2
  % philips-hue --effect colorloop
  % philips-hue --alert lselect

options:
  --help              show help
  --light [NUMBER]    specify light by Number
  --bri [NUMBER]      brightness (0~255)
  --hue [NUMBER]      hue (0~65535)
  --sat [NUMBER]      saturation (0~255)
  --alert [STRING]    "none" or "lselect"
  --effect [STRING]   "none" or "colorloop"`

  if(argv.help || _argv.length < 1){
    console.log(banner);
    return;
  }

  await hue.login(argv.config);
  if(argv._[0] === "lights"){
    let lights = await hue.getLights();
    for(let id in lights){
      let light = lights[id];
      console.log(`[${id}] ${light.name}\t${JSON.stringify(light.state)}`);
    }
    return lights;
  }

  // target Lights
  const lights = argv.light
          ? argv.light.toString().split(",")
          : Object.keys(await hue.getLights());
  debug(lights);

  // set state
  const state = {};
  for(let k of ["hue", "sat", "bri", "effect", "alert"]){
    if(argv[k]) state[k] = argv[k];
  }

  // on-off
  switch(argv._[0]){
  case "on":
    state.on = true;
    break;
  case "off":
    state.on = false;
    break;
  }

  // set state
  debug(state);

  if(Object.keys(state).length > 0){
    return await Promise.all(
      lights.map(id => {
        return hue.light(id).setState(state);
      })
    ).then(res => {
      for(let i of res){
        console.log(i);
      }
      return res;
    });
  }

};
