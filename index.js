// # Rugal Core Startup
console.time('RugalC boot');
require('ts-node/register');
var debug           = require('debug')('rugalC:boot:index'),
    errors          = require('./server/errors'),
    express         = require('express'),
    expressApp      = express(),
    serverFactory   = require('./server').init;

debug('Initializing Rugal Core');
/**
 * get server instance
 * start the server
 */
serverFactory()
    .then(function startServer(rugalServer) {
        debug('Starting Server');
        rugalServer.start(expressApp)
            .then(function afterServerStart() {
                console.timeEnd('RugalC boot');
                debug('Server get started');
            })
    }).catch(errors.handleError);
