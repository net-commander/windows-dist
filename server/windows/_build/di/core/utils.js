"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORIGIN_INSTANCE = Symbol('agent.framework.origin.instance');
exports.ORIGIN_CONSTRUCTOR = Symbol('agent.framework.origin.constructor');
exports.AGENT_DOMAIN = Symbol('agent.framework.domain');
function IsFunction(x) {
    return typeof x === 'function';
}
exports.IsFunction = IsFunction;
function IsUndefined(x) {
    return x === undefined;
}
exports.IsUndefined = IsUndefined;
function IsObjectOrFunction(x) {
    return typeof x === 'object' ? x !== null : typeof x === 'function';
}
exports.IsObjectOrFunction = IsObjectOrFunction;
function IsSymbol(x) {
    return typeof x === 'symbol';
}
exports.IsSymbol = IsSymbol;
function IsString(x) {
    return typeof x === 'string';
}
exports.IsString = IsString;
function ToPropertyKey(value) {
    return IsSymbol(value) ? value : String(value);
}
exports.ToPropertyKey = ToPropertyKey;
function IsEqual(x, y) {
    // remember that NaN === NaN returns false
    // and isNaN(undefined) returns true
    if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
        return true;
    }
    // Compare primitives and functions.
    // Check if both arguments link to the same object.
    // Especially useful on the step where we compare prototypes
    if (x === y) {
        return true;
    }
    if (!x === !y) {
        return true;
    }
    // Works in case when functions are created in constructor.
    // Comparing dates is a common scenario. Another built-ins?
    // We can even handle functions passed across iframes
    if ((typeof x === 'function' && typeof y === 'function') ||
        (x instanceof Date && y instanceof Date) ||
        (x instanceof RegExp && y instanceof RegExp) ||
        (x instanceof String && y instanceof String) ||
        (x instanceof Number && y instanceof Number)) {
        return x.toString() === y.toString();
    }
    return false;
}
exports.IsEqual = IsEqual;
//# sourceMappingURL=utils.js.map