(function() {
  var Light, PhilipsHue, crypto, debug, events, fs, request,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  events = require('events');

  fs = require('fs');

  crypto = require('crypto');

  request = require('request');

  debug = require('debug')('philips-hue');

  module.exports = PhilipsHue = (function(superClass) {
    extend(PhilipsHue, superClass);

    function PhilipsHue() {
      this.devicetype = 'node-philips-hue';
      this.bridge = null;
      this.username = null;
    }

    PhilipsHue.prototype.loadConfigFile = function(conf_file, callback) {
      if (callback == null) {
        callback = function() {};
      }
      debug("loadConfigFile " + conf_file);
      return fs.exists(conf_file, (function(_this) {
        return function(exists) {
          if (exists) {
            fs.readFile(conf_file, function(err, data) {
              var conf;
              conf = JSON.parse(data.toString());
              _this.bridge = conf.bridge;
              _this.username = conf.username;
              _this.devicetype = conf.devicetype;
              return callback(null, conf);
            });
            return;
          }
          debug("generate config file");
          return _this.getBridges(function(err, bridges) {
            var bridge;
            if (err) {
              return callback(err);
            }
            debug("found bridges: " + (JSON.stringify(bridges)));
            bridge = bridges[0];
            if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(bridge)) {
              return callback("invalid bridge address \"" + bridge + "\"");
            }
            return _this.auth(bridge, function(err, username) {
              var conf;
              if (err) {
                return callback(err);
              }
              _this.bridge = bridge;
              _this.username = username;
              conf = {
                bridge: bridge,
                username: username,
                devicetype: _this.devicetype
              };
              return fs.writeFile(conf_file, JSON.stringify(conf), function(err) {
                if (err) {
                  return callback(err);
                }
                return callback(null, conf);
              });
            });
          });
        };
      })(this));
    };

    PhilipsHue.prototype.generateUserName = function() {
      return crypto.createHash('md5').update(this.devicetype + " " + process.env.USER + " " + (Date.now())).digest('hex');
    };

    PhilipsHue.prototype.getBridges = function(callback) {
      if (callback == null) {
        callback = function() {};
      }
      debug('getBridges');
      return request.get('https://www.meethue.com/api/nupnp', function(err, res, body) {
        var arr;
        if (err) {
          return callback(err);
        }
        if (res.statusCode !== 200) {
          return callback("statusCode:" + res.statusCode);
        }
        try {
          arr = JSON.parse(body);
          return callback(null, arr.map(function(i) {
            return i.internalipaddress;
          }));
        } catch (_error) {
          err = _error;
          return callback(err);
        }
      });
    };

    PhilipsHue.prototype.auth = function(bridge, callback) {
      var username;
      if (callback == null) {
        callback = function() {};
      }
      debug("auth bridge:" + bridge);
      username = this.generateUserName();
      return request.post({
        url: "http://" + bridge + "/api",
        form: JSON.stringify({
          devicetype: this.devicetype,
          username: username
        })
      }, function(err, res, body) {
        var data;
        if (err) {
          return callback(err);
        }
        if (res.statusCode !== 200) {
          return callback("statusCode:" + res.statusCode);
        }
        try {
          data = JSON.parse(body);
          if (data[0].error != null) {
            return callback(data[0].error);
          }
          return callback(null, username);
        } catch (_error) {
          err = _error;
          return callback(err);
        }
      });
    };

    PhilipsHue.prototype.lights = function(callback) {
      if (callback == null) {
        callback = function() {};
      }
      return request.get("http://" + this.bridge + "/api/" + this.username + "/lights", function(err, res, body) {
        var data;
        if (err) {
          return callback(err);
        }
        if (res.statusCode !== 200) {
          return callback("statusCode:" + res.statusCode);
        }
        try {
          data = JSON.parse(body);
          return callback(null, data);
        } catch (_error) {
          err = _error;
          return callback(err);
        }
      });
    };

    PhilipsHue.prototype.light = function(num) {
      return new Light(num, this);
    };

    return PhilipsHue;

  })(events.EventEmitter);

  Light = (function() {
    function Light(number, hue) {
      this.number = number != null ? number : 0;
      this.hue = hue;
    }

    Light.prototype.getInfo = function(callback) {
      var url;
      url = "http://" + this.hue.bridge + "/api/" + this.hue.username + "/lights/" + this.number;
      debug("getInfo " + url);
      return request.get(url, function(err, res, body) {
        var data;
        if (err) {
          return callback(err);
        }
        if (res.statusCode !== 200) {
          return callback("statusCode:" + res.statusCode);
        }
        try {
          data = JSON.parse(body);
          return callback(null, data);
        } catch (_error) {
          err = _error;
          return callback(err);
        }
      });
    };

    Light.prototype.setInfo = function(put_data, callback) {
      var url;
      if (callback == null) {
        callback = function() {};
      }
      url = "http://" + this.hue.bridge + "/api/" + this.hue.username + "/lights/" + this.number;
      debug("setInfo " + url + " " + (JSON.stringify(put_data)));
      return request.put({
        url: url,
        form: JSON.stringify(put_data)
      }, function(err, res, body) {
        var data;
        if (err) {
          return callback(err);
        }
        if (res.statusCode !== 200) {
          return callback("statusCode:" + res.statusCode);
        }
        try {
          data = JSON.parse(body);
          return callback(null, data);
        } catch (_error) {
          err = _error;
          return callback(err);
        }
      });
    };

    Light.prototype.setState = function(put_data, callback) {
      var url;
      if (callback == null) {
        callback = function() {};
      }
      url = "http://" + this.hue.bridge + "/api/" + this.hue.username + "/lights/" + this.number + "/state";
      debug("setState " + url + " " + (JSON.stringify(put_data)));
      return request.put({
        url: url,
        form: JSON.stringify(put_data)
      }, function(err, res, body) {
        var data;
        if (err) {
          return callback(err);
        }
        if (res.statusCode !== 200) {
          return callback("statusCode:" + res.statusCode);
        }
        try {
          data = JSON.parse(body);
          return callback(null, data);
        } catch (_error) {
          err = _error;
          return callback(err);
        }
      });
    };

    Light.prototype.on = function(callback) {
      if (callback == null) {
        callback = function() {};
      }
      return this.setState({
        on: true
      }, callback);
    };

    Light.prototype.off = function(callback) {
      if (callback == null) {
        callback = function() {};
      }
      return this.setState({
        on: false
      }, callback);
    };

    return Light;

  })();

}).call(this);
