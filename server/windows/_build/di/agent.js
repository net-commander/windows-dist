"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("./core");
const proxy_1 = require("./core/interceptors/proxy");
const utils_1 = require("./core/utils");
const ready_1 = require("./extra/ready");
const reflection_1 = require("./core/reflection");
const metadata_1 = require("./core/metadata");
// ===========================================
// ES2015 or before
if (typeof Reflect !== 'object' || typeof Proxy !== 'function') {
    throw new Error('Agent Framework requires ES2016 support');
}
// ===========================================
// ES2016
if (typeof Reflect['metadata'] !== 'function') {
    // Install Reflect.metadata for tsc only
    // tsc will add following code to the generated js file. in order to utilize these information.
    // we create and method of Reflect.metadata to inject these information to Reflection object
    //     Reflect.metadata("design:type", Function),
    //     Reflect.metadata("design:paramtypes", []),
    //     Reflect.metadata("design:returntype", String)
    Reflect['metadata'] = function (key, value) {
        return function (target, propertyKey, descriptor) {
            reflection_1.Reflection.addMetadata(key, value, target, propertyKey, descriptor);
        };
    };
}
/**
 * Define an agent
 * @returns {(target:Constructor)=>(void|Constructor)}
 */
function agent(identifier) {
    return core_1.decorateClass(new AgentAttribute(identifier));
}
exports.agent = agent;
/**
 * AgentAttribute
 */
class AgentAttribute {
    constructor(_identifier) {
        this._identifier = _identifier;
    }
    get identifier() {
        return this._identifier;
    }
    getInterceptor() {
        return this;
    }
    intercept(invocation, parameters) {
        let originalAgent = invocation.invoke(parameters);
        // // NOTE: In order to improve the performance, do not proxy if no field interceptors detected
        // // intercept by overloading ES5 prototype (static intercept)
        // const interceptorDefinitions = Reflection.metadata.getAll(invocation.target.prototype);
        // if (interceptorDefinitions) {
        //
        //   const fieldInterceptors = [...interceptorDefinitions.values()]
        //     .filter(reflection => !reflection.descriptor)
        //     .filter(reflection => reflection.hasAttributes());
        //
        //   // do not proxy if no field interceptors detected
        //   if (fieldInterceptors.length) {
        //     // Proxy the current agent object
        //     agent = AddProxyInterceptor(agent);
        //   }
        //
        // }
        // only proxy one time
        if (!Reflect.has(originalAgent, utils_1.ORIGIN_INSTANCE)) {
            // intercept by implement ES6 proxy (dynamic intercept)
            const domain = Reflect.get(originalAgent, utils_1.AGENT_DOMAIN);
            const upgradedAgent = proxy_1.AddProxyInterceptor(originalAgent);
            Reflect.set(upgradedAgent, utils_1.ORIGIN_INSTANCE, originalAgent);
            Reflect.set(upgradedAgent, utils_1.AGENT_DOMAIN, domain);
            const readyList = [];
            // find metadata
            metadata_1.Metadata.getAll(Reflect.getPrototypeOf(originalAgent)).forEach((reflection, key) => {
                if (reflection.getAttributes(ready_1.ReadyAttribute).length) {
                    readyList.push(key);
                }
            });
            // execute agent hook: -> READY
            if (readyList.length) {
                readyList.forEach(ready => {
                    const readyFn = Reflect.get(upgradedAgent, ready);
                    if (typeof readyFn === 'function') {
                        Reflect.apply(readyFn, upgradedAgent, []);
                    }
                });
            }
            return upgradedAgent;
        }
        return originalAgent;
    }
}
exports.AgentAttribute = AgentAttribute;
//# sourceMappingURL=agent.js.map