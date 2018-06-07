"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
const utils_1 = require("../core/utils");
/**
 * Define a prerequisite
 * @param key
 * @param value
 * @param message
 * @returns {(target:any, propertyKey:string, descriptor:PropertyDescriptor)=>undefined}
 */
function prerequisite(key, value, message) {
    return core_1.decorateClassMember(new PrerequisiteAttribute(key, value, message));
}
exports.prerequisite = prerequisite;
/**
 * PrerequisiteAttribute
 */
class PrerequisiteAttribute {
    constructor(_key, _value, _message) {
        this._key = _key;
        this._value = _value;
        this._message = _message;
    }
    get key() {
        return this._key;
    }
    get value() {
        return this._value;
    }
    get message() {
        return this._message;
    }
    beforeDecorate(target, targetKey, descriptor) {
        return true;
    }
    getInterceptor() {
        return this;
    }
    intercept(invocation, parameters) {
        const actualValue = Reflect.get(invocation.target, this.key);
        if (!utils_1.IsEqual(actualValue, this.value)) {
            if (utils_1.IsString(this.message)) {
                throw new TypeError(this.message);
            }
            else {
                throw this.message;
            }
        }
        return invocation.invoke(parameters);
    }
}
exports.PrerequisiteAttribute = PrerequisiteAttribute;
//# sourceMappingURL=prerequisite.js.map