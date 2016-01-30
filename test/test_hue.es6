/* global describe it */

"use strict";

import "./test_helper";
import {assert} from "chai";
import Hue from "../src/philips-hue";
const hue = new Hue;

describe('method "login"', function(){

  it('should load config file', function(){
    assert.isFunction(hue.login);
    return hue
      .login(`${process.env.HOME}/.philips-hue.json`)
      .then((conf) => {
        assert.match(conf.bridge, /^\d+\.\d+\.\d+\.\d+$/);
        assert.isString(conf.username);
        assert.isString(conf.devicetype);
      });
  });
});

describe('Instance of Hue class', function(){

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

  it('should have method "getLights"', function(){
    assert.isFunction(hue.getLights);
  });

  describe('method "getLights"', function(){

    it('should return status list of lights', function(){
      return hue
        .getLights()
        .then((lights) => {
          assert.isObject(lights);
        });
    });
  });

  it('should have method "light"', function(){
    assert.isFunction(hue.light);
  });

  describe('Instance of Light class', function(){

    const light = hue.light(1);

    it('should have method "getInfo"', function(){
      assert.isFunction(light.getInfo);
    });

    describe('method "getInfo"', function(){

      it("should return info", function(){
        return light.getInfo().then((info) => {
          assert.isString(info.name);
          assert.isObject(info.state);
          assert.isString(info.type);
        });
      });
    });


    it('should have method "setInfo"', function(){
      assert.isFunction(light.setInfo);
    });

    it('should have method "setState"', function(){
      assert.isFunction(light.setState);
    });

    it('should have method "off"', function(){
      assert.isFunction(light.off);
    });

    it('should have method "on"', function(){
      assert.isFunction(light.on);
    });

    it('should blink', function(){
      this.timeout(4000);
      return light
        .off()
        .then(() => {
          return Promise.delay(2000);
        })
        .then(() => {
          return light.on();
        });
    });
  });

});
