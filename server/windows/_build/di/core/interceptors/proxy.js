"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reflection_1 = require("../reflection");
const interceptor_1 = require("../interceptor");
const utils_1 = require("../utils");
/**
 * Add proxy interceptor
 * @param target
 * @returns {T}
 * @constructor
 */
function AddProxyInterceptor(target) {
    const instanceProxyHandler = {
        get: ProxyGetInterceptor,
        set: ProxySetInterceptor
    };
    // console.log('create proxy for ', target);
    return new Proxy(target, instanceProxyHandler);
}
exports.AddProxyInterceptor = AddProxyInterceptor;
/**
 * The **get** interceptor (es6)
 * @param target
 * @param p
 * @param receiver
 * @returns {any}
 * @constructor
 */
function ProxyGetInterceptor(target, p, receiver) {
    const propertyKey = utils_1.ToPropertyKey(p);
    const reflection = reflection_1.Reflection.getInstance(target, propertyKey);
    // ignore property without attributes
    if (!reflection) {
        return Reflect.get(target, p, receiver);
    }
    // ignore prototype interceptors and getter/setter
    // intercept by overloading ES5 prototype (static intercept)
    // if (!IsUndefined(reflection.descriptor)) {
    //   return Reflect.get(target, p, receiver);
    // }
    // intercept by implement ES6 proxy (dynamic intercept)
    if (!utils_1.IsUndefined(reflection.descriptor) && reflection.descriptor.value) {
        return interceptor_1.InterceptorFactory.createFunctionInterceptor(reflection.getAttributes(), reflection.descriptor.value);
    }
    // create field getter interceptor on the fly
    // TODO: get invocation from cache
    const invocation = interceptor_1.InterceptorFactory.createGetterInterceptor(reflection.getAttributes(), target, propertyKey, receiver);
    // call getter
    return invocation.invoke([]);
}
exports.ProxyGetInterceptor = ProxyGetInterceptor;
/**
 * The **set** interceptor
 * @param target
 * @param p
 * @param value
 * @param receiver
 * @returns {boolean}
 * @constructor
 */
function ProxySetInterceptor(target, p, value, receiver) {
    const propertyKey = utils_1.ToPropertyKey(p);
    const reflection = reflection_1.Reflection.getInstance(target, propertyKey);
    // ignore property without attributes
    if (!reflection) {
        return Reflect.set(target, p, value, receiver);
    }
    // ignore prototype interceptors and getter/setter
    // if (!IsUndefined(reflection.descriptor)) {
    //   return Reflect.set(target, p, value, receiver);
    // }
    if (!utils_1.IsUndefined(reflection.descriptor) && !reflection.descriptor.set) {
        return Reflect.set(target, p, value, receiver);
    }
    // create field setter interceptor on the fly
    const invocation = interceptor_1.InterceptorFactory.createSetterInterceptor(reflection.getAttributes(), target, propertyKey, receiver);
    // call the interceptors
    return invocation.invoke([value]);
}
exports.ProxySetInterceptor = ProxySetInterceptor;
//# sourceMappingURL=proxy.js.map