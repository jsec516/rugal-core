import { isBoolean } from "lodash";
const url = require('url');
const config = require('../config');

function deduplicateSubDir(url) {
    var subDir = getSubdir(),
        subDirRegex;

    if (!subDir) {
        return url;
    }

    subDir = subDir.replace(/^\/|\/+$/, '');
    subDirRegex = new RegExp(subDir + '\/' + subDir + '\/');

    return url.replace(subDirRegex, subDir + '/');
}

// ## createUrl
// Simple url creation from a given path
// Ensures that our urls contain the subdirectory if there is one
// And are correctly formatted as either relative or absolute
// Usage:
// createUrl('/', true) -> http://my-ghost-blog.com/
// E.g. /blog/ subdir
// createUrl('/welcome-to-ghost/') -> /blog/welcome-to-ghost/
// Parameters:
// - urlPath - string which must start and end with a slash
// - absolute (optional, default:false) - boolean whether or not the url should be absolute
// - secure (optional, default:false) - boolean whether or not to force SSL
// Returns:
//  - a URL which always ends with a slash
export function createUrl(urlPath, absolute, secure): string {
    urlPath = urlPath || '/';
    absolute = absolute || false;
    var base;

    // create base of url, always ends without a slash
    if (absolute) {
        base = getAppUrl(secure);
    } else {
        base = getSubdir();
    }

    return urlJoin(base, urlPath);
}

/**
 * Returns the base URL of the app as set in the config.
 *
 * Secure:
 * If the request is secure, we want to force returning the blog url as https.
 * Imagine Rugal runs with http, but nginx allows SSL connections.
 *
 * @param {boolean} secure
 * @return {string} URL returns the url as defined in config, but always with a trailing `/`
 */
export function getAppUrl(secure): string {
    var appUrl;

    if (secure) {
        appUrl = config.get('url').replace('http://', 'https://');
    } else {
        appUrl = config.get('url');
    }

    if (!appUrl.match(/\/$/)) {
        appUrl += '/';
    }

    return appUrl;
}

/**
 * Returns a subdirectory URL, if defined so in the config.
 * @return {string} URL a subdirectory if configured.
 */
export function getSubdir(): string {
    var localPath, subdir;

    // Parse local path location
    if (config.get('url')) {
        localPath = url.parse(config.get('url')).path;

        // Remove trailing slash
        if (localPath !== '/') {
            localPath = localPath.replace(/\/$/, '');
        }
    }

    subdir = localPath === '/' ? '' : localPath;
    return subdir;
}

// ## urlFor
// Synchronous url creation for a given context
// Can generate a url for a named path, given path, or known object (post)
// Determines what sort of context it has been given, and delegates to the correct generation method,
// Finally passing to createUrl, to ensure any subdirectory is honoured, and the url is absolute if needed
// Usage:
// urlFor('home', true) -> http://my-ghost-blog.com/
// E.g. /blog/ subdir
// urlFor({relativeUrl: '/my-static-page/'}) -> /blog/my-static-page/
export function urlFor(context, data?, absolute?): string {
    let urlPath = '/',
        secure,
        baseUrl,
        hostname;
    // Make data properly optional
    if (isBoolean(data)) {
        absolute = data;
        data = null;
    }

    // Can pass 'secure' flag in either context or data arg
    secure = (context && context.secure) || (data && data.secure);

    if (context === 'home' && absolute) {
        urlPath = getAppUrl(secure);

        // CASE: with or without protocol?
        // @TODO: rename cors
        if (data && data.cors) {
            urlPath = urlPath.replace(/^.*?:\/\//g, '//');
        }

        // CASE: there are cases where urlFor('home') needs to be returned without trailing
        // slash e. g. the `{{@blog.url}}` helper. See https://github.com/TryGhost/Ghost/issues/8569
        if (data && data.trailingSlash === false) {
            urlPath = urlPath.replace(/\/$/, '');
        }
    }

    // This url already has a protocol so is likely an external url to be returned
    // or it is an alternative scheme, protocol-less, or an anchor-only path
    if (urlPath && (urlPath.indexOf('://') !== -1 || urlPath.match(/^(\/\/|#|[a-zA-Z0-9\-]+:)/))) {
        return urlPath;
    }

    return createUrl(urlPath, absolute, secure);
}

/** urlJoin
 * Returns a URL/path for internal use in Rugal.
 * @param {array} args takes args and concats those to a valid path/URL.
 * @return {string} URL concatinated URL/path of arguments.
 */
export function urlJoin(...args): string {
    var prefixDoubleSlash = false,
        url;
    
    // Remove empty item at the beginning
    if (args[0] === '') {
        args.shift();
    }

    // Handle schemeless protocols
    if (args[0].indexOf('//') === 0) {
        prefixDoubleSlash = true;
    }

    // join the elements using a slash
    url = args.join('/');

    // Fix multiple slashes
    url = url.replace(/(^|[^:])\/\/+/g, '$1/');

    // Put the double slash back at the beginning if this was a schemeless protocol
    if (prefixDoubleSlash) {
        url = url.replace(/^\//, '//');
    }

    url = deduplicateSubDir(url);
    return url;
}
