"use strict";
const Base_1 = require("./applications/Base");
const index_1 = require("./applications/ControlFreak/index");
const index_2 = require("./applications/xbox/index");
const Application_1 = require("./interfaces/Application");
const path = require("path");
const yargs_parser = require("yargs-parser");
/*
import { hookStream } from './debug';
const stdout = process.stdout;
hookStream(stdout);
stdout['hook']('write', function (str, encoding, fd, write) {
    write('caught: ' + str);
});
*/
/*
const yargs = require("yargs");
yargs.options('v', {
    alias: 'version',
    description: 'Display version number'
});
yargs.describe('f', 'df');
var _argv = yargs.argv;
console.log('dfdf',_argv);

if (_argv.h || _argv.help) {
    yargs.showHelp();
    process.exit();
}
*/
let argv = yargs_parser(process.argv.slice(2));
let app = argv.app ? yargs_parser.app : "ControlFreak";
const root = argv.root ? path.resolve(argv.root) : path.resolve('../../../');
if (argv.file) {
}
const CFOptions = {
    root: root,
    port: argv.port,
    release: argv.release === 'true',
    clientRoot: argv.clientRoot,
    type: argv.type || Base_1.ELayout.SOURCE,
    print: argv.print === 'true',
    uuid: argv.uuid || 'ide',
    persistence: argv.persistences ? argv.persistence : Application_1.EPersistence.MEMORY
};
function create(app) {
    let application;
    switch (app) {
        case "ControlFreak": {
            application = new index_1.ControlFreak(CFOptions);
            application.run(true).then((deviceServerContext) => {
                /*
                    var Server = require('socket.io');
                    var io = new Server(9998);
                    io.attach(cf);
                    io.on( 'connection', sock => {
                        console.log('connection:',sock);
                    })
                */
                /*var wsio = require('websocket.io')
                    , wamp = require('wamp.io-mirror');

                var ws = wsio.listen(9000);
                var app = wamp.attach(ws);

                app.on('call', function (procUri, args, cb) {
                    if (procUri === 'isEven') {
                        cb(null, args[0] % 2 == 0);
                    }
                });

                const Wampy = require('wampy');
                //const wampyCra = require('wampy-cra');
                const w3cws = require('websocket').w3cwebsocket;

                console.log('w', Wampy);

                try {
                    var b = new Wampy('ws://localhost:9000', {
                        //ws: w3cws,
                        //realm: 'realm1',
                        //authid: 'joe',
                        //authmethods: ['wampcra'],
                        onChallenge: (method, info) => {
                            console.log('Requested challenge with ', method, info);
                            //return wampyCra.sign('joe secret key or password', info.challenge);
                        },
                        onConnect: () => {
                            console.log('Connected to Router!');
                        }
                    });
                } catch (e) {
                    console.error('error', e);
                }
                */
                /*

                    let deviceServer = deviceServerContext.getDeviceServer();
                    //console.log('device server : ', deviceServer.socket);
                    for (let p in deviceServer.socket) {
                        //typeof deviceServer.socket[p] !=='function' && console.log('p ' + p , deviceServer.socket[p]);
                    }

                    const options: OptionsInterface = {
                        port: 8000,
                        realms: ['com.example.inge']
                        //ws: deviceServer.socket
                    };
                const SERVER = new Server(options);*/
            });
            break;
        }
        case "xbox": {
            application = new index_2.xbox(CFOptions);
            application.run(true).then(() => { });
            break;
        }
        default: {
            console.error('cant find application ' + app);
        }
    }
    return application;
}
exports.create = create;
;
create(argv.app || 'ControlFreak');
//# sourceMappingURL=index.js.map