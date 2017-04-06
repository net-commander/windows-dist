"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reflection_1 = require("../reflection");
const interceptor_1 = require("../interceptor");
const domain_1 = require("../../domain");
const inject_1 = require("../../extra/inject");
const agent_1 = require("../../agent");
const utils_1 = require("../utils");
const metadata_1 = require("../metadata");
function AddConstructProxyInterceptor(target) {
    const typeProxyHandler = {
        construct: ConstructInterceptor
    };
    return new Proxy(target, typeProxyHandler);
}
exports.AddConstructProxyInterceptor = AddConstructProxyInterceptor;
function ConstructInterceptor(target, parameters, receiver) {
    const customAttributes = reflection_1.Reflection.getAttributes(target);
    let domain;
    if (parameters.length && parameters[0] instanceof domain_1.Domain) {
        domain = parameters[0];
    }
    else {
        domain = domain_1.LocalDomain;
    }
    // if (customAttributes.length > 1) {
    //   throw new TypeError('Not Support Multiple Agent Decoration');
    // }
    const agentTypeConstructor = interceptor_1.InterceptorFactory.createConstructInterceptor(customAttributes, target, receiver);
    const rawAgent = agentTypeConstructor.invoke(parameters);
    // find metadata
    metadata_1.Metadata.getAll(Reflect.getPrototypeOf(rawAgent)).forEach((reflection, key) => {
        reflection.getAttributes(inject_1.InjectAttribute).forEach((injector) => {
            let injected = domain.getAgent(injector.typeOrIdentifier);
            Reflect.set(rawAgent, key, injected);
        });
    });
    // do not register to domain if no identifier found
    customAttributes.forEach(attribute => {
        if (attribute instanceof agent_1.AgentAttribute) {
            domain.registerAgent(attribute, rawAgent);
        }
    });
    Reflect.set(rawAgent, utils_1.AGENT_DOMAIN, domain);
    // return the new class constructor
    return rawAgent;
}
exports.ConstructInterceptor = ConstructInterceptor;
//# sourceMappingURL=construct.js.map