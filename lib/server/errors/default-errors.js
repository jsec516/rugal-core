var util = require('util'),
    each = require('lodash/each'),
    IgnitionError = require('./ignition-error'),
    merge = require('lodash/merge');

var errors = {
    InternalServerError: function InternalServerError(options) {
        IgnitionError.call(this, merge({
            statusCode: 500,
            level: 'critical',
            errorType: 'InternalServerError',
            message: 'The server has encountered an error.'
        }, options));
    },
    NotFoundError: function NotFoundError(options) {
        IgnitionError.call(this, merge({
            statusCode: 404,
            errorType: 'NotFoundError',
            message: 'Resource could not be found.'
        }, options));
    },
    BadRequestError: function BadRequestError(options) {
        IgnitionError.call(this, merge({
            statusCode: 400,
            errorType: 'BadRequestError',
            message: 'The request could not be understood.'
        }, options));
    },
    UnauthorizedError: function UnauthorizedError(options) {
        IgnitionError.call(this, merge({
            statusCode: 401,
            errorType: 'UnauthorizedError',
            message: 'You are not authorised to make this request.'
        }, options));
    },
    NoPermissionError: function NoPermissionError(options) {
        IgnitionError.call(this, merge({
            statusCode: 403,
            errorType: 'NoPermissionError',
            message: 'You do not have permission to perform this request.'
        }, options));
    },
    ValidationError: function ValidationError(options) {
        IgnitionError.call(this, merge({
            statusCode: 422,
            errorType: 'ValidationError',
            message: 'The request failed validation.'
        }, options));
    },
     MaintenanceError: function MaintenanceError(options) {
        IgnitionError.call(this, merge({
            statusCode: 503,
            errorType: 'MaintenanceError',
            message: 'The server is temporarily down for maintenance.'
        }, options));
    },
    MethodNotAllowedError: function MethodNotAllowedError(options) {
        IgnitionError.call(this, merge({
            statusCode: 405,
            errorType: 'MethodNotAllowedError',
            message: 'Method not allowed for resource.'
        }, options));
    },
    RequestEntityTooLargeError: function RequestEntityTooLargeError(options) {
        IgnitionError.call(this, merge({
            statusCode: 413,
            errorType: 'RequestEntityTooLargeError',
            message: 'Request was too big for the server to handle.'
        }, options));
    },
    TokenRevocationError: function TokenRevocationError(options) {
        IgnitionError.call(this, merge({
            statusCode: 503,
            errorType: 'TokenRevocationError',
            message: 'Token is no longer available.'
        }, options));
    }
};

util.inherits(IgnitionError, Error);
each(errors, function (error) {
    util.inherits(error, IgnitionError);
});


module.exports = errors;
