# philips-hue-cmd

CLI for [Philips Hue bridge API](http://www.developers.meethue.com/philips-hue-api)


- https://github.com/shokai/node-philips-hue
- https://npmjs.com/package/philips-hue-cmd

[![Circle CI](https://circleci.com/gh/shokai/node-philips-hue.svg?style=svg)](https://circleci.com/gh/shokai/node-philips-hue)


## Install

    % npm i philips-hue-cmd -g


## Usage

    % philips-hue --help
    % philips-hue --lights
    % philips-hue on
    % philips-hue off --light 1
    % philips-hue --bri 80 --hue 25000 --light 2
    % philips-hue --effect colorloop
    % philips-hue --alert lselect
