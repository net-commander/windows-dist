"use strict";
const file_1 = require("../../../io/file");
const json_1 = require("../../../io/json");
const Devices_1 = require("../../../services/Devices");
const Drivers_1 = require("../../../services/Drivers");
const FileUtils_1 = require("../../../utils/FileUtils");
const StringUtils_1 = require("../../../utils/StringUtils");
const _ = require("lodash");
const path = require('path');
const fs = require('fs');
const util = require('fs');
const jet = require('fs-jetpack');
const cheerio = require('cheerio');
const debugPaths = true;
let io = {
    read: file_1.read,
    write: file_1.write
};
;
function resolve(_path) {
    let here = path.resolve(_path);
    try {
        if (fs.statSync(here)) {
            return here;
        }
    }
    catch (e) {
        return here;
    }
    try {
        if (fs.statSync(_path)) {
            return _path;
        }
        else {
            const __path = process.cwd() + path.sep + _path;
            if (fs.statSync(__path)) {
                return __path;
            }
        }
    }
    catch (e) {
    }
    return null;
}
function cleanUrl(str) {
    if (str) {
        str = str.replace('//', '/');
        str = str.replace('./', '/');
        return str;
    }
    return str;
}
/**
 * This class creates a stand-alone package of a "Control-Freak" created application.
 * Essentially it takes a bunch of paths and options and outputs a folder on disc.
 *
 *
 * @export
 * @class Exporter
 */
