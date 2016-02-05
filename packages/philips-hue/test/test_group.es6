/* global describe it */

"use strict";

import helper from "./test_helper";
import {assert} from "chai";
import Hue from "../src/";

const hue = new Hue;
hue.login(helper.configFile);

describe("Group module", function(){

  describe("Hue", function(){

    it('should have method "getGroups"', function(){
      assert.isFunction(hue.getGroups);
    });

    describe('method "getGroups"', function(){

      it('should return status list of groups', function(){
        return hue
          .getGroups()
          .then((groups) => {
            assert.isObject(groups);
          });
      });
    });

    it('should have method "group"', function(){
      assert.isFunction(hue.group);
    });

  });

  describe('Hue.group', function(){

    const group = hue.group(1);

    describe("getInfo", function(){

      it("is method", function(){
        assert.isFunction(group.getInfo);
      });

      it("return info", function(){
        return group.getInfo()
          .then(info => {
            assert.isObject(info);
          });
      });
    });

  });

});
