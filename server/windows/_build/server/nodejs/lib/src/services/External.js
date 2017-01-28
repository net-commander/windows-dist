"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//
// ─── Base class to express an external service binary
//
const Base_1 = require("../services/Base");
const os = require('os');
const path = require('path');
const fs = require('fs');
const _ = require("lodash");
function exists(_path) {
    try {
        return fs.statSync(path.resolve(_path));
    }
    catch (e) {
    }
    return null;
}
var EStatus;
(function (EStatus) {
    EStatus[EStatus["INACTIVE"] = 0] = "INACTIVE";
    EStatus[EStatus["STARTED"] = 1] = "STARTED";
    EStatus[EStatus["STARTING"] = 2] = "STARTING";
    EStatus[EStatus["RUNNING"] = 3] = "RUNNING";
    EStatus[EStatus["ERROR"] = 4] = "ERROR";
    EStatus[EStatus["INVALID"] = 5] = "INVALID";
})(EStatus = exports.EStatus || (exports.EStatus = {}));
var EFlags;
(function (EFlags) {
    // No particual behaviour
    EFlags[EFlags["None"] = 0] = "None";
    // This service is needed to run the application, otherwise allow failed
    EFlags[EFlags["REQUIRED"] = 1] = "REQUIRED";
    // This service can be retrieved from a system daemon or an existing instance
    EFlags[EFlags["SHARED"] = 2] = "SHARED";
})(EFlags = exports.EFlags || (exports.EFlags = {}));
class ExternalService extends Base_1.BaseService {
    constructor(config) {
        super(config, null, null);
        this.process = null;
        this.flags = EFlags.None;
        this.status = EStatus.INVALID;
        this.searchPaths = [];
        if (_.isString(config)) {
            this.configPath = config;
        }
        else if (_.isObject(config)) {
            this.config = config;
        }
    }
    //
    // ─── DESCRIPTORS ────────────────────────────────────────────────────────────────
    //
    /**
     * Return an unique label for this service.
     * - This is being used to help finding the binary.
     * @returns {string}
     *
     * @memberOf ExternalService
     */
    label() {
        return "No Name";
    }
    /**
     * Return the filename of the binary.
     * - This is being used to help finding the binary.
     */
    filename() {
        return "No File Name";
    }
    /**
     * Return the fully resolved path to the application's binary
     *
     * @returns {string}
     *
     * @memberOf ExternalService
     */
    path() {
        return this.find(this.filename());
    }
    /**
     * Return a list of depending services, using unique 'label'
     *
     * @returns {List<string>}
     *
     * @memberOf ExternalService
     */
    dependencies() {
        return [];
    }
    //
    // ─── API ────────────────────────────────────────────────────────────────
    //
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Start not implemented in sub class " + this.label());
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Stop not implemented in sub class " + this.label());
        });
    }
    pause() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Pause not implemented in sub class " + this.label());
        });
    }
    resume() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Resume not implemented in sub class " + this.label());
        });
    }
    validate() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                resolve(true);
            });
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                console.log('init ' + this.label());
                resolve(true);
            });
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.init()) {
                if (yield this.validate()) {
                    yield this.start();
                }
            }
        });
    }
    info() {
        return {
            label: this.label(),
            status: this.status
        };
    }
    //
    // ─── UTILS ──────────────────────────────────────────────────────────────────────
    //
    _findInWindowsByPath(filename) {
    }
    _findInWindowsByRegistry(filename) {
    }
    _findInWindows(filename) {
        return '';
    }
    _findInLinux(filename) {
        // 1. try search paths
        let result = null;
        for (let index = 0; index < this.searchPaths.length; index++) {
            let test = this.searchPaths[index];
            // try path as is
            if (exists(test)) {
                result = test;
                break;
            }
            // try with file Name
            if (exists(path.join(test, filename))) {
                result = test;
                break;
            }
        }
        // 2. try via which
        const which = require('which');
        const whichResult = which.sync(filename);
        if (whichResult) {
            result = whichResult;
        }
        return result;
    }
    find(filename = this.filename()) {
        switch (os.platform()) {
            case 'win32': {
                return this._findInWindows(filename);
            }
            case 'linux': {
                return this._findInLinux(filename);
            }
        }
    }
}
exports.ExternalService = ExternalService;
//# sourceMappingURL=External.js.map