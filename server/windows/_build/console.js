"use strict";
const tracer = require('tracer');
const util = require('util');
const global = require("./global");
//let console = global['console'];
let console = tracer.colorConsole({
    format: "<{{title}}> {{message}} ",
    dateformat: "HH:MM:ss.L"
});
exports.console = console;
if (typeof global['logError'] == 'undefined') {
    global['logError'] = function (e, reason) {
        console.error('Error ' + reason, e);
    };
}
function stack() {
    var stack = new Error().stack;
    console.log(stack);
}
exports.stack = stack;
;
console.clear = function () {
    util.print("\u001b[2J\u001b[0;0H");
};
//# sourceMappingURL=console.js.map