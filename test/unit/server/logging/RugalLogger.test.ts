import { RugalLogger } from "../../../../server/logging/RugalLogger";
var assert = require('chai').assert;
describe('RugalLogger', () => {
    let logger;
    before((done) => {
        logger = new RugalLogger({});
        done();
    })
    it('should have be instance of RugalLogger', () => {
        // logger.error(new Error('test'));
        assert(logger instanceof RugalLogger);
    });

    it('should have a log function', () => {
        assert(typeof logger.log === 'function');
    });

    it('should have a info function', () => {
        assert(typeof logger.info === 'function');
    });

    it('should have a error function', () => {
        assert(typeof logger.error === 'function');
    });
});