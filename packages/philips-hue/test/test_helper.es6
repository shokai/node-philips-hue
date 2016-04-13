process.env.NODE_ENV = 'test';

module.exports = {
  configFile: `${process.env.HOME}/.philips-hue.json`
};

Promise.delay = function(msec){
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, msec);
  });
};


