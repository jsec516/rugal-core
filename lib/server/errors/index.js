var util = require('util'),
    IgnitionError = require('./ignition-error'),
    defaultErrors = require('./default-errors'),
    each = require('lodash/each'),
    merge = require('lodash/merge'),
    utils = require('./utils');

function RugalCError(options) {
    options = options || {};
    this.value = options.value;
    IgnitionError.call(this, options);
}

var rugalCErrors = {
    EmailError: function EmailError(options) {
        RugalCError.call(this, merge({
            statusCode: 500,
            errorType: 'EmailError'
        }, options));
    }
};

util.inherits(RugalCError, IgnitionError);
each(rugalCErrors, function (error) {
    util.inherits(error, RugalCError);
});

module.exports = merge(rugalCErrors, defaultErrors);
module.exports.RugalCError = RugalCError;
module.exports.utils  = {
    isIgnitionError: utils.isIgnitionError
};
module.exports.defaultErrors = defaultErrors;
module.exports.rugalCErrors = rugalCErrors;
