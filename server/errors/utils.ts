import BaseError from "./BaseError";

/**
 * this will handle all the error that will happen during server start
 * when that method will fire in code, there is no way we can keep up the server
 * before terminate the server instance send the error to master if it's a worker process in cluster
 * @param err error that has happened 
 */
export function handleServerError(err) {
    if (!(err instanceof BaseError)) {
        err = new BaseError({err: err});
    }

    if (process.send) {
        process.send({started: false, error: err.message});
    }

    //TODO: send error to logger too.
    // logging.error(err);
    process.exit(-1);
}