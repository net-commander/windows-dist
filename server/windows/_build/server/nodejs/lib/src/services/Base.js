"use strict";
const Resource_1 = require("../interfaces/Resource");
const Resolver_1 = require("../resource/Resolver");
const utils = require("../utils/StringUtils");
const fs = require("fs");
const _ = require("lodash");
const mkdirp = require("mkdirp");
const _path = require("path");
const writeFileAtomic = require('write-file-atomic');
const permissionError = 'You don\'t have access to this file.';
const defaultPathMode = parseInt('0700', 8);
const writeFileOptions = { mode: parseInt('0600', 8) };
exports.RpcMethod = (target, propName, propertyDescriptor) => {
    const desc = Object.getOwnPropertyDescriptor(target, "getRpcMethods");
    if (desc && desc.configurable) {
        Object.defineProperty(target, "getRpcMethods", { value: function () { return this["rpcMethods"]; }, configurable: false });
        Object.defineProperty(target, "rpcMethods", { value: [] });
    }
    target && target["rpcMethods"] && target["rpcMethods"].push(propName);
};
class BaseService extends Resolver_1.ResourceResolver {
    constructor(config, relativeVariables, absoluteVariables) {
        super(config, relativeVariables, absoluteVariables);
        this.WRITE_MODE = writeFileOptions;
        this.method = "no_method";
    }
    init() { }
    ;
    getRpcMethods() {
        throw new Error("Should be implemented by decorator");
    }
    methods() {
        const methods = this.getRpcMethods();
        return this.toMethods(methods);
    }
    readConfig(path) {
        path = path || this.configPath;
        try {
            return JSON.parse(fs.readFileSync(path, 'utf8'));
        }
        catch (err) {
            // create dir if it doesn't exist
            if (err.code === 'ENOENT') {
                mkdirp.sync(_path.dirname(path), defaultPathMode);
                return {};
            }
            // improve the message of permission errors
            if (err.code === 'EACCES') {
                err.message = err.message + '\n' + permissionError + '\n';
            }
            // empty the file if it encounters invalid JSON
            if (err.name === 'SyntaxError') {
                writeFileAtomic.sync(path, '', writeFileOptions);
                return {};
            }
            throw err;
        }
    }
    writeConfig(path, val) {
        path = path || this.configPath;
        val = val || this.readConfig();
        try {
            // make sure the folder exists as it
            // could have been deleted in the meantime
            mkdirp.sync(_path.dirname(this.configPath), defaultPathMode);
            writeFileAtomic.sync(this.configPath, JSON.stringify(val, null, 4), writeFileOptions);
        }
        catch (err) {
            // improve the message of permission errors
            if (err.code === 'EACCES') {
                err.message = err.message + '\n' + permissionError + '\n';
            }
            throw err;
        }
    }
    toMethods(methods) {
        const self = this;
        const result = {};
        _.each(methods, function (method) {
            result[method] = self[method];
        });
        return result;
    }
    resolveAbsolute(resource, property) {
        if (!property) {
            switch (resource.type) {
                case Resource_1.EResourceType.JS_HEADER_INCLUDE:
                case Resource_1.EResourceType.JS_HEADER_SCRIPT_TAG:
                case Resource_1.EResourceType.CSS: {
                    property = "url";
                    break;
                }
                case Resource_1.EResourceType.FILE_PROXY: {
                    property = "path";
                    break;
                }
            }
        }
        return utils.replace(resource[property], null, this.absoluteVariables, Resource_1.DefaultDelimitter());
    }
    resolve(mount, path) {
        const resource = this.getResourceByTypeAndName(Resource_1.EResourceType.FILE_PROXY, mount);
        if (resource) {
            return _path.join(this.resolveAbsolute(resource), path);
        }
        return null;
    }
    resources() {
        const config = this.readConfig(this.configPath);
        if (config) {
            return config.items;
        }
        return [];
    }
    getResourceByTypeAndName(type, name) {
        const resources = this.resources();
        if (resources) {
            return _.find(resources, {
                type: type,
                name: name
            });
        }
        return null;
    }
}
exports.BaseService = BaseService;
function decodeArgs(args, path, decoder) {
    try {
        decoder(args, path);
    }
    catch (e) {
        console.error('Decoding args  failed ' + path, e);
    }
    return args;
}
exports.decodeArgs = decodeArgs;
//# sourceMappingURL=Base.js.map