<?php
/**
 * @version 0.1.0
 *
 * @author https://github.com/mc007
 * @license : GPL v2. http://www.gnu.org/licenses/gpl-2.0.html
 * @package XApp-Commander
 */

include_once(dirname(__FILE__) . '/Exception/BuildException.php');


/***
 * Processing Flag : Build Android App
 */
define('XAPP_BUILD_ANDROID',2500);
/***
 * Processing Flag : Build Android App
 */
define('XAPP_BUILD_IOS',2501);

/***
 * Processing Flag : Zip, means that the build apps need to be zipped
 */
define('XAPP_BUILD_ZIP',2502);

/***
 * Processing Flag 'Setup Logger', instructs the class to setup a logger, needs then also a logging configuration
 */
define('XAPP_BUILD_SETUP_LOGGER',2503);

/***
 * Class XApp_Build_Manager
 * Utility class to
 */
class XApp_Build_Manager implements Xapp_Singleton_Interface
{

    ////////////////////////////////////////////////////////////////////////
    //
    //      XApp-PHP-Standard stuff
    //
    ////////////////////////////////////////////////////////////////////////

    /**
     * Xapp_Singleton interface impl.
     *
     * static singleton method to create static instance of driver with optional third parameter
     * xapp options array or object
     *
     * @error 15501
     * @param null|mixed $options expects optional xapp option array or object
     * @return XApp_Commander_Bootstrap
     */
    public static function instance($options = null)
    {
        if(self::$_instance === null)
        {
            self::$_instance = new self($options);
        }
        return self::$_instance;
    }

    /**
     * class constructor
     * call parent constructor for class initialization
     *
     * @error 14601
     * @param null|array|object $options expects optional options
     */
    public function __construct($options = null)
    {
        xapp_set_options($options, $this);
    }

    /**
     * contains the singleton instance for this class
     *
     * @var null|XApp_Commander_Bootstrap
     */
    protected static $_instance = null;

    /**
     * contains the instance to a logger
     *
     * @var null|XApp_Error_Log
     */
    protected $_logger = null;


    ////////////////////////////////////////////////////////////////////////
    //
    //      Options to be used
    //
    ////////////////////////////////////////////////////////////////////////
    /***
     * Flags to use whilst the bootstrapping
     */
    const FLAGS                         = "XAPP_BUILD_FLAGS";

    /***
     * Absolute path to the cordova template
     */
    const APP_TEMPLATE_DIR              = "XAPP_TEMPLATE_DIR";

    /***
     * Absolute path to the output directory
     */
    const APP_OUTPUT_DIR                = "XAPP_BUILD_TEMPLATE_DIR";

    /***
     * Logging configuration
     */
    const LOGGING_CONF                  = "XAPP_BUILD_LOGGING_CONF";

    /***
     * Logger, possibility to pass an external shared logger instead of setting up an own logger.
     */
    const LOGGER                        = "XAPP_BUILD_LOGGER";

    /***
     * Variables to be replaced in the template
     */
    const VARIABLES                     = "XAPP_BUILD_VARIABLES";

    /***
     *  Cordova platforms folders
     * */
    const ANDROID_DIR = "platforms/android";
    const IOS_DIR = "platforms/ios";


    /**
     *
     * Replace strings into these files (Android)
     *
     * @var array
     */
    static $ANDROID_REPLACE_IN_FILES = Array(
        "AndroidManifest.xml"
    );

    /**
     *
     * Replace strings into these files (iOS)
     *
     * @var array
     */
    static $IOS_REPLACE_IN_FILES = Array(
        "__APP_NAME__.xcodeproj/project.pbxproj"
    );


    /**
     * options dictionary for this class containing all data type values
     *
     * @var array
     */
    public static $optionsDict = array
    (
        self::FLAGS                     => XAPP_TYPE_ARRAY,
        self::APP_TEMPLATE_DIR          => XAPP_TYPE_STRING,
        self::APP_OUTPUT_DIR            => XAPP_TYPE_STRING,
        self::LOGGING_CONF              => XAPP_TYPE_ARRAY,
        self::LOGGER                    => XAPP_TYPE_OBJECT,
        self::VARIABLES                 => XAPP_TYPE_ARRAY
    );

    /**
     * options mandatory map for this class contains all mandatory values
     *
     * @var array
     */
    public static $optionsRule = array
    (
        self::FLAGS                     => 0,
        self::APP_TEMPLATE_DIR          => 0,
        self::APP_OUTPUT_DIR            => 0,
        self::LOGGING_CONF              => 0,
        self::LOGGER                    => 0,
        self::VARIABLES                 => array()
    );
    /**
     * options default value array containing all class option default values
     *
     * @var array
     */
    public $options = array
    (
        self::FLAGS                     => array(),
        self::APP_TEMPLATE_DIR          => null,
        self::LOGGING_CONF              => null,
        self::LOGGER                    => null,
        self::VARIABLES                 => array()
    );
    ////////////////////////////////////////////////////////////////////////
    //
    //      Main entry points
    //
    ////////////////////////////////////////////////////////////////////////

