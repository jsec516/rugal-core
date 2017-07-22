import { isString } from "lodash";
const uuid = require('uuid');

import { ErrorLevel, ErrorOptions } from '../types/errors'

/**
 * this is the base class for all error instance in our app
 * it's actually a generic class which will be inherited by more specific class
 */

export default class BaseError extends Error {
    context: any;
    errorType: string;
    help: any;
    id: string;
    level: ErrorLevel;
    message: string;
    statusCode: number;

    constructor(options?: ErrorOptions) {
        super();
        // omit that file reference from stacktrace
        Error.captureStackTrace(this, BaseError);
        this.context = options.context || null;
        this.errorType = options.errorType || 'InternalServerError';
        this.help = options.help || null;
        this.id = options.id || uuid.v1();
        this.level = options.level || 'normal';
        this.message = options.message || 'The server has encountered an error.';
        this.statusCode = options.statusCode || 500;
        
        this.convertErrToBase(options.err);
    }

    /**
     * convert err to BaseError compatible error 
     * we will try not pass err on our own, but sometimes we will get thrid party error
     * which needs to convert to BaseError so that behavior can be consistent across the app 
     * @param err error that we need to convert
     */
    private convertErrToBase(err) {
        if (!err) {
            return;
        }
        
        if (isString(err)) {
            err = new Error(err);
        }

        Object.getOwnPropertyNames(err).forEach((property) => {
            if (property === 'stack') {
                this[property] += '\n\n' + err[property];
                return;
            }

            this[property] = err[property] || this[property];
        });
    }
}
