"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const global = require("../../global");
// createGetterInterceptor a unique, global symbol name
// -----------------------------------
const key = Symbol.for('agent.framework.metadata');
// check if the global object has this symbol
// add it if it does not have the symbol, yet
// ------------------------------------------
const globalSymbols = Object.getOwnPropertySymbols(global);
// ensure all version using the same instance
if (globalSymbols.indexOf(key) === -1) {
    Reflect.set(global, key, new Map()); // Object.freeze(kernel); - this will break istanbul test
    // console.log('metadata store not found, create new metadata store')
}
const globalSymbols2 = Object.getOwnPropertySymbols(global);
// ensure all version using the same instance
if (globalSymbols2.indexOf(key) === -1) {
    console.log('second');
}
class Metadata {
    static getAll(target) {
        if (this._metadata.has(target)) {
            return this._metadata.get(target);
        }
        else {
            return this._empty;
        }
    }
    static get(target, method) {
        if (this._metadata.has(target)) {
            return this._metadata.get(target).get(utils_1.IsUndefined(method) ? '' : method);
        }
        else {
            const proto = Object.getPrototypeOf(target);
            if (proto && this._metadata.has(proto)) {
                return this._metadata.get(proto).get(utils_1.IsUndefined(method) ? '' : method);
            }
            else {
                return null;
            }
        }
    }
    static getOwn(target, method) {
        if (this._metadata.has(target)) {
            return this._metadata.get(target).get(utils_1.IsUndefined(method) ? '' : method);
        }
        else {
            return null;
        }
    }
    static saveOwn(reflection, target, method) {
        if (!this._metadata.has(target)) {
            this._metadata.set(target, new Map());
        }
        this._metadata.get(target).set(utils_1.IsUndefined(method) ? '' : method, reflection);
    }
}
Metadata._metadata = Reflect.get(global, key);
Metadata._empty = new Map();
exports.Metadata = Metadata;
//# sourceMappingURL=metadata.js.map