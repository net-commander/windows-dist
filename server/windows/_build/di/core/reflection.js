"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const decorator_1 = require("./decorator");
const metadata_1 = require("./metadata");
class Reflection {
    constructor(_target, _targetKey, _descriptor) {
        this._target = _target;
        this._targetKey = _targetKey;
        this._descriptor = _descriptor;
        if (utils_1.IsUndefined(_descriptor) && !utils_1.IsUndefined(_targetKey)) {
            this._descriptor = Object.getOwnPropertyDescriptor(_target, _targetKey);
        }
        this._attributes = [];
        this._metadata = new Map();
    }
    static getInstance(target, targetKey) {
        if (!utils_1.IsObjectOrFunction(target)) {
            throw new TypeError();
        }
        if (!utils_1.IsUndefined(targetKey)) {
            const instance = utils_1.IsFunction(target) ? target['prototype'] : target;
            targetKey = utils_1.ToPropertyKey(targetKey);
            return metadata_1.Metadata.get(instance, targetKey);
        }
        else {
            const originTarget = decorator_1.getDecoratingClass(target);
            const instance = utils_1.IsFunction(originTarget) ? originTarget['prototype'] : originTarget;
            return metadata_1.Metadata.get(instance);
        }
    }
    static getOwnInstance(target, targetKey) {
        if (!utils_1.IsObjectOrFunction(target)) {
            throw new TypeError();
        }
        if (!utils_1.IsUndefined(targetKey)) {
            const instance = utils_1.IsFunction(target) ? target['prototype'] : target;
            targetKey = utils_1.ToPropertyKey(targetKey);
            return metadata_1.Metadata.getOwn(instance, targetKey);
        }
        else {
            const originTarget = decorator_1.getDecoratingClass(target);
            const instance = utils_1.IsFunction(originTarget) ? originTarget['prototype'] : originTarget;
            return metadata_1.Metadata.getOwn(instance);
        }
    }
    static getAttributes(target, targetKey) {
        const reflection = Reflection.getInstance(target, targetKey);
        return reflection ? reflection.getAttributes() : [];
    }
    static hasAttributes(target, targetKey) {
        const reflection = Reflection.getInstance(target, targetKey);
        return reflection ? reflection.hasAttributes() : false;
    }
    static addAttribute(attribute, target, targetKey, descriptor) {
        const reflection = Reflection.getOrCreateOwnInstance(target, targetKey, descriptor);
        reflection.addAttribute(attribute);
    }
    static addMetadata(key, value, target, targetKey, descriptor) {
        const reflection = Reflection.getOrCreateOwnInstance(target, targetKey, descriptor);
        reflection.addMetadata(key, value);
    }
    static getOrCreateOwnInstance(target, targetKey, descriptor) {
        const instance = utils_1.IsFunction(target) ? target['prototype'] : target;
        let reflection = Reflection.getOwnInstance(instance, targetKey);
        if (!reflection) {
            reflection = new Reflection(instance, targetKey, descriptor);
            metadata_1.Metadata.saveOwn(reflection, instance, targetKey);
        }
        return reflection;
    }
    getAttributes(type) {
        if (type) {
            return this._attributes.filter(a => a instanceof type);
        }
        else {
            return this._attributes.slice(0);
        }
    }
    hasAttributes() {
        return this._attributes.length > 0;
    }
    addAttribute(attr) {
        this._attributes.push(attr);
    }
    getMetadata(key) {
        let metadata;
        if (typeof Reflect['getMetadata'] === 'function') {
            metadata = Reflect['getMetadata'](key, this.target, this.targetKey);
        }
        return metadata || this._metadata.get(key);
    }
    addMetadata(key, value) {
        // console.log('added design for ', this._target, '.', this._targetKey, '->', key, '=', value);
        this._metadata.set(key, value);
    }
    get target() {
        return this._target;
    }
    get type() {
        return this.getMetadata('design:type');
    }
    get paramtypes() {
        return this.getMetadata('design:paramtypes');
    }
    get returntype() {
        return this.getMetadata('design:returntype');
    }
    get targetKey() {
        return this._targetKey;
    }
    get descriptor() {
        return this._descriptor;
    }
}
exports.Reflection = Reflection;
//# sourceMappingURL=reflection.js.map