"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
/**
 * Normalize the result { ok: 1, result: '', message: '' }
 * @returns {(target:Object, propertyKey:(string|symbol), descriptor?:PropertyDescriptor)=>void}
 */
function normalize() {
    return core_1.decorateClassMember(new NormalizeAttribute());
}
exports.normalize = normalize;
class NormalizeAttribute {
    constructor() { }
    beforeDecorate(target, targetKey, descriptor) {
        return true;
    }
    getInterceptor() {
        return this;
    }
    intercept(invocation, parameters) {
        try {
            const value = invocation.invoke(parameters);
            if (Array.isArray(value)) {
                return { ok: 1, results: value };
            }
            else {
                return { ok: 1, result: value };
            }
        }
        catch (err) {
            return { ok: 0, message: err.message };
        }
    }
}
exports.NormalizeAttribute = NormalizeAttribute;
//# sourceMappingURL=normalize.js.map