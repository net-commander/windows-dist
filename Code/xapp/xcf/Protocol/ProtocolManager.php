<?php
/**
 * @version 0.1.0
 * @author Guenter Baumgart
 * @package xcf\xide\Controller
 */
xapp_import("xapp.Commons.Entity");
xapp_import('xapp.Utils.Strings');
xapp_import('xapp.xcf.Base.Manager');

/**
 * Class XCF_ProtocolManager
 */
class XCF_ProtocolManager extends XCF_Manager
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
     *  Match pattern to detect prtocol meta files
     */
    const PROTOCOL_META_MATCH_PATTERN     = "XCF_PROTOCOL_META_MATCH_PATTERN";

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
        self::STORE_CLASS                   => XAPP_TYPE_STRING,
        self::STORE_CONF                    => XAPP_TYPE_ARRAY,
        self::STORE_DATA                    => XAPP_TYPE_OBJECT,
        self::PROTOCOL_META_MATCH_PATTERN   =>XAPP_TYPE_STRING
    );

    /**
     * options mandatory map for this class contains all mandatory values
     *
     * @var array
     */
    public static $optionsRule = array
    (
        self::STORE_CLASS                   => 0,
        self::STORE_CONF                    => 0,
        self::STORE_DATA                    => 0,
        self::PROTOCOL_META_MATCH_PATTERN   => 1

    );
    /**
     * options default value array containing all class option default values
     *
     * @var array
     */
    public $options = array
    (
        self::STORE_CLASS                   => 'XApp_Store_JSON',
        self::STORE_CONF                    => null,
        self::STORE_DATA                    => null,
        self::PROTOCOL_META_MATCH_PATTERN => '/\.meta.json$/U'
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
    public function ls($scope=null){

        xapp_import('xapp.Directory.Utils');
        xapp_import('xapp.VFS.Local');
        xapp_import('xapp.xide.Utils.FileTree');


        $scope = $this->getScope($scope);
        if(!$scope){
            xapp_clog('invalid scope ');
        }

        $root = $scope->resolveAbsolute('__ROOT__');

        //xapp_cdump($this);

        //listen to VFS, we need to complete the node meta data
        Xapp_Hook::connect(XApp_VFS_Base::EVENT_ON_NODE_ADDED,$this,"_onItemAdded",'',array('scope'=>$scope));
        $treeGen = new XIDE_FileTree(array(
            XIDE_FileTree::FILE_MATCH_PATTERN        =>  xo_get(self::PROTOCOL_META_MATCH_PATTERN,$this),
            XIDE_FileTree::FILE_NAME_CLEAN_PATTERN   =>  xo_get(self::PROTOCOL_META_MATCH_PATTERN,$this)
        ));

        $tree    = $treeGen->ls($root);
        return $tree;

    }

    /***
     * @param $scope
     * @param $path
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

	public function createItem($scope,$path,$title,$meta,$driverCode){
		$this->setContent($scope,$path . DIRECTORY_SEPARATOR . $title .'.meta.json', $meta);
		$this->setContent($scope,$path . DIRECTORY_SEPARATOR . $title .'.js', $driverCode);
		return "";
	}

    /***
     * @param $scope
     * @param $path
     */
    public function __createItem($options){

	    /*
        xapp_import('xapp.Directory.Utils');
        xapp_import('xapp.Path.Utils');
        xapp_import('xapp.VFS.Local');
        xapp_import('xapp.Commons.Exceptions');
        xapp_import('xapp.xide.Utils.CIUtils');



        $cisIn = XApp_CIUtils::fromArray($options);
        $scope = XApp_CIUtils::getValue(XApp_CIUtils::getByName($cisIn,'Scope'));
        $title = XApp_CIUtils::getValue(XApp_CIUtils::getByName($cisIn,'Title'));
        $group = XApp_CIUtils::getValue(XApp_CIUtils::getByName($cisIn,'In Group'));

        $cisOut=array();

        $cisOut[]=XApp_CIUtils::getByName($cisIn,'Title');
        $cisOut[]=XApp_CIUtils::getByName($cisIn,'Host');
        $cisOut[]=XApp_CIUtils::getByName($cisIn,'Driver');
        $cisOut[]=XApp_CIUtils::getByName($cisIn,'Protocol');
        $cisOut[]=XApp_CIUtils::getByName($cisIn,'Port');
        $cisOut[]=XApp_CIUtils::getByName($cisIn,'Id');

        $content = json_encode(array('inputs'=>$cisOut));
        $path = $group. DIRECTORY_SEPARATOR.$title.'.meta.json';
        $result = $this->setContent($scope,$path,$content);
        return $result;*/
    }

    /**
     * VFS callback when a node finally arrived. In case its a driver meta data file,
     * we extend the nodes properties
     * @param $evt
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
                && preg_match(xo_get(self::PROTOCOL_META_MATCH_PATTERN,$this),$item->{XAPP_NODE_FIELD_PATH})
                && $scope
            ){

                //read the actual meta file
                $root = $scope->resolveAbsolute('__ROOT__') .  DIRECTORY_SEPARATOR;
                $fullPath = $root . $item->{XAPP_NODE_FIELD_PATH};
                $metaContent = XApp_Utils_JSONUtils::read_json( $fullPath ,'json',false,true);
                if($metaContent){
                    $item->{XAPP_NODE_FIELD_USER}=$metaContent;//append node
                }
	            $parent = explode(DIRECTORY_SEPARATOR,dirname($fullPath));
	            $parent = $parent[count($parent)-1];
	            $item->{XAPP_NODE_FIELD_PARENT_ID}=$parent;
                $item->{'virtual'}=false;
            }else{
                $item->{'virtual'}=false;
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