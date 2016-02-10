"use strict";

import events from "events";
import fs from "fs";
import crypto from "crypto";
import axios from "axios";
const debug = require("debug")("philips-hue");

import {checkResponse} from "./util";

export default class PhilipsHue extends events.EventEmitter{

  constructor(){
    super();
    this.devicetype = 'node-philips-hue';
    this.bridge = null;
    this.username = null;
  }

  login(confFile){
    if(typeof confFile !== "string") return Promise.reject("Argument Error: config file is missing");
    debug(`login file: ${confFile}`);
    try{
      if(fs.statSync(confFile).isFile()){
        var conf = require(confFile);
        this.bridge = conf.bridge;
        this.username = conf.username;
        this.devicetype = conf.devicetype;
        return Promise.resolve(conf);
      }
    }
    catch(err){
      debug("config file not exists");
    }
    debug(`generate config file ${confFile}`);
    return this
      .getBridges()
      .then(bridges => {
        debug(`found bridges: ${JSON.stringify(bridges)}`);
        this.bridge = bridges[0].internalipaddress;
        if(!(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(this.bridge))){
          throw `invalid bridge address "${this.bridge}"`;
        }
        return this.auth(this.bridge);
      })
      .then(username => {
        this.username = username;
        var conf = {bridge: this.bridge, username: username, devicetype: this.devicetype};
        fs.writeFileSync(confFile, JSON.stringify(conf));
        return conf;
      });
  }

  generateUserName(){
    return crypto
      .createHash('md5')
      .update(`${this.devicetype} ${process.env.USER} ${Date.now()}`)
      .digest("hex");
  }

  getBridges(){
    debug("getBridges");
    return axios
      .get("https://www.meethue.com/api/nupnp")
      .then(res => {
        checkResponse(res.data);
        return res.data;
      });
  }

  auth(bridge){
    debug(`auth bridge: ${bridge}`);
    var username = this.generateUserName();
    return axios({
      method: "post",
      url: `http://${bridge}/api`,
      data: JSON.stringify({
        devicetype: this.devicetype,
        username: username
      })
    }).then(res => {
      debug(res.data);
      checkResponse(res.data);
      return username;
    });
  }

  // Bridge API request
  request(opts){
    const url = `http://${this.bridge}/api/${this.username}`;
    return axios({
      url: `${url}${opts.path}`,
      method: opts.method || 'get',
      data: opts.data ? JSON.stringify(opts.data) : null
    }).then(res => {
      debug(res.data);
      checkResponse(res.data);
      return res.data;
    });
  }

}
