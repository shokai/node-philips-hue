"use strict";

process.env.NODE_ENV = 'test';

Promise.delay = function(msec){
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, msec);
  });
};
