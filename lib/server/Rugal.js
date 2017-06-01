var util = require('util');
var events = require('events');

function Rugal(options) {
  // Inherit methods from EventEmitter
  events.EventEmitter.call(this);

  // Remove memory-leak warning about max listeners
  // See: http://nodejs.org/docs/latest/api/events.html#events_emitter_setmaxlisteners_n
  this.setMaxListeners(0);
  
  // express app instance
  this.rootApp = options && options.parentApp;
}

Rugal.prototype.start = function start(parentApp) {
    // call initailize
    // call start
    // emit server event with server instance
    this.emit('server', this);
}
