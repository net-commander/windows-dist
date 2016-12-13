<?php
/**
 * @version 0.1.0
 * @link http://www.xapp-studio.com
 * @author Luis Ramos
 * @author Guenter Baumgart
 * @license : GPL v2. http://www.gnu.org/licenses/gpl-2.0.html
 * @package XApp\xide\Controller
 */

xapp_import("xapp.Commons.Entity");
xapp_import('xapp.Utils.Strings');
xapp_import('xapp.Utils.Shell');
xapp_import('xapp.xcf.Base.Manager');
/***
 * Class XCF_NodeJS_Debug_Manager
 */
class XCF_NodeJS_Debug_Manager extends XCF_Manager{

    /*******************************
     * Hooks
     ********************************/

    /*******************************
     * Options
     ********************************/
    /**
     *  Debug session options
     */

    const DEBUG_TCP_PORT            = "XAPP_NODEJS_DEBUG_TCP_PORT";
    const DEBUG_TCP_HOST            = "XAPP_NODEJS_DEBUG_TCP_HOST";
    const DEBUG_PORT                = "XAPP_NODEJS_DEBUG_PORT";
    const CHECK_DEBUG_SERVICE       = "XAPP_NODEJS_CHECK_DEBUG_SERVICE";
    const KEEP_DEBUG_SERVICE_ALIVE  = "XAPP_NODEJS_KEEP_DEBUG_SERVICE_ALIVE";
    const WORKING_PATH              = "XAPP_NODEJS_WORKING_PATH";
    const DEBUGGER_PATH             = "XAPP_NODEJS_DEBUGGER_PATH";
    const NODEJS_APP                = "XAPP_NODEJS_APP";
    const NODEJS_DRIVER             = "XAPP_NODEJS_DRIVER";

    /**
     * options dictionary for this class containing all data type values
     *
     * @var array
     */
    public static $optionsDict = array
    (
        self::DEBUG_TCP_PORT            => XAPP_TYPE_INTEGER,
        self::DEBUG_TCP_HOST            => XAPP_TYPE_STRING,
        self::DEBUG_PORT                => XAPP_TYPE_INTEGER,
        self::CHECK_DEBUG_SERVICE       => XAPP_TYPE_BOOL,
        self::KEEP_DEBUG_SERVICE_ALIVE  => XAPP_TYPE_BOOL,
        self::WORKING_PATH              => XAPP_TYPE_STRING,
        self::DEBUGGER_PATH             => XAPP_TYPE_STRING,
        self::NODEJS_APP                => XAPP_TYPE_STRING,
        self::NODEJS_DRIVER             => XAPP_TYPE_STRING


    );

    /**
     * options mandatory map for this class contains all mandatory values
     *
     * @var array
     */
    public static $optionsRule = array
    (
        self::DEBUG_TCP_PORT            => 1,
        self::DEBUG_TCP_HOST            => 1,
        self::DEBUG_PORT                => 1,
        self::CHECK_DEBUG_SERVICE       => 1,
        self::KEEP_DEBUG_SERVICE_ALIVE  => 1,
        self::WORKING_PATH              => 1,
        self::DEBUG_TCP_PORT            => 1,
        self::NODEJS_APP                => 0,
        self::NODEJS_DRIVER             => 0

    );

    /**
     * options default value array containing all class option default values
     * @var array
     */
    public $options = array
    (
        self::DEBUG_TCP_PORT            => 9090,
        self::DEBUG_TCP_HOST            => '0.0.0.0',
        self::DEBUG_PORT                => 5858,
        self::CHECK_DEBUG_SERVICE       => true,
        self::KEEP_DEBUG_SERVICE_ALIVE  => false,
        self::WORKING_PATH              => 'Utils/nodejs/',
        self::DEBUGGER_PATH             => 'nxappmain/debugger.js',
        self::NODEJS_APP                => 'nxappmain/server_debug_min'

    );

    /***
     * Debugger command line options => class options
     *
     * @var array
     */
    public static $debugCommandLineMap = array
    (
        "--web_host" => self::DEBUG_TCP_HOST,
        "--web_port" => self::DEBUG_TCP_PORT,
        "--debug_port" => self::DEBUG_PORT
    );
    /**
     * class constructor
     * call parent constructor for class initialization
     *
     * @error 14601
     * @param null|array|object $options expects optional options
     */
    public function __construct($options = null)
    {
        parent::__construct($options);

        //standard constructor
        xapp_set_options($options, $this);
    }


    /////////////////////////////////////////////////////////////////////////////
    //
    //  Bean impl.
    //
    /////////////////////////////////////////////////////////////////////////////

