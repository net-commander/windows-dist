//>>built
require({
    cache: {
        "xide/types": function () {
            define(["dcl/dcl"], function (e) {
                return new e(null, {declaredClass: "xide/types"})
            })
        }, "dcl/dcl": function () {
            (function (e) {
                "undefined" != typeof define ? define(["./mini"], e) : "undefined" != typeof module ? module.exports = e(require("./mini")) : dcl = e(dcl)
            })(function (e) {
                function p() {
                }

                function l(b, a, f) {
                    var c = b || p, g = a || p, r = f || p, q = function () {
                        var a, m;
                        c.apply(this, arguments);
                        try {
                            a = r.apply(this, arguments)
                        } catch (h) {
                            a = h, m = !0
                        }
                        g.call(this, arguments, a);
                        if (m)throw a;
                        return a
                    };
                    q.advices = {
                        before: b,
                        after: a, around: f
                    };
                    return q
                }

                function n(b) {
                    return function (a, f) {
                        var c = a._meta, g;
                        c && ((g = +c.weaver[f] || 0) && g != b && e._error("set chaining", f, a, b, g), c.weaver[f] = b)
                    }
                }

                var d = e(e.Super, {
                    constructor: function () {
                        this.before = this.around.before;
                        this.after = this.around.after;
                        this.around = this.around.around
                    }
                });
                e.mix(e, {
                    Advice: d, advise: function (b) {
                        return e._makeSuper(b, d)
                    }, before: function (b) {
                        return e.advise({before: b})
                    }, after: function (b) {
                        return e.advise({after: b})
                    }, around: e.superCall, chainBefore: n(1), chainAfter: n(2),
                    isInstanceOf: function (b, a) {
                        if (b instanceof a)return !0;
                        var f = b.constructor._meta, c;
                        if (f)for (f = f.bases, c = f.length - 1; 0 <= c; --c)if (f[c] === a)return !0;
                        return !1
                    }, _stub: function (b, a, f, c) {
                        c = c[f] = e._extractChain(a, f, "around");
                        var g = e._extractChain(a, f, "before").reverse();
                        a = e._extractChain(a, f, "after");
                        c = b ? e._stubChainSuper(c, 1 == b ? function (a) {
                            return e._stubChain(a.reverse())
                        } : e._stubChain, f) : e._stubSuper(c, f);
                        return g.length || a.length ? l(e._stubChain(g), e._stubChain(a), c) : c || function () {
                        }
                    }
                });
                return e
            })
        }, "dcl/mini": function () {
            (function (e) {
                "undefined" != typeof define ? define([], e) : "undefined" != typeof module ? module.exports = e() : dcl = e()
            })(function () {
                function e(f, c) {
                    var g = [0], b, q, k, m, h, t, d, u, x = 0, v;
                    if (f)if (f instanceof Array) {
                        h = {};
                        d = f.slice(0).reverse();
                        for (u = d.length - 1; 0 <= u; --u)if (q = d[u], q._uniqueId = q._uniqueId || n++, b = q._meta) {
                            t = b.bases;
                            for (x = t.length - 1; 0 < x; --x)v = t[x]._uniqueId, h[v] = (h[v] || 0) + 1;
                            d[u] = t.slice(0)
                        } else d[u] = [q];
                        b = {};
                        a:for (; d.length;) {
                            for (u = 0; u < d.length; ++u)if (t = d[u], q = t[0], v = q._uniqueId, !h[v]) {
                                b[v] || (g.push(q), b[v] = 1);
                                t.shift();
                                t.length ?
                                    --h[t[0]._uniqueId] : d.splice(u, 1);
                                continue a
                            }
                            e._error("cycle", c, d)
                        }
                        f = f[0];
                        x = g.length - ((m = f._meta) && f === g[g.length - (x = m.bases.length)] ? x : 1) - 1
                    } else f._uniqueId = f._uniqueId || n++, g = g.concat((m = f._meta) ? m.bases : f);
                    b = f ? e.delegate(f.prototype) : {};
                    for (t = f && (m = f._meta) ? e.delegate(m.weaver) : {constructor: 2}; 0 < x; --x)if (q = g[x], m = q._meta, e.mix(b, m && m.ownProps || q.prototype), m)for (v in d = m.weaver)t[v] = (+t[v] || 0) | d[v];
                    for (v in c)l(m = c[v]) ? t[v] = +t[v] || 0 : b[v] = m;
                    m = {bases: g, ownProps: c, weaver: t, chains: {}};
                    g[0] = {
                        _meta: m,
                        prototype: b
                    };
                    q = b;
                    h = m.weaver;
                    t = m.bases;
                    d = m.chains;
                    for (k in h)q[k] = e._stub(h[k], t, k, d);
                    k = b.constructor;
                    k._meta = m;
                    k.prototype = b;
                    g[0] = k;
                    g = e._postprocess(k);
                    c.declaredClass && !a[c.declaredClass] && (a[c.declaredClass] = g);
                    return g
                }

                function p(a) {
                    this.around = a
                }

                function l(a) {
                    return a && a.spr instanceof p
                }

                var n = 0, d = {}, b, a = {};
                (b = function (a, c) {
                    for (var g in c)a[g] = c[g]
                })(e, {
                    mix: b, delegate: function (a) {
                        return Object.create(a)
                    }, allKeys: function (a) {
                        var c = [], g;
                        for (g in a)c.push(g);
                        return c
                    }, Super: p, superCall: function (a) {
                        return e._makeSuper(a)
                    },
                    _makeSuper: function (a, c) {
                        var g = function () {
                        };
                        g.spr = new (c || p)(a);
                        return g
                    }, _postprocess: function (a) {
                        return a
                    }, _error: function (a) {
                        throw Error("dcl: " + a);
                    }, _instantiate: function (a, c, g) {
                        c = a.spr.around(c);
                        c.ctr = a.ctr;
                        return c
                    }, _extractChain: function (a, c, g) {
                        for (var b = a.length - 1, q = [], k, m, h = "around" == g; k = a[b]; --b)if ((m = k._meta) ? (m = m.ownProps).hasOwnProperty(c) && (l(m = m[c]) ? h ? m.spr.around : m = m.spr[g] : h) : h && (m = "constructor" == c ? k : k.prototype[c]) && m !== d[c])"function" == typeof m ? (m.ctr = k, q.push(m)) : e._error("wrong super",
                            k, c);
                        return q
                    }, _stubChain: function (a) {
                        var c = a.length, g;
                        return c ? 1 == c ? (g = a[0], function () {
                            g.apply(this, arguments)
                        }) : function () {
                            for (var g = 0; g < c; ++g)a[g].apply(this, arguments)
                        } : 0
                    }, _stubSuper: function (a, c) {
                        for (var g = 0, b, q = d[c]; b = a[g]; ++g)q = l(b) ? a[g] = e._instantiate(b, q, c) : b;
                        return "constructor" != c ? q : function () {
                            q.apply(this, arguments)
                        }
                    }, _stubChainSuper: function (a, c, g) {
                        for (var b = 0, d, k, m = 0; d = a[b]; ++b)l(d) && (k = b - m, a[b] = e._instantiate(d, k ? 1 == k ? a[m] : c(a.slice(m, b)) : 0, g), m = b);
                        return (k = b - m) ? 1 == k && "constructor" !=
                        g ? a[m] : c(m ? a.slice(m) : a) : 0
                    }, _stub: function (a, b, g, r) {
                        b = r[g] = e._extractChain(b, g, "around");
                        return (a ? e._stubChainSuper(b, e._stubChain, g) : e._stubSuper(b, g)) || function () {
                            }
                    }
                });
                e.getObject = function (b) {
                    return a[b]
                };
                return e
            })
        }, "xide/types/Types": function () {
            define(["dojo/_base/lang", "xide/types", "dojo/_base/json", "dojo/_base/kernel", "xide/utils"], function (e, p, l, n, d) {
                null == p.customTypes && (p.customTypes = {});
                null == p.customEnumerations && (p.customEnumerations = {});
                null == p.widgetMappings && (p.widgetMappings = {});
                null ==
                p.customMimeIcons && (p.customMimeIcons = {});
                null == p.CICallbacks && (p.CICallbacks = {});
                p.resolveType = function (b) {
                    return p.customTypes[b] ? p.customTypes[b] : null
                };
                p.registerType = function (b, a) {
                    p.customTypes[b] = a
                };
                p.registerWidgetMapping = function (b, a) {
                    p.widgetMappings[b] = a
                };
                p.registerEnumeration = function (b, a) {
                    p.customEnumerations[b] = a
                };
                p.resolveEnumeration = function (b) {
                    return p.customEnumerations[b] ? p.customEnumerations[b] : null
                };
                p.resolveWidgetMapping = function (b) {
                    return p.widgetMappings[b] ? p.widgetMappings[b] :
                        null
                };
                p.registerCICallbacks = function (b, a) {
                    p.CICallbacks[b] || (p.CICallbacks[b] = {});
                    d.mixin(p.CICallbacks[b], a);
                    return null
                };
                p.getCICallbacks = function (b) {
                    return p.CICallbacks[b] ? p.CICallbacks[b] : null
                };
                p.GRID_FEATURE = {
                    KEYBOARD_NAVIGATION: "KEYBOARD_NAVIGATION",
                    KEYBOARD_SELECT: "KEYBOARD_SELECT",
                    SELECTION: "SELECTION",
                    ACTIONS: "ACTIONS",
                    CONTEXT_MENU: "CONTEXT_MENU"
                };
                p.VIEW_FEATURE = {
                    KEYBOARD_NAVIGATION: "KEYBOARD_NAVIGATION",
                    KEYBOARD_SELECT: "KEYBOARD_SELECT",
                    SELECTION: "SELECTION",
                    ACTIONS: "ACTIONS",
                    CONTEXT_MENU: "CONTEXT_MENU"
                };
                p.KEYBOARD_PROFILE = {
                    DEFAULT: {prevent_default: !0, prevent_repeat: !1},
                    PASS_THROUGH: {prevent_default: !1, prevent_repeat: !1},
                    SEQUENCE: {prevent_default: !0, is_sequence: !0, prevent_repeat: !0}
                };
                p.CI_STATE = {
                    NONE: 0,
                    PENDING: 1,
                    PROCESSING: 2,
                    FAILED: 4,
                    SUCCESSED: 8,
                    PROCESSED: 16,
                    DEQUEUED: 32,
                    SOLVED: 64,
                    END: 128
                };
                p.CIFLAG = {
                    NONE: 0,
                    BASE_64: 1,
                    USE_FUNCTION: 2,
                    REPLACE_VARIABLES: 4,
                    REPLACE_VARIABLES_EVALUATED: 8,
                    ESCAPE: 16,
                    REPLACE_BLOCK_CALLS: 32,
                    REMOVE_DELIMTTERS: 64,
                    ESCAPE_SPECIAL_CHARS: 128,
                    USE_REGEX: 256,
                    USE_FILTREX: 512,
                    CASCADE: 1024,
                    EXPRESSION: 2048,
                    DONT_PARSE: 4096,
                    TO_HEX: 8192,
                    REPLACE_HEX: 16384,
                    WAIT: 32768,
                    DONT_ESCAPE: 65536,
                    END: 131072
                };
                p.CI_CORDER = {};
                p.ECIType = {
                    BOOL: 0,
                    BOX: 1,
                    COLOUR: 2,
                    ENUMERATION: 3,
                    FILE: 4,
                    FLAGS: 5,
                    FLOAT: 6,
                    INTEGER: 7,
                    MATRIX: 8,
                    OBJECT: 9,
                    REFERENCE: 10,
                    QUATERNION: 11,
                    RECTANGLE: 12,
                    STRING: 13,
                    VECTOR: 14,
                    VECTOR2D: 15,
                    VECTOR4D: 16,
                    ICON: 17,
                    IMAGE: 18,
                    BANNER: 19,
                    LOGO: 20,
                    STRUCTURE: 21,
                    BANNER2: 22,
                    ICON_SET: 23,
                    SCRIPT: 24,
                    EXPRESSION: 25,
                    RICHTEXT: 26,
                    ARGUMENT: 27,
                    JSON_DATA: 28,
                    EXPRESSION_EDITOR: 29,
                    WIDGET_REFERENCE: 30,
                    DOM_PROPERTIES: 31,
                    BLOCK_REFERENCE: 32,
                    BLOCK_SETTINGS: 33,
                    FILE_EDITOR: 34,
                    END: 35,
                    UNKNOWN: -1
                };
                p.ITEM_TYPE = {
                    FILE: "BTFILE",
                    WIDGET: "WIDGET",
                    BLOCK: "BLOCK",
                    TEXT: "TEXT",
                    EXPRESSION: "EXPRESSION"
                };
                p.EXPRESSION_PARSER || (p.EXPRESSION_PARSER = {});
                p.COMPONENT_NAMES = {
                    XIDEVE: "xideve",
                    XNODE: "xnode",
                    XBLOX: "xblox",
                    XFILE: "xfile",
                    XACE: "xace",
                    XEXPRESSION: "xexpression",
                    XCONSOLE: "xconsole",
                    XTRACK: "xtrack"
                };
                p.WIDGET_REFERENCE_MODE = {
                    BY_ID: "byid",
                    BY_CLASS: "byclass",
                    BY_CSS: "bycss",
                    BY_EXPRESSION: "expression"
                };
                p.VIEW_SPLIT_MODE = {DESIGN: 1, SOURCE: 2, SPLIT_VERTICAL: 6, SPLIT_HORIZONTAL: 7};
                p.RESOURCE_VARIABLES = {ACE: "ACE", APP_URL: "APP_URL", SITE_URL: "SITE_URL"};
                p.EVENTS = {
                    ERROR: "onError",
                    STATUS: "onStatus",
                    ON_CREATED_MANAGER: "onCreatedManager",
                    ON_ITEM_SELECTED: "onItemSelected",
                    ON_ITEM_REMOVED: "onItemRemoved",
                    ON_ITEM_CLOSED: "onItemClosed",
                    ON_ITEM_ADDED: "onItemAdded",
                    ON_ITEM_MODIFIED: "onItemModified",
                    ON_NODE_SERVICE_STORE_READY: "onNodeServiceStoreReady",
                    ON_FILE_STORE_READY: "onFileStoreReady",
                    ON_CONTEXT_MENU_OPEN: "onContextMenuOpen",
                    ON_CI_UPDATE: "onCIUpdate",
                    ON_WIDGET_READY: "onWidgetReady",
                    ON_CREATED_WIDGET: "onWidgetCreated",
                    RESIZE: "onResize",
                    ON_MODULE_RELOADED: "onModuleReloaded",
                    ON_MODULE_UPDATED: "onModuleUpdated",
                    ON_DID_OPEN_ITEM: "onDidOpenItem",
                    ON_DID_RENDER_COLLECTION: "onDidRenderCollection",
                    ON_PLUGIN_LOADED: "onPluginLoaded",
                    ON_PLUGIN_READY: "onPluginReady",
                    ALL_PLUGINS_READY: "onAllPluginsReady",
                    ON_CREATE_EDITOR_BEGIN: "onCreateEditorBegin",
                    ON_CREATE_EDITOR_END: "onCreateEditorEnd",
                    REGISTER_EDITOR: "registerEditor",
                    ON_EXPRESSION_EDITOR_ADD_FUNCTIONS: "onExpressionEditorAddFunctions",
                    ON_ACE_READY: "onACEReady",
                    ON_UNSAVED_CONTENT: "onUnSavedContent",
                    ON_FILE_CHANGED: "fileChanged",
                    ON_FILE_DELETED: "fileDeleted",
                    IMAGE_LOADED: "imageLoaded",
                    IMAGE_ERROR: "imageError",
                    UPLOAD_BEGIN: "uploadBegin",
                    UPLOAD_PROGRESS: "uploadProgress",
                    UPLOAD_FINISH: "uploadFinish",
                    UPLOAD_FAILED: "uploadFailed",
                    ON_FILE_CONTENT_CHANGED: "onFileContentChanged",
                    ON_COPY_BEGIN: "onCopyBegin",
                    ON_COPY_END: "onCopyEnd",
                    ON_DELETE_BEGIN: "onDeleteBegin",
                    ON_DELETE_END: "onDeleteEnd",
                    ON_MOVE_BEGIN: "onMoveBegin",
                    ON_MOVE_END: "onMoveEnd",
                    ON_CHANGED_CONTENT: "onChangedContent",
                    ON_COMPRESS_BEGIN: "onCompressBegin",
                    ON_COMPRESS_END: "onCompressEnd",
                    ON_COMPONENT_READY: "onComponentReady",
                    ON_ALL_COMPONENTS_LOADED: "onAllComponentsLoaded",
                    ON_APP_READY: "onAppReady",
                    ON_CREATE_STORE: "onCreateStore",
                    ON_STORE_CREATED: "onStoreCreated",
                    ON_STORE_CHANGED: "onStoreChanged",
                    ON_STATUS_MESSAGE: "onStatusMessage",
                    SAVE_LAYOUT: "layoutSave",
                    RESTORE_LAYOUT: "layoutRestore",
                    ON_SHOW_PANEL: "onShowPanel",
                    ON_PANEL_CLOSED: "onPanelClosed",
                    ON_PANEL_CREATED: "onPanelCreated",
                    ON_MAIN_VIEW_READY: "onMainViewReady",
                    ON_MAIN_MENU_READY: "onMainMenuReady",
                    ON_MAIN_MENU_OPEN: "onMainMenuOpen",
                    ON_VIEW_REMOVED: "onViewRemoved",
                    ON_VIEW_SHOW: "onViewShow",
                    ON_VIEW_HIDE: "onViewHide",
                    ON_VIEW_ADDED: "onViewAdded",
                    ON_OPEN_VIEW: "onOpenView",
                    ON_VIEW_MAXIMIZE_START: "onViewMaximizeStart",
                    ON_VIEW_MAXIMIZE_END: "onViewMaximizeEnd",
                    ON_CONTAINER_ADDED: "onContainerAdded",
                    ON_CONTAINER_REMOVED: "onContainerRemoved",
                    ON_REMOVE_CONTAINER: "onRemoveContainer",
                    ON_CONTAINER_REPLACED: "onContainerReplaced",
                    ON_CONTAINER_SPLIT: "onContainerSplit",
                    ON_RENDER_WELCOME_GRID_GROUP: "onRenderWelcomeGridGroup",
                    ON_DND_SOURCE_OVER: "/dnd/source/over",
                    ON_DND_START: "/dnd/start",
                    ON_DND_DROP_BEFORE: "/dnd/drop/before",
                    ON_DND_DROP: "/dnd/drop",
                    ON_DND_CANCEL: "/dnd/cancel"
                };
                p.DIALOG_SIZE = {
                    SIZE_NORMAL: "size-normal",
                    SIZE_SMALL: "size-small",
                    SIZE_WIDE: "size-wide",
                    SIZE_LARGE: "size-large"
                };
                p.DIALOG_TYPE = {
                    DEFAULT: "type-default",
                    INFO: "type-info",
                    PRIMARY: "type-primary",
                    SUCCESS: "type-success",
                    WARNING: "type-warning",
                    DANGER: "type-danger"
                };
                e.mixin(p, {
                    LAYOUT_RIGHT_CENTER_BOTTOM: "LAYOUT_RIGHT_CENTER_BOTTOM",
                    LAYOUT_CENTER_BOTTOM: "LAYOUT_CENTER_BOTTOM",
                    LAYOUT_CENTER_RIGHT: "LAYOUT_CENTER_RIGHT",
                    LAYOUT_LEFT_CENTER_RIGHT: "LAYOUT_LEFT_CENTER_RIGHT",
                    LAYOUT_LEFT_CENTER_RIGHT_BOTTOM: "LAYOUT_LEFT_CENTER_RIGHT_BOTTOM"
                });
                n.fromJson = function (b, a) {
                    var f = null, c = !1;
                    a = !0;
                    try {
                        f = eval("(" + b + ")")
                    } catch (g) {
                        c = !0
                    }
                    if (c) {
                        c = b.substring(b.indexOf("{"), b.lastIndexOf("}") + 1);
                        try {
                            c && (f = eval("(" + c + ")"))
                        } catch (r) {
                            !1 !== a && console.error("error in json parsing! " + b);
                            if (-1 !== b.indexOf("error"))return {
                                jsonrpc: "2.0", result: {
                                    error: {
                                        code: 1,
                                        message: b, data: null
                                    }
                                }, id: 0
                            };
                            throw Error(b);
                        }
                    }
                    return f
                };
                return p
            })
        }, "xide/utils": function () {
            define(["dcl/dcl"], function (e) {
                return e(null, {declaredClass: "xide.utils"})
            })
        }, "xide/utils/ObjectUtils": function () {
            define(["xide/utils", "require", "dojo/Deferred", "xide/lodash"], function (e, p, l, n) {
                function d(a) {
                    var b = parseInt(a, 10);
                    return b.toString() === a ? b : a
                }

                function b(a, c, f, k) {
                    n.isNumber(c) && (c = [c]);
                    if (n.isEmpty(c))return a;
                    if (n.isString(c))return b(a, c.split(".").map(d), f, k);
                    var m = c[0];
                    if (1 === c.length)return c =
                        a[m], void 0 !== c && k || (a[m] = f), c;
                    void 0 === a[m] && (n.isNumber(c[1]) ? a[m] = [] : a[m] = {});
                    return b(a[m], c.slice(1), f, k)
                }

                function a(g, b) {
                    n.isNumber(b) && (b = [b]);
                    if (!n.isEmpty(g)) {
                        if (n.isEmpty(b))return g;
                        if (n.isString(b))return a(g, b.split("."));
                        var c = d(b[0]), f = g[c];
                        if (1 === b.length)void 0 !== f && (n.isArray(g) ? g.splice(c, 1) : delete g[c]); else if (void 0 !== g[c])return a(g[c], b.slice(1));
                        return g
                    }
                }

                "use strict";
                e.delegate = function () {
                    function a() {
                    }

                    return function (b, c) {
                        a.prototype = b;
                        var f = new a;
                        a.prototype = null;
                        c && lang._mixin(f,
                            c);
                        return f
                    }
                }();
                e.debounce = function (a, b, c, f, m, h, t) {
                    var d = a[b + "_debounced"];
                    d || (d = a[b + "_debounced"] = n.debounce(c, f, m));
                    !0 !== h || a[b + "_debouncedFirst"] || (a[b + "_debouncedFirst"] = !0, c.apply(a, t));
                    return d()
                };
                e.pluck = function (a, b) {
                    return n.map(a, b)
                };
                e.download = function (a, b) {
                    var c = document.createElement("a");
                    b = n.isString(b) ? b : JSON.stringify(b, null, 2);
                    c.setAttribute("href", "data:text/plain;charset\x3dutf-8," + encodeURIComponent(b));
                    c.setAttribute("download", a);
                    c.style.display = "none";
                    document.body.appendChild(c);
                    c.click();
                    document.body.removeChild(c)
                };
                e.hasObject = function (a) {
                    var b = null;
                    try {
                        b = p(a)
                    } catch (c) {
                        console.error("error in utils.hasObject ", c)
                    }
                    return b
                };
                e.toUrl = function (a) {
                    p({cacheBust: null, waitSeconds: 5});
                    return p.toUrl(a)
                };
                e.getObject = function (a, b) {
                    var c = null;
                    if (e.isString(a)) {
                        try {
                            c = p(a)
                        } catch (f) {
                        }
                        try {
                            if (!c) {
                                var m = new l, c = p([a], function (a) {
                                    m.resolve(a)
                                });
                                return m.promise
                            }
                        } catch (h) {
                        }
                        return c
                    }
                    return e.isObject(a) ? a : null !== c ? c : b
                };
                e.toArray = function (a) {
                    var b = [], c;
                    for (c in a)b.push({name: c, value: a[c]});
                    return b
                };
                e.toObject = function (a, b) {
                    if (!a)return {};
                    if (!1 !== b)return b.object(b.map(a, b.values));
                    if (e.isObject(a) && a[0])return a[0];
                    for (var c = {}, f = 0; f < a.length; ++f)c[f] = a[f];
                    return c
                };
                e.byString = function (a, b, c) {
                    b = b.replace(/\[(\w+)\]/g, ".$1");
                    b = b.replace(/^\./, "");
                    for (b = b.split("."); b.length;)if (c = b.shift(), c in a)a = a[c]; else return;
                    return a
                };
                var f = Object.prototype.hasOwnProperty, c = {
                    has: function (a, b) {
                        if (n.isEmpty(a))return !1;
                        n.isNumber(b) ? b = [b] : n.isString(b) && (b = b.split("."));
                        if (n.isEmpty(b) || 0 === b.length)return !1;
                        for (var c = 0; c < b.length; c++) {
                            var k = b[c];
                            if ((n.isObject(a) || n.isArray(a)) && f.call(a, k))a = a[k]; else return !1
                        }
                        return !0
                    }, ensureExists: function (a, c, f) {
                        return b(a, c, f, !0)
                    }, set: function (a, c, f, k) {
                        return b(a, c, f, k)
                    }, insert: function (a, b, f, k) {
                        var m = c.get(a, b);
                        k = ~~k;
                        n.isArray(m) || (m = [], c.set(a, b, m));
                        m.splice(k, 0, f)
                    }, empty: function (a, b) {
                        if (n.isEmpty(b))return a;
                        if (!n.isEmpty(a)) {
                            var d, k;
                            if (!(d = c.get(a, b)))return a;
                            if (n.isString(d))return c.set(a, b, "");
                            if (n.isBoolean(d))return c.set(a, b, !1);
                            if (n.isNumber(d))return c.set(a,
                                b, 0);
                            if (n.isArray(d))d.length = 0; else if (n.isObject(d))for (k in d)f.call(d, k) && delete d[k]; else return c.set(a, b, null)
                        }
                    }, push: function (a, b) {
                        var f = c.get(a, b);
                        n.isArray(f) || (f = [], c.set(a, b, f));
                        f.push.apply(f, Array.prototype.slice.call(arguments, 2))
                    }, coalesce: function (a, b, f) {
                        for (var k, m = 0, h = b.length; m < h; m++)if (void 0 !== (k = c.get(a, b[m])))return k;
                        return f
                    }, get: function (a, b, f) {
                        n.isNumber(b) && (b = [b]);
                        if (n.isEmpty(b))return a;
                        if (n.isEmpty(a) && a && null === a.innerHTML)return f;
                        if (n.isString(b))return c.get(a,
                            b.split("."), f);
                        var k = d(b[0]);
                        if (1 === b.length) {
                            if (a && void 0 === a[k])return f;
                            if (a)return a[k]
                        }
                        return a ? c.get(a[k], b.slice(1), f) : f
                    }, del: function (b, c) {
                        return a(b, c)
                    }
                };
                e.getAt = function (a, b, f) {
                    return c.get(a, b, f)
                };
                e.setAt = function (a, b, f) {
                    return c.set(a, b, f)
                };
                e.hasAt = function (a, b) {
                    return c.has(a, b)
                };
                e.ensureAt = function (a, b, f) {
                    return c.ensureExists(a, b, f)
                };
                e.deleteAt = function (a, b) {
                    return c.del(a, b)
                };
                e.merge = function (a, b) {
                    for (var c in b)"object" != typeof a[c] ? a[c] = b[c] : "object" == typeof b[c] && (a[c] = e.merge(a[c],
                        b[c]));
                    return a
                };
                e.clone = function (a) {
                    if (!a || "object" != typeof a || e.isFunction(a))return a;
                    if (a.nodeType && "cloneNode" in a)return a.cloneNode(!0);
                    if (a instanceof Date)return new Date(a.getTime());
                    if (a instanceof RegExp)return new RegExp(a);
                    var b, c, f;
                    if (e.isArray(a))for (b = [], c = 0, f = a.length; c < f; ++c)c in a && b.push(e.clone(a[c])); else b = a.constructor ? new a.constructor : {};
                    return e._mixin(b, a, e.clone)
                };
                e._mixin = function (a, b, c) {
                    var f, m, h = {};
                    for (f in b)m = b[f], f in a && (a[f] === m || f in h && h[f] === m) || (a[f] = c ? c(m) :
                        m);
                    return a
                };
                e.mixin = function (a, b) {
                    if (b) {
                        a || (a = {});
                        for (var c = arguments.length, f = 1; f < c; f++)e._mixin(a, arguments[f])
                    }
                    return a
                };
                e.cloneKeys = function (a, b) {
                    var c = {}, f;
                    for (f in a)if (!0 !== b || f in a)c[f] = a[f];
                    return c
                };
                e.isArray = function (a) {
                    return n.isArray(a)
                };
                e.isObject = function (a) {
                    return n.isObject(a)
                };
                e.isString = function (a) {
                    return n.isString(a)
                };
                e.isNumber = function (a) {
                    return n.isNumber(a)
                };
                e.isFunction = function (a) {
                    return n.isFunction(a)
                };
                return e
            })
        }, "xide/lodash": function () {
            define([], function () {
                if ("undefined" !== typeof _)return _
            })
        }, "xlog/Server": function () {
            define(["dcl/dcl", "xide/types", "xide/factory", "dojo/node!winston"], function (e, p, l, n) {
                return e(null, {
                    declaredClass: "xlog.Server",
                    fileLogger: null,
                    loggly: null,
                    delegate: null,
                    publishLog: !0,
                    loggers: {},
                    constructor: function (d) {
                        for (var b in arguments)arguments.hasOwnProperty(b) && (this[b] = d[b])
                    },
                    createLogger: function (d) {
                        var b = new n.Logger({transports: [new n.transports.File(d)]});
                        if (this.publishLog)b.on("logging", function (a, b, c, g) {
                            g.logId = d.filename;
                            a = {
                                level: b, message: c,
                                data: g, time: (new Date).getTime()
                            };
                            l.publish(p.EVENTS.ON_SERVER_LOG_MESSAGE, a)
                        });
                        return b
                    },
                    start: function (d) {
                        this.loggers = {};
                        this.options = d;
                        if (d.fileLogger && (this.fileLogger = n.add(n.transports.File, d.fileLogger), this.publishLog))this.fileLogger.on("logging", function (b, a, f, c) {
                            b = {level: a, message: f, data: c, time: (new Date).getTime()};
                            l.publish(p.EVENTS.ON_SERVER_LOG_MESSAGE, b)
                        });
                        d.loggly && (this.loggly = n.add(n.transports.Loggly, d.loggly));
                        null === d.console && n.remove(n.transports.Console)
                    }
                })
            })
        }, "xide/factory": function () {
            define(["dcl/dcl"],
                function (e) {
                    return new e(null, {declaredClass: "xide/factory"})
                })
        }, "nxapp/types": function () {
            define(["dojo/_base/declare"], function (e) {
                return e("nxapp.types", null, {})
            })
        }, "nxapp/utils/FileUtils": function () {
            define("dojo/_base/json dojo/node!path dojo/node!fs dojo/node!util nxapp/utils xdojo/has!host-node?dojo/node!glob-fs xdojo/has!host-node?dojo/node!glob-base xdojo/has!host-node?dojo/node!glob".split(" "), function (e, p, l, n, d, b, a, f) {
                d.list = function (c) {
                    try {
                        var f = {}, d = a(c);
                        d.base && (f.cwd = d.base, d.isGlob &&
                        (c = d.glob));
                        var q = (new b).readdirSync(c, f), k = [];
                        _.each(q, function (a) {
                            k.push((f.cwd ? f.cwd + p.sep : "") + a)
                        })
                    } catch (m) {
                        return null
                    }
                    return k
                };
                d.__toObject = function (a) {
                    try {
                        var b = l.statSync(a, function (a) {
                        }), f = b.isDirectory();
                        return {
                            path: a,
                            sizeBytes: b.size,
                            size: f ? "Folder" : "",
                            owner: b.uid,
                            group: b.gid,
                            mode: b.mode,
                            isDir: f,
                            directory: f,
                            name: p.win32.basename(a),
                            fileType: f ? "folder" : "file",
                            modified: b.mtime.getTime() / 1E3
                        }
                    } catch (d) {
                        return {
                            path: a,
                            sizeBytes: 0,
                            size: 0,
                            owner: 0,
                            group: 0,
                            mode: 0,
                            directory: !1,
                            mime: "unknown",
                            name: p.win32.basename(a),
                            fileType: "file",
                            modified: 0
                        }
                    }
                };
                d.ls = function (a) {
                    function b(h, m) {
                        return h ? h = !q || m && "/" !== m ? a.join(m, h) : "" + h : ""
                    }

                    var r = {}, q = "win32" === process.platform;
                    if ("/*" === a && q) {
                        var k = [];
                        flop.read("/", function (a, h) {
                            _.each(h.files, function (a) {
                                k.push({
                                    path: "/" + a.name + ":",
                                    sizeBytes: 0,
                                    size: 0,
                                    owner: 0,
                                    group: 0,
                                    mode: 0,
                                    directory: !0,
                                    mime: "unknown",
                                    name: a.name,
                                    fileType: "folder",
                                    modified: 0,
                                    drive: !0
                                })
                            })
                        })
                    } else {
                        var m = "";
                        if (q)if (5 === a.length) {
                            var h = a.split(":/");
                            2 == h.length && (m = h[0][1] + ":/", r = {root: m}, a = "/*")
                        } else h = a.split(":/"),
                        2 == h.length && (m = h[0][1] + ":/", r = {root: m}, a = "" + h[1]);
                        r = f.sync(a, r);
                        _.isArray(r) || (r = [r]);
                        k = [];
                        _.each(r, function (a) {
                            a = d.__toObject(a);
                            q && a && a.path && (a.path = p.resolve(b(a.path)));
                            a.realPath = p.resolve(a.path);
                            a && k.push(a)
                        });
                        return k
                    }
                };
                d.resolve = function (a) {
                    var b = p.resolve(a);
                    try {
                        if (l.statSync(b))return b
                    } catch (f) {
                        return b
                    }
                    try {
                        if (l.statSync(a))return a;
                        var d = process.cwd() + p.sep + a;
                        if (l.statSync(d))return d
                    } catch (k) {
                    }
                    return null
                };
                d.isDirectory = function (a) {
                    return (a = d.resolve(a)) && (a = l.statSync(a)) && a.isDirectory() ?
                        !0 : !1
                };
                d.getExtension = function (a) {
                    a = p.extname(a || "").split(".");
                    return a[a.length - 1]
                };
                d.readFile = function (a) {
                    var b = l.statSync(a).size, f = new Buffer(b);
                    a = l.openSync(a, "r");
                    if (!b)return "";
                    l.readSync(a, f, 0, b, 0);
                    l.closeSync(a);
                    return f.toString()
                };
                d.writeFile = function (a, b) {
                    l.writeFile(a, b, function (a) {
                        a && console.log(a)
                    })
                };
                d.writeJSONFile = function (a, b) {
                    var f = JSON.stringify(b, null, 4);
                    l.writeFile(a, f, function (a) {
                        a && console.log(a)
                    })
                };
                return d
            })
        }, "nxapp/utils": function () {
            define(["dojo/_base/declare"], function (e) {
                return e("nxapp.utils",
                    null, {})
            })
        }, "xdojo/has": function () {
            define(["dojo/has"], function (e) {
                return e
            })
        }, "nxapp/utils/TCPUtils": function () {
            define(["dojo/node!net", "nxapp/utils", "nxapp/server/WebSocket", "nxapp/server/DeviceServer", "nxapp/server/FileServer"], function (e, p, l, n, d) {
                p.checkPort = function (b, a, f) {
                    var c = new e.Socket, g = null;
                    c.on("connect", function () {
                        g = "open";
                        c.end()
                    });
                    c.setTimeout(1500);
                    c.on("timeout", function () {
                        g = "closed";
                        c.destroy()
                    });
                    c.on("error", function (a) {
                        g = "closed"
                    });
                    c.on("close", function (c) {
                        f(null, g, a, b)
                    });
                    c.connect(b,
                        a)
                };
                p.createSocketServer = function (b, a) {
                    var f = new l;
                    f.init({options: {port: b.socket_server.port, context: a, host: b.socket_server.host}});
                    f.ctx = a;
                    f.start(null, b);
                    return l
                };
                p.createDeviceServer = function (b, a) {
                    var f = new n;
                    f.init({options: {port: b.socket_server.port, context: a, host: b.socket_server.host}});
                    f.ctx = a;
                    f.start(null, b);
                    return f
                };
                p.createFileServer = function (b, a) {
                    var f = new d;
                    f.init({options: {port: b.socket_server.port, context: a, host: b.socket_server.host}});
                    f.ctx = a;
                    console.error("create file server " +
                        b.socket_server.host);
                    f.start(null, b);
                    return l
                };
                p.connect = function (b, a) {
                };
                return p
            })
        }, "nxapp/server/WebSocket": function () {
            define("dcl/dcl dojo/_base/lang xide/types xide/factory nxapp/server/ServerBase nxapp/utils/_LogMixin nxapp/server/_CommandsParserMixin dojo/node!http dojo/node!sockjs dojo/node!colors xide/utils".split(" "), function (e, p, l, n, d, b, a, f, c, g, r) {
                var q = !1;
                return e([d, b, a], {
                    declaredClass: "nxapp.server.WebSocket",
                    _io_socket: null,
                    clients: null,
                    handleManagerCommand: function (a, b) {
                        switch (a.manager_command) {
                            case l.SOCKET_SERVER_COMMANDS.MANAGER_TEST:
                                console.dir("Test Manager command");
                                break;
                            case l.SOCKET_SERVER_COMMANDS.WATCH:
                                var h = this.ctx.getFileManager();
                                h && h.watch(a.path, a.watch);
                                break;
                            case l.SOCKET_SERVER_COMMANDS.MQTT_PUBLISH:
                                return this.sendMQTTMessage(a, b);
                            case l.SOCKET_SERVER_COMMANDS.MANAGER_START_DRIVER:
                                return this.startDriver(a, b);
                            case l.SOCKET_SERVER_COMMANDS.GET_DEVICE_VARIABLES:
                                return this.getVariables(a, b);
                            case l.SOCKET_SERVER_COMMANDS.WRITE_LOG_MESSAGE:
                                this.logClientMessage(a);
                                break;
                            case l.SOCKET_SERVER_COMMANDS.MANAGER_STOP_DRIVER:
                                this.stopDriver(a);
                                break;
                            case l.SOCKET_SERVER_COMMANDS.MANAGER_STATUS:
                                a =
                                {
                                    message: "returning status",
                                    deviceConnections: this.options.context.getConnectionManager().getNumberOfConnections()
                                };
                                this.emit(l.SOCKET_SERVER_COMMANDS.SIGNAL_RESPONSE, JSON.stringify(a));
                                break;
                            case l.SOCKET_SERVER_COMMANDS.MANAGER_CLOSE_ALL:
                                this.options.context.getConnectionManager().closeAll()
                        }
                    },
                    handleDeviceCommand: function (a, b) {
                        var h = a.device_command, f = this.options.context, c = this;
                        q = !1;
                        this.showDebugMsg("socket_server") && q && console.log("Handle device command: " + h + " | " + l.SOCKET_SERVER_COMMANDS.CALL_METHOD);
                        console.error("handle device command", a);
                        var g = f.getConnectionManager().connect(a.host, a.protocol, a.port, null, null, b);
                        b || q && console.error("---have no client connect");
                        try {
                            f.getConnectionManager().registerFeedBack(g, function (b, h) {
                                c.profile.debug.debugDevices && q && console.log("Data received from " + b.host);
                                if (_.isString(h))a.lastResponse = "" + h; else if (_.isObject(h))try {
                                    a.lastResponse = JSON.stringify(h)
                                } catch (m) {
                                    q && console.error("error serializing data")
                                }
                                c.onDeviceMessage(b, h)
                            })
                        } catch (d) {
                            console.error("-register feed back function failed",
                                d), console.trace()
                        }
                        try {
                            switch (h) {
                                case l.SOCKET_SERVER_COMMANDS.CALL_METHOD:
                                    this.options.context.getConnectionManager().callMethod(g, a, b);
                                    break;
                                case l.SOCKET_SERVER_COMMANDS.DEVICE_SEND:
                                    this.options.context.getConnectionManager().send(g, a.command, a.options)
                            }
                        } catch (r) {
                            console.error("error command parser " + h, r)
                        }
                    },
                    broadCastMessage: function (a, b) {
                        for (var h = this.clients.length; h--;)if (void 0 !== this.clients[h]) {
                            var f = {event: a, data: b};
                            3 === this.clients[h].readyState ? (this.clients[h].close(), this.clients.remove(this.clients[h])) :
                                (q && console.log(g.green("writing broadcast message " + f.event + " have " + this.clients.length + " clients  readystate : " + this.clients[h].readyState)), f = JSON.stringify(f), this.clients[h].write(f))
                        }
                    },
                    onFileChanged: function (a) {
                        this.broadCastMessage(l.EVENTS.ON_FILE_CHANGED, {path: a.path, type: a.type})
                    },
                    start: function (a, b) {
                        this.profile = b;
                        this.options = p.mixin(this.options, a);
                        this.clients = [];
                        var h = this;
                        console.error("######", b);
                        var g = this.options.port, d = this.options.host;
                        if (g) {
                            this.initLogger(b.debug);
                            this.log("Socket server running in " +
                                g, "socket_server");
                            var r = {};
                            this.showDebugMsg("socket_server") || (r.log = function () {
                            });
                            var r = c.createServer(r), e = f.createServer(this._handler);
                            r.installHandlers(e);
                            e.listen(g, d);
                            this._handleSocketEmits(r);
                            n.publish(l.EVENTS.ON_WEBSOCKET_START, {socket_server: {port: g, socket_handler: r}}, this);
                            r.on("connection", function (a) {
                                var b = h.clients.push(a);
                                a.on("close", function () {
                                    q && console.error("close connection :  " + b);
                                    delete h.clients[b]
                                })
                            });
                            return !0
                        }
                        console.error("Port must be provided into options");
                        return !1
                    },
                    emit: function (a, b) {
                        console.log("emit + " + this.id + "#" + a, b);
                        this.showDebugMsg("socket_server") && !_.isString(b) && _.isObject(b) && (b = JSON.stringify(b));
                        this.socket ? this.socket.write(b) : q && console.error("-------- WebSocket::emit failed. Have no socket! " + a + " id " + this.id)
                    },
                    _handleSocketEmits: function (a) {
                        var b = this.options.port, h = this;
                        a.on("connection", function (a) {
                            h.socket = a;
                            q && console.log("client connected");
                            n.publish(l.EVENTS.ON_WEBSOCKET_CONNECTION, {
                                connection: {
                                    port: b,
                                    socket_handler: a
                                }
                            }, this);
                            a.on("data",
                                function (b) {
                                    p.isString(b) && (b = dojo.fromJson(b));
                                    b.manager_command ? h.handleManagerCommand(b, a) : h.handleDeviceCommand(b, a)
                                });
                            a.on("close", function () {
                                console.error("closed!")
                            })
                        })
                    },
                    constructor: function () {
                        this.id = r.createUUID()
                    }
                })
            })
        }, "nxapp/server/ServerBase": function () {
            define(["dcl/dcl", "xide/model/Base", "xide/utils", "xide/mixins/EventedMixin"], function (e, p, l, n) {
                return e([p.dcl, n.dcl], {
                    options: null,
                    delegate: null,
                    ctx: null,
                    declaredClass: "nxapp.server.ServerBase",
                    _defaultOptions: function () {
                        return {delegate: this}
                    },
                    init: function (d) {
                        this.options = l.mixin(this._defaultOptions(), d.options)
                    }
                })
            })
        }, "xide/model/Base": function () {
            define(["dcl/dcl", "dojo/_base/declare", "xide/utils"], function (e, p, l) {
                var n = {
                    declaredClass: "xide/model/Base", constructor: function (d) {
                        l.mixin(this, d)
                    }, getLabel: function () {
                        return null
                    }, getID: function () {
                        return null
                    }
                };
                p = p("xide/model/Base", null, n);
                p.dcl = e(null, n);
                return p
            })
        }, "xide/mixins/EventedMixin": function () {
            define("dojo/_base/array dcl/dcl xdojo/declare xdojo/has xide/types xide/factory".split(" "),
                function (e, p, l, n, d, b) {
                    n = {
                        _didRegisterSubscribers: !1,
                        subscribers: null,
                        subscribes: {},
                        emits: {},
                        __events: null,
                        addPublishFilter: function (a, b) {
                            a && (null != b ? this.emits[a] = b : a in this.emits && delete this.emits[a])
                        },
                        filterSubscribe: function (a) {
                            return this.subscribes ? !1 !== this.subscribes[a] : !0
                        },
                        filterPublish: function (a) {
                            return this.emits ? !1 !== this.emits[a] : !0
                        },
                        subscribe: function (a, f, c) {
                            this.__events || (this.__events = {});
                            a = b.subscribe(a, f, c || this, this.filterSubscribe.bind(this));
                            f = this.__events;
                            c = 0;
                            for (var g = a.length; c <
                            g; c++) {
                                var d = a[c].type;
                                f[d] || (f[d] = []);
                                f[d].push(a[c])
                            }
                            return a
                        },
                        publish: function (a, f, c, g) {
                            var d = this;
                            0 < g ? setTimeout(function () {
                                b.publish(a, f, c || d, d.filterPublish.bind(d))
                            }.bind(d), g) : b.publish(a, f, c || d, d.filterPublish.bind(d))
                        },
                        _destroyHandle: function (a) {
                        },
                        _destroyHandles: function () {
                            if (this.__events) {
                                for (var a in this.__events)e.forEach(this.__events[a], function (a) {
                                    a && a.remove && a.remove()
                                });
                                delete this.__events
                            }
                        },
                        destroy: function () {
                            this._emit("destroy");
                            this.inherited && this.inherited(arguments);
                            this._destroyHandles()
                        },
                        once: function (a, b) {
                            function c() {
                                g.unsubscribe(a, b);
                                return b.apply(g, arguments)
                            }

                            var g = this;
                            c.listener = b;
                            g._on(a, c);
                            return this
                        },
                        _emit: function (a) {
                            if (this.__events) {
                                if (!this._didRegisterSubscribers && this.subscribers) {
                                    for (var b = 0; b < this.subscribers.length; b++) {
                                        var c = this.subscribers[b];
                                        this._on(c.event, c.handler, c.owner)
                                    }
                                    this._didRegisterSubscribers = !0
                                }
                                if (!0 === arguments[2])throw Error("Please use emit.sticky() instead of passing sticky\x3dtrue for event: " + a);
                                b = this.__events[a];
                                c = 1 < arguments.length ? arguments[2] : null;
                                if (b) {
                                    var g;
                                    if ("function" == typeof b)switch (arguments.length) {
                                        case 1:
                                            return b.call(this);
                                        case 2:
                                            return b.call(this, arguments[1]);
                                        case 3:
                                            return b.call(this, arguments[1], arguments[2]);
                                        default:
                                            var d = Array.prototype.slice.call(arguments, 1);
                                            g = b.apply(this, d)
                                    } else if (_.isArray(b))for (var d = Array.prototype.slice.call(arguments, 1), q = b.slice(), k, m = null, h = null, b = 0, t = q.length; b < t; b++)m = q[b], h = m.owner || this, d && d[0] && (d[0].owner = d[0] ? d[0].owner || h : null), m.handler && (k = m.handler.apply(h,
                                        d)), void 0 !== k && (g = k), d && d[0] && d[0].owner && (d[0].owner = null);
                                    c && !0 === c["public"] && this.publish(a, d);
                                    return g
                                }
                            }
                        },
                        unsubscribe: function (a, b) {
                            if (!this.__events || !this.__events[a])return this;
                            if ("function" !== typeof b || !b)return e.forEach(this.__events[a], dojo.unsubscribe), delete this.__events[a], this.__events[a] = [], this;
                            var c = this.__events[a];
                            if (_.isArray(c)) {
                                var g = [];
                                _.each(c, function (a, c, k) {
                                    (a.handler == b ? a.handler : a.handler.listener == b && a.handler.listener) && g.push(a)
                                });
                                _.each(g, function (a) {
                                    a.remove()
                                });
                                0 === c.length && delete this.__events[a]
                            } else(this.__events[a].listener || this.__events[a]) === b && delete this.__events[a];
                            return this
                        },
                        listeners: function (a) {
                            this.__events || (this.__events = {});
                            this.__events[a] || (this.__events[a] = []);
                            isArray(this.__events[a]) || (this.__events[a] = [this.__events[a]]);
                            return this.__events[a]
                        },
                        addHandle: function (a, b) {
                            this.__events || (this.__events = {});
                            this.__events[a] || (this.__events[a] = []);
                            b.type = a;
                            this.__events[a].push(b);
                            return b
                        },
                        __on: function (a, b, c, g) {
                            var d = g;
                            "function" != typeof c || g || (g = c, c = null);
                            a = a.jquery ? a : $(a);
                            a.on(b, c, g);
                            this.__events || (this.__events = {});
                            this.__events[b] || (this.__events[b] = []);
                            var q = this.__events[b];
                            a = {
                                handler: d, owner: this, type: b, element: a, selector: c, remove: function () {
                                    q.remove(this);
                                    this.element.off(this.type, this.selector, this.handler)
                                }
                            };
                            q.push(a);
                            return a
                        },
                        _on: function (a, b, c) {
                            try {
                                this.__events || (this.__events = {});
                                this.__events[a] || (this.__events[a] = []);
                                var g = this.__events[a];
                                if (!g)this.__events[a] = b; else if (_.isArray(g)) {
                                    if (-1 != g.indexOf(b))return console.warn("adding same listener twice",
                                        a);
                                    b = {
                                        handler: b, owner: c || this, type: a, remove: function () {
                                            g.remove(this);
                                            c && c.__events && c.__events[a] && c.__events[a].remove(this);
                                            this.handler = this.owner = null;
                                            delete this.type
                                        }
                                    };
                                    g.push(b);
                                    return b
                                }
                            } catch (d) {
                                logError(d)
                            }
                            return this
                        }
                    };
                    l = l(null, n);
                    l.Impl = n;
                    l.dcl = p(null, n);
                    p.chainAfter(l.dcl, "destroy");
                    return l
                })
        }, "xdojo/declare": function () {
            define(["dojo/_base/declare"], function (e) {
                return e
            })
        }, "nxapp/utils/_LogMixin": function () {
            define(["dcl/dcl"], function (e) {
                return e(null, {
                    declaredClass: "nxapp.utils._LogMixin",
                    debug_conf: null, logger: null, initLogger: function (e) {
                        this.debug_conf = e
                    }, log: function (e, l, n, d) {
                        l || (l = this._debugContext().main);
                        l && !this.showDebugMsg(l) || !this.logger || (n = n || "info", d.time = (new Date).getTime(), this.logger.log(n, e, d))
                    }, logEx: function (e, l, n, d) {
                        this.logger ? (l = l || "info", d = d || {}, d.type = n || "Unknown", d.time = d.time || (new Date).getTime(), this.logger.log(l, e, d)) : console.error("have no logger!")
                    }, showDebugMsg: function (e) {
                        if (null != this.debug_conf)return this.debug_conf.all ? !0 : this.debug_conf[e] ?
                            !0 : !1;
                        this.debug_conf = {all: !0};
                        return !0
                    }
                })
            })
        }, "nxapp/server/_CommandsParserMixin": function () {
            define(["dcl/dcl", "nxapp/types/Types", "nxapp/utils/_console"], function (e, p, l) {
                var n = !1;
                return e(null, {
                    declaredClass: "nxapp.server._CommandsParserMixin", handleManagerCommand: function (d, b) {
                        switch (d.manager_command) {
                            case p.SOCKET_SERVER_COMMANDS.MANAGER_TEST:
                                console.dir("Test Manager command");
                                break;
                            case p.SOCKET_SERVER_COMMANDS.WATCH:
                                var a = this.ctx.getFileManager();
                                a && a.watch(d.path, d.watch);
                                break;
                            case p.SOCKET_SERVER_COMMANDS.MQTT_PUBLISH:
                                return this.sendMQTTMessage(d,
                                    b);
                            case p.SOCKET_SERVER_COMMANDS.MANAGER_START_DRIVER:
                                return this.startDriver(d, b);
                            case p.SOCKET_SERVER_COMMANDS.GET_DEVICE_VARIABLES:
                                return this.getVariables(d, b);
                            case p.SOCKET_SERVER_COMMANDS.WRITE_LOG_MESSAGE:
                                this.logClientMessage(d);
                                break;
                            case p.SOCKET_SERVER_COMMANDS.MANAGER_STOP_DRIVER:
                                this.stopDriver(d);
                                break;
                            case p.SOCKET_SERVER_COMMANDS.MANAGER_STATUS:
                                d = {
                                    message: "returning status",
                                    deviceConnections: this.options.context.getConnectionManager().getNumberOfConnections()
                                };
                                this.emit(p.SOCKET_SERVER_COMMANDS.SIGNAL_RESPONSE,
                                    JSON.stringify(d));
                                break;
                            case p.SOCKET_SERVER_COMMANDS.MANAGER_CLOSE_ALL:
                                this.options.context.getConnectionManager().closeAll()
                        }
                    }, handleDeviceCommand: function (d, b) {
                        var a = d.device_command, f = this.options.context, c = this;
                        n = !1;
                        this.showDebugMsg("socket_server") && n && console.log("Handle device command: " + a + " | " + p.SOCKET_SERVER_COMMANDS.CALL_METHOD);
                        console.error("handle device command", d);
                        var g = f.getConnectionManager().connect(d.host, d.protocol, d.port, null, null, b);
                        b || n && console.error("---have no client connect");
                        try {
                            f.getConnectionManager().registerFeedBack(g, function (a, b) {
                                c.profile.debug.debugDevices && n && console.log("Data received from " + a.host);
                                if (_.isString(b))d.lastResponse = "" + b; else if (_.isObject(b))try {
                                    d.lastResponse = JSON.stringify(b)
                                } catch (h) {
                                    n && console.error("error serializing data")
                                }
                                c.onDeviceMessage(a, b)
                            })
                        } catch (r) {
                            console.error("-register feed back function failed", r), console.trace()
                        }
                        try {
                            switch (a) {
                                case p.SOCKET_SERVER_COMMANDS.CALL_METHOD:
                                    this.options.context.getConnectionManager().callMethod(g,
                                        d, b);
                                    break;
                                case p.SOCKET_SERVER_COMMANDS.DEVICE_SEND:
                                    this.options.context.getConnectionManager().send(g, d.command, d.options)
                            }
                        } catch (q) {
                            console.error("error command parser " + a, q)
                        }
                    }
                })
            })
        }, "nxapp/types/Types": function () {
            define(["dojo/_base/lang", "xide/types/Types", "xcf/types/Types"], function (e, p) {
                e.mixin(p.EVENTS, {
                    ON_FILE_CHANGED: "fileChanged",
                    ON_CONNECTION_CREATED: "connectionCreated",
                    ON_CONNECTION_ERROR: "connectionError",
                    ON_WEBSOCKET_START: "webSocketStart",
                    ON_WEBSOCKET_CONNECTION: "webSocketConnection",
                    ON_MQTT_MESSAGE: "onMQTTMessage",
                    ON_DEVICE_MESSAGE: "onDeviceMessage",
                    ON_COMMAND_FINISH: "onCommandFinish",
                    ON_COMMAND_ERROR: "onCommandError",
                    ON_DEVICE_DISCONNECTED: "onDeviceDisconnected",
                    ON_DEVICE_CONNECTED: "onDeviceConnected",
                    STORE_CHANGED: "storeChange",
                    BEFORE_STORE_CHANGE: "beforeStoreChange",
                    STORE_REFRESHED: "storeRefreshed",
                    ON_DID_OPEN_ITEM: "onDidOpenItem",
                    ON_SHOW_PANEL: "onShowPanel",
                    ITEM_SELECTED: "itemSelected",
                    ERROR: "fileOperationError",
                    STATUS: "fileOperationStatus",
                    IMAGE_LOADED: "imageLoaded",
                    IMAGE_ERROR: "imageError",
                    RESIZE: "resize",
                    UPLOAD_BEGIN: "uploadBegin",
                    UPLOAD_PROGRESS: "uploadProgress",
                    UPLOAD_FINISH: "uploadFinish",
                    ON_CLIPBOARD_COPY: "onClipboardCopy",
                    ON_CLIPBOARD_PASTE: "onClipboardPaste",
                    ON_CLIPBOARD_CUT: "onClipboardCut",
                    ON_CONTEXT_MENU_OPEN: "onContextMenuOpen",
                    ON_PLUGIN_LOADED: "onPluginLoaded",
                    ON_PLUGIN_READY: "onPluginReady",
                    ON_MAIN_VIEW_READY: "onMainViewReady2",
                    REGISTER_EDITOR: "registerEditor",
                    REGISTER_ACTION: "registerAction",
                    ON_FILE_CONTENT_CHANGED: "onFileContentChanged",
                    ON_PANEL_CLOSED: "onPanelClosed",
                    ON_PANEL_CREATED: "onPanelCreated",
                    SET_DEVICE_VARIABLES: "setDeviceVariables"
                });
                p.LOG_CONTEXT = {DEVICE: "Device"};
                p.test = 2;
                return p
            })
        }, "xcf/types/Types": function () {
            define("xaction/types xide/types/Types xide/types xide/utils/ObjectUtils xide/utils xide/utils/HexUtils".split(" "), function (e, p, l, n, d, b) {
                String.prototype.setBytes || (String.prototype.setBytes = function (a) {
                    this.bytes = a
                });
                String.prototype.getBytes || (String.prototype.getBytes = function () {
                    return this.bytes ? this.bytes : b.stringToBuffer(this)
                });
                String.prototype.getString ||
                (String.prototype.getString = function () {
                    return this.string
                });
                String.prototype.setString || (String.prototype.setString = function (a) {
                    this.string = a
                });
                String.prototype.hexString || (String.prototype.hexString = function () {
                    var a = this.getBytes();
                    return b.bufferToHexString(a)
                });
                l.VARIABLE_FLAGS = {PUBLISH: 2, PUBLISH_IF_SERVER: 4};
                l.LOGGING_FLAGS = {
                    NONE: 0,
                    GLOBAL_CONSOLE: 1,
                    STATUS_BAR: 2,
                    POPUP: 4,
                    FILE: 8,
                    DEV_CONSOLE: 16,
                    DEVICE_CONSOLE: 32
                };
                d.mixin(l.ITEM_TYPE, {
                    DEVICE: "Device", DEVICE_GROUP: "Device Group", DRIVER: "Driver", DRIVER_GROUP: "Driver Group",
                    PROTOCOL: "Protocol", PROTOCOL_GROUP: "Protocol Group"
                });
                l.SERVICE_STATUS = {OFFLINE: "offline", ONLINE: "online", TIMEOUT: "timeout"};
                l.PROTOCOL = {TCP: "tcp", UDP: "udp", SERIAL: "serial", DRIVER: "driver", SSH: "ssh", MQTT: "mqtt"};
                d.mixin(l.EVENTS, {
                    ON_DEBUGGER_READY: "onDebuggerReady",
                    ON_DEVICE_SELECTED: "onDeviceSelected",
                    ON_DEVICE_GROUP_SELECTED: "onDeviceGroupSelected",
                    ON_PROTOCOL_SELECTED: "onProtocolSelected",
                    ON_PROTOCOL_GROUP_SELECTED: "onProtocolGroupSelected",
                    ON_PROTOCOL_CHANGED: "onProtocolChanged",
                    ON_MQTT_MESSAGE: "onMQTTMessage",
                    ON_DEVICE_MESSAGE: "onDeviceMessage",
                    ON_DEVICE_MESSAGE_EXT: "onDeviceMessageExt",
                    ON_COMMAND_FINISH: "onCommandFinish",
                    ON_COMMAND_PROGRESS: "onCommandProgress",
                    ON_COMMAND_PAUSED: "onCommandPaused",
                    ON_COMMAND_STOPPED: "onCommandStopped",
                    ON_COMMAND_ERROR: "onCommandError",
                    ON_DEVICE_DISCONNECTED: "onDeviceDisconnected",
                    ON_DEVICE_CONNECTED: "onDeviceConnected",
                    ON_DEVICE_COMMAND: "onDeviceCommand",
                    ON_DEVICE_STATE_CHANGED: "onDeviceStateChanged",
                    ON_DEVICE_DRIVER_INSTANCE_READY: "onDeviceDriveInstanceReady",
                    ON_DRIVER_SELECTED: "onDriverSelected",
                    ON_DRIVER_GROUP_SELECTED: "onDriverGroupSelected",
                    ON_DRIVER_VARIABLE_ADDED: "onDriverVariableAdded",
                    ON_DRIVER_VARIABLE_REMOVED: "onDriverVariableRemoved",
                    ON_DRIVER_VARIABLE_CHANGED: "onDriverVariableChanged",
                    ON_DRIVER_COMMAND_ADDED: "onDriverCommandAdded",
                    ON_DRIVER_COMMAND_REMOVED: "onDriverCommandRemoved",
                    ON_DRIVER_COMMAND_CHANGE: "onDriverVariableChanged",
                    ON_SCOPE_CREATED: "onScopeCreated",
                    ON_DRIVER_MODIFIED: "onDriverModified",
                    SET_DEVICE_VARIABLES: "setDeviceVariables",
                    ON_SERVER_LOG_MESSAGE: "onServerLogMessage",
                    ON_CLIENT_LOG_MESSAGE: "onClientLogMessage",
                    ON_DEVICE_SERVER_CONNECTED: "onDeviceServerConnected",
                    ON_RUN_CLASS_EVENT: "onRunClassEvent"
                });
                l.MESSAGE_SOURCE = {DEVICE: "DEVICE", GUI: "GUI", BLOX: "BLOX", CODE: "CODE"};
                l.DEVICE_STATE = {
                    CONNECTING: "DeviceIsConnecting",
                    CONNECTED: "DeviceIsConnected",
                    SYNCHRONIZING: "DeviceIsSynchronizing",
                    READY: "DeviceIsReady",
                    DISCONNECTED: "DeviceIsDisconnected",
                    DISABLED: "DeviceIsDisabled",
                    LOST_DEVICE_SERVER: "LostDeviceServerConnection"
                };
                l.DRIVER_PROPERTY = {
                    CF_DRIVER_NAME: "CF_DRIVER_NAME",
                    CF_DRIVER_ICON: "CF_DRIVER_ICON",
                    CF_DRIVER_CLASS: "CF_DRIVER_CLASS",
                    CF_DRIVER_ID: "CF_DRIVER_ID",
                    CF_DRIVER_COMMANDS: "CF_DRIVER_COMMANDS",
                    CF_DRIVER_VARIABLES: "CF_DRIVER_VARIABLES",
                    CF_DRIVER_RESPONSES: "CF_DRIVER_RESPONSES"
                };
                l.PROTOCOL_PROPERTY = {
                    CF_PROTOCOL_TITLE: "Title",
                    CF_PROTOCOL_ICON: "CF_PROTOCOL_ICON",
                    CF_PROTOCOL_CLASS: "CF_PROTOCOL_CLASS",
                    CF_PROTOCOL_ID: "CF_PROTOCOL_ID",
                    CF_PROTOCOL_COMMANDS: "CF_PROTOCOL_COMMANDS",
                    CF_PROTOCOL_VARIABLES: "CF_PROTOCOL_VARIABLES",
                    CF_PROTOCOL_RESPONSES: "CF_PROTOCOL_RESPONSES"
                };
                l.DEVICE_PROPERTY = {
                    CF_DEVICE_DRIVER: "Driver",
                    CF_DEVICE_HOST: "Host",
                    CF_DEVICE_PORT: "Port",
                    CF_DEVICE_PROTOCOL: "Protocol",
                    CF_DEVICE_TITLE: "Title",
                    CF_DEVICE_ID: "Id",
                    CF_DEVICE_ENABLED: "Enabled",
                    CF_DEVICE_OPTIONS: "Options",
                    CF_DEVICE_DRIVER_OPTIONS: "DriverOptions",
                    CF_DEVICE_LOGGING_FLAGS: "Logging Flags"
                };
                l.LOG_OUTPUT = {
                    DEVICE_CONNECTED: "Device Connected",
                    DEVICE_DISCONNECTED: "Device Disonnected",
                    RESPONSE: "Response",
                    SEND_COMMAND: "Send Command",
                    DEVICE_ERROR: "Device Error"
                };
                l.DEFAULT_DEVICE_LOGGING_FLAGS = {};
                e = l.LOGGING_FLAGS;
                l.DEFAULT_DEVICE_LOGGING_FLAGS[l.LOG_OUTPUT.DEVICE_CONNECTED] = e.GLOBAL_CONSOLE | e.POPUP | e.STATUS_BAR | e.DEVICE_CONSOLE;
                l.DEFAULT_DEVICE_LOGGING_FLAGS[l.LOG_OUTPUT.DEVICE_DISCONNECTED] = e.GLOBAL_CONSOLE | e.POPUP | e.STATUS_BAR | e.DEVICE_CONSOLE;
                l.DEFAULT_DEVICE_LOGGING_FLAGS[l.LOG_OUTPUT.RESPONSE] = e.DEVICE_CONSOLE | e.GLOBAL_CONSOLE;
                l.DEFAULT_DEVICE_LOGGING_FLAGS[l.LOG_OUTPUT.SEND_COMMAND] = e.DEVICE_CONSOLE | e.GLOBAL_CONSOLE;
                l.DEFAULT_DEVICE_LOGGING_FLAGS[l.LOG_OUTPUT.DEVICE_ERROR] = e.GLOBAL_CONSOLE |
                    e.POPUP | e.STATUS_BAR | e.DEV_CONSOLE | e.DEVICE_CONSOLE;
                l.DRIVER_FLAGS = {RUNS_ON_SERVER: 2, DEBUG: 4, SERVER: 16};
                d.mixin(l.ITEM_TYPE, {
                    CF_DRIVER_VARIABLE: "DriverVariable",
                    CF_DRIVER_BASIC_COMMAND: "DriverBasicCommand",
                    CF_DRIVER_CONDITIONAL_COMMAND: "DriverConditionalCommand",
                    CF_DRIVER_RESPONSE_VARIABLE: "DriverResponseVariable"
                });
                l.BLOCK_GROUPS = {
                    CF_DRIVER_VARIABLE: "DriverVariable",
                    CF_DRIVER_BASIC_COMMAND: "DriverBasicCommand",
                    CF_DRIVER_CONDITIONAL_COMMAND: "DriverConditionalCommand",
                    CF_DRIVER_RESPONSE_VARIABLE: "DriverResponseVariable",
                    CF_DRIVER_RESPONSE_BLOCKS: "conditionalProcess",
                    CF_DRIVER_RESPONSE_VARIABLES: "processVariables",
                    CF_DRIVER_BASIC_VARIABLES: "basicVariables"
                };
                l.COMMAND_TYPES = {BASIC_COMMAND: "basic", CONDITIONAL_COMMAND: "conditional", INIT_COMMAND: "init"};
                d.mixin(l.ECIType, {
                    DEVICE_NETWORK_SETTINGS: l.ECIType.END + 1,
                    DRIVER_COMMAND_SETTINGS: "CommandSettings"
                });
                l.VFS_ROOTS = {SYSTEM_DRIVERS: "system_drivers", USER_DRIVERS: "user_drivers"};
                l.SOCKET_SERVER_COMMANDS = {
                    SIGNAL_MANAGER: "Manager_command",
                    RUN_FILE: "Run_File",
                    RUN_CLASS: "Run_Class",
                    SIGNAL_DEVICE: "Device_command",
                    SIGNAL_RESPONSE: "WebSocket_response",
                    MANAGER_TEST: "Manager_Test",
                    MANAGER_CLOSE_ALL: "Close_All_Connections",
                    MANAGER_STATUS: "status",
                    MANAGER_START_DRIVER: "startDriver",
                    START_DEVICE: "startDevice",
                    STOP_DEVICE: "stopDevice",
                    CREATE_CONNECTION: "createConnection",
                    MANAGER_STOP_DRIVER: "stopDriver",
                    DEVICE_SEND: "Device_Send",
                    CALL_METHOD: "Call_Method",
                    RUN_SHELL: "Run_Shell",
                    WATCH: "Watch_Directory",
                    MQTT_PUBLISH: "MQTT_PUBLISH",
                    MQTT_SUBSCRIBE: "MQTT_SUBSCRIBE",
                    GET_DEVICE_VARIABLES: "getVariables",
                    WRITE_LOG_MESSAGE: "Write_Log_Message",
                    INIT_DEVICES: "INIT_DEVICES",
                    PROTOCOL_METHOD: "PROTOCOL_METHOD"
                };
                return l
            })
        }, "xaction/types": function () {
            define(["xide/types", "dojo/_base/lang"], function (e, p) {
                p.mixin(e.EVENTS, {
                    ON_ACTION_CHANGE_CONTEXT: "onChangeActionContext",
                    ON_ACTION_CONTEXT_CHANGED: "onActionContextChanged",
                    REGISTER_ACTION: "registerAction",
                    SET_ITEM_ACTIONS: "onSetItemsActions",
                    ON_CLIPBOARD_COPY: "onClipboardCopy",
                    ON_CLIPBOARD_PASTE: "onClipboardPaste",
                    ON_CLIPBOARD_CUT: "onClipboardCut",
                    ON_RENDER_ACTIONS: "onRenderActions",
                    ON_DID_ACTION: "onDidAction",
                    ON_AFTER_ACTION: "onAfterAction"
                });
                e.ACTION = {
                    LAYOUT: "View/Layout",
                    COLUMNS: "View/Columns",
                    SELECTION: "File/Select",
                    CLIPBOARD: "Edit/Clipboard",
                    UNDO: "Edit/Undo",
                    REDO: "Edit/Redo",
                    CLIPBOARD_COPY: "Edit/Clipboard/Copy",
                    CLIPBOARD_PASTE: "Edit/Clipboard/Paste",
                    CLIPBOARD_CUT: "Edit/Clipboard/Cut",
                    COPY: "File/Copy",
                    MOVE: "File/Move",
                    RENAME: "File/Rename",
                    DELETE: "File/Delete",
                    OPEN: "File/Open",
                    EDIT: "File/Edit",
                    SAVE: "File/Save",
                    SEARCH: "File/Search",
                    TOOLBAR: "View/Show/Toolbar",
                    STATUSBAR: "View/Show/Statusbar",
                    BREADCRUMB: "View/Show/Breadcrumb",
                    HEADER: "View/Show/Header",
                    DOWNLOAD: "File/Download",
                    DOWNLOAD_TO: "File/downloadTo",
                    INFO: "File/Info",
                    COMPRESS: "File/Compress",
                    RELOAD: "File/Reload",
                    UPLOAD: "File/Upload",
                    PREVIEW: "File/Preview",
                    OPEN_IN: "File/Open In",
                    INSERT_IMAGE: "insertImage",
                    COPY_PASTE: "copypaste",
                    DND: "dnd",
                    OPTIONS: "options",
                    NEW_FILE: "File/New/New File",
                    NEW_DIRECTORY: "File/New/New Folder",
                    GET_CONTENT: "get",
                    SET_CONTENT: "set",
                    FIND: "File/Find",
                    CUSTOM: "custom",
                    PERMA_LINK: "permaLink",
                    ADD_MOUNT: "ADD_MOUNT",
                    REMOVE_MOUNT: "REMOVE_MOUNT",
                    EDIT_MOUNT: "EDIT_MOUNT",
                    PERSPECTIVE: "PERSPECTIVE",
                    RUN: "File/Run",
                    GO_UP: "Navigation/Go Up",
                    STOP: "File/Stop",
                    CLOSE: "View/Close",
                    FULLSCREEN: "View/Fullscreen",
                    OPEN_IN_TAB: "File/OpenInNewTab",
                    SOURCE: "Navigation/Source",
                    RIBBON: "View/Show/Ribbon",
                    MAIN_MENU: "View/Show/MainMenu",
                    NAVIGATION: "View/Show/Navigation",
                    BASH_CONSOLE: "File/Console/Bash",
                    JS_CONSOLE: "File/Console/JS",
                    PHP_CONSOLE: "File/Console/PHP",
                    CONSOLE: "File/Console/PHP",
                    SIZE_STATS: "View/Show/SizeStats",
                    WELCOME: "Window/Welcome",
                    CONTEXT_MENU: "File/ContextMenu"
                };
                e.ACTION_TYPE = {MULTI_TOGGLE: "multiToggle", SINGLE_TOGGLE: "singleToggle"};
                e.ACTION_ICON = {
                    CLIPBOARD_COPY: "fa-copy",
                    CLIPBOARD_PASTE: "fa-paste",
                    UPLOAD: "fa-upload",
                    RENAME: "el-icon-edit",
                    DELETE: "text-danger fa-remove",
                    RELOAD: "fa-refresh",
                    EDIT: "fa-pencil",
                    SAVE: "fa-floppy-o",
                    SEARCH: "fa-search",
                    NEW_DIRECTORY: "fa-magic",
                    NEW_FILE: "fa-magic",
                    RUN: "text-success el-icon-play",
                    COMPRESS: "fa-file-archive-o",
                    EXTRACT: "fa-folder-open",
                    DOWNLOAD: "fa-download",
                    GO_UP: "fa-level-up",
                    TOOLBAR: "fa-bars",
                    STATUSBAR: "fa-terminal",
                    PREVIEW: "fa-eye",
                    MAXIMIZE: "fa-arrows-alt",
                    UNDO: "fa-undo",
                    REDO: "fa-repeat"
                };
                return e
            })
        }, "xide/utils/HexUtils": function () {
            define(["xide/utils", "xide/types", "dojo/json", "xide/lodash"], function (e, p, l, n) {
                function d(b) {
                    var h = "";
                    b = parseInt(b, 16);
                    65535 >= b ? h += String.fromCharCode(b) : 1114111 >= b ? (b -= 65536, h += String.fromCharCode(55296 | b >> 10) + String.fromCharCode(56320 | b & 1023)) : h += "hex2Char error: Code point out of range: " + a(b);
                    return h
                }

                function b(b) {
                    var h = "";
                    65535 >= b ? h += String.fromCharCode(b) :
                        1114111 >= b ? (b -= 65536, h += String.fromCharCode(55296 | b >> 10) + String.fromCharCode(56320 | b & 1023)) : h += "dec2char error: Code point out of range: " + a(b);
                    return h
                }

                function a(a) {
                    return (a + 0).toString(16).toUpperCase()
                }

                function f(a) {
                    return B[a >> 4 & 15] + B[a & 15]
                }

                function c(a) {
                    return a = a.replace(/0x([A-Fa-f0-9]{1,4})(\s)?/g, function (a, b) {
                        d(b);
                        return d(b)
                    })
                }

                function g(a) {
                    a = a.replace(/[Uu]\+10([A-Fa-f0-9]{4})/g, function (a, b) {
                        return d("10" + b)
                    });
                    return a = a.replace(/[Uu]\+([A-Fa-f0-9]{1,5})/g, function (a, b) {
                        return d(b)
                    })
                }

                function r(a) {
                    return a = a.replace(/&#x([A-Fa-f0-9]{1,6});/g, function (a, b) {
                        return d(b)
                    })
                }

                function q(a) {
                    return a = a.replace(/&#([0-9]{1,7});/g, function (a, h) {
                        return b(h)
                    })
                }

                function k(a) {
                    return a = a.replace(/0x([A-Fa-f0-9]{1,6})/g, function (a, b) {
                        return d(b)
                    })
                }

                function m(a, b) {
                    b ? (a = a.replace(/\\([A-Fa-f0-9]{1,6})(\s)?/g, function (a, b) {
                        return d(b)
                    }), a = a.replace(/\\/g, "")) : a = a.replace(/\\([A-Fa-f0-9]{2,6})(\s)?/g, function (a, b) {
                        return d(b)
                    });
                    return a
                }

                function h(a, b) {
                    a = a.replace(/\\u\{([A-Fa-f0-9]{1,})\}/g, function (a,
                                                                         b) {
                        return d(b)
                    });
                    a = a.replace(/\\U([A-Fa-f0-9]{8})/g, function (a, b) {
                        return d(b)
                    });
                    a = a.replace(/\\u([A-Fa-f0-9]{4})/g, function (a, b) {
                        return d(b)
                    });
                    b && (a = a.replace(/\\b/g, "\b"), a = a.replace(/\\t/g, "\t"), a = a.replace(/\\n/g, "\n"), a = a.replace(/\\v/g, "\v"), a = a.replace(/\\f/g, "\f"), a = a.replace(/\\r/g, "\r"), a = a.replace(/\\\'/g, "'"), a = a.replace(/\\\"/g, '"'), a = a.replace(/\\\\/g, "\\"));
                    return a
                }

                function t(h) {
                    return h = h.replace(/((%[A-Fa-f0-9]{2})+)/g, function (h, m) {
                        for (var c = "", f = 0, k = 0, g = m.split("%"), d = 1; d < g.length; d++) {
                            var t =
                                parseInt(g[d], 16);
                            switch (f) {
                                case 0:
                                    0 <= t && 127 >= t ? c += b(t) : 192 <= t && 223 >= t ? (f = 1, k = t & 31) : 224 <= t && 239 >= t ? (f = 2, k = t & 15) : 240 <= t && 247 >= t ? (f = 3, k = t & 7) : c += "convertpEsc2Char: error " + a(t) + "! ";
                                    break;
                                case 1:
                                    if (128 > t || 191 < t)c += "convertpEsc2Char: error " + a(t) + "! ";
                                    f--;
                                    c += b(k << 6 | t - 128);
                                    k = 0;
                                    break;
                                case 2:
                                case 3:
                                    if (128 > t || 191 < t)c += "convertpEsc2Char: error " + a(t) + "! ";
                                    k = k << 6 | t - 128;
                                    f--
                            }
                        }
                        return c
                    })
                }

                function w(a) {
                    var b = {};
                    return a = a.replace(/&([A-Za-z0-9]+);/g, function (a, h) {
                        return h in b ? b[h] : a
                    })
                }

                function u(a, h) {
                    "hex" == h ?
                        a = a.replace(/(\b[A-Fa-f0-9]{2,6}\b)/g, function (a, b) {
                            return d(b)
                        }) : "dec" == h ? a = a.replace(/(\b[0-9]+\b)/g, function (a, h) {
                        return b(h)
                    }) : "utf8" == h ? a = a.replace(/(( [A-Fa-f0-9]{2})+)/g, function (a, b) {
                        return x(b)
                    }) : "utf16" == h && (a = a.replace(/(( [A-Fa-f0-9]{1,6})+)/g, function (a, b) {
                        return v(b)
                    }));
                    return a
                }

                function x(h) {
                    var m = "", c = 0, f = 0;
                    h = h.replace(/^\s+/, "");
                    h = h.replace(/\s+$/, "");
                    if (0 == h.length)return "";
                    h = h.replace(/\s+/g, " ");
                    h = h.split(" ");
                    for (var k = 0; k < h.length; k++) {
                        var g = parseInt(h[k], 16);
                        switch (c) {
                            case 0:
                                0 <=
                                g && 127 >= g ? m += b(g) : 192 <= g && 223 >= g ? (c = 1, f = g & 31) : 224 <= g && 239 >= g ? (c = 2, f = g & 15) : 240 <= g && 247 >= g ? (c = 3, f = g & 7) : m += "convertUTF82Char: error1 " + a(g) + "! ";
                                break;
                            case 1:
                                if (128 > g || 191 < g)m += "convertUTF82Char: error2 " + a(g) + "! ";
                                c--;
                                m += b(f << 6 | g - 128);
                                f = 0;
                                break;
                            case 2:
                            case 3:
                                if (128 > g || 191 < g)m += "convertUTF82Char: error3 " + a(g) + "! ";
                                f = f << 6 | g - 128;
                                c--
                        }
                    }
                    return m.replace(/ $/, "")
                }

                function v(h) {
                    var m = 0, c = "";
                    h = h.replace(/^\s+/, "");
                    h = h.replace(/\s+$/, "");
                    if (0 == h.length)return null;
                    h = h.replace(/\s+/g, " ");
                    h = h.split(" ");
                    for (var f =
                        0; f < h.length; f++) {
                        var k = parseInt(h[f], 16);
                        if (0 > k || 65535 < k)c += "!Error in convertUTF162Char: unexpected value, b\x3d" + a(k) + "!";
                        if (0 != m)if (56320 <= k && 57343 >= k) {
                            c += b(65536 + (m - 55296 << 10) + (k - 56320));
                            m = 0;
                            continue
                        } else c += "Error in convertUTF162Char: low surrogate expected, b\x3d" + a(k) + "!", m = 0;
                        55296 <= k && 56319 >= k ? m = k : c += b(k)
                    }
                    return c
                }

                var B = "0123456789ABCDEF".split("");
                e.dec2hex4 = function (a) {
                    return B[a >> 12 & 15] + B[a >> 8 & 15] + B[a >> 4 & 15] + B[a & 15]
                };
                e.dec2hex = a;
                e.dec2char = b;
                e.dec2hex2 = f;
                e.convertUTF82Char = x;
                e.convertUTF162Char =
                    v;
                e.convertUnicode2Char = g;
                e.convertCharStr2pEsc = function (b) {
                    var h = "", m;
                    m = 0;
                    for (var c = "", k = 0; k < b.length; k++) {
                        var g = b.charCodeAt(k);
                        if (0 > g || 65535 < g)c += "Error in convertChar2CP: byte out of range " + a(g) + "!";
                        if (0 != m)if (56320 <= g && 57343 >= g) {
                            c += a(65536 + (m - 55296 << 10) + (g - 56320)) + " ";
                            m = 0;
                            continue
                        } else c += "Error in convertChar2CP: surrogate out of range " + a(m) + "!", m = 0;
                        55296 <= g && 56319 >= g ? m = g : c += a(g) + " "
                    }
                    m = c.substring(0, c.length - 1);
                    if (0 == b.length)return "";
                    b = m.split(" ");
                    for (m = 0; m < b.length; m++)c = parseInt(b[m],
                        16), h = 32 == c ? h + "%20" : 65 <= c && 90 >= c ? h + String.fromCharCode(c) : 97 <= c && 122 >= c ? h + String.fromCharCode(c) : 48 <= c && 57 >= c ? h + String.fromCharCode(c) : 45 == c || 46 == c || 95 == c || 126 == c ? h + String.fromCharCode(c) : 127 >= c ? h + ("%" + f(c)) : 2047 >= c ? h + ("%" + f(192 | c >> 6 & 31) + "%" + f(128 | c & 63)) : 65535 >= c ? h + ("%" + f(224 | c >> 12 & 15) + "%" + f(128 | c >> 6 & 63) + "%" + f(128 | c & 63)) : 1114111 >= c ? h + ("%" + f(240 | c >> 18 & 7) + "%" + f(128 | c >> 12 & 63) + "%" + f(128 | c >> 6 & 63) + "%" + f(128 | c & 63)) : h + ("!Error " + a(c) + "!");
                    return h
                };
                e.convertAllEscapes = function (a, b) {
                    a = g(a);
                    a = c(a);
                    a = k(a);
                    a =
                        r(a);
                    a = q(a);
                    a = h(a, !1);
                    a = m(a, !1);
                    a = t(a);
                    a = w(a);
                    return a = u(a, b)
                };
                var y = "0123456789abcdef".split("");
                e.to_hex = function (a) {
                    for (var b = "", h = !0, c = 32; 0 < c;) {
                        var c = c - 4, m = a >> c & 15;
                        h && 0 == m || (h = !1, b += y[m])
                    }
                    return "0x" + ("" == b ? "0" : b)
                };
                e.replaceHex = function (a) {
                    return n.isString(a) ? a.replace(/x([0-9A-Fa-f]{2})/gmi, function (a, b) {
                        return String.fromCharCode(parseInt(b, 16))
                    }) : a
                };
                var E = function (a, b) {
                    for (a = a.toString(16).toUpperCase(); a.length < b;)a = "0" + a;
                    return a
                };
                e.stringToHex = function (a) {
                    for (var b = "", h = 0, c = a.length, m; h <
                    c; h += 1)m = a.charCodeAt(h), b += E(m.toString(16), 2) + " ";
                    return b
                };
                e.stringToBufferStr = function (a) {
                    for (var b = 0, h = a.length, c, m = []; b < h; b += 1)c = a.charCodeAt(b), m.push(c);
                    return m.join(",")
                };
                e.stringToBuffer = function (a) {
                    for (var b = 0, h = a.length, c, m = []; b < h; b += 1)c = a.charCodeAt(b), m.push(c);
                    return m
                };
                e.bufferToHexString = function (a) {
                    a = -1 !== a.indexOf(",") ? a.split(",") : [a];
                    for (var b = [], h = 0; h < a.length; h++)b.push(e.dec2hex2(a[h]));
                    return b.join(" ")
                };
                e.bufferFromDecString = function (a) {
                    a = -1 !== a.indexOf(",") ? a.split(",") :
                        [a];
                    for (var b = 0; b < a.length; b++)a[b] = parseInt(a[b], 10);
                    return a
                };
                e.stringFromDecString = function (a) {
                    a = e.bufferFromDecString(a);
                    for (var b = "", h = 0; h < a.length; h++)b += String.fromCharCode(a[h], 16);
                    return b
                };
                e.stringToHex2 = function (a) {
                    for (var b = "", h = 0, c = a.length, m; h < c; h += 1)m = a.charCodeAt(h), b += E(m.toString(16), 2) + " ";
                    return b
                };
                e.hexToString = function (a) {
                    a = a.split(" ");
                    for (var b = "", h = 0, c = a.length, m; h < c; h += 1)m = String.fromCharCode(parseInt(a[h], 16)), b += m;
                    return b
                };
                e.prettyHex = function (a) {
                    var b = Math.ceil(a.length /
                        16), h = a.length % 16 || 16, c = a.length.toString(16).length;
                    6 > c && (c = 6);
                    for (var m = "Offset"; m.length < c;)m += " ";
                    var m = "\u001b[36m" + m + "  ", f;
                    for (f = 0; 16 > f; f++)m += " " + E(f, 2);
                    m += "\u001b[0m\n";
                    a.length && (m += "\n");
                    var k = 0, g, d;
                    for (f = 0; f < b; f++) {
                        m += "\u001b[36m" + E(k, c) + "\u001b[0m  ";
                        g = f === b - 1 ? h : 16;
                        d = 16 - g;
                        var t;
                        for (t = 0; t < g; t++)m += " " + E(a[k], 2), k++;
                        for (t = 0; t < d; t++)m += "   ";
                        k -= g;
                        m += "   ";
                        for (t = 0; t < g; t++)d = a[k], m += 31 < d && 127 > d || 159 < d ? String.fromCharCode(d) : ".", k++;
                        m += "\n"
                    }
                    return m
                };
                e.hexEncode = function (a, b) {
                    var h, c, m = "";
                    for (c = 0; c < a.length; c++)h = a.charCodeAt(c).toString(16), m += ((null !== b ? b : "000") + h).slice(-4);
                    return m
                };
                e.markHex = function (a, b, h, c) {
                    b = b || "";
                    h = h || "";
                    var m = "" + a;
                    a = /[^\x20-\x7E]/gim;
                    a.exec(m);
                    m.match(a);
                    m.replace(a, function (a, c) {
                        var f = e.hexEncode(a, "$");
                        2 == f.length && (f = f.replace("$", "$0"));
                        f = f.toUpperCase();
                        m = m.replace(a, b + f + h)
                    });
                    return m
                };
                return e
            })
        }, "nxapp/utils/_console": function () {
            define(["dojo/has!host-node?dojo/node!tracer", "dojo/has!host-node?dojo/node!util", "nxapp/utils"], function (e, p, l) {
                var n = n;
                e && (n = e.colorConsole({
                    format: "\x3c{{title}}\x3e {{message}} (in {{file}}:{{line}})",
                    dateformat: "HH:MM:ss.L"
                }));
                "undefined" == typeof logError && (global.logError = function (d, b) {
                    n.error("Error " + b, d)
                });
                l.stack = function () {
                    n.log(Error().stack)
                };
                n.clear = function () {
                    p.print("\u001b[2J\u001b[0;0H")
                };
                return n
            })
        }, "nxapp/server/DeviceServer": function () {
            define("dcl/dcl dojo/_base/lang xide/types xide/factory nxapp/server/WebSocket dojo/node!http dojo/node!sockjs dojo/node!path dojo/node!fs-jetpack nxapp/utils/_console xide/utils nxapp/model/Connection".split(" "),
                function (e, p, l, n, d, b, a, f, c, g, r, q) {
                    var k = !1;
                    return e([d], {
                        mqttManager: null, declaredClass: "nxapp.server.DeviceServer", protocolMethod: function (a, b) {
                            var c = this.ctx.getConnectionManager().protocolMethod(a.protocol, a.method, a.options);
                            if (c && c.then) {
                                var f = this;
                                c.then(function (c) {
                                    f.sendClientMessage(b, null, l.SOCKET_SERVER_COMMANDS.PROTOCOL_METHOD, {
                                        options: a.options,
                                        result: c
                                    })
                                })
                            } else g.error("calling protocol method failed! method returned nothing", c)
                        }, handleManagerCommand: function (a, b) {
                            switch (a.manager_command) {
                                case l.SOCKET_SERVER_COMMANDS.MANAGER_TEST:
                                    g.dir("Test Manager command");
                                    break;
                                case l.SOCKET_SERVER_COMMANDS.PROTOCOL_METHOD:
                                    return this.protocolMethod(a, b);
                                case l.SOCKET_SERVER_COMMANDS.RUN_SHELL:
                                    return this.ctx.getDeviceManager().runShell(a.cmd, a.args, a.options);
                                case l.SOCKET_SERVER_COMMANDS.RUN_FILE:
                                    return this.ctx.runFile(a);
                                case l.SOCKET_SERVER_COMMANDS.INIT_DEVICES:
                                    return this.ctx.loadDevices(a);
                                case l.SOCKET_SERVER_COMMANDS.RUN_CLASS:
                                    return this.ctx.runClass(a);
                                case l.SOCKET_SERVER_COMMANDS.WATCH:
                                    var c = this.ctx.getFileManager();
                                    c && c.watch(a.path, a.watch);
                                    break;
                                case l.SOCKET_SERVER_COMMANDS.MQTT_PUBLISH:
                                    return this.sendMQTTMessage(a, b);
                                case l.SOCKET_SERVER_COMMANDS.MANAGER_START_DRIVER:
                                    return this.startDriver(a, b);
                                case l.SOCKET_SERVER_COMMANDS.CREATE_CONNECTION:
                                    return this.createConnection(a, b);
                                case l.SOCKET_SERVER_COMMANDS.START_DEVICE:
                                    return this.startDevice(a, b);
                                case l.SOCKET_SERVER_COMMANDS.GET_DEVICE_VARIABLES:
                                    return this.getVariables(a, b);
                                case l.SOCKET_SERVER_COMMANDS.WRITE_LOG_MESSAGE:
                                    this.logClientMessage(a);
                                    break;
                                case l.SOCKET_SERVER_COMMANDS.MANAGER_STOP_DRIVER:
                                    this.stopDriver(a);
                                    break;
                                case l.SOCKET_SERVER_COMMANDS.MANAGER_STATUS:
                                    a = {
                                        message: "returning status",
                                        deviceConnections: this.options.context.getConnectionManager().getNumberOfConnections()
                                    };
                                    this.emit(l.SOCKET_SERVER_COMMANDS.SIGNAL_RESPONSE, JSON.stringify(a));
                                    break;
                                case l.SOCKET_SERVER_COMMANDS.MANAGER_CLOSE_ALL:
                                    this.options.context.getConnectionManager().closeAll()
                            }
                        }, handleDeviceCommand: function (a, b) {
                            var c = a.device_command, f = this.options.context, d = this;
                            k = !1;
                            var q = a.options, e = null;
                            b || k && g.error("---have no client ");
                            q.host && q.protocol ? e = f.getConnectionManager().connect(q.host, q.protocol, q.port || "", null, q, b) : g.error("handle device command: invalid args. data.options is not xide/types/DeviceInfo", r.inspect(a));
                            try {
                                e && (e.options = q, f.getConnectionManager().registerFeedBack2(e, function (b, h) {
                                    if (_.isString(h))a.lastResponse = "" + h; else if (_.isObject(h))try {
                                        a.lastResponse = JSON.stringify(h)
                                    } catch (c) {
                                        k && g.error("error serializing data")
                                    }
                                    d.onDeviceMessage(b, h)
                                }))
                            } catch (n) {
                                g.error("-register feed back function failed", n),
                                    g.trace(n)
                            }
                            try {
                                switch (c) {
                                    case l.SOCKET_SERVER_COMMANDS.CALL_METHOD:
                                        this.options.context.getConnectionManager().callMethod(e, a, b);
                                        break;
                                    case l.SOCKET_SERVER_COMMANDS.DEVICE_SEND:
                                        this.options.context.getConnectionManager().send(e, a.command, a.options)
                                }
                            } catch (p) {
                                g.error("error command parser " + c, p.stack)
                            }
                        }, sendMQTTMessage: function (a, b) {
                            var c = a.data.device;
                            a.data.sourceHost = b.remoteAddress;
                            a.data.sourcePort = b.remotePort;
                            if (c) {
                                if ((c = this.ctx.getConnectionManager().getConnection2(c)) && c.variables) {
                                    var f =
                                        a.topic.split("/");
                                    if (4 == f.length && "Variable" == f[2]) {
                                        f = f[3];
                                        if (!f)return;
                                        for (var k = 0; k < c.variables.length; k++) {
                                            var d = c.variables[k];
                                            d.name === f && (d.value = a.data.value)
                                        }
                                    }
                                }
                            } else g.error("cant find device");
                            this.mqttManager && this.mqttManager.publishTopic(a.topic, a.data)
                        }, updateDeviceState: function (a, b) {
                            this.mqttManager && this.mqttManager.publishTopic(a, b)
                        }, sendClientMessage: function (a, b, c, f) {
                            b = {data: r.mixin({device: b}, f), event: c};
                            a.write(JSON.stringify(b))
                        }, getVariables: function (a, b) {
                            var c = a.device, f =
                                this.ctx.getConnectionManager().getConnection2(c), k = [];
                            if (f) {
                                f.options = c;
                                var d = f.variables;
                                d ? (k = d, this.sendClientMessage(b, c, l.EVENTS.SET_DEVICE_VARIABLES, {variables: d})) : (k = f.variables = a.variables, _.each(k, function (a) {
                                    a.value = a.initial
                                }), this.sendClientMessage(b, c, l.EVENTS.SET_DEVICE_VARIABLES, {variables: a.variables}))
                            } else g.error("cant find device connection");
                            if ((f = b.mqtt) && !f.didSubscribe)for (d = 0; d < k.length; d++)f.subscribe(c.host + "/" + c.port + "/Variable/" + k[d].name)
                        }, logClientMessage: function (a) {
                            var b =
                                a.data.device;
                            a.data.device ? this.logEx(a.message, a.level, a.type, {
                                device: b,
                                deviceMessage: "",
                                time: a.time
                            }) : g.error("wrong log parameters, host missing", a)
                        }, getLogger: function (a) {
                            var b = this.ctx.getLogManager(), k = b.options, g = r.replaceAll("/", "_", a.host) + "_" + a.port + "_" + a.protocol + ".json", d = b.loggers[g], k = (a = a[a.deviceScope]) ? c.dir(a + f.sep + "logs").path() : k.fileLogger.dirname;
                            d || (d = b.createLogger({
                                filename: g,
                                dirname: k,
                                json: !0,
                                console: null
                            }), b.loggers[g] = d);
                            return d
                        }, logEx: function (a, b, c, f) {
                            var k = this.getLogger(f.device);
                            b = b || "info";
                            f = f || {};
                            f.type = c || "Unknown";
                            f.time = f.time || (new Date).getTime();
                            k.log(b, a, f)
                        }, stopDriver: function (a) {
                            var b = this.ctx.getConnectionManager(), c = this.ctx.getDeviceManager(), f = b.getConnection2(a);
                            f && (f.options = a, f.client.close());
                            b.removeConnection(f, null, !0);
                            !f && k && g.log("have no such connection " + q.generateId(a));
                            c.stopDevice(a.id)
                        }, sendClientEvent: function (a) {
                        }, startDriver: function (a, b) {
                            var c = this.ctx.getConnectionManager(), f = this.ctx.getDeviceManager(), d = c.getConnection2(a), r = a.driverOptions &
                                1 << l.DRIVER_FLAGS.RUNS_ON_SERVER, e = a.driverOptions & 1 << l.DRIVER_FLAGS.SERVER;
                            k && g.log("start driver " + a.host + " : " + a.port + "@" + a.protocol + " server side \x3d " + r + " device Scope " + a.deviceScope + " is server \x3d " + e + " found connection:" + (d ? "true" : "false") + " external client " + b.isExternal());
                            if (r && r && !d)if (f && f.startDevice || g.error("!deviceManager || !startDevice"), r = f.getItemById(a.id)) {
                                if (e = f.toDeviceControlInfo(r))return f.startDevice(r, !0), !0;
                                e && k && g.log("driver runs server side, start device! " + e.toString())
                            } else {
                                g.warn("DeviceServer::startDriver : cant find device");
                                return
                            }
                            if (!d)return k && g.log("start driver: connection doesnt exists " + a.host + " : " + a.port + "@" + a.protocol + " : " + a.deviceScope + " id : " + q.generateId(a)), a[a.driverScope] ? c.connect(a.host, a.protocol, a.port, a.mqtt, a, b) : (g.error("have no driver scope"), null);
                            d.options = a;
                            c.onConnect2(d, !0, !0);
                            if (!a.deviceScope)throw g.error("has no device scope", a), Error("has no device scope", a);
                            return "xxxx"
                        }, startDevice: function (a, b) {
                            var c = this.ctx.getDeviceManager(), f = this.ctx.getConnectionManager(), d = a.driverOptions &
                                1 << l.DRIVER_FLAGS.RUNS_ON_SERVER, r = a.driverOptions & 1 << l.DRIVER_FLAGS.SERVER;
                            k && g.log("start device " + a.host + " : " + a.port + "@" + a.protocol + " server side \x3d " + d + " device Scope " + a.deviceScope + " is server \x3d " + r + " external client " + b.isExternal());
                            if (d = c.getItemById(a.id)) {
                                c.updateDevice(a, d);
                                if (r = c.toDeviceControlInfo(d))return c.startDevice(d, null, b).then(function () {
                                    var b = f.getConnection2(a);
                                    if (b)f.onConnect2(b, !0, !0); else g.error("DeviceServer::startDevice : cant find connection")
                                }), !0;
                                r && k && g.log("driver runs server side, start device! " +
                                    r.toString())
                            } else g.warn("Cant find device")
                        }, createConnection: function (a, b) {
                            var c = this.ctx.getConnectionManager(), f = c.getConnection2(a), d = a.driverOptions & 1 << l.DRIVER_FLAGS.RUNS_ON_SERVER, r = a.driverOptions & 1 << l.DRIVER_FLAGS.SERVER;
                            k && g.log("createConnection " + a.host + " : " + a.port + "@" + a.protocol + " server side \x3d " + d + " device Scope " + a.deviceScope + " is server \x3d " + r + " found connection:" + (f ? "true" : "false") + " | is external client:" + b.isExternal());
                            if (!f)return k && g.log("createConnection: connection doesnt exists " +
                                a.host + " : " + a.port + "@" + a.protocol + " : " + a.deviceScope + " id : " + q.generateId(a)), a[a.driverScope] ? c.connect(a.host, a.protocol, a.port, a.mqtt, a, b) : (g.error("have no driver scope"), null);
                            f.options = a;
                            c.onConnect2(f, !0, !0);
                            if (!a.deviceScope)throw g.error("has no device scope", a), Error("has no device scope", a);
                            return f
                        }, onFileChanged: function (a) {
                            this.broadCastMessage(l.EVENTS.ON_FILE_CHANGED, {path: a.path, event: a.event})
                        }, onDeviceMessage: function (a, b, c) {
                            if (a)if (null === b)k && g.error("---onDeviceMessage:have no data " +
                                a.options.id + " server id \x3d " + q.generateId(a.options)); else {
                                c = {device: a.options, deviceMessage: b, bytes: c && c.join ? c.join(",") : ""};
                                var f = b.event || l.EVENTS.ON_DEVICE_MESSAGE;
                                if (a && a.isRunAsServer() && f === l.EVENTS.ON_DEVICE_MESSAGE)this.ctx.getDeviceManager().onDeviceServerMessage({
                                    event: l.EVENTS.ON_DEVICE_MESSAGE,
                                    data: {data: c}
                                }); else this.broadCastMessage(b.event || l.EVENTS.ON_DEVICE_MESSAGE, c)
                            } else g.error("---onDeviceMessage:have no connection object")
                        }, onLogMessage: function (a) {
                            this.broadCastMessage(l.EVENTS.ON_SERVER_LOG_MESSAGE,
                                a)
                        }, onClientDisconnect: function (a) {
                            a.mqtt && (a.mqtt.end(), delete a.mqtt)
                        }, onClientConnection: function (a) {
                            if (this.mqttManager) {
                                var b = this;
                                if (!a)k && g.error("DeviceServer::onClientConnection connection null"); else if (!a.mqtt) {
                                    var c = this.mqttManager.createMQTTClient(a.remoteAddress, a.remotePort);
                                    c.client = a;
                                    a.mqtt = c;
                                    c.on("message", function (c, f) {
                                        f.sourceHost !== a.remoteAddress && f.sourcePort !== a.remotePort && b.sendClientMessage(a, {}, l.EVENTS.ON_MQTT_MESSAGE, {
                                            topic: c, message: f.toString(), host: a.remoteAddress,
                                            port: a.remotePort
                                        })
                                    })
                                }
                            }
                        }, start: function (c, h) {
                            this.profile = h;
                            this.options = p.mixin(this.options, c);
                            this.clients = [];
                            var f = this, d = this.options.port, r = this.options.host;
                            this.subscribe(l.EVENTS.ON_SERVER_LOG_MESSAGE, this.onLogMessage, this);
                            if (d) {
                                this.initLogger(h.debug);
                                this.log("Socket server running in " + d, "socket_server");
                                var q = {heartbeat_delay: 1E3};
                                k || (q.log = function () {
                                });
                                var q = a.createServer(q), e = b.createServer(this._handler);
                                q.installHandlers(e);
                                e.listen(d, r);
                                this._handleSocketEmits(q);
                                this.publish(l.EVENTS.ON_WEBSOCKET_START,
                                    {socket_server: {port: d, socket_handler: q}}, this);
                                q.on("connection", function (a) {
                                    var b = f.clients.push(a);
                                    k && g.log("on device server client connection " + b);
                                    f.onClientConnection(a);
                                    a.isExternal = function () {
                                        return !0
                                    };
                                    a.on("close", function () {
                                        k && g.info("close client connection " + b);
                                        f.onClientDisconnect(a);
                                        f.clients.remove(a)
                                    })
                                });
                                return !0
                            }
                            g.error("Port must be provided into options");
                            return !1
                        }, _handleSocketEmits: function (a) {
                            var b = this.options.port, c = this;
                            a.on("connection", function (a) {
                                c.socket = a;
                                n.publish(l.EVENTS.ON_WEBSOCKET_CONNECTION,
                                    {connection: {port: b, socket_handler: a}}, this);
                                a.on("data", function (b) {
                                    _.isString(b) && (b = r.fromJson(b));
                                    b.manager_command ? c.handleManagerCommand(b, a) : c.handleDeviceCommand(b, a)
                                })
                            })
                        }
                    })
                })
        }, "nxapp/model/Connection": function () {
            define("dcl/dcl xide/model/Base xide/mixins/EventedMixin xide/encoding/MD5 xide/utils xide/types".split(" "), function (e, p, l, n, d, b) {
                function a(a, c) {
                    var g = a[a.deviceScope], r = a[a.driverScope];
                    if (!g && c) {
                        var q = c.ctx.getDeviceManager();
                        if (q) {
                            var k = q.getDeviceById(a.id);
                            k && (r = q.toDeviceControlInfo(k),
                                g = r[r.deviceScope], r = r[r.driverScope])
                        }
                    }
                    g = d.replaceAll("/", "", g + r);
                    g = d.replaceAll("\\", "", g);
                    return n(JSON.stringify({
                        protocol: a.protocol,
                        port: a.port,
                        host: a.host,
                        hash: g,
                        isServer: a.driverOptions & 1 << b.DRIVER_FLAGS.SERVER,
                        runAsServer: a.driverOptions & 1 << b.DRIVER_FLAGS.RUNS_ON_SERVER
                    }), 1)
                }

                e = e([l.dcl], {
                    connected: !1,
                    __registered: !1,
                    declaredClass: "nxapp/model/Connection",
                    client: null,
                    options: null,
                    socket: null,
                    id: null,
                    toString: function () {
                        var a = this.options;
                        return a.deviceScope + "://" + a.host + ":" + a.port + "@" + a.protocol +
                            "@" + (this.isServer() ? "server" : "")
                    },
                    constructor: function (b, c) {
                        this.client = b;
                        this.options = c;
                        d.mixin(this, {protocol: c.protocol, port: c.port, host: c.host});
                        this.id = a(c);
                        b.connection = this
                    },
                    isServer: function () {
                        return this.options.driverOptions & 1 << b.DRIVER_FLAGS.SERVER
                    },
                    isRunAsServer: function () {
                        return this.options.driverOptions & 1 << b.DRIVER_FLAGS.RUNS_ON_SERVER
                    }
                });
                e.generateId = a;
                e.generateHash = function (a) {
                    var c = d.replaceAll("/", "", a[a.deviceScope] + a[a.driverScope]), c = d.replaceAll("\\", "", c);
                    return {
                        protocol: a.protocol,
                        port: a.port,
                        host: a.host,
                        hash: c,
                        isServer: a.driverOptions & 1 << b.DRIVER_FLAGS.SERVER,
                        runAsServer: a.driverOptions & 1 << b.DRIVER_FLAGS.RUNS_ON_SERVER
                    }
                };
                return e
            })
        }, "xide/encoding/MD5": function () {
            define(["./_base"], function (e) {
                function p(a, b) {
                    return a << b | a >>> 32 - b
                }

                function l(a, b, g, d, q, k) {
                    return e.addWords(p(e.addWords(e.addWords(b, a), e.addWords(d, k)), q), g)
                }

                function n(a, b, g, d, q, k, m) {
                    return l(b & g | ~b & d, a, b, q, k, m)
                }

                function d(a, b, g, d, q, k, m) {
                    return l(b & d | g & ~d, a, b, q, k, m)
                }

                function b(a, b, g, d, q, k, m) {
                    return l(g ^ (b | ~d),
                        a, b, q, k, m)
                }

                function a(a, c) {
                    a[c >> 5] |= 128 << c % 32;
                    a[(c + 64 >>> 9 << 4) + 14] = c;
                    for (var g = 1732584193, r = -271733879, q = -1732584194, k = 271733878, m = 0; m < a.length; m += 16)var h = g, t = r, w = q, u = k, g = n(g, r, q, k, a[m + 0], 7, -680876936), k = n(k, g, r, q, a[m + 1], 12, -389564586), q = n(q, k, g, r, a[m + 2], 17, 606105819), r = n(r, q, k, g, a[m + 3], 22, -1044525330), g = n(g, r, q, k, a[m + 4], 7, -176418897), k = n(k, g, r, q, a[m + 5], 12, 1200080426), q = n(q, k, g, r, a[m + 6], 17, -1473231341), r = n(r, q, k, g, a[m + 7], 22, -45705983), g = n(g, r, q, k, a[m + 8], 7, 1770035416), k = n(k, g, r, q, a[m + 9], 12, -1958414417),
                        q = n(q, k, g, r, a[m + 10], 17, -42063), r = n(r, q, k, g, a[m + 11], 22, -1990404162), g = n(g, r, q, k, a[m + 12], 7, 1804603682), k = n(k, g, r, q, a[m + 13], 12, -40341101), q = n(q, k, g, r, a[m + 14], 17, -1502002290), r = n(r, q, k, g, a[m + 15], 22, 1236535329), g = d(g, r, q, k, a[m + 1], 5, -165796510), k = d(k, g, r, q, a[m + 6], 9, -1069501632), q = d(q, k, g, r, a[m + 11], 14, 643717713), r = d(r, q, k, g, a[m + 0], 20, -373897302), g = d(g, r, q, k, a[m + 5], 5, -701558691), k = d(k, g, r, q, a[m + 10], 9, 38016083), q = d(q, k, g, r, a[m + 15], 14, -660478335), r = d(r, q, k, g, a[m + 4], 20, -405537848), g = d(g, r, q, k, a[m + 9], 5, 568446438),
                        k = d(k, g, r, q, a[m + 14], 9, -1019803690), q = d(q, k, g, r, a[m + 3], 14, -187363961), r = d(r, q, k, g, a[m + 8], 20, 1163531501), g = d(g, r, q, k, a[m + 13], 5, -1444681467), k = d(k, g, r, q, a[m + 2], 9, -51403784), q = d(q, k, g, r, a[m + 7], 14, 1735328473), r = d(r, q, k, g, a[m + 12], 20, -1926607734), g = l(r ^ q ^ k, g, r, a[m + 5], 4, -378558), k = l(g ^ r ^ q, k, g, a[m + 8], 11, -2022574463), q = l(k ^ g ^ r, q, k, a[m + 11], 16, 1839030562), r = l(q ^ k ^ g, r, q, a[m + 14], 23, -35309556), g = l(r ^ q ^ k, g, r, a[m + 1], 4, -1530992060), k = l(g ^ r ^ q, k, g, a[m + 4], 11, 1272893353), q = l(k ^ g ^ r, q, k, a[m + 7], 16, -155497632), r = l(q ^ k ^ g, r,
                            q, a[m + 10], 23, -1094730640), g = l(r ^ q ^ k, g, r, a[m + 13], 4, 681279174), k = l(g ^ r ^ q, k, g, a[m + 0], 11, -358537222), q = l(k ^ g ^ r, q, k, a[m + 3], 16, -722521979), r = l(q ^ k ^ g, r, q, a[m + 6], 23, 76029189), g = l(r ^ q ^ k, g, r, a[m + 9], 4, -640364487), k = l(g ^ r ^ q, k, g, a[m + 12], 11, -421815835), q = l(k ^ g ^ r, q, k, a[m + 15], 16, 530742520), r = l(q ^ k ^ g, r, q, a[m + 2], 23, -995338651), g = b(g, r, q, k, a[m + 0], 6, -198630844), k = b(k, g, r, q, a[m + 7], 10, 1126891415), q = b(q, k, g, r, a[m + 14], 15, -1416354905), r = b(r, q, k, g, a[m + 5], 21, -57434055), g = b(g, r, q, k, a[m + 12], 6, 1700485571), k = b(k, g, r, q, a[m + 3], 10,
                            -1894986606), q = b(q, k, g, r, a[m + 10], 15, -1051523), r = b(r, q, k, g, a[m + 1], 21, -2054922799), g = b(g, r, q, k, a[m + 8], 6, 1873313359), k = b(k, g, r, q, a[m + 15], 10, -30611744), q = b(q, k, g, r, a[m + 6], 15, -1560198380), r = b(r, q, k, g, a[m + 13], 21, 1309151649), g = b(g, r, q, k, a[m + 4], 6, -145523070), k = b(k, g, r, q, a[m + 11], 10, -1120210379), q = b(q, k, g, r, a[m + 2], 15, 718787259), r = b(r, q, k, g, a[m + 9], 21, -343485551), g = e.addWords(g, h), r = e.addWords(r, t), q = e.addWords(q, w), k = e.addWords(k, u);
                    return [g, r, q, k]
                }

                e.MD5 = function (b, c) {
                    var g = c || e.outputTypes.Base64, d = a(e.stringToWord(b),
                        8 * b.length);
                    switch (g) {
                        case e.outputTypes.Raw:
                            return d;
                        case e.outputTypes.Hex:
                            return e.wordToHex(d);
                        case e.outputTypes.String:
                            return e.wordToString(d);
                        default:
                            return e.wordToBase64(d)
                    }
                };
                e.MD5._hmac = function (b, c, g) {
                    g = g || e.outputTypes.Base64;
                    var d = e.stringToWord(c);
                    16 < d.length && (d = a(d, 8 * c.length));
                    var q = [];
                    c = [];
                    for (var k = 0; 16 > k; k++)q[k] = d[k] ^ 909522486, c[k] = d[k] ^ 1549556828;
                    b = a(q.concat(e.stringToWord(b)), 512 + 8 * b.length);
                    b = a(c.concat(b), 640);
                    switch (g) {
                        case e.outputTypes.Raw:
                            return b;
                        case e.outputTypes.Hex:
                            return e.wordToHex(b);
                        case e.outputTypes.String:
                            return e.wordToString(b);
                        default:
                            return e.wordToBase64(b)
                    }
                };
                return e.MD5
            })
        }, "xide/encoding/_base": function () {
            define(["dojo/_base/lang"], function (e) {
                return {
                    outputTypes: {Base64: 0, Hex: 1, String: 2, Raw: 3}, addWords: function (e, l) {
                        var n = (e & 65535) + (l & 65535);
                        return (e >> 16) + (l >> 16) + (n >> 16) << 16 | n & 65535
                    }, stringToWord: function (e) {
                        for (var l = [], n = 0, d = 8 * e.length; n < d; n += 8)l[n >> 5] |= (e.charCodeAt(n / 8) & 255) << n % 32;
                        return l
                    }, wordToString: function (e) {
                        for (var l = [], n = 0, d = 32 * e.length; n < d; n += 8)l.push(String.fromCharCode(e[n >>
                            5] >>> n % 32 & 255));
                        return l.join("")
                    }, wordToHex: function (e) {
                        for (var l = [], n = 0, d = 4 * e.length; n < d; n++)l.push("0123456789abcdef".charAt(e[n >> 2] >> n % 4 * 8 + 4 & 15) + "0123456789abcdef".charAt(e[n >> 2] >> n % 4 * 8 & 15));
                        return l.join("")
                    }, wordToBase64: function (e) {
                        for (var l = [], n = 0, d = 4 * e.length; n < d; n += 3)for (var b = (e[n >> 2] >> n % 4 * 8 & 255) << 16 | (e[n + 1 >> 2] >> (n + 1) % 4 * 8 & 255) << 8 | e[n + 2 >> 2] >> (n + 2) % 4 * 8 & 255, a = 0; 4 > a; a++)8 * n + 6 * a > 32 * e.length ? l.push("\x3d") : l.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(b >> 6 *
                            (3 - a) & 63));
                        return l.join("")
                    }, stringToUtf8: function (e) {
                        for (var l = "", n = -1, d, b; ++n < e.length;)d = e.charCodeAt(n), b = n + 1 < e.length ? e.charCodeAt(n + 1) : 0, 55296 <= d && 56319 >= d && 56320 <= b && 57343 >= b && (d = 65536 + ((d & 1023) << 10) + (b & 1023), n++), 127 >= d ? l += String.fromCharCode(d) : 2047 >= d ? l += String.fromCharCode(192 | d >>> 6 & 31, 128 | d & 63) : 65535 >= d ? l += String.fromCharCode(224 | d >>> 12 & 15, 128 | d >>> 6 & 63, 128 | d & 63) : 2097151 >= d && (l += String.fromCharCode(240 | d >>> 18 & 7, 128 | d >>> 12 & 63, 128 | d >>> 6 & 63, 128 | d & 63));
                        return l
                    }
                }
            })
        }, "nxapp/server/FileServer": function () {
            define("dojo/_base/declare dojo/_base/lang xide/types xide/factory nxapp/server/WebSocket nxapp/utils/_LogMixin dojo/node!http dojo/node!sockjs".split(" "),
                function (e, p, l, n, d, b, a, f) {
                    return e("nxapp.server.WebSocket", [d, b], {
                        onFileChanged: function (a) {
                            this.broadCastMessage(l.EVENTS.ON_FILE_CHANGED, {
                                path: a.path,
                                modulePath: a.modulePath,
                                mask: a.mask,
                                type: a.type
                            })
                        }, start: function (b, g) {
                            this.profile = g;
                            this.options = p.mixin(this.options, b);
                            this.clients = [];
                            var d = this;
                            n.subscribe(l.EVENTS.ON_FILE_CHANGED, this.onFileChanged, this);
                            var q = this.options.port, k = this.options.host;
                            if (q) {
                                this.initLogger(g.debug);
                                this.log("File Socket server running in " + q, "socket_server");
                                var m = {};
                                this.showDebugMsg("socket_server") || (m.log = function () {
                                });
                                var m = f.createServer(m), h = a.createServer(this._handler);
                                m.installHandlers(h);
                                h.listen(q, k);
                                this._handleSocketEmits(m);
                                n.publish(l.EVENTS.ON_WEBSOCKET_START, {
                                    socket_server: {
                                        port: q,
                                        socket_handler: m
                                    }
                                }, this);
                                m.on("connection", function (a) {
                                    var b = d.clients.push(a);
                                    a.on("close", function () {
                                        delete d.clients[b]
                                    })
                                });
                                return !0
                            }
                            console.error("Port must be provided into options");
                            return !1
                        }, _handleSocketEmits: function (a) {
                            var b = this.options.port, f = this;
                            a.on("connection", function (a) {
                                f.socket = a;
                                n.publish(l.EVENTS.ON_WEBSOCKET_CONNECTION, {
                                    connection: {
                                        port: b,
                                        socket_handler: a
                                    }
                                }, this);
                                a.on("close", function () {
                                })
                            })
                        }
                    })
                })
        }, "nxappmain/nxAppBase": function () {
            define("dcl/dcl nxapp/utils/FileUtils dojo/node!commander dojo/node!fs dojo/node!os dojo/node!path dojo/node!util xide/factory/Events dojo/has xide/model/Base xide/utils".split(" "), function (e, p, l, n, d, b, a, f, c, g, r) {
                c.add("windows", function () {
                    return "win32" === d.platform()
                });
                c.add("osx", function () {
                    return "darwin" ===
                        d.platform()
                });
                c.add("linux", function () {
                    return "linux" === d.platform()
                });
                c.add("arm", function () {
                    return "arm" === d.arch()
                });
                return e(g.dcl, {
                    declaredClass: "nxappmain.nxAppBase",
                    profile: null,
                    commander: null,
                    profilePath: "/nxappmain/profile_device_server.json",
                    getDefaultProfilePath: function () {
                        return process.cwd() + this.profilePath
                    },
                    getProfile: function (a) {
                        var b = {};
                        a || (a = this.commander.profile && 0 < this.commander.profile.length ? this.commander.profile : this.getDefaultProfilePath());
                        n.existsSync(a) || (a = process.cwd() +
                            this.profilePath);
                        var c = p.readFile(a);
                        c ? b = dojo.fromJson(c) : console.error("have no profile at : " + a);
                        if (c = (c = this.commander.system) ? p.resolve(c) : null)b.data = c, b.watchr.paths = [c + a.sep + "system", c + a.sep + "workspace"];
                        return b
                    },
                    init: function () {
                        this.commander || (l.version("0.0.1").option("-i, --info", "return service profile").option("-f, --file \x3cpath\x3e", "run a file").option("-u, --user \x3cpath\x3e", "user directory").option("--diagnose \x3cboolean\x3e", "do some diagnose").option("--modules", "list all modules").option("--start \x3cboolean\x3e",
                            "start devices").option("--serverSide \x3cboolean\x3e", "make devices server side").option("-s, --system \x3cname\x3e", "path to system scope").option("-j, --jhelp", "output options as json").option("-t, --test", "enable test mode").option("--mqtt \x3cboolean\x3e", "enable or disable MQTT functionality"), this.commander = l, this.commander.allowUnknownOption(!0), this.commander.parse(process.argv));
                        if (l.jhelp) {
                            var a = [];
                            l.options.map(function (b) {
                                a.push(b)
                            });
                            console.log(JSON.stringify(a));
                            process.exit()
                        }
                        this.profile =
                            this.getProfile(this.profilePath);
                        r.mixin(this.profile, this.commander);
                        var c = b.resolve(this.profile.system);
                        n.existsSync(c) || (c = process.cwd() + "/data/system", this.profile.system = c, l.system = c);
                        this.profile.user && (c = b.resolve(this.profile.user), n.existsSync(c) && (this.profile.user = c));
                        this.commander.start && (this.profile.start = "true" === this.commander.start);
                        this.commander.serverSide && (this.profile.serverSide = "true" === this.commander.serverSide)
                    }
                })
            })
        }, "xide/factory/Events": function () {
            define(["xide/factory",
                "dojo/_base/connect", "dojo/_base/lang", "dojo/on", "dojo/has"], function (e, p, l, n, d) {
                var b = {
                    click: null,
                    dblclick: null,
                    mousedown: null,
                    mouseup: null,
                    mouseover: null,
                    mousemove: null,
                    mouseout: null,
                    keypress: null,
                    keydown: null,
                    keyup: null,
                    focus: null,
                    blur: null,
                    change: null
                };
                e.publish = function (a, b, c, g) {
                    b = b ? _.isString(b) ? {message: b} : b : {};
                    c = a;
                    var d = p.publish, q = [];
                    _.isArray(a) || (c = [a]);
                    a = 0;
                    for (var k = c.length; a < k; a++) {
                        var m = c[a];
                        if (!g || g(m))q = d(m, b)
                    }
                    return q
                };
                e.subscribe = function (a, f, c, g) {
                    var d = a, q = p.subscribe, k = [];
                    _.isArray(a) ||
                    (d = [a]);
                    a = 0;
                    for (var m = d.length; a < m; a++)if (d[a] && (!g || g(e))) {
                        var h = d[a], t = _.isString(h), e = t ? h : h.key, h = t ? f : h.handler, t = e in b;
                        null != c ? (h = null != h ? h : c[e], t = t ? n(c, e, l.hitch(c, h)) : q(e, l.hitch(c, h)), t.handler = l.hitch(c, h)) : (t = p.subscribe(e, h), t.handler = h);
                        t.type = e;
                        k.push(t)
                    }
                    return k
                };
                return e
            })
        }, "nxapp/manager/Context": function () {
            define("dcl/dcl ./ConnectionManager xide/manager/ContextBase require nxapp/utils/_console xide/types xide/utils dojo/node!path".split(" "), function (e, p, l, n, d, b, a, f) {
                return e(l,
                    {
                        declaredClass: "nxapp.manager.Context",
                        connectionManager: null,
                        blockManager: null,
                        deviceServer: null,
                        logManager: null,
                        loadDevices: function (a) {
                            d.log("load devices", a);
                            var b = this.getDeviceManager(), r = this.getDriverManager();
                            b.debug();
                            var q = b.getStores()[a.scope], k = a.path;
                            q ? q.connected ? d.warn("store " + q.scope + " is already connected") : d.info("connecting store " + q.scope) : (d.info("connecting store " + a.scope), r.createStore({items: this.getDrivers(f.resolve(k + "/drivers"), "user_drivers")}, "user_drivers", !0), b.initStore({
                                items: this.getDevices(f.resolve(k +
                                    "/devices"), "user_devices")
                            }, "user_devices", !0))
                        },
                        runFile: function (a) {
                            d.log("run file", a)
                        },
                        broadCastMessage: function (c, f) {
                            this.getDeviceServer().broadCastMessage(b.EVENTS.ON_RUN_CLASS_EVENT, a.mixin({event: b.EVENTS.ON_RUN_CLASS_EVENT}, f))
                        },
                        runClass: function (a) {
                            var b = a["class"], f = this;
                            try {
                                n([b], function (k) {
                                    k = new k(a.args);
                                    try {
                                        k.run({
                                            data: a, clear: function () {
                                                this.data.progress = null;
                                                this.data.finish = null;
                                                this.data.error = null;
                                                this.data.data = null
                                            }, onProgress: function (a, b) {
                                                this.clear();
                                                this.data.progress =
                                                    a;
                                                this.data.data = b;
                                                f.broadCastMessage(null, this.data)
                                            }, onFinish: function (a, b) {
                                                this.clear();
                                                this.data.finish = a;
                                                this.data.data = b;
                                                f.broadCastMessage(null, this.data)
                                            }, onError: function (a, b) {
                                                this.clear();
                                                this.data.error = a;
                                                this.data.data = b;
                                                f.broadCastMessage(null, this.data)
                                            }
                                        })
                                    } catch (m) {
                                        d.error("error running class " + b, m), a.error = m.message, f.broadCastMessage(null, a)
                                    }
                                })
                            } catch (q) {
                                d.error("error loading class " + b, q)
                            }
                        },
                        getDeviceServer: function () {
                            return this.deviceServer
                        },
                        getConnectionManager: function () {
                            return this.connectionManager
                        },
                        initManagers: function (a) {
                            this.connectionManager.init(a)
                        },
                        constructManagers: function () {
                            this.connectionManager = new p({ctx: this})
                        },
                        getLogManager: function () {
                            return this.logManager
                        }
                    })
            })
        }, "nxapp/manager/ConnectionManager": function () {
            define("dcl/dcl nxapp/manager/ManagerBase nxapp/utils/_LogMixin nxapp/protocols/Tcp nxapp/protocols/Udp nxapp/protocols/Driver nxapp/protocols/SSH nxapp/protocols/Serial nxapp/protocols/MQTT nxapp/protocols/ProtocolBase nxapp/types/Types xide/factory xide/utils nxapp/utils/_console xide/data/_Base nxapp/model/Connection xide/data/TreeMemory xide/data/ObservableStore dstore/Trackable dojo/_base/declare dojo/Deferred dojo/node!path require".split(" "),
                function (e, p, l, n, d, b, a, f, c, g, r, q, k, m, h, t, w, u, x, v, B, y, E) {
                    return e([p, l], {
                        declaredClass: "nxapp.manager.ConnectionManager",
                        options: null,
                        profile: null,
                        lastUpTime: null,
                        mqttManager: null,
                        pool: [],
                        poolNotFound: -1,
                        store: null,
                        getDriverModule: function (a) {
                            var b = new B;
                            if (!a || !a.driver)return b.resolve(null), b;
                            try {
                                var h = a[a.driverScope], c = h + "/" + a.driver, c = k.replaceAll("/", y.sep, c);
                                try {
                                    E.undef(c), E([c], function (a) {
                                        b.resolve(a)
                                    })
                                } catch (f) {
                                    m.error("-----error loading driver module at drivers root " + h + " and module " +
                                        a.driver + " :: " + f.message, f.stack), b.resolve()
                                }
                            } catch (g) {
                                m.error("Error connecting driver " + g.message), b.resolve()
                            }
                            return b
                        },
                        protocolMethod: function (a, b, h) {
                            h = h || {};
                            var c = new B, f = this;
                            this.getDriverModule(h.device).then(function (m) {
                                (m = f._protocolMethod(a, b, h, m)) && m.then ? m.then(function (a) {
                                    c.resolve(a)
                                }) : c.resolve([])
                            });
                            return c
                        },
                        _protocolMethod: function (b, h, k, g) {
                            k = k || {};
                            k = k.args;
                            b === r.PROTOCOL.DRIVER && g && (b = g.is ? g.is() || b : b);
                            g = {};
                            switch (b) {
                                case r.PROTOCOL.UDP:
                                    if (h in d) {
                                        g = d[h].apply(this, k);
                                        break
                                    }
                                case r.PROTOCOL.MQTT:
                                    if (h in
                                        c) {
                                        g = c[h].apply(this, k);
                                        break
                                    }
                                case r.PROTOCOL.SSH:
                                    if (h in a) {
                                        g = a[h].apply(this, k);
                                        break
                                    }
                                case r.PROTOCOL.TCP:
                                    if (h in n) {
                                        g = n[h].apply(this, k);
                                        break
                                    }
                                case r.PROTOCOL.SERIAL:
                                    if (h in f)return f[h].apply(this, k);
                                    m.error("no such protcol method " + h + " in " + b);
                                    break;
                                default:
                                    return b = new B, b.resolve([]), b
                            }
                            return g
                        },
                        onWakeup: function () {
                            this.lastUpTime = (new Date).getTime();
                            for (var a = 0; a < this.pool.length; a++) {
                                var b = this.pool[a];
                                b.socket && b.socket.close && b.socket.close();
                                b.socket && b.socket._socket && b.socket._socket.close &&
                                b.socket._socket.close()
                            }
                            this.pool = []
                        },
                        init: function (a) {
                            this.profile = a;
                            this.initLogger(a.debug);
                            this.lastUpTime = (new Date).getTime();
                            this.store = new (v("nxapp.data.Store", [w, x, u], {}))({idProperty: "id", Model: t});
                            var b = this;
                            setInterval(function () {
                                var a = (new Date).getTime();
                                if (3E3 < a - b.lastUpTime)b.onWakeup();
                                b.lastUpTime = a
                            }, 1E3)
                        },
                        connect: function (h, k, g, e, u, v) {
                            if (!h)return m.error("ConnectionManager::connect : have no host"), null;
                            if (!k)return m.error("ConnectionManager::connect : have no protocol"), null;
                            if (!u)return m.error("ConnectionManager::connect : have no options"), null;
                            v = t.generateId(u, this);
                            if (v = this.store.getSync(v)) {
                                if (!v.isServer() && !v.isRunAsServer())this.onConnect2(v, !0, !0);
                                return v
                            }
                            var w = v = null;
                            switch (k) {
                                case r.PROTOCOL.TCP:
                                    v = new n({owner: this, options: u, delegate: this});
                                    break;
                                case r.PROTOCOL.UDP:
                                    v = new d({owner: this, options: u, delegate: this});
                                    break;
                                case r.PROTOCOL.DRIVER:
                                    v = new b({owner: this, options: u, delegate: this});
                                    break;
                                case r.PROTOCOL.SSH:
                                    v = new a({owner: this, options: u, delegate: this});
                                    break;
                                case r.PROTOCOL.SERIAL:
                                    v = new f({owner: this, options: u, delegate: this});
                                    break;
                                case r.PROTOCOL.MQTT:
                                    v = new c({owner: this, options: u, delegate: this})
                            }
                            if (v) {
                                h = this.addConnection2(v, u);
                                v.init();
                                v.connection = h;
                                w = v.connect();
                                h.socket = w;
                                q.publish(r.EVENTS.ON_CONNECTION_CREATED, {connection: h}, this);
                                if (this.mqttManager)this.mqttManager.onConnectedToDevice(u, v, e);
                                return h
                            }
                            q.publish(r.EVENTS.ON_CONNECTION_ERROR, {
                                connection: {
                                    port: g,
                                    host: h,
                                    protocol: k
                                }
                            }, this);
                            return !1
                        },
                        send: function (a, b, h) {
                            if (a) {
                                var c = a.client;
                                if (c) {
                                    var f = c._socket;
                                    a.client || m.error("connection has no client");
                                    if (f) {
                                        if (!f.writable)return m.error("socket not writable, closing connection" + a.lastError), this.close(a, !0), !1
                                    } else return m.error("have no socket"), !1;
                                    a && a.options && this.logEx(r.LOG_OUTPUT.SEND_COMMAND + " : " + b, "info", "server", r.LOG_OUTPUT.SEND_COMMAND, a);
                                    return c.send(b, h)
                                }
                                m.error("send " + b + " have no client")
                            } else m.error("send " + b + " have no connection")
                        },
                        callMethod: function (a, b) {
                            b = k.getJson(b);
                            var h = b.method, c = b.args;
                            if (a)if (a.client) {
                                if (a.client[h])return a.client[h].apply(a.client,
                                    [c, b]);
                                m.error("no such method " + h)
                            } else m.error("call method : connection has no client object"); else m.error("call method : invalid connection")
                        },
                        close: function (a) {
                            if (a) {
                                a._destroyed = !0;
                                var b = a.client._socket;
                                a.client = null;
                                b && b._socket && b._socket.close && b._socket.close()
                            }
                        },
                        closeAll: function () {
                            var a = this;
                            this.forEachPool(function (b, h) {
                                a.close(h)
                            });
                            this.clearPool()
                        },
                        onTimeout: function (a) {
                        },
                        onClose: function (a, b) {
                            a && a.options && (this.logEx(r.LOG_OUTPUT.DEVICE_DISCONNECTED, "info", "server", r.LOG_OUTPUT.DEVICE_DISCONNECTED,
                                a), this.publish(r.EVENTS.ON_DEVICE_DISCONNECTED, {device: a.options, connection: a}));
                            a._destroyed = !0;
                            this.removeConnection(a, b)
                        },
                        onDrain: function (a) {
                        },
                        onError: function (a, b, h) {
                            h && m.log(" Error: " + h.host + ":" + h.port + "@" + h.protocol, b);
                            a && (a.lastError = b);
                            this.removeConnection(a, h)
                        },
                        onFinish: function (a, b, h) {
                            b = this.connectionExists(a.host, a.port, a.protocol);
                            b != this.poolNotFound ? this.callFeedBack(b, data) : m.error("ConnectionManager::onData : cant find pool - reference:" + b + ":" + a.host + ":" + a.port + ":" + a.protocol)
                        },
                        onData: function (a, b, h) {
                            try {
                                this.callFeedBack2(a, b, h)
                            } catch (c) {
                                m.error("call feedback error : " + c.message), m.log(c.stack)
                            }
                            a && a.options && this.logEx(r.LOG_OUTPUT.RESPONSE + ":" + b, "info", "server", r.LOG_OUTPUT.RESPONSE, a)
                        },
                        hasFlag: function (a, b) {
                            var h = r.LOGGING_FLAGS, c = a.loggingFlags, c = _.isString(c) ? k.fromJson(c) : c || {}, c = c[b];
                            return null != c && c & h.FILE ? !0 : !1
                        },
                        onConnect2: function (a, b, h) {
                            if (a.connected) {
                                b = {device: a.options, isReplay: h};
                                var c = this.ctx.getDeviceServer();
                                this.getConnection2(a.options);
                                c.broadCastMessage(r.EVENTS.ON_DEVICE_CONNECTED,
                                    b);
                                this.publish(r.EVENTS.ON_DEVICE_CONNECTED, {
                                    device: a.options,
                                    isReplay: h,
                                    connection: a
                                });
                                a && !a.__registered && (this.registerFeedBack2(a, function (a, b, h) {
                                    b && (b.lastResponse = _.isString(b) ? b : JSON.stringify(b, null, 2));
                                    c.onDeviceMessage(a, b, h)
                                }), a.__registered = !0);
                                a && a.options && !h && this.logEx(r.LOG_OUTPUT.ON_DEVICE_CONNECTED, "info", "server", r.LOG_OUTPUT.ON_DEVICE_CONNECTED, a);
                                if (a.client && a.client.onConnect)a.client.onConnect();
                                return a
                            }
                        },
                        logEx: function (a, b, h, c, f) {
                            var m = this.ctx.getDeviceServer();
                            if (f &&
                                f.options) {
                                var k = f.options;
                                this.hasFlag(k, c) && m.logEx(a + " " + f.toString(), b || "info", h || "server", {device: k})
                            }
                        },
                        _onConnect: function (a, b, h, c) {
                            m.log("Connected to " + c.declaredClass + ":" + a + ":" + b + " via " + h + " : ", c.options);
                            if (!c.options)throw m.error("have no options: ", c), Error("Asdf");
                            a = {device: {host: a, port: b, protocol: h, options: c ? c.options : null}};
                            this.ctx.getDeviceServer().broadCastMessage(r.EVENTS.ON_DEVICE_CONNECTED, a);
                            var f = this.ctx.getDeviceServer();
                            c && (c.__registered ? m.error("already registered") :
                                (this.registerFeedBack2(c, function (a, b, h) {
                                    b.lastResponse = "" + b;
                                    f.onDeviceMessage(a, b)
                                }), c.__registered = !0))
                        },
                        onHandle: function (a, b) {
                        },
                        getNumberOfConnections: function () {
                            return this.pool.length
                        },
                        getDeviceConnection: function () {
                            if (this.getNumberOfConnections())for (var a = 0; a < this.pool.length; a++);
                        },
                        addConnection: function (a, b, h, c, f, m, k, g) {
                            k = new t(k, a, g);
                            this.store.putSync(k);
                            this.pool.push({
                                socket: a,
                                host: b,
                                port: h,
                                protocol: c,
                                user: f,
                                customFields: m,
                                feedbackTo: []
                            });
                            return k
                        },
                        addConnection2: function (a, b) {
                            var h =
                                new t(a, b);
                            return this.store.putSync(h)
                        },
                        removeConnection: function (a, b, h) {
                            var c = this;
                            a && (a = this.getConnection2(a.options));
                            a && (a = this.getConnection2(a.options), this.ctx.getDeviceServer() && setTimeout(function () {
                                var b = {device: a.options, error: a.lastError, stopped: h};
                                c.ctx.getDeviceServer().broadCastMessage(r.EVENTS.ON_DEVICE_DISCONNECTED, b)
                            }, 1E3), this.store.removeSync(a.id), a._destroyed = !0)
                        },
                        clearPool: function () {
                            this.pool = []
                        },
                        getConnection: function (a) {
                            if (3 == arguments.length) {
                                for (var b = arguments[0], h =
                                    arguments[1], c = arguments[2], f = 0; f < this.pool.length; f++) {
                                    var m = this.pool[f];
                                    if (m.host == b && m.port == c && m.protocol == h)return m
                                }
                                return null
                            }
                            return this.pool[a]
                        },
                        getConnection2: function (a) {
                            return this.store.getSync(t.generateId(a, this))
                        },
                        getConnectionById: function (a) {
                            return this.store.getSync(a)
                        },
                        registerFeedBack2: function (a, b) {
                            a && (a.feedbackTo || (a.feedbackTo = []), a && 0 < a.feedbackTo.length || a.feedbackTo.push(b))
                        },
                        _registerFeedBack: function (a, b) {
                            var h = this.getConnection(a);
                            null == h ? m.error("cant find connection for pool ref:" +
                                a) : h && 0 < h.feedbackTo.length || h.feedbackTo.push(b)
                        },
                        callFeedBack: function (a, b) {
                            throw Error();
                        },
                        callFeedBack2: function (a, b, h) {
                            if (a)if (a.feedbackTo && 0 != a.feedbackTo.length)for (var c = 0; c < a.feedbackTo.length; c++)a.feedbackTo[c](a, b, h); else m.error("-- call feed back: have no feedback targets", a.options.host); else m.error("-- call feed back: have no connection")
                        },
                        connectionExists: function (a, b, h) {
                            var c = this.poolNotFound;
                            _.each(this.pool, function (f, m) {
                                f && f.host === a && f.port === b && f.protocol === h && (c = m)
                            });
                            return c
                        },
                        forEachPool: function (a) {
                            _.each(this.pool, function (b, h) {
                                a(b, h)
                            })
                        }
                    })
                })
        }, "nxapp/manager/ManagerBase": function () {
            define(["dcl/dcl", "xide/model/Base", "xide/mixins/EventedMixin"], function (e, p, l) {
                p = e([p.dcl, l.dcl], {
                    declaredClass: "nxapp.manager.ManagerBase",
                    ctx: null,
                    profile: null,
                    init: function (e) {
                        this.profile = e
                    }
                });
                e.chainAfter(p, "init");
                return p
            })
        }, "nxapp/protocols/Tcp": function () {
            define("dcl/dcl nxapp/utils nxapp/protocols/ProtocolBase dojo/node!net dojo/node!child_process dojo/node!util dojo/node!path xide/mixins/EventedMixin xide/mixins/ReloadMixin xide/types dojo/Deferred dojo/node!evilscan dojo/node!ipaddr.js dojo/node!os".split(" "),
                function (e, p, l, n, d, b, a, f, c, g, r, q, k, m) {
                    e = e(l, {
                        declaredClass: "nxapp.protocols.Tcp",
                        _socket: null,
                        protocolName: "tcp",
                        delegate: null,
                        driverInstance: null,
                        _handleSocketEmits: function (a) {
                            var b = this;
                            b.clients = [];
                            var c = this.blockScope, f = c.getVariable("value"), m = c.getVariables({group: g.BLOCK_GROUPS.CF_DRIVER_RESPONSE_VARIABLES}), k = c.getBlocks({group: g.BLOCK_GROUPS.CF_DRIVER_RESPONSE_BLOCKS});
                            a.on("connection", function (a) {
                                b.socket = a;
                                b.clients.push(a);
                                a.on("data", function (a) {
                                    a = [{string: a.toString(), bytes: a.join(",")}];
                                    for (var b = 0; b < a.length; b++)if (0 !== a[b].length) {
                                        f.value = new String(a[b].string);
                                        f.value.setBytes(a[b].bytes);
                                        for (var h = 0; h < m.length; h++) {
                                            var d = m[h];
                                            if ("value" != m[h].title) {
                                                var t = null, t = f.value;
                                                "number" != typeof t && (t = "" + t, t = "'" + t + "'");
                                                d.target && "None" != d.target && null !== t && "null" != t && "'null'" != t && (d = c.getVariable(d.target)) && (d.value = t, this.publish(g.EVENTS.ON_DRIVER_VARIABLE_CHANGED, {
                                                    item: d,
                                                    scope: c,
                                                    owner: this,
                                                    save: !1,
                                                    source: g.MESSAGE_SOURCE.BLOX
                                                }))
                                            }
                                        }
                                        for (d = 0; d < a.length; d++)if (t = a[d], _.isObject(t) && t.src &&
                                            (h = c.getBlockById(t.src)) && h.onData)h.onData(t);
                                        for (d = 0; d < k.length; d++)if (h = k[d], !1 !== h.enabled) {
                                            h.override = {args: [f.value]};
                                            try {
                                                c.solveBlock(k[d], {highlight: !1})
                                            } catch (r) {
                                                console.log("----solving response block crashed ", r), console.trace()
                                            }
                                        }
                                    }
                                });
                                a.on("close", function () {
                                })
                            })
                        },
                        _creatingServer: !1,
                        makeServer: function () {
                            if (!this._creatingServer) {
                                this._creatingServer = !0;
                                try {
                                    var a = this.options, b = a.port, c = a.host, f = this;
                                    this.owner.ctx.getDriverManager().createDriverInstance(a).then(function (a) {
                                        f.blockScope =
                                            a.blockScope;
                                        f.driverInstance = a.driverInstance
                                    });
                                    var m = new n.Server;
                                    m.listen(b, c);
                                    f._socket = m;
                                    m.writable = !0;
                                    f._handleSocketEmits(m);
                                    f.connection.connected = !0;
                                    f.delegate.onConnect2(f.connection);
                                    this.subscribe(g.EVENTS.ON_DEVICE_CONNECTED, this.onDeviceConnected);
                                    this.subscribe(g.EVENTS.ON_DEVICE_DISCONNECTED, this.onDeviceDisconnected)
                                } catch (k) {
                                    console.error("error creating server", k)
                                }
                                return this
                            }
                        },
                        connections: null,
                        onDeviceConnected: function (a) {
                            if (a = a.connection) {
                                var b = a.options, c = this.options;
                                this.connections ||
                                (this.connections = []);
                                a.id !== this.connection.id && this.delegate.getConnectionById(a.id) && c.host === b.host && c.port === b.port && c.protocol === b.protocol && !a.isServer() && -1 === this.connections.indexOf(a) && this.connections.push(a)
                            }
                        },
                        onDeviceDisconnected: function (a) {
                            if (a = a.connection)this.connections || (this.connections = []), -1 !== this.connections.indexOf(a) && this.connections.remove(a)
                        },
                        connect: function () {
                            if (this.isServer())return this.makeServer();
                            var a = this.options, b = this.options.port, c = this.options.host;
                            this.clients =
                                [];
                            this._socket = new n.Socket(p.mixin({
                                allowHalfOpen: !0,
                                writable: !0,
                                readable: !0
                            }, a.options));
                            var f = this;
                            this.isDebug() && console.log("TCP-Client-\x3eConnect to " + this.options.host + " : " + this.options.port + " @ " + this.protocolName);
                            this._socket.connect(b, c, function () {
                                f.connection.connected = !0;
                                f.delegate.onConnect2(f.connection)
                            });
                            this._socket.setNoDelay(!0);
                            this._socket.setKeepAlive(!0, 0);
                            this._socket.owner = this;
                            this._setupEventListeners(this._socket, this.delegate);
                            return this
                        },
                        broadCastMessage: function (a,
                                                    b) {
                            var c = this;
                            this.connections && _.each(this.connections, function (a) {
                                a && a._destroyed && c.connections.remove(a);
                                if (a)if (a.client)a.client.delegate.onData(a, b.toString(), b); else console.error("not at a real connection", a); else console.error("invalid connection", a)
                            })
                        },
                        send: function (a) {
                            null == a ? console.error("TCP : invalid command") : (a = p.bufferFromDecString(a), a = new Buffer(a), this.isServer() ? this.broadCastMessage(g.EVENTS.ON_DEVICE_MESSAGE, a) : this._socket.write(a))
                        },
                        destroy: function () {
                            this.blockScope && this.blockScope.destroy();
                            this.driverInstance && this.driverInstance.destroy();
                            delete this.blockScope;
                            delete this.driverInstance;
                            delete this.connections;
                            delete this.clients;
                            delete this._socket;
                            this._destroyed = !0
                        },
                        close: function () {
                            this.isServer() ? (this._socket.close(), this.destroy()) : this._socket.end()
                        }
                    });
                    e.net = n;
                    e.ls = function (a) {
                        try {
                            var b = function () {
                                    var a = !0;
                                    _.each(d, function (b) {
                                        b.done || (a = !1)
                                    });
                                    if (a) {
                                        var b = [];
                                        d = _.filter(d, function (a) {
                                            return 0 < a.list.length
                                        });
                                        _.each(d, function (a) {
                                            b = b.concat(a.list)
                                        });
                                        c.resolve(b)
                                    }
                                }, c = new r,
                                f = m.networkInterfaces(), g = [];
                            Object.keys(f).forEach(function (a) {
                                var b = 0;
                                f[a].forEach(function (c) {
                                    "IPv4" === c.family && !1 === c.internal && (1 <= b ? g.push({
                                        face: a + b,
                                        ip: c.address
                                    }) : g.push({face: a, ip: c.address}), ++b)
                                })
                            });
                            var d = {};
                            _.each(g, function (f) {
                                var m = k.parse(f.ip).octets;
                                m[m.length - 1] = 0;
                                var g = m.join(".") + "-254", m = new q({
                                    target: g,
                                    port: "" + (a.ports || "80"),
                                    status: "Open",
                                    timeout: 500,
                                    banner: !1
                                });
                                d[g] || (d[g] = {done: !1}, d[g].list = []);
                                m.on("result", function (a) {
                                    "open" === a.status && d[g].list.push({
                                        host: a.ip, port: a.port,
                                        description: f.face + " " + f.ip, "interface": f.face
                                    })
                                });
                                m.on("error", function (a) {
                                    c.reject("error scanning tcp")
                                });
                                m.on("done", function () {
                                    d[g].done = !0;
                                    b()
                                });
                                m.run()
                            })
                        } catch (e) {
                            console.error("error", e)
                        }
                        return c
                    };
                    e.options = function (a) {
                        a = new r;
                        var b = g.ECIType, b = [p.createCI("allowHalfOpen", b.BOOL, !0, {group: "Network"}), p.createCI("readable", b.BOOL, !0, {group: "Network"}), p.createCI("writable", b.BOOL, !0, {group: "Network"})];
                        a.resolve(b);
                        return a
                    };
                    return e
                })
        }, "nxapp/protocols/ProtocolBase": function () {
            define("dcl/dcl xide/model/Base xide/types xide/utils nxapp/utils/_LogMixin xide/mixins/ReloadMixin".split(" "),
                function (e, p, l, n, d, b) {
                    p = e([p.dcl, d, b.dcl], {
                        onReloaded: function () {
                            console.error("on reloaded")
                        },
                        options: null,
                        declaredClass: "nxapp.protocols.ProtocolBase",
                        protocolName: "undefined",
                        debug_connection: "protocol_connection",
                        debug_messages: "protocol_messages",
                        delegate: null,
                        connection: null,
                        _setupEventListeners: function (a, b) {
                            var c = this, g = c.connection;
                            a.handle = function (a) {
                                b.onHandle(g, a)
                            };
                            a.on("data", function (a) {
                                b.onData(g, a.toString(), a);
                                for (var c = 0; c < a.length; c++);
                            });
                            b || (console.error("have no handler"), n.stack());
                            g || (console.error("have no connection"), n.stack());
                            a.on("error", function (a) {
                                c.isDebug() && console.error("socket error : ", a);
                                b.onError(g, a)
                            });
                            a.on("drain", function () {
                                b.onDrain(g)
                            });
                            a.on("timeout", function () {
                                b.onTimeout(g)
                            });
                            a.on("close", function (a) {
                                b.onClose(g, a)
                            })
                        },
                        isDebug: function () {
                            var a = this.connection;
                            return a && (a = a.options) && (a = a.driverOptions) && a & 1 << l.DRIVER_FLAGS.DEBUG ? !0 : !1
                        },
                        isServer: function () {
                            var a = this.connection;
                            return a && (a = a.options) && (a = a.driverOptions) && a & 1 << l.DRIVER_FLAGS.SERVER ?
                                !0 : !1
                        },
                        runAsServer: function () {
                            var a = this.connection;
                            return a && (a = a.options) && (a = a.driverOptions) && a & 1 << l.DRIVER_FLAGS.RUNS_ON_SERVER ? !0 : !1
                        },
                        _defaultOptions: function () {
                            return {port: 23, text_encoding: "utf8", end_of_command: "\r"}
                        },
                        toString: function (a, b) {
                            var c = n.bufferFromDecString(a);
                            return (new Buffer(c)).toString(b)
                        },
                        init: function () {
                            this.initLogger(this.options.debug);
                            this.initReload();
                            var a = this;
                            this.subscribe(l.EVENTS.ON_MODULE_RELOADED, function (b) {
                                a.modulePath && b.module && a.modulePath === b.module && (a.mergeFunctions(a,
                                    b.newModule.prototype), a.onReloaded())
                            })
                        },
                        mergeFunctions: function (a, b) {
                            for (var c in b)"constructor" !== c && "inherited" !== c && _.isFunction(b[c]) && (a[c] = null, a[c] = b[c], console.log("update : " + c))
                        },
                        logConnection: function (a) {
                            this.log(a, this.debug_connection)
                        },
                        logMessages: function (a) {
                            this.log(a, this.debug_messages)
                        },
                        send: function (a) {
                        },
                        onConnect: function () {
                        },
                        destroy: function () {
                        }
                    });
                    e.chainAfter(p, "onConnect");
                    e.chainAfter(p, "init");
                    e.chainAfter(p, "close");
                    e.chainAfter(p, "destroy");
                    return p
                })
        }, "xide/mixins/ReloadMixin": function () {
            define(["xdojo/declare",
                "dcl/dcl", "xide/types", "xide/utils", "xide/mixins/EventedMixin"], function (e, p, l, n, d) {
                var b = {
                    _mergeFunctions: !0, _mergeMissingVariables: !0, isInstanceOf_: function (a) {
                        try {
                            if (!!this instanceof a || this.isInstanceOf && this.isInstanceOf(a))return !0;
                            var b = n.getAt(this, "constructor._meta.bases", []), c = a.prototype.declaredClass;
                            return _.findWhere(b, function (b) {
                                return b == a || n.getAt(b, "superclass.declaredClass") === c || n.getAt(b, "prototype.declaredClass") === c
                            })
                        } catch (g) {
                            console.log("ReloadMixin :: this.isInstanceOf_ crashed " +
                                g)
                        }
                        return !1
                    }, mergeFunctions: function (a, b) {
                        for (var c in b)"constructor" !== c && "inherited" !== c && (_.isFunction(b[c]) && (a[c] = null, a[c] = b[c]), _.isArray(b[c]) && null == a[c] && (a[c] = b[c]))
                    }, onModuleReloaded: function (a) {
                        var b = a.newModule;
                        if (b && b.prototype && !a._processed) {
                            var c = b.prototype, g = c.declaredClass, d = !1, q = this.declaredClass;
                            g && (g && q && (d = n.replaceAll("/", ".", q) === n.replaceAll("/", ".", g)), d ? (this.mergeFunctions(this, c), this.onReloaded && (a._processed = !0, this.onReloaded(b))) : a.module && n.replaceAll("//", "/",
                                a.module) === q && this.mergeFunctions(this, c))
                        }
                    }, initReload: function () {
                        this.subscribe(l.EVENTS.ON_MODULE_RELOADED)
                    }
                };
                e = e(null, b);
                e.Impl = b;
                e.dcl = p(d.dcl, b);
                return e
            })
        }, "nxapp/protocols/Udp": function () {
            define("dcl/dcl nxapp/protocols/ProtocolBase dojo/node!dgram xide/utils dojo/Deferred xide/types".split(" "), function (e, p, l, n, d, b) {
                e = e(p, {
                    declaredClass: "nxapp.protocols.Udp",
                    _socket: null,
                    protocolName: "udp",
                    port: null,
                    host: null,
                    onData: function (a) {
                        var b = this.delegate;
                        this.isDebug() && console.log("UDP: got data : " +
                            this.connection.toString(), a);
                        b.onData(this.connection, a)
                    },
                    makeServer: function (a, b) {
                        var c = this;
                        a.bind(b.port, b.ip);
                        c.isDebug() && console.log("UDP: Make server, bind socket to " + b.ip + " :: " + b.port);
                        a.on("listening", function () {
                            var b = a.address();
                            c.isDebug() && console.log("\t UDP Server listening on " + b.address + ":" + b.port)
                        });
                        a.on("message", function (a, b) {
                            c.isDebug() && console.log("UDP: on server message " + c.connection.toString() + " - " + b.address + ":" + b.port + " - " + a);
                            c.onData(a.toString())
                        })
                    },
                    connect: function () {
                        var a =
                            this.options;
                        this.port = this.options.port;
                        this.host = this.options.host;
                        this.protocol = this.protocolName;
                        this._socket = l.createSocket("udp4");
                        a = n.getJson(a.options);
                        this._setupEventListeners(this._socket, this.delegate);
                        this._socket.writable = !0;
                        this.connection.connected = !0;
                        this.delegate.onConnect2(this.connection);
                        a && !0 === a.server && this.makeServer(this._socket, a);
                        return this
                    },
                    send: function (a, b) {
                        try {
                            var c = this, g = n.bufferFromDecString(a), d = new Buffer(g), q = d.toString();
                            console.log("UDP - " + c.connection.toString() +
                                " Sending command: " + a + " \x3d " + q + " l\x3d " + q.length);
                            this._socket.send(d, 0, d.length, this.port, this.host, function (a, b) {
                                if (a)c.delegate.onError(a)
                            })
                        } catch (k) {
                            console.error("crash !")
                        }
                    },
                    close: function () {
                        try {
                            this._socket.close()
                        } catch (a) {
                            console.error("Error closing udp connection : ", a)
                        }
                    }
                });
                e.options = function (a) {
                    try {
                        var f = new d, c = b.ECIType, g = [n.createCI("ip", c.STRING, "", {
                            group: "Network",
                            title: "IP",
                            description: "The ip address to bind the server."
                        }), n.createCI("port", c.STRING, "", {
                            group: "Network", title: "Port",
                            description: "The port to use when its a server"
                        }), n.createCI("server", c.BOOL, !1, {
                            group: "Network",
                            title: "Make this as server.",
                            description: ""
                        })];
                        f.resolve(g);
                        return f
                    } catch (r) {
                        console.error("error", r)
                    }
                    return f
                };
                return e
            })
        }, "nxapp/protocols/Driver": function () {
            define("dcl/dcl nxapp/utils nxapp/protocols/ProtocolBase dojo/node!path require xide/types nxapp/utils/_console".split(" "), function (e, p, l, n, d, b, a) {
                l = e(l, {
                    declaredClass: "nxapp.protocols.Driver", _socket: null, protocolName: "driver", instance: null,
                    constructor: function (a) {
                        p.mixin(this, a)
                    }, onError: function (f, c, g) {
                        this.isDebug() && a.info("Driver-\x3eonError " + f + " id " + c.params.id + " src " + c.params.src);
                        try {
                            this.delegate.onData(this.connection, p.mixin({
                                cmd: f,
                                event: b.EVENTS.ON_COMMAND_ERROR,
                                result: g.toString()
                            }, c), g)
                        } catch (d) {
                            a.error("onFinish-Error:", d)
                        }
                    }, onConnected: function () {
                        this.isDebug() && a.log("# driver onConnected " + this.options.host + " : " + this.options.port + " @ " + this.protocolName);
                        this.connection.connected = !0;
                        this.delegate.onConnect2(this.connection)
                    },
                    onConnect: function () {
                        this._socket.onConnect && this._socket.onConnect()
                    }, onFinish: function (f, c, g) {
                        this.isDebug() && a.info("Driver-\x3eonFinish " + f + " id " + c.params.id + " src " + c.params.src);
                        try {
                            this.delegate.onData(this.connection, p.mixin({
                                cmd: f,
                                event: b.EVENTS.ON_COMMAND_FINISH,
                                result: g.toString()
                            }, c), g)
                        } catch (d) {
                            a.error("onFinish-Error:", d)
                        }
                    }, onProgress: function (f, c, g) {
                        this.isDebug() && a.info("Driver-\x3eonProgress " + f + " id " + c.params.id + " src " + c.params.src);
                        try {
                            this.delegate.onData(this.connection, p.mixin({
                                cmd: f,
                                event: b.EVENTS.ON_COMMAND_PROGRESS, result: g.toString()
                            }, c), g)
                        } catch (d) {
                            a.error("onFinish-Progress:", d)
                        }
                    }, onPaused: function (f, c, g) {
                        this.isDebug() && a.info("Driver-\x3eonPaused " + f + " id " + c.params.id + " src " + c.params.src);
                        try {
                            this.delegate.onData(this.connection, p.mixin({
                                cmd: f,
                                event: b.EVENTS.ON_COMMAND_PAUSED,
                                result: g.toString()
                            }, c), g)
                        } catch (d) {
                            a.error("onFinish-Paused:", d)
                        }
                    }, onStopped: function (f, c, g) {
                        this.isDebug() && a.info("Driver-\x3eonStopped " + f + " id " + c.params.id + " src " + c.params.src);
                        try {
                            this.delegate.onData(this.connection,
                                p.mixin({cmd: f, event: b.EVENTS.ON_COMMAND_STOPPED, result: g.toString()}, c), g)
                        } catch (d) {
                            a.error("onFinish-Stopped:", d)
                        }
                    }, _connect: function (b, c, g) {
                        b = new b(c);
                        b.owner = this;
                        b.options = this.options;
                        b.delegate = this.delegate;
                        b.connection = this.connection;
                        this.modulePath = b.modulePath = g;
                        b.connect || a.error("have no connect");
                        this._socket = b;
                        this._socket.writable = !0;
                        b.connect()
                    }, onDeviceDisconnected: function (a) {
                        this.delegate.onClose(this.connection, this.options)
                    }, onData: function (b, c) {
                        this.isDebug() && a.log("Driver on data : ");
                        c = c || new Buffer(b);
                        this.delegate.onData(this.connection, b, c);
                        this._socket && this._socket.onData && this._socket.onData(this.connection, b, c)
                    }, connect: function () {
                        var b = this.options;
                        this.isDebug() && a.log("connect custom driver");
                        if (!b || !b.driver)return a.error("no driver in options", b), this;
                        try {
                            var c = b[b.driverScope], g = c + "/" + b.driver, g = p.replaceAll("/", n.sep, g);
                            this.isDebug() && a.log("load driver : " + g + " drivers root : " + c + " from " + n.dirname(g));
                            var r = this;
                            try {
                                d.undef(g), d([g], function (c) {
                                    if ("function" !== typeof c)r.close(), r.onDeviceDisconnected(); else try {
                                        r._connect ? r._connect(c, b, g) : a.error("have no _connect")
                                    } catch (h) {
                                        a.error("error calling connect on " + g + " | Error " + h.message, h)
                                    }
                                })
                            } catch (q) {
                                a.error("-----error loading driver module at drivers root " + c + " and module " + b.driver + " :: " + q.message, q.stack)
                            }
                        } catch (k) {
                            a.error("Error connecting driver " + k.message)
                        }
                        return this
                    }, send: function (b, c) {
                        b ? (this.isDebug() && a.log("send : ", b), this._socket.write(b, c)) : a.error("TCP : invalid command")
                    }, close: function () {
                        this._socket &&
                        this._socket.destroy && this._socket.destroy()
                    }
                });
                e.chainAfter(l, "close");
                e.chainAfter(l, "destroy");
                return l
            })
        }, "nxapp/protocols/SSH": function () {
            define("dcl/dcl xide/utils nxapp/types/Types nxapp/protocols/ProtocolBase dojo/node!net dojo/node!fs dojo/node!path dojo/node!ssh2 dojo/node!strip-ansi dojo/node!child_process dojo/node!util dojo/node!deferred dojo/node!ansi-to-html dojo/node!ansi_up nxapp/utils/_console xide/encoding/MD5 dojo/Deferred".split(" "), function (e, p, l, n, d, b, a, f, c, g, r, q, k, m, h, t, w) {
                var u =
                    !1;
                e = e(n, {
                    declaredClass: "nxapp.protocols.SSH",
                    _socket: null,
                    protocolName: "ssh",
                    instance: null,
                    sshOptions: null,
                    running: null,
                    getOptions: function (c, m, k) {
                        var f = null;
                        if (k.privateKeyPath) {
                            var g = a.resolve(k.privateKeyPath);
                            g ? f = b.readFileSync(g).toString() : u || this.isDebug() && h.warn("Sorry, cant resolve file " + k.privateKeyPath)
                        }
                        c = {
                            config: !1,
                            host: c,
                            username: k.username,
                            password: k.password,
                            agent: "",
                            agentForward: !1,
                            port: m,
                            proxy: {port: m},
                            ignoreErrors: !1,
                            minimatch: {},
                            debug: u || this.isDebug() ? function (a) {
                                h.log("SSH _ DEBUG : " +
                                    a)
                            } : null,
                            suppressRemoteErrors: !1,
                            callback: function () {
                            }
                        };
                        f && (c.privateKey = f);
                        return p.mixin(c, k)
                    },
                    onConnected: function () {
                        u || this.isDebug() && h.log("# " + this.protocolName + " - Protocol:: onConnected " + this.options.host + " : " + this.options.port + " @ " + this.protocolName);
                        this.connection.connected = !0;
                        this.delegate.onConnect2(this.connection)
                    },
                    onError: function (a, b) {
                        this.delegate.onError(this.connection, p.mixin({code: a}, b), this.options)
                    },
                    onClose: function () {
                        this.delegate.onClose(this.connection, this.options)
                    },
                    connect: function () {
                        var a = this.options, b = this;
                        if (!a || !a.driver)return u || b.isDebug() && h.error("no driver in options", a), this;
                        var c = a.host, m = a.port, a = p.getJson(a.options);
                        !0 === a.debug && (u = !0);
                        var k = this.getOptions(c, m, a), a = function (a) {
                            var b = {
                                host: a.host,
                                port: a.port,
                                username: a.username,
                                readyTimeout: a.readyTimeout,
                                agentForward: a.agentForward
                            };
                            a.privateKey ? (b.privateKey = a.privateKey.trim(), a.passphrase && (b.passphrase = a.passphrase.trim())) : a.password ? (b.password = a.password, a.agent && (b.agent = a.agent)) : b.agent =
                                a.agent;
                            return b
                        }(k);
                        this.sshOptions = k;
                        this.host = c;
                        this.port = m;
                        this.protocol = this.protocolName;
                        u || b.isDebug() && h.log("SSH-\x3econnecting SSH with");
                        var g = new f;
                        g.on("keyboard-interactive", function (a, b, c, h, m) {
                            h.forEach(function (a) {
                                -1 !== a.prompt.toLowerCase().indexOf("password") && m([k.password])
                            })
                        });
                        g.on("connect", function () {
                            u || b.isDebug() && h.log("SSH-\x3eConnection :: connect")
                        });
                        g.on("ready", function () {
                            u || b.isDebug() && h.log("SSH-\x3eConnection :: ready");
                            var a, c, m;
                            g.once("session", function (k, f) {
                                k().once("pty",
                                    function (b, k, f) {
                                        a = f.rows;
                                        c = f.cols;
                                        m = f.term;
                                        b && b();
                                        u && h.log("SSH-\x3e pty " + a + " " + c + " " + m)
                                    }).once("shell", function (a, c) {
                                    u || b.isDebug() && h.log("SSH-\x3eshell")
                                })
                            });
                            b.onConnected()
                        });
                        g.on("error", function (a) {
                            u || b.isDebug() && h.warn("SSH-\x3eConnection - Error :: " + a);
                            a = a.level + ":" + a.message;
                            b.onError(a);
                            b.lastError = a
                        });
                        g.on("debug", function (a) {
                            u || b.isDebug() && h.log("SSH-\x3eConnection :: debug :: " + a)
                        });
                        g.on("end", function () {
                            u || b.isDebug() && h.log("SSH-\x3eConnection :: end");
                            b.onClose()
                        });
                        g.on("close",
                            function (a) {
                                if (a)u || b.isDebug() && h.log("SSH - Connection :: Close, had Error "); else b.onClose()
                            });
                        try {
                            g.connect(a)
                        } catch (d) {
                            u || b.isDebug() && h.warn("SSH-\x3eConnection - Error :: " + d);
                            b.onError("fatal:" + d.message);
                            return
                        }
                        this._socket = g;
                        this._socket.writable = !0;
                        return this
                    },
                    onData: function (a, b) {
                        this.isDebug() && h.log("SSH-\x3eonData", a);
                        this.delegate.onData(this.connection, a || "", b)
                    },
                    onProgress: function (a, b, c) {
                        this.isDebug() && h.info("SSH-\x3eonProgress " + a + " id " + b.params.id + " src " + b.params.src);
                        try {
                            this.delegate.onData(this.connection,
                                p.mixin({cmd: a, event: l.EVENTS.ON_COMMAND_PROGRESS, result: c.toString()}, b), c)
                        } catch (m) {
                            h.error("onFinish-Progress:", m)
                        }
                    },
                    onCommandError: function (a, b, c) {
                        u || this.isDebug() && h.log("SSH-\x3eonCommandError " + a + " id " + b.params.id + " src " + b.params.src);
                        try {
                            this.delegate.onData(this.connection, p.mixin({
                                cmd: a,
                                event: l.EVENTS.ON_COMMAND_ERROR
                            }, b), c)
                        } catch (m) {
                            h.error("---", m)
                        }
                    },
                    onFinish: function (a, b, c) {
                        u || this.isDebug() && h.info("SSH-\x3eonFinish " + a + " id " + b.params.id + " src " + b.params.src);
                        try {
                            this.delegate.onData(this.connection,
                                p.mixin({cmd: a, event: l.EVENTS.ON_COMMAND_FINISH}, b), c)
                        } catch (m) {
                            h.error("onFinish-Error:", m)
                        }
                    },
                    _addCommand: function (a) {
                        t(JSON.stringify(a.join(",")), 1)
                    },
                    execCommand: function (a, b) {
                        var c = this._socket, f = this, g = f.sshOptions, d = q(), t = b.params, r = t.id, e = t.wait, n = new k(g.ansiOptions || {}), w = 1 == g.waitForEOF, l = "";
                        if (0 === a.length)f.isDebug() && h.log("SSH-\x3eno more SSH commands, call Defered::resolve"); else {
                            var p = a.shift();
                            f.isDebug() && h.log("SSH-\x3eExecuting :: " + p, b.params);
                            c.exec(p, g, function (c, k) {
                                if (c)u ||
                                f.isDebug() && h.log("---error in SSH ", c); else {
                                    var t;
                                    k.on("data", function (a, c) {
                                        t = String(a);
                                        !0 !== g.ansiUp && 1 == g.html ? t = n.toHtml(t) : 1 == g.ansiUp && 1 == g.html && (t = m.ansi_to_html(t));
                                        f.isDebug() && h.log("SSH DATA : signal \x3d " + c + " : " + t);
                                        if ("stderr" !== c)if (w)l += t, k.lastData = l; else {
                                            if (e)f.onProgress(p, b, a); else f.onData(t, a);
                                            k.lastData = t
                                        }
                                    });
                                    k.on("end", function (a) {
                                        u || f.isDebug() && h.log("SSH-\x3eStream :: EOF, had Error " + (1 == k.hadError));
                                        t && "function" === typeof g.callback && g.callback(t.trim());
                                        !0 !== k.hadError ?
                                            (w && (u || f.isDebug() && h.error("--------------release data on EOF"), f.onData(k.lastData)), d.resolve(r)) : d.reject({
                                            id: r,
                                            error: k.lastData
                                        })
                                    });
                                    k.on("exit", function () {
                                        u || f.isDebug() && h.log("SSH-\x3eStream :: exit")
                                    });
                                    k.on("close", function (c, m) {
                                        u || f.isDebug() && h.log("SSH-\x3eStream :: close :: code: " + c + ", signal: " + m);
                                        127 == c && (k.hadError = !0, d.reject({id: r, error: k.lastData}));
                                        g.ignoreErrors || 0 === c ? f.execCommand(a, b) : (u || f.isDebug() && h.error("SSH-\x3eError executing task " + p + " _ code " + c), f.onCommandError(p,
                                            b))
                                    })
                                }
                            })
                        }
                        return d.promise
                    },
                    send: function (a, b) {
                        u || this.isDebug() && h.log("send : " + a, b.params);
                        if (null == a)h.error("SSH: invalid command"); else {
                            b = b || {id: p.createUUID()};
                            a = this.toString(a);
                            u || this.isDebug() && h.log("SSH-\x3esend : " + a);
                            var c = this.execCommand([a], b), m = this;
                            c.then(function (c) {
                                m.onFinish(a, b)
                            }, function (c) {
                                b.error = c.error;
                                m.onCommandError(a, b)
                            });
                            return c
                        }
                    },
                    close: function () {
                        this._socket && this._socket.end()
                    },
                    init: function () {
                        this.running = {}
                    }
                });
                e.options = function (a) {
                    try {
                        var b = new w, c = l.ECIType,
                            m = [p.createCI("username", c.STRING, "", {
                                group: "Network",
                                title: "User name"
                            }), p.createCI("password", c.STRING, "", {
                                group: "Network",
                                title: "Password",
                                password: !0
                            }), p.createCI("localhostName", c.STRING, "", {
                                group: "Network",
                                title: "Local host name",
                                description: "Along with localUsername and privateKey, set this to a non-empty string for hostbased user authentication"
                            }), p.createCI("tryKeyboard", c.BOOL, !1, {
                                group: "Network",
                                title: "Try keyboard",
                                description: "ry keyboard-interactive user authentication if primary user authentication method fails. If you set this to true"
                            }),
                                p.createCI("keepaliveInterval", c.INTEGER, 0, {
                                    group: "Network",
                                    title: " Keep alive interval",
                                    description: "How often (in milliseconds) to send SSH-level keepalive packets to the server (in a similar way as OpenSSH's ServerAliveInterval config option). Set to 0 to disable."
                                }), p.createCI("keepaliveCountMax", c.INTEGER, 3, {
                                    group: "Network",
                                    title: "Keep alive count maximum",
                                    description: " How many consecutive, unanswered SSH-level keepalive packets that can be sent to the server before disconnection (similar to OpenSSH's ServerAliveCountMax config option)."
                                }),
                                p.createCI("readyTimeout", c.INTEGER, 2E4, {
                                    group: "Network",
                                    title: "Ready timeout",
                                    description: "How long (in milliseconds) to wait for the SSH handshake to complete."
                                }), p.createCI("strictVendor", c.BOOL, !0, {
                                    group: "Network",
                                    title: "Strict vendor",
                                    description: "Performs a strict server vendor check before sending vendor-specific requests, etc. (e.g. check for OpenSSH server when using openssh_noMoreSessions()"
                                })];
                        b.resolve(m);
                        return b
                    } catch (k) {
                        h.error("error", k)
                    }
                    return b
                };
                return e
            })
        }, "nxapp/protocols/Serial": function () {
            define("dcl/dcl xide/utils xide/utils/StringUtils nxapp/types/Types nxapp/protocols/ProtocolBase dojo/node!child_process dojo/node!util nxapp/utils/_console xdojo/has dojo/node!xcf-server-misc/serialport dojo/Deferred".split(" "),
                function (e, p, l, n, d, b, a, f, c, g, r) {
                    var q = !1;
                    e = e(d, {
                        declaredClass: "nxapp.protocols.Serial",
                        _socket: null,
                        protocolName: "serial",
                        instance: null,
                        client: null,
                        sshOptions: null,
                        getOptions: function (a, b, c, f) {
                            return p.mixin({
                                baudrate: 9600,
                                parity: "none",
                                rtscts: !1,
                                xon: !1,
                                xoff: !1,
                                xany: !1,
                                hupcl: !0,
                                cts: !1,
                                dtr: !0,
                                dts: !1,
                                brk: !1,
                                rts: !1,
                                databits: 8,
                                stopbits: 1,
                                bufferSize: 65536,
                                parser: g.parsers.raw
                            }, c)
                        },
                        onConnected: function () {
                            this.connection.connected = !0;
                            this.delegate.onConnect2(this.connection)
                        },
                        onError: function (a, b) {
                            this.delegate.onError(this.connection,
                                p.mixin({code: a}, b), this.options)
                        },
                        onClose: function () {
                            this.delegate.onClose(this.connection, this.options)
                        },
                        connect: function () {
                            try {
                                g || (f.warn("serial port was not loaded!"), g = global.nRequire("serialport"), f.warn("got serial port : " + (null != g)))
                            } catch (a) {
                                f.error("cant load serial port", a)
                            }
                            if (!g || !g.parsers || !g.parsers.raw)return f.error('----heavy error! It seems that node-js module "serial-port" has not been installed correctly ' + c("serialport")), this.onError('----heavy error! It seems that node-js module "serial-port" has not been installed correctly ' +
                                c("serialport"), g);
                            if (!c("serialport"))return f.error("have no serial port flag enabled, abort!"), this.onError("have serial no port");
                            try {
                                var b = this.options;
                                if (!c("serialport"))return this.onError("have serial port");
                                if (!b || !b.driver)return this;
                                var h = this, d = b.host, r = b.port, e = p.getJson(b.options || {});
                                !0 === e.debug && (q = !0);
                                var n = this.getOptions(d, r, e, (b.responseSettings || {}).delimiter);
                                this.serialOptions = n;
                                this.protocol = this.protocolName;
                                var v = new g(d, n);
                                this.client = v;
                                v.on("error", function (a) {
                                    h.onError(a.toString(),
                                        a)
                                });
                                try {
                                    v.on("open", function (a) {
                                        if (a) {
                                            var b = a.level + ":" + a.message;
                                            h.onError(b);
                                            h.lastError = b;
                                            h.isDebug() && f.warn("Serial-\x3eConnection - Error :: " + d + ":" + a)
                                        } else h.onConnected(), v.on("data", function (a) {
                                            h.isDebug() && f.log("Serial-\x3eonData " + a.toString());
                                            h.onData(a.toString(), a)
                                        })
                                    })
                                } catch (l) {
                                    this.isDebug() && f.error("Serial-\x3econnect error :: code: ", l)
                                }
                                v.on("close", function (a) {
                                    try {
                                        h.isDebug() && f.log("Serial-\x3eclose :: code: ", a), h.onClose(), v.close()
                                    } catch (b) {
                                        h.isDebug() && f.error("Serial-\x3eclose :: code: ",
                                            b)
                                    }
                                });
                                this._socket = {};
                                this._socket.writable = !0;
                                return this
                            } catch (y) {
                                return this.isDebug() && f.error("error connection serial ", y), h.onError(y.message), f.trace(), this
                            }
                        },
                        onData: function (a, b) {
                            this.delegate.onData(this.connection, a, b)
                        },
                        onCommandError: function (a, b) {
                            q || this.isDebug() && f.log("SERIAL-\x3eCommandError " + a + " id " + b.id + " src " + b.src);
                            try {
                                this.delegate.onData(this.connection, p.mixin({
                                    cmd: a,
                                    event: n.EVENTS.ON_COMMAND_ERROR
                                }, b))
                            } catch (c) {
                                f.error("---", c)
                            }
                        },
                        onFinish: function (a, b) {
                            q || this.isDebug() &&
                            f.log("SERIAL-\x3eonFinish " + a + " id " + b.id + " src " + b.src);
                            try {
                                this.delegate.onData(this.connection, p.mixin({
                                    cmd: a,
                                    event: n.EVENTS.ON_COMMAND_FINISH
                                }, b))
                            } catch (c) {
                                f.error("onFinish-Error:", c)
                            }
                        },
                        send: function (a, b) {
                            if (null == a)f.error("SERIAL invalid command"); else {
                                b || p.createUUID();
                                var c = p.bufferFromDecString(a), c = new Buffer(c), g = c.toString();
                                this.isDebug() && f.log("Serial - Sending command: " + a + " \x3d " + g + " l\x3d " + g.length);
                                this.client.write(c)
                            }
                        },
                        close: function () {
                            this.client && this.client.close()
                        }
                    });
                    e.ls = function (a) {
                        var b = new r;
                        g ? g.list(function (a, c) {
                            c = c.filter(function (a) {
                                return !0
                            });
                            c = _.map(c, function (a) {
                                return {host: a.comName, port: "", description: a.manufacturer, id: a.pnpId}
                            });
                            b.resolve(c)
                        }) : (f.error("have no serial port"), b.reject("serialport nodejs library not present"));
                        return b
                    };
                    e.options = function (a) {
                        try {
                            a = function (a, b) {
                                return {label: a, value: a || b}
                            };
                            var b = new r, c = n.ECIType, g = [p.createCI("baudrate", c.ENUMERATION, 115200, {
                                group: "Network",
                                title: "Baud rate",
                                options: [a(115200), a(115200), a(57600), a(38400),
                                    a(19200), a(9600), a(4800), a(2400), a(1800), a(1200), a(600), a(300), a(200), a(150), a(134), a(110), a(75), a(50)]
                            }), p.createCI("databits", c.ENUMERATION, 8, {
                                group: "Network",
                                title: "Data bits",
                                options: [a(8), a(7), a(6), a(5)]
                            }), p.createCI("stopbits", c.ENUMERATION, 1, {
                                group: "Network",
                                title: "Stop bits",
                                options: [a(1), a(2)]
                            }), p.createCI("parity", c.ENUMERATION, "none", {
                                group: "Network",
                                title: "Parity",
                                options: [a("none"), a("even"), a("mark"), a("odd"), a("space")]
                            }), p.createCI("rtscts", c.BOOL, !1, {group: "Network"}), p.createCI("xon",
                                c.BOOL, !1, {group: "Network"}), p.createCI("xoff", c.BOOL, !1, {group: "Network"}), p.createCI("flowcontrol", c.BOOL, !0, {group: "Network"}), p.createCI("buffersize", c.INTEGER, 65536, {group: "Network"})];
                            b.resolve(g);
                            return b
                        } catch (d) {
                            f.error("error", d)
                        }
                        return b
                    };
                    return e
                })
        }, "xide/utils/StringUtils": function () {
            define(["xide/utils", "xide/types", "dojo/json", "xide/lodash"], function (e, p, l, n) {
                function d(b, a) {
                    var f = [], c = [];
                    null == a && (a = function (a, b) {
                        return f[0] === b ? "[Circular ~]" : "[Circular ~." + c.slice(0, f.indexOf(b)).join(".") +
                        "]"
                    });
                    return function (g, d) {
                        if (0 < f.length) {
                            var q = f.indexOf(this);
                            ~q ? f.splice(q + 1) : f.push(this);
                            ~q ? c.splice(q, Infinity, g) : c.push(g);
                            ~f.indexOf(d) && (d = a.call(this, g, d))
                        } else f.push(d);
                        return null == b ? d : b.call(this, g, d)
                    }
                }

                e.stringify = function (b) {
                    return JSON.stringify(b, d(), 2)
                };
                e.round = function (b, a, f) {
                    if ("number" !== typeof b || isNaN(b) || Infinity === b || -Infinity === b)return "";
                    a = "undefined" === typeof a ? 3 : parseInt(a, 10) || 0;
                    var c = Math.pow(10, a);
                    b = (Math.round(b * c) / c).toFixed(a);
                    f || (b = "" + +b);
                    return b
                };
                e.humanFileSize =
                    function (b, a) {
                        var f = a ? 1E3 : 1024;
                        if (Math.abs(b) < f)return b + " B";
                        var c = a ? "kB MB GB TB PB EB ZB YB".split(" ") : "KiB MiB GiB TiB PiB EiB ZiB YiB".split(" "), g = -1;
                        do b /= f, ++g; while (Math.abs(b) >= f && g < c.length - 1);
                        return b.toFixed(1) + " " + c[g]
                    };
                "function" != typeof String.prototype.startsWith && (String.prototype.startsWith = function (b) {
                    return 0 === this.indexOf(b)
                });
                "function" != typeof String.prototype.endsWith && (String.prototype.endsWith = function (b) {
                    return this.substring(this.length - b.length, this.length) === b
                });
                e.isNativeEvent =
                    function (b) {
                        var a = {
                            onclick: null,
                            ondblclick: null,
                            onmousedown: null,
                            onmouseup: null,
                            onmouseover: null,
                            onmousemove: null,
                            onmouseout: null,
                            onkeypress: null,
                            onkeydown: null,
                            onkeyup: null,
                            onfocus: null,
                            onblur: null,
                            onchange: null
                        };
                        if (b in a)return !0;
                        a = {
                            click: null,
                            dblclick: null,
                            mousedown: null,
                            mouseup: null,
                            mouseover: null,
                            mousemove: null,
                            mouseout: null,
                            keypress: null,
                            keydown: null,
                            keyup: null,
                            focus: null,
                            blur: null,
                            change: null
                        };
                        return b in a
                    };
                e.isSystemEvent = function (b) {
                    for (var a in p.EVENTS)if (p.EVENTS[a] === b)return !0;
                    return !1
                };
                e.contains = function (b, a) {
                    for (var f = 0; f < b.length; f++)if (b[f] === a)return f;
                    return -1
                };
                e.getObjectKeyByValue = function (b, a) {
                    if (b && a)for (var f in b)if (b.hasOwnProperty(f) && b[f] === a)return f;
                    return null
                };
                e.removeURLParameter = function (b, a) {
                    var f = b.split("?");
                    if (2 <= f.length) {
                        for (var c = encodeURIComponent(a) + "\x3d", g = f[1].split(/[&;]/g), d = g.length; 0 < d--;)-1 !== g[d].lastIndexOf(c, 0) && g.splice(d, 1);
                        b = f[0] + "?" + g.join("\x26")
                    }
                    return b
                };
                e.replaceUrlParam = function (b, a, f) {
                    if (-1 == b.indexOf(a))return b += (0 < b.indexOf("?") ?
                            "\x26" : "?") + a + "\x3d" + f;
                    var c = b.replace(new RegExp("(" + a + "\x3d).*?(\x26|$)"), "$1" + f + "$2");
                    c == b && (c = c + (0 < c.indexOf("?") ? "\x26" : "?") + a + "\x3d" + f);
                    return c
                };
                e.buildPath = function (b, a, f) {
                    var c = "" + b, c = e.replaceAll("/", "", b);
                    b = ("" + a).replace("./", "/").replace(/^\/|\/$/g, "");
                    c = c + "://" + b;
                    return !0 === f ? encodeURIComponent(c) : c
                };
                e.isImage = function (b) {
                    return null != b.toLowerCase().match(/\.(jpeg|jpg|gif|png)$/)
                };
                e.hasFlag3 = function (b, a) {
                    return 1 << a & b ? !0 : !1
                };
                e.hasFlag = function (b, a) {
                    return 1 << a & b ? !0 : !1
                };
                e.disableFlag =
                    function (b, a) {
                        return b & ~(1 << a)
                    };
                e.cleanUrl = function (b) {
                    b && (b = b.replace("//", "/"), b = b.replace("./", "/"), b = b.replace("http:/", "http://"), b = b.replace("./", "/"), b = b.replace("////", "/"), b = b.replace("///", "/"));
                    return b
                };
                e.getJson = function (b, a, f) {
                    try {
                        return n.isString(b) ? l.parse(b, !1) : !0 === a ? null : b
                    } catch (c) {
                        !1 !== f && console.error("error parsing json data " + b + " error \x3d " + c)
                    }
                    return null
                };
                e.fromJson = function (b) {
                    if (!n.isString(b))return b;
                    var a = null, f = !1;
                    try {
                        a = eval("(" + b + ")", {})
                    } catch (c) {
                        f = !0
                    }
                    if (f) {
                        b = b.substring(b.indexOf("{"),
                            b.lastIndexOf("}") + 1);
                        try {
                            a = eval("(" + b + ")", {})
                        } catch (g) {
                            throw Error(b);
                        }
                    }
                    return a
                };
                e.replaceAll = function (b, a, f) {
                    return f ? f.split(b).join(a) : ""
                };
                e.isValidString = function (b) {
                    return null != b && null != b.length && 0 < b.length && "undefined" != b
                };
                e.substituteString = function (b, a) {
                    return b.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function (b, c) {
                        return a[c]
                    })
                };
                e.findOcurrences = function (b, a) {
                    var f = e.escapeRegExp(a.begin), c = e.escapeRegExp(a.end);
                    return b.match(new RegExp(f + "([^" + c + "]*)" + c, "g"))
                };
                e.escapeRegExp =
                    function (b) {
                        for (var a = "[ ] ( ) { } * + . | ||".split(" "), f = 0; f < a.length; f++)b = b.replace(a[f], "\\" + a[f]);
                        return b
                    };
                e.multipleReplace = function (b, a) {
                    var f = [], c;
                    for (c in a)f[f.length] = c;
                    return b.replace(new RegExp(f.join("\\b|\\b"), "g"), function (b) {
                        return a[b] || a["\\" + b]
                    })
                };
                e.replace = function (b, a, f, c) {
                    if (!b)return "";
                    if (f && n.isObject(f) || n.isArray(f)) {
                        if (c) {
                            a = e.findOcurrences(b, c);
                            var g = e.replaceAll;
                            if (a)for (var d = 0, q = a.length; d < q; d++) {
                                var k = a[d], m = g(c.begin, "", k), m = g(c.end, "", m);
                                b = g(k, f[m], b)
                            }
                        } else return e.multipleReplace(b,
                            f);
                        return b
                    }
                    return e.replaceAll(a, f, b)
                };
                e.capitalize = function (b) {
                    return b.substring(0, 1).toUpperCase() + b.substring(1)
                };
                e.vsprintf = function (b, a) {
                    return e.sprintf.apply(this, [b].concat(a))
                };
                e.sprintf = function () {
                    var b = arguments, a = 0, f = function (a, b, c, f) {
                        c || (c = " ");
                        b = a.length >= b ? "" : Array(1 + b - a.length >>> 0).join(c);
                        return f ? a + b : b + a
                    }, c = function (a, b, c, m, h, g) {
                        var d = m - a.length;
                        0 < d && (a = c || !h ? f(a, m, g, c) : a.slice(0, b.length) + f("", d, "0", !0) + a.slice(b.length));
                        return a
                    }, g = function (a, b, g, m, h, d, e) {
                        a >>>= 0;
                        g = g && a && {
                                2: "0b",
                                8: "0", 16: "0x"
                            }[b] || "";
                        a = g + f(a.toString(b), d || 0, "0", !1);
                        return c(a, g, m, h, e)
                    };
                    return b[a++].replace(/%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g, function (d, q, k, m, h, t, e) {
                        var n, l;
                        if ("%%" === d)return "%";
                        var v = !1;
                        l = "";
                        var p = h = !1;
                        n = " ";
                        for (var y = k.length, E = 0; k && E < y; E++)switch (k.charAt(E)) {
                            case " ":
                                l = " ";
                                break;
                            case "+":
                                l = "+";
                                break;
                            case "-":
                                v = !0;
                                break;
                            case "'":
                                n = k.charAt(E + 1);
                                break;
                            case "0":
                                h = !0;
                                break;
                            case "#":
                                p = !0
                        }
                        m = m ? "*" === m ? +b[a++] : "*" == m.charAt(0) ? +b[m.slice(1, -1)] :
                            +m : 0;
                        0 > m && (m = -m, v = !0);
                        if (!isFinite(m))throw Error("sprintf: (minimum-)width must be finite");
                        t = t ? "*" === t ? +b[a++] : "*" == t.charAt(0) ? +b[t.slice(1, -1)] : +t : -1 < "fFeE".indexOf(e) ? 6 : "d" === e ? 0 : void 0;
                        q = q ? b[q.slice(0, -1)] : b[a++];
                        switch (e) {
                            case "s":
                                return e = String(q), null != t && (e = e.slice(0, t)), c(e, "", v, m, h, n);
                            case "c":
                                return e = String.fromCharCode(+q), null != t && (e = e.slice(0, t)), c(e, "", v, m, h, void 0);
                            case "b":
                                return g(q, 2, p, v, m, t, h);
                            case "o":
                                return g(q, 8, p, v, m, t, h);
                            case "x":
                                return g(q, 16, p, v, m, t, h);
                            case "X":
                                return g(q,
                                    16, p, v, m, t, h).toUpperCase();
                            case "u":
                                return g(q, 10, p, v, m, t, h);
                            case "i":
                            case "d":
                                return n = +q || 0, n = Math.round(n - n % 1), d = 0 > n ? "-" : l, q = d + f(String(Math.abs(n)), t, "0", !1), c(q, d, v, m, h);
                            case "e":
                            case "E":
                            case "f":
                            case "F":
                            case "g":
                            case "G":
                                return n = +q, d = 0 > n ? "-" : l, l = ["toExponential", "toFixed", "toPrecision"]["efg".indexOf(e.toLowerCase())], e = ["toString", "toUpperCase"]["eEfFgG".indexOf(e) % 2], q = d + Math.abs(n)[l](t), c(q, d, v, m, h)[e]();
                            default:
                                return d
                        }
                    })
                };
                e.cleanString = function (b) {
                    return b ? b = b.replace(/[\r]/g, "").replace(/[\b]/g,
                        "").replace(/[\f]/g, "").replace(/[\n]/g, "").replace(/\\/g, "") : null
                };
                e.normalizePath = function (b) {
                    if (!b)return null;
                    b = e.cleanString(b);
                    b = b.replace("./", "");
                    b = b.replace("/.", "");
                    return b = b.replace(/([^:]\/)\/+/g, "$1")
                };
                p.PATH_PARTS = {DIRNAME: 1, BASENAME: 2, EXTENSION: 4, FILENAME: 8, PATHINFO_ALL: 0};
                e.basename = function (b, a) {
                    var f = b, c = f.charAt(f.length - 1);
                    if ("/" === c || "\\" === c)f = f.slice(0, -1);
                    f = f.replace(/^.*[\/\\]/g, "");
                    "string" === typeof a && f.substr(f.length - a.length) == a && (f = f.substr(0, f.length - a.length));
                    return f
                };
                e.pathinfo = function (b, a) {
                    var f = "", c = "", d = "", r = 0, q = {}, k = 0, m = 0, h = k = !1, t = !1;
                    if (!b)return !1;
                    a || (a = "PATHINFO_ALL");
                    var n = {
                        PATHINFO_DIRNAME: 1,
                        PATHINFO_BASENAME: 2,
                        PATHINFO_EXTENSION: 4,
                        PATHINFO_FILENAME: 8,
                        PATHINFO_ALL: 0
                    };
                    for (d in n)n.hasOwnProperty(d) && (n.PATHINFO_ALL |= n[d]);
                    if ("number" !== typeof a) {
                        a = [].concat(a);
                        for (m = 0; m < a.length; m++)n[a[m]] && (r |= n[a[m]]);
                        a = r
                    }
                    d = function (a) {
                        a += "";
                        var b = a.lastIndexOf(".") + 1;
                        return b ? b !== a.length ? a.substr(b) : "" : !1
                    };
                    a & n.PATHINFO_DIRNAME && (r = b.replace(/\\/g, "/").replace(/\/[^\/]*\/?$/,
                        ""), q.dirname = r === b ? "." : r);
                    a & n.PATHINFO_BASENAME && (!1 === k && (k = e.basename(b)), q.basename = k);
                    a & n.PATHINFO_EXTENSION && (!1 === k && (k = e.basename(b)), !1 === h && (h = d(k)), !1 !== h && (q.extension = h));
                    a & n.PATHINFO_FILENAME && (!1 === k && (k = e.basename(b)), !1 === h && (h = d(k)), !1 === t && (t = k.slice(0, k.length - (h ? h.length + 1 : !1 === h ? 0 : 1))), q.filename = t);
                    k = 0;
                    for (f in q)q.hasOwnProperty(f) && (k++, c = f);
                    return 1 === k ? q[c] : q
                };
                e.parse_url = function (b, a) {
                    var f;
                    f = "source scheme authority userInfo user pass host port relative path directory file query fragment".split(" ");
                    for (var c = this.php_js && this.php_js.ini || {}, d = c["phpjs.parse_url.mode"] && c["phpjs.parse_url.mode"].local_value || "php", e = {
                            php: /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                            loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
                        },
                             e = e[d].exec(b), q = {}, k = 14; k--;)e[k] && (q[f[k]] = e[k]);
                    if (a)return q[a.replace("PHP_URL_", "").toLowerCase()];
                    if ("php" !== d) {
                        var m = c["phpjs.parse_url.queryKey"] && c["phpjs.parse_url.queryKey"].local_value || "queryKey", e = /(?:^|&)([^&=]*)=?([^&]*)/g;
                        q[m] = {};
                        f = q[f[12]] || "";
                        f.replace(e, function (a, b, c) {
                            b && (q[m][b] = c)
                        })
                    }
                    delete q.source;
                    return q
                };
                e.getMimeTable = function () {
                    return {}
                };
                e.getMimeTable2 = function () {
                    return {
                        mid: "fa-file-audio-o",
                        txt: "fa-file-text-o",
                        sql: "fa-cube",
                        js: "fa-cube",
                        gif: "fa-file-picture-o",
                        jpg: "fa-file-picture-o",
                        html: "fa-cube",
                        htm: "fa-cube",
                        rar: "fa-file-zip-o",
                        gz: "fa-file-zip-o",
                        tgz: "fa-file-zip-o",
                        z: "fa-file-zip-o",
                        ra: "fa-file-movie-o",
                        ram: "fa-file-movie-o",
                        rm: "fa-file-movie-o",
                        pl: "source_pl.png",
                        zip: "fa-file-zip-o",
                        wav: "fa-file-audio-o",
                        php: "fa-cube",
                        php3: "fa-cube",
                        phtml: "fa-cube",
                        exe: "fa-file-o",
                        bmp: "fa-file-picture-o",
                        png: "fa-file-picture-o",
                        css: "fa-cube",
                        mp3: "fa-file-audio-o",
                        m4a: "fa-file-audio-o",
                        aac: "fa-file-audio-o",
                        xls: "fa-file-excel-o",
                        xlsx: "fa-file-excel-o",
                        ods: "fa-file-excel-o",
                        sxc: "fa-file-excel-o",
                        csv: "fa-file-excel-o",
                        tsv: "fa-file-excel-o",
                        doc: "fa-file-word-o",
                        docx: "fa-file-word-o",
                        odt: "fa-file-word-o",
                        swx: "fa-file-word-o",
                        rtf: "fa-file-word-o",
                        md: "fa-file-word-o",
                        ppt: "fa-file-powerpoint-o",
                        pps: "fa-file-powerpoint-o",
                        odp: "fa-file-powerpoint-o",
                        sxi: "fa-file-powerpoint-o",
                        pdf: "fa-file-pdf-o",
                        mov: "fa-file-movie-o",
                        avi: "fa-file-movie-o",
                        mpg: "fa-file-movie-o",
                        mpeg: "fa-file-movie-o",
                        mp4: "fa-file-movie-o",
                        m4v: "fa-file-movie-o",
                        ogv: "fa-file-movie-o",
                        webm: "fa-file-movie-o",
                        wmv: "fa-file-movie-o",
                        swf: "fa-file-movie-o",
                        flv: "fa-file-movie-o",
                        tiff: "fa-file-picture-o",
                        tif: "fa-file-picture-o",
                        svg: "fa-file-picture-o",
                        psd: "fa-file-picture-o",
                        ers: "horo.png"
                    }
                };
                e.getIconTable = function () {
                    return {}
                };
                e.urlDecode = function (b, a) {
                    if (!b || !b.length)return {};
                    for (var f = {}, c = b.split("\x26"), d, e, q = 0, k = c.length; q < k; q++)d = c[q].split("\x3d"), e = decodeURIComponent(d[0]), d = decodeURIComponent(d[1]), null != d && "true" === d ? d = !0 : "false" === d && (d = !1), !0 !== a ? "undefined" == typeof f[e] ? f[e] = d : ("string" == typeof f[e] && (f[e] = [f[e]]), f[e].push(d)) : f[e] = d;
                    return f
                };
                e.getUrlArgs = function (b) {
                    var a = {};
                    if (b && (-1 != b.indexOf("?") || -1 != b.indexOf("\x26"))) {
                        b = (b.substr(b.indexOf("?") + 1) || location.search.substring(1)).split("\x26");
                        for (var f = 0; f < b.length; f++) {
                            var c = b[f].indexOf("\x3d"), d = b[f].substring(0, c), c = b[f].substring(c + 1), c = decodeURIComponent(c);
                            a[d] = c
                        }
                    }
                    return a
                };
                e.urlArgs = function (b) {
                    b = e.getUrlArgs(b);
                    var a = {}, f;
                    for (f in b) {
                        var c = b[f], d = e.findOcurrences(c, {begin: "|", end: "|"}), r = null;
                        if (d && d.length)for (var c = c.replace(d[0], ""), d = d[0].substr(1, d[0].length - 2).split(","),
                                                   r = {}, q = 0; q < d.length; q++) {
                            var k = d[q].split(":");
                            r[k[0]] = k[1]
                        }
                        c && c.length && (a[f] = {value: c, options: r})
                    }
                    return a
                };
                e.getIcon = function (b) {
                    if (!b)return "txt2.png";
                    if (b = e.getFileExtension(b)) {
                        var a = e.getMimeTable();
                        if (null != a[b])return a[b]
                    }
                    return "txt2.png"
                };
                e.getIconClass = function (b) {
                    if (!b)return "fa-file-o";
                    b = e.getFileExtension(b);
                    if (p.customMimeIcons[b])return p.customMimeIcons[b];
                    if (b) {
                        var a = e.getMimeTable2();
                        if (null != a[b])return a[b]
                    }
                    return "fa-file-o"
                };
                e.getFileExtension = function (b) {
                    if (!b || "" == b)return "";
                    b = e.getBaseName(b).split(".");
                    return 1 < b.length ? b[b.length - 1].toLowerCase() : ""
                };
                e.createUUID = function () {
                    var b = function () {
                        return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
                    };
                    return b() + b() + "-" + b() + "-" + b() + "-" + b() + "-" + b() + b() + b()
                };
                e.getBaseName = function (b) {
                    if (null == b)return null;
                    var a = "/";
                    -1 !== b.indexOf("\\") && (a = "\\");
                    return b.substr(b.lastIndexOf(a) + 1, b.length)
                };
                e.basename = function (b, a) {
                    var f = b, c = f.charAt(f.length - 1);
                    if ("/" === c || "\\" === c)f = f.slice(0, -1);
                    f = f.replace(/^.*[\/\\]/g, "");
                    "string" === typeof a && f.substr(f.length - a.length) === a && (f = f.substr(0, f.length - a.length));
                    return f
                };
                e.pathinfo = function (b, a) {
                    var f = e.basename, c = "", d = "", r = "", q = 0, k = {}, m = 0, h = 0, t = m = !1, n = !1;
                    if (!b)return !1;
                    a || (a = "PATHINFO_ALL");
                    var u = {
                        PATHINFO_DIRNAME: 1,
                        PATHINFO_BASENAME: 2,
                        PATHINFO_EXTENSION: 4,
                        PATHINFO_FILENAME: 8,
                        PATHINFO_ALL: 0
                    };
                    for (r in u)u.hasOwnProperty(r) && (u.PATHINFO_ALL |= u[r]);
                    if ("number" !== typeof a) {
                        a = [].concat(a);
                        for (h = 0; h < a.length; h++)u[a[h]] && (q |= u[a[h]]);
                        a = q
                    }
                    r = function (a) {
                        a += "";
                        var b = a.lastIndexOf(".") +
                            1;
                        return b ? b !== a.length ? a.substr(b) : "" : !1
                    };
                    a & u.PATHINFO_DIRNAME && (q = b.replace(/\\/g, "/").replace(/\/[^\/]*\/?$/, ""), k.dirname = q === b ? "." : q);
                    a & u.PATHINFO_BASENAME && (!1 === m && (m = f(b)), k.basename = m);
                    a & u.PATHINFO_EXTENSION && (!1 === m && (m = f(b)), !1 === t && (t = r(m)), !1 !== t && (k.extension = t));
                    a & u.PATHINFO_FILENAME && (!1 === m && (m = f(b)), !1 === t && (t = r(m)), !1 === n && (n = m.slice(0, m.length - (t ? t.length + 1 : !1 === t ? 0 : 1))), k.filename = n);
                    m = 0;
                    for (c in k)k.hasOwnProperty(c) && (m++, d = c);
                    return 1 === m ? k[d] : k
                };
                e.strip_tags = function (b, a) {
                    a =
                        (((a || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join("");
                    return b.replace(/\x3c!--[\s\S]*?--\x3e|<\?(?:php)?[\s\S]*?\?>/gi, "").replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, function (b, c) {
                        return -1 < a.indexOf("\x3c" + c.toLowerCase() + "\x3e") ? b : ""
                    })
                };
                return e
            })
        }, "nxapp/protocols/MQTT": function () {
            define("dcl/dcl xdojo/declare xide/utils nxapp/types/Types nxapp/protocols/ProtocolBase dojo/node!net dojo/node!path dojo/node!child_process dojo/node!util dojo/node!deferred nxapp/utils/_console dojo/node!mqtt dojo/Deferred".split(" "),
                function (e, p, l, n, d, b, a, f, c, g, r, q, k) {
                    var m = !0;
                    e = e(d, {
                        declaredClass: "nxapp.protocols.MQTT",
                        _socket: null,
                        protocolName: "mqtt",
                        instance: null,
                        subscriptions: null,
                        mqttClient: null,
                        getOptions: function (a, b, c) {
                            return l.mixin({clean: !1, clientId: c.clientId || a + ":" + b, port: b}, c)
                        },
                        onConnected: function () {
                            m && r.log("# " + this.protocolName + " - Protocol:: onConnected " + this.options.host + " : " + this.options.port + " @ " + this.protocolName);
                            this.connection.connected = !0;
                            this.delegate.onConnect2(this.connection)
                        },
                        onError: function (a,
                                           b) {
                            this.delegate.onError(this.connection, l.mixin({code: a}, b), this.options)
                        },
                        onClose: function (a) {
                            this.delegate.onClose(this.connection, a)
                        },
                        connect: function () {
                            var a = this.options;
                            if (!a || !a.driver)return m || this.isDebug() && r.error("no driver in options", a), this;
                            var b = this, c = a.host, d = a.port, a = l.getJson(a.options || {});
                            !0 === a.debug && (m = !0);
                            a = this.getOptions(c, d, a);
                            this.host = c;
                            this.port = d;
                            this.protocol = this.protocolName;
                            m || this.isDebug() && r.log("MQTT-\x3econnecting to " + c + " with", a);
                            var f = q.connect(c, a);
                            this.mqttClient = f;
                            try {
                                f.on("connect", function (a) {
                                    b.onConnected()
                                })
                            } catch (k) {
                                m || this.isDebug() && r.error("MQTT-\x3econnect error :: code: ", k)
                            }
                            f.on("close", function (a) {
                                m || b.isDebug() && r.log("MQTT-\x3eclose :: code: ", a);
                                b.onClose();
                                f.end()
                            });
                            this._socket = {};
                            this._socket.writable = !0;
                            return this
                        },
                        onData: function (a, b) {
                            this.delegate.onData(this.connection, a, b)
                        },
                        onCommandError: function (a, b) {
                            m || this.isDebug() && r.log("MQTT-\x3eCommandError " + a + " id " + b.id + " src " + b.src);
                            try {
                                this.delegate.onData(this.connection,
                                    l.mixin({cmd: a, event: n.EVENTS.ON_COMMAND_ERROR}, b))
                            } catch (c) {
                                r.error("---", c)
                            }
                        },
                        onFinish: function (a, b, c) {
                            m || this.isDebug() && r.log("MQTT onFinish " + a + " id " + b.id + " src " + b.src);
                            try {
                                this.delegate.onData(this.connection, l.mixin({
                                    cmd: a,
                                    event: n.EVENTS.ON_COMMAND_FINISH
                                }, b), c)
                            } catch (d) {
                                r.error("onFinish-Error:", d)
                            }
                        },
                        addSubscription: function (a, b, d) {
                            !this.subscriptions && (this.subscriptions = {});
                            if (a) {
                                var f = this, m = "" + a;
                                if (!this.subscriptions[m]) {
                                    b = {qos: parseInt(b.qos) || 0};
                                    this.mqttClient.subscribe(m, b);
                                    this.isDebug() &&
                                    r.log("add subscription : " + a + " for ", c.inspect(d, {depth: null, colors: !0}));
                                    var k = this.subscriptions[m] = {id: d.params.id, src: d.params.src, topic: m};
                                    this.mqttClient.on("message", function (a, b) {
                                        if (a === m) {
                                            var c = l.getJson(b.toString());
                                            if (_.isArray(c))f.onData(l.mixin({
                                                payload: c,
                                                topic: a
                                            }, k)); else if (_.isObject(c))c.topic || (c.topic = a), f.onData(l.mixin(c, k)); else if (_.isString(c) || _.isNumber(c))f.onData(l.mixin({
                                                payload: c,
                                                topic: a
                                            }, k)); else r.error("-unknown " + a)
                                        }
                                    })
                                }
                            } else r.error("invalid topic")
                        },
                        unSubscribeTopic: function (a,
                                                    b, c) {
                            a = l.getJson(a);
                            (a = "" + a.topic) && this.unsubscribe(a)
                        },
                        subscribeTopic: function (a, b, c) {
                            a = l.getJson(a);
                            b = l.getJson(b);
                            c = "" + a.topic;
                            delete a.topic;
                            this.addSubscription(c, a, b)
                        },
                        publishTopic: function (a, b, c) {
                            try {
                                a = l.getJson(a);
                                l.getJson(b);
                                var d = "" + a.topic, f = a.qos, k = a.retain;
                                delete a.topic;
                                delete a.qos;
                                delete a.retain;
                                var g = a.payload || a;
                                if (_.isObject(g))try {
                                    g = JSON.stringify(g)
                                } catch (q) {
                                    r.error("error generating payload", q);
                                    return
                                }
                                this.mqttClient.publish(d, g, {qos: f, retain: k})
                            } catch (e) {
                                m || this.isDebug() &&
                                r.log("---error ", e)
                            }
                        },
                        send: function (a, b) {
                        },
                        unsubscribe: function (a) {
                            a && this.mqttClient && this.subscriptions && this.subscriptions[a] && (this.mqttClient.unsubscribe(a), delete this.subscriptions[a])
                        },
                        close: function () {
                            this.mqttClient && (_.each(this.subscriptions, this.unsubscribe, this), this.mqttClient.end(), this.mqttClient = null)
                        }
                    });
                    e.options = function (a) {
                        try {
                            var b = new k, c = n.ECIType, d = [l.createCI("clientId", c.STRING, "", {
                                group: "Network",
                                title: "Client id",
                                description: "mqttjs_' + Math.random().toString(16).substr(2, 8)"
                            }),
                                l.createCI("protocolVersion", c.INTEGER, 4, {
                                    group: "Network",
                                    title: "Protocol id",
                                    description: ""
                                }), l.createCI("protocolId", c.STRING, "", {
                                    group: "Network",
                                    title: "Protocol id",
                                    description: ""
                                }), l.createCI("username", c.STRING, "", {
                                    group: "Network",
                                    title: "User name",
                                    description: "the username required by your broker, if any"
                                }), l.createCI("password", c.STRING, "", {
                                    group: "Network",
                                    title: "Password",
                                    password: !0,
                                    description: "the password required by your broker, if any"
                                }), l.createCI("keepalive", c.INTEGER, 10, {
                                    group: "Network",
                                    title: "Keep alive", description: "10 seconds, set to 0 to disable"
                                }), l.createCI("reconnectPeriod", c.INTEGER, 1E3, {
                                    group: "Network",
                                    title: "Reconnect period",
                                    description: "1000 milliseconds, interval between two re-connections"
                                }), l.createCI("connectTimeout", c.INTEGER, 3E4, {
                                    group: "Network",
                                    title: "Connect timeout",
                                    description: "30 * 1000 milliseconds, time to wait before a CONNACK is received"
                                }), l.createCI("reschedulePings", c.BOOL, !0, {
                                    group: "Network",
                                    title: "Reschedule",
                                    description: "reschedule ping messages after sending packets"
                                }),
                                l.createCI("queueQoSZero", c.BOOL, !0, {
                                    group: "Network",
                                    title: "Queue QoS Zero",
                                    description: " if connection is broken, queue outgoing QoS zero messages (default true)"
                                }), l.createCI("clean", c.BOOL, !0, {
                                    group: "Network",
                                    title: "Clean",
                                    description: "set to false to receive QoS 1 and 2 messages while offline"
                                })];
                            b.resolve(d);
                            return b
                        } catch (f) {
                            r.error("error", f)
                        }
                        return b
                    };
                    return e
                })
        }, "xide/data/_Base": function () {
            define("dojo/_base/declare dstore/Memory dstore/Tree dstore/QueryResults xide/mixins/EventedMixin xide/encoding/MD5 xdojo/has xide/lodash dojo/when dojo/Deferred".split(" "),
                function (e, p, l, n, d, b, a, f, c, g) {
                    return e("xide/data/_Base", d, {
                        __all: null, allowCache: !0, _find: function (a) {
                            a = f.filter(this.data, a);
                            return f.isArray(a) ? a : f.isObject(a) ? [a] : []
                        }, _query: function (a) {
                            var b = new g;
                            a = this.filter(a);
                            c(a.fetch(), function (a) {
                                b.resolve(a)
                            });
                            return b
                        }, constructor: function () {
                            var a = this;
                            if (a._getQuerierFactory("filter") || a._getQuerierFactory("sort"))this.queryEngine = function (b, c) {
                                c = c || {};
                                var h = a._getQuerierFactory("filter"), d = h ? h(b) : passthrough, h = a._getQuerierFactory("sort"), f = passthrough;
                                h && (f = h(arrayUtil.map(c.sort, function (a) {
                                    return {property: a.attribute, descending: a.descending}
                                })));
                                var g = passthrough;
                                isNaN(c.start) && isNaN(c.count) || (g = function (a) {
                                    var b = c.start || 0, b = a.slice(b, b + (c.count || Infinity));
                                    b.total = a.length;
                                    return b
                                });
                                return function (a) {
                                    return g(f(d(a)))
                                }
                            };
                            var b = this;
                            a.on("add,update,delete", function (c) {
                                var d = c.type, h = c.target;
                                b.notify("add" === d || "update" === d ? h : void 0, "delete" === d || "update" === d ? "id" in c ? c.id : a.getIdentity(h) : void 0)
                            })
                        }, destroy: function () {
                            this._emit("destroy",
                                this);
                            delete this._queryCache;
                            this._queryCache = null
                        }, notify: function () {
                        }, refreshItem: function (a, b) {
                            this.emit("update", {target: a, property: b})
                        }, _queryCache: null, query: function (c, d, k) {
                            if (!this.getSync)return console.error("have no sync"), [];
                            if (f.isEmpty(c)) {
                                var m = this;
                                return _.map(this.data, function (a) {
                                    return m.getSync(a[m.idProperty])
                                }, this)
                            }
                            _.some(c, function (a) {
                                return null == a
                            });
                            c && b(JSON.stringify(c), 1);
                            a("xcf-ui");
                            d = d || {};
                            c = c || {};
                            var h = this.filter(c), g;
                            if (c = d.sort)if ("[object Array]" === Object.prototype.toString.call(c))for (; k =
                                                                                                                 c.pop();)h = h.sort(k.attribute, k.descending); else h = h.sort(c);
                            "start" in d && (g = d.start || 0, g = h[h.fetchRangeSync ? "fetchRangeSync" : "fetchRange"]({
                                start: g,
                                end: d.count ? g + d.count : Infinity
                            }), g.total = g.totalLength);
                            g = g || new n(h[h.fetchSync ? "fetchSync" : "fetch"]());
                            g.observe = function (a, b) {
                                var c = h.on("add", function (b) {
                                    a(b.target, -1, b.index)
                                }), d = h.on("update", function (c) {
                                    !b && c.previousIndex === c.index && isFinite(c.index) || a(c.target, c.previousIndex, c.index)
                                }), f = h.on("delete", function (b) {
                                    a(b.target, b.previousIndex,
                                        -1)
                                }), m = {
                                    remove: function () {
                                        c.remove();
                                        d.remove();
                                        f.remove()
                                    }
                                };
                                m.cancel = m.remove;
                                return m
                            };
                            a("xcf-ui");
                            return g
                        }
                    })
                })
        }, "dstore/Memory": function () {
            define("dojo/_base/declare dojo/_base/array ./Store ./Promised ./SimpleQuery ./QueryResults".split(" "), function (e, p, l, n, d, b) {
                return e([l, n, d], {
                    constructor: function () {
                        this.storage.version = 0
                    }, postscript: function () {
                        this.inherited(arguments);
                        this.setData(this.data || [])
                    }, data: null, autoEmitEvents: !1, getSync: function (a) {
                        return this.storage.fullData[this.storage.index[a]]
                    },
                    putSync: function (a, b) {
                        b = b || {};
                        var c = this.storage, d = c.index, e = c.fullData, q = this.Model;
                        !q || a instanceof q || (a = this._restore(a));
                        var k = this.getIdentity(a);
                        null == k && (this._setIdentity(a, "id" in b ? b.id : Math.random()), k = this.getIdentity(a));
                        c.version++;
                        var c = k in d ? "update" : "add", q = {target: a}, m;
                        if ("update" === c) {
                            if (!1 === b.overwrite)throw Error("Object already exists");
                            e.splice(m = d[k], 1);
                            k = m
                        } else k = this.defaultNewToStart ? 0 : e.length;
                        var h;
                        if ("beforeId" in b) {
                            var t = b.beforeId;
                            null === t ? h = e.length : (h = d[t], m < h && --h);
                            void 0 !== h ? q.beforeId = t : (console.error("options.beforeId was specified but no corresponding index was found"), h = k)
                        } else h = k;
                        e.splice(h, 0, a);
                        m = isFinite(m) ? Math.min(m, h) : h;
                        for (k = e.length; m < k; ++m)d[this.getIdentity(e[m])] = m;
                        this.emit(c, q);
                        return a
                    }, addSync: function (a, b) {
                        (b = b || {}).overwrite = !1;
                        return this.putSync(a, b)
                    }, removeSync: function (a) {
                        var b = this.storage, c = b.index, b = b.fullData;
                        if (a in c)return c = b.splice(c[a], 1)[0], this._reindex(), !0 !== this._ignoreChangeEvents && this.emit("delete", {
                            id: a,
                            target: c
                        }),
                            !0
                    }, setData: function (a) {
                        this.parse && (a = this.parse(a));
                        a.items && (this.idProperty = a.identifier || this.idProperty, a = a.items);
                        this.storage.fullData = this.data = a;
                        this._reindex()
                    }, _reindex: function () {
                        for (var a = this.storage, b = a.index = {}, c = a.fullData, d = this.Model, e = Object.prototype, q = 0, k = c.length; q < k; q++) {
                            var m = c[q];
                            if (d && !(m instanceof d)) {
                                var h = this._restore(m, m.__proto__ === e);
                                m !== h && (c[q] = m = h)
                            }
                            b[this.getIdentity(m)] = q
                        }
                        a.version++
                    }, fetchSync: function () {
                        var a = this.data;
                        if (!a || a._version !== this.storage.version) {
                            for (var a =
                                this.storage.fullData, d = this.queryLog, c = 0, g = d.length; c < g; c++)a = d[c].querier(a);
                            a._version = this.storage.version;
                            this.data = a
                        }
                        return new b(a)
                    }, fetchRangeSync: function (a) {
                        var d = this.fetchSync();
                        return new b(d.slice(a.start, a.end), {totalLength: d.length})
                    }, _includePropertyInSubCollection: function (a) {
                        return "data" !== a && this.inherited(arguments)
                    }
                })
            })
        }, "dstore/Store": function () {
            define("dojo/_base/lang dojo/_base/array dojo/aspect dojo/has dojo/when dojo/Deferred dojo/_base/declare dstore/QueryMethod dstore/Filter dojo/Evented dcl/dcl".split(" "),
                function (e, p, l, n, d, b, a, f, c, g, r) {
                    function q(a) {
                        return function (b, c) {
                            var f = this;
                            d(b, function (b) {
                                b = {target: b};
                                var h = c[1] || {};
                                "beforeId" in h && (b.beforeId = h.beforeId);
                                f.emit(a, b)
                            });
                            return b
                        }
                    }

                    n.add("object-proto", !!{}.__proto__ && !{}.watch);
                    var k = n("object-proto");
                    return a(g, {
                        constructor: function (b) {
                            b && a.safeMixin(this, b);
                            this.Model && this.Model.createSubclass && (this.Model = this.Model.createSubclass([], {}).extend({_store: this}));
                            this.storage = new g;
                            var c = this;
                            this.autoEmitEvents && (l.after(this, "add", q("add")),
                                l.after(this, "put", q("update")), l.after(this, "remove", function (a, b) {
                                d(a, function () {
                                    c.emit("delete", {id: b[0]})
                                });
                                return a
                            }))
                        }, autoEmitEvents: !0, idProperty: "id", queryAccessors: !0, getIdentity: function (a) {
                            return a.get ? a.get(this.idProperty) : a[this.idProperty]
                        }, _setIdentity: function (a, b) {
                            a.set ? a.set(this.idProperty, b) : a[this.idProperty] = b
                        }, forEach: function (a, b) {
                            var c = this;
                            return d(this.fetch(), function (d) {
                                for (var f = 0, k; void 0 !== (k = d[f]); f++)a.call(b, k, f, c);
                                return d
                            })
                        }, on: function (a, b) {
                            return this.storage.on(a,
                                b)
                        }, emit: function (a, b) {
                            b = b || {};
                            b.type = a;
                            try {
                                return this.storage.emit(a, b)
                            } finally {
                                return b.cancelable
                            }
                        }, parse: null, stringify: null, Model: null, _restore: function (a, b) {
                            var c = this.Model;
                            if (c && a) {
                                var d = c.prototype, f = d._restore;
                                f ? a = f.call(a, c, b) : k && b ? a.__proto__ = d : a = e.delegate(d, a)
                            }
                            return a
                        }, create: function (a) {
                            return new this.Model(a)
                        }, _createSubCollection: function (b) {
                            var c = e.delegate(this.constructor.prototype), d;
                            for (d in this)this._includePropertyInSubCollection(d, c) && (c[d] = this[d]);
                            return a.safeMixin(c,
                                b)
                        }, _includePropertyInSubCollection: function (a, b) {
                            return !(a in b) || b[a] !== this[a]
                        }, queryLog: [], filter: new f({
                            type: "filter", normalizeArguments: function (a) {
                                var b = this.Filter;
                                return a instanceof b ? [a] : [new b(a)]
                            }
                        }), Filter: c, sort: new f({
                            type: "sort", normalizeArguments: function (a, b) {
                                var c;
                                "function" === typeof a ? c = [a] : (c = a instanceof Array ? a.slice() : "object" === typeof a ? [].slice.call(arguments) : [{
                                    property: a,
                                    descending: b
                                }], c = p.map(c, function (a) {
                                    a = e.mixin({}, a);
                                    a.descending = !!a.descending;
                                    return a
                                }), c = [c]);
                                return c
                            }
                        }), select: new f({type: "select"}), _getQuerierFactory: function (a) {
                            return this["_create" + (a[0].toUpperCase() + a.substr(1)) + "Querier"]
                        }
                    })
                })
        }, "dstore/QueryMethod": function () {
            define([], function () {
                return function (e) {
                    var p = e.type, l = e.normalizeArguments, n = e.applyQuery, d = e.querierFactory;
                    return function () {
                        var b = Array.prototype.slice.call(arguments), a = l ? l.apply(this, b) : b, b = {
                            type: p,
                            arguments: b,
                            normalizedArguments: a
                        }, f = this._getQuerierFactory(p) || d;
                        f && (b.querier = f.apply(this, a));
                        a = this._createSubCollection({queryLog: this.queryLog.concat(b)});
                        return n ? n.call(this, a, b) : a
                    }
                }
            })
        }, "dstore/Filter": function () {
            define(["dojo/_base/declare"], function (e) {
                function p(e) {
                    return function () {
                        var d = this.constructor, b = new d;
                        b.type = e;
                        b.args = Array.prototype.slice.call(arguments);
                        return this.type ? p("and").call(d.prototype, this, b) : b
                    }
                }

                function l(e) {
                    return function () {
                        for (var d = this.constructor, b = [], a = 0; a < arguments.length; a++) {
                            var f = arguments[a];
                            b.push(f instanceof d ? f : new d(f))
                        }
                        d = new d;
                        d.type = e;
                        d.args = b;
                        this.type === e ? d.args = this.args.concat(b) : this.type ? b.unshift(this) :
                        1 === b.length && (d.type = b[0].type, d.args = b[0].args.slice());
                        return d
                    }
                }

                e = e(null, {
                    constructor: function (e) {
                        var d = typeof e;
                        switch (d) {
                            case "object":
                                var d = this, b;
                                for (b in e)var a = e[b], d = a instanceof this.constructor ? d[a.type](b, a.args[0]) : a && a.test ? d.match(b, a) : d.eq(b, a);
                                this.type = d.type;
                                this.args = d.args;
                                break;
                            case "function":
                            case "string":
                                this.type = d, this.args = [e]
                        }
                    },
                    and: l("and"),
                    or: l("or"),
                    eq: p("eq"),
                    ne: p("ne"),
                    lt: p("lt"),
                    lte: p("lte"),
                    gt: p("gt"),
                    gte: p("gte"),
                    contains: p("contains"),
                    "in": p("in"),
                    match: p("match")
                });
                e.filterCreator = p;
                e.logicalOperatorCreator = l;
                return e
            })
        }, "dstore/Promised": function () {
            define(["dojo/_base/declare", "dojo/Deferred", "./QueryResults", "dojo/when"], function (e, p, l, n) {
                function d(b, a) {
                    return function () {
                        var d = new p;
                        try {
                            d.resolve(this[b].apply(this, arguments))
                        } catch (c) {
                            d.reject(c)
                        }
                        return a ? (d = new l(d.promise), d.totalLength = n(d.totalLength), d) : d.promise
                    }
                }

                return e(null, {
                    get: d("getSync"),
                    put: d("putSync"),
                    add: d("addSync"),
                    remove: d("removeSync"),
                    fetch: d("fetchSync", !0),
                    fetchRange: d("fetchRangeSync",
                        !0)
                })
            })
        }, "dstore/QueryResults": function () {
            define(["dojo/_base/lang", "dojo/when"], function (e, p) {
                function l(e, d) {
                    return p(this, function (b) {
                        for (var a = 0, f = b.length; a < f; a++)e.call(d, b[a], a, b)
                    })
                }

                return function (n, d) {
                    var b = d && "totalLength" in d;
                    if (n.then) {
                        n = e.delegate(n);
                        var a = n.then(function (a) {
                            var c = b ? d.totalLength : a.totalLength || a.length;
                            a.totalLength = c;
                            return !b && c
                        });
                        n.totalLength = b ? d.totalLength : a;
                        n.response = d && d.response
                    } else n.totalLength = b ? d.totalLength : n.length;
                    n.forEach = l;
                    return n
                }
            })
        }, "dstore/SimpleQuery": function () {
            define(["dojo/_base/declare",
                "dojo/_base/array"], function (e, p) {
                function l(d, b) {
                    if (-1 < d.indexOf(".")) {
                        var a = d.split("."), f = a.length;
                        return function (c) {
                            for (var d = 0; d < f; d++)c = c && (b && c.get ? c.get(a[d]) : c[a[d]]);
                            return c
                        }
                    }
                    return function (a) {
                        return a.get ? a.get(d) : a[d]
                    }
                }

                var n = {
                    eq: function (d, b) {
                        return d === b
                    }, "in": function (d, b) {
                        return -1 < p.indexOf(b.data || b, d)
                    }, ne: function (d, b) {
                        return d !== b
                    }, lt: function (d, b) {
                        return d < b
                    }, lte: function (d, b) {
                        return d <= b
                    }, gt: function (d, b) {
                        return d > b
                    }, gte: function (d, b) {
                        return d >= b
                    }, match: function (d, b, a) {
                        return b.test(d,
                            a)
                    }, contains: function (d, b, a, f) {
                        var c = this;
                        return p.every(b.data || b, function (b) {
                            if ("object" === typeof b && b.type) {
                                var e = c._getFilterComparator(b.type);
                                return p.some(d, function (d) {
                                    return e.call(c, d, b.args[1], a, f)
                                })
                            }
                            return -1 < p.indexOf(d, b)
                        })
                    }
                };
                return e(null, {
                    _createFilterQuerier: function (d) {
                        function b(d) {
                            var e = d.type;
                            d = d.args;
                            var q = f._getFilterComparator(e);
                            if (q) {
                                var k = d[0], m = l(k, a), h = d[1];
                                h && h.fetchSync && (h = h.fetchSync());
                                return function (a) {
                                    return q.call(f, m(a), h, a, k)
                                }
                            }
                            switch (e) {
                                case "and":
                                case "or":
                                    for (var t =
                                        0, n = d.length; t < n; t++) {
                                        var u = b(d[t]);
                                        c = c ? function (a, b) {
                                            return "and" === e ? function (c) {
                                                return a(c) && b(c)
                                            } : function (c) {
                                                return a(c) || b(c)
                                            }
                                        }(c, u) : u
                                    }
                                    return c;
                                case "function":
                                    return d[0];
                                case "string":
                                    t = f[d[0]];
                                    if (!t)throw Error("No filter function " + d[0] + " was found in the collection");
                                    return t;
                                case void 0:
                                    return function () {
                                        return !0
                                    };
                                default:
                                    throw Error('Unknown filter operation "' + e + '"');
                            }
                        }

                        var a = this.queryAccessors, f = this, c = b(d);
                        return function (a) {
                            return p.filter(a, c)
                        }
                    }, _getFilterComparator: function (d) {
                        return n[d] ||
                            this.inherited(arguments)
                    }, _createSelectQuerier: function (d) {
                        return function (b) {
                            var a = d.length;
                            return p.map(b, d instanceof Array ? function (b) {
                                for (var c = {}, g = 0; g < a; g++) {
                                    var e = d[g];
                                    c[e] = b[e]
                                }
                                return c
                            } : function (a) {
                                return a[d]
                            })
                        }
                    }, _createSortQuerier: function (d) {
                        var b = this.queryAccessors;
                        return function (a) {
                            a = a.slice();
                            a.sort("function" == typeof d ? d : function (a, c) {
                                for (var g = 0; g < d.length; g++) {
                                    var e, q = d[g];
                                    if ("function" == typeof q)e = q(a, c); else {
                                        e = q.get || (q.get = l(q.property, b));
                                        var q = q.descending, k = e(a);
                                        e = e(c);
                                        null != k && (k = k.valueOf());
                                        null != e && (e = e.valueOf());
                                        e = k === e ? 0 : !!q === (null === k || k > e && null !== e) ? -1 : 1
                                    }
                                    if (0 !== e)return e
                                }
                                return 0
                            });
                            return a
                        }
                    }
                })
            })
        }, "dstore/Tree": function () {
            define(["dojo/_base/declare"], function (e) {
                return e(null, {
                    constructor: function () {
                        this.root = this
                    }, mayHaveChildren: function (e) {
                        return "hasChildren" in e ? e.hasChildren : !0
                    }, getRootCollection: function () {
                        return this.root.filter({parent: null})
                    }, getChildren: function (e) {
                        return this.root.filter({parent: this.getIdentity(e)})
                    }
                })
            })
        }, "xide/data/TreeMemory": function () {
            define(["dojo/_base/declare",
                "xide/data/Memory", "dstore/Tree", "dojo/Deferred", "dstore/QueryResults"], function (e, p, l, n, d) {
                return e("xide.data.TreeMemory", [p, l], {
                    _state: {filter: null}, parentField: "parentId", parentProperty: "parentId", reset: function () {
                        this._state.filter = null;
                        this.resetQueryLog()
                    }, resetQueryLog: function () {
                        this.queryLog = []
                    }, fetchRange: function () {
                        var b = this._fetchRange(arguments);
                        return new d(b.then(function (a) {
                            return a
                        }), {
                            totalLength: b.then(function (a) {
                                return a.length
                            })
                        })
                    }, filter: function (b) {
                        var a = this.inherited(arguments);
                        this._state.filter = b;
                        return a
                    }, _fetchRange: function (b) {
                        var a = new n;
                        b = this.fetchRangeSync(b);
                        if (this._state.filter) {
                            if (this._state.filter.parent) {
                                var d = this.getSync(this._state.filter.parent);
                                d && (this.reset(), b = {}, this.getChildrenSync ? b = this.getChildrenSync(d) : (b[this.parentField] = d[this.idProperty], b = this.root.query(b)))
                            }
                            this._state && this._state.filter && this._state.filter.group && (this.getSync(this._state.filter.parent), d && (this.reset(), b = d.items))
                        }
                        a.resolve(b);
                        return a
                    }, children: function (b) {
                        for (var a =
                            this.root.data, d = [], c = 0; c < a.length; c++) {
                            var g = a[c];
                            g[this.parentField] == b[this.idProperty] && d.push(g)
                        }
                        return a
                    }, mayHaveChildren: function (b) {
                        return !1 === b._mayHaveChildren ? !1 : !0
                    }
                })
            })
        }, "xide/data/Memory": function () {
            define(["dojo/_base/declare", "dstore/Memory", "xide/data/_Base"], function (e, p, l) {
                return e("xide.data.Memory", [p, l], {
                    putSync: function (e) {
                        var d = this;
                        (e = this.inherited(arguments)) && !e._store && Object.defineProperty(e, "_store", {
                            get: function () {
                                return d
                            }
                        });
                        return e
                    }
                })
            })
        }, "xide/data/ObservableStore": function () {
            define(["dojo/_base/declare",
                "xide/types", "xide/mixins/EventedMixin"], function (e, p, l) {
                return e("xide/data/Observable", l, {
                    _ignoreChangeEvents: !0, observedProperties: [], mute: !1, destroy: function () {
                        _.each(this.query(), function (e) {
                            !0 === e.destroyOnRemove && e.destroy && e.destroy()
                        });
                        return this.inherited(arguments)
                    }, silent: function (e) {
                        if (!0 === e || !1 === e && e !== this._ignoreChangeEvents)this._ignoreChangeEvents = e
                    }, putSync: function (e, d) {
                        this.silent(!d);
                        var b = this.inherited(arguments), a = this;
                        !1 !== d && this.emit("added", b);
                        b && !b._store && Object.defineProperty(b,
                            "_store", {
                                get: function () {
                                    return a
                                }
                            });
                        this.silent(!1);
                        return b
                    }, removeSync: function (e, d) {
                        this.silent(d);
                        var b = this.getSync(e);
                        b && b.onRemove && b.onRemove();
                        b = this.inherited(arguments);
                        this.silent(!1);
                        return b
                    }, postscript: function () {
                        var e = this;
                        e.inherited(arguments);
                        if (e.on)e.on("add", function (d) {
                            d = d.target;
                            e._observe(d);
                            d._store || (d._store = e);
                            d.onAdd && d.onAdd(d)
                        })
                    }, _onItemChanged: function (e, d, b, a) {
                        this._ignoreChangeEvents || (d = {
                            target: e,
                            property: d,
                            value: b,
                            source: a
                        }, this.emit("update", d), e.onItemChanged &&
                        e.onItemChanged(d))
                    }, _observe: function (e) {
                        var d = this, b = d.observedProperties;
                        e && e.observed && (b = b.concat(e.observed));
                        b && b.forEach(function (a) {
                            e.property ? e.property(a).observe(function (b) {
                                d._onItemChanged(e, a, b, d)
                            }) : console.error("item.prop !")
                        })
                    }, setData: function (e) {
                        this.inherited(arguments);
                        this.silent(!0);
                        e && _.each(e, this._observe, this);
                        this.silent(!1)
                    }
                })
            })
        }, "dstore/Trackable": function () {
            define("dojo/_base/lang dojo/_base/declare dojo/aspect dojo/when dojo/promise/all dojo/_base/array dojo/on".split(" "),
                function (e, p, l, n, d, b, a) {
                    function f(a, b, c) {
                        for (var d = a.length - 1; 0 <= d; --d) {
                            var h = a[d], f = h.start, h = f + h.count;
                            if (b > h) {
                                a.splice(d + 1, 0, {start: b, count: c - b});
                                return
                            }
                            c >= f && (b = Math.min(b, f), c = Math.max(c, h), a.splice(d, 1))
                        }
                        a.unshift({start: b, count: c - b})
                    }

                    var c = 0, g = {
                        track: function () {
                            function d() {
                                return function () {
                                    var a = this, b = this.inherited(arguments);
                                    n(b, function (b) {
                                        b = a._results = b.slice();
                                        a._partialResults && (a._partialResults = null);
                                        a._ranges = [];
                                        f(a._ranges, 0, b.length)
                                    });
                                    return b
                                }
                            }

                            function g() {
                                return function (a) {
                                    var b =
                                        this, c = a.start, h = a.end, d = this.inherited(arguments);
                                    this._results || n(d, function (a) {
                                        return n(a.totalLength, function (d) {
                                            var k = b._partialResults || (b._partialResults = []);
                                            h = Math.min(h, c + a.length);
                                            k.length = d;
                                            d = [c, h - c].concat(a);
                                            k.splice.apply(k, d);
                                            f(b._ranges, c, h);
                                            return a
                                        })
                                    });
                                    return d
                                }
                            }

                            function k(a, h) {
                                c++;
                                var d = h.target;
                                h = e.delegate(h, v[a]);
                                n(u._results || u._partialResults, function (c) {
                                    if (c) {
                                        var f, k, g, e = u._ranges, t, q = "id" in h ? h.id : m.getIdentity(d), r = -1, n = -1, v = -1, l = -1;
                                        if ("delete" === a || "update" === a)for (f = 0; -1 ===
                                        r && f < e.length; ++f)for (t = e[f], k = t.start, g = k + t.count; k < g; ++k)if (m.getIdentity(c[k]) == q) {
                                            r = h.previousIndex = k;
                                            n = f;
                                            c.splice(r, 1);
                                            t.count--;
                                            for (k = f + 1; k < e.length; ++k)e[k].start--;
                                            break
                                        }
                                        if ("add" === a || "update" === a) {
                                            if (x) {
                                                if (x([d]).length) {
                                                    var w = 0;
                                                    g = e.length - 1;
                                                    k = -1;
                                                    for (var p; w <= g && -1 === v;)f = w + Math.round((g - w) / 2), t = e[f], n = c.slice(t.start, t.start + t.count), "beforeId" in h && (k = null === h.beforeId ? n.length : B(n, h.beforeId)), -1 === k && (k = r >= Math.max(0, t.start - 1) && r <= t.start + t.count ? r : m.defaultNewToStart ? 0 : n.length), n.splice(k,
                                                        0, d), q = b.indexOf(x(n), d), p = t.start + q, 0 === q && 0 !== t.start ? g = f - 1 : q >= n.length - 1 && p < c.length ? w = f + 1 : (v = p, l = f);
                                                    if (-1 === v && 0 < w && w < e.length)var L = !0
                                                }
                                            } else {
                                                k = -1;
                                                if ("beforeId" in h)if (null === h.beforeId)v = c.length, k = e.length - 1; else for (f = 0, g = e.length; -1 === l && f < g; ++f)t = e[f], v = B(c, h.beforeId, t.start, t.start + t.count), -1 !== v && (l = f); else"update" === a ? (v = r, l = n) : m.defaultNewToStart ? k = v = 0 : (v = c.length, k = e.length - 1);
                                                -1 !== k && -1 === l && (t = e[k]) && t.start <= v && v <= t.start + t.count && (l = k)
                                            }
                                            if (-1 < v && -1 < l)for (h.index = v, c.splice(v, 0,
                                                d), e[l].count++, f = l + 1; f < e.length; ++f)e[f].start++; else if (L)for (h.beforeIndex = e[w].start, f = w; f < e.length; ++f)e[f].start++
                                        }
                                        h.totalLength = c.length
                                    }
                                    (c = u["on_tracked" + a]) && c.call(u, h)
                                })
                            }

                            var m = this.store || this, h = [], t = {add: 1, update: 1, "delete": 1}, w;
                            for (w in t)h.push(this.on(w, function (a) {
                                return function (b) {
                                    k(a, b)
                                }
                            }(w)));
                            var u = p.safeMixin(e.delegate(this), {
                                _ranges: [], fetch: d(), fetchRange: g(), releaseRange: function (a, b) {
                                    if (this._partialResults) {
                                        a:for (var c = this._ranges, h = 0, d; d = c[h]; ++h) {
                                            var f = d.start, k = f + d.count;
                                            if (a <= f)if (b >= k)c.splice(h, 1); else {
                                                d.start = b;
                                                d.count = k - d.start;
                                                break a
                                            } else if (a < k)if (b > f) {
                                                c.splice(h, 1, {start: f, count: a - f}, {start: b, count: k - b});
                                                break a
                                            } else d.count = a - d.start
                                        }
                                        for (c = a; c < b; ++c)delete this._partialResults[c]
                                    }
                                }, on: function (b, c) {
                                    var h = this, d = this.getInherited(arguments);
                                    return a.parse(u, b, c, function (a, b) {
                                        return b in t ? l.after(u, "on_tracked" + b, c, !0) : d.call(h, b, c)
                                    })
                                }, tracking: {
                                    remove: function () {
                                        for (; 0 < h.length;)h.pop().remove();
                                        this.remove = function () {
                                        }
                                    }
                                }, track: null
                            });
                            this.fetchSync && (p.safeMixin(u,
                                {fetchSync: d(), fetchRangeSync: g()}), u.fetchSync());
                            var x;
                            b.forEach(this.queryLog, function (a) {
                                var b = x, c = a.querier;
                                c && (x = b ? function (a) {
                                    return c(b(a))
                                } : c)
                            });
                            var v = {
                                add: {index: void 0},
                                update: {previousIndex: void 0, index: void 0},
                                "delete": {previousIndex: void 0}
                            }, B = function (a, b, c, h) {
                                h = void 0 !== h ? h : a.length;
                                for (c = void 0 !== c ? c : 0; c < h; ++c)if (m.getIdentity(a[c]) === b)return c;
                                return -1
                            };
                            return u
                        }
                    };
                    d = p(null, g);
                    d.create = function (a, b) {
                        a = p.safeMixin(e.delegate(a), g);
                        p.safeMixin(a, b);
                        return a
                    };
                    return d
                })
        }, "xide/manager/ContextBase": function () {
            define("dcl/dcl xide/factory xide/types xide/utils xide/mixins/EventedMixin dojo/_base/kernel dojo/_base/lang".split(" "),
                function (e, p, l, n, d, b, a) {
                    d = e(d.dcl, {
                        declaredClass: "xide.manager.ContextBase",
                        language: "en",
                        managers: [],
                        mixins: null,
                        getModule: function (b) {
                            return a.getObject(n.replaceAll("/", ".", b)) || a.getObject(b) || (e.getObject ? e.getObject(b) || e.getObject(n.replaceAll("/", ".", b)) : null)
                        },
                        createManager: function (a, c, d) {
                            try {
                                this.managers || (this.managers = []);
                                var r = {ctx: this, config: c || this.config};
                                n.mixin(r, d);
                                if (_.isString(a) && this.namespace) {
                                    var q = null, q = -1 == a.indexOf(".") ? this.namespace + a : "" + a;
                                    a = b.getObject(q) && e.getObject(q) ?
                                        q : this.defaultNamespace + a
                                } else _.isObject(a);
                                var k = p.createInstance(a, r);
                                if (k)return this.managers.push(k), p.publish(l.EVENTS.ON_CREATED_MANAGER, {
                                    instance: k,
                                    className: a,
                                    ctx: this,
                                    config: c || this.config
                                }), k
                            } catch (m) {
                                console.error("error creating manager " + m, arguments)
                            }
                        },
                        constructManagers: function () {
                        },
                        initManagers: function () {
                        },
                        doMixins: function (a) {
                            this.mixins = a || this.mixins;
                            for (var c = 0; c < a.length; c++) {
                                var d = a[c], r = b.getObject(d.declaredClass) || e.getObject(d.declaredClass);
                                d.declaredClass === this.declaredClass &&
                                (r = this);
                                r && n.mixin(r.prototype, d.mixin)
                            }
                        }
                    });
                    e.chainAfter(d, "constructManagers");
                    e.chainAfter(d, "initManagers");
                    return d
                })
        }, "nxapp/Commons": function () {
            define("dojo/has dojo/_base/lang nxapp/types/Types xide/factory xide/factory/Events xide/factory/Objects xide/utils/StringUtils xide/utils/HexUtils xide/utils/CIUtils xide/utils/ObjectUtils xide/utils/StoreUtils nxapp/utils/FileUtils xide/utils nxapp/utils dojo/node!os dojo/node!util nxapp/utils/_console".split(" "), function (e, p, l, n, d, b, a, f, c, g, r, q,
                                                                                                                                                                                                                                                                                                                                                     k, m, h, t, w) {
                p = "linux";
                "win32" === h.platform() ? p = "windows" : "darwin" === h.platform() ? p = "osx" : "linux" === h.platform() && "arm" == h.arch() && (p = "arm");
                "arm" === p ? e.add("serialport", function () {
                    return !1
                }) : e.add("serialport", function () {
                    return !0
                });
                k.mixin(m, k);
                k.mixin(k, m);
                k.inspect = function (a) {
                    return t.inspect(a, {depth: null, colors: !0})
                };
                Array.prototype.remove = function () {
                    for (var a, b = arguments, c = b.length, h; c && this.length;)for (a = b[--c]; -1 != (h = this.indexOf(a));)this.splice(h, 1);
                    return this
                };
                Array.prototype.contains =
                    function (a) {
                        for (var b = this.length; b--;)if (this[b] == a)return !0;
                        return !1
                    };
                Array.prototype.indexOfPropertyValue || (Array.prototype.indexOfPropertyValue = function (a, b) {
                    for (var c = 0; c < this.length; c++)if (this[c][a] && this[c][a] == b)return c;
                    return -1
                });
                "function" != typeof String.prototype.startsWith && (String.prototype.startsWith = function (a) {
                    return this.substring(0, a.length) === a
                });
                "function" != typeof String.prototype.endsWith && (String.prototype.endsWith = function (a) {
                    return this.substring(this.length - a.length, this.length) ===
                        a
                });
                return {utils: m, types: l}
            })
        }, "xide/factory/Objects": function () {
            define(["dcl/dcl", "xide/utils", "xide/factory", "xdojo/declare"], function (e, p, l, n) {
                l.createInstance = function (d, b, a) {
                    var f = {};
                    p.mixin(f, b);
                    b = d;
                    if (_.isString(d) && (b = dojo.getObject(b) || e.getObject(b), !b))return console.error("no such class : " + d), null;
                    a && (b = n(a, b.prototype));
                    f.id || (f.id = (b.declaredClass || "no_class_").replace(/\//g, "_") + p.createUUID());
                    (d = new b(f)) && (d.ctrArgs = f);
                    return d
                };
                return l
            })
        }, "xide/utils/CIUtils": function () {
            define(["xide/utils",
                "xide/types", "xide/factory", "dojo/has", "xide/lodash"], function (e, p, l, n, d) {
                e.toOptions = function (b) {
                    b = e.flattenCIS(b);
                    for (var a = [], d = 0; d < b.length; d++) {
                        var c = b[d];
                        a.push({
                            name: e.toString(c.name),
                            value: e.getCIValue(c),
                            type: e.toInt(c.type),
                            enumType: e.toString(c.enumType),
                            visible: e.toBoolean(c.visible),
                            active: e.toBoolean(c.active),
                            changed: e.toBoolean(c.changed),
                            group: e.toString(c.group),
                            user: e.toObject(c.user),
                            dst: e.toString(c.dst),
                            params: e.toString(c.params)
                        })
                    }
                    return a
                };
                if (n("xideve") || n("xblox-ui"))e.getEventsAsOptions =
                    function (b) {
                        var a = [{label: "Select Event", value: ""}], d;
                        for (d in p.EVENTS)a.push({label: p.EVENTS[d], value: p.EVENTS[d]});
                        a = a.concat([{label: "onclick", value: "onclick"}, {
                            label: "ondblclick",
                            value: "dblclick"
                        }, {label: "onmousedown", value: "mousedown"}, {
                            label: "onmouseup",
                            value: "mouseup"
                        }, {label: "onmouseover", value: "mouseover"}, {
                            label: "onmousemove",
                            value: "mousemove"
                        }, {label: "onmouseout", value: "mouseout"}, {
                            label: "onkeypress",
                            value: "keypress"
                        }, {label: "onkeydown", value: "keydown"}, {label: "onkeyup", value: "keyup"},
                            {label: "onfocus", value: "focus"}, {label: "onblur", value: "blur"}, {
                                label: "On Load",
                                value: "Load"
                            }]);
                        for (d = 0; d < a.length; d++) {
                            var c = a[d];
                            if (c.value === b) {
                                c.selected = !0;
                                break
                            }
                        }
                        return a
                    };
                e.flattenCIS = function (b) {
                    for (var a = [], d = [], c = 0; c < b.length; c++) {
                        var g = b[c], r = e.toInt(g.type);
                        r > p.ECIType.END && (r = p.resolveType(r)) && (e.mixin(a, r), d.push(g))
                    }
                    0 < a.length && (b = b.concat(a));
                    if (d)for (c in d)b.remove(d[c]);
                    return b
                };
                e.arrayContains = function (b, a) {
                    for (var d = 0; d < b.length; d++)if (b[d] === a)return !0;
                    return !1
                };
                e.setStoreCIValueByField =
                    function (b, a, d) {
                        null == b[a] && (b[a] = []);
                        b[a][0] = e.getStringValue(d);
                        return b
                    };
                e.createOption = function (b, a, d) {
                    return e.mixin({label: b, value: null != a ? a : b}, d)
                };
                e.createCI = function (b, a, d, c, g) {
                    b = {
                        dataRef: null,
                        dataSource: null,
                        name: b,
                        group: -1,
                        id: b,
                        title: b,
                        type: a,
                        uid: -1,
                        value: null != d ? d : -1,
                        visible: !0,
                        enumType: -1,
                        "class": "cmx.types.ConfigurableInformation"
                    };
                    e.mixin(b, c);
                    g && g.publish && l.publish(g.publish, {CI: b, owner: g.owner}, g.owner);
                    return b
                };
                e.createCIAsArray = function (b, a, d, c) {
                    return {
                        chainType: [d ? d : 0],
                        dataRef: [null],
                        dataSource: [null],
                        params: [],
                        name: [b],
                        group: [-1],
                        id: [b],
                        title: [b],
                        type: [a],
                        uid: [-1],
                        value: [c ? c : -1],
                        visible: [!0],
                        enumType: [-1],
                        parentId: [-1],
                        "class": ["cmx.types.ConfigurableInformation"]
                    }
                };
                e.hasValue = function (b) {
                    return b.value && null != b.value[0] && 0 < b.value[0].length && "0" != b.value[0] && "undefined" != b.value[0] && "Unset" != b.value[0]
                };
                e.hasValueAndDataRef = function (b) {
                    return b.value && null != b.value[0] && 0 < b.value[0].length && "0" != b.value[0] && "undefined" != b.value[0] && "Unset" != b.value[0] && b.dataRef && null != b.dataRef[0] &&
                        0 < b.dataRef[0].length && "0" != b.dataRef[0] && "undefined" != b.dataRef[0]
                };
                e.getInputCIByName = function (b, a) {
                    if (!b)return null;
                    var d = b.inputs;
                    d || (d = b);
                    if (null != d)for (var c = 0; c < d.length; c++) {
                        var g = d[c], r = e.getStringValue(g.name);
                        if (null != r && r.toLowerCase() === a.toLowerCase())return g
                    }
                    return null
                };
                e.getInputCIById = function (b, a) {
                    if (!b)return null;
                    var d = b.inputs;
                    d || (d = b);
                    if (null != d)for (var c = 0; c < d.length; c++) {
                        var g = d[c], r = e.getStringValue(g.id);
                        if (null != r && r.toLowerCase() === a.toLowerCase())return g
                    }
                    return null
                };
                e.getCIByChainAndName = function (b, a, d) {
                    if (!b)return null;
                    (a = 0 == a ? b.inputs : 1 == a ? b.outputs : null) || (a = b);
                    if (null != a)for (b = 0; b < a.length; b++) {
                        var c = a[b], g = e.getStringValue(c.name);
                        if (null != g && g.toLowerCase() === d.toLowerCase())return c
                    }
                    return null
                };
                e.getCIByUid = function (b, a) {
                    if (null != b)for (var d = 0; d < b.length; d++) {
                        var c = b[d], g = e.getStringValue(c.uid);
                        if (null != g && g === a)return c
                    }
                    return null
                };
                e.getCIById = function (b, a, d) {
                    b = 0 == a ? b.inputs : 1 == a ? b.outputs : null;
                    if (null != b)for (a = 0; a < b.length; a++) {
                        var c = b[a];
                        if (c.id[0] ==
                            d[0])return c
                    }
                    return null
                };
                e.getCIInputValueByName = function (b, a) {
                    var d = e.getCIByChainAndName(b, 0, a);
                    return d ? d.value : null
                };
                e.getCIValue = function (b) {
                    return e.getCIValueByField(b, "value")
                };
                e.getStringValue = function (b) {
                    return e.toString(b)
                };
                e.toString = function (b) {
                    return null != b ? d.isArray(b) ? b && 1 == b.length && null == b[0] ? null : "" + (null != b[0] ? b[0] : b) : "" + b : null
                };
                e.setIntegerValue = function (b, a) {
                    null != b && dojo.isArray(b) && (b[0] = a)
                };
                e.getCIValueByField = function (b, a) {
                    return null != b[a] ? d.isArray(b[a]) ? b[a][0] ? b[a][0] :
                        b[a] : b[a] : null
                };
                e.setCIValueByField = function (b, a, d) {
                    if (!b)return b;
                    null == b[a] && (b[a] = []);
                    b[a] = d;
                    return b
                };
                e.setCIValue = function (b, a, d) {
                    (b = e.getInputCIByName(b, a)) && e.setCIValueByField(b, "value", d);
                    return b
                };
                e.getCIInputValueByNameAndField = function (b, a, d) {
                    return (b = e.getCIByChainAndName(b, 0, a)) ? b["" + d] : null
                };
                e.getCIInputValueByNameAndFieldStr = function (b, a, d) {
                    return (b = e.getCIInputValueByNameAndField(b, a, d)) ? e.getStringValue(b) : null
                };
                e.getCIInputValueByNameAndFieldBool = function (b, a, d) {
                    return (b = e.getCIInputValueByNameAndField(b,
                        a, d)) ? e.toBoolean(b) : null
                };
                e.getCIWidgetByName = function (b, a) {
                    for (var d = 0; d < b.length; d++) {
                        var c = b[d];
                        if (c._widget && c.name === a)return c._widget
                    }
                    return null
                };
                return e
            })
        }, "xide/utils/StoreUtils": function () {
            define(["xide/utils", "xide/data/Memory", "dojo/_base/kernel", "xide/lodash"], function (e, p, l, n) {
                e.removeFromStore = function (d, b, a, f, c, g, r) {
                    if (null != b && d) {
                        b = n.isString(b) ? d.getSync(b) || b : b;
                        f = f || d.idProperty;
                        c = c || d.parentProperty;
                        b && d.removeSync(b[f], g);
                        var q = {};
                        q[c] = b[f] ? b[f] : b;
                        !0 === r && n.isObject(b) && e.destroy(b,
                            !0);
                        if (!0 === a && (b = d.query(q)) && b.length)for (q = 0; q < b.length; q++)e.removeFromStore(d, b[q], a, f, c, g, r)
                    }
                };
                e.toString = function (d) {
                    return null != d ? l.isArray(d) ? d && 1 == d.length && null == d[0] ? null : "" + (null != d[0] ? d[0] : d) : "" + d : null
                };
                e.toBoolean = function (d) {
                    var b = !1;
                    null != d && (d = d[0] ? d[0] : d, null != d && (b = !(!0 !== d && "true" !== d && "1" !== d)));
                    return b
                };
                e.toObject = function (d) {
                    return null != d ? d[0] ? d[0] : d : null
                };
                e.toInt = function (d) {
                    if (_.isNumber(d))return d;
                    var b = -1;
                    null != d && (d = 1 < d.length ? d : d[0] ? d[0] : d, null != d && (b = parseInt(d,
                        10)));
                    return b
                };
                e.getStoreItemById = function (d, b) {
                    return e.queryStoreEx(d, {id: b}, null, null)
                };
                e.getAppDataElementByIdAndType = function (d, b, a) {
                    return e.queryStore(d, {uid: b, type: a}, null, null)
                };
                e.getElementsByType = function (d, b) {
                    return e.queryStoreEx(d, {type: b})
                };
                e.queryStoreEx = function (d, b, a, f) {
                    if (!d)return console.error("utils.queryStoreEx: store \x3d null"), null;
                    if (d instanceof p)return d = e.queryMemoryStoreEx(d, b), f && d && d[0] ? d[0] : d;
                    var c = null;
                    d.query && (c = d.query(b));
                    return !0 === a && c && 0 === c.length ? null :
                        !0 === f && c && 1 == c.length ? c[0] : c
                };
                e.queryStore = function (d, b, a) {
                    return (d = e.queryStoreEx(d, b, null, null)) && 1 == d.length ? d[0] : !0 === a && d && 0 === d.length ? null : d
                };
                e.queryMemoryStoreEx = function (d, b) {
                    var a = [];
                    d.query(b).forEach(function (b) {
                        a.push(b)
                    });
                    return a
                };
                e.queryMemoryStoreSingle = function (d, b) {
                    var a = e.queryMemoryStoreEx(d, b);
                    return 1 == a.length ? a[0] : a
                };
                return e
            })
        }, "nxapp/manager/FileManager": function () {
            define("dcl/dcl dojo/has nxapp/manager/ManagerBase nxapp/utils/_LogMixin xide/types xide/factory dojo/node!path dojo/node!fs dojo/node!child_process dojo/node!chokidar".split(" "),
                function (e, p, l, n, d, b, a, f, c, g) {
                    p("windows");
                    p("arm");
                    return e([l, n], {
                        declaredClass: "nxapp.manager.FileManager", watcher: null, resolve: function (b) {
                            var c = "", d = a.resolve(dojoConfig.libRoot), m = a.resolve(dojoConfig.clientRoot);
                            if (f.existsSync(a.resolve(b)))return b;
                            "/" == b[0] ? a.resolve(b) : a.resolve(d + "/" + b) ? c = a.resolve(d + "/" + b) : f.existsSync(a.resolve(b)) ? c = a.resolve(b) : a.resolve(m + "/" + b) && (c = a.resolve(m + "/" + b));
                            return c
                        }, watch: function (a, b) {
                            try {
                                console.log("watch directory : " + this.resolve(a)), f.existsSync(a) &&
                                b && this.watcher && this.watcher.add && this.watcher.add(a)
                            } catch (c) {
                            }
                        }, initChokidar: function (c) {
                            for (var e = 0; e < c.watchr.paths.length; e++) {
                                var k = c.watchr.paths[e], m = a.resolve(dojoConfig.libRoot), h = a.resolve(dojoConfig.clientRoot);
                                "/" == k[0] ? k = a.resolve(k) : a.resolve(k) && f.existsSync(k) ? c.watchr.paths[e] = a.resolve(k) : f.existsSync(a.resolve(m + "/" + k)) ? c.watchr.paths[e] = a.resolve(m + "/" + k) : f.existsSync(a.resolve(k)) ? c.watchr.paths[e] = a.resolve(k) : a.resolve(h + "/" + k) && (c.watchr.paths[e] = a.resolve(h + "/" + k))
                            }
                            var t =
                                this, n = g.watch(c.watchr.paths, {
                                persistent: !0,
                                ignoreInitial: !0,
                                awaitWriteFinish: !0
                            });
                            n.on("addDir", function (a) {
                                n.add(a);
                                b.publish(d.EVENTS.ON_FILE_CHANGED, {
                                    path: a,
                                    modulePath: a.replace(dojoConfig.libRoot, "")
                                }, t)
                            });
                            n.on("add", function (a) {
                                b.publish(d.EVENTS.ON_FILE_CHANGED, {
                                    path: a,
                                    modulePath: a.replace(dojoConfig.libRoot, ""),
                                    type: "added"
                                }, t)
                            });
                            n.on("unlinkDir", function (a) {
                                n.unwatch(a);
                                b.publish(d.EVENTS.ON_FILE_CHANGED, {
                                    path: a,
                                    modulePath: a.replace(dojoConfig.libRoot, ""),
                                    type: "delete"
                                }, t)
                            });
                            n.on("change",
                                function (a) {
                                    t.publish(d.EVENTS.ON_FILE_CHANGED, {
                                        path: a,
                                        modulePath: a.replace(dojoConfig.libRoot, ""),
                                        type: "changed"
                                    }, t)
                                });
                            n.on("raw", function (a, c, h) {
                                if ("rename" === a)try {
                                    var k = k.statSync(h.watchedPath)
                                } catch (m) {
                                    -1 !== h.watchedPath.indexOf(c) && b.publish(d.EVENTS.ON_FILE_CHANGED, {
                                        path: h.watchedPath,
                                        modulePath: h.watchedPath.replace(dojoConfig.libRoot, ""),
                                        type: "delete"
                                    }, t)
                                }
                            });
                            this.watcher = n
                        }, initWindows_Watchr: function (c) {
                            for (var g = 0; g < c.watchr.paths.length; g++) {
                                var k = c.watchr.paths[g], m = a.resolve(dojoConfig.libRoot),
                                    h = a.resolve(dojoConfig.clientRoot);
                                "/" == k[0] ? k = a.resolve(k) : a.resolve(m + "/" + k) ? c.watchr.paths[g] = a.resolve(m + "/" + k) : f.existsSync(a.resolve(k)) ? c.watchr.paths[g] = a.resolve(k) : a.resolve(h + "/" + k) && (c.watchr.paths[g] = a.resolve(h + "/" + k))
                            }
                            _.each(c.watchr.paths, function (a) {
                            });
                            var e = this;
                            watchr.watch({
                                paths: c.watchr.paths, interval: 500, listeners: {
                                    log: function (a) {
                                    }, error: function (a) {
                                        console.log("an error occured:", a)
                                    }, watching: function (a, b, c) {
                                    }, change: function (a, c, h, k) {
                                        c && b.publish(d.EVENTS.ON_FILE_CHANGED,
                                            {path: c, modulePath: c.replace(dojoConfig.libRoot, "")}, e)
                                    }
                                }, next: function (a, b) {
                                    if (a)return console.log("watching everything failed with error", a);
                                    console.log("watching everything completed")
                                }
                            })
                        }, initWindows: function (b) {
                            for (var d = 0; d < b.watchr.paths.length; d++) {
                                var k = b.watchr.paths[d], m = a.resolve(dojoConfig.libRoot), h = a.resolve(dojoConfig.clientRoot);
                                "/" == k[0] ? k = a.resolve(k) : a.resolve(m + "/" + k) ? b.watchr.paths[d] = a.resolve(m + "/" + k) : f.existsSync(a.resolve(k)) ? b.watchr.paths[d] = a.resolve(k) : a.resolve(h + "/" +
                                    k) && (b.watchr.paths[d] = a.resolve(h + "/" + k))
                            }
                            var g = new function (a, b, d, h) {
                                var k = c.spawn;
                                a = k(a, b);
                                var m = this;
                                a.stdout.on("data", function (a) {
                                    d(m, a)
                                });
                                a.stdout.on("end", h)
                            }(a.resolve(global.cwd + "/inotifywait.exe"), ["-r", "-m", "-q", "--format\x3d%w|%e|%f", b.watchr.paths[0]], function (b, c) {
                                b.stdout = "";
                                for (var d = c.toString().split(/(\r?\n)/g), h = 0; h < d.length; h++) {
                                    var k = d[h];
                                    k && 5 < k.length && (k = k.split("|"), 3 == k.length && a.resolve(k[0] + "/" + k[2]))
                                }
                            }, function () {
                                console.log("end : " + g.stdout)
                            })
                        }, init: function (a) {
                            return this.initChokidar(a)
                        },
                        initLinux: function (c, g) {
                            for (var k = 0; k < c.watchr.paths.length; k++) {
                                var m = c.watchr.paths[k], h = a.resolve(dojoConfig.libRoot), e = a.resolve(dojoConfig.clientRoot);
                                "/" == m[0] ? m = a.resolve(m) : a.resolve(h + "/" + m) ? c.watchr.paths[k] = a.resolve(h + "/" + m) : f.existsSync(a.resolve(m)) ? c.watchr.paths[k] = a.resolve(m) : a.resolve(e + "/" + m) && (c.watchr.paths[k] = a.resolve(e + "/" + m))
                            }
                            for (var n = this, l = function (a) {
                                var b = [];
                                f.existsSync(a) && f.readdirSync(a).forEach(function (c) {
                                    c = a + "/" + c;
                                    var d = f.statSync(c);
                                    d && d.isDirectory() && (b.push(c),
                                        b = b.concat(l(c)))
                                });
                                return b
                            }, m = function () {
                                return {
                                    all_events: function (c) {
                                        if (c && c.name && c.name.indexOf && -1 == c.name.indexOf(".git") && -1 == c.name.indexOf(".tmp") && -1 == c.name.indexOf("_jb_old_") && -1 == c.name.indexOf("_jb_bak_") && -1 == c.masks.toString().indexOf("access")) {
                                            c.masks.toString().indexOf("moved_to");
                                            var h = a.resolve(c.watch + "/" + c.name), k = "changed";
                                            -1 !== c.masks.toString().replace("all_events,", "").indexOf("delete") && (k = "deleted");
                                            h && b.publish(d.EVENTS.ON_FILE_CHANGED, {
                                                path: h, modulePath: h.replace(dojoConfig.libRoot,
                                                    ""), type: k
                                            }, n)
                                        }
                                    }, close_write: function (c) {
                                        -1 == c.name.indexOf(".git") && -1 == c.name.indexOf(".tmp") && -1 == c.name.indexOf("_jb_old_") && -1 == c.name.indexOf("_jb_bak_") && -1 == c.masks.toString().indexOf("access") && -1 == c.masks.toString().indexOf("moved_to") && (c = a.resolve(c.watch + "/" + c.name)) && b.publish(d.EVENTS.ON_FILE_CHANGED, {
                                            path: c,
                                            modulePath: c.replace(dojoConfig.libRoot, "")
                                        }, n)
                                    }, access: !0, moved_to: !0, moved_from: !0, "delete": !0
                                }
                            }(), h = g.create(!1), e = 0; e < c.watchr.paths.length; e++)if (k = c.watchr.paths[e], f.existsSync(k)) {
                                var p =
                                    l(k);
                                h.watch(m, k);
                                for (k = 0; k < p.length; k++)h.watch(m, p[k])
                            }
                        }
                    })
                })
        }, "nxapp/manager/ExportManager": function () {
            define("dcl/dcl nxapp/manager/ManagerBase nxapp/manager/_Drivers_Devices nxapp/utils/_LogMixin nxapp/utils/_console xide/utils nxapp/utils dojo/node!path dojo/node!fs-jetpack dojo/node!cheerio dojo/node!fs dojo/has".split(" "), function (e, p, l, n, d, b, a, f, c, g, r, q) {
                return e([p, n, l], {
                    declaredClass: "nxapp.manager.ExportManager",
                    options: null,
                    serverTemplates: null,
                    linux32: !0,
                    linux64: !0,
                    osx: !0,
                    arm: !0,
                    windows: !0,
                    nginxOptions: null,
                    mongoOptions: null,
                    serverOptions: null,
                    init: function (a) {
                        this.profile = a
                    },
                    run: function (a) {
                        this.delegate = a;
                        this.initWithOptions(this.options)
                    },
                    onProgress: function (a) {
                        this.delegate && this.delegate.onProgress(a);
                        d.log("Progress:  " + a)
                    },
                    onError: function (a) {
                        this.delegate && this.delegate.onError(a)
                    },
                    onFinish: function (a) {
                        this.delegate && this.delegate.onFinish(a);
                        d.log("Finish:  " + a)
                    },
                    initWithOptions: function (c) {
                        this.options = c;
                        b.mixin(this, c);
                        this.onProgress("Export Manager: begin export", {progress: 0});
                        if (!this.root)throw this.onError("Export Manager: have no root"), Error("Export Manager: have no root");
                        if (!this.data)throw this.onError("Export Manager: have no data"), Error("Export Manager: have no data");
                        if (this.user) {
                            this.client || (this.client = a.resolve(this.root + "/Code/client/"));
                            this.serverTemplates || (this.serverTemplates = a.resolve(this.root + "/server-template"));
                            this.dist || (this.dist = a.resolve(this.root + "/dist/all/server/"));
                            d.log("export with \n", b.inspect({
                                "System Data": this.data,
                                "User Data": this.user +
                                " \x3d " + f.resolve(this.user),
                                Root: f.resolve(this.root),
                                "Server-Templates": this.serverTemplates,
                                Target: f.resolve(this.target),
                                "Node Servers": f.resolve(this.dist),
                                Client: this.client,
                                "Export Windows": this.windows,
                                "Export Linux - 32 ": this.linux32,
                                "Export Linux - 64 ": this.linux64,
                                "Export OSX": this.osx,
                                "Export ARM": this.arm
                            }));
                            c = b.mixin({
                                port: 8889,
                                templatePath: a.resolve(this.serverTemplates + "/nginx/all/conf/nginx.app.template.conf")
                            }, this.nginxOptions);
                            var m = b.mixin({port: 9997, mongo_port: 27018, mqtt_port: 1884},
                                this.serverOptions);
                            this.exportNGINX(c);
                            this.exportMongo(this.mongoOptions || {});
                            this.createDirectoryLayout();
                            this.exportServer();
                            this.onProgress("Exported Servers", {progress: .2});
                            this.exportUser();
                            this.onProgress("Exported User", {progress: .3});
                            this.exportSystem();
                            this.onProgress("Exported System Data", {progress: .4});
                            this.exportMisc(m);
                            this.onProgress("Exported Misc Data", {progress: .5});
                            this.exportHTML(m);
                            this.onProgress("Exported User Workspace HTML", {progress: .6});
                            this.exportDevices({serverSide: !0});
                            this.onProgress("Exported Devices", {progress: .7});
                            this.exportDrivers({});
                            this.onProgress("Exported Drivers", {progress: .8});
                            this.client ? this.exportClientEx() : this.exportClientDist();
                            this.onProgress("Exported Client Application Assets", {progress: .9});
                            d.log("Export Done! Your application can be found at " + this.target);
                            this.onProgress("Export Done", {progress: 1.2});
                            this.onFinish("Export Done! Your application can be found at " + this.target)
                        } else this.onError("Export Manager: have no user")
                    },
                    exportHTML: function (a) {
                        function b(c,
                                   d) {
                            var m = r.readdirSync(c);
                            m.length && _.each(m, function (b) {
                                if (-1 !== b.indexOf(".dhtml")) {
                                    var m = d.replace(h.path() + "/", "");
                                    g.exportHTMLFile2(c + "/" + b, m, a)
                                }
                            })
                        }

                        var h = c.dir(this.target + "/www/user/workspace/"), g = this;
                        (function (c) {
                            r.existsSync(c) ? r.readdirSync(c).forEach(function (h) {
                                h = c + "/" + h;
                                var e = r.statSync(h);
                                if (e) {
                                    var q = h.replace(f + "/", "");
                                    e.isDirectory() ? b(h, q) : -1 !== h.indexOf(".dhtml") && (q = q.replace(c + "/", ""), g.exportHTMLFile2(h, q, a))
                                } else d.error("cant get stat for " + h)
                            }) : d.error("device path " + c + " doesnt exists");
                            return []
                        })(h.path())
                    },
                    exportHTMLFile2: function (a, d, h) {
                        var e = c.dir(this.root + "/export/"), e = b.readFile(f.resolve(e.path() + "/app.template.html")), q = b.pathinfo(a);
                        d === q.basename && (d = "");
                        d = b.mixin({
                            libRoot: "/Code/client/src/lib",
                            lodashUrl: "/Code/client/src/lib/external/lodash.min.js",
                            requireBaseUrl: "/Code/client/src/lib/xibm/ibm",
                            jQueryUrl: "/Code/client/src/lib/external/jquery-1.9.1.min.js",
                            data: "",
                            user: "/user",
                            css: "./" + b.cleanUrl(q.filename + ".css"),
                            theme: "bootstrap",
                            blox_file: "./" + d + "/" + q.filename + ".xblox",
                            scene_file: "./" + d + "/" + q.filename + ".dhtml",
                            mount: "workspace",
                            VFS_VARS: JSON.stringify({
                                user_drivers: "./www/user/drivers",
                                system_drivers: "./www/system/drivers"
                            }, null, 2)
                        }, h);
                        e = b.replace(e, null, d, {begin: "%", end: "%"});
                        d = b.readFile(a);
                        d = d.replace("\x3cviewHeaderTemplate/\x3e", e);
                        d = d.replace(/\burl\s*\(\s*["']?([^"'\r\n\)\(]+)["']?\s*\)/gi, function (a, b) {
                            var c = b.split("://"), d = c[1];
                            return c[0] && d ? "url('./" + d + "')" : b
                        });
                        e = g.load(d);
                        d = '\n\x3cscript type\x3d"text/javascript"\x3e\n\tvar test \x3d 0;\n\x3c/script\x3e';
                        e("HEAD").append(e(d));
                        b.writeFile(a.replace(".dhtml", ".html"), e.html())
                    },
                    exportHTMLFile: function (a) {
                        var m = c.dir(this.root + "/export/"), h = c.dir(this.target + "/www/user/workspace/"), h = f.resolve(h.path() + "/ascene.dhtml"), m = b.readFile(f.resolve(m.path() + "/app.template.html"));
                        a = b.mixin({
                            libRoot: "/Code/client/src/lib",
                            lodashUrl: "/Code/client/src/lib/external/lodash.min.js",
                            requireBaseUrl: "/Code/client/src/lib/xibm/ibm",
                            jQueryUrl: "/Code/client/src/lib/external/jquery-1.9.1.min.js",
                            data: "",
                            user: "/user",
                            css: "./ascene.css",
                            theme: "bootstrap",
                            blox_file: "./ascene.xblox",
                            mount: "workspace",
                            VFS_VARS: JSON.stringify({
                                user_drivers: "./www/user/drivers",
                                system_drivers: "./www/system/drivers"
                            }, null, 2)
                        }, a);
                        m = b.replace(m, null, a, {begin: "%", end: "%"});
                        a = b.readFile(h);
                        a = a.replace("\x3cviewHeaderTemplate/\x3e", m);
                        a = a.replace(/\burl\s*\(\s*["']?([^"'\r\n\)\(]+)["']?\s*\)/gi, function (a, b) {
                            var c = b.split("://"), h = c[1];
                            return c[0] && h ? (d.error("----" + h), "url('./" + h + "')") : b
                        });
                        a = g.load(a);
                        m = '\n\x3cscript type\x3d"text/javascript"\x3e\n\tvar test \x3d 0;\n\x3c/script\x3e';
                        a("HEAD").append(a(m));
                        b.writeFile(h.replace(".dhtml", ".html"), a.html())
                    },
                    exportDevices: function (a) {
                        var c = f.resolve(this.target + "/www/user/devices"), d = this.getDevices(c, "user_devices", a);
                        b.writeFile(c + "/user_devices.json", JSON.stringify({items: d}, null, 2));
                        c = f.resolve(this.target + "/www/system/devices");
                        d = this.getDevices(c, "system_devices", a);
                        b.writeFile(c + "/system_devices.json", JSON.stringify({items: d}, null, 2))
                    },
                    exportDrivers: function (a) {
                        var c = f.resolve(this.target + "/www/user/drivers");
                        a = this.getDrivers(c,
                            "user_drivers");
                        b.writeFile(c + "/user_drivers.json", JSON.stringify({items: a}, null, 2));
                        c = f.resolve(this.target + "/www/system/drivers");
                        a = this.getDrivers(c, "system_drivers");
                        b.writeFile(c + "/system_drivers.json", JSON.stringify({items: a}, null, 2))
                    },
                    exportMisc: function (d) {
                        var g = c.dir(this.root + "/export"), h = c.dir(this.target);
                        c.copy(g.path(), h.path(), {matching: ["**"], overwrite: !0});
                        var e = a.readFile(f.resolve(g.path() + "/profile_device_server.json")), e = b.replace(e, null, d, {
                            begin: "%",
                            end: "%"
                        });
                        "false" !== this.linux32 &&
                        c.exists(h.path() + f.sep + "/server/linux_32/nxappmain/profile_device_server.json") && b.writeFile(h.path() + f.sep + "/server/linux_32/nxappmain/profile_device_server.json", e);
                        "false" !== this.linux64 && c.exists(h.path() + f.sep + "/server/linux_64/nxappmain/profile_device_server.json") && b.writeFile(h.path() + f.sep + "/server/linux_64/nxappmain/profile_device_server.json", e);
                        "false" !== this.windows && c.exists(h.path() + f.sep + "/server/windows/nxappmain/profile_device_server.json") && "false" !== this.windows && b.writeFile(h.path() +
                            f.sep + "/server/windows/nxappmain/profile_device_server.json", e);
                        "false" !== this.arm && c.exists(h.path() + f.sep + "/server/arm/nxappmain/profile_device_server.json") && b.writeFile(h.path() + f.sep + "/server/arm/nxappmain/profile_device_server.json", e);
                        "false" !== this.osx && c.exists(h.path() + f.sep + "/server/osx_64/nxappmain/profile_device_server.json") && b.writeFile(h.path() + f.sep + "/server/osx_64/nxappmain/profile_device_server.json", e);
                        e = a.readFile(f.resolve(g.path() + "/start.js"));
                        e = b.replace(e, null, d, {
                            begin: "%",
                            end: "%"
                        });
                        "false" !== this.linux32 && c.exists(h.path() + "/server/linux_32/start.js") && b.writeFile(h.path() + "/server/linux_32/start.js", e);
                        "false" !== this.linux64 && c.exists(h.path() + "/server/linux_64/start.js") && b.writeFile(h.path() + "/server/linux_64/start.js", e);
                        "false" !== this.windows && b.writeFile(h.path() + "/server/windows/start.js", e);
                        "false" !== this.arm && c.exists(h.path() + "/server/arm/start.js") && b.writeFile(h.path() + "/server/arm/start.js", e);
                        "false" !== this.osx && c.exists(h.path() + "/server/osx_64/start.js") &&
                        b.writeFile(h.path() + "/server/osx_64/start.js", e)
                    },
                    exportClientEx: function () {
                        var a = c.dir(f.resolve(this.client) + ""), b = c.dir(this.target + "/www/Code/client");
                        c.copy(a.path(), b.path(), {matching: ["**"], overwrite: !0})
                    },
                    exportClient: function () {
                        var a = c.dir(this.root + "/Code/client"), b = c.dir(this.target + "/www/Code/client");
                        c.copy(a.path(), b.path(), {matching: ["**"], overwrite: !0})
                    },
                    exportClientDist: function () {
                        var a = c.dir(this.root + "/dist/all/Code/client/"), b = c.dir(this.target + "/www/Code/client");
                        c.copy(a.path(),
                            b.path(), {matching: ["**"], overwrite: !0})
                    },
                    exportUser: function () {
                        var a = c.dir(this.user), b = c.dir(this.target + "/www/user");
                        d.log("export user from " + a.path() + " to " + b.path());
                        try {
                            c.copy(a.path(), b.path(), {
                                matching: ["**", "!./.git/**/*", "!**/**claycenter", "!./claycenter", "!**claycenter"],
                                overwrite: !0
                            })
                        } catch (h) {
                            "EEXIST" === h.code && d.error("Error copying, file exists!", h), "EACCES" === h.code && d.error("Error copying, file access perrmissions!", h), d.error("error : ", h)
                        }
                    },
                    exportSystem: function () {
                        var a = c.dir(this.data +
                            "/system"), b = c.dir(this.target + "/www/system");
                        c.copy(a.path(), b.path(), {matching: ["**"], overwrite: !0})
                    },
                    clean: function () {
                    },
                    copyServer: function (a) {
                        var b = c.dir(this.target + "/server/" + a), h = "";
                        if (this.dist) {
                            if (!c.exists(this.dist + "/" + a))return;
                            h = c.dir(this.dist + "/" + a)
                        } else h = c.dir(this.root + "/server/" + a);
                        if (c.exists(h.path())) {
                            d.info("export Device-Server " + a + " from : " + h.path());
                            try {
                                c.copy(h.path(), b.path(), {matching: ["**"], overwrite: !0})
                            } catch (g) {
                                "EEXIST" === g.code && d.error("Error copying, file exists!",
                                    g), "EACCES" === g.code && d.error("Error copying, file access perrmissions!", g)
                            }
                        }
                    },
                    exportServer: function (a) {
                        "false" !== this.windows && this.copyServer("windows");
                        "false" !== this.linux32 && this.copyServer("linux_32");
                        "false" !== this.linux64 && this.copyServer("linux_64");
                        "false" !== this.arm && this.copyServer("arm");
                        "false" !== this.osx && this.copyServer("osx_64")
                    },
                    createDirectoryLayout: function () {
                        c.dir(this.target + "/data/_MONGO");
                        c.dir(this.target + "/www/");
                        c.dir(this.target + "/nginx/logs")
                    },
                    exportMongo: function (a) {
                        a =
                            c.dir(this.serverTemplates + "/mongo");
                        var b = c.dir(this.target + "/mongo");
                        c.copy(a.path(), b.path(), {
                            matching: "mongod-arm mongod-linux_32 mongod-linux_64 mongod-windows.exe mongod-32.exe mongod-osx".split(" "),
                            overwrite: !0
                        })
                    },
                    exportNGINX: function (g) {
                        var m = c.dir(this.serverTemplates + "/nginx"), h = c.dir(this.target + "/nginx");
                        try {
                            c.copy(m.path(), h.path(), {
                                matching: "nginx-arm nginx-linux_32 nginx-linux_64 nginx-windows.exe nginx-osx msvcr110.dll".split(" "),
                                overwrite: !0
                            })
                        } catch (e) {
                            "EEXIST" === e.code && d.error("Error copying, file exists!",
                                e), "EACCES" === e.code && d.error("Error copying, file access perrmissions!", e), "ETXTBSY" === e.code && d.error("Error copying, file is busy", e)
                        }
                        m = c.dir(this.serverTemplates + "/nginx/all/conf");
                        h = c.dir(this.target + "/nginx");
                        c.copy(m.path(), h.path(), {overwrite: !0});
                        m = c.dir(this.serverTemplates + "/nginx/temp");
                        h = c.dir(this.target + "/nginx/temp");
                        c.copy(m.path(), h.path(), {overwrite: !0});
                        h = a.readFile(g.templatePath);
                        g = b.replace(h, null, g, {begin: "%%", end: "%%"});
                        c.dir(this.serverTemplates + "/nginx/all/conf");
                        h = c.dir(this.target +
                            "/nginx/");
                        b.writeFile(h.path() + f.sep + "nginx.conf", g)
                    }
                })
            })
        }, "nxapp/manager/_Drivers_Devices": function () {
            define("dcl/dcl dojo/node!path dojo/node!fs nxapp/utils xide/utils/StringUtils xide/types nxapp/utils/_console".split(" "), function (e, p, l, n, d, b, a) {
                return e(null, {
                    declaredClass: "nxapp.manager._Drivers_Devices", profile: null, getDevices: function (f, c, g) {
                        function e(h, g) {
                            var f = l.readdirSync(h);
                            f.length && _.each(f, function (f) {
                                if (-1 != f.indexOf(".meta.json")) {
                                    var e = d.getJson(n.readFile(h + p.sep + f), !0, !1);
                                    if (e) {
                                        if (m) {
                                            var q =
                                                n.getCIByChainAndName(e, 0, b.DEVICE_PROPERTY.CF_DEVICE_DRIVER_OPTIONS);
                                            !q || q.value & 1 << b.DRIVER_FLAGS.RUNS_ON_SERVER || (q.value |= 1 << b.DRIVER_FLAGS.RUNS_ON_SERVER)
                                        }
                                        e ? (f = {
                                            isDir: !1,
                                            path: g + "/" + f,
                                            parentId: g,
                                            scope: c,
                                            user: e,
                                            id: n.getCIInputValueByName(e, b.DEVICE_PROPERTY.CF_DEVICE_ID)
                                        }, k.push(f)) : a.error("device has no meta " + h + p.sep + f)
                                    } else a.error("cant get device meta for " + f + " path \x3d " + h + p.sep + f)
                                }
                            })
                        }

                        function q(b) {
                            var c = [];
                            l.existsSync(b) ? l.readdirSync(b).forEach(function (d) {
                                d = b + "/" + d;
                                var g = l.statSync(d);
                                if (g) {
                                    var m = d.replace(f + "/", "");
                                    g.isDirectory() && (k.push({
                                        isDir: !0,
                                        parent: m,
                                        name: m,
                                        path: m
                                    }), e(d, m), c.push(d.replace(f + "/", "")), c = c.concat(q(d)))
                                } else a.error("cant get stat for " + d)
                            }) : a.error("device path " + b + " doesnt exists");
                            return c
                        }

                        require({packages: [{name: c, location: f}]});
                        var k = [];
                        g = g || {};
                        var m = g.serverSide;
                        q(f);
                        return k
                    }, getDrivers: function (f, c, g) {
                        function e(g, h) {
                            var f = l.readdirSync(g);
                            f.length && _.each(f, function (f) {
                                if (-1 != f.indexOf(".meta.json")) {
                                    var e = d.getJson(n.readFile(g + p.sep + f), !0, !1);
                                    if (e) {
                                        var q = n.getCIInputValueByName(e, b.DRIVER_PROPERTY.CF_DRIVER_ID), t = g + "/" + f.replace(".meta.json", ".xblox"), r = d.getJson(n.readFile(t), !0, !1);
                                        r || a.warn("invalid blocks file for driver " + h + "/" + f + " blox path \x3d " + t);
                                        k.push({
                                            isDir: !1,
                                            path: h + "/" + f,
                                            parentId: h,
                                            scope: c,
                                            user: e,
                                            id: q,
                                            blox: r || {},
                                            blockPath: t
                                        })
                                    } else a.error("cant get driver meta " + g + p.sep + f)
                                }
                            })
                        }

                        function q(b) {
                            var c = [];
                            l.existsSync(b) ? l.readdirSync(b).forEach(function (a) {
                                a = b + "/" + a;
                                var d = l.statSync(a);
                                if (d) {
                                    var g = a.replace(p + "/", "");
                                    d.isDirectory() &&
                                    (k.push({
                                        isDir: !0,
                                        parent: g,
                                        name: g,
                                        path: g
                                    }), e(a, g), c.push(a.replace(f + "/", "")), c = c.concat(q(a)))
                                }
                            }) : a.error("driver path " + b + " doesnt exists");
                            return c
                        }

                        require({packages: [{name: c, location: f}]});
                        var k = [];
                        q(f);
                        return k
                    }
                })
            })
        }, "nxapp/client/WebSocket": function () {
            define(["dojo/_base/declare", "dojo/_base/lang", "nxapp/utils/_LogMixin", "nxapp/client/ClientBase", "dojo/node!sockjs-client"], function (e, p, l, n, d) {
                return e("nxapp.client.WebSocket", [n, l], {
                    _socket: null, debugConnect: !0, connect: function (b) {
                        this.options =
                            p.mixin(this.options, b);
                        b = this.options.host;
                        var a = this.options.port;
                        this.options.debug && this.initLogger(this.options.debug);
                        this.log("Sock-JS-Client Connecting to " + b + ":" + a, "socket_client");
                        var f = d.create(b + ":" + a), c = this;
                        f.on("close", function () {
                            console.log("on close!", c.options)
                        });
                        f.on("connection", function () {
                            c.log("socket client connected", "socket_client");
                            f.on("error", function (a) {
                                console.error("Socket client error ")
                            });
                            f.on("end", function () {
                                c.log("socket client connection end", "socket_client")
                            })
                        });
                        this._socket = f
                    }, emit: function (b, a) {
                        this.showDebugMsg("socket_client") && (console.log("Emiting: " + b + " with: "), console.dir(a));
                        this._socket.write(a)
                    }, onSignal: function (b, a) {
                        this._socket.on("data", a)
                    }
                })
            })
        }, "nxapp/client/ClientBase": function () {
            define(["dojo/_base/declare", "dojo/Stateful", "dojo/_base/lang"], function (e, p, l) {
                return e("nxapp.server.ClientBase", [p], {
                    options: null, _defaultOptions: function () {
                        return {}
                    }, init: function (e) {
                        this.options = l.mixin(this._defaultOptions(), e.options)
                    }
                })
            })
        }, "dcl/inherited": function () {
            (function (e) {
                "undefined" != typeof define ? define(["./mini", "./advise"], e) : "undefined" != typeof module ? module.exports = e(require("./mini"), require("./advise")) : e(dcl, advise)
            })(function (e, p) {
                function l(b, a, d) {
                    var c = 3 > arguments.length && b.callee, g = n.call(this, c ? c.ctr : b, c ? c.nom : a);
                    if (g)return g.apply(this, c ? b || a : d)
                }

                function n(b, a) {
                    var f = this.constructor._meta, c, g, e, q;
                    if (!+f.weaver[a]) {
                        if (f) {
                            if (f.chains.hasOwnProperty(a)) {
                                if (c = f.chains[a])for (e = c.length - 1; 0 <= e; --e)if (g = c[e], g.ctr === b)return 0 < e ? c[e - 1] : 0;
                                return
                            }
                            c = f.bases;
                            for (e = c.length -
                                1; 0 <= e && c[e] !== b; --e);
                            if (0 <= e)for (++e, q = c.length; e < q; ++e)if (f = (g = c[e])._meta) {
                                if ((f = f.ownProps).hasOwnProperty(a))return f[a]
                            } else return g.prototype[a]
                        }
                        return d[a]
                    }
                }

                var d = {};
                p.after(e, "_postprocess", function (b, a) {
                    for (var d = a._meta.bases, c = d.length - 1, g, r, q; 0 <= c; --c)if (g = d[c], r = g._meta)r = r.ownProps, e.allKeys(r).some(function (a) {
                        q = r[a];
                        if ("function" == typeof q) {
                            if (q.nom === a)return 1;
                            q.nom = a;
                            q.ctr = g
                        }
                    });
                    a.prototype.inherited = l;
                    a.prototype.getInherited = n
                });
                e.getInherited = l.get = n;
                return e.inherited = l
            })
        },
        "dcl/advise": function () {
            (function (e) {
                "undefined" != typeof define ? define([], e) : "undefined" != typeof module ? module.exports = e() : advise = e()
            })(function () {
                function e(d, b) {
                    this.next_before = this.prev_before = this.next_after = this.prev_after = this.next_around = this.prev_around = this;
                    this.instance = d;
                    this.name = b
                }

                function p(d) {
                    var b = function () {
                        var a, b, c = arguments, g;
                        for (a = d.prev_before; a !== d; a = a.prev_before)a.before.apply(this, c);
                        try {
                            d.prev_around !== d && (b = d.prev_around.around.apply(this, c))
                        } catch (e) {
                            b = e, g = !0
                        }
                        for (a = d.next_after; a !==
                        d; a = a.next_after)a.after.call(this, c, b);
                        if (g)throw b;
                        return b
                    };
                    b.adviceNode = d;
                    return b
                }

                function l(d, b, a) {
                    var f = d[b], c;
                    f && f.adviceNode && f.adviceNode instanceof e ? c = f.adviceNode : (c = new e(d, b), f && f.advices ? (f = f.advices, c.add(f.before, f.after, f.around)) : c.add(0, 0, f), d[b] = p(c));
                    "function" == typeof a && (a = a(b, d));
                    return c.add(a.before, a.after, 0, a.around)
                }

                var n = e.prototype = {
                    add: function (d, b, a, f) {
                        var c = new e(this.instance, this.name);
                        c.parent = this;
                        c.before = d;
                        this._add("before", c);
                        c.after = b;
                        this._add("after",
                            c);
                        c.around = a;
                        this._add("around", c, f);
                        if (c.original = f)c.around = l._instantiate(f, c.prev_around.around, this);
                        return c
                    }, _add: function (d, b, a) {
                        if (b[d] || a)a = "next_" + d, d = "prev_" + d, (b[d] = this[d])[a] = (b[a] = this)[d] = b
                    }, remove: function (d) {
                        this._remove("before", d);
                        this._remove("after", d);
                        this._remove("around", d)
                    }, _remove: function (d, b) {
                        var a = "next_" + d, f = "prev_" + d;
                        b[a][f] = b[f];
                        b[f][a] = b[a]
                    }, destroy: function () {
                        var d = this.prev_around.around, b = this.next_around, a = this.parent;
                        this.remove(this);
                        if (b !== this)for (; b !==
                                              a; d = b.around, b = b.next_around)b.original && (b.around = l._instantiate(b.original, d, this));
                        this.instance = 0
                    }
                };
                n.unadvise = n.destroy;
                l.before = function (d, b, a) {
                    return l(d, b, {before: a})
                };
                l.after = function (d, b, a) {
                    return l(d, b, {after: a})
                };
                l.around = function (d, b, a) {
                    return l(d, b, {around: a})
                };
                l.Node = e;
                l._instantiate = function (d, b, a) {
                    return d(b)
                };
                return l
            })
        }, "nxapp/manager/DeviceServerContext": function () {
            define("dcl/dcl nxapp/manager/Context nxapp/Commons xcf/types/Types dojo/node!path dojo/node!fs nxapp/utils xide/types nxapp/manager/DriverManager xcf/manager/DeviceManager nxapp/manager/FileManager xcf/manager/Context nxapp/manager/DeviceManager xcf/manager/BlockManager xide/manager/ResourceManager xblox/factory/Blocks dojo/node!tracer nxapp/utils/_console nxapp/manager/_Drivers_Devices dojo/_base/lang dojo/promise/all require dojo/has nxapp/manager/TestManager".split(" "),
                function (e, p, l, n, d, b, a, f, c, g, r, q, k, m, h, t, w, u, x, v, B, y, E, J) {
                    var G = e(null, {
                        declaredClass: "DeviceServerClientClass", write: function (a) {
                            u.error("device server client write", a)
                        }, emit: function (a) {
                            u.error("device server client emit", a)
                        }
                    }), D = null, z = e(null, {
                        owner: null,
                        remoteAddress: "fake - address",
                        remotePort: "fake - port",
                        isExternal: function () {
                            return !1
                        },
                        constructor: function (b) {
                            a.mixin(this, b)
                        },
                        write: function (b) {
                            var c = this.owner.getDeviceManager(), d = a.getJson(b), d = d || {};
                            if (d.data && d.data.device) {
                                var h = c.getDeviceStoreItem(d.data.device);
                                if (h)if (h = c.toDeviceControlInfo(h)) {
                                    if (!h.serverSide)return
                                } else u.error("no info")
                            }
                            if (d && d.data && d.data.deviceMessage && d.data.deviceMessage.event === f.EVENTS.ON_COMMAND_FINISH)c.onCommandFinish(d.data.device, d.data.deviceMessage); else if (d.data && d.data.deviceMessage && d.data.deviceMessage.event === f.EVENTS.ON_COMMAND_ERROR)c.onCommandError(d.data.device, d.data.deviceMessage); else if (d.event === f.EVENTS.ON_DEVICE_DISCONNECTED)c.publish(f.EVENTS.ON_DEVICE_DISCONNECTED, d.data); else {
                                if (d.event === f.EVENTS.SET_DEVICE_VARIABLES)return c.onSetDeviceServerVariables(d.data);
                                if (d.event === f.EVENTS.ON_DEVICE_CONNECTED)c.publish(f.EVENTS.ON_DEVICE_CONNECTED, d.data); else if (d.event !== f.EVENTS.ON_SERVER_LOG_MESSAGE)if (d.event === f.EVENTS.ON_MQTT_MESSAGE)c.publish(f.EVENTS.ON_MQTT_MESSAGE, d.data), c.onMQTTMessage(d.data); else if (d.event !== f.EVENTS.ON_FILE_CHANGED)c.onDeviceServerMessage({data: b})
                            }
                        },
                        emit: function () {
                            u.error("device server client emit", arguments)
                        }
                    });
                    return e([p, q, x], {
                        declaredClass: "nxapp.manager.DeviceServerContext",
                        profile: null,
                        testManager: null,
                        getTestManager: function () {
                            return this.testManager
                        },
                        doTests: function () {
                            return this.getTestManager().doTests()
                        },
                        initManagers: function (a) {
                            a && (this.profile = a);
                            this.testManager && this.testManager.init(a);
                            this.deviceManager.init();
                            this.driverManager.init();
                            this.blockManager.init();
                            this.fileManager.init(a);
                            this.blockManager.onReady();
                            var b = this;
                            this.subscribe(f.EVENTS.ON_FILE_CHANGED, function (a) {
                                b.onXIDEMessage({event: f.EVENTS.ON_FILE_CHANGED, data: a, type: a.type}, !1);
                                b.fileChanged(a);
                                b.deviceManager.onFileChanged(a);
                                b.driverManager.onFileChanged(a);
                                b.getDeviceServer().broadCastMessage(f.EVENTS.ON_FILE_CHANGED,
                                    {path: a.path, modulePath: a.modulePath, mask: a.mask, type: a.type})
                            })
                        },
                        getModule: function (b) {
                            return v.getObject(a.replaceAll("/", ".", b)) || v.getObject(b) || (e.getObject ? e.getObject(b) || e.getObject(a.replaceAll("/", ".", b)) : null)
                        },
                        _reloadModule: function (b, c) {
                            function d(a) {
                                u.log(a.src, a.id);
                                u.error("require error " + b, a);
                                h.remove()
                            }

                            var h = null;
                            if (-1 === b.indexOf(".json") && -1 != b.indexOf(".js") && -1 === b.indexOf("/build/")) {
                                b = b.replace("0/8", "0.8");
                                var g = v.getObject(a.replaceAll("/", ".", b)) || v.getObject(b);
                                if (g &&
                                    g.prototype && g.prototype.reloadModule)g.prototype.reloadModule(); else {
                                    var h = y.on("error", d), k = this.getModule(b);
                                    if (!k && (k = "undefined" !== typeof b ? k : null, !k && "undefined" !== typeof window))if (k = a.getAt(window, a.replaceAll("/", ".", b), null))g = k; else try {
                                        k = y(a.replaceAll(".", "/", b))
                                    } catch (m) {
                                    }
                                    k && (g = k);
                                    y.undef(b);
                                    var e = this;
                                    c && setTimeout(function () {
                                        y({waitSeconds: 5});
                                        try {
                                            y([b], function (a) {
                                                u.log("reloaded module : " + b + (null !== k ? " have obj" : "have no obj"));
                                                y({cacheBust: "time\x3d" + (new Date).getTime()});
                                                _.isString(a) ?
                                                    u.error("module reloaded failed : " + a + " for module : " + b) : (a.modulePath = b, g && (e.mergeFunctions(g.prototype, a.prototype), g.prototype && g.prototype._onReloaded && g.prototype._onReloaded(a)), e.publish(f.EVENTS.ON_MODULE_RELOADED, {
                                                    module: b,
                                                    newModule: a
                                                }), a.prototype && a.prototype.declaredClass && e.publish(f.EVENTS.ON_MODULE_UPDATED, {
                                                    moduleClass: a.prototype.declaredClass,
                                                    moduleProto: a.prototype
                                                }))
                                            })
                                        } catch (a) {
                                            u.error("error reloading module " + b, a.stack), logError(a, "error reloading module " + b)
                                        }
                                    }, 10)
                                }
                            }
                        },
                        fileChanged: function (a) {
                            var b =
                                a.path;
                            "changed" === a.type && this._reloadModule(b, !0)
                        },
                        onAllDevicesStarted: function () {
                            this.profile.test && this.doTests()
                        },
                        onReady: function () {
                            var a = this.getDeviceServer();
                            if (a) {
                                var b = this.connection;
                                a.clients || (a.clients = []);
                                b && (a.clients.push(b), a.onClientConnection(b));
                                this.initDevices();
                                D = this;
                                global.sctx = D
                            } else u.error("have no device server")
                        },
                        getUserDirectory: function () {
                            return this.profile.user
                        },
                        constructManagers: function () {
                            g = e([g, k], {});
                            this.driverManager = this.createManager(c, null);
                            this.fileManager =
                                this.createManager(r, null);
                            this.blockManager = this.createManager(m, null);
                            J && (this.testManager = this.createManager(J, null));
                            this.connection = new z({owner: this});
                            this.deviceManager = this.createManager(g, null, {
                                deviceServerClient: new G({}),
                                connection: this.connection
                            });
                            if (this.profile) {
                                var a = d.resolve(this.profile.system), a = {
                                    system_drivers: d.resolve(a + "/system/drivers"),
                                    system_devices: d.resolve(a + "/system/devices")
                                };
                                if (this.profile.user) {
                                    var b = d.resolve(this.profile.user);
                                    a.user_drivers = d.resolve(b + "/drivers");
                                    a.user_devices = d.resolve(b + "/devices");
                                    this.userDirectory = b
                                }
                                this.resourceManager = this.createManager(h);
                                this.resourceManager.resourceVariables = {VFS_CONFIG: a}
                            }
                        },
                        onLoaded: function () {
                        },
                        initDevices: function () {
                            var a = this.profile, b = d.resolve(a.system), c = this.getDeviceManager(), h = this.getDriverManager(), g = a.serverSide;
                            h.createStore({items: this.getDrivers(d.resolve(b + "/system/drivers"), "system_drivers")}, "system_drivers", !0);
                            c.initStore({
                                items: this.getDevices(d.resolve(b + "/system/devices"), "system_devices",
                                    {serverSide: g})
                            }, "system_devices", !0);
                            a.user && (h.createStore({items: this.getDrivers(d.resolve(a.user + "/drivers"), "user_drivers")}, "user_drivers", !0), c.initStore({items: this.getDevices(d.resolve(a.user + "/devices"), "user_devices", {serverSide: g})}, "user_devices", !0));
                            B(c.connectToAllDevices()).then(function () {
                                this.onAllDevicesStarted()
                            }.bind(this))
                        }
                    })
                })
        }, "nxapp/manager/DriverManager": function () {
            define("dcl/dcl nxapp/utils/_LogMixin xide/types xcf/manager/DriverManager nxapp/utils/_console dojo/node!path xide/mixins/EventedMixin xide/mixins/ReloadMixin dojo/Deferred xcf/model/Variable nxapp/utils".split(" "),
                function (e, p, l, n, d, b, a, f, c, g, r) {
                    return e([n, p], {
                        declaredClass: "nxapp.manager.DriverManager", createDriverInstance: function (g) {
                            var k = this.ctx, m = k.getDeviceManager(), h = k.getDriverManager(), t = g.driverScope, n = g.deviceScope, u = new c, p = g.system_drivers + "/DriverBase.js", v = g[t] + "/" + g.driver, B = g.driverId, y = g.deviceId || g.id, E = g[t], J = g[n], G = g.hash, D = h.getDriverById(B), z = m.getDeviceById(y, m.stores[n]);
                            if (!D) {
                                if (!E)return d.error("invalid drivers path " + E, g), u.reject("invalid drivers path " + E), u;
                                y = k.getDrivers(b.resolve(E),
                                    t);
                                if (!y || !y.length)return u.reject("have no devices at " + E), u;
                                E = this.createStore({items: y}, t, !1);
                                D = h.getDriverById(B, E);
                                if (!D)return u.reject("cant find driver " + B), u
                            }
                            if (!z) {
                                h = k.getDevices(b.resolve(J), n);
                                if (!h || !h.length)return u.reject("have no devices at " + J), u;
                                z = m.initStore({items: h}, n, !1).getSync(g.devicePath);
                                if (!z)return u.reject("cant find device " + g.devicePath), u
                            }
                            z.info = g;
                            var C = this;
                            require(["system_drivers/DriverBase"], function (b) {
                                b.prototype.declaredClass = p;
                                require([t + "/" + g.driver.replace(".js",
                                    "")], function (c) {
                                    c = new (e([b, a.dcl, f.dcl, c], {}));
                                    c.declaredClass = v;
                                    c.options = g;
                                    c.baseClass = b.prototype.declaredClass;
                                    c.modulePath = v;
                                    c.delegate = m;
                                    c.driver = D;
                                    c.serverSide = g.serverSide;
                                    c.utils = r;
                                    c.types = l;
                                    c.device = z;
                                    c.id = r.createUUID();
                                    c.getDevice = function () {
                                        return this.device
                                    };
                                    c.getDeviceInfo = function () {
                                        return this.getDevice().info
                                    };
                                    var h = D.user, t = r.getCIByChainAndName(h, 0, l.DRIVER_PROPERTY.CF_DRIVER_COMMANDS);
                                    t && t.params && (c.sendSettings = r.getJson(t.params));
                                    (h = r.getCIByChainAndName(h, 0, l.DRIVER_PROPERTY.CF_DRIVER_RESPONSES)) &&
                                    h.params && (c.responseSettings = r.getJson(h.params));
                                    try {
                                        c.start(), c.initReload()
                                    } catch (n) {
                                        d.error("crash in driver instance startup! " + z.toString())
                                    }
                                    C.driverInstance = c;
                                    h = B + "_" + G + "_" + z.path;
                                    D.blox && D.blox.blocks || (d.error("Attention : INVALID driver", z.toString()), D.blox = {blocks: []});
                                    D.blockPath && (r.getJson(r.readFile(D.blockPath)), D.blox = r.getJson(r.readFile(D.blockPath)));
                                    m.deviceInstances || (m.deviceInstances = {});
                                    m.deviceInstances[G] = c;
                                    h = k.getBlockManager().createScope({
                                        id: h,
                                        device: z,
                                        driver: D,
                                        instance: c,
                                        ctx: k,
                                        serverSide: g.serverSide,
                                        uuid: r.createUUID(),
                                        getContext: function () {
                                            return this.instance
                                        }
                                    }, dojo.clone(D.blox.blocks));
                                    c.blockScope = h;
                                    z.blockScope = h;
                                    z.driverInstance = c;
                                    C.blockScope = h;
                                    u.resolve({driverInstance: c, blockScope: h})
                                })
                            });
                            u.then(function (a) {
                                a.blockScope.start()
                            });
                            return u
                        }
                    })
                })
        }, "xcf/manager/DriverManager": function () {
            define("dcl/dcl dojo/_base/declare dojo/_base/lang dojo/_base/json xide/types xcf/types/Types xide/utils xcf/manager/BeanManager xcf/model/Variable xcf/manager/DriverManager_Server xide/data/TreeMemory xide/data/ObservableStore dstore/Trackable xdojo/has xcf/model/Driver xide/manager/ServerActionBase xide/data/Reference dojo/Deferred xide/mixins/ReloadMixin xide/mixins/EventedMixin xdojo/has!xcf-ui?./DriverManager_UI xdojo/has!xcf-ui?xide/views/_CIDialog".split(" "),
                function (e, p, l, n, d, b, a, f, c, g, r, q, k, m, h, t, w, u, x, v, B, y) {
                    l = [t, f, g];
                    m("runDrivers");
                    m("xcf-ui") && l.push(B);
                    return e(l, {
                        onStoreCreated: function (a) {
                            var b = a.type;
                            a = a.store;
                            var c = a.query({isDir: !1});
                            if (b === d.ITEM_TYPE.DRIVER)for (b = 0; b < c.length; b++) {
                                var h = c[b];
                                null == h._completed && "Default" !== h.name && (h._completed = !0, m("xcf-ui") && this.completeDriver(a, h, h))
                            }
                        },
                        removeDriverInstance: function (a, b) {
                            try {
                                this.getContext().getDeviceManager().toDeviceControlInfo(b);
                                var c = this.getDriverById(a.device.info.driverId), d =
                                    c._store, h = c.path, g = h + "_instances_instance_" + b.path, f = d.getSync(g);
                                f && d.removeSync(g);
                                var k = _.find(c.instances, {path: g});
                                k && c.instances.remove(k);
                                b.removeReference(f);
                                f && (f.refresh(), d.getSync(h + "_instances").refresh())
                            } catch (m) {
                                logError(m, "error removing driver instance")
                            }
                        },
                        createDriverBlockScope: function (b) {
                            var c = a.clone(b.blox && b.blox.blocks ? b.blox.blocks : []);
                            return b.blockScope = this.ctx.getBlockManager().createScope({
                                    id: b.id,
                                    device: null,
                                    driver: b,
                                    instance: null,
                                    ctx: this.ctx,
                                    getContext: function () {
                                        return this.instance
                                    }
                                },
                                c, function (a) {
                                    a && console.error(a + " : in " + b.name + " , re-save driver!")
                                })
                        },
                        addDeviceInstance: function (a, b) {
                        },
                        declaredClass: "xcf.manager.DriverManager",
                        beanNamespace: "driver",
                        beanName: "Driver",
                        beanIconClass: "fa-exchange",
                        groupType: d.ITEM_TYPE.DRIVER_GROUP,
                        itemType: d.ITEM_TYPE.DRIVER,
                        itemMetaTitleField: d.DRIVER_PROPERTY.CF_DRIVER_NAME,
                        defaultScope: "system_drivers",
                        serviceClass: "XCF_Driver_Service",
                        rawData: null,
                        store: null,
                        treeView: null,
                        driverScopes: null,
                        _isLoading: !1,
                        getDriverModule: function (b) {
                            var c =
                                new u, h = a.getCIInputValueByName(b.user, d.DRIVER_PROPERTY.CF_DRIVER_CLASS);
                            b = b.scope;
                            h = h ? h.replace("./", "") : "";
                            b = require.toUrl(b);
                            b = a.removeURLParameter(b, "bust");
                            b = a.removeURLParameter(b, "time");
                            b = b.replace("/main.js", "");
                            require.cache || (b = b.replace("/.js", "/"));
                            try {
                                require([b + "/" + h], function (a) {
                                    c.resolve(a)
                                })
                            } catch (g) {
                                console.error("error loading driver module from  " + b + "---" + h, g), logError(g, "error loading driver module"), c.reject(g.message)
                            }
                            return c
                        },
                        loadDriverModule: function (b) {
                            var c = this.driverScopes.system_drivers +
                                "DriverBase";
                            require.toUrl(this.driverScopes.system_drivers);
                            var h = this, g = new u, f = require;
                            f([c], function (c) {
                                var k = h.driverScopes[b.scope], m = !require.cache;
                                m ? require({config: {urlArgs: null}}) : require({cacheBust: null});
                                k = require.toUrl(k);
                                m && (k = k.replace("/.js", "/"));
                                var t = a.getCIInputValueByName(b.user, d.DRIVER_PROPERTY.CF_DRIVER_CLASS), t = t.replace("./", ""), t = t.replace(".js", ""), t = b.scope + "/" + t, t = t.replace("", "").trim();
                                try {
                                    f.undef(t), f([t], function (a) {
                                        function b(c, d) {
                                            a.getFields = c.getFields;
                                            c.onReloaded =
                                                b;
                                            d.onReloaded = b
                                        }

                                        a.declaredClass = t;
                                        e([c, v.dcl, x.dcl, a], {}).getFields = a.getFields;
                                        a.onReloaded = b;
                                        g.resolve(a)
                                    })
                                } catch (q) {
                                }
                            });
                            return g
                        },
                        getBlock: function (b) {
                            b = a.parse_url(b);
                            b = a.urlArgs(b.host);
                            var c = this.getItemById(b.driver.value), d = null;
                            c && c.blockScope && (d = c.blockScope.getBlockById(b.block.value));
                            return d
                        },
                        getDriverByUrl: function (b) {
                            b = a.parse_url(b);
                            b = a.urlArgs(b.host);
                            return this.getItemById(b.driver.value)
                        },
                        _driverQueryCache: null,
                        _getDriverById: function (b, c) {
                            if (c && c.getSync) {
                                var h = c.query();
                                _.isArray(h) ||
                                (h = [h]);
                                for (var g = 0; g < h.length; g++) {
                                    var f = h[g];
                                    if (!f.isDir) {
                                        var k = a.getInputCIByName(f.user, d.DRIVER_PROPERTY.CF_DRIVER_ID);
                                        if (k && k.value == b)return c.getSync(f.path)
                                    }
                                }
                                return null
                            }
                        },
                        getDriverById: function (a, b) {
                            if (b)return this._getDriverById(a, b);
                            var c = null, d = null;
                            m("xcf-ui");
                            for (var h in this.stores)if (b = this.stores[h], c = this._getDriverById(a, b)) {
                                d = c;
                                break
                            }
                            m("xcf-ui");
                            return d
                        },
                        getDriverByPath: function (b) {
                            var c = null, d;
                            for (d in this.stores) {
                                a:{
                                    c = a.queryStore(this.stores[d], {isDir: !1});
                                    _.isArray(c) ||
                                    (c = [c]);
                                    for (var h = 0; h < c.length; h++) {
                                        var g = c[h];
                                        if (g.path == b) {
                                            c = g;
                                            break a
                                        }
                                    }
                                    c = null
                                }
                                if (c)return c
                            }
                            return null
                        },
                        getItemById: function (a) {
                            return this.getDriverById(a)
                        },
                        onNewDriverScopeCreated: function (a) {
                        },
                        onScopeCreated: function (a) {
                        },
                        onDeviceDisconnected: function (a) {
                        },
                        onDriverCreated: function (a) {
                            m("xcf-ui") && d.registerEnumeration("Driver", this.getDriversAsEnumeration(a))
                        },
                        onDriverRemoved: function (a, b) {
                            m("xcf-ui") && d.registerEnumeration("Driver", this.getDriversAsEnumeration(a))
                        },
                        onStoreReady: function (a) {
                            m("xcf-ui") &&
                            d.registerEnumeration("Driver", this.getDriversAsEnumeration(a))
                        },
                        createStore: function (b, c, d) {
                            var g = new (p("driverStore", [r, k, q], {}))({
                                data: [],
                                Model: h,
                                idProperty: "path",
                                scope: c,
                                id: a.createUUID(),
                                observedProperties: ["name", "enabled"]
                            });
                            b && b.items && (g.setData(b.items), _.each(b.items, function (a) {
                                a._store = g
                            }));
                            c && !1 !== d && this.setStore(c, g);
                            return g
                        },
                        initStore: function (a, b, c) {
                            return this.createStore(a, b, c)
                        },
                        getStore: function (a) {
                            a = a || "system_drivers";
                            var b = this.stores[a];
                            return b ? b : this.ls(a)
                        },
                        ls: function (a,
                                      b) {
                            function c(g) {
                                try {
                                    var f = this.createStore(g, a, b);
                                    this.onStoreReady(f);
                                    !1 !== b && this.publish(d.EVENTS.ON_STORE_CREATED, {
                                        data: g,
                                        owner: this,
                                        store: f,
                                        type: this.itemType
                                    });
                                    h.resolve(f)
                                } catch (k) {
                                    logError(k, "error ls drivers")
                                }
                            }

                            var h = new u;
                            if (this.prefetch && this.prefetch[a])return c.apply(this, [this.prefetch[a]]), delete this.prefetch[a], h;
                            m("php") ? this.runDeferred(null, "ls", [a]).then(c.bind(this)) : h.resolve({items: []});
                            return h
                        },
                        init: function () {
                            var a = this, b = d.EVENTS;
                            this.subscribe([b.ON_SCOPE_CREATED, b.ON_STORE_CREATED]);
                            this.subscribe(b.ON_BLOCK_EXPRESSION_FAILED, function (c) {
                                a.publish(b.ON_SERVER_LOG_MESSAGE, {
                                    data: {type: "Expression", device: c.deviceInfo},
                                    level: "error",
                                    message: "Expression Failed: " + c.item.title + " : " + c.item.value
                                })
                            });
                            this.driverScopes = {system_drivers: "system_drivers/", user_drivers: "user_drivers/"}
                        }
                    })
                })
        }, "xcf/manager/BeanManager": function () {
            define("dcl/dcl xdojo/has dojo/_base/lang xide/types xide/utils xide/manager/BeanManager dojo/Deferred xide/noob xdojo/has!xtrack?xide/interface/Track xdojo/has!xcf-ui?xide/views/ActionDialog xdojo/has!xcf-ui?xide/views/CIActionDialog xdojo/has!xcf-ui?xide/views/CIGroupedSettingsView".split(" "),
                function (e, p, l, n, d, b, a, f, c, g, r, q) {
                    b = e(b, {
                        getItemByPath: function (a) {
                            for (var b in this.stores) {
                                var c = this.stores[b].getSync(a);
                                if (c)return c
                            }
                        }, setStore: function (a, b) {
                            var c = this.stores[a];
                            c && (console.error("setting existing store " + a), c.destroy(), delete this.stores[a]);
                            return this.stores[a] = b
                        }, onCIUpdate: function (a) {
                            a.owner === this && this.updateCI(a.ci, a.newValue, a.oldValue, a.storeItem)
                        }, init: function () {
                            this.stores = {};
                            this.subscribe(n.EVENTS.ON_CI_UPDATE)
                        }
                    });
                    return p("xcf-ui") ? e(b, {
                        declaredClass: "xcf.manager.BeanManager",
                        getViewClass: function (a) {
                            a = a || {};
                            d.mixin(a, {
                                startup: function () {
                                    c && this.getContext().getTrackingManager().track(this.getTrackingCategory(), this.getTrackingLabel(this.item), this.getTrackingUrl(this.item), n.ACTION.OPEN, this.getContext().getUserDirectory());
                                    if (this.inherited)return this.inherited(arguments)
                                }
                            });
                            return e([q, c ? c.dcl : f.dcl], a)
                        }, getFile: function (b) {
                            var c = new a, d = this.getContext().getFileManager().getStore(b.scope);
                            d.initRoot().then(function () {
                                d._loadPath(".", !0).then(function () {
                                    d.getItem(b.path,
                                        !0).then(function (a) {
                                        c.resolve(a)
                                    })
                                })
                            });
                            return c
                        }, toUrl: function (a, b, c, d) {
                            return l.replace((d || "") + "deviceScope\x3d{deviceScope}\x26device\x3d{deviceId}\x26driver\x3d{driverId}\x26driverScope\x3d{driverScope}\x26block\x3d{block}", {
                                deviceId: a.id,
                                deviceScope: a.scope,
                                driverId: b.id,
                                driverScope: b.scope,
                                block: c ? c.id : ""
                            })
                        }, newGroup: function () {
                            var a = this, b = this.getItem(), c = b ? !0 === b.isDir ? b.path : "" : "", b = new r({
                                title: "New " + this.groupType,
                                delegate: {
                                    onOk: function (b, g) {
                                        var f = d.getCIInputValueByName(g, "Title"),
                                            m = d.getCIInputValueByName(g, "Scope");
                                        a.createGroup(m, c + "/" + f, function () {
                                            var b = a.createNewGroupItem(f, m, c);
                                            a.store.putSync(b);
                                            a.publish(n.EVENTS.ON_STORE_CHANGED, {
                                                owner: a,
                                                store: a.store,
                                                action: n.NEW_DIRECTORY,
                                                item: b
                                            })
                                        })
                                    }
                                },
                                cis: [d.createCI("Title", 13, ""), d.createCI("Scope", 3, this.defaultScope, {
                                    options: [{
                                        label: "System",
                                        value: this.defaultScope
                                    }, {label: "User", value: this.userScope}]
                                })]
                            });
                            b.startup();
                            b.show()
                        }, onDeleteItem: function (a) {
                            var b = !0 === d.toBoolean(a.isDir), c = b ? "removeGroup" : "removeItem", f = this;
                            (new g({
                                title: "Remove " +
                                this.beanName + (b ? " Group" : "") + ' "' + a.name + '"  ',
                                style: "max-width:400px",
                                titleBarClass: "text-danger",
                                delegate: {
                                    isRemoving: !1, onOk: function () {
                                        f[c](d.toString(a.scope), d.toString(a.path), d.toString(a.name), function () {
                                            f.onItemDeleted(a);
                                            f.publish(n.EVENTS.ON_STORE_CHANGED, {
                                                owner: f,
                                                store: f.store,
                                                action: n.DELETE,
                                                item: a
                                            })
                                        })
                                    }
                                }
                            })).show()
                        }, createNewGroupItem: function (a, b, c) {
                            return this.createItemStruct(a, b, c, a, !0, this.groupType)
                        }, createNewItem: function (a, b, c) {
                            return this.createItemStruct(a, b, c, c + "/" + a, !1, this.itemType)
                        },
                        createItem: function (a, b, c, d, g) {
                            return this.runDeferred(null, "createItem", [a, b, c, d, g])
                        }, ls: function (a, b) {
                            return this.runDeferred(null, "ls", [a]).then(function (a) {
                                try {
                                    this.rawData = a, this.initStore(a), this.publish(n.EVENTS.ON_STORE_CREATED, {
                                        data: a,
                                        owner: this,
                                        store: this.store,
                                        type: this.itemType
                                    })
                                } catch (b) {
                                    logError(b, "error ls")
                                }
                            }.bind(this))
                        }
                    }) : b
                })
        }, "xide/manager/BeanManager": function () {
            define("dcl/dcl dojo/_base/lang xdojo/has xide/utils xide/encoding/MD5 xide/registry xide/data/TreeMemory".split(" "),
                function (e, p, l, n, d, b, a) {
                    return e(null, {
                        declaredClass: "xide.manager.BeanManager",
                        beanNamespace: "beanNS",
                        beanName: "beanName",
                        beanPriority: -1,
                        createItemStruct: function (a, b, d, e, q, k) {
                            return {name: a, isDir: q, parentId: d, path: e, beanType: k, scope: b}
                        },
                        getMetaValue: function (a, b) {
                            return n.getCIInputValueByName(n.getAt(a, this.itemMetaPath || "user"), b)
                        },
                        getStore: function () {
                            return this.store
                        },
                        isValid: function () {
                            return null != this.store
                        },
                        initStore: function (b) {
                            this.store = new a({data: b.items, idProperty: "path"});
                            this.onStoreReady(this.store);
                            return this.store
                        },
                        onStoreReady: function () {
                        },
                        _onReloaded: function (a) {
                            this.mergeNewModule(a.prototype);
                            a = this.declaredClass;
                            (a = p.getObject(n.replaceAll("/", ".", a)) || p.getObject(a)) && a.prototype && a.prototype.solve && this.mergeNewModule(a.prototype)
                        }
                    })
                })
        }, "xide/registry": function () {
            define(["dojo/_base/array", "dojo/_base/window", "xdojo/has"], function (e, p, l) {
                var n = {}, d = {}, b = {
                    length: 0, add: function (a) {
                        this._hash[a.id] && (this.remove(a.id), this.add(a));
                        d[a.id] = a;
                        this.length++
                    }, remove: function (a) {
                        d[a] && (delete d[a],
                            this.length--)
                    }, byId: function (a) {
                        return "string" == typeof a ? d[a] : a
                    }, byNode: function (a) {
                        return d[a.getAttribute("widgetId")]
                    }, toArray: function () {
                        return _.values(_.mapKeys(d, function (a, b) {
                            a.id = b;
                            return a
                        }))
                    }, getUniqueId: function (a) {
                        var b;
                        do b = a + "_" + (a in n ? ++n[a] : n[a] = 0); while (d[b]);
                        return b
                    }, findWidgets: function (a, b) {
                        function c(a) {
                            for (a = a.firstChild; a; a = a.nextSibling)if (1 == a.nodeType) {
                                var e = a.getAttribute("widgetId");
                                e ? (e = d[e]) && g.push(e) : a !== b && c(a)
                            }
                        }

                        var g = [];
                        c(a);
                        return g
                    }, _destroyAll: function () {
                        _.each(b.findWidgets(p.body()),
                            function (a) {
                                a._destroyed || (a.destroyRecursive ? a.destroyRecursive() : a.destroy && a.destroy())
                            })
                    }, getEnclosingWidget: function (a) {
                        for (; a;) {
                            var b = 1 == a.nodeType && a.getAttribute("widgetId");
                            if (b)return d[b];
                            a = a.parentNode
                        }
                        return null
                    }, _hash: d
                };
                return b
            })
        }, "xide/noob": function () {
            define(["xdojo/declare", "dcl/dcl"], function (e, p) {
                var l = e("noob", null, {});
                l.dcl = p(null, {});
                return l
            })
        }, "xcf/model/Variable": function () {
            define(["dcl/dcl", "xide/types", "xblox/model/variables/Variable"], function (e, p, l) {
                return e(l, {
                    declaredClass: "xcf.model.Variable",
                    hasInlineEdits: !0,
                    gui: "off",
                    cmd: "off",
                    save: !1,
                    target: "None",
                    name: "No Title",
                    value: -1,
                    observed: ["value", "initial", "name"],
                    solve: function () {
                        var e = "";
                        if ("processVariables" === this.group) {
                            var d = this.scope.getVariable("value");
                            d && (d = d.value, this.isNumber(d) || (d = "'" + d + "'"), e = "var value \x3d " + d + ";\n")
                        }
                        return this.scope.parseExpression(e + this.getValue(), !0)
                    },
                    canEdit: function () {
                        return !0
                    },
                    canDisable: function () {
                        return !1
                    },
                    getFields: function () {
                        var e = this.getDefaultFields();
                        e.push(this.utils.createCI("title", 13,
                            this.name, {group: "General", title: "Name", dst: "name"}));
                        var d = this;
                        e.push(this.utils.createCI("value", this.types.ECIType.EXPRESSION, this.value, {
                            group: "General",
                            title: "Value",
                            dst: "value",
                            widget: {
                                allowACECache: !0,
                                showBrowser: !1,
                                showSaveButton: !0,
                                editorOptions: {showGutter: !1, autoFocus: !1, hasConsole: !1},
                                aceOptions: {hasEmmet: !1, hasLinking: !1, hasMultiDocs: !1},
                                item: this
                            },
                            delegate: {
                                runExpression: function (b, a, f) {
                                    if ("processVariables" == d.group) {
                                        var c = d.scope.getVariable("value"), g = "";
                                        c && (c = c.value, d.isNumber(c) ||
                                        (c = "'" + c + "'"), g = "var value \x3d " + c + ";\n")
                                    }
                                    return d.scope.expressionModel.parse(d.scope, g + b, !1, a, f)
                                }
                            }
                        }));
                        e.push(this.utils.createCI("flags", 5, this.flags, {
                            group: "General",
                            title: "Flags",
                            dst: "flags",
                            data: [{
                                value: 4096,
                                label: "Dont parse",
                                title: "Do not parse the string and use it as is"
                            }, {value: 2048, label: "Expression", title: "Parse it as Javascript"}],
                            widget: {hex: !0}
                        }));
                        return e
                    },
                    onChangeField: function (e, d, b) {
                        "value" === e && this.publish(p.EVENTS.ON_DRIVER_VARIABLE_CHANGED, {
                            item: this, scope: this.scope, save: !1,
                            source: p.MESSAGE_SOURCE.GUI
                        })
                    }
                })
            })
        }, "xblox/model/variables/Variable": function () {
            define(["dcl/dcl", "xide/types", "xblox/model/Block"], function (e, p, l) {
                return e(l, {
                    declaredClass: "xblox.model.variables.Variable",
                    name: null,
                    value: null,
                    register: !0,
                    readOnly: !1,
                    initial: null,
                    isVariable: !0,
                    flags: 4096,
                    getValue: function () {
                        return this.value
                    },
                    canDisable: function () {
                        return !1
                    },
                    canMove: function () {
                        return !1
                    },
                    getIconClass: function () {
                        return "el-icon-quotes-alt"
                    },
                    getBlockIcon: function () {
                        return '\x3cspan class\x3d"' + this.icon +
                            '"\x3e\x3c/span\x3e '
                    },
                    toText: function () {
                        return "\x3cspan class\x3d'text-primary'\x3e" + this.getBlockIcon() + this.makeEditable("name", "right", "text", "Enter a unique name", "inline") + "\x3c/span\x3e"
                    },
                    solve: function () {
                        this.scope.parseExpression(this.getValue(), !0);
                        return []
                    },
                    getFields: function () {
                        var e = this.getDefaultFields(), d = this;
                        e.push(this.utils.createCI("title", p.ECIType.STRING, this.name, {
                            group: "General",
                            title: "Name",
                            dst: "name"
                        }));
                        e.push(this.utils.createCI("value", p.ECIType.EXPRESSION, this.value, {
                            group: "General",
                            title: "Value", dst: "value", delegate: {
                                runExpression: function (b, a, f) {
                                    return d.scope.expressionModel.parse(d.scope, b, !1, a, f)
                                }
                            }
                        }));
                        return e
                    }
                })
            })
        }, "xblox/model/Block": function () {
            define("dcl/dcl dojo/Deferred dojo/_base/lang dojo/has xblox/model/ModelBase xide/factory xide/utils xide/types xide/utils/ObjectUtils xide/lodash xdojo/has!xblox-ui?xblox/model/Block_UI".split(" "), function (e, p, l, n, d, b, a, f, c, g, r) {
                function q(a, b) {
                    for (var c = 0; c < b.length; c++)if (a.id === b[c].id)return c
                }

                n = [d];
                n.push(e(null, {
                    getStatusIcon: function () {
                    },
                    getStatusClass: function () {
                    }, setStatusClass: function () {
                    }, onActivity: function () {
                    }, onRun: function () {
                    }, onFailed: function () {
                    }, onSuccess: function () {
                    }, getIconClass: function () {
                    }
                }));
                r && n.push(r);
                a.mixin(f, {
                    BLOCK_FLAGS: {
                        NONE: 0,
                        ACTIVE: 1,
                        SCRIPT: 2,
                        RESERVED1: 4,
                        USEFUNCTION: 8,
                        RESERVED2: 16,
                        SINGLE: 32,
                        WAITSFORMESSAGE: 64,
                        VARIABLEINPUTS: 128,
                        VARIABLEOUTPUTS: 256,
                        VARIABLEPARAMETERINPUTS: 512,
                        VARIABLEPARAMETEROUTPUTS: 1024,
                        TOPMOST: 16384,
                        BUILDINGBLOCK: 32768,
                        MESSAGESENDER: 65536,
                        MESSAGERECEIVER: 131072,
                        TARGETABLE: 262144,
                        CUSTOMEDITDIALOG: 524288,
                        RESERVED0: 1048576,
                        EXECUTEDLASTFRAME: 2097152,
                        DEACTIVATENEXTFRAME: 4194304,
                        RESETNEXTFRAME: 8388608,
                        INTERNALLYCREATEDINPUTS: 16777216,
                        INTERNALLYCREATEDOUTPUTS: 33554432,
                        INTERNALLYCREATEDINPUTPARAMS: 67108864,
                        INTERNALLYCREATEDOUTPUTPARAMS: 134217728,
                        INTERNALLYCREATEDLOCALPARAMS: 1073741824,
                        ACTIVATENEXTFRAME: 268435456,
                        LOCKED: 536870912,
                        LAUNCHEDONCE: 2147483648
                    }, BLOCK_CALLBACKMASK: {
                        PRESAVE: 1,
                        DELETE: 2,
                        ATTACH: 4,
                        DETACH: 8,
                        PAUSE: 16,
                        RESUME: 32,
                        CREATE: 64,
                        RESET: 4096,
                        POSTSAVE: 256,
                        LOAD: 512,
                        EDITED: 1024,
                        SETTINGSEDITED: 2048,
                        READSTATE: 4096,
                        NEWSCENE: 8192,
                        ACTIVATESCRIPT: 16384,
                        DEACTIVATESCRIPT: 32768,
                        RESETINBREAKPOINT: 65536,
                        RENAME: 131072,
                        BASE: 14,
                        SAVELOAD: 769,
                        PPR: 304,
                        EDITIONS: 3072,
                        ALL: 4294967295
                    }
                });
                r = e(n, {
                    declaredClass: "xblox.model.Block",
                    scopeId: null,
                    isCommand: !1,
                    outlet: 0,
                    _destroyed: !1,
                    enabled: !0,
                    serializeMe: !0,
                    name: null,
                    shareTitle: "",
                    sharable: !1,
                    items: null,
                    parent: null,
                    _return: null,
                    _lastResult: null,
                    _deferredObject: null,
                    _currentIndex: 0,
                    _lastRunSettings: null,
                    _onLoaded: !1,
                    beanType: "BLOCK",
                    override: {},
                    ignoreSerialize: "_didSubscribe _currentIndex _deferredObject _destroyed _return parent __started ignoreSerialize _lastRunSettings _onLoaded beanType sharable override virtual _scenario _didRegisterSubscribers additionalProperties renderBlockIcon serializeMe _statusIcon _statusClass hasInlineEdits _loop help owner _lastCommand allowActionOverride canDelete isCommand lastCommand autoCreateElse _postCreated _counter".split(" "),
                    _parseString: function (b, c, d, g) {
                        try {
                            c = c || this._lastSettings || {};
                            g = g || c.flags || f.CIFLAG.EXPRESSION;
                            var e = this.scope, q = !(g & f.CIFLAG.DONT_PARSE), n = g & f.CIFLAG.EXPRESSION;
                            g & f.CIFLAG.TO_HEX && (b = a.to_hex(b));
                            !1 !== q && (b = a.convertAllEscapes(b, "none"));
                            var r = c.override || this.override || {}, l = r && r.variables ? r.variables : null, p = "", p = n && !1 !== q ? e.parseExpression(b, null, l, null, null, null, r.args, g) : "" + b
                        } catch (E) {
                            console.error(E)
                        }
                        return p
                    },
                    postCreate: function () {
                    },
                    childrenByClass: function (a) {
                        for (var b = this.getChildren(),
                                 c = [], d = 0; d < b.length; d++) {
                            var g = b[d];
                            g.isInstanceOf(a) && c.push(g)
                        }
                        return c
                    },
                    childrenByNotClass: function (a) {
                        for (var b = this.getChildren(), c = [], d = 0; d < b.length; d++) {
                            var g = b[d];
                            g.isInstanceOf(a) || c.push(g)
                        }
                        return c
                    },
                    getInstance: function () {
                        var a = this.scope.instance;
                        return a ? a : null
                    },
                    pause: function () {
                    },
                    mergeNewModule: function (a) {
                        for (var b in a) {
                            var c = a[b];
                            c && g.isFunction(c) && (this[b] = c)
                        }
                    },
                    __onReloaded: function (b) {
                        this.mergeNewModule(b.prototype);
                        b = this.declaredClass;
                        (b = l.getObject(a.replaceAll("/", ".", b)) ||
                            l.getObject(b)) && b.prototype && b.prototype.solve && this.mergeNewModule(b.prototype)
                    },
                    reparent: function () {
                        if (!this)return !1;
                        if (!this.getParent()) {
                            var a = this.next(null, 1) || this.next(null, -1);
                            a && (this.group = null, a._add(this))
                        }
                    },
                    unparent: function (a, b) {
                        if (!this)return !1;
                        var c = this.getParent();
                        c && c.removeBlock && c.removeBlock(this, !1);
                        this.group = a;
                        this.parent = this.parentId = null;
                        !1 !== b && (this._place(null, -1, null), this._place(null, -1, null))
                    },
                    move: function (a) {
                        if (!this)return !1;
                        var b = this.getParent(), c = null;
                        if (b) {
                            c =
                                b[b._getContainer(this)];
                            if (!c || 2 > c.length || !this.containsItem(c, this))return !1;
                            b = this.indexOf(c, this);
                            if (0 > b + a)return !1;
                            var d = c[b + a];
                            if (!d)return !1;
                            c[b + a] = this;
                            c[b] = d
                        } else this._place(null, a);
                        return !0
                    },
                    _place: function (a, b, c) {
                        var d = this._store, f = this;
                        (a = a || f.next(null, b)) ? (a = g.isString(a) ? d.getSync(a) : a, f = g.isString(f) ? d.getSync(f) : f, c = c || d.storage.fullData, b = -1 == b ? 0 : 1, c.remove(f), -1 == b && (b = 0), c.splice(Math.max(q(a, c) + b, 0), 0, f), d._reindex()) : console.error("have no next", this)
                    },
                    index: function () {
                        var a =
                            this.getParent(), b = null, c = this.group, b = this._store;
                        if (a)return b = a[a._getContainer(this)] || [], b = b.filter(function (a) {
                            return a.group === c
                        }), !b || 2 > b.length || !this.containsItem(b, this) ? !1 : this.indexOf(b, this);
                        b = b.storage.fullData;
                        b = b.filter(function (a) {
                            return a.group === c
                        });
                        return this.indexOf(b, this)
                    },
                    numberOfParents: function () {
                        var a = 0, b = this.getParent();
                        b && (a++, a += b.numberOfParents());
                        return a
                    },
                    getTopRoot: function () {
                        var a = this.getParent();
                        if (a) {
                            var b = a.getParent();
                            b && (a = b)
                        }
                        return a
                    },
                    next: function (a,
                                    b) {
                        function c(a, b, g) {
                            var f = a.indexOf(b, a);
                            if (f = b[f + g * d]) {
                                if (!f.parentId && f.group && f.group === a.group)return f;
                                d++;
                                return c(a, b, g)
                            }
                            return null
                        }

                        var d = 1;
                        a = a || this._store.storage.fullData;
                        return c(this, a, b)
                    },
                    getParent: function (a) {
                        return this.parentId ? this.scope.getBlockById(this.parentId) : null
                    },
                    getScope: function () {
                        var a = this.scope;
                        if (this.scopeId && 0 < this.scopeId.length) {
                            var b = a.owner;
                            b && b.hasScope && (b.hasScope(this.scopeId) ? a = b.getScope(this.scopeId) : console.error("have scope id but cant resolve it", this))
                        }
                        return a
                    },
                    canAdd: function () {
                        return null
                    },
                    getTarget: function () {
                        var a = this._targetReference;
                        if (a)return a;
                        var b = this.getParent();
                        b && b.getTarget && (a = b.getTarget());
                        return a
                    },
                    addToEnd: function (a, b) {
                        b && null != a.length && null != b.length && a.push.apply(a, b);
                        return a
                    },
                    removeBlock: function (a, b) {
                        a && (!1 !== b && a.empty && a.empty(), !1 !== b && delete a.items, a.parent = null, a.parentId = null, this.items && this.items.remove(a))
                    },
                    _getContainer: function (a) {
                        return "items"
                    },
                    empty: function (a) {
                        try {
                            this._empty(a)
                        } catch (b) {
                            debugger
                        }
                    },
                    _empty: function (a) {
                        if (a =
                                a || this.items)for (var b = 0; b < a.length; b++) {
                            var c = a[b];
                            c && c.empty && c.empty();
                            c && this.scope && this.scope.blockStore && this.scope.blockStore.remove(c.id)
                        }
                    },
                    containsItem: function (a, b) {
                        for (var c = a.length; c--;)if (a[c].id === b.id)return !0;
                        return !1
                    },
                    indexOf: function (a, b) {
                        for (var c = a.length; c--;)if (a[c].id === b.id)return c;
                        return -1
                    },
                    _getBlock: function (a) {
                        try {
                            if (!this || !this.parentId)return !1;
                            var b = this.scope.getBlockById(this.parentId);
                            if (!b)return null;
                            var c = b[b._getContainer(this)];
                            if (!c || 2 > c.length || !this.containsItem(c,
                                    this))return null;
                            var d = this.indexOf(c, this);
                            if (0 > d + a)return !1;
                            var g = c[d + a];
                            if (g)return g
                        } catch (f) {
                            debugger
                        }
                        return null
                    },
                    getPreviousBlock: function () {
                        return this._getBlock(-1)
                    },
                    getNextBlock: function () {
                        return this._getBlock(1)
                    },
                    _getPreviousResult: function () {
                        var a = this.getPreviousBlock() || this.getParent();
                        return a && null != a._lastResult ? this.isArray(a._lastResult) ? a._lastResult : [a._lastResult] : null
                    },
                    getPreviousResult: function () {
                        var a = null;
                        if ((a = (a = this.getPreviousBlock()) && a._lastResult && a.enabled ? a : this.getParent()) && !a._lastResult) {
                            var b = a.getParent();
                            b && (a = b)
                        }
                        return a && null != a._lastResult ? (this.isArray(a._lastResult), a._lastResult) : null
                    },
                    _getArg: function (a, b) {
                        var c = parseFloat(a);
                        return isNaN(c) ? "true" === a || "false" === a ? "true" === a ? !0 : !1 : a && b && g.isString(a) ? "'" + a + "'" : a : c
                    },
                    getArgs: function (b) {
                        var c = [];
                        b = b || {};
                        var d = b.args || this._get("args");
                        b.override && b.override.args && (d = b.override.args);
                        d && (c = a.getJson(d, null, !1));
                        if (c && 0 == c.length && d && d.length && g.isString(d)) {
                            if (-1 !== d.indexOf(",")) {
                                d = d.split(",");
                                for (b = 0; b <
                                d.length; b++) {
                                    var f = parseFloat(d[b]);
                                    isNaN(f) ? "true" === d[b] || "false" === d[b] ? c.push(a.toBoolean(d[b])) : c.push(d[b]) : c.push(f)
                                }
                                return c
                            }
                            c = [this._getArg(d)]
                        }
                        !g.isArray(c) && (c = []);
                        b = this.getPreviousResult();
                        null != b && (g.isArray(b) && 1 == b.length ? c.push(b[0]) : c.push(b));
                        return c || [d]
                    },
                    remove: function (a) {
                        this._destroyed = !0;
                        null != this.parentId && null == this.parent && (this.parent = this.scope.getBlockById(this.parentId));
                        if (this.parent && this.parent.removeBlock)this.parent.removeBlock(this); else if (a = a || this)a.empty &&
                        a.empty(), delete a.items, a.parent = null, this.items && this.items.remove(a)
                    },
                    prepareBlockContructorArgs: function (a) {
                        a || (a = {});
                        a.id || (a.id = this.createUUID());
                        a.items || (a.items = [])
                    },
                    _add: function (a, c, d, g) {
                        var f = null;
                        try {
                            c ? (this.prepareBlockContructorArgs(c), f = b.createBlock(a, c, null, g)) : null == c && (f = a);
                            (f.scope = this.scope) && (f = this.scope.registerBlock(f, g));
                            if (f.id === this.id) {
                                console.error("adding new block to our self");
                                debugger
                            }
                            f.parent = this;
                            f.parentId = this.id;
                            var e = d || this._getContainer();
                            if (e)if (this[e] ||
                                (this[e] = []), -1 != this.indexOf(this[e], f))console.error(" have already " + f.id + " in " + e); else {
                                if (this.id == f.id) {
                                    console.error("tried to add our self to " + e);
                                    return
                                }
                                this[e].push(f)
                            }
                            f.group = null;
                            return f
                        } catch (q) {
                            logError(q, "_add")
                        }
                        return null
                    },
                    getStore: function () {
                        return this.getScope().getStore()
                    },
                    add: function (a, b, c) {
                        a = this._add(a, b, c);
                        return a.getStore().getSync(a.id)
                    },
                    getContext: function () {
                        return this.scope.instance && this.scope.instance ? this.scope.instance : null
                    },
                    resolved: function () {
                        this._deferredObject &&
                        (this._deferredObject.resolve(), delete this._deferredObject)
                    },
                    _solve: function (a, b) {
                        b = b || {highlight: !1};
                        for (var c = [], d = 0; d < this.items.length; d++)this.addToEnd(c, this.items[d].solve(a, b));
                        return c
                    },
                    solve: function (a, b) {
                        b = b || {highlight: !1};
                        for (var c = [], d = 0; d < this.items.length; d++)this.addToEnd(c, this.items[d].solve(a, b));
                        return c
                    },
                    solveMany: function (a, b) {
                        !this._lastRunSettings && b && (this._lastRunSettings = b);
                        b = this._lastRunSettings || b;
                        this._currentIndex = 0;
                        this._return = [];
                        var c = this[this._getContainer()];
                        if (c.length)return c = this.runFrom(c, 0, b), this.onSuccess(this, b), c;
                        this.onSuccess(this, b);
                        return []
                    },
                    runFrom: function (a, b, c) {
                        var d = this;
                        a = a || this.items;
                        var g = function (b) {
                            b._deferredObject.then(function (g) {
                                b._lastResult = b._lastResult || g;
                                d._currentIndex++;
                                d.runFrom(a, d._currentIndex, c)
                            })
                        };
                        if (a.length)for (; b < a.length; b++) {
                            var f = a[b];
                            if (!0 === f.deferred) {
                                f._deferredObject = new p;
                                this._currentIndex = b;
                                g(f);
                                this.addToEnd(this._return, f.solve(this.scope, c));
                                break
                            } else this.addToEnd(this._return, f.solve(this.scope,
                                c))
                        } else this.onSuccess(this, c);
                        return this._return
                    },
                    serializeField: function (a) {
                        return -1 == this.ignoreSerialize.indexOf(a)
                    },
                    onLoad: function () {
                    },
                    activate: function () {
                    },
                    deactivate: function () {
                    },
                    _get: function (a) {
                        if (this.override)return a in this.override ? this.override[a] : this[a]
                    },
                    onDidRun: function () {
                        this.override && (this.override.args && delete this.override.args, delete this.override)
                    },
                    destroy: function () {
                        this.stop(!0);
                        this.reset();
                        this._destroyed = !0
                    },
                    reset: function () {
                        this._lastSettings = {};
                        this._loop && (clearTimeout(this._loop),
                            this._loop = null);
                        delete this.override;
                        this.override = null;
                        delete this._lastResult;
                        this.override = null;
                        this.override = {}
                    },
                    stop: function () {
                        this.reset();
                        this.getItems && g.invoke(this.getItems(), "stop")
                    }
                });
                r.FLAGS = f.BLOCK_FLAGS;
                r.EMITS = f.BLOCK_CALLBACKMASK;
                r.prototype.onSuccess || (r.prototype.onSuccess = function () {
                }, r.prototype.onRun = function () {
                }, r.prototype.onFailed = function () {
                });
                e.chainAfter(r, "stop");
                e.chainAfter(r, "destroy");
                e.chainAfter(r, "onDidRun");
                return r
            })
        }, "xblox/model/ModelBase": function () {
            define(["dcl/dcl",
                "xide/utils", "xide/types", "xide/mixins/EventedMixin"], function (e, p, l, n) {
                n = e(n.dcl, {
                    declaredClass: "xblox.model.ModelBase",
                    id: null,
                    description: "",
                    parent: null,
                    parentId: null,
                    group: null,
                    order: 0,
                    _store: null,
                    outputs: function () {
                        return []
                    },
                    takes: function () {
                        return []
                    },
                    needs: function () {
                        return []
                    },
                    constructor: function (d) {
                        for (var b in d)d.hasOwnProperty(b) && (this[b] = d[b]);
                        this.id || (this.id = this.createUUID());
                        this.utils = p;
                        this.types = l
                    },
                    keys: function (d) {
                        var b = [], a;
                        for (a in d)b.push(a);
                        return b
                    },
                    values: function (d) {
                        var b =
                            [], a;
                        for (a in d)b.push(d[a]);
                        return b
                    },
                    toArray: function () {
                        return this.map()
                    },
                    size: function () {
                        return this.toArray().length
                    },
                    createUUID: function () {
                        var d = function () {
                            return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
                        };
                        return d() + d() + "-" + d() + "-" + d() + "-" + d() + "-" + d() + d() + d()
                    },
                    canEdit: function () {
                        return !0
                    },
                    getFields: function () {
                        return null
                    },
                    isString: function (d) {
                        return "string" == typeof d
                    },
                    isNumber: function (d) {
                        return "number" == typeof d
                    },
                    isBoolean: function (d) {
                        return "boolean" == typeof d
                    },
                    isObject: function (d) {
                        return "object" === typeof d
                    },
                    isArray: function (d) {
                        return Array.isArray ? Array.isArray(d) : !1
                    },
                    getValue: function (d) {
                        var b = parseFloat(d);
                        return isNaN(b) ? "true" === d || !0 === d ? !0 : "false" === d || !1 === d ? !1 : d : b
                    },
                    isScript: function (d) {
                        return this.isString(d) && (-1 != d.indexOf("return") || -1 != d.indexOf(";") || -1 != d.indexOf("(") || -1 != d.indexOf("+") || -1 != d.indexOf("-") || -1 != d.indexOf("\x3c") || -1 != d.indexOf("*") || -1 != d.indexOf("/") || -1 != d.indexOf("%") || -1 != d.indexOf("\x3d") || -1 != d.indexOf("\x3d\x3d") || -1 != d.indexOf("\x3e") || -1 != d.indexOf("[") ||
                            -1 != d.indexOf("{") || -1 != d.indexOf("}"))
                    },
                    replaceAll: function (d, b, a) {
                        return this.isString(a) ? a.split(d).join(b) : a
                    },
                    isInValidState: function () {
                        return !0
                    },
                    destroy: function () {
                    }
                });
                e.chainAfter(n, "destroy");
                return n
            })
        }, "xcf/manager/DriverManager_Server": function () {
            define(["dcl/dcl", "dojo/_base/declare", "xide/types", "xide/utils"], function (e, p, l, n) {
                return e(null, {
                    declaredClass: "xcf.manager.DriverManager_Server", onDriverBlocksChanged: function (d, b) {
                    }, onFileChanged: function (d) {
                        if ("changed" === d.type && !d._didb) {
                            d._didb = !0;
                            var b = n.replaceAll("\\", "/", d.path), b = n.replaceAll("//", "/", b), b = b.replace(/\\/g, "/"), a;
                            a = b;
                            a = -1 != a.indexOf("system/driver") ? a.substr(a.indexOf("system/driver") + 14, a.length) : null;
                            a && -1 !== a.indexOf(".xblox") && (console.log("driver blocks changed " + a + " @ " + b, d), this.onDriverBlocksChanged(b, a))
                        }
                    }, createDriverInstance: function (d, b) {
                        var a = this, f = this.driverScopes.system_drivers + "DriverBase";
                        require([f], function (c) {
                            c.prototype.declaredClass = f;
                            var g = a.driverScopes[d.scope], e = n.getCIInputValueByName(d.user,
                                l.DRIVER_PROPERTY.CF_DRIVER_CLASS);
                            if (e) {
                                var q = g + e, q = q.replace(".js", ""), q = q.replace("./", "");
                                require([q], function (g) {
                                    g = new (p([c], g.prototype));
                                    g.baseClass = c.prototype.declaredClass;
                                    g.modulePath = n.replaceAll("//", "/", q);
                                    g.delegate = a;
                                    d.instance = g;
                                    b && b(g);
                                    try {
                                        g.start()
                                    } catch (f) {
                                    }
                                    return g
                                })
                            } else console.error("cant find driver class in meta")
                        })
                    }
                })
            })
        }, "xcf/model/Driver": function () {
            define(["xdojo/declare", "dcl/dcl", "xide/data/Model", "xide/utils"], function (e, p, l, n) {
                return p(l, {
                    itemMetaPath: "user.meta",
                    getStore: function () {
                        return this._store
                    }, getScope: function () {
                        var d = this.getStore();
                        return d ? d.scope : this.scope
                    }, getMetaValue: function (d) {
                        return n.getCIInputValueByName(this.user, d)
                    }, setMetaValue: function (d, b, a) {
                        var f = n.getCIByChainAndName(this.user, 0, d);
                        if (f) {
                            var c = this.getMetaValue(d);
                            n.setCIValueByField(f, "value", b);
                            this[d] = b;
                            !1 !== a && this.publish(types.EVENTS.ON_CI_UPDATE, {
                                owner: this.owner,
                                ci: f,
                                newValue: b,
                                oldValue: c
                            })
                        }
                    }, getParent: function () {
                        return this._store.getSync(this.parentId)
                    }
                })
            })
        }, "xide/data/Model": function () {
            define(["dcl/dcl",
                "dojo/Deferred", "dojo/aspect", "dojo/when", "xide/utils"], function (e, p, l, n, d) {
                function b(a, b) {
                    var c = a.schema[b];
                    void 0 === c || c instanceof w || (c = new w(c), c._parent = a);
                    c && (c.name = b);
                    return c
                }

                function a(a) {
                    var b, c = 1;
                    a(function (a, d, h) {
                        a && a.then ? (c++, b || (b = new p), a.then(function (a) {
                            d(a, h);
                            c--;
                            c || b.resolve()
                        }).then(null, b.reject)) : d(a, h)
                    });
                    if (b)return c--, c || b.resolve(), b.promise
                }

                function f() {
                    2 > q && m && (m(), m = null);
                    q--
                }

                function c() {
                    return c
                }

                var g = [].slice, r = e(null, {
                    declaredClass: "xide/data/Model", schema: {},
                    additionalProperties: !0, _scenario: "update", constructor: function (a) {
                        this.init(a)
                    }, refresh: function (a, b) {
                        var c = this._store;
                        c && c.refreshItem(this, a, b)
                    }, getStore: function () {
                        return this._store
                    }, getParent: function () {
                        return this._store.getSync(this[this._store.parentProperty])
                    }, init: function (a) {
                        this._scenario = "insert";
                        a = this._setValues(a);
                        for (var b in this.schema) {
                            var c = this.schema[b];
                            c && "object" === typeof c && "default" in c && !a.hasOwnProperty(b) && (c = c["default"], a[b] = "function" === typeof c ? c.call(this) : c)
                        }
                    },
                    _setValues: function (a) {
                        return d.mixin(this, a)
                    }, _getValues: function () {
                        return this._values || this
                    }, save: function (a) {
                        var b = this;
                        return n(a && a.skipValidation ? !0 : this.validate(), function (a) {
                            if (!a)throw b.createValidationError(b.errors);
                            a = b._scenario;
                            b.prepareForSerialization();
                            return b._store && n(b._store["insert" === a ? "add" : "put"](b), function (a) {
                                    b.set(a);
                                    b._scenario = "update";
                                    return b
                                })
                        })
                    }, remove: function () {
                        var a = this._store;
                        return a.remove(a.getIdentity(this))
                    }, prepareForSerialization: function () {
                        this._scenario = void 0;
                        this._inherited && (this._inherited.toJSON = c)
                    }, createValidationError: function (a) {
                        return Error("Validation error")
                    }, property: function (a, c) {
                        var h = this.hasOwnProperty("_properties") ? this._properties : this._properties = new t, f = h[a];
                        f || (f = b(this, a), f = h[a] = f ? d.delegate(f) : new w, f.name = a, f._parent = this);
                        return c ? f.property.apply(f, g.call(arguments, 1)) : f
                    }, get: function (a) {
                        var c, h = this.schema[a];
                        return (h = c || this.schema[a]) && h.valueOf && (h.valueOf !== u || h.hasCustomGet) ? ((c = c || this.hasOwnProperty("_properties") &&
                            this._properties[a]) || (c = d.delegate(b(this, a), {
                            name: a,
                            _parent: this
                        })), c.valueOf()) : this._getValues()[a]
                    }, set: function (a, b) {
                        if ("object" === typeof a) {
                            q++;
                            try {
                                for (var d in a)b = a[d], !a.hasOwnProperty(d) || b && b.toJSON === c || this.set(d, b)
                            } finally {
                                f()
                            }
                        } else {
                            d = this.schema[a];
                            if (!d && !this.additionalProperties)return console.warn("Schema does not contain a definition for", a);
                            var h = this.hasOwnProperty("_properties") && this._properties[a];
                            !h && (b && "object" === typeof b || d && d.put !== x) && (h = this.property(a));
                            h ? h.put(b) :
                                (d && d.coerce && (b = d.coerce(b)), this._getValues()[a] = b);
                            return b
                        }
                    }, observe: function (a, b, c) {
                        return this.property(a).observe(b, c)
                    }, validate: function (a) {
                    }, isValid: function () {
                        var a = !0, b;
                        for (b in this.schema) {
                            var c = this.hasOwnProperty("_properties") && this._properties[b];
                            c && c.errors && c.errors.length && (a = !1)
                        }
                        return a
                    }
                });
                r.createSubclass = function (a, b) {
                    var c = e([this].concat(a), b || {});
                    c.extend = function (a) {
                        d.mixin(this.prototype, a);
                        return this
                    };
                    return c
                };
                var q = 0, k, m;
                (r.nextTurn = function (a) {
                    m = a
                }).atEnd = !0;
                var h =
                    e(r, {
                        observe: function (a, b) {
                            var c;
                            if ("string" === typeof a)return console.error("fff"), this.inherited(arguments);
                            b && b.onlyFutureUpdates || (c = new h, this._has() && (c.value = a(this.valueOf())));
                            var d = this._addListener(function (b) {
                                b = a(b);
                                c && c.put(b)
                            });
                            return c ? (c.remove = d.remove, c) : d
                        }, validateOnSet: !1, validators: null, _addListener: function (a) {
                            return l.after(this, "onchange", a, !0)
                        }, valueOf: function () {
                            return this._get()
                        }, _get: function () {
                            return this.value
                        }, _has: function () {
                            return this.hasOwnProperty("value")
                        }, setValue: function (a) {
                            this.value =
                                a
                        }, put: function (a) {
                            var b = this._get();
                            a = this.coerce(a);
                            this.errors && this.set("errors", void 0);
                            var c = this;
                            q++;
                            return n(this.setValue(a, this._parent), function (d) {
                                void 0 !== d && (a = d);
                                c.onchange && c._queueChange(c.onchange, b);
                                var h, g = b && "object" === typeof b && !(b instanceof Array), e = a && "object" === typeof a && !(a instanceof Array);
                                if (g || e) {
                                    d = {};
                                    if (g)for (h in b = b._getValues ? b._getValues() : b, b)d[h] = {old: b[h]};
                                    if (e)for (h in a = a._getValues ? a._getValues() : a, a)(d[h] = d[h] || {}).value = a[h];
                                    c._values = e && a;
                                    for (h in d)g =
                                        d[h], (e = c._properties && c._properties[h]) && e.onchange && e._queueChange(e.onchange, g.old)
                                }
                                c.validateOnSet && c.validate();
                                f()
                            })
                        }, coerce: function (a) {
                            var b = this.type;
                            b && ("string" === b ? a = "" + a : "number" === b ? a = +a : "boolean" === b ? a = "false" === a || "0" === a || a instanceof Array && !a.length ? !1 : !!a : "function" !== typeof b || a instanceof b || (a = new b(a)));
                            return a
                        }, addError: function (a) {
                            this.set("errors", (this.errors || []).concat([a]))
                        }, checkForErrors: function (a) {
                            var b = [];
                            this.type && !("function" === typeof this.type ? a instanceof this.type : this.type === typeof a) && b.push(a + " is not a " + this.type);
                            !this.required || null != a && "" !== a || b.push("required, and it was not present");
                            return b
                        }, validate: function () {
                            var b = this, c = this._parent, d = this.validators, h = this.valueOf(), g = [];
                            return n(a(function (a) {
                                function f(a) {
                                    a && g.push.apply(g, a)
                                }

                                if (d)for (var e = 0; e < d.length; e++)a(d[e].checkForErrors(h, b, c), f);
                                a(b.checkForErrors(h, b, c), f)
                            }), function () {
                                if (g.length)return b.set("errors", g), !1;
                                void 0 !== b.get("errors") && b.set("errors", void 0);
                                return !0
                            })
                        },
                        _queueChange: function (a, b) {
                            if (!a._queued) {
                                a._queued = !0;
                                var c = this, d = function () {
                                    a._queued = !1;
                                    a.call(c, c._get(), b)
                                };
                                k && k.push(d);
                                k || (!r.nextTurn.atEnd || 0 < q ? (k = [d], r.nextTurn(function () {
                                    for (var a = 0; a < k.length; a++)k[a]();
                                    k = null
                                })) : d())
                            }
                        }, toJSON: function () {
                            return this._values || this
                        }
                    }), t = function () {
                };
                t.prototype.toJSON = c;
                var w = r.Property = e(h, {
                    init: function (a) {
                        if ("string" === typeof a || "function" === typeof a)a = {type: a};
                        a && d.mixin(this, a)
                    }, _get: function () {
                        return this._parent._getValues()[this.name]
                    }, _has: function () {
                        return this.name in
                            this._parent._getValues()
                    }, setValue: function (a, b) {
                        b._getValues()[this.name] = a
                    }
                }), u = w.prototype.valueOf, x = w.prototype.put;
                return r
            })
        }, "xide/manager/ServerActionBase": function () {
            define("dcl/dcl dojo/_base/declare xdojo/has dojo/Deferred xide/manager/RPCService xide/manager/ManagerBase xide/types xide/utils".split(" "), function (e, p, l, n, d, b, a, f) {
                l = {
                    declaredClass: "xide.manager.ServerActionBase",
                    serviceObject: null,
                    serviceUrl: null,
                    singleton: !0,
                    serviceClass: null,
                    defaultOptions: {omit: !0, checkMessages: !0, checkErrors: !0},
                    base64_encode: function (a) {
                        var b, d, f, e, m = 0, h = 0, t = "", t = [];
                        if (!a)return a;
                        do b = a.charCodeAt(m++), d = a.charCodeAt(m++), f = a.charCodeAt(m++), e = b << 16 | d << 8 | f, b = e >> 18 & 63, d = e >> 12 & 63, f = e >> 6 & 63, e &= 63, t[h++] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt(b) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt(d) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt(f) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt(e);
                        while (m < a.length);
                        t = t.join("");
                        a = a.length % 3;
                        return (a ? t.slice(0, a - 3) : t) + "\x3d\x3d\x3d".slice(a || 3)
                    },
                    runDeferred: function (a, b, d, f) {
                        var e = this;
                        if (this.serviceObject.__init) {
                            if (this.serviceObject.__init.isResolved())return e._runDeferred(a, b, d, f);
                            var m = new n;
                            this.serviceObject.__init.then(function () {
                                e._runDeferred(a, b, d, f).then(function () {
                                    m.resolve(arguments)
                                })
                            });
                            return m
                        }
                        return e._runDeferred(a, b, d, f)
                    },
                    _runDeferred: function (b, d, f, e) {
                        var k = new n, m;
                        e = e || this.defaultOptions;
                        this.check();
                        if (!this.checkCall(b,
                                d, e.omit))return k.reject("method doesnt exists: " + d + " for service class:" + this.serviceClass + " in " + this.declaredClass);
                        this.prepareCall();
                        var h = this.getService(), t = this.getServiceClass(b), l = this, u = function (a, b) {
                            var c = k;
                            e.returnProm && (c = m);
                            c._data = a;
                            if (b && e.onError)return e.onError(b);
                            c.resolve(a)
                        };
                        m = h[t][d](f);
                        m.then(function (b) {
                            b = b || {};
                            var c = b.error || {};
                            if (e.checkMessages && c && 3 == c.code)l.onMessages(c);
                            if (e.checkErrors) {
                                if (1 == c.code) {
                                    e.displayError && l.onError(c, t + "::" + d);
                                    k.reject(c);
                                    return
                                }
                            } else {
                                if (1 ==
                                    c.code && e.displayError)l.onError(c, t + "::" + d);
                                if (c && 0 !== c.code) {
                                    u(b, c);
                                    return
                                }
                            }
                            e.omit && l.publish(a.EVENTS.STATUS, {message: "Ok!", what: arguments}, this);
                            u(b)
                        }, function (a) {
                            l.onError(a)
                        });
                        return e.returnProm ? m : k
                    },
                    getService: function () {
                        return this.serviceObject
                    },
                    getServiceClass: function (a) {
                        return a || this.serviceClass
                    },
                    hasMethod: function (a, b) {
                        var d = this.getService(), f = b || this.getServiceClass();
                        return d && f && null != d[f] && null != d[f][a]
                    },
                    findServiceUrl: function (a) {
                        var b = window.xFileConfig;
                        if (b && b.mixins)for (var d =
                            0; d < b.mixins.length; d++) {
                            var f = b.mixins[d];
                            if (f.declaredClass === a && f.mixin && f.mixin.serviceUrl)return decodeURIComponent(f.mixin.serviceUrl)
                        }
                        return null
                    },
                    init: function () {
                        this.check()
                    },
                    _initService: function () {
                        return !1
                    },
                    check: function () {
                        this.serviceObject || this._initService()
                    },
                    onError: function (b, d) {
                        if (b)if (1 === b.code) {
                            if (b.message && _.isArray(b.message)) {
                                this.publish(a.EVENTS.ERROR, {message: b.message.join("\x3cbr/\x3e")});
                                return
                            }
                        } else 0 === b.code && this.publish(a.EVENTS.STATUS, "Ok");
                        d && (b.message = d + " -\x3e " +
                            b.message);
                        this.publish(a.EVENTS.ERROR, {error: b}, this)
                    },
                    checkCall: function (a, b, d) {
                        a = this.getServiceClass(a);
                        return this.getService() ? this.hasMethod(b, a) || !0 !== d ? !0 : (this.onError({
                            code: 1,
                            message: ["Sorry, server doesnt know " + b]
                        }), !1) : !1
                    },
                    prepareCall: function () {
                        var a = {};
                        this.config && this.config.RPC_PARAMS && (a = f.mixin(a, this.config.RPC_PARAMS.rpcFixedParams), this.serviceObject.extraArgs = a, this.config.RPC_PARAMS.rpcUserField && (a[this.config.RPC_PARAMS.rpcUserField] = this.config.RPC_PARAMS.rpcUserValue,
                            this.serviceObject.signatureField = this.config.RPC_PARAMS.rpcSignatureField, this.serviceObject.signatureToken = this.config.RPC_PARAMS.rpcSignatureToken))
                    },
                    callMethodEx: function (b, d, f, e, k) {
                        (b = b || this.serviceClass) || console.error("have no service class! " + this.declaredClass, this);
                        this.check();
                        if (this.checkCall(b, d, k)) {
                            this.prepareCall();
                            var m = this;
                            return this.serviceObject[this.getServiceClass(b)][d](f).then(function (h) {
                                try {
                                    e && e(h)
                                } catch (f) {
                                    console.error("bad news : callback for method " + d + " caused a crash in service class " +
                                        b), logError(f, "server method failed " + f)
                                }
                                if (h && h.error && 3 == h.error.code)m.onMessages(h.error);
                                if (h && h.error && h.error && 0 != h.error.code)m.onError(h.error); else 1 == k && m.publish(a.EVENTS.STATUS, {message: "Ok!"}, this)
                            }, function (a) {
                                m.onError(a)
                            })
                        }
                    },
                    callMethodEx2: function (a, b, d, f, e) {
                        this.check();
                        if (this.checkCall(a, b, e))return this.prepareCall(), this.serviceObject[this.getServiceClass(a)][b](d)
                    },
                    callMethod: function (b, d, e, q) {
                        d = d || [[]];
                        var k = this.serviceClass;
                        try {
                            var m = this;
                            if (null == this.serviceObject[k][b]) {
                                if (!0 ===
                                    q)this.onError({code: 1, message: ["Sorry, server doesnt know " + b]});
                                return null
                            }
                            k = {};
                            k = f.mixin(k, this.config.RPC_PARAMS.rpcFixedParams);
                            k[this.config.RPC_PARAMS.rpcUserField] = this.config.RPC_PARAMS.rpcUserValue;
                            this.serviceObject.extraArgs = k;
                            this.serviceObject.signatureField = this.config.RPC_PARAMS.rpcSignatureField;
                            this.serviceObject.signatureToken = this.config.RPC_PARAMS.rpcSignatureToken;
                            this.serviceObject[this.serviceClass][b](d).then(function (b) {
                                try {
                                    e && e(b)
                                } catch (c) {
                                    logError(c, "Error calling RPC method")
                                }
                                if (b &&
                                    b.error && 3 == b.error.code)this.onMessages(b.error);
                                if (b && b.error && b.error && 1 == b.error.code)this.onError(b.error); else!1 !== q && this.publish(a.EVENTS.STATUS, {message: "Ok!"}, this)
                            }.bind(this), function (a) {
                                this.onError(a)
                            }.bind(this))
                        } catch (h) {
                            m.onError(h), logError(h, "Error calling RPC method")
                        }
                    }
                };
                e = e(b, l);
                e.declare = p(null, l);
                return e
            })
        }, "xide/manager/RPCService": function () {
            define("dojo/_base/declare dojo/_base/kernel dojo/_base/lang xide/rpc/Service xide/rpc/JsonRPC dojo/has dojo/Deferred xide/utils xide/types xide/mixins/EventedMixin xide/encoding/SHA1".split(" "),
                function (e, p, l, n, d, b, a, f, c, g, r) {
                    return e("xide.manager.RPCService", [n, g], {
                        extraArgs: null,
                        signatureField: "sig",
                        signatureToken: null,
                        correctTarget: !0,
                        sync: !1,
                        defaultOptions: {omit: !0, checkMessages: !0, checkErrors: !0},
                        onError: function (a) {
                            if (a)if (1 === a.code) {
                                if (a.message && _.isArray(a.message)) {
                                    this.publish(c.EVENTS.ERROR, {message: a.message.join("\x3cbr/\x3e")});
                                    return
                                }
                            } else 0 === a.code && this.publish(c.EVENTS.STATUS, "Ok");
                            this.publish(c.EVENTS.ERROR, {error: a}, this)
                        },
                        prepareCall: function () {
                            var a = {};
                            this.config &&
                            this.config.RPC_PARAMS && (this.extraArgs = a = f.mixin(a, this.config.RPC_PARAMS.rpcFixedParams), this.config.RPC_PARAMS.rpcUserField && (a[this.config.RPC_PARAMS.rpcUserField] = this.config.RPC_PARAMS.rpcUserValue, this.signatureField = this.config.RPC_PARAMS.rpcSignatureField, this.signatureToken = this.config.RPC_PARAMS.rpcSignatureToken))
                        },
                        runDeferred: function (b, d, g, h) {
                            var f = new a;
                            h = h || this.defaultOptions;
                            if (!this.checkCall(b, d, h.omit))return f.reject("method doesnt exists: " + d + " for service class:" + this.serviceClass +
                                " in " + this.declaredClass);
                            this.prepareCall();
                            var e = this;
                            this[this.getServiceClass(b)][d](g).then(function (a) {
                                if (h.checkMessages && a && a.error && 3 == a.error.code)e.onMessages(a.error);
                                h.checkErrors && a && a.error && a.error && 0 != a.error.code ? (e.onError(a.error), f.reject(a.error)) : (h.omit && e.publish(c.EVENTS.STATUS, {
                                    message: "Ok!",
                                    what: arguments
                                }, this), f.resolve(a))
                            }, function (a) {
                                e.onError(a)
                            });
                            return f
                        },
                        getParameterMap: function (a, b) {
                            var c = this._smd.services[a + "." + b];
                            return c && c.parameters ? c.parameters : []
                        },
                        _getRequest: function (a,
                                               b) {
                            var c = this._smd, d = n.envelopeRegistry.match(a.envelope || c.envelope || "NONE"), g = (a.parameters || a.params || []).concat(c.parameters || []);
                            if (d.namedParams) {
                                if (1 == b.length && l.isObject(b[0]))b = b[0]; else {
                                    for (var f = {}, e = a.parameters || a.params, r = 0; r < e.length; r++)"undefined" == typeof b[r] && e[r].optional || (f[e[r].name] = b[r]);
                                    b = f
                                }
                                if (a.strictParameters || c.strictParameters)for (r in b) {
                                    f = !1;
                                    for (e = 0; e < g.length; e++)g[r].name == r && (f = !0);
                                    f || delete b[r]
                                }
                                for (r = 0; r < g.length; r++)if (f = g[r], !f.optional && f.name && null != b && !b[f.name])if (f["default"])b[f.name] =
                                    f["default"]; else if (!(f.name in b))throw Error("Required parameter " + f.name + " was omitted");
                            } else g && g[0] && g[0].name && 1 == b.length && p.isObject(b[0]) && (b = !1 === d.namedParams ? n.toOrdered(g, b) : b[0]);
                            l.isObject(this._options) && (b = p.mixin(b, this._options));
                            g = a._schema || a.returns;
                            r = d.serialize.apply(this, [c, a, b]);
                            r._envDef = d;
                            return p.mixin(r, {
                                sync: this.sync,
                                contentType: a.contentType || c.contentType || r.contentType,
                                headers: a.headers || c.headers || r.headers || {},
                                target: r.target || n.getTarget(c, a),
                                transport: a.transport ||
                                c.transport || r.transport,
                                envelope: a.envelope || c.envelope || r.envelope,
                                timeout: a.timeout || c.timeout,
                                callbackParamName: a.callbackParamName || c.callbackParamName,
                                rpcObjectParamName: a.rpcObjectParamName || c.rpcObjectParamName,
                                schema: g,
                                handleAs: r.handleAs || "auto",
                                preventCache: a.preventCache || c.preventCache,
                                frameDoc: this._options.frameDoc || void 0
                            })
                        },
                        _executeMethod: function (a) {
                            var b = [], c;
                            if (2 == arguments.length && l.isArray(arguments[1]))b = arguments[1]; else for (c = 1; c < arguments.length; c++)b.push(arguments[c]);
                            var d = this._getRequest(a, b);
                            this.correctTarget && (d.target = this._smd.target);
                            if (this.extraArgs)for (var g in this.extraArgs)d.target += -1 != d.target.indexOf("?") ? "\x26" : "?", d.target += g + "\x3d" + this.extraArgs[g];
                            this.signatureToken && (d.target += -1 != d.target.indexOf("?") ? "\x26" : "?", b = r._hmac(d.data, this.signatureToken, 1), b = r._hmac(d.data, this.signatureToken, 1), d.target += this.signatureField + "\x3d" + b);
                            b = n.transportRegistry.match(d.transport).fire(d);
                            b.addBoth(function (a) {
                                return d._envDef.deserialize.call(this,
                                    a)
                            });
                            return b
                        },
                        getServiceClass: function (a) {
                            return a || this.serviceClass
                        },
                        hasMethod: function (a, b) {
                            var c = b || this.getServiceClass();
                            return this && c && null != this[c] && null != this[c][a]
                        },
                        checkCall: function (a, b, c) {
                            a = this.getServiceClass(a);
                            if (!this.hasMethod(b, a) && !0 === c) {
                                debugger;
                                this.onError({code: 1, message: ["Sorry, server doesnt know " + b]});
                                return !1
                            }
                            return !0
                        },
                        base64_encode: function (a) {
                            var b, c, d, g, f = 0, e = 0, n = "", n = [];
                            if (!a)return a;
                            do b = a.charCodeAt(f++), c = a.charCodeAt(f++), d = a.charCodeAt(f++), g = b << 16 | c << 8 |
                                d, b = g >> 18 & 63, c = g >> 12 & 63, d = g >> 6 & 63, g &= 63, n[e++] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt(b) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt(c) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt(d) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt(g); while (f < a.length);
                            n = n.join("");
                            a = a.length % 3;
                            return (a ? n.slice(0, a - 3) : n) + "\x3d\x3d\x3d".slice(a || 3)
                        },
                        callMethodEx: function (a, b, c, d, g,
                                                f) {
                            if (!this[a] || null == this[a][b])return !0 === f && g && g({
                                code: 1,
                                message: ["Sorry, server doesnt know " + b + " in class" + a]
                            }), null;
                            f = {};
                            this.config && this.config.RPC_PARAMS && (f = l.mixin(f, this.config.RPC_PARAMS.rpcFixedParams), f[this.config.RPC_PARAMS.rpcUserField] = this.config.RPC_PARAMS.rpcUserValue, this.extraArgs = f, this.signatureField = this.config.RPC_PARAMS.rpcSignatureField, this.signatureToken = this.config.RPC_PARAMS.rpcSignatureToken);
                            this[a][b](c).then(function (c) {
                                try {
                                    d && d(c)
                                } catch (f) {
                                    console.error("bad news : callback for method " +
                                        b + " caused a crash in service class " + a)
                                }
                                c && c.error && c.error && 0 != c.error.code && g && g(c.error)
                            }, function (a) {
                                g(a)
                            })
                        },
                        callMethod: function (a, b, c, d, g, f) {
                            try {
                                var e = this;
                                if (null == this[a][b]) {
                                    if (!0 === f && g) {
                                        debugger;
                                        g({code: 1, message: ["Sorry, server doesnt know " + b]})
                                    }
                                    return null
                                }
                                f = {};
                                f = l.mixin(f, this.config.RPC_PARAMS.rpcFixedParams);
                                this[a][b](c).then(function (a) {
                                    try {
                                        d && d(a)
                                    } catch (c) {
                                        console.error("crashed in " + b), console.dir(c)
                                    }
                                    a && a.error && a.error && 1 == a.error.code && g && g(a.error)
                                }, function (a) {
                                    e.onError(a)
                                })
                            } catch (n) {
                                console.error("crash! " +
                                    n)
                            }
                        }
                    })
                })
        }, "xide/rpc/Service": function () {
            define("dojo/_base/kernel dojo/_base/lang dojo/_base/xhr dojo/_base/declare xide/rpc/AdapterRegistry dojo/_base/url xide/utils xide/lodash".split(" "), function (e, p, l, n, d, b, a, f) {
                function c(a, b) {
                    var c = a._baseUrl;
                    a.target && (c = new e._Url(c, a.target) + "");
                    b.target && (c = new e._Url(c, b.target) + "");
                    return c
                }

                function g(a, b) {
                    if (e.isArray(b))return b;
                    for (var c = [], d = 0; d < a.length; d++)c.push(b[a[d].name]);
                    return c
                }

                var r = new d(!0), q = new d(!0), k = 1;
                n = n("xide.rpc.Service", null,
                    {
                        constructor: function (b, c) {
                            function d(a) {
                                a._baseUrl = new e._Url(e.isBrowser ? location.href : e.config.baseUrl, g || ".") + "";
                                k._smd = a;
                                c && "methods" === c.services && (a.services = a.methods, delete a.methods, a.transport = "POST", c.mixin && p.mixin(a, c.mixin), c = null);
                                for (var b in k._smd.services) {
                                    a = b.split(".");
                                    for (var f = k, m = 0; m < a.length - 1; m++)f = f[a[m]] || (f[a[m]] = {});
                                    f[a[a.length - 1]] = k._generateService(b, k._smd.services[b])
                                }
                            }

                            var g, k = this;
                            b && (f.isString(b) || b instanceof e._Url ? (g = b instanceof e._Url ? b + "" : b, this.__init =
                                l.getText(g), k = this, this.__init.then(function (b) {
                                d(a.fromJson(b))
                            })) : d(b));
                            this._options = c ? c : {};
                            this._requestId = 0
                        }, _generateService: function (a, b) {
                        if (this[b])throw Error("WARNING: " + a + " already exists for service. Unable to generate function");
                        b.name = a;
                        var c = e.hitch(this, "_executeMethod", b), d = r.match(b.transport || this._smd.transport);
                        d.getExecutor && (c = d.getExecutor(c, b, this));
                        d = b.returns || (b._schema = {});
                        d._service = c;
                        c.servicePath = "/" + a + "/";
                        c._schema = d;
                        c.id = k++;
                        return c
                    }, _getRequest: function (a, b) {
                        var d =
                            this._smd, f = q.match(a.envelope || d.envelope || "NONE"), k = (a.parameters || []).concat(d.parameters || []);
                        if (f.namedParams) {
                            if (1 == b.length && e.isObject(b[0]))b = b[0]; else {
                                for (var n = {}, r = 0; r < a.parameters.length; r++)"undefined" == typeof b[r] && a.parameters[r].optional || (n[a.parameters[r].name] = b[r]);
                                b = n
                            }
                            if (a.strictParameters || d.strictParameters)for (r in b) {
                                for (var n = !1, l = 0; l < k.length; l++)k[l].name == r && (n = !0);
                                n || delete b[r]
                            }
                            for (r = 0; r < k.length; r++)if (n = k[r], !n.optional && n.name && !b[n.name])if (n["default"])b[n.name] =
                                n["default"]; else if (!(n.name in b))throw Error("Required parameter " + n.name + " was omitted");
                        } else k && k[0] && k[0].name && 1 == b.length && e.isObject(b[0]) && (b = !1 === f.namedParams ? g(k, b) : b[0]);
                        e.isObject(this._options) && (b = e.mixin(b, this._options));
                        delete b.mixin;
                        k = a._schema || a.returns;
                        r = f.serialize.apply(this, [d, a, b]);
                        r._envDef = f;
                        return e.mixin(r, {
                            sync: !1,
                            contentType: a.contentType || d.contentType || r.contentType,
                            headers: a.headers || d.headers || r.headers || {},
                            target: r.target || c(d, a),
                            transport: a.transport || d.transport ||
                            r.transport,
                            envelope: a.envelope || d.envelope || r.envelope,
                            timeout: a.timeout || d.timeout,
                            callbackParamName: a.callbackParamName || d.callbackParamName,
                            rpcObjectParamName: a.rpcObjectParamName || d.rpcObjectParamName,
                            schema: k,
                            handleAs: r.handleAs || "auto",
                            preventCache: a.preventCache || d.preventCache,
                            frameDoc: this._options.frameDoc || void 0
                        })
                    }, _executeMethod: function (a) {
                        var b = [], c;
                        for (c = 1; c < arguments.length; c++)b.push(arguments[c]);
                        var d = this._getRequest(a, b), b = r.match(d.transport).fire(d);
                        b.addBoth(function (a) {
                            return d._envDef.deserialize.call(this,
                                a)
                        });
                        return b
                    }
                    });
                n.transportRegistry = r;
                n.envelopeRegistry = q;
                n._nextId = k;
                n.getTarget = c;
                n.toOrdered = g;
                n._sync = !1;
                q.register("URL", function (a) {
                    return "URL" == a
                }, {
                    serialize: function (a, b, c) {
                        return {data: e.objectToQuery(c), transport: "POST"}
                    }, deserialize: function (a) {
                        return a
                    }, namedParams: !0
                });
                q.register("JSON", function (a) {
                    return "JSON" == a
                }, {
                    serialize: function (a, b, c) {
                        return {data: e.toJson(c), handleAs: "json", contentType: "application/json"}
                    }, deserialize: function (a) {
                        return a
                    }
                });
                q.register("PATH", function (a) {
                    return "PATH" ==
                        a
                }, {
                    serialize: function (a, b, d) {
                        var g;
                        a = c(a, b);
                        if (e.isArray(d))for (g = 0; g < d.length; g++)a += "/" + d[g]; else for (g in d)a += "/" + g + "/" + d[g];
                        return {data: "", target: a}
                    }, deserialize: function (a) {
                        return a
                    }
                });
                r.register("POST", function (a) {
                    return "POST" == a
                }, {
                    fire: function (a) {
                        a.url = a.target;
                        a.postData = a.data;
                        return e.rawXhrPost(a)
                    }
                });
                r.register("GET", function (a) {
                    return "GET" == a
                }, {
                    fire: function (a) {
                        a.url = a.target + (a.data ? "?" + (a.rpcObjectParamName ? a.rpcObjectParamName + "\x3d" : "") + a.data : "");
                        return l.get(a)
                    }
                });
                e._contentHandlers &&
                (e._contentHandlers.auto = function (a) {
                    var b = e._contentHandlers, c = a.getResponseHeader("Content-Type");
                    return c ? c.match(/\/.*json/) ? b.json(a) : c.match(/\/javascript/) ? b.javascript(a) : c.match(/\/xml/) ? b.xml(a) : b.text(a) : b.text(a)
                });
                return n
            })
        }, "xide/rpc/AdapterRegistry": function () {
            define(["dojo/_base/kernel", "dojo/_base/lang"], function (e, p) {
                var l = e.AdapterRegistry = function (e) {
                    this.pairs = [];
                    this.returnWrappers = e || !1
                };
                p.extend(l, {
                    register: function (e, d, b, a, f) {
                        this.pairs[f ? "unshift" : "push"]([e, d, b, a])
                    }, match: function () {
                        for (var e =
                            0; e < this.pairs.length; e++) {
                            var d = this.pairs[e];
                            if (d[1].apply(this, arguments))return d[3] || this.returnWrappers ? d[2] : d[2].apply(this, arguments)
                        }
                        throw Error("No match found");
                    }, unregister: function (e) {
                        for (var d = 0; d < this.pairs.length; d++)if (this.pairs[d][0] == e)return this.pairs.splice(d, 1), !0;
                        return !1
                    }
                });
                return l
            })
        }, "xide/rpc/JsonRPC": function () {
            define(["./Service", "dojo/errors/RequestError", "xide/utils/StringUtils"], function (e, p, l) {
                function n(d) {
                    return {
                        serialize: function (b, a, f, c) {
                            b = {
                                id: this._requestId++,
                                method: a.name, params: f
                            };
                            d && (b.jsonrpc = d);
                            return {
                                data: JSON.stringify(b),
                                handleAs: "json",
                                contentType: "application/json",
                                transport: "POST"
                            }
                        }, deserialize: function (b) {
                            if ("Error" == b.name || b instanceof p)b = l.fromJson(b.responseText);
                            if (b.error) {
                                var a = Error(b.error.message || b.error);
                                a._rpcErrorObject = b.error;
                                return a
                            }
                            return b.result
                        }
                    }
                }

                e.envelopeRegistry.register("JSON-RPC-1.0", function (d) {
                    return "JSON-RPC-1.0" == d
                }, l.mixin({namedParams: !1}, n()));
                e.envelopeRegistry.register("JSON-RPC-2.0", function (d) {
                    return "JSON-RPC-2.0" ==
                        d
                }, l.mixin({namedParams: !0}, n("2.0")))
            })
        }, "xide/encoding/SHA1": function () {
            define(["./_base"], function (e) {
                function p(a, b) {
                    a[b >> 5] |= 128 << 24 - b % 32;
                    a[(b + 64 >> 9 << 4) + 15] = b;
                    for (var c = Array(80), d = 1732584193, n = -271733879, q = -1732584194, k = 271733878, m = -1009589776, h = 0; h < a.length; h += 16) {
                        for (var t = d, l = n, p = q, x = k, v = m, B = 0; 80 > B; B++) {
                            if (16 > B)c[B] = a[h + B]; else {
                                var y = c[B - 3] ^ c[B - 8] ^ c[B - 14] ^ c[B - 16];
                                c[B] = y << 1 | y >>> 31
                            }
                            y = e.addWords(e.addWords(d << 5 | d >>> 27, 20 > B ? n & q | ~n & k : 40 > B ? n ^ q ^ k : 60 > B ? n & q | n & k | q & k : n ^ q ^ k), e.addWords(e.addWords(m,
                                c[B]), 20 > B ? 1518500249 : 40 > B ? 1859775393 : 60 > B ? -1894007588 : -899497514));
                            m = k;
                            k = q;
                            q = n << 30 | n >>> 2;
                            n = d;
                            d = y
                        }
                        d = e.addWords(d, t);
                        n = e.addWords(n, l);
                        q = e.addWords(q, p);
                        k = e.addWords(k, x);
                        m = e.addWords(m, v)
                    }
                    return [d, n, q, k, m]
                }

                function l(a) {
                    for (var b = [], c = 0, d = 8 * a.length; c < d; c += 8)b[c >> 5] |= (a.charCodeAt(c / 8) & 255) << 24 - c % 32;
                    return b
                }

                function n(a) {
                    for (var b = [], c = 0, d = 4 * a.length; c < d; c++)b.push("0123456789abcdef".charAt(a[c >> 2] >> 8 * (3 - c % 4) + 4 & 15), "0123456789abcdef".charAt(a[c >> 2] >> 8 * (3 - c % 4) & 15));
                    return b.join("")
                }

                function d(a) {
                    for (var b =
                        [], c = 0, d = 32 * a.length; c < d; c += 8)b.push(String.fromCharCode(a[c >> 5] >>> 24 - c % 32 & 255));
                    return b.join("")
                }

                function b(a) {
                    for (var b = [], c = 0, d = 4 * a.length; c < d; c += 3)for (var e = (a[c >> 2] >> 8 * (3 - c % 4) & 255) << 16 | (a[c + 1 >> 2] >> 8 * (3 - (c + 1) % 4) & 255) << 8 | a[c + 2 >> 2] >> 8 * (3 - (c + 2) % 4) & 255, n = 0; 4 > n; n++)8 * c + 6 * n > 32 * a.length ? b.push("\x3d") : b.push("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >> 6 * (3 - n) & 63));
                    return b.join("")
                }

                e.SHA1 = function (a, f) {
                    var c = f || e.outputTypes.Base64, g = p(l(a), 8 * a.length);
                    switch (c) {
                        case e.outputTypes.Raw:
                            return g;
                        case e.outputTypes.Hex:
                            return n(g);
                        case e.outputTypes.String:
                            return d(g);
                        default:
                            return b(g)
                    }
                };
                e.SHA1._hmac = function (a, f, c) {
                    c = c || e.outputTypes.Base64;
                    var g = l(f);
                    16 < g.length && (g = p(g, 8 * f.length));
                    var r = Array(16);
                    f = Array(16);
                    for (var q = 0; 16 > q; q++)r[q] = g[q] ^ 909522486, f[q] = g[q] ^ 1549556828;
                    a = p(r.concat(l(a)), 512 + 8 * a.length);
                    a = p(f.concat(a), 672);
                    switch (c) {
                        case e.outputTypes.Raw:
                            return a;
                        case e.outputTypes.Hex:
                            return n(a);
                        case e.outputTypes.String:
                            return d(a);
                        default:
                            return b(a)
                    }
                };
                return e.SHA1
            })
        }, "xide/manager/ManagerBase": function () {
            define("dcl/dcl xide/mixins/EventedMixin xide/model/Base xide/utils dojo/_base/xhr dojo/_base/kernel".split(" "),
                function (e, p, l, n, d, b) {
                    p = e([l.dcl, p.dcl], {
                        declaredClass: "xide.manager.ManagerBase", ctx: null, init: function () {
                            this.initReload && this.initReload()
                        }, _getText: function (a, b) {
                            var c;
                            b = n.mixin({
                                url: a, sync: !0, handleAs: "text", load: function (a) {
                                    c = a
                                }
                            }, b);
                            var g = d.get(b);
                            return b.sync ? "" + c + "" : g
                        }, getContext: function () {
                            return this.ctx
                        }
                    });
                    e.chainAfter(p, "init");
                    return p
                })
        }, "xide/data/Reference": function () {
            define(["dojo/_base/declare", "dcl/dcl", "xide/utils", "xide/lodash", "xide/mixins/EventedMixin"], function (e, p, l, n, d) {
                e =
                {
                    _sources: [], destroyOnRemove: !0, removeSource: function (b) {
                }, updateSource: function (b) {
                }, onSourceUpdate: function (b) {
                }, onSourceRemoved: function (b) {
                }, onSourceDelete: function (b) {
                }, onItemChanged: function (b) {
                }, destroy: function () {
                    (!this.item || this.item.removeReference) && this.item && this.item.removeReference(this);
                    this.inherited && this.inherited(arguments);
                    if (this._sources) {
                        for (var b = 0; b < this._sources.length; b++) {
                            var a = this._sources[b];
                            a.item && a.item.removeReference && a.item.removeReference(this)
                        }
                        this._sources =
                            null
                    }
                }, hasSource: function (b) {
                    return n.find(this._sources, {item: b})
                }, addSource: function (b, a) {
                    this.hasSource(b) ? console.warn("already have source") : (this._sources.push({
                        item: b,
                        settings: a
                    }), a && a.onDelete && this.addHandle("delete", b._store.on("delete", function (a) {
                        a.target == b && this._store.removeSync(this[this._store.idProperty])
                    }.bind(this))))
                }, updateSources: function (b) {
                    for (var a = 0; a < this._sources.length; a++) {
                        var d = this._sources[a], c = d.item, d = d.settings;
                        b.property && d.properties && d.properties[b.property] &&
                        (c._store._ignoreChangeEvents = !0, c.set(b.property, b.value), c._store._ignoreChangeEvents = !1, c._store.emit("update", {target: c}))
                    }
                }, constructor: function (b) {
                    this._sources = [];
                    l.mixin(this, b)
                }
                };
                p = p([d.dcl], e);
                p.Implementation = e;
                return p
            })
        }, "xcf/manager/DeviceManager": function () {
            define("dcl/dcl xdojo/declare dojo/_base/lang xide/encoding/MD5 xide/types xide/utils xide/factory xcf/manager/BeanManager xide/mixins/ReloadMixin xide/mixins/EventedMixin ./DeviceManager_Server ./DeviceManager_DeviceServer xide/data/Memory xide/data/TreeMemory dojo/has xide/data/ObservableStore dstore/Trackable xcf/model/Device dojo/Deferred xide/manager/ServerActionBase xide/data/Reference xide/utils/StringUtils xcf/mixins/LogMixin xdojo/has!xcf-ui?./DeviceManager_UI xdojo/has!xexpression?xexpression/Expression dojo/promise/all xide/console xide/lodash".split(" "),
                function (e, p, l, n, d, b, a, f, c, g, r, q, k, m, h, t, w, u, x, v, B, y, E, J, G, D, z, C, I, A) {
                    a = [v, f, r, q, c.dcl, E];
                    var H = h("xcf-ui"), F = d.DEVICE_PROPERTY;
                    h("runDrivers");
                    var K = d.EVENTS;
                    h("xcf-ui") && a.push(J);
                    return e(a, {
                        declaredClass: "xcf.manager.DeviceManager",
                        beanNamespace: "device",
                        beanName: "Device",
                        beanUrlPattern: "{id}",
                        breanScheme: "device://",
                        beanPriority: 1,
                        beanIconClass: "fa-sliders",
                        groupType: d.ITEM_TYPE.DEVICE_GROUP,
                        itemType: d.ITEM_TYPE.DEVICE,
                        itemMetaTitleField: F.CF_DEVICE_TITLE,
                        systemScope: "system_devices",
                        userScope: "user_devices",
                        appScope: "app_devices",
                        defaultScope: "system_devices",
                        serviceClass: "XCF_Device_Service",
                        rawData: null,
                        store: null,
                        treeView: null,
                        deviceServerClient: null,
                        deviceInstances: null,
                        driverScopes: null,
                        autoConnectDevices: !0,
                        consoles: null,
                        lastUpTime: null,
                        reconnectDevice: 15E3,
                        reconnectDeviceServer: 5E3,
                        onRunClassEvent: function (a) {
                            var b = a.args.id;
                            if (this.running && this.running[b] && (b = this.running[b].delegate)) {
                                if (a.error && b.onError)b.onError(a.error);
                                if (a.finish && b.onFinish)b.onFinish(a.finish);
                                if (a.progress && b.onProgress)b.onProgress(a.progress)
                            }
                        },
                        getInstanceByName: function (a) {
                            var b = this.deviceInstances, c;
                            for (c in b) {
                                var d = b[c].device;
                                if (d && this.getMetaValue(d, F.CF_DEVICE_TITLE) === a)return b[c]
                            }
                        },
                        getFile: function (a) {
                            var b = new x, c = this.ctx;
                            C.isString(a) && (a = this.getItemByPath(a + ".meta.json") || this.getItemByPath(a) || a);
                            if (!a || !a.path)debugger;
                            var d = c.getFileManager().getStore(a.scope);
                            d.initRoot().then(function () {
                                d._loadPath(".", !0).then(function () {
                                    d.getItem(a.path, !0).then(function (a) {
                                        b.resolve(a)
                                    })
                                })
                            });
                            return b
                        },
                        getSourceHash: function () {
                            return this.ctx.getUserDirectory() ||
                                "no_user_directory"
                        },
                        checkDeviceServerConnection: function () {
                            if (!this.ctx.getNodeServiceManager)return !0;
                            if (!this.deviceServerClient && this.ctx.getNodeServiceManager) {
                                var a = this.ctx.getNodeServiceManager().getStore();
                                if (!a)return !1;
                                this.createDeviceServerClient(a)
                            }
                            return !0
                        },
                        addDriverFunctions: function (a, b) {
                            for (var c in b)"constructor" !== c && "inherited" !== c && "getInherited" != c && "isInstanceOf" != c && "__inherited" != c && "onModuleReloaded" != c && "start" != c && "publish" != c && "subscribe" != c && "getInherited" != c && "getInherited" !=
                            c && C.isFunction(b[c]) && !a[c] && (a[c] = b[c])
                        },
                        addLoggingFunctions: function (a, b) {
                            var c = this;
                            b.log = function (a, g, h, f) {
                                f = f || {};
                                var e = l.clone(f);
                                f.type = f.type || g || "Driver";
                                b.options && (f.device = b.options);
                                c.publish(d.EVENTS.ON_SERVER_LOG_MESSAGE, {
                                    data: f,
                                    level: a || "info",
                                    message: h,
                                    details: e
                                })
                            }
                        },
                        completeDriverInstance: function (a, b, c) {
                            var g = this, h = b.blockScope.blockStore, f = c.path, e = f + "_commands", k = f + "_variables";
                            h.on("delete", function (a) {
                                var b = -1 !== a.target.declaredClass.indexOf("Variable") ? k : e, d = c._store.getSync(b);
                                d && d.refresh();
                                (a = c._store.getSync(b + "_reference_" + a.target.id)) && a.refresh()
                            });
                            h.on("added", function (b) {
                                var g = b.name, h = b.icon || "fa-exclamation", f = -1 !== b.declaredClass.indexOf("Variable"), m = f ? k : e;
                                -1 != b.declaredClass.indexOf(f ? "Variable" : "Command") && (g = new B({
                                    enabled: !0,
                                    path: m + "_reference_" + b.id,
                                    name: g,
                                    id: b.id,
                                    parentId: m,
                                    _mayHaveChildren: !1,
                                    virtual: !0,
                                    tooltip: !0,
                                    icon: h,
                                    ref: {driver: a, item: b, device: c},
                                    type: d.ITEM_TYPE.BLOCK
                                }), g = c._store.putSync(g), b.addReference(g, {
                                    properties: {name: !0, enabled: !0, value: !0},
                                    onDelete: !0
                                }, !0), g.refresh())
                            });
                            b.setVariable = function (b, c, h, f, e) {
                                if (b = this.blockScope.getVariable(b))b.value = c, !1 === e && (b.__ignoreChangeMark = !0), b.set("value", c, h, f, e), !1 === e && (b.__ignoreChangeMark = !1), g.publish(d.EVENTS.ON_DRIVER_VARIABLE_CHANGED, {
                                    item: b,
                                    scope: this.blockScope,
                                    driver: a,
                                    owner: g,
                                    save: !0 === h,
                                    publish: f
                                })
                            };
                            b.getVariable = function (a) {
                                return (a = this.blockScope.getVariable(a)) ? a._getArg(a.value, !1) : ""
                            };
                            b.log = function (a, c, h, f) {
                                f = f || {};
                                var e = l.clone(f);
                                f.type = f.type || c || "Driver";
                                b.options &&
                                (f.device = b.options);
                                g.publish(d.EVENTS.ON_SERVER_LOG_MESSAGE, {
                                    data: f,
                                    level: a || "info",
                                    message: h,
                                    details: e
                                })
                            };
                            for (var m in a)"constructor" !== m && "inherited" !== m && "getInherited" != m && "isInstanceOf" != m && "__inherited" != m && "onModuleReloaded" != m && "start" != m && "publish" != m && "subscribe" != m && "getInherited" != m && "getInherited" != m && l.isFunction(a[m]) && !b[m] && (b[m] = a[m])
                        },
                        getDevice: function (a) {
                            var b = a;
                            if (C.isString(a)) {
                                var c = this.getItemById(a);
                                c ? b = c : (a = this.getItemByPath(a)) && (b = a)
                            }
                            return b
                        },
                        stopDevice: function (a) {
                            var b =
                                this.getDevice(a) || a;
                            if (b) {
                                if (this.checkDeviceServerConnection(), b._userStopped = !0, (a = this.toDeviceControlInfo(b)) && (a.serverSide || b.isServer())) {
                                    var c = a.hash;
                                    this.deviceInstances[c] && (this._removeInstance(this.deviceInstances[c], c, b), delete this.deviceInstances[c], this.sendManagerCommand(d.SOCKET_SERVER_COMMANDS.MANAGER_STOP_DRIVER, a))
                                }
                            } else z.error("cant find device " + a)
                        },
                        getStore: function (a) {
                            a = a || "system_devices";
                            var b = this.stores[a];
                            if (b)return b;
                            if (a)return this.ls(a)
                        },
                        getDevices: function (a,
                                              c) {
                            var d = this.getStore();
                            if (!d)return [];
                            d = b.queryStore(d, {isDir: !1});
                            d._S && (d = [d]);
                            for (var g = [], h = 0; h < d.length; h++) {
                                var f = d[h], e = this.getMetaValue(f, F.CF_DEVICE_ENABLED);
                                if (!0 === a && 1 == e || null == e || !1 === a)g.push(f), 1 == c && (e = this.getMetaValue(f, F.CF_DEVICE_DRIVER)) && (e = this.ctx.getDriverManager().getItemById(e)) && (f.driver = e)
                            }
                            return g
                        },
                        getStores: function () {
                            var a = [], b;
                            for (b in this.stores) {
                                var c = this.stores[b];
                                c && a.push(c)
                            }
                            return a
                        },
                        getStorePath: function (a) {
                            var b = this.getContext().getResourceManager();
                            if ("user_devices" === a)return b.getVariable("USER_DIRECTORY")
                        },
                        connectToAllDevices: function () {
                            function a(c) {
                                if (!c)z.error("have no device store"); else if (!c.connected) {
                                    c.connected = !0;
                                    c = b.queryStore(c, {isDir: !1});
                                    c._S && (c = [c]);
                                    C.isArray(c) || (c = [c]);
                                    for (var h = 0; h < c.length; h++) {
                                        var f = c[h], e = d.getMetaValue(f, F.CF_DEVICE_ENABLED);
                                        if (1 == e || null == e)f = d.startDevice(f), g.push(f)
                                    }
                                }
                            }

                            if (this.deviceServerClient) {
                                var c = this.getStores(), d = this;
                                if (this.getStores().length) {
                                    var g = [];
                                    this.deviceServerClient.dfd ? this.deviceServerClient.dfd.then(function () {
                                        C.each(c,
                                            a, this)
                                    }.bind(this)) : C.each(c, a, this);
                                    return g
                                }
                            } else this.checkDeviceServerConnection()
                        },
                        updateDevice: function (a, b) {
                            b && (b.setMetaValue(d.DEVICE_PROPERTY.CF_DEVICE_DRIVER_OPTIONS, a.driverOptions), b.setMetaValue(d.DEVICE_PROPERTY.CF_DEVICE_OPTIONS, a.options), b.setMetaValue(d.DEVICE_PROPERTY.CF_DEVICE_ENABLED, a.enabled))
                        },
                        debug: function () {
                            z.info("Debug info stores : ");
                            C.each(this.stores, function (a) {
                                z.log("have store " + a.scope)
                            })
                        },
                        _getLogText: function (a) {
                            return moment().format("HH:mm:ss:SSS") + " ::   " +
                                a + ""
                        },
                        _parse: function (a, b) {
                            var c = "" + b;
                            if (0 < c.indexOf("{{") || 0 < c.indexOf("}}"))z.time("parse expression"), c = (new G).parse(d.EXPRESSION_PARSER.FILTREX, c, this, {
                                variables: a.getVariablesAsObject(),
                                delimiters: {begin: "{{", end: "}}"}
                            }), z.timeEnd("parse expression"); else {
                                var g = a.parseExpression(b);
                                g && (c = g)
                            }
                            return c
                        },
                        runCommand: function (a, b) {
                        },
                        _lastActions: null,
                        onStoreReloaded: function (a) {
                            this.completeDeviceStore()
                        },
                        getInstance: function (a) {
                            if (a = a ? a._store ? this.toDeviceControlInfo(a) : a : null)return this.getDriverInstance(a,
                                !1)
                        },
                        getDriverInstance: function (a, c) {
                            if (!a)return z.error("getDriverInstance::have no device info"), null;
                            for (var g in this.deviceInstances) {
                                var f = this.deviceInstances[g], e = f.options;
                                if (e && e.port === a.port && e.host === a.host && e.protocol === a.protocol && e.isServer === a.isServer)return c && f.sendSettings && h("xcf-ui") && (c = !1), !1 !== c && f && !f.sendSettings && (g = this.ctx.getDriverManager().getItemById(a.driverId)) && (g = g.user, (e = b.getCIByChainAndName(g, 0, d.DRIVER_PROPERTY.CF_DRIVER_COMMANDS)) && e.params && (f.sendSettings =
                                    b.getJson(e.params)), (g = b.getCIByChainAndName(g, 0, d.DRIVER_PROPERTY.CF_DRIVER_RESPONSES)) && g.params && (f.responseSettings = b.getJson(g.params))), f
                            }
                            return null
                        },
                        _reconnectServerTimer: null,
                        onDeviceServerConnectionLost: function () {
                            if (!this.deviceServerClient || !this.deviceServerClient.pageUnloaded)if (this.deviceServerClient && (this.deviceServerClient.destroy(), this.deviceServerClient = null), !this._reconnectServerTimer) {
                                var a = this;
                                H && a.ctx.getNotificationManager().postMessage({
                                    message: "Lost connection to device server, try reconnecting in 5 seconds",
                                    type: "error", showCloseButton: !0, duration: 1E3
                                });
                                this._reconnectServerTimer = setTimeout(function () {
                                    a.checkDeviceServerConnection();
                                    a._reconnectServerTimer = null
                                }, this.reconnectDeviceServer);
                                z.log("lost device server connection");
                                C.each(this.deviceInstances, function (a) {
                                    if (a && a.device && !a.domNode) {
                                        a = a.device;
                                        var b = a.driverInstance;
                                        b && b.onLostServer && b.onLostServer();
                                        a.setState(d.DEVICE_STATE.LOST_DEVICE_SERVER)
                                    }
                                })
                            }
                        },
                        onMQTTMessage: function (a) {
                            var c = b.getJson(a.message), g = !1;
                            if (c) {
                                var f = c.sourceHost, e = c.sourcePort,
                                    m = a.host, k = a.port;
                                f && e && f === m && e == k && (g = !0)
                            }
                            if (!g && (g = a.topic.split("/"), 4 == g.length && "Variable" == g[2] && c.device))if (this.getDeviceStoreItem(c.device)) {
                                if (a = this.toDeviceControlInfo(c.device))if (a = this.getDriverInstance(a))if (a = a.blockScope.getVariable(g[3]))h("xcf-ui") ? (a.set("value", c.value), a.refresh()) : (delete a.value, a.value = c.value), this.publish(d.EVENTS.ON_DRIVER_VARIABLE_CHANGED, {
                                    item: a,
                                    scope: a.scope,
                                    owner: this,
                                    save: !1,
                                    publish: !0,
                                    source: "mqtt",
                                    publishMQTT: !1
                                })
                            } else z.error("cant find device for : " +
                                a.topic)
                        },
                        getBlock: function (a) {
                            for (var b in this.deviceInstances) {
                                var c = this.deviceInstances[b];
                                if (c && c.device && (c = c.blockScope) && (c = c.resolveBlock(a)))return c
                            }
                            return this.ctx.getDriverManager().getBlock(a)
                        },
                        onNodeServiceStoreReady: function (a) {
                            if (this.deviceServerClient)return this.deviceServerClient;
                            this.createDeviceServerClient(a.store)
                        },
                        onDriverUpdated: function (a, b) {
                        },
                        onModuleReloaded: function (a) {
                            if (0 != this.deviceInstances.length) {
                                var c = b.replaceAll("//", "/", a.module);
                                a = a.newModule;
                                for (var d in this.deviceInstances) {
                                    var g =
                                        this.deviceInstances[d];
                                    if (g.modulePath === c || g.baseClass === c)this.mergeFunctions(g, a.prototype), g.blockScope && (g.blockScope.expressionModel.expressionCache = {}), this.onDriverUpdated(g, c)
                                }
                            }
                        },
                        _removeInstance: function (a, b, c) {
                            a.destroy && a.destroy();
                            a.blockScope && a.blockScope._destroy();
                            delete this.deviceInstances[b];
                            this.ctx.getBlockManager().removeScope(a.options.id);
                            this.ctx.getDriverManager().removeDriverInstance(a, c);
                            c.reset()
                        },
                        removeDriverInstance: function (a) {
                            if (a = this.getDriverInstance(a))this.ctx.getBlockManager().removeScope(a.options.id),
                            a.blockScope && a.blockScope.destroy(), a.destroy();
                            for (var b in this.deviceInstances)a == this.deviceInstances[b] && delete this.deviceInstances[b]
                        },
                        getMetaValue: function (a, c) {
                            var d = a.user;
                            return d ? b.getCIInputValueByName(d, c) : null
                        },
                        getDeviceByHost: function (a, c) {
                            for (var d = b.queryStore(this.getStore(), {isDir: !1}), g = 0; g < d.length; g++) {
                                var h = d[g], f = this.getMetaValue(h, F.CF_DEVICE_HOST), e = this.getMetaValue(h, F.CF_DEVICE_PORT);
                                if (f == a && e == c)return h
                            }
                            return null
                        },
                        getDeviceByUrl: function (a) {
                            a = b.parse_url(a);
                            a =
                                b.urlArgs(a.host);
                            return this.getDeviceById(a.device.value)
                        },
                        getDeviceById: function (a, c) {
                            function d(c) {
                                c = b.queryStore(c, {isDir: !1});
                                c._S && (c = [c]);
                                for (var h = 0; h < c.length; h++) {
                                    var f = c[h];
                                    if (g.getMetaValue(f, F.CF_DEVICE_ID) == a)return f
                                }
                                return null
                            }

                            var g = this, h = C.isString(c) ? this.getStore(c) : null;
                            if (h)return d(h);
                            for (var f in this.stores)if (h = d(this.stores[f]))return h;
                            return null
                        },
                        getDeviceByName: function (a, c) {
                            function d(c) {
                                c = b.queryStore(c, {isDir: !1});
                                c._S && (c = [c]);
                                for (var h = 0; h < c.length; h++) {
                                    var f =
                                        c[h];
                                    if (g.getMetaValue(f, F.CF_DEVICE_TITLE) == a)return f
                                }
                                return null
                            }

                            var g = this, h = C.isString(c) ? this.getStore(c) : null;
                            if (h)return d(h);
                            for (var f in this.stores)if (h = d(this.stores[f]))return h;
                            return null
                        },
                        getDevicesByDriverId: function (a) {
                            var c = b.queryStore(this.getStore(), {isDir: !1});
                            c._S && (c = [c]);
                            for (var d = 0; d < c.length; d++) {
                                var g = c[d];
                                if (this.getMetaValue(g, F.CF_DEVICE_ID) == a)return g
                            }
                            return null
                        },
                        _cachedItems: null,
                        getDeviceStoreItem: function (a) {
                            if (a) {
                                if (a.hash && this._cachedItems) {
                                    var c = this._cachedItems[a.hash];
                                    if (c)return c
                                }
                                if (c = this.getStore(a.deviceScope)) {
                                    var d = a.devicePath ? this.getItemByPath(a.devicePath) : null;
                                    if (d)return d;
                                    var g = C.filter(c.query(), function (a) {
                                        return !0 !== a.isDir
                                    });
                                    if (!g)return null;
                                    g && !C.isArray(g) && (g = [g]);
                                    for (var h = 0; h < g.length; h++) {
                                        var d = g[h], f = d.user, e = b.getCIInputValueByName(f, F.CF_DEVICE_HOST), m = b.getCIInputValueByName(f, F.CF_DEVICE_PORT), k = b.getCIInputValueByName(f, F.CF_DEVICE_ID), f = b.getCIInputValueByName(f, F.CF_DEVICE_PROTOCOL);
                                        if (m === a.port && e === a.host && f === a.protocol && d.isServer() ===
                                            a.isServer && k === a.id)return (c = c.getSync(d.path)) && (d = c), a.hash && (this._cachedItems || (this._cachedItems = {}), this._cachedItems[a.hash] = d), d
                                    }
                                }
                            }
                        },
                        onDriverSettingsChanged: function (a, c) {
                            for (var g in this.deviceInstances) {
                                var h = this.deviceInstances[g];
                                if (h && h.driver == c) {
                                    g = c.user;
                                    var f = b.getCIByChainAndName(g, 0, d.DRIVER_PROPERTY.CF_DRIVER_COMMANDS);
                                    f && f.params && f == a && (h.sendSettings = b.getJson(f.params));
                                    (g = b.getCIByChainAndName(g, 0, d.DRIVER_PROPERTY.CF_DRIVER_RESPONSES)) && g.params && (h.responseSettings = b.getJson(g.params));
                                    break
                                }
                            }
                        },
                        onDeviceStateChanged: function (a, b) {
                            !0 !== a._userStopped && !0 !== b && a.info && a.state && a.state == d.DEVICE_STATE.DISCONNECTED && this.ctx.getNotificationManager().postMessage({
                                message: "Lost connection to " + a.info.host + ", ...reconnecting",
                                type: "error",
                                showCloseButton: !1,
                                duration: 1500
                            });
                            !0 !== b && a.info && a.state && a.state == d.DEVICE_STATE.CONNECTED && this.ctx.getNotificationManager().postMessage({
                                message: "Connected to " + a.info.host + "",
                                type: "success",
                                showCloseButton: !1,
                                duration: 2E3
                            })
                        },
                        connectDevice: function (a) {
                            this.checkDeviceServerConnection();
                            var b = this.toDeviceControlInfo(a);
                            if (b) {
                                var c = b.hash;
                                if (this.deviceInstances[c])return a.setState(d.DEVICE_STATE.CONNECTED), this.deviceInstances[c];
                                a.setState(d.DEVICE_STATE.CONNECTING);
                                this.publish(d.EVENTS.ON_STATUS_MESSAGE, {
                                    text: "Trying to connect to " + b.toString(),
                                    type: "info"
                                });
                                this.sendManagerCommand(d.SOCKET_SERVER_COMMANDS.MANAGER_START_DRIVER, b)
                            } else z.error("couldnt start device, invalid control info")
                        },
                        onAppReady: function (a) {
                            a = a.context;
                            a.deviceManager = this;
                            a.driverManager = this;
                            a.blockManager &&
                            b.mixin(a.blockManager.scopes, this.ctx.getBlockManager().scopes)
                        },
                        onHaveNoDeviceServer: function () {
                            if (this.ctx.getNotificationManager())var a = this, b = this.ctx.getNotificationManager().postMessage({
                                message: "Have no device server connection",
                                type: "error",
                                showCloseButton: !0,
                                duration: 1500,
                                actions: {
                                    reconnect: {
                                        label: "Reconnect", action: function () {
                                            a.checkDeviceServerConnection();
                                            return b.update({
                                                message: "Reconnecting...",
                                                type: "success",
                                                actions: !1,
                                                duration: 1500
                                            })
                                        }
                                    }
                                }
                            })
                        },
                        setDriverScriptContent: function (a, b, c,
                                                          d, g) {
                            return this.callMethodEx(null, "setDriverContent", [a, b, c], d, !0)
                        },
                        getDriverScriptContent: function (a, b, c) {
                            return this.callMethodEx(null, "getDriverContent", [a, b], c, !0)
                        },
                        createStore: function (a, c, d) {
                            var g = this;
                            a = new (h("xcf-ui") ? p("deviceStore", [m, w, t], {}) : p("deviceStore", [k], {}))({
                                data: a.items,
                                idProperty: "path",
                                parentProperty: "parentId",
                                Model: u,
                                id: b.createUUID(),
                                scope: c,
                                ctx: this.getContext(),
                                mayHaveChildren: function (a) {
                                    if (!1 === a._mayHaveChildren)return !1;
                                    if (a.isDevice) {
                                        if (a.driverInstance)return !0;
                                        var b = g.toDeviceControlInfo(a);
                                        b ? (b = g.getContext().getDriverManager().getDriverById(b.driverId)) && !b.blockScope && (this.ctx.getDriverManager().createDriverBlockScope(b), g.completeDevice(a, b)) : z.error("cant get device info for ", a)
                                    }
                                    return !0
                                },
                                observedProperties: ["name", "state", "iconClass", "enabled"]
                            });
                            c && !1 !== d && this.setStore(c, a);
                            return a
                        },
                        initStore: function (a, b, c) {
                            return this.createStore(a, b, c)
                        },
                        _deviceInfoCache: null,
                        toDeviceControlInfo: function (a) {
                            if (!a)return null;
                            h("xcf-ui");
                            if (!a._store && a.id) {
                                var c =
                                    this.getItemById(a.id);
                                c && (a = c)
                            }
                            if (!a || !a.path)if (c = this.getDeviceStoreItem(a), !c)return null;
                            var g = a.user, c = b.getCIInputValueByName(g, F.CF_DEVICE_HOST), f = b.getCIInputValueByName(g, F.CF_DEVICE_PORT), e = b.getCIInputValueByName(g, F.CF_DEVICE_ENABLED), m = b.getCIInputValueByName(g, F.CF_DEVICE_TITLE), k = b.getCIInputValueByName(g, F.CF_DEVICE_PROTOCOL), q = b.getCIInputValueByName(g, F.CF_DEVICE_DRIVER), t = b.getCIInputValueByName(g, F.CF_DEVICE_OPTIONS), r = b.getCIInputValueByName(g, F.CF_DEVICE_LOGGING_FLAGS), g = b.getCIInputValueByName(g,
                                F.CF_DEVICE_DRIVER_OPTIONS), l = a.isServerSide(), p = a.isServer(), u = null;
                            this.fixDeviceCI(a);
                            var v = this.ctx.getDriverManager().getDriverById(q);
                            if (v) {
                                var w = v.user, u = b.getCIInputValueByName(w, d.DRIVER_PROPERTY.CF_DRIVER_CLASS), w = b.getCIByChainAndName(w, 0, d.DRIVER_PROPERTY.CF_DRIVER_RESPONSES), x = {}, v = v.scope;
                                w && w.params && (x = b.getJson(w.params));
                                u = {
                                    host: c,
                                    port: f,
                                    protocol: k,
                                    driver: u ? u.replace("./", "") : "",
                                    driverId: q,
                                    driverScope: v,
                                    id: a.id,
                                    devicePath: a.path,
                                    deviceScope: a.getScope(),
                                    title: m,
                                    options: t,
                                    enabled: e,
                                    driverOptions: g,
                                    serverSide: l,
                                    isServer: p,
                                    responseSettings: x,
                                    source: H ? "ide" : "server",
                                    user_devices: this.ctx.getMount(a.getScope()),
                                    system_devices: this.ctx.getMount("system_devices"),
                                    system_drivers: this.ctx.getMount("system_drivers"),
                                    user_drivers: this.ctx.getMount("user_drivers"),
                                    loggingFlags: r,
                                    toString: function () {
                                        return a.getScope() + "://" + this.host + ":" + this.port + "@" + this.protocol
                                    }
                                };
                                u.hash = n(JSON.stringify({
                                    host: c,
                                    port: f,
                                    protocol: k,
                                    driverId: q,
                                    driverScope: v,
                                    id: a.id,
                                    devicePath: a.path,
                                    deviceScope: a.getScope(),
                                    source: H ? "ide" : "server",
                                    user_devices: this.ctx.getMount(a.getScope()),
                                    system_devices: this.ctx.getMount("system_devices"),
                                    system_drivers: this.ctx.getMount("system_drivers"),
                                    user_drivers: this.ctx.getMount("user_drivers")
                                }), 1);
                                if (c = this.ctx.getUserDirectory())u.userDirectory = c
                            }
                            a.info = u;
                            h("xcf-ui");
                            return u
                        },
                        getItemById: function (a) {
                            for (var b in this.stores) {
                                var c;
                                c = this.stores[b];
                                var d = C.find(c.data, {id: a});
                                c = d ? c.getSync(d.path) : null;
                                if (c)return c
                            }
                        },
                        onStoreCreated: function (a) {
                            var c = this, g = c.ctx, h = a.type,
                                f = a.store, e = f ? b.queryStore(f, {isDir: !1}) : [], m = this.ctx.getDriverManager();
                            e && !C.isArray(e) && (e = [e]);
                            if (h === d.ITEM_TYPE.DEVICE) {
                                for (h = 0; h < e.length; h++) {
                                    var k = f.getSync(e[h].path);
                                    if (!k)z.error("cant find " + e[h].path); else if (!k._completed) {
                                        k._completed = !0;
                                        k.isDevice = !0;
                                        var n = this.getMetaValue(k, d.DEVICE_PROPERTY.CF_DEVICE_DRIVER);
                                        n ? (n = m.getItemById(n), C.each(k.user.inputs, function (a) {
                                            a.device = k;
                                            a.actionTarget = H ? g.mainView.getToolbar() : null;
                                            a.ctx = g
                                        }), !C.isEmpty(n) && H && (this.completeDevice(k, n), k.iconClass =
                                            k.getStateIcon())) : z.error("device has no driver id!")
                                    }
                                }
                                D(this.connectToAllDevices()).then(function () {
                                    c.publish("DevicesConnected", a)
                                })
                            }
                        },
                        onClientMessage: function (a) {
                            this.checkDeviceServerConnection();
                            this.deviceServerClient && this.sendManagerCommand(d.SOCKET_SERVER_COMMANDS.WRITE_LOG_MESSAGE, a)
                        },
                        onClientLogMessage: function (a) {
                        },
                        onVariableChanged: function (a) {
                            var b = a.item, c = a.scope, g = b.name, h = !1 !== a.publish;
                            "value" !== g && !1 !== h && b && (b = b.value, (c = c.device) && c.info && (c = c.info, g = c.host + "/" + c.port + "/Variable/" +
                                g, !1 !== a.publishMQTT && this.sendManagerCommand(d.SOCKET_SERVER_COMMANDS.MQTT_PUBLISH, {
                                topic: g,
                                data: {value: b, device: c}
                            })))
                        },
                        init: function () {
                            var a = this;
                            this.initUI && this.initUI();
                            this.stores = {};
                            this._deviceInfoCache = {};
                            this.subscribe(d.EVENTS.ON_DRIVER_VARIABLE_CHANGED, this.onVariableChanged);
                            this.subscribe(d.EVENTS.ON_DEVICE_SERVER_CONNECTED, function () {
                                z.log("got device server connection");
                                a.autoConnectDevices && D(a.connectToAllDevices()).then(function () {
                                    a.publish("DevicesConnected")
                                })
                            });
                            this.subscribe([K.ON_NODE_SERVICE_STORE_READY,
                                K.ON_MODULE_RELOADED, K.ON_DEVICE_DISCONNECTED, K.ON_DEVICE_CONNECTED, K.ON_CLIENT_LOG_MESSAGE, K.ON_STORE_CREATED]);
                            this.deviceInstances = this.consoles = {};
                            this.driverScopes = {system_drivers: "system_drivers/", user_drivers: "user_drivers/"};
                            this.lastUpTime = (new Date).getTime();
                            setInterval(function () {
                                var b = (new Date).getTime();
                                3E4 < b - a.lastUpTime && (a.lastUpTime = (new Date).getTime());
                                a.lastUpTime = b
                            }, 1E3);
                            this.initReload()
                        },
                        onDeviceServerConnected: function () {
                            var a = this;
                            this.deviceInstances && C.each(this.deviceInstances,
                                function (b) {
                                    b && b.device && !b.domNode && a.startDevice(b.device)
                                })
                        },
                        addDeviceInstance: function (a, b) {
                        },
                        ls: function (a, b) {
                            function c(h) {
                                try {
                                    var f = this.createStore(h, a, b);
                                    this.onStoreReady(f);
                                    !1 !== b && this.publish(d.EVENTS.ON_STORE_CREATED, {
                                        data: h,
                                        owner: this,
                                        store: f,
                                        type: this.itemType
                                    });
                                    g.resolve(f)
                                } catch (e) {
                                    logError(e, "error ls drivers")
                                }
                            }

                            var g = new x;
                            if (this.prefetch && this.prefetch[a])return c.apply(this, [this.prefetch[a]]), delete this.prefetch[a], g;
                            h("php") ? this.runDeferred(null, "ls", [a]).then(c.bind(this)) :
                                g.resolve({items: []});
                            return g
                        },
                        hasStore: function (a) {
                            return this.stores[a]
                        },
                        fixDeviceCI: function (a) {
                            var c = d.DEVICE_PROPERTY, g = a.user, h = b.getCIByChainAndName(g, 0, c.CF_DEVICE_DRIVER_OPTIONS);
                            h ? (h.data = [{value: 2, label: "Runs Server Side"}, {
                                value: 4,
                                label: "Show Debug Messages"
                            }, {value: 8, label: "Allow Multiple Device Connections"}, {
                                value: 16,
                                label: "Server"
                            }], h.group = "Common") : g.inputs.push({
                                chainType: 0,
                                "class": "cmx.types.ConfigurableInformation",
                                dataRef: "",
                                dataSource: "",
                                description: null,
                                enabled: !0,
                                enumType: "-1",
                                flags: -1,
                                group: "Common",
                                id: c.CF_DEVICE_DRIVER_OPTIONS,
                                name: c.CF_DEVICE_DRIVER_OPTIONS,
                                order: 1,
                                params: null,
                                platform: null,
                                title: "Driver Options",
                                type: 5,
                                uid: "-1",
                                value: 0,
                                data: [{value: 2, label: "Runs Server Side"}, {
                                    value: 4,
                                    label: "Show Debug Messages"
                                }, {value: 8, label: "Allow Multiple Device Connections"}, {
                                    value: 16,
                                    label: "Server"
                                }],
                                visible: !0,
                                device: a
                            });
                            (h = b.getCIByChainAndName(g, 0, c.CF_DEVICE_LOGGING_FLAGS)) ? h.group = "Logging" : g.inputs.push({
                                chainType: 0,
                                "class": "cmx.types.ConfigurableInformation",
                                dataRef: "",
                                dataSource: "",
                                description: null,
                                enabled: !0,
                                enumType: "-1",
                                flags: -1,
                                group: "Logging",
                                id: c.CF_DEVICE_LOGGING_FLAGS,
                                name: c.CF_DEVICE_LOGGING_FLAGS,
                                order: 1,
                                params: null,
                                platform: null,
                                title: "Logging Flags",
                                type: c.CF_DEVICE_LOGGING_FLAGS,
                                uid: "-1",
                                value: 0,
                                data: [{value: 2, label: "On Connected"}, {
                                    value: 4,
                                    label: "On Disconnected"
                                }, {value: 8, label: "On Error"}, {value: 16, label: "Commands"}, {
                                    value: 32,
                                    label: "Responses"
                                }],
                                visible: !0,
                                device: a
                            });
                            if (c = b.getCIByChainAndName(g, 0, c.CF_DEVICE_PROTOCOL))c.type = 3, c.options = [{
                                label: "TCP",
                                value: "tcp"
                            }, {label: "UDP", value: "udp"}, {label: "Driver", value: "driver"}, {
                                label: "SSH",
                                value: "ssh"
                            }, {label: "Serial", value: "serial"}, {label: "MQTT", value: "mqtt"}];
                            a.id || (a.id = b.getCIInputValueByName(g, d.DEVICE_PROPERTY.CF_DEVICE_ID));
                            (c = b.getCIByChainAndName(g, 0, d.DEVICE_PROPERTY.CF_DEVICE_OPTIONS)) ? c.device = a : g.inputs.push({
                                chainType: 0,
                                "class": "cmx.types.ConfigurableInformation",
                                dataRef: "",
                                dataSource: "",
                                description: null,
                                enabled: !0,
                                enumType: "-1",
                                flags: -1,
                                group: "Network",
                                id: "options",
                                name: "options",
                                order: 1,
                                params: null,
                                platform: null,
                                title: "Options",
                                type: 28,
                                uid: "-1",
                                value: {},
                                visible: !0,
                                device: a
                            })
                        }
                    })
                })
        }, "xcf/manager/DeviceManager_Server": function () {
            define(["dcl/dcl"], function (e) {
                return e(null, {})
            })
        }, "xcf/manager/DeviceManager_DeviceServer": function () {
            define("dcl/dcl xide/encoding/MD5 xide/types xide/utils xide/factory xdojo/has dojo/Deferred xide/mixins/ReloadMixin xide/mixins/EventedMixin require xide/lodash xcf/model/Variable xide/utils/HexUtils xdojo/has!host-node?nxapp/utils/_console".split(" "), function (e,
                                                                                                                                                                                                                                                                                     p, l, n, d, b, a, f, c, g, r, q, k, m) {
                var h = "undefined" !== typeof window ? window.console : "undefined" !== typeof global ? global.console : m;
                m && (h = m);
                var t = b("xcf-ui"), w = !1;
                if ("undefined" !== typeof sctx && sctx)n.createUUID(), sctx.getResourceManager(), sctx.getApplication(); else return k = e(null, {
                    declaredClass: "xcf.manager.DeviceManager_DeviceServer",
                    running: null,
                    onDeviceStarted: function (a, b, c) {
                        if (a && b && c) {
                            var d = this.toDeviceControlInfo(b), g = d.serverSide, h = d.isServer, f = a.blockScope;
                            (g || h || !g && !h) && f.start();
                            a.__didStartBlocks = !0;
                            this.publish(l.EVENTS.ON_DEVICE_DRIVER_INSTANCE_READY, {
                                device: b,
                                instance: a,
                                driver: c,
                                blockScope: f
                            });
                            this.publish(l.EVENTS.ON_DEVICE_CONNECTED, {
                                device: d,
                                instance: a,
                                driver: c,
                                blockScope: f
                            });
                            this.ctx.getDriverManager().addDeviceInstance(b, c)
                        }
                    },
                    runClass: function (a, b, c) {
                        this.checkDeviceServerConnection();
                        if (this.deviceServerClient) {
                            var d = n.createUUID();
                            b.id = d;
                            var g = {"class": a, args: b, manager_command: l.SOCKET_SERVER_COMMANDS.RUN_CLASS};
                            !this.running && (this.running = {});
                            this.running[d] = {
                                "class": a, args: b,
                                delegate: c
                            };
                            this.deviceServerClient.emit(null, g, l.SOCKET_SERVER_COMMANDS.RUN_CLASS)
                        } else this.onHaveNoDeviceServer()
                    },
                    startDevice: function (b, c) {
                        var d = this;
                        if (!b)return h.error("start device invalid item"), null;
                        this.checkDeviceServerConnection();
                        b.check();
                        w = !0;
                        var f = new a;
                        b._startDfd && !b._startDfd.isResolved() || b.driverInstance || b.reset();
                        !0 === c && b.setMetaValue(l.DEVICE_PROPERTY.CF_DEVICE_ENABLED, !0, !1);
                        b.getMetaValue(l.DEVICE_PROPERTY.CF_DEVICE_ENABLED);
                        var e = this.toDeviceControlInfo(b);
                        if (!e)return h.error("invalid client info, assuming no driver found"),
                            f.reject("invalid client info, assuming no driver found"), f;
                        if (!e)return h.error("couldnt start device, invalid control info " + e.toString()), f.reject(), f;
                        var k = e.hash, m = b.state === l.DEVICE_STATE.LOST_DEVICE_SERVER;
                        if (this.deviceInstances[k] && !0 !== m)return w && h.warn("device already started : " + e.toString()), f.resolve(this.deviceInstances[k]), f;
                        if (m && this.deviceInstances[k])return d.publish(l.EVENTS.ON_STATUS_MESSAGE, {
                            text: "Trying to re-connect to " + e.toString(),
                            type: "info"
                        }), d.sendManagerCommand(l.SOCKET_SERVER_COMMANDS.CREATE_CONNECTION,
                            e), b.setState(l.DEVICE_STATE.CONNECTING), f.resolve(this.deviceInstances[k]), f;
                        b.setState(l.DEVICE_STATE.CONNECTING);
                        b._userStopped = null;
                        b._startDfd = f;
                        var m = this.driverScopes.system_drivers, q = m + "DriverBase";
                        try {
                            g([q], function (a) {
                                a.prototype.declaredClass = q;
                                d.createDriverInstance(e, a, b).then(function (a) {
                                    a.id || (a.id = n.createUUID());
                                    a || h.warn("buildMQTTParams:have no driver instance");
                                    e.mqtt = {
                                        driverScopeId: a && a.blockScope ? a.blockScope.id : "have no driver instance",
                                        driverId: a ? a.driver.id : "have no driver id",
                                        deviceId: b.path
                                    };
                                    d.publish(l.EVENTS.ON_STATUS_MESSAGE, {
                                        text: "Trying to connect to " + e.toString(),
                                        type: "info"
                                    });
                                    b._startDfd && !b._startDfd.isResolved() ? d.sendManagerCommand(l.SOCKET_SERVER_COMMANDS.CREATE_CONNECTION, e) : d.sendManagerCommand(l.SOCKET_SERVER_COMMANDS.START_DEVICE, e);
                                    f.resolve(d.deviceInstances[k]);
                                    delete e.mqtt
                                }).then(function () {
                                }, function (a) {
                                    f.resolve(null)
                                })
                            }, function (a) {
                                h.error(a)
                            })
                        } catch (t) {
                            logError(t, "DeviceManager::startDevice: requiring base driver at " + q + " failed! Base Driver - Prefix : " +
                                m)
                        }
                        return f
                    },
                    createDriverInstance: function (b, d, k) {
                        var m = b.hash, q = this.driverScopes[b.driverScope], t = !g.cache, r = g.toUrl(q), r = n.removeURLParameter(r, "bust");
                        t && (r = r.replace("/.js", "/"));
                        var p = decodeURIComponent(r) + b.driver, p = p.replace("", "").trim(), w = this, r = w.ctx, t = n.getCIInputValueByName(k.user, l.DEVICE_PROPERTY.CF_DEVICE_DRIVER), r = r.getDriverManager(), z = r.getDriverById(t), C = new a;
                        k.getMetaValue(l.DEVICE_PROPERTY.CF_DEVICE_ENABLED);
                        k.isEnabled();
                        if (!(k.isServerSide() || k.isServer() || b.isServer || b.serverSide))return C.reject("DeviceManager_DeviceServer: wont create driver instance! I am server and device isnt server side : " +
                            b.title), C;
                        try {
                            r.getDriverModule(z).then(function (a) {
                                var g = new (e([d, c.dcl, f.dcl, a], {}));
                                g.declaredClass = p;
                                g.options = b;
                                g.baseClass = d.prototype.declaredClass;
                                g.modulePath = n.replaceAll("//", "/", q + b.driver).replace(".js", "");
                                g.delegate = w;
                                g.driver = z;
                                g.serverSide = b.serverSide;
                                g.utils = n;
                                g.types = l;
                                g.device = k;
                                g.Module = a;
                                g.id = n.createUUID();
                                g.getDevice = function () {
                                    return this.device
                                };
                                g.getDeviceInfo = function () {
                                    return this.getDevice().info
                                };
                                a = z.user;
                                var t = n.getCIByChainAndName(a, 0, l.DRIVER_PROPERTY.CF_DRIVER_COMMANDS);
                                t && t.params && (g.sendSettings = n.getJson(t.params));
                                (a = n.getCIByChainAndName(a, 0, l.DRIVER_PROPERTY.CF_DRIVER_RESPONSES)) && a.params && (g.responseSettings = n.getJson(a.params));
                                try {
                                    g.start(), g.initReload()
                                } catch (r) {
                                    h.error("crash in driver instance startup! " + k.toString()), logError(r, "crash in driver instance startup!")
                                }
                                w.deviceInstances[m] = g;
                                z.blox && z.blox.blocks || (z.blox = {blocks: []});
                                k.driverInstance = g;
                                w.getDriverInstance(b, !0);
                                g._id = n.createUUID();
                                C.resolve(g);
                                return g
                            })
                        } catch (I) {
                            h.error("DeviceManager::createDriverInstance:: requiring base driver at " +
                                p + " failed " + I.message, n.inspect(b))
                        }
                        return C
                    },
                    onSetDeviceServerVariables: function (a) {
                        var b = this.getDriverInstance(a.device, !0), c = this.getDeviceStoreItem(a.device);
                        if (c) {
                            if (!b.blockScope) {
                                var d = c.info, g = d.hash, f = b.driver, e = d.driverId, k = this.getContext(), d = d.serverSide, m = e + "_" + g + "_" + c.path;
                                f.blox && f.blox.blocks || (f.blox = {blocks: []});
                                f.blockPath && (n.getJson(n.readFile(f.blockPath)), f.blox = n.getJson(n.readFile(f.blockPath)));
                                g = k.getBlockManager().createScope({
                                    id: m, device: c, driver: f, instance: b, serviceObject: this.serviceObject,
                                    ctx: k, serverSide: d, getContext: function () {
                                        return this.instance
                                    }
                                }, n.clone(f.blox.blocks), function (a) {
                                    a && h.error(a + " : in " + f.name + " Resave Driver! in scope id " + m)
                                });
                                b.blockScope = g;
                                c.blockScope = g;
                                t && this.completeDriverInstance(f, b, c)
                            }
                            if (b) {
                                var g = a.variables, q = b.blockScope;
                                c.serverVariables = a.variables;
                                r.each(g, function (a) {
                                    var b = q.getVariable(a.name);
                                    b && (b.value = a.value)
                                })
                            }
                            this.onDeviceConnected(a, !1);
                            c.setState(l.DEVICE_STATE.SYNCHRONIZING);
                            c.setState(l.DEVICE_STATE.READY);
                            c._startDfd && c._startDfd.resolve(c.driverInstance);
                            delete c._userStopped;
                            delete c.lastError;
                            delete c._startDfd;
                            c._startDfd = null
                        } else w && h.log("did set device server variables failed, have no device", a)
                    },
                    getDeviceServerVariables: function (a, b) {
                        var c = b.driver;
                        c.blox && c.blox.blocks || (c.blox = {blocks: []});
                        var d = [];
                        r.each(c.blox.blocks, function (a) {
                            a.group === l.BLOCK_GROUPS.CF_DRIVER_BASIC_VARIABLES && d.push(a)
                        });
                        for (var c = [], g = 0; g < d.length; g++)c.push({
                            name: d[g].name,
                            value: d[g].value,
                            initial: d[g].value
                        });
                        a.setState(l.DEVICE_STATE.SYNCHRONIZING);
                        this.sendManagerCommand(l.SOCKET_SERVER_COMMANDS.GET_DEVICE_VARIABLES,
                            {device: this.toDeviceControlInfo(a), variables: c})
                    },
                    onDeviceConnected: function (a, b) {
                        var c = this.getDeviceStoreItem(a.device);
                        if (a.isReplay && c && c.state === l.DEVICE_STATE.READY)c.setState(l.DEVICE_STATE.READY); else {
                            var d = this.getDriverInstance(a.device, !0) || a.instance;
                            if (d)if (c) {
                                var f = this.toDeviceControlInfo(c);
                                if (f)if (!f.serverSide && w && h.error("onDeviceConnected:: device info is not server side, abort"), d && !c.serverVariables)c.setState(l.DEVICE_STATE.CONNECTED), this.getDeviceServerVariables(c, d); else if (f) {
                                    var e =
                                        f.hash;
                                    if (this.deviceInstances[e]) {
                                        if (!d.__didStartBlocks)this.onDeviceStarted(d, c, d.driver);
                                        c.setState(l.DEVICE_STATE.READY);
                                        this.publish(l.EVENTS.ON_STATUS_MESSAGE, {
                                            text: 'Device is Ready \x3cspan class\x3d"text-success"\x3e' + f.host + ":" + f.port + "\x3c/span\x3e",
                                            type: "success"
                                        });
                                        return this.deviceInstances[e]
                                    }
                                    var k = this, m = this.driverScopes.system_drivers + "DriverBase";
                                    try {
                                        g([m], function (a) {
                                            a.prototype.declaredClass = m;
                                            k.createDriverInstance(f, a, c)
                                        })
                                    } catch (n) {
                                        h.error("requiring base driver at " + m + " failed",
                                            n)
                                    }
                                } else h.error("couldnt start device, invalid control info"); else w && h.error("onDeviceConnected:: device info  is null")
                            } else w && h.error("onDeviceConnected:: deviceStoreItem is null"); else c && c.setState(l.DEVICE_STATE.DISCONNECTED)
                        }
                    },
                    onDeviceDisconnected: function (a) {
                        if (a || a.device) {
                            var b = a.error, c = b && b.code ? b.code : b || "", d = this.getDeviceStoreItem(a.device);
                            if (d)if (!0 === a.stopped)this.stopDevice(d); else {
                                this.publish(l.EVENTS.ON_STATUS_MESSAGE, {
                                    text: 'Device has been disconnected \x3cspan class\x3d"text-warning"\x3e' +
                                    a.device.host + ":" + a.device.port + '\x3c/span\x3e :  \x3cspan class\x3d"text-danger"\x3e' + c + "\x3c/span\x3e",
                                    type: "info"
                                });
                                var g = this.toDeviceControlInfo(d);
                                if (!g || g.serverSide)if (this.getDriverInstance(a.device, !0) && this.removeDriverInstance(a.device), d.reset(), d.state === l.DEVICE_STATE.DISABLED)d.setState(l.DEVICE_STATE.DISCONNECTED); else if (d.setState(l.DEVICE_STATE.DISCONNECTED), d.lastError = b, d.refresh(), g.serverSide && d) {
                                    var f = this;
                                    d.reconnectTimer || (d.isReconnecting = !0, d.lastReconnectTime ? 3600 < d.lastReconnectTime &&
                                    (d.lastReconnectTime = 3600) : d.lastReconnectTime = f.reconnectDevice, d.reconnectRetry || (d.reconnectRetry = 0), d.reconnectTimer = setTimeout(function () {
                                        d.reconnectTimer = null;
                                        d.lastReconnectTime *= 2;
                                        d.reconnectRetry += 1;
                                        d.shouldReconnect() && (g && d.setState(l.DEVICE_STATE.CONNECTING), f.startDevice(d))
                                    }, d.lastReconnectTime))
                                }
                            } else w && t && h.error("deviceStoreItem is null")
                        }
                    },
                    onCommandFinish: function (a, b) {
                        var c = this.getDriverInstance(a, !0);
                        if (c) {
                            var d = b.params || {};
                            if (d.src && d.id && (c = c.blockScope.getBlockById(d.src)) &&
                                c.onCommandFinish)c.onCommandFinish(b)
                        }
                    },
                    onCommandProgress: function (a, b) {
                        var c = this.getDriverInstance(a, !0);
                        if (c) {
                            var d = b.params || {};
                            if (d.src && d.id && (c = c.blockScope) && (d = c.getBlockById(d.src)) && d.onCommandProgress)d.onCommandProgress(b)
                        }
                    },
                    onCommandPaused: function (a, b) {
                        var c = this.getDriverInstance(a, !0);
                        if (c) {
                            var d = b.params || {};
                            if (d.src && d.id && (c = c.blockScope.getBlockById(d.src)) && c.onCommandPaused)c.onCommandPaused(b)
                        }
                    },
                    onCommandStopped: function (a, b) {
                        var c = this.getDriverInstance(a, !0);
                        if (c) {
                            var d =
                                b.params || {};
                            if (d.src && d.id && (c = c.blockScope.getBlockById(d.src)) && c.onCommandStopped)c.onCommandStopped(b)
                        }
                    },
                    onCommandError: function (a, b) {
                        var c = this.getDriverInstance(a, !0);
                        if (c) {
                            var d = b.params || {};
                            if (d.src && d.id && (c = c.blockScope.getBlockById(d.src)) && c.onCommandError)c.onCommandError(b)
                        }
                    },
                    onDeviceServerMessage: function (a) {
                        function c(a) {
                            delete a.resposeSettings;
                            delete a.driver;
                            delete a.lastResponse;
                            delete a.scope;
                            delete a.driverId;
                            delete a.device;
                            delete a.sourceHost;
                            delete a.sourcePort
                        }

                        var d = a.data,
                            g = null;
                        if (r.isString(d) && -1 != d.indexOf("{"))try {
                            g = n.fromJson(d)
                        } catch (f) {
                            h.error("error parsing device message", a);
                            return
                        } else r.isObject(d) && d.data && (g = d);
                        if (g && g.data && g.data.device) {
                            var e = g.data.device;
                            if (e && e.serverSide) {
                                var k = this.getDriverInstance(g.data.device, !0);
                                if (k) {
                                    var m = this.getDeviceStoreItem(e);
                                    if (m) {
                                        (e = m.info) || h.error("invalid device : " + m.toString());
                                        var t = m.get("state");
                                        a = e.serverSide;
                                        var p = g.data.deviceMessage;
                                        if (null == p)h.warn("onDeviceServerMessage: abort, no message data");
                                        else {
                                            d = [];
                                            r.isString(p) ? d = k.split(p) : r.isObject(p) && (c(p), d = [p]);
                                            var w = k.onMessageRaw({
                                                device: g.data.device,
                                                message: p,
                                                bytes: g.data.bytes
                                            });
                                            w && !w.length && (w = null);
                                            for (var I = [], A = 0; A < d.length; A++)I.push(n.stringToBuffer(d[A]));
                                            if (w && w.length)for (d = [], I = [], A = 0; A < w.length; A++) {
                                                var H = w[A];
                                                d.push(H.string);
                                                I.push(H.bytes)
                                            }
                                            if (d && d.length)for (A = 0; A < d.length; A++)H = d[A], k.onMessage({
                                                device: g.data.device,
                                                message: H,
                                                raw: p,
                                                bytes: I[A]
                                            }), k.onBroadcastMessage({
                                                device: g.data.device,
                                                message: H,
                                                raw: p,
                                                bytes: I[A]
                                            });
                                            t !==
                                            l.DEVICE_STATE.READY && m.set("state", l.DEVICE_STATE.READY);
                                            A = m.isDebug();
                                            g.event && (g.data.driverInstance = k, this.publish(g.event, g.data));
                                            if (b("xcf-ui")) {
                                                var F = [], t = this.consoles[e.hash + "-Console"];
                                                if (A) {
                                                    A = g.data.deviceMessage;
                                                    if (r.isObject(A)) {
                                                        c(A);
                                                        try {
                                                            A = JSON.stringify(A)
                                                        } catch (K) {
                                                            logError(K, "error serialize message")
                                                        }
                                                    }
                                                    this.publish(l.EVENTS.ON_STATUS_MESSAGE, {text: "Device Message from " + k.options.host + ' : \x3cspan class\x3d"text-info"\x3e' + A + "\x3c/span\x3e"})
                                                }
                                                if (t)for (var O = 0; O < t.length; O++) {
                                                    var M =
                                                        t[O];
                                                    if (M) {
                                                        var N = !0, P = !1;
                                                        M.console && (A = M.console.getTextEditor(), N = A.getAction("Console/Settings/Split").value, P = A.getAction("Console/Settings/HEX").value);
                                                        if (!N && P)A = n.bufferToHexString(g.data.bytes), M.log(A, N, !1, l.LOG_OUTPUT.RESPONSE); else for (F = [], r.isString(p) ? F = N ? w && w.length ? w : k.split(p) : [p] : r.isObject(p) && (c(p), F = [p]), A = 0; A < F.length; A++)H = F[A], r.isString(H.string) && 0 === H.string.length || (P && (H = n.stringToHex(H.string)), M.log(H, N, !0, l.LOG_OUTPUT.RESPONSE))
                                                    }
                                                }
                                                d && d.length && this.publish(l.EVENTS.ON_DEVICE_MESSAGE_EXT,
                                                    {
                                                        device: m,
                                                        deviceInfo: e,
                                                        raw: p,
                                                        messages: d,
                                                        bytes: g.data.bytes
                                                    })
                                            }
                                            if (0 < d.length && k.blockScope)for (g = k.blockScope, e = g.blockStore._find({group: l.BLOCK_GROUPS.CF_DRIVER_RESPONSE_BLOCKS}), k = g.blockStore._find({group: l.BLOCK_GROUPS.CF_DRIVER_RESPONSE_VARIABLES}), m = g.getVariable("value"), m || (m = new q({
                                                id: n.createUUID(),
                                                name: "value",
                                                value: "",
                                                scope: g,
                                                type: 13,
                                                group: "processVariables",
                                                gui: !1,
                                                cmd: !1
                                            }), g.blockStore.putSync(m)), p = 0; p < d.length; p++)if (0 !== d[p].length) {
                                                m.value = new String(d[p]);
                                                m.value.setBytes(I[p]);
                                                m.value.setString(d[p]);
                                                this.publish(l.EVENTS.ON_DRIVER_VARIABLE_CHANGED, {
                                                    item: m,
                                                    scope: g,
                                                    owner: this,
                                                    save: !1,
                                                    source: l.MESSAGE_SOURCE.DEVICE,
                                                    publishMQTT: !1
                                                });
                                                for (w = 0; w < k.length; w++) {
                                                    var L = k[w];
                                                    "value" != k[w].title && (t = null, t = m.value, "number" !== typeof t && (t = "" + t, t = "'" + t + "'"), L.target && "None" != L.target && null !== t && "null" != t && "'null'" != t && (A = g.getVariable(L.target))) && (A.value = t, this.publish(l.EVENTS.ON_DRIVER_VARIABLE_CHANGED, {
                                                        item: A,
                                                        scope: g,
                                                        owner: this,
                                                        save: !1,
                                                        source: l.MESSAGE_SOURCE.BLOX
                                                    }))
                                                }
                                                if (a) {
                                                    for (t = 0; t < d.length; t++)if (A =
                                                            d[t], r.isObject(A) && A.src && (w = g.getBlockById(A.src)) && w.onData)w.onData(A);
                                                    for (t = 0; t < e.length; t++)if (w = e[t], !1 !== w.enabled) {
                                                        w.override = {args: L ? [L.value] : null};
                                                        try {
                                                            g.solveBlock(e[t], {highlight: !1})
                                                        } catch (Q) {
                                                            logError(Q, "----solving response block crashed ")
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    } else h.error("cant find device : ", e.toString())
                                } else A && h.error(" onDeviceMessage : failed! Have no device instance for " + g.data.device.host, g)
                            }
                        }
                    },
                    sendManagerCommand: function (a, b) {
                        this.checkDeviceServerConnection();
                        var c = {manager_command: a};
                        n.mixin(c, b);
                        if (this.deviceServerClient)return this.deviceServerClient.emit(null, c, a);
                        h.error("Send Manager Command " + a + " failed, have no  device Server client");
                        this.onHaveNoDeviceServer()
                    },
                    sendDeviceCommand: function (a, c, d, g, f, e, k, m, q) {
                        this.checkDeviceServerConnection();
                        var t = a.getDeviceInfo();
                        n.mixin({src: d}, t);
                        var w = {command: c, device_command: q || l.SOCKET_SERVER_COMMANDS.DEVICE_SEND, options: t};
                        n.mixin(w.options, {params: {src: d, id: g, wait: e, stop: k, pause: m}});
                        g = this.getDevice(t.id);
                        g && r.isObject(g) ?
                        g._userStopped || g && (g.state === l.DEVICE_STATE.DISABLED || g.state === l.DEVICE_STATE.DISCONNECTED || g.state === l.DEVICE_STATE.CONNECTING) || (q = n.stringFromDecString(w.command), g.isDebug() && this.publish(l.EVENTS.ON_STATUS_MESSAGE, {text: 'Did send message : \x3cspan class\x3d"text-warnin"\x3e' + q.substr(0, 30) + '\x3c/span\x3e to \x3cspan class\x3d"text-info"\x3e' + t.host + ":" + t.port + "@" + t.protocol + "\x3c/span\x3e"}), t = p(JSON.stringify(a.options), 1) + "-Console", this.deviceServerClient ? (this.deviceServerClient.emit(null,
                            w, "Device_Send"), b("xcf-ui") && !1 !== f && r.each(this.consoles[t], function (a) {
                            a.printCommand('\x3cspan class\x3d"text-info"\x3e\x3cb\x3e' + w.command + "\x3c/span\x3e", "")
                        })) : (this.onHaveNoDeviceServer(), h.error("this.deviceServerClient is null"), h.error(" Send Device Command " + c + "failed, have no  device Server client")), a.blockScope && (q = a.blockScope.getBlockById(d), this.publish(l.EVENTS.ON_DEVICE_COMMAND, {
                            device: g,
                            command: n.stringFromDecString(c),
                            deviceInfo: this.toDeviceControlInfo(g),
                            name: q ? q.name : ""
                        }))) :
                            h.error("invalid device")
                    },
                    loadDevices: function (a) {
                        this.sendManagerCommand(l.SOCKET_SERVER_COMMANDS.INIT_DEVICES, {path: a})
                    },
                    protocolMethod: function (b, c, d, g) {
                        var f = new a, e = l.SOCKET_SERVER_COMMANDS.PROTOCOL_METHOD, k = n.createUUID(), m = e + "_" + k;
                        b = {protocol: b, method: c, options: {args: d, id: k, device: g}};
                        var q = this;
                        this.subscribe(m, function (a) {
                            q.unsubscribe(m);
                            clearTimeout(t);
                            f.resolve(a)
                        });
                        try {
                            this.sendManagerCommand(e, b);
                            var t = setTimeout(function () {
                                    q.unsubscribe(m);
                                    f.reject("timeout");
                                    h.error("protocol method timeout")
                                },
                                8E3)
                        } catch (r) {
                            f.reject(r)
                        }
                        return f
                    },
                    callMethod: function (a, b, c, d, g) {
                        this.checkDeviceServerConnection();
                        a = {
                            method: b,
                            args: c,
                            device_command: l.SOCKET_SERVER_COMMANDS.CALL_METHOD,
                            params: {id: g, src: d},
                            options: a.options
                        };
                        if (this.deviceServerClient)this.deviceServerClient.emit(null, a, l.SOCKET_SERVER_COMMANDS.CALL_METHOD); else this.onHaveNoDeviceServer()
                    },
                    runShell: function (a, b, c, d, g) {
                        a = a.getDeviceInfo();
                        this.sendManagerCommand(l.SOCKET_SERVER_COMMANDS.RUN_SHELL, {
                            cmd: b, args: c, options: n.mixin(a, {
                                params: {
                                    id: g,
                                    src: d
                                }
                            })
                        })
                    },
                    watchDirectory: function (a, b) {
                        this.checkDeviceServerConnection();
                        var c = {path: a, watch: b, manager_command: l.SOCKET_SERVER_COMMANDS.WATCH};
                        if (this.deviceServerClient)this.deviceServerClient.emit(null, c, l.SOCKET_SERVER_COMMANDS.WATCH); else this.onHaveNoDeviceServer()
                    },
                    handle: function (a) {
                        var b = this.ctx.getUserDirectory();
                        a = a.data;
                        return !(b && a && a.device && a.device.userDirectory && a.device.userDirectory !== b)
                    },
                    createDeviceServerClient: function (b) {
                        var c = this, g = new a;
                        this.deviceServerClient = null;
                        if (this.deviceServerClient =
                                d.createClientWithStore(b, "Device Control Server", {
                                    delegate: {
                                        onConnected: function () {
                                            c.onDeviceServerConnected();
                                            g.resolve();
                                            c.publish(l.EVENTS.ON_DEVICE_SERVER_CONNECTED);
                                            t && c.ctx.getNotificationManager().postMessage({
                                                message: "Connected to Device Server",
                                                type: "success",
                                                duration: 3E3
                                            })
                                        }, onLostConnection: function () {
                                            c.onDeviceServerConnectionLost()
                                        }, onServerResponse: function (a) {
                                            var b = a.data, d = null;
                                            if (r.isString(b)) {
                                                try {
                                                    d = JSON.parse(b)
                                                } catch (g) {
                                                    d = b
                                                }
                                                if ((d = d || {}, d.data) && d.data.deviceMessage && d.data.deviceMessage.event ===
                                                    l.EVENTS.ON_COMMAND_FINISH) {
                                                    c.onCommandFinish(d.data.device, d.data.deviceMessage);
                                                    return
                                                }
                                                if (d && d.data && d.data.deviceMessage && d.data.deviceMessage.event === l.EVENTS.ON_COMMAND_PROGRESS) {
                                                    c.onCommandProgress(d.data.device, d.data.deviceMessage);
                                                    return
                                                }
                                                if (d && d.data && d.data.deviceMessage && d.data.deviceMessage.event === l.EVENTS.ON_COMMAND_PAUSED) {
                                                    c.onCommandPaused(d.data.device, d.data.deviceMessage);
                                                    return
                                                }
                                                if (d && d.data && d.data.deviceMessage && d.data.deviceMessage.event === l.EVENTS.ON_COMMAND_STOPPED) {
                                                    c.onCommandStopped(d.data.device,
                                                        d.data.deviceMessage);
                                                    return
                                                }
                                                if (d.data && d.data.deviceMessage && d.data.deviceMessage.event === l.EVENTS.ON_COMMAND_ERROR) {
                                                    c.onCommandError(d.data.device, d.data.deviceMessage);
                                                    return
                                                }
                                                if (d.event === l.EVENTS.ON_DEVICE_DISCONNECTED) {
                                                    c.publish(l.EVENTS.ON_DEVICE_DISCONNECTED, d.data);
                                                    return
                                                }
                                                if (d.event === l.EVENTS.SET_DEVICE_VARIABLES)return c.onSetDeviceServerVariables(d.data);
                                                if (d.event === l.EVENTS.ON_RUN_CLASS_EVENT)return c.onRunClassEvent(d.data);
                                                if (d.event === l.EVENTS.ON_DEVICE_CONNECTED) {
                                                    c.publish(l.EVENTS.ON_DEVICE_CONNECTED,
                                                        d.data);
                                                    return
                                                }
                                                if (d.event === l.SOCKET_SERVER_COMMANDS.PROTOCOL_METHOD) {
                                                    c.publish(l.SOCKET_SERVER_COMMANDS.PROTOCOL_METHOD + "_" + d.data.options.id, d.data);
                                                    return
                                                }
                                                if (d.event === l.EVENTS.ON_SERVER_LOG_MESSAGE) {
                                                    c.publish(l.EVENTS.ON_SERVER_LOG_MESSAGE, d.data);
                                                    return
                                                }
                                                if (d.event === l.EVENTS.ON_MQTT_MESSAGE) {
                                                    c.publish(l.EVENTS.ON_MQTT_MESSAGE, d.data);
                                                    c.onMQTTMessage(d.data);
                                                    return
                                                }
                                                if (d.event === l.EVENTS.ON_FILE_CHANGED)return c.ctx.onXIDEMessage(n.fromJson(a.data));
                                                if (!c.handle(d))return
                                            }
                                            c.onDeviceServerMessage(a)
                                        }
                                    }
                                }))return this.deviceServerClient.dfd =
                            g, this.deviceServerClient
                    }
                }), e.chainAfter(k, "onDeviceStarted"), e.chainAfter(k, "onDeviceDisconnected"), k
            })
        }, "xcf/model/Device": function () {
            define("dcl/dcl xide/data/Model xide/data/Source xide/types xide/utils xide/mixins/EventedMixin xcf/types/Types".split(" "), function (e, p, l, n, d, b) {
                e = e([p, l.dcl, b.dcl], {
                    declaredClass: "xcf.model.Device",
                    _userStopped: !1,
                    state: n.DEVICE_STATE.DISCONNECTED,
                    driverInstance: null,
                    blockScope: null,
                    getParent: function () {
                        return this.getStore().getSync(this.parentId)
                    },
                    isServerSide: function () {
                        var a =
                            this.getMetaValue(n.DEVICE_PROPERTY.CF_DEVICE_DRIVER_OPTIONS);
                        return 1 << n.DRIVER_FLAGS.RUNS_ON_SERVER & a ? !0 : !1
                    },
                    isServer: function () {
                        var a = this.getMetaValue(n.DEVICE_PROPERTY.CF_DEVICE_DRIVER_OPTIONS);
                        return 1 << n.DRIVER_FLAGS.SERVER & a ? !0 : !1
                    },
                    setServer: function (a) {
                        a = this.getMetaValue(n.DEVICE_PROPERTY.CF_DEVICE_DRIVER_OPTIONS);
                        a.value |= 1 << n.DRIVER_FLAGS.SERVER;
                        this.setMetaValue(n.DEVICE_PROPERTY.CF_DEVICE_DRIVER_OPTIONS, a.value)
                    },
                    setServerSide: function (a) {
                        a = this.getMetaValue(n.DEVICE_PROPERTY.CF_DEVICE_DRIVER_OPTIONS);
                        a |= 1 << n.DRIVER_FLAGS.RUNS_ON_SERVER;
                        this.setMetaValue(n.DEVICE_PROPERTY.CF_DEVICE_DRIVER_OPTIONS, a)
                    },
                    isDebug: function () {
                        var a = this.getMetaValue(n.DEVICE_PROPERTY.CF_DEVICE_DRIVER_OPTIONS);
                        return 1 << n.DRIVER_FLAGS.DEBUG & a ? !0 : !1
                    },
                    check: function () {
                        this._startDfd && !0 === this._userStopped && this.reset()
                    },
                    getStore: function () {
                        return this._store
                    },
                    getScope: function () {
                        var a = this.getStore();
                        return a ? a.scope : this.scope
                    },
                    isEnabled: function () {
                        return !0 === this.getMetaValue(n.DEVICE_PROPERTY.CF_DEVICE_ENABLED)
                    },
                    setEnabled: function (a) {
                        return this.setMetaValue(n.DEVICE_PROPERTY.CF_DEVICE_ENABLED,
                            a)
                    },
                    shouldReconnect: function () {
                        return this._userStopped ? !1 : this.isEnabled()
                    },
                    reset: function () {
                        delete this._startDfd;
                        this._startDfd = null;
                        delete this.blockScope;
                        this.blockScope = null;
                        delete this.serverVariables;
                        this.serverVariables = null;
                        delete this.driverInstance;
                        this.driverInstance = null;
                        clearTimeout(this.reconnectTimer);
                        delete this.lastReconnectTime;
                        delete this.reconnectRetry;
                        delete this.isReconnecting;
                        this.setState(n.DEVICE_STATE.DISCONNECTED)
                    },
                    constructor: function () {
                    },
                    getBlockScope: function () {
                        return this.driverInstance &&
                        this.driverInstance.blockScope ? this.driverInstance.blockScope : this.blockScope
                    },
                    getDriverInstance: function () {
                        return this.driverInstance
                    },
                    getDriver: function () {
                        var a = this.getBlockScope();
                        return a ? a.driver : null
                    },
                    getMetaValue: function (a) {
                        return d.getCIInputValueByName(this.user, a)
                    },
                    setMetaValue: function (a, b, c) {
                        var g = d.getCIByChainAndName(this.user, 0, a);
                        if (!g)return null;
                        var e = this.getMetaValue(a);
                        d.setCIValueByField(g, "value", b);
                        this[a] = b;
                        if (!1 !== c && e != b)return this.publish(n.EVENTS.ON_CI_UPDATE, {
                            owner: this.owner,
                            ci: g, newValue: b, oldValue: e
                        })
                    },
                    getStateIcon: function (a) {
                        a = a || this.state;
                        switch (a) {
                            case n.DEVICE_STATE.READY:
                            case n.DEVICE_STATE.CONNECTED:
                                return "fa-link iconStatusOn";
                            case n.DEVICE_STATE.SYNCHRONIZING:
                            case n.DEVICE_STATE.CONNECTING:
                                return "fa-spinner fa-spin";
                            case n.DEVICE_STATE.LOST_DEVICE_SERVER:
                                return "fa-spinner fa-spin"
                        }
                        return "fa-unlink iconStatusOff"
                    },
                    setState: function (a, b) {
                        if (a !== this.state) {
                            var c = this.state, d = this.getStateIcon(a);
                            this.state = a;
                            this.set("iconClass", d);
                            this.set("state", a);
                            this._emit(n.EVENTS.ON_DEVICE_STATE_CHANGED,
                                {old: c, state: a, icon: d, "public": !0});
                            this.refresh("state")
                        }
                    }
                });
                e.createSubclass = p.createSubclass;
                return e
            })
        }, "xide/data/Source": function () {
            define(["dcl/dcl", "dojo/_base/declare", "xide/utils", "xide/lodash"], function (e, p, l, n) {
                var d = {
                    _references: null, _originReference: null, onReferenceUpdate: function () {
                    }, onReferenceRemoved: function () {
                    }, onReferenceDelete: function () {
                    }, updateReference: function () {
                    }, destroy: function () {
                        this._references = null
                    }, getReferences: function () {
                        return this._references ? l.pluck(this._references,
                            "item") : []
                    }, hasReference: function (b) {
                        return n.find(this._sources, {item: b})
                    }, addReference: function (b, a, d) {
                        !this._references && (this._references = []);
                        if (this.hasReference(b))console.warn("already have reference"); else {
                            this._references.push({item: b, settings: a});
                            var c = this;
                            if (a && a.onDelete && b._store)b._store.on("delete", function (a) {
                                a.target == b && (c._store.removeSync(c[c._store.idProperty]), c._references.remove(a.target))
                            });
                            d && b.addSource && b.addSource(this, a)
                        }
                    }, removeReference: function (b) {
                        this._references &&
                        _.each(this._references, function (a) {
                            if (a && a.item == b)return this._references && this._references.remove(a), !0
                        }, this)
                    }, updateReferences: function (b) {
                        var a = b.property, d = b.value;
                        this._references || (this._references = []);
                        for (var c = 0; c < this._references.length; c++) {
                            var g = this._references[c], e = g.item, g = g.settings, n = e._store;
                            if (this._originReference != e && b.property && g.properties && g.properties[b.property]) {
                                n && (n._ignoreChangeEvents = !0);
                                try {
                                    if (e.onSourceChanged)e.onSourceChanged(a, d, b.type); else e.set(a, d)
                                } catch (k) {
                                    console.error("error updating reference! " +
                                        k, k)
                                }
                                n && (n._ignoreChangeEvents = !1, n.emit("update", {target: e}))
                            }
                        }
                    }, constructor: function (b) {
                        this._references = [];
                        l.mixin(this, b)
                    }, onItemChanged: function (b) {
                        this.updateReferences(b)
                    }
                };
                p = p("xgrid.data.Source", null, d);
                p.dcl = e(null, d);
                p.Implementation = d;
                return p
            })
        }, "xcf/mixins/LogMixin": function () {
            define(["dcl/dcl", "xcf/types/Types", "xide/utils"], function (e, p, l) {
                var n = p.DEFAULT_DEVICE_LOGGING_FLAGS;
                e = e(null, {
                    hasFlagEx: function (d, b, a) {
                        d = d.loggingFlags;
                        d = _.isString(d) ? l.fromJson(d) : d || {};
                        a = d[a] ? d[a] : n[a];
                        return null != a && a & b ? !0 : !1
                    }
                });
                e.DEFAULT_LOGGING_FLAGS = n;
                return e
            })
        }, "xide/console": function () {
            define([], function () {
                return "undefined" !== typeof window ? window.console : "undefined" !== typeof global ? global.console : {}
            })
        }, "xcf/manager/Context": function () {
            define("dcl/dcl xide/manager/Context xcf/manager/DriverManager xcf/manager/DeviceManager xcf/manager/ProtocolManager xcf/manager/Application xcf/manager/LogManager xide/manager/ResourceManager xide/manager/PluginManager xdojo/has".split(" "), function (e, p, l,
                                                                                                                                                                                                                                                                         n, d, b, a, f, c, g) {
                return e([p], {
                    declaredClass: "xcf.manager.Context",
                    namespace: "xcf.manager.",
                    driverManager: null,
                    deviceManager: null,
                    protocolManager: null,
                    debugManager: null,
                    nodeServiceManager: null,
                    blockManager: null,
                    getBlockManager: function () {
                        return this.blockManager
                    },
                    getProtocolManager: function () {
                        return this.protocolManager
                    },
                    getDriverManager: function () {
                        return this.driverManager
                    },
                    getDeviceManager: function () {
                        return this.deviceManager
                    },
                    getNodeServiceManager: function () {
                        return this.nodeServiceManager
                    },
                    getDebugManager: function () {
                        return this.debugManager
                    },
                    constructManagers: function (a) {
                        this.isEditor()
                    },
                    initManagers: function () {
                        this.isEditor() || (this.driverManager.init(), this.deviceManager.init(), g("protocols") && this.protocolManager.init(), g("log") && this.logManager.init());
                        this.resourceManager && this.resourceManager.init()
                    },
                    getUserDirectory: function () {
                        var a = this.getResourceManager();
                        if (a)return a.getVariable("USER_DIRECTORY")
                    }
                })
            })
        }, "xide/manager/Context": function () {
            define("dcl/dcl dojo/Deferred dojo/has xide/manager/ContextBase xide/types xide/utils require dojo/promise/all xdojo/has!host-browser?xide/manager/Context_UI".split(" "),
                function (e, p, l, n, d, b, a, f, c) {
                    l = e([n], {
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
                        namespace: "xide.manager.",
                        defaultNamespace: "xide.manager.",
                        vfsMounts: null,
                        xideServiceClient: null,
                        fileUpdateTimes: {},
                        onXIDEMessage: function (c, f) {
                            if (c && c.event && c.event === d.EVENTS.ON_FILE_CHANGED)if (c.data && c.data.mask &&
                                -1 !== c.data.mask.indexOf("delete"))this.publish(d.EVENTS.ON_FILE_DELETED, c); else if (c.data && "delete" == c.data.type)this.publish(d.EVENTS.ON_FILE_DELETED, c); else {
                                var e = c.data.path, k = (new Date).getTime();
                                if (this.fileUpdateTimes[e] && 1E3 > k - this.fileUpdateTimes[e])this.fileUpdateTimes[e] = k; else if (!1 !== f && this.publish(c.event, c), this.fileUpdateTimes[e] = k, e = b.replaceAll("\\", "/", c.data.path), e = b.replaceAll("//", "/", c.data.path), e = e.replace(/\\/g, "/"), -1 === e.indexOf("/build/") && null != e && null != e.indexOf) {
                                    if (e.match(/\.css$/))this.onCSSChanged({path: e});
                                    if (e.match(/\.js$/) && (k = c.data.modulePath)) {
                                        k = k.replace(".js", "");
                                        try {
                                            a(k)
                                        } catch (m) {
                                        }
                                        var h = "data/system/drivers";
                                        -1 != e.indexOf(h) && (k = e.substr(e.indexOf(h) + (h.length + 1), e.length), k = k.replace(".js", ""), k = "system_drivers/" + k);
                                        h = "user/drivers";
                                        -1 != e.indexOf(h) && (k = e.substr(e.indexOf(h) + (h.length + 1), e.length), k = k.replace(".js", ""), k = "user_drivers/" + k);
                                        (h = (h = this.getResourceManager()) ? h.getVariable("VFS_CONFIG") || {} : null) && h.user_drivers && -1 !== e.indexOf(h.user_drivers) && (h = h.user_drivers, h = h.replace(/\/+$/,
                                            ""), k = e.substr(e.indexOf(h) + (h.length + 1), e.length), k = k.replace(".js", ""), k = "user_drivers/" + k);
                                        k = b.replaceAll(".", "/", k);
                                        k.indexOf("/build/")
                                    }
                                }
                            }
                        },
                        onNodeServiceStoreReady: function (a) {
                        },
                        mergeFunctions: function (a, b, c, d) {
                            for (var f in b)_.isFunction(b[f]) && b[f] && a && (a[f] = b[f])
                        },
                        reloadModules: function (b, c) {
                            var d = new p, e = [], m = [], h = this;
                            a({cacheBust: "time\x3d" + (new Date).getTime()});
                            _.each(b, function (b) {
                                var d = null, g = new p;
                                !1 !== c && (d = a(b));
                                a.undef(b);
                                a([b], function (a) {
                                    d && h.mergeFunctions(d.prototype, a.prototype);
                                    m.push(a);
                                    g.resolve()
                                });
                                e.push(g)
                            });
                            f(e).then(function () {
                                d.resolve(m);
                                a({cacheBust: null})
                            });
                            return d
                        },
                        _reloadModule: function (c, f) {
                            var e = null, k = new p;
                            c = c.replace("0/8", "0.8");
                            c = c.replace("/src/", "/");
                            var m = this.getModule(c);
                            if (m && m.prototype && m.prototype.reloadModule)return m.prototype.reloadModule();
                            var e = a.on("error", function (a) {
                                console.log(a.src, a.id);
                                console.error("require error " + c, a);
                                e.remove();
                                k.reject(a)
                            }), h = this.getModule(c);
                            if (!h && (h = "undefined" !== typeof c ? h : null, !h && "undefined" !== typeof window))if (h =
                                    b.getAt(window, b.replaceAll("/", ".", c), null))m = h; else try {
                                h = a(b.replaceAll(".", "/", c))
                            } catch (n) {
                                console.log("couldnt require old module", c)
                            }
                            h && (m = h);
                            a.undef(c);
                            var l = this;
                            f ? setTimeout(function () {
                                a({cacheBust: "time\x3d" + (new Date).getTime(), waitSeconds: 5});
                                try {
                                    a([c], function (b) {
                                        a({cacheBust: null});
                                        if (_.isString(b))console.error("module reloaded failed : " + b + " for module : " + c); else {
                                            b.modulePath = c;
                                            m && (l.mergeFunctions(m.prototype, b.prototype, m, b), m.prototype && m.prototype._onReloaded && m.prototype._onReloaded(b));
                                            if (h && h.onReloaded)h.onReloaded(b, h);
                                            l.publish(d.EVENTS.ON_MODULE_RELOADED, {module: c, newModule: b});
                                            b.prototype && b.prototype.declaredClass && l.publish(d.EVENTS.ON_MODULE_UPDATED, {
                                                moduleClass: b.prototype.declaredClass,
                                                moduleProto: b.prototype
                                            });
                                            k.resolve(b)
                                        }
                                    })
                                } catch (b) {
                                    console.error("error reloading module", b), logError(b, "error reloading module"), k.reject(b)
                                }
                            }, 100) : k.resolve();
                            return k
                        },
                        onCSSChanged: function (a) {
                        },
                        onDidChangeFileContent: function (a) {
                            if (!a.didProcess && (a.didProcess = !0, this.vfsMounts && a.path)) {
                                var c =
                                    a.path;
                                if (-1 == c.indexOf(".css") && -1 == c.indexOf("resources") && -1 == c.indexOf("meta") && -1 != c.indexOf(".js")) {
                                    var c = a.mount.replace("/", ""), d = null;
                                    if (this.vfsMounts[c]) {
                                        var d = "" + a.path, d = d.replace("./", ""), d = d.replace("/", "."), d = d.replace(".js", ""), d = b.replaceAll(".", "/", d), f = this;
                                        setTimeout(function () {
                                            try {
                                                f._reloadModule(d, !0)
                                            } catch (a) {
                                                console.error("error reloading module", a)
                                            }
                                        }, 100)
                                    }
                                }
                            }
                        },
                        getMount: function (a) {
                            var b = this.getResourceManager();
                            return (b = b ? b.getVariable("VFS_CONFIG") || {} : null) && b[a] ? b[a] :
                                null
                        },
                        toVFSShort: function (a, c) {
                            var d = this.getResourceManager();
                            return (d = d ? d.getVariable("VFS_CONFIG") || {} : null) && d[c] && (d = d[c], d = b.replaceAll("//", "/", d), d = d.replace(/\/+$/, ""), -1 !== a.indexOf(d)) ? (d = d.replace(/\/+$/, ""), a.substr(a.indexOf(d) + (d.length + 1), a.length)) : null
                        },
                        findVFSMount: function (a) {
                            var c = this.getResourceManager();
                            if (c = c ? c.getVariable("VFS_CONFIG") || {} : null)for (var d in c) {
                                var f = c[d], f = b.replaceAll("//", "/", f), f = f.replace(/\/+$/, "");
                                if (-1 !== a.indexOf(f))return d
                            }
                            return null
                        },
                        getBlockManager: function () {
                            return this.blockManager
                        },
                        getPluginManager: function () {
                            return this.pluginManager
                        },
                        getService: function () {
                            return this.serviceObject
                        },
                        getFileManager: function () {
                            return this.fileManager
                        },
                        getResourceManager: function () {
                            return this.resourceManager
                        },
                        getMountManager: function () {
                            return this.mountManager
                        },
                        getContextManager: function () {
                            return this.contextManager
                        },
                        getLogManager: function () {
                            return this.logManager
                        },
                        getApplication: function () {
                            return this.application
                        },
                        constructor: function (a) {
                            this.managers = [];
                            this.config = a;
                            this.language = "en";
                            this.subscribe(d.EVENTS.ON_CHANGED_CONTENT,
                                this.onDidChangeFileContent)
                        },
                        prepare: function () {
                            this.config && this.initWithConfig(this.config)
                        },
                        initWithConfig: function (a) {
                            a && a.mixins && this.doMixins(a.mixins)
                        },
                        isEditor: function () {
                            return this.args && this.args.file
                        }
                    });
                    e.chainAfter(l, "constructManagers");
                    e.chainAfter(l, "initManagers");
                    return l
                })
        }, "xcf/manager/ProtocolManager": function () {
            define("dcl/dcl dojo/_base/declare xide/manager/ServerActionBase xide/types xide/utils xide/factory xaction/Action xcf/manager/BeanManager".split(" "), function (e, p,
                                                                                                                                                                              l, n, d, b, a, f, c, g, r, q, k, m) {
                return e([l, f], {
                    declaredClass: "xcf.manager.ProtocolManager",
                    beanNamespace: "protocol",
                    beanName: "Protocol",
                    beanIconClass: "fa-code",
                    groupType: n.ITEM_TYPE.PROTOCOL_GROUP,
                    itemType: n.ITEM_TYPE.PROTOCOL,
                    itemMetaPath: "user.meta",
                    itemMetaStorePath: "/meta/inputs",
                    itemMetaTitleField: n.PROTOCOL_PROPERTY.CF_PROTOCOL_TITLE,
                    systemScope: "system_protocols",
                    userScope: "user_protocols",
                    appScope: "app_protocols",
                    defaultScope: "system_protocols",
                    serviceClass: "XCF_Protocol_Service",
                    rawData: null,
                    store: null,
                    treeView: null,
                    protocolScopes: null,
                    getItemActions: function () {
                        var a = [], b = this, c = this.getItem(), g = c ? !0 === d.toBoolean(c.isDir) : !1;
                        a.push({
                            title: "New Group",
                            icon: "el-icon-folder",
                            place: "last",
                            emit: !1,
                            style: "",
                            handler: function (a, c, d) {
                                b.newGroup()
                            }
                        });
                        a.push({
                            title: "Reload",
                            icon: "fa-refresh",
                            disabled: !1,
                            command: "Reload",
                            place: "last",
                            emit: !1,
                            style: "",
                            handler: function () {
                                b.reload()
                            }
                        });
                        null != this.getItem() && (a.push({
                            title: "Delete",
                            icon: "el-icon-remove-circle",
                            disabled: !1,
                            command: "Delete",
                            place: "last",
                            emit: !1,
                            style: "",
                            handler: function () {
                                b.onDeleteItem(c)
                            }
                        }), g ? a.push({
                            title: "New Protocol",
                            icon: "el-icon-file-new",
                            disabled: !1,
                            command: "NewItem",
                            place: "last",
                            emit: !1,
                            style: "",
                            handler: function () {
                                b.newItem(c)
                            }
                        }) : a.push({
                            title: "Connect",
                            icon: "el-icon-play-circle",
                            disabled: !1,
                            command: "Start",
                            place: "last",
                            emit: !1,
                            style: "",
                            handler: function () {
                                b.startDevice(c)
                            }
                        }));
                        return a
                    },
                    onItemRemoved: function (a) {
                        a == this.currentItem && (this.currentItem = null);
                        a && (a = this.getView(a)) && d.destroy(a)
                    },
                    _onDeleteItem: function (a) {
                        var b = !0 ===
                            d.toBoolean(a.isDir), g = d.toString(a.name), f = b ? "removeGroup" : "removeItem", e = this;
                        (new c({
                            title: "Remove Protocol" + (b ? " Group" : "") + " '" + g + "'",
                            style: "max-width:400px",
                            titleBarClass: "text-danger",
                            delegate: {
                                isRemoving: !1, onOk: function (b) {
                                    e[f](d.toString(a.scope), d.toString(a.path), function () {
                                        e.onItemRemoved(a)
                                    })
                                }
                            },
                            inserts: [{
                                query: ".dijitDialogPaneContent",
                                insert: '\x3cdiv\x3e\x3cspan class\x3d"fileManagerDialogText"\x3eDo you really want to remove  this item?\x3c/span\x3e\x3c/div\x3e',
                                place: "first"
                            }]
                        })).show()
                    },
                    newItem: function () {
                        var a = this.getItem();
                        a || (a = {path: ""});
                        var b = [d.createCI("In Group", 13, d.toString(a.path), {
                            widget: {disabled: !0},
                            group: "Common"
                        }), d.createCI("Title", 13, "", {group: "Common"})], a = new r({
                            title: "New Device",
                            resizable: !0,
                            delegate: {
                                onOk: function (a, c) {
                                    var g = d.createCI("Id", 13, d.createUUID(), {visible: !1, group: "Common"});
                                    c.push(g);
                                    d.toOptions(c);
                                    d.getInputCIByName(b, "Title");
                                    d.getInputCIByName(b, "Scope");
                                    d.getInputCIByName(b, "In Group")
                                }
                            },
                            cis: b
                        });
                        a.show();
                        a.resize()
                    },
                    reload: function () {
                    },
                    onFileChanged: function (a) {
                        if (!a._pp2) {
                            a._pp2 = !0;
                            var b = a.data;
                            this.fileUpdateTimes || (this.fileUpdateTimes = {});
                            if (b.event === n.EVENTS.ON_FILE_CHANGED) {
                                if (b.data && b.mask && -1 !== b.mask.indexOf("delete")) {
                                    console.error("deleted");
                                    return
                                }
                                (new Date).getTime()
                            }
                            var c = d.replaceAll("\\", "/", b.path), c = d.replaceAll("//", "/", b.path), c = c.replace(/\\/g, "/");
                            -1 != c.indexOf("protocols") && (c.match(/\.json$/) && (-1 != c.indexOf("data/system/protocols") && console.log("protocol changed" + c), this.ls("system_protocols")), this.onFileChanged2 && this.onFileChanged2(a))
                        }
                    },
                    init: function () {
                        this.subscribe(n.EVENTS.ON_FILE_CHANGED,
                            this.onFileChanged)
                    },
                    _resetItem: function (a) {
                        a.commandsItem && d.removeFromStore(this.getStore(), a.commandsItem, !0, "path", "parentId");
                        a.variablesItem && d.removeFromStore(this.getStore(), a.variablesItem, !0, "path", "parentId")
                    },
                    _completeProtocolItem: function (a) {
                        if (a && a.user) {
                            var b = d.getInputCIByName(a.user.meta, "content"), c = this, g = this.getStore();
                            if (!b && (a.mount = "" + a.scope, a.getPath = function () {
                                    return a.path
                                }, a.virtual = !1, a.isDir = !0, a.children = [], b = d.createCI("Content", n.ECIType.FILE_EDITOR, "no value", {
                                    group: "Content",
                                    editor: "JSON Editor", editorArgs: {
                                        subscribers: [{
                                            event: "onSave", handler: function (b) {
                                                (b = d.getJson(b.value)) && b.meta && (a.user = b, a._completed = !1, c._resetItem(a), c._completeProtocolItem(a), c.publish(n.EVENTS.ON_PROTOCOL_CHANGED, {item: a}))
                                            }, owner: c
                                        }], leftEditorArgs: {
                                            subscribers: [{
                                                event: "addAction", handler: function (a) {
                                                    console.log("add action", arguments)
                                                }, owner: c
                                            }],
                                            hiddenFields: {},
                                            readOnlyNodes: {commands: !0, variables: !0, meta: !0},
                                            insertTemplates: [{
                                                label: "New Command",
                                                path: "commands",
                                                value: '{title:"No Title",send:""}',
                                                newNodeTemplate: "[]",
                                                collapse: !0,
                                                select: !0
                                            }, {
                                                label: "New Variable",
                                                path: "variables",
                                                value: '{title:"No Title",value:""}',
                                                newNodeTemplate: "[]",
                                                collapse: !0,
                                                select: !0
                                            }],
                                            renderTemplates: [{
                                                nodeValuePath: "field.innerHTML",
                                                match: [/^variables[\s]?\.(\d+)$/, /^commands[\s]?\.(\d+)$/],
                                                replaceWith: "{nodeValue} - {title}",
                                                variables: null,
                                                nodeValueTransform: function (a) {
                                                    return d.capitalize(a)
                                                },
                                                insertIfMatch: {}
                                            }]
                                        }, rightEditorArgs: {
                                            subscribers: [{
                                                event: "addAction", handler: function (a) {
                                                    console.log("add action", arguments)
                                                },
                                                owner: c
                                            }]
                                        }
                                    }, editorItem: a, editorOverrides: {}, isOwnTab: !0
                                }), a.user.meta.inputs.push(b), !a._completed)) {
                                a._completed = !0;
                                var f = {
                                    path: d.createUUID(),
                                    name: "Commands",
                                    isDir: !0,
                                    type: "leaf",
                                    parentId: a.path,
                                    virtual: !0,
                                    children: []
                                };
                                a.commandsItem = f;
                                a.children.push(f);
                                g.putSync(f);
                                for (var e = a.user.commands, b = 0; b < e.length; b++) {
                                    var k = e[b];
                                    f.children.push(g.putSync({
                                        path: d.createUUID(),
                                        name: k.name,
                                        id: d.createUUID(),
                                        parentId: f.path,
                                        _mayHaveChildren: !1,
                                        virtual: !0,
                                        user: {},
                                        isDir: !1,
                                        value: k.value,
                                        ref: {protocol: a, item: k},
                                        type: "protocolCommand"
                                    }))
                                }
                                f = {
                                    path: d.createUUID(),
                                    name: "Variables",
                                    isDir: !0,
                                    type: "leaf",
                                    parentId: a.path,
                                    virtual: !0,
                                    items: [],
                                    children: []
                                };
                                g.putSync(f);
                                a.children.push(f);
                                a.variablesItem = f;
                                e = a.user.variables;
                                for (b = 0; b < e.length; b++)k = e[b], f.children.push(g.putSync({
                                    isDir: !1,
                                    path: d.createUUID(),
                                    name: k.name,
                                    id: d.createUUID(),
                                    parentId: f.path,
                                    _mayHaveChildren: !1,
                                    value: k.value,
                                    virtual: !0,
                                    user: {},
                                    ref: {protocol: a, item: k},
                                    type: "protocolVariable"
                                }))
                            }
                        }
                    },
                    onStoreReady: function (a) {
                        a = a ? d.queryStore(a, {isDir: !1}) : [];
                        var b = this;
                        _.each(a, function (a, c, d) {
                            b._completeProtocolItem(a)
                        })
                    },
                    onMainViewReady: function () {
                        g.prototype.ctx = this.ctx
                    },
                    openItemSettings: function (a) {
                        var b = a.user;
                        if (!b || !b.meta)return null;
                        var c = this.getViewId(a), g = k.byId(c);
                        try {
                            if (g)return g.parentContainer && g.parentContainer.selectChild(g), null
                        } catch (f) {
                            d.destroy(g)
                        }
                        var g = this.getViewTarget(), e = this.getMetaValue(a, this.itemMetaTitleField);
                        a.beanContextName = this.ctx.mainView.beanContextName;
                        return d.addWidget(q, {
                            title: e || d.toString(a.name),
                            cis: b.meta.inputs,
                            beanContextName: this.ctx.mainView.beanContextName,
                            storeItem: a,
                            iconClass: this.beanIconClass,
                            id: c,
                            delegate: this,
                            storeDelegate: this,
                            closable: !0,
                            showAllTab: !1,
                            blockManager: this.ctx.getBlockManager()
                        }, this, g, !0)
                    }
                })
            })
        }, "xaction/Action": function () {
            define("dcl/dcl xide/model/Base xide/types xide/utils/ObjectUtils xide/utils xide/mixins/EventedMixin xide/cache/Circular".split(" "), function (e, p, l, n, d, b, a) {
                d.mixin(l, {
                    ACTION_VISIBILITY: {
                        MAIN_MENU: "MAIN_MENU",
                        CONTEXT_MENU: "CONTEXT_MENU",
                        QUICK_LAUNCH: "QUICK_LAUNCH",
                        ACTION_TOOLBAR: "ACTION_TOOLBAR",
                        PROPERTY_VIEW: "PROPERTY_VIEW",
                        RIBBON: "RIBBON",
                        widgetArgs: null,
                        factory: function () {
                            var a = arguments[1] || d.clone(l.ACTION_VISIBILITY), b = arguments;
                            if (0 < b[0].length && _.isNumber(b[0][0])) {
                                var f = b[0], e = 0;
                                _.each(a, function (b, d) {
                                    "function" !== typeof a[d] && e < f.length && (a[d + "_val"] = f[e]);
                                    e++
                                })
                            }
                            if (_.isString(b[0][0])) {
                                if (!0 === b[0][2])d.mixin(a[b[0][0] + "_val"], b[0][2]); else return a[b[0][0] + "_val"] = b[0][1], a;
                                return b[1]
                            }
                            return a
                        }
                    }
                });
                l.ACTION_VISIBILITY_ALL = "ACTION_VISIBILITY_ALL";
                var f = e([p.dcl, b.dcl], {
                    declaredClass: "xaction/Action",
                    disabled: !1,
                    destroy: function () {
                    },
                    enabled: !0,
                    object: null,
                    show: !0,
                    group: "",
                    types: "",
                    command: null,
                    icon: "fa-play",
                    event: null,
                    handler: null,
                    tab: null,
                    visibility_: null,
                    value: null,
                    setVisibility: function () {
                        if (2 == arguments.length && _.isString(arguments[0]) && arguments[0] == l.ACTION_VISIBILITY_ALL) {
                            var a = arguments[1], b = l.ACTION_VISIBILITY, f = this;
                            [b.MAIN_MENU, b.ACTION_TOOLBAR, b.CONTEXT_MENU, b.RIBBON].forEach(function (b) {
                                f.setVisibility(b, d.cloneKeys(a, !1))
                            });
                            return this
                        }
                        b = _.isArray(arguments[0]) ? arguments[0] : arguments;
                        this.visibility_ = l.ACTION_VISIBILITY.factory(b, this.visibility_);
                        return this
                    },
                    getVisibility: function (a) {
                        this.visibility_ || this.setVisibility(l.ACTION_VISIBILITY_ALL, {});
                        return this.visibility_ ? (null == this.visibility_[a + "_val"] && (this.visibility_[a + "_val"] = {vis: a}), this.visibility_[a + "_val"]) : {}
                    },
                    shouldDestroyWidget: function (a, b, d) {
                        a = null != this.getVisibility ? this.getVisibility(a) : null;
                        var f = !0;
                        a && a.permanent && (f = !(_.isFunction(a.permanent) ?
                            a.permanent(this, b, d) : a.permanent));
                        return f
                    }
                });
                f.create = function (a, b, e, n, k, m, h, t, l, p, x) {
                    t = null;
                    t = new f({
                        permanent: n,
                        command: e,
                        icon: b,
                        label: a,
                        owner: this,
                        types: m,
                        operation: k,
                        group: h,
                        handler: p,
                        title: a
                    });
                    d.mixin(t, x);
                    return t
                };
                f.createDefault = function (a, b, d, e, k, m) {
                    return f.create(a, b, d, !1, null, null, e || "nogroup", null, !1, k, m)
                };
                return f
            })
        }, "xide/cache/Circular": function () {
            define([], function () {
                function e(p) {
                    if (!(this instanceof e))return new e(p);
                    if ("object" == typeof p && Array.isArray(p._buffer) && "number" == typeof p._capacity && "number" == typeof p._first && "number" == typeof p._size)for (var l in p)p.hasOwnProperty(l) && (this[l] = p[l]); else {
                        if ("number" != typeof p || 0 != p % 1 || 1 > p)throw new TypeError("Invalid capacity");
                        this._buffer = Array(p);
                        this._capacity = p;
                        this._size = this._first = 0
                    }
                }

                e.prototype = {
                    size: function () {
                        return this._size
                    }, capacity: function () {
                        return this._capacity
                    }, enq: function (e) {
                        0 < this._first ? this._first-- : this._first = this._capacity - 1;
                        this._buffer[this._first] = e;
                        this._size < this._capacity && this._size++
                    },
                    push: function (e) {
                        this._size == this._capacity ? (this._buffer[this._first] = e, this._first = (this._first + 1) % this._capacity) : (this._buffer[(this._first + this._size) % this._capacity] = e, this._size++)
                    }, deq: function () {
                        if (0 == this._size)throw new RangeError("dequeue on empty buffer");
                        var e = this._buffer[(this._first + this._size - 1) % this._capacity];
                        this._size--;
                        return e
                    }, pop: function () {
                        return this.deq()
                    }, shift: function () {
                        if (0 == this._size)throw new RangeError("shift on empty buffer");
                        var e = this._buffer[this._first];
                        this._first ==
                        this._capacity - 1 ? this._first = 0 : this._first++;
                        this._size--;
                        return e
                    }, get: function (e, l) {
                        if (0 == this._size && 0 == e && (void 0 == l || 0 == l))return [];
                        if ("number" != typeof e || 0 != e % 1 || 0 > e)throw new TypeError("Invalid start");
                        if (e >= this._size)throw new RangeError("Index past end of buffer: " + e);
                        if (void 0 == l)return this._buffer[(this._first + e) % this._capacity];
                        if ("number" != typeof l || 0 != l % 1 || 0 > l)throw new TypeError("Invalid end");
                        if (l >= this._size)throw new RangeError("Index past end of buffer: " + l);
                        this._first + e >= this._capacity &&
                        (e -= this._capacity, l -= this._capacity);
                        return this._first + l < this._capacity ? this._buffer.slice(this._first + e, this._first + l + 1) : this._buffer.slice(this._first + e, this._capacity).concat(this._buffer.slice(0, this._first + l + 1 - this._capacity))
                    }, toarray: function () {
                        return 0 == this._size ? [] : this.get(0, this._size - 1)
                    }
                };
                return e
            })
        }, "xcf/manager/Application": function () {
            define("dcl/dcl require xide/manager/Application xide/utils xide/types xdojo/declare xdojo/has xdojo/has!xcf-ui?xcf/manager/Application_UI xdojo/has!xexpression?xexpression/Expression".split(" "),
                function (e, p, l, n, d, b, a, f, c, g) {
                    return e(l, {
                        declaredClass: "xcf.manager.Application", vfsItems: null, onReloaded: function () {
                        }, onMountDataReady: function (a) {
                        }, onPluginLoaded: function (a) {
                            this.publish(d.EVENTS.ON_PLUGIN_READY, {
                                name: a.name,
                                mainView: this.rootView,
                                config: this.config,
                                ctx: this.ctx,
                                panelManager: this,
                                fileManager: this.ctx.getFileManager(),
                                store: this.store,
                                serviceObject: this.ctx.getService()
                            }, this)
                        }, _onXBlocksReady: function () {
                            p("xfile/manager/BlockManager");
                            var a = this.ctx;
                            if (a.blockManager)a.blockManager.onReady();
                            p(["xcf/manager/BlockManager"], function (b) {
                                a.blockManager = new b;
                                a.blockManager.ctx = a;
                                a.blockManager.updatePalette = !1;
                                a.blockManager.init();
                                a.blockManager.onReady();
                                a.blockManager.serviceObject = a.fileManager.serviceObject
                            });
                            var b = p("xblox/views/BlocksFileEditor");
                            a.registerEditorExtension("xBlocks", "xblox", "fa-play-circle-o", this, !0, null, b, {
                                ctx: this.ctx,
                                mainView: this.mainView,
                                blockManagerClass: "xfile.manager.BlockManager",
                                registerView: !0
                            })
                        }
                    })
                })
        }, "xide/manager/Application": function () {
            define("dcl/dcl xdojo/has xide/manager/ManagerBase xide/types xide/utils dojo/Deferred dojo/promise/all dojo/has!host-browser?xide/manager/Application_UI".split(" "),
                function (e, p, l, n, d, b, a, f) {
                    return e([l], {
                        declaredClass: "xide.manager.Application",
                        container: null,
                        ctx: null,
                        _debug: !0,
                        _loadedComponents: {},
                        _loadingComponents: null,
                        getComponents: function () {
                            return this._loadedComponents
                        },
                        doComponents: function () {
                            function c(a, c) {
                                if (p(a) && d[a] && d[a].dfd) {
                                    var f = new b;
                                    k.push(f);
                                    d[a].dfd.then(function () {
                                        c(f)
                                    })
                                }
                            }

                            var d = this.loadComponents(), f = require, e = this, k = [], m = new b;
                            if (!d || !d.dfd)return console.error("componentsToLoad is null or has no head dfd"), d;
                            var h = n.COMPONENT_NAMES;
                            c(h.XTRACK, function (a) {
                                a.resolve()
                            });
                            c(h.XFILE, function (a) {
                                e.initXFile().then(function () {
                                    a.resolve()
                                })
                            });
                            c(h.XIDEVE, function (a) {
                                e.initXIDEVE().then(function () {
                                    a.resolve()
                                })
                            });
                            c(h.XNODE, function (a) {
                                e.initXNODE().then(function () {
                                    a.resolve()
                                })
                            });
                            c(h.XBLOX, function (a) {
                                f(["xblox/embedded_ui", "xfile/manager/BlockManager", "xblox/views/BlocksFileEditor"], function () {
                                    e.onXBlocksReady().then(function () {
                                        a.resolve()
                                    })
                                })
                            });
                            d.dfd.then(function () {
                                a(k).then(function () {
                                    m.resolve()
                                })
                            });
                            m.then(function () {
                                e.registerEditorExtensions()
                            });
                            return m
                        },
                        loadComponents: function (a) {
                            if (this._loadingComponents)return this._loadingComponents;
                            var g = this, f, e;
                            g._loadedComponents = {};
                            a = a || d.getJson(this.ctx.getResourceManager().getVariable("COMPONENTS"));
                            _.each(a, function (b, d) {
                                !1 === p(d) && delete a[d]
                            });
                            if (!a)return null;
                            f = function () {
                                var b = _.find(a, {status: 0});
                                b ? e(b.name, b) : (a.dfd.resolve(a), g.publish(n.EVENTS.ON_ALL_COMPONENTS_LOADED, a), a.dfd.resolve())
                            };
                            e = function (a, b) {
                                var c = b.settings;
                                !1 === p(a) && console.error("loading component " + a + "which is disabled by has!");
                                g.ctx.getPluginManager().loadComponent(a, null, !0 === c ? null : c).then(function (c) {
                                    g._loadedComponents[a] = c;
                                    c = {component: c, name: a};
                                    b.dfd.resolve(c);
                                    g.publish(n.EVENTS.ON_COMPONENT_READY, c);
                                    b.status = 1;
                                    f()
                                })
                            };
                            for (var k in a) {
                                var m = "" + k, h = a[m];
                                a[m] = h ? {settings: h, status: 0, name: m, dfd: new b} : {status: 1}
                            }
                            a.dfd = new b;
                            f();
                            return this._loadingComponents = a
                        },
                        hasComponent: function (a) {
                            var b = d.getJson(this.ctx.getResourceManager().getVariable("COMPONENTS"));
                            return !(!b || !b[a])
                        }
                    })
                })
        }, "xcf/manager/LogManager": function () {
            define(["dcl/dcl",
                "xlog/manager/LogManager"], function (e, p) {
                return e(p, {
                    declaredClass: "xcf.manager.LogManager", ls: function (e) {
                        var n = this;
                        return this.callMethodEx(null, "ls", ["unset"], function (d) {
                            n.rawData = d;
                            n.initStore(d);
                            e && e(d)
                        }, !0)
                    }
                })
            })
        }, "xlog/manager/LogManager": function () {
            define("dcl/dcl xdojo/declare xide/manager/ServerActionBase xide/manager/BeanManager xide/encoding/MD5 xide/types xide/utils dojo/cookie dojo/json dojo/Deferred xide/data/Memory xide/mixins/EventedMixin".split(" "), function (e, p, l, n, d, b, a, f, c, g,
                                                                                                                                                                                                                                              r, q) {
                var k = p([q], {
                    bytesLoaded: null,
                    percentValue: null,
                    item: null,
                    delegate: null,
                    _onEnd: null,
                    _onHandle: null,
                    serviceClass: "XIDE_Log_Service",
                    constructor: function (a) {
                        this.item = a;
                        this.subscribe(a.progressMessage, this._onProgress);
                        this.subscribe(a.progressFailedMessage, this._onProgressFailed)
                    },
                    _onProgressFailed: function (a) {
                        this.item.level = "error";
                        this.item.message = this.item.oriMessage + " : Failed";
                        this.item._isTerminated = !0;
                        a && a.item && a.item.error && this.item.details && (this.item.details.error = a.item.error)
                    },
                    _onFinish: function () {
                        this._onHandle && this._onHandle.remove()
                    },
                    _onProgress: function (a) {
                        try {
                            var b = a.progress;
                            a = null;
                            null == a && (a = Math.round(100 * b.loaded / b.total), this.bytesLoaded = b.loaded);
                            if (this.percentValue != a) {
                                var c = "" + this.item.oriMessage;
                                this.item.message = "" + (c + (" : " + a + "%"))
                            }
                            this.percentValue = a;
                            this._emit("progress");
                            100 <= this.percentValue && (this.item.message = this.item.oriMessage + " : Done", this._emit("finish"), this._onFinish(), this.destroy())
                        } catch (d) {
                            console.error("crash in log progress " + d)
                        }
                    }
                });
                return e([l, n], {
                    declaredClass: "xcf.manager.LogManager",
                    serviceClass: "XIDE_Log_Service",
                    cookiePrefix: "logging",
                    singleton: !0,
                    serviceView: null,
                    clients: null,
                    beanNamespace: "logging",
                    views: null,
                    stores: {},
                    removeStore: function (a) {
                        var b = this.stores[a];
                        b && (b.destroy && b.destroy(), delete this.stores[a])
                    },
                    getViewId: function (a) {
                        return this.beanNamespace + d(JSON.stringify({info: a.info}), 1)
                    },
                    loadPreferences: function () {
                        var a = f(this.cookiePrefix + "_debug_settings");
                        return a = a ? c.parse(a) : {}
                    },
                    savePreferences: function (a) {
                        f(this.cookiePrefix +
                            "_debug_settings", c.stringify(a))
                    },
                    empty: function (a) {
                        this.clear(a);
                        a = this.getStore(a);
                        a.then && a.then(function (a) {
                            a.setData([])
                        })
                    },
                    clear: function (a) {
                        return this.runDeferred(null, "clearAbs", [a || ""]).then(function (a) {
                        })
                    },
                    getViewTarget: function () {
                        return this.ctx.getApplication().mainView.getNewAlternateTarget()
                    },
                    getStore: function (b) {
                        if (!b)return this.store;
                        var c = new g;
                        if (this.stores[b])return c.resolve(this.stores[b]), c;
                        var d = this;
                        this.runDeferred(null, "lsAbs", [b || ""]).then(function (g) {
                            _.isString(g) &&
                            (g = a.getJson(g));
                            g = d.initStore(g);
                            d.stores[b] = g;
                            c.resolve(g)
                        });
                        return c
                    },
                    isValid: function () {
                        return null != this.store
                    },
                    _buildLoggingMessage: function (b) {
                        var c = {
                            id: a.createUUID(),
                            level: b.level,
                            message: b.message,
                            host: "",
                            data: b.data || {},
                            time: b.time || (new Date).getTime(),
                            type: "",
                            show: !0,
                            showDevice: !0
                        };
                        b.type && (c.type = b.type);
                        b.device && b.device.host && (c.host = b.device.host + ":" + b.device.port);
                        b.deviceMessage && (c.message = c.message + ":" + b.deviceMessage);
                        c.ori = b;
                        return c
                    },
                    initStore: function (b) {
                        var c = {
                            identifier: "time",
                            label: "level", items: [], sort: "time"
                        };
                        0 == b.length && (b = []);
                        for (var d = 0; d < b.length; d++)c.items.push(this._buildLoggingMessage(b[d]));
                        return new (p("LogStore", [r], {}))({idProperty: "time", data: c, id: a.createUUID()})
                    },
                    createLoggingView: function (b, c, d) {
                        c = c || this.getViewTarget();
                        return a.addWidget(!1, {
                            delegate: this,
                            store: b,
                            title: "Log",
                            closable: !0,
                            style: "padding:0px",
                            silent: d
                        }, this, c, !0)
                    },
                    updateViews: function (a, b) {
                        for (var c = 0; c < this.views.length; c++)this.views[c].update(a, b)
                    },
                    refreshViews: function () {
                        for (var a =
                            0; a < this.views.length; a++)this.views[a].grid.refresh()
                    },
                    addLogView: function (a) {
                        this.views.push(a)
                    },
                    openLogView: function (a, b) {
                        this.isValid() || this.initStore([]);
                        var c = this.createLoggingView(this.store, a, b);
                        this.views.push(c);
                        return c
                    },
                    _createPendingEvent: function (a, b, c, d) {
                        function g(a) {
                            !b._isTerminated && f && (b.message = b.oriMessage + " : Done", a && !0 === a.failed && (b.level = "error", b.message = b.oriMessage + " : Failed"), b._isTerminated = !0, f.remove(), f = null, e.refreshViews(), b.progressHandler && b.progressHandler.destroy())
                        }

                        var f = null, e = this;
                        b._isInProgress = !0;
                        f = e.subscribe(c, g, e)[0];
                        b.showProgress && b.progressMessage && !b.progressHandler && (a = new k(b, this), a._onEnd = g, a._onEndHandle = f, b.progressHandler = a)
                    },
                    addLoggingMessage: function (b) {
                        if (b && b.data) {
                            var c = b.data.logId;
                            !c && b.data && b.data.device && (c = b.data.device, c = c.host + "_" + c.port + "_" + c.protocol)
                        }
                        var d = {
                            id: a.createUUID(),
                            level: b.level,
                            message: b.message,
                            host: b.host || "",
                            data: b.data || {},
                            time: b.time || (new Date).getTime(),
                            type: b.type || "",
                            show: !0,
                            showDevice: !0,
                            terminatorItem: b.item,
                            terminatorMessage: b.terminatorMessage,
                            showProgress: b.showProgress,
                            progressMessage: b.progressMessage,
                            progressFailedMessage: b.progressFailedMessage,
                            details: b.details
                        };
                        b.data && (b.data.type && (d.type = b.data.type), b.data.device && b.data.device.host && (d.host = b.data.device.host + ":" + b.data.device.port), b.data.deviceMessage && (d.message = d.message + ":" + b.data.deviceMessage));
                        try {
                            null == d.terminatorMessage || d._isTerminated || (null == d.oriMessage && (d.oriMessage = "" + d.message), this._createPendingEvent(d.oriMessage, d,
                                d.terminatorMessage, d.time));
                            var g = this.getStore(c);
                            g && (g.then ? g.then(function (a) {
                                g = a;
                                d = a.putSync(d);
                                a._emit("added", {item: d, store: g})
                            }) : (d = g.putSync(d), g._emit("added", {item: d, store: g})))
                        } catch (f) {
                            console.error("adding log message to store failed " + f)
                        }
                    },
                    onServerLogMessage: function (a) {
                        a.data && a.data.time && (a.time = a.data.time);
                        this.addLoggingMessage(a);
                        !0 === a.write && this.publish(b.EVENTS.ON_CLIENT_LOG_MESSAGE, {
                            message: a.message,
                            data: a.data,
                            details: a.details,
                            level: a.level,
                            type: a.type,
                            time: a.data.time ||
                            a.time
                        })
                    },
                    init: function () {
                        this.subscribe([b.EVENTS.ON_SERVER_LOG_MESSAGE]);
                        this.views = [];
                        this.stores = {}
                    },
                    onStoreReloaded: function () {
                        for (var a = 0; a < this.views.length; a++) {
                            var b = this.views[a];
                            b.reload(this.store);
                            b.update()
                        }
                    },
                    reload: function () {
                        var a = this;
                        this.currentItem = null;
                        this.ls(function (b) {
                            a.onStoreReloaded(b)
                        })
                    },
                    ls: function (b, c, d) {
                        var g = this;
                        return this.callMethodEx(null, "lsAbs", [c || ""], d || function (c) {
                                g.rawData = c;
                                _.isString(c) && (c = a.getJson(c));
                                g.store = g.initStore(c);
                                b && b(c)
                            }, !0)
                    }
                })
            })
        }, "xide/manager/ResourceManager": function () {
            define(["dcl/dcl",
                "xide/manager/ServerActionBase", "xide/utils", "xide/mixins/VariableMixin"], function (e, p, l, n) {
                return e([p, n.dcl], {
                    declaredClass: "xide.manager.ResourceManager",
                    serviceClass: "XApp_Resource_Service",
                    resourceData: null,
                    resourceVariables: null,
                    getResourceVariables: function () {
                        return this.resourceVariables
                    },
                    setVariable: function (d, b) {
                        return this.resourceVariables[d] = b
                    },
                    getVariable: function (d) {
                        return this.resourceVariables[d]
                    },
                    init: function () {
                        this.resourceVariables || (this.resourceVariables = {})
                    },
                    replaceVariables: function (d,
                                                b) {
                        return l.multipleReplace("" + d, b || this.resourceVariables)
                    }
                })
            })
        }, "xide/mixins/VariableMixin": function () {
            define(["dcl/dcl", "xdojo/declare", "xide/utils"], function (e, p, l) {
                var n = {
                    resolve: function (d, b, a) {
                        b = b || this.resourceVariables || this.ctx.getResourceManager().getResourceVariables() || null;
                        a = a || this.variableDelimiters || null;
                        return l.replace(d, null, b, a)
                    }
                };
                p = p("xide/mixins/VariableMixin", null, n);
                p.dcl = e(null, n);
                return p
            })
        }, "xide/manager/PluginManager": function () {
            define("dcl/dcl dojo/has xide/manager/ManagerBase xide/utils xide/types xide/factory dojo/Deferred dojo/promise/all".split(" "),
                function (e, p, l, n, d, b, a, f) {
                    return e(l, {
                        declaredClass: "xide.manager.PluginManager",
                        _defaultPackageLocationPrefix: "../../",
                        _defaultPackageLocationSuffix: "/component",
                        _defaultComponentFlags: {LOAD: 1, RUN: 2},
                        defaultComponentMixin: function (a) {
                            return {owner: this, ctx: this.ctx, flags: a}
                        },
                        componentBaseClasses: null,
                        ctx: null,
                        pluginResources: null,
                        pluginInstances: null,
                        _componentReady: function (a, b, d) {
                            if (b.RUN)try {
                                a.run(this.ctx)
                            } catch (f) {
                            }
                            return d.resolve(a)
                        },
                        _componentLoaded: function (a, d, f, e) {
                            try {
                                n.mixin(f, this.defaultComponentMixin(d));
                                var k = b.createInstance(a, f, this.componentBaseClasses), m = function (a, b, c) {
                                    this._componentReady(a, b, c)
                                }.bind(this);
                                d.LOAD ? k.load().then(function () {
                                    m(k, d, e)
                                }) : m(k, d, e)
                            } catch (h) {
                                e.reject(arguments), logError(h)
                            }
                        },
                        loadComponent: function (b, d, f, e, k) {
                            f = "true" === f ? {} : f;
                            b = -1 == b.indexOf("/") ? this._defaultPackageLocationPrefix + b + this._defaultPackageLocationSuffix : b;
                            d = null != d ? d : this._defaultComponentFlags;
                            var m = new a, h = this;
                            (e = n.getObject(b)) ? _.isFunction(e.then) ? e.then(function (a) {
                                    h._componentLoaded(a, d, f, m)
                                },
                                function (a) {
                                    console.error("error in loading component at path " + b, a)
                                }) : this._componentLoaded(e, d, f, m) : console.error("cant get object at " + b);
                            return m
                        },
                        loadComponentResources: function (a, b) {
                        },
                        reloadComponent: function (a) {
                        },
                        loadPlugins: function (b) {
                            if (p("plugins")) {
                                var g = new a, e = [], n = this;
                                this.pluginResources = b;
                                this.pluginInstances = [];
                                if (this.pluginResources)for (var k = 0; k < this.pluginResources.length; k++) {
                                    var m = this.pluginResources[k];
                                    m.type && "JS-PLUGIN" == m.type && m.path && e.push(this.loadComponent(m.path,
                                        null, m).then(function (a) {
                                        a.pluginResources = m;
                                        n.pluginInstances.push(a)
                                    }))
                                }
                                f(e).then(function () {
                                    g.resolve(e);
                                    n.publish(d.EVENTS.ALL_PLUGINS_READY, {instances: n.pluginInstances, resources: b})
                                });
                                return g
                            }
                        }
                    })
                })
        }, "nxapp/manager/DeviceManager": function () {
            define("dcl/dcl dojo/node!fs xcf/manager/DeviceManager xide/utils xide/types nxapp/utils/_console nxapp/utils dojo/node!child_process".split(" "), function (e, p, l, n, d, b, a, f) {
                function c(a, b, c, d, f, e, n) {
                    r.exec(c, q, function (a, b, c) {
                        if (b && 127 === parseInt(b, 10) && (g.error("--have error " +
                                c), n && n.onCommandError))n.onCommandError();
                        b && 0 === parseInt(b, 10) && g.error("--terminate with " + b);
                        b && 1 === parseInt(b, 10) && g.error("--terminate with 1 " + b);
                        g.error("response ", arguments)
                    }.bind(this))
                }

                var g = b;
                e(null, {
                    emit: function () {
                        g.error("device server client emit", arguments)
                    }
                });
                var r = f, q = {
                    stdout: !0,
                    stderr: !0,
                    stdin: !0,
                    failOnError: !0,
                    stdinRawMode: !1,
                    killSignal: "SIGTERM"
                };
                return e(l, {
                    declaredClass: "nxapp.manager.DeviceManager", connection: null, runShell: function (a, b, c) {
                        var f = this.getContext().getConnectionManager();
                        r.exec(a, q, function (b, e, m) {
                            e && 127 === parseInt(e, 10) && g.error("--have error " + m);
                            b && g.log("err", b);
                            e && g.log("stdout", e);
                            m && g.log("stderr", m);
                            e && 0 === parseInt(e, 10) && g.info("--terminate with 0" + e);
                            if (e && 1 === parseInt(e, 10)) {
                                g.info("--terminate with 1 " + e);
                                try {
                                    f.onData(f.getConnection2(c), n.mixin({
                                        cmd: a,
                                        event: d.EVENTS.ON_COMMAND_FINISH,
                                        result: e
                                    }, c), new Buffer(e))
                                } catch (l) {
                                    g.error("onFinish-Error:", l)
                                }
                            }
                        }.bind(this))
                    }, runShell2: function (a, b, d, f, g, e) {
                        g = a.options;
                        c(a, {host: g.host, port: g.port, protocol: g.protocol},
                            b, d, f, q, e)
                    }, onDeviceMetaChanged: function (b, c) {
                        var d = this.store;
                        d && _.each(d.data, function (d) {
                            if (-1 !== d.path.indexOf(c) && p.existsSync(b)) {
                                var f = n.getJson(a.readFile(b));
                                f && (d.user = f)
                            }
                        })
                    }, onFileChanged: function (a) {
                        if ("changed" === a.type && !a._did) {
                            a._did = !0;
                            a = n.replaceAll("\\", "/", a.path);
                            a = n.replaceAll("//", "/", a);
                            a = a.replace(/\\/g, "/");
                            var b;
                            b = a;
                            b = -1 != b.indexOf("system/devices") ? b.substr(b.indexOf("system/devices") + 15, b.length) : null;
                            if (b && -1 !== b.indexOf(".meta.json"))this.onDeviceMetaChanged(a, b)
                        }
                    },
                    checkDeviceServerConnection: function () {
                    }, sendManagerCommand: function (a, b) {
                        try {
                            var c = this.ctx.getDeviceServer(), d = {manager_command: a};
                            n.mixin(d, b);
                            c.handleManagerCommand(d, this.connection)
                        } catch (f) {
                            g.error("error " + f.message, f.stack)
                        }
                    }, sendDeviceCommand: function (a, b, c, d) {
                        a = a.options;
                        n.mixin({src: c}, a);
                        b = {command: b, device_command: "Device_Send", options: a};
                        n.mixin(b.options, {params: {src: c, id: d}});
                        this.ctx.getDeviceServer().handleDeviceCommand(b, this.connection)
                    }
                })
            })
        }, "xcf/manager/BlockManager": function () {
            define(["dcl/dcl",
                "xide/types", "xide/manager/ManagerBase", "xblox/manager/BlockManager", "xide/lodash"], function (e, p, l, n, d) {
                return e([l, n], {
                    declaredClass: "xcf.manager.BlockManager", onReady: function () {
                    }, addDriverFunctions: function (b, a) {
                        for (var f in a)"constructor" !== f && "inherited" !== f && d.isFunction(a[f]) && (b[f] = a[f])
                    }, setScriptFunctions: function (b, a, d) {
                        var c = d;
                        a.context || (a.context = b);
                        b.blockScope || (b.blockScope = a);
                        a.context && a.context.instance && (a.device = a.context.instance);
                        b.callCommand || (b.callCommand = function (a) {
                            (a =
                                this.blockScope.getBlockByName(a)) && a.solve(this.blockScope)
                        });
                        b.setVariable || (b.setVariable = function (d, f, e, k, m) {
                            if (d = this.blockScope.getVariable(d))d.value = f, d.set("value", f), !1 !== k && c.publish(p.EVENTS.ON_DRIVER_VARIABLE_CHANGED, {
                                item: d,
                                scope: a,
                                driver: b,
                                owner: c,
                                save: !0 === e,
                                source: m || p.MESSAGE_SOURCE.BLOX
                            })
                        });
                        b.getVariable || (b.getVariable = function (a) {
                            return (a = this.blockScope.getVariable(a)) ? a.value : ""
                        });
                        this.inherited(arguments)
                    }, onReloaded: function () {
                        this.init()
                    }, getDeviceVariablesAsEventOptions: function () {
                    },
                    onCreateVariableCI: function (b) {
                    }
                })
            })
        }, "xblox/manager/BlockManager": function () {
            define("dcl/dcl dojo/has dojo/Deferred dojo/promise/all xide/types xide/utils xide/factory xblox/model/ModelBase xblox/model/Scope xblox/model/BlockModel xide/mixins/ReloadMixin xide/manager/ManagerBase xblox/data/Store xdojo/has!xblox-ui?xblox/manager/BlockManagerUI xide/lodash".split(" "), function (e, p, l, n, d, b, a, f, c, g, r, q, k, m, h) {
                return e([q, r.dcl], {
                    declaredClass: "xblox/manager/BlockManager", serviceObject: null, loaded: {},
                    test: function () {
                    }, scope: null, scopes: null, _createBlock: null, _registerActions: function () {
                    }, toScope: function (a) {
                        try {
                            a = b.getJson(a)
                        } catch (c) {
                            return console.error("BlockManager::toScope: failed,err\x3d" + c), null
                        }
                        a || (console.error("correct data"), a = {blocks: [], variables: []});
                        var d = b.createUUID(), f = a;
                        !h.isArray(a) && h.isObject(a) && (d = a.scopeId || d, f = a.blocks || []);
                        a = this.getScope(d, {owner: this}, !0);
                        f = a.blocksFromJson(f);
                        for (d = 0; d < f.length; d++)f[d]._lastRunSettings = {force: !1, highlight: !0};
                        a.serviceObject = this.serviceObject;
                        return a
                    }, loadFiles: function (a) {
                        for (var b = [], c = new l, d = 0; d < a.length; d++) {
                            var f = a[d];
                            b.push(this.load(f.mount, f.path, f.force))
                        }
                        n(b).then(function (a) {
                            c.resolve(a)
                        });
                        return c.promise
                    }, load: function (a, c, d) {
                        var f = new l, g = this, e = b.replaceAll("/", "", a), h = b.replaceAll("./", "", c), k = e + h, k = k.trim();
                        this.loaded[k] && !0 === d && (this.removeScope(this.loaded[k].id), this.loaded[k] = null);
                        if (!0 !== d && this.loaded[k])return f.resolve(this.loaded[k]), f.promise;
                        this.ctx.getFileManager().getContent(e, h, function (b) {
                            if (b = g.toScope(b))g.loaded[k] =
                                b, b.mount = a, b.path = c;
                            f.resolve(b)
                        }, !1);
                        return f.promise
                    }, onBlocksReady: function (a) {
                        for (var b = a.allBlocks(), c = 0; c < b.length; c++)this.setScriptFunctions(b[c], a, this);
                        if ((a = a.getBlocks({group: "On Load"})) && 0 < a.length)for (c = 0; c < a.length; c++)if (b = a[c], b.onLoad)b.onLoad()
                    }, getBlock: function () {
                    }, setScriptFunctions: function (a, b, c) {
                        a.blockScope || (a.blockScope = b);
                        b.serviceObject = this.serviceObject;
                        a.setVariable || (a.setVariable = function (f, g, e, h, k) {
                            if (f = this.blockScope.getVariable(f))f.value = g, !1 !== h && c.publish(d.EVENTS.ON_VARIABLE_CHANGED,
                                {
                                    item: f,
                                    scope: b,
                                    driver: a,
                                    owner: c,
                                    save: !0 === e,
                                    source: k || d.MESSAGE_SOURCE.BLOX
                                })
                        });
                        a.getVariable || (a.getVariable = function (a) {
                            return (a = this.blockScope.getVariable(a)) ? a.value : ""
                        })
                    }, hasScope: function (a) {
                        this.scopes || (this.scopes = {});
                        return this.scopes[a] ? this.scopes[a] : null
                    }, getScope: function (b, c, f) {
                        this.scopes || (this.scopes = {});
                        if (!this.scopes[b] && (this.scopes[b] = this.createScope({
                                id: b,
                                ctx: this.ctx
                            }), this.scopes[b].userData = c, !1 !== f))try {
                            a.publish(d.EVENTS.ON_SCOPE_CREATED, this.scopes[b])
                        } catch (g) {
                            console.error("bad, scope creation failed " +
                                g, g)
                        }
                        return this.scopes[b]
                    }, removeScope: function (a) {
                        this.scopes || (this.scopes = {});
                        for (var b in this.loaded)this.loaded[b].id == a && delete this.loaded[b];
                        this.scopes[a] && (this.scopes[a]._destroy(), delete this.scopes[a]);
                        return null
                    }, createScope: function (a, d, f) {
                        d = d || [];
                        var e = new k({
                            data: [],
                            Model: g,
                            id: b.createUUID(),
                            __events: {},
                            observedProperties: ["name", "enabled", "value"],
                            getLabel: function (a) {
                                return a.name
                            },
                            labelAttr: "name"
                        });
                        e.reset();
                        e.setData([]);
                        e = {
                            owner: this, blockStore: e, serviceObject: this.serviceObject,
                            config: this.config
                        };
                        b.mixin(e, a);
                        try {
                            var h = new c(e);
                            d && h.initWithData(d, f);
                            h.init()
                        } catch (m) {
                            logError(m, "error creating scope, data:", a)
                        }
                        return h
                    }, onReloaded: function () {
                    }, init: function () {
                        this.scope = {variables: [], blocks: []};
                        f.prototype.types = d;
                        f.prototype.factory = a;
                        if (this.onReady)this.onReady()
                    }
                })
            })
        }, "xblox/model/Scope": function () {
            define("dcl/dcl ./ModelBase ./Expression xide/factory xide/utils xide/types xide/mixins/EventedMixin dojo/_base/lang dojo/has xide/encoding/MD5 xcf/model/Variable xdojo/has!host-node?nxapp/utils/_console".split(" "),
                function (e, p, l, n, d, b, a, f, c, g, r, q) {
                    var k = "undefined" !== typeof window ? window.console : "undefined" !== typeof global ? global.console : q;
                    q && (k = q);
                    var m = c("xcf-ui");
                    p = e([p, a.dcl], {
                        declaredClass: "xblox.model.Scope",
                        variableStore: null,
                        serviceObject: null,
                        context: null,
                        blockStore: null,
                        expressionModel: null,
                        start: function () {
                            if (!0 === this.__didStartBlocks)k.error("already started blocks"); else {
                                this.__didStartBlocks = !0;
                                var a = this.getVariable("value");
                                a || (a = new r({
                                    id: d.createUUID(), name: "value", value: "", scope: this, type: 13,
                                    group: "processVariables", gui: !1, cmd: !1
                                }), this.blockStore.putSync(a));
                                var a = [], c = this.getBlocks({group: b.COMMAND_TYPES.INIT_COMMAND}), f = this;
                                try {
                                    _.each(c, function (a) {
                                        !1 !== a.enabled && !0 !== a.__started && (a.solve(f), a.__started = !0)
                                    }, this)
                                } catch (g) {
                                    k.error("starting init blocks failed", g), logError(g, this)
                                }
                                a = a.concat(this.getBlocks({group: b.COMMAND_TYPES.BASIC_COMMAND}));
                                for (c = 0; c < a.length; c++) {
                                    var e = a[c];
                                    e.enabled && e.start && e.startup && !0 !== e.__started && (e.start(), e.__started = !0)
                                }
                            }
                        },
                        getExpressionModel: function () {
                            this.expressionModel ||
                            (this.expressionModel = new l);
                            return this.expressionModel
                        },
                        toFriendlyName: function (a, b) {
                            if (!b || !a)return null;
                            var c = this, f = this.ctx, g = this.driver, g = f.getDeviceManager(), e = f.getDriverManager();
                            if (-1 == b.indexOf("://"))return (c = c.getBlockById(b)) ? c.name : b;
                            var f = d.parse_url(b), f = d.urlArgs(f.host), k = g.getItemById(f.device.value);
                            if (k) {
                                var m = g.toDeviceControlInfo(k), g = e.getDriverById(m.driverId);
                                if ((k = k.driverInstance) || g)if (c = g.blockScope ? g.blockScope : k ? k.blockScope : c, (a = c.getStore().getSync(f.block.value)) ||
                                    k && k.blockScope && (a = k.blockScope.getBlock(f.block.value)))return m.title + "/" + a.name
                            }
                            return b
                        },
                        getContext: function () {
                            return this.instance
                        },
                        toString: function () {
                            var a = {blocks: null, variables: null}, b = this.blocksToJson();
                            try {
                                d.fromJson(JSON.stringify(b))
                            } catch (c) {
                                return
                            }
                            a.blocks = b;
                            return JSON.stringify(a, null, 2)
                        },
                        initWithData: function (a, b) {
                            a && this.blocksFromJson(a, null, b);
                            this.clearCache()
                        },
                        getService: function () {
                            return this.serviceObject
                        },
                        getStore: function () {
                            return this.blockStore
                        },
                        reset: function () {
                            this.getExpressionModel().reset()
                        },
                        empty: function () {
                            this.clearCache();
                            var a = this.blockStore, b = this.getBlocks();
                            a.silent(!0);
                            _.each(b, function (b) {
                                b && a.removeSync(b.id)
                            });
                            a.setData([]);
                            a.silent(!1)
                        },
                        fromScope: function (a) {
                            var b = this.blockStore;
                            b.silent(!0);
                            this.empty();
                            a = a.blocksToJson();
                            this.blocksFromJson(a);
                            b.silent(!1)
                        },
                        clearCache: function () {
                            this.getExpressionModel().reset()
                        },
                        getVariableStore: function () {
                            return this.blockStore
                        },
                        getBlockStore: function () {
                            return this.blockStore
                        },
                        getVariables: function (a) {
                            if (!this.blockStore)return [];
                            var b =
                                this.blockStore.data, c = [];
                            if (a && "processVariables" === a.group) {
                                for (a = 0; a < b.length; a++)"processVariables" === b[a].group && c.push(b[a]);
                                return c
                            }
                            if (!a) {
                                for (a = 0; a < b.length; a++) {
                                    var d = b[a], f = d.declaredClass;
                                    "xblox.model.variables.Variable" != f && "xcf.model.Variable" != f || c.push(d)
                                }
                                return c
                            }
                            return this.blockStore.query(a)
                        },
                        loopBlock: function (a, b) {
                            1 == a._destroyed && k.error("block destroyed");
                            var c = a.getInterval ? a.getInterval() : 0;
                            if (a && 0 < c && a.enabled && !0 !== a._destroyed) {
                                var d = this;
                                a._loop && clearInterval(a._loop);
                                a._loop = setInterval(function () {
                                    !a.enabled || a._destroyed ? (clearInterval(a._loop), a._loop = null) : a.solve(d, b || a._lastSettings)
                                }, c)
                            }
                        },
                        getEventsAsOptions: function (a) {
                            var c = [], d;
                            for (d in b.EVENTS)c.push({label: b.EVENTS[d], value: b.EVENTS[d]});
                            c = c.concat([{label: "onclick", value: "onclick"}, {
                                label: "ondblclick",
                                value: "ondblclick"
                            }, {label: "onmousedown", value: "onmousedown"}, {
                                label: "onmouseup",
                                value: "onmouseup"
                            }, {label: "onmouseover", value: "onmouseover"}, {
                                label: "onmousemove",
                                value: "onmousemove"
                            }, {
                                label: "onmouseout",
                                value: "onmouseout"
                            }, {label: "onkeypress", value: "onkeypress"}, {
                                label: "onkeydown",
                                value: "onkeydown"
                            }, {label: "onkeyup", value: "onkeyup"}, {
                                label: "onfocus",
                                value: "onfocus"
                            }, {label: "onblur", value: "onblur"}, {label: "onchange", value: "onchange"}]);
                            for (d = 0; d < c.length; d++) {
                                var f = c[d];
                                if (f.value === a) {
                                    f.selected = !0;
                                    break
                                }
                            }
                            return c
                        },
                        getVariablesAsObject: function () {
                            for (var a = this.getVariables(), b = {}, c = 0; c < a.length; c++)b[a[c].title] = a[c].value;
                            return b
                        },
                        getVariablesAsOptions: function () {
                            var a = this.getVariables(), b = [];
                            if (a)for (var c = 0; c < a.length; c++)b.push({label: a[c].label, value: a[c].variable});
                            return b
                        },
                        getCommandsAsOptions: function (a) {
                            var b = this.getBlocks({declaredClass: "xcf.model.Command"}), c = [];
                            if (b)for (var d = 0; d < b.length; d++) {
                                var f = {};
                                f[a || "label"] = b[d].name;
                                f.value = b[d].name;
                                c.push(f)
                            }
                            return c
                        },
                        _cached: null,
                        getBlocks: function (a, b) {
                            if (!m && !1 !== b && (this._cached || (this._cached = {}), a)) {
                                var c = g(JSON.stringify(a), 1);
                                if (c = this._cached[c])return c
                            }
                            if (!this.blockStore)return [];
                            a = a || {id: /\S+/};
                            var d = _.isEmpty(a) ?
                                this.blockStore.data : this.blockStore.query(a, null, !0);
                            m || !1 === b || (c = g(JSON.stringify(a), 1), this._cached[c] = d);
                            return d
                        },
                        registerVariable: function (a) {
                            this.variables[a.title] = a;
                            this.blockStore && this.blockStore.putSync(a)
                        },
                        getVariable: function (a) {
                            for (var b = this.getVariables(), c = 0; c < b.length; c++) {
                                var d = b[c];
                                if (d.name === a)return d
                            }
                            return null
                        },
                        getVariableById: function (a) {
                            if (!a)return null;
                            var b = a.split("/"), c = this;
                            2 == b.length && ((a = c.owner) && a.hasScope && (a.hasScope(b[0]) ? c = a.getScope(b[0]) : k.error("have scope id but cant resolve it",
                                this)), a = b[1]);
                            return (b = c.blockStore.getSync(a)) ? b : null
                        },
                        registerBlock: function (a, b) {
                            var c = this.blockStore;
                            if (c) {
                                var d = c.getSync(a.id);
                                if (d)return d;
                                d = null;
                                return d = a.addToStore ? a.addToStore(c) : c.putSync(a, b)
                            }
                        },
                        allBlocks: function (a, b) {
                            return this.getBlocks({}, b)
                        },
                        hasGroup: function (a) {
                            for (var b = this.allGroups({}, !1), c = 0; c < b.length; c++)if (b[c] === a)return !0;
                            return !1
                        },
                        allGroups: function () {
                            for (var a = [], b = this.allBlocks({}, !1), c = function (b) {
                                for (var c = 0; c < a.length; c++)if (a[c] === b)return !0;
                                return !1
                            }, d = 0; d <
                                 b.length; d++) {
                                var f = b[d];
                                f.parentId || (f.group ? c(f.group) || a.push(f.group) : c("No Group") || a.push("No Group"))
                            }
                            return a
                        },
                        variablesToJson: function () {
                            var a = [], b = this.variableStore ? this.getVariables() : this.variables, c;
                            for (c in b) {
                                var d = b[c];
                                if (!1 !== d.serializeMe && null != d.keys) {
                                    var f = {}, g;
                                    for (g in d)if (this.isString(d[g]) || this.isNumber(d[g]) || this.isBoolean(d[g]))f[g] = d[g];
                                    a.push(f)
                                }
                            }
                            return a
                        },
                        isScript: function (a) {
                            return this.isString(a) && (-1 != a.indexOf("return") || -1 != a.indexOf(";") || -1 != a.indexOf("[") ||
                                -1 != a.indexOf("{") || -1 != a.indexOf("}"))
                        },
                        variablesToJavascriptEx: function (a, b) {
                            for (var c = [], d = this.variableStore ? this.getVariables() : this.variables, f = 0; f < d.length; f++) {
                                var g = d[f];
                                if (g != a) {
                                    var e = "" + g.value;
                                    a && a.value && -1 == a.value.indexOf(g.title) || b && -1 == b.indexOf(g.title) || 0 == e.length || (this.isScript(e) || -1 != e.indexOf("'") ? this.isScript(e) && (e = this.expressionModel.parseVariable(this, g)) : e = "'" + e + "'", "''" === e && (e = "'0'"), c.push(e))
                                }
                            }
                            return c
                        },
                        variablesToJavascript: function (a, b) {
                            for (var c = "", d = this.variableStore ?
                                this.getVariables() : this.variables || [], f = 0; f < d.length; f++) {
                                var g = d[f];
                                if (g != a) {
                                    var e = "" + g.value;
                                    a && a.value && -1 == a.value.indexOf(g.title) || b && -1 == b.indexOf(g.title) || 0 == e.length || (this.isScript(e) || -1 != e.indexOf("'") ? this.isScript(e) && (e = this.expressionModel.parseVariable(this, g)) : e = "'" + e + "'", "''" === e && (e = "'0'"), c += "var " + g.title + " \x3d " + e + ";", c += "\n")
                                }
                            }
                            return c
                        },
                        variablesFromJson: function (a) {
                            for (var b = [], c = 0; c < a.length; c++) {
                                var f = a[c];
                                f.scope = this;
                                if (f.declaredClass) {
                                    var g = d.replaceAll(".", "/", f.declaredClass),
                                        e = require(g);
                                    e ? b.push(new e(f)) : k.log("couldnt resolve " + g)
                                } else k.log("   variable has no class ")
                            }
                            return b
                        },
                        regenerateIDs: function (a) {
                            for (var b = this, c = function (a) {
                                var f = d.createUUID(), g = b.getBlocks({parentId: a.id});
                                if (g && 0 < g.length)for (var e = 0; e < g.length; e++) {
                                    var h = g[e];
                                    h.parentId = f;
                                    c(h)
                                }
                                a.id = f
                            }, f = 0; f < a.length; f++)c(a[f])
                        },
                        cloneBlocks2: function (a, b) {
                            var c = this.blocksToJson(a), f = this.owner.getScope(d.createUUID(), null, !1), c = f.blocksFromJson(c, !1), g = this.blockStore, c = f.allBlocks();
                            f.regenerateIDs(c);
                            c = f.blocksToJson(c);
                            if (b)for (f = 0; f < c.length; f++) {
                                var e = c[f];
                                null == e.parentId && (e.group = b)
                            }
                            var k = [], c = this.blocksFromJson(c);
                            _.each(c, function (a) {
                                k.push(g.getSync(a.id))
                            });
                            return k
                        },
                        cloneBlocks: function (a) {
                            a = this.blocksToJson(a);
                            var b = this.owner.getScope(d.createUUID(), null, !1);
                            a = b.blocksFromJson(a, !1);
                            a = b.allBlocks();
                            for (b = 0; b < a.length; b++) {
                                var c = a[b];
                                c.id = d.createUUID();
                                c.parentId = null
                            }
                            this.blocksToJson(a);
                            this.blocksFromJson(a);
                            return a
                        },
                        blockToJson: function (a) {
                            var b = {_containsChildrenIds: []}, c;
                            for (c in a)if ("ctrArgs" != c && ("function" === typeof a[c] || a.serializeField(c))) {
                                if (this.isString(a[c]) || this.isNumber(a[c]) || this.isBoolean(a[c]))b[c] = a[c];
                                if ("parent" != c)if (this.isBlock(a[c]))b[c] = a[c].id, b._containsChildrenIds.push(c); else if (this.areBlocks(a[c])) {
                                    b[c] = [];
                                    for (var d = 0; d < a[c].length; d++)b[c].push(a[c][d].id);
                                    b._containsChildrenIds.push(c)
                                }
                            }
                            return b
                        },
                        blocksToJson: function (a) {
                            try {
                                var b = [];
                                a = a && a.length ? a : this.blockStore ? this.blockStore.data : this.blocks;
                                for (var c in a) {
                                    var d = a[c];
                                    if (null !=
                                        d.keys && !1 !== d.serializeMe) {
                                        var f = {_containsChildrenIds: []}, g;
                                        for (g in d)if ("ctrArgs" != g && ("function" === typeof d[g] || d.serializeField(g))) {
                                            if (this.isString(d[g]) || this.isNumber(d[g]) || this.isBoolean(d[g]))f[g] = d[g];
                                            _.isObject(d[g]) && d.serializeObject && !0 === d.serializeObject(g) && (f[g] = JSON.stringify(d[g], null, 2));
                                            if ("parent" != g)if (this.isBlock(d[g]))f[g] = d[g].id, f._containsChildrenIds.push(g); else if (this.areBlocks(d[g])) {
                                                f[g] = [];
                                                for (var e = 0; e < d[g].length; e++)f[g].push(d[g][e].id);
                                                f._containsChildrenIds.push(g)
                                            }
                                        }
                                        b.push(f)
                                    }
                                }
                            } catch (m) {
                                k.error("from json failed : " +
                                    m)
                            }
                            return b
                        },
                        _createBlockStore: function () {
                        },
                        blockFromJson: function (a) {
                            a.scope = this;
                            null == a._containsChildrenIds && (a._containsChildrenIds = []);
                            for (var b = {}, c = 0; c < a._containsChildrenIds.length; c++) {
                                var f = a._containsChildrenIds[c];
                                b[f] = a[f];
                                a[f] = null
                            }
                            delete a._containsChildrenIds;
                            if (!a.declaredClass)return k.log("   not a class "), null;
                            f = c = null;
                            try {
                                f = d.replaceAll(".", "/", a.declaredClass), c = require(f)
                            } catch (g) {
                                try {
                                    f = d.replaceAll("/", ".", a.declaredClass), c = require(f)
                                } catch (m) {
                                }
                            }
                            c || (c = e.getObject(a.declaredClass));
                            if (!c)return null;
                            f = null;
                            try {
                                f = n.createBlock(c, a)
                            } catch (l) {
                                return logError(l), null
                            }
                            f._children = b;
                            return f
                        },
                        blocksFromJson: function (a, b, c) {
                            for (var f = [], g = {}, m = 0; m < a.length; m++) {
                                var l = a[m];
                                l.scope = this;
                                null == l._containsChildrenIds && (l._containsChildrenIds = []);
                                for (var q = {}, r = 0; r < l._containsChildrenIds.length; r++) {
                                    var p = l._containsChildrenIds[r];
                                    q[p] = l[p];
                                    l[p] = null
                                }
                                delete l._containsChildrenIds;
                                if (l.declaredClass) {
                                    var G = r = null;
                                    try {
                                        G = d.replaceAll(".", "/", l.declaredClass), r = require(G)
                                    } catch (D) {
                                        k.error("couldnt resolve class " +
                                            G)
                                    }
                                    r || (r = e.getObject(l.declaredClass));
                                    if (r) {
                                        G = null;
                                        try {
                                            G = n.createBlock(r, l, null, !1)
                                        } catch (z) {
                                            k.error("error in block creation ", z + " " + l.declaredClass);
                                            logError(z);
                                            continue
                                        }
                                        G._children = q;
                                        g[G.id] = q;
                                        f.push(G)
                                    } else k.log("couldnt resolve " + G)
                                } else k.log("   not a class ")
                            }
                            a = this.allBlocks(null, !1);
                            for (m = 0; m < a.length; m++) {
                                l = a[m];
                                l._children = g[l.id];
                                if (l._children) {
                                    for (p in l._children)if ("string" == typeof l._children[p])(q = this.getBlockById(l._children[p])) ? (l[p] = q, q.parent = l, q.postCreate && q.postCreate()) :
                                        (this.blockStore.removeSync(l._children[p]), c && c("   couldnt resolve child: " + l._children[p] + "@" + l.name + ":" + l.declaredClass), k.log("   couldnt resolve child: " + l._children[p] + "@" + l.name + ":" + l.declaredClass)); else if ("object" == typeof l._children[p])for (l[p] = [], r = 0; r < l._children[p].length; r++)(q = this.getBlockById(l._children[p][r])) ? (l[p].push(q), (G = this.getBlockById(q.parentId)) ? q.parent = G : k.error("child has no parent")) : (c && c("   couldnt resolve child: " + l._children[p] + "@" + l.name + ":" + l.declaredClass),
                                        k.log("   couldnt resolve child: " + l._children[p][r] + "@" + l.name + ":" + l.declaredClass));
                                    delete l._children
                                }
                                !1 !== b && null != l.parentId && null == this.getBlockById(l.parentId) && (l.parentId = null);
                                l.postCreate()
                            }
                            this.allBlocks();
                            return f
                        },
                        resolveBlock: function (a) {
                            var b = this, c = this.ctx, b = this.driver, b = this.device, f = c.getDeviceManager(), c = c.getDriverManager();
                            if (-1 == a.indexOf("://"))return (b = this.getBlockById(a)) ? b : a;
                            a = d.parse_url(a);
                            a = d.urlArgs(a.host);
                            var g = f.getItemById(a.device.value);
                            if (!g) {
                                var e = f.getInstanceByName(a.device.value);
                                e && (g = e.device)
                            }
                            if (g)if (f = f.toDeviceControlInfo(g)) {
                                if (b = c.getDriverById(f.driverId), (f = g.driverInstance) || b)if (a = (b = f ? f.blockScope : b.blockScope) ? b.getStore().getSync(a.block.value) : null)return a
                            } else k.warn("cant get device info for " + g.title, b)
                        },
                        getBlock: function (a) {
                            return this.getBlockById(a)
                        },
                        getBlockByName: function (a) {
                            if (-1 !== a.indexOf("://")) {
                                var b = this.resolveBlock(a);
                                if (b)return b
                            }
                            for (var c = this.getBlocks(), d = 0; d < c.length; d++)if (b = c[d], b.name === a)return b;
                            return (a = this.blockStore.query({name: a})) &&
                            0 < a.length ? a[0] : null
                        },
                        getBlockById: function (a) {
                            return this.blockStore.getSync(a)
                        },
                        _flatten: function (a) {
                            var b = [], c;
                            for (c in a) {
                                var d = a[c];
                                if (null != d.keys) {
                                    b.push(d);
                                    for (var f in d)if ("ctrArgs" != f && "parent" !== f)if (this.isBlock(d[f]))b.push(d[f]); else if (this.areBlocks(d[f]))for (var g = 0; g < d[f].length; g++)b.push(d[f][g])
                                }
                            }
                            return b
                        },
                        flatten: function (a) {
                            var b = [], c;
                            for (c in a) {
                                var d = a[c];
                                if (null != d.keys) {
                                    var f = _.find(b, {id: d.id});
                                    f || b.push(d);
                                    for (var g in d)if ("ctrArgs" != g && "parent" !== g) {
                                        var e = d[g];
                                        if (this.isBlock(e))(f =
                                            _.find(b, {id: e.id})) || b.push(e); else if (this.areBlocks(e))for (var k = 0; k < e.length; k++) {
                                            var m = e[k];
                                            (f = _.find(b, {id: m.id})) || b.push(m);
                                            b = b.concat(this.flatten([m]))
                                        }
                                    }
                                }
                            }
                            return b = _.uniq(b, !1, function (a) {
                                return a.id
                            })
                        },
                        _getSolve: function (a) {
                            return a.prototype ? a.prototype.solve : a.__proto__.solve
                        },
                        solveBlock: function (a, b, c, g) {
                            b = b || {highlight: !1};
                            var e = null;
                            this.isString(a) ? (e = this.getBlockByName(a)) || (e = this.getBlockById(a)) : this.isObject(a) && (e = a);
                            a = null;
                            if (e) {
                                if (!0 !== b.force && 0 == e.enabled)return null;
                                !0 ===
                                b.force && (b.force = !1);
                                var k = e.declaredClass;
                                (k = f.getObject(d.replaceAll("/", ".", k)) || f.getObject(k)) ? k.prototype && k.prototype.solve && (a = k.prototype.solve.apply(e, [this, b])) : (a = e.solve(e.getScope(), b, c, g), delete e.override, e.override = {})
                            }
                            return a
                        },
                        solve: function (a, b) {
                            for (var c = "", d = 0; d < this.items.length; d++)c += this.items[d].solve(a, b);
                            return c
                        },
                        parseExpression: function (a, b, c, d, f, g, e, k) {
                            return this.getExpressionModel().parse(this, a, b, d, f, g, c, e, k)
                        },
                        isString: function (a) {
                            return "string" == typeof a
                        },
                        isNumber: function (a) {
                            return "number" == typeof a
                        },
                        isBoolean: function (a) {
                            return "boolean" == typeof a
                        },
                        isObject: function (a) {
                            return "object" === typeof a
                        },
                        isBlock: function (a) {
                            var b = !1;
                            "object" == typeof a && null != a && void 0 == a.length && a.serializeMe && (b = !0);
                            return b
                        },
                        areBlocks: function (a) {
                            var b = !1;
                            "object" == typeof a && null != a && 0 < a.length && this.isBlock(a[0]) && (b = !0);
                            return b
                        },
                        _onVariableChanged: function (a) {
                            a.item && this.getExpressionModel().variableFuncCache[a.item.title] && delete this.expressionModel.variableFuncCache[a.item.title]
                        },
                        init: function () {
                            this.getExpressionModel();
                            this.subscribe(b.EVENTS.ON_DRIVER_VARIABLE_CHANGED, this._onVariableChanged);
                            var a = this;
                            this.subscribe(b.EVENTS.ON_MODULE_RELOADED, function (b) {
                                var c = b.module, f = b.newModule;
                                (b = a.getBlocks().filter(function (a) {
                                    return a.declaredClass == c || a.declaredClass == d.replaceAll("/", ".", c) ? a : null
                                })) && _.each(b, function (a) {
                                    var b = f.prototype, c;
                                    for (c in b) {
                                        var d = b[c];
                                        d && _.isFunction(d) && (a[c] = d)
                                    }
                                })
                            })
                        },
                        _destroy: function () {
                            for (var a = this.allBlocks(), c = 0; c < a.length; c++) {
                                var d = a[c];
                                if (d)try {
                                    d && d.stop && d.stop(!0), d && d.reset &&
                                    d.reset(), d && d._destroy && d._destroy(), d && d.destroy && d.destroy(), d._emit && d._emit(b.EVENTS.ON_ITEM_REMOVED, {item: d})
                                } catch (f) {
                                }
                            }
                        },
                        destroy: function () {
                            this._destroy();
                            this.reset();
                            this._destroyed = !0;
                            delete this.expressionModel
                        },
                        moveTo: function (a, b, c, d) {
                            k.log("move to : ", arguments);
                            if (d) {
                                if (b.canAdd && b.canAdd()) {
                                    var f = this.getBlockById(a.parentId);
                                    f && f.removeBlock(a, !1);
                                    return b.add(a, null, null)
                                }
                                k.error("cant reparent");
                                return !1
                            }
                            if (b.parentId || !1 !== d)if (!a.parentId && b.parentId && 0 == d)a.group = b.group;
                            else if (a.parentId || b.parentId || !d) {
                                if (a.parentId && b.parentId && 0 == d && a.parentId === b.parentId) {
                                    f = this.getBlockById(a.parentId);
                                    if (!f)return !1;
                                    for (var g = f[f._getContainer(a)], f = a.indexOf(g, a), e = a.indexOf(g, b), g = f > e ? -1 : 1, e = Math.abs(f - (e + (1 == c ? -1 : 1))), f = 0; f < e - 1; f++)a.move(g);
                                    return !0
                                }
                                if (a.parentId && b.parentId && 0 == d && a.parentId !== b.parentId) {
                                    k.log("same parent!");
                                    f = this.getBlockById(a.parentId);
                                    if (!f)return !1;
                                    var m = this.getBlockById(b.parentId);
                                    if (m && f && f.removeBlock && m.canAdd && m.canAdd())f.removeBlock(a,
                                        !1), m.add(a, null, null); else return !1;
                                    g = m[m._getContainer(a)];
                                    null == g && k.error("weird : target parent has no item container");
                                    f = m.indexOf(g, a);
                                    e = m.indexOf(g, b);
                                    if (!f || !e) {
                                        k.error(" weird : invalid drop processing state, have no valid item indicies");
                                        return
                                    }
                                    g = f > e ? -1 : 1;
                                    e = Math.abs(f - (e + (1 == c ? -1 : 1)));
                                    for (f = 0; f < e - 1; f++)m.move(a, g);
                                    return !0
                                }
                            } else return b.canAdd && b.canAdd() && (a.group = null, b.add(a, null, null)), !0; else {
                                (f = this.getBlockById(a.parentId)) && f.removeBlock && (f.removeBlock(a, !1), a.parentId = null, a.group =
                                    b.group);
                                for (var m = [], e = this.getBlocks({group: b.group}), n = [], g = this.getBlockStore(), l = g.storage.index[b.id], f = 0; f < e.length; f++) {
                                    var q = e[f];
                                    null == e[f].parentId && e[f] != a && (q = g.storage.index[q.id], d = c ? q >= l : q <= l) && (m.push(e[f]), n.push(g.storage.index[e[f].id]))
                                }
                                for (f = 0; f < m.length; f++)g.remove(m[f].id);
                                this.getBlockStore().remove(a.id);
                                c && this.getBlockStore().putSync(a);
                                for (f = 0; f < m.length; f++)g.put(m[f]);
                                c || this.getBlockStore().putSync(a);
                                return !0
                            }
                            return !1
                        }
                    });
                    e.chainAfter(p, "destroy");
                    return p
                })
        }, "xblox/model/Expression": function () {
            define(["xdojo/declare",
                "xdojo/has", "xide/utils", "xide/types", "xblox/model/ModelBase"], function (e, p, l, n, d, b, a) {
                var f = "undefined" !== typeof window ? window.console : global.console;
                b && f && f.error && (f = a);
                return e("xblox.model.Expression", [d], {
                    id: null,
                    context: null,
                    variableDelimiters: {begin: "[", end: "]"},
                    blockCallDelimiters: {begin: "{", end: "}"},
                    expressionCache: null,
                    variableFuncCache: null,
                    constructor: function () {
                        this.reset()
                    },
                    reset: function () {
                        this.expressionCache = {};
                        this.variableFuncCache = {}
                    },
                    replaceVariables: function (a, b, d, e, k, m, h, l) {
                        h =
                            h || this.variableDelimiters;
                        l = l || n.CIFLAG.NONE;
                        l & n.CIFLAG.DONT_ESCAPE && (e = !1);
                        l & n.CIFLAG.DONT_PARSE && (d = !1);
                        var p = this._findOcurrences(b, h);
                        if (p)for (var u = 0; u < p.length; u++) {
                            var x = p[u], x = x.replace(h.begin, ""), x = x.replace(h.end, "");
                            (x = this._getVar(a, x)) && x.flags & n.CIFLAG.DONT_PARSE && (d = !1);
                            var v = null;
                            if (x) {
                                if (m) {
                                    b = b.replace(p[u], "this.getVariable('" + x.name + "')");
                                    continue
                                }
                                v = this.getValue(x.value);
                                k && x.name in k && (v = k[x.name]);
                                if (this.isScript(v) && !1 !== d)try {
                                    var B = a.variablesToJavascript(x, !0);
                                    B && (v = B +
                                        v);
                                    var y = (new Function("{\n" + v + "\n}")).call(a.context || {});
                                    "undefined" === y || "undefined" === typeof y ? v = "" + x.value : (v = y, l & n.CIFLAG.DONT_ESCAPE || (v = "'" + v + "'"))
                                } catch (E) {
                                    f.log(" parsed variable expression failed \n" + v, E)
                                } else this.isNumber(v) || !1 !== e && (v = "'" + v + "'")
                            } else v = p[u];
                            b = b.replace(p[u], v)
                        }
                        return b
                    },
                    parse: function (a, b, d, e, k, m, h, n, l) {
                        b = this.replaceAll("''", "'", b);
                        d = m || a.context || a.getContext() || {};
                        b = this.replaceVariables(a, b, null, null, h, null != d.getVariable, null, l);
                        h = this.isScript(b);
                        if (!h && (this.isString(b) ||
                            this.isNumber(b)))return e && e("Expression " + b + " evaluates to " + b), b;
                        -1 == b.indexOf("return") && h && (b = "return " + b);
                        a = this;
                        try {
                            b = this.replaceAll("''", "'", b);
                            var p = this.expressionCache[b];
                            p || (p = new Function("{" + b + "; }"), this.expressionCache[b] = p);
                            a = p.apply(d, n)
                        } catch (x) {
                            return f.error("     invalid expression : \n" + b, x), k && k("invalid expression : \n" + b + ": " + x, x), a = "" + b
                        }
                        e && e("Expression " + b + " evaluates to " + a);
                        return a
                    },
                    parseVariableO: function (a, b) {
                        var d = "" + b.value;
                        if ("None" === b.title)return "";
                        try {
                            var e =
                                a.variablesToJavascript(b, !1);
                            e && (d = e + d);
                            var k = (new Function("{" + d + "}")).call(this.context || {});
                            "undefined" === k || "undefined" === typeof k ? d = "" + b.value : this.isNumber(k) ? d = k : (d = "" + k, d = "'" + d + "'")
                        } catch (m) {
                            f.error("parse variable failed : " + b.title + "\n" + d)
                        }
                        return d
                    },
                    parseVariable: function (a, b, d, f, e, m, h) {
                        var n = "" + b.value;
                        d = d || "";
                        !1 !== e ? (e = this.variableFuncCache[a.id + "|" + b.title], e || (e = new Function("{" + d + n + "}"), this.variableFuncCache[a.id + "|" + b.title] = e)) : e = new Function("{" + d + n + "}");
                        a = e.apply(m || a.context ||
                            {}, h || []);
                        return n = "undefined" === a || "undefined" === typeof a ? "" + b.value : this.isNumber(a) || !1 === f ? a : "'" + a + "'"
                    },
                    replaceBlockCalls: function (a, b) {
                        var d = this._findOcurrences(b, this.blockCallDelimiters);
                        if (d)for (var f = 0; f < d.length; f++) {
                            var e = this._removeDelimiters(d[f], this.blockCallDelimiters), e = a.solveBlock(e).join("\n");
                            b = b.replace(d[f], e)
                        }
                        return b
                    },
                    _getVar: function (a, b) {
                        return a.getVariable(this._getVarName(b))
                    },
                    _getVarName: function (a) {
                        return this._removeDelimiters(a, this.variableDelimiters)
                    },
                    _removeDelimiters: function (a,
                                                 b) {
                        return a.replace(b.begin, "").replace(b.end, "")
                    },
                    _escapeRegExp: function (a) {
                        for (var b = "[](){}*+.".split(""), d = 0; d < b.length; d++)a = a.replace(b[d], "\\" + b[d]);
                        return a
                    },
                    _findOcurrences: function (a, b) {
                        var d = this._escapeRegExp(b.begin), f = this._escapeRegExp(b.end);
                        return a.match(new RegExp(d + "(" + ("[^" + f + "]*") + ")" + f, "g"))
                    }
                })
            })
        }, "xblox/model/BlockModel": function () {
            define(["dcl/dcl", "xdojo/declare", "xide/data/Model", "xide/data/Source"], function (e, p, l, n) {
                return p("xblox.model.BlockModel", [l, n], {
                    declaredClass: "xblox.model.BlockModel",
                    icon: "fa-play", postCreate: function () {
                        console.error("post create")
                    }, constructor: function () {
                        console.error("sd")
                    }, mayHaveChildren: function (d) {
                        return null != this.items && 0 < this.items.length
                    }, getChildren: function (d) {
                        return this.items
                    }, getBlockIcon: function () {
                        return '\x3cspan class\x3d"' + this.icon + '"\x3e\x3c/span\x3e'
                    }
                })
            })
        }, "xblox/data/Store": function () {
            define(["dojo/_base/declare", "xide/data/TreeMemory", "xide/data/ObservableStore", "dstore/Trackable", "dojo/Deferred"], function (e, p, l, n, d) {
                return e("xblox.data.Store",
                    [p, n, l], {
                        idProperty: "id", parentField: "parentId", parentProperty: "parentId", filter: function (b) {
                            var a = this.inherited(arguments);
                            delete this._state.filter;
                            this._state.filter = b;
                            return a
                        }, getRootItem: function () {
                            return {
                                canAdd: function () {
                                    return !0
                                }, id: this.id + "_root", group: null, name: "root", isRoot: !0, parentId: null
                            }
                        }, getChildren: function (b) {
                            return this.root.filter({parentId: this.getIdentity(b)})
                        }, _fetchRange: function (b) {
                            var a = new d;
                            b = this.fetchRangeSync(b);
                            if (this._state.filter) {
                                if (this._state.filter.parentId) {
                                    var f =
                                        this.getSync(this._state.filter.parentId);
                                    f && (this.reset(), b = f.items, f.getChildren && (b = f.getChildren()), a.resolve(b))
                                }
                                this._state && this._state.filter && this._state.filter.group && (this.getSync(this._state.filter.parent), f && (this.reset(), b = f.items))
                            }
                            a.resolve(b);
                            return a
                        }, mayHaveChildren: function (b) {
                            return b.mayHaveChildren ? b.mayHaveChildren(b) : null != b.items && 0 < b.items.length
                        }
                    })
            })
        }, "xblox/factory/Blocks": function () {
            define("xide/factory xide/utils xide/types xide/mixins/ReloadMixin xide/mixins/EventedMixin xblox/model/logic/CaseBlock xblox/model/Block xblox/model/functions/CallBlock xblox/model/functions/StopBlock xblox/model/functions/PauseBlock xblox/model/functions/SetProperties xblox/model/code/CallMethod xblox/model/code/RunScript xblox/model/loops/ForBlock xblox/model/loops/WhileBlock xblox/model/variables/VariableAssignmentBlock xblox/model/logic/IfBlock xblox/model/logic/ElseIfBlock xblox/model/logic/SwitchBlock xblox/model/variables/VariableSwitch xblox/model/logging/Log xblox/model/server/RunServerMethod xblox/model/server/Shell xblox/model/code/RunBlock xblox/model/events/OnEvent xblox/model/events/OnKey xblox/model/mqtt/Subscribe xblox/model/mqtt/Publish xblox/model/File/ReadJSON xcf/factory/Blocks".split(" "),
                function (e, p, l, n, d, b, a, f, c, g, r, q, k, m, h, t, w, u, x, v, B, y, E, J, G, D, z, C, I) {
                    var A = null;
                    e.prepareBlockContructorArgs = function (a) {
                        a || (a = {});
                        a.id || (a.id = p.createUUID());
                        a.items || (a.items = [])
                    };
                    e.createBlock = function (a, b, c, d) {
                        e.prepareBlockContructorArgs(b);
                        a = e.createInstance(a, b, c);
                        a.ctrArgs = null;
                        var f;
                        try {
                            a && a.init && a.init(), a.scope && (f = a.scope.registerBlock(a, d)), a.initReload && a.initReload()
                        } catch (g) {
                            logError(g, "create block")
                        }
                        return f || a
                    };
                    e.clearVariables = function () {
                    };
                    e.getAllBlocks = function (a, b, c, d, f) {
                        if (!1 !==
                            f && null != A) {
                            for (a = 0; a < A.length; a++)if (b = A[a], "Set Variable" === b.name) {
                                A.remove(b);
                                break
                            }
                            return A
                        }
                        0 == f && (A = null);
                        f = e._getFlowBlocks(a, b, c, d);
                        f = f.concat(e._getLoopBlocks(a, b, c, d));
                        f = f.concat(e._getCommandBlocks(a, b, c, d));
                        f = f.concat(e._getCodeBlocks(a, b, c, d));
                        f = f.concat(e._getEventBlocks(a, b, c, d));
                        f = f.concat(e._getLoggingBlocks(a, b, c, d));
                        f = f.concat(e._getServerBlocks(a, b, c, d));
                        f = f.concat(e._getMQTTBlocks(a, b, c, d));
                        return A = f = f.concat(e._getFileBlocks(a, b, c, d))
                    };
                    e._getMQTTBlocks = function (a, b, c, d) {
                        var f =
                            [];
                        f.push({
                            name: "MQTT",
                            iconClass: "fa-cloud",
                            items: [{
                                name: "Subscribe",
                                owner: b,
                                iconClass: "fa-bell",
                                proto: z,
                                target: c,
                                ctrArgs: {scope: a, group: d}
                            }, {
                                name: "Publish",
                                owner: b,
                                iconClass: "fa-send",
                                proto: C,
                                target: c,
                                ctrArgs: {scope: a, group: d}
                            }]
                        });
                        e.publish(l.EVENTS.ON_BUILD_BLOCK_INFO_LIST, {items: f, group: "MQTT"});
                        return f
                    };
                    e._getFileBlocks = function (a, b, c, d) {
                        var f = [];
                        f.push({
                            name: "File",
                            iconClass: "fa-file",
                            items: [{
                                name: "%%Read JSON",
                                owner: b,
                                iconClass: "fa-file",
                                proto: I,
                                target: c,
                                ctrArgs: {scope: a, group: d}
                            }]
                        });
                        e.publish(l.EVENTS.ON_BUILD_BLOCK_INFO_LIST,
                            {items: f, group: "File"});
                        return f
                    };
                    e._getServerBlocks = function (a, b, c, d) {
                        var f = [];
                        f.push({
                            name: "Server",
                            iconClass: "el-icon-repeat",
                            items: [{
                                name: "Run Server Method",
                                owner: b,
                                iconClass: "fa-plug",
                                proto: y,
                                target: c,
                                ctrArgs: {scope: a, group: d}
                            }, {
                                name: "Shell",
                                owner: b,
                                iconClass: "fa-code",
                                proto: E,
                                target: c,
                                ctrArgs: {scope: a, group: d}
                            }]
                        });
                        e.publish(l.EVENTS.ON_BUILD_BLOCK_INFO_LIST, {items: f, group: "Server"});
                        return f
                    };
                    e._getVariableBlocks = function (a, b, c, d) {
                        var f = [];
                        f.push({
                            name: "Flow", iconClass: "el-icon-random", items: [{
                                name: "If...Else",
                                owner: b,
                                iconClass: "el-icon-fork",
                                proto: w,
                                target: c,
                                ctrArgs: {scope: a, group: d, condition: "[value]\x3d\x3d'PW'"}
                            }]
                        });
                        return f
                    };
                    e._getEventBlocks = function (a, b, c, d) {
                        var f = [];
                        f.push({
                            name: "Events",
                            iconClass: "fa-bell",
                            items: [{
                                name: "On Event",
                                owner: b,
                                iconClass: "fa-bell",
                                proto: G,
                                target: c,
                                ctrArgs: {scope: a, group: d}
                            }, {
                                name: "On Key",
                                owner: b,
                                iconClass: "fa-keyboard-o",
                                proto: D,
                                target: c,
                                ctrArgs: {scope: a, group: d}
                            }]
                        });
                        e.publish(l.EVENTS.ON_BUILD_BLOCK_INFO_LIST, {items: f, group: "Events"});
                        return f
                    };
                    e._getLoggingBlocks =
                        function (a, b, c, d) {
                            var f = [];
                            f.push({
                                name: "Logging",
                                iconClass: "fa-bug",
                                items: [{
                                    name: "Log",
                                    owner: b,
                                    iconClass: "fa-bug",
                                    proto: B,
                                    target: c,
                                    ctrArgs: {scope: a, group: d}
                                }]
                            });
                            e.publish(l.EVENTS.ON_BUILD_BLOCK_INFO_LIST, {items: f, group: "Logging"});
                            return f
                        };
                    e._getCodeBlocks = function (a, b, c, d) {
                        var f = [];
                        f.push({
                            name: "Code",
                            iconClass: "fa-code",
                            items: [{
                                name: "Call Method",
                                owner: b,
                                iconClass: "el-icon-video",
                                proto: q,
                                target: c,
                                ctrArgs: {scope: a, group: d}
                            }, {
                                name: "Run Script", owner: b, iconClass: "fa-code", proto: k, target: c, ctrArgs: {
                                    scope: a,
                                    group: d
                                }
                            }, {
                                name: "Run Block",
                                owner: b,
                                iconClass: "fa-code",
                                proto: J,
                                target: c,
                                ctrArgs: {scope: a, group: d}
                            }, {
                                name: "Set Properties",
                                owner: b,
                                iconClass: "fa-code",
                                proto: r,
                                target: c,
                                ctrArgs: {scope: a, group: d}
                            }]
                        });
                        e.publish(l.EVENTS.ON_BUILD_BLOCK_INFO_LIST, {items: f, group: "Code"});
                        return f
                    };
                    e._getFlowBlocks = function (a, b, c, d) {
                        var f = [];
                        f.push({
                            name: "Flow",
                            iconClass: "el-icon-random",
                            items: [{
                                name: "If...Else",
                                owner: b,
                                iconClass: "el-icon-fork",
                                proto: w,
                                target: c,
                                ctrArgs: {scope: a, group: d, condition: "[value]\x3d\x3d'PW'"}
                            },
                                {
                                    name: "Switch",
                                    owner: b,
                                    iconClass: "el-icon-fork",
                                    proto: x,
                                    target: c,
                                    ctrArgs: {scope: a, group: d}
                                }, {
                                    name: "Variable Switch",
                                    owner: b,
                                    iconClass: "el-icon-fork",
                                    proto: v,
                                    target: c,
                                    ctrArgs: {scope: a, group: d}
                                }]
                        });
                        e.publish(l.EVENTS.ON_BUILD_BLOCK_INFO_LIST, {items: f, group: "Flow"});
                        return f
                    };
                    e._getLoopBlocks = function (a, b, c, d) {
                        var f = [];
                        f.push({
                            name: "Loops",
                            iconClass: "el-icon-repeat",
                            items: [{
                                name: "While",
                                owner: b,
                                iconClass: "el-icon-repeat",
                                proto: h,
                                target: c,
                                ctrArgs: {scope: a, group: d, condition: "[Volume]\x3c\x3d100"}
                            }, {
                                name: "For",
                                owner: b,
                                iconClass: "el-icon-repeat",
                                proto: m,
                                target: c,
                                ctrArgs: {
                                    scope: a,
                                    group: d,
                                    initial: "1",
                                    comparator: "\x3c\x3d",
                                    "final": "5",
                                    modifier: "+1",
                                    counterName: "value"
                                }
                            }]
                        });
                        e.publish(l.EVENTS.ON_BUILD_BLOCK_INFO_LIST, {items: f, group: "Loops"});
                        return f
                    };
                    e._getMathBlocks = function (a, b, c, d) {
                        b = [];
                        b.push({
                            name: "Math",
                            owner: this,
                            iconClass: "el-icon-qrcode",
                            dstItem: c,
                            items: [{
                                name: "If...Else",
                                owner: c,
                                iconClass: "el-icon-compass",
                                proto: w,
                                item: c,
                                ctrArgs: {scope: a, group: d}
                            }]
                        });
                        return b
                    };
                    e._getTimeBlocks = function (a, b, c, d) {
                        b =
                            [];
                        b.push({
                            name: "Time",
                            owner: this,
                            iconClass: "el-icon-qrcode",
                            dstItem: c,
                            items: [{
                                name: "If...Else",
                                owner: c,
                                iconClass: "el-icon-time",
                                proto: w,
                                item: c,
                                ctrArgs: {scope: a, group: d}
                            }]
                        });
                        return b
                    };
                    e._getTransformBlocks = function (a, b, c, d) {
                        b = [];
                        b.push({
                            name: "Time",
                            owner: this,
                            iconClass: "el-icon-magic",
                            dstItem: c,
                            items: [{
                                name: "If...Else",
                                owner: c,
                                iconClass: "el-icon-time",
                                proto: w,
                                item: c,
                                ctrArgs: {scope: a, group: d}
                            }]
                        });
                        return b
                    };
                    return e
                })
        }, "xblox/model/logic/CaseBlock": function () {
            define(["dcl/dcl", "xide/utils", "xblox/model/Block",
                "dojo/Deferred", "xblox/model/logic/BreakBlock"], function (e, p, l, n, d) {
                return e(l, {
                    declaredClass: "xblox.model.logic.CaseBlock",
                    comparator: null,
                    expression: null,
                    items: null,
                    name: "Case",
                    icon: "",
                    hasInlineEdits: !0,
                    toText: function () {
                        return '\x3cspan style\x3d"text-indent: 1em;"\x3e\x26nbsp;\x26nbsp;\x26nbsp;' + this.getBlockIcon("I") + this.name + " " + this.makeEditable("comparator", "right", "text", "Enter a comparison", "inline") + (null != this.expression ? " " + this.makeEditable("expression", "right", "text", "Enter a value to compare") :
                                "") + "\x3c/span\x3e"
                    },
                    canAdd: function () {
                        return []
                    },
                    _solve: function (b, a, d) {
                        a = a || {highlight: !1};
                        for (var c = [], g = 0; g < this.items.length; g++) {
                            var e = this.items[g];
                            -1 !== e.declaredClass.indexOf("BreakBlock") && d.stop();
                            this.addToEnd(c, e.solve(b, a))
                        }
                        return c
                    },
                    solve: function (b, a, d) {
                        try {
                            var c = b.getVariableById(a.variable);
                            !c && d.args && d.args[0] && (c = {value: d.args[0]});
                            var g = "";
                            if (c)g = this._getArg(c.value, !0); else return this.onFailed(this, d), !1;
                            if (!0 !== b.parseExpression("" + g + "" + this.comparator + this._getArg(this.expression,
                                        !0)))return this.onFailed(this, d), !1;
                            this.onSuccess(this, d);
                            this._solve(b, d, a);
                            return !0
                        } catch (e) {
                            logError(e)
                        }
                    },
                    getChildren: function () {
                        return this.items
                    },
                    getFields: function () {
                        function b(a, b) {
                            return {label: b || a, value: a}
                        }

                        var a = this.inherited(arguments) || this.getDefaultFields();
                        a.push(p.createCI("Expression", 13, this.expression, {
                            group: "General",
                            title: "Expression",
                            dst: "expression"
                        }));
                        a.push(p.createCI("Comparator", 3, this.comparator, {
                            group: "General", title: "Comparator", dst: "comparator", widget: {
                                options: [b("\x3d\x3d"),
                                    b("\x3c\x3d"), b("\x3d\x3e"), b("!\x3d"), b("\x3c"), b("\x3e")], editable: !0
                            }
                        }));
                        return a
                    },
                    runAction: function (b) {
                        if ("New/Break" === b.command) {
                            b = new n;
                            var a = this.add(d, {group: null});
                            b.resolve({select: [a], focus: !0, append: !1});
                            a.refresh();
                            return b
                        }
                    },
                    getActions: function () {
                        return [this.createAction({
                            label: "Break",
                            command: "New/Break",
                            tab: "Home",
                            icon: "fa-stop",
                            group: "File",
                            mixin: {addPermission: !0, custom: !0, quick: !1}
                        })]
                    }
                })
            })
        }, "xblox/model/logic/BreakBlock": function () {
            define(["dcl/dcl", "xblox/model/Block"], function (e,
                                                               p) {
                return e(p, {
                    declaredClass: "xblox.model.logic.BreakBlock",
                    name: "Break",
                    icon: "fa-stop",
                    hasInlineEdits: !1,
                    canAdd: !1,
                    toText: function () {
                        return '\x26nbsp;\x3cspan class\x3d"fa-stop text-warning"\x3e\x3c/span\x3e\x26nbsp;\x26nbsp;\x3cspan\x3e' + this.name + "\x3c/span\x3e"
                    },
                    solve: function (e, n) {
                        this.onSuccess(this, n)
                    }
                })
            })
        }, "xblox/model/functions/CallBlock": function () {
            define("dcl/dcl xide/utils xide/types dojo/Deferred xblox/model/Block xcf/model/Command".split(" "), function (e, p, l, n, d, b) {
                return e(b, {
                    declaredClass: "xblox.model.functions.CallBlock",
                    command: "Select command please",
                    icon: "",
                    args: null,
                    _timeout: 100,
                    isCommand: !0,
                    _commandHandles: null,
                    onCommandProgress: function (a) {
                        this.getScope().getContext();
                        var b = a.params;
                        b && b.id && (this._emit("cmd:" + a.cmd + "_" + b.id, {msg: a}), a.lastResponse && this.storeResult(a.lastResponse), this._emit("progress", {
                            msg: a,
                            id: b.id
                        }));
                        this._lastResult = null;
                        this._lastResult = a ? a.result : null;
                        a = this.getItems(l.BLOCK_OUTLET.PROGRESS);
                        this._lastSettings || (this._lastSettings = {});
                        this._lastSettings.override = {};
                        a.length && this.runFrom(a,
                            0, this._lastSettings)
                    },
                    stop: function () {
                        this._lastCommand && this._lastCommand.stop()
                    },
                    pause: function () {
                        this._lastCommand && this._lastCommand.pause()
                    },
                    destroy: function () {
                        _.invoke(this._commandHandles, "remove");
                        delete this._commandHandles;
                        delete this._lastCommand
                    },
                    solve: function (a, b) {
                        this._commandHandles && _.invoke(this._commandHandles, "remove");
                        this._commandHandles = [];
                        var c = this._timeout || 50;
                        _.isString(c) && (c = parseInt(c));
                        var d = new n, e = this._commandHandles;
                        b = b || {};
                        setTimeout(function () {
                            if (this.command) {
                                var c =
                                    null;
                                if (this.args) {
                                    b.override = b.override || {};
                                    var k = a.expressionModel.replaceVariables(a, this.args, !1, !1, null, null, {
                                        begin: "%%",
                                        end: "%%"
                                    });
                                    try {
                                        c = p.fromJson(k)
                                    } catch (m) {
                                        c = k
                                    }
                                    b.override.args = _.isArray(c) ? c : [k];
                                    b.override.mixin = c
                                }
                                if (this._lastCommand = a.resolveBlock(this.command))e.push(this._lastCommand._on("paused", this.onCommandPaused, this)), e.push(this._lastCommand._on("finished", this.onCommandFinish, this)), e.push(this._lastCommand._on("stopped", this.onCommandStopped, this)), e.push(this._lastCommand._on("error",
                                    this.onCommandError, this)), e.push(this._lastCommand._on("progress", this.onCommandProgress, this));
                                if (c = a.solveBlock(this.command, b))this.onSuccess(this, b); else this.onFailed(this, b);
                                d.resolve(c);
                                return c
                            }
                        }.bind(this), c);
                        return d
                    },
                    hasInlineEdits: !0,
                    makeEditable: function (a, b, c, d, e, n, k) {
                        return '\x3ca   tabIndex\x3d"-1" pos\x3d\'' + b + "' display-mode\x3d'" + (e || "popup") + "' display-type\x3d'" + (c || "text") + "' data-prop\x3d'" + a + "' data-title\x3d'" + d + "' class\x3d'editable editable-click'  href\x3d'#'\x3e" + this[a] +
                            "\x3c/a\x3e"
                    },
                    getFieldOptions: function (a) {
                        if ("command" === a)return this.scope.getCommandsAsOptions("text")
                    },
                    toText: function () {
                        var a = "Unknown", b = this.scope.getBlock(this.command);
                        b && (a = b.name);
                        -1 !== this.command.indexOf("://") && (a = '\x3cspan class\x3d"text-info"\x3e' + this.scope.toFriendlyName(this, this.command) + "\x3c/span\x3e");
                        return this.getBlockIcon("D") + "Call Command : " + a
                    },
                    getFields: function () {
                        var a = this.getDefaultFields();
                        this.command.indexOf("://") && this.scope.toFriendlyName(this, this.command);
                        a.push(p.createCI("value", "xcf.widgets.CommandPicker", this.command, {
                            group: "General",
                            title: "Command",
                            dst: "command",
                            options: this.scope.getCommandsAsOptions(),
                            block: this,
                            pickerType: "command",
                            value: this.command
                        }));
                        a.push(p.createCI("arguments", 27, this.args, {
                            group: "Arguments",
                            title: "Arguments",
                            dst: "args"
                        }));
                        a.push(p.createCI("timeout", 13, this._timeout, {
                            group: "General",
                            title: "Delay",
                            dst: "_timeout"
                        }));
                        return a
                    }
                })
            })
        }, "xcf/model/Command": function () {
            define("dcl/dcl xblox/model/Block xblox/model/Contains xide/utils xide/types dojo/Deferred xblox/types/Types xide/lodash".split(" "),
                function (e, p, l, n, d, b, a, f) {
                    return e([p, l], {
                        declaredClass: "xcf.model.Command",
                        startup: !1,
                        auto: null,
                        send: "",
                        name: "No Title",
                        observed: ["send"],
                        interval: 0,
                        flags: 2048,
                        _runningDfd: null,
                        __started: !1,
                        isCommand: !0,
                        getItems: function (a) {
                            return this.getItemsByType(a)
                        },
                        onCommandFinish: function (a) {
                            var b = null;
                            if (a.params && a.params.id) {
                                var f = a.params.id, b = this.getDeferred(f);
                                delete this._solving[f];
                                a.lastResponse && this.storeResult(a.lastResponse);
                                this._emit("finished", {msg: a, result: this._lastResult})
                            }
                            a = this.getItems(d.BLOCK_OUTLET.FINISH);
                            a.length && this.runFrom(a, 0, this._lastSettings);
                            this.resolve({});
                            this.onSuccess(this, this._lastSettings);
                            b && b.resolve(this._lastResult)
                        },
                        onCommandPaused: function (a) {
                            var b = a.params;
                            b && b.id && (a.lastResponse && this.storeResult(a.lastResponse), this._emit("paused", {
                                msg: a,
                                result: this._lastResult,
                                id: b.id
                            }));
                            a = this.getItems(d.BLOCK_OUTLET.PAUSED);
                            a.length && this.runFrom(a, 0, this._lastSettings)
                        },
                        onCommandStopped: function (a) {
                            this.reset();
                            var b = a.params;
                            b && b.id && this._emit("stopped", {
                                msg: a, result: this._lastResult,
                                id: b.id
                            });
                            a = this.getItems(d.BLOCK_OUTLET.STOPPED);
                            a.length && this.runFrom(a, 0, this._lastSettings)
                        },
                        onCommandProgress: function (a) {
                            var b = a.params;
                            b && b.id && (a.lastResponse && this.storeResult(a.lastResponse), this._emit("progress", {
                                msg: a,
                                result: this._lastResult,
                                id: b.id
                            }));
                            a = this.getItems(d.BLOCK_OUTLET.PROGRESS);
                            a.length && this.runFrom(a, 0, this._lastSettings)
                        },
                        storeResult: function (a) {
                            var b = n.getJson(a);
                            a = null;
                            if (b && b.result && f.isString(b.result)) {
                                var d = b.result, e = -1 !== d.indexOf("{") || -1 !== d.indexOf("["),
                                    b = d;
                                e && (d = n.getJson(d, !0, !1)) && (b = d);
                                this._lastResult = null !== b ? a = b : null
                            }
                            return a
                        },
                        resolve: function (a) {
                            a = a || this._lastResult;
                            this._runningDfd && this._runningDfd.resolve(a)
                        },
                        onCommandError: function (a) {
                            var b = a.params;
                            b.id && (a.lastResponse && this.storeResult(a.lastResponse), this._emit("cmd:" + a.cmd + "_" + b.id, a), this._emit("error", {
                                msg: a,
                                result: this._lastResult,
                                id: b.id
                            }));
                            this.onFailed(this, this._settings);
                            a = this.getItems(d.BLOCK_OUTLET.ERROR);
                            a.length && this.runFrom(a, 0, this._lastSettings)
                        },
                        sendToDevice: function (a,
                                                b, f, e, k) {
                            if (!this._destroyed) {
                                a = this.replaceAll("'", "", a);
                                k = k || n.createUUID();
                                var m = this, h = this.flags & d.CIFLAG.WAIT ? !0 : !1;
                                this.lastCommand = "" + a;
                                if (this.scope.instance)h && this._on("cmd:" + a + "_" + k, function (a) {
                                    if (a.error)m.onFailed(m, b); else m.onSuccess(m, b)
                                }), this.scope.instance.sendMessage(a, null, this.id, k, h, f, e); else return this.publish(d.EVENTS.ON_STATUS_MESSAGE, {
                                    text: "Command " + this.name + " : have no device",
                                    type: "error",
                                    delay: 1E3
                                }), !1;
                                return k
                            }
                        },
                        reset: function () {
                            delete this._runningDfd;
                            this._lastSettings =
                            {};
                            this._loop && (clearTimeout(this._loop), this._loop = null);
                            delete this.override;
                            this.override = null;
                            delete this._lastResult;
                            this.override = null;
                            this.override = {}
                        },
                        _solving: null,
                        addDeferred: function (a) {
                            this._solving || (this._solving = {});
                            this._solving[a] = new b;
                            return this._solving[a]
                        },
                        getDeferred: function (a) {
                            this._solving || (this._solving = {});
                            return this._solving[a]
                        },
                        _resolve: function (a, b, e) {
                            if (f.isNumber(a) || f.isBoolean(a))return a;
                            var l = this.scope;
                            a = a || this._get("send");
                            b = b || {};
                            var k = b.flags || this.flags,
                                m = !(k & d.CIFLAG.DONT_PARSE), h = k & d.CIFLAG.EXPRESSION;
                            k & d.CIFLAG.TO_HEX && (a = n.to_hex(a));
                            !1 !== m && (a = n.convertAllEscapes(a, "none"));
                            b = b || this._lastSettings || {};
                            if (k = (b = b.override || this.override || {}, b.variables) ? b.variables : null)for (var p in k)f.isNumber(k[p]) && (k[p] = Math.round(k[p]));
                            p = "";
                            var w = this.getDriverModule();
                            w && w.resolveBefore && !1 !== e && (a = w.resolveBefore(this, a) || a);
                            p = h && !1 !== m ? l.parseExpression(a, null, k, null, null, null, b.args) : "" + a;
                            w && w.resolveAfter && !1 !== e && (p = w.resolveAfter(this, p) || p);
                            return p
                        },
                        solve: function (a, b, f, e) {
                            var k = null;
                            a = a || this.scope;
                            (b = this._lastSettings = b || this._lastSettings || {}, b.override) && b.override.mixin && n.mixin(this.override, b.override.mixin);
                            var m = e || this._get("send") || this.send, h = !(this.flags & d.CIFLAG.DONT_PARSE);
                            e = this.flags & d.CIFLAG.WAIT ? !0 : !1;
                            var l = n.createUUID();
                            this.flags & d.CIFLAG.TO_HEX && (m = n.to_hex(m));
                            !1 !== h && (m = n.convertAllEscapes(m, "none"));
                            if (this.enabled || !0 === f) {
                                !0 === f && this._loop && this.reset();
                                if (!0 !== e)this.onRun(this, b); else this.onRun(this, b, {timeout: !1}),
                                    k = this.addDeferred(l);
                                if (this.items && 0 < this.items.length) {
                                    if (m && 0 < m.length && (m = this._resolve(this.send, b)) && 0 < m.length)if (this.sendToDevice(m, b))this.onSuccess(this, b); else this.onFailed(this, b);
                                    if (e)return k;
                                    f = [];
                                    for (k = 0; k < this.items.length; k++)e = this.items[k], e.enabled && f.push(e.solve(a, b));
                                    return f
                                }
                                if (0 < m.length) {
                                    if ((m = this._resolve(this.send, b)) && 0 < m.length && !this.sendToDevice(m, b, null, null, l))this.onFailed(this, b);
                                    if (!0 !== e)this.onSuccess(this, b); else this._settings = b;
                                    f && this.auto && 0 < this.getInterval() &&
                                    this.scope.loopBlock(this, b);
                                    return e ? k : [m]
                                }
                                return !1
                            }
                            this.reset()
                        },
                        canAdd: function () {
                            return []
                        },
                        mayHaveChildren: function () {
                            return null != this.items && 0 < this.items.length
                        },
                        getChildren: function () {
                            return this.items
                        },
                        hasInlineEdits: !0,
                        toText: function (a, b, d, f) {
                            var e = "";
                            !1 !== a && (e += "\x3cspan class\x3d'text-primary inline-icon'\x3e" + this.getBlockIcon() + "\x3c/span\x3e");
                            !1 !== b && (e += "" + this.makeEditable("name", "bottom", "text", "Enter a unique name", "inline") + "");
                            !0 === f && (e += "\x3cbr/\x3e");
                            !1 !== d && (e += "\x3cspan class\x3d'text-muted small'\x3e Send:\x3ckbd class\x3d'text-warning'\x3e" +
                                this.makeEditable("send", "bottom", "text", "Enter the string to send", "inline") + "\x3c/kbd\x3e\x3c/span\x3e");
                            !1 !== a && (this.startup && (e += this.getIcon("fa-bell inline-icon text-warning", "text-align:right;float:right;", "")), this.auto && 0 < this.getInterval() && (e += this.getIcon("fa-clock-o inline-icon text-warning", "text-align:right;float:right", "")));
                            return e = this.getDriverToText(e) || e
                        },
                        getInterval: function () {
                            return parseInt(this.interval, 10)
                        },
                        start: function () {
                            this.startup && !this.auto ? this.solve(this.scope) :
                            this.auto && 0 < this.getInterval() && this.scope.loopBlock(this)
                        },
                        getDriverModule: function () {
                            var a = null, b = this.getInstance();
                            b ? a = b.Module : (b = this.getScope().driver) && b.Module && (a = b.Module);
                            return a
                        },
                        getDriverToText: function (a) {
                            var b = this.getDriverModule();
                            if (b && b.toText)return b.toText(this, a)
                        },
                        getDriverFields: function (a) {
                            var b = this.getDriverModule(), d = [];
                            b && b.getFields && (d = b.getFields(this, a) || []);
                            return d
                        },
                        getFields: function () {
                            var a = this.inherited(arguments) || this.getDefaultFields(), b = this;
                            a.push(this.utils.createCI("name",
                                13, this.name, {group: "General", title: "Name", dst: "name", order: 200}));
                            a.push(this.utils.createCI("startup", 0, this.startup, {
                                group: "General",
                                title: "Send on Startup",
                                dst: "startup",
                                order: 199
                            }));
                            a.push(this.utils.createCI("auto", 0, this.auto, {
                                group: "General",
                                title: "Auto Send",
                                dst: "auto",
                                order: 198
                            }));
                            a.push(this.utils.createCI("interval", 13, this.interval, {
                                group: "General",
                                title: "Interval",
                                dst: "interval",
                                order: 197
                            }));
                            a.push(this.utils.createCI("send", d.ECIType.EXPRESSION_EDITOR, this.send, {
                                group: "Send",
                                title: "Send",
                                dst: "send",
                                widget: {
                                    instantChanges: !1,
                                    allowACECache: !0,
                                    showBrowser: !1,
                                    showSaveButton: !0,
                                    style: "height:inherit;",
                                    editorOptions: {showGutter: !1, autoFocus: !1},
                                    aceOptions: {hasEmmet: !1, hasLinking: !1, hasMultiDocs: !1},
                                    item: this
                                },
                                delegate: {
                                    runExpression: function (a, c, d) {
                                        return b.scope.expressionModel.parse(b.scope, a, !1, c, d)
                                    }
                                }
                            }));
                            a.push(this.utils.createCI("flags", 5, this.flags, {
                                group: "General",
                                title: "Flags",
                                dst: "flags",
                                data: [{
                                    value: 4096,
                                    label: "Dont parse",
                                    title: "Do not parse the string and use it as is"
                                }, {
                                    value: 2048,
                                    label: "Expression", title: "Parse it as Javascript"
                                }, {value: 32768, label: "Wait", title: "Wait for response"}],
                                widget: {hex: !0}
                            }));
                            return a = a.concat(this.getDriverFields(a))
                        },
                        icon: "fa-exclamation",
                        getIconClass: function () {
                            return "el-icon-play-circle"
                        },
                        getBlockIcon: function () {
                            return '\x3cspan class\x3d"' + this.icon + '"\x3e\x3c/span\x3e '
                        },
                        canEdit: function () {
                            return !0
                        },
                        onChangeField: function (a, b, d) {
                            var f = this.getInterval();
                            "auto" == a && (!0 === b ? 0 < f && this.scope.loopBlock(this) : this._loop && this.reset());
                            "enabled" == a &&
                            (!1 === b ? this.reset() : f && this.scope.loopBlock(this));
                            "interval" == a && (0 < f && this.auto ? this.scope.loopBlock(this) : this.reset());
                            this.inherited(arguments)
                        },
                        destroy: function () {
                            this.reset()
                        },
                        pause: function () {
                            var a = this.lastCommand || this._resolve(this.send, this._lastSettings);
                            null !== a && this.sendToDevice(a, this._lastSettings, !1, !0)
                        },
                        stop: function (a) {
                            !0 !== a && (this.onSuccess(this, {highlight: !0}), this.resolve(""), a = this.lastCommand || this._resolve(this.send, this._lastSettings), f.isEmpty(a) || this.sendToDevice(a,
                                this._lastSettings, !0, !1), delete this._runningDfd)
                        }
                    })
                })
        }, "xblox/model/Contains": function () {
            define(["dcl/dcl", "dojo/promise/all", "xide/types"], function (e, p, l) {
                return e(null, {
                    declaredClass: "xblox.model.Contains", runByType: function (e, d) {
                        var b = this.getItemsByType(e);
                        b.length && this.runFrom(b, 0, d)
                    }, getItemsByType: function (e) {
                        var d = this.items;
                        if (!e)return d;
                        var b = [];
                        _.each(d, function (a) {
                            a.outlet & e && b.push(a)
                        });
                        return b
                    }, getContainer: function () {
                        return this[this._getContainer()]
                    }, mayHaveChildren: function (e) {
                        e =
                            this[this._getContainer()];
                        return null != e && 0 < e.length
                    }, getChildren: function (e) {
                        return this[this._getContainer()]
                    }, canAdd: function () {
                        return []
                    }, runFrom: function (e, d, b) {
                        var a = this, f = e || this.items;
                        e = [];
                        var c = function (c) {
                            c._deferredObject.then(function (d) {
                                console.log("----def block finish");
                                c._lastResult = c._lastResult || d;
                                a._currentIndex++;
                                a.runFrom(f, a._currentIndex, b)
                            })
                        };
                        if (f.length)for (; d < f.length; d++) {
                            var g = f[d];
                            if (!0 === g.deferred && g.enabled) {
                                g._deferredObject = new Deferred;
                                this._currentIndex = d;
                                c(g);
                                var l = g.solve(this.scope, b);
                                e.push(l);
                                break
                            } else g.enabled && (l = g.solve(this.scope, b), e.push(l), g.onDidRun())
                        } else this.onSuccess(this, b);
                        this._lastSettings && delete this._lastSettings.override;
                        return e
                    }, _solve: function (e, d, b, a) {
                        !this._lastRunSettings && d && (this._lastRunSettings = d);
                        d = this._lastRunSettings || d;
                        this._currentIndex = 0;
                        this._return = [];
                        e = this[this._getContainer()];
                        if (e.length)return e = this.runFrom(e, 0, d), this.onSuccess(this, d), e;
                        this.onSuccess(this, d);
                        return []
                    }, onDidRunItem: function (e, d, b) {
                        this._emit(l.EVENTS.ON_RUN_BLOCK_SUCCESS,
                            this);
                        e.resolve(d)
                    }, onDidRunItemError: function (e, d, b) {
                        e.reject(d)
                    }, onRunThis: function (e) {
                        this._emit(l.EVENTS.ON_RUN_BLOCK, this)
                    }, onDidRunThis: function (e, d, b, a) {
                        var f = this;
                        if (b && b.length)b = f.runFrom(b, 0, a), p(b).then(function (b) {
                            f.onDidRunItem(e, d, a)
                        }, function (b) {
                            console.error("error in chain", b);
                            f.onDidRunItem(e, b, a)
                        }); else f.onDidRunItem(e, d, a)
                    }, ___solve: function (e, d, b, a) {
                    }
                })
            })
        }, "xblox/types/Types": function () {
            define(["xide/types/Types", "xide/utils"], function (e, p) {
                e.BLOCK_MODE = {NORMAL: 0, UPDATE_WIDGET_PROPERTY: 1};
                e.BLOCK_OUTLET = {NONE: 0, PROGRESS: 1, ERROR: 2, PAUSED: 4, FINISH: 8, STOPPED: 16};
                p.mixin(e.EVENTS, {
                    ON_RUN_BLOCK: "onRunBlock",
                    ON_RUN_BLOCK_FAILED: "onRunBlockFailed",
                    ON_RUN_BLOCK_SUCCESS: "onRunBlockSuccess",
                    ON_BLOCK_SELECTED: "onItemSelected",
                    ON_BLOCK_UNSELECTED: "onBlockUnSelected",
                    ON_BLOCK_EXPRESSION_FAILED: "onExpressionFailed",
                    ON_BUILD_BLOCK_INFO_LIST: "onBuildBlockInfoList",
                    ON_BUILD_BLOCK_INFO_LIST_END: "onBuildBlockInfoListEnd",
                    ON_BLOCK_PROPERTY_CHANGED: "onBlockPropertyChanged",
                    ON_SCOPE_CREATED: "onScopeCreated",
                    ON_VARIABLE_CHANGED: "onVariableChanged",
                    ON_CREATE_VARIABLE_CI: "onCreateVariableCI"
                });
                e.BlockType = {
                    AssignmentExpression: "AssignmentExpression",
                    ArrayExpression: "ArrayExpression",
                    BlockStatement: "BlockStatement",
                    BinaryExpression: "BinaryExpression",
                    BreakStatement: "BreakStatement",
                    CallExpression: "CallExpression",
                    CatchClause: "CatchClause",
                    ConditionalExpression: "ConditionalExpression",
                    ContinueStatement: "ContinueStatement",
                    DoWhileStatement: "DoWhileStatement",
                    DebuggerStatement: "DebuggerStatement",
                    EmptyStatement: "EmptyStatement",
                    ExpressionStatement: "ExpressionStatement",
                    ForStatement: "ForStatement",
                    ForInStatement: "ForInStatement",
                    FunctionDeclaration: "FunctionDeclaration",
                    FunctionExpression: "FunctionExpression",
                    Identifier: "Identifier",
                    IfStatement: "IfStatement",
                    Literal: "Literal",
                    LabeledStatement: "LabeledStatement",
                    LogicalExpression: "LogicalExpression",
                    MemberExpression: "MemberExpression",
                    NewExpression: "NewExpression",
                    ObjectExpression: "ObjectExpression",
                    Program: "Program",
                    Property: "Property",
                    ReturnStatement: "ReturnStatement",
                    SequenceExpression: "SequenceExpression",
                    SwitchStatement: "SwitchStatement",
                    SwitchCase: "SwitchCase",
                    ThisExpression: "ThisExpression",
                    ThrowStatement: "ThrowStatement",
                    TryStatement: "TryStatement",
                    UnaryExpression: "UnaryExpression",
                    UpdateExpression: "UpdateExpression",
                    VariableDeclaration: "VariableDeclaration",
                    VariableDeclarator: "VariableDeclarator",
                    WhileStatement: "WhileStatement",
                    WithStatement: "WithStatement"
                };
                return e
            })
        }, "xblox/model/functions/StopBlock": function () {
            define(["dcl/dcl", "xide/utils", "xblox/model/Block"], function (e, p, l) {
                return e(l,
                    {
                        declaredClass: "xblox.model.functions.StopBlock",
                        command: "Select command please",
                        icon: "",
                        args: null,
                        _timeout: 100,
                        hasInlineEdits: !0,
                        solve: function (e, d) {
                            if (this.command) {
                                var b = e.resolveBlock(this.command);
                                if (b && b.stop) {
                                    var a = b.stop();
                                    this.onSuccess(this, d)
                                } else this.onFailed(this, d);
                                return a
                            }
                        },
                        makeEditable: function (e, d, b, a, f) {
                            return '\x3ca tabIndex\x3d"-1" pos\x3d\'' + d + "' display-mode\x3d'" + (f || "popup") + "' display-type\x3d'" + (b || "text") + "' data-prop\x3d'" + e + "' data-title\x3d'" + a + "' class\x3d'editable editable-click'  href\x3d'#'\x3e" +
                                this[e] + "\x3c/a\x3e"
                        },
                        getFieldOptions: function (e) {
                            if ("command" === e)return this.scope.getCommandsAsOptions("text")
                        },
                        toText: function () {
                            var e = "Unknown", d = this.scope.getBlock(this.command);
                            d && (e = d.name);
                            -1 !== this.command.indexOf("://") && (e = '\x3cspan class\x3d"text-info"\x3e' + this.scope.toFriendlyName(this, this.command) + "\x3c/span\x3e");
                            return this.getBlockIcon("D") + "Stop Command : " + e
                        },
                        onChangeField: function (e, d) {
                        },
                        getFields: function () {
                            var e = this.inherited(arguments) || this.getDefaultFields();
                            e.push(p.createCI("value",
                                "xcf.widgets.CommandPicker", this.command, {
                                    group: "General",
                                    title: "Command",
                                    dst: "command",
                                    options: this.scope.getCommandsAsOptions(),
                                    block: this,
                                    pickerType: "command",
                                    value: this.command
                                }));
                            return e
                        }
                    })
            })
        }, "xblox/model/functions/PauseBlock": function () {
            define(["dcl/dcl", "xide/utils", "xide/types", "dojo/Deferred", "xblox/model/Block"], function (e, p, l, n, d) {
                return e(d, {
                    declaredClass: "xblox.model.functions.PauseBlock",
                    command: "Select command please",
                    icon: "",
                    args: null,
                    _timeout: 100,
                    hasInlineEdits: !0,
                    solve: function (b,
                                     a) {
                        if (this.command) {
                            var d = b.resolveBlock(this.command);
                            if (d && d.pause) {
                                var c = d.pause();
                                this.onSuccess(this, a)
                            } else this.onFailed(this, a);
                            return c
                        }
                    },
                    makeEditable: function (b, a, d, c, e, n, l) {
                        return '\x3ca   tabIndex\x3d"-1" pos\x3d\'' + a + "' display-mode\x3d'" + (e || "popup") + "' display-type\x3d'" + (d || "text") + "' data-prop\x3d'" + b + "' data-title\x3d'" + c + "' class\x3d'editable editable-click'  href\x3d'#'\x3e" + this[b] + "\x3c/a\x3e"
                    },
                    getFieldOptions: function (b) {
                        if ("command" === b)return this.scope.getCommandsAsOptions("text")
                    },
                    toText: function () {
                        var b = "Unknown", a = this.scope.getBlock(this.command);
                        a && (b = a.name);
                        -1 !== this.command.indexOf("://") && (b = '\x3cspan class\x3d"text-info"\x3e' + this.scope.toFriendlyName(this, this.command) + "\x3c/span\x3e");
                        return this.getBlockIcon("D") + "Pause Command : " + b
                    },
                    getFields: function () {
                        var b = this.inherited(arguments) || this.getDefaultFields();
                        this.command.indexOf("://") && this.scope.toFriendlyName(this, this.command);
                        b.push(p.createCI("value", "xcf.widgets.CommandPicker", this.command, {
                            group: "General",
                            title: "Command",
                            dst: "command",
                            options: this.scope.getCommandsAsOptions(),
                            block: this,
                            pickerType: "command",
                            value: this.command
                        }));
                        return b
                    }
                })
            })
        }, "xblox/model/functions/SetProperties": function () {
            define("dcl/dcl xide/utils xide/types dojo/Deferred xblox/model/Block xide/lodash".split(" "), function (e, p, l, n, d, b) {
                return e(d, {
                    declaredClass: "xblox.model.functions.SetProperties",
                    command: "Select block",
                    icon: "",
                    args: null,
                    _timeout: 100,
                    hasInlineEdits: !1,
                    solve: function (a, b) {
                        var c = new n;
                        if (this.command) {
                            var d = a.resolveBlock(this.command);
                            if (d && this.props) {
                                for (var e in this.props)d.set(e, this.props[e]), d[e] = this.props[e], d.onChangeField && d.onChangeField(e, this.props[e]);
                                this.onSuccess(this, b)
                            } else this.onFailed(this, b);
                            c.resolve([])
                        }
                        return c
                    },
                    makeEditable: function (a, b, c, d, e) {
                        return '\x3ca   tabIndex\x3d"-1" pos\x3d\'' + b + "' display-mode\x3d'" + (e || "popup") + "' display-type\x3d'" + (c || "text") + "' data-prop\x3d'" + a + "' data-title\x3d'" + d + "' class\x3d'editable editable-click'  href\x3d'#'\x3e" + this[a] + "\x3c/a\x3e"
                    },
                    getFieldOptions: function (a) {
                        if ("command" ===
                            a)return this.scope.getCommandsAsOptions("text")
                    },
                    toText: function () {
                        var a = "Unknown", b = this.scope.getBlock(this.command);
                        b && (a = b.name);
                        -1 !== this.command.indexOf("://") && (a = '\x3cspan class\x3d"text-info"\x3e' + this.scope.toFriendlyName(this, this.command) + "\x3c/span\x3e");
                        return this.getBlockIcon("D") + "Set Properties : " + a
                    },
                    serializeObject: function (a) {
                        return "props" === a
                    },
                    onChangeField: function (a) {
                        "command" === a && (delete this.props, this.props = {})
                    },
                    init: function () {
                        this.props && b.isString(this.props) && (this.props =
                            p.fromJson(this.props))
                    },
                    getFields: function () {
                        var a = this.inherited(arguments) || this.getDefaultFields();
                        a.push(p.createCI("value", "xcf.widgets.CommandPicker", this.command, {
                            group: "General",
                            title: "Command",
                            dst: "command",
                            options: this.scope.getCommandsAsOptions(),
                            block: this,
                            pickerType: "command",
                            value: this.command
                        }));
                        var d = this.scope.resolveBlock(this.command);
                        if (d && d.getFields) {
                            this.props || (this.props = {});
                            var d = d.getFields(), c = b.find(d, {dst: "description"});
                            d.remove(c);
                            b.each(d, function (a) {
                                a.group = "Properties";
                                a.value = p.getAt(this.props, a.dst, a.value);
                                a.dst = "props." + a.dst
                            }, this);
                            a = a.concat(d)
                        }
                        return a
                    }
                })
            })
        }, "xblox/model/code/CallMethod": function () {
            define(["dcl/dcl", "xblox/model/Block", "xide/utils"], function (e, p, l) {
                return e(p, {
                    declaredClass: "xblox.model.code.CallMethod",
                    name: "Call Method",
                    method: "",
                    args: "",
                    sharable: !0,
                    solve: function (e, d) {
                        var b = this.getContext();
                        if (b && null != b[this.method]) {
                            var a = [], f = b[this.method];
                            try {
                                var c = this.getArgs(d);
                                console.log("args", c);
                                a = f.apply(b, c || []);
                                this.onSuccess(this, d);
                                return a
                            } catch (g) {
                                console.error("call method " + this.method + " failed: " + g), logError(g), this.onFailed(this, d)
                            }
                        } else this.onFailed(this, d);
                        return []
                    },
                    toText: function () {
                        var e = this.getBlockIcon() + " " + this.name + " ";
                        this.method && (e += this.makeEditable("method", "bottom", "text", "Enter a driver method", "inline"));
                        return e
                    },
                    getFields: function () {
                        var e = this.getDefaultFields();
                        this.getContext();
                        e.push(l.createCI("value", 13, this.method, {
                            group: "General",
                            title: "Method",
                            dst: "method"
                        }));
                        e.push(l.createCI("value", 27, this.args,
                            {group: "Arguments", dst: "args", widget: {title: ""}}));
                        return e
                    },
                    getBlockIcon: function () {
                        return '\x3cspan class\x3d"fa-caret-square-o-right"\x3e\x3c/span\x3e'
                    }
                })
            })
        }, "xblox/model/code/RunScript": function () {
            define("dcl/dcl xdojo/has dojo/Deferred xblox/model/Block xide/utils xblox/model/Contains dojo/promise/all xide/types module".split(" "), function (e, p, l, n, d, b, a, f, c, g, r, q, k) {
                var m = "undefined" !== typeof window ? window.console : global.console;
                g && m && m.error && (m = r);
                return e([n, b], {
                    declaredClass: "xblox.model.code.RunScript",
                    name: "Run Script",
                    method: "",
                    args: "",
                    deferred: !1,
                    sharable: !0,
                    context: null,
                    icon: "fa-code",
                    observed: ["method"],
                    getContext: function () {
                        return this.context || (this.scope.getContext ? this.scope.getContext() : this)
                    },
                    solve2: function (a, b, c, d) {
                        this._currentIndex = 0;
                        this._return = [];
                        var f = "" + this._get("method"), e = this, g = this.getContext();
                        if (f && f.length) {
                            var k = function () {
                                var a = new Function("{" + f + "}"), h = e.getArgs() || [];
                                try {
                                    var k = a.apply(g, h || {});
                                    e._lastResult = k;
                                    c && c("Expression " + f + " evaluates to " + k);
                                    if ("false" !==
                                        k && !1 !== k)e.onSuccess(e, b, {result: k}); else return e.onFailed(e, b), []
                                } catch (m) {
                                    return d && d("invalid expression : \n" + f + ": " + m), e.onFailed(e, b), []
                                }
                            };
                            if (a.global)(function () {
                                window = a.global;
                                var k = e.getArgs() || [];
                                try {
                                    var m = null, m = g.runExpression ? g.runExpression(f, null, k) : (new Function("{" + f + "}")).bind(this).apply(g, k || {});
                                    e._lastResult = m;
                                    c && c("Expression " + f + " evaluates to " + m);
                                    if ("false" !== m && !1 !== m)e.onSuccess(e, b); else return e.onFailed(e, b), []
                                } catch (n) {
                                    return e._lastResult = null, d && d("invalid expression : \n" +
                                        f + ": " + n), e.onFailed(e, b), []
                                }
                            }).call(a.global); else return k()
                        } else m.error("have no script");
                        k = this[this._getContainer()];
                        if (k.length)this.runFrom(k, 0, b); else this.onSuccess(this, b);
                        this.onDidRun();
                        return []
                    },
                    solve: function (a, b, c, d, f, e) {
                        this._currentIndex = 0;
                        this._return = [];
                        b = b || {};
                        c = d || (this._get("method") ? this._get("method") : this.method);
                        if (!a.expressionModel)throw Error("na");
                        var g = this;
                        d = this.getContext();
                        var k = this[this._getContainer()], n = new l, q = g.deferred, p = a.getExpressionModel();
                        this.onRunThis(b);
                        if (!p)return m.error("scope has no expression model"), !1;
                        var r = p.replaceVariables(a, c, null, null);
                        (a = p.expressionCache[r]) || (a = p.expressionCache[r] = new Function("{" + r + "}"));
                        p = g.getArgs(b) || [];
                        try {
                            q && (d.resolve = function (a) {
                                g._deferredObject && g._deferredObject.resolve();
                                g.onDidRunThis(n, a, k, b)
                            });
                            var z = a.apply(d, p || {});
                            g._lastResult = z;
                            f && f("Expression " + c + " evaluates to " + z);
                            if (!q)g.onDidRunThis(n, z, k, b);
                            if ("false" !== z && !1 !== z)g.onSuccess(g, b); else g.onFailed(g, b)
                        } catch (C) {
                            C = C || {}, g.onDidRunItemError(n,
                                C, b), g.onFailed(g, b), e && e("invalid expression : \n" + c + ": " + C)
                        }
                        return n
                    },
                    toText: function () {
                        var a = '\x3cspan style\x3d""\x3e' + this.getBlockIcon() + " " + this.name + " :: \x3c/span\x3e";
                        this.method && (a += this.method.substr(0, 50));
                        return a
                    },
                    canAdd: function () {
                        return !0
                    },
                    getFields: function () {
                        "No Description" === this.description && (this.description = q);
                        var a = this.inherited(arguments) || this.getDefaultFields(), b = this;
                        a.push(d.createCI("name", 13, this.name, {group: "General", title: "Name", dst: "name"}));
                        a.push(d.createCI("deferred",
                            0, this.deferred, {group: "General", title: "Deferred", dst: "deferred"}));
                        a.push(d.createCI("arguments", 27, this.args, {
                            group: "Arguments",
                            title: "Arguments",
                            dst: "args"
                        }));
                        a.push(d.createCI("value", f.ECIType.EXPRESSION_EDITOR, this.method, {
                            group: "Script",
                            title: "Script",
                            dst: "method",
                            select: !0,
                            widget: {
                                allowACECache: !0,
                                showBrowser: !1,
                                showSaveButton: !0,
                                editorOptions: {showGutter: !0, autoFocus: !1},
                                item: this
                            },
                            delegate: {
                                runExpression: function (a, c, d) {
                                    b.method = a;
                                    b.solve(b.scope, null, c, d)
                                }
                            }
                        }));
                        return a
                    }
                })
            })
        }, "xblox/model/loops/ForBlock": function () {
            define("dcl/dcl xblox/model/Block xblox/model/variables/Variable xblox/model/Contains dojo/promise/all dojo/Deferred".split(" "),
                function (e, p, l, n, d, b) {
                    return e([p, n], {
                        declaredClass: "xblox.model.loops.ForBlock",
                        initial: null,
                        "final": null,
                        comparator: null,
                        modifier: null,
                        items: null,
                        counterName: null,
                        _counter: null,
                        name: "For",
                        sharable: !0,
                        icon: "",
                        ignoreErrors: !1,
                        deferred: !0,
                        _forState: !1,
                        _currentForIndex: 0,
                        runFrom: function (a, d, c) {
                            var e = this, n = a || this.items;
                            a = [];
                            var l = function (a) {
                                a._deferredObject.then(function (b) {
                                    a._lastResult = a._lastResult || b;
                                    e._currentIndex++;
                                    e.runFrom(n, e._currentIndex, c)
                                })
                            };
                            if (n.length)for (; d < n.length; d++) {
                                var k =
                                    n[d];
                                if (!1 !== k.enabled)if (!0 === k.deferred) {
                                    k._deferredObject = new b;
                                    this._currentIndex = d;
                                    l(k);
                                    a.push(k.solve(this.scope, c));
                                    break
                                } else a.push(k.solve(this.scope, c))
                            } else this.onSuccess(this, c);
                            return a
                        },
                        runFromDirect: function (a, d, c) {
                            var e = this, n = a || this.items;
                            a = [];
                            var l = function (a) {
                                a._deferredObject.then(function (b) {
                                    a._lastResult = a._lastResult || b;
                                    e._currentIndex++;
                                    e.runFrom(n, e._currentIndex, c)
                                })
                            };
                            if (n.length)for (; d < n.length; d++) {
                                var k = n[d];
                                if (!1 !== k.enabled)if (!0 === k.deferred) {
                                    k._deferredObject = new b;
                                    this._currentIndex = d;
                                    l(k);
                                    a.push(k.solve(this.scope, c));
                                    break
                                } else a.push(k.solve(this.scope, c))
                            } else this.onSuccess(this, c);
                            return a
                        },
                        solveSubs: function (a, b, c, e) {
                            var n = this;
                            e.override = e.override || {};
                            e.override.args = [this._currentForIndex];
                            if (c.length)return b = n.runFrom(c, 0, e), d(b).then(function (a) {
                            }, function (b) {
                                n.onDidRunItem(a, b, e)
                            }), b;
                            n.onDidRunItem(a, b, e)
                        },
                        solveSubsDirect: function (a, b, c, d) {
                            d.override = d.override || {};
                            d.override.args = [this._currentForIndex];
                            if (c.length)return this.runFromDirect(c,
                                0, d)
                        },
                        _solve: function (a, f) {
                            var c = new b, e = this, n = this.solveSubs(c, null, this.items, f);
                            n ? d(n).then(function (a) {
                                a = a.indexOf(!1);
                                !0 !== e.ignoreErrors && -1 !== a ? c.resolve(!1) : c.resolve(!0)
                            }) : c.resolve(!0);
                            return c
                        },
                        step: function (a, d) {
                            var c = this._checkCondition(a, d), e = new b;
                            c && this._solve(a, d).then(function (a) {
                                1 == a ? e.resolve(!0) : e.resolve(!1)
                            });
                            return e
                        },
                        loop: function (a, b) {
                            var c = this;
                            this.step(a, b).then(function (d) {
                                c._updateCounter(a);
                                c._currentForIndex = c._counter.value;
                                if (1 == d)c.loop(a, b); else c.onFailed(c,
                                    b)
                            })
                        },
                        _solveDirect: function (a, b) {
                            return this.solveSubsDirect(null, null, this.items, b)
                        },
                        stepDirect: function (a, b) {
                            return this._solveDirect(a, b)
                        },
                        loopDirect: function (a, b) {
                            this.stepDirect(a, b);
                            for (var c = parseInt(this.initial, 10); c < parseInt(this["final"], 10); c++)this.stepDirect(a, b)
                        },
                        solve: function (a, b) {
                            this._counter = new l({
                                title: this.counterName,
                                value: this.initial,
                                scope: a,
                                register: !1
                            });
                            this._forState = !0;
                            this._currentForIndex = this.initial;
                            this.deferred ? this.loop(a, b) : this.loopDirect(a, b);
                            return []
                        },
                        _checkCondition: function (a,
                                                   b) {
                            var c = a.parseExpression("" + this._counter.value + this.comparator + this["final"]);
                            if (0 != c)this.onSuccess(this, b);
                            return this._forState = c
                        },
                        _updateCounter: function (a) {
                            var b = this._counter.value, b = a.parseExpression("" + b + this.modifier);
                            if (b == this._counter.value)return !1;
                            this._counter.value = b;
                            return !0
                        },
                        mayHaveChildren: function () {
                            return null != this.items && 0 < this.items.length
                        },
                        getChildren: function () {
                            var a = [];
                            this.items && (a = a.concat(this.items));
                            return a
                        },
                        canAdd: function () {
                            return []
                        },
                        toText: function () {
                            return this.getBlockIcon("F") +
                                this.name + " " + this.initial + " " + this.comparator + " " + this["final"] + " with " + this.modifier
                        },
                        getFields: function () {
                            var a = this.inherited(arguments) || this.getDefaultFields();
                            return a = a.concat([this.utils.createCI("initial", 13, this.initial, {
                                group: "General",
                                title: "Initial",
                                dst: "initial"
                            }), this.utils.createCI("Final", 13, this["final"], {
                                group: "General",
                                title: "Final",
                                dst: "final"
                            }), this.utils.createCI("comparator", 13, this.comparator, {
                                group: "General",
                                title: "Comparision",
                                dst: "comparator"
                            }), this.utils.createCI("modifier",
                                13, this.modifier, {
                                    group: "General",
                                    title: "Modifier",
                                    dst: "modifier"
                                }), this.utils.createCI("Abort on Error", 0, this.ignoreErrors, {
                                group: "General",
                                title: "Ignore Errors",
                                dst: "ignoreErrors"
                            }), this.utils.createCI("Deferred", 0, this.deferred, {
                                group: "General",
                                title: "Use Deferred",
                                dst: "deferred"
                            })])
                        }
                    })
                })
        }, "xblox/model/loops/WhileBlock": function () {
            define(["dcl/dcl", "xblox/model/Block", "xblox/model/variables/Variable"], function (e, p, l) {
                return e(p, {
                    declaredClass: "xblox.model.loops.WhileBlock",
                    condition: null,
                    items: null,
                    loopLimit: 1500,
                    name: "While",
                    wait: 0,
                    _currentIndex: 0,
                    sharable: !0,
                    icon: "",
                    _timer: null,
                    canAdd: function () {
                        return []
                    },
                    _solve: function (e, d) {
                        for (var b = 0; b < this.items.length; b++)this.items[b].solve(e, d);
                        return []
                    },
                    doStep: function (e) {
                        if (this._currentIndex < this.loopLimit) {
                            var d = [];
                            this._checkCondition(this.scope) ? (this.onSuccess(this, e), this.addToEnd(d, this._solve(this.scope, e)), this._currentIndex++) : (this._timer && clearInterval(this._timer), this.onFailed(this, e))
                        } else console.error("--while block : reached loop limit"),
                            this.reset()
                    },
                    reset: function () {
                        this._timer && (clearTimeout(this._timer), this._timer = null);
                        this._currentIndex = 0
                    },
                    solve: function (e, d) {
                        this.loopLimit = 1500;
                        d = d || {};
                        var b = 0, a = this, f = this._getArg(this.wait);
                        this.reset();
                        if (0 < f)return this._timer = setInterval(function () {
                            a.doStep(d)
                        }, f), [];
                        for (; this._checkCondition(e) && b < this.loopLimit;)this._solve(e, d), b++;
                        this.reset();
                        return []
                    },
                    toText: function () {
                        return this.getBlockIcon("G") + this.name + " " + this.condition
                    },
                    _checkCondition: function (e) {
                        return e.parseExpression(this.condition)
                    },
                    mayHaveChildren: function (e) {
                        return null != this.items && 0 < this.items.length
                    },
                    getChildren: function (e) {
                        e = [];
                        this.items && (e = e.concat(this.items));
                        return e
                    },
                    getFields: function () {
                        var e = this, d = this.inherited(arguments) || this.getDefaultFields();
                        d.push(this.utils.createCI("condition", 25, this.condition, {
                            group: "General",
                            title: "Expression",
                            dst: "condition",
                            delegate: {
                                runExpression: function (b, a, d) {
                                    return e.scope.expressionModel.parse(e.scope, b, !1, a, d)
                                }
                            }
                        }));
                        d.push(this.utils.createCI("wait", 13, this.wait, {
                            group: "General",
                            title: "Wait", dst: "wait"
                        }));
                        return d
                    }
                })
            })
        }, "xblox/model/variables/VariableAssignmentBlock": function () {
            define("dcl/dcl xblox/model/Block xide/utils xide/types dstore/legacy/DstoreAdapter xide/factory xdojo/has".split(" "), function (e, p, l, n, d, b, a) {
                return e(p, {
                    declaredClass: "xblox.model.variables.VariableAssignmentBlock",
                    variable: null,
                    value: null,
                    name: "Set Variable",
                    icon: "",
                    hasInlineEdits: !0,
                    flags: 4,
                    toText: function () {
                        var a = this.scope.getVariableById(this.variable), a = a ? a.name : "";
                        this.variable && -1 !== this.variable.indexOf("://") &&
                        (a = '\x3cspan class\x3d"text-info"\x3e' + this.scope.toFriendlyName(this, this.variable) + "\x3c/span\x3e");
                        return this.getBlockIcon("C") + this.name + " " + a + "\x3cspan class\x3d'text-muted small'\x3e to \x3ckbd class\x3d'text-warning'\x3e" + this.makeEditable("value", "bottom", "text", "Enter the string to send", "inline") + "\x3c/kbd\x3e\x3c/span\x3e"
                    },
                    _getPreviousResult: function () {
                        var a = null;
                        return (a = (a = this.getPreviousBlock()) && a._lastResult && a.enabled ? a : this.getParent()) && null != a._lastResult ? (this.isArray(a._lastResult),
                            a._lastResult) : null
                    },
                    solve: function (a, c) {
                        var d = this.value, e = !1;
                        if (!d) {
                            var l = this.getArgs();
                            0 < l.length && (d = l[0])
                        }
                        if (this.variable && null !== d) {
                            this.onRun(this, c);
                            var k = -1 !== this.variable.indexOf("://") ? this.scope.resolveBlock(this.variable) : a.getVariableById(this.variable), l = this._getArg(d), m = this.getArgs(c) || [];
                            if (!k)return [];
                            var h = null;
                            this.isScript(l) ? (h = this.override || {}, h = a.parseExpression(d, null, null, null, null, null, m || h.args), h = this.replaceAll("'", "", h), k.value !== h && (e = !0)) : (m && 1 == m.length && null ==
                            d && (l = m[0]), k.value !== l && (e = !0), h = k.value = l);
                            k.set("value", h);
                            d = !1;
                            (m = this.getContext()) && (m = m.device) && m.info && m.info.serverSide && (d = this.flags & n.VARIABLE_FLAGS.PUBLISH_IF_SERVER ? !0 : !1);
                            this.flags & n.VARIABLE_FLAGS.PUBLISH && e && (d = !0);
                            e && b.publish(n.EVENTS.ON_DRIVER_VARIABLE_CHANGED, {
                                item: k,
                                scope: this.scope,
                                save: !1,
                                block: this,
                                name: k.name,
                                value: l,
                                publish: d,
                                result: h
                            });
                            this.onSuccess(this, c);
                            return []
                        }
                    },
                    canAdd: function () {
                        return null
                    },
                    getFields: function () {
                        var a = this.inherited(arguments) || this.getDefaultFields(!1),
                            b = this;
                        a.push(this.utils.createCI("value", 29, this.value, {
                            group: "General",
                            title: "Value",
                            dst: "value",
                            widget: {
                                allowACECache: !0,
                                showBrowser: !1,
                                showSaveButton: !0,
                                editorOptions: {
                                    showGutter: !1,
                                    autoSelect: !1,
                                    autoFocus: !1,
                                    hasConsole: !1,
                                    hasItemActions: function () {
                                        return !1
                                    }
                                },
                                item: this
                            },
                            delegate: {
                                runExpression: function (a, d, e) {
                                    return b.scope.expressionModel.parse(b.scope, a, !1, d, e)
                                }
                            }
                        }));
                        a.push(l.createCI("value", "xcf.widgets.CommandPicker", this.variable, {
                            group: "Variable",
                            title: "Variable",
                            dst: "variable",
                            block: this,
                            pickerType: "variable",
                            value: this.variable,
                            widget: {
                                store: this.scope.blockStore,
                                labelField: "name",
                                valueField: "id",
                                value: this.variable,
                                query: [{group: "basicVariables"}, {group: "processVariables"}]
                            }
                        }));
                        a.push(this.utils.createCI("flags", 5, this.flags, {
                            group: "Variable",
                            title: "Flags",
                            dst: "flags",
                            data: [{
                                value: 2,
                                label: "Publish to network",
                                title: "Publish to network in order to make a network variable"
                            }, {
                                value: 4,
                                label: "Publish if server",
                                title: "Publish only on network if this is running server side"
                            }],
                            widget: {hex: !0}
                        }));
                        return a
                    }
                })
            })
        }, "dstore/legacy/DstoreAdapter": function () {
            define(["dojo/_base/declare", "dojo/_base/array", "dojo/store/util/QueryResults"], function (e, p, l) {
                function n(b) {
                    return b
                }

                var d = {
                    store: null, constructor: function (b) {
                        this.store = b;
                        if (b._getQuerierFactory("filter") || b._getQuerierFactory("sort"))this.queryEngine = function (a, c) {
                            c = c || {};
                            var d = b._getQuerierFactory("filter"), e = d ? d(a) : n, d = b._getQuerierFactory("sort"), l = n;
                            d && (l = d(p.map(c.sort, function (a) {
                                return {property: a.attribute, descending: a.descending}
                            })));
                            var k = n;
                            isNaN(c.start) && isNaN(c.count) || (k = function (a) {
                                var b = c.start || 0, b = a.slice(b, b + (c.count || Infinity));
                                b.total = a.length;
                                return b
                            });
                            return function (a) {
                                return k(l(e(a)))
                            }
                        };
                        var a = this;
                        b.on("add,update,delete", function (d) {
                            var c = d.type, e = d.target;
                            a.notify("add" === c || "update" === c ? e : void 0, "delete" === c || "update" === c ? "id" in d ? d.id : b.getIdentity(e) : void 0)
                        })
                    }, labelAttr: "title", getLabel: function (b) {
                        return this.store.getLabel(b)
                    }, query: function (b, a) {
                        a = a || {};
                        var d = this.store.filter(b), c, e, n;
                        if (n = a.sort)if ("[object Array]" ===
                            Object.prototype.toString.call(n))for (var p; p = n.pop();)d = d.sort(p.attribute, p.descending); else d = d.sort(n);
                        d.track && !d.tracking && (d = d.track(), e = !0);
                        "start" in a && (c = a.start || 0, c = d[d.fetchRangeSync ? "fetchRangeSync" : "fetchRange"]({
                            start: c,
                            end: a.count ? c + a.count : Infinity
                        }));
                        c = c || d[d.fetchSync ? "fetchSync" : "fetch"]();
                        n = c.totalLength;
                        c = new l(c);
                        c.total = n;
                        c.observe = function (a, b) {
                            function c(a) {
                                return void 0 === a && e ? -1 : a
                            }

                            var n = d.on("add", function (b) {
                                a(b.target, -1, c(b.index))
                            }), l = d.on("update", function (d) {
                                !b &&
                                d.previousIndex === d.index && isFinite(d.index) || a(d.target, c(d.previousIndex), c(d.index))
                            }), p = d.on("delete", function (b) {
                                a(b.target, c(b.previousIndex), -1)
                            }), q = {
                                remove: function () {
                                    n.remove();
                                    l.remove();
                                    p.remove()
                                }
                            };
                            q.cancel = q.remove;
                            return q
                        };
                        return c
                    }, notify: function () {
                    }
                };
                p.forEach(["get", "put", "add", "remove", "getIdentity"], function (b) {
                    d[b] = function () {
                        var a = this.store;
                        return (a[b + "Sync"] || a[b]).apply(a, arguments)
                    }
                });
                return e(null, d)
            })
        }, "xblox/model/logic/IfBlock": function () {
            define("dcl/dcl xblox/model/Block xblox/model/Statement xblox/model/logic/ElseIfBlock dojo/Deferred xide/utils".split(" "),
                function (e, p, l, n, d, b) {
                    return e(p, {
                        declaredClass: "xblox.model.logic.IfBlock",
                        condition: "Invalid Expression",
                        consequent: null,
                        elseIfBlocks: null,
                        alternate: null,
                        canAdd: function () {
                            return []
                        },
                        autoCreateElse: !0,
                        name: "if",
                        icon: "",
                        add: function (a, b, c) {
                            null == c && (c = "consequent");
                            return this._add(a, b, c, !1)
                        },
                        __addToStore: function (a) {
                            a.put(this)
                        },
                        mayHaveChildren: function () {
                            return null !== this.items && this.items.length || null !== this.elseIfBlocks && this.elseIfBlocks.length || null != this.consequent && this.consequent.length ||
                                null != this.alternate && this.alternate.length
                        },
                        getChildren: function () {
                            var a = [];
                            this.consequent && (a = a.concat(this.consequent));
                            this.elseIfBlocks && (a = a.concat(this.elseIfBlocks));
                            this.alternate && (a = a.concat(this.alternate));
                            return a
                        },
                        toText: function () {
                            return "\x3cspan class\x3d'text-primary'\x3e" + this.getBlockIcon("E") + this.name + " \x3c/span\x3e\x3cspan class\x3d'text-warning small'\x3e" + this.condition + "\x3cspan\x3e"
                        },
                        _checkCondition: function (a) {
                            return a.parseExpression(this.condition, null, null)
                        },
                        solve: function (a,
                                         b) {
                            var c = this._checkCondition(a), d = this.getElseIfBlocks(), e = this.childrenByNotClass(n), p = null, e = e.filter(function (a) {
                                return !a.isInstanceOf(l)
                            });
                            if (1 == c || 0 < c) {
                                this.onSuccess(this, b);
                                if (e && e.length)for (d = 0; d < e.length; d++)p = e[d].solve(a, b);
                                return p
                            }
                            p = !1;
                            this.onFailed(this, b);
                            if (d)for (e = 0; e < d.length && !p; e++) {
                                c = d[e];
                                if (c._checkCondition(a))return c.onSuccess(c, b), p = !0, c.solve(a, b);
                                c.onFailed(c, b)
                            }
                            e = this.childrenByClass(l);
                            if (0 < e.length && !p) {
                                p = null;
                                for (d = 0; d < e.length; d++)p = e[d].solve(a, b);
                                return p
                            }
                            return []
                        },
                        empty: function () {
                            this._empty(this.alternate);
                            this._empty(this.consequent);
                            this._empty(this.elseIfBlocks)
                        },
                        removeBlock: function (a) {
                            a && (a && a.empty && a.empty(), delete a.items, a.parent = null, this.alternate.remove(a), this.consequent.remove(a), this.elseIfBlocks.remove(a))
                        },
                        _getContainer: function (a) {
                            return -1 != this.consequent.indexOf(a) ? "consequent" : -1 != this.alternate.indexOf(a) ? "alternate" : -1 != this.elseIfBlocks.indexOf(a) ? "elseIfBlocks" : "_"
                        },
                        init: function () {
                            this.alternate = this.alternate || [];
                            this.consequent =
                                this.consequent || [];
                            this.elseIfBlocks = this.elseIfBlocks || [];
                            for (var a = 0; a < this.alternate.length; a++)this.alternate[a].parentId = this.id, this.alternate[a].parent = this;
                            for (a = 0; a < this.elseIfBlocks.length; a++)this.elseIfBlocks[a].parentId = this.id, this.elseIfBlocks[a].parent = this;
                            for (a = 0; a < this.consequent.length; a++)this.consequent[a].parentId = this.id, this.consequent[a].parent = this
                        },
                        getFields: function () {
                            var a = this, b = this.inherited(arguments) || this.getDefaultFields();
                            b.push(this.utils.createCI("condition",
                                this.types.ECIType.EXPRESSION_EDITOR, this.condition, {
                                    group: "General",
                                    title: "Expression",
                                    dst: "condition",
                                    delegate: {
                                        runExpression: function (b, d, e) {
                                            return a.scope.expressionModel.parse(a.scope, b, !1, d, e)
                                        }
                                    }
                                }));
                            return b
                        },
                        postCreate: function () {
                            this._postCreated || (this._postCreated = !0)
                        },
                        toCode: function (a, b) {
                        },
                        getElseIfBlocks: function () {
                            return this.childrenByClass(n)
                        },
                        runAction: function (a) {
                            var e = this.scope.blockStore;
                            a = a.command;
                            if ("New/Else" === a || "New/Else If" === a) {
                                a = "New/Else If" === a ? n : l;
                                var c = b.mixin({
                                    name: "else",
                                    items: [],
                                    dstField: "alternate",
                                    parentId: this.id,
                                    parent: this,
                                    scope: this.scope,
                                    canAdd: function () {
                                        return []
                                    },
                                    canEdit: function () {
                                        return !1
                                    }
                                }, a == n ? {name: "else if", dstField: "elseIfBlocks"} : {
                                    name: "else",
                                    dstField: "alternate"
                                });
                                a = this.add(a, c, a == l ? "alternate" : "elseIfBlocks");
                                var c = {select: [a], focus: !0, append: !1, expand: !0, delay: 10}, g = new d;
                                e._emit("added", {target: a});
                                g.resolve(c);
                                a.refresh();
                                return g
                            }
                        },
                        getActions: function () {
                            var a = [];
                            0 == this.alternate.length && a.push(this.createAction({
                                label: "Else",
                                command: "New/Else",
                                icon: this.getBlockIcon("I"),
                                tab: "Home",
                                group: "File",
                                mixin: {addPermission: !0, custom: !0}
                            }));
                            a.push(this.createAction({
                                label: "Else If",
                                command: "New/Else If",
                                icon: this.getBlockIcon("I"),
                                tab: "Home",
                                group: "File",
                                mixin: {addPermission: !0, custom: !0}
                            }));
                            return a
                        }
                    })
                })
        }, "xblox/model/Statement": function () {
            define(["dcl/dcl", "xblox/model/Block"], function (e, p) {
                return e(p, {
                    declaredClass: "xblox.model.Statement", toText: function () {
                        return this.name
                    }, getChildren: function () {
                        return this.items
                    }
                })
            })
        }, "xblox/model/logic/ElseIfBlock": function () {
            define(["dcl/dcl",
                "xblox/model/Block", "xblox/model/Contains"], function (e, p, l) {
                return e([p, l], {
                    declaredClass: "xblox.model.logic.ElseIfBlock",
                    condition: "",
                    consequent: null,
                    name: "else if",
                    icon: "",
                    solve: function (e, d) {
                        return this._checkCondition(e) ? this._solve(e, d) : !1
                    },
                    toText: function () {
                        return "\x3cspan class\x3d'text-primary'\x3e" + this.getBlockIcon("E") + this.name + " \x3c/span\x3e\x3cspan class\x3d'text-warning small'\x3e" + (this.condition || "") + "\x3cspan\x3e"
                    },
                    _checkCondition: function (e) {
                        return null !== this.condition ? e.parseExpression(this.condition) :
                            !1
                    },
                    getFields: function () {
                        var e = this, d = this.inherited(arguments) || this.getDefaultFields();
                        d.push(this.utils.createCI("condition", this.types.ECIType.EXPRESSION_EDITOR, this.condition, {
                            group: "General",
                            title: "Expression",
                            dst: "condition",
                            delegate: {
                                runExpression: function (b, a, d) {
                                    return e.scope.expressionModel.parse(e.scope, b, !1, a, d)
                                }
                            }
                        }));
                        return d
                    }
                })
            })
        }, "xblox/model/logic/SwitchBlock": function () {
            define("dcl/dcl xblox/model/Block xblox/model/logic/CaseBlock xblox/model/logic/DefaultBlock dojo/Deferred xide/lodash".split(" "),
                function (e, p, l, n, d, b) {
                    return e(p, {
                        declaredClass: "xblox.model.logic.SwitchBlock",
                        items: null,
                        name: "Switch",
                        icon: null,
                        toText: function () {
                            return this.getBlockIcon("H") + this.name + " "
                        },
                        canAdd: function (a) {
                            return a && a.isInstanceOf ? a.isInstanceOf(l) || a.isInstanceOf(n) : []
                        },
                        getFields: function () {
                            return this.getDefaultFields(!1, !1)
                        },
                        solve: function (a, b) {
                            var c = this._stopped = !1, d = [];
                            this.onSuccess(this, b);
                            for (var e = 0; e < this.items.length; e++) {
                                var n = this.items[e];
                                if ("xblox.model.logic.CaseBlock" === n.declaredClass &&
                                    (n = n.solve(a, this, b), 0 != n)) {
                                    c = !0;
                                    this.addToEnd(d, n);
                                    break
                                }
                                if (this._stopped)break
                            }
                            if (!c)for (e = 0; e < this.items.length; e++)n = this.items[e], "xblox.model.logic.CaseBlock" != n.declaredClass && this.addToEnd(d, n.solve(a, b));
                            return d
                        },
                        getChildren: function () {
                            return this.items
                        },
                        stop: function () {
                            this._stopped = !0
                        },
                        runAction: function (a) {
                            var b = a.command;
                            if ("New/Case" === b || "New/Default" === a.command) {
                                a = this.scope.blockStore;
                                var c = new d, e = null;
                                switch (b) {
                                    case "New/Case":
                                        e = this.add(l, {
                                            comparator: "\x3d\x3d", expression: "on",
                                            group: null
                                        });
                                        break;
                                    case "New/Default":
                                        e = this.add(n, {group: null})
                                }
                                c.resolve({select: [e], focus: !0, append: !1});
                                e.refresh();
                                a._emit("added", {target: e})
                            }
                        },
                        getActions: function (a, d) {
                            var c = [this.createAction({
                                label: "New Case",
                                command: "New/Case",
                                icon: this.getBlockIcon("I"),
                                tab: "Home",
                                group: "File",
                                mixin: {addPermission: !0, custom: !0, quick: !1}
                            })];
                            b.find(this.items, {declaredClass: "xblox.model.logic.DefaultBlock"}) || c.push(this.createAction({
                                label: "Default", command: "New/Default", icon: "fa-eject", tab: "Home", group: "File",
                                mixin: {addPermission: !0, custom: !0, quick: !1}
                            }));
                            return c
                        }
                    })
                })
        }, "xblox/model/logic/DefaultBlock": function () {
            define(["dcl/dcl", "xblox/model/Block"], function (e, p) {
                return e(p, {
                    declaredClass: "xblox.model.logic.DefaultBlock",
                    name: "Default",
                    icon: "",
                    hasInlineEdits: !1,
                    toText: function () {
                        return '\x26nbsp;\x3cspan class\x3d"fa-eject text-info"\x3e\x3c/span\x3e\x26nbsp;\x26nbsp;\x3cspan\x3e' + this.name + "\x3c/span\x3e"
                    },
                    solve: function (e, n) {
                        this.onSuccess(this, n);
                        return this._solve(e, n)
                    }
                })
            })
        }, "xblox/model/variables/VariableSwitch": function () {
            define("dcl/dcl xblox/model/logic/SwitchBlock xide/types xblox/model/logic/CaseBlock xblox/model/logic/DefaultBlock dojo/Deferred".split(" "),
                function (e, p, l, n, d, b) {
                    return e(p, {
                        declaredClass: "xblox.model.variables.VariableSwitch",
                        name: "Switch on Variable",
                        icon: "",
                        variable: "PowerState",
                        toText: function () {
                            var a = this.scope.getVariableById(this.variable), a = a ? a.name : "";
                            return this.getBlockIcon("H") + this.name + " " + a
                        },
                        getFields: function () {
                            var a = this.getDefaultFields(!1, !1);
                            return a = a.concat([this.utils.createCI("Variable", 3, this.variable, {
                                group: "General", widget: {
                                    store: this.scope.blockStore,
                                    labelField: "name",
                                    valueField: "id",
                                    query: [{group: "basicVariables"},
                                        {group: "processVariables"}]
                                }, dst: "variable"
                            })])
                        }
                    })
                })
        }, "xblox/model/logging/Log": function () {
            define("dcl/dcl dojo/Deferred xblox/model/Block xide/utils xide/types xide/mixins/EventedMixin".split(" "), function (e, p, l, n, d, b) {
                return e([l, b.dcl], {
                    declaredClass: "xblox.model.logging.Log",
                    name: "Log Message",
                    level: "info",
                    message: 'return "Message: " + arguments[0];',
                    _type: "XBlox",
                    host: "this host",
                    sharable: !0,
                    toText: function () {
                        var a = "text-primary";
                        switch (this.level) {
                            case "info":
                                a = "text-info";
                                break;
                            case "warn":
                                a =
                                    "text-warning";
                                break;
                            case "error":
                                a = "text-danger"
                        }
                        a = this.getBlockIcon() + " " + this.name + " : \x3cspan class\x3d'" + a + " small'\x3e  :: ";
                        this.message && (a += this.message);
                        return a + "\x3c/span\x3e"
                    },
                    _solveExpression: function (a, b, c, d, e) {
                        if ((a = "" + a) && a.length) {
                            a = n.convertAllEscapes(a, "none");
                            var l = this.getArgs();
                            try {
                                var k = b.parseExpression(a, null, null, null, null, this, l);
                                d && d("Expression " + a + " evaluates to " + k);
                                return k
                            } catch (m) {
                                e && e("invalid expression : \n" + a + ": " + m), this.onFailed(this, c)
                            }
                        }
                        return a
                    },
                    solve: function (a,
                                     b, c, e) {
                        var n = new p, l = a.device;
                        a = this._solveExpression(this.message, a, b, c, e);
                        l = {
                            message: a,
                            level: this.level,
                            type: this._type,
                            details: this.getArgs(),
                            time: (new Date).getTime(),
                            data: {device: l ? l.info : null},
                            write: !0
                        };
                        this.onSuccess(this, b);
                        n.resolve(a);
                        try {
                            this.publish(d.EVENTS.ON_SERVER_LOG_MESSAGE, l)
                        } catch (k) {
                            this.onFailed(this, b)
                        }
                        return n
                    },
                    canAdd: function () {
                        return null
                    },
                    getFields: function () {
                        var a = this.inherited(arguments) || this.getDefaultFields(), b = this;
                        a.push(n.createCI("Level", 3, this.level, {
                            group: "General",
                            options: [{value: "info", label: "Info"}, {
                                value: "warn",
                                label: "Warning"
                            }, {value: "error", label: "Error"}, {value: "debug", label: "Debug"}, {
                                value: "help",
                                label: "Help"
                            }, {value: "verbose", label: "verbose"}, {value: "silly", label: "Silly"}], dst: "level"
                        }));
                        a.push(n.createCI("message", 25, this.message, {
                            group: "General",
                            title: "Message",
                            dst: "message",
                            delegate: {
                                runExpression: function (a, d, e) {
                                    b._solveExpression(a, b.scope, null, d, e)
                                }
                            }
                        }));
                        a.push(n.createCI("message", 13, this._type, {group: "General", title: "Type", dst: "_type"}));
                        return a
                    },
                    getBlockIcon: function () {
                        return '\x3cspan class\x3d"fa-bug"\x3e\x3c/span\x3e'
                    }
                })
            })
        }, "xblox/model/server/RunServerMethod": function () {
            define(["dcl/dcl", "xblox/model/server/ServerBlock", "xide/utils"], function (e, p, l) {
                return e(p, {
                    declaredClass: "xblox.model.server.RunServerMethod",
                    description: "Runs a JSON-RPC-2.0 method on the server",
                    name: "Run Server Method",
                    method: "XShell::run",
                    args: "",
                    deferred: !0,
                    defaultServiceClass: "XShell",
                    defaultServiceMethod: "run",
                    sharable: !0,
                    onMethodChanged: function (e, d) {
                        this.method =
                            e;
                        if (!l.isValidString(this.args)) {
                            var b = this.getServerParams();
                            b && this._updateArgs(b, d)
                        }
                    },
                    _getArgs: function () {
                        var e = l.getJson(this.args || "[]"), d = [];
                        if (e) {
                            var b = !1;
                            e && e[0] && null != e[0].optional && (b = !0);
                            if (b)for (b = 0; b < e.length; b++) {
                                var a = e[b], f = a.value;
                                -1 != a.name.indexOf("Base64") && (f = this.getService().base64_encode(f));
                                "notset" !== a.value ? -1 != a.value.indexOf("[") && -1 != a.value.indexOf("]") ? (f = this.scope.expressionModel.replaceVariables(this.scope, a.value, !1, !1), -1 != a.name.indexOf("Base64") && (f = this.getService().base64_encode(f)),
                                    d.push(f)) : d.push(f || a["default"]) : d.push(a["default"] || f)
                            }
                        } else return [this.args];
                        return d
                    },
                    _updateArgs: function (e, d) {
                        var b = this.utils.getCIWidgetByName(d, "args");
                        if (b) {
                            var a = JSON.stringify(e);
                            b.editBox.set("value", a);
                            this.args = a
                        }
                    },
                    getServerParams: function () {
                        var e = this.getService().getParameterMap(this.getServiceClass(), this.getServiceMethod());
                        if (e)for (var d = 0; d < e.length; d++)e[d].value = "notset";
                        return e
                    },
                    onReloaded: function (e) {
                        console.log("sdfsd");
                        this._solve()
                    },
                    _solve: function (e, d, b, a) {
                        console.log("solve223")
                    },
                    solve: function (e, d, b, a) {
                        this._return = [];
                        this._lastResult = null;
                        e = [];
                        if (!this.isInValidState())return this.onFailed(this, d), e;
                        e = this._getArgs();
                        this.onRun(this, d);
                        this.getService();
                        d = this.scope.serviceObject;
                        console.error("run deferred");
                        (d = d.runDeferred(this.getServiceClass(), this.getServiceMethod(), e)) && d.then(function (a) {
                            console.error("returned ", a)
                        });
                        return d
                    },
                    toText: function () {
                        var e = this.getBlockIcon() + " " + this.name + " :: ";
                        this.method && (e += this.method.substr(0, 50));
                        return e
                    },
                    canAdd: function () {
                        return []
                    },
                    getFields: function () {
                        var e = this.inherited(arguments) || this.getDefaultFields(), d = this;
                        e.push(l.createCI("value", 25, this.method, {
                            group: "General",
                            title: "Method",
                            dst: "method",
                            description: "This should be in the format : MyServerClass::myMethod",
                            delegate: {
                                runExpression: function (b, a, e) {
                                    d.method = b;
                                    d.solve(d.scope, null, a, e)
                                }
                            }
                        }));
                        return e = e.concat(this.getServerDefaultFields())
                    },
                    getBlockIcon: function () {
                        return '\x3cspan class\x3d"fa-plug"\x3e\x3c/span\x3e'
                    },
                    mayHaveChildren: function (e) {
                        return null != this.items &&
                            0 < this.items.length
                    },
                    getChildren: function (e) {
                        return this.items
                    },
                    onChangeField: function (e, d, b) {
                        if ("method" === e)this.onMethodChanged(d, b)
                    },
                    isInValidState: function () {
                        return null != this.getService()
                    },
                    getService: function () {
                        var e = this.scope.getService();
                        e || console.error("have no service object");
                        return e
                    },
                    getServiceClass: function () {
                        return this.method.split("::")[0] || this.defaultServiceClass
                    },
                    getServiceMethod: function () {
                        return this.method.split("::")[1] || this.defaultServiceMethod
                    },
                    hasMethod: function (e) {
                        return this.isInValidState() &&
                            null != this.getService()[this.getServiceClass()] && null != this.getService()[this.getServiceClass()][this.getServiceMethod()]
                    },
                    hasServerClass: function (e) {
                        return this.isInValidState() && null != this.getService()[this.getServiceClass()]
                    },
                    getServerFunction: function () {
                        return this.isInValidState() && this.getServiceClass() && this.getServiceMethod() ? this.getService()[this.getServiceClass()][this.getServiceMethod()] : null
                    }
                })
            })
        }, "xblox/model/server/ServerBlock": function () {
            define(["dcl/dcl", "xblox/model/Block", "xide/utils"],
                function (e, p, l) {
                    return e(p, {
                        declaredClass: "xblox.model.server.ServerBlock",
                        name: "Run Server Block",
                        method: "XShell::run",
                        args: "",
                        deferred: !0,
                        defaultServiceClass: "XShell",
                        defaultServiceMethod: "run",
                        sharable: !0,
                        onReloaded: function () {
                        },
                        solve: function (e, d, b, a) {
                            this._currentIndex = 0;
                            this._return = [];
                            if ((e = "" + this.method) && e.length) {
                                var f = new Function("{" + e + "}"), c = this.getArgs();
                                try {
                                    var g = f.apply(this, c || {});
                                    this._lastResult = g;
                                    b && b("Expression " + e + " evaluates to " + g);
                                    if ("false" !== g && !1 !== g)this.onSuccess(this,
                                        d); else return this.onFailed(this, d), []
                                } catch (l) {
                                    return a && a("invalid expression : \n" + e + ": " + l), this.onFailed(this, d), []
                                }
                            } else console.error("have no script");
                            b = this[this._getContainer()];
                            if (b.length)this.runFrom(b, 0, d); else this.onSuccess(this, d);
                            return []
                        },
                        toText: function () {
                            var e = this.getBlockIcon() + " " + this.name + " :: ";
                            this.method && (e += this.method.substr(0, 50));
                            return e
                        },
                        canAdd: function () {
                            return []
                        },
                        getServerDefaultFields: function (e) {
                            e = e || [];
                            e.push(l.createCI("args", 27, this.args, {
                                group: "General",
                                title: "Arguments", dst: "args"
                            }));
                            return e
                        },
                        getBlockIcon: function () {
                            return '\x3cspan class\x3d"fa-plug"\x3e\x3c/span\x3e'
                        },
                        mayHaveChildren: function (e) {
                            return null != this.items && 0 < this.items.length
                        },
                        getChildren: function (e) {
                            return this.items
                        },
                        isInValidState: function () {
                            return null != this.getService()
                        },
                        getService: function () {
                            return this.scope.getService()
                        },
                        getServiceClass: function () {
                            return this.method.split("::")[0] || this.defaultServiceClass
                        },
                        getServiceMethod: function () {
                            return this.method.split("::")[1] || this.defaultServiceMethod
                        },
                        hasMethod: function (e) {
                            return this.isInValidState() && null != this.getService()[this.getServiceClass()] && null != this.getService()[this.getServiceClass()][this.getServiceMethod()]
                        },
                        hasServerClass: function (e) {
                            return this.isInValidState() && null != this.getService()[this.getServiceClass()]
                        },
                        getServerFunction: function () {
                            return this.isInValidState() && this.getServiceClass() && this.getServiceMethod() ? this.getService()[this.getServiceClass()][this.getServiceMethod()] : null
                        }
                    })
                })
        }, "xblox/model/server/Shell": function () {
            define(["dcl/dcl",
                "xblox/model/server/ServerBlock", "xide/utils", "xcf/model/Command"], function (e, p, l, n) {
                return e([n, p], {
                    declaredClass: "xblox.model.server.Shell",
                    description: "Runs a JSON-RPC-2.0 method on the server",
                    name: "Run Shell",
                    method: "",
                    args: "",
                    deferred: !0,
                    defaultServiceClass: "XShell",
                    defaultServiceMethod: "run",
                    sharable: !0,
                    onMethodChanged: function (d, b) {
                        this.method = d;
                        if (!l.isValidString(this.args)) {
                            var a = this.getServerParams();
                            a && this._updateArgs(a, b)
                        }
                    },
                    _getArgs: function () {
                        var d = l.getJson(this.args || "[]"), b = [];
                        if (d) {
                            var a = !1;
                            d && d[0] && null != d[0].optional && (a = !0);
                            if (a)for (a = 0; a < d.length; a++) {
                                var e = d[a], c = e.value;
                                -1 != e.name.indexOf("Base64") && (c = this.getService().base64_encode(c));
                                "notset" !== e.value ? -1 != e.value.indexOf("[") && -1 != e.value.indexOf("]") ? (c = this.scope.expressionModel.replaceVariables(this.scope, e.value, !1, !1), -1 != e.name.indexOf("Base64") && (c = this.getService().base64_encode(c)), b.push(c)) : b.push(c || e["default"]) : b.push(e["default"] || c)
                            }
                        } else return [this.args];
                        return b
                    },
                    _updateArgs: function (d, b) {
                        var a =
                            this.utils.getCIWidgetByName(b, "args");
                        if (a) {
                            var e = JSON.stringify(d);
                            a.editBox.set("value", e);
                            this.args = e
                        }
                    },
                    getServerParams: function () {
                        var d = this.getService().getParameterMap(this.getServiceClass(), this.getServiceMethod());
                        if (d)for (var b = 0; b < d.length; b++)d[b].value = "notset";
                        return d
                    },
                    solve: function (d, b, a, e, c, g) {
                        this._return = [];
                        this._lastResult = null;
                        this._lastSettings = b || this._lastSettings;
                        b = this.getInstance();
                        d = d.expressionModel.replaceVariables(d, this.method, !1, !1);
                        b.runShell(d, l.mixin({}, {}), this.id,
                            this.id, this)
                    },
                    toText: function () {
                        var d = this.getBlockIcon() + " " + this.name + " :: ";
                        this.method && (d += this.method.substr(0, 50));
                        return d
                    },
                    canAdd: function () {
                        return []
                    },
                    getFields: function () {
                        var d = this.inherited(arguments) || this.getDefaultFields(), b = this;
                        d.push(l.createCI("value", 25, this.method, {
                            group: "General",
                            title: "Cmd",
                            dst: "method",
                            delegate: {
                                runExpression: function (a, d, c) {
                                    b.method = a;
                                    b.solve(b.scope, null, d, c)
                                }
                            }
                        }));
                        return d
                    },
                    getBlockIcon: function () {
                        return '\x3cspan class\x3d"fa-plug"\x3e\x3c/span\x3e'
                    },
                    mayHaveChildren: function (d) {
                        return null !=
                            this.items && 0 < this.items.length
                    },
                    getChildren: function (d) {
                        return this.items
                    },
                    onChangeField: function (d, b, a) {
                        if ("method" === d)this.onMethodChanged(b, a)
                    },
                    isInValidState: function () {
                        return null != this.getService()
                    },
                    getService: function () {
                        var d = this.scope.getService();
                        d || console.error("have no service object");
                        return d
                    },
                    getServiceClass: function () {
                        return this.method.split("::")[0] || this.defaultServiceClass
                    },
                    getServiceMethod: function () {
                        return this.method.split("::")[1] || this.defaultServiceMethod
                    },
                    hasMethod: function (d) {
                        return this.isInValidState() &&
                            null != this.getService()[this.getServiceClass()] && null != this.getService()[this.getServiceClass()][this.getServiceMethod()]
                    },
                    hasServerClass: function (d) {
                        return this.isInValidState() && null != this.getService()[this.getServiceClass()]
                    },
                    getServerFunction: function () {
                        return this.isInValidState() && this.getServiceClass() && this.getServiceMethod() ? this.getService()[this.getServiceClass()][this.getServiceMethod()] : null
                    }
                })
            })
        }, "xblox/model/code/RunBlock": function () {
            define(["dcl/dcl", "xblox/model/Block", "xide/types",
                "xide/utils"], function (e, p, l, n) {
                return e(p, {
                    declaredClass: "xblox.model.code.RunBlock",
                    name: "Run Block",
                    file: "",
                    method: "",
                    args: "",
                    sharable: !0,
                    block: "",
                    description: "Runs another Block",
                    solve: function (d, b) {
                        var a = this.getContext();
                        if (a && null != a[this.method]) {
                            var e = [], c = a[this.method];
                            try {
                                var g = this._getArgs(), e = c.apply(a, g || []);
                                this.onSuccess(this, b);
                                return e
                            } catch (l) {
                                console.error("call method failed"), this.onFailed(this, b)
                            }
                        } else this.onFailed(this, b);
                        return []
                    },
                    toText: function () {
                        var d = this.getBlockIcon() +
                            " " + this.name + " ";
                        this.method && (d += this.method.substr(0, 20));
                        return d
                    },
                    getFields: function () {
                        var d = this.getDefaultFields();
                        d.push(n.createCI("Block", l.ECIType.BLOCK_REFERENCE, this.block, {
                            toolTip: "Enter  block, you can use also the block's share title",
                            group: "General",
                            dst: "block",
                            value: this.block,
                            title: "Block",
                            scope: this.scope
                        }));
                        d.push(n.createCI("File", l.ECIType.FILE, this.file, {
                            toolTip: "Leave empty to auto-select this file",
                            group: "General",
                            dst: "file",
                            value: this.file,
                            intermediateChanges: !1,
                            acceptFolders: !1,
                            acceptFiles: !0,
                            encodeFilePath: !1,
                            buildFullPath: !0,
                            filePickerOptions: {
                                dialogTitle: "Select Block File",
                                filePickerMixin: {
                                    beanContextName: this.id,
                                    persistent: !1,
                                    globalPanelMixin: {allowLayoutCookies: !1}
                                },
                                configMixin: {
                                    beanContextName: this.id, LAYOUT_PRESET: l.LAYOUT_PRESET.SINGLE, PANEL_OPTIONS: {
                                        ALLOW_MAIN_MENU: !1,
                                        ALLOW_NEW_TABS: !0,
                                        ALLOW_MULTI_TAB: !1,
                                        ALLOW_INFO_VIEW: !0,
                                        ALLOW_LOG_VIEW: !1,
                                        ALLOW_CONTEXT_MENU: !0,
                                        ALLOW_LAYOUT_SELECTOR: !0,
                                        ALLOW_SOURCE_SELECTOR: !0,
                                        ALLOW_COLUMN_RESIZE: !0,
                                        ALLOW_COLUMN_REORDER: !0,
                                        ALLOW_COLUMN_HIDE: !0,
                                        ALLOW_ACTION_TOOLBAR: !0,
                                        ALLOW_BREADCRUMBS: !1
                                    }
                                },
                                defaultStoreOptions: {fields: 1663, includeList: "xblox", excludeList: "*"},
                                startPath: this.file
                            }
                        }));
                        return d
                    },
                    getBlockIcon: function () {
                        return '\x3cspan class\x3d"el-icon-share-alt"\x3e\x3c/span\x3e'
                    }
                })
            })
        }, "xblox/model/events/OnEvent": function () {
            define("dcl/dcl dojo/_base/lang dojo/Deferred xblox/model/Block xide/utils xide/types xide/mixins/EventedMixin xblox/model/Referenced xide/registry dojo/on xwire/_Base".split(" "), function (e, p, l, n, d, b, a, f, c, g, r) {
                return e([n,
                    a.dcl, f.dcl, r], {
                    declaredClass: "xblox.model.events.OnEvent",
                    name: "On Event",
                    event: "",
                    reference: "",
                    references: null,
                    sharable: !0,
                    _didSubscribe: !1,
                    filterPath: "item.name",
                    filterValue: "",
                    valuePath: "item.value",
                    _nativeEvents: "onclick ondblclick onmousedown onmouseup onmouseover onmousemove onmouseout onkeypress onkeydown onkeyup onfocus onblur onchange".split(" "),
                    stop: function () {
                        this._destroy()
                    },
                    solve: function (a, b, c, d) {
                        c && this._destroy();
                        b = this._lastSettings = b || this._lastSettings;
                        if (!this._didSubscribe)return this._registerEvent(this.event),
                            this.onSuccess(this, b), !1;
                        this.onSuccess(this, b);
                        this._currentIndex = 0;
                        this._return = [];
                        a = this[this._getContainer()];
                        if (a.length)return a = this.runFrom(a, 0, b), this.onSuccess(this, b), a;
                        this.onSuccess(this, b);
                        return []
                    },
                    toText: function () {
                        var a = this.getBlockIcon() + " " + this.name + " :: ";
                        this.event && (a += this.event);
                        return a
                    },
                    canAdd: function () {
                        return []
                    },
                    getFields: function () {
                        var a = this.inherited(arguments) || this.getDefaultFields();
                        this.deserialize(this.reference);
                        var c = null;
                        if (-1 < d.contains(this._nativeEvents,
                                this.event))for (var c = [{label: "onclick", value: "onclick"}, {
                                label: "ondblclick",
                                value: "ondblclick"
                            }, {label: "onmousedown", value: "onmousedown"}, {
                                label: "onmouseup",
                                value: "onmouseup"
                            }, {label: "onmouseover", value: "onmouseover"}, {
                                label: "onmousemove",
                                value: "onmousemove"
                            }, {label: "onmouseout", value: "onmouseout"}, {
                                label: "onkeypress",
                                value: "onkeypress"
                            }, {label: "onkeydown", value: "onkeydown"}, {
                                label: "onkeyup",
                                value: "onkeyup"
                            }, {label: "onfocus", value: "onfocus"}, {label: "onblur", value: "onblur"}, {
                                label: "onchange",
                                value: "onchange"
                            }],
                                                     e = 0; e < c.length; e++) {
                            var f = c[e];
                            if (f.value === this.event) {
                                f.selected = !0;
                                break
                            }
                        } else c = this.scope.getEventsAsOptions(this.event);
                        a.push(d.createCI("Event", b.ECIType.ENUMERATION, this.event, {
                            group: "General",
                            options: c,
                            dst: "event",
                            widget: {search: !0}
                        }));
                        a.push(d.createCI("Filter Path", 13, this.filterPath, {group: "General", dst: "filterPath"}));
                        a.push(d.createCI("Filter Value", 13, this.filterValue, {
                            group: "General",
                            dst: "filterValue"
                        }));
                        a.push(d.createCI("Value Path", 13, this.valuePath, {group: "General", dst: "valuePath"}));
                        a.push(d.createCI("Object/Widget", b.ECIType.WIDGET_REFERENCE, this.reference, {
                            group: "Widget",
                            dst: "reference",
                            value: this.reference
                        }));
                        return a
                    },
                    getBlockIcon: function () {
                        return '\x3cspan class\x3d"fa-bell"\x3e\x3c/span\x3e'
                    },
                    onEvent: function (a) {
                        this._lastResult = a;
                        if (this.filterPath && this.filterValue) {
                            var b = this.getValue(a, this.filterPath);
                            if (b && this.filterValue !== b)return
                        }
                        b = null;
                        this.valuePath && (this._lastSettings || (this._lastSettings = {}), b = this.getValue(a, this.valuePath), null !== b && (!this._lastSettings.override &&
                        (this._lastSettings.override = {}), this._lastSettings.override.args = [b]));
                        this.solve(this.scope, this._lastSettings)
                    },
                    _subscribe: function (a, b, c) {
                        if (a)if (-1 == d.contains(this._nativeEvents, a))this.__events && this.__events[a] && (c = this.__events[a], _.each(c, function (a) {
                            this.unsubscribe(a.type, a.handler);
                            a.remove()
                        }, this), _.each(c, function (b) {
                            this.__events[a].remove(b)
                        }, this)), this.subscribe(a, this.onEvent); else if (c) {
                            b = a.replace("on", "");
                            var e = this;
                            c = g(c, b, function (a) {
                                e.onEvent(a)
                            });
                            console.log("wire native event : " +
                                b);
                            this._events.push(c)
                        }
                    },
                    _registerEvent: function (a) {
                        try {
                            if (!a || !a.length)return;
                            console.log("register event : " + a + " for " + this.reference);
                            var b = this.resolveReference(this.deserialize(this.reference)), d = this;
                            if (b && b.length) {
                                for (var e = 0; e < b.length; e++) {
                                    var f = b[e];
                                    if (f && f.id) {
                                        var g = c.byId(f.id);
                                        if (g && g.on) {
                                            var l = this.event.replace("on", "");
                                            console.log("found widget : " + f.id + " will register event " + l);
                                            var n = g.on(l, p.hitch(this, function (a) {
                                                console.log("event triggered : " + d.event);
                                                d.onEvent(a)
                                            }));
                                            this._events.push(n)
                                        } else this._subscribe(a,
                                            this.onEvent, f)
                                    } else this._subscribe(a, this.onEvent, f)
                                }
                                console.log("objects found : ", b)
                            } else this._subscribe(a, this.onEvent)
                        } catch (r) {
                            logError(r, "registering event failed")
                        }
                        this._didSubscribe = a
                    },
                    onLoad: function () {
                        this._onLoaded = !0;
                        this.event && this.event.length && this.enabled && this._registerEvent(this.event)
                    },
                    updateEventSelector: function (a, c) {
                        var d = [];
                        if (a && a.length)for (var d = [{label: "onclick", value: "onclick"}, {
                            label: "ondblclick",
                            value: "ondblclick"
                        }, {label: "onmousedown", value: "onmousedown"}, {
                            label: "onmouseup",
                            value: "onmouseup"
                        }, {label: "onmouseover", value: "onmouseover"}, {
                            label: "onmousemove",
                            value: "onmousemove"
                        }, {label: "onmouseout", value: "onmouseout"}, {
                            label: "onkeypress",
                            value: "onkeypress"
                        }, {label: "onkeydown", value: "onkeydown"}, {
                            label: "onkeyup",
                            value: "onkeyup"
                        }, {label: "onfocus", value: "onfocus"}, {label: "onblur", value: "onblur"}, {
                            label: "onchange",
                            value: "onchange"
                        }], e = 0; e < d.length; e++) {
                            var f = d[e];
                            if (f.value === this.event) {
                                f.selected = !0;
                                break
                            }
                        } else d = this.scope.getEventsAsOptions(this.event);
                        for (e = 0; e < c.length; e++)if (f =
                                c[e], f.widget && "Event" === f.widget.title) {
                            e = f._widget;
                            e.nativeWidget.set("options", d);
                            e.nativeWidget.reset();
                            e.nativeWidget.set("value", this.event);
                            this.publish(b.EVENTS.RESIZE, {});
                            break
                        }
                    },
                    onReferenceChanged: function (a, b) {
                        this._destroy();
                        this.reference = a;
                        var c = this.resolveReference(this.deserialize(a));
                        this.updateEventSelector(c, b);
                        this._registerEvent(this.event)
                    },
                    onChangeField: function (a, b, c) {
                        "event" == a && (this._destroy(), this._onLoaded && (this.event = b, this._registerEvent(b)));
                        if ("reference" == a)this.onReferenceChanged(b,
                            c);
                        this.inherited(arguments)
                    },
                    activate: function () {
                        this._destroy();
                        this._registerEvent(this.event)
                    },
                    deactivate: function () {
                        this._destroy()
                    },
                    _destroy: function () {
                        this._events || (this._events = []);
                        _.each(this._events, dojo.unsubscribe);
                        this.unsubscribe(this.event, this.onEvent);
                        this._lastResult = null;
                        this._didSubscribe = !1
                    }
                })
            })
        }, "xblox/model/Referenced": function () {
            define(["dcl/dcl", "dojo/_base/declare", "xide/mixins/ReferenceMixin", "xide/utils"], function (e, p, l, n) {
                var d = {
                    reference: null, deserialize: function (b) {
                        if (!b ||
                            0 == b.length)return {};
                        try {
                            return n.fromJson(b)
                        } catch (a) {
                            return {}
                        }
                    }
                };
                p = p("xblox.model.Referenced", [l], d);
                p.dcl = e(l.dcl, d);
                return p
            })
        }, "xide/mixins/ReferenceMixin": function () {
            define(["dcl/dcl", "dojo/_base/declare", "xide/types", "xide/utils", "xide/registry"], function (e, p, l, n, d) {
                function b(a, b) {
                    var d = a.document.getElementById(b);
                    return d ? d : null
                }

                n.find = function (a, b, d) {
                    return (a = $(b).find(a)) && 0 < a.length ? !1 === d ? a : a[0] : null
                };
                var a = {
                    _targetReference: null,
                    getTarget: function () {
                        return this._targetReference || this.inherited(arguments)
                    },
                    skipWidgetCSSClasses: "dijitButtonHover dijitHover dijit dijitInline dijitReset dijitCheckBoxChecked dijitChecked dijitLeft".split(" "),
                    _cssClassesToQuery: function (a) {
                        var b = "";
                        if (a) {
                            a = a.split(" ");
                            for (var d = 0; d < a.length; d++)-1 < n.contains(this.skipWidgetCSSClasses, a[d]) || -1 < a[d].toLowerCase().indexOf("hover") || (b += "" + a[d])
                        }
                        return b.trim()
                    },
                    resolveReference: function (a, c) {
                        var g = null;
                        try {
                            g = this.getTarget()
                        } catch (p) {
                            return logError(p), null
                        }
                        var q = this.scope, k = a.reference;
                        if (!(a && k && k.length) && g)return [g];
                        switch (a.mode) {
                            case l.WIDGET_REFERENCE_MODE.BY_ID:
                                if (this.scope && this.scope.document) {
                                    g = [];
                                    if (-1 !== k.indexOf(" "))for (var k = k.split(" "), m = 0; m < k.length; m++) {
                                        var h = b(q, k[m]);
                                        h && g.push(h)
                                    } else return [b(q, k)];
                                    return g
                                }
                                q = d.byId(k);
                                g = "undefined" !== typeof document ? document.getElementById(k) : null;
                                if (q || g)return q ? [q] : [g];
                                break;
                            case l.WIDGET_REFERENCE_MODE.BY_CLASS:
                                if (q = dojo.getObject(k) || e.getObject(k))return [q];
                                break;
                            case l.WIDGET_REFERENCE_MODE.BY_CSS:
                                q = this._cssClassesToQuery(k);
                                this._parseString && (q =
                                    this._parseString(q, c, null, c && c.flags ? c.flags : l.CIFLAG.EXPRESSION) || q);
                                g = null;
                                this.scope && this.scope.global && this.scope.global.$ ? g = this.scope.global.$ : "undefined" !== typeof $ && (g = $);
                                if (g && (g = g(q)))return g;
                                if (q = n.find(q, null, !1))return q
                        }
                        return null
                    }
                };
                p = p("xblox.model.ReferenceMixin", null, a);
                p.dcl = e(null, a);
                return p
            })
        }, "xwire/_Base": function () {
            define(["dcl/dcl", "xide/mixins/EventedMixin"], function (e, p) {
                function l(d, b) {
                    for (var a = n(b), e = 0, c = a.length; e < c; ++e) {
                        var g = a[e];
                        d = null == d ? d : d[g]
                    }
                    return d
                }

                function n(d,
                           b) {
                    return "" === d ? [] : "function" !== typeof d.splice ? d.split(".") : b ? d.slice() : d
                }

                return e([p.dcl], {
                    declaredClass: "xwire._Base", constructor: function (d) {
                        for (var b in d)d.hasOwnProperty(b) && (this[b] = d[b])
                    }, getValue: function (d, b) {
                        return l(d, b)
                    }, setValue: function (d, b, a) {
                        var e = n(b, !0), c = e.pop();
                        d = 0 < e.length ? l(d, e) : d;
                        return Object(d) === d && b ? "function" === typeof d.set ? d.set(c, a) : d[c] = a : void 0
                    }
                })
            })
        }, "xblox/model/events/OnKey": function () {
            define("dcl/dcl dojo/_base/lang dojo/_base/array dojo/Deferred xblox/model/Block xide/utils xide/types xide/mixins/EventedMixin xblox/model/Referenced xblox/model/Contains xblox/model/events/OnEvent xide/registry dojo/on".split(" "),
                function (e, p, l, n, d, b, a, f, c, g, r, q, k) {
                    return e([d, f.dcl, c.dcl, g], {
                        declaredClass: "xblox.model.events.OnKey",
                        name: "On Key",
                        event: "",
                        reference: "",
                        references: null,
                        description: "Triggers when a keyboard sequence " + this.event + " has been entered",
                        listeners: null,
                        sharable: !0,
                        toText: function () {
                            var a = this.getBlockIcon() + " " + this.name + " :: ";
                            this.event && (a += this.event);
                            return a
                        },
                        canAdd: function () {
                            return []
                        },
                        getFields: function () {
                            var c = this.inherited(arguments) || this.getDefaultFields();
                            c.push(b.createCI("Keyboard Sequence",
                                a.ECIType.STRING, this.event, {
                                    group: "General",
                                    dst: "event",
                                    value: this.event,
                                    intermediateChanges: !1
                                }));
                            c.push(b.createCI("Object/Widget", a.ECIType.WIDGET_REFERENCE, this.reference, {
                                group: "General",
                                dst: "reference",
                                value: this.reference
                            }));
                            return c
                        },
                        getBlockIcon: function () {
                            return '\x3cspan class\x3d"fa-keyboard-o"\x3e\x3c/span\x3e'
                        },
                        onEvent: function (a) {
                            this._lastResult = a;
                            this.solve(this.scope, this._lastRunSettings)
                        },
                        _addListerner: function (a, b, c) {
                            null == this.listeners && (this.listeners = []);
                            var d = null, d = new window.keypress.Listener(c,
                                {
                                    is_unordered: !0, prevent_repeat: !1, prevent_default: !1, on_keyup: function (a) {
                                    console.log("up")
                                }, on_keydown: function (a) {
                                    console.log("down")
                                }, on_release: function (a) {
                                    console.log("release")
                                }
                                });
                            d.simple_combo(a, function (a) {
                                b && b(arguments)
                            });
                            this.listeners.push(d)
                        },
                        _subscribe: function (a, b, c) {
                            a && (c && c.domNode && (c = c.domNode), this._addListerner(a, b, c))
                        },
                        _registerEvent: function (a) {
                            if (a && a.length) {
                                var b = this.resolveReference(this.deserialize(this.reference)), c = this;
                                if (b && b.length)for (var d = 0; d < b.length; d++) {
                                    var e =
                                        b[d];
                                    if (e && e.id) {
                                        var f = q.byId(e.id);
                                        f = null, this._subscribe(a, function () {
                                            c.onEvent(arguments)
                                        }, e)
                                    } else this._subscribe(a, function () {
                                        c.onEvent(arguments)
                                    }, e)
                                } else this._subscribe(a, function () {
                                    c.onEvent(arguments)
                                })
                            }
                        },
                        onLoad: function () {
                            this._onLoaded = !0;
                            this.event && this.event.length && this.enabled && this._registerEvent(this.event)
                        },
                        destroy: function () {
                            this.inherited(arguments)
                        },
                        updateEventSelector: function (b, c) {
                            var d = [];
                            if (b && b.length)for (var d = [{label: "onclick", value: "onclick"}, {
                                label: "ondblclick",
                                value: "ondblclick"
                            },
                                {label: "onmousedown", value: "onmousedown"}, {
                                    label: "onmouseup",
                                    value: "onmouseup"
                                }, {label: "onmouseover", value: "onmouseover"}, {
                                    label: "onmousemove",
                                    value: "onmousemove"
                                }, {label: "onmouseout", value: "onmouseout"}, {
                                    label: "onkeypress",
                                    value: "onkeypress"
                                }, {label: "onkeydown", value: "onkeydown"}, {
                                    label: "onkeyup",
                                    value: "onkeyup"
                                }, {label: "onfocus", value: "onfocus"}, {
                                    label: "onblur",
                                    value: "onblur"
                                }, {label: "onchange", value: "onchange"}], e = 0; e < d.length; e++) {
                                var f = d[e];
                                if (f.value === this.event) {
                                    f.selected = !0;
                                    break
                                }
                            } else d =
                                this.scope.getEventsAsOptions(this.event);
                            for (e = 0; e < c.length; e++)if (f = c[e], f.widget && "Event" === f.widget.title) {
                                e = f._widget;
                                e.nativeWidget.set("options", d);
                                e.nativeWidget.reset();
                                e.nativeWidget.set("value", this.event);
                                this.publish(a.EVENTS.RESIZE, {});
                                break
                            }
                        },
                        onReferenceChanged: function (a, b) {
                            this._destroy();
                            this.reference = a;
                            this.resolveReference(this.deserialize(a));
                            this._registerEvent(this.event)
                        },
                        onChangeField: function (a, b, c) {
                            "event" == a && (this._destroy(), this._onLoaded && (this.event = b, this._registerEvent(b)));
                            if ("reference" == a)this.onReferenceChanged(b, c);
                            this.inherited(arguments)
                        },
                        activate: function () {
                            this._destroy();
                            this._registerEvent(this.event)
                        },
                        deactivate: function () {
                            this._destroy()
                        },
                        _destroy: function () {
                            if (this.listeners)for (var a = 0; a < this.listeners.length; a++) {
                                var b = this.listeners[a];
                                b.stop_listening();
                                var c = b.get_registered_combos();
                                c && b.unregister_many(c);
                                b.reset();
                                console.log("did destroy listener")
                            }
                            this.listeners = []
                        },
                        onFieldsRendered: function (a, b) {
                        }
                    })
                })
        }, "xblox/model/mqtt/Subscribe": function () {
            define("dcl/dcl xdojo/has xblox/model/Block xide/utils xblox/model/Contains xide/types".split(" "),
                function (e, p, l, n, d, b, a, f) {
                    p = "undefined" !== typeof window ? window.console : global.console;
                    a && p && p.error && (p = f);
                    return e([l, d], {
                        declaredClass: "xblox.model.mqtt.Subscribe",
                        name: "Subscribe",
                        topic: "Topic",
                        args: "",
                        deferred: !1,
                        sharable: !0,
                        context: null,
                        icon: "fa-bell",
                        path: "",
                        qos: 0,
                        stop: function () {
                            var a = this.getInstance();
                            a && a.callMethod("unSubscribeTopic", n.mixin({topic: this.topic}, n.getJson(this.args)), this.id, this.id)
                        },
                        onData: function (a) {
                            if (a && a.topic && a.topic == this.topic) {
                                delete a.src;
                                delete a.id;
                                var b = this[this._getContainer()],
                                    d = this._lastSettings, e = [];
                                if (0 < b.length) {
                                    var b = a, f = this.path && this.path.length ? this.path : null !== a.payload ? "payload" : null;
                                    f && _.isObject(a) && (b = n.getAt(a, f, a));
                                    for (a = 0; a < this.items.length; a++)f = this.items[a], f.enabled && (f.override = {args: [b]}, e.push(f.solve(this.scope, d)))
                                }
                                this.onSuccess(this, this._lastSettings);
                                return e
                            }
                        },
                        observed: ["topic"],
                        getContext: function () {
                            return this.context || (this.scope.getContext ? this.scope.getContext() : this)
                        },
                        solve: function (a, b) {
                            this._currentIndex = 0;
                            this._return = [];
                            this._lastSettings =
                                b;
                            var d = this.getInstance();
                            d && d.callMethod("subscribeTopic", n.mixin({
                                topic: this.topic,
                                qos: this.qos
                            }, n.getJson(this.args || "{}")), this.id, this.id);
                            b = b || {};
                            this.onRunThis(b)
                        },
                        toText: function () {
                            var a = '\x3cspan style\x3d""\x3e' + this.getBlockIcon() + "" + this.makeEditable("topic", "bottom", "text", "Enter a topic", "inline") + " :: \x3c/span\x3e";
                            this.topic && (a += this.topic.substr(0, 30));
                            return a
                        },
                        canAdd: function () {
                            return []
                        },
                        getFields: function () {
                            var a = this.inherited(arguments) || this.getDefaultFields();
                            a.push(n.createCI("name",
                                13, this.name, {group: "General", title: "Name", dst: "name"}));
                            a.push(n.createCI("arguments", 27, this.args, {
                                group: "Arguments",
                                title: "Arguments",
                                dst: "args"
                            }));
                            a.push(n.createCI("topic", b.ECIType.STRING, this.topic, {
                                group: "General",
                                title: "Topic",
                                dst: "topic",
                                select: !0
                            }));
                            a.push(n.createCI("name", b.ECIType.ENUMERATION, this.qos, {
                                group: "General",
                                title: "QOS",
                                dst: "qos",
                                widget: {
                                    options: [{label: "0 - at most once", value: 0}, {
                                        label: "1 - at least once",
                                        value: 1
                                    }, {label: "2 - exactly once", value: 2}]
                                }
                            }));
                            a.push(n.createCI("path",
                                b.ECIType.STRING, this.path, {group: "General", title: "Value Path", dst: "path"}));
                            return a
                        }
                    })
                })
        }, "xblox/model/mqtt/Publish": function () {
            define(["dcl/dcl", "xdojo/has", "xide/utils", "xide/types", "xcf/model/Command"], function (e, p, l, n, d, b, a) {
                p = "undefined" !== typeof window ? window.console : global.console;
                b && p && p.error && (p = a);
                return e(d, {
                    declaredClass: "xblox.model.mqtt.Publish",
                    name: "Publish",
                    topic: "",
                    args: "",
                    deferred: !1,
                    sharable: !0,
                    context: null,
                    icon: "fa-send",
                    isCommand: !0,
                    qos: 0,
                    retain: !1,
                    path: null,
                    onData: function (a) {
                        if (a &&
                            a.topic && a.topic == this.topic) {
                            this.getContext();
                            var b = this[this._getContainer()], d = this._lastSettings, e = [];
                            if (0 < b.length)for (b = a, (this.path = "value", _.isObject(a)) && (b = l.getAt(a, this.path, a)), a = 0; a < this.items.length; a++) {
                                var n = this.items[a];
                                n.enabled && (n.override = {args: [b]}, e.push(n.solve(this.scope, d)))
                            }
                            this.onSuccess(this, this._lastSettings);
                            return e
                        }
                    },
                    observed: ["topic"],
                    getContext: function () {
                        return this.context || (this.scope.getContext ? this.scope.getContext() : this)
                    },
                    solve: function (a, b, d) {
                        this._currentIndex =
                            0;
                        this._return = [];
                        b = this._lastSettings = b || this._lastSettings;
                        var e = this.getInstance();
                        1 == d && this._loop && this.reset();
                        d = this.args;
                        var n = this.getArgs(b);
                        n[0] && (d = n[0]);
                        e && (d = l.getJson(d, !0, !1), null !== d && 0 !== d && !0 !== d && !1 !== d && _.isObject(d) || (d = {payload: this.args}), a = a.expressionModel.replaceVariables(a, this.topic, !1, !1), e.callMethod("publishTopic", l.mixin({
                            topic: a,
                            qos: this.qos,
                            retain: this.retain
                        }, d), this.id, this.id));
                        b = b || {};
                        this.onDidRun();
                        this.onSuccess(this, b);
                        return !0
                    },
                    toText: function (a) {
                        a = '\x3cspan style\x3d""\x3e' +
                            this.getBlockIcon() + " " + this.makeEditable("name", "top", "text", "Enter a name", "inline") + " :: \x3c/span\x3e";
                        this.topic && (a += this.makeEditable("topic", "bottom", "text", "Enter a topic", "inline"), this.startup && (a += this.getIcon("fa-bell inline-icon text-warning", "text-align:right;float:right;", "")), 0 < this.interval && (a += this.getIcon("fa-clock-o inline-icon text-warning", "text-align:right;float:right", "")));
                        return a
                    },
                    canAdd: function () {
                        return []
                    },
                    getFields: function () {
                        var a = this.inherited(arguments) || this.getDefaultFields();
                        a.push(l.createCI("qos", n.ECIType.ENUMERATION, this.qos, {
                            group: "General",
                            title: "QOS",
                            dst: "qos",
                            widget: {
                                options: [{label: "0 - at most once", value: 0}, {
                                    label: "1 - at least once",
                                    value: 1
                                }, {label: "2 - exactly once", value: 2}]
                            }
                        }));
                        a.push(l.createCI("arguments", 27, this.args, {
                            group: "Arguments",
                            title: "Arguments",
                            dst: "args"
                        }));
                        a.push(l.createCI("topic", n.ECIType.STRING, this.topic, {
                            group: "General",
                            title: "Topic",
                            dst: "topic",
                            select: !0
                        }));
                        a.push(l.createCI("retain", n.ECIType.BOOL, this.retain, {
                            group: "General", title: "Retain",
                            dst: "retain"
                        }));
                        a.remove(_.find(a, {name: "send"}));
                        a.remove(_.find(a, {name: "waitForResponse"}));
                        return a
                    }
                })
            })
        }, "xblox/model/File/ReadJSON": function () {
            define("dcl/dcl dojo/Deferred xblox/model/Block xide/utils xblox/model/Contains xide/types xdojo/has!xblox-ui?xfile/data/DriverStore xdojo/has!xblox-ui?xfile/views/FileGridLight".split(" "), function (e, p, l, n, d, b, a, f) {
                function c(b, c, d) {
                    return new a({
                        data: [],
                        config: {},
                        mount: "none",
                        options: c,
                        driver: d,
                        micromatch: "(*.json)|!(*.*)",
                        glob: b
                    })
                }

                return e([l, d], {
                    declaredClass: "xblox.model.File.ReadJSON",
                    name: "Read JSON",
                    deferred: !1,
                    sharable: !1,
                    context: null,
                    icon: "fa-file",
                    observed: ["path"],
                    getContext: function () {
                        return this.context || (this.scope.getContext ? this.scope.getContext() : this)
                    },
                    getFileContent: function (a) {
                        return this.getScope().ctx.getDeviceManager().getInstanceByName("File-Server").callCommand("GetProg", {override: {args: [a]}})
                    },
                    processJSON: function (a, c) {
                        var d = this.jsonPath;
                        this._lastResult = d ? n.getAt(a, d) : a;
                        this.onSuccess(this, c);
                        this.runByType(b.BLOCK_OUTLET.FINISH, c)
                    },
                    solve: function (a, b, c,
                                     d, e) {
                        this._currentIndex = 0;
                        this._return = [];
                        b = this._lastSettings = b || this._lastSettings || {};
                        c = "" + this._get("path");
                        var f = new p, l = this;
                        this.onRunThis(b);
                        a = a.expressionModel.replaceVariables(a, c, null, null);
                        this.getFileContent(a).then(function (a) {
                            (a = a.content) && (a = n.getJson(a, !0)) && l.processJSON(a, b)
                        }.bind(this));
                        try {
                            d && d("Expression " + c + " evaluates to " + a)
                        } catch (w) {
                            this.onDidRunItemError(f, w, b), this.onFailed(this, b), e && e("invalid expression : \n" + c + ": " + w)
                        }
                        return f
                    },
                    toText: function () {
                        var a = '\x3cspan style\x3d""\x3e' +
                            this.getBlockIcon() + " " + this.name + " :: \x3c/span\x3e";
                        this.path && (a += this.path.substr(0, 50));
                        return a
                    },
                    canAdd: function () {
                        return []
                    },
                    getFields: function () {
                        var d = this.inherited(arguments) || this.getDefaultFields(), e = this.getScope().ctx, l = e.getDeviceManager().getInstanceByName("File-Server"), k = n.clone(b.DEFAULT_FILE_GRID_PERMISSIONS);
                        l && a && (e = {
                            ctx: e,
                            owner: this,
                            selection: "/",
                            resizeToParent: !0,
                            Module: f,
                            permissions: k
                        }, k = {
                            fields: b.FIELDS.SHOW_ISDIR | b.FIELDS.SHOW_OWNER | b.FIELDS.SHOW_SIZE | b.FIELDS.SHOW_FOLDER_SIZE |
                            b.FIELDS.SHOW_MIME | b.FIELDS.SHOW_PERMISSIONS | b.FIELDS.SHOW_TIME | b.FIELDS.SHOW_MEDIA_INFO
                        }, e.leftStore = c("/*", k, l), e.rightStore = c("/*", k, l), d.push(n.createCI("path", 4, this.path, {
                            group: "General",
                            title: "Path",
                            dst: "path",
                            filePickerOptions: e,
                            widget: {item: this}
                        })));
                        d.push(n.createCI("jsonPath", 13, this.jsonPath, {
                            group: "General",
                            title: "Select",
                            dst: "jsonPath"
                        }));
                        return d
                    }
                })
            })
        }, "xcf/factory/Blocks": function () {
            define("xblox/factory/Blocks xcf/model/Command xblox/model/functions/CallBlock xblox/model/functions/StopBlock xblox/model/functions/PauseBlock xide/factory".split(" "),
                function (e, p, l, n, d, b) {
                    return e ? (e._getCommandBlocks = function (a, b, c, e) {
                        var r = [];
                        r.push({
                            name: "Commands",
                            iconClass: "el-icon-random",
                            items: [{
                                name: "Call Command",
                                owner: b,
                                iconClass: "el-icon-video",
                                proto: l,
                                target: c,
                                ctrArgs: {scope: a, group: e, condition: ""}
                            }, {
                                name: "Stop Command",
                                owner: b,
                                iconClass: "el-icon-video",
                                proto: n,
                                target: c,
                                ctrArgs: {scope: a, group: e, condition: ""}
                            }, {
                                name: "Pause Command",
                                owner: b,
                                iconClass: "el-icon-video",
                                proto: d,
                                target: c,
                                ctrArgs: {scope: a, group: e, condition: ""}
                            }, {
                                name: "New Command",
                                owner: b,
                                iconClass: "el-icon-video",
                                proto: p,
                                target: c,
                                ctrArgs: {scope: a, group: e, condition: "", name: "No-Title"}
                            }]
                        });
                        return r
                    }, e) : b
                })
        }, "nxapp/manager/TestManager": function () {
            define("dcl/dcl dojo/node!fs xcf/manager/DeviceManager xide/utils xide/types nxapp/utils/_console nxapp/utils dojo/node!child_process nxapp/manager/ManagerBase require xide/mixins/ReloadMixin dojo/node!path xdojo/has".split(" "), function (e, p, l, n, d, b, a, f, c, g, r, q, k) {
                function m() {
                    h.clear();
                    g(["intern/lib/executors/PreExecutorEmbedded", "intern/lib/reporters/Console"],
                        function (a, b) {
                            var c = new a({
                                executorId: "client",
                                config: n.mixin(t, {suites: ["tests/devices/all"]}),
                                defaultLoaderOptions: dojoConfig
                            });
                            try {
                                h.error("run tests"), c.run(function (a) {
                                    h.error("did tests ", a)
                                }), g.undef("tests/devices/all")
                            } catch (d) {
                                h.error("error running tests ", d)
                            }
                        })
                }

                var h = b, t = {
                    proxyPort: 9E3,
                    proxyUrl: "http://localhost:9000/",
                    tunnel: "NullTunnel",
                    capabilities: {name: "dojo-loader", project: "Dojo 2", fixSessionCapabilities: !1},
                    environments: [{
                        browserName: "internet explorer", version: ["9.0", "10.0", "11.0"],
                        platform: "Windows 7"
                    }, {browserName: "firefox", platform: "Windows 10"}, {
                        browserName: "chrome",
                        platform: "Windows 10"
                    }, {browserName: "safari", version: "9", platform: "OS X 10.11"}, {
                        browserName: "android",
                        platform: "Linux",
                        version: "4.4",
                        deviceName: "Google Nexus 7 HD Emulator"
                    }],
                    maxConcurrency: 2,
                    loaderOptions: {
                        packages: [{name: "dojo", location: "./node_modules/dojo"}, {
                            name: "dijit",
                            location: "dijit"
                        }, {name: "dgrid", location: "dgrid"}, {name: "dstore", location: "dstore"}, {
                            name: "xide",
                            location: "xide"
                        }, {name: "xfile", location: "xfile"},
                            {name: "dojox", location: "dojox"}, {name: "xdojo", location: "xdojo"}, {
                                name: "xgrid",
                                location: "xgrid"
                            }, {name: "xblox", location: "xblox"}, {
                                name: "xdocker",
                                location: "xdocker"
                            }, {name: "wcDocker", location: "wcDocker/src"}, {
                                name: "dcl",
                                location: "./node_modules/dcl"
                            }, {name: "tests", location: "tests"}]
                    },
                    excludeInstrumentation: /(?:node_modules|bower_components|tests)[\/\\]/,
                    suites: ["tests/all"],
                    functionalSuites: [],
                    reporters: [{
                        id: "tests/ConsoleEmbedded", delegate: {
                            onStart: function (a) {
                                h.error("on start " + a.name)
                            }, onFail: function (a) {
                                h.error("on fail " +
                                    a.name)
                            }, onEnd: function (a) {
                                h.error("on start " + a.name)
                            }
                        }
                    }, {id: "JUnit", filename: "report.xml"}]
                };
                (p = global.sctx) && p.getTestManager();
                return e([c, r.dcl], {
                    declaredClass: "nxapp.manager.TestManager", connection: null, test1: function () {
                        return "   ha"
                    }, loadFixtures: function () {
                        q.resolve("./tests/")
                    }, onReloaded: function () {
                        h.error("on reloaded")
                    }, doTests: function () {
                    }, init: function () {
                        this.subscribe(d.EVENTS.ON_MODULE_RELOADED, function (a) {
                            -1 !== a.module.indexOf("tests/devices") && a.module.indexOf(".js") && (g.undef("tests/devices/Minimal"),
                                m())
                        })
                    }
                })
            })
        }, "nxappmain/main_export": function () {
            require("dojo/node!path dojo/node!fs dojo/node!util dojo/node!vm nxapp/Commons nxapp/Logger nxapp/utils/_console xide/utils nxappmain/nxAppExport nxapp/manager/ExportManager nxapp/model/ExportOptions xide/types require".split(" "), function (e, p, l, n, d, b, a, f, c, g, r, q, k) {
                e = new c({commander: null});
                e.init();
                e = e.profile;
                a.log("export " + e.user + " and system data:  " + e.system);
                new r(e);
                (new g).initWithOptions(e)
            })
        }, "nxapp/Logger": function () {
            define(["dcl/dcl", "xide/types",
                "xide/factory", "dojo/node!winston", "nxapp/utils/_console"], function (e, p, l, n, d) {
                return e(null, {
                    declaredClass: "nxapp.Logger",
                    fileLogger: null,
                    loggly: null,
                    delegate: null,
                    publishLog: !1,
                    loggers: {},
                    constructor: function (b) {
                        for (var a in arguments)arguments.hasOwnProperty(a) && (this[a] = b[a])
                    },
                    createLogger: function (b) {
                        var a = new n.Logger({transports: [new n.transports.File(b)]});
                        if (this.publishLog)a.on("logging", function (a, c, d, e) {
                            e.logId = b.filename;
                            a = {level: c, message: d, data: e, time: (new Date).getTime()};
                            l.publish(p.EVENTS.ON_SERVER_LOG_MESSAGE,
                                a)
                        });
                        return a
                    },
                    log: function () {
                        return this.logger.log.apply(this.logger, arguments)
                    },
                    verbose: function () {
                        return this.logger.verbose.apply(this.logger, arguments)
                    },
                    info: function () {
                        return this.logger.info.apply(this.logger, arguments)
                    },
                    start: function (b) {
                        this.loggers = {};
                        this.options = b;
                        this.logger = new n.Logger({transports: [new n.transports.Console({level: "debug"})]});
                        this.logger.transports.console.level = "debug";
                        this.logger.on("logging", function (a, b, c, d) {
                        })
                    }
                })
            })
        }, "nxappmain/nxAppExport": function () {
            define("dcl/dcl nxapp/utils/FileUtils dojo/node!commander dojo/node!fs dojo/node!os dojo/node!path xide/factory/Events dojo/has xide/model/Base xide/utils nxappmain/nxAppBase".split(" "),
                function (e, p, l, n, d, b, a, f, c, g, r) {
                    f.add("windows", function () {
                        return "win32" === d.platform()
                    });
                    f.add("osx", function () {
                        return "darwin" === d.platform()
                    });
                    f.add("linux", function () {
                        return "linux" === d.platform()
                    });
                    f.add("arm", function () {
                        return "arm" === d.arch()
                    });
                    return e(r, {
                        declaredClass: "nxappmain.nxAppExport",
                        profilePath: "/nxappmain/profile_device_server.json",
                        init: function () {
                            this.commander || (l.version("0.0.1").option("-f, --file \x3cpath\x3e", "run a file").option("-r, --root \x3cpath\x3e", "root path to Control-Freak").option("-u, --user \x3cpath\x3e",
                                "user directory").option("-t, --target \x3cpath\x3e", "target directory").option("-s, --system \x3cname\x3e", "path to system scope location").option("-d, --dist \x3cpath\x3e", "path to the pre-compiled NodeJS servers").option("--windows \x3cboolean\x3e", "true/false to export windows NodeJS server").option("--osx \x3cboolean\x3e", "true/false to export OSX NodeJS server").option("--linux32 \x3cboolean\x3e", "true/false to export Linux-32 Bit NodeJS server").option("--linux64 \x3cboolean\x3e", "true/false to export Linux-64 NodeJS server").option("--arm \x3cboolean\x3e",
                                "true/false to export ARM-v7 NodeJS server").option("--client \x3cstring\x3e", "path to client root"), this.commander = l, this.commander.allowUnknownOption(!0), this.commander.parse(process.argv));
                            if (l.jhelp) {
                                var a = [];
                                l.options.map(function (b) {
                                    a.push(b)
                                });
                                console.log(JSON.stringify(a));
                                process.exit()
                            }
                            this.profile = this.getProfile(this.profilePath);
                            l.root || (this.profile.root = p.resolve("../.."));
                            l.target || (this.profile.target = p.resolve("../../myapp"));
                            g.mixin(this.profile, this.commander);
                            var c = b.resolve(this.profile.system);
                            n.existsSync(c) ? this.profile.system = c : (c = process.cwd() + "/data/system", this.profile.system = c, l.system = c)
                        }
                    })
                })
        }, "nxapp/model/ExportOptions": function () {
            define(["dcl/dcl", "xide/model/Base", "xide/mixins/EventedMixin", "xide/encoding/MD5", "xide/utils"], function (e, p, l, n, d) {
                return e([p.dcl, l.dcl], {
                    connected: !1,
                    __registered: !1,
                    declaredClass: "nxapp/model/ExportOptions",
                    toString: function () {
                        var b = this.options;
                        return b.deviceScope + "://" + b.host + ":" + b.port + "@" + b.protocol
                    },
                    constructor: function (b) {
                        this.options = b
                    }
                })
            })
        },
        "nxappmain/main_server": function () {
            require("dojo/node!readline nxapp/Commons xide/types nxapp/utils/TCPUtils nxappmain/nxAppBase nxapp/manager/DeviceServerContext nxapp/client/WebSocket xlog/Server dojo/node!winston dojo/node!path dojo/node!fs dojo/node!util dojo/node!vm nxapp/manager/MQTTManager nxapp/Commons nxapp/utils/FileUtils nxapp/Logger nxapp/utils/_console require dojo/node!tcp-port-used".split(" "), function (e, p, l, n, d, b, a, f, c, g, r, q, k, m, h, t, w, u, x, v) {
                global.dojoRequire = x;
                p = {
                    filename: "all.log",
                    dirname: dojoConfig.logRoot, json: !0
                };
                var B = new f({});
                B.start({fileLogger: p, console: null});
                var y = new d({commander: null}), E, J, G;
                y.init();
                var D = y.profile;
                d = y.commander;
                if (d.diagnose) {
                    console.error("run diagnose");
                    console.log("loaded modules: ", null !== global.nRequire.cache);
                    for (var z in global.nRequire.cache)console.log(z)
                } else {
                    if (d.modules) {
                        k = ["/nxappmain/server", "/nxappmain/dojoConfig", "/dojo/dojo", "/dojo/_base/configNode"];
                        t = "";
                        v = 0;
                        for (z in global.nRequire.cache)b = z.replace(process.cwd(), "").replace(g.sep +
                            "node_modules" + g.sep, "").replace(".js", ""), -1 === k.indexOf(b) && (t += "var a_" + v + ' \x3d require("' + b + '");\n', v++);
                        console.log(t);
                        return t
                    }
                    if (d.file) {
                        g = g.resolve(d.file);
                        if (r.existsSync(g)) {
                            z = new k.createContext({
                                require: x.nodeRequire,
                                commander: d,
                                console: console,
                                process: process,
                                setTimeout: setTimeout,
                                global: global
                            });
                            g = t.readFile(g);
                            (new k.Script(g)).runInContext(z);
                            return
                        }
                        console.error("file specified but doesnt exists " + d.file)
                    }
                    d.port && (D.socket_server.port = d.port);
                    d.host && (D.socket_server.host = d.host);
                    if (y.commander.info)console.log(JSON.stringify({
                        host: "http://" + y.profile.socket_server.host,
                        port: y.profile.socket_server.port
                    })), process.exit(); else {
                        var C = new b;
                        C.profile = D;
                        C.constructManagers();
                        C.initManagers(D);
                        C.logManager = B;
                        g = new m({ctx: C, profile: D});
                        g.init(D);
                        C.connectionManager.mqttManager = g;
                        C.mqttManager = g;
                        var I = null, A = function () {
                            var b = new a;
                            b.init({
                                options: {
                                    host: "http://" + y.profile.socket_server.host,
                                    port: y.profile.socket_server.port,
                                    debug: y.profile.debug
                                }
                            });
                            b.connect();
                            b.onSignal(l.SIGNAL_RESPONSE,
                                function (a) {
                                    D.common.stdout && process.stdout.write(a + "\n");
                                    y.commander.oneshot && y.commander.command && process.exit()
                                });
                            return b
                        }, H = function () {
                            y.commander.host && (E = y.commander.host);
                            y.commander.port && (J = parseInt(y.commander.port));
                            y.commander.protocol && (G = y.commander.protocol);
                            if (y.commander.driver) {
                                console.error("run in driver mode");
                                var a = A(), b = {
                                    driver: "xcf/driver/SubTest",
                                    host: "192.168.1.20",
                                    port: 23,
                                    protocol: "tcp"
                                }, c = l.SOCKET_SERVER_COMMANDS.SIGNAL_MANAGER;
                                b.manager_command = l.SOCKET_SERVER_COMMANDS.START_DRIVER;
                                c = l.SOCKET_SERVER_COMMANDS.SIGNAL_MANAGER;
                                a.emit(c, b)
                            } else if (y.commander.send) {
                                console.error("sending command");
                                console.error("  create web socket client to control server : http://" + y.profile.socket_server.host + ":" + y.profile.socket_server.port);
                                var a = A(), d = function (b) {
                                    if (null !== a && null != b) {
                                        var c = {
                                            command: b,
                                            host: E,
                                            port: J,
                                            protocol: G
                                        }, d = l.SOCKET_SERVER_COMMANDS.SIGNAL_DEVICE;
                                        "startDriver" == b ? (c.manager_command = l.SOCKET_SERVER_COMMANDS.MANAGER_START_DRIVER, d = l.SOCKET_SERVER_COMMANDS.SIGNAL_MANAGER) :
                                            "status" == b ? (c.manager_command = l.SOCKET_SERVER_COMMANDS.MANAGER_STATUS, d = l.SOCKET_SERVER_COMMANDS.SIGNAL_MANAGER) : "closeall" == b ? (c.manager_command = l.SOCKET_SERVER_COMMANDS.MANAGER_CLOSE_ALL, d = l.SOCKET_SERVER_COMMANDS.SIGNAL_MANAGER) : c.device_command = l.SOCKET_SERVER_COMMANDS.DEVICE_SEND;
                                        a.emit(d, c)
                                    }
                                }, b = function (b) {
                                    if (null !== a && null != b)if (b.indexOf && -1 != b.indexOf(";")) {
                                        b = b.split(";");
                                        for (var c = 0; c < b.length; c++)d(b[c])
                                    } else d(b)
                                };
                                e.createInterface({input: process.stdin, output: process.stdout}).on("line",
                                    function (a) {
                                        null != a && 0 < a.length && (console.log("sending stdin : " + a), d(a))
                                    });
                                "string" == typeof y.commander.command && b(y.commander.command);
                                console.error("Send command. ^C to close connection and quit")
                            }
                        };
                        if (D.common.createSocketServer) {
                            var F = function () {
                                I = n.createDeviceServer(D, C);
                                C.deviceServer = I;
                                C.logger = c;
                                C.deviceServer.logger = c;
                                C.logManager = B
                            };
                            v.check(D.socket_server.port, D.socket_server.host).then(function (a) {
                                a ? (console.log("device server already started"), A()) : (F(), H())
                            }, function (a) {
                                F();
                                H()
                            })
                        } else try {
                            H()
                        } catch (K) {
                            console.error("app crash!")
                        }
                    }
                }
            })
        },
        "nxapp/manager/MQTTManager": function () {
            define("dcl/dcl nxapp/manager/ManagerBase nxapp/utils/_LogMixin nxapp/types/Types dojo/node!mosca dojo/node!mqtt dojo/node!node-notifier dojo/node!colors xide/utils nxapp/utils/_console dojo/node!tcp-port-used".split(" "), function (e, p, l, n, d, b, a, f, c, g, r) {
                return e([p, l], {
                    declaredClass: "nxapp.manager.MQTTManager",
                    options: null,
                    profile: null,
                    lastUpTime: null,
                    mqttClients: null,
                    publishTopic: function (a, b) {
                        var c = {topic: a, payload: JSON.stringify(b), qos: 1};
                        this.server.publish(c,
                            function () {
                            })
                    },
                    createMQTTClient2: function (a, c, d) {
                        var e = a + ":" + c, f = b.connect("mqtt://localhost", {clean: !1, clientId: e}), l = this.ctx;
                        g.log("create mqtt - client for " + e);
                        f.on("connect", function () {
                            g.log("on connected local mqtt client for " + e)
                        });
                        f.on("message", function (b, e) {
                            l.getDeviceServer().broadCastMessage(n.EVENTS.ON_MQTT_MESSAGE, {
                                host: a,
                                port: c,
                                topic: b,
                                message: e.toString(),
                                mqtt: d
                            })
                        });
                        return f
                    },
                    createMQTTClient: function (a, c, d) {
                        a = a + ":" + c;
                        if (this.mqttClients[a])return this.mqttClients[a];
                        if (!this.mqttClients[a])return c =
                            b.connect("mqtt://localhost", {clean: !1, clientId: a}), c.on("connect", function () {
                        }), this.mqttClients[a] = c
                    },
                    onConnectedToDevice: function (a, b, c) {
                    },
                    onWakeup: function () {
                        this.lastUpTime = (new Date).getTime();
                        for (var a = 0; a < this.pool.length; a++) {
                            var b = this.pool[a];
                            b.socket && b.socket.close && b.socket.close();
                            b.socket && b.socket._socket && b.socket._socket.close && b.socket._socket.close()
                        }
                        this.pool = []
                    },
                    init: function (b) {
                        function e() {
                            if (!m.__started) {
                                m.__started = !0;
                                try {
                                    a.notify({
                                        title: "Control-Freak",
                                        message: "All servers up and running, you can start now Control-Freak IDE",
                                        sound: !0,
                                        wait: !0,
                                        open: "file:///"
                                    }, function (a, b) {
                                    })
                                } catch (b) {
                                }
                                g.log(f.green("\n\r\t Device server up and running\n\r \t ***********   You can start Control Freak now  **************\n\r"));
                                m.ctx.onReady()
                            }
                        }

                        this.profile = b;
                        this.lastUpTime = (new Date).getTime();
                        var m = this;
                        this.mqttClients = {};
                        var h = {
                            type: "mongo",
                            url: "mongodb://localhost:27017/mqtt",
                            pubsubCollection: "xcf",
                            mongo: {}
                        };
                        c.mixin(h, this.profile.ascoltatore);
                        var l = {
                            port: 1883,
                            backend: h,
                            persistence: {factory: d.persistence.Mongo, url: "mongodb://localhost:27017/mqtt"}
                        };
                        this.profile.mosca.port && (this.profile.mosca.port = parseInt(this.profile.mosca.port));
                        c.mixin(l, this.profile.mosca);
                        if ("false" === this.profile.mqtt)g.warn("MQTT is disabled, proceed without"), this.server = {}, e(); else try {
                            var n = function () {
                                var a = new d.Server(l);
                                a.on("error", function (a) {
                                    g.error("Unable to connect to Mongo:" + a.message);
                                    e()
                                });
                                a.on("ready", e);
                                a.on("clientConnected", function () {
                                });
                                a.on("clientDisconnected", function () {
                                });
                                m.server = a
                            };
                            r.check(b.socket_server.port, b.socket_server.host).then(function (a) {
                                a ||
                                n()
                            }, function () {
                                n()
                            })
                        } catch (p) {
                            g.error("error starting mosca ", p)
                        }
                    },
                    onTimeout: function (a) {
                    },
                    onClose: function (a) {
                        this.removeConnection(a)
                    },
                    onDrain: function (a) {
                    },
                    onError: function (a, b) {
                    },
                    onData: function (a, b) {
                        throw Error();
                    },
                    onConnect: function (a, b, c, d) {
                        g.log("Connected to " + a + ":" + b + " via " + c, "protocol_messages");
                        a = {device: {host: a, port: b, protocol: c, deviceScope: d}};
                        this.ctx.getDeviceServer().broadCastMessage(n.EVENTS.ON_DEVICE_CONNECTED, a)
                    },
                    onHandle: function (a, b) {
                        this.showDebugMsg("protocol_messages")
                    }
                })
            })
        }
    }
});
define("nxappmain/serverbuild", [], 1);
//# sourceMappingURL=serverbuild.js.map