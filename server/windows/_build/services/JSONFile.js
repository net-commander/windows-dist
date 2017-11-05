"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = require("../services/Base");
const dotProp = require("dot-prop");
const _ = require("lodash");
const pathUtil = require("path");
/**
 * This service sets/gets data in a json file, utilizing 'dot-prop' to select certain data in the object.
 *
 * @export
 * @class JSONFileService
 * @extends {BaseService}
 * @implements {IStoreIO}
 * @implements {IStoreAccess}
 */
class JSONFileService extends Base_1.BaseService {
    constructor(config) {
        super(config, null, null);
        this.method = 'XApp_Store';
        this.configPath = config;
        this.root = 'admin';
    }
    _userDir(userRoot, what) {
        return pathUtil.resolve(pathUtil.join(userRoot + pathUtil.sep + what));
    }
    _getConfigPath(args, file = 'settings.json') {
        const user = this._getUser(this._getRequest(args));
        let configPath = this.configPath;
        if (user) {
            configPath = this._userDir(user, file || 'settings.json');
        }
        return configPath;
    }
    get(section, path, query) {
        let configPath = this._getConfigPath(arguments);
        let data = this.readConfig(configPath);
        let result = {};
        result[section] = dotProp.get(data, this.root + path + section);
        return result;
    }
    set(section, path = '.', searchQuery = null, value, decodeValue = true) {
        let data = this.readConfig(this._getConfigPath(arguments));
        const dataAt = dotProp.get(data, this.root + path + section);
        if (!_.find(dataAt, searchQuery)) {
            const at = dotProp.get(data, this.root + path + section);
            at.push(searchQuery);
        }
        dataAt && _.extend(_.find(dataAt, searchQuery), value);
        return data;
    }
    update(section, path = '.', searchQuery = null, value = null, decodeValue = true) {
        return this.writeConfig(this._getConfigPath(arguments), this.set(section, path, searchQuery, value, decodeValue));
    }
    read(path) {
        return this.readConfig(this._getConfigPath(arguments));
    }
    write(path, val) {
        this.writeConfig(path, val);
    }
    //
    // ─── DECORATORS
    //
    getRpcMethods() {
        throw new Error("Should be implemented by decorator");
    }
    methods() {
        const methods = this.getRpcMethods();
        return this.toMethods(methods);
    }
}
__decorate([
    Base_1.RpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Object)
], JSONFileService.prototype, "get", null);
__decorate([
    Base_1.RpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object, Boolean]),
    __metadata("design:returntype", void 0)
], JSONFileService.prototype, "set", null);
__decorate([
    Base_1.RpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object, Boolean]),
    __metadata("design:returntype", void 0)
], JSONFileService.prototype, "update", null);
exports.JSONFileService = JSONFileService;
//# sourceMappingURL=JSONFile.js.map