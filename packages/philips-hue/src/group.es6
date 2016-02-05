// http://www.developers.meethue.com/documentation/groups-api

"use strict";

import Hue from "./philips-hue";

Hue.prototype.getGroups = function(){
  return this.request({path: "/groups"});
};

Hue.prototype.group = function(id){
  return new Group(id, this);
};

class Group{
  constructor(id, hue){
    this.id = id;
    this.hue = hue;
  }

  getInfo(){
    return this.hue.request({
      path: `/groups/${this.id}`
    });
  }
}
