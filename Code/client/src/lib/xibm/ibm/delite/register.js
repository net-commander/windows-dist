/** @module delite/register */
define([
	"module",
	"dcl/advise",
	"dcl/dcl",
	"decor/schedule",
	"requirejs-domready/domReady",	// loading as a function, not as a plugin
	"./features"
], function (module, advise, dcl, schedule, domReady, has) {
	"use strict";

	var doc = has("builder") ? require.nodeRequire("jsdom").jsdom("") : document;

	// Set to true after the page finishes loading and the parser runs.  Any widgets declared after initialParseComplete
	// instantiated in a separate code path.
	var initialParseComplete;

	// Workaround problem using dcl() on native DOMNodes on FF and IE,
	// see https://github.com/uhop/dcl/issues/9.
	// Fixes case where tabIndex is declared in a mixin that's passed to register().
	dcl.mix = function (a, b) {
		for (var n in b) {
			try {
				a[n] = b[n];
			} catch (e) {
				Object.defineProperty(a, n, {
					configurable: true,
					writable: true,
					enumerable: true,
					value: b[n]
				});
			}
		}
	};

	/**
	 * List of selectors that the parser needs to search for as possible upgrade targets.  Mainly contains
	 * the widget custom tags like d-accordion, but also selectors like button[is='d-button'] to find <button is="...">
	 * @type {string[]}
	 */
	var selectors = [];

	/**
	 * Internal registry of widget class metadata.
	 * Key is custom widget tag name, used as Element tag name like <d-accordion> or "is" attribute like
	 * <button is="d-accordion">).
	 * Value is metadata about the widget, including its prototype, ex: {prototype: object, extends: "button", ... }
	 * @type {Object}
	 */
	var registry = {};

	/**
	 * Create an Element.  Similar to document.createElement(), but if tag is the name of a widget defined by
	 * register(), then it upgrades the Element to be a widget.
	 * @function module:delite/register.createElement
	 * @param {string} tag
	 * @returns {Element} The DOMNode
	 */
	function createElement(tag) {
		if (/-/.test(tag) && !(tag in registry) && !has("builder")) {
			// Try to help people that have templates with custom elements but they forgot to do requires="..."
			console.warn("register.createElement(): undefined tag '" + tag +
				"', did you forget requires='...' in your template?");
		}

		var base = registry[tag] ? registry[tag].extends : null;
		if (has("document-register-element")) {
			return base ? doc.createElement(base, tag) : doc.createElement(tag);
		} else {
			var element = doc.createElement(base || tag);
			if (base) {
				element.setAttribute("is", tag);
			}
			upgrade(element);
			return element;
		}
	}

	/**
	 * Generate metadata about all the properties in proto, both direct and inherited.
	 * On IE<=10, these properties will be applied to a DOMNode via Object.defineProperties().
	 * Skips properties in the base element (HTMLElement, HTMLButtonElement, etc.)
	 * @param {Object} proto - The prototype.
	 * @returns {Object} Hash from property name to return value from `Object.getOwnPropertyDescriptor()`.
	 */
	function getPropDescriptors(proto) {
		var props = {};

		do {
			var keys = Object.getOwnPropertyNames(proto);	// better than Object.keys() because finds hidden props too
			for (var i = 0, k; (k = keys[i]); i++) {
				if (!props[k]) {
					props[k] = Object.getOwnPropertyDescriptor(proto, k);
				}
			}
			proto = Object.getPrototypeOf(proto);
		} while (!/HTML[a-zA-Z]*Element/.test(proto.constructor.toString()));

		return props;
	}

	/**
	 * Converts plain Element of custom type into "custom element", by adding the widget's custom methods, etc.
	 * Does nothing if the Element has already been converted or if it doesn't correspond to a registered custom tag.
	 * After the upgrade, calls `createdCallback()`.
	 *
	 * Usually the application will not need to call this method directly, because it's called automatically
	 * on page load and as elements are added to the document.
	 *
	 * @function module:delite/register.upgrade
	 * @param {Element} element - The DOM node.
	 * @param {boolean} [attach] - If `element`'s tag has been registered, but `attachedCallback()` hasn't yet been
	 * called [since the last call to `detachedCallback()`], then call `attachedCallback()`.  Call even if the element
	 * has already been upgraded.
	 */
	function upgrade(element, attach) {
		if (!has("document-register-element")) {
			var widget = registry[element.getAttribute("is") || element.nodeName.toLowerCase()];
			if (widget) {
				if (!element._upgraded) {
					if (has("dom-proto-set")) {
						// Redefine Element's prototype to point to widget's methods etc.
						/*jshint camelcase: false*/
						/*jshint proto: true*/
						element.__proto__ = widget.prototype;
						/*jshint camelcase: true*/
						/*jshint proto: false*/
					} else {
						// Mixin all the widget's methods etc. into Element
						Object.defineProperties(element, widget.props);
					}
					element._upgraded = true;
					if (element.createdCallback) {
						element.createdCallback();
					}
				}
				if (attach && !element._attached) {
					element.attachedCallback();
				}
			}
		}
	}

	/**
	 * Call detachedCallback() on specified Element if it's a custom element that was upgraded by us.
	 * @param {Element} node
	 */
	function detach(node) {
		if (node._upgraded) {
			node.detachedCallback();
		}
	}

	/**
	 * Mapping of tag names to HTMLElement interfaces.
	 * Doesn't include newer elements not available on all browsers.
	 * @type {Object}
	 */
	var tagMap = typeof HTMLElement !== "undefined" && {	// "typeof HTMLElement" check so module loads in NodeJS
		a: HTMLAnchorElement,
		// applet: HTMLAppletElement,
		// area: HTMLAreaElement,
		// audio: HTMLAudioElement,
		base: HTMLBaseElement,
		br: HTMLBRElement,
		button: HTMLButtonElement,
		canvas: HTMLCanvasElement,
		// data: HTMLDataElement,
		// datalist: HTMLDataListElement,
		div: HTMLDivElement,
		dl: HTMLDListElement,
		directory: HTMLDirectoryElement,
		// embed: HTMLEmbedElement,
		fieldset: HTMLFieldSetElement,
		font: HTMLFontElement,
		form: HTMLFormElement,
		head: HTMLHeadElement,
		h1: HTMLHeadingElement,
		html: HTMLHtmlElement,
		hr: HTMLHRElement,
		iframe: HTMLIFrameElement,
		img: HTMLImageElement,
		input: HTMLInputElement,
		// keygen: HTMLKeygenElement,
		label: HTMLLabelElement,
		legend: HTMLLegendElement,
		li: HTMLLIElement,
		link: HTMLLinkElement,
		map: HTMLMapElement,
		// media: HTMLMediaElement,
		menu: HTMLMenuElement,
		meta: HTMLMetaElement,
		// meter: HTMLMeterElement,
		ins: HTMLModElement,
		object: HTMLObjectElement,
		ol: HTMLOListElement,
		optgroup: HTMLOptGroupElement,
		option: HTMLOptionElement,
		// output: HTMLOutputElement,
		p: HTMLParagraphElement,
		param: HTMLParamElement,
		pre: HTMLPreElement,
		// progress: HTMLProgressElement,
		quote: HTMLQuoteElement,
		script: HTMLScriptElement,
		select: HTMLSelectElement,
		// source: HTMLSourceElement,
		// span: HTMLSpanElement,
		style: HTMLStyleElement,
		table: HTMLTableElement,
		caption: HTMLTableCaptionElement,
		// td: HTMLTableDataCellElement,
		// th: HTMLTableHeaderCellElement,
		col: HTMLTableColElement,
		tr: HTMLTableRowElement,
		tbody: HTMLTableSectionElement,
		textarea: HTMLTextAreaElement,
		// time: HTMLTimeElement,
		title: HTMLTitleElement,
		// track: HTMLTrackElement,
		ul: HTMLUListElement,
		// blink: HTMLUnknownElement,
		video: HTMLVideoElement
	};
	var tags = tagMap && Object.keys(tagMap);

	/**
	 * Registers the tag with the current document, and save tag information in registry.
	 * Handles situations where the base constructor inherits from
	 * HTMLElement but is not HTMLElement.
	 * @param  {string}   tag         The custom tag name for the element, or the "is" attribute value.
	 * @param  {string}	  _extends    The name of the tag this element extends, ex: "button" for <button is="...">
	 * @param  {string}   baseElement The native HTML*Element "class" that this custom element is extending.
	 * @param  {Function} baseCtor    The constructor function.
	 * @return {Function}             The "new" constructor function that can create instances of the custom element.
	 */
	function getTagConstructor(tag, _extends, baseElement, baseCtor) {
		var proto = baseCtor.prototype,
			config = registry[tag] = {
				constructor: baseCtor,
				prototype: proto
			};

		if (_extends) {
			config.extends = _extends;
		}

		if (has("document-register-element")) {
			doc.registerElement(tag, config);
		} else {
			if (!has("dom-proto-set")) {
				// Get descriptors for all the properties in the prototype.  This is needed on IE<=10 in upgrade().
				config.props = getPropDescriptors(proto);
			}
		}

		// Note: if we wanted to support registering new types after the parser was called, then here we should
		// scan the document for the new type (selectors[length-1]) and upgrade any nodes found.

		// Create a constructor method to return a DOMNode representing this widget.
		var tagConstructor = function (params) {
			// Create new widget node or upgrade existing node to widget
			var node = createElement(tag);

			// Set parameters on node
			for (var name in params || {}) {
				if (name === "style") {
					node.style.cssText = params.style;
				} else if ((name === "class" || name === "className") && node.setClassComponent) {
					node.setClassComponent("user", params[name]);
				} else {
					node[name] = params[name];
				}
			}
			if (node.deliver) {
				node.deliver();
			}

			return node;
		};

		// Add some flags for debugging and return the new constructor
		tagConstructor.tag = tag;
		tagConstructor._ctor = baseCtor;

		// Register the selector to find this custom element
		var selector = _extends ? _extends + "[is='" + tag + "']" : tag;
		selectors.push(selector);

		// If the document has already been parsed then do a supplementary sweep for this new custom element.
		if (initialParseComplete && !has("document-register-element")) {
			unobserve();	// pause listening for added/deleted nodes
			parse(doc, selector);
			observe();	// resume listening for added/deleted nodes
		}

		return tagConstructor;
	}

	/**
	 * Restore the "true" constructor when trying to recombine custom elements
	 * @param  {Function} extension A constructor function that might have a shadow property that contains the
	 *                              original constructor
	 * @return {Function}           The original construction function or the existing function/object
	 */
	function restore(extension) {
		return (extension && extension._ctor) || extension;
	}

	/**
	 * Declare a widget and register it as a custom element.
	 *
	 * props{} can provide custom setters/getters for widget properties, which are called automatically when
	 * the widget properties are set.
	 * For a property XXX, define methods _setXXXAttr() and/or _getXXXAttr().
	 *
	 * @param  {string}               tag             The custom element's tag name.
	 * @param  {Object[]}             superclasses    Any number of superclasses to be built into the custom element
	 *                                                constructor. But first one must be [descendant] of HTMLElement.
	 * @param  {Object}               props           Properties of this widget class.
	 * @return {Function}                             A constructor function that will create an instance of the custom
	 *                                                element.
	 * @function module:delite/register
	 */
	function register(tag, superclasses, props) {
		// Create the widget class by extending specified superclasses and adding specified properties.

		// Make sure all the bases have their proper constructors for being composited.
		// I.E. remove the wrapper added by getTagConstructor().
		var bases = (superclasses instanceof Array ? superclasses : superclasses ? [superclasses] : []).map(restore);


		// Check to see if the custom tag is already registered
		if (tag in registry) {
			throw new TypeError("A widget is already registered with tag '" + tag + "'.");
		}

		// Get root (aka native) class: HTMLElement, HTMLInputElement, etc.
		var baseElement = bases[0];
		if (baseElement.prototype && baseElement.prototype._baseElement) {
			// The first superclass is a widget created by another call to register, so get that widget's root class
			baseElement = baseElement.prototype._baseElement;
		}

		// Get name of tag that this widget extends, for example <button is="..."> --> "button"
		var _extends;
		if (baseElement !== HTMLElement) {
			_extends = tags.filter(function (tag) {
				return tagMap[tag] === baseElement;
			})[0];
			if (!_extends) {
				throw new TypeError(tag + ": must have HTMLElement in prototype chain");
			}
		}

		// Get a composited constructor
		var ctor = dcl(bases, props || {}),
			proto = ctor.prototype;
		proto._ctor = ctor;
		proto._baseElement = baseElement;
		proto._tag = tag;
		proto._extends = _extends;

		// Monkey-patch attachedCallback() and detachedCallback() to avoid double executions.
		// Generally this isn't an issue, but it could happen if the app manually called the functions
		// and then they were called automatically too.
		advise.around(proto, "attachedCallback", function (sup) {
			return function () {
				if (this._attached) { return; }
				if (sup) { sup.apply(this, arguments); }
				this._attached = true;
			};
		});
		advise.around(proto, "detachedCallback", function (sup) {
			return function () {
				if (!this._attached) { return; }
				if (sup) { sup.apply(this, arguments); }
				this._attached = false;
			};
		});

		// Run introspection to add ES5 getters/setters.
		// Doesn't happen automatically because Stateful's constructor isn't called.
		// Also, on IE this needs to happen before the getTagConstructor() call,
		// since getTagConstructor() scans all the properties on the widget prototype.
		if (proto.introspect) {
			ctor._propsToObserve = proto.getProps();
			proto.introspect(ctor._propsToObserve);
			ctor.introspected = true;
		}

		// Save widget metadata to the registry and return constructor that creates an upgraded DOMNode for the widget
		/* jshint boss:true */
		return getTagConstructor(tag, _extends, baseElement, ctor);
	}

	/**
	 * Parse the given DOM tree for any Elements that need to be upgraded to widgets.
	 * Searches all descendants of the specified node, but does not upgrade the node itself.
	 *
	 * Usually the application will not need to call this method directly, because it's called automatically
	 * on page load and as elements are added to the document.
	 *
	 * @function module:delite/register.parse
	 * @param {Element} [root] DOM node to parse from.
	 * @param {String} [selector] The selector to use to detect custom elements.  Defaults to selector
	 * for all registered custom elements.
	 */
	function parse(root, selector) {
		if (has("document-register-element")) { return; }
		selector = selector || selectors.join(", ");
		if (selector) {
			var node, idx = 0, nodes = (root || doc).querySelectorAll(selector);
			while ((node = nodes[idx++])) {
				upgrade(node, true);
			}
		}
	}

	// ------------------------
	// Code to listen for nodes being added/deleted from the document, to automatically call parse()/detachedCallback()
	var observer;

	/**
	 * Start listening for added/deleted nodes.
	 */
	function observe() {
		if (!has("document-register-element")) {
			if (!observer) {
				if (has("MutationObserver")) {
					observer = new MutationObserver(processMutations);
				} else {
					// Fallback for Android < 4.2 and IE < 11.  Partial shim of MutationObserver, except sometimes
					// addedNodes lists all nodes not just the root of each added tree.
					observer = {
						takeRecords: function () {
							var ret = this._mutations;
							this._mutations = [];
							if (this._timer) {
								this._timer.remove();
								this._timer = null;
							}
							return ret;
						},
						observe: function () {
							this._mutations = [];
							this._listener = function (event) {
								if (event.target.nodeType === 1) {
									var mutation = {};
									mutation[event.type === "DOMNodeInserted" ? "addedNodes" : "removedNodes"] =
										[event.target];
									this._mutations.push(mutation);
								}
								if (!this._timer) {
									this._timer = schedule(function () {
										this._timer = null;
										processMutations(this.takeRecords());
									}.bind(this));
								}
							}.bind(this);
							doc.body.addEventListener("DOMNodeInserted", this._listener);
							doc.body.addEventListener("DOMNodeRemoved", this._listener);
						},
						disconnect: function () {
							doc.body.removeEventListener("DOMNodeInserted", this._listener);
							doc.body.removeEventListener("DOMNodeRemoved", this._listener);
						}
					};
				}
			}
			observer.observe(doc.body, {childList: true, subtree: true});
		}
	}

	/**
	 * Stop (aka pause) listening for added/deleted nodes.
	 */
	function unobserve() {
		if (observer) {
			// TODO: This method is supposed to pause listening for DOM updates,
			// but I suspect disconnect() also throws away records
			// for any mutations that have already occurred.   Those records need to be saved or processed.
			observer.disconnect();
		}
	}

	/**
	 * Process the added/deleted nodes.  Called for incremental updates after initial parse.
	 * @param mutations
	 */
	function processMutations(mutations) {
		if (!has("document-register-element") && selectors.length) {
			unobserve();	// pause listening for added/deleted nodes
			var parseDescendants = has("MutationObserver") || has("DOMNodeInserted") === "root";
			mutations.forEach(function (mutation) {
				var added, idx1 = 0;
				while ((added = mutation.addedNodes && mutation.addedNodes[idx1++])) {
					// contains() checks avoid calling attachedCallback() on nodes not attached to document because:
					//		1. node was added then removed before processMutations() was called
					//		2. node was added and then its ancestor was removed before processMutations() was called
					if (added.nodeType === 1 && added.ownerDocument.body.contains(added)) {
						// upgrade the node itself (if it's a custom widget and it hasn't been upgraded yet),
						// and then call attachedCallback() on it
						upgrade(added, true);

						// upgrade any descendants that are custom widgets (if they aren't already upgraded),
						// and then call attachedCallback() on them
						if (parseDescendants) {
							parse(added);
						}
					}
				}

				var removedRoot, idx2 = 0;
				while ((removedRoot = mutation.removedNodes && mutation.removedNodes[idx2++])) {
					if (removedRoot.nodeType === 1) {
						detach(removedRoot);
						var removed, idx3 = 0, removedDescendants = removedRoot.querySelectorAll(selectors.join(", "));
						while ((removed = removedDescendants[idx3++])) {
							detach(removed);
						}
					}
				}
			});
			observe();	// resume listening for added/deleted nodes
		}
	}

	/**
	 * Upgrade any custom tags in the document that have not yet been upgraded.
	 * Nodes are automatically updated asynchronously, but applications can synchronously update them by calling
	 * this method.  Should not be called before domReady event.
	 */
	function deliver() {
		if (!has("document-register-element")) {
			if (!initialParseComplete) {
				parse();
				initialParseComplete = true;
				observe();
			} else {
				processMutations(observer.takeRecords());
			}
		}
	}

	// Setup initial parse of document and also listeners for future document modifications.
	if (!has("document-register-element") && doc) {
		domReady(function () {
			if (!has("dom-template")) {
				// Move <template> child nodes to .content property, so that we don't parse custom elements in
				// <template> nodes.  Could be done on dynamically created nodes too, but currently there's no need.
				var template, idx = 0, nodes = doc.querySelectorAll("template");
				while ((template = nodes[idx++])) {
					if (!template.content) {
						var child, content = template.content = doc.createDocumentFragment();
						while ((child = template.firstChild)) {
							content.appendChild(child);
						}
					}
				}
			}

			// Upgrade all custom element nodes, and setup listeners for future changes.
			deliver();
		});
	}

	// Setup return value as register() method, with other methods hung off it.
	register.upgrade = upgrade;
	register.createElement = createElement;
	register.parse = parse;
	register.deliver = deliver;

	// Add helpers from dcl for declaring classes.

	/**
	 * Convenience shortcut to [dcl()](http://www.dcljs.org/docs/mini_js/dcl/).
	 * @function module:delite/register.dcl
	 */
	register.dcl = dcl;

	/**
	 * Convenience shortcut to [dcl.after()](http://www.dcljs.org/docs/dcl_js/after/).
	 * @function module:delite/register.after
	 */
	register.after = dcl.after;

	/**
	 * Convenience shortcut to [dcl.before()](http://www.dcljs.org/docs/dcl_js/before/).
	 * @function module:delite/register.before
	 */
	register.before = dcl.before;

	/**
	 * Convenience shortcut to [dcl.around()](http://www.dcljs.org/docs/dcl_js/around/).
	 * @function module:delite/register.around
	 */
	register.around = dcl.around;

	/**
	 * Convenience shortcut to [dcl.superCall()](http://www.dcljs.org/docs/mini_js/supercall/).
	 * @function module:delite/register.superCall
	 */
	register.superCall = dcl.superCall;

	return register;
});
