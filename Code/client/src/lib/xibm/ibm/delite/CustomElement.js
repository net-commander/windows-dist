/** @module delite/CustomElement */
define([
	"dcl/advise",
	"dcl/dcl",
	"decor/Observable",
	"decor/Destroyable",
	"decor/Stateful",
	"requirejs-dplugins/has",
	"./on",
	"./register"
], function (advise, dcl, Observable, Destroyable, Stateful, has, on, register) {

	/**
	 * Dispatched after the CustomElement has been attached.
	 * This is useful to be notified when an HTMLElement has been upgraded to a
	 * CustomElement and attached to the DOM, in particular on browsers supporting native Custom Element.
	 * @example
	 * element.addEventListener("customelement-attached", function (evt) {
	 *      console.log("custom element: "+evt.target.id+" has been attached");
	 * });
	 * @event module:delite/CustomElement#customelement-attached
	 */

	// Test if custom setters work for native properties like dir, or if they are ignored.
	// They don't work on some versions of webkit (Chrome, Safari 7, iOS 7), but do work on Safari 8 and iOS 8.
	// If needed, this test could probably be reduced to just use Object.defineProperty() and dcl(),
	// skipping use of register().
	has.add("setter-on-native-prop", function () {
		var works = false,
			Mixin = dcl(Stateful, {	// mixin to workaround https://github.com/uhop/dcl/issues/9
				getProps: function () { return {dir: true}; },
				dir: "",
				_setDirAttr: function () { works = true; }
			}),
			TestWidget = register("test-setter-on-native-prop", [HTMLElement, Mixin], {}),
			tw = new TestWidget();
		tw.dir = "rtl";
		return works;
	});


	/**
	 * Get a property from a dot-separated string, such as "A.B.C".
	 */
	function getObject(name) {
		try {
			return name.split(".").reduce(function (context, part) {
				return context[part];
			}, this);	// "this" is the global object (i.e. window on browsers)
		} catch (e) {
			// Return undefined to indicate that object doesn't exist.
		}
	}

	// Properties not to monitor for changes.
	var REGEXP_IGNORE_PROPS = /^constructor$|^_set$|^_get$|^deliver$|^discardChanges$|^_(.+)Attr$/;

	/**
	 * Base class for all custom elements.
	 *
	 * Use this class rather that delite/Widget for non-visual custom elements.
	 * Custom elements can provide custom setters/getters for properties, which are called automatically
	 * when the value is set.  For an attribute XXX, define methods _setXXXAttr() and/or _getXXXAttr().
	 *
	 * @mixin module:delite/CustomElement
	 * @augments module:decor/Stateful
	 * @augments module:decor/Destroyable
	 */
	var CustomElement = dcl([Stateful, Destroyable], /** @lends module:delite/CustomElement# */{
		introspect: function () {
			if (!has("setter-on-native-prop")) {
				// Generate map from native attributes of HTMLElement to custom setters for those attributes.
				// Necessary because webkit masks all custom setters for native properties on the prototype.
				// For details see:
				//		https://bugs.webkit.org/show_bug.cgi?id=36423
				//		https://bugs.webkit.org/show_bug.cgi?id=49739
				//		https://bugs.webkit.org/show_bug.cgi?id=75297
				var proto = this,
					nativeProps = document.createElement(this._extends || "div"),
					setterMap = this._nativePropSetterMap = {};

				this._nativeAttrs = [];
				do {
					Object.keys(proto).forEach(function (prop) {
						var lcProp = prop.toLowerCase();

						if (prop in nativeProps && !setterMap[lcProp]) {
							var desc = Object.getOwnPropertyDescriptor(proto, prop);
							if (desc && desc.set) {
								this._nativeAttrs.push(lcProp);
								setterMap[lcProp] = desc.set;
							}
						}
					}, this);

					proto = Object.getPrototypeOf(proto);
				} while (proto && proto !== this._baseElement.prototype);
			}
		},

		getProps: function () {
			// Override _Stateful.getProps() to ignore properties from the HTML*Element superclasses, like "style".
			// You would need to explicitly declare style: "" in your widget to get it here.
			//
			// Also sets up this._propCaseMap, a mapping from lowercase property name to actual name,
			// ex: iconclass --> iconClass, which does include the methods, but again doesn't
			// include props like "style" that are merely inherited from HTMLElement.

			var hash = {}, proto = this,
				pcm = this._propCaseMap = {};

			do {
				Object.keys(proto).forEach(function (prop) {
					if (!REGEXP_IGNORE_PROPS.test(prop)) {
						hash[prop] = true;
						pcm[prop.toLowerCase()] = prop;
					}
				});

				proto = Object.getPrototypeOf(proto);
			} while (proto && proto !== this._baseElement.prototype);

			return hash;
		},

		/**
		 * This method will detect and process any properties that the application has set, but the custom setter
		 * didn't run because `has("setter-on-native-prop") === false`.
		 * Used during initialization and also by `deliver()`.
		 * @private
		 */
		_processNativeProps: function () {
			if (!has("setter-on-native-prop")) {
				this._nativeAttrs.forEach(function (attrName) {
					if (this.hasAttribute(attrName)) { // value was specified
						var value = this.getAttribute(attrName);
						this.removeAttribute(attrName);
						if (value !== null) {
							this._nativePropSetterMap[attrName].call(this, value); // call custom setter
						}
					}
				}, this);
			}
		},

		/**
		 * Set to true when `createdCallback()` has completed.
		 * @member {boolean}
		 * @protected
		 */
		created: false,

		/**
		 * Called when the custom element is created, or when `register.parse()` parses a custom tag.
		 *
		 * This method is automatically chained, so subclasses generally do not need to use `dcl.superCall()`,
		 * `dcl.advise()`, etc.
		 * @method
		 * @protected
		 */
		createdCallback: dcl.advise({
			before: function () {
				// Mark this object as observable with Object.observe() shim
				if (!this._observable) {
					Observable.call(this);
				}

				// Get parameters that were specified declaratively on the widget DOMNode.
				this._parsedAttributes = this._mapAttributes();
			},

			after: function () {
				this.created = true;

				// Now that creation has finished, apply parameters that were specified declaratively.
				// This is consistent with the timing that parameters are applied for programmatic creation.
				this._parsedAttributes.forEach(function (pa) {
					if (pa.event) {
						this.on(pa.event, pa.callback);
					} else {
						this[pa.prop] = pa.value;
					}
				}, this);

				if (!has("setter-on-native-prop")) {
					// Call custom setters for initial values of attributes with shadow properties (dir, tabIndex, etc)
					this._processNativeProps();

					// Begin watching for changes to those DOM attributes.
					// Note that (at least on Chrome) I could use attributeChangedCallback() instead, which is
					// synchronous, so Widget#deliver() will work as expected, but OTOH gets lots of notifications
					// that I don't care about.
					// If Polymer is loaded, use MutationObserver rather than WebKitMutationObserver
					// to avoid error about "referencing a Node in a context where it does not exist".
					/* global WebKitMutationObserver */
					var MO = window.MutationObserver || WebKitMutationObserver;	// for jshint
					var observer = new MO(function (records) {
						records.forEach(function (mr) {
							var attrName = mr.attributeName,
								setter = this._nativePropSetterMap[attrName],
								newValue = this.getAttribute(attrName);
							if (newValue !== null) {
								this.removeAttribute(attrName);
								setter.call(this, newValue);
							}
						}, this);
					}.bind(this));
					observer.observe(this, {
						subtree: false,
						attributeFilter: this._nativeAttrs,
						attributes: true
					});
				}
			}
		}),

		/**
		 * Set to true when `attachedCallback()` has completed, and false when `detachedCallback()` called.
		 * @member {boolean}
		 * @protected
		 */
		attached: false,

		/**
		 * Called automatically when the element is added to the document, after `createdCallback()` completes.
		 * This method is automatically chained, so subclasses generally do not need to use `dcl.superCall()`,
		 * `dcl.advise()`, etc.
		 * @method
		 * @fires module:delite/CustomElement#customelement-attached
		 */
		attachedCallback: dcl.advise({
			before: function () {
				// Call computeProperties() and refreshRendering() for declaratively set properties.
				// Do this in attachedCallback() rather than createdCallback() to avoid calling refreshRendering() etc.
				// prematurely in the programmatic case (i.e. calling it before user parameters have been applied).
				this.deliver();
			},

			after: function () {
				this.attached = true;

				this.emit("customelement-attached", {
					bubbles: false,
					cancelable: false
				});
			}
		}),

		/**
		 * Called when the element is removed the document.
		 * This method is automatically chained, so subclasses generally do not need to use `dcl.superCall()`,
		 * `dcl.advise()`, etc.
		 */
		detachedCallback: function () {
			this.attached = false;
		},

		/**
		 * Returns value for widget property based on attribute value in markup.
		 * @param {string} name - Name of widget property.
		 * @param {string} value - Value of attribute in markup.
		 * @private
		 */
		_parsePrototypeAttr: function (name, value) {
			// inner function useful to reduce cyclomatic complexity when using jshint
			function stringToObject(value) {
				var obj;

				try {
					// TODO: remove this code if it isn't being used, so we don't scare people that are afraid of eval.
					/* jshint evil:true */
					// This will only be executed when complex parameters are used in markup
					// <my-tag constraints="max: 3, min: 2"></my-tag>
					// This can be avoided by using such complex parameters only programmatically or by not using
					// them at all.
					// This is harmless if you make sure the JavaScript code that is passed to the attribute
					// is harmless.
					obj = eval("(" + (value[0] === "{" ? "" : "{") + value + (value[0] === "{" ? "" : "}") + ")");
				}
				catch (e) {
					throw new SyntaxError("Error in attribute conversion to object: " + e.message +
						"\nAttribute Value: '" + value + "'");
				}
				return obj;
			}

			switch (typeof this[name]) {
			case "string":
				return value;
			case "number":
				return value - 0;
			case "boolean":
				return value !== "false";
			case "object":
				// Try to interpret value as global variable, ex: store="myStore", array of strings
				// ex: "1, 2, 3", or expression, ex: constraints="min: 10, max: 100"
				return getObject(value) ||
					(Array.isArray(this[name]) ? (value ? value.split(/,\s*/) : []) : stringToObject(value));
			case "function":
				return this.parseFunctionAttribute(value, []);
			}
		},

		/**
		 * Helper to parse function attribute in markup.  Unlike `_parsePrototypeAttr()`, does not require a
		 * corresponding widget property.  Functions can be specified as global variables or as inline javascript:
		 *
		 * ```html
		 * <my-widget funcAttr="globalFunction" on-click="console.log(event.pageX);">
		 * ```
		 *
		 * @param {string} value - Value of the attribute.
		 * @param {string[]} params - When generating a function from inline javascript, give it these parameter names.
		 * @protected
		 */
		parseFunctionAttribute: function (value, params) {
			/* jshint evil:true */
			// new Function() will only be executed if you have properties that are of function type in your widget
			// and that you use them in your tag attributes as follows:
			// <my-tag whatever="console.log(param)"></my-tag>
			// This can be avoided by setting the function programmatically or by not setting it at all.
			// This is harmless if you make sure the JavaScript code that is passed to the attribute is harmless.
			// Use Function.bind to get a partial on Function constructor (trick to call it with an array
			// of args instead list of args).
			return getObject(value) ||
				new (Function.bind.apply(Function, [undefined].concat(params).concat([value])))();
		},

		/**
		 * Helper for parsing declarative widgets.  Interpret a given attribute specified in markup, returning either:
		 *
		 * - `undefined`: ignore
		 * - `{prop: prop, value: value}`: set `this[prop] = value`
		 * - `{event: event, callback: callback}`: call `this.on(event, callback)`
		 *
		 * @param {string} name - Attribute name.
		 * @param {string} value - Attribute value.
		 * @protected
		 */
		parseAttribute: function (name, value) {
			var pcm = this._propCaseMap;
			if (name in pcm) {
				name =  pcm[name]; // convert to correct case for widget
				return {
					prop: name,
					value: this._parsePrototypeAttr(name, value)
				};
			} else if (/^on-/.test(name)) {
				return {
					event: name.substring(3),
					callback: this.parseFunctionAttribute(value, ["event"])
				};
			}
		},

		/**
		 * Parse declaratively specified attributes for widget properties and connects.
		 * @returns {Array} Info about the attributes and their values as returned by `parseAttribute()`.
		 * @private
		 */
		_mapAttributes: function () {
			var attr,
				idx = 0,
				parsedAttrs = [],
				attrsToRemove = [];

			while ((attr = this.attributes[idx++])) {
				var name = attr.name.toLowerCase();	// note: will be lower case already except for IE9
				var parsedAttr = this.parseAttribute(name, attr.value);
				if (parsedAttr) {
					parsedAttrs.push(parsedAttr);
					attrsToRemove.push(attr.name);
				}
			}

			// Remove attributes that were processed, but do it in a separate loop so we don't modify this.attributes
			// while we are looping through it.   (See CustomElement-attr.html test failure on IE10.)
			attrsToRemove.forEach(this.removeAttribute, this);

			return parsedAttrs;
		},

		/**
		 * Release resources used by this custom element and its descendants.
		 * After calling this method, the element can no longer be used,
		 * and should be removed from the document.
		 */
		destroy: function () {
			// Destroy descendants
			this.findCustomElements().forEach(function (w) {
				if (w.destroy) {
					w.destroy();
				}
			});

			if (this.parentNode) {
				this.parentNode.removeChild(this);
				this.detachedCallback();
			}
		},

		/**
		 * Emits a synthetic event of specified type, based on eventObj.
		 * @param {string} type - Name of event.
		 * @param {Object} [eventObj] - Properties to mix in to emitted event.  Can also contain
		 * `bubbles` and `cancelable` properties to control how the event is emitted.
		 * @param {Element} [node] - Element to emit event on, defaults to `this`.
		 * @returns {boolean} True if the event was *not* canceled, false if it was canceled.
		 * @example
		 * myWidget.emit("query-success", {});
		 * @protected
		 */
		emit: function (type, eventObj, node) {
			return on.emit(node || this, type, eventObj);
		},

		/**
		 * Call specified function when event occurs.
		 *
		 * Note that the function is not run in any particular scope, so if (for example) you want it to run
		 * in the element's scope you must do `myCustomElement.on("click", myCustomElement.func.bind(myCustomElement))`.
		 *
		 * Note that `delite/Widget` overrides `on()` so that `on("focus", ...)` and `on("blur", ...) will trigger the
		 * listener when focus moves into or out of the widget, rather than just when the widget's root node is
		 * focused/blurred.  In other words, the listener is called when the widget is conceptually focused or blurred.
		 *
		 * @param {string} type - Name of event (ex: "click").
		 * @param {Function} func - Callback function.
		 * @param {Element} [node] - Element to attach handler to, defaults to `this`.
		 * @returns {Object} Handle with `remove()` method to cancel the event.
		 */
		on: function (type, func, node) {
			return on(node || this, type, func);
		},

		// Override Stateful#getPropsToObserve() because the way to get the list of properties to watch is different
		// than for a plain Stateful.  Especially since IE doesn't support prototype swizzling.
		getPropsToObserve: function () {
			return this._ctor._propsToObserve;
		},

		// Before deliver() runs, process any native properties (tabIndex, dir) etc. that may have been
		// set without the custom setter getting called.
		deliver: dcl.before(function () {
			this._processNativeProps();
		}),

		/**
		 * Search subtree under root returning custom elements found.
		 * @param {Element} [root] - Node to search under.
		 */
		findCustomElements: function (root) {
			var outAry = [];

			function getChildrenHelper(root) {
				for (var node = root.firstChild; node; node = node.nextSibling) {
					if (node.nodeType === 1 && node.createdCallback) {
						outAry.push(node);
					} else {
						getChildrenHelper(node);
					}
				}
			}

			getChildrenHelper(root || this);
			return outAry;
		}
	});

	// Setup automatic chaining for lifecycle methods.
	// destroy() is chained in Destroyable.js.
	dcl.chainAfter(CustomElement, "createdCallback");
	dcl.chainAfter(CustomElement, "attachedCallback");
	dcl.chainBefore(CustomElement, "detachedCallback");

	return CustomElement;
});
