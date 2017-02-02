/** @module deliteful/Button */
define([
	"dcl/dcl",
	"requirejs-dplugins/has",
	"delite/register",
	"delite/Widget",
	"delite/Container",
	"requirejs-dplugins/has!bidi?./Button/bidi/Button",
	"delite/handlebars!./Button/Button.html",
	"delite/theme!./Button/themes/{{theme}}/Button.css"
], function (dcl, has, register, Widget,Container, BidiButton, template) {

	/**
	 * A Non-templated form-aware button widget.
	 * A Button can display a label, an icon, or both. Icon is specified via the iconClass property that
	 * takes the name of the class to apply to the button node to display the icon.
	 * @example
	 * <style>
	 *   .iconForButton {
	 *     background-image: url('images/cut.png');
	 *     width: 16px;
	 *     height: 16px;
	 *   }
	 * </style>
	 * <button is="d-button" iconClass="iconForButton">Click Me</button>
	 * @class module:deliteful/Button
	 * @augments module:delite/Widget
	 */
	var Button = dcl(Container, /** @lends module:deliteful/Button# */ {

		/**
		 * The text to display in the button.
		 * @member {string}
		 * @default ""
		 */
		label: "",

		/**
		 * The name of the CSS class to apply to DOMNode in button to make it display an icon.
		 * @member {string}
		 * @default ""
		 */
		iconClass: "",

		/**
		 * The name of the CSS class of this widget.
		 * @member {string}
		 * @default "d-button"
		 */
		baseClass: "d-button",

		template: template,

		createdCallback: function () {
			// Get label from innerHTML, and then clear it since we are to put the label in a <span>
			if (!this.label) {
				this.label = this.textContent.trim();
				//this.innerHTML = "";
			}
		},

		computeProperties: function (props) {
			if ("title" in props || "label" in props) {
				this.title = this.title || this.label || "";
			}
		}
	});

	var ButtonElt = register("d-button", has("bidi") ? [HTMLButtonElement, Button, BidiButton] :
		[HTMLButtonElement, Button]);
	ButtonElt.Impl = Button;
	return ButtonElt;
});
