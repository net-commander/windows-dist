"use strict";
const JSONFile_1 = require("./JSONFile");
const _ = require("lodash");
class NodeService extends JSONFile_1.JSONFileService {
    constructor() {
        super(...arguments);
        this.method = 'XIDE_NodeJS_Service';
    }
    methods() {
        return this.toMethods(['ls', 'stop', 'start']);
    }
    ls() {
        const args = arguments;
        const request = this._getRequest(args);
        let items = this.readConfig()['items'];
        if (request) {
            items = _.map(items, function (item) {
                item.host = request.host.split(':')[0];
                return item;
            });
        }
        return items;
    }
}
exports.NodeService = NodeService;
//# sourceMappingURL=Services.js.map