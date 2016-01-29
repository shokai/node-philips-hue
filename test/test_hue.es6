/* global describe it */

"use strict";

process.env.NODE_ENV = 'test';

import {assert} from "chai";
import Hue from "../src/philips-hue";
const hue = new Hue;

describe('loading config file', function(){

  it('should have method "loadConfigFile"', function(){
    assert.isFunction(hue.loadConfigFile);
  });

  it('should load config file', function(done){
    hue.loadConfigFile(`${process.env.HOME}/.philips-hue.json`, function(err, conf){
      assert.match(conf.bridge, /^\d+\.\d+\.\d+\.\d+$/);
      assert.isString(conf.username);
      assert.isString(conf.devicetype);
      done()
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

    it('should callback list of Address', function(done){
      this.timeout(5000);
      hue.getBridges((err, bridges) => {
        assert.isArray(bridges);
        done()
      });
    });
  });

  it('should have method "auth"', function(){
    assert.isFunction(hue.auth);
  });

  it('should have method "lights"', function(){
    assert.isFunction(hue.lights);
  });

  describe('method "lights"', function(){

    it('should callback status list of lights', function(done){
      this.timeout(5000);
      hue.lights((err, lights) => {
        assert.isObject(lights);
        done()
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

    it('should have method "setInfo"', function(){
      assert.isFunction(light.setInfo);
    });

    it('should have method "setState"', function(){
      assert.isFunction(light.setState);
    });

    it('should have method "on"', function(){
      assert.isFunction(light.on);
    });

    it('should have method "off"', function(){
      assert.isFunction(light.off);
    });

    it('should blink', function(done){
      this.timeout(5000);
      light.off((err, res) => {
        setTimeout(() => {
          light.on((err, res) => {
            done()
          });
        }, 1000);
      });
    });
  });

});
