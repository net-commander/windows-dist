<?php
/**
 * @version 0.1.0
 * @link http://www.xapp-studio.com
 * @author XApp-Studio.com support@xapp-studio.com
 * @license : GPL v2. http://www.gnu.org/licenses/gpl-2.0.html
 * @package XIDE
 */

/***
 * Check we have at least the minimals
 */
if (!defined('XAPP')) {
    include_once(XAPP_BASEDIR . '/Core/core.php');
    require_once(XAPP_BASEDIR . '/Xapp/Xapp.php');
    require_once(XAPP_BASEDIR . '/Xapp/Autoloader.php');
    require_once(XAPP_BASEDIR . '/Xapp/Cli.php');
    require_once(XAPP_BASEDIR . '/Xapp/Console.php');
    require_once(XAPP_BASEDIR . '/Xapp/Debug.php');
    require_once(XAPP_BASEDIR . '/Xapp/Error.php');
    require_once(XAPP_BASEDIR . '/Xapp/Event.php');
    require_once(XAPP_BASEDIR . '/Xapp/Option.php');
    require_once(XAPP_BASEDIR . '/Xapp/Reflection.php');
}

xapp_import("xapp.xide.Bootstrap");

/***
 * Class xide_Bootstrap extends the standard bootstrap
 */
class XCF_Bootstrap extends XIDE_Bootstrap
{

    //const SYSTEM_DIRECTORY = "XCF_SYSTEM_DIRECTORY";
    //const USER_DIRECTORY = "XCF_USER_DIRECTORY";

    public static $system_data = null;

    public static $user_data = null;

    /***
     *
     * $serverApplicationClassName,
     * $clientApplicationName,
     * $clientDirectory
     *
     * Factory which creates a bootstrap config but also an instance of this upon the
     * the request type : RPC or Client app
     * @param $serverApplicationClassName
     * @param $clientApplicationName
     * @param $clientDirectory
     * @param $libOffset
     * @param $logDirectory
     * @param $xcvDataRoot
     * @param $xcvUserRoot
     * @param $xcvRoot
     * @param $serviceEntryPoint
     * @param $clientOffset
     * @param string $rootUrlOffset
     * @param $confDirectory
     * @return void|XCF_Bootstrap
     */
    public static function createInstance(

        $serverApplicationClassName,
        $clientApplicationName,
        $clientDirectory,
        $libOffset,
        $logDirectory,
        $xcvDataRoot,
        $xcvUserRoot,
        $xcvRoot,
        $serviceEntryPoint,
        $clientOffset,
        $rootUrlOffset = '',
        $confDirectory
    )
    {
        self::$user_data = $xcvUserRoot;
        self::$system_data = $xcvDataRoot;

        if (self::isRPC()) {
            return self::createServerInstance(
                $serverApplicationClassName,
                $clientApplicationName,
                $clientDirectory,
                $libOffset,
                $logDirectory,
                $xcvDataRoot,
                $xcvUserRoot,
                $xcvRoot,
                $serviceEntryPoint,
                $clientOffset,
                $rootUrlOffset,
                $confDirectory
            );
        } else {
            return self::createClientInstance(
                $serverApplicationClassName,
                $clientApplicationName,
                $clientDirectory,
                $libOffset,
                $logDirectory,
                $xcvDataRoot,
                $xcvUserRoot,
                $xcvRoot,
                $serviceEntryPoint,
                $clientOffset,
                $rootUrlOffset,
                $confDirectory
            );
        }
    }

    /***
     * Imports needed for both type of of requests : client & RPC
     */
    public static function loadCommons()
    {
        self::loadMin();
        xapp_import("xapp.xide.Models.User");
        xapp_import('xapp.xide.Controller.UserManager');
    }

    /**
     *
     */
    private static function loadXFilePluginDependencies()
    {
        //pull in xapp plugin manager
        include_once(XAPP_BASEDIR . '/commander/PluginManager.php');

        //pull in xapp commander plugin base class
        include_once(XAPP_BASEDIR . '/commander/Plugin.php');
        //pull in xapp commander plugin base class
        include_once(XAPP_BASEDIR . '/commander/defines.php');

        //pull in RPC interface
        if (!class_exists('Xapp_Rpc_Interface_Callable')) {
            //pull in xapp commander plugin base class
            include_once(XAPP_BASEDIR . '/Rpc/Interface/Callable.php');
        }

    }

    private static function getDirectoryService($xcvDataRoot, $xcvUserRoot)
    {

        xapp_import('xapp.Service');
        xapp_import('xapp.commander.Directory.Service');
        xapp_import('xapp.File.Utils');
        xapp_import('xapp.Directory.Utils');
        xapp_import('xapp.Directory.Service');
        xapp_import('xapp.Path.Utils');
        xapp_import('xapp.VFS.Interface.Access');
        xapp_import('xapp.VFS.Base');
        xapp_import('xapp.VFS.Local');

        $FILE_ROOT = $xcvDataRoot . DIRECTORY_SEPARATOR;
        $XAPP_VFS_CONFIG_PATH = realpath($xcvDataRoot . '/system/vfs.json');
        $XCF_SYSTEM_DRIVERS = realpath($xcvDataRoot . DS . 'system' . DS . 'drivers');
        $XCF_USER_DRIVERS = $xcvUserRoot . 'drivers' . DIRECTORY_SEPARATOR;

        $XCF_SYSTEM_DEVICES = $xcvDataRoot . DIRECTORY_SEPARATOR . 'system' . DIRECTORY_SEPARATOR . 'devices';
        $SYSTEM_ROOT = realpath($xcvDataRoot . DIRECTORY_SEPARATOR . '..') . DIRECTORY_SEPARATOR;
        $XCF_SYSTEM_PROTOCOLS = $xcvDataRoot . DIRECTORY_SEPARATOR . 'system' . DIRECTORY_SEPARATOR . 'protocols' . DIRECTORY_SEPARATOR;
        $XAPP_WORKSPACE_DIRECTORY = realpath($xcvDataRoot) . DIRECTORY_SEPARATOR . 'workspace/';
        $vfsVariables = array(
            'docs' => realpath(XAPP_ROOT_DIR . '/documentation/docFiles'),
            'system_drivers' => $XCF_SYSTEM_DRIVERS,
            'user_drivers' => $XCF_USER_DRIVERS,
            'user_devices' => $xcvUserRoot . 'devices' . DIRECTORY_SEPARATOR,
            'system_devices' => $XCF_SYSTEM_DEVICES,
            'system_protocols' => $XCF_SYSTEM_PROTOCOLS,
            'javascript' => $SYSTEM_ROOT . 'Code/client/src/lib/',
            'php' => $SYSTEM_ROOT . 'Code/xapp/',
            'cfjs' => $SYSTEM_ROOT . 'Code/client/src/lib/xcf',
            'xidejs' => $SYSTEM_ROOT . 'Code/client/src/lib/xide',
            'workspace' => $XAPP_WORKSPACE_DIRECTORY,
            'workspace_user' => $xcvUserRoot . DS . 'workspace',
            'root' => $xcvUserRoot . DS . 'workspace',
            'logs' => realpath(XCF_NODE_JS_ROOT . 'logs')
        );

        /**
         * File service
         */
        $service = XApp_Service::factoryEx(
            'XCOM_Directory_Service',
            array(

                XApp_Directory_Service::REPOSITORY_ROOT => $FILE_ROOT,
                XApp_Directory_Service::FILE_SYSTEM => 'XApp_VFS_Local',
                XApp_Directory_Service::VFS_CONFIG_PATH => $XAPP_VFS_CONFIG_PATH,
                XApp_Directory_Service::FILE_SYSTEM_CONF => array(
                    XApp_VFS_Base::ABSOLUTE_VARIABLES => $vfsVariables,
                    XApp_VFS_Base::RELATIVE_VARIABLES => array()
                )
            )
        );
        return $service;
    }

