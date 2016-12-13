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
xapp_import('xapp.xcf.Base.Manager');
xapp_import('xapp.Xapp.Hook');
/**
 * Class XCF_DeviceManager
 */
class XCF_DeviceManager extends XCF_Manager
{

    /////////////////////////////////////////////////////////////////////////////////////////
    //
    //  Hook/Event Keys
    //
    ////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////////////////////
    //
    //  Options
    //
    ////////////////////////////////////////////////////////////////////////////////////////

    /**
     *  Name of the class for persistence, JSON only at the moment.
     */
    const STORE_CLASS                   = "XAPP_DEVICE_STORE_CLASS";

    /**
     *  Match pattern to detect driver meta files
     */
    const DEVICE_META_MATCH_PATTERN     = "XAPP_DEVICE_DEVICE_META_MATCH_PATTERN";

    /**
     *  Options for the store class
     */
    const STORE_CONF                    = "XAPP_DEVICE_STORE_CONF";

    /**
     *  User data, will skip creation of the store class as we have the data already
     */
    const STORE_DATA                    = "XAPP_DEVICE_STORE_DATA";


    /**
     * options dictionary for this class containing all data type values
     *
     * @var array
     */
    public static $optionsDict = array
    (
        self::STORE_CLASS               => XAPP_TYPE_STRING,
        self::STORE_CONF                => XAPP_TYPE_ARRAY,
        self::STORE_DATA                => XAPP_TYPE_OBJECT,
        self::DEVICE_META_MATCH_PATTERN =>XAPP_TYPE_STRING
    );

    /**
     * options mandatory map for this class contains all mandatory values
     *
     * @var array
     */
    public static $optionsRule = array
    (
        self::STORE_CLASS               => 0,
        self::STORE_CONF                => 0,
        self::STORE_DATA                => 0,
        self::DEVICE_META_MATCH_PATTERN => 1,

    );
    /**
     * options default value array containing all class option default values
     *
     * @var array
     */
    public $options = array
    (
        self::STORE_CLASS               => 'XApp_Store_JSON',
        self::STORE_CONF                => null,
        self::STORE_DATA                => null,
        self::DEVICE_META_MATCH_PATTERN => '/\.meta.json$/U'
    );


    /***
     * @var stdClass | XApp_Store_JSON
     */
    protected $_store = null;

    /***
     * @var XApp_VFS_Local
     */
    protected $_vfs = null;

    /***
     * @var XApp_VFS_Local
     */
    protected $_currentNodes = null;



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
     * ls impl. branch/directory scanning, it uses a local VFS instance to enumerate safely
     * @param null $scope
     * @param $refId
     * @param bool $tree
     * @return array
     */

    /**
     * @param null $scope
     * @return array
     */
    public function ls($scope=null){

        xapp_import('xapp.Directory.Utils');
        xapp_import('xapp.VFS.Local');
        xapp_import('xapp.xide.Utils.FileTree');

        $scope = $this->getScope($scope);
        $root = $scope->resolveAbsolute('__ROOT__');

        if(!is_dir($root)){
            return self::toRPCErrorStd($code = 1, 'scope doesnt exists : ');
        }

        //listen to VFS, we need to complete the node meta data
        Xapp_Hook::connect(XApp_VFS_Base::EVENT_ON_NODE_ADDED,$this,"_onItemAdded",'',array('scope'=>$scope));

        $treeGen = new XIDE_FileTree(array(
            XIDE_FileTree::FILE_MATCH_PATTERN        =>  xo_get(self::DEVICE_META_MATCH_PATTERN,$this),
            XIDE_FileTree::FILE_NAME_CLEAN_PATTERN   =>  xo_get(self::DEVICE_META_MATCH_PATTERN,$this)
        ));

        $res = $treeGen->ls($root);
        Xapp_Hook::disconnect(XApp_VFS_Base::EVENT_ON_NODE_ADDED,$this,"_onItemAdded");
        return $res;

    }
	/**
	 * @param $scope
	 * @param $name
	 * @return array
	 * @throws ErrorException
	 */
    public function removeItem($scope,$name){
        xapp_import('xapp.Directory.Utils');
        xapp_import('xapp.Path.Utils');
        xapp_import('xapp.VFS.Local');
        xapp_import('xapp.Commons.Exceptions');
        xapp_import('xapp.xide.Utils.CIUtils');
        $fullPath = $this->resolvePath($scope,$name,'__ROOT__',true,false);
        $errors=array();
        $success=array();
        XApp_File_Utils::deleteFile(XApp_Path_Utils::normalizePath($fullPath,true,false),null,$errors,$success);
        return $errors;

    }

