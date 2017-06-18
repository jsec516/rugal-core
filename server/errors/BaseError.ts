import { isString } from "lodash";
const uuid = require('uuid');

type ErrorLevel = "normal" | "critical";

export default class BaseError extends Error {
    id: string;
    context: any;
    errorType: string;
    help: any;
    level: ErrorLevel;
    message: string;
    statusCode: number;

    constructor(options?:any) {
        super();
        Error.captureStackTrace(this, BaseError);
        this.id = options.id || uuid.v1();
        this.context = options.context || null;
        this.errorType = options.errorType || 'InternalServerError';
        this.help = options.help || null;
        this.level = options.level || 'normal';
        this.message = options.message || 'The server has encountered an error.';
        this.statusCode = options.statusCode || 500;
        this.convertErrToBase(options.err);
    }

    private convertErrToBase(err) {
        if (!err) {
            return;
        }
        
        if (isString(err)) {
            err = new Error(err);
        }

        Object.getOwnPropertyNames(err).forEach((property) => {
            if (['errorType', 'name', 'statusCode', 'message', 'level'].indexOf(property) !== -1) {
                return;
            }

            if (property === 'stack') {
                this[property] += '\n\n' + err[property];
                return;
            }

            this[property] = err[property] || this[property];
        });
    }
}
