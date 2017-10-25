require('ts-node/register');
const   performance     = require('./server/utils/performance').init();
performance.start();

const   debug           = require('debug')('rugalC:index'),
        express         = require('express'),
        errors          = require('./server/errors'),
        generateServer  = require('./server').init,
        logger          = require('./server/logging').default;       ;

debug('initializing Rugal Server Instance...');

generateServer()
    .then(function startServer(server) {
        server.start()
        .then(function afterServerStart() {
            debug('Server get started');
            performance.end();
            logger.info('Server get started, time taken ', performance.result());
        });
    })
    .catch(errors.handleServerError);
