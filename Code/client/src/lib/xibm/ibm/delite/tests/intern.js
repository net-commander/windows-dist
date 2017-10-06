// Run grunt --help for help on how to run from the command line.
// Alternately, load this URL to run from the browser:
// http://localhost/delite/node_modules/intern/client.html?config=tests/intern&suites=delite/tests/unit/all

// Learn more about configuring this file at <https://github.com/theintern/intern/wiki/Configuring-Intern>.
// These default settings work OK for most people. The options that *must* be changed below are the
// packages, suites, excludeInstrumentation, and (if you want functional tests) functionalSuites.

define({
	// The port on which the instrumenting proxy will listen
	proxyPort: 9000,

	// Browsers to run integration testing against. Note that version numbers must be strings if used with Sauce
	// OnDemand. Options that will be permutated are browserName, version, platform, and platformVersion; any other
	// capabilities options specified for an environment will be copied as-is
	environments: [
		{ browserName: "internet explorer", version: "11", platform: "Windows 8.1",
			requireWindowFocus: "true", name: "delite"},
		{ browserName: "firefox", version: "53", platform: [ /* "OS X 10.6", "Linux", */ "Windows 7" ],
			name: "delite"},
		{ browserName: "chrome", version: "58", platform: [ /* "OS X 10.6", "Linux", */ "Windows 7" ],
			name: "delite"},

		// Use V9 because Safari 10 doesn't support isDisplayed(),
		// see https://github.com/SeleniumHQ/selenium/issues/3029
		{ browserName: "safari", version: "9", name: "delite" },

		{ browserName: "iphone", platform: "OS X 10.10", version: "10.2", deviceName: "iPad Retina", name: "delite" },
		{ browserName: "android", platform: "Linux", version: "6.0",
			deviceName: "Android Emulator", deviceType: "tablet", name: "delite" }
	],

	// Maximum number of simultaneous integration tests that should be executed on the remote WebDriver service
	maxConcurrency: 5,

	// Whether or not to start Sauce Connect before running tests
	tunnel: "SauceLabsTunnel",

	// Maximum duration of a test, in milliseconds
	defaultTimeout: 300000, // 5 minutes

	// Maximum time to wait for something (pollUntil, etc...)
	WAIT_TIMEOUT: 180000, // 3 minutes

	// Interval between two polling requests, in milliseconds (for pollUntil)
	POLL_INTERVAL: 500, // 0.5 seconds

	basePath: "..",

	loaders: {
		"host-node": "requirejs",
		"host-browser": "../../requirejs/require.js"
	},

	// Non-functional test suite(s) to run in each browser
	suites: [ "delite/tests/unit/all" ],

	// Functional test suite(s) to run in each browser once non-functional tests are completed
	functionalSuites: [ "delite/tests/functional/all" ],

	// Disable code coverage because it gets internal errors on iOS.
	excludeInstrumentation: true
});
