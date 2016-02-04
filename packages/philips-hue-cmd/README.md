# philips-hue-cmd

CLI for [Philips Hue bridge API](http://www.developers.meethue.com/philips-hue-api)


- https://github.com/shokai/node-philips-hue
- https://npmjs.com/package/philips-hue-cmd

[![Circle CI](https://circleci.com/gh/shokai/node-philips-hue.svg?style=svg)](https://circleci.com/gh/shokai/node-philips-hue)


## Install

    % npm i philips-hue-cmd -g


## Usage

    % philips-hue lights            # get Lights
    % philips-hue on                # turn on all
    % philips-hue off --light 1,2   # turn off 1,2
    % philips-hue --bri 120 --hue 30000 --sat 180
    % philips-hue --bri 120 --hue 30000 --sat 180 --light 3
    % philips-hue --effect colorloop
    % philips-hue --alert lselect

![screen shot](https://gyazo.com/c13e1a44699879a1858251b86882be8f.png)
