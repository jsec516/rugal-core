import BaseError from "./BaseError";

export function handleError(err) {
    if (!(err instanceof BaseError)) {
        err = new BaseError({err: err});
    }

    if (process.send) {
        process.send({started: false, error: err.message});
    }

    // logging.error(err);
    process.exit(-1);
}