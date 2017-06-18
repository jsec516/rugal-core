/**
 * this file is responsible for product related functionality
 */
module.exports = function(rugal) {
    var orm = rugal.orm;
    console.log(rugal);
    return {
        create: function create() {
            orm.create();
        },
        update: function update() {

        },
        destroy: function destroy() {

        },
        read: function read() {

        },
        list: function list() {

        }
    }
};