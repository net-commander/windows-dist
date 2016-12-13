<?php
/**
 * @version 0.1.0
 *
 * @author https://github.com/mc007
 * @license : GPL v2. http://www.gnu.org/licenses/gpl-2.0.html
 * @package XApp-Commander\Plugin\XLESS
 */

/***
 * Example server plugin.
 * @remarks
    -This class is running in the CMS context already!
    -A function's result will be wrapped automatically into the specified transport envelope, eg: JSON-RPC-2.0 or JSONP
    -implementing Xapp_Rpc_Interface_Callable is just for demonstration
 */

class XLESS extends Xapp_Commander_Plugin
{

    /***
     * Match pattern on what files we're reacting
     */
    const MATCH_PATTERN = '/\.less$/U';

    /**
     * Instance of the LESS compiler
     * @var XApp_Less_Compiler
     */
    protected $compiler=null;

    /***
     * Dummy call
     * @return string
     * @link http://0.0.0.0/wordpress/wp-content/plugins/xcom/server/service/index_wordpress_admin.php?service=XLESS.test&callback=bla
     * @remarks : make it public before !
     */
    protected  function test(){
        return 'cool';
    }

    /***
     * Return a lessc compiler instance.
     * Loads all deps as well.
     * @param null $file
     * @return null|XAPP_Less_Compiler
     */
    public function _getLESSCompiler($file=null){
        if($this->compiler){
            return $this->compiler;
        }

        if(!class_exists('XApp_Less_Compiler')){
            require dirname(__FILE__).'/Compiler.php';
        }
        $this->compiler = new XAPP_Less_Compiler($file);
        return $this->compiler;
    }

    /***
     *
     * @param $eventData
     */
    public function _onSavingLESSFile($eventData){

        $content = &$eventData[XAPP_EVENT_KEY_CONTENT];//attention! its a pointer
        $path = $eventData[XAPP_EVENT_KEY_PATH];//the full absolute path to the saved file
        $relPath = $eventData[XAPP_EVENT_KEY_REL_PATH];//the relative path within the repository
        $xfile = $eventData[XAPP_EVENT_KEY_CALLEE];//the XFile service, does all the File I/O


        $compiler = $this->_getLESSCompiler($path);
        $compiler->addImportDir(dirname($path).DIRECTORY_SEPARATOR);
        $css = null;
        try {
            $css = $compiler->compileFile($path);
        } catch (exception $e) {
            $message = $e->getMessage();
            $message = str_replace(dirname($path),'',$message);//hide full path
            throw new Xapp_Util_Exception_Storage(vsprintf('Crash in less %s', array($message)), 1640102);
        }

        if($css!==null && is_string($css) && strlen($css)>0){
            $cssSavePath = preg_replace(XLESS::MATCH_PATTERN,'.css',$relPath);
            $cssRelPath = preg_replace(XLESS::MATCH_PATTERN,'.css',$relPath);

	        xapp_clog('less: did update ' .$cssSavePath);
            $fp = fopen($cssSavePath, "w");
	        fputs($fp, $css);
	        fclose($fp);
	        clearstatcache(true, $cssSavePath);

            /***
             * Register client message, possibly the 'Sandbox' plugin or others are interested
             */
            xcom_event(XAPP_CLIENT_EVENT,null,array(
                XAPP_EVENT_KEY_CLIENT_EVENT=>XAPP_CLIENT_EVENT_FILE_CHANGED,
                XAPP_EVENT_KEY_REL_PATH=>$cssRelPath
            ),null);
        }
    }

    /***
     * Invoked by the plugin manager, before 'load'!. time to register our subscriptions
     * @return int|void
     */
    public function setup(){

	    /***
         * Listen to file changes
         */
        xcom_subscribe(XC_OPERATION_WRITE_STR,function($mixed)
        {
	        if (preg_match(XLESS::MATCH_PATTERN, $mixed[XAPP_EVENT_KEY_PATH])) {
                XLESS::instance()->_onSavingLESSFile($mixed);
            }
        });
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
     * @return XLESS
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