    public static function home()
    {
        // Cannot use $_SERVER superglobal since that's empty during UnitUnishTestCase
        // getenv('HOME') isn't set on Windows and generates a Notice.
        $home = getenv('HOME');
        if (!empty($home)) {
            // home should never end with a trailing slash.
            $home = rtrim($home, '/');
        } elseif (!empty($_SERVER['HOMEDRIVE']) && !empty($_SERVER['HOMEPATH'])) {
            // home on windows
            $home = $_SERVER['HOMEDRIVE'] . $_SERVER['HOMEPATH'];
            // If HOMEPATH is a root directory the path can end with a slash. Make sure
            // that doesn't happen.
            $home = rtrim($home, '\\/');
        }
        return empty($home) ? NULL : $home;
    }

    /***
     * Private factory to create a bootstrap instance for RPC requests
     * @param $serverApplicationClassName
     * @param $clientApplicationName
     * @param $clientDirectory
     * @param $libOffset
     * @param $logDirectory
     * @param $xcvDataRoot
     * @param $xcvUserRoot
     * @param $xcvRoot
     * @param $serviceEntryPoint
     * @param $clientOffset
     * @param $rootUrlOffset
     * @param $confDirectory
     * @return XCF_Bootstrap
     */
    private static function createServerInstance(
        $serverApplicationClassName,
        $clientApplicationName,
        $clientDirectory,
        $libOffset,
        $logDirectory,
        $xcvDataRoot,
        $xcvUserRoot,
        $xcvRoot,
        $serviceEntryPoint,
        $clientOffset,
        $rootUrlOffset,
        $confDirectory
    )
    {

        /***
         * Pull in dependencies
         */
        self::loadMin();
        self::loadRPC();

        xapp_import('xapp.Log');
        xapp_import('xapp.Service');
        xapp_import('xapp.File.Utils');
        xapp_import('xapp.Directory.Utils');
        xapp_import('xapp.Directory.Service');
        xapp_import('xapp.Path.Utils');
        xapp_import('xapp.VFS.Interface.Access');
        xapp_import('xapp.VFS.Base');
        xapp_import('xapp.VFS.Local');
        xapp_import('xapp.Resource.Renderer');
        xapp_import('xapp.Xapp.Hook');
        xapp_import('xapp.Option.*');
        xapp_import("xapp.xide.Models.User");

        xapp_import('xapp.Store.Json.Json');
        xapp_import('xapp.lib.standalone.StoreDelegate');
        xapp_import('xapp.commander.Directory.Service');

        xapp_import("xapp.Service.Utils");
        xapp_import('xapp.Store.Store');

        if(!XApp_Service_Entry_Utils::isFileService()) {

            xapp_import('xapp.xide.Controller.UserManager');
            xapp_import('xapp.xide.Controller.UserService');
            xapp_import('xapp.xide.Workbench.Service');

            xapp_import('xapp.xcf.Base.*');
            xapp_import('xapp.xcf.Service.*');
            xapp_import('xapp.xcf.Driver.*');
            xapp_import('xapp.xcf.Device.*');
            xapp_import('xapp.xcf.Protocol.*');
            xapp_import('xapp.xcf.NodeJs.*');

            xapp_import('xapp.Commons.VariableMixin');
            xapp_import('xapp.xide.NodeJS.Service');
            xapp_import('xapp.xide.NodeJS.ServiceManager');

            xapp_import('xapp.xide.ve.Service');
            xapp_import('xapp.xide.ve.ServiceManager');

            xapp_import('xapp.Resource.Service');
            xapp_import('xapp.Resource.ResourceManager');

            xapp_import('xapp.xide.Logging.Service');
            xapp_import('xapp.xide.Logging.LogManager');
            xapp_import('xapp.Tracking.Service');
            xapp_import('xapp.Tracking.TrackingStore');


            xapp_import('xapp.xide.Workbench.Service');
            //xapp_import('xapp.xide.Directory.Service');
            xapp_import("xapp.xide.Models.User");


        }

        self::loadCommons();
        self::loadXFilePluginDependencies();

        $urlParams = array();


        if (isset($_SERVER["QUERY_STRING"])) {
            XApp_Utils_Strings::parse_str($_SERVER["QUERY_STRING"], $urlParams);
            if (isset($urlParams['view'])) {
                unset($urlParams['view']);
            }
        }
        xapp_setup_language_standalone();
        /***
         * Setup xapp commander bootstrap
         */
        //$XAPP_SITE_URL = dirname(self::getUrl()) . '/';
        xapp_import('xapp.Http.Url');
        $url = new XApp_Http_Url(self::getUrl());
        $XAPP_SITE_URL = $url->getBaseUrl();

        $_serviceEntryPoint = $XAPP_SITE_URL . 'index.php';
        if (isset($serviceEntryPoint)) {
            $_serviceEntryPoint = $XAPP_SITE_URL . $serviceEntryPoint;
        }

        $RPC_CALL_TARGET = $_serviceEntryPoint . '?view=smdCall';
        $SMD_VIEW_TARGET = $_serviceEntryPoint . '?view=rpc';

        if (XApp_Service_Entry_Utils::isDebug()) {
            $RPC_CALL_TARGET .= '&debug=true';
            $SMD_VIEW_TARGET .= '&debug=true';
        }
        $RPC_CALL_TARGET .= count($urlParams) ? '&' . http_build_query($urlParams) : '';
        $XCF_SYSTEM_DRIVERS = realpath($xcvDataRoot . DS . 'system' . DS . 'drivers');
        $XCF_USER_DRIVERS = $xcvUserRoot . DS . 'drivers';
        $XCF_USER_DEVICES = $xcvUserRoot . DS . 'devices';

        $XCF_SYSTEM_DEVICES = $xcvDataRoot . DIRECTORY_SEPARATOR . 'system' . DIRECTORY_SEPARATOR . 'devices';
        $XCF_SYSTEM_PROTOCOLS = $xcvDataRoot . DIRECTORY_SEPARATOR . 'system' . DIRECTORY_SEPARATOR . 'protocols' . DIRECTORY_SEPARATOR;
        $FILE_ROOT = $xcvDataRoot . DIRECTORY_SEPARATOR;
        $SYSTEM_ROOT = realpath($xcvDataRoot . DIRECTORY_SEPARATOR . '..') . DIRECTORY_SEPARATOR;
        /***
         * The path to the virtual file system configuration, holding all mounted resources
         */
        $XAPP_VFS_CONFIG_PATH = realpath($xcvDataRoot . '/system/vfs.json');

        $driverScopes=null;
        $deviceScopes=null;
        $protocolScopes=null;
        if(!XApp_Service_Entry_Utils::isFileService()) {
            $driverScopes = array(
                XIDE_Scope::optionFactory('system_drivers', null, array('ROOT' => $XCF_SYSTEM_DRIVERS)),
                XIDE_Scope::optionFactory('user_drivers', null, array('ROOT' => $XCF_USER_DRIVERS))
            );

            $deviceScopes = array(
                XIDE_Scope::optionFactory('system_devices', null, array('ROOT' => $XCF_SYSTEM_DEVICES)),
                XIDE_Scope::optionFactory('user_devices', null, array('ROOT' => $XCF_USER_DEVICES))
            );


            $protocolScopes = array(
                XIDE_Scope::optionFactory('system_protocols', null, array('ROOT' => $XCF_SYSTEM_PROTOCOLS)),
                XIDE_Scope::optionFactory(XIDE_Scope::USER)
            );
        }
        /***
         * A resolved variable value for the mounted virtual workspace
         */
        $XAPP_WORKSPACE_DIRECTORY = realpath($xcvDataRoot . DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'workspace/';


        $vfsVariables = array(
            'docs' => realpath(XAPP_ROOT_DIR . '/documentation/docFiles'),
            'system_drivers' => $XCF_SYSTEM_DRIVERS,
            'user_drivers' => $XCF_USER_DRIVERS,
            'user_devices' => $XCF_USER_DEVICES,
            'system_devices' => $XCF_SYSTEM_DEVICES,
            'system_protocols' => $XCF_SYSTEM_PROTOCOLS,
            'javascript' => $SYSTEM_ROOT . 'Code/client/src/lib/',
            'php' => $SYSTEM_ROOT . 'Code/xapp/',
            'cfjs' => $SYSTEM_ROOT . 'Code/client/src/lib/xcf',
            'xidejs' => $SYSTEM_ROOT . 'Code/client/src/lib/xide',
            'workspace' => $XAPP_WORKSPACE_DIRECTORY,
            'workspace_user' => realpath($xcvUserRoot . DS . 'workspace'),
            'root' => $xcvUserRoot . DS . 'workspace',
            'logs' => realpath(XCF_NODE_JS_ROOT . 'logs')
        );

        //$host = gethostname();
        //$node_server_host_ip = gethostbyname($host);
        $node_server_host_ip = '127.0.0.1';
        //////////////////////////////////////////////////////////////////////////
        //
        //  Maqetta related service variables
        //
        //////////////////////////////////////////////////////////////////////////

        /***
         * The path to the virtual file system configuration for Maqetta, holding all mounted resources
         */
        $XAPP_MAQETTA_VFS_CONFIG_PATH = realpath(
                XAPP_BASEDIR . '..' . DIRECTORY_SEPARATOR
            ) . DIRECTORY_SEPARATOR . 'maqetta' . DIRECTORY_SEPARATOR . 'vfs.json';

        /***
         * The path to the virtual file system configuration for Maqetta, holding all mounted resources
         */
        $XCF_NODE_JS_LOG_PATH = realpath(
            XCF_NODE_JS_ROOT . DIRECTORY_SEPARATOR . 'logs' . DIRECTORY_SEPARATOR . 'all.log'
        );
        if (!$XCF_NODE_JS_LOG_PATH) {
            $XCF_NODE_JS_LOG_PATH = 'notset';
        }

        /***
         * The path to the NodeJS service configuration
         */
        $XAPP_NODEJS_CONFIG_PATH = realpath(
                $xcvRoot
            ) . DIRECTORY_SEPARATOR . 'services-' . (XApp_Service_Entry_Utils::isDebug() ? 'debug' : 'release') . '.json';


        /**
         * XIDE-VE Service config
         */
        $user = new XApp_User();
        $user->setName('A');
        $CLIENT_LIB_URL = str_replace('/xapp/xcf/', '/client', $XAPP_SITE_URL) . $clientOffset;
        $SITE_URL = str_replace('Code/xapp/xcf/', '', $XAPP_SITE_URL);
        $SITE_DATA_URL = $SITE_URL . 'data/';
        $WORKSPACE_URL = $SITE_DATA_URL . 'workspace';

        if (!is_file(realpath($xcvUserRoot . '/settings.json'))) {
            XApp_File_Utils::createEmptyFile($xcvUserRoot . '/settings.json');
        }

        $userDirectory = "";
        if (array_key_exists('userDirectory', $_GET)) {
            $userDirectory = urlencode($_GET['userDirectory']);
        }


        if (!is_file(realpath($xcvUserRoot . '/meta.json'))) {
            XApp_File_Utils::createEmptyFile($xcvUserRoot . '/meta.json');
            $default = array(
                'admin' => array(
                    'meta' => array()
                )
            );
            XApp_File_Utils::set($xcvUserRoot . '/meta.json', json_encode($default));
        }

        $CF_TRACKING_FILE = realpath($xcvUserRoot . '/meta.json');

        if(!file_exists(realpath($xcvUserRoot . '/meta.json'))){
            error_log('have no meta');
        }
        if(!file_exists($XAPP_VFS_CONFIG_PATH)){
            error_log('have no vfs');
        }

        $SERVICE_CONF = null;
        if(XApp_Service_Entry_Utils::isFileService()){
            /**
             * File service
             */
            $SERVICE_CONF = array(XApp_Service::factoryEx(
                'XCOM_Directory_Service',
                array(

                    XApp_Directory_Service::REPOSITORY_ROOT => $FILE_ROOT,
                    XApp_Directory_Service::FILE_SYSTEM => 'XApp_VFS_Local',
                    XApp_Directory_Service::VFS_CONFIG_PATH => $XAPP_VFS_CONFIG_PATH,
                    XApp_Directory_Service::FILE_SYSTEM_CONF => array(
                        XApp_VFS_Base::ABSOLUTE_VARIABLES => $vfsVariables,
                        XApp_VFS_Base::RELATIVE_VARIABLES => array()
                    )
                )
            ));

        }else {
            error_log('is normal');
            $SERVICE_CONF = array(
                /**
                 * File service
                 */
                XApp_Service::factoryEx(
                    'XCOM_Directory_Service',
                    array(

                        XApp_Directory_Service::REPOSITORY_ROOT => $FILE_ROOT,
                        XApp_Directory_Service::FILE_SYSTEM => 'XApp_VFS_Local',
                        XApp_Directory_Service::VFS_CONFIG_PATH => $XAPP_VFS_CONFIG_PATH,
                        XApp_Directory_Service::FILE_SYSTEM_CONF => array(
                            XApp_VFS_Base::ABSOLUTE_VARIABLES => $vfsVariables,
                            XApp_VFS_Base::RELATIVE_VARIABLES => array()
                        )
                    )
                ),
                XApp_Service::factory(
                    'XApp_Resource_Service',
                    array(
                        XApp_Service::MANAGED_CLASS => 'XApp_ResourceManager',//rpc auto wrapping
                        XApp_Service::MANAGED_CLASS_OPTIONS => array(
                            XApp_ResourceManager::STORE_CONF => array(
                                XApp_Store_Json::CONF_FILE => $XAPP_VFS_CONFIG_PATH
                            )
                        )
                    )
                ),
                XApp_Service::factory(
                    'XApp_Tracking_Service',
                    array(
                        XApp_Service::MANAGED_CLASS => 'XApp_Tracking_Store',//rpc auto wrapping
                        XApp_Service::MANAGED_CLASS_OPTIONS => array(
                            XApp_Store_Json::CONF_FILE => $CF_TRACKING_FILE,
                            XApp_Store::READER_CLASS => 'XApp_Store_Delegate',
                            XApp_Store::WRITER_CLASS => 'XApp_Store_Delegate',
                            XApp_Store::PRIMARY_KEY => 'admin',
                            XApp_Store::IDENTIFIER => '',
                            XApp_Store::DATA_PROPERTY => '',
                            XApp_Store::CONF_FILE => realpath($xcvUserRoot . '/meta.json')
                        )
                    )
                ),
                /***
                 *  Node-Debugger service
                 */
                /*
            XApp_Service::factory(
                'XCF_NodeJS_Debug_Service',
                array(
                    XApp_Service::MANAGED_CLASS => 'XCF_NodeJS_Debug_Manager'
                )
            ),
            */
                /***
                 * Register the driver manager as service
                 */
                XApp_Service::factoryEx(
                    'XCF_Driver_Service',
                    array(
                        XApp_Service::MANAGED_CLASS => 'XCF_DriverManager',//rpc auto wrapping
                        XApp_Service::MANAGED_CLASS_OPTIONS => array(
                            XIDE_Scoped::SCOPE_CONFIGS => $driverScopes,
                            XIDE_Scoped::SCOPE_NS_PREFIX => 'driver'
                        )
                    )
                ),
                /***
                 * Register the device manager as service
                 */
                XApp_Service::factoryEx(
                    'XCF_Device_Service',
                    array(
                        XApp_Service::MANAGED_CLASS => 'XCF_DeviceManager',//rpc auto wrapping
                        XApp_Service::MANAGED_CLASS_OPTIONS => array(
                            XIDE_Scoped::SCOPE_CONFIGS => $deviceScopes,
                            XIDE_Scoped::SCOPE_NS_PREFIX => 'device'
                        )
                    )
                ),
                /***
                 * Register the protocol manager as service
                 */
                XApp_Service::factoryEx(
                    'XCF_Protocol_Service',
                    array(
                        XApp_Service::MANAGED_CLASS => 'XCF_ProtocolManager',//rpc auto wrapping
                        XApp_Service::MANAGED_CLASS_OPTIONS => array(
                            XIDE_Scoped::SCOPE_CONFIGS => $protocolScopes,
                            XIDE_Scoped::SCOPE_NS_PREFIX => 'protocol'
                        )
                    )
                ),
                /**
                 * Register user service, needed to enable user logon and provide an ACL based
                 * permission system
                 */
                XApp_Service::factoryEx(
                    'XApp_XIDE_Controller_UserService',
                    array(

                        XApp_Service::MANAGED_CLASS_OPTIONS => array(
                            XApp_UserManager::STORE_CONF => array(
                                XApp_Store_Json::CONF_FILE => XCF_DATA_ROOT . "Users.json"
                            )
                        )
                    )
                ),
                /***
                 * Register NodeJS service manager. This service manages multiple
                 * NodeJS services, ie: start, stop, kill, list
                 */
                XApp_Service::factoryEx(
                    'XIDE_NodeJS_Service',
                    array(

                        XApp_Service::MANAGED_CLASS_OPTIONS => array(
                            XIDE_NodeJS_Service_Manager::REWRITE_HOST => true,
                            XIDE_NodeJS_Service_Manager::FORCE_HOST => XApp_Service_Entry_Utils::isDesktopApp() ? '127.0.0.1' : $node_server_host_ip,
                            XIDE_NodeJS_Service_Manager::ABSOLUTE_REGISTRY_NAMESPACE => 'nodejs_abs',
                            XIDE_NodeJS_Service_Manager::RELATIVE_REGISTRY_NAMESPACE => 'nodejs_rel',
                            XIDE_NodeJS_Service_Manager::ABSOLUTE_VARIABLES => array(
                                'NODE_ROOT' => XCF_NODE_JS_ROOT,
                                'SERVER_IP' => $node_server_host_ip,
                                'PLATFORM' => self::isWindows() ? 'windows' : 'linux',
                                'EXE_PREFIX' => self::isWindows() ? '' : './',
                                'EXE_SUFFIX' => self::isWindows() ? '.exe' : '',
                            ),
                            XIDE_NodeJS_Service_Manager::RELATIVE_VARIABLES => array(
                                'PLATFORM' => self::isWindows() ? 'windows' : 'linux',
                                'EXE_PREFIX' => self::isWindows() ? '' : './'
                            ),
                            XIDE_NodeJS_Service_Manager::RESOURCES_DATA => $XAPP_NODEJS_CONFIG_PATH,
                            XIDE_NodeJS_Service_Manager::RESOURCES_TYPE => XAPP_RESOURCE_TYPE_NODEJS_SERVICE
                        ),
                        XApp_Service::MANAGED_CLASS => 'XIDE_NodeJS_Service_Manager'/*,
                    XApp_Service::MANAGED_CLASS_BASE_CLASSES => array('XApp_Variable_Mixin')*/
                    )
                ),
                /***
                 * Register NodeJS service manager. This service manages multiple
                 * NodeJS services, ie: start, stop, kill, list
                 */
                XApp_Service::factoryEx(
                    'XIDE_VE_Service',
                    array(

                        XApp_Service::MANAGED_CLASS_OPTIONS => array(
                            XIDE_VE_Manager::REWRITE_HOST => true,
                            XIDE_VE_Manager::CLIENT_DIRECTORY => $clientDirectory,
                            XIDE_VE_Manager::FORCE_HOST => XApp_Service_Entry_Utils::isDesktopApp() ? '127.0.0.1' : $node_server_host_ip,
                            XIDE_VE_Manager::ABSOLUTE_REGISTRY_NAMESPACE => 'xideve_abs',
                            XIDE_VE_Manager::RELATIVE_REGISTRY_NAMESPACE => 'xideve_rel',
                            XIDE_VE_Manager::ABSOLUTE_VARIABLES => array(
                                'baseUrl' => $WORKSPACE_URL . '/' . XApp_Service_Utils::_getKey('baseOffset', '')
                            ),
                            XIDE_VE_Manager::RELATIVE_VARIABLES => array(
                                'WORKSPACE_URL' => $WORKSPACE_URL,
                                'baseUrl' => $WORKSPACE_URL . '/' . XApp_Service_Utils::_getKey('baseOffset', ''),
                                'clientUrl' => $CLIENT_LIB_URL,
                                'rpcUrl' => $XAPP_SITE_URL . '/index.php?debug=' . (XApp_Service_Entry_Utils::isDebug() ? 'true' : 'false') . '&view=rpc&userDirectory=' . $userDirectory,
                                'data' => $SITE_DATA_URL
                            ),
                            XIDE_VE_Manager::RESOURCES_DATA => $XAPP_NODEJS_CONFIG_PATH,
                            XIDE_VE_Manager::RESOURCES_TYPE => XAPP_RESOURCE_TYPE_NODEJS_SERVICE
                        ),
                        XApp_Service::MANAGED_CLASS => 'XIDE_VE_Manager'
                    )
                ),
                /***
                 * Maqetta specific directory server
                 */
                /*
                XApp_Service::factoryEx(
                    'XIDE_Directory_Service',
                    array(

                        XApp_Directory_Service::REPOSITORY_ROOT => $XAPP_WORKSPACE_DIRECTORY,
                        XApp_Directory_Service::FILE_SYSTEM => 'XApp_VFS_Local',
                        XApp_Directory_Service::VFS_CONFIG_PATH => $XAPP_MAQETTA_VFS_CONFIG_PATH,
                        XApp_Directory_Service::FILE_SYSTEM_CONF => array(

                            XApp_VFS_Base::ABSOLUTE_VARIABLES => array('WS_ABS_PATH' => $XAPP_WORKSPACE_DIRECTORY),
                            XApp_VFS_Base::RELATIVE_VARIABLES => array()
                        )
                    )
                ),
                */
                /***
                 * Maqetta Workbench service
                 */

                XApp_Service::factory(
                    'xapp.xide.Workbench.Service',
                    array(
                        XApp_XIDE_Workbench_Service::WORKBENCH_USER => $user,
                        XApp_XIDE_Workbench_Service::WORKBENCH_DIRECTORY => $XAPP_WORKSPACE_DIRECTORY,
                        XApp_XIDE_Workbench_Service::SITE_CONFIG_DIRECTORY => realpath(
                            XAPP_BASEDIR . '/xide/Workbench/siteconfig/'
                        )
                    )
                ),

                /***
                 * XIDE Logging service
                 */
                XApp_Service::factoryEx(
                    'XIDE_Log_Service',
                    array(

                        XApp_Service::MANAGED_CLASS => 'XIDE_Log_Manager',
                        XApp_Service::MANAGED_CLASS_OPTIONS => array(
                            XIDE_Log_Manager::LOG_PATH => $XCF_NODE_JS_LOG_PATH
                        )
                    )
                )
            );
        }

        $options = array(
            self::ALLOW_PLUGINS => false,
            self::PLUGIN_MASK => 'XCOM',
            self::PLUGIN_DIRECTORY => XAPP_BASEDIR . DIRECTORY_SEPARATOR . 'commander' . DIRECTORY_SEPARATOR . 'plugins' . DIRECTORY_SEPARATOR,
            self::BASEDIR => XAPP_BASEDIR,
            self::FLAGS => array(
                XAPP_BOOTSTRAP_SETUP_XAPP,              //takes care about output encoding and compressing
                XAPP_BOOTSTRAP_SETUP_RPC,               //setup a RPC server
                XAPP_BOOTSTRAP_SETUP_LOGGER,            //setup a logger
                XAPP_BOOTSTRAP_SETUP_GATEWAY,           //setup a gateway
                XAPP_BOOTSTRAP_SETUP_SERVICES,          //setup services,
                //XAPP_BOOTSTRAP_NEEDS_AUTHENTICATION     //we need to be logged in
                //XAPP_BOOTSTRAP_LOAD_PLUGIN_RESOURCES,
                XAPP_BOOTSTRAP_REGISTER_SERVER_PLUGINS,
                //setup a settings store
                XAPP_BOOTSTRAP_SETUP_STORE
            ),
            self::RPC_TARGET => $RPC_CALL_TARGET,
            self::SIGNED_SERVICE_TYPES => array(),
            self::GATEWAY_CONF => array(
                Xapp_Rpc_Gateway::OMIT_ERROR => XApp_Service_Entry_Utils::isDebug()
            ),
            self::LOGGING_FLAGS => array(
                XAPP_LOG_SHARED_LOGGER_SERVICES
            ),
            self::LOGGING_CONF => array(
                Xapp_Log::PATH => $logDirectory,
                Xapp_Log::EXTENSION => 'log',
                Xapp_Log::NAME => $serverApplicationClassName
            ),
            self::XAPP_CONF => array(
                XAPP_CONF_DEBUG_MODE => null,
                XAPP_CONF_AUTOLOAD => false,
                XAPP_CONF_DEV_MODE => false,
                //XApp_Service_Entry_Utils::isDebug(),
                XAPP_CONF_HANDLE_BUFFER => true,
                XAPP_CONF_HANDLE_SHUTDOWN => true,
                XAPP_CONF_HTTP_GZIP => true,
                XAPP_CONF_CONSOLE => 'chromephp',
                //self::getConsoleType(),//XApp_Service_Entry_Utils::isDebug() ? self::getConsoleType() : false,
                XAPP_CONF_HANDLE_ERROR => true,
                //XApp_Service_Entry_Utils::isDebug() ? 'console' : true,
                XAPP_CONF_HANDLE_EXCEPTION => false
            ),
            self::SERIVCE_CONF => $SERVICE_CONF,
            self::USER_CONF => XCF_DATA_ROOT . "Users.json",
            self::STORE_CONF => array(
                XApp_Store::READER_CLASS => 'XApp_Store_Delegate',
                XApp_Store::WRITER_CLASS => 'XApp_Store_Delegate',
                XApp_Store::PRIMARY_KEY => 'admin',
                XApp_Store::IDENTIFIER => '',
                XApp_Store::DATA_PROPERTY => '',
                XApp_Store::CONF_FILE => realpath($xcvUserRoot . '/settings.json')
            )
        );
        return self::instance($options);
    }

    /***
     * @param $serverApplicationClassName
     * @param $clientApplicationName
     * @param $clientDirectory
     * @param $libOffset
     * @param $logDirectory
     * @param $xcvDataRoot
     * @param $xcvUserRoot
     * @param $xcvRoot
     * @param $serviceEntryPoint
     * @param $clientOffset
     * @param $rootUrlOffset
     * @param $confDirectory
     * @return XCF_Bootstrap
     */
    private static function createClientInstance(
        $serverApplicationClassName,
        $clientApplicationName,
        $clientDirectory,
        $libOffset,
        $logDirectory,
        $xcvDataRoot,
        $xcvUserRoot,
        $xcvRoot,
        $serviceEntryPoint,
        $clientOffset,
        $rootUrlOffset,
        $confDirectory
    )
    {
        xapp_import('xapp.Store.Store');
        xapp_import('xapp.File.Utils');
        xapp_import('xapp.lib.standalone.StoreDelegate');
        /***
         * Setup xapp commander bootstrap
         */
        xapp_import('xapp.Http.Url');
        $url = new XApp_Http_Url(self::getUrl());
        $XAPP_SITE_URL = $url->getBaseUrl();

        $XAPP_APP_URL = $XAPP_SITE_URL . $clientOffset;
        $RPC_CALL_TARGET = 'index.php?view=smdCall';
        $SMD_VIEW_TARGET = 'index.php?view=rpc';
        $RPC_URL_SUFFIX = '';


        if (XApp_Service_Entry_Utils::isDebug()) {
            $RPC_CALL_TARGET .= '&debug=true';
            $RPC_URL_SUFFIX .= '&debug=true';
        }

        $RESOURCE_PREFIX = '';
        $RESOURCE_CONFIG_PREFIX = '';
        self::loadCommons();
        $XF_THEME = self::_getKey('theme', 'white');
        $XAPP_XFILE_PLUGIN_URL = $XAPP_SITE_URL . '';
        $XAPP_APP_URL = str_replace('/xapp/xcf/', '/client', $XAPP_APP_URL);

        if (!is_file(realpath($xcvUserRoot . '/settings.json'))) {
            XApp_File_Utils::createEmptyFile($xcvUserRoot . '/settings.json');
        }
        if (!is_readable($xcvUserRoot . '/settings.json')) {
            echo(XAPP_TEXT_FORMATTED('CAN_NOT_READ_FILE', array($xcvUserRoot . '/settings.json'), 55100));
            exit("");
        }

        if (!is_writable($xcvUserRoot . '/settings.json')) {
            echo(XAPP_TEXT_FORMATTED('FILE_NOT_WRITEABLE', array($xcvUserRoot . '/settings.json'), 55100));
            exit("");
        }

        $options = array(
            self::ALLOW_PLUGINS => false,
            self::PLUGIN_MASK => 'XCOM',
            self::PLUGIN_DIRECTORY => XAPP_BASEDIR . DIRECTORY_SEPARATOR . 'commander' . DIRECTORY_SEPARATOR . 'plugins' . DIRECTORY_SEPARATOR,
            self::SERVER_APPLICATION_CLASS => $serverApplicationClassName,
            self::RESOURCE_RENDERER_PREFIX => $RESOURCE_PREFIX,
            self::RESOURCE_CONFIG_SUFFIX => $RESOURCE_CONFIG_PREFIX,
            self::RESOURCE_CONFIG_PREFIX => $libOffset,
            self::BASEDIR => XAPP_BASEDIR,
            self::DOC_ROOT => $XAPP_APP_URL,
            self::APP_NAME => $clientApplicationName,
            self::APP_FOLDER => $clientApplicationName,
            self::APPDIR => $clientDirectory,
            self::SERVICE => $RPC_CALL_TARGET,
            self::RESOURCE_RENDERER_CLZ => 'XCF_Resource_Renderer',
            self::RELATIVE_VARIABLES => array(
                'APP_URL' => $XAPP_APP_URL,
                'SITEURL' => $XAPP_SITE_URL,
                'RPC_URL_SUFFIX' => $RPC_URL_SUFFIX,
                'ROOT_URL_OFFSET' => $rootUrlOffset,
                'THEME' => $XF_THEME,
                'XCOM_PLUGINS_WEB_URL' => $XAPP_XFILE_PLUGIN_URL

            ),
            self::FLAGS => array(
                //XAPP_BOOTSTRAP_NEEDS_AUTHENTICATION
                XAPP_BOOTSTRAP_SETUP_STORE
            ),
            self::USER_CONF => XCF_DATA_ROOT . "Users.json",
            self::STORE_CONF => array(
                XApp_Store::READER_CLASS => 'XApp_Store_Delegate',
                XApp_Store::WRITER_CLASS => 'XApp_Store_Delegate',
                XApp_Store::PRIMARY_KEY => 'admin',
                XApp_Store::IDENTIFIER => '',
                XApp_Store::DATA_PROPERTY => '',
                XApp_Store::CONF_FILE => realpath($xcvUserRoot . '/settings.json')
            )
        );
        return self::instance($options);
    }

    /**
     * Make sure a path exists
     * @param $path
     * @return bool true if it existed, false if not
     */
    public function ensurePath($path)
    {
        xapp_import('xapp.File.Utils');
        xapp_import('xapp.Directory.Utils');
        xapp_import('xapp.Path.Utils');

        if (file_exists($path)) {
            return true;
        } else {
            XApp_File_Utils::mkDir(
                XApp_Path_Utils::securePath($path)
            );
            return false;
        }
    }

    public function ensureUser($user, $system)
    {
        xapp_import('xapp.File.Utils');
        xapp_import('xapp.Directory.Utils');
        xapp_import('xapp.Path.Utils');
        $this->ensurePath($user);
        $this->ensurePath($user . DIRECTORY_SEPARATOR . 'devices');
        $this->ensurePath($user . DIRECTORY_SEPARATOR . 'drivers');
        //if it didn't exists
        if (!$this->ensurePath($user . DIRECTORY_SEPARATOR . 'workspace')) {
            XApp_File_Utils::copyDirectory(
                XApp_Directory_Utils::normalizePath($system . DIRECTORY_SEPARATOR . "workspace", false),
                XApp_Directory_Utils::normalizePath($user . DIRECTORY_SEPARATOR . "workspace", false),
                Array(
                    XApp_File_Utils::OPTION_RECURSIVE => true,
                    XApp_File_Utils::OPTION_CONFLICT_MODUS => XAPP_XFILE_OVERWRITE_ALL
                ),
                array("*"),
                array(),
                $error,
                $success
            );
        }
    }

    public function getDrivers($user, $system)
    {

        xapp_import('xapp.xcf.Driver.DriverManager');
        $driverScopes = array(
            XIDE_Scope::optionFactory('system_drivers', null, array('ROOT' => realpath($system . DS . 'system' . DS . 'drivers'))),
            XIDE_Scope::optionFactory('user_drivers', null, array('ROOT' => $user . DS . 'drivers'))
        );
        $options = array(
            XIDE_Scoped::SCOPE_CONFIGS => $driverScopes,
            XIDE_Scoped::SCOPE_NS_PREFIX => 'driver'
        );
        $manager = new XCF_DriverManager($options);
        $manager2 = new XCF_DriverManager($options);
        return array(
            'user' => $manager->ls('user_drivers'),
            'system' => $manager2->ls('system_drivers'));
    }

    public function getMounts($user, $system)
    {
        xapp_import('xapp.Resource.ResourceManager');
        xapp_import('xapp.Store.Json.Json');
        $XAPP_VFS_CONFIG_PATH = realpath($system . '/system/vfs.json');
        $options = array(
            XApp_ResourceManager::STORE_CONF => array(
                XApp_Store_Json::CONF_FILE => $XAPP_VFS_CONFIG_PATH
            )
        );

        $manager = new XApp_ResourceManager($options);
        $manager->init();
        $error = array();
        return $manager->ls($error);

    }

    public function getDevices($user, $system)
    {
        xapp_import('xapp.xcf.Device.DeviceManager');
        $scopes = array(
            XIDE_Scope::optionFactory('system_devices', null, array('ROOT' => realpath($system . DS . 'system' . DS . 'devices'))),
            XIDE_Scope::optionFactory('user_devices', null, array('ROOT' => realpath($user . DS . 'devices')))
        );
        $options = array(
            XIDE_Scoped::SCOPE_CONFIGS => $scopes,
            XIDE_Scoped::SCOPE_NS_PREFIX => 'device'
        );
        $manager = new XCF_DeviceManager($options);
        return array(
            'system' => $manager->ls('system_devices'),
            'user' => $manager->ls('user_devices')
        );
    }

    /**
     * @param bool|true $print
     * @param $xcvDataRoot
     * @param $xcvUserRoot
     * @return mixed
     */
    public function render($print = true, $xcvDataRoot, $xcvUserRoot)
    {
        $this->ensureUser($xcvUserRoot, $xcvDataRoot);
        $this->setup();
        $drivers = $this->getDrivers($xcvUserRoot, $xcvDataRoot);
        $devices = $this->getDevices($xcvUserRoot, $xcvDataRoot);
        $mounts = $this->getMounts($xcvUserRoot, $xcvDataRoot);
        $vfsConfigDrivers = array(
            'System' => array(
                'name' => 'System',
                'mount' => 'root'
            )
        );

        $vfsConfigDevices = array(
            'System' => array(
                'name' => 'System',
                'mount' => 'root'
            )
        );

        xapp_import('xapp.Service.Utils');
        xapp_import('xapp.Store.Store');
        xapp_import('xapp.lib.standalone.StoreDelegate');

        $settingsStore = xapp_get_option(self::STORE, $this);

        $theme = XApp_Service_Utils::_getKey('theme', null);
        if ($settingsStore) {
            $_theme = $settingsStore->get('settings', '.', array('id' => 'theme'));
            if ($_theme) {
                $this->resourceRenderer->registerRelative('THEME', $_theme->value);
            }
        }
        if ($theme) {
            $this->resourceRenderer->registerRelative('THEME', $theme);
        }

        $this->resourceRenderer->registerRelative('XCF_DRIVER_VFS_CONFIG', json_encode($vfsConfigDrivers));
        $this->resourceRenderer->registerRelative('XCF_DEVICE_VFS_CONFIG', json_encode($vfsConfigDevices));

        $vfsService = self::getDirectoryService($xcvDataRoot, $xcvUserRoot);

        $serviceConf = xapp_get_option(XApp_Service::XAPP_SERVICE_CONF, $vfsService);
        $vfsConfig = $serviceConf[XApp_Directory_Service::FILE_SYSTEM_CONF];
        $vfsVars = $vfsConfig[XApp_VFS_Base::ABSOLUTE_VARIABLES];

        $this->resourceRenderer->registerRelative('VFS_GET_URL', $this->getVFSGetUrl());
        $this->resourceRenderer->registerRelative('USER_DIRECTORY', $xcvUserRoot);

        $this->resourceRenderer->registerRelative('XCF_SYSTEM_DRIVERS', json_encode($drivers['system']));
        $this->resourceRenderer->registerRelative('XCF_USER_DRIVERS', json_encode($drivers['user']));

        $this->resourceRenderer->registerRelative('XCF_SYSTEM_DEVICES', json_encode($devices['system']));
        $this->resourceRenderer->registerRelative('XCF_USER_DEVICES', json_encode($devices['user']));
        $this->resourceRenderer->registerRelative('XCF_MOUNTS', json_encode($mounts));


        $XAPP_COMPONENTS = array(
            'xfile' => true,
            'xnode' => true,
            'xideve' => array('cmdOffset' => '../xide/'),
            'xblox' => true,
            'x-markdown' => true,
            'xtrack' => true
        );

        $resourceRenderer = $this->getResourceRenderer();

        $this->resourceRenderer->registerRelative(
            'COMPONENTS', json_encode($XAPP_COMPONENTS)
        );

        $this->resourceRenderer->registerRelative(
            'PACKAGE_CONFIG',
            XApp_Service_Utils::_getKey('run', 'run-release-debug')
        );

        $head = $this->appRenderer->renderHead();

        $bodyIncludes = $this->appRenderer->renderBodyIncludes();

        $this->resourceRenderer->registerRelative('HTML_HEADER', $head);
        $this->resourceRenderer->registerRelative('BODY_RESOURCES', $bodyIncludes);
        $this->resourceRenderer->registerRelative('RPC_TARGET', './index.php?view=rpc');

        $resourceRenderer->registerRelative('RPC_URL', urlencode(self::getRpcViewUrl()));


        //important: get the resource variables before adding 'head' otherwise it breaks the JSON structure!
        $resourceVariables = (array)$this->resourceRenderer->registryToKeyValues(
            xapp_get_option(XApp_Resource_Renderer::RELATIVE_REGISTRY_NAMESPACE, $this->resourceRenderer)
        );
        $resourceVariables['HTML_HEADER'] = array();
        $resourceVariables['XAPP_PLUGIN_RESOURCES'] = array();

        $resourceVariables['VFS_CONFIG'] = $vfsVars;
        $resourceVariables['ROOT'] = XAPP_ROOT_DIR;
        $resourceVariables['SYSTEM'] = $xcvDataRoot;

        $this->resourceRenderer->registerRelative(
            'RESOURCE_VARIABLES', json_encode($resourceVariables, true)
        );


        if ($this->isLoggedIn()) {
            $body = $this->resourceRenderer->renderHTML();
            echo($body);
            return $body;
        } else {

            $body = $this->resourceRenderer->renderHTML(XAPP_RESOURCE_TYPE_LOGIN);
            echo($body);
            return $body;
        }
    }

    public function getVFSGetUrl($mount = null)
    {
        $res = "";
        if ($mount) {
            $res = $this->getRpcCallUrl() . '&service=XCOM_Directory_Service.get2&callback=asdf&raw=html&attachment=0&send=1&mount=' . $mount . '&path=';
        } else {
            $res = $this->getRpcCallUrl() . '&service=XCOM_Directory_Service.get2&callback=asdf&raw=html&attachment=0&send=1&mount=';

        }
        return $res;
    }

    /***
     * Minimum setup for client rendering
     * @return null|XApp_App_Commander
     */
    public function setup()
    {

        $this->loadMin();
        /***
         * Get run-time configuration, there is 'debug' and 'release'. For both cases there are
         * different resources to load.
         */
        $XAPP_RUN_TIME_CONFIGURATION = XApp_Service_Entry_Utils::getRunTimeConfiguration();
        /***
         * Now include all xapp stuff
         */
        //pull in registry of xapp core framework
        XApp_Service_Entry_Utils::includeXAppRegistry();


        //pull in parts of xapp json framework
        self::loadXAppJSONStoreClasses();

        //pull in json utils (to read client app's resource configuration
        self::loadJSONTools();

        //some debugging tools
        self::loadDebuggingTools();

        //pull in legacy client app renderer
        xapp_import('xapp.app.Renderer');

        //pull in xapp resource renderer
        xapp_import('xapp.Resource.Renderer');

        //pull in xide resource Renderer
        xapp_import('xapp.xide.Resource.Renderer');

        //pull in xide resource Renderer
        xapp_import('xapp.xcf.Resource.Renderer');

        /***
         * Prepare resource renderer
         */
        $APP_NAME = xapp_get_option(self::APP_NAME, $this);
        $RESOURCE_CONFIG_SUFFIX = xapp_get_option(self::RESOURCE_CONFIG_SUFFIX, $this); //debug = ''    | release =
        $RESOURCE_CONFIG_PREFIX = xapp_get_option(self::RESOURCE_CONFIG_PREFIX, $this); //debug = 'lib' |

        //clients resource config path
        $XAPP_RESOURCE_CONFIG_PATH = '' . xapp_get_option(self::APPDIR, $this) . DIRECTORY_SEPARATOR;
        if ($XAPP_RUN_TIME_CONFIGURATION === 'debug') {
            $XAPP_RESOURCE_CONFIG_PATH .= $RESOURCE_CONFIG_PREFIX . DS . $APP_NAME . DS . 'resources-' . $XAPP_RUN_TIME_CONFIGURATION . $RESOURCE_CONFIG_SUFFIX . '.json';
        } else {
            if ($XAPP_RUN_TIME_CONFIGURATION === 'release') {
                $XAPP_RESOURCE_CONFIG_PATH .= DS . $APP_NAME . DS . 'resources-release.json';
            } else {
                if ($XAPP_RUN_TIME_CONFIGURATION === 'release-debug') {
                    $XAPP_RESOURCE_CONFIG_PATH .= $RESOURCE_CONFIG_PREFIX . DS . $APP_NAME . DS . 'resources-' . $XAPP_RUN_TIME_CONFIGURATION . $RESOURCE_CONFIG_SUFFIX . '.json';
                }
            }
        }

        $flags = xapp_get_option(self::FLAGS, $this);

        /***
         * Setup user settings store
         */
        if (in_array(XAPP_BOOTSTRAP_SETUP_STORE, $flags) && xapp_has_option(self::STORE_CONF, $this)) {
            $storeService = $this->setupStore(xapp_get_option(self::STORE_CONF, $this));
            xapp_set_option(self::STORE, $storeService, $this);
        }

        if (!file_exists($XAPP_RESOURCE_CONFIG_PATH)) {
            $this->log('have no client resource configuration at ' . $XAPP_RESOURCE_CONFIG_PATH . ', aborting');
        }

        //load resource configuration
        $resources = (object)XApp_Utils_JSONUtils::read_json($XAPP_RESOURCE_CONFIG_PATH, 'json', false, true);
        $pluginResources = null;

        /***
         * Load XFile plugin resources
         */
        if (xapp_get_option(self::ALLOW_PLUGINS, $this) &&
            xapp_get_option(self::PLUGIN_DIRECTORY, $this) &&
            xapp_get_option(self::PLUGIN_MASK, $this)
        ) {

            self::loadXFilePluginDependencies();
            $xComPluginManager = new XApp_Commander_PluginManager();
            $loadedPlugins = null;
            $plugins = $xComPluginManager->loadPlugins(
                xapp_get_option(self::PLUGIN_DIRECTORY, $this),
                xapp_get_option(self::PLUGIN_DIRECTORY, $this),
                xapp_get_option(self::PLUGIN_MASK, $this)
            );
            $pluginResources = $this->getPluginResources($plugins, $XAPP_RUN_TIME_CONFIGURATION, null);
        }

        //now merge xfile plugin resources into app resources
        if ($pluginResources) {
            foreach ($pluginResources as $pluginResourceItems) {
                foreach ($pluginResourceItems as $pluginResource) {
                    array_push($resources->items, $pluginResource);
                }
            }
        }

        $resourceRendererOptions = array
        (
            XApp_Resource_Renderer::DOC_ROOT => xapp_get_option(self::DOC_ROOT, $this),
            XApp_Resource_Renderer::DOC_ROOT_PATH => xapp_get_option(self::APPDIR, $this),
            XApp_Resource_Renderer::RESOURCES_DATA => $resources
        );

        $clz = xapp_get_option(self::RESOURCE_RENDERER_CLZ, $this);


        $xappResourceRenderer = new $clz($resourceRendererOptions);
        $xappResourceRenderer->registerDefault();
        if (xapp_has_option(self::RELATIVE_VARIABLES)) {
            $rVariables = xapp_get_option(self::RELATIVE_VARIABLES, $this);
            foreach ($rVariables as $variable => $value) {
                $xappResourceRenderer->registerRelative($variable, $value);
            }
        }

        $RELATIVE_VARS = xapp_get_option(XApp_Bootstrap::RELATIVE_VARIABLES, $this);
        $SITE_URL = '' . $RELATIVE_VARS['SITEURL'];
        $SITE_URL = str_replace('Code/xapp/xcf/', '', $SITE_URL);
        $SITE_DATA_URL = $SITE_URL . 'data/';


        $dojoPackages = array();

        $dojoPackages[] = array(
            'name' => 'system_drivers',
            'location' => $SITE_DATA_URL . 'system/drivers/'
        );
        $dojoPackages[] = array(
            'name' => 'user_drivers',
            'location' => $this->getVFSGetUrl('user_drivers')
        );
        $dojoPackages[] = array(
            'name' => 'resources',
            'location' => $SITE_URL . '/Code/client/src/'
        );
        $dojoPackages[] = array(
            'name' => 'workspace',
            'location' => $this->getVFSGetUrl('workspace') . '&service=XCOM_Directory_Service.get2&callback=asdf&raw=html&attachment=0&send=1&mount=workspace&path='
        );


        $javascriptPlugins = $xappResourceRenderer->getJavascriptPlugins();
        $XAPP_DOJO_PACKAGE_LOCATION_PREFIX = $SITE_URL . 'Code/xapp/commander/plugins/';
        $xappResourceRenderer->registerRelative('XCOM_PLUGINS_WEB_URL', $XAPP_DOJO_PACKAGE_LOCATION_PREFIX);
        if ($javascriptPlugins && count($javascriptPlugins)) {
            foreach ($javascriptPlugins as $plugin) {
                if (is_object($plugin)) {
                    array_push(
                        $dojoPackages,
                        array(
                            'name' => $plugin->name,
                            'location' => urlencode($XAPP_DOJO_PACKAGE_LOCATION_PREFIX . $plugin->name . '/client/')
                        )
                    );
                }
            }

            /****
             * Render plugin resources
             */
            $xappResourceRenderer->registerRelative(
                'XAPP_PLUGIN_RESOURCES', json_encode($javascriptPlugins)
            );

        }
        $dojoPackagesString = $this->createDojoPackageString('', $dojoPackages, false);
        $xappResourceRenderer->registerRelative('DOJOPACKAGES', $dojoPackagesString);
        /****
         * Build XApp-App-Renderer - Config
         */
        $opt = array
        (
            XApp_App_Renderer::DOC_ROOT_PATH => xapp_get_option(self::APPDIR, $this),
            //complete url to the client app doc root : http://192.168.1.37/joomla352//administrator/components/com_xappcommander/client/
            XApp_App_Renderer::DOC_ROOT => xapp_get_option(self::DOC_ROOT, $this),
            //complete absolute path : /mnt/ssd2/htdocs/joomla352/administrator/components/com_xappcommander//client/
            XApp_App_Renderer::APP_NAME => xapp_get_option(self::APP_NAME, $this),
            //system application name
            XApp_App_Renderer::APP_FOLDER => xapp_get_option(self::APP_FOLDER, $this),
            //path prefix to the client application
            XApp_App_Renderer::CONFIG_NAME => $XAPP_RUN_TIME_CONFIGURATION,
            XApp_App_Renderer::SERVICE_URL => xapp_get_option(self::SERVICE, $this),
            XApp_App_Renderer::RESOURCE_RENDERER => $xappResourceRenderer
        );

        $this->appRenderer = new XApp_App_Renderer($opt);
        $this->resourceRenderer = xo_get(XApp_App_Renderer::RESOURCE_RENDERER, $this->appRenderer);
    }

    /**
     * Xapp_Singleton interface impl.
     *
     * static singleton method to create static instance of driver with optional third parameter
     * xapp options array or object
     *
     * @error 15501
     * @param null|mixed $options expects optional xapp option array or object
     * @return XCF_Bootstrap
     */
    public static function instance($options = null)
    {
        if (self::$_instance === null) {
            self::$_instance = new self($options);
        }
        return self::$_instance;
    }

}
