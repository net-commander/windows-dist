/** @module delite/StoreMap */
define(["dcl/dcl", "./Store"], function (dcl, Store) {

	var getvalue = function (map, item, key, store) {
		if (map[key + "Func"]) {
			return map[key + "Func"](item, store);
		} else if (map[key + "Attr"]) {
			return item[map[key + "Attr"]];
		} else {
			return item[key];
		}
	};

	var setvalue = function (map, item, key, store, value) {
		if (map[key + "Func"]) {
			map[key + "Func"](item, store, value);
		} else if (map[key + "Attr"]) {
			item[map[key + "Attr"]] = value;
		} else {
			item[key] = value;
		}
	};

	var propregexp = /^(?!_)(\w)+(?=Attr$|Func$)/;

	var capitalize = /f(?=unc$)|a(?=ttr$)/;


	/**
	 * Mixin providing store binding management for widgets that extend delite/Store. Classes extending
	 * this mixin can easily define how store items properties are mapped in the render items properties
	 * consumable by the widget. The mapping can either occur by property (property A in store item
	 * corresponds to property B in render item) or by function (a function is specified that mapped the
	 * store item into the value of a property of the render item)..
	 *
	 * For each mapped property "foo" from the render item one can provide:
	 *
	 * - fooAttr property in which case the mapping is looking into the store item property specified
	 *   by fooAttr
	 * - fooFunc property function in which case the mapping is delegating the mapping operation to the
	 *   fooFunc function.
	 * - fooFunc is of the following signature (value must be passed only for set operations:
	 *   fooFunc(item, store, value)
	 * - if none of this is provided the mapping is looking into store item "foo" property
	 *
	 * Mapping properties are meant to be added to the widget class using the mixin. One can directly add the
	 * mapping properties to an instance but in this case there are two limitations:
	 *
	 * - The property must be added before the widget is started
	 * - If the property is added in the markup only fully lower case properties are supported
	 *   (e.g. foobar not fooBar)
	 *
	 * @mixin module:delite/StoreMap
	 * @augments module:delite/Store
	 */
	return dcl(Store, /** @lends module:delite/StoreMap# */{
		/**
		 * Whether the created render items will be updated when call the remap() function on the component
		 * allowing the consuming component to re-perform the mapping on demand. This property must not be
		 * changed after the initialization cycle.
		 * @member {boolean}
		 * @default false
		 */
		allowRemap: false,

		/**
		 * Array of item keys to be considered for mapping. The component will be introspected to find
		 * all the properties ending with "Attr" or "Func" and provide mapping for those.
		 * @member {Object}
		 * @default null
		 * @private
		 */
		_mappedKeys: null,

		/**
		 * If true, in addition to the mapped properties copy all the other properties of the store item into
		 * the render item with direct mapping. This property must not be changed after the initialization cycle.
		 * @member {boolean}
		 * @default false
		 */
		copyAllItemProps: false,

		// Called for each attribute specified declaratively.  Overrides CustomElement#parseAttribute().
		// Convert all attributes like foofunc="..." or fooattr="..." to instance properties.
		// foofunc="return item.value" converted to property named fooFunc w/value
		// function(item, store, value){ return item.value; }
		parseAttribute: dcl.superCall(function (sup) {
			return function (name, value) {
				if (/Attr$|Func$/i.test(name)) {
					name = name.toLowerCase();	// needed only on IE9
					name = this._propCaseMap[name] ||
							name.replace(capitalize, capitalize.exec(name)[0].toUpperCase());
					return {
						prop: name,
						value: /Attr$/.test(name) ? value :
							this.parseFunctionAttribute(value, ["item", "store", "value"])
					};
				} else {
					return sup.apply(this, arguments);
				}
			};
		}),

		queryStoreAndInitItems: dcl.superCall(function (sup) {
			return function (processQueryResult, force) {
				if (this._storeMapAttachedOnce || force) {
					sup.apply(this, arguments);
				} else {
					// we just keep the last processQueryResult we were called with as we are before attachment
					// and so only the last one should anyway have actual visual effect
					this._pendingQuery = processQueryResult;
				}
			};
		}),

		attachedCallback: function () {
			// This runs after the attributes have been processed (and converted into properties),
			// and after any properties specified to the constructor have been mixed in.
			// It should not re-run if the StoreMap is detached and then reattached.

			if (!this._storeMapAttachedOnce) {
				// look into properties of the instance for keys to map
				var mappedKeys = [];
				for (var prop in this) {
					var match = propregexp.exec(prop);
					if (match && mappedKeys.indexOf(match[0]) === -1) {
						mappedKeys.push(match[0]);
					}
				}

				// which are the considered keys in the store item itself
				if (this.copyAllItemProps) {
					this._itemKeys = [];
					for (var i = 0; i < mappedKeys.length; i++) {
						this._itemKeys.push(this[mappedKeys[i] + "Attr"] ?
							this[mappedKeys[i] + "Attr"] : mappedKeys[i]);
					}
				}

				this._mappedKeys = mappedKeys;
				this.deliver();

				if (this._pendingQuery) {
					this.queryStoreAndInitItems(this._pendingQuery, true);
					this._pendingQuery = null;
				}

				this._storeMapAttachedOnce = true;
			}
		},

		/**
		 * Creates a store item based from the widget internal item based on the various mapped properties. Works 
		 * asynchronously.
		 * @param {Object} renderItem - The render item.
		 * @returns {Promise}		
		 */
		renderItemToItem: function (renderItem) {
			var tmp = {}, store = this._storeAdapter;
			// special id case
			store.setIdentity(tmp, renderItem.id);
			for (var key in renderItem) {
				setvalue(this, tmp, key, store, renderItem[key]);
			}
			return store.get(tmp.id).then(function (item) {
				dcl.mix(item, tmp);
				return item;
			});
		},

		/**
		 * Returns the widget internal item for a given store item based on the various mapped properties.
		 * @param {Object} item - The store item.
		 * @returns {Object}
		 * @protected
		 */
		itemToRenderItem: function (item) {
			var renderItem = {};
			var mappedKeys = this._mappedKeys;
			var store = this._storeAdapter;

			// if we allow remap we need to store the initial item
			// we need this to be enumerable for dealing with update case (where only enumerable
			// properties are copied)
			// we might need it in other context as well
			renderItem.__item = item;
			// special id case
			var id = this.getIdentity(item);
			// Warning: we are using private API from dstore/Store here so let's do that conditionally
			// the purpose is to workaround the fact in some cases the store might miss the ID and we don't
			// want to bother people about that.
			if (id == null && store.setIdentity) {
				store.setIdentity(item, Math.random());
			}
			renderItem.id = this.getIdentity(item);
			// general mapping case
			for (var i = 0; i < mappedKeys.length; i++) {
				renderItem[mappedKeys[i]] = getvalue(this, item, mappedKeys[i], store);
			}
			if (this.copyAllItemProps) {
				for (var key in item) {
					if (this._itemKeys.indexOf(key) === -1 && item.hasOwnProperty(key)) {
						renderItem[key] = item[key];
					}
				}
			}

			return renderItem;
		},

		/**
		 * If allowRemap is true, the method allows to perform again the mapping between the data item
		 * and the render items. This might be useful is mapping by function is used and the execution
		 * context of the mapping function as changed so that the results would need to be updated.
		 * It should not be called if allowRemap is false.
		 */
		remap: function () {
			var items = this.renderItems;
			var mappedKeys = this._mappedKeys;
			for (var i = 0; i < items.length; i++) {
				for (var j = 0; j < mappedKeys.length; j++) {
					items[i][mappedKeys[j]] = getvalue(this, items[i].__item, mappedKeys[j], this.source);
				}
			}
		}
	});
});
