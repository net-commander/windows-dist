"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// http://192.168.1.37:5555/app/xcf?debug=true&xtrack=false&drivers=true&devices=true&xace=true&files=true&protocols=false&x-markdown=false&xideve=true&admin=true&nserver=true&xnode=debug&xfile=debug
const _ = require("lodash");
const Base_1 = require("./../Base");
const Service_1 = require("../../interfaces/Service");
const app_1 = require("./route/app");
const smd_1 = require("../../route/smd");
const routes_1 = require("../../routes");
const files_1 = require("../../route/files");
const uploads_1 = require("../../route/uploads");
const JSON_RPC_2_1 = require("../../rpc/JSON-RPC-2");
const Devices_1 = require("../../services/Devices");
const Directory_1 = require("../../services/Directory");
const Drivers_1 = require("../../services/Drivers");
const JSONFile_1 = require("../../services/JSONFile");
const Mounts_1 = require("../../services/Mounts");
const Services_1 = require("../../services/Services");
const Tracking_1 = require("../../services/Tracking");
const Mongod_1 = require("../../services/external/Mongod");
const Workbench_1 = require("../../components/services/Workbench");
const Logs_1 = require("../../services/Logs");
const register_1 = require("../../services/register");
const Koa = require("koa");
const convert = require("koa-convert");
const bodyParser = require("koa-bodyparser");
const serve = require("koa-static");
const path = require("path");
const mount = require('koa-mount');
// tslint:disable-next-line:interface-name
class ControlFreak extends Base_1.ApplicationBase {
    constructor(options) {
        super(options.root);
        this.deviceServer = null;
        this.options = options;
        this.root = options.root;
        const APP_ROOT = this.root;
        const CLIENT_ROOT = path.join(APP_ROOT, 'Code/client/src/');
        const NODE_ROOT = options.release ? process.cwd() : path.join(APP_ROOT, 'server/nodejs/');
        const USER_DIRECTORY = path.join(APP_ROOT, '/user');
        const DATA_ROOT = path.join(APP_ROOT, '/data/');
        const DB_ROOT = path.join(DATA_ROOT, '/db/');
        const SYSTEM_ROOT = path.join(DATA_ROOT, '/system/');
        const VFS_CONFIG = {
            'workspace': path.join(USER_DIRECTORY, 'workspace'),
            'workspace_user': path.join(USER_DIRECTORY, 'workspace'),
            'docs': path.join(APP_ROOT, 'documentation/docFiles'),
            'system_drivers': path.join(SYSTEM_ROOT, 'drivers'),
            'user_drivers': path.join(USER_DIRECTORY, 'drivers'),
            'system_devices': path.join(SYSTEM_ROOT, 'devices'),
            'user_devices': path.join(USER_DIRECTORY, 'devices')
        };
        let params = {
            APP_ROOT: APP_ROOT,
            DB_ROOT: DB_ROOT,
            USER_DIRECTORY: USER_DIRECTORY,
            DATA_ROOT: DATA_ROOT,
            SYSTEM_ROOT: SYSTEM_ROOT,
            NODE_ROOT: NODE_ROOT,
            CLIENT_ROOT: CLIENT_ROOT,
            relativeVariables: {
                'XASWEB': '../Code/client/src/',
                'APP_URL': '../Code/client/src',
                'APP_URL_VE': '../',
                'RPC_URL': '../smd',
                'XCF_SYSTEM_DRIVERS': '""',
                'XCF_USER_DRIVERS': '""',
                'XCF_SYSTEM_DEVICES': '""',
                'XCF_USER_DEVICES': '""',
                'XCF_MOUNTS': '{}',
                'XCF_DRIVER_VFS_CONFIG': '{}',
                'XCF_DEVICE_VFS_CONFIG': '{}',
                'XAPP_PLUGIN_RESOURCES': '{}',
                'THEME': 'white',
                "COMPONENTS": {
                    "xfile": true,
                    "xnode": true,
                    "xideve": { cmdOffset: '/' },
                    "xblox": true,
                    "x-markdown": true,
                    "xtrack": true,
                    "protocols": false
                },
                VFS_CONFIG: VFS_CONFIG,
                USER_DIRECTORY: USER_DIRECTORY,
                VFS_GET_URL: '../../files/'
            },
            absoluteVariables: {
                'XASWEB': path.join(CLIENT_ROOT)
            }
        };
        let packages = this.packages('../../../../../');
        let relativeVariables = params['relativeVariables'];
        relativeVariables['DOJOPACKAGES'] = JSON.stringify(packages);
        relativeVariables['RESOURCE_VARIABLES'] = JSON.stringify(relativeVariables);
        this.config = params;
        this.config['NODE_ROOT'] = NODE_ROOT;
    }
    externalServices() {
        const mongod = new Mongod_1.Mongod({
            db: path.join(this.path(Base_1.EEKey.DB_ROOT), '/mongo')
        });
        return [mongod];
    }
    vfsConfig() {
        return {
            configPath: path.join(this.path('SYSTEM_ROOT'), 'vfs.json'),
            relativeVariables: {},
            absoluteVariables: this.vfsMounts()
        };
    }
    serviceConfig() {
        return Service_1.create(this.vfsConfig(), this);
    }
    rpcServices() {
        if (this._rpcServices) {
            return this._rpcServices;
        }
        const serviceConfig = this.serviceConfig();
        const settingsService = this.settingsService = new JSONFile_1.JSONFileService(path.join(this.path('USER_DIRECTORY'), 'settings.json'));
        const directoryService = this.directoryService = new Directory_1.DirectoryService(this.vfsConfig());
        const mountService = new Mounts_1.MountService(path.join(this.path('DATA_ROOT'), 'system/vfs.json'));
        const driverService = new Drivers_1.DriverService(serviceConfig);
        const devicesService = new Devices_1.DeviceService(serviceConfig);
        const logsService = new Logs_1.LogsService(serviceConfig);
        const nodeService = new Services_1.NodeService(path.join(this.path('DATA_ROOT'), 'system/services-debug.json'));
        const workbenchService = new Workbench_1.WorkbenchService(serviceConfig);
        const trackingService = new Tracking_1.TrackingService(path.join(this.path('USER_DIRECTORY'), 'meta.json'));
        this._rpcServices = [directoryService, mountService, driverService, devicesService, logsService, nodeService, settingsService, workbenchService, trackingService];
        return this._rpcServices;
    }
    routes() {
        if (this._routes) {
            return this._routes;
        }
        const filesRoute = files_1.create(this.directoryService, '/files', this);
        const uploadRoute = uploads_1.create(this.directoryService, '/upload', this);
        this._routes = [routes_1.default, filesRoute, app_1.default, smd_1.default, uploadRoute];
        return this._routes;
    }
    setup() {
        super.setup();
        // RPC stack
        this.rpc2 = JSON_RPC_2_1.JSON_RPC_2();
        const rpcApp = new Koa();
        rpcApp.use(convert(this.rpc2.app()));
        this.use(convert(mount('/api', rpcApp)));
        // RPC services
        const services = this.rpcServices();
        _.each(services, service => {
            register_1.registerService(this.rpc2, service, this);
        });
        // Generics
        this.use(convert(bodyParser({
            formLimit: null
        })));
        // Routes
        const routes = this.routes();
        _.each(routes, route => {
            this.use(route.routes());
            this.use(route.allowedMethods());
        });
        // Extras
        this.use(serve(this.path(Base_1.EEKey.APP_ROOT)));
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            this.deviceServer.destroy();
            // @TODO: get rid of 'server-destroy'
            this.server['destroy']();
            const services = this.externalServices();
            let last = null;
            try {
                const res = [];
                for (let index = 0; index < services.length; index++) {
                    let service = services[index];
                    last = service;
                    res.push(yield service.stop());
                }
                return Promise.resolve(res);
            }
            catch (e) {
                console.error('Error stopping ' + last.label(), e);
            }
        });
    }
    boot() {
        return __awaiter(this, void 0, void 0, function* () {
            const services = this.externalServices();
            for (let index = 0; index < services.length; index++) {
                yield services[index].run();
            }
            this._externalServices = services;
            Promise.resolve(true);
        });
    }
    run(deviceServer = true) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            process.once('SIGINT', (e) => { return this.stop(); });
            yield this.boot();
            return new Promise((resolve, reject) => {
                this.setup();
                _super("run").call(this);
                this.use(convert(serve(this.path(Base_1.EEKey.APP_ROOT))));
                this.server.listen(this.options.port || process.env.PORT || 5555, '0.0.0.0');
                if (!deviceServer) {
                    return Promise.resolve(true);
                }
                const amdRequire = require(path.join(process.cwd(), !this.options.release ? '../dojo/dojo-require' : '/dojo/dojo-require'));
                const dojoRequire = amdRequire(path.join(this.path(Base_1.EEKey.CLIENT_ROOT), '/lib'), this.path('NODE_ROOT'));
                const loader = this.options.release ? 'nxappmain/main_server_ts_build' : 'nxappmain/main_server_ts';
                // as we don't really consume/mix AMD modules, we get the data over the xide/Context
                global.process.on('device-server-ready', (context) => {
                    // @TODO: v1 context in v2 app?
                    this.deviceServer = context;
                    resolve(context);
                });
                try {
                    dojoRequire([loader], (_module) => { });
                }
                catch (e) {
                    const message = 'Error in nxappmain/' + loader;
                    reject(message);
                }
            });
        });
    }
    _package(name, prefix, suffix) {
        // @TODO: check TS str interpolators
        let loc = (prefix || name);
        !~loc.endsWith('/') && (loc = loc + '/');
        suffix && !~suffix.endsWith('/') && (suffix = suffix + '/');
        return {
            name: name,
            location: loc + suffix
        };
    }
    packages(offset, baseUrl) {
        baseUrl = baseUrl || '';
        return [
            this._package('system_drivers', offset),
            this._package('user_drivers', offset),
            this._package('workspace', offset),
            this._package('maq-metadata-dojo', baseUrl, 'xideve/metadata/dojo/1.8/'),
            this._package('maq-metadata-html', baseUrl, 'xideve/metadata/html/0.8/'),
            this._package('maq-metadata-delite', baseUrl, 'xideve/metadata/delite/0.8/')
        ];
    }
}
exports.ControlFreak = ControlFreak;
//# sourceMappingURL=index.js.map