class Exporter {
    constructor(args, delegate) {
        this.options = null;
        this.profile = null;
        this.delegate = null;
        this.options = args.options;
        this.delegate = delegate;
    }
    /**
     * @member {string|null} serverTemplates the path to the server templates. Defaults to
     *  this.root + 'server-template'
     */
    onProgress(msg) {
        this.delegate && this.delegate.onProgress(msg);
        console.log('Progress:  ' + msg);
    }
    onError(msg) {
        console.log('error export : ', msg);
        this.delegate && this.delegate.onError(msg);
    }
    onFinish(msg) {
        this.delegate && this.delegate.onFinish(msg);
        console.log('Finish:  ' + msg);
    }
    /**
     * @param options {module:nxapp/model/ExportOptions}
     */
    run() {
        const options = this.options;
        console.log('run;', options);
        this.onProgress('Export Manager: begin export');
        if (!options.root) {
            this.onError('Export Manager: have no root');
            throw new Error('Export Manager: have no root');
        }
        if (!options.system) {
            this.onError('Export Manager: have no data');
            throw new Error('Export Manager: have no data');
        }
        if (!options.user) {
            this.onError('Export Manager: have no user');
            return;
        }
        if (!options.client) {
        }
        try {
            if (!options.serverTemplates) {
                options.serverTemplates = resolve(options.root + '/server-template');
            }
            console.log('export with \n', util.inspect({
                "System Data": options.system,
                "User Data": options.user + ' = ' + path.resolve(options.user),
                "Root": path.resolve(options.root),
                "Server-Templates": options.serverTemplates,
                "Target": path.resolve(options.target),
                "Node Servers": path.resolve(options.nodeServers),
                "Client": options.client,
                "Export Windows": options.windows,
                "Export Linux - 32 ": options.linux32,
                "Export Linux - 64 ": options.linux64,
                "Export OSX": options.osx,
                "Export ARM": options.arm
            }));
        }
        catch (e) {
            console.error('Error : ', e);
        }
        const d = false;
        if (d) {
            return;
        }
        var all = true;
        if (all) {
            //var MONGO_OPTIONS = options.mongoOptions || {};
            this.exportMongo(options);
            this.createDirectoryLayout(options);
            this.exportServer(options);
            this.onProgress('Exported Servers');
            this.exportUser(options);
            this.onProgress('Exported User');
            this.exportSystem(options);
            this.onProgress('Exported System Data');
            this.exportMisc(options);
            this.onProgress('Exported Misc Data');
            this.exportHTML(options);
            this.onProgress('Exported User Workspace HTML');
            this.exportDevices(options);
            this.onProgress('Exported Devices');
            this.exportDrivers(options);
            this.onProgress('Exported Drivers');
            if (options.client) {
                this.exportClientEx(options);
            }
            else {
                if (options.debug) {
                    this.exportClient(options);
                }
                else {
                    this.exportClientDist(options);
                }
            }
            this.onProgress('Exported Client Application Assets');
            console.log('Export Done! Your application can be found at ' + options.target);
            this.onProgress('Export Done');
            this.onFinish('Export Done! Your application can be found at ' + options.target);
        }
        else {
            this.exportHTML(options);
        }
    }
    exportHTML(options) {
        var source = jet.dir(options.target + '/www/user/workspace/');
        var thiz = this;
        function parseDirectory(_path, name) {
            //name = directory abs
            var dirItems = fs.readdirSync(_path);
            if (dirItems.length) {
                _.each(dirItems, function (file) {
                    //file = file name
                    if (file.indexOf('.dhtml') !== -1) {
                        var root = name.replace(source.path() + '/', '');
                        thiz.exportHTMLFile2(_path + '/' + file, root, options);
                    }
                });
            }
        }
        function _walk(dir) {
            var results = [];
            if (fs.existsSync(dir)) {
                var list = fs.readdirSync(dir);
                list.forEach(function (file) {
                    file = dir + '/' + file;
                    var stat = fs.statSync(file);
                    if (stat) {
                        var root = file.replace(path + '/', '');
                        if (stat.isDirectory()) {
                            parseDirectory(file, root);
                        }
                        else {
                            if (file.indexOf('.dhtml') !== -1) {
                                root = root.replace(dir + '/', '');
                                thiz.exportHTMLFile2(file, root, options);
                            }
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
        _walk(source.path());
    }
    exportHTMLFile2(file, folder, options) {
        var exportRoot = jet.dir(options.root + '/export/');
        var template = io.read(path.resolve(exportRoot.path() + '/app.template.html'));
        var path_parts = FileUtils_1.pathinfo(file);
        if (folder === path_parts.basename) {
            folder = "";
        }
        var templateVariables = _.mixin({
            libRoot: '/Code/client/src/lib',
            lodashUrl: '/Code/client/src/lib/external/lodash.min.js',
            requireBaseUrl: "/Code/client/src/lib/xibm/ibm",
            jQueryUrl: "/Code/client/src/lib/external/jquery-1.9.1.min.js",
            data: "",
            user: "/user",
            css: './' + cleanUrl(path_parts.filename + ".css"),
            theme: "bootstrap",
            blox_file: "./" + folder + '/' + path_parts.filename + ".xblox",
            scene_file: "./" + folder + '/' + path_parts.filename + ".dhtml",
            mount: "workspace",
            "VFS_VARS": json_1.serialize({
                "user_drivers": './www/user/drivers',
                "system_drivers": './www/system/drivers'
            }, null, 2)
        }, options);
        template = StringUtils_1.replace(template, null, templateVariables, {
            begin: '%',
            end: '%'
        });
        var content = io.read(file);
        content = content.replace('<viewHeaderTemplate/>', template);
        content = content.replace(/\burl\s*\(\s*["']?([^"'\r\n\)\(]+)["']?\s*\)/gi, function (matchstr, parens) {
            var parts = parens.split('://');
            var mount = parts[0];
            var path = parts[1];
            if (mount && path) {
                return "url('./" + path + "')";
            }
            return parens;
        });
        var dom = cheerio.load(content);
        var extra = '\n<script type="text/javascript">';
        extra += '\n\tvar test = 0;';
        extra += '\n</script>';
        dom('HEAD').append(dom(extra));
        io.write(file.replace('.dhtml', '.html'), dom.html());
    }
    exportHTMLFile(options) {
        var exportRoot = jet.dir(options.root + '/export/');
        var source = jet.dir(options.target + '/www/user/workspace/');
        var file = path.resolve(source.path() + '/ascene.dhtml');
        var template = io.read(path.resolve(exportRoot.path() + '/app.template.html'));
        var templateVariables = _.mixin({
            libRoot: '/Code/client/src/lib',
            lodashUrl: '/Code/client/src/lib/external/lodash.min.js',
            requireBaseUrl: "/Code/client/src/lib/xibm/ibm",
            jQueryUrl: "/Code/client/src/lib/external/jquery-1.9.1.min.js",
            data: "",
            user: "/user",
            css: "./ascene.css",
            theme: "bootstrap",
            blox_file: "./ascene.xblox",
            mount: "workspace",
            "VFS_VARS": JSON.stringify({
                "user_drivers": './www/user/drivers',
                "system_drivers": './www/system/drivers'
            }, null, 2)
        }, options);
        template = StringUtils_1.replace(template, null, templateVariables, {
            begin: '%',
            end: '%'
        });
        var content = io.read(file);
        content = content.replace('<viewHeaderTemplate/>', template);
        var did = false;
        content = content.replace(/\burl\s*\(\s*["']?([^"'\r\n\)\(]+)["']?\s*\)/gi, function (matchstr, parens) {
            var parts = parens.split('://');
            var mount = parts[0];
            var path = parts[1];
            if (mount && path) {
                did = true;
                return "url('./" + path + "')";
            }
            return parens;
        });
        var dom = cheerio.load(content);
        var extra = '\n<script type="text/javascript">';
        extra += '\n\tvar test = 0;';
        extra += '\n</script>';
        dom('HEAD').append(dom(extra));
        io.write(file.replace('.dhtml', '.html'), dom.html());
    }
    exportDevices(options) {
        var user_devices_path = path.resolve(options.target + '/www/user/devices');
        var devices = Devices_1.getDevices(user_devices_path, 'user_devices', options);
        io.write(user_devices_path + '/user_devices.json', JSON.stringify({
            items: devices
        }, null, 2));
        var system_devices_path = path.resolve(options.target + '/www/system/devices');
        devices = Devices_1.getDevices(system_devices_path, 'system_devices', options);
        io.write(system_devices_path + '/system_devices.json', JSON.stringify({
            items: devices
        }, null, 2));
    }
    exportDrivers(options) {
        var user_drivers_path = path.resolve(options.target + '/www/user/drivers');
        var drivers = Drivers_1.getDrivers(user_drivers_path, 'user_drivers');
        io.write(user_drivers_path + '/user_drivers.json', JSON.stringify({
            items: drivers
        }, null, 2));
        var system_drivers_path = path.resolve(options.target + '/www/system/drivers');
        drivers = Drivers_1.getDrivers(system_drivers_path, 'system_drivers');
        io.write(system_drivers_path + '/system_drivers.json', JSON.stringify({
            items: drivers
        }, null, 2));
    }
    exportMisc(options) {
        var source = jet.dir(options.root + '/export');
        var target = jet.dir(options.target);
        jet.copy(source.path(), target.path(), {
            matching: [
                '**'
            ],
            overwrite: true
        });
        /**
         * update config
         */
        var template = io.read(path.resolve(source.path() + '/profile_device_server.json'));
        var content = StringUtils_1.replace(template, null, options, {
            begin: '%',
            end: '%'
        });
        if (options.linux32) {
            jet.exists(target.path() +
                path.sep + '/server/linux_32/nxappmain/profile_device_server.json') && io.write(target.path() + path.sep +
                '/server/linux_32/nxappmain/profile_device_server.json', content);
        }
        if (options.linux64) {
            jet.exists(target.path() +
                path.sep + '/server/linux_64/nxappmain/profile_device_server.json') && io.write(target.path() + path.sep +
                '/server/linux_64/nxappmain/profile_device_server.json', content);
        }
        if (options.windows) {
            jet.exists(target.path() +
                path.sep + '/server/windows/nxappmain/profile_device_server.json') && io.write(target.path() + path.sep +
                '/server/windows/nxappmain/profile_device_server.json', content);
        }
        if (options.arm) {
            jet.exists(target.path() +
                path.sep + '/server/arm/nxappmain/profile_device_server.json') && io.write(target.path() + path.sep +
                '/server/arm/nxappmain/profile_device_server.json', content);
        }
        if (options.osx) {
            jet.exists(target.path() +
                path.sep + '/server/osx_64/nxappmain/profile_device_server.json') && io.write(target.path() + path.sep + '/server/osx_64/nxappmain/profile_device_server.json', content);
        }
        /**
         * update boot start.js
         */
        template = io.read(path.resolve(source.path() + '/start.js'));
        content = StringUtils_1.replace(template, null, options, {
            begin: '%',
            end: '%'
        });
        options.linux32 !== false && jet.exists(target.path() + '/server/linux_32/start.js') && io.write(target.path() + '/server/linux_32/start.js', content);
        options.linux64 !== false && jet.exists(target.path() + '/server/linux_64/start.js') && io.write(target.path() + '/server/linux_64/start.js', content);
        options.windows !== false && io.write(target.path() + '/server/windows/start.js', content);
        options.arm !== false && jet.exists(target.path() + '/server/arm/start.js') && io.write(target.path() + '/server/arm/start.js', content);
        options.osx !== false && jet.exists(target.path() + '/server/osx_64/start.js') && io.write(target.path() + '/server/osx_64/start.js', content);
    }
    exportClientEx(options) {
        var source = jet.dir(path.resolve(options.client) + '');
        var target = jet.dir(options.target + '/www/Code/client');
        jet.copy(source.path(), target.path(), {
            matching: [
                '**'
            ],
            overwrite: true
        });
    }
    exportClient(options) {
        var source = jet.dir(options.root + '/Code/client');
        var target = jet.dir(options.target + '/www/Code/client');
        jet.copy(source.path(), target.path(), {
            matching: [
                '**'
            ],
            overwrite: true
        });
    }
    exportClientDist(options) {
        var source = jet.dir(options.root + '/dist/all/Code/client/');
        var target = jet.dir(options.target + '/www/Code/client');
        jet.copy(source.path(), target.path(), {
            matching: [
                '**'
            ],
            overwrite: true
        });
    }
    exportUser(options) {
        var source = jet.dir(options.user);
        var target = jet.dir(options.target + '/www/user');
        console.log('export user from ' + source.path() + ' to ' + target.path());
        try {
            jet.copy(source.path(), target.path(), {
                matching: [
                    '**',
                    '!./.git/**/*',
                    '!**/**claycenter',
                    '!./claycenter',
                    '!**claycenter'
                ],
                overwrite: true
            });
        }
        catch (err) {
            if (err.code === 'EEXIST') {
                console.error('Error copying, file exists!', err);
            }
            if (err.code === 'EACCES') {
                console.error('Error copying, file access perrmissions!', err);
            }
            console.error('error : ', err);
        }
    }
    exportSystem(options) {
        var source = jet.dir(options.system + '/system');
        var target = jet.dir(options.target + '/www/system');
        jet.copy(source.path(), target.path(), {
            matching: [
                '**'
            ],
            overwrite: true
        });
    }
    clean() {
        var dir = 'leveldown';
        var files = ['*.lib', '*.pdb'];
    }
    copyServer(options, platform) {
        var target = jet.dir(options.target + '/server/' + platform);
        var isDebug = false;
        let source = "";
        if (options.nodeServers) {
            if (!jet.exists(options.nodeServers + '/' + platform)) {
                return;
            }
            source = jet.dir(options.nodeServers + '/' + platform);
        }
        else {
            if (!isDebug) {
                source = jet.dir(options.root + '/server/' + platform);
            }
            else {
                source = jet.dir(options.root + '/server/nodejs/dist/' + platform);
            }
        }
        if (!jet.exists(source.path())) {
            return;
        }
        console.info('export Device-Server ' + platform + ' from : ' + source.path());
        try {
            jet.copy(source.path(), target.path(), {
                matching: [
                    '**'
                ],
                overwrite: true
            });
        }
        catch (err) {
            if (err.code === 'EEXIST') {
                console.error('Error copying, file exists!', err);
            }
            if (err.code === 'EACCES') {
                console.error('Error copying, file access perrmissions!', err);
            }
        }
    }
    exportServer(options) {
        options.windows !== false && this.copyServer(options, 'windows');
        options.linux32 !== false && this.copyServer(options, 'linux_32');
        options.linux64 !== false && this.copyServer(options, 'linux_64');
        options.arm !== false && this.copyServer(options, 'arm');
        options.osx !== false && this.copyServer(options, 'osx_64');
    }
    /**
     * Create the default directory layout
     */
    createDirectoryLayout(options) {
        jet.dir(options.target + '/data/_MONGO');
        jet.dir(options.target + '/www/');
        jet.dir(options.target + '/nginx/logs');
    }
    /**
     *
     * @param options
     */
    exportMongo(options) {
        var source = jet.dir(options.serverTemplates + '/mongo');
        var target = jet.dir(options.target + '/mongo');
        jet.copy(source.path(), target.path(), {
            matching: [
                'mongod-arm',
                'mongod-linux_32',
                'mongod-linux_64',
                'mongod-windows.exe',
                'mongod-32.exe',
                'mongod-osx'
            ],
            overwrite: true
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Exporter;
//# sourceMappingURL=Exporter.js.map