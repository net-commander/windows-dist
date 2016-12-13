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
xapp_import('xapp.xcf.Base.Manager');
xapp_import('xapp.Xapp.Hook');
/***
 * Class XCF_DriverManager
 */
class XCF_DriverManager extends XCF_Manager{

    /*******************************
     * Options
    ********************************/

    /**
     *  Name of the class for persistence, JSON only at the moment.
     */
    const STORE_CLASS                   = "XAPP_DRIVER_STORE_CLASS";

    /**
     *  Match pattern to detect driver meta files
     */
    const DRIVER_META_MATCH_PATTERN     = "XAPP_DRIVER_DRIVER_META_MATCH_PATTERN";

    /**
     *  Options for the store class
     */
    const STORE_CONF                    = "XAPP_DRIVER_STORE_CONF";

    /**
     *  User data, will skip creation of the store class as we have the data already
     */
    const STORE_DATA                    = "XAPP_DRIVER_STORE_DATA";


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
        self::DRIVER_META_MATCH_PATTERN =>XAPP_TYPE_STRING
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
        self::DRIVER_META_MATCH_PATTERN => 1,

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
        self::DRIVER_META_MATCH_PATTERN => '/\.meta.json$/U'
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
     * @return array
     */
    public function ls($scope=null){

        xapp_import('xapp.Directory.Utils');
        xapp_import('xapp.VFS.Local');
        xapp_import('xapp.xide.Utils.FileTree');

        $_scope = $this->getScope($scope);

        $root = $_scope->resolveAbsolute('__ROOT__');
        if(!is_dir($root)){
            return self::toRPCErrorStd($code = 1, 'scope doesnt exists : ' . $scope);
        }
	    //listen to VFS, we need to complete the node meta data
        Xapp_Hook::connect(XApp_VFS_Base::EVENT_ON_NODE_ADDED,$this,"_onItemAdded",'',array('scope'=>$_scope));

        $treeGen = new XIDE_FileTree(array(
            XIDE_FileTree::FILE_MATCH_PATTERN        =>  xo_get(self::DRIVER_META_MATCH_PATTERN,$this),
            XIDE_FileTree::FILE_NAME_CLEAN_PATTERN   =>  xo_get(self::DRIVER_META_MATCH_PATTERN,$this)
        ));

        $tree = $treeGen->ls($root);
        Xapp_Hook::disconnect(XApp_VFS_Base::EVENT_ON_NODE_ADDED,$this,"_onItemAdded");
	    return $tree;

    }
    /**
     * VFS callback when a node finally arrived. In case its a driver meta data file,
     * we extend the nodes properties
     * @param $evt
     */
    public function  _onItemAdded($evt){

	    if( is_array($evt) & array_key_exists('item',$evt))
        {
            $item =$evt['item'];
            $userData = isset($evt['userData']) ? $evt['userData'] : null;
            $scope = $userData!=null ? isset($userData['scope']) ? $userData['scope'] : null : null;

	        //Complete driver meta nodes
            if(
                !$item->{XAPP_NODE_FIELD_IS_DIRECTORY} //must be file
                && property_exists($item,XAPP_NODE_FIELD_PATH)
                && preg_match(xo_get(self::DRIVER_META_MATCH_PATTERN,$this),$item->{XAPP_NODE_FIELD_PATH})
                && $scope
            ){

                //1. read the actual file
                $root = $scope->resolveAbsolute('__ROOT__') .  DIRECTORY_SEPARATOR;
                $fullPath = realpath($root . $item->{XAPP_NODE_FIELD_PATH});

	            $bloxPath = str_replace('.meta.json','.xblox',$fullPath);

	            if(!file_exists($bloxPath)) {
		            XApp_File_Utils::createEmptyFile($bloxPath);
	            }

	            if(file_exists($bloxPath)) {
		            $bloxContent = XApp_Utils_JSONUtils::read_json( $bloxPath, 'json', false, true);
		            $item->{XAPP_NODE_FIELD_BLOX} = $bloxContent;
	            }


                $metaContent = XApp_Utils_JSONUtils::read_json( $fullPath ,'json',false,true);
                //2. put it in the user field
                if($metaContent){

                    $item->{XAPP_NODE_FIELD_USER}=$metaContent;
                    $id = xapp_object_find($metaContent['inputs'],'.',array('name=CF_DRIVER_ID'));
                    if(count($id)>0 && is_object($id[0])){
                        $item->{'id'}=$id[0]->value;
                    }
                }

	            $parent = explode(DIRECTORY_SEPARATOR,dirname($fullPath));
	            $parent = $parent[count($parent)-1];
	            $item->{XAPP_NODE_FIELD_PARENT_ID}=$parent;

            }elseif($item->{XAPP_NODE_FIELD_IS_DIRECTORY} === true){
                $item->{"beanType"}="DRIVER_GROUP";
            }
            /***
             * Complete whatever node with our scope tag
             */
            if($userData!==null && isset($userData['scope'])){
                $item->scope = xo_get(XIDE_Scope::SCOPE_NAME,$userData['scope']);
            }

            unset($item->type);
            return $item;
        }
    }


