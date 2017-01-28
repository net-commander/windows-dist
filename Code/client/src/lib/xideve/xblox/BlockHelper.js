define(function() {

    var BlockHelper = function() {};
    BlockHelper.prototype = {

        updateWidget: function(){
            console.error('updateWidget',arguments);
        },
        _getWidgetClassText: function(id, className){
            return "";
            var text = "<span class='propertiesTitleClassName'>";
            //text += node.tagName;
            if (id) {
                text += "#" + id;
            }
            if (className) {
                text += "." + className.replace(/\s+/g,".");
            }
            text += "</span> ";
            return text;
        },
        _remove_prefix: function(str){
            var returnstr = str;
            var prefixes_to_remove=[
                'dijit/form/',
                'dijit/layout/',
                'dijit/',
                'dojox/mobile/',
                'html.',
                'html/',
                'OpenAjax.',
                'OpenAjax/'];
            for(var i=0; i<prefixes_to_remove.length; i++){
                if(str.indexOf(prefixes_to_remove[i])==0){ // use ===?
                    returnstr=str.substr(prefixes_to_remove[i].length);
                    //FIXME: Another hack. Need a better approach for this.
                    //Special case logic for HTML widgets
                    if(prefixes_to_remove[i]=='html.'){
                        returnstr='&lt;'+returnstr+'&gt;';
                    }
                    break;
                }
            }
            return returnstr;
        },
        __getWidgetNameText:function(widget){
            if(widget.domNode && widget.domNode.label){
                var text = "<span class='propertiesTitleWidgetName'>";
                //text+=this._remove_prefix(type);
                text+="</span> ";
                return ""
            }

            var text = "<span class='propertiesTitleWidgetName'>";
            text+=this._remove_prefix(widget.type);
            text+="</span> ";
            return text;
        },
        __getWidgetText:function(widget){
            if(widget.domNode){
                var _label = null;
                if(widget.domNode.get){
                    _label = widget.domNode.get('label');
                }else{
                    _label = widget.domNode.label;
                }
                return _label;
            }
            return widget.type;
        },
        getData: function(/*Widget*/ widget, /*Object*/ options) {
            if(!widget){
                return undefined;
            }
            var data = widget._getData(options);
            var _uniqueId = dijit.getUniqueId(widget.type.replace(/\./g,"_"));
            //_uniqueId = _uniqueId.replace('delite/','d-').toLowerCase();
            
            //delite/Slider_2
            if(widget.id==='no_id') {

                /*widget.id = _uniqueId;
                data.properties['id'] = _uniqueId;
                data.properties.id = _uniqueId;*/
            }
            //console.log('get data',data);
            return data;

            /*
             console.error('get data');

             var widgetData = widget._getData( options);
             var value = widget._srcElement.getAttribute('data');
             if(widgetData && widgetData.properties){
             if(widgetData.properties['isTempID']){
             delete widgetData.properties.id; // delete temp id so it does not make it's way out to the source
             }
             }
             if (value){

             //widgetData.properties.data = JSON.parse(value);
             }
             */
            return widgetData;
        },
        __create: function(widget) {
            widget._srcElement.setAttribute('id',widget.id);
            //console.error('-create ',widget);
        },
        __getChildren: function(widget, attach) {

            var dijitWidget = widget.dijitWidget;
            // First, get children from slider's containerNode.
            var children = [];//widget._getChildren(attach);

            return children;
            function getWidget(node) {
                if (attach) {
                    return davinci.ve.widget.getWidget(node);
                } else {
                    var widget = node._dvWidget;
                    if (widget) {
                        return widget;
                    }
                }
            }

            dojo.forEach(dijitWidget.domNode.children, function (node) {
                var childWidget = getWidget(node);
                if(childWidget){
                    if(childWidget.type=='xblox/RunScript'){
                        console.log('enum ' , childWidget);
                        children.push(childWidget);
                    }

                }
            });

            return children;

        },
        __getChildrenData: function(/*Widget*/ widget, /*Object*/ options){
            // summary:
            //		The child in the markup of a button tag is its text content, so return that.
            //

            return undefined;
            if (widget && widget.getTagName() == "BUTTON") {
                return widget.dijitWidget.label;
            }

            return undefined;
        }

        // FIXME: Original code from dojoy days. Commented out because currently untested.
        // Need to review and decide whether to resurrect.	
        // 
        // this.getPropertyValue = function(/*Widget*/ widget, /*String*/ name){
        // 	// summary:
        // 	//		Mask label attribute if the button's tag is BUTTON.
        // 	//
        // 	if(!widget || !name){
        // 		return undefined;
        // 	}

        // 	var context = widget.getContext();

        // 	if (context && widget.getTagName() == "BUTTON" && name == "label") {
        // 		return undefined;
        // 	}

        // 	return widget._getPropertyValue(name);
        // };
    };

    return BlockHelper;

});