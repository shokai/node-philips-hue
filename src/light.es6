"use strict";

import request from "request";
const debug = require("debug")("philips-hue:light");

module.exports = class Light{

  constructor(number = 0, hue){
    this.number = number;
    this.hue = hue;
  }

  getInfo(callback){
    const url = `http://${this.hue.bridge}/api/${this.hue.username}/lights/${this.number}`;
    debug(`getInfo ${url}`);
    request.get(url, (err, res, body) => {
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

  setInfo(put_data, callback){
    const url = `http://${this.hue.bridge}/api/${this.hue.username}/lights/${this.number}`;
    debug(`setInfo ${url} ${JSON.stringify(put_data)}`);
    request.put({
      url: url,
      form: JSON.stringify(put_data)
    }, (err, res, body) => {
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

  setState(put_data, callback){
    const url = `http://${this.hue.bridge}/api/${this.hue.username}/lights/${this.number}/state`;
    debug(`setState ${url} ${JSON.stringify(put_data)}`);
    request.put({
      url: url,
      form: JSON.stringify(put_data)
    }, (err, res, body) => {
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

  on(callback){
    this.setState({on: true}, callback);
  }

  off(callback){
    this.setState({on: false}, callback);
  }
}
