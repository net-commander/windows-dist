"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const attribute_1 = require("./attribute");
const reflection_1 = require("./reflection");
const construct_1 = require("./interceptors/construct");
const domain_1 = require("../domain");
const agent_1 = require("../agent");
const utils_1 = require("./utils");
/**
 * Decorate class
 * @param attribute
 * @returns {(target:Constructor)=>(void|Constructor)}
 */
function decorateClass(attribute) {
    // upgrade prototype
    return (target) => {
        // // check the parents
        // let upgrade = true;
        // for (let current = target; !!current.name; current = Object.getPrototypeOf(current)) {
        //   console.log('check ====> name   :', current.name);
        //   console.log('            symbols:', Object.getOwnPropertySymbols(current));
        //   console.log('            props  :', Object.getOwnPropertyNames(current));
        //   const origin = current[ORIGIN_CONSTRUCTOR];
        //   if (origin) {
        //     console.log('            ORIGIN :', origin.name, '(do not upgrade)');
        //     upgrade = true;
        //     break;
        //   }
        // }
        const proxied = Reflect.has(target, utils_1.ORIGIN_CONSTRUCTOR);
        const originalTarget = proxied ? Reflect.get(target, utils_1.ORIGIN_CONSTRUCTOR) : target;
        if (attribute_1.CanDecorate(attribute, originalTarget)) {
            reflection_1.Reflection.addAttribute(attribute, originalTarget);
            let upgradedTarget;
            if (proxied) {
                upgradedTarget = target;
            }
            else {
                // intercept by implement ES6 proxy (dynamic intercept)
                upgradedTarget = construct_1.AddConstructProxyInterceptor(target);
                Reflect.set(upgradedTarget, utils_1.ORIGIN_CONSTRUCTOR, originalTarget);
            }
            // console.log('add class', typeof originTarget, typeof originTarget.prototype);
            // intercept by overloading ES5 prototype (static intercept)
            // AddPrototypeInterceptor(upgradedConstructor);
            // always register agent type in LocalDomain
            if (attribute instanceof agent_1.AgentAttribute) {
                domain_1.LocalDomain.registerAgentType(attribute, upgradedTarget);
            }
            return upgradedTarget;
        }
        return target;
    };
}
exports.decorateClass = decorateClass;
/**
 * Decorate class members
 * @param attribute
 * @returns {(target:Object, propertyKey:(string|symbol), descriptor?:PropertyDescriptor)=>void}
 */
function decorateClassMember(attribute) {
    return (target, propertyKey, descriptor) => {
        if (attribute_1.CanDecorate(attribute, target, propertyKey, descriptor)) {
            reflection_1.Reflection.addAttribute(attribute, target, propertyKey, descriptor);
        }
    };
}
exports.decorateClassMember = decorateClassMember;
/**
 * Decorate class property
 * @param attribute
 * @returns {(target:Object, propertyKey:(string|symbol), descriptor?:PropertyDescriptor)=>void}
 */
function decorateClassMethod(attribute) {
    return (target, propertyKey, descriptor) => {
        if (attribute_1.CanDecorate(attribute, target, propertyKey, descriptor)) {
            reflection_1.Reflection.addAttribute(attribute, target, propertyKey, descriptor);
        }
    };
}
exports.decorateClassMethod = decorateClassMethod;
/**
 * Decorate class field
 * @param attribute
 * @returns {(target:Object, propertyKey:(string|symbol), descriptor?:PropertyDescriptor)=>void}
 */
function decorateClassProperty(attribute) {
    return (target, propertyKey, descriptor) => {
        // TypeScript is not smart enough to identify the PropertyDescriptor on method
        if (descriptor) {
            throw new TypeError(`${Reflect.getPrototypeOf(attribute).constructor.name} can only decorate on class property`);
        }
        if (attribute_1.CanDecorate(attribute, target, propertyKey)) {
            reflection_1.Reflection.addAttribute(attribute, target, propertyKey);
        }
    };
}
exports.decorateClassProperty = decorateClassProperty;
function getDecoratingClass(type) {
    return type[utils_1.ORIGIN_CONSTRUCTOR] || type;
}
exports.getDecoratingClass = getDecoratingClass;
//# sourceMappingURL=decorator.js.map