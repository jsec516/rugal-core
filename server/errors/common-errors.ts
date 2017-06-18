import { merge } from "lodash";
import BaseError from "./BaseError";

export class InternalServerError extends BaseError {
    constructor(args) {
        const options = merge({
            statusCode: 500,
            level: 'critical',
            errorType: 'InternalServerError',
            message: 'The server has encountered an error.'
        }, args);
        super(options);
    }
}

export class NotFoundError extends BaseError {
    constructor(args) {
        const options = merge({
            statusCode: 404,
            errorType: 'NotFoundError',
            message: 'Resource could not be found.'
        }, args);
        super(options);
    }
}

export class BadRequestError extends BaseError {
    constructor(args) {
        const options = merge({
            statusCode: 400,
            errorType: 'BadRequestError',
            message: 'The request could not be understood.'
        }, args);
        super(options);
    }
}

export class UnauthorizedError extends BaseError {
    constructor(args) {
        const options = merge({
            statusCode: 401,
            errorType: 'UnauthorizedError',
            message: 'You are not authorised to make this request.'
        }, args);
        super(options);
    }
}

export class NoPermissionError extends BaseError {
    constructor(args) {
        const options = merge({
            statusCode: 403,
            errorType: 'NoPermissionError',
            message: 'You do not have permission to perform this request.'
        }, args);
        super(options);
    }
}

export class ValidationError extends BaseError {
    constructor(args) {
        const options = merge({
            statusCode: 422,
            errorType: 'ValidationError',
            message: 'The request failed validation.'
        }, args);
        super(options);
    }
}

export class MaintenanceError extends BaseError {
    constructor(args) {
        const options = merge({
            statusCode: 503,
            errorType: 'MaintenanceError',
            message: 'The server is temporarily down for maintenance.'
        }, args);
        super(options);
    }
}

export class MethodNotAllowedError extends BaseError {
    constructor(args) {
        const options = merge({
            statusCode: 405,
            errorType: 'MethodNotAllowedError',
            message: 'Method not allowed for resource.'
        }, args);
        super(options);
    }
}

export class RequestEntityTooLargeError extends BaseError {
    constructor(args) {
        const options = merge({
            statusCode: 413,
            errorType: 'RequestEntityTooLargeError',
            message: 'Request was too big for the server to handle.'
        }, args);
        super(options);
    }
}

export class TokenRevocationError extends BaseError {
    constructor(args) {
        const options = merge({
            statusCode: 503,
            errorType: 'TokenRevocationError',
            message: 'Token is no longer available.'
        }, args);
        super(options);
    }
}

export class EmailError extends BaseError {
    constructor(args) {
        const options = merge({
            statusCode: 500,
            errorType: 'EmailError'
        }, args);
        super(options);
    }
}