const express = require('express');

import makeDebug from "debug";
import cors from '../../server/middleware/cors';
import Settings from "./controllers/settings";

const debug = makeDebug('rugalC:api');

function apiRoutes() {
    var apiRouter = express.Router();

    // ## CORS pre-flight check
    apiRouter.options('*', cors);

    // ## Settings
    apiRouter.get('/settings', Settings.index);
    return apiRouter;
}

export default function initApi() {
    debug('API setup start');
    var apiApp = express();

    // Routing
    apiApp.use(apiRoutes());

    // API error handling
    // apiApp.use(errorHandler.resourceNotFound);
    // apiApp.use(errorHandler.handleJSONResponse);

    debug('API setup end');

    return apiApp;
}