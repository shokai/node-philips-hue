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
    boolean: [ 'help' ],
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
  % philips-hue lights            # get Lights
  % philips-hue on                # turn on all
  % philips-hue off --light 1,2   # turn off 1,2
  % philips-hue --bri 120 --hue 30000 --sat 180
  % philips-hue --bri 120 --hue 30000 --sat 180 --light 3
  % philips-hue --effect colorloop
  % philips-hue --alert lselect

Options:
  --help   show help
  --light  specify light by Number
  --bri    brightness (0~255)
  --hue    hue (0~65535)
  --sat    saturation (0~255)
  --alert  "none" or "lselect"
  --effect "none" or "colorloop"`

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

  debug(`state: ${JSON.stringify(state)}`);
  if(Object.keys(state).length < 1) return;

  // target Lights
  const lights = argv.light
          ? argv.light.toString().split(",")
          : Object.keys(await hue.getLights());
  debug(`lights: ${lights}`);

  for(let id of lights){
    let res = await hue.light(id).setState(state).catch(err => { console.error(err); });
    if(res) console.log(res);
  }

};
