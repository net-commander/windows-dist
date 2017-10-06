/** @module delite/DisplayContainer */
define(["dcl/dcl", "requirejs-dplugins/Promise!", "./Container"],
	function (dcl, Promise, Container) {
	
	/**
	 * Dispatched before child is shown.
	 * @example
	 * document.addEventListener("delite-before-show", function (evt) {
	 *      console.log("about to show child", evt.child);
	 * });
	 * @event module:delite/DisplayContainer#delite-before-show
	 * @property {Element} child - reference to child element
	 */
	
	/**
	 * Dispatched after child is shown.
	 * @example
	 * document.addEventListener("delite-after-show", function (evt) {
	 *      console.log("just displayed child", evt.child);
	 * });
	 * @event module:delite/DisplayContainer#delite-after-show
	 * @property {Element} child - reference to child element
	 */
	
	/**
	 * Dispatched to let an application level listener create/load the child node.
	 * @example
	 * document.addEventListener("delite-display-load", function (evt) {
	 *     evt.setChild(new Promise(function (resolve, reject) {
	 *         // fetch the data for the specified id, then create a node with that data
	 *         fetchData(evt.dest).then(function(data) {
	 *             var child = document.createElement("div");
	 *             child.innerHTML = data;
	 *             resolve({child: child});
	 *         });
	 *     );
	 * });
	 * @event module:delite/DisplayContainer#delite-display-load
	 * @property {Function} setChild - method to set child element, or Promise for child element
	 */
	
	/**
	 * Dispatched before child is hidden.
	 * @example
	 * document.addEventListener("delite-before-hide", function (evt) {
	 *      console.log("about to hide child", evt.child);
	 * });
	 * @event module:delite/DisplayContainer#delite-before-hide
	 * @property {Element} child - reference to child element
	 */
	
	/**
	 * Dispatched after child is hidden.
	 * @example
	 * document.addEventListener("delite-after-hide", function (evt) {
	 *      console.log("just hid child", evt.child);
	 * });
	 * @event module:delite/DisplayContainer#delite-after-hide
	 * @property {Element} child - reference to child element
	 */
	
	/**
	 * Mixin for widget containers that need to show on or off a child.
	 *
	 * When the show method is called a container extending this mixin is able to be notified that one of
	 * its children must be displayed. Before displaying it, it will fire the `delite-display-load` event
	 * giving a chance to a listener to load and create the child if not yet available before proceeding with
	 * the display. After the display has been performed a `delite-display-complete` event will be fired.
	 * @mixin module:delite/DisplayContainer
	 * @augments module:delite/Container
	 */
	return dcl(Container, /** @lends module:delite/DisplayContainer# */ {
		/**
		 * This method must be called to display a particular destination child on this container.
		 * @param {Element|string} dest - Element or Element id that points to the child this container must
		 * display.
		 * @param {Object} [params] - Optional params that might be taken into account when displaying the child.
		 * This can be the type of visual transitions involved. This might vary from one DisplayContainer to another.
		 * @returns {Promise} A promise that will be resolved when the display & transition effect will have been
		 * performed.
		 * @fires module:delite/DisplayContainer#delite-before-show
		 * @fires module:delite/DisplayContainer#delite-after-show
		 * @fires module:delite/DisplayContainer#delite-display-load
		 */
		show: function (dest, params) {
			var self = this;
			return this.loadChild(dest, params).then(function (value) {
				// if view is not already a child this means we loaded a new view (div), add it
				if (self.getIndexOfChild(value.child) === -1) {
					self.addChild(value.child, value.index);
				}
				// the child is here, actually perform the display
				// notify everyone we are going to proceed
				var event = {
					dest: dest,
					cancelable: false
				};
				dcl.mix(event, params);
				dcl.mix(event, value);

				self.emit("delite-before-show", event);

				return Promise.resolve(self.changeDisplay(value.child, event)).then(function () {
					self.emit("delite-after-show", event);

					return value;
				});
			});
		},

		/**
		 * This method must be called to hide a particular destination child on this container.
		 * @param {Element|string} dest - Element or Element id that points to the child this container must
		 * hide.
		 * @param {Object} [params] - Optional params that might be taken into account when hiding the child.
		 * This can be the type of visual transitions involved.  This might vary from one DisplayContainer to another.
		 * @returns {Promise} A promise that will be resolved when the display & transition effect will have been
		 * performed.
		 * @fires module:delite/DisplayContainer#delite-display-load
		 * @fires module:delite/DisplayContainer#delite-before-hide
		 * @fires module:delite/DisplayContainer#delite-after-hide
		 */
		hide: function (dest, params) {
			var args = {hide: true};
			dcl.mix(args, params);
			var self = this;
			return this.loadChild(dest, args).then(function (value) {
				// the child is here, actually perform the display
				// notify everyone we are going to proceed
				var event = {
					dest: dest,
					bubbles: true,
					cancelable: false,
					hide: true
				};
				dcl.mix(event, params);
				dcl.mix(event, value);

				self.emit("delite-before-hide", event);

				return Promise.resolve(self.changeDisplay(value.child, event)).then(function () {
					// one might listen to that event and actuall remove the child if needed (view unload feature)
					self.emit("delite-after-hide", event);
					return value;
				});
			});
		},

		/**
		 * This method must perform the display and possible transition effect.  It is meant to be specialized by
		 * subclasses.
		 * @param {Element|string} widget - Element or Element id that points to the child this container must
		 * show or hide.
		 * @param {Object} [params] - Optional params that might be taken into account when displaying the child.  This
		 * can be the type of visual transitions involved.  This might vary from one DisplayContainer to another.
		 * By default on the "hide" param is supporting meaning that the transition should hide the widget
		 * not display it.
		 * @returns {Promise} Optionally a promise that will be resolved when the display & transition effect will have
		 * been performed.
		 */
		changeDisplay: function (widget, /*jshint unused: vars*/params) {
			if (params.hide === true) {
				widget.style.visibility = "hidden";
				widget.style.display = "none";
			} else {
				widget.style.visibility = "visible";
				widget.style.display = "";
			}
		},

		/**
		 * This method must be called to load a particular child on this container.
		 * A `delite-display-load` event is fired giving the chance to a controller to load/create the child.
		 * This method can be redefined to actually load a child of the container. If a controller is not present,
		 * it just looks up elements by id.
		 * @param {Element|string} dest  - Element or Element id that points to the child this container must
		 * load.
		 * @param {Object} [params] - Optional params that might be taken into account when removing the child.
		 * @returns {Promise} A promise that will be resolved when the child will have been
		 * loaded with an object of the following form: `{ child: childElement }` or with an optional index
		 * `{ child: childElement, index: index }`. Other properties might be added to	the object if needed.
		 * @fires module:delite/DisplayContainer#delite-display-load
		 */
		loadChild: function (dest, params) {
			// we need to warn potential app controller we are going to load a view
			var child, event = {
				dest: dest,
				setChild: function (val) {
					child = val;
				}
			};
			dcl.mix(event, params);

			// we now need to warn potential app controller we need to load a new child.
			// if the controller specifies the child then use it,
			// otherwise call the container load method
			this.emit("delite-display-load", event);
			if (!child) {
				child = { child: typeof dest === "string" ? this.ownerDocument.getElementById(dest) : dest };
			}
			return Promise.resolve(child);
		}
	});
});