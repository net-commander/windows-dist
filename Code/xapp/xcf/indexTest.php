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
$ROOT_DIRECTORY_ABSOLUTE = realpath(dirname(__FILE__) . DIRECTORY_SEPARATOR .'..');

$XAPP_BASE_DIRECTORY     =  $ROOT_DIRECTORY_ABSOLUTE . DIRECTORY_SEPARATOR;

/***
 * A log directory, must be writable !!
 */


/***
 * Common defines
 */
define('XAPP_BASEDIR',$XAPP_BASE_DIRECTORY);
define('XAPP_APPLICATION_CLASS','xcf');
define('XAPP_CLIENT_APPLICATION_NAME','xcf');
define('XAPP_CLIENT_DIRECTORY',realpath($ROOT_DIRECTORY_ABSOLUTE . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'client') . DIRECTORY_SEPARATOR);
define('XAPP_LOG_DIRECTORY',realpath(XAPP_BASEDIR . '..' . DIRECTORY_SEPARATOR . 'log'));
define('XCF_DATA_DIRECTORY',realpath(XAPP_BASEDIR . '..' . DIRECTORY_SEPARATOR . 'xcf'));

/***
 * Dependencies
*/
require_once (XAPP_BASEDIR.'/xcf/Bootstrap.php');

$bootStrap = XCF_Bootstrap::createInstance(
    XAPP_APPLICATION_CLASS,
    XAPP_CLIENT_APPLICATION_NAME,
    XAPP_CLIENT_DIRECTORY,
    XAPP_LOG_DIRECTORY,
    XCF_DATA_DIRECTORY

);
$bootStrap->init();
$nodejs_s = XCF_NodeJS_Debug_Service::instance();
//xapp_dump($nodejs_s);

$arguments = Array(
    XCF_NodeJS_Debug_Manager::NODEJS_APP => "test/testme",
    XCF_NodeJS_Debug_Manager::WORKING_PATH => "/PMaster/x4mm/Utils/nodejs/"
);
$serverReady=json_decode( $nodejs_s->checkServer($arguments) );

xapp_dump("The debug server is ready?");

xapp_dump($serverReady);

if (!$serverReady->{XCF_NodeJS_Debug_Service::SERVER_IS_READY}) {

    $runRes = $nodejs_s->runDebugServer($arguments);

    xapp_dump("Running debug server");
    xapp_dump(json_decode($runRes));
}

$runRes = $nodejs_s->run($arguments);

xapp_dump("Running debugger for ".$arguments[XCF_NodeJS_Debug_Manager::NODEJS_APP]);

xapp_dump(json_decode($runRes));

//$nodejs_s->run($arguments);
//$bootStrap->handleRequest();

//$d = xdump($bootStrap);

