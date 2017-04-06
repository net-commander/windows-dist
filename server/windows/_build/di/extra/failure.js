"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
/**
 * Return pre-defined value when catch an exception
 * @param replaced
 * @returns {(target:Object, propertyKey:(string|symbol), descriptor?:PropertyDescriptor)=>void}
 */
function failure(replaced) {
    return core_1.decorateClassMember(new FailureAttribute(replaced));
}
exports.failure = failure;
/**
 * PrerequisiteAttribute
 */
class FailureAttribute {
    constructor(_value) {
        this._value = _value;
    }
    get value() {
        return this._value;
    }
    beforeDecorate(target, targetKey, descriptor) {
        return true;
    }
    getInterceptor() {
        return this;
    }
    intercept(invocation, parameters) {
        try {
            return invocation.invoke(parameters);
        }
        catch (err) {
            return this.value;
        }
    }
}
exports.FailureAttribute = FailureAttribute;
//# sourceMappingURL=failure.js.map