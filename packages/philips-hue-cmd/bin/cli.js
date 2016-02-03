#!/usr/bin/env node

var handler = require("../lib/cli").handler;
handler(process.argv.slice(2))
  .catch(function(err){
    console.error(err.stack || err);
  });;
