var config = require('../config');

export function init() {
    let client = config.get('cache:client');
    let connectionInfo = config.get('cache:connection');
    let init = require('./' + client).init;
    return init(connectionInfo);
}