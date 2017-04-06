"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const attribute_1 = require("./attribute");
function createInvocationChainFromAttribute(origin, attributes) {
    let invocation = origin;
    // make invocation chain of interceptors
    attributes.forEach(function (attribute) {
        const interceptor = attribute_1.GetInterceptor(attribute);
        if (interceptor) {
            invocation = new InceptionInvocation(invocation, interceptor);
        }
    });
    return invocation;
}
exports.createInvocationChainFromAttribute = createInvocationChainFromAttribute;
/**
 * InceptionInvocation will call next interceptor in the chain
 */
class InceptionInvocation {
    constructor(_invocation, _interceptor) {
        this._invocation = _invocation;
        this._interceptor = _interceptor;
    }
    get target() {
        return this._invocation.target;
    }
    invoke(parameters) {
        return this._interceptor.intercept(this._invocation, parameters);
    }
}
exports.InceptionInvocation = InceptionInvocation;
//# sourceMappingURL=chain.js.map