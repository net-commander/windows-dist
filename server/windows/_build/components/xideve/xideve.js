"use strict";
const Component_1 = require("../Component");
const Workbench_1 = require("../xideve/services/Workbench");
const Preview_1 = require("./routes/Preview");
class XIDEVE extends Component_1.Component {
    services(config) {
        return [new Workbench_1.WorkbenchService(config)];
    }
    routes() {
        return [Preview_1.default];
    }
}
exports.XIDEVE = XIDEVE;
;
//# sourceMappingURL=xideve.js.map