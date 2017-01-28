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
const Base_1 = require("../services/Base");
const JSONFile_1 = require("./JSONFile");
const dotProp = require("dot-prop");
const _path = require("path");
const _ = require("lodash");
class TrackingService extends JSONFile_1.JSONFileService {
    constructor() {
        super(...arguments);
        // implement Base#method
        this.method = 'XApp_Tracking_Service';
        this.root = "admin";
    }
    get(section, path, query) {
        const request = this._getRequest(arguments);
        let user = null;
        let file = null;
        if (request) {
            user = this._getUser(request);
            if (user) {
                file = _path.join(user, 'meta.json');
            }
        }
        let data = this.readConfig(file);
        let result = {};
        result[section] = dotProp.get(data, this.root + path + section);
        return result;
    }
    set(section, path = '.', searchQuery = null, value, decodeValue = true) {
        const request = this._getRequest(arguments);
        let user = null;
        let file = null;
        if (request) {
            user = this._getUser(request);
            if (user) {
                file = _path.join(user, 'meta.json');
            }
        }
        let data = this.readConfig(file);
        const dataAt = dotProp.get(data, this.root + path + section);
        dataAt && _.extend(_.find(dataAt, searchQuery), value);
        this.write(file, data);
        return data;
    }
    //
    // ─── DECORATORS ─────────────────────────────────────────────────────────────────
    //
    methods() {
        return this.toMethods(['get', 'set']);
    }
}
__decorate([
    Base_1.RpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Object)
], TrackingService.prototype, "get", null);
__decorate([
    Base_1.RpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object, Boolean]),
    __metadata("design:returntype", void 0)
], TrackingService.prototype, "set", null);
exports.TrackingService = TrackingService;
//# sourceMappingURL=Tracking.js.map