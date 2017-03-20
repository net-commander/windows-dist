"use strict";
const _ = require("lodash");
function createUUID() {
    const S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
exports.createUUID = createUUID;
function escapeRegExp(str) {
    const special = ["[", "]", "(", ")", "{", "}", "*", "+", ".", "|", "||"];
    for (let n = 0; n < special.length; n++) {
        str = str.replace(special[n], "\\" + special[n]);
    }
    return str;
}
exports.escapeRegExp = escapeRegExp;
;
function findOcurrences(expression, delimiters) {
    const d = {
        begin: escapeRegExp(delimiters.begin),
        end: escapeRegExp(delimiters.end)
    };
    return expression.match(new RegExp(d.begin + "([^" + d.end + "]*)" + d.end, 'g'));
}
exports.findOcurrences = findOcurrences;
;
function multipleReplace(str, hash) {
    // to array
    const a = [];
    for (let key in hash) {
        a[a.length] = key;
    }
    return str.replace(new RegExp(a.join('\\b|\\b'), 'g'), function (m) {
        return hash[m] || hash["\\" + m];
    });
}
exports.multipleReplace = multipleReplace;
;
function replaceAll(find, replace, str) {
    return str ? str.split(find).join(replace) : '';
}
exports.replaceAll = replaceAll;
;
function replace(str, needle, what, delimiters) {
    if (!str) {
        return '';
    }
    if (what && _.isObject(what) || _.isArray(what)) {
        what = what;
        if (delimiters) {
            const ocurr = findOcurrences(str, delimiters);
            if (ocurr) {
                for (let i = 0, j = ocurr.length; i < j; i++) {
                    let el = ocurr[i];
                    // strip off delimiters
                    let _variableName = replaceAll(delimiters.begin, '', el);
                    _variableName = replaceAll(delimiters.end, '', _variableName);
                    str = replaceAll(el, (what[_variableName]), str);
                }
            }
            else {
                return str;
            }
        }
        else {
            // fast case
            return multipleReplace(str, what);
        }
        return str;
    }
    // fast case
    return replaceAll(needle, what, str);
}
exports.replace = replace;
;
//# sourceMappingURL=StringUtils.js.map