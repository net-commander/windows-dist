require([
	"dojo/node!lodash",
	"dojo/node!commander",
	"require"
], function (_,commander,require) {
	global['_'] = _;
	global['commander'] = commander;
	try {
		require(['nxappmain/serverbuild'], function (ctx) {
			require(['nxappmain/main_server'], function (ctx) {
			});
		});

	}catch(e){
		console.error('error main ',e);
	}
	return {};
});
