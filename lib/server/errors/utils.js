/**
 * instanceof mostly fails, if multiple sub dependencies use it's own ignition installation
 */
exports.isIgnitionError = function isIgnitionError(err) {
    var IgnitionName = this.IgnitionError && this.IgnitionError.name;

    var recursiveIsIgnitionError = function recursiveIsIgnitionError(obj) {
        // no super constructor available anymore
        if (!obj) {
            return false;
        }

        if (obj.name === IgnitionName) {
            return true;
        }

        return recursiveIsIgnitionError(obj.super_);
    };

    return recursiveIsIgnitionError(err.constructor);
};
