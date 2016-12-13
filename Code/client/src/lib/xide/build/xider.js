define('xide/types',[
    "dcl/dcl"
],function(dcl){
    return new dcl(null,{
        declaredClass:"xide/types"
    });
});
/** @module xide/types
 *  @description All the package's constants and enums in C style structures.
 */
define('xide/types/Types',[
    'dojo/_base/lang',
    'xide/types',
    'dojo/_base/json',
    'dojo/_base/kernel'
], function (lang, types, json, dojo) {
    /**
     * @TODO:
     * - apply xide/registry for types
     * - move mime handling to xfile
     * - remove ui types
     * - remove all other things which are part of ui or server only
     */
    /**
     * Custom CI Types, see ECITYPE enumeration. Each enum is mapped to a widget.
     */
    if (types['customTypes'] == null) {
        types['customTypes'] = {};
    }
    /**
     * ECTYPE_ENUM is mapped to and label-value option array
     */
    if (types['customEnumerations'] == null) {
        types['customEnumerations'] = {};
    }
    /**
     * The actual mapping of custom types to widget proto classes
     */
    if (types['widgetMappings'] == null) {
        types['widgetMappings'] = {};
    }
    /**
     * Mixes in new mime icons per ECITYPE & file extensions. Rendered by FontAwesome
     */
    if (types['customMimeIcons'] == null) {
        types['customMimeIcons'] = {};
    }

    /**
     * Public ECI_TYPE registry getter
     * @param type
     * @returns {*}
     */
    types.resolveType = function (type) {
        if (types['customTypes'][type]) {
            return types['customTypes'][type];
        }
        return null;
    };
    /**
     * Public ECI_TYPE registry setter
     * @param type
     * @param map
     */
    types.registerType = function (type, map) {
        types['customTypes'][type] = map;
    };
    /**
     * Public widget-type registry setter
     * @param type
     * @param map
     */
    types.registerWidgetMapping = function (type, map) {
        types['widgetMappings'][type] = map;
    };
    /**
     * Public custom enum registry setter
     * @param type
     * @param map
     */
    types.registerEnumeration = function (type, map) {
        types['customEnumerations'][type] = map;
    };
    /**
     * Public custom enumeration registry getter
     * @param type
     */
    types.resolveEnumeration = function (type) {
        if (types['customEnumerations'][type]) {
            return types['customEnumerations'][type];
        }
        return null;
    };
    /**
     * Public type-widget mapping registry setter
     * @param type
     */
    types.resolveWidgetMapping = function (type) {
        if (types['widgetMappings'][type]) {
            return types['widgetMappings'][type];
        }
        return null;
    };
    types.GRID_FEATURE = {
        KEYBOARD_NAVIGATION: 'KEYBOARD_NAVIGATION',
        KEYBOARD_SELECT: 'KEYBOARD_SELECT',
        SELECTION: 'SELECTION',
        ACTIONS: 'ACTIONS',
        CONTEXT_MENU: 'CONTEXT_MENU'
    };
    types.VIEW_FEATURE = {
        KEYBOARD_NAVIGATION: 'KEYBOARD_NAVIGATION',
        KEYBOARD_SELECT: 'KEYBOARD_SELECT',
        SELECTION: 'SELECTION',
        ACTIONS: 'ACTIONS',
        CONTEXT_MENU: 'CONTEXT_MENU'
    };
    types.KEYBOARD_PROFILE = {
        DEFAULT: {
            prevent_default: true,
            prevent_repeat: false
        },
        PASS_THROUGH: {
            prevent_default: false,
            prevent_repeat: false
        },
        SEQUENCE: {
            prevent_default: true,
            is_sequence: true,
            prevent_repeat: true
        }
    };
    /////////////////////////////////////////////////////////////////////////////
    //
    // CORE TYPES
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
     * A 'Configurable Information's ("CI") processing state during post or pre-processing.
     *
     * @enum {int} module:xide/types/CI_STATE
     * @memberOf module:xide/types
     */
    types.CI_STATE = {
        /**
         * Nothing done, could also mean there is nothing to do all
         * @constant
         * @type int
         */
        NONE: 0x00000000,
        /**
         * In pending state. At that time the compiler has accepted additional work and ci flag processing is queued
         * but not scheduled yet.
         * @constant
         * @type int
         */
        PENDING: 0x00000001,
        /**
         * The processing state.
         * @constant
         * @type int
         */
        PROCESSING: 0x00000002,
        /**
         * The CI has been processed but it failed.
         * @constant
         * @type int
         */
        FAILED: 0x00000004,
        /**
         * The CI was successfully processed.
         * @constant
         * @type int
         */
        SUCCESSED: 0x00000008,
        /**
         * The CI has been processed.
         * @constant
         * @type int
         */
        PROCESSED: 0x00000010,
        /**
         * The CI left the post/pre processor entirly but has not been accepted by the originating source.
         * This state can happen when the source became invalid and so its sort of orphan.
         * @constant
         * @type int
         */
        DEQUEUED: 0x00000020,
        /**
         * The CI fully resolved and no references except by the source are around.
         * @constant
         * @type int
         */
        SOLVED: 0x00000040,
        /**
         * Flag to mark the core's end of this bitmask, from here its user land
         * @constant
         * @type int
         */
        END: 0x00000080
    };
    /**
     * A 'Configurable Information's ("CI") type flags for post and pre-processing a value.
     * @enum {string} module:xide/types/CIFlag
     * @global CIFLAGS
     * @memberOf module:xide/types
     */

    types.CIFLAG = {
        /**
         * Instruct for no additional extra processing
         * @constant
         * @type int
         */
        NONE: 0x00000000,
        /**
         * Will instruct the pre/post processor to base-64 decode or encode
         * @constant
         * @type int
         */
        BASE_64: 0x00000001,
        /**
         * Post/Pre process the value with a user function
         * @constant
         * @type int
         */
        USE_FUNCTION: 0x00000002,
        /**
         * Replace variables with local scope's variables during the post/pre process
         * @constant
         * @type int
         */
        REPLACE_VARIABLES: 0x00000004,
        /**
         * Replace variables with local scope's variables during the post/pre process but evaluate the whole string
         * as Javascript
         * @constant
         * @type int
         */
        REPLACE_VARIABLES_EVALUATED: 0x00000008,
        /**
         * Will instruct the pre/post processor to escpape evaluated or replaced variables or expressions
         * @constant
         * @type int
         */
        ESCAPE: 0x00000010,
        /**
         * Will instruct the pre/post processor to replace block calls with oridinary vanilla script
         * @constant
         * @type int
         */
        REPLACE_BLOCK_CALLS: 0x00000020,
        /**
         * Will instruct the pre/post processor to remove variable delimitters/placeholders from the final string
         * @constant
         * @type int
         */
        REMOVE_DELIMTTERS: 0x00000040,
        /**
         * Will instruct the pre/post processor to remove   "[" ,"]" , "(" , ")" , "{", "}" , "*" , "+" , "."
         * @constant
         * @type int
         */
        ESCAPE_SPECIAL_CHARS: 0x00000080,
        /**
         * Will instruct the pre/post processor to use regular expressions over string substitution
         * @constant
         * @type int
         */
        USE_REGEX: 0x00000100,
        /**
         * Will instruct the pre/post processor to use Filtrex (custom bison parser, needs xexpression) over string substitution
         * @constant
         * @type int
         */
        USE_FILTREX: 0x00000200,
        /**
         * Cascade entry. There are cases where #USE_FUNCTION is not enough or we'd like to avoid further type checking.
         * @constant
         * @type int
         */
        CASCADE: 0x00000400,
        /**
         * Cascade entry. There are cases where #USE_FUNCTION is not enough or we'd like to avoid further type checking.
         * @constant
         * @type int
         */
        EXPRESSION: 0x00000800,
        /**
         * Dont parse anything
         * @constant
         * @type int
         */
        DONT_PARSE: 0x000001000,
        /**
         * Convert to hex
         * @constant
         * @type int
         */
        TO_HEX: 0x000002000,
        /**
         * Convert to hex
         * @constant
         * @type int
         */
        REPLACE_HEX: 0x000004000,
        /**
         * Wait for finish
         * @constant
         * @type int
         */
        WAIT: 0x000008000,
        /**
         * Wait for finish
         * @constant
         * @type int
         */
        DONT_ESCAPE: 0x000010000,
        /**
         * Flag to mark the maximum core bit mask, after here its user land
         * @constant
         * @type int
         */
        END: 0x000020000
    };
    /**
     * A CI's default post-pre processing order.
     *
     * @enum {string} module:xide/types/CI_STATE
     * @memberOf module:xide/types
     */
    types.CI_CORDER = {};
    /**
     * A 'Configurable Information's ("CI") type information. Every CI has this information. You can
     * re-composite new types with ECIType.STRUCTURE. However all 'beans' (rich objects) in the system all displayed through a set of CIs,
     * also called the CIS (Configurable Information Set). There are many types already :
     *
     * Each ECIType has mapped widgets, BOOL : checkbox, STRING: Text-Areay and so forth.
     *
     * @enum {string} module:xide/types/ECIType
     * @memberOf module:xide/types
     */
    types.ECIType = {
        /**
         * @const
         * @type { int}
         */
        BOOL: 0,
        /**
         * @const
         * @type { int}
         */
        BOX: 1,
        /**
         * @const
         * @type { int}
         */
        COLOUR: 2,
        /**
         * @const
         * @type { int}
         */
        ENUMERATION: 3,
        /**
         * @const
         * @type { int}
         */
        FILE: 4,
        /**
         * @const
         * @type { int}
         */
        FLAGS: 5,
        /**
         * @const
         * @type { int}
         */
        FLOAT: 6,
        /**
         * @const
         * @type { int}
         */
        INTEGER: 7,
        /**
         * @const
         * @type { int}
         */
        MATRIX: 8,
        /**
         * @const
         * @type { int}
         */
        OBJECT: 9,
        /**
         * @const
         * @type { int}
         */
        REFERENCE: 10,
        /**
         * @const
         * @type { int}
         */
        QUATERNION: 11,
        /**
         * @const
         * @type { int}
         */
        RECTANGLE: 12,
        /**
         * @const
         * @type { int}
         */
        STRING: 13,
        /**
         * @const
         * @type { int}
         */
        VECTOR: 14,
        /**
         * @const
         * @type { int}
         */
        VECTOR2D: 15,
        /**
         * @const
         * @type { int}
         */
        VECTOR4D: 16,
        /**
         * @const
         * @type { int}
         */
        ICON: 17,
        /**
         * @const
         * @type { int}
         */
        IMAGE: 18,
        /**
         * @const
         * @type { int}
         */
        BANNER: 19,
        /**
         * @const
         * @type { int}
         */
        LOGO: 20,
        /**
         * @const
         * @type { int}
         */
        STRUCTURE: 21,
        /**
         * @const
         * @type { int}
         */
        BANNER2: 22,
        /**
         * @const
         * @type { int}
         */
        ICON_SET: 23,
        /**
         * @const
         * @type { int}
         */
        SCRIPT: 24,
        /**
         * @const
         * @type { int}
         */
        EXPRESSION: 25,
        /**
         * @const
         * @type { int}
         */
        RICHTEXT: 26,
        /**
         * @const
         * @type { int}
         */
        ARGUMENT: 27,
        /**
         * @const
         * @type { int}
         */
        JSON_DATA: 28,
        /**
         * @const
         * @type { int}
         */
        EXPRESSION_EDITOR: 29,
        /**
         * @const
         * @type { int}
         */
        WIDGET_REFERENCE: 30,
        /**
         * @const
         * @type { int}
         */
        DOM_PROPERTIES: 31,

        /**
         * @const
         * @type { int}
         */
        BLOCK_REFERENCE: 32,

        /**
         * @const
         * @type { int}
         */
        BLOCK_SETTINGS: 33,
        /**
         * @const
         * @type { int}
         */
        FILE_EDITOR: 34,
        /**
         * @const
         * @type { int}
         */
        END: 35,
        /**
         * @const
         * @type { int}
         */
        UNKNOWN: -1
    };
    /**
     * Stub for registered bean types. This value is needed to let the UI switch between configurations per such type.
     * At the very root is the bean action context which may include more contexts.
     * @enum {string} module:xide/types/ITEM_TYPE
     * @memberOf module:xide/types
     */
    types.ITEM_TYPE = {
        /**
         * Bean type 'file' is handled by the xfile package
         * @constant
         */
        FILE: 'BTFILE',         //file object
        /**
         * Bean type 'widget' is handled by the xide/ve and davinci package
         * @constant
         */
        WIDGET: 'WIDGET',       //ui designer
        /**
         * Bean type 'block' is handled by the xblox package
         * @constant
         */
        BLOCK: 'BLOCK',         //xblox
        /**
         * Bean type 'text' is used for text editors
         * @constant
         */
        TEXT: 'TEXT',           //xace
        /**
         * Bean type 'xexpression' is used for user expressions
         * @constant
         */
        EXPRESSION: 'EXPRESSION'       //xexpression
    };

    /**
     * Expression Parser is a map of currently existing parsers
     * and might be extended by additional modules. Thus, it acts as registry
     * and is here as stub.
     *
     * @enum module:xide/types/EXPRESSION_PARSER
     * @memberOf module:xide/types
     */
    if (!types.EXPRESSION_PARSER) {
        types.EXPRESSION_PARSER = {};
    }
    /**
     * Component names stub, might be extended by sub-classing applications
     * @constant xide.types.COMPONENT_NAMES
     */
    types.COMPONENT_NAMES = {
        XIDEVE: 'xideve',
        XNODE: 'xnode',
        XBLOX: 'xblox',
        XFILE: 'xfile',
        XACE: 'xace',
        XEXPRESSION: 'xexpression',
        XCONSOLE: 'xconsole'
    };

    /**
     * WIDGET_REFERENCE_MODE enumerates possible modes to resolve a string expression
     * into instances. There are a few CI based widgets subclassed from xide/widgets/Referenced.
     * The reference structure consist out of this mode and that expression.
     *
     * @constant {Array.<module:xide/types~WidgetReferenceMode>}
     *     module:xide/types~WIDGET_REFERENCE_MODE
     */
    types.WIDGET_REFERENCE_MODE = {
        BY_ID: 'byid',
        BY_CLASS: 'byclass',
        BY_CSS: 'bycss',
        BY_EXPRESSION: 'expression'
    };
    /**
     * Possible split modes for rich editors with preview or live coding views.
     *
     * @constant {Array.<module:xide/types~ViewSplitMode>}
     *     module:xide/types~VIEW_SPLIT_MODE
     */
    types.VIEW_SPLIT_MODE = {
        DESIGN: 1,
        SOURCE: 2,
        SPLIT_VERTICAL: 6,
        SPLIT_HORIZONTAL: 7
    };

    /**
     * All client resources are through variables on the server side. Here the minimum variables for an xjs application.
     *
     * @constant {Array.<module:xide/types~RESOURCE_VARIABLES>}
     *     module:xide/types~RESOURCE_VARIABLES
     */
    types.RESOURCE_VARIABLES = {
        ACE: 'ACE',
        APP_URL: 'APP_URL',
        SITE_URL: 'SITE_URL'
    };
    /**
     * Events of xide.*
     * @enum {string} module:xide/types/EVENTS
     * @memberOf module:xide/types
     * @extends xide/types
     */
    types.EVENTS = {

        /**
         * generic
         */
        ERROR: 'onError',//xhr
        STATUS: 'onStatus',//xhr
        ON_CREATED_MANAGER: 'onCreatedManager',//context

        /**
         * item events, to be renoved
         */
        ON_ITEM_SELECTED: 'onItemSelected',
        ON_ITEM_REMOVED: 'onItemRemoved',
        ON_ITEM_CLOSED: 'onItemClosed',
        ON_ITEM_ADDED: 'onItemAdded',
        ON_ITEM_MODIFIED: 'onItemModified',
        ON_NODE_SERVICE_STORE_READY: 'onNodeServiceStoreReady',
        /**
         * old, to be removd
         */
        ON_FILE_STORE_READY: 'onFileStoreReady',
        ON_CONTEXT_MENU_OPEN: 'onContextMenuOpen',
        /**
         * CI events
         */
        ON_CI_UPDATE: 'onCIUpdate',

        /**
         * widgets
         */
        ON_WIDGET_READY: 'onWidgetReady',
        ON_CREATED_WIDGET: 'onWidgetCreated',
        RESIZE: 'onResize',
        /**
         * Event to notify classes about a reloaded module
         * @constant
         * @type string
         */
        ON_MODULE_RELOADED: 'onModuleReloaded',
        ON_MODULE_UPDATED: 'onModuleUpdated',


        ON_DID_OPEN_ITEM: 'onDidOpenItem',//remove
        ON_DID_RENDER_COLLECTION: 'onDidRenderCollection',//move

        ON_PLUGIN_LOADED: 'onPluginLoaded',
        ON_PLUGIN_READY: 'onPluginReady',
        ALL_PLUGINS_READY: 'onAllPluginsReady',

        /**
         * editors
         */
        ON_CREATE_EDITOR_BEGIN: 'onCreateEditorBegin',//move to xedit
        ON_CREATE_EDITOR_END: 'onCreateEditorEnd',//move to xedit
        REGISTER_EDITOR: 'registerEditor',//move to xedit
        ON_EXPRESSION_EDITOR_ADD_FUNCTIONS: 'onExpressionEditorAddFunctions',//move to xedit
        ON_ACE_READY: 'onACEReady',//remove

        /**
         * Files
         */
        ON_UNSAVED_CONTENT: 'onUnSavedContent',
        ON_FILE_CHANGED: 'fileChanged',
        ON_FILE_DELETED: 'fileDeleted',
        IMAGE_LOADED: 'imageLoaded',
        IMAGE_ERROR: 'imageError',
        UPLOAD_BEGIN: 'uploadBegin',
        UPLOAD_PROGRESS: 'uploadProgress',
        UPLOAD_FINISH: 'uploadFinish',
        UPLOAD_FAILED: 'uploadFailed',
        ON_FILE_CONTENT_CHANGED: 'onFileContentChanged',
        ON_COPY_BEGIN: 'onCopyBegin',
        ON_COPY_END: 'onCopyEnd',
        ON_DELETE_BEGIN: 'onDeleteBegin',
        ON_DELETE_END: 'onDeleteEnd',
        ON_MOVE_BEGIN: 'onMoveBegin',
        ON_MOVE_END: 'onMoveEnd',
        ON_CHANGED_CONTENT: 'onChangedContent',
        ON_COMPRESS_BEGIN: 'onCompressBegin',
        ON_COMPRESS_END: 'onCompressEnd',



        ON_COMPONENT_READY: 'onComponentReady',
        ON_ALL_COMPONENTS_LOADED: 'onAllComponentsLoaded',
        ON_APP_READY: 'onAppReady',
        /**
         * Store
         */
        ON_CREATE_STORE: 'onCreateStore',
        ON_STORE_CREATED: 'onStoreCreated',
        ON_STORE_CHANGED: 'onStoreChanged',
        ON_STATUS_MESSAGE: 'onStatusMessage',
        /**
         * layout
         */
        SAVE_LAYOUT: 'layoutSave',
        RESTORE_LAYOUT: 'layoutRestore',
        /**
         * views, panels and 'main view'
         */
        ON_SHOW_PANEL: 'onShowPanel',
        ON_PANEL_CLOSED: 'onPanelClosed',
        ON_PANEL_CREATED: 'onPanelCreated',

        ON_MAIN_VIEW_READY: 'onMainViewReady',
        ON_MAIN_MENU_READY: 'onMainMenuReady',
        ON_MAIN_MENU_OPEN: 'onMainMenuOpen',
        ON_VIEW_REMOVED: 'onViewRemoved',
        ON_VIEW_SHOW: 'onViewShow',
        ON_VIEW_HIDE: 'onViewHide',
        ON_VIEW_ADDED: 'onViewAdded',
        ON_OPEN_VIEW: 'onOpenView',
        ON_VIEW_MAXIMIZE_START: 'onViewMaximizeStart',
        ON_VIEW_MAXIMIZE_END: 'onViewMaximizeEnd',
        ON_CONTAINER_ADDED: 'onContainerAdded',
        ON_CONTAINER_REMOVED: 'onContainerRemoved',
        ON_REMOVE_CONTAINER: 'onRemoveContainer',
        ON_CONTAINER_REPLACED: 'onContainerReplaced',
        ON_CONTAINER_SPLIT: 'onContainerSplit'
    };
    /**
     * To be moved
     * @type {{SIZE_NORMAL: string, SIZE_SMALL: string, SIZE_WIDE: string, SIZE_LARGE: string}}
     */
    types.DIALOG_SIZE = {
        SIZE_NORMAL: 'size-normal',
        SIZE_SMALL: 'size-small',
        SIZE_WIDE: 'size-wide',    // size-wide is equal to modal-lg
        SIZE_LARGE: 'size-large'
    };

    /**
     * To be moved
     * @type {{DEFAULT: string, INFO: string, PRIMARY: string, SUCCESS: string, WARNING: string, DANGER: string}}
     */
    types.DIALOG_TYPE = {
        DEFAULT: 'type-default',
        INFO: 'type-info',
        PRIMARY: 'type-primary',
        SUCCESS: 'type-success',
        WARNING: 'type-warning',
        DANGER: 'type-danger'
    };
    /**
     * @TODO: remove, defined in xideve
     */
    lang.mixin(types, {
        LAYOUT_RIGHT_CENTER_BOTTOM: 'LAYOUT_RIGHT_CENTER_BOTTOM',
        LAYOUT_CENTER_BOTTOM: 'LAYOUT_CENTER_BOTTOM',
        LAYOUT_CENTER_RIGHT: 'LAYOUT_CENTER_RIGHT',
        LAYOUT_LEFT_CENTER_RIGHT: 'LAYOUT_LEFT_CENTER_RIGHT',
        LAYOUT_LEFT_CENTER_RIGHT_BOTTOM: 'LAYOUT_LEFT_CENTER_RIGHT_BOTTOM'
    });

    /**
     * Hard Dojo override to catch malformed JSON.
     * @param js
     * @returns {*}
     */
    dojo.fromJson = function (js, debug) {
        var res = null;
        var didFail = false;
        debug = true;
        try {
            res = eval("(" + js + ")");
        } catch (e) {
            didFail = true;
        }

        if (didFail) {
            var js2 = js.substring(js.indexOf('{'), js.lastIndexOf('}') + 1);
            try {
                js2 && (res = eval("(" + js2 + ")"));
            } catch (e) {
                debug !== false && console.error('error in json parsing! ' + js);
                if (js.indexOf('error') !== -1) {
                    return {
                        "jsonrpc": "2.0",
                        "result": {
                            "error": {
                                "code": 1,
                                "message": js,
                                "data": null
                            }
                        }, "id": 0
                    };
                }
                throw new Error(js);
            }
        }
        return res;
    };
    return types;
});
define('xide/utils',[
    "dcl/dcl"
], function (dcl) {
    return dcl(null, {
        declaredClass:"xide.utils"
    });
});
/** @module xide/lodash **/
define('xide/lodash',[],function(){
    /**
     * temp. wanna be shim for lodash til dojo-2/loader lands here
     */
    if(typeof _ !=="undefined"){
        return _;
    }
});

/** @module xide/utils/StringUtils
 *  @description All string related functions
 */
