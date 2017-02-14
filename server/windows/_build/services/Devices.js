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
const fs = require("fs");
const _ = require("lodash");
const path = require("path");
const MKCI = CIUtils_1.getCIByChainAndName;
const DProp = Device_1.DEVICE_PROPERTY, LFLAGS = DProp.CF_DEVICE_LOGGING_FLAGS;
const META_FILE_EXT = '.meta.json';
exports.MK_DEVICE_CIS = function (cis) {
    return [
        MKCI(cis, 0, DProp.CF_DEVICE_TITLE),
        MKCI(cis, 0, DProp.CF_DEVICE_HOST),
        MKCI(cis, 0, DProp.CF_DEVICE_ENABLED),
        MKCI(cis, 0, DProp.CF_DEVICE_DRIVER),
        MKCI(cis, 0, DProp.CF_DEVICE_PROTOCOL),
        MKCI(cis, 0, DProp.CF_DEVICE_PORT),
        MKCI(cis, 0, DProp.CF_DEVICE_ID),
        MKCI(cis, 0, DProp.CF_DEVICE_OPTIONS),
        MKCI(cis, 0, DProp.CF_DEVICE_DRIVER_OPTIONS),
        {
            "id": LFLAGS,
            "name": LFLAGS,
            "parentId": -1,
            "title": LFLAGS,
            "type": LFLAGS,
            "value": "{\n  \"Device Connected\": 47,\n  \"Response\": 35,\n  \"Send Command\": 51,\n  \"Device Disonnected\": 39,\n  \"Device Error\": 1\n}",
            "visible": true
        }
    ];
};
class DeviceService extends Bean_1.BeanService {
    constructor() {
        super(...arguments);
        this.method = 'XCF_Device_Service';
    }
    createItem(ciList) {
        return __awaiter(this, arguments, void 0, function* () {
            const args = arguments;
            return new Promise((resolve, reject) => {
                const cis = { inputs: ciList };
                // 3 mand. fields to satisfy by client:  -> mount/folder/title (.meta.json)
                const scope = CIUtils_1.getCIInputValueByName(cis, 'Scope');
                const title = CIUtils_1.getCIInputValueByName(cis, 'Title');
                const group = CIUtils_1.getCIInputValueByName(cis, 'In Group');
                const vfs = this.getVFS(scope, this._getRequest(args));
                if (!vfs) {
                    reject('Cant find VFS for mount :' + scope);
                }
                const _CIS = exports.MK_DEVICE_CIS(cis);
                const device = {
                    inputs: _CIS
                };
                try {
                    vfs.writefile(this.resolvePath(scope, path.sep + group + path.sep + title + META_FILE_EXT, this._getRequest(args)), JSON.stringify(device, null, 4), this.WRITE_MODE);
                }
                catch (e) {
                    reject(e);
                }
                resolve(_CIS);
            });
        });
    }
    getItems(directory, scope, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            return new Promise((resolve, reject) => {
                const items = [];
                options = options || {};
                const serverSide = options.serverSide;
                function parseDirectory(_path, name) {
                    const dirItems = fs.readdirSync(_path);
                    if (dirItems.length) {
                        _.each(dirItems, function (file) {
                            if (file.indexOf(META_FILE_EXT) !== -1) {
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
                                const driverOptions = CIUtils_1.getCIByChainAndName(meta, 0, Device_1.DEVICE_PROPERTY.CF_DEVICE_DRIVER_OPTIONS);
                                console.log('process device : ' + file + 'serverside : ', driverOptions.value);
                                if (!meta) {
                                    console.warn('device has no meta ' + _path + path.sep + file);
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
                            file = dir + '/' + file; // its '/' because client wants it
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
        const args = arguments;
        return new Promise((resolve, reject) => {
            const vfs = this.getVFS(mount, this._getRequest(args));
            if (vfs) {
                const path = this.resolvePath(mount, _path, this._getRequest(args));
                vfs.rmdir(path, {}, resolve, reject);
                resolve(!fs.existsSync(path));
            }
            else {
                reject('Cant find VFS for ' + mount);
            }
        });
    }
    removeItem(mount, _path) {
        const args = arguments;
        return new Promise((resolve, reject) => {
            const vfs = this.getVFS(mount, this._getRequest(args));
            if (vfs) {
                const path = this.resolvePath(mount, _path, this._getRequest(args));
                vfs.rm(this.resolvePath(mount, _path, this._getRequest(args)), {}, resolve, reject);
                resolve(!fs.existsSync(path));
            }
            else {
                reject('Cant find VFS for ' + mount);
            }
        });
    }
    createGroup(mount, path) {
        const args = arguments;
        return new Promise((resolve, reject) => {
            const vfs = this.getVFS(mount, this._getRequest(args));
            if (vfs) {
                vfs.mkdir(path, {}, (err, data) => {
                    err ? reject(err) : resolve(true);
                });
                resolve(fs.existsSync(path));
            }
            else {
                reject('Cant find VFS for ' + mount);
            }
        });
    }
    ls(mount, path, options, recursive = false) {
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
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeviceService.prototype, "createItem", null);
__decorate([
    Base_2.RpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DeviceService.prototype, "removeGroup", null);
__decorate([
    Base_2.RpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DeviceService.prototype, "removeItem", null);
__decorate([
    Base_2.RpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
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
function getDevices(directory, scope, options) {
    const service = new DeviceService(null);
    return service.getItems(directory, scope, options);
}
exports.getDevices = getDevices;
//# sourceMappingURL=Devices.js.map