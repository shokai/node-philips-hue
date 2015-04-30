# Philips Hue

Node.js library for [Philips Hue bridge API](http://www.developers.meethue.com/philips-hue-api)

[![Build Status](https://travis-ci.org/shokai/node-philips-hue.svg?branch=master)](https://travis-ci.org/shokai/node-philips-hue)

- https://github.com/shokai/node-philips-hue
- http://npmjs.org/package/philips-hue

## Install

    % npm install philips-hue


## philips-hue command

    % npm install philips-hue coffee-script -g  # global install
    % philips-hue --help

    % philips-hue --lights
    % philips-hue on
    % philips-hue off --light 1
    % philips-hue --bri 80 --hue 25000 --light 2
    % philips-hue --effect colorloop
    % philips-hue --alert lselect


## Usage

see [samples](./samples)

```javascript
var Hue = require('philips-hue');
var hue = new Hue();
```

### Get Bridge's address and Auth

```javascript
hue.getBridges(function(err, bridges){
  if(err) return console.error(err);
  console.log(bridges);

  var bridge = bridges[0]; // use 1st bridge

  hue.auth(bridge, function(err, username){
    if(err) return console.error(err);
    console.log("bridge: "+bridge);
    console.log("username: "+username);
  });
});
```

set bridge's address and username

```javascript
hue.bridge = "192.168.0.101";  // from hue.getBridges()
hue.username = "a1b2cdef3456"; // from hue.auth()
```

### lights

```javascript
hue.lights(function(err, lights){
  if(err) return console.log(err);
  console.log(lights);
});
```

### on / off

```javascript
var light = hue.light(1);

light.on(function(err, res){
  if(err) return console.log(err);
  console.log(res);
});
```

```javascript
hue.light(2).off(function(err, res){
  if(err) return console.log(err);
  console.log(res);
});
```

### setState

```javascript
var state = {bri: 200, sat: 120, hue: 50000};

hue.light(1).setState(state, function(err, res){
  if(err) return console.log(err);
  console.log(res);
});

hue.light(2).setState({effect: "colorloop"});

hue.light(3).setState({alert: "lselect"});
```

### getInfo / setInfo

```javascript
var light = hue.light(1);

light.setInfo({name: "myroom"}, function(err, res){
  if(err) return console.log(err);
  console.log(res);
})

light.getInfo(function(err, res){
  if(err) return console.log(err);
  console.log(res);
});
```

### Helper Method

load (or auth then create) config file.

```javascript
var conf_file = process.env.HOME + '/.hue.json';
hue.loadConfigFile(conf_file, function(err, conf){
  hue.light(1).on();
  hue.light(2).off();
});
```


## Develop

    % npm run build
    # or
    % npm run watch


## Test

    % npm test



## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
