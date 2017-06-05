var uuid = require('uuid'),
    util = require('util'),
    each = require('lodash/each'),
    utils = require('./utils'),
    merge = require('lodash/merge'),
    isString = require('lodash/isString');

function IgnitionError(options) {
    options = options || {};
    var self = this;

    if (isString(options)) {
        throw new Error('Please instantiate Errors with the option pattern. e.g. new errors.IgnitionError({message: ...})');
    }

    Error.call(this);
    Error.captureStackTrace(this, IgnitionError);

    /**
     * defaults
     */
    this.statusCode = 500;
    this.errorType = 'InternalServerError';
    this.level = 'normal';
    this.message = 'The server has encountered an error.';
    this.id = uuid.v1();

    /**
     * custom overrides
     */
    this.id = options.id || this.id;
    this.statusCode = options.statusCode || this.statusCode;
    this.level = options.level || this.level;
    this.context = options.context || this.context;
    this.help = options.help || this.help;
    this.errorType = this.name = options.errorType || this.errorType;
    this.errorDetails = options.errorDetails;
    this.redirect = options.redirect || null;
    this.message = options.message || this.message;
    this.hideStack = options.hideStack;

    // error to inherit from, override!
    // nested objects are getting copied over in one piece (can be changed, but not needed right now)
    // support err as string (it happens that third party libs return a string instead of an error instance)
    if (options.err) {
        if (isString(options.err)) {
            options.err = new Error(options.err);
        }

        Object.getOwnPropertyNames(options.err).forEach(function (property) {
            if (['errorType', 'name', 'statusCode', 'message', 'level'].indexOf(property) !== -1) {
                return;
            }

            if (property === 'stack') {
                self[property] += '\n\n' + options.err[property];
                return;
            }

            self[property] = options.err[property] || self[property];
        });
    }
}

module.exports = IgnitionError;
