<?php
/**
 * @version 0.1.0
 * @link http://www.xapp-studio.com
 * @author XApp-Studio.com support@xapp-studio.com
 * @license : GPL v2. http://www.gnu.org/licenses/gpl-2.0.html
 * @package XApp\xcf\Driver
 */

xapp_import('xapp.xcf.Service.Service');

/***
 * Class XIDE_Service extends the standard service
 */
class XCF_NodeJS_Debug_Service extends XCF_Service implements Xapp_Singleton_Interface
{
    const SERVER_IS_READY = "serverIsReady";
    const RUN_RESULT = "runResult";
    const SERVER_URL = "serverUrl";

    public static $_instance=null;

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

        xapp_set_options($options, $this);
    }

    /**
     * Xapp_Singleton interface impl.
     *
     * static singleton method to create static instance of driver with optional third parameter
     * xapp options array or object
     *
     * @error 15501
     * @param null|mixed $options expects optional xapp option array or object
     * @return XCF_Driver_Service
     */
    public static function instance($options = null)
    {

        if(self::$_instance === null)
        {
            self::$_instance = new self($options);

        }
        return self::$_instance;
    }
    /***
     * @param $nodeApp
     * @param $workingPath
     * @return mixed
     * @link xapp/xcf/index.php?debug=true&view=smdCall&service=XCF_NodeJS_Debug_Service.run&callback=asd&nodeApp=test/testme.js&workingPath=/PMaster/x4mm/Utils/nodejs/
     */
    public function run($arguments) {

        xo_merge($arguments,$this->_object);

        $result=$this->getObject()->run();

        //$result = $this->getObject()->runDebugServer();

        return Array(
            self::RUN_RESULT=>$result,
            self::SERVER_URL => $this->getDebugServerURL()
        );
    }


    public function getDefaults(){
        return array(
            XCF_NodeJS_Debug_Manager::DEBUG_TCP_HOST=>getHostByName(getHostName()),
            XCF_NodeJS_Debug_Manager::DEBUG_TCP_PORT=>xo_get(XCF_NodeJS_Debug_Manager::DEBUG_TCP_PORT,$this->getObject()),
            XCF_NodeJS_Debug_Manager::DEBUG_PORT=>xo_get(XCF_NodeJS_Debug_Manager::DEBUG_PORT,$this->getObject())
        );
    }

    /***
     * Check if debug server is up.
     *
     * return json string width self::SERVER_IS_READY => (true/false)
     *
     * @param $arguments
     * @return string
     */
    public function checkServer($arguments) {
        xo_merge($arguments,$this->_object);
        $result=$this->getObject()->checkServer();
        return array(
            self::SERVER_IS_READY=>$result
        );

    }

    public function runDebugServer($arguments) {
        xo_merge($arguments,$this->_object);

        return Array(
            self::RUN_RESULT=>$this->getObject()->runDebugServer()
        );
    }

    private function getDebugServerURL() {
        $options = $this->getObject()->options;

        $url = "http://";
        $url.= $options[XCF_NodeJS_Debug_Manager::DEBUG_TCP_HOST];
        $url.= ":";
        $url.= $options[XCF_NodeJS_Debug_Manager::DEBUG_TCP_PORT];
        $url.= "/debug?port=";
        $url.= $options[XCF_NodeJS_Debug_Manager::DEBUG_PORT];

        return $url;
    }
}