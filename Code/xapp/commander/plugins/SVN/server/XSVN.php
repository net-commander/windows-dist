<?php
/**
 * @version 0.1.0
 *
 * @author https://github.com/mc007
 * @license : GPL v2. http://www.gnu.org/licenses/gpl-2.0.html
 */

/***
 * Example server plugin.
 * @remarks
    -This class is running in the CMS context already!
    -A function's result will be wrapped automatically into the specified transport envelope, eg: JSON-RPC-2.0 or JSONP
    -implementing Xapp_Rpc_Interface_Callable is just for demonstration
 */

class XSVN extends Xapp_Commander_Plugin
{

    /***
     * Invoked by the plugin manager, before 'load'!. time to register our subscriptions
     * @return int|void
     */
    public function setup(){
        /***
         * Listen to file changes
         */
        /*
        xcom_subscribe(XC_OPERATION_WRITE_STR,function($mixed)
        {
            if (preg_match(XSVN::MATCH_PATTERN, $mixed[XAPP_EVENT_KEY_PATH])) {
                XSVN::instance()->onSavingSVNFile($mixed);
            }
        });
        */
    }

    /***
     * Invoked by the plugin manager, time to pull dependencies but we don't !
     * @return int|void
     */
    public function load(){}

    /**
     * Xapp_Singleton interface impl. Its actually done in the base class,...
     *
     * static singleton method to create static instance of driver with optional third parameter
     * xapp options array or object
     *
     * @error 15501
     * @param null|mixed $options expects optional xapp option array or object
     * @return XSVN
     */
    public static function instance($options = null)
    {
        if(self::$_instance === null)
        {
            self::$_instance = new self($options);
        }
        return self::$_instance;
    }

}