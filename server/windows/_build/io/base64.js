"use strict";
const base64 = require("base-64");
const jp = require("jsonpath");
const qs = require('qs').parse;
function to(data, path) {
    let value = path ? jp.query(data, path)[0] : data;
    let changed = false;
    try {
        if (base64.encode(base64.decode(value)) === value) {
            value = Object.keys(qs(base64.decode(value)))[0];
            changed = true;
        }
    }
    catch (e) {
    }
    changed && path && jp.value(data, path, value);
    return data;
}
exports.to = to;
//# sourceMappingURL=base64.js.map