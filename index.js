console.time('RugalC boot');
require('ts-node/register');

var debug           = require('debug')('rugalC:index'),
    express         = require('express'),

    errors          = require('./server/errors'),
    expressApp      = express(),
    logging         = require('./server/logging'),
    serverFactory   = require('./server').init;

debug('initializing Rugal Web Instance...');

/**
 * this will prepare the express app instance, act as server for us
 * serverFactory() will do the trick for us and returns express instance
 * using that we will start the server which will listen for request
 * at the end of the day, delegate any kind of server related error to error module
 */
serverFactory()
.then(function startServer(rugalServer) {
    rugalServer.start()
    .then(function afterServerStart() {
        console.timeEnd('RugalC boot');
        debug('Server get started');
    });
}).catch(errors.handleServerError);
