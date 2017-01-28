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
const Resource_1 = require("../interfaces/Resource");
const Driver_1 = require("../types/Driver");
const CIUtils_1 = require("../utils/CIUtils");
const Base_1 = require("./Base");
const Bean_1 = require("./Bean");
const AnyPromise = require("any-promise");
const fs = require("fs");
const _ = require("lodash");
const path = require("path");
class DriverService extends Bean_1.BeanService {
    constructor() {
        super(...arguments);
        this.method = 'XCF_Driver_Service';
    }
    getDrivers(driverPath, scope, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new AnyPromise((resolve, reject) => {
                let items = [];
                let self = this;
                function parseDirectory(_path, name) {
                    let dirItems = fs.readdirSync(_path);
                    if (dirItems.length) {
                        _.each(dirItems, function (file) {
                            if (file.indexOf('.meta.json') !== -1) {
                                let meta = self.readConfig(_path + path.sep + file);
                                if (!meta) {
                                    console.error('cant get driver meta ' + _path + path.sep + file);
                                }
                                else {
                                    let id = CIUtils_1.getCIInputValueByName(meta, Driver_1.DRIVER_PROPERTY.CF_DRIVER_ID);
                                    let bloxFile = _path + '/' + file.replace('.meta.json', '.xblox');
                                    let blox = self.readConfig(bloxFile);
                                    if (!blox) {
                                        console.warn('invalid blocks file for driver ' + name + '/' + file + ' blox path = ' + bloxFile);
                                    }
                                    let item = {
                                        isDir: false,
                                        path: name + '/' + file,
                                        parentId: name,
                                        scope: scope,
                                        user: meta,
                                        id: id,
                                        blox: blox || {},
                                        blockPath: bloxFile
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
                                let root = file.replace(driverPath + '/', '');
                                if (stat.isDirectory()) {
                                    let dirItem = {
                                        isDir: true,
                                        parent: root,
                                        name: root,
                                        path: root
                                    };
                                    items.push(dirItem);
                                    parseDirectory(file, root);
                                    results.push(file.replace(driverPath + '/', ''));
                                    results = results.concat(_walk(file));
                                }
                            }
                        });
                    }
                    else {
                        console.error('driver path ' + dir + ' doesnt exists');
                    }
                    return results;
                }
                _walk(driverPath);
                _.each(items, function (node) {
                    if (node.parent === node.path) {
                        node.parent = '';
                        node.parentId = '';
                        node.scope = scope;
                    }
                });
                resolve(items);
            });
        });
    }
    ls(path, mount, options, recursive = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resource = this.getResourceByTypeAndName(Resource_1.EResourceType.FILE_PROXY, path);
                if (resource) {
                    const root = this.resolveAbsolute(resource);
                    const nodes = yield this.getDrivers(root, path, {});
                    return { items: nodes };
                }
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    removeItem(mount, _path) {
        return new AnyPromise((resolve, reject) => {
            const vfs = this.getVFS(mount);
            if (vfs) {
                vfs.rm(this.resolvePath(mount, _path), {}, resolve, reject);
                vfs.rm(this.resolvePath(mount, _path.replace('.meta.json', '.js')), {}, resolve, reject);
                vfs.rm(this.resolvePath(mount, _path.replace('.meta.json', '.xblox')), {}, resolve, reject);
                resolve(true);
            }
            else {
                reject('Cant find VFS for ' + mount);
            }
        });
    }
    createItem(mount, _path, title, meta, driverCode) {
        return __awaiter(this, void 0, void 0, function* () {
            return new AnyPromise((resolve, reject) => {
                try {
                    const vfs = this.getVFS(mount);
                    if (vfs) {
                        this.mkfile(mount, _path + path.sep + title + '.meta.json', meta);
                        this.mkfile(mount, _path + path.sep + title + '.js', driverCode);
                        this.mkfile(mount, _path + path.sep + title + '.xblox', '{}');
                        resolve(true);
                    }
                    else {
                        reject('Cant find VFS for ' + mount);
                    }
                }
                catch (e) {
                    console.error(e);
                }
            });
        });
    }
    createGroup(mount, _path) {
        return new AnyPromise((resolve, reject) => {
            const vfs = this.getVFS(mount);
            if (vfs) {
                vfs.mkdir(_path, {}, (err, data) => {
                    err ? reject(err) : resolve(true);
                });
            }
            else {
                reject('Cant find VFS for ' + mount);
            }
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
    Base_1.RpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Boolean]),
    __metadata("design:returntype", Promise)
], DriverService.prototype, "ls", null);
__decorate([
    Base_1.RpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DriverService.prototype, "removeItem", null);
__decorate([
    Base_1.RpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], DriverService.prototype, "createItem", null);
__decorate([
    Base_1.RpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DriverService.prototype, "createGroup", null);
__decorate([
    Base_1.RpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DriverService.prototype, "removeGroup", null);
exports.DriverService = DriverService;
//# sourceMappingURL=Drivers.js.map