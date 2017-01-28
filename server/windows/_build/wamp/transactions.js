"use strict";
const Debug = require("debug");
const DEBUG = Debug('wamp:transactions');
let transactions = new Map();
/**
 *
 *
 * @class Transaction
 */
class Transaction {
    /**
     *
     *
     * @static
     * @param {number} id
     * @param {number} sessionID
     */
    static add(id, sessionID) {
        DEBUG('setting transaction with ID: %s for sessionID: %s', id, sessionID);
        transactions.set(id, sessionID);
    }
    /**
     *
     *
     * @static
     * @param {number} id
     * @returns {number}
     */
    static get(id) {
        DEBUG('getting transaction with ID: %s', id);
        return transactions.get(id);
    }
    /**
     *
     *
     * @static
     * @param {number} id
     */
    static delete(id) {
        DEBUG('deleting transaction with ID: %s', id);
        transactions.delete(id);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Transaction;
//# sourceMappingURL=transactions.js.map