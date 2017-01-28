"use strict";
const JSONFile_1 = require("./JSONFile");
class TrackingService extends JSONFile_1.JSONFileService {
    constructor() {
        super(...arguments);
        // implement Base#method
        this.method = 'XApp_Tracking_Service';
        this.root = "admin";
    }
    //
    // ─── DECORATORS ─────────────────────────────────────────────────────────────────
    //
    methods() {
        return this.toMethods(['get', 'set']);
    }
}
exports.TrackingService = TrackingService;
//# sourceMappingURL=Tracking.js.map