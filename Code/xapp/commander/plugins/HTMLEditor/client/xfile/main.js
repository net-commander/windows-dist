/***
 *
 *  Plugin main entry file.
 *  Also used at compile time to include all the plugin's depenedencies.
 *
 *  Remarks : please add all your includes here instead of defining them in submodules.
 *
 */
define([ 'dojo/has', 'require' ], function (has, require) {

    if (has('host-browser'))
    {
      require([
            'dojo/_base/lang',
            './HTMLEditorManager',
            'xide/factory',
            'xide/types'
      ], function (lang,HTMLEditorManager,factory,types)
        {
            var _init = function(eventData){

                var ctrArgs = {};
                if(eventData.name!=='HTMLEditor'){//not for us
                    return;
                }
               lang.mixin(ctrArgs,eventData);
                if(!ctrArgs.fileManager){
                    ctrArgs.fileManager=xfile.getContext().getFileManager();
                }

                var imgManager =new HTMLEditorManager(ctrArgs);
            };

            factory.subscribe(types.EVENTS.ON_PLUGIN_READY,_init,this);
            factory.publish(types.EVENTS.ON_PLUGIN_LOADED,{
                name:'HTMLEditor'
            },this);

        });
    }
    else {
        console.log('Hello from the server!');
    }
});