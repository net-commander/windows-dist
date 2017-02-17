/** @module xide/tests/TestUtils **/
define([
    "xdojo/declare",
    "xide/factory"
], function (declare,factory) {
    var ctx = window.sctx;
    function createCIS(){
        var CIS = {
            "inputs": [
                {
                    "chainType": 0,
                    "class": "cmx.types.ConfigurableInformation",
                    "dataRef": "",
                    "dataSource": "",
                    "description": null,
                    "enabled": true,
                    "enumType": "-1",
                    "flags": -1,
                    "group": 'General1',
                    "id": "CF_DRIVER_ID",
                    "name": "CF_DRIVER_ID",
                    "order": 1,
                    "params": null,
                    "parentId": "myeventsapp108",
                    "platform": null,
                    "storeDestination": "metaDataStore",
                    "title": "Id",
                    "type": 13,
                    "uid": "-1",
                    "value": "235eb680-cb87-11e3-9c1a-0800200c9a66",
                    "visible": true
                },
                {
                    "chainType": 0,
                    "class": "cmx.types.ConfigurableInformation",
                    "dataRef": "",
                    "dataSource": "",
                    "description": null,
                    "enabled": true,
                    "enumType": "-1",
                    "flags": -1,
                    "group": 'General1',
                    "id": "CF_DRIVER_CLASS",
                    "name": "CF_DRIVER_CLASS",
                    "order": 1,
                    "params": null,
                    "parentId": "myeventsapp108",
                    "platform": null,
                    "storeDestination": "metaDataStore",
                    "title": "Driver Class",
                    "type": 13,
                    "uid": "-1",
                    "value": ".\/Marantz\/MyMarantz.js",
                    "visible": false,
                    "widget":{
                        height:'300px !important'
                    }
                },
                {
                    "chainType": 0,
                    "class": "cmx.types.ConfigurableInformation",
                    "dataRef": "",
                    "dataSource": "",
                    "description": null,
                    "enabled": true,
                    "enumType": "-1",
                    "flags": -1,
                    "group": 'General12',
                    "id": "CF_DRIVER_CLASS2",
                    "name": "CF_DRIVER_CLASS2",
                    "order": 1,
                    "params": null,
                    "parentId": "myeventsapp108",
                    "platform": null,
                    "storeDestination": "metaDataStore",
                    "title": "Driver Class",
                    "type": 25,
                    "uid": "-1",
                    "value": ".\/Marantz\/MyMarantz.js",
                    "visible": true,
                    "widget":{
                        height:'300px !important',
                        showBrowser:true
                    }
                }
            ]
        };
        return CIS;
    }

    /**
     *
     * @returns {{ctx: *, mainView: *, toolbar: *}}
     */
    function getContext(){
        return {
            ctx:ctx,
            mainView:ctx.mainView,
            toolbar:ctx.mainView.getToolbar()
        };
    }
    /**
     *
     * @param title
     * @param panelType
     * @param globalVariable
     * @returns {*|wcLayout}
     */
    function createTab(title,panelType,globalVariable){

        var ctx = window.sctx;
        var mainView = ctx.mainView;

        title = title || _.last(globalVariable.split('.'));


        globalVariable = globalVariable || '_testTab';

        var docker = mainView.getDocker();
        if(window[globalVariable]){
            docker.removePanel(window[globalVariable]);
        }

        var parent = docker.addTab(panelType , {
            title: title || 'TestTab',
            icon: 'fa-folder'
        });

        window[globalVariable] = parent;

        parent.resize();

        return parent;
    }

    /**
     *
     * @param title
     * @param panelType
     * @param globalVariable
     * @returns {*|wcLayout}
     */
    function createNavigationTab(title,panelType,globalVariable){

        var ctx = window.sctx;
        var mainView = ctx.mainView;

        title = title || _.last(globalVariable.split('.'));


        globalVariable = globalVariable || '_testTab';

        var leftContainer = ctx.mainView.leftLayoutContainer;
        if(window[globalVariable]){
            leftContainer.removeChild(window[globalVariable]);
        }
        var parent = leftContainer.createTab(title || 'TestTab','fa-cube',true,null,{
            parentContainer: leftContainer,
            open:true,
            icon: 'fa-folder'
        });

        window[globalVariable] = parent;
        parent.resize();

        return parent;
    }

    var Module = declare('xide.tests.TestUtils',null,{});
    Module.createTab = createTab;
    Module.createNavigationTab = createNavigationTab;
    Module.getContext = getContext;


    Module.normalize = function(id, toAbsMid){

        console.error('normalize ',arguments);

        // summary:
        //	 Resolves id into a module id based on possibly-nested tenary expression that branches on has feature test value(s).
        //
        // toAbsMid: Function
        //	 Resolves a relative module id into an absolute module id
        var
            tokens = id.match(/[\?:]|[^:\?]*/g), i = 0,
            get = function(skip){
                var term = tokens[i++];
                if(term == ":"){
                    // empty string module name, resolves to 0
                    return 0;
                }else{
                    // postfixed with a ? means it is a feature to branch on, the term is the name of the feature
                    if(tokens[i++] == "?"){
                        if(!skip && has(term)){
                            // matched the feature, get the first value from the options
                            return get();
                        }else{
                            // did not match, get the second value, passing over the first
                            get(true);
                            return get(skip);
                        }
                    }
                    // a module
                    return term || 0;
                }
            };
        id = get();
        return id && toAbsMid(id);
    };

    Module.load = function(id, parentRequire, loaded){
        console.error('load',arguments);
    };


    Module.createCIS = createCIS;


    return Module;
});



