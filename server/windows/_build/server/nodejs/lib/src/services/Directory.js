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
const base64_1 = require("../io/base64");
const AspectDecorator_1 = require("../lang/AspectDecorator");
const Base_1 = require("../services/Base");
const Local_1 = require("../vfs/Local");
const AnyPromise = require("any-promise");
const fs = require("fs");
const mime = require("mime");
const _path = require("path");
const _fs = require('node-fs-extra');
const _ = require("lodash");
const Base_2 = require("./Base");
let posix = null;
try {
    posix = require('posix');
}
catch (e) { }
const DEBUG = false;
const posixCache = {};
const async = require('async');
function size(item, ignoreRegEx, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        return new AnyPromise((resolve, reject) => {
            let cb;
            let ignoreRegExp;
            if (!callback) {
                cb = ignoreRegEx;
                ignoreRegExp = null;
            }
            else {
                cb = callback;
                ignoreRegExp = ignoreRegEx;
            }
            fs.lstat(item, function lstat(e, stats) {
                let total = !e ? (stats.size || 0) : 0;
                if (!e && stats.isDirectory()) {
                    fs.readdir(item, function readdir(err, list) {
                        if (err) {
                            reject(err);
                        }
                        async.forEach(list, function iterate(dirItem, next) {
                            size(_path.join(item, dirItem), ignoreRegExp, function readSize(error, size) {
                                if (!error) {
                                    total += size;
                                }
                                next(error);
                            });
                        }, function done(finalErr) {
                            // cb(finalErr, total);
                            resolve({ error: finalErr, total: total });
                        });
                    });
                }
                else {
                    if (ignoreRegExp && ignoreRegExp.test(item)) {
                        total = 0;
                    }
                    resolve({ error: e, total: total });
                }
            });
        });
    });
}
exports.size = size;
var NODE_FIELDS;
(function (NODE_FIELDS) {
    NODE_FIELDS[NODE_FIELDS["SHOW_ISDIR"] = 1602] = "SHOW_ISDIR";
    NODE_FIELDS[NODE_FIELDS["SHOW_OWNER"] = 1604] = "SHOW_OWNER";
    NODE_FIELDS[NODE_FIELDS["SHOW_MIME"] = 1608] = "SHOW_MIME";
    NODE_FIELDS[NODE_FIELDS["SHOW_SIZE"] = 1616] = "SHOW_SIZE";
    NODE_FIELDS[NODE_FIELDS["SHOW_PERMISSIONS"] = 1632] = "SHOW_PERMISSIONS";
    NODE_FIELDS[NODE_FIELDS["SHOW_TIME"] = 1633] = "SHOW_TIME";
    NODE_FIELDS[NODE_FIELDS["SHOW_FOLDER_SIZE"] = 1634] = "SHOW_FOLDER_SIZE";
    NODE_FIELDS[NODE_FIELDS["SHOW_FOLDER_HIDDEN"] = 1635] = "SHOW_FOLDER_HIDDEN";
    NODE_FIELDS[NODE_FIELDS["SHOW_TYPE"] = 1636] = "SHOW_TYPE";
    NODE_FIELDS[NODE_FIELDS["SHOW_MEDIA_INFO"] = 1637] = "SHOW_MEDIA_INFO";
})(NODE_FIELDS = exports.NODE_FIELDS || (exports.NODE_FIELDS = {}));
function FileSizeToString(size) {
    const isNumber = typeof size === 'number', l1KB = 1024, l1MB = l1KB * l1KB, l1GB = l1MB * l1KB, l1TB = l1GB * l1KB, l1PB = l1TB * l1KB;
    if (isNumber) {
        if (size < l1KB) {
            size = size + 'b';
        }
        else if (size < l1MB) {
            size = (size / l1KB).toFixed(2) + 'kb';
        }
        else if (size < l1GB) {
            size = (size / l1MB).toFixed(2) + 'mb';
        }
        else if (size < l1TB) {
            size = (size / l1GB).toFixed(2) + 'gb';
        }
        else if (size < l1PB) {
            size = (size / l1TB).toFixed(2) + 'tb';
        }
        else {
            size = (size / l1PB).toFixed(2) + 'pb';
        }
    }
    return size;
}
exports.FileSizeToString = FileSizeToString;
class DirectoryService extends Base_1.BaseService {
    constructor(config) {
        super(config.configPath, config.relativeVariables, config.absoluteVariables);
        // implement Base#method
        this.method = 'XCOM_Directory_Service';
    }
    init() {
    }
    // implement IVFS#get for non sending mode
    _get(path, attachment, send) {
        return __awaiter(this, void 0, void 0, function* () {
            return new AnyPromise((resolve, reject) => {
                const split = path.split('://');
                const mount = split[0];
                const vfs = this.getVFS(mount);
                path = split[1];
                if (!vfs) {
                    reject('Cant find VFS for ' + mount);
                }
                vfs.readfile(path, {}, (err, meta) => {
                    let data = "";
                    if (err) {
                        reject("error reading file : " + err);
                    }
                    meta.stream.on("data", (d) => {
                        data += d;
                    });
                    let done;
                    meta.stream.on("error", (e) => {
                        if (done) {
                            return;
                        }
                        done = true;
                        resolve(data);
                    });
                    meta.stream.on("end", () => {
                        if (done) {
                            return;
                        }
                        done = true;
                        resolve(data);
                    });
                });
            });
        });
    }
    // implement IVFS#get
    // @before((context, args) => validateArgs(args)
    get(path, attachment, send, dummy = false, reqest = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!attachment && !send) {
                return yield this._get(path, attachment, send);
            }
        });
    }
    set(mount, path, content, reqest = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return new AnyPromise((resolve, reject) => {
                const vfs = this.getVFS(mount);
                if (vfs) {
                    vfs.writefile(this.resolvePath(mount, path), content, this.WRITE_MODE);
                    resolve(true);
                }
                else {
                    reject('Cant find VFS for ' + mount);
                }
            });
        });
    }
    rename(mount, path, newFileName, dummy, reqest = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return new AnyPromise((resolve, reject) => {
                const vfs = this.getVFS(mount);
                if (vfs) {
                    vfs.rename(path, { to: newFileName }, (err, meta) => {
                        err ? reject(err) : resolve(true);
                    });
                }
                else {
                    reject('Cant find VFS for ' + mount);
                }
            });
        });
    }
    mkdir(mount, path, reqest = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return new AnyPromise((resolve, reject) => {
                const vfs = this.getVFS(mount);
                if (vfs) {
                    vfs.mkdir(path, {}, (err, data) => {
                        if (err) {
                            reject("error reading file : " + err);
                        }
                        else {
                            resolve(true);
                        }
                    });
                    resolve(true);
                }
                else {
                    reject('Cant find VFS for ' + mount);
                }
            });
        });
    }
    mkfile(mount, _path, content, reqest = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return new AnyPromise((resolve, reject) => {
                const vfs = this.getVFS(mount);
                const resolved = this.resolvePath(mount, _path);
                if (vfs) {
                    if (fs.existsSync(resolved)) {
                        resolve(true);
                        return;
                    }
                    _fs.outputFile(resolved, content || '', function (error) {
                        if (error) {
                            reject('Error writing file: ' + error);
                        }
                        else {
                            resolve(true);
                        }
                    });
                }
                else {
                    reject('Cant find VFS for ' + mount);
                }
            });
        });
    }
    resolveShort(_path) {
        if (_path.startsWith('/')) {
            _path = _path.replace('/', '');
        }
        const mount = _path.split('/')[0];
        let parts = _path.split('/');
        parts.shift();
        console.log('resolve : ', _path);
        return {
            mount: mount,
            path: parts.join('/')
        };
    }
    getFiles(dir) {
        const result = [];
        const files = fs.readdirSync(dir);
        for (let i in files) {
            typeof files[i] === 'string' && result.push(files[i]);
        }
        return result;
    }
    copy(selection, dst, options, dummy = true, reqest = null) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
                    let b = {
                        "params": {
                            "selection": ["workspace_user/Tutorials/index.css"],
                            "dst": "/workspace_user/Tutorials/",
                            "options": {
                                "include": ["*", ".*"],
                                "exclude": [], "mode": 1502
                            }, "singleton": true
                        }
                    };
            */
            return new AnyPromise((resolve, reject) => {
                let destParts = this.resolveShort(dst);
                const dstVFS = this.getVFS(destParts['mount']);
                if (!dstVFS) {
                    reject('Cant find target VFS for ' + destParts['mount']);
                }
                const targetDirectory = this.resolvePath(destParts['mount'], destParts['path']);
                let errors = [];
                // let success: Array<string> = [];
                let others = this.getFiles(targetDirectory);
                function newName(name) {
                    let ext = _path.extname(name);
                    let fileName = _path.basename(name, ext);
                    let found = false;
                    let i = 1;
                    let newName = null;
                    while (!found) {
                        newName = fileName + '-' + i + ext;
                        const colliding = _.find(others, {
                            name: newName
                        });
                        if (!colliding) {
                            found = true;
                        }
                        else {
                            i++;
                        }
                    }
                    return newName;
                }
                _.each(selection, (path) => {
                    let srcParts = this.resolveShort(path);
                    const srcVFS = this.getVFS(srcParts['mount']);
                    if (!srcVFS) {
                        reject('Cant find VFS for ' + srcParts['mount']);
                    }
                    let srcPath = this.resolvePath(srcParts['mount'], srcParts['path']);
                    const exists = others.indexOf(_path.basename(srcPath)) !== -1;
                    const newPath = exists ? (_path.dirname(srcPath) + _path.sep + newName(_path.basename(srcPath))) : (_path.dirname(targetDirectory) + _path.sep + _path.basename(srcPath));
                    _fs.copy(srcPath, newPath, function (err) {
                        if (err) {
                            errors.push(err);
                        }
                    });
                });
                _.isEmpty(errors) ? resolve(true) : reject(errors);
            });
        });
    }
    // @TODO: ugly back compat for xphp in here!
    delete(selection, options, reqest = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return new AnyPromise((resolve, reject) => {
                const first = selection[0];
                const mount = first.split('/')[0];
                const vfs = this.getVFS(mount);
                let error = null;
                if (!vfs) {
                    reject('Cant find VFS for ' + mount);
                }
                _.each(selection, (_path) => {
                    let parts = _path.split('/');
                    parts.shift();
                    _path = parts.join('/');
                    try {
                        vfs.rm(this.resolvePath(mount, _path), {}, resolve, reject);
                    }
                    catch (e) {
                        reject(e);
                    }
                });
                error ? reject(error) : resolve(true);
            });
        });
    }
    getVFS(mount) {
        const resource = this.getResourceByTypeAndName(Resource_1.EResourceType.FILE_PROXY, mount);
        if (resource) {
            const root = this.resolveAbsolute(resource);
            try {
                if (fs.lstatSync(root)) {
                    return Local_1.create({
                        root: root,
                        nopty: true
                    });
                }
            }
            catch (e) {
            }
        }
        return null;
    }
    resolvePath(mount, path) {
        const resource = this.getResourceByTypeAndName(Resource_1.EResourceType.FILE_PROXY, mount);
        if (resource) {
            return _path.join(this.resolveAbsolute(resource), path);
        }
        return null;
    }
    getOwner(uid) {
        if (posix) {
            if (posixCache[uid]) {
                return posixCache[uid];
            }
            const entry = { name: posix.getpwnam(uid)['name'] };
            return posixCache[uid] = entry;
        }
        else {
            return { name: "unknown" };
        }
    }
    mapNode(node, mount) {
        const fsNodeStat = fs.statSync(node.path);
        const isDirectory = fsNodeStat.isDirectory();
        const parent = node.parent || "";
        // const _size = isDirectory ? await size(node.path) : false;
        // console.log('size: ' + node.path, _size);
        const result = {
            path: './' + _path.join(parent, node.name),
            sizeBytes: fsNodeStat.size,
            size: isDirectory ? 'Folder' : FileSizeToString(fsNodeStat.size),
            owner: {
                user: this.getOwner(fsNodeStat.uid),
                group: this.getOwner(fsNodeStat.gid)
            },
            mode: fsNodeStat.mode,
            isDir: isDirectory,
            directory: isDirectory,
            mime: isDirectory ? 'directory' : mime.lookup(node.path),
            name: _path.win32.basename(node.path),
            fileType: isDirectory ? 'folder' : 'file',
            modified: fsNodeStat.mtime.getTime() / 1000,
            mount: mount,
            parent: parent
        };
        isDirectory && (result['_EX'] = false);
        return result;
    }
    _ls(path, mount, options, recursive = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            return new AnyPromise((resolve, reject) => {
                const vfs = this.getVFS(mount);
                if (vfs) {
                    vfs.readdir(path, {}, (err, meta) => {
                        if (err) {
                            throw err;
                        }
                        let nodes = [];
                        meta.stream.on('data', (data) => nodes.push(self.mapNode(data, mount)));
                        meta.stream.on('end', () => resolve(nodes));
                    });
                }
                else {
                    reject(`cant get VFS for mount '${mount}'`);
                }
            });
        });
    }
    // implement VFS#ls
    ls(path, mount, options, recursive = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const nodes = yield this._ls(path, mount, options, recursive);
            const root = {
                items: [{
                        _EX: true,
                        children: nodes,
                        mount: mount,
                        name: path,
                        path: path,
                        directory: true,
                        size: 0
                    }]
            };
            DEBUG && console.log('nodes', nodes);
            return root;
        });
    }
    getRpcMethods() {
        throw new Error("Should be implemented by decorator");
    }
    methods() {
        const methods = this.getRpcMethods();
        return this.toMethods(methods);
    }
}
__decorate([
    Base_2.RpcMethod,
    AspectDecorator_1.before((context, args) => Base_1.decodeArgs(args, "$['0']", base64_1.to)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, Boolean, Boolean, Object]),
    __metadata("design:returntype", Promise)
], DirectoryService.prototype, "get", null);
__decorate([
    Base_2.RpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], DirectoryService.prototype, "set", null);
__decorate([
    Base_2.RpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Boolean, Object]),
    __metadata("design:returntype", Promise)
], DirectoryService.prototype, "rename", null);
__decorate([
    Base_2.RpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], DirectoryService.prototype, "mkdir", null);
__decorate([
    Base_2.RpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], DirectoryService.prototype, "mkfile", null);
__decorate([
    Base_2.RpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String, Object, Boolean, Object]),
    __metadata("design:returntype", Promise)
], DirectoryService.prototype, "copy", null);
__decorate([
    Base_2.RpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object, Object]),
    __metadata("design:returntype", Promise)
], DirectoryService.prototype, "delete", null);
__decorate([
    Base_2.RpcMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Boolean]),
    __metadata("design:returntype", Promise)
], DirectoryService.prototype, "ls", null);
exports.DirectoryService = DirectoryService;
//# sourceMappingURL=Directory.js.map