<?php
/**
 * @version 0.1.0
 * @link http://www.xapp-studio.com
 * @author XApp-Studio.com support@xapp-studio.com
 * @license : GPL v2. http://www.gnu.org/licenses/gpl-2.0.html
 */


if(isset($_SERVER["QUERY_STRING"])) {
    //$_REQUEST_URI = $_SERVER["PHP_SELF"] . "?" . $_SERVER["QUERY_STRING"];
    //putenv("REQUEST_URI=$_REQUEST_URI");
    //$_SERVER["REQUEST_URI"] = $_REQUEST_URI;
    //$_ENV["REQUEST_URI"] = $_REQUEST_URI;
}


$ROOT_DIRECTORY_ABSOLUTE = realpath(dirname(__FILE__) . DIRECTORY_SEPARATOR .'..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' ) . DIRECTORY_SEPARATOR;
date_default_timezone_set('America/New_York');
$application_name='xcf';//dojo client application
if(array_key_exists('app',$_GET) && $_GET['app']){
	$application_name = $_GET['app'];
}




define('XAPP_ROOT_DIR',                 $ROOT_DIRECTORY_ABSOLUTE);

$XAPP_BASE_DIRECTORY     =              $ROOT_DIRECTORY_ABSOLUTE . 'Code/xapp';

define('XAPP_BASEDIR',                  $XAPP_BASE_DIRECTORY . DIRECTORY_SEPARATOR);

define('XCF_SYSTEM_ROOT',               realpath(XAPP_ROOT_DIR . 'data/system') . DIRECTORY_SEPARATOR);
define('XIDE_SYSTEM_ROOT',              realpath(XAPP_ROOT_DIR . 'data/system' ) . DIRECTORY_SEPARATOR);// /PMaster/x4mm/Code/

define('XCF_DATA_ROOT',                 realpath(XCF_SYSTEM_ROOT) . DIRECTORY_SEPARATOR);


require_once (XAPP_BASEDIR.'/xcf/Bootstrap.php');
require_once (XAPP_BASEDIR.'/XApp_Service_Entry_Utils.php');


$XCF_USER_ROOT  = XApp_Service_Entry_Utils::_getKey('userDirectory',realpath(XAPP_ROOT_DIR . 'user')) . DIRECTORY_SEPARATOR;

define('XCF_USER_ROOT',                 $XCF_USER_ROOT);
define('XAPP_APPLICATION_CLASS',        $application_name);
define('XAPP_CLIENT_APPLICATION_NAME',  $application_name);
define('XAPP_CLIENT_DIRECTORY',         realpath(XAPP_ROOT_DIR . 'Code/client/src') . DIRECTORY_SEPARATOR );
define('XAPP_LOG_DIRECTORY',            realpath(XAPP_ROOT_DIR . 'Code/log/') . DIRECTORY_SEPARATOR);
define('XCF_DATA_DIRECTORY',            realpath(XAPP_ROOT_DIR . 'data') . DIRECTORY_SEPARATOR );
define('XCF_NODE_JS_ROOT',              realpath(XAPP_ROOT_DIR . 'server/nodejs') . DIRECTORY_SEPARATOR );
define('XAPP_CONF_DIRECTORY',           realpath(XAPP_ROOT_DIR . 'conf') . DIRECTORY_SEPARATOR );

if(!defined('DS')){
	define('DS',DIRECTORY_SEPARATOR);
}
$bootStrap = XCF_Bootstrap::createInstance(
    XAPP_APPLICATION_CLASS,
    XAPP_CLIENT_APPLICATION_NAME,
    XAPP_CLIENT_DIRECTORY,
	XApp_Service_Entry_Utils::getRunTimeConfiguration() ==='debug' ? 'lib' : '',
    XAPP_LOG_DIRECTORY,
    XCF_DATA_DIRECTORY,
	XCF_USER_ROOT,
    XCF_SYSTEM_ROOT,
	'index.php',
	'/src',
	'',
    XAPP_CONF_DIRECTORY
);

error_log('index : ' . xapp_fix_index());

$bootStrap->handleRequest(XCF_DATA_DIRECTORY,XCF_USER_ROOT);


