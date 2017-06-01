// # Rugal Core Startup
// Orchestrates the startup of Rugal Core when run from command line.
console.time('RugalC boot');

var debug = require('debug')('rugalC:boot:index'),
    rugalC, rugalCIns, express, logging, errors, utils, parentApp;

rugalC      = require('./core');
express     = require('express');
parentApp   = express();
//@TODO: separate them on repo
logging = require('./core/server/logging');
errors = require('./core/server/errors');
utils = require('./core/server/utils');

debug('Initializing Rugal Core');
rugalC().then(function startServer(rugalServer) {
    debug('Starting Server');
    rugalServer.start(parentApp).then(function afterServerStart() {
        console.timeEnd('RugalC boot');
        debug('Server get started');
    })
}).catch(function handleInsError(err) {
    // if (!errors.utils.isIgnitionError(err)) {
    //     err = new errors.RugalError({err: err});
    // }

    if (process.send) {
        process.send({started: false, error: err.message});
    }

    // logging.error(err);
    process.exit(-1);
});
