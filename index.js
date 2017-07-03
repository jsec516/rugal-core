// # Rugal Core Startup
console.time('RugalC boot');
require('ts-node/register');
var debug           = require('debug')('rugalC:index'),
    errors          = require('./server/errors'),
    logging         = require('./server/logging'),
    express         = require('express'),
    expressApp      = express(),
    serverFactory   = require('./server').init;

debug('initializing Rugal Web Instance...');
/**
 * get server instance
 * start the server
 */
serverFactory()
    .then(function startServer(rugalServer) {
        rugalServer.start(expressApp)
            .then(function afterServerStart() {
                console.timeEnd('RugalC boot');
                debug('Server get started');
            })
    }).catch(errors.handleError);
