define([
    'dojo/_base/declare',
    'xide/types',
    'xapp/manager/ManagerBase'
], function (declare, types, ManagerBase) {

    return declare("SVN.xfile.SVNManager", [ManagerBase],
        {
            mainView: null,
            ctx: null,
            config: null,
            panelManager: null,
            fileManager: null,
            currentItem: null,
            persistent: true,
            cookiePrefix: 'XSVN',
            ctorArgs:null,
            currentSVN:null,
            getFileName: function () {
                var url = this.config.REPO_URL + '/' + this.currentItem.path;
                url = url.replace('./', '/');
                return url;
            },
            getMainView: function () {
                return this.mainView || this.panelManager.rootView;
            },
            onItemSelected: function (eventData) {
                this.currentItem = eventData.item;
            },
            _getUrl: function (item) {
                var url = this.config.REPO_URL + '/' + item.path;
                url = url.replace('./', '/');
                return url;
            },
            onMainViewReady: function () {
                var thiz = this;

                this.publish(types.EVENTS.REGISTER_ACTION, {
                    name: 'Subversion',
                    extensions: '*',
                    onEdit: function () {
                        thiz.openSandbox(thiz.currentItem)
                    },
                    iconClass: 'el-icon-brush',
                    owner: thiz
                }, thiz);

                /*
                eventFactory.createEvent(types.EVENTS.REGISTER_EDITOR, {
                    name: 'Current Sandbox',
                    extensions: 'js|php|html|css|less',
                    onEdit: function () {
                        thiz.openInCurrentSandbox(thiz.currentItem)
                    },
                    iconClass: 'el-icon-brush',
                    owner: thiz
                }, thiz);

                eventFactory.createEvent(types.EVENTS.REGISTER_EDITOR, {
                    name: 'Browser',
                    extensions: 'php|html',
                    onEdit: function () {
                        thiz.openEditor(thiz.currentItem)
                    },
                    iconClass: 'el-icon-globe',
                    owner: thiz
                }, thiz);
                */

            },
            _registerListeners: function () {
                this.inherited(arguments);
                var thiz=this;
                this.subscribe(types.EVENTS.ITEM_SELECTED, this.onItemSelected);
                this.subscribe(types.EVENTS.ON_MAIN_VIEW_READY, function () {
                    thiz.onMainViewReady();
                }, thiz);

            },
            constructor: function (ctorArgs) {
                this._registerListeners();
                this.ctorArgs=ctorArgs;
            }
        });
});