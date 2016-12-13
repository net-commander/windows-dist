/** @module xwire/_Base */
define('xwire/_Base',[
    'dcl/dcl',
    'xide/mixins/EventedMixin'
],function(dcl,EventedMixin){
    /**
     * @param {object} o An object.
     * @param {string} path The path from object, either dot-concatenated string or an array.
     * @returns The value of the object path.
     */
    function getObjectPath(o, path) {
        for (var comps = getPathComps(path), i = 0, l = comps.length; i < l; ++i) {
            var comp = comps[i];
            o = o == null ? o : o[comp];
        }
        return o;
    }

    /**
     * Utility to split an object path from a dot separated string into an array
     * @param path
     * @param create
     * @returns {Array}
     */
    function getPathComps(path, create) {
        return path === "" ? [] : typeof path.splice !== "function" ? path.split(".") : create ? path.slice() : path;
    }
    /**
     * Sets a value to an object path.
     * @param {object} o An object.
     * @param {string} path The path from object, either dot-concatenated string or an array.
     * @returns The value set. Undefined if value cannot be set.
     */
    function setObjectPath(o, path, value) {
        var comps = getPathComps(path, true),
            prop = comps.pop();
        o = comps.length > 0 ? getObjectPath(o, comps) : o;
        return Object(o) !== o || !path ? undefined : // Bail if the target is not an object
            typeof o.set === "function" ? o.set(prop, value) :
                (o[prop] = value);
    }

    /**
     * Abstract binding source
     * @class xwire/Source
     * @extends {module:xwire/_Base}
     * @extends {module:xide/mixins/EventedMixin}
     */
    var _base  = dcl([EventedMixin.dcl],{
        declaredClass:'xwire._Base',
        /***
         * Standard constructor for all subclassing bindings
         * @param {array} arguments
         */
        constructor: function(args){
            //simple mixin of constructor arguments
            for (var prop in args) {
                if (args.hasOwnProperty(prop)) {

                    this[prop] = args[prop];
                }
            }
        },
        getValue:function(object,path){
            return getObjectPath(object,path);
        },
        setValue:function(object,path,value){
            return setObjectPath(object,path,value);
        }

    });
    return _base;
});
/** @module xwire/Binding */
define('xwire/Binding',[
    'dcl/dcl',
    'xwire/_Base'
],function(dcl,_Base){
    /**
     * @class xwire/Binding
     */
    return dcl(_Base,{
        declaredClass:"xwire.Binding",
        /**
         * @type {module:xdeliteful/Source}
         */
        source:null,
        /**
         * @type {module:xwire/Target}
         */
        target:null,
        /**
         * @type {module:xdeliteful/Script}
         */
        accept:null,
        /**
         * @type {module:xdeliteful/Script}
         */
        transform:null,
        destroy:function(){
            this.source && this.source.destroy();
            this.target && this.target.destroy();
            delete this.transform;
            delete this.accept;
        },
        /**
         * trigger is being invoked by the source
         */
        trigger:function(data){
            if(this.target){
                this.target.run(data);
            }
        },
        /**
         *
         */
        start:function(){
            if(this.source){
                this.source.binding=this;
                this.source.start();
            }
            if(this.target){
                this.target.binding=this;
                this.target.start();
            }
        }
    });
});
/** @module xwire/Source */
define('xwire/Source',[
    'dcl/dcl',
    'xide/types',
    'xwire/_Base'
],function(dcl,types,_Base){
    /**
     * Abstract binding source
     * @class xwire/Source
     * @extends {module:xwire/_Base}
     */
    return dcl(_Base,{
        declaredClass:"xwire.Source"
    });
});
/** @module xwire/Target */
define('xwire/Target',[
    'dcl/dcl',
    'xwire/_Base'
],function(dcl,_Base){
    /**
     * Abstract binding target
     * @class xwire/Target
     */
    var Module = dcl(_Base,{
        declaredClass:"xwire.Target",
        /**
         * The binding we belong to
         * {xwire.Binding}
         */
        binding:null,
        /**
         * The object instance we're operating on
         */
        object:null,
        /**
         * The path within the object
         */
        path:null,
        /**
         * run is performed when a source is being triggered
         */
        run:function(){

        },
        /**
         * start the target, this is not really needed
         */
        start:function(){

        }
    });
    dcl.chainAfter(Module,'run');
    return Module
});
define('xwire/WidgetSource',[
    'dcl/dcl',
    'dojo/base/_kernel'
],function(dcl,Source,dojo){
    /**
     * Event based binding source
     */
    return dcl(Source,{
        declaredClass:"xwire.WidgetSource",
        /**
         * Trigger specifies the event name
         * {String|Array}
         */
        trigger:null,
        /**
         * Dijit widget instance
         */
        object:null,
        /**
         * Widget changed its value,
         * @param value
         */
        onTriggered:function(value){
            var thiz=this;
            //skip
            if(this.object && this.object.ignore===true){
                setTimeout(function(){
                    thiz.object.ignore=false;
                },500);
                return;
            }
            /**
             * forward to owner
             */
            if(this.binding){
                this.binding.trigger({
                    value:value,
                    source:this
                });
            }
        },
        /***
         * Start will subscribe to event specified in trigger
         */
        start:function(){
            var thiz=this;
            this.handle=dojo.connect(this.object,this.trigger, function (value) {
                thiz.onTriggered(value);
            });
        },
        /**
         * Cleanup
         */
        destroy:function(){
            this.handle.remove();
        }
    });
});
/** @module xwire/WidgetTarget */
define('xwire/WidgetTarget',[
    'dcl/dcl',
    'xide/types',
    'xwire/Target',
    'xide/utils'
],function(dcl,types,Target,utils){
    /**
     * Widget based binding target
     * @class xwire/WidgetTarget
     */
    return dcl(Target,{
        declaredClass:"xwire.WidgetTarget",
        targetFilter:null,
        /**
         * type {module:xwire/Binding}
         */
        binding:null,
        /**
         * type {module:xblox/RunScript}
         */
        delegate:null,
        /**
         * Run the action
         */
        run:function(data){
            var thiz = this;
            var isDelite = thiz.object !==null && thiz.object.render!=null;
            var acceptFn = this.binding.accept ? this.binding.accept.getFunction() : null;
            var transformFn = this.binding.transform ? this.binding.transform.getFunction() : null;
            if(thiz.object){
                var value = data.value;
                if(this.targetFilter!=null && this.targetFilter.length && this.delegate && this.delegate.resolveFilter){
                    value = this.delegate.resolveFilter(this.targetFilter,value,this.object);
                }
                thiz.object.ignore=true;
                if(acceptFn){
                    var accept = acceptFn.apply(this.delegate,[value,this.binding.accept,this.delegate,,this.object]);
                    if(!accept){
                        return;
                    }
                }
                if(transformFn){
                    var _value = transformFn.apply(this.delegate,[value,this.binding.transform,this.delegate,this.object]);
                    if(_value!==null && _value!==undefined){
                        value = _value;
                    }
                }
                if(!isDelite && thiz.object.set) {
                    thiz.object.set(thiz.path, value);
                }else if(thiz.object._set){
                    thiz.object._set(thiz.path, value);
                    var _funcPath = "set" + utils.capitalize(thiz.path);
                    if(thiz.object[_funcPath]) {
                        thiz.object[_funcPath](value,data);
                    }
                }else{
                    thiz.object[thiz.path] = value;
                }
                thiz.object.ignore=false;
            }
        }
    });
});
define('xwire/EventSource',[
    'dcl/dcl',
    'xwire/Source',
    'xide/mixins/EventedMixin'
],function(dcl,Source,EventedMixin){
    /**
     * Event based binding source
     */
    return dcl([Source,EventedMixin.dcl],{
        declaredClass:"xwire.EventSource",
        /**
         * Trigger specifies the event name
         * {String|Array}
         */
        trigger:null,
        /**
         * Path to the value within the triggered event.
         * {String}
         */
        path:null,
        /**
         * An array of filters, specified by path and value :
         * {
         *      path:string,
         *      value:string (path value must match this)
         * }
         *
         */
        filters:null,

        _started:false,
        /**
         * _matches evaluates a number of filters on an object
         * @param object {Object}
         * @param filters {Array}
         * @returns {boolean}
         * @private
         */
        _matches:function(object,filters){
            for(var i =0 ; i<filters.length;i++){
                var value = this.getValue(object,filters[i].path);
                if(value!==filters[i].value){
                    return false;
                }
            }
            return true;
        },
        /**
         *
         * @param evt
         */
        onTriggered:function(evt){
            /**
             * Run event filters if specified
             */
            if(this.filters && !this._matches(evt,this.filters)){
                return;
            }
            if(this.path){

                var value = this.getValue(evt,this.path);
                /**
                 * forward to owner
                 */
                if(this.binding){
                    this.binding.trigger({
                        value:value,
                        source:this
                    })
                }
            }
        },
        /***
         * Start will subscribe to event specified in trigger
         */
        start:function(){
            if(this._started){
                return;
            }
            this.subscribe(this.trigger,this.onTriggered);

            this._started = true;
        }
    });
});
define('xwire/DeviceTarget',[
    'dcl/dcl',
    'xide/types',
    'xwire/Target'
],function(dcl,types,Target){
    /**
     * Widget based binding target
     */
    return dcl(Target,{
        declaredClass:"xwire.DeviceTarget",
        /***
         * An optional variable to set before calling a command
         */
        variable:null,
        /**
         * The command to call (uses this.object(Block)) {String}
         */
        command:null,
        /**
         * Run the action
         */
        run:function(data){
            this.inherited(arguments);
            if(this.object){
                if(this.variable){
                    this.object.setVariable(this.variable,data.value,false,false,types.MESSAGE_SOURCE.GUI);
                }
                if(this.command){
                    this.object.callCommand(this.command);
                }
            }
        }
    });
});
define('xwire/main.js',[
    "xwire/Binding",
    "xwire/Source",
    "xwire/Target",
    "xwire/WidgetSource",
    "xwire/WidgetTarget",
    "xwire/EventSource",
    "xwire/DeviceTarget"
], function(){});