	/**
	 * @param $options
	 * @return bool|null|string
	 * @throws Xapp_Util_Exception_Storage
	 */
    public function createItem($options){

        xapp_import('xapp.Directory.Utils');
        xapp_import('xapp.Path.Utils');
        xapp_import('xapp.VFS.Local');
        xapp_import('xapp.Commons.Exceptions');
        xapp_import('xapp.xide.Utils.CIUtils');

        $cisIn = XApp_CIUtils::fromArray($options);

        $scope = XApp_CIUtils::getValue(XApp_CIUtils::getByName($cisIn,'Scope'));
        $title = XApp_CIUtils::getValue(XApp_CIUtils::getByName($cisIn,'Title'));
        $group = XApp_CIUtils::getValue(XApp_CIUtils::getByName($cisIn,'In Group'));
	    $enabled = XApp_CIUtils::getValue(XApp_CIUtils::getByName($cisIn,'Enabled'));


        $cisOut=array();

        $cisOut[]=XApp_CIUtils::getByName($cisIn,'Title');
        $cisOut[]=XApp_CIUtils::getByName($cisIn,'Host');
	    $cisOut[]=XApp_CIUtils::getByName($cisIn,'Enabled');
        $cisOut[]=XApp_CIUtils::getByName($cisIn,'Driver');
        $cisOut[]=XApp_CIUtils::getByName($cisIn,'Protocol');
        $cisOut[]=XApp_CIUtils::getByName($cisIn,'Port');
        $cisOut[]=XApp_CIUtils::getByName($cisIn,'Id');
        $cisOut[]=XApp_CIUtils::getByName($cisIn,'Options');
        $cisOut[]=XApp_CIUtils::getByName($cisIn,'DriverOptions');
        $cisOut[]=XApp_CIUtils::getByName($cisIn,'Logging Flags');

        $content = json_encode(array('inputs'=>$cisOut));
        $path = $group. DIRECTORY_SEPARATOR.$title.'.meta.json';

	    $_scope = $this->getScope($scope);
	    if($_scope==null){
		    return 'No Such scope ' . $scope;
	    }
        $this->setContent($scope,$path,$content);
	    return $cisOut;
    }
	/**
	 * VFS callback when a node finally arrived. In case its a driver meta data file,
	 * we extend the nodes properties
	 * @param $evt
	 * @return null
	 */
    public function  _onItemAdded($evt){
        if( is_array($evt)     &&
            array_key_exists('item',$evt))
        {
            $item =$evt['item'];
            $userData = isset($evt['userData']) ? $evt['userData'] : null;
            $scope = $userData!=null ? isset($userData['scope']) ? $userData['scope'] : null : null;

            //1. Complete device meta nodes
            if(
                !$item->{XAPP_NODE_FIELD_IS_DIRECTORY} //must be file
                && property_exists($item,XAPP_NODE_FIELD_PATH)
                && preg_match(xo_get(self::DEVICE_META_MATCH_PATTERN,$this),$item->{XAPP_NODE_FIELD_PATH})
                && $scope
            ){

                //read the actual meta file
                $root = $scope->resolveAbsolute('__ROOT__') .  DIRECTORY_SEPARATOR;
                $fullPath = $root . $item->{XAPP_NODE_FIELD_PATH};
	            $metaContent = XApp_Utils_JSONUtils::read_json( $fullPath ,'json',false,true);
                if($metaContent){

                    //set id
                    $id = xapp_object_find($metaContent['inputs'],'.',array('name=Id'));
                    if(count($id)>0 && is_object($id[0])){
                        $item->{'id'}=$id[0]->value;
                    }

                    $driverOptions=XApp_CIUtils::getBy2($metaContent['inputs'],'name','DriverOptions');
                    if(!$driverOptions){
                        $driverOptions = XApp_CIUtils::newDefaultCI();
                        $driverOptions->type = 5;
                        $driverOptions->name = 'DriverOptions';
                        $driverOptions->title = 'Driver Options';
                        $driverOptions->id = 'DriverOptions';
                        $driverOptions->value = 0;

                        $inputs = &$metaContent['inputs'];
                        $inputs[]= $driverOptions;

                        if(is_object($metaContent)) {
                            $metaContent->inputs = $inputs;
                        }else{
                            $metaContent['inputs'] = $inputs;
                        }

                        XApp_Utils_JSONUtils::write_json($fullPath, $metaContent,'json',true);

                    }

                    $driverOptions=XApp_CIUtils::getBy2($metaContent['inputs'],'name','Logging Flags');
                    if(!$driverOptions){
                        $driverOptions = XApp_CIUtils::newDefaultCI();
                        $driverOptions->type = "Logging Flags";
                        $driverOptions->name = 'Logging Flags';
                        $driverOptions->title = 'Logging Flags';
                        $driverOptions->id = 'Logging Flags';

                        $driverOptions->value = "{}";
                        $driverOptions->group = 'Logging';

                        $inputs = &$metaContent['inputs'];
                        $inputs[]= $driverOptions;

                        if(is_object($metaContent)) {
                            $metaContent->inputs = $inputs;
                        }else{
                            $metaContent['inputs'] = $inputs;
                        }
                        XApp_Utils_JSONUtils::write_json($fullPath, $metaContent,'json',true);
                    }

                    $item->{XAPP_NODE_FIELD_USER}=$metaContent;//append node

                }

	            $parent = explode(DIRECTORY_SEPARATOR,dirname($fullPath));
	            $parent = $parent[count($parent)-1];
	            $item->{XAPP_NODE_FIELD_PARENT_ID}=$parent;
            }

            /***
             * Complete whatever node with our scope tag
             */
            if($userData!==null && isset($userData['scope'])){
                $item->scope = xo_get(XIDE_Scope::SCOPE_NAME,$userData['scope']);
            }

            return $item;
        }
        return null;
    }
}