define('xide/utils/StringUtils',[
    'xide/utils',
    'xide/types',
    'dojo/json',
    'xide/lodash'
], function (utils, types, json, _) {
    "use strict";

    /**
     *
     * @param replacer
     * @param cycleReplacer
     * @returns {Function}
     */
    function serializer(replacer, cycleReplacer) {
        var stack = [], keys = [];

        if (cycleReplacer == null) cycleReplacer = function (key, value) {
            if (stack[0] === value) return "[Circular ~]";
            return "[Circular ~." + keys.slice(0, stack.indexOf(value)).join(".") + "]"
        };

        return function (key, value) {
            if (stack.length > 0) {
                var thisPos = stack.indexOf(this);
                ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
                ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
                if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value)
            }
            else stack.push(value);

            return replacer == null ? value : replacer.call(this, key, value)
        }
    }

    /**
     *
     * @param obj
     * @returns {*}
     */
    utils.stringify = function (obj) {
        return JSON.stringify(obj, serializer(), 2);
    };

    function stringify(obj, replacer, spaces, cycleReplacer) {
        return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces)
    }

    /**
     * Takes a number and returns a rounded fixed digit string.
     * Returns an empty string if first parameter is NaN, (-)Infinity or not of type number.
     * If parameter trailing is set to true trailing zeros will be kept.
     *
     * @param {number} num the number
     * @param {number} [digits=3] digit count
     * @param {boolean} [trailing=false] keep trailing zeros
     * @memberOf module:xide/utils/StringUtils
     *
     * @example
     *
     test(fsuxx(-6.8999999999999995), '-6.9');
     test(fsuxx(0.020000000000000004), '0.02');
     test(fsuxx(0.199000000000000004), '0.199');
     test(fsuxx(0.199000000000000004, 2), '0.2');
     test(fsuxx(0.199000000000000004, 1), '0.2');
     test(fsuxx(0.199000000000000004, 2, true), '0.20');
     test(fsuxx('muh'), '');
     test(fsuxx(false), '');
     test(fsuxx(null), '');
     test(fsuxx(), '');
     test(fsuxx(NaN), '');
     test(fsuxx(Infinity), '');
     test(fsuxx({bla: 'blub'}), '');
     test(fsuxx([1,2,3]), '');
     test(fsuxx(6.8999999999999995), '6.9');
     test(fsuxx(0.199000000000000004), '0.199');
     test(fsuxx(0.199000000000000004, 2), '0.2');
     test(fsuxx(0.199000000000000004, 2, true), '0.20');
     *
     *
     * @returns {string}
     *
     */
    utils.round = function (num, digits, trailing) {

        if (typeof num !== 'number' || isNaN(num) || num === Infinity || num === -Infinity) return '';

        digits = ((typeof digits === 'undefined') ? 3 : (parseInt(digits, 10) || 0));

        var f = Math.pow(10, digits);
        var res = (Math.round(num * f) / f).toFixed(digits);

        // remove trailing zeros and cast back to string
        if (!trailing) res = '' + (+res);

        return res;
    };




    /**
     *
     * @param bytes
     * @param si
     * @returns {string}
     */
    utils.humanFileSize = function (bytes, si) {
        var thresh = si ? 1000 : 1024;
        if (Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }
        var units = si
            ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
        var u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while (Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1) + ' ' + units[u];
    };

    if (typeof String.prototype.startsWith != 'function') {
        // see below for better implementation!
        String.prototype.startsWith = function (str) {
            return this.indexOf(str) === 0;
        };
    }

    if ( typeof String.prototype.endsWith != 'function' ) {
        String.prototype.endsWith = function( str ) {
            return this.substring( this.length - str.length, this.length ) === str;
        }
    }

    /**
     *
     * @param str
     * @returns {boolean}
     */
    utils.isNativeEvent = function (str) {
        var _foo = null,//just for having an optimized object map for a native event lookup below
            _nativeEvents = {
                "onclick": _foo,
                "ondblclick": _foo,
                "onmousedown": _foo,
                "onmouseup": _foo,
                "onmouseover": _foo,
                "onmousemove": _foo,
                "onmouseout": _foo,
                "onkeypress": _foo,
                "onkeydown": _foo,
                "onkeyup": _foo,
                "onfocus": _foo,
                "onblur": _foo,
                "onchange": _foo
            };

        if (str in _nativeEvents) {
            return true;
        }
        _nativeEvents = {
            "click": _foo,
            "dblclick": _foo,
            "mousedown": _foo,
            "mouseup": _foo,
            "mouseover": _foo,
            "mousemove": _foo,
            "mouseout": _foo,
            "keypress": _foo,
            "keydown": _foo,
            "keyup": _foo,
            "focus": _foo,
            "blur": _foo,
            "change": _foo
        };

        return str in _nativeEvents;

    };
    /**
     *
     * @param str
     * @returns {boolean}
     *
     * @memberOf module:xide/utils/StringUtils
     */
    utils.isSystemEvent = function (str) {
        for (var t in types.EVENTS) {
            if (types.EVENTS[t] === str) {
                return true;
            }
        }
        return false;
    };

    /**
     *
     * @param arr
     * @param val
     * @returns {number}
     * @memberOf module:xide/utils/StringUtils
     */
    utils.contains = function (arr, val) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === val) {
                return i;
            }
        }
        return -1;
    };
    /**
     *
     * @param obj
     * @param val
     * @returns {*}
     * @memberOf module:xide/utils/StringUtils
     */
    utils.getObjectKeyByValue = function (obj, val) {
        if (obj && val) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    if (obj[prop] === val)
                        return prop;
                }
            }
        }
        return null;
    };

    /**
     *
     * @param url
     * @param parameter
     * @returns {*}
     * @memberOf module:xide/utils/StringUtils
     */
    utils.removeURLParameter = function (url, parameter) {
        //prefer to use l.search if you have a location/link object
        var urlparts = url.split('?');
        if (urlparts.length >= 2) {

            var prefix = encodeURIComponent(parameter) + '=';
            var pars = urlparts[1].split(/[&;]/g);

            //reverse iteration as may be destructive
            for (var i = pars.length; i-- > 0;) {
                //idiom for string.startsWith
                if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                    pars.splice(i, 1);
                }
            }

            url = urlparts[0] + '?' + pars.join('&');
            return url;
        } else {
            return url;
        }
    };

    /**
     *
     * @param url
     * @param paramName
     * @param paramValue
     * @returns {*}
     * @memberOf module:xide/utils/StringUtils
     */
    utils.replaceUrlParam = function (url, paramName, paramValue) {
        if (url.indexOf(paramName) == -1) {
            url += (url.indexOf('?') > 0 ? '&' : '?') + paramName + '=' + paramValue;
            return url;
        }
        var pattern = new RegExp('(' + paramName + '=).*?(&|$)');
        var newUrl = url.replace(pattern, '$1' + paramValue + '$2');
        if (newUrl == url) {
            newUrl = newUrl + (newUrl.indexOf('?') > 0 ? '&' : '?') + paramName + '=' + paramValue
        }
        return newUrl
    };

    /**
     *
     * @param mount
     * @param path
     * @param encode
     * @returns {string}
     * @memberOf module:xide/utils/StringUtils
     */
    utils.buildPath = function (mount, path, encode) {

        //fix mount
        var _mount = '' + mount;
        _mount = utils.replaceAll('/', '', mount);
        var _path = '' + path;
        _path = _path.replace('./', '/').replace(/^\/|\/$/g, '');

        var _res = _mount + '://' + _path;
        if (encode === true) {
            return encodeURIComponent(_res);
        }
        return _res;
    };

    /**
     *
     * @param string
     * @returns {boolean}
     * @memberOf module:xide/utils/StringUtils
     *
     */
    utils.isImage = function (string) {
        return string.toLowerCase().match(/\.(jpeg|jpg|gif|png)$/) != null;
    };

    /**
     *
     * @param field
     * @param enumValue
     * @returns {boolean}
     * @memberOf module:xide/utils/StringUtils
     */
    utils.hasFlag3 = function (field, enumValue) {
        //noinspection JSBitwiseOperatorUsage,JSBitwiseOperatorUsage,JSBitwiseOperatorUsage,JSBitwiseOperatorUsage,JSBitwiseOperatorUsage,JSBitwiseOperatorUsage,JSBitwiseOperatorUsage,JSBitwiseOperatorUsage
        return ((1 << enumValue) & field) ? true : false;
    };

    /**
     *
     * @param field
     * @param enumValue
     * @returns {boolean}
     * @memberOf module:xide/utils/StringUtils
     */
    utils.hasFlag = function (field, enumValue) {
        //noinspection JSBitwiseOperatorUsage,JSBitwiseOperatorUsage
        return ((1 << enumValue) & field) ? true : false;
    };

    /**
     *
     * @param enumValue
     * @param field
     * @returns {int|*}
     * @memberOf module:xide/utils/StringUtils
     */
    utils.disableFlag = function (enumValue, field) {
        enumValue &= ~(1 << field);
        return enumValue;
    };
    /**
     * XApp specific url string cleaner
     * @param string
     * @returns {*}
     */
    utils.cleanUrl = function (string) {
        if (string) {
            string = string.replace('//', '/');
            string = string.replace('./', '/');
            string = string.replace('http:/', 'http://');
            string = string.replace('./', '/');
            string = string.replace('////', '/');
            string = string.replace('///', '/');
            return string;
        }
        return string;
    };
    /**
     * Return data from JSON
     * @param inData
     * @param validOnly
     * @param imit
     * @memberOf module:xide/utils/StringUtils
     * @returns {*}
     */
    utils.getJson = function (inData, validOnly, ommit) {
        try {
            return _.isString(inData) ? json.parse(inData, false) : validOnly === true ? null : inData;
        } catch (e) {
            ommit !== false && console.error('error parsing json data ' + inData + ' error = ' + e);
        }
        return null;
    };

    /**
     * Hard Dojo override to catch malformed JSON.
     * @param js
     * @returns {*}
     * @memberOf module:xide/utils/StringUtils
     */
    utils.fromJson = function (js) {
        if (!_.isString(js)) {
            return js;
        }
        var res = null;
        var didFail = false;
        try {
            res = eval("(" + js + ")", {});
        } catch (e) {
            didFail = true;
        }
        if (didFail) {
            js = js.substring(js.indexOf('{'), js.lastIndexOf('}') + 1);
            try {
                res = eval("(" + js + ")", {});
            } catch (e) {
                throw new Error(js);
            }
        }
        return res;
    };

    /**
     * String Replace which works with multiple found items. Native aborts on the first needle.
     * @param find
     * @param replace
     * @param str
     * @returns {string}
     * @memberOf module:xide/utils/StringUtils
     */
    utils.replaceAll = function (find, replace, str) {
        return str ? str.split(find).join(replace) : '';
    };

    /**
     * CI compatible string check for null and length>0
     * @param input
     * @returns {boolean}
     * @memberOf module:xide/utils/StringUtils
     */
    utils.isValidString = function (input) {
        return input != null && input.length != null && input.length > 0 && input != "undefined"; //Boolean
    };

    /**
     * Dojo style template replacer
     * @param template
     * @param obj
     * @returns {*}
     * @memberOf module:xide/utils/StringUtils
     */
    utils.substituteString = function (template, obj) {
        return template.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function (match, key) {
            return obj[key];
        });
    };

    /**
     *
     * @param expression
     * @param delimiters
     * @returns {*}
     * @private
     * @memberOf module:xide/utils/StringUtils
     */
    utils.findOcurrences = function (expression, delimiters) {
        var d = {
            begin: utils.escapeRegExp(delimiters.begin),
            end: utils.escapeRegExp(delimiters.end)
        };
        return expression.match(new RegExp(d.begin + "([^" + d.end + "]*)" + d.end, 'g'));
    };

    /**
     * Escape regular expressions in a string
     * @param string
     * @returns {*}
     * @private
     * @memberOf module:xide/utils/StringUtils
     */
    utils.escapeRegExp = function (string) {
        var special = ["[", "]", "(", ")", "{", "}", "*", "+", ".", "|", "||"];
        for (var n = 0; n < special.length; n++) {
            string = string.replace(special[n], "\\" + special[n]);
        }

        return string;
    };
    /**
     *
     * @param str {string} haystack
     * @param hash {Object}
     * @returns {string}
     * @memberOf module:xide/utils/StringUtils
     */
    utils.multipleReplace = function (str, hash) {
        //to array
        var a = [];
        for (var key in hash) {
            a[a.length] = key;
        }
        return str.replace(new RegExp(a.join('\\b|\\b'), 'g'), function (m) {
            return hash[m] || hash["\\" + m];
        });
    };

    /**
     * Flexible replacer, supports multiple replace and safe replace
     *
     * @param str {string} the haystack

     * @param needle {string|null} optional, only needed for simple cases, otherwise its using the 'what' map
     *
     * @param what {string|Object}. When string, its replacing 'needle' with 'what'. If its a hash-map:
     * variable:value, its replacing occurrences of all variables in 'haystack'. In such case, you can specify
     * delimiters to make sure that 'unresolved' variables will be stripped of in the result.
     *
     * @param delimiters {Object} Delimiters to identify variables. This is used to eliminate unresolved variables from
     * the result.
     *
     * @param delimiters.begin {string}
     * @param delimiters.end {string}
     *
     * @returns {string}
     *
     *
     * @example:
     *
     * 1. simple case: replace all '/' with ''
     *
     * return utils.replace('/foo/','/','') //returns 'foo'
     *
     * 2. simple case with multiple variables:
     *
     * return utils.replace('darling, i miss you so much',null,{'miss':'kiss','much':'little'})
     * # darling, i kiss you so little
     *
     * @memberOf module:xide/utils
     * @extends xide/utils
     */
    utils.replace = function (str, needle, what, delimiters) {
        if (!str) {
            return '';
        }
        if (what && _.isObject(what) || _.isArray(what)) {
            if (delimiters) {
                var ocurr = utils.findOcurrences(str, delimiters),
                    replaceAll = utils.replaceAll;
                if (ocurr) {

                    for (var i = 0, j = ocurr.length; i < j; i++) {
                        var el = ocurr[i];

                        //strip off delimiters
                        var _variableName = replaceAll(delimiters.begin, '', el);
                        _variableName = replaceAll(delimiters.end, '', _variableName);
                        str = replaceAll(el, what[_variableName], str);
                    }
                } else {
                    return str;
                }
            } else {
                //fast case
                return utils.multipleReplace(str, what)
            }
            return str;
        }
        //fast case
        return utils.replaceAll(needle, what, str);
    };

    /**
     * Capitalize
     * @param word
     * @returns {string}
     * @memberOf module:xide/utils/StringUtils
     */
    utils.capitalize = function (word) {
        return word.substring(0, 1).toUpperCase() + word.substring(1);
    };

    /**
     * vsprintf impl. of PHP
     * @param format
     * @param args
     * @example
     // example 1: vsprintf('%04d-%02d-%02d', [1988, 8, 1]);
     // returns 1: '1988-08-01'
     * @memberOf module:xide/utils/StringUtils
     */
    utils.vsprintf = function (format, args) {
        return utils.sprintf.apply(this, [format].concat(args));
    };
    /**
     * PHP.js version of sprintf
     * @returns {string}
     * @memberOf module:xide/utils/StringUtils
     * @link http://kevin.vanzonneveld.net
     */
    utils.sprintf = function () {
        var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
        var a = arguments,
            i = 0,
            format = a[i++];

        // pad()
        var pad = function (str, len, chr, leftJustify) {
            if (!chr) {
                chr = ' ';
            }
            var padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).join(chr);
            return leftJustify ? str + padding : padding + str;
        };

        // justify()
        var justify = function (value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
            var diff = minWidth - value.length;
            if (diff > 0) {
                if (leftJustify || !zeroPad) {
                    value = pad(value, minWidth, customPadChar, leftJustify);
                } else {
                    value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
                }
            }
            return value;
        };

        // formatBaseX()
        var formatBaseX = function (value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
            // Note: casts negative numbers to positive ones
            var number = value >>> 0;
            prefix = prefix && number && {
                    '2': '0b',
                    '8': '0',
                    '16': '0x'
                }[base] || '';
            value = prefix + pad(number.toString(base), precision || 0, '0', false);
            return justify(value, prefix, leftJustify, minWidth, zeroPad);
        };

        // formatString()
        var formatString = function (value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
            if (precision != null) {
                value = value.slice(0, precision);
            }
            return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
        };

        // doFormat()
        var doFormat = function (substring, valueIndex, flags, minWidth, _, precision, type) {
            var number;
            var prefix;
            var method;
            var textTransform;
            var value;

            if (substring === '%%') {
                return '%';
            }

            // parse flags
            var leftJustify = false,
                positivePrefix = '',
                zeroPad = false,
                prefixBaseX = false,
                customPadChar = ' ';
            var flagsl = flags.length;
            for (var j = 0; flags && j < flagsl; j++) {
                switch (flags.charAt(j)) {
                    case ' ':
                        positivePrefix = ' ';
                        break;
                    case '+':
                        positivePrefix = '+';
                        break;
                    case '-':
                        leftJustify = true;
                        break;
                    case "'":
                        customPadChar = flags.charAt(j + 1);
                        break;
                    case '0':
                        zeroPad = true;
                        break;
                    case '#':
                        prefixBaseX = true;
                        break;
                }
            }

            // parameters may be null, undefined, empty-string or real valued
            // we want to ignore null, undefined and empty-string values
            if (!minWidth) {
                minWidth = 0;
            } else if (minWidth === '*') {
                minWidth = +a[i++];
            } else if (minWidth.charAt(0) == '*') {
                minWidth = +a[minWidth.slice(1, -1)];
            } else {
                minWidth = +minWidth;
            }

            // Note: undocumented perl feature:
            if (minWidth < 0) {
                minWidth = -minWidth;
                leftJustify = true;
            }

            if (!isFinite(minWidth)) {
                throw new Error('sprintf: (minimum-)width must be finite');
            }

            if (!precision) {
                precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type === 'd') ? 0 : undefined;
            } else if (precision === '*') {
                precision = +a[i++];
            } else if (precision.charAt(0) == '*') {
                precision = +a[precision.slice(1, -1)];
            } else {
                precision = +precision;
            }

            // grab value using valueIndex if required?
            value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

            switch (type) {
                case 's':
                    return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
                case 'c':
                    return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
                case 'b':
                    return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'o':
                    return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'x':
                    return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'X':
                    return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
                case 'u':
                    return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'i':
                case 'd':
                    number = +value || 0;
                    number = Math.round(number - number % 1); // Plain Math.round doesn't just truncate
                    prefix = number < 0 ? '-' : positivePrefix;
                    value = prefix + pad(String(Math.abs(number)), precision, '0', false);
                    return justify(value, prefix, leftJustify, minWidth, zeroPad);
                case 'e':
                case 'E':
                case 'f': // Should handle locales (as per setlocale)
                case 'F':
                case 'g':
                case 'G':
                    number = +value;
                    prefix = number < 0 ? '-' : positivePrefix;
                    method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
                    textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
                    value = prefix + Math.abs(number)[method](precision);
                    return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
                default:
                    return substring;
            }
        };

        return format.replace(regex, doFormat);
    };
    /***
     *
     * @param str
     * @returns {string | null}
     * @memberOf module:xide/utils/StringUtils
     */
    utils.cleanString = function (str) {
        if (!str) {
            return null;
        }
        str = str.replace(/[\r]/g, '')
            .replace(/[\b]/g, '')
            .replace(/[\f]/g, '')
            .replace(/[\n]/g, '')
            .replace(/\\/g, '');
        return str;
    };
    /***
     *
     * @param str {string}
     * @returns {string | null}
     */
    utils.normalizePath = function (str) {
        if (!str) {
            return null;
        }
        str = utils.cleanString(str);//control characters
        str = str.replace('./', '');//file store specifics
        str = str.replace('/.', '');//file store specifics
        str = str.replace(/([^:]\/)\/+/g, "$1");//double slashes
        return str;
    };

    /**
     *
     * @enum
     * @global
     * @memberOf module:xide/types
     */
    types.PATH_PARTS = {
        'DIRNAME': 1,
        'BASENAME': 2,
        'EXTENSION': 4,
        'FILENAME': 8,
        'PATHINFO_ALL': 0
    };
    /**
     * PHP.js version of basename
     * @param path {string}
     * @param suffix {string}
     * @example
     //   example 1: basename('/www/site/home.htm', '.htm');
     //   returns 1: 'home'
     //   example 2: basename('ecra.php?p=1');
     //   returns 2: 'ecra.php?p=1'
     //   example 3: basename('/some/path/');
     //   returns 3: 'path'
     //   example 4: basename('/some/path_ext.ext/','.ext');
     //   returns 4: 'path_ext'
     * @returns {*}
     * @memberOf module:xide/utils/StringUtils
     * @link http://phpjs.org/functions/basename/
     */
    utils.basename = function (path, suffix) {
        var b = path;
        var lastChar = b.charAt(b.length - 1);

        if (lastChar === '/' || lastChar === '\\') {
            b = b.slice(0, -1);
        }

        b = b.replace(/^.*[\/\\]/g, '');

        if (typeof suffix === 'string' && b.substr(b.length - suffix.length) == suffix) {
            b = b.substr(0, b.length - suffix.length);
        }
        return b;
    };

    /**
     *
     * @param path
     * @param options
     * @example
     //   example 1: pathinfo('/www/htdocs/index.html', 1);
     //   returns 1: '/www/htdocs'
     //   example 2: pathinfo('/www/htdocs/index.html', 'PATHINFO_BASENAME');
     //   returns 2: 'index.html'
     //   example 3: pathinfo('/www/htdocs/index.html', 'PATHINFO_EXTENSION');
     //   returns 3: 'html'
     //   example 4: pathinfo('/www/htdocs/index.html', 'PATHINFO_FILENAME');
     //   returns 4: 'index'
     //   example 5: pathinfo('/www/htdocs/index.html', 2 | 4);
     //   returns 5: {basename: 'index.html', extension: 'html'}
     //   example 6: pathinfo('/www/htdocs/index.html', 'PATHINFO_ALL');
     //   returns 6: {dirname: '/www/htdocs', basename: 'index.html', extension: 'html', filename: 'index'}
     //   example 7: pathinfo('/www/htdocs/index.html');
     //   returns 7: {dirname: '/www/htdocs', basename: 'index.html', extension: 'html', filename: 'index'}
     * @returns {object}
     * @link http://phpjs.org/functions/pathinfo/
     * @memberOf module:xide/utils/StringUtils
     */
    utils.pathinfo = function (path, options) {
        //  discuss at:
        // original by: Nate
        //  revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // improved by: Brett Zamir (http://brett-zamir.me)
        // improved by: Dmitry Gorelenkov
        //    input by: Timo
        //        note: Inspired by actual PHP source: php5-5.2.6/ext/standard/string.c line #1559
        //        note: The way the bitwise arguments are handled allows for greater flexibility
        //        note: & compatability. We might even standardize this code and use a similar approach for
        //        note: other bitwise PHP functions
        //        note: php.js tries very hard to stay away from a core.js file with global dependencies, because we like
        //        note: that you can just take a couple of functions and be on your way.
        //        note: But by way we implemented this function, if you want you can still declare the PATHINFO_*
        //        note: yourself, and then you can use: pathinfo('/www/index.html', PATHINFO_BASENAME | PATHINFO_EXTENSION);
        //        note: which makes it fully compliant with PHP syntax.
        //  depends on: basename
        var opt = '',
            real_opt = '',
            optName = '',
            optTemp = 0,
            tmp_arr = {},
            cnt = 0,
            i = 0;
        var have_basename = false,
            have_extension = false,
            have_filename = false;

        // Input defaulting & sanitation
        if (!path) {
            return false;
        }
        if (!options) {
            options = 'PATHINFO_ALL';
        }

        // Initialize binary arguments. Both the string & integer (constant) input is
        // allowed
        var OPTS = {
            'PATHINFO_DIRNAME': 1,
            'PATHINFO_BASENAME': 2,
            'PATHINFO_EXTENSION': 4,
            'PATHINFO_FILENAME': 8,
            'PATHINFO_ALL': 0
        };
        // PATHINFO_ALL sums up all previously defined PATHINFOs (could just pre-calculate)
        for (optName in OPTS) {
            if (OPTS.hasOwnProperty(optName)) {
                OPTS.PATHINFO_ALL = OPTS.PATHINFO_ALL | OPTS[optName];
            }
        }
        if (typeof options !== 'number') {
            // Allow for a single string or an array of string flags
            options = [].concat(options);
            for (i = 0; i < options.length; i++) {
                // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
                if (OPTS[options[i]]) {
                    optTemp = optTemp | OPTS[options[i]];
                }
            }
            options = optTemp;
        }

        // Internal Functions
        var __getExt = function (path) {
            var str = path + '';
            var dotP = str.lastIndexOf('.') + 1;
            return !dotP ? false : dotP !== str.length ? str.substr(dotP) : '';
        };

        // Gather path infos
        //noinspection JSBitwiseOperatorUsage,JSBitwiseOperatorUsage
        if (options & OPTS.PATHINFO_DIRNAME) {
            var dirName = path.replace(/\\/g, '/')
                .replace(/\/[^\/]*\/?$/, ''); // dirname
            tmp_arr.dirname = dirName === path ? '.' : dirName;
        }

        //noinspection JSBitwiseOperatorUsage,JSBitwiseOperatorUsage
        if (options & OPTS.PATHINFO_BASENAME) {
            if (false === have_basename) {
                have_basename = utils.basename(path);
            }
            tmp_arr.basename = have_basename;
        }

        //noinspection JSBitwiseOperatorUsage,JSBitwiseOperatorUsage
        if (options & OPTS.PATHINFO_EXTENSION) {
            if (false === have_basename) {
                have_basename = utils.basename(path);
            }
            if (false === have_extension) {
                have_extension = __getExt(have_basename);
            }
            if (false !== have_extension) {
                tmp_arr.extension = have_extension;
            }
        }

        //noinspection JSBitwiseOperatorUsage,JSBitwiseOperatorUsage
        if (options & OPTS.PATHINFO_FILENAME) {
            if (false === have_basename) {
                have_basename = utils.basename(path);
            }
            if (false === have_extension) {
                have_extension = __getExt(have_basename);
            }
            if (false === have_filename) {
                have_filename = have_basename.slice(0, have_basename.length - (have_extension ? have_extension.length + 1 :
                        have_extension === false ? 0 : 1));
            }

            tmp_arr.filename = have_filename;
        }

        // If array contains only 1 element: return string
        cnt = 0;
        for (opt in tmp_arr) {
            if (tmp_arr.hasOwnProperty(opt)) {
                cnt++;
                real_opt = opt;
            }
        }
        if (cnt === 1) {
            return tmp_arr[real_opt];
        }

        // Return full-blown array
        return tmp_arr;
    };

    /**
     * PHP.js version of parse_url
     * @param str {string}
     * @param component {string} enum
     * @returns {object}
     * @memberOf module:xide/utils/StringUtils
     */
    utils.parse_url = function (str, component) {
        //       discuss at: http://phpjs.org/functions/parse_url/
        //      improved by: Brett Zamir (http://brett-zamir.me)
        //             note: original by http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
        //             note: blog post at http://blog.stevenlevithan.com/archives/parseuri
        //             note: demo at http://stevenlevithan.com/demo/parseuri/js/assets/parseuri.js
        //             note: Does not replace invalid characters with '_' as in PHP, nor does it return false with
        //             note: a seriously malformed URL.
        //             note: Besides function name, is essentially the same as parseUri as well as our allowing
        //             note: an extra slash after the scheme/protocol (to allow file:/// as in PHP)
        //        example 1: parse_url('http://username:password@hostname/path?arg=value#anchor');
        //        returns 1: {scheme: 'http', host: 'hostname', user: 'username', pass: 'password', path: '/path', query: 'arg=value', fragment: 'anchor'}
        var query, key = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port',
                'relative', 'path', 'directory', 'file', 'query', 'fragment'
            ],
            ini = (this.php_js && this.php_js.ini) || {},
            mode = (ini['phpjs.parse_url.mode'] &&
                ini['phpjs.parse_url.mode'].local_value) || 'php',
            parser = {
                php: /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // Added one optional slash to post-scheme to catch file:/// (should restrict this)
            };

        var m = parser[mode].exec(str),
            uri = {},
            i = 14;
        while (i--) {
            if (m[i]) {
                uri[key[i]] = m[i];
            }
        }

        if (component) {
            return uri[component.replace('PHP_URL_', '')
                .toLowerCase()];
        }
        if (mode !== 'php') {
            var name = (ini['phpjs.parse_url.queryKey'] &&
                ini['phpjs.parse_url.queryKey'].local_value) || 'queryKey';
            parser = /(?:^|&)([^&=]*)=?([^&]*)/g;
            uri[name] = {};
            query = uri[key[12]] || '';
            query.replace(parser, function ($0, $1, $2) {
                if ($1) {
                    uri[name][$1] = $2;
                }
            });
        }
        delete uri.source;
        return uri;
    };

    /***
     *
     * @deprecated
     */
    utils.getMimeTable = function () {
        return {};
    };

    /***
     * @deprecated
     * @returns {object}
     * @memberOf module:xide/utils/StringUtils
     */
    utils.getMimeTable2 = function () {
        return {
            "mid": "fa-file-audio-o",
            "txt": "fa-file-text-o",
            "sql": "fa-cube",
            "js": "fa-cube",
            "gif": "fa-file-picture-o",
            "jpg": "fa-file-picture-o",
            "html": "fa-cube",
            "htm": "fa-cube",
            "rar": "fa-file-zip-o",
            "gz": "fa-file-zip-o",
            "tgz": "fa-file-zip-o",
            "z": "fa-file-zip-o",
            "ra": "fa-file-movie-o",
            "ram": "fa-file-movie-o",
            "rm": "fa-file-movie-o",
            "pl": "source_pl.png",
            "zip": "fa-file-zip-o",
            "wav": "fa-file-audio-o",
            "php": "fa-cube",
            "php3": "fa-cube",
            "phtml": "fa-cube",
            "exe": "fa-file-o",
            "bmp": "fa-file-picture-o",
            "png": "fa-file-picture-o",
            "css": "fa-cube",
            "mp3": "fa-file-audio-o",
            "m4a": "fa-file-audio-o",
            "aac": "fa-file-audio-o",
            "xls": "fa-file-excel-o",
            "xlsx": "fa-file-excel-o",
            "ods": "fa-file-excel-o",
            "sxc": "fa-file-excel-o",
            "csv": "fa-file-excel-o",
            "tsv": "fa-file-excel-o",
            "doc": "fa-file-word-o",
            "docx": "fa-file-word-o",
            "odt": "fa-file-word-o",
            "swx": "fa-file-word-o",
            "rtf": "fa-file-word-o",
            "md": "fa-file-word-o",
            "ppt": "fa-file-powerpoint-o",
            "pps": "fa-file-powerpoint-o",
            "odp": "fa-file-powerpoint-o",
            "sxi": "fa-file-powerpoint-o",
            "pdf": "fa-file-pdf-o",
            "mov": "fa-file-movie-o",
            "avi": "fa-file-movie-o",
            "mpg": "fa-file-movie-o",
            "mpeg": "fa-file-movie-o",
            "mp4": "fa-file-movie-o",
            "m4v": "fa-file-movie-o",
            "ogv": "fa-file-movie-o",
            "webm": "fa-file-movie-o",
            "wmv": "fa-file-movie-o",
            "swf": "fa-file-movie-o",
            "flv": "fa-file-movie-o",
            "tiff": "fa-file-picture-o",
            "tif": "fa-file-picture-o",
            "svg": "fa-file-picture-o",
            "psd": "fa-file-picture-o",
            "ers": "horo.png"
        };
    };
    /***
     *
     * @deprecated
     * @memberOf module:xide/utils/StringUtils
     * @returns {object}
     */
    utils.getIconTable = function () {
        return {};
    };


    /**
     *
     * @param string
     * @param overwrite
     * @returns {object}
     * @memberOf module:xide/utils/StringUtils
     * @deprecated
     */
    utils.urlDecode = function (string, overwrite) {
        if (!string || !string.length) {
            return {}
        }
        var obj = {};
        var pairs = string.split("&");
        var pair, name, value;
        for (var i = 0, len = pairs.length; i < len; i++) {
            pair = pairs[i].split("=");
            name = decodeURIComponent(pair[0]);
            value = decodeURIComponent(pair[1]);
            if (value != null && value === 'true') {
                value = true;
            } else if (value === 'false') {
                value = false;
            }
            if (overwrite !== true) {
                if (typeof obj[name] == "undefined") {
                    obj[name] = value
                } else {
                    if (typeof obj[name] == "string") {
                        obj[name] = [obj[name]];
                        obj[name].push(value)
                    } else {
                        obj[name].push(value)
                    }
                }
            } else {
                obj[name] = value
            }
        }
        return obj;
    };
    /**
     *
     * @param string {string}
     * @returns {object}
     * @deprecated
     * @memberOf module:xide/utils/StringUtils
     */
    utils.getUrlArgs = function (string) {
        var args = {};
        if (string && (string.indexOf('?') != -1 || string.indexOf('&') != -1)) {

            var query = string.substr(string.indexOf("?") + 1) || location.search.substring(1);
            var pairs = query.split("&");
            for (var i = 0; i < pairs.length; i++) {
                var pos = pairs[i].indexOf("=");
                var name = pairs[i].substring(0, pos);
                var value = pairs[i].substring(pos + 1);
                value = decodeURIComponent(value);
                args[name] = value;
            }
        }
        return args;
    };

    /**
     *
     * @param url {string}
     * @returns {object}
     * @deprecated
     */
    utils.urlArgs = function (url) {
        var query = utils.getUrlArgs(url);
        var map = {};
        for (var param in query) {
            var value = query[param],
                options = utils.findOcurrences(value, {
                    begin: "|",
                    end: "|"
                }),
                parameterOptions = null;

            if (options && options.length) {
                //clean value:
                value = value.replace(options[0], '');
                //parse options
                var optionString = options[0].substr(1, options[0].length - 2),
                    optionSplit = optionString.split(','),
                    optionsData = {};

                for (var i = 0; i < optionSplit.length; i++) {

                    var keyValue = optionSplit[i],
                        pair = keyValue.split(':');

                    optionsData[pair[0]] = pair[1];
                }
                parameterOptions = optionsData;
            }

            if (value && value.length) {
                map[param] = {
                    value: value,
                    options: parameterOptions
                }
            }
        }
        return map;
    };

    /**
     *
     * @param fileName {string}
     * @returns {string}
     * @deprecated
     * @memberOf module:xide/utils/StringUtils
     */
    utils.getIcon = function (fileName) {
        if (!fileName) {
            return 'txt2.png';
        }
        var extension = utils.getFileExtension(fileName);
        if (extension) {
            var mime = utils.getMimeTable();
            if (mime[extension] != null) {
                return mime[extension];
            }
        }
        return 'txt2.png';
    };
    /**
     *
     * @param fileName
     * @returns {string}
     * @deprecated
     * @memberOf module:xide/utils/StringUtils
     */
    utils.getIconClass = function (fileName) {
        if (!fileName) {
            return 'fa-file-o';
        }
        var extension = utils.getFileExtension(fileName);
        if (types.customMimeIcons[extension]) {
            return types.customMimeIcons[extension];
        }
        if (extension) {
            var mime = utils.getMimeTable2();
            if (mime[extension] != null) {
                return mime[extension];
            }
        }
        return 'fa-file-o';
    };
    /**
     * File extension
     * @deprecated
     * @param fileName {string}
     * @returns {string}
     */
    utils.getFileExtension = function (fileName) {
        if (!fileName || fileName == "") return "";
        var split = utils.getBaseName(fileName).split('.');
        if (split.length > 1) return split[split.length - 1].toLowerCase();
        return '';
    };
    /**
     * Create a basic UUID via with Math.Random
     * @returns {string}
     * @memberOf module:xide/utils/StringUtils
     */
    utils.createUUID = function () {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()); //String
    };
    /**
     * Basename
     * @param fileName {string}
     * @returns {string}
     * @memberOf module:xide/utils/StringUtils
     */
    utils.getBaseName = function (fileName) {
        if (fileName == null) return null;
        var separator = "/";
        if (fileName.indexOf("\\") !==-1)
            separator = "\\";
        return fileName.substr(fileName.lastIndexOf(separator) + 1, fileName.length);
    };
    /**
     * PHP.js version of basename
     * @param path {string}
     * @param suffix
     * @returns {string}
     * @memberOf module:xide/utils/StringUtils
     * @example

     //   example 1: basename('/www/site/home.htm', '.htm')
     //   returns 1: 'home'
     //   example 2: basename('ecra.php?p=1')
     //   returns 2: 'ecra.php?p=1'
     //   example 3: basename('/some/path/')
     //   returns 3: 'path'
     //   example 4: basename('/some/path_ext.ext/','.ext')
     //   returns 4: 'path_ext'

     * @memberOf module:xide/utils/StringUtils
     */
    utils.basename = function basename(path, suffix) {
        //  discuss at: http://locutus.io/php/basename/
        // original by: Kevin van Zonneveld (http://kvz.io)
        // improved by: Ash Searle (http://hexmen.com/blog/)
        // improved by: Lincoln Ramsay
        // improved by: djmix
        // improved by: Dmitry Gorelenkov
        var b = path;
        var lastChar = b.charAt(b.length - 1);

        if (lastChar === '/' || lastChar === '\\') {
            b = b.slice(0, -1)
        }

        b = b.replace(/^.*[\/\\]/g, '');

        if (typeof suffix === 'string' && b.substr(b.length - suffix.length) === suffix) {
            b = b.substr(0, b.length - suffix.length)
        }

        return b
    };
    /**
     *
     * @param path {string}
     * @param options
     * @memberOf module:xide/utils/StringUtils
     * @returns {object}
     *
     * @example
     *
     //   example 1: pathinfo('/www/htdocs/index.html', 1)
     //   returns 1: '/www/htdocs'
     //   example 2: pathinfo('/www/htdocs/index.html', 'PATHINFO_BASENAME')
     //   returns 2: 'index.html'
     //   example 3: pathinfo('/www/htdocs/index.html', 'PATHINFO_EXTENSION')
     //   returns 3: 'html'
     //   example 4: pathinfo('/www/htdocs/index.html', 'PATHINFO_FILENAME')
     //   returns 4: 'index'
     //   example 5: pathinfo('/www/htdocs/index.html', 2 | 4)
     //   returns 5: {basename: 'index.html', extension: 'html'}
     //   example 6: pathinfo('/www/htdocs/index.html', 'PATHINFO_ALL')
     //   returns 6: {dirname: '/www/htdocs', basename: 'index.html', extension: 'html', filename: 'index'}
     //   example 7: pathinfo('/www/htdocs/index.html')
     //   returns 7: {dirname: '/www/htdocs', basename: 'index.html', extension: 'html', filename: 'index'}
     */
    utils.pathinfo = function (path, options) {
        //  discuss at: http://locutus.io/php/pathinfo/
        // original by: Nate
        //  revised by: Kevin van Zonneveld (http://kvz.io)
        // improved by: Brett Zamir (http://brett-zamir.me)
        // improved by: Dmitry Gorelenkov
        //    input by: Timo
        //      note 1: Inspired by actual PHP source: php5-5.2.6/ext/standard/string.c line #1559
        //      note 1: The way the bitwise arguments are handled allows for greater flexibility
        //      note 1: & compatability. We might even standardize this
        //      note 1: code and use a similar approach for
        //      note 1: other bitwise PHP functions
        //      note 1: Locutus tries very hard to stay away from a core.js
        //      note 1: file with global dependencies, because we like
        //      note 1: that you can just take a couple of functions and be on your way.
        //      note 1: But by way we implemented this function,
        //      note 1: if you want you can still declare the PATHINFO_*
        //      note 1: yourself, and then you can use:
        //      note 1: pathinfo('/www/index.html', PATHINFO_BASENAME | PATHINFO_EXTENSION);
        //      note 1: which makes it fully compliant with PHP syntax.


        var basename = utils.basename;
        var opt = '';
        var realOpt = '';
        var optName = '';
        var optTemp = 0;
        var tmpArr = {};
        var cnt = 0;
        var i = 0;
        var haveBasename = false;
        var haveExtension = false;
        var haveFilename = false;

        // Input defaulting & sanitation
        if (!path) {
            return false
        }
        if (!options) {
            options = 'PATHINFO_ALL'
        }

        // Initialize binary arguments. Both the string & integer (constant) input is
        // allowed
        var OPTS = {
            'PATHINFO_DIRNAME': 1,
            'PATHINFO_BASENAME': 2,
            'PATHINFO_EXTENSION': 4,
            'PATHINFO_FILENAME': 8,
            'PATHINFO_ALL': 0
        };
        // PATHINFO_ALL sums up all previously defined PATHINFOs (could just pre-calculate)
        for (optName in OPTS) {
            if (OPTS.hasOwnProperty(optName)) {
                OPTS.PATHINFO_ALL = OPTS.PATHINFO_ALL | OPTS[optName]
            }
        }
        if (typeof options !== 'number') {
            // Allow for a single string or an array of string flags
            options = [].concat(options);
            for (i = 0; i < options.length; i++) {
                // Resolve string input to bitwise e.g. 'PATHINFO_EXTENSION' becomes 4
                if (OPTS[options[i]]) {
                    optTemp = optTemp | OPTS[options[i]]
                }
            }
            options = optTemp
        }

        // Internal Functions
        var _getExt = function (path) {
            var str = path + '';
            var dotP = str.lastIndexOf('.') + 1;
            return !dotP ? false : dotP !== str.length ? str.substr(dotP) : ''
        };

        // Gather path infos
        //noinspection JSBitwiseOperatorUsage,JSBitwiseOperatorUsage
        if (options & OPTS.PATHINFO_DIRNAME) {
            var dirName = path
                .replace(/\\/g, '/')
                .replace(/\/[^\/]*\/?$/, ''); // dirname
            tmpArr.dirname = dirName === path ? '.' : dirName
        }

        //noinspection JSBitwiseOperatorUsage,JSBitwiseOperatorUsage
        if (options & OPTS.PATHINFO_BASENAME) {
            if (haveBasename === false) {
                haveBasename = basename(path)
            }
            tmpArr.basename = haveBasename
        }

        //noinspection JSBitwiseOperatorUsage,JSBitwiseOperatorUsage
        if (options & OPTS.PATHINFO_EXTENSION) {
            if (haveBasename === false) {
                haveBasename = basename(path)
            }
            if (haveExtension === false) {
                haveExtension = _getExt(haveBasename)
            }
            if (haveExtension !== false) {
                tmpArr.extension = haveExtension
            }
        }

        //noinspection JSBitwiseOperatorUsage,JSBitwiseOperatorUsage
        if (options & OPTS.PATHINFO_FILENAME) {
            if (haveBasename === false) {
                haveBasename = basename(path)
            }
            if (haveExtension === false) {
                haveExtension = _getExt(haveBasename)
            }
            if (haveFilename === false) {
                haveFilename = haveBasename.slice(0, haveBasename.length - (haveExtension
                            ? haveExtension.length + 1
                            : haveExtension === false
                            ? 0
                            : 1
                    )
                )
            }

            tmpArr.filename = haveFilename
        }

        // If array contains only 1 element: return string
        cnt = 0;
        for (opt in tmpArr) {
            if (tmpArr.hasOwnProperty(opt)) {
                cnt++;
                realOpt = opt
            }
        }
        if (cnt === 1) {
            return tmpArr[realOpt]
        }

        // Return full-blown array
        return tmpArr
    };

    /**
     *
     * @param input {string}
     * @param allowed {string}
     * @example
     //   example 1: strip_tags('<p>Kevin</p> <br /><b>van</b> <i>Zonneveld</i>', '<i><b>');
     //   returns 1: 'Kevin <b>van</b> <i>Zonneveld</i>'
     //   example 2: strip_tags('<p>Kevin <img src="someimage.png" onmouseover="someFunction()">van <i>Zonneveld</i></p>', '<p>');
     //   returns 2: '<p>Kevin van Zonneveld</p>'
     //   example 3: strip_tags("<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>", "<a>");
     //   returns 3: "<a href='http://kevin.vanzonneveld.net'>Kevin van Zonneveld</a>"
     //   example 4: strip_tags('1 < 5 5 > 1');
     //   returns 4: '1 < 5 5 > 1'
     //   example 5: strip_tags('1 <br/> 1');
     //   returns 5: '1  1'
     //   example 6: strip_tags('1 <br/> 1', '<br>');
     //   returns 6: '1 <br/> 1'
     //   example 7: strip_tags('1 <br/> 1', '<br><br/>');
     //   returns 7: '1 <br/> 1'
     * @returns {string}
     */
    utils.strip_tags = function (input, allowed) {
        //  discuss at: http://phpjs.org/functions/strip_tags/
        allowed = (((allowed || '') + '')
            .toLowerCase()
            .match(/<[a-z][a-z0-9]*>/g) || [])
            .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
        var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
            commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
        return input.replace(commentsAndPhpTags, '')
            .replace(tags, function ($0, $1) {
                return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
            });
    };
    return utils;
});

/** @module xide/utils/HTMLUtils **/
define('xide/utils/HTMLUtils',[
    'xide/utils',
    'xide/types',
    'dojo/_base/declare',
    "dojo/dom-construct",
    'dojo/has',
    'dojo/dom-class',
    "dojo/_base/window",
    'xide/lodash'
], function (utils, types, declare, domConstruct, has, domClass, win, _) {
    /**
     * @TODO: remove
     * #Maqetta back compat tool
     * @returns {*}
     */
    utils.getDoc = function () {
        return win.doc;
    };
    /**
     *
     * @param tag
     * @param options
     * @param where
     * @memberOf module:xide/utils
     * @returns {*}
     */
    utils.create = function (tag, options, where) {
        var doc = win.doc;
        if (where) {
            doc = where.ownerDocument;
        }

        if (typeof tag == "string") {
            tag = doc.createElement(tag);
        }
        options && $(tag).attr(options);
        where && $(where).append(tag);
        return tag;
    };

    /**
     * Returns true when a node is child of another node
     * @param parent {HTMLElement}
     * @param child {HTMLElement}
     * @returns {boolean}
     */
    utils.isDescendant = function (parent, child) {
        var node = child.parentNode;
        while (node !== null) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    };
    /**
     * Finds and returns a widgets instance in a stack-container by name
     * @param name
     * @param container
     * @returns {module:xide/layout/_Container}
     */
    utils.hasChild = function (name, container) {
        if (!!name || !container && container.getChildren) {
            return _.find(container.getChildren(), {
                title: name
            });
        }
    };
    /**
     *
     * @TODO: remove, not needed since 3.0
     * @param startNode
     * @param mustHaveClass
     * @returns {*}
     */
    utils.findEmptyNode = function (startNode, mustHaveClass) {
        if (!startNode || startNode.children == null || startNode.children.length == null) {
            return null;
        }
        var children = startNode.children;
        if (mustHaveClass !== null) {
            children = utils.find(mustHaveClass, startNode, false);
        }
        for (var i in children) {
            var child = children[i];
            if (child.innerHTML === '') {
                return child;
            }
        }
        return null;
    };
    /**
     *
     * @param proto {Module} a module
     * @param args {Object} the constructor arguments
     * @param node {HTMLElement|null}
     * @param extraBaseClasses {Module[]} additional base classes
     * @param classExtension
     * @returns {Object}
     */
    utils.createInstanceSync = function (proto, args, node, extraBaseClasses, classExtension) {
        //extra bases and/or class extension, create a dynamic class and fill extra-bases
        if (extraBaseClasses || classExtension) {
            extraBaseClasses = extraBaseClasses || [];
            if (classExtension) {
                extraBaseClasses.push(declare(proto, classExtension));
            }
        }
        if (extraBaseClasses) {
            extraBaseClasses.push(proto);
            extraBaseClasses.reverse();
            proto = declare(extraBaseClasses, {});
        }
        return new proto(args || {}, node || win.doc.createElement('div'));

    };
    /***
     * addWidget
     * @param widgetProto
     * @param ctrArgsIn
     * @param delegate
     * @param parent
     * @param startup
     * @param cssClass
     * @param baseClasses
     * @param select
     * @param classExtension
     * @returns {widgetProto}
     */
    utils.addWidget = function (widgetProto, ctrArgsIn, delegate, parent, startup, cssClass, baseClasses, select, classExtension) {
        var ctrArgs = {
            delegate: delegate
        };
        ctrArgsIn = ctrArgsIn || {};
        utils.mixin(ctrArgs, ctrArgsIn);

        //deal with class name
        if (_.isString(widgetProto)) {
            var _widgetProto = utils.getObject(widgetProto);
            if (_widgetProto) {
                widgetProto = _widgetProto;
            }
        }

        parent = _.isString(parent) ? domConstruct.create(parent) : parent == null ? win.doc.createElement('div') : parent;
        var isDirect = ctrArgsIn.attachDirect ? ctrArgsIn.attachDirect : (widgetProto && widgetProto.prototype ? widgetProto.prototype.attachDirect : false);
        ctrArgs._parent = parent;

        var _target = utils.getNode(parent);
        //@TODO: remove
        if (parent && parent.finishLoading) {
            parent.finishLoading();
        }
        //@TODO: remove
        if (ctrArgs.attachChild && parent.addChild) {
            delete ctrArgs.attachChild;
            return parent.addChild(widgetProto, ctrArgs, startup);
        }


        //@TODO: replace
        if (parent.addWidget && ctrArgs.ignoreAddChild !== true) {
            return parent.addWidget(widgetProto, ctrArgsIn, delegate, parent, startup, cssClass, baseClasses, select, classExtension);
        }

        var widget = utils.createInstanceSync(widgetProto, ctrArgs, isDirect ? _target : null, baseClasses, classExtension);// new widgetProto(ctrArgs, dojo.doc.createElement('div'));
        if (!widget) {
            console.error('widget creation failed! ', arguments);
            return null;
        }

        if (parent) {
            if (!isDirect) {
                utils.addChild(parent, widget, startup, select);
            } else {
                startup && widget.startup();
            }
        } else {
            return widget;
        }

        if (cssClass) {
            domClass.add(widget.domNode, cssClass);
        }

        if (parent.resize || parent.startup) {
            widget._parent = parent;
        }

        //@TODO: remove
        widget.utils = utils;
        widget.types = types;
        return widget;
    };

    /***
     * addChild is a Dojo abstraction. It tries to call addChild on the parent when the client is fitted for this case.
     * @param parent {HTMLElement|module:xide/widgets/_Widget}
     * @param child {HTMLElement|module:xide/widgets/_Widget}
     * @param startup {boolean} call startup() on the child
     * @param select {boolean} select the widget if parent has such method
     */
    utils.addChild = function (parent, child, startup, select) {
        if (!parent || !child) {
            console.error('error! parent or child is invalid!');
            return;
        }
        try {
            var parentIsWidget = typeof parent.addChild === 'function';
            var _parentNode = parentIsWidget ? parent : utils.getNode(parent);
            var _childNode = parentIsWidget ? child : child.domNode || child;
            if (_parentNode && _childNode) {
                if (!parent.addChild) {
                    if (_childNode.nodeType) {
                        _parentNode.appendChild(_childNode);
                        if (startup === true && child.startup) {
                            child.startup();
                        }
                    } else {
                        logError('child is not html');
                    }
                } else {
                    var insertIndex = -1;
                    if (parent.getChildren) {
                        insertIndex = parent.getChildren().length;
                    }
                    try {
                        //@TODO: this has wrong signature in beta3
                        parent.addChild(_childNode, insertIndex, select !== null ? select : startup);
                    } catch (e) {
                        logError(e, 'add child failed for some reason!' + e);
                    }
                }
            } else if (has('debug')) {
                console.error("utils.addChild : invalid parameters :: parent or child domNode is null");
            }
        } catch (e) {
            logError(e, 'addWidget : crashed : ');
        }
    };
    /***
     *
     * 'templatify' creates a sort of dynamic widget which behaves just like a normal templated widget. Its
     * there for simple widget creation which goes beyond the string substitute alternative. This can
     * avoid also to carry around too many widget modules in your app.
     *
     * @param baseClass {xide/widgets/TemplatedWidgetBase|dijit/_TemplatedMixin} a base class to use, this must be
     * anything which is a dijit/_TemplatedMixin.
     *
     * @param templateString {string} template string as usual, can have all tags like  data-dojo-attach-point and so
     * forth
     *
     * @param parentNode {HTMLNode} the node where the 'dynamic widget' is being added to.

     * @param templateArguments {Object} some parameters mixed into the widget. In the example below you might use
     * {iconClass:'fa-play'} to insert the icon class 'fa-play' into the widget's template
     *
     * @param baseClasses {Object[]=} optional, a number of additional base classes you want make the 'dynamic widget'
     * to be inherited from.
     *
     * @param startup {boolean} call startup on the widget
     *
     * @returns {Widget} returns the templated widget
     *
     *
     * @example var _tpl =  "<div>" +
     "<div class='' data-dojo-type='dijit.form.DropDownButton' data-dojo-props=\"iconClass:'${!iconClass}'\" +
     "data-dojo-attach-point='wButton'>" +
     "<span></span>" +
     "<div data-dojo-attach-point='menu' data-dojo-type='dijit.Menu' style='display: none;'></div>" +
     "</div></div>";

     var widget  = this.templatify(xide/widgets/TemplatedWidgetBase,_tpl, parent , {
            iconClass:'fa-play'
        },[xide/mixins/ReloadMixin]);

     * @memberOf module:xide/utils
     * @extends xide/utils

     */
    utils.templatify = function (baseClass, templateString, parentNode, templateArguments, baseClasses, startup) {
        var widgetClassIn = baseClass || 'xide/widgets/TemplatedWidgetBase',
            widgetProto = null;
        if (baseClasses) {
            widgetProto = declare([baseClass].concat(baseClasses));
        } else {
            widgetProto = utils.getObject(widgetClassIn);
        }
        if (!widgetProto) {
            return null;
        }
        var ctrArgs = {
            templateString: templateString
        };
        utils.mixin(ctrArgs, templateArguments);
        var widget = new widgetProto(ctrArgs, dojo.doc.createElement('div'));
        utils.addChild(parentNode, widget, startup);
        return widget;
    };
    /**
     * XIDE specific
     * @param prop
     * @param owner
     * @private
     */
    utils._clearProperty = function (prop, owner) {
        var _key = null;
        if (owner) {
            _key = utils.getObjectKeyByValue(owner, prop);
        }
        if (_key) {
            owner[_key] = null;
        }
    };
    /**
     * XIDE specific destroy
     * @param view
     * @param callDestroy
     * @param owner
     * @private
     */
    utils._destroyWidget = function (view, callDestroy, owner) {
        try {
            _.isString(view) && (view = $(view)[0]);
            if (view) {
                if (view.parentContainer &&
                    view.parentContainer.removeChild &&
                    view.domNode) {
                    if (view.destroy && callDestroy !== false) {
                        try {
                            view.destroy();
                        } catch (e) {
                            console.error('error destroying view');
                        }
                    }
                    view.parentContainer.removeChild(view);
                    if (owner) {
                        utils._clearProperty(view, owner);
                    }
                    return;
                }
                view.destroyRecursive && view.destroyRecursive();
                view.destroy && view._destroyed !== true && view.destroy();
                view._destroyed = true;
                if (view.domNode || view["domNode"]) {
                    if (view.domNode) {
                        domConstruct.destroy(view.domNode);
                    }
                } else {
                    var doc = view.ownerDocument;
                    // cannot use _destroyContainer.ownerDocument since this can throw an exception on IE
                    if (doc) {
                        domConstruct.destroy(view);
                    }
                }
                utils._clearProperty(view, owner);
            }

        } catch (e) {
            logError(e, 'error in destroying widget ' + e);
        }
    };
    /**
     * Destroys a widget or HTMLElement safely. When an owner
     * is specified, 'widget' will be nulled in owner
     * @param widget {Widget|HTMLElement|object}
     * @param callDestroy instruct to call 'destroy'
     * @param owner {Object=}
     */
    utils.destroy = function (widget, callDestroy, owner) {
        if (widget) {
            if (_.isArray(widget)) {
                for (var i = 0; i < widget.length; i++) {
                    var obj1 = widget[i];
                    var _key = null;
                    if (owner) {
                        _key = utils.getObjectKeyByValue(owner, obj1);
                    }
                    utils._destroyWidget(obj1, callDestroy);
                    if (_key) {
                        owner[_key] = null;
                    }
                }
            } else {
                utils._destroyWidget(widget, callDestroy, owner);
            }
        }
    };

    /**
     *
     * @param target
     * @returns {*}
     */
    utils.getNode = function (target) {
        if (target) {
            return target.containerNode || target.domNode || target;
        }
        return target;
    };

    /**
     *
     * @param widgets
     * @returns {number}
     */
    utils.getHeight = function (widgets) {
        if (!_.isArray(widgets)) {
            widgets = [widgets];
        }
        var total = 0;
        _.each(widgets, function (w) {
            total += $(utils.getNode(w)).outerHeight();
        });
        return total;

    };
    /**
     *
     * @param source
     * @param target
     * @param height
     * @param width
     * @param force
     * @param offset
     */
    utils.resizeTo = function (source, target, height, width, force, offset) {
        target = utils.getNode(target);
        source = utils.getNode(source);
        if (height === true) {
            var targetHeight = $(target).height();
            if (offset && offset.h !== null) {
                targetHeight += offset.h;
            }
            $(source).css('height', targetHeight + 'px' + (force === true ? '!important' : ''));
        }
        if (width === true) {
            var targetWidth = $(target).width();
            $(source).css('width', targetWidth + 'px' + (force === true ? '!important' : ''));
        }
    };

    /**
     * @TODO: remove
     * Save empty a node or a widget
     * @param mixed {HTMLElement|xide/_base/_Widget || dijit/_WidgetBase}
     * @returns void
     */
    utils.empty = function (mixed) {
        //seems widget
        if (mixed.getChildren && mixed.removeChild) {
            var children = mixed.getChildren();
            _.each(children, function (widget) {
                mixed.removeChild(widget);
            });
        }
        //now remove anything non-widget
        var _el = mixed.containerNode || mixed.domNode || _.isElement(mixed) ? mixed : null;
        if (_el) {
            domConstruct.empty(_el);
        }

    };
    return utils;
});

