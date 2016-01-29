"use strict";

import events from "events";
import fs from "fs";
import crypto from "crypto";

import request from "request";
import Light from "./light";
const debug = require("debug")("philips-hue");

module.exports = class PhilipsHue extends events.EventEmitter{

  constructor(){
    super();
    this.devicetype = 'node-philips-hue';
    this.bridge = null;
    this.username = null;
  }

  loadConfigFile(conf_file, callback){
    debug(`loadConfigFile ${conf_file}`);
    fs.exists(conf_file, (exists) => {
      if(exists){
        fs.readFile(conf_file, (err, data) => {
          var conf = JSON.parse(data.toString());
          this.bridge = conf.bridge;
          this.username = conf.username;
          this.devicetype = conf.devicetype;
          return callback(null, conf);
        });
        return;
      }
      debug("generate config file");
      this.getBridges((err, bridges) => {
        if(err) return callback(err);
        debug(`found bridges: ${JSON.stringify(bridges)}`);
        var bridge = bridges[0];
        if(!(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(bridge))){
          return callback(`invalid bridge address "${bridge}"`);
        }
        this.auth(bridge, (err, username) => {
          if(err) return callback(err);
          this.bridge = bridge;
          this.username = username;
          var conf = {bridge: bridge, username: username, devicetype: this.devicetype};
          fs.writeFile(conf_file, JSON.stringify(conf), (err) => {
            if(err) return callback(err);
          });
          callback(null, conf);
        });
      });
    });
  }

  generateUserName(){
    return crypto
      .createHash('md5')
      .update(`${this.devicetype} ${process.env.USER} ${Date.now()}`)
      .digest("hex");
  }

  getBridges(callback){
    debug("getBridges");
    request.get("https://www.meethue.com/api/nupnp", (err, res, body) => {
      if(err) return callback(err);
      if(res.statusCode !== 200) return callback(`statusCode:${res.statusCode}`);
      try{
        var arr = JSON.parse(body);
        callback(null, arr.map((i) => i.internalipaddress));
      }
      catch(err){
        callback(err);
      }
    });
  }

  auth(bridge, callback){
    debug(`auth bridge:${bridge}`);
    var username = this.generateUserName();
    request.post({
      url: `http://${bridge}/api`,
      form: JSON.stringify({
        devicetype: this.devicetype,
        username: username
      })
    }, (err, res, body) => {
      if(err) return callback(err);
      if(res.statusCode !== 200) return callback(`statusCode:${res.statusCode}`);
      try{
        var data = JSON.parse(body);
        if(data[0].error) return callback(data[0].error);
        callback(null, username);
      }
      catch(err){
        callback(err);
      }
    });
  }

  lights(callback){
    request.get(`http://${this.bridge}/api/${this.username}/lights`, (err, res, body) => {
      if(err) return callback(err);
      if(res.statusCode !== 200) return callback(`statusCode:${res.statusCode}`);
      try{
        callback(null, JSON.parse(body));
      }
      catch(err){
        callback(err);
      }
    });
  }

  light(num){
    return new Light(num, this)
  }
}
