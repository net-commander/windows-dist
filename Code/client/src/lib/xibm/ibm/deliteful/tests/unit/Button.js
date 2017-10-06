define([
	"dcl/dcl", "intern!object", "intern/chai!assert", "delite/register",
	"requirejs-dplugins/jquery!attributes/classes",
	"deliteful/Button"
], function (dcl, registerSuite, assert, register, $, Button) {

	var container, html = "<button is='d-button' id='b1'>b1</button>" +
		"<button is='d-button' id='b2' value='foo'>b2</button>" +
		"<button is='d-button' id='b3' iconClass='ic1'>b3</button>" +
		"<button is='d-button' id='b4' iconClass='ic1' label='on'>off</button>" +
		"<button is='d-button' id='b5' label='on' ></button>" +
		"<button is='d-button' id='b6' label='on' showLabel='false'></button>" +
		"<button is='d-button' id='b7' label='on' showLabel='false' title='alternative title'></button>" +
		"<button is='d-button' id='b8' label='on' title='alternative title'></button>";

	var commonSuite = {
		"Default State": function () {
			var b = document.getElementById("b1");
			assert.isTrue($(b).hasClass("d-button"), "Unexpected baseClass.");
			assert.isFalse(b.disabled, "Unexpected default value for 'disabled' property");
			assert.strictEqual(b.label, "b1", "Unexpected default value for 'label' (inherited) property.");
			assert.strictEqual(b.textContent, "b1", "Unexpected default value for textContent.");

			var b2 = document.getElementById("b2");
			assert.strictEqual(b2.value, "foo",
				"Unexpected default value for 'value' property if 'value' specified/unchecked");

			b = document.getElementById("b3");
			assert.strictEqual(b.label, "b3", "Unexpected default value for 'label' (inherited) property.");
			assert.strictEqual(b.textContent, "b3", "Unexpected default value for textContent [2].");
			assert.strictEqual(b.iconClass, "ic1", "Unexpected default value for iconClass.");
			assert.isTrue(/ic1/.test(b.iconNode.className), "Missing icon css class on iconNode.");
			assert.isTrue(b.showLabel, "Unexpected default value for showLabel");
		},

		"label": function () {
			var b4 = document.getElementById("b4");
			assert.strictEqual(b4.label, "on", "b4.label");
			assert.strictEqual(b4.textContent, "on", "b4.textContent");
			b4.label = "b4";
			b4.deliver();
			assert.strictEqual(b4.label, "b4", "b4.label after label set.");
			assert.strictEqual(b4.textContent, "b4", "b4.textContent after label set.");
		},

		"title": function () {
			var b5 = document.getElementById("b5");
			assert.strictEqual(b5.title, "", "b5.title");
			b5.title = "on";
			b5.deliver();
			assert.strictEqual(b5.title, "on", "b5.title after title set.");
		},

		"showLabel": function () {
			var b5 = document.getElementById("b5");
			assert.isTrue(b5.showLabel, "b5.showLabel");
			b5.showLabel = false;
			b5.deliver();
			assert.isFalse(b5.showLabel, "b5.showLabel after showLabel set to false.");
		},

		"label/title on showLabel (T/F)": function () {
			var b5 = document.getElementById("b5");
			assert.strictEqual(b5.label, "on", "b5.label");
			assert.strictEqual(b5.title, "", "b5.title");
			b5.label = "off";
			b5.showLabel = false;
			b5.deliver();
			assert.strictEqual(b5.label, "off", "b5.label after label and showLabel set.");
			assert.strictEqual(b5.title, "off", "b5.title after label and showLabel set.");
		},

		"label/title on showLabel (F/T)": function () {
			var b6 = document.getElementById("b6");
			assert.strictEqual(b6.label, "on", "b6.label");
			assert.strictEqual(b6.title, "on", "b6.title");
			b6.label = "off";
			b6.showLabel = true;
			b6.deliver();
			assert.strictEqual(b6.label, "off", "b6.label after label and showLabel set.");
			assert.strictEqual(b6.title, "", "b6.title after label and showLabel set.");
		},

		"title on showLabel (T/F)": function () {
			var b5 = document.getElementById("b5");
			assert.strictEqual(b5.title, "", "b5.title");
			b5.showLabel = false;
			b5.deliver();
			assert.strictEqual(b5.title, "on", "b5.title after showLabel set (false).");
		},

		"title on showLabel (F/T)": function () {
			var b6 = document.getElementById("b6");
			assert.strictEqual(b6.title, "on", "b6.title");
			b6.showLabel = true;
			b6.deliver();
			assert.strictEqual(b6.title, "", "b6.title after showLabel set (true).");
		},

		"pre-set title on showLabel (F/T)" : function () {
			var b7 = document.getElementById("b7");
			assert.strictEqual(b7.title, "alternative title", "b7.title");
			b7.showLabel = true;
			b7.deliver();
			assert.strictEqual(b7.title, "alternative title", "b7.title after showLabel set.");
		},

		"pre-set title on showLabel (T/F)" : function () {
			var b8 = document.getElementById("b8");
			assert.strictEqual(b8.title, "alternative title", "b8.title");
			b8.showLabel = false;
			b8.deliver();
			assert.strictEqual(b8.title, "alternative title", "b8.title after showLabel set.");
		},

		"pre-set title on label" : function () {
			var b7 = document.getElementById("b7");
			assert.strictEqual(b7.label, "on", "b7.title");
			assert.strictEqual(b7.title, "alternative title", "b7.title");
			b7.label = "off";
			b7.deliver();
			assert.strictEqual(b7.label, "off", "b7.title after label set.");
			assert.strictEqual(b7.title, "alternative title", "b7.title after label set.");
		},

		"iconClass": function () {
			var b4 = document.getElementById("b4");
			// test label is properly updated according to checked state when checkedLabel is set a value
			b4.iconClass = "ic3";
			b4.deliver();
			assert.isTrue(/ic3/.test(b4.iconNode.className), "Unexpected value for css class on iconNode (b4) [2].");
		},

		"value": function () {
			var b = document.getElementById("b1");
			b.value = "foo";
			assert.strictEqual(b.value, "foo", "Unexpected value for 'value' attribute.");
		},

		"aria-label": function () {
			var b = document.getElementById("b6");
			assert.strictEqual(b.getAttribute("aria-label"), "on", "b6.aria-label");
			b.label = "off";
			b.deliver();
			assert.strictEqual(b.getAttribute("aria-label"), "off", "b6.aria-label on label change");
		},

		afterEach: function () {
			container.parentNode.removeChild(container);
		}
	};

	// Markup
	var suite = {
		name: "deliteful/Button: markup",
		beforeEach: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			container.innerHTML = html;
			register.deliver();
		}
	};
	dcl.mix(suite, commonSuite);
	registerSuite(suite);

	suite = {
		name: "deliteful/Button: programmatic",
		beforeEach: function () {
			container = document.createElement("div");
			document.body.appendChild(container);
			var b = new Button({id: "b1", label: "b1"});
			container.appendChild(b);
			b.attachedCallback();
			b = new Button({id: "b2", value: "foo", label: "b2"});
			container.appendChild(b);
			b.attachedCallback();
			b = new Button({id: "b3", label: "b3", iconClass: "ic1"});
			container.appendChild(b);
			b.attachedCallback();
			b = new Button({id: "b4", label: "on", iconClass: "ic1"});
			container.appendChild(b);
			b.attachedCallback();
			b = new Button({id: "b5", label: "on"});
			container.appendChild(b);
			b.attachedCallback();
			b = new Button({id: "b6", label: "on", showLabel: false});
			container.appendChild(b);
			b.attachedCallback();
			b = new Button({id: "b7", label: "on", showLabel: false, title: "alternative title"});
			container.appendChild(b);
			b.attachedCallback();
			b = new Button({id: "b8", label: "on", title: "alternative title"});
			container.appendChild(b);
			b.attachedCallback();
		}
	};
	dcl.mix(suite, commonSuite);
	registerSuite(suite);
});