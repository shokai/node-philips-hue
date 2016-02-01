"use strict";

export default {
  light: function(num){
    return new Light(num, this);
  }
};

import axios from "axios";
const debug = require("debug")("philips-hue:light");

class Light{

  constructor(number = 0, hue){
    this.number = number;
    this.hue = hue;
  }

  getInfo(){
    const url = `http://${this.hue.bridge}/api/${this.hue.username}/lights/${this.number}`;
    debug(`getInfo ${url}`);
    return axios.get(url)
      .then((res) => {
        return res.data;
      });
  }

  setInfo(put_data){
    const url = `http://${this.hue.bridge}/api/${this.hue.username}/lights/${this.number}`;
    debug(`setInfo ${url} ${JSON.stringify(put_data)}`);
    return axios({
      method: "put",
      url: url,
      data: JSON.stringify(put_data)
    }).then((res) => {
      return res.data;
    });
  }

  setState(put_data){
    const url = `http://${this.hue.bridge}/api/${this.hue.username}/lights/${this.number}/state`;
    debug(`setState ${url} ${JSON.stringify(put_data)}`);
    return axios({
      method: 'put',
      url: url,
      data: JSON.stringify(put_data)
    }).then((res) => {
      return res.data;
    });
  }

  on(){
    return this.setState({on: true});
  }

  off(){
    return this.setState({on: false});
  }
}
