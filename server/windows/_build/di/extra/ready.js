"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_1 = require("../core/decorator");
function ready() {
    return decorator_1.decorateClassMethod(new ReadyAttribute());
}
exports.ready = ready;
class ReadyAttribute {
    constructor() { }
    getInterceptor() {
        return null;
    }
}
exports.ReadyAttribute = ReadyAttribute;
//# sourceMappingURL=ready.js.map