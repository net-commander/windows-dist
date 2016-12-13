<?php
/**
 * @version 0.1.0
 * @link http://www.xapp-studio.com
 * @author XApp-Studio.com support@xapp-studio.com
 * @license : GPL v2. http://www.gnu.org/licenses/gpl-2.0.html
 */

/***
 * Common paths
 */
$_REQUEST_URI = $_SERVER["PHP_SELF"]."?".$_SERVER["QUERY_STRING"];
putenv("REQUEST_URI=$_REQUEST_URI");
$_SERVER["REQUEST_URI"] = $_REQUEST_URI;
$_ENV["REQUEST_URI"] = $_REQUEST_URI;
$ROOT_DIRECTORY_ABSOLUTE = realpath(dirname(__FILE__) . DIRECTORY_SEPARATOR .'..');
$XAPP_BASE_DIRECTORY     =  $ROOT_DIRECTORY_ABSOLUTE . DIRECTORY_SEPARATOR;

function printLine($message){
	echo($message . '<br>');
}


/***
 * Common defines
 */
define('XAPP_BASEDIR',$XAPP_BASE_DIRECTORY);

$xappRoot = XAPP_BASEDIR;
for($n=1;$n<=2;$n++)
{
    $xappRoot.="..".DIRECTORY_SEPARATOR;
}


define('XAPP_ROOT_DIR',realpath($xappRoot) . DIRECTORY_SEPARATOR);
define('XCF_SYSTEM_ROOT',realpath(XAPP_BASEDIR . '..' . DIRECTORY_SEPARATOR . 'xcf') . DIRECTORY_SEPARATOR);
define('XCF_DATA_ROOT',realpath(XCF_SYSTEM_ROOT) . DIRECTORY_SEPARATOR);


define('XAPP_APPLICATION_CLASS','xcfux');
define('XAPP_CLIENT_APPLICATION_NAME','xcfux');
define('XAPP_CLIENT_DIRECTORY',realpath($ROOT_DIRECTORY_ABSOLUTE . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'maqetta' . DIRECTORY_SEPARATOR . 'app') . DIRECTORY_SEPARATOR);

define('XAPP_LOG_DIRECTORY',realpath(XAPP_BASEDIR . '..' . DIRECTORY_SEPARATOR . 'log'));

define('XCF_DATA_DIRECTORY',realpath(XAPP_BASEDIR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'Utils' . DIRECTORY_SEPARATOR . 'nodejs' . DIRECTORY_SEPARATOR . 'xcf') );
define('XCF_NODE_JS_ROOT',realpath(XAPP_BASEDIR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'Utils' . DIRECTORY_SEPARATOR . 'nodejs') . DIRECTORY_SEPARATOR );

/*
printLine('$ROOT_DIRECTORY_ABSOLUTE : ' . $ROOT_DIRECTORY_ABSOLUTE);//  :               /PMaster/x4mm/Code/trunk/xide-php/xcf/
printLine('XCF_DATA_ROOT : ' . XCF_DATA_ROOT);//  :               /PMaster/x4mm/Code/trunk/xide-php/xcf/
printLine('XAPP_BASEDIR : ' . XAPP_BASEDIR);//  :               /PMaster/x4mm/Code/trunk/xide-php/xcf/
printLine('XCF_SYSTEM_ROOT : ' . XCF_SYSTEM_ROOT);//              /PMaster/x4mm/Code/trunk/xide-php/xcf/
printLine('XAPP_CLIENT_DIRECTORY : ' . XAPP_CLIENT_DIRECTORY);//  /PMaster/x4mm/Code/trunk/xide-php/maqetta/app
printLine('XCF_DATA_DIRECTORY : ' . XCF_DATA_DIRECTORY);//        /PMaster/x4mm/Utils/nodejs/xcf
printLine('XAPP_ROOT_DIR : ' . XAPP_ROOT_DIR);//                  /PMaster/x4mm/
*/

/*
XCF_DATA_ROOT : /PMaster/x4mm/Code/trunk/xide-php/xcf/
XCF_SYSTEM_ROOT : /PMaster/x4mm/Code/trunk/xide-php/xcf/
XAPP_CLIENT_DIRECTORY : /PMaster/x4mm/Code/trunk/xide-php/client/
XCF_DATA_DIRECTORY : /PMaster/x4mm/Utils/nodejs/xcf
XAPP_ROOT_DIR : /PMaster/x4mm/
*/


/*exit;*/

/***
 * Dependencies
*/
require_once (XAPP_BASEDIR.'/xcf/Bootstrap.php');
/*
$serverApplicationClassName,
        $clientApplicationName,
        $clientDirectory,
	    $libOffset,
        $logDirectory,
        $xcvDataRoot,
        $xcvRoot,
		$serviceEntryPoint,
	    $clientOffset*/
$bootStrap = XCF_Bootstrap::createInstance(
    XAPP_APPLICATION_CLASS,
    XAPP_CLIENT_APPLICATION_NAME,
    XAPP_CLIENT_DIRECTORY,
	'',
    XAPP_LOG_DIRECTORY,
    XCF_DATA_DIRECTORY,
    XCF_SYSTEM_ROOT,
	'xui.php',
	'./app/'
);
$bootStrap->handleRequest();

//$d = xdump($bootStrap);

