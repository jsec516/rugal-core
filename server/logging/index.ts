var config = require('../config');

import { RugalLogger } from './RugalLogger';

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
