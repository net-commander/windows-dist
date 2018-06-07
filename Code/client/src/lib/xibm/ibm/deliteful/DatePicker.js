define([
	"delite/register",
	"deliteful/TimeBase",
	"deliteful/ViewStack",
	"./DatePicker/DayPicker",
	"./DatePicker/MonthPicker",
	"./DatePicker/YearPicker",
	"requirejs-dplugins/i18n!./DatePicker/nls/DatePicker",
	"delite/theme!./DatePicker/themes/{{theme}}/DatePicker.css",
	"requirejs-dplugins/css!deliteful/ViewStack/transitions/flip.css"
], function (
	register,
	TimeBase,
	ViewStack,
	DayPicker,
	MonthPicker,
	YearPicker,
	messages
) {
	"use strict";

	/**
	 * Small calendar to be used as a dropdown, designed for picking a date.
	 */
	return register("d-date-picker", [ViewStack, TimeBase], {
		baseClass: "d-date-picker d-view-stack",

		/**
		 * Selected date.
		 * @member {Date}
		 */
		value: null,

		/**
		 * Aria-label for the day picker (initial screen)
		 * @member {string}
		 * @readonly
		 */
		dayPickerLabel: messages["day-picker-label"],

		/**
		 * Aria-label for the day picker (initial screen)
		 * @member {string}
		 * @readonly
		 */
		monthPickerLabel: messages["month-picker-label"],

		/**
		 * Aria-label for the day picker (initial screen)
		 * @member {string}
		 * @readonly
		 */
		yearPickerLabel: messages["year-picker-label"],

		/**
		 * Label for button to go to previous month.
		 * @member {string}
		 * @readonly
		 */
		previousMonthButtonLabel: messages["previous-month"],

		/**
		 * Label for button to go to next month.
		 * @member {string}
		 * @readonly
		 */
		nextMonthButtonLabel: messages["next-month"],

		/**
		 * Label for button to go to previous year.
		 * @member {string}
		 * @readonly
		 */
		previousYearButtonLabel: messages["previous-year"],

		/**
		 * Label for button to go to next year.
		 * @member {string}
		 * @readonly
		 */
		nextYearButtonLabel: messages["next-year"],

		/**
		 * Label for button to go to previous set of years.
		 * @member {string}
		 * @readonly
		 */
		previousYearRangeButtonLabel: messages["previous-year-range"],

		/**
		 * Label for button to go to next set of years.
		 * @member {string}
		 * @readonly
		 */
		nextYearRangeButtonLabel: messages["next-year-range"],

		/**
		 * CSS class for icon to go to previous month or year,
		 * or on the year panel, to go back 25 years.
		 */
		previousIconClass: "d-caret-previous",

		/**
		 * CSS class for icon to go to next month or year,
		 * or on the year panel, to go forwards 25 years.
		 */
		nextIconClass: "d-caret-next",

		// Override ViewStack's default transition of "slide".
		transition: "flip",

		/**
		 * True if the user has explicitly selected a year, or
		 * a year was selected via the DatePicker's value being set.
		 */
		yearSelected: false,

		/**
		 * True if the user has explicitly selected a month, or
		 * a month was selected via the DatePicker's value being set.
		 */
		monthSelected: false,

		render: function () {
			// Create the DayPicker initially, and create MonthPicker and YearPicker on demand.
			this.dayPicker = new DayPicker({
				ariaLabel: this.dayPickerLabel,
				dateClassObj: this.dateClassObj,
				dateModule: this.dateModule,
				dateLocaleModule: this.dateLocaleModule,
				firstDayOfWeek: this.firstDayOfWeek,
				previousIconClass: this.previousIconClass,
				nextIconClass: this.nextIconClass,
				previousMonthButtonLabel: this.previousMonthButtonLabel,
				nextMonthButtonLabel: this.nextMonthButtonLabel,
				previousYearButtonLabel: this.previousYearButtonLabel,
				nextYearButtonLabel: this.nextYearButtonLabel,
				value: this.value
			});

			this.dayPicker.on("current-month-clicked", function (evt) {
				this.showMonthPicker();
				evt.stopPropagation();
			}.bind(this));
			this.dayPicker.on("current-year-clicked", function (evt) {
				this.showYearPicker();
				evt.stopPropagation();
			}.bind(this));
			this.dayPicker.on("change", function (evt) {
				evt.stopPropagation();
				this.value = this.dayPicker.value;
				this.emit("change");
			}.bind(this));

			this.appendChild(this.dayPicker);
		},

		showMonthPicker: function () {
			if (!this.monthPicker) {
				this.monthPicker = new MonthPicker({
					ariaLabel: this.monthPickerLabel,
					dateClassObj: this.dateClassObj,
					dateModule: this.dateModule,
					dateLocaleModule: this.dateLocaleModule,
					previousIconClass: this.previousIconClass,
					nextIconClass: this.nextIconClass
				});

				this.monthPicker.on("month-selected", function (evt) {
					this.monthSelected = true;
					this.dayPicker.setMonth(evt.month);
					this.show(this.dayPicker).then(function () {
						// Trigger focus on previously focused day of month.  Setting focus while DayPicker
						// is hidden doesn't work, so wait until animation completes.
						this.dayPicker.notifyCurrentValue("currentFocus");
					}.bind(this));
				}.bind(this));
			}

			this.monthPicker.month = this.monthSelected ? this.dayPicker.currentMonth : -1;
			this.show(this.monthPicker);
		},

		showYearPicker: function () {
			if (!this.yearPicker) {
				this.yearPicker = new YearPicker({
					ariaLabel: this.yearPickerLabel,
					dateClassObj: this.dateClassObj,
					dateModule: this.dateModule,
					dateLocaleModule: this.dateLocaleModule,
					previousIconClass: this.previousIconClass,
					nextIconClass: this.nextIconClass,
					previousYearRangeButtonLabel: this.previousYearRangeButtonLabel,
					nextYearRangeButtonLabel: this.nextYearRangeButtonLabel
				});

				this.yearPicker.on("year-selected", function (evt) {
					this.yearSelected = true;
					this.dayPicker.setYear(evt.year);
					this.show(this.dayPicker).then(function () {
						// Trigger focus on previously focused day of month.  Setting focus while DayPicker
						// is hidden doesn't work, so wait until animation completes.
						this.dayPicker.notifyCurrentValue("currentFocus");
					}.bind(this));
				}.bind(this));
			}

			this.yearPicker.year = this.yearSelected ? this.dayPicker.currentYear : null;
			this.yearPicker.centeredYear = this.dayPicker.currentYear;
			this.show(this.yearPicker);
		},

		computeProperties: function (oldVals) {
			if ("value" in oldVals) {
				this.yearSelected = this.monthSelected = (this.value !== null);

				// Start on month containing this.value, or if there's no value set, then the current day.
				if (this.dayPicker) {
					this.dayPicker.value = this.value;
				}
			}
		},

		focus: function () {
			// Note: assumes that the day view is currently selected.  That will always be true
			// is user is using keyboard navigation.
			this.dayPicker.focus();
		}
	});
});
