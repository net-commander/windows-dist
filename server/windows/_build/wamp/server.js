"use strict";
const session_manager_1 = require("./session-manager");
// import * as Debug from 'debug';
const ws_1 = require("ws");
// const DEBUG = Debug('wamp:server');
/**
 *
 *
 * @class Server
 */
class Server {
    /**
     * Creates an instance of Server.
     *
     * @param {OptionsInterface} options
     */
    constructor(options) {
        const REALMS = options.realms;
        this.port = options.port;
        this.wss = options.ws || new ws_1.Server({ port: this.port });
        session_manager_1.default.registerRealms(Array.isArray(REALMS) ? REALMS : [REALMS]);
        this.listen();
    }
    /**
     *
     */
    close() {
        this.wss.close();
    }
    /**
     *
     *
     * @private
     */
    listen() {
        console.log('listening on port %s', this.port);
        this.wss.on('connection', session_manager_1.default.createSession);
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map