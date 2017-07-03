import makeDebug from "debug";
import logRequest from './middleware/log-request';
import api from '../application/api';
import admin from '../application/admin';
import frontend from '../application/frontend';

var express = require('express'),
    // app requires
    config = require('./config'),
    // middleware
    compress = require('compression');

const debug = makeDebug('rugalC:app');

export function setupParentApp() {
    debug('ParentApp setup start');
    var parentApp = express();
    parentApp.use(logRequest);

    if (debug.enabled) {
        // debug keeps a timer, so this is super useful
        parentApp.use((function () {
            var reqDebug = require('debug')('ghost:req');
            return function debugLog(req, res, next) {
                reqDebug('Request', req.originalUrl);
                next();
            };
        })());
    }

    // enabled gzip compression by default
    if (config.get('compress') !== false) {
        parentApp.use(compress());
    }

    // Mount the  apps on the parentApp
    // API
    parentApp.use('/rugal/api/v0.1/', api());

    // ADMIN
    parentApp.use('/ghost', admin());

    // Front
    parentApp.use(frontend());

    debug('ParentApp setup end');

    return parentApp;
}