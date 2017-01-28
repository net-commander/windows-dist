"use strict";
const Base_1 = require("../services/Base");
const dotProp = require("dot-prop");
const _ = require("lodash");
class JSONFileService extends Base_1.BaseService {
    constructor(config) {
        super(config, null, null);
        this.method = 'XApp_Store';
        this.configPath = config;
        this.root = 'admin';
    }
    methods() {
        return this.toMethods(['get', 'set', 'update']);
    }
    get(section, path, query) {
        let data = this.readConfig();
        let result = {};
        result[section] = dotProp.get(data, this.root + path + section);
        return result;
    }
    set(section, path = '.', searchQuery = null, value, decodeValue = true) {
        let data = this.readConfig();
        const dataAt = dotProp.get(data, this.root + path + section);
        dataAt && _.extend(_.find(dataAt, searchQuery), value);
        return data;
    }
    update(section, path = '.', searchQuery = null, value = null, decodeValue = true) {
        return this.writeConfig(null, this.set(section, path, searchQuery, value, decodeValue));
    }
    read(path) {
        return this.readConfig(path);
    }
    write(path, val) {
        return this.writeConfig(path, val);
    }
}
exports.JSONFileService = JSONFileService;
//# sourceMappingURL=JSONFile.js.map