(function () {

    //bloody boiler code
    var __isAMD = !!(typeof define === 'function' && define.amd),
        __isNode = (typeof exports === 'object'),
        __isWeb = !__isNode,
    //is that enough at some point?
        __isDojoRequire = !!(typeof require === 'function' && require.packs),
        __isRequireJS = !__isDojoRequire,
        __deliteHas = !!(typeof has === 'function' && has.addModule),
        __hasDcl = !!(typeof dcl === 'function'),//false if dcl has not been required yet
        __preferDcl = false;//!__isDojoRequire && __hasDcl;

    /**
     * @TODO
     *
     * - convert dojo base classes recursive, currently it only accepts simple dojo classes, not with multiple
     * base classes but you can use as many dcl base classes as you want.
     * - deal with un-tested cases: nodejs, cjs
     *
     * @example  tested cases:

     1. var fooBar = dDeclare('foo.bar',null,{}); // works with dcl or dojo

     2. var myFooBarKid = dDeclare('my.foo.bar',[fooBar],{}); // works with dcl or dojo

     3. using a Dojo declared class together with a dcl declared class:

     var _myDojoClass = declare('dojoClass',null,{});
     var _classD2 = dDeclare('my mixed class',[myFooBarKid,_myDojoClass],{});

     *
     */
    var _define = define;

    _define([
        //needed?
        'exports',
        'module',
        'xide/utils',
        'dojo/_base/declare',
        (typeof __isDojoRequire !='undefined' && __isDojoRequire ) ? __preferDcl ? 'dcl/dcl' :  'dojo/_base/declare' : 'dcl/dcl'

    ], function (exports, module,utils,dDeclare) {

        /*
        console.log('xdojo/declare:\n\t  _isAMD:' +__isAMD +
            "\n\t isNode:" + __isNode +
            "\n\t isDojoRequire:" + __isDojoRequire +
            "\n\t isRequireJS:" + __isRequireJS +
            "\n\t __deliteHas:" + __deliteHas +
            "\n\t __hasDcl:" + __hasDcl +
            "\n\t __preferDcl:" + __preferDcl
        );
        */


        if(!__isDojoRequire && __preferDcl) {
            var _dcl = null;//
            try {

                _dcl = require('dcl/dcl');
                if (_dcl) {
                    dDeclare = _dcl;
                }
            } catch (e) {

            }
        }

        ////////////////////////////////////////////////////////////////////
        //
        // Extras
        //
        ///////////////////////////////////////////////////////////////////

        function addExtras(handler){

            /**
             *
             * @param name
             * @param bases {object}
             * @param extraClasses {object[]}
             * @param implmentation
             * @param defaults
             * @returns {*}
             */
            function classFactory(name, bases, extraClasses, implmentation,defaults) {


                var baseClasses = bases!=null ? bases : utils.cloneKeys(defaults || {}),
                    extras = extraClasses || [],
                    _name = name || 'xgrid.Base',
                    _implmentation = implmentation || {};

                if (bases) {
                    utils.mixin(baseClasses, bases);
                }

                var classes = [];
                for (var _class in baseClasses) {
                    var _classProto = baseClasses[_class];
                    if ( _classProto) {
                        classes.push(baseClasses[_class]);
                    }
                }

                classes = classes.concat(extras);

                return handler(_name, classes, _implmentation);
            }

            handler.classFactory=classFactory;

        }


        if (dDeclare) {

            //node.js
            if (typeof exports !== "undefined") {
                exports.declare = dDeclare;
            }

            if (__isNode) {
                return module.exports;
            } else if (__isWeb && __isAMD) {

                //todo: where to place this?
                var _patchDCL = true,     //patch DCL for Dojo declare signature
                    _convertToDCL = true, //if a dojo/declared class is passed, convert it to DCL
                    handler = dDeclare;

                //now make Dcl working like declare, supporting declaredClass.
                //This could be done via define('module') and then module.id but i don't trust it.
                if (handler && __preferDcl && !dDeclare.safeMixin) {

                    if(_patchDCL) {

                        //the Dojo to Dcl converter, see TODO's
                        function makeClass(name,_class,_declare){
                            return _declare(null,_class,_class.prototype);
                        }

                        //in-place base class check & convert from dojo declared base class to dcl base class
                        //@TODO: recursive and cache !! There is probably more..
                        function checkClasses(classes,_declare){

                            for (var i = 0, j = classes.length; i < j ; i++) {

                                var o = classes[i];
                                //convert dojo base class
                                if(o.createSubclass){
                                    var declaredClass =  o.declaredClass || o.prototype.declaredClass;
                                    var out = makeClass(declaredClass,o,handler);
                                    classes[i] = o = out;
                                }
                            }
                            return classes;
                        }

                        var _declareFunction = function () {

                            var _declaredClass = null,
                                args = arguments,
                                context = arguments.callee;//no need actually



                            //eat declared string arg
                            if (typeof arguments[0] == 'string') {
                                _declaredClass = arguments[0];
                                args = Array.prototype.slice.call(arguments, 1);
                            }

                            //patch props for declaredClass, @TODO: not sure dcl() has really only 2 args
                            if(_declaredClass) {

                                //this will add declared class into the new class's prototype
                                args[args.length-1]['declaredClass'] = _declaredClass;

                            }

                            switch (args.length) {
                                case 1:
                                    //fast and legit dcl case, no base classes given
                                    return handler.call(context,null,args[0]);
                                case 2:{

                                    //base classes given and prototype given, convert to Dojo if desired

                                    //straight forward
                                    if(!_convertToDCL) {
                                        return handler.call(context, args[0], args[1]);
                                    }

                                    //convert base classes if given
                                    /*
                                    if(handler.Advice && args[0] == null) {
                                        return handler.call(args[0] != null ? checkClasses(args[0]) : args[0], args[1]);
                                    }*/
                                    var bases = args[0] != null ? checkClasses(args[0]) : args[0];
                                    var proto = args[1];
                                    /*
                                    if(handler.Advice && bases) {
                                        return handler.call(bases, proto);
                                    }*/
                                    return handler.call(context, bases, proto);
                                }
                                // fall through
                                default:
                                    return handler.call(context,args);
                            }
                        };
                        addExtras(_declareFunction);
                        return _declareFunction;
                    }
                }
                addExtras(dDeclare);
                return dDeclare;
            }
            addExtras(dDeclare);
            return dDeclare;

        } else {

            //@TODO, add fallback version?
            //we shouldn't be here anyways, dcl or dojo/declare has not been loaded yet!
            return resultingDeclare;
        }
    });
}).call(this);
define("xdojo/declare", function(){});

(function () {

    var __isAMD = !!(typeof define === 'function' && define.amd),
        __isNode = (typeof exports === 'object'),
        __isWeb = !__isNode,
    //is that enough at some point?
        __isDojoRequire = !!(typeof require === 'function' && require.packs),
        __isRequireJS = !__isDojoRequire,
        __deliteHas = !!(typeof has === 'function' && has.addModule);

    define('xdojo/has',[
        //needed?
        'require',
        'exports',
        //should be extended for the missing .config() method when in delite
        'module',
        __isDojoRequire ? 'dojo/has' : 'requirejs-dplugins/has'
    ], function (require, exports, module, dHas) {

        if (dHas) {
            if (typeof exports !== "undefined") {
                exports.has = dHas;
            }
            if (__isNode) {
                return module.exports;
            } else if (__isWeb && __isAMD) {
                return dHas;
            }
        } else {
            //@TODO, add simple version?
            //we shouldn't be here
            debugger;
        }
    });
}).call(this);
define('xide/factory',[
    'dcl/dcl'
],function(dcl){
    return new dcl(null,{
        declaredClass:'xide/factory'
    });
});
/** @module xide/mixins/EventedMixin **/
define('xide/mixins/EventedMixin',[
    "dojo/_base/array",
    "dcl/dcl",
    "xdojo/declare",
    "xdojo/has",
    'xide/types',
    'xide/factory'
], function (array,dcl,declare, has, types, factory) {

    var toString = Object.prototype.toString;
    /**
     * Adds convenient functions for events to the consumer, generalizing dojo.subscribe/publish or dojo.on.
     * This mixin can be applied to anything dijit/_Widget based or custom functional classes(needs to call destroy!)
     *
     * Check online-documentation {@link http://rawgit.com/mc007/xjs/dgrid_update/src/lib/xide/out/xide/0.1.1-dev/EventedMixin.html|here}
     *
     * @class module:xide/mixins/EventedMixin
     */
    var Impl = {

        _didRegisterSubscribers:false,

        subscribers:null,
        /**
         * Subscription filter map
         * @type {Object.<string,boolean}
         */
        subscribes: {},
        /**
         * Emit filter map
         * @type {Object.<string,boolean}
         */
        emits: {},
        /**
         * Array of dojo subscribe/on handles, destroyed on this.destroy();
         * @private
         * @type {Object[]}
         */
        __events: null,
        /**
         * Add emit filter
         * @param type
         * @param data
         */
        addPublishFilter:function(type,data){
            if(type){
                if(data!=null){
                    this.emits[type]=data;
                }else if(type in this.emits){
                    delete this.emits[type];
                }
            }
        },
        /**
         * Simple filter function to block subscriptions.
         * @param key
         * @returns {boolean}
         */
        filterSubscribe: function (key) {

            if (this.subscribes) {
                return this.subscribes[key] !== false;
            }
            return true;
        },
        /**
         * Simple filter function to block publishing.
         * @param key
         * @returns {boolean}
         */
        filterPublish: function (key) {
            if (this.emits) {
                return this.emits[key] !== false;
            }
            return true;
        },
        /**
         * Subscribe to an event or multiple events. Attention, this is NOT checking for duplicates!
         *
         * @example
         *
         * // widget case with event callback delegation to 'this', code is written inside a custom widget or whatever
         * // class subclassing from this mixin:
         * // pre-requisites for dijit/dojox widgets: lang.extend(dijit.Button,EventedMixin.prototype);
         *
         * //simple example #1
         * var button = new dijit.Button({});
         * button.subscribe('click',this.onButtonClick,this);//calls this.onButtonClick with scope this
         *
         * //simple example #2
         * var button = new dijit.Button({});
         * button.subscribe('click',null,this);//calls this.click with scope this
         *
         * //multi-event example #1
         * var button = new dijit.Button({});
         * button.subscribe(['click','dblclick'],null,this);//calls this.click and this.dblclick with scope this
         *
         * // custom events (using dojo-publish/subscribe or dojo.topic)
         * // assuming you want listen to the events of dijit/layout/TabContainer or any other StackContainer. Notice,
         * // that stack-containers will publish events like this: topic.publish(this.id + "-removeChild", page);
         *
         * var tabContainerId = 'tabContainer';
         *
         * this.subscribe(tabContainerId + 'addChild',this.childAdded);//notice that the scope is set here automatically!
         *
         * //multi-event version, this will call this['tabContainerId-addChild'] and this['tabContainerId-removeChild']
         *
         * this.subscribe([tabContainerId + 'addChild',tabContainerId + 'removeChild']);
         *
         *
         *
         *
         *
         *
         * @param keys {String|String[]} : The event key(s), given as single string or an array of strings, holding all
         * event keys for publishing multiple events in one row.
         *
         * @param cb {Function} : callback, by the default the callback's scope will 'this'
         *
         * @param to {Object} : override 'this' scope to something else
         */
        subscribe: function (keys, cb, to) {
            if (!this.__events) {
                this.__events = {};
            }
            var self = this,
                events = factory.subscribe(keys, cb, to || self, self.filterSubscribe.bind(self)),
                container = self.__events;

            //replay on local tracking map
            for(var i=0, l=events.length; i<l ; i++){
                var _type = events[i].type;
                if(!container[_type]){
                    container[_type]=[];
                }
                container[_type].push(events[i]);
            }
            return events;

        },
        /**
         * Publish an event (uses dojo.publish)
         *
         * @param keys {String|String[]} : The event key, given as string or array for publishing multiple events in one row
         *
         * @param data {Object|null} : The actual event data.
         *
         * @param from {Object|null} : Send event 'as' this source. By default, its using 'this' as sender.
         *
         * @param delay {Number|null} : Send event with a delay, otherwise call now
         *
         */
        publish: function (keys, data, from, delay) {
            var self = this;
            if (delay > 0) {
                setTimeout(function () {
                    factory.publish(keys, data, from || self, self.filterPublish.bind(self));
                }.bind(self), delay);
            } else {
                factory.publish(keys, data, from || self, self.filterPublish.bind(self));
            }
        },
        /**
         * @TODO: deal with unsubscribe in _EventedMixin
         * @param key
         * @private
         */
        _destroyHandle: function (key) {},
        /**
         * Turns the lights off, kills all event handles.
         * @private
         * @returns void
         */
        _destroyHandles: function () {
            if (this.__events) {
                for(var type in this.__events){
                    array.forEach(this.__events[type], function(item){
                        if(item && item.remove){
                            item.remove();
                        }
                    });
                }
                delete this.__events;
            }
        },
        /**
         * When using subscribe, all event subscription handles are stored in this.__events.
         * This function will remove all the event handles, using this._destroyHandles()
         */
        destroy: function () {
            this._emit('destroy');
            this.inherited && this.inherited(arguments);
            this._destroyHandles();
        },
        /**
         * Adds a one time listener for the event. This listener is invoked only the
         * next time the event is fired, after which it is removed.
         *
         * @name emitter.once(event, listener)
         * @param {String} event- The event name/id to listen for
         * @param {Function} listener - The function to bind to the event
         * @api public
         *
         * ```javascript
         * db.once('unauthorized', function (req) {
         *     // this event listener will fire once, then be unbound
         * });
         * ```
         */
        once : function(type, listener) {
            var self = this;
            function wrapped() {
                self.unsubscribe(type, listener);
                return listener.apply(self, arguments);
            }
            wrapped.listener = listener;
            self._on(type, wrapped);
            return this;
        },
        /*
        __emit:function(target,type,event){
            event = event || {};
            if (typeof target.emit === 'function' && !target.nodeType) {
                return target.emit(type, event);
            }
            if (target.dispatchEvent && target.ownerDocument && target.ownerDocument.createEvent) {
                var nativeEvent = target.ownerDocument.createEvent('HTMLEvents');
                nativeEvent.initEvent(type, Boolean(event.bubbles), Boolean(event.cancelable));
                for (var key in event) {
                    if (!(key in nativeEvent)) {
                        nativeEvent[key] = event[key];
                    }
                }
                return target.dispatchEvent(nativeEvent);
            }
            throw new Error('Target must be an event emitter');
        },
        */
        /**
         * Execute each of the listeners in order with the supplied arguments.
         *
         * @name emitter.emit(event, [arg1], [arg2], [...])
         * @param {String} event - The event name/id to fire
         * @api public
         */
        _emit:function(type) {
            if (!this.__events)
                return;

            if(!this._didRegisterSubscribers && this.subscribers){
                for(var i=0;i<this.subscribers.length ; i++){
                    var subscriber = this.subscribers[i];
                    this._on(subscriber.event,subscriber.handler,subscriber.owner);
                }
                this._didRegisterSubscribers = true;
            }

            if (arguments[2] === true)
                throw new Error("Please use emit.sticky() instead of passing sticky=true for event: " + type);

            var handler = this.__events[type],
                eventArgs = arguments.length>1 ? arguments[2] : null;

            if (!handler)
                return;

            var returnValue;

            if (typeof handler == 'function') {
                switch (arguments.length) {
                    // fast cases
                    case 1:
                        return handler.call(this);
                    case 2:
                        return handler.call(this, arguments[1]);
                    case 3:
                        return handler.call(this, arguments[1], arguments[2]);
                    // slower
                    default:
                        var args = Array.prototype.slice.call(arguments, 1);
                        returnValue = handler.apply(this, args);
                }
            }

            else if (_.isArray(handler)) {
                var args = Array.prototype.slice.call(arguments, 1);
                var listeners = handler.slice(), temp;
                var _listener = null;
                var who = null;

                for (var i = 0, l = listeners.length; i < l; i++) {

                    _listener = listeners[i];
                    who = _listener.owner|| this;
                    args && args[0] && (args[0].owner =args[0] ? args[0].owner || who : null);

                    _listener.handler && (temp = _listener.handler.apply(who, args));
                    if (temp !== undefined)
                        returnValue = temp;
                }
            }

            //forward to global
            eventArgs && eventArgs['public']===true && this.publish(type,args);

            return returnValue;
        },
        /**
         * Remove a listener from the listener array for the specified event. Caution:
         * changes array indices in the listener array behind the listener.
         *
         * @name emitter.removeListener(event, listener)
         * @param {String} event - The event name/id to remove the listener from
         * @param {Function} listener - The listener function to remove
         * @api public
         *
         * ```javascript
         * var callback = function (init) {
         *     console.log('duality app loaded');
         * };
         * devents.on('init', callback);
         * // ...
         * devents.removeListener('init', callback);
         * ```
         */
        unsubscribe:function(type,listener){

            // does not use listeners(), so no side effect of creating __events[type]
            if (!this.__events || !this.__events[type]) return this;

            // no listener given, unsubscribe all per type
            if (('function' !== typeof listener || !listener)) {
                array.forEach(this.__events[type], dojo.unsubscribe);
                delete this.__events[type];
                this.__events[type] = [];
                return this;
            }
            var list = this.__events[type];
            if (_.isArray(list)) {
                var _remove =[];
                _.each(list,function(handle,a,b){
                    var which= handle.handler == listener ? handle.handler : handle.handler.listener == listener ? handle.handler.listener : null;
                    if(which) {
                        _remove.push(handle);
                    }
                });
                _.each(_remove,function(handler){
                    handler.remove();
                });
                if (list.length === 0) {
                    delete this.__events[type];
                }
            }else if ((this.__events[type].listener || this.__events[type]) === listener) {
                delete this.__events[type];
            }
            return this;
        },
        /**
         * Returns an array of listeners for the specified event. This array can be
         * manipulated, e.g. to remove listeners.
         *
         * @name emitter.listeners(event)
         * @param {String} events - The event name/id to return listeners for
         * @api public
         *
         * ```javascript
         * session.on('change', function (stream) {
         *     console.log('session changed');
         * });
         * console.log(util.inspect(session.listeners('change'))); // [ [Function] ]
         * ```
         */
        listeners:function(type) {
            if (!this.__events) this.__events = {};
            if (!this.__events[type]) this.__events[type] = [];
            if (!isArray(this.__events[type])) {
                this.__events[type] = [this.__events[type]];
            }
            return this.__events[type];
        },
        /**
         *
         * @param type
         * @param handle
         * @returns {*}
         */
        addHandle:function(type,handle){
            if(!this.__events){
                this.__events = {}
            }
            if(!this.__events[type]){
                this.__events[type]=[];
            }
            handle.type = type;
            this.__events[type].push(handle);
            return handle;
        },
        /**
         * jQuery sub
         * @param element
         * @param type
         * @param selector
         * @param handler
         * @returns {{handler: *, owner: (exports|module.exports|module:xide/mixins/EventedMixin), type: *, element: (*|jQuery|HTMLElement), selector: *, remove: _handle.remove}}
         */
        __on:function(element,type,selector,handler){

            var _handler = handler;

            if(typeof selector =='function' && !handler){
                //no selector given
                handler = selector;
                selector = null;
            }

            element = element.jquery ? element : $(element);
            element.on(type,selector,handler);

            if (!this.__events) this.__events = {};
            if (!this.__events[type]) {
                this.__events[type] = [];
            }
            var eventList = this.__events[type];
            var _handle = {
                handler: _handler,
                owner: this,
                type: type,
                element:element,
                selector:selector,
                remove: function () {
                    eventList.remove(this);
                    this.element.off(this.type,this.selector,this.handler);
                }
            };
            eventList.push(_handle);
            return _handle;

        },
        /**
         * Dojo based sub
         * @param type
         * @param listener
         * @param owner
         * @returns {*}
         * @private
         */
        _on: function(type, listener,owner) {
            try {
                if (!this.__events) this.__events = {};

                if (!this.__events[type]) {
                    this.__events[type] = [];
                }

                var eventList = this.__events[type];


                if (!eventList) {
                    // Optimize the case of one listener. Don't need the extra array object.
                    this.__events[type] = listener;
                }
                else if (_.isArray(eventList)) {

                    if (eventList.indexOf(listener) != -1)
                       return console.warn("adding same listener twice", type);

                    // If we've already got an array, just append.
                    var _handle = {
                        handler: listener,
                        owner: owner || this,
                        type: type,
                        remove: function () {
                            eventList.remove(this);
                            owner && owner.__events && owner.__events[type] && owner.__events[type].remove(this);
                            this.owner = null;
                            this.handler = null;
                            delete this.type;
                        }
                    };
                    eventList.push(_handle);
                    return _handle;
                }
            }catch(e){
                logError(e);
            }
            return this;
        }
    };

    //package via declare
    var Module = declare(null, Impl);
    //static access to Impl.
    Module.Impl = Impl;
    Module.dcl = dcl(null,Impl);
    dcl.chainAfter(Module.dcl,'destroy');
    return Module;
});


define('xide/encoding/_base',[
	"dojo/_base/lang"

], function(lang){

	//	These functions are 32-bit word-based.  See _sha-64 for 64-bit word ops.
	var base = {};//lang.getObject("dojox.encoding.digests", true);

	base.outputTypes={
		// summary:
		//		Enumeration for input and output encodings.
		Base64:0, Hex:1, String:2, Raw:3
	};

	//	word-based addition
	base.addWords=function(/* word */a, /* word */b){
		// summary:
		//		add a pair of words together with rollover
		var l=(a&0xFFFF)+(b&0xFFFF);
		var m=(a>>16)+(b>>16)+(l>>16);
		return (m<<16)|(l&0xFFFF);	//	word
	};

	//	word-based conversion method, for efficiency sake;
	//	most digests operate on words, and this should be faster
	//	than the encoding version (which works on bytes).
	var chrsz=8;	//	16 for Unicode
	var mask=(1<<chrsz)-1;

	base.stringToWord=function(/* string */s){
		// summary:
		//		convert a string to a word array
		var wa=[];
		for(var i=0, l=s.length*chrsz; i<l; i+=chrsz){
			wa[i>>5]|=(s.charCodeAt(i/chrsz)&mask)<<(i%32);
		}
		return wa;	//	word[]
	};

	base.wordToString=function(/* word[] */wa){
		// summary:
		//		convert an array of words to a string
		var s=[];
		for(var i=0, l=wa.length*32; i<l; i+=chrsz){
			s.push(String.fromCharCode((wa[i>>5]>>>(i%32))&mask));
		}
		return s.join("");	//	string
	};

	base.wordToHex=function(/* word[] */wa){
		// summary:
		//		convert an array of words to a hex tab
		var h="0123456789abcdef", s=[];
		for(var i=0, l=wa.length*4; i<l; i++){
			s.push(h.charAt((wa[i>>2]>>((i%4)*8+4))&0xF)+h.charAt((wa[i>>2]>>((i%4)*8))&0xF));
		}
		return s.join("");	//	string
	};

	base.wordToBase64=function(/* word[] */wa){
		// summary:
		//		convert an array of words to base64 encoding, should be more efficient
		//		than using dojox.encoding.base64
		var p="=", tab="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s=[];
		for(var i=0, l=wa.length*4; i<l; i+=3){
			var t=(((wa[i>>2]>>8*(i%4))&0xFF)<<16)|(((wa[i+1>>2]>>8*((i+1)%4))&0xFF)<<8)|((wa[i+2>>2]>>8*((i+2)%4))&0xFF);
			for(var j=0; j<4; j++){
				if(i*8+j*6>wa.length*32){
					s.push(p);
				} else {
					s.push(tab.charAt((t>>6*(3-j))&0x3F));
				}
			}
		}
		return s.join("");	//	string
	};

	//	convert to UTF-8
	base.stringToUtf8 = function(input){
		var output = "";
		var i = -1;
		var x, y;

		while(++i < input.length){
			x = input.charCodeAt(i);
			y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
			if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF){
				x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
				i++;
			}

			if(x <= 0x7F)
				output += String.fromCharCode(x);
			else if(x <= 0x7FF)
				output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F), 0x80 | (x & 0x3F));
			else if(x <= 0xFFFF)
				output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
			else if(x <= 0x1FFFFF)
				output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3F), 0x80 | ((x >>> 6) & 0x3F), 0x80 | (x & 0x3F));
		}
		return output;
	};

	return base;
});

define('xide/encoding/MD5',["./_base"], function(base) {

/*	A port of Paul Johnstone's MD5 implementation
 *	http://pajhome.org.uk/crypt/md5/index.html
 *
 *	Copyright (C) Paul Johnston 1999 - 2002.
 *	Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * 	Distributed under the BSD License
 *
 *	Dojo port by Tom Trenka
 */

	var chrsz=8;

	//	MD5 rounds functions
	function R(n,c){ return (n<<c)|(n>>>(32-c)); }
	function C(q,a,b,x,s,t){ return base.addWords(R(base.addWords(base.addWords(a, q), base.addWords(x, t)), s), b); }
	function FF(a,b,c,d,x,s,t){ return C((b&c)|((~b)&d),a,b,x,s,t); }
	function GG(a,b,c,d,x,s,t){ return C((b&d)|(c&(~d)),a,b,x,s,t); }
	function HH(a,b,c,d,x,s,t){ return C(b^c^d,a,b,x,s,t); }
	function II(a,b,c,d,x,s,t){ return C(c^(b|(~d)),a,b,x,s,t); }

	//	the core MD5 rounds method
	function core(x,len){
		x[len>>5]|=0x80<<((len)%32);
		x[(((len+64)>>>9)<<4)+14]=len;
		var a= 1732584193;
		var b=-271733879;
		var c=-1732584194;
		var d= 271733878;
		for(var i=0; i<x.length; i+=16){
			var olda=a;
			var oldb=b;
			var oldc=c;
			var oldd=d;

			a=FF(a,b,c,d,x[i+ 0],7 ,-680876936);
			d=FF(d,a,b,c,x[i+ 1],12,-389564586);
			c=FF(c,d,a,b,x[i+ 2],17, 606105819);
			b=FF(b,c,d,a,x[i+ 3],22,-1044525330);
			a=FF(a,b,c,d,x[i+ 4],7 ,-176418897);
			d=FF(d,a,b,c,x[i+ 5],12, 1200080426);
			c=FF(c,d,a,b,x[i+ 6],17,-1473231341);
			b=FF(b,c,d,a,x[i+ 7],22,-45705983);
			a=FF(a,b,c,d,x[i+ 8],7 , 1770035416);
			d=FF(d,a,b,c,x[i+ 9],12,-1958414417);
			c=FF(c,d,a,b,x[i+10],17,-42063);
			b=FF(b,c,d,a,x[i+11],22,-1990404162);
			a=FF(a,b,c,d,x[i+12],7 , 1804603682);
			d=FF(d,a,b,c,x[i+13],12,-40341101);
			c=FF(c,d,a,b,x[i+14],17,-1502002290);
			b=FF(b,c,d,a,x[i+15],22, 1236535329);

			a=GG(a,b,c,d,x[i+ 1],5 ,-165796510);
			d=GG(d,a,b,c,x[i+ 6],9 ,-1069501632);
			c=GG(c,d,a,b,x[i+11],14, 643717713);
			b=GG(b,c,d,a,x[i+ 0],20,-373897302);
			a=GG(a,b,c,d,x[i+ 5],5 ,-701558691);
			d=GG(d,a,b,c,x[i+10],9 , 38016083);
			c=GG(c,d,a,b,x[i+15],14,-660478335);
			b=GG(b,c,d,a,x[i+ 4],20,-405537848);
			a=GG(a,b,c,d,x[i+ 9],5 , 568446438);
			d=GG(d,a,b,c,x[i+14],9 ,-1019803690);
			c=GG(c,d,a,b,x[i+ 3],14,-187363961);
			b=GG(b,c,d,a,x[i+ 8],20, 1163531501);
			a=GG(a,b,c,d,x[i+13],5 ,-1444681467);
			d=GG(d,a,b,c,x[i+ 2],9 ,-51403784);
			c=GG(c,d,a,b,x[i+ 7],14, 1735328473);
			b=GG(b,c,d,a,x[i+12],20,-1926607734);

			a=HH(a,b,c,d,x[i+ 5],4 ,-378558);
			d=HH(d,a,b,c,x[i+ 8],11,-2022574463);
			c=HH(c,d,a,b,x[i+11],16, 1839030562);
			b=HH(b,c,d,a,x[i+14],23,-35309556);
			a=HH(a,b,c,d,x[i+ 1],4 ,-1530992060);
			d=HH(d,a,b,c,x[i+ 4],11, 1272893353);
			c=HH(c,d,a,b,x[i+ 7],16,-155497632);
			b=HH(b,c,d,a,x[i+10],23,-1094730640);
			a=HH(a,b,c,d,x[i+13],4 , 681279174);
			d=HH(d,a,b,c,x[i+ 0],11,-358537222);
			c=HH(c,d,a,b,x[i+ 3],16,-722521979);
			b=HH(b,c,d,a,x[i+ 6],23, 76029189);
			a=HH(a,b,c,d,x[i+ 9],4 ,-640364487);
			d=HH(d,a,b,c,x[i+12],11,-421815835);
			c=HH(c,d,a,b,x[i+15],16, 530742520);
			b=HH(b,c,d,a,x[i+ 2],23,-995338651);

			a=II(a,b,c,d,x[i+ 0],6 ,-198630844);
			d=II(d,a,b,c,x[i+ 7],10, 1126891415);
			c=II(c,d,a,b,x[i+14],15,-1416354905);
			b=II(b,c,d,a,x[i+ 5],21,-57434055);
			a=II(a,b,c,d,x[i+12],6 , 1700485571);
			d=II(d,a,b,c,x[i+ 3],10,-1894986606);
			c=II(c,d,a,b,x[i+10],15,-1051523);
			b=II(b,c,d,a,x[i+ 1],21,-2054922799);
			a=II(a,b,c,d,x[i+ 8],6 , 1873313359);
			d=II(d,a,b,c,x[i+15],10,-30611744);
			c=II(c,d,a,b,x[i+ 6],15,-1560198380);
			b=II(b,c,d,a,x[i+13],21, 1309151649);
			a=II(a,b,c,d,x[i+ 4],6 ,-145523070);
			d=II(d,a,b,c,x[i+11],10,-1120210379);
			c=II(c,d,a,b,x[i+ 2],15, 718787259);
			b=II(b,c,d,a,x[i+ 9],21,-343485551);

			a=base.addWords(a, olda);
			b=base.addWords(b, oldb);
			c=base.addWords(c, oldc);
			d=base.addWords(d, oldd);
		}
		return [a,b,c,d];
	}

	function hmac(data, key){
		var wa=base.stringToWord(key);
		if(wa.length>16){
			wa=core(wa, key.length*chrsz);
		}
		var l=[], r=[];
		for(var i=0; i<16; i++){
			l[i]=wa[i]^0x36363636;
			r[i]=wa[i]^0x5c5c5c5c;
		}
		var h=core(l.concat(base.stringToWord(data)), 512+data.length*chrsz);
		return core(r.concat(h), 640);
	}

	//	public function
	base.MD5=function(/* string */data, /* dojox.encoding.digests.outputTypes? */outputType){
		// summary:
		//		computes the digest of data, and returns the result according to type outputType
		var out=outputType || base.outputTypes.Base64;
		var wa=core(base.stringToWord(data), data.length*chrsz);
		switch(out){
			case base.outputTypes.Raw:{
				return wa;	//	word[]
			}
			case base.outputTypes.Hex:{
				return base.wordToHex(wa);	//	string
			}
			case base.outputTypes.String:{
				return base.wordToString(wa);	//	string
			}
			default:{
				return base.wordToBase64(wa);	//	string
			}
		}
	};

	//	make this private, for later use with a generic HMAC calculator.
	base.MD5._hmac=function(/* string */data, /* string */key, /* dojox.encoding.digests.outputTypes? */outputType){
		// summary:
		//		computes the digest of data, and returns the result according to type outputType
		var out=outputType || base.outputTypes.Base64;
		var wa=hmac(data, key);
		switch(out){
			case base.outputTypes.Raw:{
				return wa;	//	word[]
			}
			case base.outputTypes.Hex:{
				return base.wordToHex(wa);	//	string
			}
			case base.outputTypes.String:{
				return base.wordToString(wa);	//	string
			}
			default:{
				return base.wordToBase64(wa);	//	string
			}
		}
	};

	return base.MD5;
});

