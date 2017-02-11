"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const Router = require("koa-router");
const path = require("path");
const views = require('co-views');
const Renderer_1 = require("../resource/Renderer");
const render = views(path.join(__dirname, '../../views'), { ext: 'ejs' });
const appRouter = new Router({ prefix: '/app' });
appRouter.get('/:name', (ctx) => __awaiter(this, void 0, void 0, function* () {
    const params = {
        rtConfig: ctx.request.query.debug === 'true' ? 'debug' : 'release'
    };
    const appName = ctx.params.name;
    const config = ctx.app['config'];
    const renderer = new Renderer_1.ResourceRenderer(config['APP_ROOT'] + '/Code/client/src/lib/' + appName + '/resources-' + params.rtConfig + '.json', config.relativeVariables, config.absoluteVariables);
    const RENDER_PARAMS = {
        HTML_HEADER: renderer.renderHeader(),
        BODY_RESOURCES: '',
        THEME: renderer.relativeVariables.THEME
    };
    ctx.body = yield render('apps/' + ctx.params.name + '_' + params.rtConfig, RENDER_PARAMS);
}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = appRouter;
//# sourceMappingURL=app.js.map