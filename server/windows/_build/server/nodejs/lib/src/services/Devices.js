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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const json_1 = require("../io/json");
const AspectDecorator_1 = require("../lang/AspectDecorator");
const Base_1 = require("../services/Base");
const Device_1 = require("../types/Device");
const Driver_1 = require("../types/Driver");
const CIUtils_1 = require("../utils/CIUtils");
const Base_2 = require("./Base");
const Bean_1 = require("./Bean");
const AnyPromise = require("any-promise");
const fs = require("fs");
const _ = require("lodash");
const path = require("path");
class DeviceService extends Bean_1.BeanService {
    constructor() {
        super(...arguments);
        this.method = 'XCF_Device_Service';
    }
    createItem(ciList, req) {
        return __awaiter(this, void 0, void 0, function* () {
            return new AnyPromise((resolve, reject) => {
                const cis = {
                    inputs: ciList
                };
                const scope = CIUtils_1.getCIInputValueByName(cis, 'Scope');
                const title = CIUtils_1.getCIInputValueByName(cis, 'Title');
                const group = CIUtils_1.getCIInputValueByName(cis, 'In Group');
                const vfs = this.getVFS(scope);
                if (!vfs) {
                    reject('Cant find VFS for mount :' + scope);
                }
                const device = {
                    inputs: [
                        CIUtils_1.getCIByChainAndName(cis, 0, Device_1.DEVICE_PROPERTY.CF_DEVICE_TITLE),
                        CIUtils_1.getCIByChainAndName(cis, 0, Device_1.DEVICE_PROPERTY.CF_DEVICE_HOST),
                        CIUtils_1.getCIByChainAndName(cis, 0, Device_1.DEVICE_PROPERTY.CF_DEVICE_ENABLED),
                        CIUtils_1.getCIByChainAndName(cis, 0, Device_1.DEVICE_PROPERTY.CF_DEVICE_DRIVER),
                        CIUtils_1.getCIByChainAndName(cis, 0, Device_1.DEVICE_PROPERTY.CF_DEVICE_PROTOCOL),
                        CIUtils_1.getCIByChainAndName(cis, 0, Device_1.DEVICE_PROPERTY.CF_DEVICE_PORT),
                        CIUtils_1.getCIByChainAndName(cis, 0, Device_1.DEVICE_PROPERTY.CF_DEVICE_ID),
                        CIUtils_1.getCIByChainAndName(cis, 0, Device_1.DEVICE_PROPERTY.CF_DEVICE_OPTIONS),
                        CIUtils_1.getCIByChainAndName(cis, 0, Device_1.DEVICE_PROPERTY.CF_DEVICE_DRIVER_OPTIONS),
                        {
                            "id": Device_1.DEVICE_PROPERTY.CF_DEVICE_LOGGING_FLAGS,
                            "name": Device_1.DEVICE_PROPERTY.CF_DEVICE_LOGGING_FLAGS,
                            "order": -1,
                            "params": null,
                            "parentId": -1,
                            "platform": null,
                            "storeDestination": null,
                            "title": "Logging Flags",
                            "type": "Logging Flags",
                            "uid": -1,
                            "value": "{\n  \"Device Connected\": 47,\n  \"Response\": 35,\n  \"Send Command\": 51,\n  \"Device Disonnected\": 39,\n  \"Device Error\": 1\n}",
                            "visible": true
                        }
                    ]
                };
                try {
                    vfs.writefile(this.resolvePath(scope, path.sep + group + path.sep + title + '.meta.json'), JSON.stringify(device, null, 4), this.WRITE_MODE);
                }
                catch (e) {
                    reject(e);
                }
                resolve(device.inputs);
            });
        });
    }
    getItems(directory, scope, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            return new AnyPromise((resolve, reject) => {
                const items = [];
                options = options || {};
                const serverSide = options.serverSide;
                function parseDirectory(_path, name) {
                    const dirItems = fs.readdirSync(_path);
                    if (dirItems.length) {
                        _.each(dirItems, function (file) {
                            if (file.indexOf('.meta.json') !== -1) {
                                const meta = self.readConfig(_path + path.sep + file);
                                if (!meta) {
                                    console.error('cant get device meta for ' + file + ' path = ' + _path + path.sep + file);
                                    return;
                                }
                                if (serverSide) {
                                    const driverOptions = CIUtils_1.getCIByChainAndName(meta, 0, Device_1.DEVICE_PROPERTY.CF_DEVICE_DRIVER_OPTIONS);
                                    if (driverOptions && !(driverOptions.value & (1 << Driver_1.DRIVER_FLAGS.RUNS_ON_SERVER))) {
                                        driverOptions.value = driverOptions.value | (1 << Driver_1.DRIVER_FLAGS.RUNS_ON_SERVER);
                                    }
                                }
                                if (!meta) {
                                    console.error('device has no meta ' + _path + path.sep + file);
                                }
                                else {
                                    const item = {
                                        isDir: false,
                                        path: name + '/' + file,
                                        parentId: name,
                                        scope: scope,
                                        user: meta,
                                        id: CIUtils_1.getCIInputValueByName(meta, Device_1.DEVICE_PROPERTY.CF_DEVICE_ID),
                                        name: CIUtils_1.getCIInputValueByName(meta, Device_1.DEVICE_PROPERTY.CF_DEVICE_TITLE)
                                    };
                                    items.push(item);
                                }
                            }
                        });
                    }
                }
                function _walk(dir) {
                    let results = [];
                    if (fs.existsSync(dir)) {
                        let list = fs.readdirSync(dir);
                        list.forEach(function (file) {
                            file = dir + '/' + file;
                            let stat = fs.statSync(file);
                            if (stat) {
                                let root = file.replace(directory + '/', '');
                                if (stat.isDirectory()) {
                                    const dirItem = {
                                        isDir: true,
                                        parent: root,
                                        name: root,
                                        path: root
                                    };
                                    items.push(dirItem);
                                    parseDirectory(file, root);
                                    results.push(file.replace(directory + '/', ''));
                                    results = results.concat(_walk(file));
                                }
                            }
                            else {
                                console.error('cant get stat for ' + file);
                            }
                        });
                    }
                    else {
                        console.error('device path ' + dir + ' doesnt exists');
                    }
                    return results;
                }
                _walk(directory);
                _.each(items, function (node) {
                    if (node.parent === node.path) {
                        node.parent = '';
                        node.parentId = '';
                    }
                    node.scope = scope;
                });
                resolve(items);
            });
        });
    }
    removeGroup(mount, _path) {
        return new AnyPromise((resolve, reject) => {
            const vfs = this.getVFS(mount);
            if (vfs) {
                vfs.rmdir(this.resolvePath(mount, _path), {}, resolve, reject);
            }
            else {
                reject('Cant find VFS for ' + mount);
            }
        });
    }
    removeItem(mount, _path) {
        return new AnyPromise((resolve, reject) => {
            const vfs = this.getVFS(mount);
            if (vfs) {
                vfs.rm(this.resolvePath(mount, _path), {}, resolve, reject);
                resolve(true);
            }
            else {
                reject('Cant find VFS for ' + mount);
            }
        });
    }
    createGroup(mount, path) {
        return new AnyPromise((resolve, reject) => {
            const vfs = this.getVFS(mount);
            if (vfs) {
                vfs.mkdir(path, {}, (err, data) => {
                    err ? reject(err) : resolve(true);
                });
            }
            else {
                reject('Cant find VFS for ' + mount);
            }
        });
    }
    ls(path, mount, options, recursive = false) {
        return __awaiter(this, arguments, void 0, function* () {
            return this._ls.apply(this, arguments);
        });
    }
    updateItemMetaData(path, mount, options, recursive = false) {
        return __awaiter(this, arguments, void 0, function* () {
            return this._updateItemMetaData.apply(this, arguments);
        });
    }
    //
    // ─── DECORATOR OVERHEAD ─────────────────────────────────────────────────────────
    //
    getRpcMethods() {
        throw new Error("Should be implemented by decorator");
    }
    methods() {
        return this.toMethods(this.getRpcMethods());
    }
}
__decorate([
    Base_2.RpcMethod,
    AspectDecorator_1.before((context, args) => Base_1.decodeArgs(args, "$['0']", json_1.to)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DeviceService.prototype, "createItem", null);
__decorate([
    Base_2.RpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DeviceService.prototype, "removeGroup", null);
__decorate([
    Base_2.RpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DeviceService.prototype, "removeItem", null);
__decorate([
    Base_2.RpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DeviceService.prototype, "createGroup", null);
__decorate([
    Base_2.RpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Boolean]),
    __metadata("design:returntype", Promise)
], DeviceService.prototype, "ls", null);
__decorate([
    Base_2.RpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Boolean]),
    __metadata("design:returntype", Promise)
], DeviceService.prototype, "updateItemMetaData", null);
exports.DeviceService = DeviceService;
//# sourceMappingURL=Devices.js.map