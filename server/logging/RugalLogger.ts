import { each, isObject, isArray } from "lodash";
import { RugalPrettyStream } from './RugalPrettyStream';

const   bunyan = require('bunyan'),
        fs     = require('fs'),
        jsonStringifySafe = require('json-stringify-safe');

export class RugalLogger{
    env: string;
    domain: string;
    transports: string[];
    level: string;
    mode: string;
    path: string;
    rotation: any;
    serializers: any;
    streams: any;

    constructor(options:any) {
        this.env = options.env || 'development';
        this.domain = options.domain || 'localhost';
        this.transports = options.transports || ['stdout'];
        this.level = process.env.LEVEL || options.level || 'info';
        this.mode = process.env.MODE || options.mode || 'short';
        this.path = options.path || process.cwd();

        // special env variable to enable long mode and level info
        if (process.env.LOIN) {
            this.level = 'info';
            this.mode = 'long';
        }

        // ensure we have a trailing slash
        if (!this.path.match(/\/$|\\$/)) {
            this.path = this.path + '/';
        }

        this.rotation = options.rotation || {
            enabled: false,
            period: '1w',
            count: 100
        };

        this.streams = {};
        this.setSerializers();
        each(this.transports, (transport) => {
            let currentStream = 'set' + transport.slice(0, 1).toUpperCase() + transport.slice(1) + 'Stream';
            this[currentStream]();
        });
    }

    /**
     * Because arguments can contain lot's of different things, we prepare the arguments here.
     * This function allows us to use logging very flexible!
     *
     * logging.info('HEY', 'DU') --> is one string
     * logging.info({}, {}) --> is one object
     * logging.error(new Error()) --> is {err: new Error()}
     */
    log(type, args) {
        let modifiedArguments: any;
        if (!isArray(args)) {
            args = [args];
        }
        each(args, (value) => {
            if (value instanceof Error) {
                if (!modifiedArguments) {
                    modifiedArguments = {};
                }

                modifiedArguments.err = value;
            } else if (isObject(value)) {
                if (!modifiedArguments) {
                    modifiedArguments = {};
                }

                var keys = Object.keys(value);
                each(keys, function (key) {
                    modifiedArguments[key] = value[key];
                });
            } else {
                if (!modifiedArguments) {
                    modifiedArguments = '';
                }

                modifiedArguments += value;
                modifiedArguments += ' ';
            }
        });

        each(this.streams, (logger) => {
            // only stream the log if regex matches log entry
            // use jsonStringifySafe because req/res can contain circular dependencies
            if (logger.match) {
                if (new RegExp(logger.match).test(jsonStringifySafe(modifiedArguments).replace(/"/g, ''))) {
                    logger.log[type](modifiedArguments);
                }
            } else {
                logger.log[type](modifiedArguments);
            }
        });
    }

    info(args) {
        this.log('info', args);
    }
    warn(args) {
        this.log('warn', args);
    }

    error(args) {
        this.log('error', args);
    }
    private setStdoutStream () {
        var prettyStdOut = new RugalPrettyStream({
            mode: this.mode
        });

        prettyStdOut.pipe(process.stdout);

        this.streams.stdout = {
            name: 'stdout',
            log: bunyan.createLogger({
                name: 'Log',
                streams: [{
                    type: 'raw',
                    stream: prettyStdOut,
                    level: this.level
                }],
                serializers: this.serializers
            })
        };
    }
    
    /**
     * by default we log into two files
     * 1. file-errors: all errors only
     * 2. file-all: everything
     */
    private setFileStream() {
        // e.g. http://my-domain.com --> http___my_domain_com
        var sanitizedDomain = this.domain.replace(/[^\w]/gi, '_');

        // CASE: target log folder does not exist, show warning
        if (!fs.pathExistsSync(this.path)) {
            console.error('Target log folder does not exist: ' + this.path);
            return;
        }

        this.streams['file-errors'] = {
            name: 'file',
            log: bunyan.createLogger({
                name: 'Log',
                streams: [{
                    path: this.path + sanitizedDomain + '_' + this.env + '.error.log',
                    level: 'error'
                }],
                serializers: this.serializers
            })
        };

        this.streams['file-all'] = {
            name: 'file',
            log: bunyan.createLogger({
                name: 'Log',
                streams: [{
                    path: this.path + sanitizedDomain + '_' + this.env + '.log',
                    level: this.level
                }],
                serializers: this.serializers
            })
        };

        if (this.rotation.enabled) {
            this.streams['rotation-errors'] = {
                name: 'rotation-errors',
                log: bunyan.createLogger({
                    name: 'Log',
                    streams: [{
                        type: 'rotating-file',
                        path: this.path + sanitizedDomain + '_' + this.env + '.error.log',
                        period: this.rotation.period,
                        count: this.rotation.count,
                        level: "error"
                    }],
                    serializers: this.serializers
                })
            };

            this.streams['rotation-all'] = {
                name: 'rotation-all',
                log: bunyan.createLogger({
                    name: 'Log',
                    streams: [{
                        type: 'rotating-file',
                        path: this.path + sanitizedDomain + '_' + this.env + '.log',
                        period: this.rotation.period,
                        count: this.rotation.count,
                        level: this.level
                    }],
                    serializers: this.serializers
                })
            };
        }
    }

    private setSerializers() {
        this.serializers = {
            req: (req) => {
                return {
                    meta: {
                        requestId: req.requestId,
                        userId: req.userId
                    },
                    url: req.url,
                    method: req.method,
                    originalUrl: req.originalUrl,
                    params: req.params,
                    headers: this.removeSensitiveData(req.headers),
                    body: this.removeSensitiveData(req.body),
                    query: this.removeSensitiveData(req.query)
                };
            },
            res: (res) => {
                return {
                    _headers: this.removeSensitiveData(res._headers),
                    statusCode: res.statusCode,
                    responseTime: res.responseTime
                };
            },
            err: (err) => {
                return {
                    id: err.id,
                    domain: this.domain,
                    code: err.code,
                    name: err.errorType,
                    statusCode: err.statusCode,
                    level: err.level,
                    message: err.message,
                    context: err.context,
                    help: err.help,
                    stack: err.stack,
                    hideStack: err.hideStack,
                    errorDetails: err.errorDetails
                };
            }
        };
    }

    private removeSensitiveData(obj: object) {
         var newObj = {};

        each(obj, (value, key) => {
            try {
                if (isObject(value)) {
                    value = this.removeSensitiveData(value);
                }

                if (!key.match(/pin|password|authorization|cookie/gi)) {
                    newObj[key] = value;
                }
            } catch (err) {
                newObj[key] = value;
            }
        });

        return newObj;
    }
}