    private $flags;
    /**
     * Load and setup all utils and instances
     * @return bool
     */
    public function init(){

        $this->flags      = xapp_get_option(self::FLAGS,$this);

        //pull in registry of xapp core framework
        XApp_Service_Entry_Utils::includeXAppRegistry();

        /***
         * Load logging deps, but only if we have logging config
         */
        error_log('has ' . xapp_has_option(self::LOGGER,$this));
        error_log('has conf' . xapp_has_option(self::LOGGING_CONF,$this));
        if( xapp_has_option(self::LOGGING_CONF,$this)){

            if(!class_exists('Xapp_Log_Exception')){
                require_once(XAPP_BASEDIR. '/Log/Exception/Exception.php');
            }
            if(!class_exists('Xapp_Log_Interface')){
                require_once(XAPP_BASEDIR. '/Log/Interface/Interface.php');
            }
            if(!class_exists('Xapp_Log')){
                require_once(XAPP_BASEDIR. '/Log/Log.php');
            }
            if(!class_exists('Xapp_Log_Error')){
                require_once(XAPP_BASEDIR. '/Log/Error.php');
            }

            if(!class_exists('Xapp_Log_Writer')){
                require_once(XAPP_BASEDIR. '/Log/Writer.php');
            }
            if(!class_exists('File.php')){
                require_once(XAPP_BASEDIR. '/Log/Writer/File.php');
            }


            $this->_logger = $this->setupLogger(xapp_get_option(self::LOGGING_CONF,$this));

        }elseif(xapp_has_option(self::LOGGER)){

            error_log('use shared logger');
            $this->_logger = xapp_get_option(self::LOGGER,$this);

        }

        return true;
    }

    /***
     * @return bool
     */
    public function build(){


        $this->init();//load deps

        //next : process flags

        if ($this->copyTemplate()) {    // Template copied OK

            // Prepare for platforms
            if (array_search(XAPP_BUILD_ANDROID,$this->flags)!==FALSE) {
                $this->replaceCordovaStrings(self::ANDROID_DIR,self::$ANDROID_REPLACE_IN_FILES);
                $this->log('Android project prepared OK');
            }
            if (array_search(XAPP_BUILD_IOS,$this->flags)!==FALSE) {
                $this->replaceCordovaStrings(self::IOS_DIR,self::$IOS_REPLACE_IN_FILES);
                $this->log('iOS project prepared OK');
            }

            // Make ZIP
            if (array_search(XAPP_BUILD_ZIP,$this->flags)!==FALSE) {
                $this->MakeZIP();
                $this->log('ZIP created OK');
            }
        } else {
            $this->log("Error: template directory couldn't be copied");
        }


        return true;
    }




    public function log($message,$prefix='',$stdError=true){

        if($this->_logger){
            $this->_logger->log('BuildManager: ' . $message);
        }else{
            error_log('have no logger');
        }

        if($stdError){
            /*error_log('XCom-Bootstrap : '.$message);*/
        }
        return null;
    }

    ////////////////////////////////////////////////////////////////////////
    //
    //      Internal factory classes to create this or that instances
    //
    ////////////////////////////////////////////////////////////////////////

    /**
     * Copy the Master Template to the output folder
     *
     * @param $ignorelist
     * @return bool
     */
    private function copyTemplate($ignorelist=Array(".svn")) {
        $templ_dir=xapp_get_option(self::APP_TEMPLATE_DIR,$this);
        $out_dir=xapp_get_option(self::APP_OUTPUT_DIR,$this);
        if ($templ_dir!=null) {
            if ($out_dir!=null) {
                $errors=Array();
                $success=Array();
                xapp_import('xapp.File.Utils');
                xapp_import('xapp.Directory.Utils');
                XApp_File_Utils::copyDirectory($templ_dir,$out_dir,
                    Array(  XApp_File_Utils::OPTION_CONFLICT_MODUS=>XAPP_XFILE_OVERWRITE_ALL,
                            XApp_File_Utils::OPTION_TIMEOUT=>120),
                    XApp_File_Utils::defaultInclusionPatterns(),
                    XApp_File_Utils::defaultExclusionPatterns()
                    ,$errors,$success);

                return (Count($errors)==0);
            } else {    // Log error "No out dir"
                $this->log(XAPP_TEXT_FORMATTED('OPTION_NOT_PROVIDED',array("APP_OUTPUT_DIR")));
                return false;
            }
        } else {    // Log error "No templ dir"
            $this->log(XAPP_TEXT_FORMATTED('OPTION_NOT_PROVIDED',array("APP_TEMPLATE_DIR")));
                        return false;
        }

    }