    /***
     * Check if server is listening on DEBUG_TCP_HOST : DEBUG_TCP_PORT
     *
     * @return bool
     */
    public function checkServer() {
        $server_host = xo_get(self::DEBUG_TCP_HOST,$this->options);
        $server_port = xo_get(self::DEBUG_TCP_PORT,$this->options);

        return self::_isTCPListening($server_host,$server_port);
    }

    /***
     *  Run the debug server in DEBUG_TCP_HOST : DEBUG_TCP_PORT
     */
    public function runDebugServer() {

        $workingPath = xapp_get_option(self::WORKING_PATH);
        if(!XApp_Utils_Strings::startsWith($workingPath,DIRECTORY_SEPARATOR)){
            $workingPath = XAPP_ROOT_DIR . xapp_get_option(self::WORKING_PATH);
        }

        $cmd= "node ".xo_get(self::DEBUGGER_PATH,$this->options);

        $args=$this->_createCommandLineArgs();
        $args[] ="-s";
        $result = XApp_Shell_Utils::run(escapeshellcmd($cmd),$args,null,Array(
            XApp_Shell_Utils::OPTION_WORKING_PATH => $workingPath,
            XApp_Shell_Utils::OPTION_BACKGROUND => true,
            XApp_Shell_Utils::OPTION_STDOUT_TO => $workingPath."out.out"
        ));


        return $result;
    }

    /***
     * Kill all node instances
     * @TODO, enumerate and kill only node instances created by us
     * @return string
     */
    public function killall(){
        $workingPath = xo_get(self::WORKING_PATH,$this->options);
        $cmd= "killall -9 node ";
        $result = XApp_Shell_Utils::run($cmd,array(),null,Array(
            XApp_Shell_Utils::OPTION_WORKING_PATH => $workingPath,
            XApp_Shell_Utils::OPTION_BACKGROUND => false,
            XApp_Shell_Utils::OPTION_STDOUT_TO => $workingPath."out.out"
        ));
        return $result;
    }

    /***
     * Runs debugger for NODEJS_APP set in options
     *
     * @return bool|string
     */
    public function run() {

        $workingPath = xapp_get_option(self::WORKING_PATH);

        if(!XApp_Utils_Strings::startsWith($workingPath,DIRECTORY_SEPARATOR)){
            $workingPath = XAPP_ROOT_DIR . xapp_get_option(self::WORKING_PATH);
        }

        $nodeapp = xapp_get_option(self::NODEJS_APP);
        $nodedriver = xapp_get_option(self::NODEJS_DRIVER);
        if ($nodedriver!='') {
            $nodedriver = self::addDriverFolder($nodedriver);
            $nodeapp="'$nodeapp --driver $nodedriver'";
        } else
        {
            $nodeapp = self::addDriverFolder($nodeapp);
        }

        if ($nodeapp!='') {
            $args=$this->_createCommandLineArgs();

            $cmd= "node ".xo_get(self::DEBUGGER_PATH,$this->options);

            $args[] =  "-d $nodeapp";

            $this->log('run node inspector ' . $cmd . ' in ' . $workingPath . ' with node app : ' . $nodeapp);

            $result = XApp_Shell_Utils::run(escapeshellcmd($cmd),$args,null,Array(
                XApp_Shell_Utils::OPTION_WORKING_PATH => $workingPath,
                XApp_Shell_Utils::OPTION_BACKGROUND => true,
                XApp_Shell_Utils::OPTION_STDOUT_TO => $workingPath."out.out"
            ));

            return $result;
        } else
        {
            return false;
        }
    }

    /***
     *
     * @param $app_path
     * @return mixed|string
     */
    private static function addDriverFolder($app_path) {
        $app_path = 'xcf' . XApp_Directory_Utils::normalizePath($app_path,true,true);
        $app_path = str_replace('.js','',$app_path);
        return $app_path;
    }
    /***
     * Initializes the store and loads the data
     */
    public function init(){

    }

    /////////////////////////////////////////////////////////////////////////////////////////
    //
    //  Utils
    //
    ////////////////////////////////////////////////////////////////////////////////////////

    /***
     * Check if it's a TCP server ready on host:port
     *
     * @param $host
     * @param $port
     * @return bool
     */
    private static function _isTCPListening($host,$port) {
        $fp = @fsockopen($host, $port, $errno, $errstr, 30);
        if (!$fp) {
            return false;
        } else {
            fclose($fp);
            return true;
        }
    }

    /***
     * Create the command line arguments for debugger
     * @return array
     */
    private function _createCommandLineArgs() {
        $ret = array();
        foreach(self::$debugCommandLineMap as $commandLine => $option)
        {
            $ret[]=$commandLine." ".xo_get($option,$this->options);
        }
        return $ret;
    }


}


?>