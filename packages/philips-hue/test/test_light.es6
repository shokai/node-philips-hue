/* global describe it */

import helper from "./test_helper";
import {assert} from "chai";
import Hue from "../src/";

const hue = new Hue;
hue.login(helper.configFile);

describe("Light module", function(){

  describe("Hue", function(){

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

  });

  describe('Hue.light', function(){

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
