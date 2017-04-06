"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConstructInvocation {
    constructor(_target, _receiver) {
        this._target = _target;
        this._receiver = _receiver;
    }
    get target() {
        return this._target;
    }
    invoke(parameters) {
        return Reflect.construct(this._target, parameters, this._receiver);
    }
}
exports.ConstructInvocation = ConstructInvocation;
class GetterInvocation {
    constructor(_target, _propertyKey, _receiver) {
        this._target = _target;
        this._propertyKey = _propertyKey;
        this._receiver = _receiver;
    }
    get target() {
        return this._target;
    }
    invoke(parameters) {
        return Reflect.get(this._target, this._propertyKey, this._receiver);
    }
}
exports.GetterInvocation = GetterInvocation;
class SetterInvocation {
    constructor(_target, _propertyKey, _receiver) {
        this._target = _target;
        this._propertyKey = _propertyKey;
        this._receiver = _receiver;
    }
    get target() {
        return this._target;
    }
    invoke(parameters) {
        return Reflect.set(this._target, this._propertyKey, parameters[0], this._receiver);
    }
}
exports.SetterInvocation = SetterInvocation;
//# sourceMappingURL=invocation.js.map