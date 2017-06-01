var assert = require('chai').assert;
var config = require('../../../../server/config');

describe('config', function() {
	it('should have all the configuration', function() {
		assert.deepEqual(config.get('server'), { "host": "127.0.0.1", "port": 2368 })
	})
});
