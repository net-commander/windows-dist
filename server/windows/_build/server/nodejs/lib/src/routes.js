"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Router = require("koa-router");
const router = new Router();
router.get('/', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    yield next();
    ctx.body = '(This page intentionally left blank2)';
    ctx.status = 200;
}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = router;
//# sourceMappingURL=routes.js.map