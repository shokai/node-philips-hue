"use strict";

import Hue from "./philips-hue";
import light from "./light";

[
  light
].forEach((_module) => {
  for(let k in light){
    if(Hue.prototype.hasOwnProperty(k)) throw `"Hue.${k}" is already exists.`;
    Hue.prototype[k] = light[k];
  }
});

module.exports = Hue;
