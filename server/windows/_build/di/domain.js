"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const agent_1 = require("./agent");
const events_1 = require("events");
const reflection_1 = require("./core/reflection");
class Domain extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.types = new Map();
        this.agents = new Map();
    }
    registerAgentType(agentAttribute, agentType) {
        if (!agentAttribute.identifier) {
            return;
        }
        else if (this.types.has(agentAttribute.identifier)) {
            throw new TypeError(`Duplicated agent type identifier ${agentAttribute.identifier} is not allowed`);
        }
        else {
            this.types.set(agentAttribute.identifier, agentType);
        }
    }
    registerAgent(agentAttribute, agent) {
        if (!agentAttribute.identifier) {
            return;
        }
        else if (this.agents.has(agentAttribute.identifier)) {
            throw new TypeError(`Duplicated agent identifier ${agentAttribute.identifier} is not allowed`);
        }
        else {
            this.agents.set(agentAttribute.identifier, agent);
        }
    }
    addAgent(agentType) {
        const attributes = this.extractAgentAttributes(agentType);
        attributes.forEach(attribute => {
            if (this.agents.has(attribute.identifier)) {
                throw new TypeError(`Can not add agent type. Duplicated agent type identifier ${attribute.identifier} is not allowed`);
            }
        });
        attributes.forEach(attribute => {
            this.registerAgentType(attribute, agentType);
        });
    }
    createAgent(agentType, ...parameters) {
        const identifiers = this.extractIdentifiers(agentType);
        identifiers.forEach(identifier => {
            if (this.agents.has(identifier)) {
                throw new TypeError(`Can not create agent. Duplicated agent identifier ${identifier} is not allowed`);
            }
        });
        return Reflect.construct(agentType, [this, ...parameters]);
    }
    getAgent(typeOrIdentifier) {
        if (typeof typeOrIdentifier === 'string') {
            if (this.agents.has(typeOrIdentifier)) {
                return this.agents.get(typeOrIdentifier);
            }
            else if (this.types.has(typeOrIdentifier)) {
                const agentType = this.types.get(typeOrIdentifier);
                return this.createAgent(agentType);
            }
            else {
                throw new TypeError(`Agent ${typeOrIdentifier} not found`);
            }
        }
        else {
            return this.createAgent(typeOrIdentifier);
        }
    }
    extractAgentAttributes(agentType) {
        return reflection_1.Reflection.getAttributes(agentType)
            .filter(a => a instanceof agent_1.AgentAttribute);
    }
    extractIdentifiers(agentType) {
        return this.extractAgentAttributes(agentType)
            .map(a => a.identifier)
            .filter(a => a != null);
    }
}
exports.Domain = Domain;
exports.LocalDomain = new Domain();
//# sourceMappingURL=domain.js.map