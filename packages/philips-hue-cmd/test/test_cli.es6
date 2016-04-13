/* global describe it */

process.env.NODE_ENV = "test";

import {assert} from "chai";

import cli from "../src/cli";

describe("CLI", function(){

  it('should have function "handler"', function(){
    assert.isFunction(cli.handler);
  });

});
