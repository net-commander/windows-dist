"use strict";
const fs = require("fs");
const jp = require("jsonpath");
const primitives_1 = require("../std/primitives");
function read(file) {
    const size = fs.statSync(file).size, buf = new Buffer(size), fd = fs.openSync(file, 'r');
    if (!size) {
        return '';
    }
    fs.readSync(fd, buf, 0, size, 0);
    fs.closeSync(fd);
    return buf.toString();
}
exports.read = read;
function to(data, path) {
    let value = path ? jp.query(data, path)[0] : data;
    let changed = false;
    try {
        if (primitives_1.isString(value)) {
            value = JSON.parse(value);
            changed = true;
        }
    }
    catch (e) {
        console.error('error decoding json');
    }
    changed && path && jp.value(data, path, value);
    return data;
}
exports.to = to;
function serialize(value, replacer, space) {
    return JSON.stringify(value, replacer, space);
}
exports.serialize = serialize;
function deserialize(value) {
    return JSON.parse(value);
}
exports.deserialize = deserialize;
;
/**
 * Calls JSON.Stringify with a replacer to break apart any circular references.
 * This prevents JSON.stringify from throwing the exception
 *  "Uncaught TypeError: Converting circular structure to JSON"
 */
function safe(obj) {
    let seen = [];
    return JSON.stringify(obj, (key, value) => {
        if (primitives_1.isObject(value) || Array.isArray(value)) {
            if (seen.indexOf(value) !== -1) {
                return '[Circular]';
            }
            else {
                seen.push(value);
            }
        }
        return value;
    });
}
exports.safe = safe;
;
//# sourceMappingURL=json.js.map