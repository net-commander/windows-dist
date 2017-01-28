"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Base_1 = require("../../../applications/Base");
const Renderer_1 = require("../../../resource/Renderer");
const views = require("co-views");
const Router = require("koa-router");
const _ = require("lodash");
const path = require("path");
const appRouter = new Router({ prefix: '/app' });
appRouter.get('/:name', (ctx) => __awaiter(this, void 0, void 0, function* () {
    const rtConfig = ctx.request.query.debug === 'true' ? 'debug' : 'release';
    const app = ctx.app;
    const appName = ctx.params.name;
    const config = app['config'];
    const render = views(path.join(process.cwd(), '/src/views'), { ext: 'ejs' });
    const variables = _.extend({}, config.relativeVariables);
    app.variables(ctx, variables);
    const RESOURCE_OFFSET = rtConfig === 'debug' ? '/lib/' : '';
    // ejs params
    const tplParams = {
        // see srcRoot/views/app_name.[debug|release].ejs# <%- HTML_HEADER %>
        // this part contains pretty all HTML-HEAD resources, ei: CSS, external scripts
        HTML_HEADER: new Renderer_1.ResourceRenderer(
        // clientRootSource = /Code/client/src/lib/[app_name]/resources-' + [debug|release] + '.json'
        app._env(null, Base_1.EEKey.CLIENT_ROOT) + RESOURCE_OFFSET + appName + '/resources-' + rtConfig + '.json', 
        // variables to replace in resource description '/resources-' + [debug|release]] + '.json
        variables, config.absoluteVariables)
            .renderHeader(),
        // same as HEADER
        BODY_RESOURCES: '',
        // results in <body class="xTheme-default xTheme-<%-THEME%>">
        THEME: variables[Base_1.EEKey.THEME]
    };
    ctx.body = yield render(appName + '_' + rtConfig, tplParams);
}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = appRouter;
//# sourceMappingURL=app.js.map