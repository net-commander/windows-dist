/**
 * @module xideve/delite/_ContextDojo
 */
define([
    "require",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-construct",
    "dojo/query",
    "dojo/Deferred",
    "dojo/promise/all",
    "dojo/_base/connect",
    "dojo/window",
    "xide/factory",
    "xide/types",
    "xide/utils",
    "dojo/has",
    "davinci/model/Path",
    "davinci/Runtime",
    "davinci/Workbench",
    "davinci/library",
    "davinci/ve/metadata",
    "davinci/workbench/Preferences",
    "dojox/html/_base"
], function (require, declare, lang, domConstruct, query, Deferred, all,
             connect, windowUtils, factory, types,utils,has,
             Path, Runtime, Workbench, Library,
             metadata, Preferences) {

    var debugContent = false;
    /**
     *
     * @mixin module:xideve/delite/_ContextDojo
     * @lends module:xideve/delite/Context
     */
    return declare(null, {
        _didDojo: false,
        _reRequire: /\brequire\s*\(\s*\[\s*([\s\S]*?)\s*\]\s*\)/,
        _reModuleId: /[\w.\/]+/g,
        _bootstrapModules:'', // dijit-all hangs FF4 and does not seem to be needed.
        getDojoUrl: function () {
            var loc = Workbench.location();
            if (loc.charAt(loc.length - 1) == '/') {
                loc = loc.substring(0, loc.length - 1);
            }

            if (document && document.getElementsByTagName) {
                var scripts = document.getElementsByTagName("script");
                var rePkg = /dojo(\.xd)?\.js(\W|$)/i;
                for (var i = 0; i < scripts.length; i++) {
                    var src = scripts[i].getAttribute("src");
                    if (!src) {
                        continue;
                    }
                    var m = src.match(rePkg);
                    if (m) {
                        // find out where we came from
                        return loc + "/" + src;
                        // "first Dojo wins"
                    }
                }
            }

        },
        _getLoaderPackages: function () {
            var base = this.getBase(),
                libs = Library.getUserLibs(base),
                dojoBase,
                packages = [];

            // get dojo base path
            libs.some(function (lib) {
                if (lib.id === 'dojo') {
                    dojoBase = new Path(lib.root + '/dojo');
                    return true; // break
                }
                return false;
            });

            // Add namespace for custom widgets
            // FIXME: should add this only when compound widgets are part of the page

            var getWidgetFolder = function () {
                var prefs = Preferences.getPreferences('davinci.ui.ProjectPrefs', base);
                if (!prefs.widgetFolder) {
                    prefs.widgetFolder = "WebContent/lib/custom";
                    Preferences.savePreferences('davinci.ui.ProjectPrefs', base, prefs);
                }

                var folder = prefs.widgetFolder;
                while (folder.length > 1 && (folder.charAt(0) == "." || folder.charAt(0) == "/")) {
                    folder = folder.substring(1);
                }
                return folder;
            };

            libs = libs.concat({id: 'widgets', root: getWidgetFolder()});

            libs.forEach(function (lib) {
                var id = lib.id;
                // since to loader, everything is relative to 'dojo', ignore here
                if (lib.root === undefined || id === 'dojo' || id === 'DojoThemes') {
                    return;
                }
                var root = new Path(lib.root).relativeTo(dojoBase).toString();
                packages.push({name: lib.id, location: root});
            });

            dojo.publish('onGetLoaderPackages', {
                context: this,
                packages: packages,
                base: base
            });
            return packages;
        },
        _setSourcePostLoadRequires: function (source, callback, scope, newHtmlParams) {


            this._bootstrapModules = this.template.bootstrapModules;

            var fileName = source.fileName;

            
            // Remove any SCRIPT elements from model that include dojo.require() syntax
            // With Preview 4, user files must use AMD loader
            source.find({elementType: 'HTMLElement', tag: 'script'}).forEach(function (scriptTag) {
                for (var j = 0; j < scriptTag.children.length; j++) {
                    var text = scriptTag.children[j].getText();
                    if (text.indexOf('dojo.require') >= 0) {
                        scriptTag.parent.removeChild(scriptTag);
                        break;
                    }
                }
            });

            /*
            source.find({elementType: 'HTMLElement', tag: 'style'}).forEach(function (styleTag) {
                console.log('found style element ',styleTag);
            });
            */

            var data = this._parse(source);
            if (this.frameNode) {

                if (!this.getGlobal()) {
                    console.warn("Context._setContent called during initialization");
                }
                // tear down old error message, if any
                query(".loading", this.frameNode.parentNode).orphan();
                // frame has already been initialized, changing content (such as changes from the source editor)
                this._continueLoading(data, callback, this, scope);
            } else {
                // initialize frame
                var dojoUrl;

                /* get the base path, removing the file extension.  the base is used in the library call below
                 *
                 */
                var resourceBase = this.getBase();
                if (!dojoUrl) {
                    // #3839 Theme editor uses dojo from installed lib
                    // pull Dojo path from installed libs, if available
                    var context = this;
                    dojo.some(Library.getUserLibs(resourceBase.toString()), function (lib) {
                        if (lib.id === "dojo") {
                        }
                        return false;
                    }, this);
                    // if still not defined, use app's Dojo (which may cause other issues!)
                    if (!dojoUrl) {
                        dojoUrl = this.getDojoUrl();
                        console.warn("Falling back to use workbench's Dojo in the editor iframe");
                    }
                }

                // Make all custom widget module definitions relative to dojo.js
                var currentFilePath = this.getFullResourcePath();
                var currentFilePathFolder = currentFilePath.getParentPath();
                var dojoPathRelative = new Path(dojoUrl);
                var dojoPath = currentFilePathFolder.append(dojoPathRelative);
                var dojoFolderPath = dojoPath.getParentPath();
                var workspaceUrl = Runtime.getUserWorkspaceUrl();
                for (var i = 0; i < this._customWidgetPackages.length; i++) {
                    var cwp = this._customWidgetPackages[i];
                    var relativePathString = cwp.location.substr(workspaceUrl.length);
                    var relativePath = new Path(relativePathString);
                    cwp.location = relativePath.relativeTo(dojoFolderPath).toString();
                }

                var containerNode = this.containerNode;
                containerNode.style.overflow = "hidden";

                var frameParentNode = dojo.byId('xIFrames') || containerNode;
                this.iframeattrs.style = "display:block;width:100%;height:100%;position:absolute;";
                var frame = domConstruct.create("iframe", this.iframeattrs, frameParentNode);
                $(frame).css('display','none');
                frame.dvContext = this;
                this.frameNode = frame;
                /* this defaults to the base page */
                var realUrl = Workbench.location() + "/";

                /* change the base if needed */

                if (this.baseURL) {
                    realUrl = this.baseURL;
                }

                var doc = frame.contentDocument || frame.contentWindow.document,
                    win = windowUtils.get(doc),
                    subs = {
                        baseUrl: realUrl
                    },
                    thiz = this;

                var _require = require;

                var complete = function(template) {
                    if (dojoUrl) {
                        //subs.dojoUrl = dojoUrl;
                        subs.id = thiz._id;
                    }


                    subs.styles = data.styles || "";

                    subs.SCENE_CSS = fileName.replace('.dhtml','.css');

                    subs.SCENE_CSS = subs.SCENE_CSS.replace('.html','.css');

                    //subs.requireUrl = realUrl + 'ibm-js/requirejs/require.js';
                    utils.mixin(subs,thiz.template.templateVariables);


                    var VFS_GET_URL = thiz.editor.ctx.getResourceManager().getVariable('VFS_GET_URL');
                    var item = thiz.editor.item;
                    subs['APP_CSS'] = VFS_GET_URL + '' + item.mount + '&path=' + encodeURIComponent(subs.SCENE_CSS);
                    subs.path = item.path;
                    subs.mount = item.mount;
                    subs['workspace_user'] = VFS_GET_URL + '' + item.mount + '&path=';

                    //console.log('workspace_user : ' + subs['workspace_user']);
                    /*
                     source.themeCssFiles = [];
                     source.themeCssFiles.push(subs.APP_CSS);

                     if (source.themeCssFiles) { // css files need to be added to doc before body content
                     subs.themeCssFiles = source.themeCssFiles.map(function (file) {
                     return '<link rel="stylesheet" type="text/css" href="' + file + '">';
                     }).join('');
                     }
                     */

                    //console.log('themeCssFiles',subs.themeCssFiles);

                    subs.themeCssFiles = '';

                    //console.error('app css ' + subs['APP_CSS']);

                    window["loading" + thiz._id] = function (parser, htmlUtil) {

                        //console.log('requires ready, loading' + thiz._id);
                        var callbackData = thiz;
                        try {
                            var win = windowUtils.get(doc),
                                body = (thiz.rootNode = doc.body);

                            if (!body) {
                                // Should never get here if domReady! fired?  Try again.
                                thiz._waiting = thiz._waiting || 0;
                                if (thiz._waiting++ < 10) {
                                    setTimeout(window["loading" + thiz._id], 500);
                                    console.log("waiting for doc.body");
                                    return;
                                }
                                throw "doc.body is null";
                            }
                            delete window["loading" + thiz._id];

                            body.id = "myapp";
                            lang.mixin(body.style,thiz.template.bodyStyle);
                            body.className = thiz.template.bodyTheme;


                            /*

                             // Kludge to enable full-screen layout widgets, like BorderContainer.
                             // What possible side-effects could there be setting 100%x100% on every document?
                             // See note above about margin:0 temporary hack
                             body.style.width = "100%";
                             body.style.height = "100%";
                             // Force visibility:visible because CSS stylesheets in dojox.mobile
                             // have BODY { visibility:hidden;} only to set visibility:visible within JS code.
                             // Maybe done to minimize flickering. Will follow up with dojox.mobile
                             // folks to find out what's up. See #712
                             body.style.visibility = "visible";
                             body.style.margin = "0";
                             */

                            body._edit_context = this; // TODO: find a better place to stash the root context

                            var requires = thiz._bootstrapModules.split(",");

                            //var _doc = win.document;
                            /*
                             var script = _doc.createElement('script');
                             script.type = 'text/javascript';
                             script.src = realUrl + 'ibm-js/requirejs/require.js';

                             script.onload = script.onreadystatechange = function(){
                             thiz._continueLoading(data, callback, callbackData, scope);
                             };*/

                            //_doc.getElementsByTagName('head')[0].appendChild(script);

                            /*
                             if (requires.indexOf('dijit/dijit-all') != -1) {
                             // this is needed for FF4 to keep dijit.editor.RichText from throwing at line 32 dojo 1.5
                             win.dojo._postLoad = true;
                             }
                             */

                            // see Dojo ticket #5334
                            // If you do not have this particular dojo.isArray code, DataGrid will not render in the tool.
                            // Also, any array value will be converted to {0: val0, 1: val1, ...}
                            // after swapping back and forth between the design and code views twice. This is not an array!

                            if(data.scripts){
                                _.each(data.scripts,function(url){
                                    thiz.addJavaScriptSrc(url,false,null,true);
                                });
                            }
                            /*
                            win.require("dojo/_base/lang").isArray = win.dojo.isArray = function (it) {
                                return it && Object.prototype.toString.call(it) == "[object Array]";
                            };
                            */

                            // Add module paths for all folders in lib/custom (or wherever custom widgets are stored)
                            /*
                             win.require({
                             packages: thiz._customWidgetPackages
                             });*/

                        } catch (e) {
                            console.error(e.stack || e);
                            // recreate the Error since we crossed frames
                            callbackData = new Error(e.message, e.fileName, e.lineNumber);
                            utils.mixin(callbackData, e);
                        }
                        thiz._continueLoading(data, callback, callbackData, scope);
                    }.bind(thiz);

                    doc.open();

                    //var template = has('debug') ? newFileTemplate : newFileTemplateRelease;

                    //template = newFileTemplateRelease;

                    var content = utils.replace(template,null,subs,{
                        begin:'{{',
                        end:'}}'
                    });

                    debugContent && console.log('write doc content' + content);
                    doc.write(content);
                    doc.close();

                    // intercept BS key - prompt user before navigating backwards
                    connect.connect(doc.documentElement, "onkeypress", function (e) {
                        if (e.charOrCode == 8) {
                            window.davinciBackspaceKeyTime = win.davinciBackspaceKeyTime = Date.now();
                        }
                    });
                    // add key press listener
                    connect.connect(doc.documentElement, "onkeydown", dojo.hitch(thiz, function (e) {
                        // we let the editor handle stuff for us
                        this.editor.handleKeyEvent(e);
                    }));

                    // add key press listener
                    connect.connect(doc.documentElement, "onkeyup", dojo.hitch(thiz, function (e) {
                        // we let the editor handle stuff for us
                        this.editor.handleKeyEvent(e);
                    }));
                    //window["loading" + thiz._id]();
                };

                this.ctx.getWidgetManager()._getText(has('debug') ? _require.toUrl("xideve/delite/newfile.template.html") : _require.toUrl("xideve/delite/newfile.template.release.html"),{sync:false}).then(function(template){
                    complete(template);
                });





            }
        },
        //FIXME: private/protected?
        getLibraryBase: function(id, version){
            return Library.getLibRoot(id,version, this.getBase());
        },
        loadRequires: function (type, updateSrc, doUpdateModelDojoRequires, skipDomUpdate) {

            // this method is used heavily in RebuildPage.js, so please watch out when changing  API!
            var requires = metadata.query(type, "require");

            if (!requires) {
                var noop = new Deferred();
                noop.resolve();
                return noop;
            }

            var libraries = metadata.query(type, 'library'),
                libs = {},
                context = this,
                _loadJSFile = function (libId, src) {
                    try {
                        //updateSrc
                        return context.addJavaScriptSrc(_getResourcePath(libId, src), updateSrc, src, skipDomUpdate);
                    }catch(e){
                        console.error('very bad ',e);
                    }
                },
                _getResourcePath = function (libId, src) {
                    return src;
                    //xmaqhack:
                    /*return libs[libId].append(src).relativeTo(context.getPath(), true).toString();*/
                };

            var loadLibrary = function (libId, lib) {
                var d = new Deferred();
                if (libs.hasOwnProperty(libId)) {
                    d.resolve();
                    return d;
                }

                // calculate base library path, used in loading relative required
                // resources
                var ver = metadata.getLibrary(libId).version || lib.version;

                return context.getLibraryBase(libId, ver).then(function (root) {
                    if (root == null /*empty string OK here, but null isn't. */) {
                        console.error("No library found for name = '" + libId + "' version = '" + ver + "'");
                        d.reject();
                        return d;
                    }

                    // store path
                    libs[libId] = new Path(context.getBase()).append(root);

                    // If 'library' element points to the main library JS (rather than
                    // just base directory), then load that file now.
                    if (lib && lib.src && lib.src.substr(-3) === '.js') {
                        // XXX For now, lop off relative bits and use remainder as main
                        // library file.  In the future, we should use info from
                        // package.json and library.js to find out what part of this
                        // path is the piece we're interested in.
                        var m = lib.src.match(/((?:\.\.\/)*)(.*)/);
                        // m[1] => relative path
                        // m[2] => main library JS file
                        return _loadJSFile(libId, m[2]);
                    }
                    d.resolve();
                    return d;
                });
            };

            var libraryPromises = [];
            // first load any referenced libraries
            for (var libId in libraries) {
                if (libraries.hasOwnProperty(libId)) {
                    libraryPromises.push(loadLibrary(libId, libraries[libId]));
                }
            }

            return all(libraryPromises).then(function () {
                // next, load the require statements
                var requirePromises = [];
                requires.every(function (r) {
                    // If this require belongs under a library, load library file first
                    // (if necessary).
                    if (r.$library) {
                        requirePromises.push(loadLibrary(r.$library, libraries[r.$library]));
                    }

                    switch (r.type) {
                        case "javascript":
                            if (r.src) {
                                requirePromises.push(_loadJSFile(r.$library, r.src));
                            } else {
                                this.addJavaScriptText(r.$text, updateSrc || doUpdateModelDojoRequires, skipDomUpdate);
                            }
                            break;

                        case "javascript-module":
                            // currently, only support 'amd' format
                            if (r.format !== 'amd') {
                                console.error("Unknown javascript-module format");
                            }
                            if (r.src) {
                                requirePromises.push(
                                    this.addJavaScriptModule(r.src, updateSrc || doUpdateModelDojoRequires, skipDomUpdate));
                            } else {
                                console.error("Inline 'javascript-module' not handled src=" + r.src);
                            }
                            break;

                        case "css":
                            if (r.src) {
                                var src = _getResourcePath(r.$library, r.src);
                                if (updateSrc) {
                                    this.addModeledStyleSheet(src, skipDomUpdate);
                                } else {
                                    this.loadStyleSheet(src);
                                }
                            } else {
                                console.error("Inline CSS not handled src=" + r.src);
                            }
                            break;

                        case "image":
                            // Allow but ignore type=image
                            break;

                        default:
                            console.error("Unhandled metadata resource type='" + r.type +
                            "' for widget '" + type + "'");
                    }
                    return true;
                }, this);
                return all(requirePromises);
            }.bind(this));
        },
        //DEPRECATED
        getDojo: function () {
            var win = this.getGlobal();
            //FIXME: Aren't we asking for downstream bugs if we return "dojo", which is Maqetta's dojo
            //instead of the user document's dojo?
            return (win && win.dojo) || dojo;
        },
        //DEPRECATED
        getDijit: function () {
            var win = this.getGlobal();
            return win && win.dijit || dijit;
        },
        _getDojoJsElem: function () {
            if (!this._dojoScriptElem) {
                // find and cache the HTMLElement which points to dojo.js
                var head = this.getDocumentElement().getChildElement('head'),
                    found = head.getChildElements('script').some(function (child) {
                        if (/\/dojo.js$/.test(child.getAttribute('src'))) {
                            this._dojoScriptElem = child;
                            return true; // break 'some' loop
                        }
                    }, this);
                if (!found) {
                    // serious problems! dojo.js not found
                    console.error('"dojo.js" script element not found!');
                    return;
                }
            }

            return this._dojoScriptElem;
        },
        /**
         * Update the value of `data-dojo-config` attribute in the model element
         * pointing to "dojo.js".  Properties in `data` overwrite existing value;
         * null values remove properties from `data-dojo-config`.
         *
         * Note: This only updates the model. In order for the change to take in
         * the VE, you will need to refresh the iframe from the updated source.
         *
         * @param  {Object} data
         */
        _updateDojoConfig: function (data) {
            this.close(); // return any singletons for CSSFiles
            var dojoScript = this._getDojoJsElem(),
                djConfig = dojoScript.getAttribute('data-dojo-config');
            djConfig = djConfig ? require.eval("({ " + djConfig + " })", "data-dojo-config") : {};
            var regEx = "";
            /*
             * This is nasty, but djConfig.mblLoadCompatPattern is a regexp and if you attempt to
             * JSON.stringfy a regexp you get "{}" not very useful
             * So we need to use toString to get the string value of the regexp so
             * we can put it back later
             */
            if (djConfig.mblLoadCompatPattern) {
                regEx = ", mblLoadCompatPattern: " + djConfig.mblLoadCompatPattern.toString();
                delete djConfig.mblLoadCompatPattern;
            }
            // If `prop` has a value, copy it into djConfig, overwriting existing
            // value.  If `prop` is `null`, then delete from djConfig.

            for (var prop in data) {
                if (prop == 'mblLoadCompatPattern') {
                    if (data[prop] === null) {
                        // we already deleted from djConfig above
                        // just clear the regex we are going to put back
                        regEx = "";
                    } else {
                        //Note above about stringify regexp

                        regEx = ", 'mblLoadCompatPattern': " + data[prop];
                    }

                } else if (data[prop] === null) {
                    delete djConfig[prop];
                } else {
                    djConfig[prop] = data[prop];
                }
            }

            //console.log('update dojo config : ',djConfig);


            //import to tell everyone
            factory.publish(types.EVENTS.ON_BUILD_DOJO_CONFIG, {
                data: djConfig,
                context: this,
                editor: this.editor
            }, this);

            var str = JSON.stringify(djConfig).slice(1, -1).replace(/"/g, "'");
            /*
             * This is where we add the regexp string to the stringified object.
             * Read the note above about why this is needed.
             */
            str += regEx;
            dojoScript.setAttribute('data-dojo-config', str);
        },
        // Preserve data-dojo-type and dojoType values
        _preserveDojoTypes: function (node) {
            var widgetType = node.getAttribute("data-dojo-type") || node.getAttribute("dojoType");
            if (widgetType) {
                var cache = this._loadFileDojoTypesCache;
                var tempClass = this.maqTypesClassPrefix + this.maqTypesClassCount;
                node.className = node.className + ' ' + tempClass;
                this.maqTypesClassCount++;
                cache[tempClass] = widgetType;
            }
        },
        /**
         * Generate attribute values for the "dojo.js" script element, pulling in
         * any attributes from the source file, while also merging in any attributes
         * that are passed in.
         *
         * @param  {Object} config
         * @param  {Object} subs
         */
        _getDojoScriptValues: function (config, subs) {
            var dojoScript = this._getDojoJsElem();
            var djConfig = dojoScript.getAttribute('data-dojo-config');

            // special handling for 'data-dojo-config' attr
            djConfig = djConfig ? require.eval("({ " + djConfig + " })", "data-dojo-config") : {};
            // give precedence to our 'config' options, over that in file; make sure
            // to turn off parseOnLoad
            lang.mixin(djConfig, config, {
                async: true,
                parseOnLoad: false
            });
            subs.dojoConfig = JSON.stringify(djConfig).slice(1, -1).replace(/"/g, "'");

            // handle any remaining attributes
            var attrs = [];
            dojoScript.attributes.forEach(function (attr) {
                var name = attr.name,
                    val = attr.value;
                if (name !== 'src' && name !== 'data-dojo-config') {
                    attrs.push(name + '="' + val + '"');
                }
            });
            if (attrs.length) {
                subs.additionalDojoAttrs = attrs.join(' ');
            }
        },
        // restore info from dojo-data-type attribute onto widgets so that getWidget() will
        // be able to determine the widget types
        _restoreDojoTypes: function () {
            var cache = this._loadFileDojoTypesCache;
            var doc = this.getDocument();
            for (var id in cache) {
                node = doc.querySelectorAll('.' + id)[0];
                if (node) {
                    node.className = node.className.replace(' ' + id, '');
                    node.setAttribute('data-dojo-type', cache[id]);
                }
            }
        },
        _continueLoading: function(data, callback, callbackData, scope) {
            var promise, failureInfo = {};
            try {
                if (callbackData instanceof Error) {
                    throw callbackData;
                }

                promise = this._setSourceData(data).then(this.onload.bind(this), function(error) {
                    failureInfo.errorMessage = "Unable to parse HTML source.  See console for error.  Please switch to \"Display Source\" mode and correct the error."; // FIXME: i18n
                    console.error(error.stack || error.message);
                });
            } catch(e) {
                failureInfo = e;
                // recreate the Error since we crossed frames
//			failureInfo = new Error(e.message, e.fileName, e.lineNumber);
//			lang.mixin(failureInfo, e);
            } finally {
                if (callback) {
                    if (promise) {
                        promise.then(function(){
                            callback.call((scope || this), failureInfo);
                        }.bind(this));
                    } else {
                        callback.call((scope || this), failureInfo);
                    }
                }
            }
        }

    });
});
