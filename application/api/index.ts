export default function initApi() {
    return function(req, res, next) {
        next();
    }
}