define('xide/data/_Base',[
    "dojo/_base/declare",
    'dstore/Memory',
    'dstore/Tree',
    'dstore/QueryResults',
    'xide/mixins/EventedMixin',
    'xide/encoding/MD5',
    'xdojo/has'
], function (declare, Memory, Tree, QueryResults,EventedMixin,MD5,has) {
    return declare("xide/data/_Base",EventedMixin, {
        __all:null,
        allowCache:true,
        constructor: function () {
            var store = this;
            if (store._getQuerierFactory('filter') || store._getQuerierFactory('sort')) {

                this.queryEngine = function (query, options) {
                    options = options || {};

                    var filterQuerierFactory = store._getQuerierFactory('filter');
                    var filter = filterQuerierFactory ? filterQuerierFactory(query) : passthrough;

                    var sortQuerierFactory = store._getQuerierFactory('sort');
                    var sort = passthrough;
                    if (sortQuerierFactory) {
                        sort = sortQuerierFactory(arrayUtil.map(options.sort, function (criteria) {
                            return {
                                property: criteria.attribute,
                                descending: criteria.descending
                            };
                        }));
                    }

                    var range = passthrough;
                    if (!isNaN(options.start) || !isNaN(options.count)) {
                        range = function (data) {
                            var start = options.start || 0,
                                count = options.count || Infinity;

                            var results = data.slice(start, start + count);
                            results.total = data.length;
                            return results;
                        };
                    }

                    return function (data) {
                        return range(sort(filter(data)));
                    };
                };
            }
            var objectStore = this;
            // we call notify on events to mimic the old dojo/store/Trackable
            store.on('add,update,delete', function (event) {
                var type = event.type;
                var target = event.target;
                objectStore.notify(
                    (type === 'add' || type === 'update') ? target : undefined,
                    (type === 'delete' || type === 'update') ?
                        ('id' in event ? event.id : store.getIdentity(target)) : undefined);
            });
        },
        destroy:function(){
            this._emit('destroy',this);
        },
        notify: function () {
        },
        refreshItem:function(item){
            this.emit('update', {
                target: item
            });
        },
        _queryCache:null,
        query: function (query, options,allowCache) {
            var hash = query ? MD5(JSON.stringify(query),1) : null;
            if(!has('xcf-ui') && hash && !has('host-node') && allowCache!==false){
                !this._queryCache && (this._queryCache={});
                if(this._queryCache[hash]){
                    return this._queryCache[hash];
                }
            };
            /*
            if(!query && !options && allowCache!==false && this.allowCache){
                return this.data;
            }*/

            // summary:
            //		Queries the store for objects. This does not alter the store, but returns a
            //		set of data from the store.
            // query: String|Object|Function
            //		The query to use for retrieving objects from the store.
            // options: dstore/api/Store.QueryOptions
            //		The optional arguments to apply to the resultset.
            // returns: dstore/api/Store.QueryResults
            //		The results of the query, extended with iterative methods.
            //
            // example:
            //		Given the following store:
            //
            //	...find all items where "prime" is true:
            //
            //	|	store.query({ prime: true }).forEach(function(object){
            //	|		// handle each object
            //	|	});
            options = options || {};
            query = query || {};

            var results = this.filter(query);
            var queryResults;

            // Apply sorting
            var sort = options.sort;
            if (sort) {
                if (Object.prototype.toString.call(sort) === '[object Array]') {
                    var sortOptions;
                    while ((sortOptions = sort.pop())) {
                        results = results.sort(sortOptions.attribute, sortOptions.descending);
                    }
                } else {
                    results = results.sort(sort);
                }
            }

            var tracked;
            var _track = false;
            if (_track && results.track && !results.tracking) {
                // if it is trackable, always track, so that observe can
                // work properly.
                results = results.track();
                tracked = true;
            }
            if ('start' in options) {
                // Apply a range
                var start = options.start || 0;
                // object stores support sync results, so try that if available
                queryResults = results[results.fetchRangeSync ? 'fetchRangeSync' : 'fetchRange']({
                    start: start,
                    end: options.count ? (start + options.count) : Infinity
                });
                queryResults.total = queryResults.totalLength;
            }
            queryResults = queryResults || new QueryResults(results[results.fetchSync ? 'fetchSync' : 'fetch']());
            queryResults.observe = function (callback, includeObjectUpdates) {
                // translate observe to event listeners
                function convertUndefined(value) {
                    if (value === undefined && tracked) {
                        return -1;
                    }
                    return value;
                }

                var addHandle = results.on('add', function (event) {
                    callback(event.target, -1, convertUndefined(event.index));
                });
                var updateHandle = results.on('update', function (event) {
                    if (includeObjectUpdates || event.previousIndex !== event.index || !isFinite(event.index)) {
                        callback(event.target, convertUndefined(event.previousIndex), convertUndefined(event.index));
                    }
                });
                var removeHandle = results.on('delete', function (event) {
                    callback(event.target, convertUndefined(event.previousIndex), -1);
                });
                var handle = {
                    remove: function () {
                        addHandle.remove();
                        updateHandle.remove();
                        removeHandle.remove();
                    }
                };
                handle.cancel = handle.remove;
                return handle;
            };
            if(!has('xcf-ui') && hash && !has('host-node') && allowCache!==false){
                this._queryCache[hash]=queryResults;
            };
            return queryResults;
        }
    });
});
define('xide/data/Memory',[
    "dojo/_base/declare",
	'dstore/Memory',
    'xide/data/_Base'
], function (declare, Memory,_Base) {
    return declare('xide.data.Memory',[Memory, _Base], {});
});

define('xide/utils/StoreUtils',[
    'xide/utils',
    'xide/data/Memory',
    'dojo/_base/kernel'
], function (utils, Memory,dojo) {
    "use strict";
    /**
     *
     * @param store
     * @param item
     * @param recursive
     * @param idAttribute
     * @param parentAttr
     */
    utils.removeFromStore = function (store, item, recursive, idAttribute, parentAttr) {
        //remove the item itself
        store.removeSync(item[idAttribute]);
        //remove children recursively
        var query = {};
        query[parentAttr] = item[idAttribute];
        var items = store.query(query);
        if (items && items.length) {
            for (var i = 0; i < items.length; i++) {
                utils.removeFromStore(store, items[i], recursive, idAttribute, parentAttr);
            }
        }
    };
    /**
     * CI related tools.
     * @param val {string|array|null}
     * @returns {string|null}
     */
    utils.toString = function (val) {
        if (val !== null) {
            if (!dojo.isArray(val)) {
                return '' + val;
            }
            if (val && val.length == 1 && val[0] == null) {
                return null;
            }
            return '' + (val[0] !== null ? val[0] : val);
        }
        return null;
    };
    utils.toBoolean = function (data) {
        var resInt = false;
        if (data !== null) {
            var _dataStr = data[0] ? data[0] : data;
            if (_dataStr !== null) {
                resInt = !!(( _dataStr === true || _dataStr === 'true' || _dataStr === '1'));
            }
        }
        return resInt;
    };
    utils.toObject = function (data) {
        if (data !== null) {
            return data[0] ? data[0] : data;
        }
        return null;
    };
    utils.toInt = function (data) {
        if(_.isNumber(data)){
            return data;
        }
        var resInt = -1;
        if (data!=null) {
            var _dataStr = data.length > 1 ? data : data[0] ? data[0] : data;
            if (_dataStr !== null) {
                try {
                    resInt = parseInt(_dataStr, 10);
                } catch (e) {
                }
            }
        }
        return resInt;
    };
    /***
     *
     * @param store
     * @param id
     * @return {null}
     */
    utils.getStoreItemById = function (store, id) {
        return utils.queryStoreEx(store, {id: id},null,null);
    };
    /***
     *
     * @param store
     * @param id
     * @param type
     * @return {null}
     */
    utils.getAppDataElementByIdAndType = function (store, id, type) {
        return utils.queryStore(store, {uid: id, type: type},null,null);
    };
    /***
     *
     * @param store
     * @param type
     * @return {null}
     */
    utils.getElementsByType = function (store, type) {
        return utils.queryStoreEx(store, {type: type});
    };


    /***
     * @param store {module:xide/data/_Base} Store to query
     * @param query {object} Literal to match
     * @param nullEmpty {boolean|null} Return null if nothing has been found
     * @param single {boolean|null} Return first entry
     * @returns {*}
     */
    utils.queryStoreEx = function (store, query, nullEmpty, single) {
        if (!store) {
            console.error('utils.queryStoreEx: store = null');
            return null;
        }
        if (store instanceof Memory) {
            var result = utils.queryMemoryStoreEx(store, query);
            if (single && result && result[0]) {
                return result[0];
            }
            return result;
        }
        var res = null;
        if (store.query) {
            res = store.query(query);
        }
        if (nullEmpty === true) {
            if (res && res.length === 0) {
                return null;
            }
        }
        if (single === true) {
            if (res && res.length == 1) {
                return res[0];
            }
        }
        return res;
    };

    /**
     *
     * @param store
     * @param query
     * @param nullEmpty {boolean|null}
     * @returns {*}
     */
    utils.queryStore = function (store, query, nullEmpty) {
        var res = utils.queryStoreEx(store, query,null,null);
        if (res && res.length == 1) {
            return res[0];
        }
        if (nullEmpty !== null && nullEmpty === true) {
            if (res && res.length === 0) {
                return null;
            }
        }
        return res;
    };

    /**
     *
     * @param store
     * @param query
     * @returns {Array}
     */
    utils.queryMemoryStoreEx = function (store, query) {
        var result = [];
        store.query(query).forEach(function (entry) {
            result.push(entry);
        });
        return result;
    };

    utils.queryMemoryStoreSingle = function (store, query) {
        var result = utils.queryMemoryStoreEx(store, query);
        if (result.length == 1) {
            return result[0];
        }
        return result;
    };

    return utils;
});
/** module:xide/registry **/
define('xide/registry',[
	"dojo/_base/array", // array.forEach array.map
	"dojo/_base/window", // win.body
    "xdojo/has"
], function(array, win, has){
	/**
	 * @TODOS:
	 * - add namespaces
	 * - remove window
	 * - augment consumer API
	 * - use std array
	 * - add framework constraint
	 * - move dom api out of here
	 * - define widget.id better
	 * - add search by class
     */
	var _widgetTypeCtr = {}, hash = {};
	var registry =  {
		// summary:
		//		Registry of existing widget on page, plus some utility methods.

		// length: Number
		//		Number of registered widgets
		length: 0,
		add: function(widget){
			// summary:
			//		Add a widget to the registry. If a duplicate ID is detected, a error is thrown.
			// widget: dijit/_WidgetBase
			//		Any dijit/_WidgetBase subclass.
			if(this._hash[widget.id]){
                if(has('xblox')) {
                    this.remove(widget.id);
                    this.add(widget);
                }else{
                    throw new Error("Tried to register widget with id==" + widget.id + " but that id is already registered");
                }
			}
			hash[widget.id] = widget;
			this.length++;
		},
		/**
		 * Remove a widget from the registry. Does not destroy the widget; simply
		 * removes the reference.
		 * @param id
         */
		remove: function(id){
			if(hash[id]){
				delete hash[id];
				this.length--;
			}
		},
		/**
		 *
		 * @param id {String|Widget}
		 * @returns {String|Widget}
         */
		byId: function( id){
			// summary:
			//		Find a widget by it's id.
			//		If passed a widget then just returns the widget.
			return typeof id == "string" ? hash[id] : id;	// dijit/_WidgetBase
		},
		byNode: function(/*DOMNode*/ node){
			// summary:
			//		Returns the widget corresponding to the given DOMNode
			return hash[node.getAttribute("widgetId")]; // dijit/_WidgetBase
		},

		/**
		 * Convert registry into a true Array
		 * @example:
		 *	Work with the widget .domNodes in a real Array
		 *	array.map(registry.toArray(), function(w){ return w.domNode; });
		 * @returns {obj[]}
         */
		toArray: function(){
			return _.values(_.mapKeys(hash, function(value, key) { value.id = key; return value; }));
		},
		/**
		 * Generates a unique id for a given widgetType
		 * @param widgetType {string}
		 * @returns {string}
         */
		getUniqueId: function(widgetType){
			var id;
			do{
				id = widgetType + "_" +
					(widgetType in _widgetTypeCtr ?
						++_widgetTypeCtr[widgetType] : _widgetTypeCtr[widgetType] = 0);
			}while(hash[id]);
			return id;
		},
		/**
		 * Search subtree under root returning widgets found.
		 * Doesn't search for nested widgets (ie, widgets inside other widgets).
		 * @param root {HTMLElement} Node to search under.
		 * @param skipNode {HTMLElement} If specified, don't search beneath this node (usually containerNode).
         * @returns {Array}
         */
		findWidgets: function(root, skipNode){
			var outAry = [];
			function getChildrenHelper(root){
				for(var node = root.firstChild; node; node = node.nextSibling){
					if(node.nodeType == 1){
						var widgetId = node.getAttribute("widgetId");
						if(widgetId){
							var widget = hash[widgetId];
							if(widget){	// may be null on page w/multiple dojo's loaded
								outAry.push(widget);
							}
						}else if(node !== skipNode){
							getChildrenHelper(node);
						}
					}
				}
			}
			getChildrenHelper(root);
			return outAry;
		},
		_destroyAll: function(){
			// summary:
			//		Code to destroy all widgets and do other cleanup on page unload

			// Clean up focus manager lingering references to widgets and nodes
			// Destroy all the widgets, top down
			_.each(registry.findWidgets(win.body()),function(widget){
				// Avoid double destroy of widgets like Menu that are attached to <body>
				// even though they are logically children of other widgets.
				if(!widget._destroyed){
					if(widget.destroyRecursive){
						widget.destroyRecursive();
					}else if(widget.destroy){
						widget.destroy();
					}
				}
			});
		},
		getEnclosingWidget: function(/*DOMNode*/ node){
			// summary:
			//		Returns the widget whose DOM tree contains the specified DOMNode, or null if
			//		the node is not contained within the DOM tree of any widget
			while(node){
				var id = node.nodeType == 1 && node.getAttribute("widgetId");
				if(id){
					return hash[id];
				}
				node = node.parentNode;
			}
			return null;
		},

		// In case someone needs to access hash.
		// Actually, this is accessed from WidgetSet back-compatibility code
		_hash: hash
	};
	return registry;
});

define('xide/utils/WidgetUtils',[
    'xide/utils',
    'xide/types',
    'xide/registry'
], function (utils,types,registry) {
    "use strict";
    utils.getParentWidget=function(start,declaredClass,max){
        //sanitize start
        start = start.containerNode || start.domNode || start;
        var i = 0,
            element = start,
            widget = null,
            _max = max || 10,
            _lastWidget = null;

        while (i < _max && !widget) {
            if (element) {
                element = element.parentNode;
                var _widgetById = registry.byId(element.id);
                var _widget = _widgetById || registry.getEnclosingWidget(element);
                _widget && (_lastWidget = _widget);
                if(_widget && declaredClass &&  _widget.declaredClass && _widget.declaredClass.indexOf(declaredClass)!=-1){
                    widget = _widget;
                }
            }
            i++;
        }
        return widget;
    };
    /**
     *
     * @param type
     * @returns {string}
     */
    utils.getWidgetType = function (type) {
        var res = "";
        var root = 'xide.widgets.';
        if (type == types.ECIType.ENUMERATION) {
            res = root  + "Select";
        }
        if (type == types.ECIType.STRING) {
            res = root  + "TextBox";
        }

        if (type == types.ECIType.ICON) {
            res = root  + "TextBox";
        }

        if (type == types.ECIType.REFERENCE) {
            res = root  + "Button";
        }

        if (type == types.ECIType.EXPRESSION) {
            res = root  + "Expression";
        }

        if (type == types.ECIType.EXPRESSION_EDITOR) {
            res = root  + "ExpressionEditor";
        }

        if (type == types.ECIType.ARGUMENT) {
            res = root  + "ArgumentsWidget";
        }

        if (type == types.ECIType.WIDGET_REFERENCE) {
            res = root  + "WidgetReference";
        }

        if (type == types.ECIType.BLOCK_REFERENCE) {
            res =root  +  "BlockPickerWidget";
        }

        if (type == types.ECIType.BLOCK_SETTINGS) {
            res = root  + "BlockSettingsWidget";
        }

        if (type == types.ECIType.DOM_PROPERTIES) {
            res = root  + "DomStyleProperties";
        }

        if (type == types.ECIType.FILE_EDITOR) {
            res = root  + "FileEditor";
        }

        return res;
    };
    return utils;
});
define('xide/utils/CIUtils',[
    'xide/utils',
    'xide/types',
    'xide/factory',
    'dojo/has',
    'xide/lodash'
],function(utils,types,factory,has,_){
    "use strict";
    /**
     *
     * @param cis
     * @returns {Array}
     */
    utils.toOptions  = function(cis){
        cis = utils.flattenCIS(cis);
        var result = [];
        for (var i = 0; i < cis.length; i++) {
            var ci = cis[i];
            result.push({
                name:utils.toString(ci['name']),
                value:utils.getCIValue(ci),
                type: utils.toInt(ci['type']),
                enumType:utils.toString(ci['enumType']),
                visible:utils.toBoolean(ci['visible']),
                active:utils.toBoolean(ci['active']),
                changed:utils.toBoolean(ci['changed']),
                group:utils.toString(ci['group']),
                user:utils.toObject(ci['user']),
                dst:utils.toString(ci['dst']),
                params:utils.toString(ci['params'])
            })
        }
        return result;
    };

    if(has('xideve') || has('xblox-ui')) {
        utils.getEventsAsOptions = function (selected) {
            var result = [
                {label: "Select Event", value: ""}
            ];
            for (var e in types.EVENTS) {
                var label = types.EVENTS[e];

                var item = {
                    label: label,
                    value: types.EVENTS[e]
                };
                result.push(item);
            }
            result = result.concat(
                [{label: "onclick", value: "onclick"},
                    {label: "ondblclick", value: "dblclick"},
                    {label: "onmousedown", value: "mousedown"},
                    {label: "onmouseup", value: "mouseup"},
                    {label: "onmouseover", value: "mouseover"},
                    {label: "onmousemove", value: "mousemove"},
                    {label: "onmouseout", value: "mouseout"},
                    {label: "onkeypress", value: "keypress"},
                    {label: "onkeydown", value: "keydown"},
                    {label: "onkeyup", value: "keyup"},
                    {label: "onfocus", value: "focus"},
                    {label: "onblur", value: "blur"},
                    {label: "On Load", value: "Load"}
                ]);
            //select the event we are listening to
            for (var i = 0; i < result.length; i++) {
                var obj = result[i];
                if (obj.value === selected) {
                    obj.selected = true;
                    break;
                }
            }
            return result;
        };
    }

    utils.flattenCIS  = function(cis){
        var addedCIS = [];
        var removedCIs = [];
        for (var i = 0; i < cis.length; i++) {
            var ci = cis[i];

            var ciType = utils.toInt(ci.type);

            if(ciType > types.ECIType.END){//type is higher than core types, try to resolve it
                var resolved = types.resolveType(ciType);
                if(resolved){
                    utils.mixin(addedCIS,resolved);
                    removedCIs.push(ci);
                }
            }
        }
        if(addedCIS.length>0){
            cis = cis.concat(addedCIS);
        }
        if(removedCIs){
            for(var i in removedCIs){
                cis.remove(removedCIs[i]);
            }
        }
        return cis;
    };

    utils.arrayContains=function(array,element){
        for (var i = 0; i < array.length; i++){
            var _e = array[i];
            if(_e===element){
                return true;
            }
        }
        return false;
    };

    utils.setStoreCIValueByField = function (d, field, value) {
        if (d[field] == null) {
            d[field] = [];
        }
        d[field][0] = utils.getStringValue(value);
        return d;
    };
    /**
     *
     * @param label
     * @param value
     * @param extra
     * @returns {Object}
     */
    utils.createOption=function(label,value,extra){
        return utils.mixin({
            label:label,
            value:value !=null ? value : label
        },extra);
    };
    /**
     *
     * @param name
     * @param type
     * @param value
     * @param args
     * @param settings
     * @returns {{dataRef: null, dataSource: null, name: *, group: number, id: *, title: *, type: *, uid: number, value: *, visible: boolean, enumType: number, class: string}}
     */
    utils.createCI = function (name, type, value,args,settings) {
        var res = {
            dataRef:null,
            dataSource:null,
            name:name,
            group:-1,
            id:name,
            title:name,
            type:type,
            uid:-1,
            value: value!=null ? value : -1,
            visible:true,
            enumType:-1,
            "class":"cmx.types.ConfigurableInformation"
        };
        utils.mixin(res,args);
        if(settings){
            if(settings.publish){
                factory.publish(settings.publish,{
                    CI:res,
                    owner:settings.owner
                },settings.owner);
            }
        }
        return res;
    };

    utils.createCIAsArray = function (name, type, chain,value) {
        return {
            chainType:[chain ? chain : 0],
            dataRef:[null],
            dataSource:[null],
            params:[],
            name:[name],
            group:[-1],
            id:[name],
            title:[name],
            type:[type],
            uid:[-1],
            value: [value ? value : -1],
            visible:[true],
            enumType:[-1],
            parentId:[-1],
            "class":["cmx.types.ConfigurableInformation"]
        };
    };

    utils.hasValue = function (data){
        return data.value &&  data.value[0] !=null && data.value[0].length > 0 && data.value[0] !="0" && data.value[0] !="undefined" && data.value[0] !="Unset";
    };

    utils.hasValueAndDataRef = function (data){
        return data.value &&  data.value[0] !=null && data.value[0].length > 0 && data.value[0] !="0" && data.value[0] !="undefined" && data.value[0] !="Unset" &&
            data.dataRef &&  data.dataRef[0] !=null && data.dataRef[0].length > 0 && data.dataRef[0] !="0" && data.dataRef[0] !="undefined";
    };

    utils.getInputCIByName = function (data,name){
        if(!data){
            return null;
        }
        var chain = 0;
        var dstChain = chain == 0 ? data.inputs : chain == 1 ? data.outputs : null;
        if(!dstChain){//has no chains, be nice
            dstChain=data;
        }
        if (dstChain != null) {
            for (var i = 0; i < dstChain.length; i++) {
                var ci = dstChain[i];
                var _n = utils.getStringValue(ci.name);
                if (_n!=null && _n.toLowerCase() === name.toLowerCase()){
                    return ci;
                }
            }
        }
        return null;
    };
    /***
     *
     * @param data
     * @param chain
     * @param name
     * @returns {*}
     */
    utils.getCIByChainAndName = function (data, chain, name) {
        if(!data){
            return null;
        }
        var dstChain = chain == 0 ? data.inputs : chain == 1 ? data.outputs : null;
        if(!dstChain){//has no chains
            dstChain=data;
        }
        if (dstChain != null) {
            for (var i = 0; i < dstChain.length; i++) {
                var ci = dstChain[i];
                var _n = utils.getStringValue(ci.name);
                if (_n!=null && _n.toLowerCase() === name.toLowerCase()){
                    return ci;
                }
            }
        }
        return null;
    };
    utils.getCIByUid= function (dstChain, uid) {
        if (dstChain != null) {
            for (var i = 0; i < dstChain.length; i++) {
                var ci = dstChain[i];
                var _n = utils.getStringValue(ci.uid);
                if (_n!=null && _n === uid)
                {
                    return ci;
                }
            }
        }
        return null;
    };
    utils.getCIById= function (data, chain, id) {
        var dstChain = chain == 0 ? data.inputs : chain == 1 ? data.outputs : null;
        if (dstChain != null) {
            for (var i = 0; i < dstChain.length; i++) {
                var ci = dstChain[i];
                if (ci.id[0] == id[0]  )
                    return ci;
            }
        }
        return null;
    };
    utils.getCIInputValueByName = function (data, name) {
        var ci = utils.getCIByChainAndName(data, 0, name);
        if (ci) {
            return ci.value;
        }
        return null;
    };
    utils.getCIValue = function (data){
        return utils.getCIValueByField(data,"value");
    };
    utils.getStringValue = function (d){
        return utils.toString(d);
    };
    utils.toString = function (d){
        if (d != null) {
            if(!_.isArray(d))
            {
                return ''+ d;
            }
            if(d && d.length==1 && d[0]==null)
            {
                return null;
            }
            return '' + (d[0] !=null ? d[0] : d);
        }
        return null;
    };
    utils.setIntegerValue = function (data,value){
        if (data != null) {

            if(dojo.isArray(data))
            {
                data[0]=value;
            }else{
                data=value;
            }
        }
    };

    utils.getCIValueByField = function (data, field) {
        if (data[field] != null) {
            if(_.isArray(data[field])){
                return data[field][0] ? data[field][0] : data[field];
            }else{
                return data[field];
            }
        }
        return null;
    };
    utils.setCIValueByField = function (data, field, value) {
        if(!data){
            return data;
        }
        if (data[field] == null) {
            data[field] = [];
        }
        data[field]=value
        return data;
    };

    utils.setCIValue = function (data, field, value) {
        var ci = utils.getInputCIByName(data,field);
        if(ci){
            utils.setCIValueByField(ci,'value',value);
        }
        return ci;
    };
    utils.getCIInputValueByNameAndField = function (data, name, field) {
        var ci = utils.getCIByChainAndName(data, 0, name);
        if (ci) {
            return ci["" + field];
        }
        return null;
    };

    utils.getCIInputValueByNameAndFieldStr = function (data, name, field) {
        var rawValue = utils.getCIInputValueByNameAndField(data,name,field);
        if(rawValue){
            return utils.getStringValue(rawValue);
        }
        return null;
    };
    utils.getCIInputValueByNameAndFieldBool = function (data, name, field) {
        var rawValue = utils.getCIInputValueByNameAndField(data,name,field);
        if(rawValue){
            return utils.toBoolean(rawValue);
        }
        return null;
    };
    utils.getCIWidgetByName=function(cis,name){

        for (var i = 0; i < cis.length; i++) {
            var ci = cis[i];
            if(ci['_widget'] && ci.name===name){
                return ci['_widget'];
            }
        }
        return null;
    };
    return utils;
});
define('xide/utils/ObjectUtils',[
    'xide/utils',
    'require',
    "dojo/Deferred",
    'xide/lodash'
], function (utils, require, Deferred,lodash) {
    var _debug = false;
    "use strict";
    /////////////////////////////////////////////////////////////////////////////////////////////
    //
    //  Loader utils
    //
    //////////////////////////////////////////////////////////////////////////////////////////////
    utils.debounce = function(who,methodName,_function,delay,options,now,args){
        var _place = who[methodName+'_debounced'];
        if(!_place){
            _place = who[methodName+'_debounced'] =  lodash.debounce(_function, delay,options);
        }
        if(now===true){
            if(!who[methodName+'_debouncedFirst']){
                who[methodName+'_debouncedFirst']=true;
                _function.apply(who,args);
            }
        }
        return _place();
    };


    utils.pluck=function(items,prop){
        return lodash.map(items,prop);
    };

    /**
     * Trigger downloadable file
     * @param filename
     * @param text
     */
    utils.download  = function(filename, text){
        var element = document.createElement('a');
        text = lodash.isString(text) ? text : JSON.stringify(text,null,2);
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    /**
     * Ask require registry at this path
     * @param mixed
     * @returns {*}
     */
    utils.hasObject = function (mixed) {
        var result = null;
        var _re = require;
        try {
            result = _re(mixed);
        } catch (e) {
            console.error('error in utils.hasObject ', e);
        }
        return result;
    };
    /**
     * Returns a module by module path
     * @param mixed {String|Object}
     * @param _default {Object} default object
     * @returns {Object|Promise}
     */
    utils.getObject = function (mixed, _default) {
        var result = null;
        if (utils.isString(mixed)) {
            var _re = require;
            try {
                result = _re(mixed);
            } catch (e) {
                _debug && console.warn('utils.getObject::require failed for ' + mixed);
            }
            //not a loaded module yet
            try {
                if (!result) {

                    var deferred = new Deferred();
                    //try loader
                    result = _re([
                        mixed
                    ], function (module) {
                        deferred.resolve(module);
                    });
                    return deferred.promise;
                }
            }catch(e){
                _debug &&  console.error('error in requiring '+mixed,e);
            }
            return result;

        } else if (utils.isObject(mixed)) {
            return mixed;//reflect
        }
        return result !== null ? result : _default;
    };


    /////////////////////////////////////////////////////////////////////////////////////////////
    //
    //  True object utils
    //
    //////////////////////////////////////////////////////////////////////////////////////////////
    utils.toArray = function (obj) {
        var result = [];
        for (var c in obj) {
            result.push({
                name: c,
                value: obj[c]
            });
        }
        return result;
    };
    /**
     * Array to object conversion
     * @param arr
     * @returns {Object}
     */
    utils.toObject = function (arr, lodash) {
        if (!arr) {
            return {};
        }
        if (lodash !== false) {
            return lodash.object(lodash.map(arr, lodash.values));
        } else {
            //CI related back compat hack
            if (utils.isObject(arr) && arr[0]) {
                return arr[0];
            }

            var rv = {};
            for (var i = 0; i < arr.length; ++i) {
                rv[i] = arr[i];
            }
            return rv;
        }
    };

    /**
     * Gets an object property by string, eg: utils.byString(someObj, 'part3[0].name');
     * @deprecated, see objectAtPath below
     * @param o {Object}    : the object
     * @param s {String}    : the path within the object
     * @param defaultValue {Object|String|Number} : an optional default value
     * @returns {*}
     */
    utils.byString = function (o, s, defaultValue) {
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, '');           // strip a leading dot
        var a = s.split('.');
        while (a.length) {
            var n = a.shift();
            if (n in o) {
                o = o[n];
            } else {
                return;
            }
        }
        return o;
    };

    /////////////////////////////////////////////////////////////////////////////////////////////
    //
    //  Object path
    //
    //////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * Internals
     */

    //cache
    var toStr = Object.prototype.toString,
        _hasOwnProperty = Object.prototype.hasOwnProperty;

    /**
     * @private
     * @param type
     * @returns {*}
     */
    function toString(type) {
        return toStr.call(type);
    }

    /**
     * @private
     * @param key
     * @returns {*}
     */
    function getKey(key) {
        var intKey = parseInt(key,10);
        if (intKey.toString() === key) {
            return intKey;
        }
        return key;
    }

    /**
     * internal set value at path in object
     * @private
     * @param obj
     * @param path
     * @param value
     * @param doNotReplace
     * @returns {*}
     */
    function set(obj, path, value, doNotReplace) {
        if (lodash.isNumber(path)) {
            path = [path];
        }
        if (lodash.isEmpty(path)) {
            return obj;
        }
        if (lodash.isString(path)) {
            return set(obj, path.split('.').map(getKey), value, doNotReplace);
        }
        var currentPath = path[0];

        if (path.length === 1) {
            var oldVal = obj[currentPath];
            if (oldVal === void 0 || !doNotReplace) {
                obj[currentPath] = value;
            }
            return oldVal;
        }

        if (obj[currentPath] === void 0) {
            //check if we assume an array
            if (lodash.isNumber(path[1])) {
                obj[currentPath] = [];
            } else {
                obj[currentPath] = {};
            }
        }
        return set(obj[currentPath], path.slice(1), value, doNotReplace);
    }

    /**
     * deletes an property by a path
     * @param obj
     * @param path
     * @returns {*}
     */
    function del(obj, path) {
        if (lodash.isNumber(path)) {
            path = [path];
        }
        if (lodash.isEmpty(obj)) {
            return void 0;
        }

        if (lodash.isEmpty(path)) {
            return obj;
        }
        if (lodash.isString(path)) {
            return del(obj, path.split('.'));
        }

        var currentPath = getKey(path[0]);
        var oldVal = obj[currentPath];

        if (path.length === 1) {
            if (oldVal !== void 0) {
                if (lodash.isArray(obj)) {
                    obj.splice(currentPath, 1);
                } else {
                    delete obj[currentPath];
                }
            }
        } else {
            if (obj[currentPath] !== void 0) {
                return del(obj[currentPath], path.slice(1));
            }
        }
        return obj;
    }

    /**
     * Private helper class
     * @private
     * @type {{}}
     */
    var objectPath = {};

    objectPath.has = function (obj, path) {
        if (lodash.isEmpty(obj)) {
            return false;
        }
        if (lodash.isNumber(path)) {
            path = [path];
        } else if (lodash.isString(path)) {
            path = path.split('.');
        }

        if (lodash.isEmpty(path) || path.length === 0) {
            return false;
        }

        for (var i = 0; i < path.length; i++) {
            var j = path[i];
            if ((lodash.isObject(obj) || lodash.isArray(obj)) && _hasOwnProperty.call(obj, j)) {
                obj = obj[j];
            } else {
                return false;
            }
        }

        return true;
    };

    /**
     * Define private public 'ensure exists'
     * @param obj
     * @param path
     * @param value
     * @returns {*}
     */
    objectPath.ensureExists = function (obj, path, value) {
        return set(obj, path, value, true);
    };

    /**
     * Define private public 'set'
     * @param obj
     * @param path
     * @param value
     * @param doNotReplace
     * @returns {*}
     */
    objectPath.set = function (obj, path, value, doNotReplace) {
        return set(obj, path, value, doNotReplace);
    };

    /**
     Define private public 'insert'
     * @param obj
     * @param path
     * @param value
     * @param at
     */
    objectPath.insert = function (obj, path, value, at) {
        var arr = objectPath.get(obj, path);
        at = ~~at;
        if (!lodash.isArray(arr)) {
            arr = [];
            objectPath.set(obj, path, arr);
        }
        arr.splice(at, 0, value);
    };

    /**
     * Define private public 'empty'
     * @param obj
     * @param path
     * @returns {*}
     */
    objectPath.empty = function (obj, path) {
        if (lodash.isEmpty(path)) {
            return obj;
        }
        if (lodash.isEmpty(obj)) {
            return void 0;
        }

        var value, i;
        if (!(value = objectPath.get(obj, path))) {
            return obj;
        }

        if (lodash.isString(value)) {
            return objectPath.set(obj, path, '');
        } else if (lodash.isBoolean(value)) {
            return objectPath.set(obj, path, false);
        } else if (lodash.isNumber(value)) {
            return objectPath.set(obj, path, 0);
        } else if (lodash.isArray(value)) {
            value.length = 0;
        } else if (lodash.isObject(value)) {
            for (i in value) {
                if (_hasOwnProperty.call(value, i)) {
                    delete value[i];
                }
            }
        } else {
            return objectPath.set(obj, path, null);
        }
    };

    /**
     * Define private public 'push'
     * @param obj
     * @param path
     */
    objectPath.push = function (obj, path /*, values */) {
        var arr = objectPath.get(obj, path);
        if (!lodash.isArray(arr)) {
            arr = [];
            objectPath.set(obj, path, arr);
        }
        arr.push.apply(arr, Array.prototype.slice.call(arguments, 2));
    };

    /**
     * Define private public 'coalesce'
     * @param obj
     * @param paths
     * @param defaultValue
     * @returns {*}
     */
    objectPath.coalesce = function (obj, paths, defaultValue) {
        var value;
        for (var i = 0, len = paths.length; i < len; i++) {
            if ((value = objectPath.get(obj, paths[i])) !== void 0) {
                return value;
            }
        }
        return defaultValue;
    };

    /**
     * Define private public 'get'
     * @param obj
     * @param path
     * @param defaultValue
     * @returns {*}
     */
    objectPath.get = function (obj, path, defaultValue) {
        if (lodash.isNumber(path)) {
            path = [path];
        }
        if (lodash.isEmpty(path)) {
            return obj;
        }
        if (lodash.isEmpty(obj)) {
            //lodash doesnt seem to work with html nodes
            if (obj && obj.innerHTML === null) {
                return defaultValue;
            }
        }
        if (lodash.isString(path)) {
            return objectPath.get(obj, path.split('.'), defaultValue);
        }
        var currentPath = getKey(path[0]);
        if (path.length === 1) {
            if (obj && obj[currentPath] === void 0) {
                return defaultValue;
            }
            if (obj) {
                return obj[currentPath];
            }
        }
        if (!obj) {
            return defaultValue;
        }
        return objectPath.get(obj[currentPath], path.slice(1), defaultValue);
    };

    /**
     * Define private public 'del'
     * @param obj
     * @param path
     * @returns {*}
     */
    objectPath.del = function (obj, path) {
        return del(obj, path);
    };
    /////////////////////////////////////////////////////////////////////////////////////////////
    //
    //  Object path public xide/utils mixin
    //
    //////////////////////////////////////////////////////////////////////////////////////////////
    /**
     *  Returns a value by a give object path
     *
     *  //works also with arrays
     *    objectPath.get(obj, "a.c.1");  //returns "f"
     *    objectPath.get(obj, ["a","c","1"]);  //returns "f"
     *
     * @param obj {object}
     * @param path {string}
     * @param _default {object|null}
     * @returns {*}
     */
    utils.getAt = function (obj, path, _default) {
        return objectPath.get(obj, path, _default);
    };

    /**
     * Sets a value in an object/array at a given path.
     * @example
     *
     * utils.setAt(obj, "a.h", "m"); // or utils.setAt(obj, ["a","h"], "m");
     *
     * //set will create intermediate object/arrays
     * objectPath.set(obj, "a.j.0.f", "m");
     *
     * @param obj{Object|Array}
     * @param path {string}
     * @param value {mixed}
     * @returns {Object|Array}
     */
    utils.setAt = function (obj, path, value) {
        return objectPath.set(obj, path, value);
    };

    /**
     * Returns there is anything at given path within an object/array.
     * @param obj
     * @param path
     */
    utils.hasAt = function (obj, path) {
        return objectPath.has(obj, path);
    };

    /**
     * Ensures at given path, otherwise _default will be placed
     * @param obj
     * @param path
     * @returns {*}
     */
    utils.ensureAt = function (obj, path, _default) {
        return objectPath.ensureExists(obj, path, _default);
    };
    /**
     * Deletes at given path
     * @param obj
     * @param path
     * @returns {*}
     */
    utils.deleteAt = function (obj, path) {
        return objectPath.del(obj, path);
    };

    /**
     *
     * @param to
     * @param from
     * @returns {*}
     */
    utils.merge = function (to, from) {
        for (var n in from) {
            if (typeof to[n] != 'object') {
                to[n] = from[n];
            } else if (typeof from[n] == 'object') {
                to[n] = utils.merge(to[n], from[n]);
            }
        }

        return to;
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //  Dojo's most wanted
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    utils.clone=function(/*anything*/ src){
        // summary:
        // Clones objects (including DOM nodes) and all children.
        // Warning: do not clone cyclic structures.
        // src:
        // The object to clone
        if(!src || typeof src != "object" || utils.isFunction(src)){
            // null, undefined, any non-object, or function
            return src; // anything
        }
        if(src.nodeType && "cloneNode" in src){
            // DOM Node
            return src.cloneNode(true); // Node
        }
        if(src instanceof Date){
            // Date
            return new Date(src.getTime()); // Date
        }
        if(src instanceof RegExp){
            // RegExp
            return new RegExp(src); // RegExp
        }
        var r, i, l;
        if(utils.isArray(src)){
            // array
            r = [];
            for(i = 0, l = src.length; i < l; ++i){
                if(i in src){
                    r.push(utils.clone(src[i]));
                }
            }
            // we don't clone functions for performance reasons
            // }else if(d.isFunction(src)){
            // // function
            // r = function(){ return src.apply(this, arguments); };
        }else{
            // generic objects
            r = src.constructor ? new src.constructor() : {};
        }
        return utils._mixin(r, src, utils.clone);
    };

    /**
     * Copies/adds all properties of source to dest; returns dest.
     * @description All properties, including functions (sometimes termed "methods"), excluding any non-standard extensions
     * found in Object.prototype, are copied/added to dest. Copying/adding each particular property is
     * delegated to copyFunc (if any); copyFunc defaults to the Javascript assignment operator if not provided.
     * Notice that by default, _mixin executes a so-called "shallow copy" and aggregate types are copied/added by reference.
     * @param dest {object} The object to which to copy/add all properties contained in source.
     * @param source {object} The object from which to draw all properties to copy into dest.
     * @param copyFunc {function} The process used to copy/add a property in source; defaults to the Javascript assignment operator.
     * @returns {object} dest, as modified
     * @private
     */
    utils._mixin=function (dest, source, copyFunc) {
        var name, s, i, empty = {};
        for (name in source) {
            // the (!(name in empty) || empty[name] !== s) condition avoids copying properties in "source"
            // inherited from Object.prototype.	 For example, if dest has a custom toString() method,
            // don't overwrite it with the toString() method that source inherited from Object.prototype
            s = source[name];
            if (!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))) {
                dest[name] = copyFunc ? copyFunc(s) : s;
            }
        }

        return dest; // Object
    };
    /**
     * Copies/adds all properties of one or more sources to dest; returns dest.
     * @param dest {object} The object to which to copy/add all properties contained in source. If dest is falsy, then
     * a new object is manufactured before copying/adding properties begins.
     *
     * @param sources One of more objects from which to draw all properties to copy into dest. sources are processed
     * left-to-right and if more than one of these objects contain the same property name, the right-most
     * value "wins".
     *
     * @returns {object} dest, as modified
     *
     * @example
     * make a shallow copy of an object
     * var copy = utils.mixin({}, source);
     *
     * @example
     *
     * many class constructors often take an object which specifies
     *        values to be configured on the object. In this case, it is
     *        often simplest to call `lang.mixin` on the `this` object:
     *        declare("acme.Base", null, {
    *			constructor: function(properties){
    *				//property configuration:
    *				lang.mixin(this, properties);
    *				console.log(this.quip);
    *			},
    *			quip: "I wasn't born yesterday, you know - I've seen movies.",
    *			* ...
    *		});
     *
     *        //create an instance of the class and configure it
     *        var b = new acme.Base({quip: "That's what it does!" });
     *
     */
    utils.mixin = function (dest, sources) {
        if(sources) {

            if (!dest) {
                dest = {};            }

            var l = arguments.length;
            for (var i = 1 ; i < l; i++) {
                utils._mixin(dest, arguments[i]);
            }
            return dest; // Object
        }
        return dest;
    };

    /**
     * Clone object keys
     * @param defaults
     * @returns {{}}
     */
    utils.cloneKeys = function (defaults, skipEmpty) {
        var result = {};
        for (var _class in defaults) {
            if (skipEmpty === true && !(_class in defaults)) {
                continue;
            }
            result[_class] = defaults[_class];
        }
        return result;
    };
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    //  STD
    /**
     *
     * @param what
     * @returns {*}
     */
    utils.isArray=function(what){
        return lodash.isArray(what);
    };
    /**
     *
     * @param what
     * @returns {*}
     */
    utils.isObject=function(what){
        return lodash.isObject(what);
    };
    /**
     *
     * @param what
     * @returns {*}
     */
    utils.isString=function(what){
        return lodash.isString(what);
    };
    /**
     *
     * @param what
     * @returns {*}
     */
    utils.isNumber=function(what){
        return lodash.isNumber(what);
    };
    /**
     *
     * @param it
     * @returns {*}
     */
    utils.isFunction=function(it){
        // summary:
        // Return true if it is a Function
        // it: anything
        // Item to test.
        return lodash.isFunction(it);
    };
    return utils;
});
/** @module xide/utils/CSSUtils
 *  @description All string related functions
 */
