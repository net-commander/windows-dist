"use strict";
class Component {
    destroy() { }
    constructor(application, serviceConfig) {
        this.application = application;
        this.serviceConfig = serviceConfig;
    }
    label() {
        return "Component";
    }
    services(config) {
        return [];
    }
    routes() {
        return [];
    }
}
exports.Component = Component;
//# sourceMappingURL=Component.js.map