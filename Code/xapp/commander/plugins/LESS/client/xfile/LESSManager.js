define([
    'dojo/_base/declare',
    'xide/types',
    'xide/manager/ManagerBase'
], function (declare, types, ManagerBase) {

    return declare("LESS.xfile.LESSManager", [ManagerBase],
        {
            mainView: null,
            ctx: null,
            config: null,
            panelManager: null,
            fileManager: null,
            currentItem: null,
            persistent: true,
            cookiePrefix: 'XLESS',
            ctorArgs:null,
            onItemSelected: function (eventData) {
                if(!eventData || !eventData.item || !eventData.item._S){
                    return;
                }
                this.currentItem = eventData.item;
            },
            _registerListeners: function () {
                this.inherited(arguments);
                this.subscribe(types.EVENTS.ITEM_SELECTED, this.onItemSelected, this);
            },
            constructor: function (ctorArgs) {
                this.ctorArgs=ctorArgs;
            }
        });
});