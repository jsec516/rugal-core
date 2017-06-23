import { RugalLogger } from './RugalLogger';
// observe how ghost, traider managed it
// in sails it's in global sails object which was handy
// start the logger at the beginning of the req
// assign that on globals
// use it whereever required
var config = require('../config');
var logger = new RugalLogger({
    env: config.get('env'),
    path: config.get('logging:path'),
    domain: config.get('url'),
    mode: config.get('logging:mode'),
    level: config.get('logging:level'),
    transports: config.get('logging:transports'),
    loggly: config.get('logging:loggly'),
    rotation: config.get('logging:rotation')
});

export default logger;
export { RugalLogger } from './RugalLogger';
