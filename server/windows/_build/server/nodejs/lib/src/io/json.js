"use strict";
const fs = require("fs");
const jp = require("jsonpath");
const _ = require("lodash");
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
        if (_.isString(value)) {
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
//# sourceMappingURL=json.js.map