    /**
     *
     * Replace variables in the cordova project files
     *
     * @param $platform_dir     : path into the cordova project folder
     * @param $platform_files   : array with the files to be changed
     *
     * @return bool
     */
    private function replaceCordovaStrings($platform_dir,$platform_files) {
        $project_dir=xapp_get_option(self::APP_OUTPUT_DIR,$this);
        $vars=xapp_get_option(self::VARIABLES,$this);


        // Check all options
        if ($project_dir==null) {
            $this->log(XAPP_TEXT_FORMATTED('OPTION_NOT_PROVIDED',array("APP_OUTPUT_DIR")));
            return false;
        }
        if (!Count($vars)) {
            $this->log(XAPP_TEXT_FORMATTED('OPTION_NOT_PROVIDED',array("VARIABLES")));
            return false;
        }

        // Replace all vars
        if (is_dir($project_dir)) {
            foreach($platform_files as $file) {
                $file=str_replace("__APP_NAME__",$vars["APP_NAME"],$file);
                $this->replaceIntoFile("{$project_dir}/{$platform_dir}/{$file}",$vars,"__");
            }
        } else {
            $this->log(XAPP_TEXT_FORMATTED('CAN_NOT_READ_DIR',array($project_dir)));
            return false;
        }


    }


    /**
     *
     *  Compress all project dir into a ZIP file
     *
     * @return bool
     */
    private function MakeZIP() {
        $project_dir=xapp_get_option(self::APP_OUTPUT_DIR,$this);

        // Check all options
        if ($project_dir==null) {
            $this->log(XAPP_TEXT_FORMATTED('OPTION_NOT_PROVIDED',array("APP_OUTPUT_DIR")));
            return false;
        }

        $error=Array();
        $success=Array();
        xapp_import('xapp.Directory.Utils');
        xapp_import('xapp.File.Utils');
        XApp_Directory_Utils::zipDir($project_dir,"{$project_dir}/cordova_project.zip",XApp_File_Utils::defaultInclusionPatterns(),Array("*.zip"),$error,$success);

    }

    private function addFolder(&$zipSelection,$dir) {
        if (is_dir($dir)) {
            if ($dh = opendir($dir)) {
                while (($file = readdir($dh)) !== false) {
                    if(!is_file($dir . $file)){
                        if( ($file !== ".") && ($file !== ".."))
                            $this->addFolder($zipSelection,$dir . $file . "/");
                    } else
                        $zipSelection[]=$dir . $file;
                }
            }
        }
    }

    /**
     *
     *  Replace all occurrences of (delimiter)search(delimiter)=>replace from $vars array into $file
     *
     * @param $file         : target file
     * @param $vars         : array with search => replace
     * @param $delimiter    : chars to be added at the beginning and the end of the search string <delimiter><search><delimiter>
     *
     * @return bool
     */
    private function replaceIntoFile($file,$vars,$delimiter="") {
        $contents=@file_get_contents($file);
        if ($contents===FALSE) {
            $this->log(XAPP_TEXT_FORMATTED('CAN_NOT_READ_FILE',array($file)));
            return false;
        }

        $search=array_keys($vars);
        if ($delimiter!="") $search=preg_replace('/^(.*)$/',"{$delimiter}\$1{$delimiter}",$search);
        $replace=array_values($vars);

        $contents=str_replace($search,$replace,$contents);
        if (@file_put_contents($file,$contents)===FALSE) {
            $this->log(XAPP_TEXT_FORMATTED('FILE_NOT_WRITEABLE',array($file)));
            return false;
        }

    }

    /**
     *  Copy origin ($src) directory into destination ($dest)
     *
     *
     * @param $src
     * @param $dest
     * @param $ignorelist
     *
     * @return bool
     */
    private function dirCopy($src,$dest,$ignorelist=Array()) {
            $ignorelist=array_merge(Array(".",".."),$ignorelist);

            $dir = @opendir($src);
            if ($dir===FALSE) {
                $this->log(XAPP_TEXT_FORMATTED('CAN_NOT_READ_DIR',array($src)));
                return false;
            } else {
                @mkdir($dest);
                if (!is_dir($dest)) {
                    $this->log(XAPP_TEXT_FORMATTED('COULD_NOT_CREATE_DIRECTORY',array($dest)));
                    return false;
                } else {
                    while(( $file = readdir($dir))!== false ) {
                        if (array_search($file,$ignorelist)===FALSE) {

                            if ( is_dir($src . '/' . $file) ) {
                                if (!$this->dirCopy($src . '/' . $file,$dest . '/' . $file,$ignorelist)) return false;
                            }
                            else {
                                if (@copy($src . '/' . $file,$dest . '/' . $file)===FALSE) {
                                    $this->log(XAPP_TEXT_FORMATTED('COULD_NOT_CREATE_FILE',array("{$src}/{$file}")));
                                }
                            }
                        }
                    }
                }
                closedir($dir);
            }

            return true;
    }

    /***
     * Setup logger
     */
    private function setupLogger($loggingConf){
        $path = xapp_get_option(Xapp_Log::PATH,$loggingConf);
        if(!is_writable($path)){

            throw new Xapp_Build_Exception(XAPP_TEXT_FORMATTED('DIRECTORY_NOT_WRITEABLE',array($path),55100));
        }
        $logginConf[Xapp_Log::WRITER]=array(new Xapp_Log_Writer_File(xapp_get_option(Xapp_Log::PATH,$loggingConf)));

        return new Xapp_Log_Error($loggingConf);
    }


}