import chalk from 'chalk';
import MessageFormat from 'intl-messageformat'
import makeDebug from "debug";
import { readFileSync } from "fs";
import { isArray, isEmpty, isNull, isString} from "lodash";

const   debug               = makeDebug('rugalC:server:i18n'),
        supportedLocales    = ['en'];

// TODO: fetch currentLocale dynamically based on config settings (`key = "default_locale"`) in the `settings` table
let     currentLocale       = 'en',
        blos;

/**
 * Setup i18n support:
 *  - Load proper language file in to memory
 *  - Polyfill node.js if it does not have Intl support or support for a particular locale
 */
export function init() {
    debug('initializing i18n...');
    // read file for current locale and keep its content in memory
    blos = readFileSync(__dirname + '/translations/' + currentLocale + '.json');

    // if translation file is not valid, you will see an error
    try {
        blos = JSON.parse(blos);
    } catch (err) {
        blos = undefined;
        throw err;
    }

    if (global.Intl) {
        // Determine if the built-in `Intl` has the locale data we need.
        let hasBuiltInLocaleData,
            IntlPolyfill;

        hasBuiltInLocaleData = supportedLocales.every(function (locale) {
            return Intl.NumberFormat.supportedLocalesOf(locale)[0] === locale &&
                Intl.DateTimeFormat.supportedLocalesOf(locale)[0] === locale;
        });

        if (!hasBuiltInLocaleData) {
            // `Intl` exists, but it doesn't have the data we need, so load the
            // polyfill and replace the constructors with need with the polyfill's.
            IntlPolyfill = require('intl');
            Intl.NumberFormat   = IntlPolyfill.NumberFormat;
            Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
        }
    } else {
        // No `Intl`, so use and load the polyfill.
        global.Intl = require('intl');
    }
}

/**
 * Parse JSON file for matching locale, returns string giving path.
 *
 * @param {string} msgPath Path with in the JSON language file to desired string (ie: "errors.init.jsNotBuilt")
 * @returns {string}
 */
export function findString(msgPath: string): string | Array<any> {
    var matchingString, path;
    // no path? no string
    if (isEmpty(msgPath) || !isString(msgPath)) {
        chalk.yellow('i18n:t() - received an empty path.');
        return '';
    }

    if (blos === undefined) {
        init();
    }

    matchingString = blos;

    path = msgPath.split('.');
    path.forEach(function (key) {
        // reassign matching object, or set to an empty string if there is no match
        matchingString = matchingString[key] || null;
    });

    if (isNull(matchingString)) {
        console.error('Unable to find matching path [' + msgPath + '] in locale file.\n');
        matchingString = 'i18n error: path "' + msgPath + '" was not found.';
    }

    return matchingString;
}

/**
 * Helper method to find and compile the given data context with a proper string resource.
 *
 * @param {string} path Path with in the JSON language file to desired string (ie: "errors.init.jsNotBuilt")
 * @param {object} [bindings]
 * @returns {string}
 */
export function t(path: string, bindings?: {[key: string]: any}): string {
    var string: string | Array<any> = findString(path),
        msg = [];

    // If the path returns an array (as in the case with anything that has multiple paragraphs such as emails), then
    // loop through them and return an array of translated/formatted strings. Otherwise, just return the normal
    // translated/formatted string.
    if (isArray(string)) {
        string.forEach(function (s) {
            var m = new MessageFormat(s, currentLocale);
            msg.push(m.format(bindings));
        });
    } else {
        let m = new MessageFormat(string, currentLocale);
        msg.push(m.format(bindings));
    }

    return msg.join('\n\n');
}