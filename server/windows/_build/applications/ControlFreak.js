"use strict";
// http://192.168.1.37:5555/app/xcf?debug=true&xtrack=false&drivers=true&devices=true&xace=true&files=true&protocols=false&x-markdown=false&xideve=true&admin=true&nserver=true&xnode=debug&xfile=debug
const global = require("../global");
const _ = require("lodash");
const Base_1 = require("./Base");
const Service_1 = require("../interfaces/Service");
const app_1 = require("../route/app");
const smd_1 = require("../route/smd");
const routes_1 = require("../routes");
const files_1 = require("../route/files");
const uploads_1 = require("../route/uploads");
const JSON_RPC_2_1 = require("../rpc/JSON-RPC-2");
const Devices_1 = require("../services/Devices");
const Directory_1 = require("../services/Directory");
const Drivers_1 = require("../services/Drivers");
const JSONFile_1 = require("../services/JSONFile");
const Mounts_1 = require("../services/Mounts");
const Services_1 = require("../services/Services");
const Logs_1 = require("../services/Logs");
const register_1 = require("../services/register");
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const serve = require("koa-static");
const path = require("path");
const serveIndex = require('koa-serve-index');
const views = require('koa-views');
const mount = require('koa-mount');
class ControlFreak extends Base_1.ApplicationBase {
    ;
    constructor(root) {
        super(root);
        this.root = root;
        const APP_ROOT = root;
        const CLIENT_ROOT = path.join(APP_ROOT, 'Code/client/');
        const NODE_ROOT = path.join(APP_ROOT, 'server/nodejs/');
        const USER_DIRECTORY = path.join(APP_ROOT, '/user');
        const DATA_ROOT = path.join(APP_ROOT, '/data/');
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
            USER_DIRECTORY: USER_DIRECTORY,
            DATA_ROOT: DATA_ROOT,
            SYSTEM_ROOT: SYSTEM_ROOT,
            NODE_ROOT: NODE_ROOT,
            CLIENT_ROOT: CLIENT_ROOT,
            relativeVariables: {
                'XASWEB': '../Code/client/src/',
                'APP_URL': '../Code/client/src/',
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
                    "xideve": false,
                    "xblox": true,
                    "x-markdown": false,
                    "xtrack": false
                },
                VFS_CONFIG: VFS_CONFIG,
                USER_DIRECTORY: USER_DIRECTORY
            },
            absoluteVariables: {
                'XASWEB': APP_ROOT + '/Code/client/src/'
            }
        };
        let packages = this.packages();
        let relativeVariables = params['relativeVariables'];
        relativeVariables['DOJOPACKAGES'] = JSON.stringify(packages);
        relativeVariables['RESOURCE_VARIABLES'] = JSON.stringify(relativeVariables);
        global['params'] = params;
        this.config = params;
    }
    relativeVariable(key) {
        return this.config['relativeVariables'][key];
    }
    path(key) {
        return this.config[key];
    }
    vfsMounts() {
        return this.relativeVariable('VFS_CONFIG');
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
    services() {
        if (this._services) {
            return this._services;
        }
        const serviceConfig = this.serviceConfig();
        const settingsService = new JSONFile_1.JSONFileService(path.join(this.path('USER_DIRECTORY'), 'settings.json'));
        const directoryService = this.directoryService = new Directory_1.DirectoryService(this.vfsConfig());
        const mountService = new Mounts_1.MountService(path.join(this.path('DATA_ROOT'), 'system/vfs.json'));
        const driverService = new Drivers_1.DriverService(serviceConfig);
        const devicesService = new Devices_1.DeviceService(serviceConfig);
        const logsService = new Logs_1.LogsService(serviceConfig);
        const nodeService = new Services_1.NodeService(path.join(this.path('DATA_ROOT'), 'system/services-debug.json'));
        this._services = [directoryService, mountService, driverService, devicesService, logsService, nodeService, settingsService];
        return this._services;
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
        this.use(views(`${__dirname}/views`, { extension: 'ejs' }));
        // RPC stack
        this.rpc2 = JSON_RPC_2_1.JSON_RPC_2();
        const rpcApp = new Koa();
        rpcApp.use(this.rpc2.app());
        this.use(mount('/api', rpcApp));
        // RPC services
        const services = this.services();
        _.each(services, service => {
            register_1.registerService(this.rpc2, service, this);
        });
        // Generics
        this.use(bodyParser({
            formLimit: null
        }));
        // Routes
        const routes = this.routes();
        _.each(routes, route => {
            this.use(route.routes());
            this.use(route.allowedMethods());
        });
        // Extras
        this.use(serveIndex(this.path('APP_ROOT')));
    }
    run() {
        this.boot();
        this.setup();
        super.run();
        this.use(serve(this.path('APP_ROOT')));
        const port = process.env.PORT || 5555;
        this.listen(port, '0.0.0.0', function () {
            console.log(`Listening on port ${port}`);
        });
        const _ = require('lodash');
        global['_'] = _;
        const amdRequire = require(this.path('NODE_ROOT') + '/dojo/dojo-require');
        const dojoRequire = amdRequire(path.join(this.path('CLIENT_ROOT'), 'src/lib'), this.path('NODE_ROOT'));
        try {
            dojoRequire(['nxappmain/main_server_ts']);
        }
        catch (e) {
            console.error('error', e);
        }
    }
    packages() {
        return [
            {
                name: 'system_drivers',
                location: '../../../../../files/system_drivers/'
            },
            {
                name: 'user_drivers',
                location: '../../../../../files/user_drivers/'
            },
            {
                name: 'workspace',
                location: '../../../../../files/workspace/'
            }
        ];
    }
}
exports.ControlFreak = ControlFreak;
//# sourceMappingURL=ControlFreak.js.map