"use strict";
function makeID() {
    return Math.floor(Math.random() * 9007199254740992); // 2^53
}
exports.makeID = makeID;
;
function isValidRealm(realm) {
    const PATTERN = /^([^\s\.#]+\.)*([^\s\.#]+)$/;
    if (!realm || !PATTERN.test(realm) || realm.indexOf('wamp.') === 0) {
        return false;
    }
    return true;
}
exports.isValidRealm = isValidRealm;
//# sourceMappingURL=util.js.map