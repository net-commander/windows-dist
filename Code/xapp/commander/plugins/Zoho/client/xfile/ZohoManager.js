define([
    'dojo/_base/declare',
    'xide/factory',
    'xide/utils',
    'xide/types',
    'xide/manager/ManagerBase',
    'xide/views/RemoteEditor',
    'dojox/encoding/digests/SHA1'

], function (declare, factory, utils, types, ManagerBase, RemoteEditor, SHA1) {

    return declare("Zoho.xfile.ZohoManager", [ManagerBase],
        {
            mainView: null,
            ctx: null,
            config: null,
            panelManager: null,
            fileManager: null,
            imageEditView: null,
            currentItem: null,
            imageEditorPane: null,
            editorParentContainer: null,
            browserPreview: null,
            showUrlParameterDialog: false,
            persistent: true,
            cookiePrefix: 'ZohoEditor',
            editorPaneTitle: null,
            ctorArgs: null,
            HTMLEditors: null,
            currentHTMLEditor: null,
            onEditorClose: function (editor) {
                if (editor && editor['HTMLEditor'] && editor['HTMLEditor'].destroy) {
                    if (editor['HTMLEditor'] == this.currentHTMLEditor) {
                        this.currentHTMLEditor = null;
                    }
                    editor.HTMLEditor.destroy();
                }
                this.editorParentContainer.removeChild(editor);

            },
            getMainView: function () {
                return this.mainView || this.panelManager.rootView;
            },
            onItemSelected: function (eventData) {
                this.currentItem = eventData.item;
            },
            _getUrl: function (item) {
                var _location = '' + window.location.href;
                _location += (_location.indexOf('?') == -1 ? '?' : '&');
                var file = '' + item;
                file = file.replace('./', '');

                _location = './index.php?option=com_xappcommander&service=XZoho.get&callback=asdf&raw=html&file=' + file;
                var hashUrl = _location.replace('./index.php?', '');
                hashUrl += '&' + this.config.RPC_PARAMS.rpcUserField + '=' + this.config.RPC_PARAMS.rpcUserValue;
                var params = utils.urlDecode(hashUrl);


                var signature = SHA1._hmac(dojo.toJson(params), this.config.RPC_PARAMS.rpcSignatureToken, 1);
                _location += '&' + this.config.RPC_PARAMS.rpcUserField + '=' + this.config.RPC_PARAMS.rpcUserValue;
                _location += '&' + this.config.RPC_PARAMS.rpcSignatureField + '=' + signature;
                return _location;
            },
            openEditor: function (item) {

                var mainView = this.getMainView();
                if (!mainView) {
                    return;
                }
                var dstContainer = mainView.getNewAlternateTarget();
                if (!dstContainer) {
                    return;
                }
                this.imageEditorPaneContainer = dstContainer;

                var url = this._getUrl(item.path);

                var _container = new dijit.layout.ContentPane({
                    title: item.name,
                    closable: true,
                    style: 'padding:0px;margin:0px;overflow:hidden;'
                }, dojo.doc.createElement('div'));

                dstContainer.addChild(_container);
                dstContainer.selectChild(_container);
                dstContainer.resize();
                mainView.resize();

                dstContainer = _container;
                this.imageEditorPane = _container;


                var editor = new RemoteEditor({
                    selected: true,
                    delegate: this,
                    options: {},
                    config: this.config,
                    frameUrl: url,
                    parentContainer: dstContainer
                }, dojo.doc.createElement('div'));

                dstContainer.containerNode.appendChild(editor.domNode);
                editor.startup();
                return editor();

            },
            onMainViewReady: function () {
                var thiz = this;
                factory.publish(types.EVENTS.REGISTER_EDITOR, {
                    name: 'Zoho',
                    extensions: 'doc|docx|xlsx',
                    onEdit: function () {
                        thiz.openEditor(thiz.currentItem)
                    },
                    iconClass: 'el-icon-brush',
                    owner: thiz
                }, thiz);
            },
            _registerListeners: function () {
                this.inherited(arguments);
                var thiz = this;
                factory.subscribe(types.EVENTS.ITEM_SELECTED, this.onItemSelected, this);
                factory.subscribe(types.EVENTS.ON_MAIN_VIEW_READY, function () {
                    thiz.onMainViewReady();
                }, thiz);
            },
            constructor: function (ctorArgs) {
                this._registerListeners();
                this.ctorArgs = ctorArgs;
                this.HTMLEditors = [];
            }
        });
});