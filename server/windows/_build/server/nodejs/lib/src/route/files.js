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
const send = require("koa-send");
class FileRouter extends Router {
    constructor(args) {
        super(arguments);
    }
}
exports.FileRouter = FileRouter;
function create(directoryService, prefix = '/files', app) {
    const filesRouter = new FileRouter({ prefix: prefix });
    filesRouter.directoryService = directoryService;
    filesRouter.get('/:prefix/:mount/*', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        // @TODO: files router doesnt catch right
        if (!ctx.req.url.startsWith(prefix)) {
            return next();
        }
        const filePath = ctx.params['0'];
        if (filePath) {
            yield send(ctx, filePath, {
                root: filesRouter.directoryService.resolve(ctx.params.mount, '', ctx.request)
            });
        }
        else {
            ctx.body = "";
        }
    }));
    return filesRouter;
}
exports.create = create;
;
//# sourceMappingURL=files.js.map