import logger from "../logging";

const uuid = require('uuid');

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
            logger.info({req: req, res: res});
        }

        res.removeListener('finish', logResponse);
        res.removeListener('close', logResponse);
    }

    res.removeListener('finish', logResponse);
    res.removeListener('close', logResponse);
    next();
}
