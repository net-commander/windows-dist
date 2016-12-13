define(["./_base/kernel", "./has", "require"], function(kernel, has, require){
	var nodeRequire = kernel.global.require && kernel.global.require.nodeRequire;

	if (!nodeRequire) {
		throw new Error("Cannot find the Node.js require");
	}

	var module = nodeRequire("module");

	return {
		// summary:
		//		This AMD plugin module allows native Node.js modules to be loaded by AMD modules using the Dojo
		//		loader. This plugin will not work with AMD loaders that do not expose the Node.js require function
		//		at `require.nodeRequire`.
		//
		// example:
		//	|	require(["dojo/node!fs"], function(fs){
		//	|		var fileData = fs.readFileSync("foo.txt", "utf-8");
		//	|	});

		load: function(/*string*/ id, /*Function*/ contextRequire, /*Function*/ load){
			/*global define:true */

			if(!require.nodeRequire){
				throw new Error("Cannot find native require function");
			}

			load((function(id, require){
				var oldDefine = define,
					result;

				if(id && global.moduleCache && global.moduleCache[id]){
					return global.moduleCache[id];
				}

				// Some modules may attempt to detect an AMD loader via define and define.amd.  This can cause issues
				// when other CommonJS modules attempt to load them via the standard node require().  If define is
				// temporarily moved into another variable, it will prevent modules from detecting AMD in this fashion.
				define = undefined;

				try{
					result = require(id);
				}finally{
					define = oldDefine;
				}
				return result;
			})(id, require.nodeRequire));
		},

		normalize: function (/**string*/ id, /*Function*/ normalize){
			// summary:
			//		Produces a normalized CommonJS module ID to be used by Node.js `require`. Relative IDs
			//		are resolved relative to the requesting module's location in the filesystem and will
			//		return an ID with path separators appropriate for the local filesystem

			if (id.charAt(0) === ".") {
				// absolute module IDs need to be generated based on the AMD loader's knowledge of the parent module,
				// since Node.js will try to use the directory containing `dojo.js` as the relative root if a
				// relative module ID is provided
				id = require.toUrl(normalize("./" + id));
			}

			return id;
		}
	};
});
