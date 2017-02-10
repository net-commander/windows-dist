"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Base_1 = require("./../Base");
const Service_1 = require("../../interfaces/Service");
const app_1 = require("./route/app");
const smd_1 = require("../../route/smd");
const routes_1 = require("../../routes");
const files_1 = require("../../route/files");
const uploads_1 = require("../../route/uploads");
const JSON_RPC_2_1 = require("../../rpc/JSON-RPC-2");
const Devices_1 = require("../../services/Devices");
const Directory_1 = require("./services/Directory");
const Drivers_1 = require("../../services/Drivers");
const JSONFile_1 = require("../../services/JSONFile");
const Mounts_1 = require("../../services/Mounts");
const Services_1 = require("../../services/Services");
const Tracking_1 = require("../../services/Tracking");
const Mongod_1 = require("../../services/external/Mongod");
const xideve_1 = require("../../components/xideve/xideve");
const Logs_1 = require("../../services/Logs");
const register_1 = require("../../services/register");
const Koa = require("koa");
const convert = require("koa-convert");
const bodyParser = require("koa-bodyparser");
const serve = require("koa-static");
const path = require("path");
const _ = require("lodash");
const os = require("os");
const file_1 = require("../../io/file");
const json_1 = require("../../io/json");
const yargs_parser = require("yargs-parser");
const mount = require('koa-mount');
const qs = require('qs').parse;
const argv = yargs_parser(process.argv.slice(2));
const util = require('util');
const osTmpdir = require('os-tmpdir');
const mkdirp = require('mkdirp');
const console_1 = require("../../console");
const io = {
    serialize: JSON.stringify
};
var MODULE_ROOT = "../../";
// tslint:disable-next-line:interface-name
class ControlFreak extends Base_1.ApplicationBase {
    constructor(options) {
        super(options.root);
        this.deviceServer = null;
        this.profile = null;
        this.options = options;
        this.root = options.root;
        const APP_ROOT = this.root;
        const CLIENT_ROOT = path.join(APP_ROOT, 'Code/client/src/');
        const NODE_ROOT = options.release ? process.cwd() : path.join(APP_ROOT, 'server/nodejs/');
        const USER_DIRECTORY = path.join(APP_ROOT, '/user');
        const DATA_ROOT = path.join(APP_ROOT, '/data/');
        const TMP_PATH = osTmpdir();
        if (argv.mqtt !== 'false') {
            try {
                mkdirp.sync(TMP_PATH + path.sep + '_MONGO');
            }
            catch (e) {
                console_1.console.error('error creating MONGO Database path ' + TMP_PATH + path.sep + '_MONGO');
            }
        }
        const DB_ROOT = path.resolve(TMP_PATH + path.sep + '_MONGO');
        const SYSTEM_ROOT = path.join(DATA_ROOT, '/system/');
        const VFS_CONFIG = {
            'workspace': path.join(USER_DIRECTORY, 'workspace'),
            'workspace_user': path.join(USER_DIRECTORY, 'workspace'),
            'docs': path.join(APP_ROOT, 'documentation/docFiles'),
            'system_drivers': path.join(SYSTEM_ROOT, 'drivers'),
            'user_drivers': path.join(USER_DIRECTORY, 'drivers'),
            'system_devices': path.join(SYSTEM_ROOT, 'devices'),
            'user_devices': path.join(USER_DIRECTORY, 'devices'),
            'user': path.join(USER_DIRECTORY),
            'root': options.root
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
                VFS_GET_URL: '../../files/',
                PLATFORM: os.platform()
            },
            absoluteVariables: {
                'XASWEB': path.join(CLIENT_ROOT)
            }
        };
        this.config = params;
        this.config[Base_1.EEKey.NODE_ROOT] = NODE_ROOT;
        //console.log('read profile: ',this._getProfile(argv.profile));
        this.profile = this._getProfile(argv.profile);
        if (argv.print === 'true') {
            console_1.console.log("Config", util.inspect(params));
            console_1.console.log('\n\n');
            console_1.console.log("Options", util.inspect(this.options));
        }
    }
    _getProfile(_path) {
        let data = null;
        try {
            _path = _path ? path.resolve(_path) : path.join(this.path(Base_1.EEKey.NODE_ROOT), 'nxappmain/profile_device_server.json');
            console_1.console.info('ControlFreak: use server profile from ' + _path);
            data = json_1.deserialize(file_1.read(_path));
        }
        catch (e) {
            console_1.console.error('error reading profile : ', e);
        }
        return data || {
            mongo: {
                port: 27017
            },
            http: {
                port: 5555
            }
        };
    }
    /**
     * runClass is a back - compat port for nxapp,
     */
    runClass(data, deviceServerContext) {
        const _class = data['class'];
        const _args = data['args'];
        let _module = null;
        const delegate = {
            data: data,
            clear: function () {
                this.data.progress = null;
                this.data.finish = null;
                this.data.error = null;
                this.data.data = null;
            },
            onProgress: function (progress, data) {
                this.clear();
                this.data.progress = progress;
                this.data.data = data;
                deviceServerContext.broadCastMessage(null, this.data);
            },
            onFinish: function (finish, data) {
                this.clear();
                this.data.finish = finish;
                this.data.data = data;
                deviceServerContext.broadCastMessage(null, this.data);
            },
            onError: function (error, data) {
                this.clear();
                this.data.error = error;
                this.data.data = data;
                deviceServerContext.broadCastMessage(null, this.data);
            }
        };
        try {
            _module = require(MODULE_ROOT + _class);
        }
        catch (e) {
            console_1.console.error('runClass# Error : cant find class ' + _class);
            data['error'] = e.message;
            deviceServerContext.broadCastMessage(null, data);
            return;
        }
        try {
            let instance = new _module.default(_args, delegate);
            instance.run();
        }
        catch (e) {
            data['error'] = e.message;
            deviceServerContext.broadCastMessage(null, data);
        }
    }
    externalServices() {
        let searchPaths = [];
        if (this.options.type === Base_1.ELayout.OFFLINE_RELEASE) {
            searchPaths.push(path.resolve(path.join(this.path(Base_1.EEKey.APP_ROOT), 'mongo')));
        }
        if (argv['mqtt'] !== 'false') {
            const mongod = new Mongod_1.Mongod({
                db: this.path(Base_1.EEKey.DB_ROOT),
                port: this.profile.mongo.port
            }, searchPaths, this.options.print);
            return [mongod];
        }
        else {
            return [];
        }
    }
    vfsConfig() {
        return {
            configPath: path.join(this.path(Base_1.EEKey.SYSTEM_ROOT), 'vfs.json'),
            relativeVariables: {},
            absoluteVariables: this.vfsMounts()
        };
    }
    serviceConfig() {
        return Service_1.create(this.vfsConfig(), this);
    }
    components() {
        if (!this._components) {
            this._components = [new xideve_1.XIDEVE(this)];
        }
        return this._components;
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
        const trackingService = new Tracking_1.TrackingService(path.join(this.path('USER_DIRECTORY'), 'meta.json'));
        const components = this.components();
        let componentServices = [];
        _.each(components, component => {
            componentServices.push(...component.services(serviceConfig));
        });
        this._rpcServices = [directoryService, mountService, driverService, devicesService, logsService, nodeService, settingsService, trackingService];
        this._rpcServices = this._rpcServices.concat(componentServices);
        return this._rpcServices;
    }
    variables(ctx, dst) {
        let origin = ctx.request.origin;
        dst = dst || [];
        _.each([
            Base_1.EEKey.XAS_WEB,
            Base_1.EEKey.APP_URL,
            Base_1.EEKey.RPC_URL
        ], key => {
            this._env(origin, key);
        }, this);
        const baseUrl = this._env(origin, Base_1.EEKey.XAS_WEB);
        dst[Base_1.EEKey.BASE_URL] = baseUrl(origin);
        dst[Base_1.EEKey.APP_URL] = this._env(origin, Base_1.EEKey.APP_URL)(origin);
        dst['XASWEB'] = this._env(origin, Base_1.EEKey.APP_URL)(origin);
        dst[Base_1.EEKey.RPC_URL] = this._env(origin, Base_1.EEKey.RPC_URL)(origin);
        dst['VFS_URL'] = origin + '/files/';
        dst[Base_1.EEKey.ROOT] = origin + '/';
        const urlArgs = qs(ctx.request.req.url);
        let USER_DIRECTORY = urlArgs['userDirectory'];
        if (USER_DIRECTORY) {
            this.config['userDirectory'] = decodeURI(ctx.params.userDirectory);
            const VFS_CONF = this.vfsMounts();
            VFS_CONF['user_drivers'] = path.join(USER_DIRECTORY, 'drivers');
            VFS_CONF['user_devices'] = path.join(USER_DIRECTORY, 'devices');
            VFS_CONF['workspace'] = path.join(USER_DIRECTORY, 'workspace');
            VFS_CONF['workspace_user'] = path.join(USER_DIRECTORY, 'workspace');
            dst[Base_1.EEKey.VFS_CONFIG] = VFS_CONF;
        }
        dst[Base_1.EEKey.DOJOPACKAGES] = io.serialize(this.packages(origin + '/files/', baseUrl(origin)));
        dst[Base_1.EEKey.RESOURCE_VARIABLES] = io.serialize(dst);
        const settingsService = this[Base_1.ESKey.SettingsService];
        if (settingsService) {
            const theme = _.find(settingsService.get('settings', '.')['settings'], { id: 'theme' })['value'] || ctx.params.theme || 'white';
            dst[Base_1.EEKey.THEME] = theme;
        }
        return dst;
    }
    routes() {
        if (this._routes) {
            return this._routes;
        }
        const filesRoute = files_1.create(this.directoryService, '/files', this);
        const uploadRoute = uploads_1.create(this.directoryService, '/upload', this);
        const components = this.components();
        let componentRoutes = [];
        _.each(components, component => {
            componentRoutes.push(...component.routes());
        });
        this._routes = [routes_1.default, filesRoute, app_1.default, smd_1.default, uploadRoute];
        this._routes.push(...componentRoutes);
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
                console_1.console.error('Error stopping ' + last.label(), e);
            }
        });
    }
    boot() {
        return __awaiter(this, void 0, void 0, function* () {
            this._externalServices = this.externalServices();
            return yield Promise.all(this._externalServices.map((service) => __awaiter(this, void 0, void 0, function* () {
                try {
                    console_1.console.info('ControlFreak#boot : run external service: ' + service.label());
                    yield service.run();
                }
                catch (e) {
                    console_1.console.error('error running service ' + service.label(), e);
                }
            })));
        });
    }
    dConfig(clientRoot, serverRoot, base, packages) {
        //path.join(this.path(EEKey.CLIENT_ROOT), '/lib'), this.path('NODE_ROOT'));
        var dojoConfig = {
            libRoot: clientRoot,
            clientRoot: clientRoot,
            cwd: serverRoot,
            hasCache: {
                "host-node": 1,
                "host-browser": 0,
                "dom": 0,
                "dojo-amd-factory-scan": 0,
                "dojo-has-api": 1,
                "dojo-inject-api": 0,
                "dojo-timeout-api": 0,
                "dojo-trace-api": 1,
                "dojo-log-api": 0,
                "dojo-dom-ready-api": 0,
                "dojo-publish-privates": 1,
                "dojo-config-api": 1,
                "dojo-sniff": 1,
                "dojo-sync-loader": 0,
                "dojo-test-sniff": 0,
                "config-deferredInstrumentation": 1,
                "config-useDeferredInstrumentation": "report-unhandled-rejections",
                "config-tlmSiblingOfDojo": 1,
                'xlog': true,
                'xblox': true,
                'dojo-undef-api': true,
                "debug": true,
                "dcl": false,
                "dojo": true
            },
            trace: 0,
            async: 0,
            baseUrl: base || serverRoot || '.',
            packages: [
                {
                    name: "dojo",
                    location: "dojo"
                },
                {
                    name: "nxappmain",
                    location: serverRoot + path.sep + "nxappmain"
                },
                {
                    name: "nxapp",
                    location: serverRoot + path.sep + "nxapp"
                },
                {
                    name: "requirejs-dplugins2",
                    location: clientRoot + path.sep + 'xibm/ibm/requirejs-dplugins'
                },
                {
                    name: "xcf",
                    location: clientRoot + path.sep + 'xcf'
                },
                {
                    name: "dstore",
                    location: clientRoot + path.sep + 'dstore'
                },
                {
                    name: "xide",
                    location: clientRoot + path.sep + 'xide'
                },
                {
                    name: "xwire",
                    location: clientRoot + path.sep + 'xwire'
                },
                {
                    name: "dcl",
                    location: clientRoot + path.sep + 'dcl'
                },
                {
                    name: "xblox",
                    location: clientRoot + path.sep + 'xblox'
                },
                {
                    name: "xlog",
                    location: clientRoot + path.sep + 'xlog'
                },
                {
                    name: "xblox",
                    location: clientRoot + path.sep + 'xblox'
                },
                {
                    name: "dstore",
                    location: clientRoot + path.sep + 'dstore'
                },
                {
                    name: "dijit",
                    location: clientRoot + path.sep + 'dijit'
                },
                {
                    name: "xlang",
                    location: clientRoot + path.sep + 'xlang'
                },
                {
                    name: "xgrid",
                    location: clientRoot + path.sep + 'xgrid'
                },
                {
                    name: "xaction",
                    location: clientRoot + path.sep + 'xaction/src'
                },
                {
                    name: "xdojo",
                    location: clientRoot + path.sep + 'xdojo'
                }
            ]
        };
        return dojoConfig;
    }
    run(deviceServer = true) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            process.once('SIGINT', (e) => { return this.stop(); });
            process.on('unhandledRejection', (reason) => {
                console_1.console.error('Unhandled rejection, reason: ', reason);
            });
            yield this.boot();
            return new Promise((resolve, reject) => {
                this.setup();
                _super("run").call(this);
                console_1.console.info('ControlFreak#run : serve www at : ' + this.path(Base_1.EEKey.APP_ROOT));
                this.use(convert(serve(this.path(Base_1.EEKey.APP_ROOT))));
                const port = this.profile.http.port || this.options.port || process.env.PORT || 5555;
                console_1.console.info('ControlFreak#run : create HTTP server at 0.0.0.0:' + port);
                this.server.listen(port, '0.0.0.0');
                if (!deviceServer) {
                    return Promise.resolve(true);
                }
                /*
                const clientRoot:string = path.join(this.path(EEKey.CLIENT_ROOT), '/lib');
                const nodeRoot:string = this.path('NODE_ROOT');
                const dConfig = this.dConfig(clientRoot, nodeRoot,null,null);
                dojoRequire.config(dConfig);*/
                //console.log('dconfig ',dConfig);
                //return;
                const amdRequire = require(path.join(process.cwd(), !this.options.release ? '../dojo/dojo-require' : '/dojo/dojo-require'));
                const dojoRequire = amdRequire(path.join(this.path(Base_1.EEKey.CLIENT_ROOT), '/lib'), this.path('NODE_ROOT'));
                const loader = this.options.release ? 'nxappmain/main_server_ts_build' : 'nxappmain/main_server_ts';
                console_1.console.info('ControlFreak#run : load device server application');
                // as we don't really consume/mix AMD modules, we get the data over the xide/Context
                global.process.on('device-server-ready', (context) => {
                    // @TODO: v1 context in v2 app?
                    this.deviceServer = context;
                    context.setAppServer(this);
                    console_1.console.info('ControlFreak#run : device server ready');
                    console_1.console.info('ControlFreak	can be accessed at http://0.0.0.0:' + port + '/app/xcf');
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
    _package(name, prefix, suffix = '') {
        // @TODO: check TS str interpolators
        let loc = (prefix || name);
        !~loc.endsWith('/') && (loc = loc + '/');
        !~suffix.endsWith('/') && (suffix = suffix + '/');
        return {
            name: name,
            location: loc + suffix
        };
    }
    packages(offset = '', baseUrl) {
        baseUrl = baseUrl || '';
        const result = [
            this._package('system_drivers', offset, 'system_drivers'),
            this._package('user_drivers', offset, 'user_drivers'),
            this._package('workspace', offset, 'workspace'),
            this._package('maq-metadata-dojo', baseUrl, '/xideve/metadata/dojo/1.8/'),
            this._package('maq-metadata-html', baseUrl, '/xideve/metadata/html/0.8/'),
            this._package('maq-metadata-delite', baseUrl, '/xideve/metadata/delite/0.8/')
        ];
        return result;
    }
}
exports.ControlFreak = ControlFreak;
//# sourceMappingURL=index.js.map