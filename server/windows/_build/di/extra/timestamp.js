"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
/**
 * Normalize the result { ok: 1, result: '', message: '' }
 * @returns {(target:Object, propertyKey:(string|symbol), descriptor?:PropertyDescriptor)=>void}
 */
function timestamp() {
    return core_1.decorateClassMember(new TimestampAttribute());
}
exports.timestamp = timestamp;
class TimestampAttribute {
    constructor() { }
    beforeDecorate(target, targetKey, descriptor) {
        return true;
    }
    getInterceptor() {
        return this;
    }
    intercept(invocation, parameters) {
        const value = invocation.invoke(parameters);
        // update timestamp field with current datetime
        Reflect.set(invocation.target, 'timestamp', Date.now());
        return value;
    }
}
exports.TimestampAttribute = TimestampAttribute;
//# sourceMappingURL=timestamp.js.map