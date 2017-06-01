var debug = require('debug')('rugalC:boot:init'),
    Promise = require('bluebird');

function init(options) {
  return Promise.resolve({start: function() {
    debug('Start Server Has Been Called');
    return true;
  }})
}

module.exports = init;