define([
    'dojo/_base/lang',
    'dojo/_base/declare',
    './JSONEditorManager',
    'xide/types',
    'xide/model/Component'], function (lang, declare, JSONEditorManager, types, Component) {
    return declare([Component], {
        run: function (ctx) {

            var _res = this.inherited(arguments);
            var mgr = new JSONEditorManager({
                ctx:ctx
            });
            mgr.init();
            return _res;
        }
    });
});