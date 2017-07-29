import logger from "../logging";

const uuid = require('uuid');

/**
 * log the duration for each request
 * @param req 
 * @param res 
 * @param next next middlware
 */
export default function logRequest(req, res, next) {
    let startTime = Date.now(),
        requestId = uuid.v1();

    function logResponse() {
        res.responseTime = (Date.now() - startTime) + 'ms';
        req.requestId = requestId;
        req.userId = req.user ? (req.user.id ? req.user.id : req.user) : null;

        if (req.err) {
            logger.error({req: req, res: res, err: req.err});
        } else {
            logger.info('response time ', res.responseTime);
        }

        res.removeListener('finish', logResponse);
        res.removeListener('close', logResponse);
    }

    res.on('finish', logResponse);
    res.on('close', logResponse);
    next();
}
