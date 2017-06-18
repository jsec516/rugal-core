import makeDebug from "debug";
const Promise = require("bluebird");

const debug = makeDebug('rugalC:boot:init');

interface Server {
  start();
}

export function init(options) {
  let serverObj:Server = {
    start: function() {
      debug('Start Server Has Been Called');
      return Promise.resolve(true);
    }
  };
  return Promise.resolve(serverObj);
}
