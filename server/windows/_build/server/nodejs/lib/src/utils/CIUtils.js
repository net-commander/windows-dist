"use strict";
const _ = require("lodash");
function toOptions(cis) {
    cis = flattenCIS(cis);
    let result = [];
    for (let i = 0; i < cis.length; i++) {
        let ci = cis[i];
        result.push({
            name: toString(ci['name']),
            value: getCIValue(ci),
            type: toInt(ci['type']),
            enumType: toString(ci['enumType']),
            visible: toBoolean(ci['visible']),
            active: toBoolean(ci['active']),
            changed: toBoolean(ci['changed']),
            group: toString(ci['group']),
            user: toObject(ci['user']),
            dst: toString(ci['dst']),
            params: toString(ci['params'])
        });
    }
    return result;
}
exports.toOptions = toOptions;
;
function toObject(data) {
    if (data != null) {
        return data[0] ? data[0] : data;
    }
    return null;
}
exports.toObject = toObject;
;
function flattenCIS(cis) {
    /*
    let addedCIS = [];
    let removedCIs = [];
    for (var i = 0; i < cis.length; i++) {
        var ci = cis[i];
        var ciType = toInt(ci.type);
        if (ciType > types.ECIType.END) {// type is higher than core types, try to resolve it
            var resolved = types.resolveType(ciType);
            if (resolved) {
                _.mixin(addedCIS, resolved);
                removedCIs.push(ci);
            }
        }cis
    }
    if (addedCIS.length > 0) {
        cis = cis.concat(addedCIS);
    }
    if (removedCIs) {
        for (let i in removedCIs) {
            cis.remove(removedCIs[i]);
        }
    }
    return cis;
    */
    return [];
}
exports.flattenCIS = flattenCIS;
;
function toInt(data) {
    if (_.isNumber(data)) {
        return data;
    }
    let resInt = -1;
    if (data != null) {
        let _dataStr = data.length > 1 ? data : data[0] ? data[0] : data;
        if (_dataStr != null) {
            resInt = parseInt(_dataStr, 10);
        }
    }
    return resInt;
}
exports.toInt = toInt;
;
function arrayContains(array, element) {
    for (let i = 0; i < array.length; i++) {
        let _e = array[i];
        if (_e === element) {
            return true;
        }
    }
    return false;
}
exports.arrayContains = arrayContains;
;
function setStoreCIValueByField(data, field, value) {
    if (data[field] == null) {
        data[field] = [];
    }
    data[field][0] = getStringValue(value);
    return data;
}
exports.setStoreCIValueByField = setStoreCIValueByField;
;
function createOption(label, value, extra) {
    return _.mixin({
        label: label,
        value: value != null ? value : label
    }, extra);
}
exports.createOption = createOption;
;
function hasValue(data) {
    return data.value && data.value[0] != null && data.value[0].length > 0 && data.value[0] !== "0" && data.value[0] !== "undefined" && data.value[0] !== "Unset";
}
exports.hasValue = hasValue;
;
function getInputCIByName(data, name) {
    if (!data || !name) {
        return null;
    }
    let chain = 0;
    let dstChain = chain === 0 ? data.inputs : chain === 1 ? data.outputs : null;
    if (!dstChain) {
        dstChain = data;
    }
    if (dstChain != null) {
        for (let i = 0; i < dstChain.length; i++) {
            let ci = dstChain[i];
            let _n = getStringValue(ci.name);
            if (_n != null && _n.toLowerCase() === name.toLowerCase()) {
                return ci;
            }
        }
    }
    return null;
}
exports.getInputCIByName = getInputCIByName;
;
function getInputCIById(data, name) {
    if (!data) {
        return null;
    }
    let chain = 0;
    let dstChain = chain === 0 ? data.inputs : chain === 1 ? data.outputs : null;
    if (!dstChain) {
        dstChain = data;
    }
    if (dstChain != null) {
        for (let i = 0; i < dstChain.length; i++) {
            let ci = dstChain[i];
            let _n = getStringValue(ci.id);
            if (_n != null && _n.toLowerCase() === name.toLowerCase()) {
                return ci;
            }
        }
    }
    return null;
}
exports.getInputCIById = getInputCIById;
;
function getCIByChainAndName(data, chain, name) {
    if (!data) {
        return null;
    }
    let dstChain = chain === 0 ? data.inputs : chain === 1 ? data.outputs : null;
    if (!dstChain) {
        // has no chains
        dstChain = data;
    }
    if (dstChain != null) {
        for (let i = 0; i < dstChain.length; i++) {
            let ci = dstChain[i];
            let _n = getStringValue(ci.name);
            if (_n != null && _n.toLowerCase() === name.toLowerCase()) {
                return ci;
            }
        }
    }
    return null;
}
exports.getCIByChainAndName = getCIByChainAndName;
;
function getCIById(data, chain, id) {
    let dstChain = chain === 0 ? data.inputs : chain === 1 ? data.outputs : null;
    if (dstChain != null) {
        for (let i = 0; i < dstChain.length; i++) {
            let ci = dstChain[i];
            if (ci.id[0] === id[0]) {
                return ci;
            }
        }
    }
    return null;
}
exports.getCIById = getCIById;
;
function getCIInputValueByName(data, name) {
    let ci = getCIByChainAndName(data, 0, name);
    if (ci) {
        return ci.value;
    }
    return null;
}
exports.getCIInputValueByName = getCIInputValueByName;
;
function getCIValue(data) {
    return getCIValueByField(data, "value");
}
exports.getCIValue = getCIValue;
;
function getStringValue(d) {
    return toString(d);
}
exports.getStringValue = getStringValue;
;
function toString(d) {
    if (d != null) {
        if (!_.isArray(d)) {
            return '' + d;
        }
        if (d && d.length === 1 && d[0] == null) {
            return null;
        }
        return '' + (d[0] != null ? d[0] : d);
    }
    return null;
}
exports.toString = toString;
;
function setIntegerValue(data, value) {
    if (data != null) {
        if (_.isArray(data)) {
            data[0] = value;
        }
        else {
            data = value;
        }
    }
}
exports.setIntegerValue = setIntegerValue;
;
function getCIValueByField(data, field) {
    if (data[field] != null) {
        if (_.isArray(data[field])) {
            return data[field][0] ? data[field][0] : data[field];
        }
        else {
            return data[field];
        }
    }
    return null;
}
exports.getCIValueByField = getCIValueByField;
;
function setCIValueByField(data, field, value) {
    if (!data) {
        return data;
    }
    if (data[field] == null) {
        data[field] = [];
    }
    data[field] = value;
    return data;
}
exports.setCIValueByField = setCIValueByField;
;
function setCIValue(data, field, value) {
    let ci = getInputCIByName(data, field);
    if (ci) {
        setCIValueByField(ci, 'value', value);
    }
    return ci;
}
exports.setCIValue = setCIValue;
;
function getCIInputValueByNameAndField(data, name, field) {
    let ci = getCIByChainAndName(data, 0, name);
    if (ci) {
        return ci[field];
    }
    return null;
}
exports.getCIInputValueByNameAndField = getCIInputValueByNameAndField;
;
function getCIInputValueByNameAndFieldStr(data, name, field) {
    const rawValue = getCIInputValueByNameAndField(data, name, field);
    if (rawValue) {
        return getStringValue(rawValue);
    }
    return null;
}
exports.getCIInputValueByNameAndFieldStr = getCIInputValueByNameAndFieldStr;
;
function toString2(val) {
    if (val != null) {
        if (!_.isArray(val)) {
            return '' + val;
        }
        if (val && val.length === 1 && val[0] == null) {
            return null;
        }
        return '' + (val[0] != null ? val[0] : val);
    }
    return null;
}
exports.toString2 = toString2;
;
function toBoolean(data) {
    let resInt = false;
    if (data != null) {
        let _dataStr = data[0] ? data[0] : data;
        if (_dataStr != null) {
            resInt = !!((_dataStr === true || _dataStr === 'true' || _dataStr === '1'));
        }
    }
    return resInt;
}
exports.toBoolean = toBoolean;
;
function getCIInputValueByNameAndFieldBool(data, name, field) {
    let rawValue = getCIInputValueByNameAndField(data, name, field);
    if (rawValue) {
        return toBoolean(rawValue);
    }
    return null;
}
exports.getCIInputValueByNameAndFieldBool = getCIInputValueByNameAndFieldBool;
;
//# sourceMappingURL=CIUtils.js.map