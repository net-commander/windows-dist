"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function CanDecorate(attribute, target, targetKey, descriptor) {
    return !attribute.beforeDecorate || attribute.beforeDecorate(target, targetKey, descriptor);
}
exports.CanDecorate = CanDecorate;
function GetInterceptor(attribute) {
    const interceptor = attribute.getInterceptor();
    // do not intercept when got false, null, ''
    if (!!interceptor && typeof interceptor.intercept === 'function' && interceptor.intercept.length === 2) {
        return interceptor;
    }
    else {
        return undefined;
    }
}
exports.GetInterceptor = GetInterceptor;
//# sourceMappingURL=attribute.js.map