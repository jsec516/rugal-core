var config = require('../config');

export function init() {
    let client = config.get('database:client');
    let connectionInfo = config.get('database:connection');
    let init = require('./' + client).init;
    return init(connectionInfo);
}
