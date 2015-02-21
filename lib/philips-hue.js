(function() {
  var Hue, Light, crypto, debug, events, fs, hue, request,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  fs = require('fs');

  crypto = require('crypto');

  request = require('request');

  events = require('eventemitter2');

  debug = require('debug')('hue-korg:hue');

  module.exports = Hue = (function(superClass) {
    extend(Hue, superClass);

    function Hue() {
      this.conf_file = process.env.HOME + '/.hue-korg.json';
      debug("config file: " + this.conf_file);
      this.app_name = 'hue-korg-controller';
      fs.exists(this.conf_file, (function(_this) {
        return function(exists) {
          var conf;
          if (exists) {
            conf = require(_this.conf_file);
            if (!(_this.bridge = conf.bridge)) {
              return;
            }
            if (!(_this.user = conf.user)) {
              return;
            }
            _this.emit('ready');
            return;
          }
          return _this.getBridges(function(err, bridges) {
            if (err) {
              return console.error(err);
            }
            debug("found bridges: " + (JSON.stringify(bridges)));
            _this.bridge = bridges[0];
            if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(_this.bridge)) {
              return console.error("invalid bridge address \"" + _this.bridge + "\"");
            }
            return _this.configure(function(err, user) {
              if (err) {
                return console.error(err);
              }
              _this.user = user;
              conf = {
                bridge: _this.bridge,
                user: _this.user
              };
              return fs.writeFile(_this.conf_file, JSON.stringify(conf), function(err) {
                if (err) {
                  return console.error(err);
                }
                return _this.emit('ready');
              });
            });
          });
        };
      })(this));
    }

    Hue.prototype.generateUserName = function() {
      return crypto.createHash('md5').update(this.app_name + " " + process.env.USER + " " + (Date.now())).digest('hex');
    };

    Hue.prototype.getBridges = function(callback) {
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

    Hue.prototype.configure = function(callback) {
      var user;
      if (callback == null) {
        callback = function() {};
      }
      debug('conigure');
      user = this.generateUserName();
      return request.post({
        url: "http://" + this.bridge + "/api",
        form: JSON.stringify({
          devicetype: this.app_name,
          username: user
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
          return callback(null, user);
        } catch (_error) {
          err = _error;
          return callback(err);
        }
      });
    };

    Hue.prototype.lights = function() {
      return request.get("http://" + this.bridge + "/api/" + this.user + "/lights", function(err, res, body) {
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

    Hue.prototype.light = function(num) {
      return new Light(num, this);
    };

    return Hue;

  })(events.EventEmitter2);

  Light = (function() {
    function Light(number, hue1) {
      this.number = number != null ? number : 0;
      this.hue = hue1;
    }

    Light.prototype.getInfo = function(callback) {
      return request.get("http://" + this.hue.bridge + "/api/" + this.hue.user + "/lights/" + this.number, function(err, res, body) {
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
      if (callback == null) {
        callback = function() {};
      }
      return request.put({
        url: "http://" + this.hue.bridge + "/api/" + this.hue.user + "/lights/" + this.number,
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
      if (callback == null) {
        callback = function() {};
      }
      debug("setState " + (JSON.stringify(put_data)));
      return request.put({
        url: "http://" + this.hue.bridge + "/api/" + this.hue.user + "/lights/" + this.number + "/state",
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
      return this.set({
        on: true
      }, callback);
    };

    Light.prototype.off = function(callback) {
      if (callback == null) {
        callback = function() {};
      }
      return this.set({
        on: false
      }, callback);
    };

    return Light;

  })();

  if (process.argv[1] !== __filename) {
    return;
  }

  hue = new Hue;

  hue.on('ready', function() {
    var light;
    console.log('ready!');
    light = hue.light(3);
    return light.getInfo(function(err, res) {
      console.log(res);
      light.setInfo({
        name: 'スタンド'
      });
      return light.setState({
        hue: 60000
      }, function(err, res) {
        return console.log(res);
      });
    });
  });

}).call(this);
