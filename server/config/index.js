var Nconf = require('nconf'),
    path = require('path'),
    _debug = require('debug'),
    debug = _debug('rugalC:server:config'),
    env = process.env.NODE_ENV || 'development';

function loadNconf(options = {}) {
    debug('initalizing config...');

    var baseConfigPath = __dirname,
    customConfigPath = options.customConfigPath || process.cwd(),
    nconf = new Nconf.Provider();

    // no channel can override the overrides
    nconf.file('overrides', path.join(baseConfigPath, 'overrides.json'));

    // command line arguments
    nconf.argv();

    // env arguments
    nconf.env();
    nconf.file('custom-env', path.join(customConfigPath, 'application', 'config', env+'.json'));
    nconf.file('defaults', path.join(baseConfigPath, 'defaults.json'));

    nconf.set('env', env);

    // Wrap this in a check, because else nconf.get() is executed unnecessarily
    // To output this, use DEBUG=rugalC:*,rugalC-config
    if (_debug.enabled('rugalC-config')) {
        debug(nconf.get());
    }

    debug('config done');
    return nconf;
}

module.exports = loadNconf();
module.exports.loadNconf = loadNconf;
