
module.exports = Rugal;

function Rugal(orm) {
    this.orm = orm;
    this.product = require('./product')(this);
}

// it will not work because `this` is empty object at that stage
// Rugal.prototype.product = require('./product')(this);