    /**
     * @param $scopeName
     * @param String $path
     * @param $content
     * @return bool|null
     * @throws ErrorException
     * @throws Xapp_Util_Exception_Storage
     */
    public function setContent($scopeName,$path,$content){
        xapp_import('xapp.Directory.Utils');
        xapp_import('xapp.Path.Utils');
        xapp_import('xapp.VFS.Local');
        xapp_import('xapp.Commons.Exceptions');
        $scope = $this->getScope($scopeName);
        $return =null;
        $fullPath = XApp_Path_Utils::normalizePath($this->resolvePath($scopeName,DIRECTORY_SEPARATOR . $path,null,true,false),true,false);
        if(!file_exists($fullPath)){
            XApp_File_Utils::createEmptyFile($fullPath);
        }
        if(file_exists($fullPath)){

            if(!is_writeable($fullPath))
            {
                throw new Xapp_Util_Exception_Storage(vsprintf('File: %s is not writable', array(basename($fullPath))), 1640102);
            }else{

                //write out
                $fp=fopen($fullPath,"w");
                fputs ($fp,$content);
                fclose($fp);
                clearstatcache(true, $fullPath);
                $return=true;
            }

        }else{
            throw new Xapp_Util_Exception_Storage('unable to write storage to file  :  ' . $path . ' at : ' . $fullPath, 1640104);
        }

        return $return;
    }

    /**
     * @param $scope
     * @param $path
     * @param $name
     * @return array
     * @throws ErrorException
     */
    public function removeItem($scope,$path,$name){

        xapp_import('xapp.Directory.Utils');
        xapp_import('xapp.Path.Utils');
        xapp_import('xapp.VFS.Local');
        xapp_import('xapp.Commons.Exceptions');
        xapp_import('xapp.xide.Utils.CIUtils');

        $fullPath = $this->resolvePath($scope,$path,'__ROOT__',true,false);
        $errors=array();
        $success=array();

        if(file_exists($fullPath)){
            XApp_File_Utils::deleteFile(XApp_Path_Utils::normalizePath($fullPath,true,false),null,$errors,$success);
            $fullPathMeta=str_replace('.meta.json','.js',$fullPath);
            XApp_File_Utils::deleteFile(XApp_Path_Utils::normalizePath($fullPathMeta,true,false),null,$errors,$success);

	        $fullPathBlox=str_replace('.meta.json','.xblox',$fullPath);
	        XApp_File_Utils::deleteFile(XApp_Path_Utils::normalizePath($fullPathBlox,true,false),null,$errors,$success);
        }else{
            xapp_clog('file doesn`t exists : ' . $fullPath);
        }

        return $errors;

    }
    /**
     * @param $scope
     * @param $path
     * @param $title
     * @param $meta
     * @param $driverCode
     * @return string
     * @throws Xapp_Util_Exception_Storage
     */
    public function createItem($scope,$path,$title,$meta,$driverCode){
        $this->setContent($scope,$path . DIRECTORY_SEPARATOR . $title .'.meta.json', $meta);
        $this->setContent($scope,$path . DIRECTORY_SEPARATOR . $title .'.js', $driverCode);
	    $this->setContent($scope,$path . DIRECTORY_SEPARATOR . $title .'.xblox', "{}");
        return "";
    }
}