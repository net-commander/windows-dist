"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_1 = require("../core/decorator");
function inject(typeOrIdentifier) {
    return decorator_1.decorateClassProperty(new InjectAttribute(typeOrIdentifier));
}
exports.inject = inject;
class InjectAttribute {
    constructor(_typeOrIdentifier) {
        this._typeOrIdentifier = _typeOrIdentifier;
    }
    get typeOrIdentifier() {
        return this._typeOrIdentifier;
    }
    getInterceptor() {
        return null;
    }
}
exports.InjectAttribute = InjectAttribute;
//# sourceMappingURL=inject.js.map