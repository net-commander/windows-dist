"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
/**
 * Define a prerequisite
 * @returns {(target:any, propertyKey:string, descriptor:PropertyDescriptor)=>undefined}
 */
function cache() {
    return core_1.decorateClassMethod(new CacheAttribute());
}
exports.cache = cache;
/**
 * PrerequisiteAttribute
 */
class CacheAttribute {
    constructor() {
        this.cache = new MemoryCache();
    }
    static normalizeParameters(parameters) {
        return Array.from(parameters).map(value => value.toString()).join('|');
    }
    getInterceptor() {
        return this;
    }
    intercept(invocation, parameters) {
        const normalized = CacheAttribute.normalizeParameters(parameters);
        const hit = this.cache.get(normalized);
        if (hit != null) {
            return hit;
        }
        const result = invocation.invoke(parameters);
        this.cache.set(normalized, result);
        return result;
    }
}
exports.CacheAttribute = CacheAttribute;
class MemoryCache {
    constructor() {
        this.expires = 60000;
        this.store = new Map();
    }
    set(key, value) {
        this.store.set(key, { expires: Date.now() + this.expires, value });
    }
    get(key) {
        if (this.store.has(key)) {
            const cached = this.store.get(key);
            if (cached.expires > Date.now()) {
                return cached.value;
            }
            else {
                this.store.delete(key);
            }
        }
        return null;
    }
}
exports.MemoryCache = MemoryCache;
//# sourceMappingURL=cache.js.map