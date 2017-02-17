//>>built
require({cache:{"Shell/views/ShellView":function(){define("xide/widgets/TemplatedWidgetBase xide/widgets/_CSSMixin xide/widgets/_StyleMixin xide/widgets/_InsertionMixin xide/utils xide/types xide/factory dojo/cookie dojo/json ./ShellRunView".split(" "),function(f,d,g,b,e,h,l,a,c,k){return dojo.declare("Shell.xfile.views.ShellView",[f,d,g,b],{config:null,ctx:null,cssClass:"mainView XShellView",layoutMain:null,layoutTop:null,layoutLeft:null,layoutCenter:null,layoutRight:null,layoutBottom:null,panelManager:null,
leftPanel:null,centerPanel:null,tabContainer:null,bottomTabContainer:null,logPanel:null,preview:null,cookieName:null,topics:null,panels:null,templateString:"\x3cdiv\x3e\x3cdiv data-dojo-attach-point\x3d'layoutMain' data-dojo-type\x3d'xide.layout.BorderContainer' data-dojo-props\x3d\"design:'sidebar',cookieName:'${!cookieName}'\" class\x3d'layoutMain ui-widget-content'\x3e\x3cdiv data-dojo-attach-point\x3d'layoutCenter' style\x3d'padding:0px;' data-dojo-type\x3d'dijit.layout.ContentPane' data-dojo-props\x3d\"region:'center',splitter:'false'\" class\x3d'layoutCenter'\x3e\x3c/div\x3e\x3cdiv data-dojo-attach-point\x3d'layoutRight' data-dojo-type\x3d'dijit.layout.ContentPane' data-dojo-props\x3d\"region:'right',splitter:'true',minSize:'200',toggleSplitterState:'full',toggleSplitterFullSize:'200px' \" class\x3d'layoutRight filePropertyPanel ui-state-default'\x3e\x3c/div\x3e\x3cdiv data-dojo-attach-point\x3d'layoutBottom' data-dojo-type\x3d'dijit.layout.ContentPane' data-dojo-props\x3d\"region:'bottom',splitter:'true',toggleSplitterState:'closed',toggleSplitterClosedSize:'0px',toggleSplitterFullSize:'150px'\" class\x3d'layoutBottom ui-state-default'\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e",
prepareLayout:function(a){a.LAYOUT_PRESET==h.LAYOUT_PRESET.SINGLE&&this.layoutMain.removeChild(this.layoutLeft);null!=a.PANEL_OPTIONS&&!1===a.PANEL_OPTIONS.ALLOW_INFO_VIEW&&this.layoutMain.removeChild(this.layoutRight);!this.layoutTop||null==a.PANEL_OPTIONS||!1!==a.PANEL_OPTIONS.ALLOW_BREADCRUMBS&&0!==a.PANEL_OPTIONS.ALLOW_BREADCRUMBS||null!=a.ACTION_TOOLBAR_MODE&&"self"==a.ACTION_TOOLBAR_MODE?this.layoutTop&&this.layoutTop._splitterWidget&&(e.destroyWidget(this.layoutTop._splitterWidget),this.layoutTop._splitterWidget=
null):this.layoutMain.removeChild(this.layoutTop);null!=a.PANEL_OPTIONS&&!1===a.PANEL_OPTIONS.ALLOW_LOG_VIEW?this.layoutMain.removeChild(this.layoutBottom):this.layoutBottom._splitterWidget&&(this.layoutBottom._splitterWidget.fullSize="150px",this.layoutBottom._splitterWidget.collapsedSize=null,this.bottomTabContainer||(this.bottomTabContainer=this._createBottomTabContainer(),this.logPanel=new dijit.layout.ContentPane({className:"bottomTabLog",title:"Log",style:"padding:0;background-color: transparent;"},
dojo.doc.createElement("div")),this.bottomTabContainer.addChild(this.logPanel)))},getPanelManager:function(){return this.panelManager},createShellPanel:function(a,c,b){c=new k({title:b,closable:!1,delegate:this,type:c,style:"padding:0px;margin:0px;height:inherit",className:"runView"},dojo.doc.createElement("div"));a.addChild(c)},initWithConfig:function(a){try{this.prepareLayout(a);var c=this.createTabContainer(this.layoutCenter);this.panels.push(this.createShellPanel(c,"sh","Bash"));this.panels.push(this.createShellPanel(c,
"js","Javascript"))}catch(b){debugger}this.resize()},removeEmptyContainers:function(){e.destroyIfEmpty(this.layoutRight);e.destroyIfEmpty(this.layoutCenter);e.destroyIfEmpty(this.layoutLeft);e.destroyIfEmpty(this.layoutTop);e.destroyIfEmpty(this.layoutBottom)},_resizeContainer:function(a,c){try{a&&a.domNode&&a.resize()}catch(b){}},resize:function(){this.inherited(arguments);this.layoutMain&&this._resizeContainer(this.layoutMain,"main");this.layoutLeft&&this._resizeContainer(this.layoutLeft,"left");
this.layoutTop&&this._resizeContainer(this.layoutTop,"top");this.layoutCenter&&this._resizeContainer(this.layoutCenter,"center");this.layoutRight&&this._resizeContainer(this.layoutRight,"right");this.layoutLeft&&this._resizeContainer(this.layoutLeft,"left");this.layoutBottom&&this._resizeContainer(this.layoutBottom,"bottom")},onStartupPost:function(){var a=this;dojo.connect(null,void 0!==dojo.global.onorientationchange?"onorientationchange":"onresize",this,function(){a.resize()});this.removeEmptyContainers();
this.resize()},postCreate:function(){this.inherited(arguments)},buildRendering:function(){this.inherited(arguments)},_createBottomTabContainer:function(){var a=new dijit.layout.TabContainer({tabStrip:!0,tabPosition:"bottom",region:"bottom",attachParent:!0,style:"width:100%"},dojo.doc.createElement("div"));this.layoutBottom.containerNode.appendChild(a.domNode);a.startup();return a},destroy:function(){this.toolbar=null;e.destroyWidget(this.preview);e.destroyWidget(this.leftPanel);this.preview=null;
dojo.forEach(this.topics,dojo.unsubscribe)},startup:function(){this.inherited(arguments);this.panels=[];this.toolbar&&(this.toolbar.delegate=this);this.topics=[l.subscribe(h.EVENTS.IMAGE_LOADED,this.resize,this)]},loadPreferences:function(){var b=a(this.cookiePrefix+"_items_");return b=b?c.parse(b):[]},savePreferences:function(){try{for(var b=[],k=0;k<this.panels.length;k++)this.panels[k].item&&this.panels[k].item.path&&b.push(this.panels[k].item.path);a(this.cookiePrefix+"_items_",c.stringify(b))}catch(d){debugger}},
onEditorClose:function(a){this.panels.remove(a);this.savePreferences()},addItem:function(a){var c=this.getNewAlternateTarget(this.layoutLeft);a=this.ctx.getScriptManager().openFile(a,c,this);this.panels.push(a);c.selectChild(a);this.savePreferences()},createTabContainer:function(a){if(!this.tabContainer){var c=new dijit.layout.TabContainer({tabStrip:!0,tabPosition:"left",splitter:!0,region:"center",attachParent:!0,style:"width:100%;height:100%"},dojo.doc.createElement("div"));a.containerNode.appendChild(c.domNode);
c.startup();this.tabContainer=c}return this.tabContainer},onConsoleEnter:function(a,c){this.delegate.onConsoleCommand(a,c)}})})},"Shell/widgets/Console":function(){define("dojo/_base/declare xide/widgets/TemplatedWidgetBase xide/widgets/_CSSMixin xide/widgets/_StyleMixin xide/widgets/_InsertionMixin dojo/dom-class xide/factory ../KeyboardHandler ../History".split(" "),function(f,d,g,b,e,h,l,a,c){return f("Shell.xfile.widgets.Console",[d,g,b,e,a,c],{delegate:null,value:null,editNode:null,labelTextNode:null,
labelNode:null,type:null,linkToggle:null,templateString:"\x3cdiv\x3e\x3cdiv class\x3d'console' data-dojo-attach-point\x3d'root'\x3e\x3ctable class\x3d\"\" border\x3d\"0\" cellpadding\x3d\"0px\" width\x3d\"100%\" height\x3d\"100%\" \x3e\x3ctbody data-dojo-attach-point\x3d'tBody' align\x3d'left'\x3e\x3ctr class\x3d'' \x3e\x3ctd class\x3d'labelNode' data-dojo-attach-point\x3d'labelNode' class\x3d'' valign\x3d'middle' width\x3d'30px'\x3e\x3cspan data-dojo-attach-point\x3d'labelTextNode'\x3e#\x3c/span\x3e\x3c/td\x3e\x3ctd class\x3d'linkNode' data-dojo-attach-point\x3d'linkNode' class\x3d'' valign\x3d'middle' width\x3d'30px'\x3e\x3cbutton data-dojo-attach-point\x3d'linkToggle' data-dojo-type\x3d'dijit/form/ToggleButton' data-dojo-props\x3d\"iconClass:'el-icon-link', checked: true\"\x3e\x3c/button\x3e\x3c/td\x3e\x3ctd  class\x3d'editNode' data-dojo-attach-point\x3d'editNode' class\x3d'' valign\x3d'middle' width\x3d'100%'\x3e\x3c/td\x3e\x3c/tr\x3e\x3c/tbody\x3e\x3c/table\x3e\x3c/div\x3e\x3c/div\x3e",
isLinked:function(){return this.linkToggle.get("checked")},createWidgets:function(){this.editBox=l.createEditBox(this.editNode,"",null,"",null,this);var a=this;this.editBox.on("keydown",function(c){a.onKey(c)});this.editBox.on("keyup",function(c){a.onKey(c)});h.remove(this.linkToggle.iconNode,"dijitReset")},getValue:function(){return this.editBox.get("value")},startup:function(){this.inherited(arguments);this.createWidgets()},onUp:function(){this.editBox.set("value",this.getPrev())},onDown:function(){this.editBox.set("value",
this.getNext())},onEnter:function(){var a=this.editBox.get("value");this.delegate.onEnter(a);this.editBox.set("value","");this.push(a)}})})},"Shell/ShellManager":function(){define("dojo/_base/declare dojo/_base/lang xide/factory xide/types xide/utils xide/manager/ManagerBase ./views/ShellView".split(" "),function(f,d,g,b,e,h,l){return f("Shell.xfile.ShellManager",[h],{mainView:null,ctx:null,config:null,panelManager:null,fileManager:null,currentItem:null,persistent:!0,cookiePrefix:"XShell",serverClass:"XShell",
ctorArgs:null,currentShell:null,shellPanelContainer:null,shellView:null,autoOpen:!1,getServer:function(){return this.fileManager||xfile.getContext().getFileManager()},getFileName:function(){var a=this.config.REPO_URL+"/"+this.currentItem.path;return a=a.replace("./","/")},getMainView:function(){return this.mainView||this.panelManager.rootView},onItemSelected:function(a){a&&a.item&&a.item._S&&(this.currentItem=a.item)},_getUrl:function(a){a=this.config.REPO_URL+"/"+a.path;return a=a.replace("./","/")},
_createShellView:function(a){var c={LAYOUT_PRESET:1,PANEL_OPTIONS:{ALLOW_NEW_TABS:!1,ALLOW_MULTI_TAB:!1,ALLOW_INFO_VIEW:!1,ALLOW_LOG_VIEW:!1,ALLOW_BREADCRUMBS:!1,ALLOW_CONTEXT_MENU:!1,ALLOW_LAYOUT_SELECTOR:!1,ALLOW_SOURCE_SELECTOR:!1},ALLOWED_ACTIONS:[0],FILE_PANEL_OPTIONS_LEFT:{LAYOUT:2,AUTO_OPEN:"true"},FILE_PANEL_OPTIONS_MAIN:{LAYOUT:2,AUTO_OPEN:"true"},FILE_PANEL_OPTIONS_RIGHT:{LAYOUT:2,AUTO_OPEN:"false"}},b={selected:!0,delegate:this,item:this.currentItem,options:{},config:c,cookiePrefix:this.cookiePrefix,
parentContainer:a};d.mixin(b,this.ctorArgs);b=new l(b,dojo.doc.createElement("div"));a.containerNode.appendChild(b.domNode);b.startup();b.initWithConfig(c);return a.shellView=b},_createShellPanel:function(){var a=this.getMainView();if(!a.shellPanel&&a&&a.bottomTabContainer){if(this.autoOpen){var c=a.layoutBottom._splitterWidget;if(c)switch(c.state){case "collapsed":case "closed":c.set("state","full")}}var c=a.bottomTabContainer,b=new dijit.layout.ContentPane({title:"Shell",closable:!1,style:"padding:0px;margin:0px;overflow:hidden;"},
dojo.doc.createElement("div"));c.addChild(b);c.selectChild(b);c.resize();a.resize();this.shellPanelContainer=c;this.shellView=this._createShellView(b);a.shellPanel=this.shellView}},getShellView:function(){return this.shellView||this._createShellPanel()},onMainViewReady:function(){this.getShellView()},_registerListeners:function(){this.inherited(arguments);var a=this;g.subscribe(b.EVENTS.ITEM_SELECTED,this.onItemSelected,this);g.subscribe(b.EVENTS.ON_MAIN_VIEW_READY,function(){a.onMainViewReady()},
a)},constructor:function(a){this._registerListeners();this.ctorArgs=a},onServerResponse:function(a,c){if(a&&c&&a.owner&&a.owner.onServerResponse)a.owner.onServerResponse(a,c)},getCurrentPath:function(){if(this.currentItem&&this.panelManager){var a=this.currentItem;if((a=!0===this.currentItem.directory?this.currentItem:this.currentItem._S.getParent(this.currentItem))&&!0===a.directory)return e.buildPath(a.mount,a.path,!1)}return null},runBash:function(a,c,b){var d=this;c=this.base64_encode(c);this.getServer().callMethodEx(this.serverClass,
"run",["sh",c,b],function(c){d.onServerResponse(a,c)})},runJavascript:function(a,c){var b=eval(c);if(b)this.onServerResponse(a,b)},onConsoleCommand:function(a,c){if("sh"===a.type){c=c.replace(/["'`]/g,"");var b=null;a.isLinked()&&(b=this.getCurrentPath());return this.runBash(a,c,b)}if("js"===a.type)return this.runJavascript(a,c)},base64_encode:function(a){var c,b,d,e,f=0,r=0,m="",m=[];if(!a)return a;do c=a.charCodeAt(f++),b=a.charCodeAt(f++),d=a.charCodeAt(f++),e=c<<16|b<<8|d,c=e>>18&63,b=e>>12&63,
d=e>>6&63,e&=63,m[r++]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt(c)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt(b)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt(d)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt(e);while(f<a.length);m=m.join("");a=a.length%3;return(a?m.slice(0,a-3):m)+"\x3d\x3d\x3d".slice(a||3)}})})},"Shell/KeyboardHandler":function(){define(["dojo/_base/declare",
"dojo/keys","dojo/has"],function(f,d,g){return f("Shell.xfile.KeyboardDelegate",null,{ctlrKeyDown:!1,onKeyUp:function(b){switch(b.keyCode){case d.META:case d.SHIFT:case d.ALT:case d.CTRL:this.ctlrKeyDown=!1}},onKey:function(b){var e=this;if(b.type&&"keyup"==b.type)return this.onKeyUp(b);if(b.keyCode==d.ENTER)this.ctlrKeyDown?this.openItemAlternate&&(b.preventDefault(),this.openItemAlternate(null)):(this.onEnter(),b.preventDefault());else switch(b.keyCode){case d.UP_ARROW:this.onUp();break;case d.DOWN_ARROW:this.onDown();
break;case d.META:case d.ALT:case d.SHIFT:case d.CTRL:this.ctlrKeyDown=!0;setTimeout(function(){e.ctlrKeyDown=!1},2E3);break;case d.TAB:this.onTab&&(this.onTab(b),b.preventDefault());break;case d.BACKSPACE:var f=!0;g("chrome")&&0==this.ctlrKeyDown&&(f=!1);f&&this.onBack&&(b.preventDefault(),this.onBack());break;case 67:this.ctlrKeyDown&&this.onClipBoardCopy&&(b.preventDefault(),this.onClipBoardCopy());break;case 86:this.ctlrKeyDown&&this.onClipBoardPaste&&(b.preventDefault(),this.onClipBoardPaste());
break;case 88:this.ctlrKeyDown&&this.onClipBoardCut&&(b.preventDefault(),this.onClipBoardCut())}}})})},"Shell/History":function(){define(["dojo/_base/declare","dojo/keys","dojo/has"],function(f,d,g){return f("Shell.xfile.History",null,{_history:[""],_index:0,push:function(b){this._history.push(b);this._index=this.length()},length:function(){return this._history.length},getNext:function(){this._index+=1;var b=this._history[this._index]||"";this._index=Math.min(this.length(),this._index);return b},
getPrev:function(){this._index=Math.max(0,this._index-1);return this._history[this._index]}})})},"Shell/run":function(){require({packages:[{name:"Shell",location:"../../../plugins/Shell/client/xfile/",packageMap:{}}],cache:{}},["Shell"])},"Shell/views/ShellRunView":function(){define("../widgets/Console dojo/_base/lang dojo/_base/declare dojo/dom-geometry dojo/dom-style xfile/widgets/ProgressItem xide/factory xide/types xide/utils xide/widgets/_CSSMixin xide/widgets/_InsertionMixin xide/widgets/_StyleMixin xide/widgets/TemplatedWidgetBase".split(" "),
function(f,d,g,b,e,h,l,a,c,k,n,p,q){return g("Shell.xfile.views.ShellRunView",[q,k,p,n],{delegate:null,value:null,editorNode:null,cmdNode:null,console:null,type:null,logView:null,logPane:null,progressItem:null,templateString:"\x3cdiv\x3e\x3cdiv class\x3d'runPanel' data-dojo-attach-point\x3d'root' data-dojo-type\x3d'dijit.layout.ContentPane'\x3e\x3cdiv class\x3d'logPane ui-widget-content' data-dojo-attach-point\x3d'logView' data-dojo-type\x3d'dijit.layout.ContentPane'\x3e\x3c/div\x3e\x3cdiv data-dojo-attach-point\x3d'cmdNode' class\x3d'cmdParent' style\x3d'height:25px'\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e",
createLogItem:function(a,b){var c=new h({terminatorItem:a,message:a,autoDestroy:!0},dojo.doc.createElement("div"));b.appendChild(c.domNode);c.startup();b.appendChild(dojo.create("div",{className:"logEntry",innerHTML:""}));var d=this;setTimeout(function(){d._scrollToEnd()},200);return c},onEnter:function(a){this.progressItem=this.createLogItem(a,this.getLoggingContainer());this.delegate.onConsoleEnter(this.console,a)},getLoggingContainer:function(){return this.logView.containerNode},log:function(a){c.destroyWidget(this.progressItem);
var b="";if(d.isString(a))b+=a.replace(/\n/g,"\x3cbr/\x3e");else if(d.isObject(a)||d.isArray(a))b+=JSON.stringify(a,null,!0);a=this.getLoggingContainer();a.appendChild(dojo.create("span",{innerHTML:"# "+this.console.getPrev()+" "}));for(var b=b.split("\x3cbr/\x3e"),e=0;e<b.length;e++)a.appendChild(dojo.create("div",{className:"logEntry",innerHTML:b[e]+""}));a.appendChild(dojo.create("hr",{}))},_fixHeight:function(){var a=b.getMarginBox(this.console.domNode),a=b.getMarginBox(this.domNode).h-a.h-22;
e.set(this.logView.domNode,{height:a+"px"})},resize:function(){this.inherited(arguments);this._fixHeight()},_scrollToEnd:function(){var a=$(this.getLoggingContainer());$(a).animate({scrollTop:$(a[0].lastChild.previousSibling).position().bottom},300)},onServerResponse:function(a,b){this.log(b);this._fixHeight();this._scrollToEnd()},createWidgets:function(){this.console=c.addWidget(f,{type:this.type,owner:this},this,this.domNode,!0,"consoleWidget ui-state-default");this._fixHeight()},getValue:function(){return this.editBox.get("value")},
startup:function(){this.inherited(arguments);this.createWidgets();l.subscribe(a.EVENTS.RESIZE,this.resize,this)}})})}}});
define("Shell/main","dojo/_base/lang dojo/_base/declare Shell/ShellManager xide/factory xide/types xide/model/Component".split(" "),function(f,d,g,b,e,h){d=d([h],{run:function(){var d=this.inherited(arguments);b.subscribe(e.EVENTS.ON_PLUGIN_READY,function(a){var b={};"Shell"===a.name&&(f.mixin(b,a),b.fileManager||(b.fileManager=xfile.getContext().getFileManager()),new g(b))},this);b.publish(e.EVENTS.ON_PLUGIN_LOADED,{name:"Shell"},this);return d}});require("Shell/ShellManager",function(b){});return d});
//# sourceMappingURL=main.js.map