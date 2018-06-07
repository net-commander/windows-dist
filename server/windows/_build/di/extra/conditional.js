"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
const utils_1 = require("../core/utils");
/**
 * Define a conditional
 * @param field
 * @param expect
 * @returns {(target:any, propertyKey:string, descriptor:PropertyDescriptor)=>undefined}
 */
function conditional(field, expect) {
    return core_1.decorateClassMember(new ConditionalAttribute(field, expect));
}
exports.conditional = conditional;
/**
 * PrerequisiteAttribute
 */
class ConditionalAttribute {
    constructor(_field, _expect) {
        this._field = _field;
        this._expect = _expect;
    }
    get field() {
        return this._field;
    }
    get expect() {
        return this._expect;
    }
    beforeDecorate(target, targetKey, descriptor) {
        return true;
    }
    getInterceptor() {
        return this;
    }
    intercept(invocation, parameters) {
        const actualValue = Reflect.get(invocation.target, this.field);
        if (utils_1.IsEqual(actualValue, this.expect)) {
            return invocation.invoke(parameters);
        }
        return undefined;
    }
}
exports.ConditionalAttribute = ConditionalAttribute;
//# sourceMappingURL=conditional.js.map