"use strict";
const JSONFile_1 = require("./JSONFile");
class NodeService extends JSONFile_1.JSONFileService {
    constructor() {
        super(...arguments);
        this.method = 'XIDE_NodeJS_Service';
    }
    methods() {
        return this.toMethods(['ls', 'stop', 'start']);
    }
    ls() {
        return this.readConfig()['items'];
    }
}
exports.NodeService = NodeService;
//# sourceMappingURL=Services.js.map