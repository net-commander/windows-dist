"use strict";
const dotProp = require("dot-prop");
const _ = require("lodash");
class ResourceQuery {
    constructor(data) {
        this.root = '';
        this.data = data;
    }
    get(section, path, query) {
        let data = this.data;
        let result = {};
        result[section] = dotProp.get(data, this.root + path + section);
        return result;
    }
    set(section, path = '.', searchQuery = null, value, decodeValue = true) {
        let data = this.data;
        const dataAt = dotProp.get(data, this.root + path + section);
        dataAt && _.extend(_.find(dataAt, searchQuery), value);
        return data;
    }
    update(section, path = '.', searchQuery = null, value = null, decodeValue = true) {
        return this.set(section, path, searchQuery, value, decodeValue);
    }
}
exports.ResourceQuery = ResourceQuery;
//# sourceMappingURL=Query.js.map