"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
/**
 * Define a prerequisite
 * @param key
 * @param value
 * @returns {(target:any, propertyKey:string, descriptor:PropertyDescriptor)=>undefined}
 */
function success(key, value) {
    return core_1.decorateClassMember(new SuccessAttribute(key, value));
}
exports.success = success;
/**
 * PrerequisiteAttribute
 */
class SuccessAttribute {
    constructor(_key, _value) {
        this._key = _key;
        this._value = _value;
    }
    get key() {
        return this._key;
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
        const result = invocation.invoke(parameters);
        // debug(`SuccessAttribute updating target value ${this.key}='${this.value}'`);
        Reflect.set(invocation.target, this.key, this.value);
        return result;
    }
}
exports.SuccessAttribute = SuccessAttribute;
//# sourceMappingURL=success.js.map