define('xide/utils/CSSUtils',[
    'xide/utils',
    'xide/types'

], function (utils, types) {


    "use strict";

    /**
     *
     * @param styleString
     * @param property
     * @returns {*}
     */
    utils.findStyle=function(styleString,property){
        var parser = new CSSParser();
        var content = ".foo{";
        content+=styleString;
        content+="}";
        var sheet=parser.parse(content, false, true);
        var declarations = sheet.cssRules[0].declarations;
        var declaration = _.find(declarations,{
            property:property
        });

        if(declaration){
            return declaration.valueText;
        }
        return "";
    }

    /**
     *
     * @param styleString
     * @returns {*}
     */
    utils.getBackgroundUrl=function(styleString){
        var background = utils.findStyle(styleString,"background-image");
        if(background) {
            try {
                return background.match(/\((.*?)\)/)[1].replace(/('|")/g, '');
            }catch(e){}
        }
        return null;
    }

    return utils;
});

define('xide/factory/Objects',[
    'dcl/dcl',
    'xide/utils',
    'xide/factory',
    'xdojo/declare'
], function (dcl,utils, factory, declare) {
    /***
     * Convinience object factory via dojo/declare
     * @param classNameOrPrototype
     * @param ctrArgs
     * @param baseClasses
     * @returns {*}
     */
    factory.createInstance = function (classNameOrPrototype, ctrArgs, baseClasses) {
        var ctrArgsFinal = {};
        utils.mixin(ctrArgsFinal, ctrArgs);
        //prepare object prototype, try dojo and then abort
        var objectProtoType = classNameOrPrototype;
        if (_.isString(classNameOrPrototype)) {
            var proto = dojo.getObject(objectProtoType) || dcl.getObject(objectProtoType);
            if (proto) {
                objectProtoType = proto;
            } else {
                console.error('no such class : ' + classNameOrPrototype);
                return null;
            }
        }

        baseClasses && ( objectProtoType = declare(baseClasses, objectProtoType.prototype));

        if(!ctrArgsFinal.id){
            var className = objectProtoType.declaredClass || 'no_class_';
            ctrArgsFinal.id = className.replace(/\//g, "_") + utils.createUUID();
        }

        var instance = new objectProtoType(ctrArgsFinal);

        //@TODO: trash
        instance && ( instance.ctrArgs = ctrArgsFinal);

        return instance;
    };
    return factory;
});
define('xide/factory/Events',[
    'xide/factory',
    'dojo/_base/connect',
    'dojo/_base/lang',
    "dojo/on",
    'dojo/has'
], function (factory, connect, lang, on,has) {

    var _debug = false,         //print publish messages in console
        _tryEvents = false,     //put publish in try/catch block
        _foo=null,              //noop
        _nativeEvents = {
            "click": _foo,
            "dblclick":_foo,
            "mousedown":_foo,
            "mouseup":_foo,
            "mouseover":_foo,
            "mousemove":_foo,
            "mouseout":_foo,
            "keypress":_foo,
            "keydown":_foo,
            "keyup":_foo,
            "focus":_foo,
            "blur":_foo,
            "change":_foo
        },
        _debugGroup=false;


    /**
     * Returns true if it is a DOM element, might be not needed anymore
     * @param o
     * @returns {*}
     * @private
     */
    function _isElement(o){
        return (
            typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
            o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
        );
    }
    /**
     * Event debouncer/throttler
     * @param eventHandler
     * @param waitForMirror
     * @returns {Function}
     */
    function applyEventOnce(eventHandler, waitForMirror) {
        var timer;
        var mirror = this;
        return function() {
            var _arguments = arguments;
            if (timer)
                clearTimeout(timer);
            timer = setTimeout(function() {
                if (waitForMirror && mirror.isPending())
                    return setTimeout(function() { applyEventOnce(eventHandler, true) }, 0);
                eventHandler.apply(eventHandler, _arguments);
            }, 0);
        };
    }

    /**
     * asyncForEach does runs a chain of promises, needed this specialized for event callbacks
     * @param array
     * @param fn
     * @param test
     * @param callback
     */
    function asyncForEach(array, fn, test, callback) {
        if (!callback) {
            callback = test;
            test = null;
        }

        array = array.slice(); // copy before use

        var nested = false, callNext = true;
        loop();

        function loop() {
            while (callNext && !nested) {
                callNext = false;
                while (array.length > 0 && test && !test(array[0]))
                    array.shift();

                var item = array.shift();
                // TODO: implement proper err argument?
                if (!item)
                    return callback && callback();

                nested = true;
                fn(item, loop);
                nested = false;
            }
            callNext = true;
        }
    }

    /***
     * @param keys
     * @param data
     * @param callee
     * @extends module:xide/factory
     * @memberOf xide/factory
     */
    factory.publish = function (keys, data, callee,filter) {

        var msgStruct   = data ? _.isString(data) ? {message: data} : data : {},
            eventKeys   = keys,
            _publish    = connect.publish,
            result      = [];//lookup cache

        //normalize to array
        if (!_.isArray(keys)) {
            eventKeys = [keys];
        }
        for (var i = 0,l=eventKeys.length; i < l; i++) {

            var eventKey = eventKeys[i];

            if(filter && !filter(eventKey)){
                continue;
            }

            if (_debug) {
                //console.group("Events");
                _debugGroup = true;
                console.log('publish ' + eventKey + ' from : ' + (callee ? callee.id : ''), msgStruct);
            }

            if(_tryEvents) {
                try {
                    result = _publish(eventKey, msgStruct);
                } catch (e) {
                    logError(e,'error whilst publishing event ' + eventKey);
                }
            }else{
                result = _publish(eventKey, msgStruct);
            }
        }

        return result;
    };

    /***
     *
     * Subscribes to multiple events
     * @param keys {String[]}
     * @param _cb {function|null} When null, it expects the owner having a function matching the event key!
     * @param owner {Object}
     * @extends module:xide/factory
     * @memberOf xide/factory
     * @returns {Object[]|null} Returns an array of regular Dojo-subscribe/on handles
     */
    factory.subscribe = function (keys, cb, owner,filter) {

        if(has('debug')){
            if(!keys){
                _debug && console.error('subscribe failed, event key is empty!');
                return null;
            }
        }

        //some vars
        var eventKeys  = keys,
            _subscribe = connect.subscribe,     //cache
            events = [];                        //resulting subscribe handles
            //_isDom = _isElement(owner),       //dom element?

        //-- not good for use-strict
        //owner = owner || arguments.callee;

        //normalize to array
        if (!_.isArray(keys)) {
            eventKeys = [keys];
        }

        for (var i = 0,l=eventKeys.length; i < l; i++) {

            if(!eventKeys[i] || filter && !filter(eventKey)){
                continue;
            }

            var _item =
                    //the raw item
                    eventKeys[i],
                    //is string?
                    _isString = _.isString(_item),
                    //if string: use it, otherwise assume struct
                    eventKey =  _isString ? _item : _item.key,
                    //pick handler from arguments or struct
                    _handler = _isString ? cb : _item.handler,
                    //is native event?
                    _isNative = eventKey in _nativeEvents,
                    //the final handle
                    _handle;


            //owner specified, hitch the callback into owner's scope
            if (owner != null) {
                //try cb first, then owner.onEVENT_KEY, that enables similar effect as in Dojo2/Evented
                var _cb = _handler !=null ? _handler : owner[eventKey];
                if(_isNative){
                    _handle = on(owner, eventKey, lang.hitch(owner, _cb));
                }else{
                    _handle = _subscribe(eventKey, lang.hitch(owner, _cb));
                }
                _handle.handler = lang.hitch(owner, _cb);
            } else {
                _handle =  connect.subscribe(eventKey, _handler);
                _handle.handler = _handler;
            }
            //track the actual event type
            _handle.type = eventKey;
            events.push(_handle);
        }
        return events;
    };
    return factory;
});
/** @module xide/model/Base **/
define('xide/model/Base',[
    'dcl/dcl',
    "dojo/_base/declare",
    "xide/utils"
], function (dcl,declare,utils) {
    
    var Implementation = {
        declaredClass:"xide/model/Base",
        /**
         * Mixin constructor arguments into this.
         * This could have been done in another base class but performance matters
         * @todo use a mixin from lodash
         * @constructor
         */
        constructor: function (args) {
            utils.mixin(this, args);
        },
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        //  Public interface, keep it small and easy
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Return a human friendly name
         * @abstract
         * @returns {string|null}
         */
        getLabel: function () {
            return null;
        },
        /**
         * Return a unique ID.
         * @abstract
         * @returns {string|null}
         */
        getID: function () {
            return null;
        }
    }

    var Module = declare("xide/model/Base",null,Implementation);
    Module.dcl = dcl(null,Implementation);
    return Module;
});


define('xide/utils/_LogMixin',[
    'dcl/dcl',
    'xide/utils',
    'xide/model/Base'
], function (dcl, utils,Base) {
    return dcl(Base.dcl,{
        declaredClass:"xide.utils._LogMixin",
        debug_conf: null,
        initLogger: function (debug_config) {
            this.debug_conf = debug_config;
        },
        log: function (msg, msg_context) {
            if (!msg_context) msg_context = this._debugContext()["main"];
            if (this.showDebugMsg(msg_context)) {
                console.log(msg);
            }
        },
        showDebugMsg: function (msg_context) {
            if (this.debug_conf != null) {
                if (this.debug_conf["all"]) {
                    return true;
                }
                else {
                    if (this.debug_conf[msg_context]) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            } else {
                console.log("No debug config, showing all.");
                this.debug_conf = {
                    "all": true
                };
                return true;
            }
        }
    });
});
define('xide/client/ClientBase',[
    'dcl/dcl',
    'xide/mixins/EventedMixin',
    'xide/model/Base',
    'dojo/_base/unload',
    'xide/utils'
], function (dcl,EventedMixin,Base, unload,utils) {
    var Module = dcl([Base.dcl,EventedMixin.dcl], {
        declaredClass:"xide.client.ClientBase",
        options: null,
        _socket: null,
        onConnectionReady: function () {
        },
        onClosed: function () {
        },
        destroy: function () {

            if (this._socket && this._socket.close) {
                this._socket.close();
                this.onClosed();
            }
        },
        _defaultOptions: function () {
            return {};
        },
        init: function (args) {
            this.options = utils.mixin(this._defaultOptions(), args.options);
            //disconnect on onload
            unload.addOnUnload(function () {
                this.pageUnloaded=true;
                this.destroy();
            }.bind(this));
        }
    });

    dcl.chainAfter(Module,"destroy");
    return Module;
});
define('xide/client/WebSocket',[
    "dcl/dcl",
    'xide/utils',
    'xide/utils/_LogMixin',
    'xide/client/ClientBase'
], function (dcl, utils, _logMixin, ClientBase) {
    var debug = false;
    return dcl([ClientBase, _logMixin], {
        declaredClass:"xide.client.WebSocket",
        _socket: null,
        debugConnect: true,
        autoReconnect: true,
        reconnect: function () {
            debug && console.log('reconnect!');
        },
        close: function () {
            this.destroy();
        },
        onLostConnection:function(){
            debug && console.log('lost connection');
        },
        onConnected:function(){
            debug && console.log('on connected');
        },
        connect: function (_options) {
            this.options = utils.mixin(this.options, _options);
            var host = this.options.host;
            //host = host.replace('http://','wss://');
            var port = this.options.port;
            if (this.options.debug) {
                this.initLogger(this.options.debug);
            }
            if (!host) {
                console.error('something wrong with data!',_options);
                return;
            }
            debug && console.log("Connecting to " + host + ':' + port, "socket_client");
            var protocol = [
                'websocket',
                'xdr-streaming',
                'xhr-streaming',
                'iframe-eventsource',
                'iframe-htmlfile',
                'xdr-polling',
                'xhr-polling',
                'iframe-xhr-polling',
                'jsonp-polling'
            ];

            var options = {
                debug: debug,
                devel: true,
                noCredentials:true,
                nullOrigin:true
            };
            options.transports = protocol;
            var sock = new SockJS(host + ":" + port, null, options);
            var thiz = this;

            sock.onopen = function () {
                thiz.onConnected();
                if (thiz.delegate.onConnected) {
                    thiz.delegate.onConnected();
                }
            };

            sock.onmessage = function (e) {
                if (thiz.delegate.onServerResponse) {
                    thiz.delegate.onServerResponse(e);
                }
            };

            sock.onerror=function(){
                console.error('error');
            }
            sock.onclose = function (e) {
                if (thiz.autoReconnect) {
                    debug &&  console.log('closed ' + host + ' try re-connect');
                    if (thiz.delegate.onLostConnection) {
                        thiz.delegate.onLostConnection(e);
                    }
                    thiz.reconnect();
                }else{
                    debug && console.log('closed ' + host);
                }
            };
            this._socket = sock;
        },
        emit: function (signal, dataIn, tag) {
            dataIn.tag = tag || 'notag';
            var data = JSON.stringify(dataIn);
            var res = this._socket.send(data);
            debug && console.log('send ',res);
        },

        onSignal: function (signal, callback) {
            this._socket.on('data', callback);
        }
    });
});
define('xide/factory/Clients',[
    'xide/factory',
    'xide/utils',
    'xide/types',
    'xide/client/WebSocket'
], function (factory,utils,types,WebSocket)
{
    var debug = false;
    /**
     * Low Level Web-Socket-Client factory method
     * @param ctrArgs
     * @param host
     * @param port
     * @param delegate
     */
    factory.createClient=function(ctrArgs,host,port,delegate){};
    /***
     * High-Level Web-Socket-Client factory method
     * @param store
     * @param serviceName
     * @param ctrArgs
     * @param clientClass : optional client class prototype, default : WebSocket
     * @returns {xide/client/WebSocket} | null
     */
    factory.createClientWithStore=function(store,serviceName,ctrArgs,clientClass){

        var service = utils.queryStoreEx(store,{
                name:serviceName
            },true,true),
            _ctorArgs = {};

        utils.mixin(_ctorArgs,ctrArgs);

        if(!service||service.length===0){
            console.error('create client with : failed, no such service :  ' + serviceName );
            return;
        }

        //service=service[0];

        /*
        if(!service.info && service.status==types.SERVICE_STATUS.OFFLINE){
            console.error('create client with store : failed! Service has no info for '  + serviceName);
            return;
        }
        */
        if(service.status!==types.SERVICE_STATUS.ONLINE){
            debug && console.error('create client with store : failed! Service ' +  serviceName + ' is not online ');
            //return;
        }

        var host = 'http://' + service.host,
            port = service.port,
            channel='',
            _clientProto = clientClass || WebSocket;

        if(service.info){
            host=service.info.host;
            port=service.info.port;
        }

        try{
            var client = new _clientProto(_ctorArgs);
            utils.mixin(client,_ctorArgs);
            client.init({
                options:{
                    host:host,
                    port:port,
                    channel:channel,
                    debug:{
                        "all": false,
                        "protocol_connection": true,
                        "protocol_messages": true,
                        "socket_server":true,
                        "socket_client":true,
                        "socket_messages":true,
                        "main":true
                    }
                }
            });
            client.connect();
            return client;
        }catch(e){
            debug && console.error('create client with store : failed : ' + e) && logError(e);
        }
    };
    return factory;
});
define('xide/data/Model',[
	'dcl/dcl',
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/Deferred',
	'dojo/aspect',
	'dojo/when'
], function (dcl,declare, lang, Deferred, aspect, when) {

	function getSchemaProperty(object, key) {
		// this function will retrieve the individual property definition
		// from the schema, for the provided object and key
		var definition = object.schema[key];
		if (definition !== undefined && !(definition instanceof Property)) {
			definition = new Property(definition);
			definition._parent = object;
		}
		if (definition) {
			definition.name = key;
		}
		return definition;
	}

	function validate(object, key) {
		// this performs validation, delegating validation, and coercion
		// handling to the property definitions objects.
		var hasOwnPropertyInstance,
			property = object.hasOwnProperty('_properties') && object._properties[key];
		
		hasOwnPropertyInstance = property;

		if (!property) {
			// or, if we don't our own property object, we inherit from the schema
			property = getSchemaProperty(object, key);
			if (property && property.validate) {
				property = lang.delegate(property, {
					_parent: object,
					key: key
				});
			}
		}

		if (property && property.validate) {
			return when(property.validate(), function (isValid) {
				if (!isValid) {
					// errors, so don't perform set
					if (!hasOwnPropertyInstance) {
						// but we do need to store our property
						// instance if we don't have our own
						(object.hasOwnProperty('_properties') ?
							object._properties :
							object._properties = new Hidden())[key] = property;
					}
				}
				return isValid;
			});
		}
		return true;
	}

	function whenEach(iterator) {
		// this is responsible for collecting values from an iterator,
		// and waiting for the results if promises are returned, returning
		// a new promise represents the eventual completion of all the promises
		// this will consistently preserve a sync (non-promise) return value if all
		// sync values are provided
		var deferred;
		var remaining = 1;
		// start the iterator
		iterator(function (value, callback, key) {
			if (value && value.then) {
				// it is a promise, have to wait for it
				remaining++;
				if (!deferred) {
					// make sure we have a deferred
					deferred = new Deferred();
				}
				value.then(function (value) {
					// result received, call callback, and then indicate another item is done
					doneItem(callback(value, key));
				}).then(null, deferred.reject);
			} else {
				// not a promise, just a direct sync callback
				callback(value, key);
			}
		});
		if (deferred) {
			// if we have a deferred, decrement one more time
			doneItem();
			return deferred.promise;
		}
		function doneItem() {
			// called for each promise as it is completed
			remaining--;
			if (!remaining) {
				// all done
				deferred.resolve();
			}
		}
	}
	var slice = [].slice;

	var Model = declare('xide/data/Model',null,{
		//	summary:
		//		A base class for modelled data objects.

		//	schema: Object | dstore/Property
		//		A hash map where the key corresponds to a property definition. 
		//		This can be a string corresponding to a JavaScript
		//		primitive values (string, number, boolean), a constructor, a
		//		null (to allow any type), or a Property object with more advanced
		//		definitions.
		schema: {},

		//	additionalProperties: boolean
		//		This indicates whether properties are allowed that are not 
		//		defined in the schema.
		additionalProperties: true,

		//	_scenario: string
		//		The scenario that is used to determine which validators should
		//		apply to this model. There are two standard values for _scenario,
		//		"insert" and "update", but it can be set to any arbitrary value
		//		for more complex validation scenarios.
		_scenario: 'update',

		constructor: function (options) {
			this.init(options);
		},

		refresh:function(silent){

			var _store = this._store;
			_store && _store.refreshItem(this,silent);

		},
		getStore:function(){
			return this._store;
		},

		init: function (values) {
			// if we are being constructed, we default to the insert scenario
			this._scenario = 'insert';
			// copy in the default values
			values = this._setValues(values);

			// set any defaults
			for (var key in this.schema) {
				var definition = this.schema[key];
				if (definition && typeof definition === 'object' && 'default' in definition &&
						!values.hasOwnProperty(key)) {
					var defaultValue = definition['default'];
					values[key] = typeof defaultValue === 'function' ? defaultValue.call(this) : defaultValue;
				}
			}
			
		},

		_setValues: function (values) {
			return lang.mixin(this, values);
		},

		_getValues: function () {
			return this._values || this;
		},

		save: function (/*Object*/ options) {
			//	summary:
			//		Saves this object, calling put or add on the attached store.
			//	options.skipValidation:
			//		Normally, validation is performed to ensure that the object
			//		is not invalid before being stored. Set `skipValidation` to
			//		true to skip it.
			//	returns: any

			var object = this;
			return when((options && options.skipValidation) ? true : this.validate(), function (isValid) {
				if (!isValid) {
					throw object.createValidationError(object.errors);
				}
				var scenario = object._scenario;
				// suppress any non-date from serialization output
				object.prepareForSerialization();
				return object._store && when(object._store[scenario === 'insert' ? 'add' : 'put'](object),
						function (returned) {
					// receive any updates from the server
					object.set(returned);
					object._scenario = 'update';
					return object;
				});
			});
		},

		remove: function () {
			var store = this._store;
			return store.remove(store.getIdentity(this));
		},

		prepareForSerialization: function () {
			//	summary:
			//		This method is responsible for cleaing up any properties on the instance
			//		object to ensure it can easily be serialized (by JSON.stringify at least)
			this._scenario = undefined;
			if (this._inherited) {
				this._inherited.toJSON = toJSONHidden;
			}
		},

		createValidationError: function (errors) {
			//	summary:
			//		This is called when a save is attempted and a validation error was found.
			//		This can be overriden with locale-specific messages
			//	errors:
			//		Errors that were found in validation
			return new Error('Validation error');
		},

		property: function (/*String...*/ key, nextKey) {
			//	summary:
			//		Gets a new reactive property object, representing the present and future states
			//		of the provided property. The returned property object gives access to methods for changing,
			//		retrieving, and observing the property value, any validation errors, and property metadata.
			//	key: String...
			//		The name of the property to retrieve. Multiple key arguments can be provided
			//		nested property access.

			// create the properties object, if it doesn't exist yet
			var properties = this.hasOwnProperty('_properties') ? this._properties :
				(this._properties = new Hidden());
			var property = properties[key];
			// if it doesn't exist, create one, delegated from the schema's property definition
			// (this gives an property instance, owning the current property value and listeners,
			// while inheriting metadata from the schema's property definitions)
			if (!property) {
				property = getSchemaProperty(this, key);
				// delegate, or just create a new instance if no schema definition exists
				property = properties[key] = property ? lang.delegate(property) : new Property();
				property.name = key;
				// give it the correct initial value
				property._parent = this;
			}
			if (nextKey) {
				// go to the next property, if there are multiple
				return property.property.apply(property, slice.call(arguments, 1));
			}
			return property;
		},

		get: function (/*string*/ key) {
			// TODO: add listener parameter back in
			//	summary:
			//		Standard get() function to retrieve the current value
			//		of a property, augmented with the ability to listen
			//		for future changes

			var property, definition = this.schema[key];
			// now we need to see if there is a custom get involved, or if we can just
			// shortcut to retrieving the property value
			definition = property || this.schema[key];
			if (definition && definition.valueOf &&
					(definition.valueOf !== simplePropertyValueOf || definition.hasCustomGet)) {
				// we have custom get functionality, need to create at least a temporary property
				// instance
				property = property || (this.hasOwnProperty('_properties') && this._properties[key]);
				if (!property) {
					// no property instance, so we create a temporary one
					property = lang.delegate(getSchemaProperty(this, key), {
						name: key,
						_parent: this
					});
				}
				// let the property instance handle retrieving the value
				return property.valueOf();
			}
			// default action of just retrieving the property value
			return this._getValues()[key];
		},

		set: function (/*string*/ key, /*any?*/ value) {
            //	summary:
			//		Only allows setting keys that are defined in the schema,
			//		and remove any error conditions for the given key when
			//		its value is set.
			if (typeof key === 'object') {
				startOperation();
				try {
					for (var i in key) {
						value = key[i];
						if (key.hasOwnProperty(i) && !(value && value.toJSON === toJSONHidden)) {
							this.set(i, value);
						}
					}
				} finally {
					endOperation();
				}
				return;
			}
			var definition = this.schema[key];
			if (!definition && !this.additionalProperties) {
				// TODO: Shouldn't this throw an error instead of just giving a warning?
				return console.warn('Schema does not contain a definition for', key);
			}
			var property = this.hasOwnProperty('_properties') && this._properties[key];
			if (!property &&
					// we need a real property instance if it is an object or if we have a custom put method
					((value && typeof value === 'object') ||
						(definition && definition.put !== simplePropertyPut))) {
				property = this.property(key);
			}
			if (property) {
				// if the property instance exists, use this to do the set
				property.put(value);
			} else {
				if (definition && definition.coerce) {
					// if a schema definition exists, and has a coerce method,
					// we can use without creating a new instance
					value = definition.coerce(value);
				}
				// we can shortcut right to just setting the object property
				this._getValues()[key] = value;
				// check to see if we should do validation
				if (definition && definition.validateOnSet !== false) {
					validate(this, key);
				}
			}

			return value;
		},

		observe: function (/*string*/ key, /*function*/ listener, /*object*/ options) {
			//	summary:
			//		Registers a listener for any changes in the specified property
			//	key:
			//		The name of the property to listen to
			//	listener:
			//		Function to be called for each change
			//	options.onlyFutureUpdates
			//		If this is true, it won't call the listener for the current value,
			//		just future updates. If this is true, it also won't return
			//		a new reactive object
			return this.property(key).observe(listener, options);
		},

		validate: function (/*string[]?*/ fields) {
			//	summary:
			//		Validates the current object.
			//	fields:
			//		If provided, only the fields listed in the array will be
			//		validated.
			//	returns: boolean | dojo/promise/Promise
			//		A boolean or a promise that resolves to a boolean indicating whether
			//		or not the model is in a valid state.

			var object = this,
				isValid = true,
				errors = [],
				fieldMap;

			if (fields) {
				fieldMap = {};
				for (var i = 0; i < fields.length; i++) {
					fieldMap[i] = true;
				}
			}
			return when(whenEach(function (whenItem) {
				// iterate through the keys in the schema.
				// note that we will always validate every property, regardless of when it fails,
				// and we will execute all the validators immediately (async validators will
				// run in parallel)
				for (var key in object.schema) {
					// check to see if we are allowed to validate this key
					if (!fieldMap || (fieldMap.hasOwnProperty(key))) {
						// run validation
						whenItem(validate(object, key), function (isValid, key) {
							if (!isValid) {
								notValid(key);
							}
						}, key);
					}
				}
			}), function () {
				object.set('errors', isValid ? undefined : errors);
				// it wasn't async, so we just return the synchronous result
				return isValid;
			});
			function notValid(key) {
				// found an error, mark valid state and record the errors
				isValid = false;
				errors.push.apply(errors, object.property(key).errors);
			}
		},

		isValid: function () {
			//	summary:
			//		Returns whether or not there are currently any errors on
			//		this model due to validation failures. Note that this does
			//		not run validation but merely returns the result of any
			//		prior validation.
			//	returns: boolean

			var isValid = true,
				key;

			for (key in this.schema) {
				var property = this.hasOwnProperty('_properties') && this._properties[key];
				if (property && property.errors && property.errors.length) {
					isValid = false;
				}
			}
			return isValid;
		}
	});

	// define the start and end markers of an operation, so we can
	// fire notifications at the end of the operation, by default
	function startOperation() {
		setCallDepth++;
	}
	function endOperation() {
		// if we are ending this operation, start executing the queue
		if (setCallDepth < 2 && onEnd) {
			onEnd();
			onEnd = null;
		}
		setCallDepth--;
	}
	var setCallDepth = 0;
	var callbackQueue;
	var onEnd;
	// the default nextTurn executes at the end of the current operation
	// The intent with this function is that it could easily be replaced
	// with something like setImmediate, setTimeout, or nextTick to provide
	// next turn handling
	(Model.nextTurn = function (callback) {
		// set the callback for the end of the current operation
		onEnd = callback;
	}).atEnd = true;

	var Reactive = declare([Model], {
		//	summary:
		//		A reactive object is a data model that can contain a value,
		//		and notify listeners of changes to that value, in the future.
		observe: function (/*function*/ listener, /*object*/ options) {
			//	summary:
			//		Registers a listener for any changes in the current value
			//	listener:
			//		Function to be called for each change
			//	options.onlyFutureUpdates
			//		If this is true, it won't call the listener for the current value,
			//		just future updates. If this is true, it also won't return
			//		a new reactive object
			
			var reactive;
			if (typeof listener === 'string') {
				// a property key was provided, use the Model's method
				return this.inherited(arguments);
			}
			if (!options || !options.onlyFutureUpdates) {
				// create a new reactive to contain the results of the execution
				// of the provided function
				reactive = new Reactive();
				if (this._has()) {
					// we need to notify of the value of the present (as well as future)
					reactive.value = listener(this.valueOf());
				}
			}
			// add to the listeners
			var handle = this._addListener(function (value) {
				var result = listener(value);
				if (reactive) {
					// TODO: once we have a real notification API again, call that, instead 
					// of requesting a change
					reactive.put(result);
				}
			});
			if (reactive) {
				reactive.remove = handle.remove;
				return reactive;
			} else {
				return handle;
			}
		},

		//	validateOnSet: boolean
		//		Indicates whether or not to perform validation when properties
		//		are modified.
		//		This can provided immediate feedback and on the success
		//		or failure of a property modification. And Invalid property 
		//		values will be rejected. However, if you are
		//		using asynchronous validation, invalid property values will still
		//		be set.
		validateOnSet: false,

		//	validators: Array
		//		An array of additional validators to apply to this property
		validators: null,

		_addListener: function (listener) {
			// add a listener for the property change event
			return aspect.after(this, 'onchange', listener, true);
		},

		valueOf: function () {
			return this._get();
		},

		_get: function () {
			return this.value;
		},

		_has: function () {
			return this.hasOwnProperty('value');
		},
		setValue: function (value) {
			//	summary:
			//		This method is responsible for storing the value. This can
			//		be overriden to define a custom setter
			//	value: any
			//		The value to be stored
			//	parent: Object
			//		The parent object of this propery
			this.value = value;
		},

		put: function (/*any*/ value) {
			//	summary:
			//		Indicates a new value for this reactive object

			// notify all the listeners of this object, that the value has changed
			var oldValue = this._get();
			value = this.coerce(value);
			if (this.errors) {
				// clear any errors
				this.set('errors', undefined);
			}
			var property = this;
			// call the setter and wait for it
			startOperation();
			return when(this.setValue(value, this._parent), function (result) {
				if (result !== undefined) {
					// allow the setter to change the value
					value = result;
				}
				// notify listeners
				if (property.onchange) {
					// queue the callback
					property._queueChange(property.onchange, oldValue);
				}
				// if this was set to an object (or was an object), we need to notify.
				// update all the sub-property objects, so they can possibly notify their
				// listeners
				var key,
					hasOldObject = oldValue && typeof oldValue === 'object' && !(oldValue instanceof Array),
					hasNewObject = value && typeof value === 'object' && !(value instanceof Array);
				if (hasOldObject || hasNewObject) {
					// we will iterate through the properties recording the changes
					var changes = {};
					if (hasOldObject) {
						oldValue = oldValue._getValues ? oldValue._getValues() : oldValue;
						for (key in oldValue) {
							changes[key] = {old: oldValue[key]};
						}
					}
					if (hasNewObject) {
						value = value._getValues ? value._getValues() : value;
						for (key in value) {
							(changes[key] = changes[key] || {}).value = value[key];
						}
					}
					property._values = hasNewObject && value;
					for (key in changes) {
						// now for each change, we can notify the property object
						var change = changes[key];
						var subProperty = property._properties && property._properties[key];
						if (subProperty && subProperty.onchange) {
							// queue the callback
							subProperty._queueChange(subProperty.onchange, change.old);
						}
					}
				}
				if (property.validateOnSet) {
					property.validate();
				}
				endOperation();
			});
		},

		coerce: function (value) {
			//	summary:
			//		Given an input value, this method is responsible
			//		for converting it to the appropriate type for storing on the object.

			var type = this.type;
			if (type) {
				if (type === 'string') {
					value = '' + value;
				}
				else if (type === 'number') {
					value = +value;
				}
				else if (type === 'boolean') {
					// value && value.length check is because dijit/_FormMixin
					// returns an array for checkboxes; an array coerces to true,
					// but an empty array should be set as false
					value = (value === 'false' || value === '0' || value instanceof Array && !value.length) ?
						false : !!value;
				}
				else if (typeof type === 'function' && !(value instanceof type)) {
					/* jshint newcap: false */
					value = new type(value);
				}
			}
			return value;
		},

		addError: function (error) {
			//	summary:
			//		Add an error to the current list of validation errors
			//	error: String
			//		Error to add
			this.set('errors', (this.errors || []).concat([error]));
		},

		checkForErrors: function (value) {
			//	summary:
			//		This method can be implemented to simplify validation.
			//		This is called with the value, and this method can return
			//		an array of any errors that were found. It is recommended
			//		that you call this.inherited(arguments) to permit any
			//		other validators to perform validation
			//	value:
			//		This is the value to validate.
			var errors = [];
			if (this.type && !(typeof this.type === 'function' ? (value instanceof this.type) :
				(this.type === typeof value))) {
				errors.push(value + ' is not a ' + this.type);
			}
			
			if (this.required && !(value != null && value !== '')) {
				errors.push('required, and it was not present');
			}
			return errors;
		},

		validate: function () {
			//	summary:
			//		This method is responsible for validating this particular
			//		property instance.
			var property = this;
			var model = this._parent;
			var validators = this.validators;
			var value = this.valueOf();
			var totalErrors = [];

			return when(whenEach(function (whenItem) {
				// iterator through any validators (if we have any)
				if (validators) {
					for (var i = 0; i < validators.length; i++) {
						whenItem(validators[i].checkForErrors(value, property, model), addErrors);
					}
				}
				// check our own validation
				whenItem(property.checkForErrors(value, property, model), addErrors);
				function addErrors(errors) {
					if (errors) {
						// if we have an array of errors, add it to the total of all errors
						totalErrors.push.apply(totalErrors, errors);
					}
				}
			}), function () {
				if (totalErrors.length) {
					// errors exist
					property.set('errors', totalErrors);
					return false;
				}
				// no errors, valid value, if there were errors before, remove them
				if(property.get('errors') !== undefined){
					property.set('errors', undefined);
				}
				return true;
			});
		},
		_queueChange: function (callback, oldValue) {
			// queue up a notification callback
			if (!callback._queued) {
				// make sure we only queue up once before it is called by flagging it
				callback._queued = true;
				var reactive = this;
				// define a function for when it is called that will clear the flag
				// and provide the correct args
				var dispatch = function () {
					callback._queued = false;
					callback.call(reactive, reactive._get(), oldValue);
				};

				if (callbackQueue) {
					// we already have a waiting queue of callbacks, add our callback
					callbackQueue.push(dispatch);
				}
				if (!callbackQueue) {
					// no waiting queue, check to see if we have a custom nextTurn
					// or we are in an operation
					if (!Model.nextTurn.atEnd || setCallDepth > 0) {
						// create the queue (starting with this callback)
						callbackQueue = [dispatch];
						// define the callback executor for the next turn
						Model.nextTurn(function () {
							// pull out all the callbacks
							for (var i = 0; i < callbackQueue.length; i++) {
								// call each one
								callbackQueue[i]();
							}
							// clear it
							callbackQueue = null;
						});
					} else {
						// no set call depth, so just immediately execute
						dispatch();
					}
				}
			}
		},
		toJSON: function () {
			return this._values || this;
		}
	});
	// a function that returns a function, to stop JSON serialization of an
	// object
	function toJSONHidden() {
		return toJSONHidden;
	}
	// An object that will be hidden from JSON serialization
	var Hidden = function () {
	};
	Hidden.prototype.toJSON = toJSONHidden;

	var Property = Model.Property = declare(Reactive, {
		//	summary:
		//		A Property represents a time-varying property value on an object,
		//		along with meta-data. One can listen to changes in this value (through
		//		receive), as well as access and monitor metadata, like default values,
		//		validation information, required status, and any validation errors.

		//	value: any
		//		This represents the value of this property, which can be
		//		monitored for changes and validated

		init: function (options) {
			// handle simple definitions
			if (typeof options === 'string' || typeof options === 'function') {
				options = {type: options};
			}
			// and/or mixin any provided properties
			if (options) {
				declare.safeMixin(this, options);
			}
		},

		_get: function () {
			return this._parent._getValues()[this.name];
		},
		_has: function () {
			return this.name in this._parent._getValues();
		},
		setValue: function (value, parent) {
			parent._getValues()[this.name] = value;
		}
	});

	var simplePropertyValueOf = Property.prototype.valueOf;
	var simplePropertyPut = Property.prototype.put;

	return Model;
});
/** @module xide/data/ObservableStore **/
define('xide/data/ObservableStore',[
    "dojo/_base/declare",
    "xide/types",
    "xide/mixins/EventedMixin"
], function (declare, types,EventedMixin) {

    var _debug = false;
    var _debugChange = false;
    /**
     * @class module:xide/data/ObservableStore
     */
    return declare('xide/data/Observable', EventedMixin, {
        _ignoreChangeEvents: true,
        observedProperties: [],
        mute:false,
        silent:function(silent){
            this._ignoreChangeEvents = silent;
        },
        putSync: function (item,publish) {
            this._ignoreChangeEvents = true;
            var res = this.inherited(arguments);
            this._ignoreChangeEvents = false;
            publish!==false && this.emit('added', res);
            return res;
        },
        removeSync: function (id) {
            var _item = this.getSync(id);
            _item && _item.onRemove && _item.onRemove();
            var res = this.inherited(arguments);
            return res;
        },
        postscript: function () {

            var thiz = this;
            thiz.inherited(arguments);
            if (!thiz.on) {
                return;
            }
            thiz.on('add', function (evt) {
                var _item = evt.target;
                thiz._observe(_item);
                if (!_item._store) {
                    _item._store = thiz;
                }
                _item._onCreated && _item._onCreated();
                if(!_item._onCreated && _debug){
                    console.warn('item doesnt have _onCreated',_item);
                }
                _item.onAdd && _item.onAdd(_item);
            });
        },
        /**
         *
         * @param item
         * @param property
         * @param value
         * @param source
         * @private
         */
        _onItemChanged: function (item, property, value, source) {
            if (this._ignoreChangeEvents) {
                return;
            }

            _debug && console.log('item changed', arguments);

            var args = {
                target: item,
                property: property,
                value: value,
                source: source
            };
            this.emit('update', args);
            item.onItemChanged && item.onItemChanged(args);
        },
        _observe: function (item) {
            var thiz = this,
                props = thiz.observedProperties;

            if (item && item.observed) {
                props = props.concat(item.observed);
            }
            props && props.forEach(function (property) {
                //_debug && console.log('observe item : ' + item.command + ' for ' + property);
                item.property(property).observe(function (value) {
                    if (!thiz._ignoreChangeEvents) {
                        _debugChange && console.log('property changed: ' + property);
                        thiz._onItemChanged(item, property, value, thiz);
                    }
                });
            });
        },
        setData: function (data) {
            this.inherited(arguments);
            this._ignoreChangeEvents = true;
            data && _.each(data,this._observe, this);
            this._ignoreChangeEvents = false;
        }
    });
});
/** @module xide/data/Reference **/
define('xide/data/Reference',[
    "dojo/_base/declare",
    "xide/utils"
], function (declare,utils) {

    var debug = false;
    /**
     * @class module:xide/data/Reference
     */
    var Implementation = {
        _sources: [],
        removeSource: function (source) {
        },
        updateSource: function (sources) {
        },
        onSourceUpdate: function (source) {
        },
        onSourceRemoved: function (source) {
        },
        onSourceDelete: function (source) {
        },
        onItemChanged: function (args) {
        },
        destroy: function () {
            if (!this.item.removeReference) {
                debug && console.error('item has no removeReference');
            } else {
                this.item.removeReference(this);
            }
            this.inherited(arguments);
        },
        addSource: function (item, settings) {

            this._sources.push({
                item: item,
                settings: settings
            });
            var thiz = this;
            if (settings && settings.onDelete) {
                item._store.on('delete', function (evt) {
                    if (evt.target == item) {
                        thiz._store.removeSync(thiz[thiz._store['idProperty']]);
                    }
                })
            }
        },
        updateSources: function (args) {
            for (var i = 0; i < this._sources.length; i++) {
                var link = this._sources[i];
                var item = link.item;
                var settings = link.settings;
                if (args.property && settings.properties &&
                    settings.properties[args.property]) {
                    item._store._ignoreChangeEvents = true;
                    item.set(args.property, args.value);
                    item._store._ignoreChangeEvents = false;
                    item._store.emit('update', {target: item});
                }
            }
        },
        constructor: function (properties) {
            this._sources = [];
            utils.mixin(this, properties);
        }
    };

    //package via declare
    var _class = declare('xgrid.data.Reference', null, Implementation);
    _class.Implementation = Implementation;
    return _class;
});
/** @module xide/data/Source **/
define('xide/data/Source',[
    'dcl/dcl',
    "dojo/_base/declare",
    'xide/utils'
], function (dcl, declare, utils) {

    var _debug = false;
    /**
     * @class module:xide/data/Source
     */
    var Implementation = {
        _references: null,
        _originReference: null,
        onReferenceUpdate: function () {
        },
        onReferenceRemoved: function () {
        },
        onReferenceDelete: function () {
        },
        updateReference: function () {
        },
        getReferences: function () {
            return this._references ? utils.pluck(this._references, 'item') : [];
        },
        addReference: function (item, settings, addSource) {

            if (!this._references) {
                this._references = [];
            }

            this._references.push({
                item: item,
                settings: settings
            });

            var thiz = this;

            if (settings && settings.onDelete) {
                if (item._store) {
                    item._store.on('delete', function (evt) {
                        if (evt.target == item) {
                            thiz._store.removeSync(thiz[thiz._store['idProperty']]);
                        }
                    })
                }
            }

            if (addSource) {
                if (item.addSource) {
                    item.addSource(this, settings);
                } else {
                    _debug && console.log('empty: ', item.command);
                }
            }
        },
        removeReference: function (Reference) {
            _debug && console.log('remove reference ' + Reference.label, Reference);
            this._references && _.each(this._references, function (ref) {
                if (ref && ref.item == Reference) {
                    this._references && this._references.remove(ref);
                }
            }, this);
        },
        updateReferences: function (args) {


            var property = args.property,
                value = args.value;

            if (!this._references) {
                this._references = [];
            }

            for (var i = 0; i < this._references.length; i++) {

                var link = this._references[i],
                    item = link.item,
                    settings = link.settings,
                    store = item._store;

                if (this._originReference == item) {
                    continue;
                }

                if (args.property && settings.properties && settings.properties[args.property]) {

                    if (store) {
                        store._ignoreChangeEvents = true;
                    }
                    try {
                        if (item.onSourceChanged) {
                            item.onSourceChanged(property, value);
                        } else {
                            item.set(property, value);
                        }

                    } catch (e) {
                        _debug && console.error('error updating reference! ' + e, e);
                    }
                    if (store) {
                        store._ignoreChangeEvents = false;
                        store.emit('update', {target: item});
                    }
                }
            }
        },
        constructor: function (properties) {
            this._references = [];
            utils.mixin(this, properties);
        },
        onItemChanged: function (args) {
            this.updateReferences(args);
        }
    };
    //package via declare
    var Module = declare('xgrid.data.Source', null, Implementation);
    Module.dcl = dcl(null, Implementation);
    Module.Implementation = Implementation;
    return Module;
});

/** @module xide/data/TreeMemory **/
define('xide/data/TreeMemory',[
    "dojo/_base/declare",
    'xide/data/Memory',
    'dstore/Tree',
    'dojo/Deferred',
    'dstore/QueryResults'
], function (declare, Memory, Tree, Deferred, QueryResults) {

    /**
     * 
     */
    return declare('xide.data.TreeMemory', [Memory, Tree], {
        _state: {
            filter: null
        },
        parentField: 'parentId',
        reset: function () {
            this._state.filter = null;
            this.resetQueryLog();
        },
        resetQueryLog: function () {
            this.queryLog = [];
        },
        fetchRange: function () {
            // dstore/Memory#fetchRange always uses fetchSync, which we aren't extending,
            // so we need to extend this as well.
            var results = this._fetchRange(arguments);
            return new QueryResults(results.then(function (data) {
                return data;
            }), {
                totalLength: results.then(function (data) {
                    return data.length;
                })
            });
        },
        filter: function (data) {
            var _res = this.inherited(arguments);
            this._state.filter = data;
            return _res;
        },
        _fetchRange: function (kwArgs) {
            var deferred = new Deferred();
            var _res = this.fetchRangeSync(kwArgs);
            var thiz = this;
            if (this._state.filter) {
                //the parent query
                if (this._state && this._state.filter && this._state.filter['parent']) {

                    var _item = this.getSync(this._state.filter.parent);
                    if (_item) {
                        this.reset();
                        var _query = {};
                        if (this.getChildrenSync) {
                            _res = this.getChildrenSync(_item);
                        } else {
                            _query[this.parentField] = _item[this.idProperty];
                            _res = this.root.query(_query);
                        }
                    }
                }

                //the group query
                if (this._state && this._state.filter && this._state.filter['group']) {
                    var _items = this.getSync(this._state.filter.parent);
                    if (_item) {
                        this.reset();
                        _res = _item.items;
                    }
                }
            }
            deferred.resolve(_res);
            return deferred;
        },
        children: function (parent) {
            var filter = {};
            var all = this.root.data, out = [];
            for (var i = 0; i < all.length; i++) {
                var obj = all[i];
                if (obj[this.parentField] == parent[this.idProperty]) {
                    out.push(obj);
                }
            }
            return all;
        },
        mayHaveChildren: function (parent) {
            if (parent._mayHaveChildren === false) {
                return false;
            }
            return true;
        }
    });
});

define('xide/encoding/SHA1',["./_base"], function(base){

	var chrsz=8,	//	change to 16 for unicode.
		mask=(1<<chrsz)-1;

	function R(n,c){ return (n<<c)|(n>>>(32-c)); }
	function FT(t,b,c,d){
		if(t<20){ return (b&c)|((~b)&d); }
		if(t<40){ return b^c^d; }
		if(t<60){ return (b&c)|(b&d)|(c&d); }
		return b^c^d;
	}
	function KT(t){ return (t<20)?1518500249:(t<40)?1859775393:(t<60)?-1894007588:-899497514; }

	function core(x,len){
		x[len>>5]|=0x80<<(24-len%32);
		x[((len+64>>9)<<4)+15]=len;

		var w=new Array(80), a=1732584193, b=-271733879, c=-1732584194, d=271733878, e=-1009589776;
		for(var i=0; i<x.length; i+=16){
			var olda=a, oldb=b, oldc=c, oldd=d, olde=e;
			for(var j=0;j<80;j++){
				if(j<16){ w[j]=x[i+j]; }
				else { w[j]=R(w[j-3]^w[j-8]^w[j-14]^w[j-16],1); }
				var t = base.addWords(base.addWords(R(a,5),FT(j,b,c,d)),base.addWords(base.addWords(e,w[j]),KT(j)));
				e=d; d=c; c=R(b,30); b=a; a=t;
			}
			a=base.addWords(a,olda);
			b=base.addWords(b,oldb);
			c=base.addWords(c,oldc);
			d=base.addWords(d,oldd);
			e=base.addWords(e,olde);
		}
		return [a, b, c, d, e];
	}

	function hmac(data, key){
		var wa=toWord(key);
		if(wa.length>16){ wa=core(wa, key.length*chrsz); }

		var ipad=new Array(16), opad=new Array(16);
		for(var i=0;i<16;i++){
			ipad[i]=wa[i]^0x36363636;
			opad[i]=wa[i]^0x5c5c5c5c;
		}

		var hash=core(ipad.concat(toWord(data)),512+data.length*chrsz);
		return core(opad.concat(hash), 512+160);
	}

	function toWord(s){
		var wa=[];
		for(var i=0, l=s.length*chrsz; i<l; i+=chrsz){
			wa[i>>5]|=(s.charCodeAt(i/chrsz)&mask)<<(32-chrsz-i%32);
		}
		return wa;	//	word[]
	}

	function toHex(wa){
		//	slightly different than the common one.
		var h="0123456789abcdef", s=[];
		for(var i=0, l=wa.length*4; i<l; i++){
			s.push(h.charAt((wa[i>>2]>>((3-i%4)*8+4))&0xF), h.charAt((wa[i>>2]>>((3-i%4)*8))&0xF));
		}
		return s.join("");	//	string
	}

	function _toString(wa){
		var s=[];
		for(var i=0, l=wa.length*32; i<l; i+=chrsz){
			s.push(String.fromCharCode((wa[i>>5]>>>(32-chrsz-i%32))&mask));
		}
		return s.join("");	//	string
	}

	function toBase64(/* word[] */wa){
		// summary:
		//		convert an array of words to base64 encoding, should be more efficient
		//		than using dojox.encoding.base64
		var p="=", tab="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s=[];
		for(var i=0, l=wa.length*4; i<l; i+=3){
			var t=(((wa[i>>2]>>8*(3-i%4))&0xFF)<<16)|(((wa[i+1>>2]>>8*(3-(i+1)%4))&0xFF)<<8)|((wa[i+2>>2]>>8*(3-(i+2)%4))&0xFF);
			for(var j=0; j<4; j++){
				if(i*8+j*6>wa.length*32){
					s.push(p);
				} else {
					s.push(tab.charAt((t>>6*(3-j))&0x3F));
				}
			}
		}
		return s.join("");	//	string
	};

	//	public function
	base.SHA1=function(/* String */data, /* dojox.encoding.digests.outputTypes? */outputType){
		// summary:
		//		Computes the SHA1 digest of the data, and returns the result according to output type.
		var out=outputType||base.outputTypes.Base64;
		var wa=core(toWord(data), data.length*chrsz);
		switch(out){
			case base.outputTypes.Raw:{
				return wa;	//	word[]
			}
			case base.outputTypes.Hex:{
				return toHex(wa);	//	string
			}
			case base.outputTypes.String:{
				return _toString(wa);	//	string
			}
			default:{
				return toBase64(wa);	//	string
			}
		}
	};

	//	make this private, for later use with a generic HMAC calculator.
	base.SHA1._hmac=function(/* string */data, /* string */key, /* dojox.encoding.digests.outputTypes? */outputType){
		// summary:
		//		computes the digest of data, and returns the result according to type outputType
		var out=outputType || base.outputTypes.Base64;
		var wa=hmac(data, key);
		switch(out){
			case base.outputTypes.Raw:{
				return wa;	//	word[]
			}
			case base.outputTypes.Hex:{
				return toHex(wa);	//	string
			}
			case base.outputTypes.String:{
				return _toString(wa);	//	string
			}
			default:{
				return toBase64(wa);	//	string
			}
		}
	};

	return base.SHA1;
});

/** @module xide/mixins/ReloadMixin **/
define('xide/mixins/ReloadMixin',[
    "xdojo/declare",
    "dcl/dcl",
    'xide/types',
    'xide/utils',
    'xide/mixins/EventedMixin'
], function (declare,dcl,types, utils,EventedMixin) {

    /**
     * Mixin which adds functions for module reloading to the consumer. All functions
     * of the reloaded module will be overridden with the re-loaded module's version.
     * Recommended: turn off web-cache and use turn on 'cacheBust' in your Dojo-Config.
     *
     *
     *  <b>Usage</b> :
     *  1. call initReload manually (subscribes to types.EVENTS.ON_MODULE_RELOADED which is triggered by module:xide/manager/Context )
     *  2. that's it actually.
     *  3. optionally add a function 'onReloaded' to your sub class and refresh yourself, ie: re-create widgets or simply test
     *  a piece of code
     *
     *
     * @mixin module:xide/mixins/ReloadMixin
     * @requires module:xide/mixins/EventedMixin
     */
    var Impl = {
        /**
         *
         * Not used yet, but at @TODO: some flags to describe the hot-replace for reloaded modules
         *
         */
        _mergeFunctions: true,
        _mergeMissingVariables: true,
        /**
         * Cross instanceOf equal check, tries:
         *
         *  1. native
         *  2. Dojo::isInstanceOf
         *  3. baseClasses
         *
         * @param cls {Object}
         * @returns {boolean}
         */
        isInstanceOf_: function (cls) {

            try {

                //Try native and then Dojo declare's _Stateful::isInstanceOf
                if (!!this instanceof cls
                    || (this.isInstanceOf && this.isInstanceOf(cls))) {

                    return true;

                }else{

                    //manual lookup, browse all base classes and their superclass
                    var bases = utils.getAt(this, 'constructor._meta.bases', []),//save get, return base::at[path] or empty array
                        _clsClass = cls.prototype.declaredClass;    //cache

                    //save space
                    return _.findWhere(bases, function (_base) {

                        return _base == cls    //direct cmp
                        || utils.getAt(_base, 'superclass.declaredClass') === _clsClass   //mostly here
                        || utils.getAt(_base, 'prototype.declaredClass') === _clsClass;    //sometimes

                    });

                }

            } catch (e) {
                //may crash, no idea why!
                console.log('ReloadMixin :: this.isInstanceOf_ crashed ' + e);
            }

            return false;

        },
        /**
         * @TODO: use flag guarded mixin
         *
         * @param target
         * @param source
         */
        mergeFunctions: function (target, source) {
            for (var i in source) {
                var o = source[i];
                if (i === 'constructor' || i === 'inherited') {
                    continue;
                }
                if (_.isFunction(source[i])) {
                    target[i] = null;//be nice
                    target[i] = source[i];//override
                }
                //support missing properties
                if (_.isArray(source[i])) {
                    if (target[i] == null) {
                        target[i] = source[i];
                    }
                }
            }
        },
        /**
         * Event callback for xide/types/EVENTS/ON_MODULE_RELOADED when a module has been reloaded.
         * @member
         * @param evt
         */
        onModuleReloaded: function (evt) {
            //console.log('on module reloaded');
            var newModule = evt.newModule;
            if (!newModule || !newModule.prototype || evt._processed) {
                return;
            }
            var moduleProto = newModule.prototype,
                moduleClass = moduleProto.declaredClass,
                matchedByClass = false,
                thisClass = this.declaredClass,
                thiz=this;

            if(!moduleClass){
                return;
            }
            if (moduleClass && thisClass) {
                //determine by dotted normalized declaredClass
                matchedByClass = utils.replaceAll('/', '.', thisClass) === utils.replaceAll('/', '.', moduleClass);
            }
            if (matchedByClass) {
                thiz.mergeFunctions(thiz, moduleProto);
                if (thiz.onReloaded) {
                    evt._processed = true;
                    thiz.onReloaded(newModule);
                }
            } else if (evt.module && utils.replaceAll('//', '/', evt.module) === thisClass) {//not sure this needed left
                //dcl module!
                thiz.mergeFunctions(thiz, moduleProto);
            }
        },
        /**
         * Public entry; call that in your sub-class to init this functionality!
         */
        initReload: function () {
            this.subscribe(types.EVENTS.ON_MODULE_RELOADED);
        }
    };

    //package via declare
    var _class = declare(null,Impl);

    //static access to Impl.
    _class.Impl = Impl;

    _class.dcl = dcl(EventedMixin.dcl,Impl);

    return _class;

});
/** @module xide/model/Component **/
define('xide/model/Component',[
    "dojo/_base/declare",
    "dojo/Deferred",
    "dojo/has",
    "require",
    "xide/model/Base",
    "xide/types",
    "xide/mixins/EventedMixin",
    "xide/mixins/ReloadMixin"
], function (declare, Deferred, has, require, Base, types, EventedMixin, ReloadMixin) {
    /**
     * COMPONENT_FLAGS is a number of flags being used for the component's instance creation. Use an object instead of
     * an integer, never know how big this becomes and messing with 64bit integers doesn't worth the effort.
     *
     * @enum module:xide/types/COMPONENT_FLAGS
     * @memberOf module:xide/types
     * @extends xide/types
     */
    types.COMPONENT_FLAGS = {
        /**
         * Due the object instantiation, instruct the component loader to call ::load()
         * @constant
         */
        LOAD: 1,
        /**
         * Due the object instantiation, instruct the component loader to call ::run()
         * @constant
         */
        RUN: 1
    };

    /**
     *
     *
     * @class xide/model/Component
     *
     * @augments xide/mixins/EventedMixin
     * @augments xide/mixins/ReloadMixin
     * @extends xide/model/Base
     */
    return declare("xide/model/Component", [Base, EventedMixin, ReloadMixin], {
        /**
         * Flag indicating that all dependencies are fully loaded
         * @type {boolean}
         * @default false
         */
        _loaded: false,
        /**
         * Pointer to a context, filled by the component loader
         * @member module:xide/manager/Context
         */
        ctx: null,
        /**
         * Pointer to an optional owner
         * @member {Object|null}
         */
        owner: {
            reloadComponent: function () {
            }
        },
        /**
         * Usually a component is about a new beantype.
         * @TODO handle many
         */
        beanType: null,
        /**
         * Array of typical JS packages
         * @member {Array|null} packages
         */
        packages: null,

        /**
         * Array of resources. A components has typically a bunch of resources like CSS.
         * @member {Array} resources
         */
        resources: [],
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        //  Implement base interface
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        getDependencies: function () {
            return [];
        },
        hasEditors: function () {
            return [];
        },
        /**
         * Return a human readable string
         * @returns {string}
         */
        getLabel: function () {
            return "Have no label";
        },
        /**
         * If this component has additional dependencies, load them here!
         * @returns {dojo.Deferred}
         */
        load: function (hasName) {
            var _defered = new Deferred(),
                thiz = this,
                _re = require;

            hasName = hasName || this.getLabel();

            _re(this.getDependencies(), function () {
                thiz._loaded = true;
                if (hasName) {
                    has.add(hasName, function () {
                        return true
                    });
                }
                _defered.resolve();
            });
            return _defered.promise;
        },
        run: function () {
            return false;
        },
        onModuleReloaded: function () {
            this.owner.reloadComponent(this);
        },
        isLoaded: function () {
            return this._loaded;
        }
    });
});


define('requirejs-dplugins/has',["module"], function (module) {
	var cache = (module.config && module.config()) || {};
	var tokensRE = /[\?:]|[^:\?]+/g;

	function resolve(resource, has, isBuild) {
		var tokens = resource.match(tokensRE);
		var i = 0;
		var get = function (skip) {
			var term = tokens[i++];
			if (term === ":") {
				// empty string module name; therefore, no dependency
				return "";
			} else {
				// postfixed with a ? means it is a feature to branch on, the term is the name of the feature
				if (tokens[i++] === "?") {
					var hasResult = has(term);
					if (hasResult === undefined && isBuild) {
						return undefined;
					} else if (!skip && hasResult) {
						// matched the feature, get the first value from the options
						return get();
					} else {
						// did not match, get the second value, passing over the first
						get(true);
						return get(skip);
					}
				}
				// A module or empty string.
				// This allows to tell apart "undefined flag at build time" and "no module required" cases.
				return term || "";
			}
		};
		return get();
	}

	function forEachModule(tokens, callback) {
		for (var i = 0; i < tokens.length; i++) {
			if (tokens[i] !== ":" && tokens[i] !== "?" && tokens[i + 1] !== "?") {
				callback(tokens[i], i);
			}
		}
	}

	var has = function (name) {
		var global = (function () {
			return this;
		})();

		return typeof cache[name] === "function" ? (cache[name] = cache[name](global)) : cache[name]; // Boolean
	};

	has.cache = cache;

	has.add = function (name, test, now, force) {
		if (!has("builder")) {
			(typeof cache[name] === "undefined" || force) && (cache[name] = test);
			return now && has(name);
		}
	};

	has.normalize = function (resource, normalize) {
		var tokens = resource.match(tokensRE);

		forEachModule(tokens, function (module, index) {
			tokens[index] = normalize(module);
		});

		return tokens.join("");
	};

	has.load = function (resource, req, onLoad, config) {
		config = config || {};

		if (!resource) {
			onLoad();
			return;
		}

		var mid = resolve(resource, has, config.isBuild);

		if (mid) {
			req([mid], onLoad);
		} else {
			onLoad();
		}
	};

	has.addModules = function (pluginName, resource, addModules) {
		var modulesToInclude = [];

		var mid = resolve(resource, has, true);
		if (mid) {
			modulesToInclude.push(mid);
		} else if (typeof mid === "undefined") {
			// has expression cannot be resolved at build time so include all the modules just in case.
			var tokens = resource.match(tokensRE);
			forEachModule(tokens, function (module) {
				modulesToInclude.push(module);
			});
		}

		addModules(modulesToInclude);
	};

	return has;
});


define('xide/debug',[
    'xdojo/declare',
    'dojo/has',
    'xdojo/has!debug?xide/serverDebug'
],function(declare,has,serverDebug){
	var Module = declare("xide.debug", null,{});

    if(has('debug')) {

        function displayServerDebugData(data){
            serverDebug && serverDebug.logError(data);
        }

        window.xappServerDebug = displayServerDebugData;

        var callback = function (stackframes) {
            var stringifiedStack = stackframes.map(function (sf) {
                return sf.toString();
            }).join('\n');
            console.log(stringifiedStack);
        };

        var errback = function (err) {
            console.log(err.message);
        };


        window.onerror = function (msg, file, line, col, error) {
            StackTrace.fromError(error).then(callback)['catch'](errback);
        };
        if (!window.logError) {
            window.logError = function (e, message) {
                console.error((message || '') + ' :: ' + e.message + ' stack:\n', e);
                if (typeof 'StackTracke' === 'undefined') {
                    var stack = e.stack;
                    stack = stack.split('\n').map(function (line) {
                        return line.trim();
                    });
                    stack.splice(stack[0] == 'Error' ? 2 : 1);
                    console.log(stack.join('\n'));
                } else {
                    StackTrace.fromError(e).then(callback)['catch'](errback);

                }
            }
        } else {
            console.log('logError already created');
        }
    }else{
        window.onerror = function (msg, file, line, col, error) {
            console.error(msg, error);
        };
        window.logError = function (e, message) {
            console.error((message || '') + ' :: ' + e.message + ' stack:\n', e);
        }
    }
    return Module;
});
define('xide/mixins/ReferenceMixin',[
    'dcl/dcl',
    "dojo/_base/declare",
    'xide/types',
    'xide/utils',
    'xide/registry'
], function (dcl, declare, types, utils, registry) {
    /**
     *
     * @param queryString
     * @param startNode
     * @param single
     * @returns {*}
     */
    utils.find = function (queryString, startNode, single) {
        var nodes = $(startNode).find(queryString);
        if (nodes && nodes.length > 0) {
            return single === false ? nodes : nodes[0];
        }
        return null;
    };

    /**
     *
     * @param scope
     * @param id
     * @returns {*}
     */
    function getElement(scope, id) {
        var dst = scope.document.getElementById(id);
        if (dst) {
            return dst;
        }
        return null;
    }

    var Implementation = {
        _targetReference: null,
        getTarget: function () {
            return this._targetReference || this.inherited(arguments);
        },
        skipWidgetCSSClasses: [
            'dijitButtonHover',
            'dijitHover',
            'dijit',
            'dijitInline',
            'dijitReset',
            'dijitCheckBoxChecked',
            'dijitChecked',
            'dijitLeft'
        ],
        _cssClassesToQuery: function (string) {
            var result = '';
            if (string) {
                var els = string.split(' ');
                for (var i = 0; i < els.length; i++) {

                    if (utils.contains(this.skipWidgetCSSClasses, els[i]) > -1 ||
                        els[i].toLowerCase().indexOf('hover') > -1) {
                        continue;
                    }
                    result += '' + els[i];
                }
            }
            return result.trim();
        },
        resolveReference: function (params,settings) {
            var override = null;
            try{
                override = this.getTarget();
            }catch(e){
                logError(e);
                return null;
            }
            var scope = this.scope;

            var query = params.reference;


            if (!params || !query || !query.length) {
                if (override) {
                    return [override];
                }
            }

            switch (params.mode) {
                //By id, try widget instance first, then try regular HTMLElement
                //
                case types.WIDGET_REFERENCE_MODE.BY_ID:
                {
                    if (this.scope && this.scope.document) {
                        var out = [];
                        if (query.indexOf(' ') !== -1) {

                            var ids = query.split(' ');
                            for (var i = 0; i < ids.length; i++) {
                                var el = getElement(scope, ids[i]);
                                if (el) {
                                    out.push(el);
                                }
                            }
                        } else {
                            return [getElement(scope, query)];
                        }
                        return out;
                    }

                    var _byRegistry = registry.byId(query);
                    var _byDoc = typeof document !=='undefined' ? document.getElementById(query) : null;
                    if(_byRegistry || _byDoc){
                        return _byRegistry ? [_byRegistry] : [_byDoc];
                    }
                    break;
                }
                //By declared widget class
                //
                case types.WIDGET_REFERENCE_MODE.BY_CLASS:
                {
                    var obj = dojo.getObject(query) || dcl.getObject(query);
                    if (obj) {
                        return [obj];
                    }
                    break;
                }
                // By css class list
                //
                case types.WIDGET_REFERENCE_MODE.BY_CSS:
                {
                    var _query = this._cssClassesToQuery(query);
                    this._parseString && (_query = this._parseString(_query,settings,null,settings && settings.flags ? settings.flags : types.CIFLAG.EXPRESSION) || _query);
                    var _$ = null;
                    if (this.scope && this.scope.global && this.scope.global['$']) {
                        _$ = this.scope.global['$'];
                    }else if(typeof $!=='undefined'){
                        _$ = $;
                    }
                    if (_$) {
                        var _elements = _$(_query);
                        if (_elements) {
                            return _elements;
                        }
                    }
                    var objects = utils.find(_query, null, false);
                    if (objects) {
                        return objects;
                    }
                    break;
                }
            }
            return null;
        }
    };
    var Module = declare('xblox.model.ReferenceMixin', null, Implementation);
    Module.dcl = dcl(null, Implementation);
    return Module;
});
define('xide/min',[
    'xide/utils',
    'xide/utils/StringUtils',
    'xide/utils/HTMLUtils',
    'xide/utils/WidgetUtils',
    'xide/types',
    'xide/types/Types',
    'xide/factory',
    'xide/factory/Objects',
    'xide/factory/Events',
    'xide/lodash'
], function () {
});
define('xide/manager/BeanManager',[
    'dcl/dcl',
    "dojo/_base/lang",
    "xide/utils",
    'xide/encoding/MD5',
    'xide/registry',
    'xide/data/TreeMemory'
], function (dcl,lang, utils, MD5, registry, TreeMemory) {

    return dcl(null,{
        declaredClass:'xide.manager.BeanManager',
        beanNamespace: 'beanNS',
        beanName: 'beanName',
        /**
         *
         * @param title
         * @param scope
         * @param parentId
         * @param path
         * @param isDir
         * @param beanType
         * @returns {{name: *, isDir: *, parentId: *, path: *, beanType: *, scope: *}}
         */
        createItemStruct: function (title, scope, parentId, path, isDir, beanType) {
            return {
                name: title,
                isDir: isDir,
                parentId: parentId,
                path: path,
                beanType: beanType,
                scope: scope
            };
        },
        /////////////////////////////////////////////////////////////////////////////////////
        //
        //  Standard impl of the bean interface
        //
        /////////////////////////////////////////////////////////////////////////////////////
        getMetaValue: function (item, title) {
            var path = this.itemMetaPath || 'user';
            return utils.getCIInputValueByName(utils.getAt(item, path), title);
        },
        /***********************************************************************/
        /*
         * @Obselete
         */
        setCurrentItem: function (item) {},
        getItem: function () {},
        onItemSelected: function (evt) {},
        onItemAdded: function (res) {},
        onItemRemoved: function (res) {},
        reload: function (){},


        /////////////////////////////////////////////////////////////////////////////////////
        //
        //  UX related utils
        //
        /////////////////////////////////////////////////////////////////////////////////////
        /***
         * Determine a parent container for new views. Currently
         * the 'Application' holds a 'mainView' instance which
         * prepares us a tab container.
         *
         * @returns {*}
         */
        getViewTarget: function () {
            var mainView = this.ctx.getApplication().mainView;
            return mainView.getNewAlternateTarget();
        },
        getRightTopTarget: function (clear, open, style, className) {
            var mainView = this.ctx.getApplication().mainView;
            return mainView.getRightTopTarget(clear, open, style, className);
        },
        getLayoutRightMain: function (clear, open) {
            var mainView = this.ctx.getApplication().mainView;
            return mainView.getLayoutRightMain(clear, open);
        },
        getRightBottomTarget: function (clear, open) {
            var mainView = this.ctx.getApplication().mainView;
            return mainView.getRightBottomTarget(clear, open);
        },
        /***
         * getViewId generates a unique id upon a driver's scope and the drivers path.
         * @param item
         * @returns {string}
         */
        getViewId: function (item, suffix) {
            return this.beanNamespace + MD5(utils.toString(item.scope) + utils.toString(item.path), 1) + (suffix != null ? suffix : '');
        },
        /**
         *
         * @param item
         */
        getView: function (item, suffix) {
            var id = this.getViewId(item, suffix);
            var view = registry.byId(id);
            return view;
        },
        /////////////////////////////////////////////////////////////////////////////////////
        //
        //  Data related
        //
        /////////////////////////////////////////////////////////////////////////////////////
        /***
         * @returns {dojo.data.ItemFileWriteStore}
         */
        getStore: function () {
            return this.store;
        },
        /***
         * Common function that this instance is in a valid state
         * @returns {boolean}
         */
        isValid: function () {
            return this.store != null;
        },
        /***
         * Inits the store with the driver data
         * @param data
         * @returns {xide.data.TreeMemory}
         */
        initStore: function (data) {
            this.store = new TreeMemory({
                data: data.items,
                idProperty: 'path'
            });
            this.onStoreReady(this.store);
            return this.store;
        },
        /**
         * Stub
         */
        onStoreReady: function () {},
        /////////////////////////////////////////////////////////////////////////////////////
        //
        //  Server methods
        //
        /////////////////////////////////////////////////////////////////////////////////////
        createGroup: function (scope, name, readyCB) {
            return this.callMethodEx(null, 'createGroup', [scope, name], readyCB, true);
        },
        removeGroup: function (scope, path, name, readyCB) {
            return this.callMethodEx(null, 'removeGroup', [scope, path, name], readyCB, true);
        },
        removeItem: function (scope, path, name, readyCB) {
            return this.callMethodEx(null, 'removeItem', [scope, path, name], readyCB, true);
        },
        /**
         * Shared for consumer
         * @param ci
         * @param newValue
         * @param oldValue
         * @param storeRef
         */
        updateCI: function (ci, newValue, oldValue, storeRef) {

            if (ci && storeRef) {

                this.updateItemMetaData(
                    utils.toString(storeRef.scope), //the scope of the driver
                    utils.toString(storeRef.path),  //the relative path of the driver
                    this.itemMetaStorePath || '/inputs',  //the path of the CIS in the meta db
                    {
                        id: utils.toString(ci.id)
                    },
                    {
                        value: newValue
                    }
                );
            }
        },
        /**
         * updateItemMetaData updates a CI in the drivers meta data store
         * @param scope {string}
         * @param driverMetaPath {string}
         * @param dataPath {string} : /inputs
         * @param query
         * @param value
         * @param readyCB
         * @param errorCB
         * @returns {*}
         */
        updateItemMetaData: function (scope, driverMetaPath, dataPath, query, value, readyCB, errorCB) {
            return this.callMethodEx(null, 'updateItemMetaData', [scope, driverMetaPath, dataPath, query, value], readyCB, false);
        },
        mergeNewModule: function (source) {
            for (var i in source) {
                var o = source[i];
                if (o && _.isFunction(o)) {
                    this[i] = o;
                }
            }
        },
        _onReloaded:function(newModule){
            this.mergeNewModule(newModule.prototype);
            var _class = this.declaredClass;
            var _module = lang.getObject(utils.replaceAll('/', '.', _class)) || lang.getObject(_class);
            if(_module){
                if(_module.prototype && _module.prototype.solve){
                    this.mergeNewModule(_module.prototype);
                }
            }
        }
    });
});
/** module:xide/manager/Context **/
define('xide/manager/ContextBase',[
    'dcl/dcl',
    'xide/factory',
    'xide/types',
    'xide/utils',
    'xide/mixins/EventedMixin',
    'dojo/_base/kernel',
    'dojo/_base/lang'
], function (dcl,factory, types,utils,EventedMixin,dojo,lang) {
    var _debug = false;
    /**
     * @class module:xide/manager/ContextBase
     */
    var Module = dcl(EventedMixin.dcl,{
        declaredClass:"xide.manager.ContextBase",
        language: "en",
        managers: [],
        mixins: null,
        getModule:function(_module){
            return lang.getObject(utils.replaceAll('/', '.', _module)) || lang.getObject(_module) || (dcl.getObject ? dcl.getObject(_module) || dcl.getObject(utils.replaceAll('/', '.', _module)) : null);
        },
        /***
         * createManager creates and instances and tracks it in a local array.
         * @param clz : class name or prototype
         * @param config {object|null}: explicit config, otherwise its using local config
         * @param ctrArgs {object|null}: extra constructor arguments
         * @returns {module:xide/manager/ManagerBase} : instance of the manager
         */
        createManager: function (clz, config, ctrArgs) {
            try {
                if (!this.managers) {
                    this.managers = [];
                }
                //1. prepare constructor arguments
                var ctrArgsFinal = {
                    ctx: this,
                    config: config || this.config
                };
                utils.mixin(ctrArgsFinal, ctrArgs);
                if (_.isString(clz) && this.namespace) {
                    var _clz = null;
                    if (clz.indexOf('.') == -1) {
                        _clz = this.namespace + clz;
                    } else {
                        _clz = '' + clz;
                    }
                    //test this really exists, if not fallback to default namespace
                    if (!dojo.getObject(_clz) || !dcl.getObject(_clz)) {
                        _debug && console.log('creating manager instance : ' + _clz + ' doesnt exists!' + ' Using default! ');
                        clz = this.defaultNamespace + clz;
                    } else {
                        clz = _clz;
                    }
                    _debug && console.log('creating manager instance : ' + clz);
                } else if (_.isObject(clz)) {
                    _debug &&  console.log('creating manager instance : ' + (clz.declaredClass || clz.prototype.declaredClass));
                }

                //2. create instance
                var mgr = factory.createInstance(clz, ctrArgsFinal);
                if (!mgr) {
                    _debug && console.error('creating manager instance failed : ' + clz);
                    return;
                }

                //3. track instance
                this.managers.push(mgr);

                //4. tell everybody
                factory.publish(types.EVENTS.ON_CREATED_MANAGER, {
                    instance: mgr,
                    className: clz,
                    ctx: this,
                    config: config || this.config
                });
                return mgr;
            } catch (e) {
                console.error('error creating manager ' + e, arguments);
            }
        },
        constructManagers: function () {},
        initManagers: function () {},
        /***
         * Monkey patch prototypes
         * @param mixins
         */
        doMixins: function (mixins) {
            this.mixins = mixins || this.mixins;
            for (var i = 0; i < mixins.length; i++) {
                var mixin = mixins[i];
                var obj = dojo.getObject(mixin.declaredClass) || dcl.getObject(mixin.declaredClass);
                if (mixin.declaredClass === this.declaredClass) {
                    obj = this;
                }
                if (obj) {
                    utils.mixin(obj.prototype, mixin.mixin);
                } else {
                    _debug && console.error('couldnt apply mixin to : ' + mixin.declaredClass);
                }
            }
        }
    });
    dcl.chainAfter(Module,'constructManagers');
    dcl.chainAfter(Module,'initManagers');
    return Module;
});

/** module:xide/manager/Context **/
define('xide/manager/Context',[
    'dcl/dcl',
    'dojo/Deferred',
    'dojo/has',
    'xide/manager/ContextBase',
    'xide/types',
    'xide/utils',
    'require',
    "dojo/promise/all",
    'xdojo/has!host-browser?xide/manager/Context_UI'
], function (dcl, Deferred, has, ContextBase, types, utils, _require, all, Context_UI) {

    !has('host-browser') && has.add('xlog', function () {
        return true;
    }, true);

    var isServer = has('host-node'),
        isBrowser = has('host-browser'),
        bases = isBrowser ? [ContextBase, Context_UI] : [ContextBase],
        debugFileChanges = false,
        debugModuleReload = true;

    /**
     * @class module:xide/manager/Context
     * @extends module:xide/manager/ContextBase
     */
    var Module = dcl(bases, {
        declaredClass: "xide.manager.Context",
        application: null,
        contextManager: null,
        fileManager: null,
        resourceManager: null,
        notificationManager: null,
        serviceObject: null,
        pluginManager: null,
        windowManager: null,
        logManager: null,
        mountManager: null,
        config: null,
        managers: null,
        namespace: 'xide.manager.',
        defaultNamespace: 'xide.manager.',
        vfsMounts: null,
        xideServiceClient: null,
        fileUpdateTimes: {},
        /***********************************************************************/
        /*
         * Global event handlers
         */
        onXIDEMessage: function (data, publish) {
            if (!data || !data.event) {
                return;
            }
            var thiz = this;
            if (data.event === types.EVENTS.ON_FILE_CHANGED) {
                debugFileChanges && console.log("on file changed ", data);
                //inotify plus
                if (data.data && data.data.mask && data.data.mask.indexOf('delete') !== -1) {
                    thiz.publish(types.EVENTS.ON_FILE_DELETED, data);
                    return;
                }

                if (data.data && data.data.type == 'delete') {
                    thiz.publish(types.EVENTS.ON_FILE_DELETED, data);
                    return;
                }
                var _path = data.data.path;
                var timeNow = new Date().getTime();
                if (thiz.fileUpdateTimes[_path]) {
                    var last = thiz.fileUpdateTimes[_path];
                    var diff = timeNow - last;
                    if (diff < 1000) {
                        thiz.fileUpdateTimes[_path] = timeNow;
                        return;
                    }
                }


                publish !== false && thiz.publish(data.event, data);
                thiz.fileUpdateTimes[_path] = timeNow;
                //path is absolute and might look like: /PMaster/projects/xbox-app/client/src/lib/xfile/Views.js
                //fix windows path
                var path = utils.replaceAll('\\', '/', data.data.path);
                path = utils.replaceAll('//', '/', data.data.path);
                path = path.replace(/\\/g, "/");

                if (path.indexOf('/build/') !== -1) {
                    return;
                }

                if (path == null || path.indexOf == null) {
                    return;
                }
                if (path.match(/\.css$/)) {
                    thiz.onCSSChanged({
                        path: path
                    });
                }
                /**
                 * Try generic
                 */
                if (path.match(/\.js$/)) {
                    var modulePath = data.data.modulePath;
                    if (modulePath) {
                        modulePath = modulePath.replace('.js', '');
                        var _re = _require;//hide from gcc
                        //try pre-amd module
                        var module = null;
                        try {
                            module = _re(modulePath);
                        } catch (e) {
                        }


                        //special: driver
                        var _start = 'data/system/drivers';
                        if (path.indexOf(_start) != -1) {
                            var libPath = path.substr(path.indexOf(_start) + (_start.length + 1 ), path.length);
                            libPath = libPath.replace('.js', '');
                            modulePath = 'system_drivers/' + libPath;
                        }

                        _start = 'user/drivers';
                        if (path.indexOf(_start) != -1) {
                            var libPath = path.substr(path.indexOf(_start) + (_start.length + 1 ), path.length);
                            libPath = libPath.replace('.js', '');
                            modulePath = 'user_drivers/' + libPath;
                        }


                        var resourceManager = this.getResourceManager(),
                            vfsConfig = resourceManager ? resourceManager.getVariable('VFS_CONFIG') || {} : null;

                        if (vfsConfig && vfsConfig['user_drivers']) {

                            if (path.indexOf(vfsConfig['user_drivers']) !== -1) {
                                var _start = vfsConfig['user_drivers'];
                                _start = _start.replace(/\/+$/, "");
                                var libPath = path.substr(path.indexOf(_start) + (_start.length + 1 ), path.length);
                                libPath = libPath.replace('.js', '');
                                modulePath = 'user_drivers/' + libPath;
                            }
                        }
                        modulePath = utils.replaceAll('.', '/', modulePath);
                        if (modulePath.indexOf('/build/') === -1 && !isServer) {
                            setTimeout(function () {
                                debugModuleReload && console.log('reloading module ' + modulePath);
                                thiz._reloadModule(modulePath, true);
                            }, 400);
                        }
                    }
                }
            }
        },
        onNodeServiceStoreReady: function (evt) {
        },
        mergeFunctions: function (target, source, oldModule, newModule) {
            for (var i in source) {
                var o = source[i];
                if (_.isFunction(source[i])) {
                    if (source[i] && target) {
                        target[i] = source[i];//swap
                    }
                }
            }
        },
        /***********************************************************************/
        /*
         * File - Change - Handlers
         */
        /**
         * Special case when module has been reloaded : update all functions in our singleton
         * managers!
         * @param evt
         */
        reloadModules: function (modules, patch) {
            var head = new Deferred(),
                pluginPromises = [],
                newModules = [],
                thiz = this;

            _require({
                cacheBust: 'time=' + new Date().getTime()
            });

            _.each(modules, function (module) {
                var oldModule = null,
                    dfd = new Deferred();
                if (patch !== false) {
                    oldModule = _require(module);
                }
                _require.undef(module);
                _require([module], function (moduleLoaded) {
                    oldModule && thiz.mergeFunctions(oldModule.prototype, moduleLoaded.prototype);
                    newModules.push(moduleLoaded);
                    dfd.resolve();
                });
                pluginPromises.push(dfd);
            });

            all(pluginPromises).then(function () {
                head.resolve(newModules);
                _require({
                    cacheBust: null
                });
            });
            return head;
        },
        _reloadModule: function (_module, reload) {
            var _errorHandle = null;
            var dfd = new Deferred();
            if (!isServer && _module.indexOf('nodejs') !== -1) {
                return;
            }
            _module = _module.replace('0/8', '0.8');
            function handleError(error) {
                debugModuleReload && console.log(error.src, error.id);
                debugModuleReload && console.error('require error ' + _module, error);
                _errorHandle.remove();
                dfd.reject(error);
            }


            //has its own impl.
            var obj = this.getModule(_module);
            if (obj && obj.prototype && obj.prototype.reloadModule) {
                return obj.prototype.reloadModule();
            }

            _errorHandle = _require.on("error", handleError);

            var oldModule = this.getModule(_module);
            if (!oldModule) {
                oldModule = typeof _module !== 'undefined' ? oldModule : null;
                if (!oldModule && typeof window !== 'undefined') {
                    //try global namespace
                    oldModule = utils.getAt(window, utils.replaceAll('/', '.', _module), null);
                    if (oldModule) {
                        obj = oldModule;
                    } else {
                        try {
                            oldModule = _require(utils.replaceAll('.', '/', _module));
                        } catch (e) {
                            //logError(e,'error requiring '+_module);
                            //dfd.reject(e);
                            debugModuleReload && console.log('couldnt require old module', _module);
                        }
                    }
                }
            }
            if (oldModule) {
                obj = oldModule;
            }

            //remove from dom
            if (isBrowser) {
                var scripts = document.getElementsByTagName('script');
                _.each(scripts, function (script) {
                    if (script && script.src && script.src.indexOf(_module) !== -1) {
                        script.parentElement.removeChild(script);
                    }
                })
            }

            _require.undef(_module);

            var thiz = this;
            if (reload) {
                setTimeout(function () {
                    _require({
                        cacheBust: 'time=' + new Date().getTime(),
                        waitSeconds: 5
                    });
                    try {
                        _require([_module], function (moduleLoaded) {

                            _require({
                                cacheBust: null
                            });
                            if (_.isString(moduleLoaded)) {
                                console.error('module reloaded failed : ' + moduleLoaded + ' for module : ' + _module);
                                return;
                            }
                            moduleLoaded.modulePath = _module;
                            if (obj) {
                                thiz.mergeFunctions(obj.prototype, moduleLoaded.prototype, obj, moduleLoaded);
                                if (obj.prototype && obj.prototype._onReloaded) {
                                    obj.prototype._onReloaded(moduleLoaded);
                                }
                            }

                            if (oldModule && oldModule.onReloaded) {
                                oldModule.onReloaded(moduleLoaded, oldModule);
                            }

                            thiz.publish(types.EVENTS.ON_MODULE_RELOADED, {
                                module: _module,
                                newModule: moduleLoaded
                            });

                            if (moduleLoaded.prototype && moduleLoaded.prototype.declaredClass) {
                                thiz.publish(types.EVENTS.ON_MODULE_UPDATED, {
                                    moduleClass: moduleLoaded.prototype.declaredClass,
                                    moduleProto: moduleLoaded.prototype
                                });
                            }
                            dfd.resolve(moduleLoaded);
                        });
                    } catch (e) {
                        console.error('error reloading module', e);
                        logError(e, 'error reloading module');
                        dfd.reject(e);
                    }
                }, 100);
            } else {
                dfd.resolve();
            }
            return dfd;
        },
        onCSSChanged: function (evt) {
            if (isBrowser) {
                var path = evt.path;
                var _p = this.findVFSMount(path);
                var _p2 = this.toVFSShort(path, _p);
                path = utils.replaceAll('//', '/', path);
                path = path.replace('/PMaster/', '');
                var reloadFn = window['xappOnStyleSheetChanged'];
                if (reloadFn) {
                    reloadFn(path);
                }
            }
        },
        onDidChangeFileContent: function (evt) {
            if (evt['didProcess']) {
                return;
            }
            evt['didProcess'] = true;
            if (!this.vfsMounts) {
                return;
            }
            if (!evt.path) {
                return;
            }
            var path = evt.path;
            if (path.indexOf('.css') != -1) {
                if (isBrowser) {
                    this.onCSSChanged(evt);
                }
                return;
            }

            if (path.indexOf('resources') != -1 ||
                path.indexOf('meta') != -1 ||
                path.indexOf('.js') == -1) {
                return;
            }

            var mount = evt.mount.replace('/', ''),
                module = null;

            if (!this.vfsMounts[mount]) {
                return;
            }
            module = '' + evt.path;
            module = module.replace('./', '');
            module = module.replace('/', '.');
            module = module.replace('.js', '');
            module = utils.replaceAll('.', '/', module);
            var thiz = this;
            setTimeout(function () {
                try {
                    thiz._reloadModule(module, true);
                } catch (e) {
                    console.error('error reloading module', e);
                }
            }, 100);

        },
        /***********************************************************************/
        /*
         * get/set
         */
        getMount: function (mount) {
            var resourceManager = this.getResourceManager();
            var vfsConfig = resourceManager ? resourceManager.getVariable('VFS_CONFIG') || {} : null;
            if (vfsConfig && vfsConfig[mount]) {
                return vfsConfig[mount];
            }
            return null;
        },
        toVFSShort: function (path, mount) {
            var resourceManager = this.getResourceManager();
            var vfsConfig = resourceManager ? resourceManager.getVariable('VFS_CONFIG') || {} : null;
            if (vfsConfig && vfsConfig[mount]) {
                var mountPath = vfsConfig[mount];
                mountPath = utils.replaceAll('//', '/', mountPath);
                mountPath = mountPath.replace(/\/+$/, "");
                if (path.indexOf(mountPath) !== -1) {
                    var _start = mountPath;
                    _start = _start.replace(/\/+$/, "");
                    var libPath = path.substr(path.indexOf(_start) + (_start.length + 1 ), path.length);
                    return libPath;
                }
            }
            return null;
        },
        findVFSMount: function (path) {
            var resourceManager = this.getResourceManager();
            var vfsConfig = resourceManager ? resourceManager.getVariable('VFS_CONFIG') || {} : null;
            if (vfsConfig) {
                for (var mount in vfsConfig) {
                    var mountPath = vfsConfig[mount];
                    mountPath = utils.replaceAll('//', '/', mountPath);
                    mountPath = mountPath.replace(/\/+$/, "");
                    if (path.indexOf(mountPath) !== -1) {
                        return mount;
                    }
                }

            }
            return null;
        },
        getBlockManager: function () {
            return this.blockManager;
        },
        getPluginManager: function () {
            return this.pluginManager;
        },
        getService: function () {
            return this.serviceObject;
        },
        getFileManager: function () {
            return this.fileManager;
        },
        getResourceManager: function () {
            return this.resourceManager;
        },
        getMountManager: function () {
            return this.mountManager;
        },
        getContextManager: function () {
            return this.contextManager;
        },
        getLogManager: function () {
            return this.logManager;
        },
        getApplication: function () {
            return this.application;
        },
        /***********************************************************************/
        /*
         * STD - API
         */
        constructor: function (config) {
            this.managers = [];
            this.config = config;
            this.language = 'en';
            this.subscribe(types.EVENTS.ON_CHANGED_CONTENT, this.onDidChangeFileContent);
        },
        prepare: function () {
            if (this.config) {
                this.initWithConfig(this.config);
            }
        },
        /**
         * The config is put into the index.php as JSON. The server has also some data
         * which gets mixed into the manager instances.
         * @param config
         */
        initWithConfig: function (config) {
            if (config && config.mixins) {
                this.doMixins(config.mixins);
            }
        },
        isEditor: function () {
            return this.args && this.args.file;
        }
    });
    dcl.chainAfter(Module, 'constructManagers');
    dcl.chainAfter(Module, 'initManagers');
    return Module;
});
/** @module xide/manager/ManagerBase **/
define('xide/manager/ManagerBase',[
    'dcl/dcl',
    'xide/mixins/EventedMixin',
    'xide/model/Base',
    'xide/utils',
    "dojo/_base/xhr",
    "dojo/_base/kernel"
], function (dcl,EventedMixin,Base,utils,xhr,dojo) {
    /**
     * @class module:xide/manager/ManagerBase
     * @augments module:dojo/Stateful
     * @augments module:xide/mixins/EventedMixin
     * @interface
     */
    var Module =dcl([Base.dcl,EventedMixin.dcl],{
        declaredClass:"xide.manager.ManagerBase",
        /**
         * @type module:xide/manager/ContextBase
         * @member ctx A pointer to a xide context
         */
        ctx: null,
        init: function () {
            this.initReload && this.initReload();
        },
        /**
         *
         * @param title
         * @param scope
         * @param parent
         * @returns {*|{name, isDir, parentId, path, beanType, scope}|{name: *, isDir: *, parentId: *, path: *, beanType: *, scope: *}}
         */
        _getText: function (url,options) {
            var result;
            options = utils.mixin({
                url: url,
                sync: true,
                handleAs: 'text',
                load: function (text) {
                    result = text;
                }
            },options);

            var def = xhr.get(options);
            if(!options.sync){
                return def;
            }
            return '' + result + '';
        },
        /**
         * Return context
         * @returns {module:xcf/manager/Context}
         */
        getContext:function(){
            return this.ctx;
        }
    });

    dcl.chainAfter(Module,'init');
    return Module;
});
/** @module xide/manager/PluginManager */
define('xide/manager/PluginManager',[
    'dcl/dcl',
    'dojo/has',
    'xide/manager/ManagerBase',
    'xide/utils',
    'xide/types',
    'xide/factory',
    "dojo/Deferred",
    "dojo/promise/all"
], function (dcl,has,ManagerBase,utils,types,factory,Deferred,all)
{
    var _debug = false;
    /**
     * Plugin manager which provides loading of additional modules at any time after the main layer(s)
     * have been loaded.
     *
     * @class module:xide/manager/PluginManager
     * @extends module:xide/manager/ManagerBase
     */
    return dcl(ManagerBase,{
        declaredClass:"xide.manager.PluginManager",
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        //  Variables
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * When load() receives a module name without a slash, use this prefix
         *
         * @TODO: this must be changed into a map to configure this per 'run-time configuration'
         * @member string _defaultPackageLocationPrefix
         */
        _defaultPackageLocationPrefix:'../../',
        /**
         * When load() receives a module name without a slash, use this prefix
         * @member string _defaultPackageLocationSuffix
         */
        _defaultPackageLocationSuffix:'/component',
        /**
         * Whe loading a component, use this flags by default
         * @member module:xide.types.COMPONENT_FLAGS
         */
        _defaultComponentFlags:{
            /**
             * call load() when loaded
             * @enum module:xide.types.COMPONENT_FLAGS:LOAD
             */
            LOAD:1,
            /**
             * call run() when loaded
             * @enum module:xide.types.COMPONENT_FLAGS:RUN
             */
            RUN:2  //call run() when loaded
        },
        /**
         * Whe loading a component, mixin these properties/members
         * @member {Object}
         */
        defaultComponentMixin:function(flags){
            return {
                owner:this,
                ctx:this.ctx,
                flags:flags
            };
        },
        /**
         * List of modules to add to a components base classes. That will be used to add logging and others
         * @member {String[]}
         */
        componentBaseClasses:null,
        /**
         * Our context object
         * @member module: xide/manager/Context
         */
        ctx:null,
        /**
         * JSON data of plugin data
         * @member {Array}
         */
        pluginResources:null,
        /**
         * Array of plugin instances
         * @member {object[]}
         */
        pluginInstances:null,
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        //  Components
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Called when component::load() is finish
         * @param component
         * @param flags
         * @param deferred
         * @private
         */
        _componentReady:function(component,flags,deferred){
            if (flags.RUN) {

                try {
                    component.run(this.ctx);//fire only, don't bother when it crashes
                }catch(e){
                    _debug && console.error('component: ' + component.getLabel() + ' crashed in run ' + e);
                }
            }
            return deferred.resolve(component);
        },
        /**
         * Called when a component has been loaded
         * @param component
         * @param flags
         * @param componentArguments
         * @param deferred
         * @private
         */
        _componentLoaded:function(component,flags,componentArguments,deferred){
            try {

                //add constructor arguments
                utils.mixin(componentArguments,this.defaultComponentMixin(flags));
                var componentInstance = factory.createInstance(component, componentArguments, this.componentBaseClasses);

                var _afterLoaded = function(componentInstance,flags,deferred){
                    this._componentReady(componentInstance,flags,deferred);
                }.bind(this);


                if (flags.LOAD) {
                    //call load, its async
                    componentInstance.load().then(function(){
                        _afterLoaded(componentInstance,flags,deferred);
                    });
                }else{
                    _afterLoaded(componentInstance,flags,deferred);
                }
            }catch(e){
                _debug && console.error('error in component creation!' + e);
                deferred.reject(arguments);
                logError(e);
            }

        },
        /**
         * Load a component
         *
         * @memberOf module:xide/manager/PluginManager#
         *
         * @param path {string} A require-js module path
         * @param {int} flags being used whilst loading
         * @param {object} componentArguments
         * @param packageLocation {string=}
         * @param packagePath {string=}
         */
        loadComponent:function(path,flags,componentArguments,packageLocation,packagePath){


            //defaults, sanitizing
            componentArguments = componentArguments ==='true' ? {} : componentArguments;

            path = path.indexOf('/') == -1 ? ( this._defaultPackageLocationPrefix + path + this._defaultPackageLocationSuffix ) : path;

            flags = flags!=null ? flags : this._defaultComponentFlags;

            var deferred = new Deferred(),
                self = this;

            var _component = utils.getObject(path);
            if(_component){
                //not loaded yet?
                if(_.isFunction(_component.then)){
                    _component.then(function(module){
                        self._componentLoaded(module,flags,componentArguments,deferred);
                    },function(err){
                        //shouldn't happen
                        console.error('error in loading component at path ' + path,err);
                    });
                }else{
                    //already loaded
                    this._componentLoaded(_component,flags,componentArguments,deferred);
                }
            }else{
                console.error('cant get object at ' + path);
            }

            _debug &&  console.log('load component ' + path);

            return deferred;
        },
        /**
         * Each component has a resource file within its directory with this pattern : resources-config.json.
         * When component is being loaded, we do load also client resources for that component (css,js,...)
         * @param component {xide.model.Component}
         * @param config {string}
         */
        loadComponentResources:function(component,path){},
        /**
         * @TODO
         *
         * @param component
         */
        reloadComponent:function(component){},
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        //
        //  Plugins: to be removed soon.
        //
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * @deprecated
         * @param pluginResources
         */
        loadPlugins:function(pluginResources)
        {
            if(!has('plugins')) {
                return;
            }
            var dfd = new Deferred(),
                pluginPromises = [],
                thiz = this;

            this.pluginResources = pluginResources;
            this.pluginInstances = [];

            if(this.pluginResources){
                for(var i=0 ; i < this.pluginResources.length; i++){
                    var plug = this.pluginResources[i];
                    if(plug.type && plug.type=="JS-PLUGIN" && plug.path){
                        pluginPromises.push(this.loadComponent(plug.path,null,plug).then(function(component){
                            component.pluginResources = plug;
                            thiz.pluginInstances.push(component);
                        }));
                    }else{
                        _debug &&  console.warn('something wrong with plugin data');
                    }
                }
            }
            all(pluginPromises).then(function(){
                dfd.resolve(pluginPromises);
                _debug && console.log('plugins ready',thiz.pluginInstances);
                thiz.publish(types.EVENTS.ALL_PLUGINS_READY,{
                    instances:thiz.pluginInstances,
                    resources:pluginResources
                });
            });
            return dfd;
        }
    });
});
define('xide/rpc/AdapterRegistry',["dojo/_base/kernel", "dojo/_base/lang"], function (dojo, lang) {
    var AdapterRegistry = dojo.AdapterRegistry = function (/*Boolean?*/ returnWrappers) {
        // summary:
        //		A registry to make contextual calling/searching easier.
        // description:
        //		Objects of this class keep list of arrays in the form [name, check,
        //		wrap, directReturn] that are used to determine what the contextual
        //		result of a set of checked arguments is. All check/wrap functions
        //		in this registry should be of the same arity.
        // example:
        //	|	// create a new registry
        //	|	require(["dojo/AdapterRegistry"],
        //	|	function(AdapterRegistry){
        //	|		var reg = new AdapterRegistry();
        //	|		reg.register("handleString",
        //	|			function(str){
        //	|				return typeof val == "string"
        //	|			},
        //	|			function(str){
        //	|				// do something with the string here
        //	|			}
        //	|		);
        //	|		reg.register("handleArr",
        //	|			dojo.isArray,
        //	|			function(arr){
        //	|				// do something with the array here
        //	|			}
        //	|		);
        //	|
        //	|		// now we can pass reg.match() *either* an array or a string and
        //	|		// the value we pass will get handled by the right function
        //	|		reg.match("someValue"); // will call the first function
        //	|		reg.match(["someValue"]); // will call the second
        //	|	});

        this.pairs = [];
        this.returnWrappers = returnWrappers || false; // Boolean
    };

    lang.extend(AdapterRegistry, {
        register: function (/*String*/ name, /*Function*/ check, /*Function*/ wrap, /*Boolean?*/ directReturn, /*Boolean?*/ override) {
            // summary:
            //		register a check function to determine if the wrap function or
            //		object gets selected
            // name:
            //		a way to identify this matcher.
            // check:
            //		a function that arguments are passed to from the adapter's
            //		match() function.  The check function should return true if the
            //		given arguments are appropriate for the wrap function.
            // directReturn:
            //		If directReturn is true, the value passed in for wrap will be
            //		returned instead of being called. Alternately, the
            //		AdapterRegistry can be set globally to "return not call" using
            //		the returnWrappers property. Either way, this behavior allows
            //		the registry to act as a "search" function instead of a
            //		function interception library.
            // override:
            //		If override is given and true, the check function will be given
            //		highest priority. Otherwise, it will be the lowest priority
            //		adapter.
            this.pairs[((override) ? "unshift" : "push")]([name, check, wrap, directReturn]);
        },

        match: function (/* ... */) {
            // summary:
            //		Find an adapter for the given arguments. If no suitable adapter
            //		is found, throws an exception. match() accepts any number of
            //		arguments, all of which are passed to all matching functions
            //		from the registered pairs.
            for (var i = 0; i < this.pairs.length; i++) {
                var pair = this.pairs[i];
                if (pair[1].apply(this, arguments)) {
                    if ((pair[3]) || (this.returnWrappers)) {
                        return pair[2];
                    } else {
                        return pair[2].apply(this, arguments);
                    }
                }
            }
            throw new Error("No match found");
        },

        unregister: function (name) {
            // summary:
            //		Remove a named adapter from the registry
            // name: String
            //		The name of the adapter.
            // returns: Boolean
            //		Returns true if operation is successful.
            //		Returns false if operation fails.

            // FIXME: this is kind of a dumb way to handle this. On a large
            // registry this will be slow-ish and we can use the name as a lookup
            // should we choose to trade memory for speed.
            for (var i = 0; i < this.pairs.length; i++) {
                var pair = this.pairs[i];
                if (pair[0] == name) {
                    this.pairs.splice(i, 1);
                    return true;
                }
            }
            return false;
        }
    });

    return AdapterRegistry;
});

define('xide/rpc/Service',[
    "dojo/_base/kernel",
    "dojo/_base/lang",
    "dojo/_base/xhr",
    "dojo/_base/declare",
    "xide/rpc/AdapterRegistry",
    "dojo/_base/url",
    "xide/utils"
], function(dojo,lang,xhr,declare,AdapterRegistry,url,utils){
    var transportRegistry = new AdapterRegistry(true);
    var envelopeRegistry = new AdapterRegistry(true);
    var _nextId  = 1;
    var _sync = false;

    function getTarget(smd, method){
        var dest=smd._baseUrl;
        if(smd.target){
            dest = new dojo._Url(dest,smd.target) + '';
        }
        if(method.target){
            dest = new dojo._Url(dest,method.target) + '';
        }
        return dest;
    }

    function toOrdered(parameters, args){
        if(dojo.isArray(args)){ return args; }
        var data=[];
        for(var i=0;i<parameters.length;i++){
            data.push(args[parameters[i].name]);
        }
        return data;
    }

    var service = declare("xide.rpc.Service", null, {
        constructor: function(smd, options){
            // summary:
            //		Take a string as a url to retrieve an smd or an object that is an smd or partial smd to use
            //		as a definition for the service
            // description:
            //		dojox.rpc.Service must be loaded prior to any plugin services like dojox.rpc.Rest
            //		dojox.rpc.JsonRpc in order for them to register themselves, otherwise you get
            //		a "No match found" error.
            // smd: object
            //		Takes a number of properties as kwArgs for defining the service.  It also
            //		accepts a string.  When passed a string, it is treated as a url from
            //		which it should synchronously retrieve an smd file.  Otherwise it is a kwArgs
            //		object.  It accepts serviceUrl, to manually define a url for the rpc service
            //		allowing the rpc system to be used without an smd definition. strictArgChecks
            //		forces the system to verify that the # of arguments provided in a call
            //		matches those defined in the smd.  smdString allows a developer to pass
            //		a jsonString directly, which will be converted into an object or alternatively
            //		smdObject is accepts an smdObject directly.

            var url;
            var self = this;
            function processSmd(smd){
                smd._baseUrl = new dojo._Url((dojo.isBrowser ? location.href : dojo.config.baseUrl) ,url || '.') + '';
                self._smd = smd;
                if(options && options.services==='methods'){
                    smd.services = smd.methods;
                    delete smd.methods;
                    smd.transport = "POST";
                    if(options.mixin){
                        lang.mixin(smd,options.mixin);
                    }
                    options = null;
                }

                //generate the methods
                for(var serviceName in self._smd.services){
                    var pieces = serviceName.split("."); // handle "namespaced" services by breaking apart by .
                    var current = self;
                    for(var i=0; i< pieces.length-1; i++){
                        // create or reuse each object as we go down the chain
                        current = current[pieces[i]] || (current[pieces[i]] = {});
                    }
                    current[pieces[pieces.length-1]]=	self._generateService(serviceName, self._smd.services[serviceName]);
                }
            }
            if(smd){
                //ifthe arg is a string, we assume it is a url to retrieve an smd definition from
                if( (dojo.isString(smd)) || (smd instanceof dojo._Url)){
                    if(smd instanceof dojo._Url){
                        url = smd + "";
                    }else{
                        url = smd;
                    }

                    var text = xhr._getText(url);
                    if(!text){
                        throw new Error("Unable to load SMD from " + smd);
                    }else{
                        processSmd(utils.fromJson(text));
                    }
                }else{
                    processSmd(smd);
                }
            }
            this._options = (options ? options : {});
            this._requestId = 0;
        },

        _generateService: function(serviceName, method){
            if(this[method]){
                throw new Error("WARNING: "+ serviceName+ " already exists for service. Unable to generate function");
            }
            method.name = serviceName;

            var func = dojo.hitch(this, "_executeMethod",method);


            var transport = transportRegistry.match(method.transport || this._smd.transport);
            if(transport.getExecutor){
                func = transport.getExecutor(func,method,this);
            }
            var schema = method.returns || (method._schema = {}); // define the schema
            var servicePath = '/' + serviceName +'/';
            // schemas are minimally used to track the id prefixes for the different services
            schema._service = func;
            func.servicePath = servicePath;
            func._schema = schema;
            func.id = _nextId++;
            return func;
        },
        _getRequest: function(method,args){
            var smd = this._smd;
            var envDef = envelopeRegistry.match(method.envelope || smd.envelope || "NONE");
            var parameters = (method.parameters || []).concat(smd.parameters || []);
            if(envDef.namedParams){
                // the serializer is expecting named params
                if((args.length==1) && dojo.isObject(args[0])){
                    // looks like we have what we want
                    args = args[0];
                }else{
                    // they provided ordered, must convert
                    var data={};
                    for(var i=0;i<method.parameters.length;i++){
                        if(typeof args[i] != "undefined" || !method.parameters[i].optional){
                            data[method.parameters[i].name]=args[i];
                        }
                    }
                    args = data;
                }
                if(method.strictParameters||smd.strictParameters){
                    //remove any properties that were not defined
                    for(i in args){
                        var found=false;
                        for(var j=0; j<parameters.length;j++){
                            if(parameters[j].name==i){ found=true; }
                        }
                        if(!found){
                            delete args[i];
                        }
                    }

                }
                // setting default values
                for(i=0; i< parameters.length; i++){
                    var param = parameters[i];
                    if(!param.optional && param.name && !args[param.name]){
                        if(param["default"]){
                            args[param.name] = param["default"];
                        }else if(!(param.name in args)){
                            throw new Error("Required parameter " + param.name + " was omitted");
                        }
                    }
                }
            }else if(parameters && parameters[0] && parameters[0].name && (args.length==1) && dojo.isObject(args[0])){
                // looks like named params, we will convert
                if(envDef.namedParams === false){
                    // the serializer is expecting ordered params, must be ordered
                    args = toOrdered(parameters, args);
                }else{
                    // named is ok
                    args = args[0];
                }
            }

            if(dojo.isObject(this._options)){
                args = dojo.mixin(args, this._options);
            }
            delete args['mixin'];

            var schema = method._schema || method.returns; // serialize with the right schema for the context;
            var request = envDef.serialize.apply(this, [smd, method, args]);
            request._envDef = envDef;// save this for executeMethod
            var contentType = (method.contentType || smd.contentType || request.contentType);

            // this allows to mandate synchronous behavior from elsewhere when necessary, this may need to be changed to be one-shot in FF3 new sync handling model
            return dojo.mixin(request, {
                sync: _sync,
                contentType: contentType,
                headers: method.headers || smd.headers || request.headers || {},
                target: request.target || getTarget(smd, method),
                transport: method.transport || smd.transport || request.transport,
                envelope: method.envelope || smd.envelope || request.envelope,
                timeout: method.timeout || smd.timeout,
                callbackParamName: method.callbackParamName || smd.callbackParamName,
                rpcObjectParamName: method.rpcObjectParamName || smd.rpcObjectParamName,
                schema: schema,
                handleAs: request.handleAs || "auto",
                preventCache: method.preventCache || smd.preventCache,
                frameDoc: this._options.frameDoc || undefined
            });
        },
        _executeMethod: function(method){
            var args = [];
            var i;
            for(i=1; i< arguments.length; i++){
                args.push(arguments[i]);
            }
            var request = this._getRequest(method,args);
            var deferred = transportRegistry.match(request.transport).fire(request);

            deferred.addBoth(function(results){
                return request._envDef.deserialize.call(this,results);
            });
            return deferred;
        }
});

    service.transportRegistry = transportRegistry;
    service.envelopeRegistry = envelopeRegistry;
    service._nextId = _nextId;
    service.getTarget = getTarget;
    service.toOrdered= toOrdered;
    service._sync = _sync;
    envelopeRegistry.register("URL", function(str){ return str == "URL"; },{
		serialize:function(smd, method, data ){
			var d = dojo.objectToQuery(data);
			return {
				data: d,
				transport:"POST"
			};
		},
		deserialize:function(results){
			return results;
		},
		namedParams: true
	});
    envelopeRegistry.register("JSON",function(str){ return str == "JSON"; },{
        serialize: function(smd, method, data){
            var d = dojo.toJson(data);

            return {
                data: d,
                handleAs: 'json',
                contentType : 'application/json'
            };
        },
        deserialize: function(results){
            return results;
        }
    });
    envelopeRegistry.register("PATH",function(str){ return str == "PATH"; },{
        serialize:function(smd, method, data){
			var i;
			var target = getTarget(smd, method);
			if(dojo.isArray(data)){
				for(i = 0; i < data.length;i++){
					target += '/' + data[i];
				}
			}else{
				for(i in data){
					target += '/' + i + '/' + data[i];
				}
			}
			return {
				data:'',
				target: target
			};
		},
		deserialize:function(results){
			return results;
		}
	});
    //post is registered first because it is the default;
    transportRegistry.register("POST",function(str){ return str == "POST"; },{
		fire:function(r){
			r.url = r.target;
			r.postData = r.data;
			return dojo.rawXhrPost(r);
		}
	});
    transportRegistry.register("GET",function(str){ return str == "GET"; },{
		fire: function(r){
			r.url=  r.target + (r.data ? '?' + ((r.rpcObjectParamName) ? r.rpcObjectParamName + '=' : '') + r.data : '');
			return xhr.get(r);
		}
	});
    //only works ifyou include dojo.io.script
    /*
    transportRegistry.register("JSONP",function(str){ return str == "JSONP"; },{
        fire: function(r){
            r.url = r.target + ((r.target.indexOf("?") == -1) ? '?' : '&') + ((r.rpcObjectParamName) ? r.rpcObjectParamName + '=' : '') + r.data;
            r.callbackParamName = r.callbackParamName || "callback";
            return dojo.io.script.get(r);
        }
    });*/
    if(dojo._contentHandlers) {
        dojo._contentHandlers.auto = function (xhr) {
            // automatically choose the right handler based on the returned content type
            var handlers = dojo._contentHandlers;
            var retContentType = xhr.getResponseHeader("Content-Type");
            var results = !retContentType ? handlers.text(xhr) :
                retContentType.match(/\/.*json/) ? handlers.json(xhr) :
                    retContentType.match(/\/javascript/) ? handlers.javascript(xhr) :
                        retContentType.match(/\/xml/) ? handlers.xml(xhr) : handlers.text(xhr);
            return results;
        };
    }
    return service;
});

define('xide/rpc/JsonRPC',[
	"./Service",
    "dojo/errors/RequestError",
	"xide/utils/StringUtils"
], function(Service, RequestError,utils){
	function jsonRpcEnvelope(version){
		return {
			serialize: function(smd, method, data, options){
				//not converted to json it self. This  will be done, if
				//appropriate, at the transport level
	
				var d = {
					id: this._requestId++,
					method: method.name,
					params: data
				};
				if(version){
					d.jsonrpc = version;
				}
				return {
					data: JSON.stringify(d),
					handleAs:'json',
					contentType: 'application/json',
					transport:"POST"
				};
			},
			deserialize: function(obj){
				if ('Error' == obj.name // old xhr
					|| obj instanceof RequestError // new xhr
				){
					obj = utils.fromJson(obj.responseText);
				}
				if(obj.error) {
					var e = new Error(obj.error.message || obj.error);
					e._rpcErrorObject = obj.error;
					return e;
				}
				return obj.result;
			}
		};
	}
    Service.envelopeRegistry.register(
		"JSON-RPC-1.0",
		function(str){
			return str == "JSON-RPC-1.0";
		},
		utils.mixin({namedParams:false}, jsonRpcEnvelope()) // 1.0 will only work with ordered params
	);
    Service.envelopeRegistry.register(
		"JSON-RPC-2.0",
		function(str){
			return str == "JSON-RPC-2.0";
		},
        utils.mixin({namedParams:true }, jsonRpcEnvelope("2.0")) // 2.0 supports named params
	);

});

define('xide/manager/RPCService',[
    'dojo/_base/declare',
    'dojo/_base/kernel',
    'dojo/_base/lang',
    'xide/rpc/Service',
    'xide/rpc/JsonRPC',
    'dojo/has',
    'dojo/Deferred',
    'xide/utils',
    'xide/types',
    'xide/mixins/EventedMixin',
    'xide/encoding/SHA1'
], function (declare,dojo,lang, Service, JsonRPC, has, Deferred,utils,types,EventedMixin,SHA1) {

    return declare("xide.manager.RPCService", [Service,EventedMixin], {
        extraArgs: null,
        signatureField: 'sig',
        signatureToken: null,
        correctTarget: true,
        sync: false,
        defaultOptions: {
            omit: true,
            checkMessages: true,
            checkErrors: true
        },
        onError: function (err) {

            if (err) {
                if (err.code === 1) {

                    if (err.message && _.isArray(err.message)) {

                        this.publish(types.EVENTS.ERROR, {message: err.message.join('<br/>')});
                        return;
                    }
                } else if (err.code === 0) {
                    this.publish(types.EVENTS.STATUS, 'Ok');
                }
            }

            var struct = {
                error: err
            };
            this.publish(types.EVENTS.ERROR, struct, this);
        },
        prepareCall: function () {
            var params = {};



            if (this.config && this.config.RPC_PARAMS) {

                params = utils.mixin(params, this.config.RPC_PARAMS.rpcFixedParams);

                this.extraArgs = params;

                if (this.config.RPC_PARAMS.rpcUserField) {

                    params[this.config.RPC_PARAMS.rpcUserField] = this.config.RPC_PARAMS.rpcUserValue;

                    this.signatureField = this.config.RPC_PARAMS.rpcSignatureField;
                    this.signatureToken = this.config.RPC_PARAMS.rpcSignatureToken;
                }
            }
        },
        runDeferred: function (serviceClassIn, method, args, options) {

            var deferred = new Deferred();

            options = options || this.defaultOptions;


            //check this method exists
            if (!this.checkCall(serviceClassIn, method, options.omit)) {
                return deferred.reject('method doesnt exists: ' + method + ' for service class:' + this.serviceClass + ' in ' + this.declaredClass);
            }

            //setup signing in serviceObject
            this.prepareCall();

            //variable shortcuts
            var service = this,
                serviceClass = this.getServiceClass(serviceClassIn),
                thiz = this;

            var resolve = function (data) {
                deferred.resolve(data);
            };

            var promise = service[serviceClass][method](args);
            promise.then(function (res) {

                //the server has some messages for us
                if (options.checkMessages) {
                    if (res && res.error && res.error.code == 3) {
                        thiz.onMessages(res.error);
                    }
                }

                //check for error messages (non-fatal) and abort
                if (options.checkErrors) {
                    if (res && res.error && res.error && res.error.code != 0) {
                        thiz.onError(res.error);
                        deferred.reject(res.error);
                        return;
                    }
                }

                //until here all is ok, tell everybody
                if (options.omit) {
                    thiz.publish(types.EVENTS.STATUS, {
                        message: 'Ok!',
                        what: arguments
                    }, this);
                }


                //final delivery
                resolve(res);


            }, function (err) {
                thiz.onError(err);
            });

            return deferred;
        },
        getParameterMap: function (serviceClass, serviceClassMethod) {

            var services = this._smd.services;
            var smd = services[serviceClass + '.' + serviceClassMethod];
            if (smd && smd.parameters) {
                return smd.parameters;
            }
            return [];
        },
        _getRequest: function (method, args) {
            var smd = this._smd;
            var envDef = Service.envelopeRegistry.match(method.envelope || smd.envelope || "NONE");
            var parameters = (method.parameters || method.params || []).concat(smd.parameters || []);

            if (envDef.namedParams) {
                // the serializer is expecting named params
                if ((args.length == 1) && lang.isObject(args[0])) {
                    // looks like we have what we want
                    args = args[0];
                } else {
                    // they provided ordered, must convert
                    var data = {};
                    var params = method.parameters || method.params;
                    for (var i = 0; i < params.length; i++) {
                        if (typeof args[i] != "undefined" || !params[i].optional) {
                            data[params[i].name] = args[i];
                        }
                    }
                    args = data;
                }
                if (method.strictParameters || smd.strictParameters) {
                    //remove any properties that were not defined
                    for (i in args) {
                        var found = false;
                        for (var j = 0; j < parameters.length; j++) {
                            if (parameters[i].name == i) {
                                found = true;
                            }
                        }
                        if (!found) {
                            delete args[i];
                        }
                    }

                }
                // setting default values
                for (i = 0; i < parameters.length; i++) {
                    var param = parameters[i];
                    if (!param.optional && param.name && args != null && !args[param.name]) {
                        if (param["default"]) {
                            args[param.name] = param["default"];
                        } else if (!(param.name in args)) {
                            throw new Error("Required parameter " + param.name + " was omitted");
                        }
                    }
                }
            } else if (parameters && parameters[0] && parameters[0].name && (args.length == 1) && dojo.isObject(args[0])) {
                // looks like named params, we will convert
                if (envDef.namedParams === false) {
                    // the serializer is expecting ordered params, must be ordered
                    args = Service.toOrdered(parameters, args);
                } else {
                    // named is ok
                    args = args[0];
                }
            }

            if (lang.isObject(this._options)) {
                args = dojo.mixin(args, this._options);
            }

            var schema = method._schema || method.returns; // serialize with the right schema for the context;
            var request = envDef.serialize.apply(this, [smd, method, args]);
            request._envDef = envDef;// save this for executeMethod
            var contentType = (method.contentType || smd.contentType || request.contentType);

            // this allows to mandate synchronous behavior from elsewhere when necessary, this may need to be changed to be one-shot in FF3 new sync handling model
            return dojo.mixin(request, {
                sync: this.sync,//dojox.rpc._sync,
                contentType: contentType,
                headers: method.headers || smd.headers || request.headers || {},
                target: request.target || Service.getTarget(smd, method),
                transport: method.transport || smd.transport || request.transport,
                envelope: method.envelope || smd.envelope || request.envelope,
                timeout: method.timeout || smd.timeout,
                callbackParamName: method.callbackParamName || smd.callbackParamName,
                rpcObjectParamName: method.rpcObjectParamName || smd.rpcObjectParamName,
                schema: schema,
                handleAs: request.handleAs || "auto",
                preventCache: method.preventCache || smd.preventCache,
                frameDoc: this._options.frameDoc || undefined
            });
        },
        _executeMethod: function (method) {
            var args = [];
            var i;
            if (arguments.length == 2 && lang.isArray(arguments[1])) {
                args = arguments[1];
            } else {
                for (i = 1; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
            }
            var request = this._getRequest(method, args);
            if (this.correctTarget) {
                request.target = this._smd.target;
            }


            if (this.extraArgs) {
                var index = 0;
                for (var key in this.extraArgs) {

                    request.target += request.target.indexOf('?') != -1 ? '&' : '?';
                    request.target += key + '=' + this.extraArgs[key];
                }
            }
            if (this.signatureToken) {
                request.target += request.target.indexOf('?') != -1 ? '&' : '?';
                var signature = SHA1._hmac(request.data, this.signatureToken, 1);

                /*                  var aParams = {
                 "service": serviceClass + ".get",
                 "path":path,
                 "callback":"asdf",
                 "raw":"html",
                 "attachment":"0",
                 "send":"1",
                 "user":this.config.RPC_PARAMS.rpcUserValue
                 };

                 var pStr  =  dojo.toJson(aParams);
                 var signature = SHA1._hmac(pStr, this.config.RPC_PARAMS.rpcSignatureToken, 1);

                 console.error('sign ' + pStr + ' with ' + this.config.RPC_PARAMS.rpcSignatureToken + ' to ' + signature);
                 */
                //var pStr  =  dojo.toJson(request.data);

                var signature = SHA1._hmac(request.data, this.signatureToken, 1);
                //console.error('sign ' + request.data + ' with ' +  this.signatureToken + ' to ' + signature);
                request.target += this.signatureField + '=' + signature;
            }

            var deferred = Service.transportRegistry.match(request.transport).fire(request);
            deferred.addBoth(function (results) {
                return request._envDef.deserialize.call(this, results);
            });
            return deferred;
        },
        getServiceClass: function (serviceClassIn) {
            return serviceClassIn || this.serviceClass;
        },
        hasMethod: function (method,serviceClass) {

            var _service = this,
                _serviceClass = serviceClass || this.getServiceClass();

            return _service &&
                _serviceClass &&
                _service[_serviceClass] != null &&
                _service[_serviceClass][method] != null;
        },
        checkCall: function (serviceClass, method, omit) {

            serviceClass = this.getServiceClass(serviceClass);

            if (!this.hasMethod(method,serviceClass) && omit === true) {

                this.onError({
                    code: 1,
                    message: ['Sorry, server doesnt know ' + method]
                });
                return false;
            }

            return true;
        },


        /************************************************
         *
         * @param data
         * @returns {*}
         */
        base64_encode: function (data) {
            // From: http://phpjs.org/functions
            // +   original by: Tyler Akins (http://rumkin.com)
            // +   improved by: Bayron Guevara
            // +   improved by: Thunder.m
            // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // +   bugfixed by: Pellentesque Malesuada
            // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // +   improved by: Rafał Kukawski (http://kukawski.pl)
            // *     example 1: base64_encode('Kevin van Zonneveld');
            // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
            // mozilla has this native
            // - but breaks in 2.0.0.12!
            //if (typeof this.window.btoa === 'function') {
            //    return btoa(data);
            //}
            var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
                ac = 0,
                enc = '',
                tmp_arr = [];

            if (!data) {
                return data;
            }

            do { // pack three octets into four hexets
                o1 = data.charCodeAt(i++);
                o2 = data.charCodeAt(i++);
                o3 = data.charCodeAt(i++);

                bits = o1 << 16 | o2 << 8 | o3;

                h1 = bits >> 18 & 0x3f;
                h2 = bits >> 12 & 0x3f;
                h3 = bits >> 6 & 0x3f;
                h4 = bits & 0x3f;

                // use hexets to index into b64, and append result to encoded string
                tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
            } while (i < data.length);

            enc = tmp_arr.join('');

            var r = data.length % 3;

            return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);

        },
        callMethodEx: function (serviceClass, method, args, readyCB, errorCB, omitError) {

            /***
             * Check we the RPC method is in the SMD
             */

            var thiz = this;
            if (!this[serviceClass] || this[serviceClass][method] == null) {
                if (omitError === true && errorCB) {
                    errorCB({
                        code: 1,
                        message: ['Sorry, server doesnt know ' + method + ' in class' + serviceClass]
                    });
                }
                return null;
            }

            /***
             * Build signature
             */
            var params = {};


            /**
             * Mixin mandatory fields
             */
            if (this.config && this.config.RPC_PARAMS) {
                params = lang.mixin(params, this.config.RPC_PARAMS.rpcFixedParams);
                params[this.config.RPC_PARAMS.rpcUserField] = this.config.RPC_PARAMS.rpcUserValue;
                this.extraArgs = params;
                this.signatureField = this.config.RPC_PARAMS.rpcSignatureField;
                this.signatureToken = this.config.RPC_PARAMS.rpcSignatureToken;
            }


            this[serviceClass][method](args).then(function (res) {
                try {
                    if (readyCB) {
                        readyCB(res);
                    }
                } catch (e) {
                    console.error('bad news : callback for method ' + method + ' caused a crash in service class ' + serviceClass);
                }

                if (res && res.error && res.error && res.error.code != 0 && errorCB) {
                    errorCB(res.error);
                    return;
                }
                if (omitError == true) {

                }

            }, function (err) {
                errorCB(err);
            });
        },
        callMethod: function (serviceClass, method, args, readyCB, errorCB, omitError) {

            /***
             * Check we the RPC method is in the SMD
             */
            try {
                var thiz = this;
                if (this[serviceClass][method] == null) {
                    if (omitError === true && errorCB) {
                        errorCB({
                            code: 1,
                            message: ['Sorry, server doesnt know ' + method]
                        });
                    }
                    return null;
                }
                /***
                 * Build signature
                 */
                var params = {};
                params = lang.mixin(params, this.config.RPC_PARAMS.rpcFixedParams);
                /**
                 * Mixin mandatory fields
                 */
                this[serviceClass][method](args).then(function (res) {
                    try {
                        if (readyCB) {
                            readyCB(res);
                        }
                    } catch (e) {
                        console.error('crashed in ' + method);
                        console.dir(e);

                    }
                    if (res && res.error && res.error && res.error.code == 1 && errorCB) {
                        errorCB(res.error);
                        return;
                    }

                    if (omitError !== false) {
                        var struct = {
                            message: 'Ok!'
                        };
                        //thiz.publish(types.EVENTS.STATUS,struct ,this);
                    }

                }, function (err) {
                    thiz.onError(err);
                });
            } catch (e) {
                console.error('crash! ' + e);
                //thiz.onError(e);
            }


        }

    });
});
/** @module xide/manager/Reloadable **/
define('xide/manager/Reloadable',[
    'dcl/dcl',
    "dojo/_base/lang",
    "xide/utils",
    "xide/types",
    "xide/factory"
], function (dcl,lang,utils,types,factory) {
    /**
     *
     *
     * @class xide.manager.ResourceManager
     */
    return dcl(null, {
        declaredClass:"xide.manager.Reloadable",
        vfsMounts: null,
        xideServiceClient: null,
        fileUpdateTimes:{},
        onXIDELoaded: function (min, WebSocket) {
            var thiz = this;
            var _ctorArgs = {
                delegate: {
                    onServerResponse: function (e) {
                        thiz.onXIDEMessage(utils.fromJson(e.data));
                    }
                }
            };
            try {
                var client = new WebSocket(_ctorArgs);
                utils.mixin(client, _ctorArgs);
                client.init({
                    options: {
                        host: 'http://0.0.0.0',
                        port: 9993,
                        channel: '',
                        debug: {
                            "all": false,
                            "protocol_connection": true,
                            "protocol_messages": true,
                            "socket_server": true,
                            "socket_client": true,
                            "socket_messages": true,
                            "main": true
                        }
                    }
                });
                client.connect();

            } catch (e) {
                console.error('create client with store : failed : ' + e);
            }

        },
        loadXIDE: function () {
            var thiz = this;
            this.subscribe(types.EVENTS.ON_NODE_SERVICE_STORE_READY, this.onNodeServiceStoreReady);
            require(['xide/min', 'xide/client/WebSocket'], function (min, WebSocket) {
                if (thiz._didXIDE) {
                    return;
                }
                thiz._didXIDE = true;
                thiz.onXIDELoaded(min, WebSocket);
            });
        },
        onXIDEMessage: function (data) {
            var thiz = this;
            thiz.publish(data.event, data);
            if (data.event === types.EVENTS.ON_FILE_CHANGED) {
                var _path = data.data.path;
                var timeNow = new Date().getTime();
                if (thiz.fileUpdateTimes[_path]) {
                    var last = thiz.fileUpdateTimes[_path];
                    var diff = timeNow - last;

                    if (diff < 30) {
                        thiz.fileUpdateTimes[_path] = timeNow;
                        return;
                    }
                }
                thiz.fileUpdateTimes[_path] = timeNow;

                //path is absolute and might look like: /PMaster/projects/xbox-app/client/src/lib/xfile/Views.js
                //fix windows path
                var path = utils.replaceAll('\\', '/', data.data.path);
                path = utils.replaceAll('//', '/', data.data.path);
                /**
                 * Check its a css file
                 */
                if (path == null || path.indexOf == null) {
                    console.error('on file changed : have no path, aborting');
                    return;
                }
                if (path.match(/\.css$/)) {
                    var newEvt = {
                        path: path
                    };
                    thiz.onCSSChanged(newEvt);
                }
                /**
                 * Try generic
                 */
                if (path.match(/\.js$/)) {
                    var modulePath = data.data.modulePath;
                    if (modulePath) {
                        modulePath = modulePath.replace('.js', '');
                        var _re = require;//hide from gcc
                        //try pre-amd module
                        var module = null;
                        try {
                            module = _re(modulePath);
                        } catch (e) {

                        }
                        var _start = 'node_modules';
                        if (path.indexOf(_start) != -1) {
                            var libPath = path.substr(path.indexOf(_start) + _start.length, path.length);
                            libPath = libPath.replace('.js', '');
                            if (path.indexOf('xcfnode') != -1) {
                                path = libPath;
                                modulePath = path.replace('/xcfnode', 'xcfnode');
                            }
                        }
                        modulePath = utils.replaceAll('.', '/', modulePath);
                        setTimeout(function () {
                            thiz._reloadModule(modulePath, true);
                        }, 400);
                    }
                }
            }
        },
        onNodeServiceStoreReady: function (evt) {
            if (this.xideServiceClient) {
                this.xideServiceClient.destroy();
            }
            this.xideServiceClient = null;
            var thiz = this;
            var store = evt.store;

            this.deviceServerClient = factory.createClientWithStore(store, 'XIDE Server', {
                delegate: {
                    onServerResponse: function (e) {
                        thiz.onXIDEMessage(utils.fromJson(e.data));
                    }
                }
            });
        },
        mergeFunctions: function (target, source) {
            for (var i in source) {
                var o = source[i];
                if (_.isFunction(source[i]) /*&& lang.isFunction(target[i])*/) {
                    target[i] = source[i];//swap
                }

            }
        },
        /**
         * Special case when module has been reloaded : update all functions in our singleton
         * managers!
         * @param evt
         */
        onModuleReloaded: function (evt) {
            if(evt._didHandle){
                return;
            }
            evt._didHandle=true;
            this.inherited(arguments);
            if(this.managers) {
                var newModule = evt.newModule;
                for (var i = 0; i < this.managers.length; i++) {
                    var manager = this.managers[i];
                    if (newModule.prototype
                        && newModule.prototype.declaredClass
                        && newModule.prototype.declaredClass === manager.declaredClass) {
                        this.mergeFunctions(manager, newModule.prototype);
                        if (manager.onReloaded) {
                            manager.onReloaded(newModule);
                        }
                        break;
                    }
                }
            }
        },
        _reloadModule: function (module, reload) {
            require.undef(module);
            var thiz = this;
            if (reload) {
                setTimeout(function () {
                    require([module], function (moduleLoaded) {
                        if(!moduleLoaded){
                            console.warn('invalid module');
                            return;
                        }
                        if (_.isString(moduleLoaded)) {
                            console.error('module reloaded failed : ' + moduleLoaded + ' for module : ' + module);
                            return;
                        }
                        
                        console.log('did - re-require module : ' + module);
                        moduleLoaded.modulePath = module;
                        var obj = lang.getObject(utils.replaceAll('/', '.', module));
                        if (obj) {
                            thiz.mergeFunctions(obj.prototype, moduleLoaded.prototype);
                        }
                        thiz.publish(types.EVENTS.ON_MODULE_RELOADED, {
                            module: module,
                            newModule: moduleLoaded
                        });
                        thiz.publish(types.EVENTS.ON_MODULE_UPDATED,{
                            moduleClass:moduleLoaded.prototype.declaredClass,
                            moduleProto:moduleLoaded.prototype
                        });
                    });
                }, 500);
            }
        },
        onCSSChanged: function (evt) {
            if (evt['didProcess']) {
                return;
            }
            evt['didProcess'] = true;
            var path = evt.path;
            path = utils.replaceAll('//', '/', path);
            path = path.replace('/PMaster/', '');
            var reloadFn = window['xappOnStyleSheetChanged'];
            if (reloadFn) {
                reloadFn(path);
            }
        },
        onDidChangeFileContent: function (evt) {
            if (evt['didProcess']) {
                return;
            }
            evt['didProcess'] = true;
            if (!this.vfsMounts) {
                return;
            }
            if (!evt.path) {
                return;
            }
            var path = evt.path;
            if (path.indexOf('.css') != -1) {
                this.onCSSChanged(evt);
                return;
            }

            if (path.indexOf('resources') != -1 ||
                path.indexOf('meta') != -1 ||
                path.indexOf('.js') == -1) {
                return;
            }

            var mount = evt.mount.replace('/', '');
            var module = null;
            if (!this.vfsMounts[mount]) {
                return;
            }
            module = '' + evt.path;
            module = module.replace('./', '');
            module = module.replace('/', '.');
            module = module.replace('.js', '');
            module = utils.replaceAll('.', '/', module);
            var thiz = this;
            setTimeout(function () {
                thiz._reloadModule(module, true);
            }, 500);
        }
    });
});




/** @module xide/manager/ServerActionBase */
define('xide/manager/ServerActionBase',[
    'dcl/dcl',
    'dojo/_base/declare',
    'xdojo/has',
    'dojo/Deferred',
    'xide/manager/RPCService',
    'xide/manager/ManagerBase',
    'xide/types',
    'xide/utils'
], function (dcl,declare, has, Deferred, RPCService, ManagerBase, types, utils) {
    var Singleton = null;
    /**
     * Class dealing with JSON-RPC-2, used by most xide managers
     * @class module:xide.manager.ServerActionBase
     * @augments {module:xide/manager/ManagerBase}
     */
    var Implementation = {
        declaredClass:"xide.manager.ServerActionBase",
        serviceObject: null,
        serviceUrl: null,
        singleton: true,
        serviceClass: null,
        defaultOptions: {
            omit: true,
            checkMessages: true,
            checkErrors: true
        },
        base64_encode: function (data) {

            // From: http://phpjs.org/functions
            // +   original by: Tyler Akins (http://rumkin.com)
            // +   improved by: Bayron Guevara
            // +   improved by: Thunder.m
            // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // +   bugfixed by: Pellentesque Malesuada
            // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // +   improved by: Rafał Kukawski (http://kukawski.pl)
            // *     example 1: base64_encode('Kevin van Zonneveld');
            // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
            // mozilla has this native
            // - but breaks in 2.0.0.12!
            //if (typeof this.window.btoa === 'function') {
            //    return btoa(data);
            //}
            var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
                ac = 0,
                enc = '',
                tmp_arr = [];

            if (!data) {
                return data;
            }

            do { // pack three octets into four hexets
                o1 = data.charCodeAt(i++);
                o2 = data.charCodeAt(i++);
                o3 = data.charCodeAt(i++);

                bits = o1 << 16 | o2 << 8 | o3;

                h1 = bits >> 18 & 0x3f;
                h2 = bits >> 12 & 0x3f;
                h3 = bits >> 6 & 0x3f;
                h4 = bits & 0x3f;

                // use hexets to index into b64, and append result to encoded string
                tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
            } while (i < data.length);

            enc = tmp_arr.join('');

            var r = data.length % 3;

            return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);

        },
        /**
         * Public main entry, all others below are deprecated
         * @param serviceClassIn
         * @param method
         * @param args
         * @param options
         * @returns {Deferred}
         */
        runDeferred: function (serviceClassIn, method, args, options) {
            var deferred = new Deferred(),
                promise;

            options = options || this.defaultOptions;

            //check we the RPC method is in the SMD
            this.check();

            //check this method exists
            if (!this.checkCall(serviceClassIn, method, options.omit)) {
                return deferred.reject('method doesnt exists: ' + method + ' for service class:' + this.serviceClass + ' in ' + this.declaredClass);
            }

            //setup signing in serviceObject
            this.prepareCall();

            //variable shortcuts
            var service = this.getService(),
                serviceClass = this.getServiceClass(serviceClassIn),
                thiz = this;

            var resolve = function (data,error) {
                var dfd = deferred;
                if(options.returnProm){
                    dfd = promise;
                }
                dfd._data = data;
                if(error) {
                    if(options.onError){
                        return options.onError(error);
                    }
                }
                dfd.resolve(data);
            };

            promise = service[serviceClass][method](args);
            promise.then(function (res) {
                res = res || {};
                var error = res.error || {};
                //the server has some messages for us
                if (options.checkMessages) {
                    if (error && error.code == 3) {
                        thiz.onMessages(error);
                    }
                }
                //check for error messages (non-fatal) and abort
                if (options.checkErrors) {
                    if (error.code == 1) {
                        thiz.onError(error,serviceClass + '::' + method);
                        deferred.reject(error);
                        return;
                    }
                }else{
                    if (error.code == 1 && options.displayError) {
                        thiz.onError(error,serviceClass + '::' + method);
                    }
                    if (error && error.code != 0) {
                        resolve(res,error);
                        return;
                    }
                }
                //until here all is ok, tell everybody
                if (options.omit) {
                    thiz.publish(types.EVENTS.STATUS, {
                        message: 'Ok!',
                        what: arguments
                    }, this);
                }
                resolve(res);
            }, function (err) {
                thiz.onError(err);
            });
            if(options.returnProm){
                return promise;
            }
            return deferred;
        },
        getService: function () {
            return this.serviceObject;
        },
        getServiceClass: function (serviceClassIn) {
            return serviceClassIn || this.serviceClass;
        },
        hasMethod: function (method,serviceClass) {
            var _service = this.getService(),
                _serviceClass = serviceClass || this.getServiceClass();

            return _service &&
                _serviceClass &&
                _service[_serviceClass] != null &&
                _service[_serviceClass][method] != null;
        },
        findServiceUrl: function (declaredClass) {
            var config = window['xFileConfig'];
            if (config && config.mixins) {
                for (var i = 0; i < config.mixins.length; i++) {
                    var obj = config.mixins[i];
                    if (obj.declaredClass === declaredClass && obj.mixin && obj.mixin.serviceUrl) {
                        return decodeURIComponent(obj.mixin.serviceUrl);
                    }
                }
            }
            return null;
        },
        init: function () {
            this.check();
        },
        _initService: function () {
            var thiz = this;
            if(!has('host-browser')){
                return false;
            }
            try {
                var obj = Singleton;
                if (this.singleton) {
                    if (obj && obj.serviceObject) {
                        this.serviceObject = obj.serviceObject;
                        return;
                    }
                }
                if (!this.serviceObject) {
                    if (!this.serviceUrl) {
                        console.error('have no service url : ' + this.declaredClass);
                        return;
                    }
                    var url = decodeURIComponent(this.serviceUrl);
                    this.serviceObject = new RPCService(decodeURIComponent(this.serviceUrl),this.options);
                    this.serviceObject.runDeferred = function(){
                        return thiz.runDeferred.apply(thiz,arguments);
                    };

                    this.serviceObject.sync = this.sync;

                    if (this.singleton) {
                        obj.serviceObject = this.serviceObject;
                    }
                    if(this.config){
                        obj.serviceObject.config = this.config;
                    }
                }
            } catch (e) {
                console.error('error in rpc service creation : ' + e);
                logError(e);
            }
        },
        check: function () {
            if (!this.serviceObject) {
                this._initService();
            }
        },
        onError: function (err,suffix) {
            if (err) {
                if (err.code === 1) {
                    if (err.message && _.isArray(err.message)) {
                        this.publish(types.EVENTS.ERROR, {message: err.message.join('<br/>')});
                        return;
                    }
                } else if (err.code === 0) {
                    this.publish(types.EVENTS.STATUS, 'Ok');
                }
            }
            if(suffix){
                err.message = suffix +  ' -> ' + err.message;
            }
            this.publish(types.EVENTS.ERROR, {
                error:err
            }, this);
        },
        checkCall: function (serviceClass, method, omit) {
            serviceClass = this.getServiceClass(serviceClass);
            if (!this.getService()) {
                return false;
            }
            if (!this.hasMethod(method,serviceClass) && omit === true) {
                this.onError({
                    code: 1,
                    message: ['Sorry, server doesnt know ' + method]
                });
                return false;
            }
            return true;
        },
        prepareCall: function () {
            var params = {};
            //Mixin mandatory fields
            if (this.config && this.config.RPC_PARAMS) {
                params = utils.mixin(params, this.config.RPC_PARAMS.rpcFixedParams);
                this.serviceObject.extraArgs = params;
                if (this.config.RPC_PARAMS.rpcUserField) {
                    params[this.config.RPC_PARAMS.rpcUserField] = this.config.RPC_PARAMS.rpcUserValue;
                    this.serviceObject.signatureField = this.config.RPC_PARAMS.rpcSignatureField;
                    this.serviceObject.signatureToken = this.config.RPC_PARAMS.rpcSignatureToken;
                }
            }
        },
        callMethodEx: function (serviceClassIn, method, args, readyCB, omitError) {
            serviceClassIn = serviceClassIn || this.serviceClass;
            if (!serviceClassIn) {
                console.error('have no service class! ' + this.declaredClass,this);
            }
            //init smd
            this.check();

            //check this method exists
            if (!this.checkCall(serviceClassIn, method, omitError)) {
                return;
            }
            //setup signing in serviceObject
            this.prepareCall();
            var thiz = this;
            return this.serviceObject[this.getServiceClass(serviceClassIn)][method](args).then(function (res) {
                try {
                    if (readyCB) {
                        readyCB(res);
                    }
                } catch (e) {
                    console.error('bad news : callback for method ' + method + ' caused a crash in service class ' + serviceClassIn);
                    logError(e,'server method failed '+e);

                }
                //rpc batch results
                if (res && res.error && res.error.code == 3) {
                    thiz.onMessages(res.error);
                }

                if (res && res.error && res.error && res.error.code != 0) {
                    thiz.onError(res.error);
                    return;
                }
                if (omitError == true) {
                    thiz.publish(types.EVENTS.STATUS, {message: 'Ok!'}, this);
                }

            }, function (err) {
                thiz.onError(err);
            });
        },
        callMethodEx2: function (serverClassIn, method, args, readyCB, omitError) {
            this.check();
            //check this method exists
            if (!this.checkCall(serverClassIn, method, omitError)) {
                return;
            }
            //setup signing in serviceObject
            this.prepareCall();
            return this.serviceObject[this.getServiceClass(serverClassIn)][method](args);
        },
        callMethod: function (method, args, readyCB, omitError) {
            args = args || [[]];
            var serviceClass = this.serviceClass;
            try {
                var thiz = this;
                //method not listed in SMD
                if (this.serviceObject[serviceClass][method] == null) {
                    if (omitError === true) {
                        this.onError({
                            code: 1,
                            message: ['Sorry, server doesnt know ' + method]
                        });
                    }
                    return null;
                }
                /***
                 * Build signature
                 */
                var params = {};
                params = utils.mixin(params, this.config.RPC_PARAMS.rpcFixedParams);
                /**
                 * Mixin mandatory fields
                 */
                params[this.config.RPC_PARAMS.rpcUserField] = this.config.RPC_PARAMS.rpcUserValue;
                this.serviceObject.extraArgs = params;
                this.serviceObject.signatureField = this.config.RPC_PARAMS.rpcSignatureField;
                this.serviceObject.signatureToken = this.config.RPC_PARAMS.rpcSignatureToken;
                this.serviceObject[this.serviceClass][method](args).then(function (res) {
                    try {
                        if (readyCB) {
                            readyCB(res);
                        }
                    } catch (e) {
                        logError(e,"Error calling RPC method");
                    }
                    //rpc batch call
                    if (res && res.error && res.error.code == 3) {
                        this.onMessages(res.error);
                    }
                    if (res && res.error && res.error && res.error.code == 1) {
                        this.onError(res.error);
                        return;
                    }
                    if (omitError !== false) {
                        var struct = {
                            message: 'Ok!'
                        };
                        this.publish(types.EVENTS.STATUS, struct, this);
                    }
                }.bind(this), function (err) {
                    this.onError(err);
                }.bind(this));
            } catch (e) {
                thiz.onError(e);
                logError(e,"Error calling RPC method");
            }
        }
    };

    var Module = dcl(ManagerBase, Implementation);
    Module.declare = declare(null,Implementation);
    Singleton = Module;
    return Module;
});
/** @mixin xide/mixin/VariableMixin **/
define('xide/mixins/VariableMixin',[
    'dcl/dcl',
    'xdojo/declare',
    'xide/utils'
], function (dcl,declare,utils) {

    var Implementation = {
        /**
         *
         * @param what
         * @param variables
         * @param delimitters
         * @returns {*}
         */
        resolve:function(what,variables,delimitters){
            variables = variables || this.resourceVariables || this.ctx.getResourceManager().getResourceVariables() || null;
            delimitters = delimitters || this.variableDelimiters || null;
            return utils.replace(what,null,variables,delimitters);
        }
    }

    /**
     * Mixin to resolve resource variables in strings.
     * Currently stub
     */
    var Module = declare("xide/mixins/VariableMixin", null, Implementation);
    Module.dcl = dcl(null,Implementation);
    return Module;
});
/** @module xide/manager/ResourceManager **/
define('xide/manager/ResourceManager',[
    'dcl/dcl',
    "xide/manager/ServerActionBase",
    "xide/utils",
    'xide/mixins/VariableMixin'
], function (dcl,ServerActionBase, utils, VariableMixin) {
    /**
     *
     * Resource manager which provides:
     *
     * - Resolving variables in strings
     * - Loading & unloading of resources: CSS,JS, Blox, API-Docs and plugins
     *
     * @class xide.manager.ResourceManager
     */
    return dcl([ServerActionBase,VariableMixin.dcl], {
        declaredClass:"xide.manager.ResourceManager",
        serviceClass: "XApp_Resource_Service",
        resourceData: null,
        resourceVariables: null,
        getResourceVariables:function(){
            return this.resourceVariables;
        },
        setVariable: function (variableName,value) {
            return this.resourceVariables[variableName]=value;
        },
        getVariable: function (variableName) {
            return this.resourceVariables[variableName];
        },
        init: function () {
            if (!this.resourceVariables) {
                this.resourceVariables = {};
            }
        },
        replaceVariables: function (string, variables) {
            
            return utils.multipleReplace('' + string, variables || this.resourceVariables);
        }
    });
});
define('xide/mainr.js',[
    "xide/types",
    "xide/types/Types",
    'xide/utils/StringUtils',
    'xide/utils/HTMLUtils',
    'xide/utils/StoreUtils',
    'xide/utils/WidgetUtils',
    'xide/utils/CIUtils',
    'xide/utils/ObjectUtils',
    'xide/utils/CSSUtils',

    'xide/factory',
    'xide/factory/Objects',
    'xide/factory/Events',
    'xide/factory/Clients',
    "xide/client/ClientBase",

    "xide/client/WebSocket",
    "xide/data/Memory",
    "xide/data/Model",
    "xide/data/ObservableStore",
    "xide/data/Reference",
    "xide/data/Source",
    "xide/data/TreeMemory",
    "xide/data/_Base",
    "xide/encoding/MD5",
    "xide/encoding/SHA1",
    "xide/encoding/_base",

    "xide/model/Component",
    "xide/debug",

    "xide/mixins/EventedMixin",
    "xide/mixins/ReferenceMixin",
    "xide/mixins/ReloadMixin",
    "xide/min",

    "xide/manager/BeanManager",
    "xide/manager/ContextBase",
    "xide/manager/Context",
    "xide/manager/ManagerBase",
    "xide/manager/PluginManager",
    "xide/manager/RPCService",
    "xide/manager/Reloadable",
    "xide/manager/ResourceManager",
    "xide/manager/ServerActionBase",
    'xide/utils'
], function () {

});
