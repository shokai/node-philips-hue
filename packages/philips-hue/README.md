# Philips Hue

Node.js library for [Philips Hue bridge API](http://www.developers.meethue.com/philips-hue-api)

- https://github.com/shokai/node-philips-hue
- https://npmjs.com/package/philips-hue
- [CLI tool](https://www.npmjs.com/package/philips-hue-cmd) is available

[![Circle CI](https://circleci.com/gh/shokai/node-philips-hue.svg?style=svg)](https://circleci.com/gh/shokai/node-philips-hue)


## Install

    % npm i philips-hue -save


## Samples

see [samples directory](https://github.com/shokai/node-philips-hue/tree/master/packages/philips-hue/samples)


## Usage

```javascript
var Hue = require('philips-hue');
var hue = new Hue();
```

### Get Bridge's address and Auth

```javascript
hue.getBridges()
  .then(function(bridges){
    console.log(bridges);
    var bridge = bridges[0]; // use 1st bridge
    console.log("bridge: "+bridge);
    return hue.auth(bridge);
  })
  .then(function(username){
    console.log("username: "+username);

    // controll Hue lights
    hue.light(1).on();
    hue.light(2).off();
    hue.light(3).setState({hue: 50000, sat: 200, bri: 90});
  })
  .catch(function(err){
    console.error(err.stack || err);
  });
```

`username` is required for the next login.

```javascript
var hue = new Hue;
hue.bridge = "192.168.0.101";  // from hue.getBridges
hue.username = "a1b2cdef3456"; // from hue.auth
hue.light(1).on();
```

### Login

`hue.login` is useful wrapper of `getBridges` and `auth`. It automatically store/restore `username` and `bridge` address.

```javascript
var hue = new Hue;
var configFile = process.env.HOME+'/.philips-hue.json';

hue
  .login(configFile)
  .then(function(conf){
    return hue.light(1).on();
  })
  .then(function(res){
    console.log(res);
  })
  .catch(function(err){
    console.error(err.stack || err);
  });
```

### getLights

```javascript
hue.getLights()
  .then(function(lights){
    console.log(lights);
    console.log(Object.keys(lights) + " lights found!");
  })
  .catch(function(err){
    console.error(err.stack || err);
  });
```

### on / off

```javascript
var light = hue.light(1);

light.on().then(console.log).catch(console.error);
```

```javascript
hue.light(2).on().then(console.log).catch(console.error);
```

### setState

```javascript
var state = {bri: 200, sat: 120, hue: 50000};

hue.light(1).setState(state).then(console.log).catch(console.error);

hue.light(2).setState({effect: "colorloop"});

hue.light(3).setState({alert: "lselect"});
```

### getInfo / setInfo

```javascript
var light = hue.light(1);

light.setInfo({name: "myroom"});

light.getInfo()
  .then(function(info){
    console.log(info);
  });function(err, res){
```
