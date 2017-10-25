import makeDebug from "debug";
import { Express } from "express";
import admin from '../application/admin';
import api from '../application/api';
import frontend from '../application/frontend';
import logRequest from './middleware/log-request';

var     express = require('express'),
        config = require('./config'),
        compress = require('compression');

const   debug = makeDebug('rugalC:server:app');

export function getParentApp(): Express {
    debug('initalizing express parentApp...');
    let parentApp = express();
    parentApp.use(logRequest);

    if (debug.enabled) {
        parentApp.use(getDebugMiddleware());
    }

    // enabled gzip compression by default
    if (config.get('compress') !== false) {
        parentApp.use(compress());
    }

    // mount the endpoints
    parentApp.use('/api/v0.1/', api());
    parentApp.use('/admin', admin());
    parentApp.use(frontend());

    debug('parentApp done');

    return parentApp;
}

function getDebugMiddleware() {
    var reqDebug = makeDebug('rugalC:req:debug');
    return function debugLog(req, res, next) {
        reqDebug('Request', req.originalUrl);
        next();
    };
}