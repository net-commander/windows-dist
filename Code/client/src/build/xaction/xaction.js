//>>built
require({cache:{"xaction/main":function(){define("xaction/types xaction/Action xaction/ActionContext xaction/ActionModel xaction/ActionProvider xaction/ActionStore xaction/DefaultActions xaction/Toolbar".split(" "),function(){})},"xaction/types":function(){define(["xide/types","dojo/_base/lang"],function(k,h){h.mixin(k.EVENTS,{ON_ACTION_CHANGE_CONTEXT:"onChangeActionContext",ON_ACTION_CONTEXT_CHANGED:"onActionContextChanged",REGISTER_ACTION:"registerAction",SET_ITEM_ACTIONS:"onSetItemsActions",ON_CLIPBOARD_COPY:"onClipboardCopy",
ON_CLIPBOARD_PASTE:"onClipboardPaste",ON_CLIPBOARD_CUT:"onClipboardCut",ON_RENDER_ACTIONS:"onRenderActions",ON_DID_ACTION:"onDidAction",ON_AFTER_ACTION:"onAfterAction"});k.ACTION={LAYOUT:"View/Layout",COLUMNS:"View/Columns",SELECTION:"File/Select",CLIPBOARD:"Edit/Clipboard",UNDO:"Edit/Undo",REDO:"Edit/Redo",CLIPBOARD_COPY:"Edit/Clipboard/Copy",CLIPBOARD_PASTE:"Edit/Clipboard/Paste",CLIPBOARD_CUT:"Edit/Clipboard/Cut",COPY:"File/Copy",MOVE:"File/Move",RENAME:"File/Rename",DELETE:"File/Delete",OPEN:"File/Open",
EDIT:"File/Edit",SAVE:"File/Save",SEARCH:"File/Search",TOOLBAR:"View/Show/Toolbar",STATUSBAR:"View/Show/Statusbar",BREADCRUMB:"View/Show/Breadcrumb",HEADER:"View/Show/Header",DOWNLOAD:"File/Download",DOWNLOAD_TO:"File/downloadTo",INFO:"File/Info",COMPRESS:"File/Compress",RELOAD:"File/Reload",UPLOAD:"File/Upload",PREVIEW:"File/Preview",OPEN_IN:"File/Open In",INSERT_IMAGE:"insertImage",COPY_PASTE:"copypaste",DND:"dnd",OPTIONS:"options",NEW_FILE:"File/New/New File",NEW_DIRECTORY:"File/New/New Folder",
GET_CONTENT:"get",SET_CONTENT:"set",FIND:"File/Find",CUSTOM:"custom",PERMA_LINK:"permaLink",ADD_MOUNT:"ADD_MOUNT",REMOVE_MOUNT:"REMOVE_MOUNT",EDIT_MOUNT:"EDIT_MOUNT",PERSPECTIVE:"PERSPECTIVE",RUN:"File/Run",GO_UP:"Navigation/Go Up",STOP:"File/Stop",CLOSE:"View/Close",FULLSCREEN:"View/Fullscreen",OPEN_IN_TAB:"File/OpenInNewTab",SOURCE:"Navigation/Source",RIBBON:"View/Show/Ribbon",MAIN_MENU:"View/Show/MainMenu",NAVIGATION:"View/Show/Navigation",BASH_CONSOLE:"File/Console/Bash",JS_CONSOLE:"File/Console/JS",
PHP_CONSOLE:"File/Console/PHP",CONSOLE:"File/Console/PHP",SIZE_STATS:"View/Show/SizeStats",WELCOME:"Window/Welcome",CONTEXT_MENU:"File/ContextMenu"};k.ACTION_TYPE={MULTI_TOGGLE:"multiToggle",SINGLE_TOGGLE:"singleToggle"};k.ACTION_ICON={CLIPBOARD_COPY:"fa-copy",CLIPBOARD_PASTE:"fa-paste",UPLOAD:"fa-upload",RENAME:"el-icon-edit",DELETE:"text-danger fa-remove",RELOAD:"fa-refresh",EDIT:"fa-pencil",SAVE:"fa-floppy-o",SEARCH:"fa-search",NEW_DIRECTORY:"fa-magic",NEW_FILE:"fa-magic",RUN:"text-success el-icon-play",
COMPRESS:"fa-file-archive-o",EXTRACT:"fa-folder-open",DOWNLOAD:"fa-download",GO_UP:"fa-level-up",TOOLBAR:"fa-bars",STATUSBAR:"fa-terminal",PREVIEW:"fa-eye",MAXIMIZE:"fa-arrows-alt",UNDO:"fa-undo",REDO:"fa-repeat"};return k})},"xaction/Action":function(){define("dcl/dcl xide/model/Base xide/types xide/utils/ObjectUtils xide/utils xide/mixins/EventedMixin".split(" "),function(k,h,g,m,l,q){l.mixin(g,{ACTION_VISIBILITY:{MAIN_MENU:"MAIN_MENU",CONTEXT_MENU:"CONTEXT_MENU",QUICK_LAUNCH:"QUICK_LAUNCH",ACTION_TOOLBAR:"ACTION_TOOLBAR",
PROPERTY_VIEW:"PROPERTY_VIEW",RIBBON:"RIBBON",widgetArgs:null,factory:function(){var a=arguments[1]||l.clone(g.ACTION_VISIBILITY),c=arguments;if(0<c[0].length&&_.isNumber(c[0][0])){var d=c[0],e=0;_.each(a,function(c,t){"function"!==typeof a[t]&&e<d.length&&(a[t+"_val"]=d[e]);e++})}if(_.isString(c[0][0])){if(!0===c[0][2])l.mixin(a[c[0][0]+"_val"],c[0][2]);else return a[c[0][0]+"_val"]=c[0][1],a;return c[1]}return a}}});g.ACTION_VISIBILITY_ALL="ACTION_VISIBILITY_ALL";var a=k([h.dcl,q.dcl],{declaredClass:"xaction/Action",
disabled:!1,enabled:!0,object:null,show:!0,group:"",types:"",command:null,icon:"fa-play",event:null,handler:null,tab:null,visibility_:null,value:null,setVisibility:function(){if(2==arguments.length&&_.isString(arguments[0])&&arguments[0]==g.ACTION_VISIBILITY_ALL){var a=arguments[1],c=g.ACTION_VISIBILITY,d=this;[c.MAIN_MENU,c.ACTION_TOOLBAR,c.CONTEXT_MENU,c.RIBBON].forEach(function(c){d.setVisibility(c,l.cloneKeys(a,!1))});return this}c=_.isArray(arguments[0])?arguments[0]:arguments;this.visibility_=
g.ACTION_VISIBILITY.factory(c,this.visibility_);return this},getVisibility:function(a){this.visibility_||this.setVisibility(g.ACTION_VISIBILITY_ALL,{});return this.visibility_?(null==this.visibility_[a+"_val"]&&(this.visibility_[a+"_val"]={vis:a}),this.visibility_[a+"_val"]):{}},shouldDestroyWidget:function(a,c,d){a=null!=this.getVisibility?this.getVisibility(a):null;var e=!0;a&&a.permanent&&(e=!(_.isFunction(a.permanent)?a.permanent(this,c,d):a.permanent));return e}});a.create=function(b,c,d,e,n,
t,f,I,x,v,D){b=new a({permanent:e,command:d,icon:c,label:b,owner:this,types:t,operation:n,group:f,handler:v,title:b});l.mixin(b,D);return b};a.createDefault=function(b,c,d,e,n,t){return a.create(b,c,d,!1,null,null,e||"nogroup",null,!1,n,t)};return a})},"xaction/ActionContext":function(){define(["dcl/dcl","xdojo/declare","xide/types","dojo/aspect","xide/views/History"],function(k,h,g,m,l){var q={currentActionEmitter:null,_history:null,isEmpty:function(){var a=this.getCurrentEmitter();return a?0==a.getActionStore().getAll().length:
!0},getCurrentEmitter:function(){return this.currentActionEmitter},_onRemoveEmitter:function(a){this._history.remove(a);var b=this._history.getNow();this.currentActionEmitter==a&&(this.currentActionEmitter=null);b&&this.setActionEmitter(b)},refreshActions:function(a){var b=this;_.each(a,function(a){b.renderAction?b.renderAction(a,null,null,null,null):console.error("renderAction not implemented for refresh actions "+b.declaredClass)})},setActionEmitter:function(a,b,c){if(!a||!a.getActionStore||a.getActionStore())if(this.currentActionEmitter==
a)a||this.setActionStore(null);else{try{var d=this.currentActionEmitter;if(d){if(d.getActionStore){var e=d.getActionStore();e&&(e._all=null);this.clearActions()}d&&d.onDeactivateActionContext&&d.onDeactivateActionContext(this,c)}}catch(n){logError(n,"setActionEmitter crash")}if(!a||a.getActionStore)if(this.currentActionEmitter=a){if(b=a.getActionStore())b.__all=null,a&&a.onUseActionStore&&a.onUseActionStore(b,a),this.setActionStore(b,a),b.addRenderer(this),a&&a.onActivateActionContext&&a.onActivateActionContext(this,
c),this._emit("setActionEmitter",{emitter:a}),!this._history&&(this._history=new l),this._history.setNow(a)}else this.setActionStore(null)}},_registerActionEmitter:function(a){if(!this[this.id+"_emitter_"+a.id]&&(this[this.id+"_emitter_"+a.id]=!0,!a||a.getActionStore)){if(!a||!a.on)return!1;var b=this;a._on("selectionChanged",function(c){c[b.id+"_aceDid"]=!0;b.setActionEmitter(a,"clear"==c.why?"selectionCleared":"selectionChanged",c)});a.on("click",function(c){if(!c.__did){var d=c.__did=!0;a.handleActionClick&&
(d=a.handleActionClick(c));d&&b.setActionEmitter(a,"click",c)}});!this._history&&(this._history=new l);a._on(g.EVENTS.ON_VIEW_SHOW,function(a){b._history.indexOf(a)&&(a.view&&(a=a.view),b.setActionEmitter(a,g.EVENTS.ON_VIEW_SHOW,a))})}},destroy:function(){this.inherited&&this.inherited(arguments);this._history&&this._history.destroy()&&delete this._history},addActionEmitter:function(a){if(a){var b=this;!this._history&&(this._history=new l);a.getActionStore&&(this._history.push(a),b._registerActionEmitter(a),
m.after(a,"destroy",function(){b._onRemoveEmitter(a)},!0),a._on("destroy",function(){try{b._onRemoveEmitter(a)}catch(c){logError(c,"addActionEmitter")}},!0))}}};h=h("xaction/ActionContext",null,q);h.dcl=k(null,q);return h})},"xaction/ActionModel":function(){define("dcl/dcl xaction/Action xide/data/Model xide/data/Source xide/model/Path xide/utils".split(" "),function(k,h,g,m,l,q){return k([h,g,m.dcl],{filterGroup:"item|view",keyboardMappings:null,bindWidgetProperties:["value","icon","disabled"],items:null,
onRemove:function(){_.invoke(this.getReferences(),"destroy");this.keyboardMappings&&_.invoke(this.keyboardMappings,"destroy");this.destroy()},shouldShow:function(){return!0},shouldDisable:function(){return!1},updateReference:function(a,b,c){b.set("disabled",this.shouldDisable(a,b,c));null!==this.icon&&null!==b.icon&&this.icon!==b.icon&&b.set("icon",this.icon);null!==this.value&&null!==b.value&&this.value!==b.value&&b.set("value",this.value)},refreshReferences:function(a,b){_.each(this.getReferences(),
function(c){c.set(a,b)},this)},refresh:function(a){this._emit("refresh",{action:this,selection:a});_.each(this.getReferences(),function(b){this.updateReference(a,b,b.visibility)},this)},setProperty:function(a,b,c){return this.set(a,b)},complete:function(){this.items=this.getChildren()},getParent:function(){var a=this.command.split("/");if(1<a.length)return this._store.getSync(a.slice(0,a.length-1).join("/"))},getParentCommand:function(){var a=this.command.split("/");if(1<a.length)return a.slice(0,
a.length-1).join("/")},getSegments:function(a){return a.split("/")},getRoot:function(){return this.command.split("/")[0]},getItemsAtBranch:function(a,b){return(new l(b)).getChildren(q.pluck(a,"command"),!1)},getChildren:function(){var a=this;return function(b){var c=[];_.each(b,function(b){c.push(a._store.getSync(b))});return c}(this.getItemsAtBranch(this._store.getAll(),this.command))},_onWidgetCreated:function(a){a.widget.addSource&&this.addReference(a.widget,{properties:{value:!0}},!0)}})})},"xaction/ActionProvider":function(){define("xdojo/declare dcl/dcl xide/types xide/utils xide/model/Path xaction/ActionStore xaction/Action xide/Keyboard xide/mixins/EventedMixin xaction/DefaultActions xide/lodash".split(" "),
function(k,h,g,m,l,q,a,b,c,d,e){var n={actionStore:null,actions:null,allowActionOverride:!0,sortGroups:function(a,f){return a=a.sort(function(a,t){return null!=f[a]&&null!=f[t]?f[t]-f[a]:100})},getItemsAtBranch:function(a,f){return(new l(f)).getChildren(e.map(a,"command"),!1)},refreshActions:function(){for(var a=this.getActions(),f=0;f<a.length;f++){var b=a[f];b.refresh&&b.refresh()}},getAction:function(a){return e.isString(a)?this.getActionStore().getSync(a):a},clearActions:function(){var a=this.getActionStore(),
f=a?a.query():[];e.each(f,function(f){f&&a.removeSync(f.command)});a&&a.setData([])},destroy:function(){this.clearActions();return this.inherited(arguments)},__createAction:function(t,f,c,x,v,d,n,e,p,k,y){x=x||g.ACTION_ICON[f];d={accelKey:d};m.mixin(d,y);t=a.createDefault(t,x,f,c,v,d);if(n){var h;this.keyboardMappings?h=this.keyboardMappings:t.keyboardMappings=h=[];v=b.defaultMapping(n,v,e||g.KEYBOARD_PROFILE.DEFAULT,p,k,[t]);v=this.registerKeyboardMapping(v);h.push(v);t.keyboardMappings=h}return t},
updateAction:function(a,f,b){if(a=a||this.getAction(a))a.set(f,b),setTimeout(function(){a.getReferences().forEach(function(a){a.set(f,b)})},100)},_completeActions:function(t){for(var f=[],b=this.getKeyTarget?this.getKeyTarget():null,c=0;c<t.length;c++){var d=t[c],n;d&&(d instanceof a?n=d:(n=this.__createAction(d.title,d.command,d.group,d.icon,d.handler,d.accelKey,d.keyCombo,d.keyProfile,b||d.keyTarget,d.keyScope,d.mixin),n.parameters=d),this._addAction(f,n))}this.keyboardMappings&&console.error("have mappings");
e.each(this.keyboardMappings,function(a){this.registerKeyboardMapping(a)},this);return f},createActionStore:function(){if(!this.actionStore){var a=this._completeActions(this.actions||[]);this.actionStore=new q({id:m.createUUID(),data:a,observedProperties:["value","icon","label"],tabOrder:this.tabOrder,groupOrder:this.groupOrder,tabSettings:this.tabSettings,menuOrder:this.menuOrder})}return this.actionStore},getActions:function(a,f){if(!a&&!1!==f&&this.__actions)return this.__actions;var b=a;a||(b=
{command:/\S+/});return this.__actions=this.getActionStore().query(b)},getActionStore:function(){return this.createActionStore()},postMixInProperties:function(){this.inherited&&this.inherited(arguments);this.createActionStore()},addActions:function(a){var f=this.getActionStore();f["subscribedToUpdates_"+this.id]||(f["subscribedToUpdates_"+this.id]=!0,this.addHandle("update",f.on("update",function(a){var b=a.target;if(!b._isCreating&&a.property&&b&&b.onChange)b.onChange(a.property,a.value,b)})));var b=
[];this._emit("onAddActions",{actions:a,permissions:this.permissions,store:f});this.allowActionOverride&&e.each(a,function(a){a&&(a=f.getSync(a.command))&&f.removeSync(a.command)});a=this._completeActions(a);e.each(a,function(a){this.allowActionOverride&&f.getSync(a.command)&&f.removeSync(a.command);a=f.putSync(a);b.push(a);a._isCreating=!0;a.onCreate&&a.onCreate(a);this._emit("onAddAction",a);a._isCreating=!1}.bind(this));return b},createActionShort:function(a,b,c,d,n){return this.createAction(e.extend({label:a,
command:b,icon:c,mixin:d&&d.mixin?d.mixin:n},d))},createAction2:function(a){var b=null,b=a.mixin||{},c=a.owner||b.owner||this,n=a.permissions||this.permissions||[],h=a.command,g=a.keycombo,r=a.label,k=a.icon,p=a.tab,l=a.group,y=a.filterGroup,q=a.onCreate,B=a.handler,E=a.container||this.domNode,z=a.shouldShow,A=a.shouldDisable;m.mixin(b,{owner:c,onChange:a.onChange});if(b.addPermission||d.hasAction(n,h))return B=B||d.defaultHandler,g&&(e.isString(g)&&(g=[g]),b.tooltip=g.join("\x3cbr/\x3e").toUpperCase()),
b=d.createAction(r,h,k,g,p,l,y,q,B,b,z,A,E||this.domNode),c&&b&&c.addAction&&c.addAction(null,b),b},createAction:function(a,b,c,n,g,h,r,k,p,l,y,q,B,E,z){if(1==arguments.length)return this.createAction2(arguments[0]);var A=null;l=l||{};m.mixin(l,{owner:z||this});if(l.addPermission||d.hasAction(B,b))return p||(p=function(a){this.runAction&&this.runAction.apply(this,[a])}),n&&e.isString(n)&&(n=[n]),A=d.createAction(a,b,c,n,g,h,r,k,p,l,y,q,E||this.domNode),z&&A&&z.addAction&&z.addAction(null,A),A},addAction:function(a,
b){var c=a||[],d=this._emit("addAction",b);if(!1===d)return!1;e.isObject(d)&&m.mixin(b,d);c.push(b);return!0},_addAction:function(a,b){var c=a||[],d=this._emit("addAction",b);if(!1===d)return!1;m.isObject(d)&&m.mixin(b,d);c.push(b);return!0},hasAction:function(a){return d.hasAction(this.permissions,a)}};k=k("xaction/ActionProvider",[c,b],n);k.dcl=h([c.dcl,b.dcl],n);return k})},"xaction/ActionStore":function(){define("xdojo/declare xide/data/TreeMemory xide/utils xide/data/ObservableStore dstore/Trackable xaction/ActionModel".split(" "),
function(k,h,g,m,l,q){function a(a,c,n,t,f){return(a||k)(c||[h,l,m],g.mixin({idProperty:"command",declaredClass:"xaction/ActionStore",Model:n||q,renderers:null,observedProperties:t||b,getAll:function(){return this.data},addRenderer:function(a){!this.renderers&&(this.renderers=[]);!_.contains(this.renderers,a)&&this.renderers.push(a)}},f))}var b=["value","icon","disabled","enabled"],c=a(null,null,null,null,null);c.createDefault=function(a){return new c(a)};c.createClass=a;c.DEFAULT_ACTION_PROPERTIES=
b;return c})},"xaction/DefaultActions":function(){define("dcl/dcl dcl/inherited xdojo/declare xide/types xide/utils xlang/i18".split(" "),function(k,h,g,m,l,q){function a(a,b){return _.contains(a,b)}function b(a,b,c){var d=null;this.onAfterAction&&(d=this.onAfterAction(c,a,b));this._emit&&this._emit("onAfterAction",{action:c,result:a,source:this,afterAction:d})}function c(a,c){var d,e=this;e&&e.onBeforeAction&&e.onBeforeAction(a);e.runAction?d=e.runAction.apply(e,[a,null,c]):a.handler&&(d=a.handler.apply(e,
[a,null,c]));d&&d.then?d.then(function(d){b.apply(e,[d,c,a])}):b.apply(e,[d,c,a]);return d}var d=g("xaction/DefaultActions",null,{});d.createActionParameters=function(a,b,c,d,e,g,h,l,k,p,m){return{title:a,command:b,group:c,icon:d,handler:e,accelKey:g,keyCombo:h,keyProfile:l,keyTarget:k,keyScope:p,mixin:m}};var e=function(a,b,c,e,g,h,k,r,m,p,q,y,G){e&&_.isString(e)&&(e=[e]);p=l.mixin({filterGroup:k||"item|view",tab:g||"File",onCreate:r||function(a){},shouldShow:q||function(){return!0},shouldDisable:y||
function(){return!1}},p);a=d.createActionParameters(a,b,h||"File",c,m||null,"",e,null,G,null,p);l.mixin(a,p);return a};d.createAction=e;d.hasAction=a;d.getDefaultActions=function(b,d,f){function g(a,b,c){return(a=a||d?d.getSelection():[])&&a.length?!1:!0}function h(a,b,c){return g.apply(this,arguments)?!0:(a=a||d?d.getSelection():[])&&!0===a[0].isDir?!0:!1}function k(g,h,m,p,q,u,v,w,x,C,D,H){var F=null;C=C||{};l.mixin(C,{owner:f||d});if(C.addPermission||a(b,h))if(x=x||c,F=e(g,h,m,p,q,u,v,w,x,C,D,
H,d.domNode))f&&f.addAction&&f.addAction(null,F),r.push(F)}var q=m.ACTION_VISIBILITY,r=[],u=m.ACTION,p=m.ACTION_ICON,w=f||d;a(b,u.CLIPBOARD)&&d.getClipboardActions&&(r.push(w.createAction({label:"Clipboard",command:"Edit/Clipboard",icon:"fa-clipboard",tab:"Edit",group:"Clipboard",mixin:{addPermission:!0,dynamic:!0,quick:!0},onCreate:function(a){a.setVisibility(q.RIBBON,{expand:!0,tab:"File"})}})),r=r.concat(d.getClipboardActions(k)));r.push(w.createAction({label:"Show",command:"View/Show",icon:"fa-eye",
tab:"View",group:"Show",mixin:{addPermission:!0,dynamic:!0},onCreate:function(a){a.setVisibility(q.RIBBON,{expand:!0})}}));a(b,u.LAYOUT)&&d.getRendererActions&&(r=r.concat(d.getRendererActions()));a(b,u.COLUMNS)&&d.getColumnHiderActions&&(r=r.concat(d.getColumnHiderActions(b)));r.push(w.createAction({label:"Edit",command:"File/Edit",icon:p.EDIT,tab:"Home",group:"Open",keycombo:["f4","enter","dblclick"],mixin:{quick:!0},shouldDisable:h}));r.push(w.createAction({label:"Delete",command:"File/Delete",
icon:p.DELETE,tab:"Home",group:"Organize",keycombo:["f8","delete"],mixin:{quick:!0},shouldDisable:g}));k("Rename","File/Rename","fa-edit",["f2"],"Home","Organize","item",null,null,null,null,g);r.push(w.createAction({label:"Reload",command:"File/Reload",icon:p.RELOAD,tab:"Home",group:"File",keycombo:["ctrl l"],mixin:{quick:!0}}));k("Create archive","File/Compress",p.COMPRESS,["ctrl z"],"Home","Organize","item|view",null,null,null,null,g);k("Extract","File/Extract",p.EXTRACT,["ctrl e"],"Home","File",
"item|view",null,null,null,null,function(){return!0});r.push(w.createAction({label:"Download",command:"File/Download",icon:p.DOWNLOAD,tab:"Home",group:"File",keycombo:["ctrl down"],mixin:{quick:!0}}));(a(b,u.NEW_DIRECTORY)||a(b,u.NEW_FILE))&&k("New","File/New","fa-magic",null,"Home","New","item|view",null,null,{},null,null);k("New Folder",u.NEW_DIRECTORY,"fa-folder",["f7"],"Home","New","item|view",null,null,{quick:!0},null,null);k("New File",u.NEW_FILE,"el-icon-file",["ctrl f4"],"Home","New","item|view",
null,null,{quick:!0},null,null);a(b,u.PREVIEW)&&r.push(w.createAction({label:"Preview",command:"File/Preview",icon:"fa-eye",tab:"Home",group:"Open",keycombo:["f3"],mixin:{quick:!0},shouldDisable:h}));a(b,u.SELECTION)&&(r.push(e("Select","File/Select","fa-hand-o-up",null,"Home","Select","item|view",function(a){a.setVisibility(q.RIBBON,{expand:!0})},null,null,null,null,d.domNode)),u={owner:f||d},p=d.domNode,r.push(e("Select all","File/Select/All","fa-th",["ctrl a"],"Home","Select","item|view",null,
function(){d.selectAll()},u,null,null,p)),r.push(e("Select none","File/Select/None","fa-square-o","ctrl d","Home","Select","item|view",null,function(){d.deselectAll()},u,null,null,p)),r.push(e("Invert selection","File/Select/Invert","fa-square",["ctrl i"],"Home","Select","item|view",null,function(){d.invertSelection()},u,null,null,p)));return r};d.defaultHandler=c;return d})},"xaction/Toolbar":function(){define("dcl/dcl xdojo/declare xide/utils xide/types xide/widgets/ActionToolbar xide/widgets/_Widget".split(" "),
function(k,h,g,m,l,q){var a={_toolbar:null,toolbarInitiallyHidden:!1,toolbarArgs:null,runAction:function(a){a.command===m.ACTION.TOOLBAR&&this.showToolbar(null==this._toolbar,null,null,this);return this.inherited(arguments)},getToolbar:function(){return this._toolbar},showToolbar:function(a,c,d,e){!a&&(a=null==this._toolbar);this._toolbar||(c=this.add(c||l,g.mixin({style:"height:auto;width:100%"},this.toolbarArgs),d||this.header,!0),g.resizeTo(c,this.header,!1,!0),c.addActionEmitter(e||this),c.setActionEmitter(e||
this),g.resizeTo(this.header,c,!0,!1),this._toolbar=c);!a&&this._toolbar&&g.destroy(this._toolbar,!0,this);this.resize()},startup:function(){var a=m.ACTION.TOOLBAR,c=_.contains(this.permissions,a);c&&this.showToolbar(c,null,null,this);var d=this,e=d.domNode.parentNode;this._on("onAddActions",function(c){!c.store.getSync(a)&&c.actions.push(d.createAction("Toolbar",a,m.ACTION_ICON.TOOLBAR,["ctrl b"],"View","Show","item|view",null,null,null,null,null,c.permissions,e,d))})}};h=h("xaction/Toolbar",q,a);
h.Implementation=a;h.dcl=k([q.dcl],a);return h})}}});define("xaction/xaction",["dojo","dijit","dojox"],function(k,h,g){});
//# sourceMappingURL=xaction.js.map