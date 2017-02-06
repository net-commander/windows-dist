"use strict";
const Resource_1 = require("../interfaces/Resource");
const Resolver_1 = require("../resource/Resolver");
const utils = require("../utils/StringUtils");
const fs = require("fs");
const _ = require("lodash");
const mkdirp = require("mkdirp");
const _path = require("path");
const write = require('write-file-atomic');
const qs = require('qs').parse;
const permissionError = 'You don\'t have access to this file.';
const defaultPathMode = parseInt('0700', 8);
const writeFileOptions = { mode: parseInt('0600', 8) };
const io = {
    parse: JSON.parse,
    serialize: JSON.stringify
};
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
    _getUser(request) {
        if (request) {
            const urlArgs = qs(request.get('referrer'));
            let user = urlArgs['userDirectory'];
            if (user) {
                return user;
            }
        }
        else {
            console.warn('have no request', new Error().stack);
        }
    }
    _getRequest(args) {
        for (let i = 0; i < args.length; i++) {
            if (args[i] && args[i]['get'] && args[i]['socket']) {
                return args[i];
            }
        }
        return null;
    }
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
            return io.parse(fs.readFileSync(path, 'utf8'));
        }
        catch (err) {
            console.error('Error reading config : ' + path + ' in ' + this.method);
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
                write.sync(path, '', writeFileOptions);
                return {};
            }
            throw err;
        }
    }
    writeConfig(path, val) {
        path = path || this.configPath;
        val = val || this.readConfig(path);
        try {
            // make sure the folder exists as it
            // could have been deleted in the meantime
            mkdirp.sync(_path.dirname(path), defaultPathMode);
            write.sync(path, JSON.stringify(val, null, 4), writeFileOptions);
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
    _resolveUserMount(mount, request, _default) {
        return _default;
    }
    resolve(mount, path, request) {
        const resource = this.getResourceByTypeAndName(Resource_1.EResourceType.FILE_PROXY, mount);
        if (resource) {
            let userRoot = this.resolveAbsolute(resource);
            if (request) {
                userRoot = this._resolveUserMount(mount, request, userRoot);
            }
            else {
                console.warn('BaseService: have no request', new Error().stack);
            }
            return _path.join(userRoot, path);
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
        throw new Error('Decoding args  failed ' + path);
    }
    return args;
}
exports.decodeArgs = decodeArgs;
//# sourceMappingURL=Base.js.map