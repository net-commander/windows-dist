"use strict";
const app = require("electron").app;
const BrowserWindow = require("electron").BrowserWindow;
const dev_helper_1 = require("./vendor/electron_boilerplate/dev_helper");
const window_state_1 = require("./vendor/electron_boilerplate/window_state");
//import env from './env';
let env = {
    name: "production",
    url: "http://127.0.0.1:5555/app/xcf/?debug=false&xtrack=true&electron=true"
};
// const {dialog} = require('electron');
const utils_1 = require("./vendor/xapp/utils");
app.commandLine.appendSwitch('disable-http-cache');
// app.commandLine.appendSwitch('disable-http-cache');
let child_process = require('child_process');
let mainWindow;
let shell;
let exec = require('child_process').exec, path = require('path'), os = require('os'), fs = require('fs'), jet = require('fs-jetpack'), arch = os.arch(), 
// argv = require('yargs').argv,
argv = require('yargs-parser')(env.name === 'development' ? process.argv.slice(2) : process.argv.slice(1)), isWindows = utils_1.default.isWindows(), isDebug = env.name === 'development', isProduction = env.name !== 'development', serverStart;
let OS = "linux";
if (os.platform() === 'win32') {
    OS = 'windows';
}
else if (os.platform() === 'darwin') {
    OS = 'osx';
}
else if (os.arch() === 'arm') {
    OS = 'arm';
}
// support for Win32 outside Cygwin
if (os.platform() === 'win32' && process.env.SHELL === undefined) {
    shell = process.env.COMSPEC || 'cmd.exe';
}
// Preserver of the window size and position between app launches.
let mainWindowState = window_state_1.default('main', {
    width: 1000,
    height: 600
});
// Merges the current environment variables and custom params for the environment used by child_process.exec()
function createEnv(params) {
    let env = {};
    let item;
    for (item in process.env) {
        env[item] = process.env[item];
    }
    for (item in params) {
        env[item] = params[item];
    }
    return env;
}
let run = function (scriptFile, workingDirectory, environment, callback) {
    let cmd;
    if (!workingDirectory) {
        callback(new Error('workingDirectory cannot be null'), null, null);
    }
    if (!fs.existsSync(workingDirectory)) {
        callback(new Error('workingDirectory path not found - "' + workingDirectory + '"'), null, null);
    }
    if (scriptFile === null) {
        callback(new Error('scriptFile cannot be null'), null, null);
    }
    if (!fs.existsSync(scriptFile)) {
        callback(new Error('scriptFile file not found - "' + scriptFile + '"'), null, null);
    }
    // transform windows backslashes to forward slashes for use in cygwin on windows
    if (path.sep === '\\') {
        scriptFile = scriptFile.replace(/\\/g, '/');
    }
    // TODO: consider building the command line using a shell with the -c argument to run a command and exit
    cmd = '"' + shell + '" "' + scriptFile + '"';
    console.log('---start ' + cmd);
    // execute script within given project workspace
    exec(cmd, {
        cwd: workingDirectory,
        env: createEnv(environment)
    }, function (error, stdout, stderr) {
        // TODO any optional processing before invoking the callback
        callback(error, stdout, stderr);
    });
};
function createWindow() { }
function toArray(obj) {
    let result = [];
    for (let c in obj) {
        result.push({
            name: c,
            value: obj[c]
        });
    }
    return result;
}
function replaceUrlParam(url, paramName, paramValue) {
    if (!url.indexOf) {
        console.error('have no real url: ' + url + ' param name ' + paramName);
        return url;
    }
    if (url.indexOf(paramName) === -1) {
        url += (url.indexOf('?') > 0 ? '&' : '?');
        url += (paramName + '=' + paramValue);
        return url;
    }
    let pattern = new RegExp('(' + paramName + '=).*?(&|$)');
    let newUrl = url.replace(pattern, '$1' + paramValue + '$2');
    if (newUrl === url) {
        newUrl = newUrl + (newUrl.indexOf('?') > 0 ? '&' : '?') + paramName + '=' + paramValue;
    }
    return newUrl;
}
function getUrl() {
    if (env.name === 'test') {
        if (env[OS]) {
            return env[OS];
        }
        else {
            return 'file://' + __dirname + '/spec.html';
        }
    }
    else {
        let extra = ''; // '&time=' + new Date().getTime();
        if (isDebug) {
            if (env[OS]) {
                return env[OS] + extra;
            }
            else {
                if (isWindows) {
                    return env.windows + extra;
                }
                else {
                    return env.linux + extra;
                }
            }
        }
        else {
            return env.url + extra;
        }
    }
}
function root() {
    let appDataPath = app.getAppPath().toString();
    let appDir = jet.cwd(path.resolve('.')); // in debug: ./build
    if (OS === 'osx') {
        if (!isDebug) {
            appDir = jet.cwd(path.resolve('../../Resources')); // in debug: ./build
        }
    }
    if (isDebug) {
        appDir = jet.cwd(path.resolve('../../'));
    }
    if (OS === 'osx') {
        if (!isDebug) {
            appDir = jet.cwd(path.resolve(appDataPath.replace('app.asar', '') + '../../Resources')); // in debug: ./build
        }
    }
    if (OS === 'linux') {
        if (isDebug) {
            appDir = jet.cwd(path.resolve(appDataPath + '/../../../'));
        }
    }
    return appDir.path ? appDir.path() : appDir;
}
function serverRoot() {
    let _root = root();
    let result = _root + '/server/';
    if (OS === 'osx') {
        result += 'osx';
    }
    if (OS === 'linux') {
        if (isDebug) {
            result += 'nodejs/dist/';
        }
        result += 'linux';
        if (arch === 'x64') {
            result += '_64';
        }
    }
    return path.resolve(result);
}
function profile() {
    let server = serverRoot();
    let profilePath = path.join(server, 'nxappmain/profile_device_server.json');
    let data = {};
    try {
        data = jet.read(profilePath, 'json');
    }
    catch (e) {
        console.error('error reading : profile data at ' + profilePath, e);
    }
    return data;
}
function ensureUser(_path) {
    let appDataPath = app.getAppPath().toString();
    let appDir = jet.cwd(root()); // jet.cwd(path.resolve('.'));//in debug: ./build
    jet.dir(_path + path.sep + 'devices');
    jet.dir(_path + path.sep + 'devices' + path.sep + 'logs');
    jet.dir(_path + path.sep + 'drivers');
    jet.dir(_path + path.sep + 'workspace');
    jet.dir(_path + path.sep + 'logs');
    let sourceDirectory, targetDirectory;
    if (isDebug) {
        sourceDirectory = path.resolve(appDir.path() + '/data/workspace/templates');
    }
    else {
        sourceDirectory = path.resolve(appDir.path() + '/data/workspace/templates');
    }
    targetDirectory = path.resolve(_path + path.sep + 'workspace/templates');
    jet.copy(sourceDirectory, targetDirectory, {
        overwrite: true
    });
    if (isDebug) {
        sourceDirectory = path.resolve(appDir.path() + '/data/workspace');
    }
    else {
        sourceDirectory = path.resolve(appDir.path() + '/data/workspace');
    }
    targetDirectory = path.resolve(_path + path.sep + 'workspace/');
    jet.copy(sourceDirectory, targetDirectory, {
        matching: ['default.dhtml', 'default.css', 'default.xblox'],
        overwrite: true
    });
    sourceDirectory = path.resolve(appDir.path() + '/data/user');
    sourceDirectory = path.resolve(appDir.path() + '/data/user');
}
function log(message, what) {
    if (!BrowserWindow._log) {
        BrowserWindow._log = [];
    }
    BrowserWindow._log.push({ message: message, what: what });
    console.log.apply(null, [message, what]);
}
function main(url) {
    url = url || getUrl();
    let array = toArray(argv).filter(function (what) {
        return typeof what !== 'function';
    });
    require['env'] = env;
    if (!argv.userDirectory) {
        let defaultUserDirectory = app.getPath('documents') + path.sep + 'Control-Freak' + path.sep;
        let userDirectory = jet.dir(defaultUserDirectory);
        argv.userDirectory = path.resolve(defaultUserDirectory);
        process.argv.push('--userDirectory=' + argv.userDirectory);
    }
    if (argv && argv.url) {
        url = argv.url;
    }
    array.forEach(function (what) {
        if (what && what.name !== '_') {
            url = replaceUrlParam(url, what.name, encodeURIComponent(what.value));
        }
    });
    if (url.indexOf('userDirectory') === -1 && argv.userDirectory) {
        url += '&userDirectory=' + encodeURIComponent(argv.userDirectory);
    }
    if (argv.userDirectory) {
        ensureUser(argv.userDirectory);
    }
    console.log('start main with args ' + url, argv);
    BrowserWindow.env = JSON.stringify(env);
    if (!mainWindow) {
        mainWindow = new BrowserWindow({
            x: mainWindowState.x,
            y: mainWindowState.y,
            width: mainWindowState.width,
            height: mainWindowState.height,
            "auto-hide-menu-bar": false,
            "title": "Control - Freak",
            "webPreferences": {
                "node-integration": true,
                "webSecurity": false
            },
            frame: true,
            // transparent: true,
            "webSecurity": false,
            "allowDisplayingInsecureContent": true,
            "allowRunningInsecureContent": true,
            // 'titleBarStyle': 'hidden',
            "args": process.argv,
            env: env
        });
        BrowserWindow.mainWindow = mainWindow;
        BrowserWindow.args = process.argv;
        if (mainWindowState.isMaximized) {
            mainWindow.maximize();
        }
        dev_helper_1.default.setDevMenu();
        mainWindow.setTitle("Control-Freak - " + argv.userDirectory);
    }
    if (!url) {
        let webContents = mainWindow.webContents;
        webContents.clearHistory();
        if (env.name === 'test') {
            if (env[OS]) {
                return mainWindow.loadURL(env[OS]);
            }
            else {
                mainWindow.loadURL('file://' + __dirname + '/spec.html');
            }
        }
        else {
            console.log(env.name + ':load url, debug =  ' + isDebug + ' url ' + env[OS]);
            let extra = ''; // '&time=' + new Date().getTime();
            if (isDebug) {
                // mainWindow.openDevTools();
                if (env[OS]) {
                    console.log(env[OS] + extra);
                    mainWindow.loadURL(env[OS] + extra);
                }
                else {
                    if (isWindows) {
                        console.log('load ' + env.windows);
                        mainWindow.loadURL(env.windows + extra);
                    }
                    else {
                        console.log('load ' + env.linux);
                        mainWindow.loadURL(env.linux + extra);
                    }
                }
            }
            else {
                console.log('load ' + env.url);
                mainWindow.loadURL(env.url + extra);
            }
        }
    }
    else {
        console.log('open url :' + url);
        mainWindow.loadURL(url);
    }
    mainWindow.on('close', function () {
        mainWindowState.saveState(mainWindow);
    });
}
function startServer() {
    let path = require('path');
    if (isWindows) {
        // var cwd = isDebug ?  './tmpWindows/Control-Freak/server/nodejs/' : './';
        ////var start_server_bat = path.resolve( cwd + '/start.bat');
        //let cwd = './tmpWindows/Control-Freak/server/nodejs/';
        //let start_server_bat = path.resolve(cwd + '/server.exe');
        let cwd = './tmpWindows/Control-Freak/';
        let start_server_bat = path.resolve(cwd + '/start.bat');
        // var start_server_bat = 'cmd.exe';
        console.error('-start server at ' + start_server_bat + ' in ' + path.resolve(cwd) + ' in env ' + env.name);
        // run(path.resolve('./tmpWindows/Control-Freak/start_server.bat'),path.resolve('./tmpWindows/Control-Freak/'),{},runCB);
        /*
         var start = child_process.spawn('' + start_server_bat, ["noob","--file=start.js"], {
         cwd: path.resolve(cwd),
         env:createEnv({}),
         //shell:'cmd.exe',
         detached:true,
         stdio: 'inherit'

         });
         */
        /*
         var start = child_process.exec('' + start_server_bat, ["noob","--file=start.js"], {
         cwd: path.resolve(cwd),
         env:createEnv({}),
         shell:'cmd.exe',
         detached:false,
         stdio: 'inherit'
         });
         */
        // ["noob","--file=start.js"]
        let start = child_process.spawn('cmd.exe', ['/c', 'start.bat'], {
            cwd: path.resolve(cwd),
            detached: false
        });
        /*
                bat.stdout.on('data', (data) => {
                    console.log(data);
            });

                bat.stderr.on('data', (data) => {
                    console.log(data);
            });

                bat.on('exit', (code) => {
                    console.log(`Child exited with code ${code}`);
            });
                */
        start.stdout.on('data', function (data) {
            let str = data.toString();
            console.log('data : ' + str);
            if (str.indexOf('can start') !== -1) {
                console.log('got server, start main');
                setTimeout(function () {
                    main();
                }, 1000);
            }
        });
        start.on('error', function (data) {
            console.log('---error : data ', data);
        });
        start.on('close', function (code) {
            console.log("Finished with code " + code);
        });
        serverStart = start;
    }
    if (OS === 'linux') {
    }
}
app.on('ready', function () {
    let _checkServerCB = function (error, status, host, port) {
        console.log('check server : ', arguments);
        // we dont' have a server yet
        if (status === 'closed') {
            console.error('server not running2');
            main('file://' + __dirname + '/progress.html?off=true');
            console.error('\t start server');
            startServer();
        }
        else if (status === 'open') {
            console.error('server running');
            main();
        }
    };
    // if(isWindows) {
    //    utils.checkPort(8887, '0.0.0.0', _checkServerCB);
    // }else {
    //  main(argv.url);
    // }
    let args = process.argv;
    try {
    }
    catch (e) {
    }
    for (let i = 0; i < args.length; i++) {
        let arg = args[i];
        try {
            if (arg.indexOf && fs.lstatSync(arg).isDirectory() && arg.indexOf('build') === -1) {
                argv.userDirectory = arg;
            }
        }
        catch (e) {
        }
    }
    let port = 5555;
    let pData = profile();
    //if (pData && pData.http) {
    //	port = pData.http.port;
    //}
    // console.log('ready: ' + root() + ' = ' + serverRoot() + ' @ ' + port);
    // utils.checkPort(port, '0.0.0.0', _checkServerCB);
    main();
});
app.on('window-all-closed', function () {
    // serverStart && serverStart.exit();
    app.quit();
});
function runApp() {
}
exports.runApp = runApp;
//# sourceMappingURL=background.js.map