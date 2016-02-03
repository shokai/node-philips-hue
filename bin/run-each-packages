#!/usr/bin/env node
"use strict";

var path = require("path");
var fs = require("fs");
var spawn = require("child_process").spawn;
var async = require("async");

var pkgs = fs.readdirSync(path.resolve(__dirname, "../packages/"));
var each = async.eachSeries;

var args = process.argv.slice(2);
if(args[0] === "--parallel"){
  each = async.each;
  args.shift();
}
var cmd = args.join(' ');

console.log("command:  " + cmd);
console.log("packages: " + JSON.stringify(pkgs));

if(cmd.length < 1) process.exit(0);

each(pkgs, function(pkg, next){

  var pkgdir = path.resolve(__dirname, "../packages", pkg);
  var _spawn = spawn("sh", ["-c", cmd], {
    cwd: pkgdir,
    stdio: ['pipe', process.stdout, process.stderr],
    env: process.env
  })
  _spawn.on("close", next);

}, function(err, res){
  if(err) console.error(err);
});
