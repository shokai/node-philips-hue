/* global describe it */

"use strict";

import helper from "./test_helper";
import {assert} from "chai";
import Hue from "../src/";
const hue = new Hue;

describe('method "login"', function(){

  it('should load config file', function(){
    assert.isFunction(hue.login);
    return hue
      .login(helper.configFile)
      .then((conf) => {
        assert.match(conf.bridge, /^\d+\.\d+\.\d+\.\d+$/);
        assert.isString(conf.username);
        assert.isString(conf.devicetype);
      });
  });
});

describe('Hue', function(){

  it('should have property "bridge"', function(){
    assert.isString(hue.bridge);
  });

  it('should have property "devicetype"', function(){
    assert.isString(hue.devicetype);
  });

  it('should have property "username"', function(){
    assert.isString(hue.username);
  });

  it('should have method "getBridges"', function(){
    assert.isFunction(hue.getBridges);
  });

  describe('method "getBridges"', function(){

    it('should return list of Address', function(){
      return hue
        .getBridges()
        .then((bridges) => {
          assert.isArray(bridges);
        });
    });

  });

  it('should have method "auth"', function(){
    assert.isFunction(hue.auth);
  });

});
