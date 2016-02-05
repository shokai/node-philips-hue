"use strict";

const debug = require("debug")("philips-hue:light");
import Hue from "./philips-hue";

Hue.prototype.getLights = function(){
  return this.request({path: "/lights"});
};

Hue.prototype.light = function(num){
  return new Light(num, this);
};

class Light{

  constructor(number = 0, hue){
    this.number = number;
    this.hue = hue;
  }

  getInfo(){
    debug(`light(${this.number}) getInfo`);
    return this.hue.request({path: `/lights/${this.number}`});
  }

  setInfo(put_data){
    debug(`light(${this.number}) setInfo ${JSON.stringify(put_data)}`);
    return this.hue.request({
      path: `/lights/${this.number}`,
      method: "put",
      data: put_data
    });
  }

  setState(put_data){
    debug(`light(${this.number}) setState ${JSON.stringify(put_data)}`);
    return this.hue.request({
      path: `/lights/${this.number}/state`,
      method: "put",
      data: put_data
    });
  }

  on(){
    return this.setState({on: true});
  }

  off(){
    return this.setState({on: false});
  }
}
