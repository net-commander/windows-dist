"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const invocation_1 = require("./invocation");
const chain_1 = require("./chain");
const ORIGIN = Symbol('agent.framework.origin.method');
// TODO: add cache to improve performance
// 1. create a hash based CacheMap
// 2. implement the hash for attributes/prototype/describer
// 3. replace InterceptorFactory with CachedInterceptorFactory
class InterceptorFactory {
    static createConstructInterceptor(attributes, target, receiver) {
        const invocation = new invocation_1.ConstructInvocation(target, receiver);
        return chain_1.createInvocationChainFromAttribute(invocation, attributes);
    }
    static createGetterInterceptor(attributes, target, propertyKey, receiver) {
        const invocation = new invocation_1.GetterInvocation(target, propertyKey, receiver);
        return chain_1.createInvocationChainFromAttribute(invocation, attributes);
    }
    static createSetterInterceptor(attributes, target, propertyKey, receiver) {
        const invocation = new invocation_1.SetterInvocation(target, propertyKey, receiver);
        return chain_1.createInvocationChainFromAttribute(invocation, attributes);
    }
    static createFunctionInterceptor(attributes, method) {
        const originMethod = method[ORIGIN] || method;
        const origin = {
            invoke: function (parameters) {
                return Reflect.apply(originMethod, this.target, parameters);
            },
            method: originMethod
        };
        const chain = chain_1.createInvocationChainFromAttribute(origin, attributes);
        const upgradedMethod = function () {
            origin.target = this;
            return chain.invoke(arguments);
        };
        upgradedMethod[ORIGIN] = originMethod;
        return upgradedMethod;
    }
}
exports.InterceptorFactory = InterceptorFactory;
//# sourceMappingURL=interceptor.js.map