<?php
/**
 * @version 0.1.0
 * @link http://www.xapp-studio.com
 * @author XApp-Studio.com support@xapp-studio.com
 * @license : GPL v2. http://www.gnu.org/licenses/gpl-2.0.html
 * @package XApp\xcf\Device
 */
xapp_import('xapp.xcf.Service.Service');
/**
 * Class XCF_Protocol_Service exposes the XCF_Protocol_Manager
 */
class XCF_Protocol_Service extends XCF_Service implements Xapp_Singleton_Interface
{
    /**
     * contains the singleton instance for this class
     *
     * @var null|XCF_Protocol_Service
     */
    protected static $_instance = null;
    /**
     * Xapp_Singleton interface impl.
     *
     * static singleton method to create static instance of driver with optional third parameter
     * xapp options array or object
     *
     * @error 15501
     * @param null|mixed $options expects optional xapp option array or object
     * @return XCF_Protocol_Service
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
     * @param null $scope
     * @param $refId
     * @param bool $tree
     * @link : xapp/xcf/index.php?debug=true&view=smdCall&service=XCF_Protocol_Service.ls&callback=asd&scope=system
     * @return mixed
     */
    public function ls($scope=null){
        return $this->getObject()->ls($scope);
    }
    /***
     * @param $scope
     * @param $path
     * @return array
     */
    public function getProtocolContent($scope,$path){
        $content = $this->getObject()->getContent($scope,$path);
        if($content){
            return $content;
        }else{
            return $this->toRPCError(1,'Error Reading File');
        }
    }

    /**
     * @param $scope
     * @param $path
     * @param $content
     * @return mixed
     * @throws Xapp_Util_Exception_Storage
     */
    public function setProtocolContent($scope,$path,$content){
        $result = $this->getObject()->setContent($scope,$path,$content);
        if($result){
            return $result;
        }
        return $this->toRPCError(1,'unable to save to storage');
    }
    /***
     * @param string $scopeName
     * @param string $driverPathRelative
     * @param string $dataPath
     * @param $query
     * @param $value
     * @return mixed
     */
    public function updateItemMetaData($scopeName='system',
                                         $driverPathRelative='Denon/Denon Base.meta.json',
                                         $dataPath='/inputs',
                                         $query,
                                         $value)
    {
        return $this->getObject()->updateMetaData($scopeName,$driverPathRelative,$dataPath,$query,$value);
    }

    /**
     * @param string $scopeName
     * @param $name
     * @return mixed
     */
    public function createGroup($scopeName='system_protocols',$name)
    {
        $res = $this->getObject()->createGroup($scopeName,$name);
        if($res!==true){
            return $this->toRPCError(1,$res);
        }
        return $res;
    }
    /**
     * @param array $options
     * @return array
     */
	/*
    public function createItem($options=array())
    {
        $res = $this->getObject()->createItem(json_decode($options,true));
        if($res!==true){
            return $this->toRPCError(1,$res);
        }
        return $res;
    }
	*/


	public function createItem($scope,$path,$title,$meta,$driverCode){
		return $this->getObject()->createItem($scope,$path,$title,$meta,$driverCode);
	}

    /**
     * @param array $options
     * @return array
     */
    public function removeItem($scope,$name)
    {
        $res = $this->getObject()->removeItem($scope,$name);
        if($res!==true){
            return $this->toRPCError(1,$res);
        }
        return $res;
    }
    /**
     * @param string $scopeName
     * @param $name
     * @return mixed
     */
    public function removeGroup($scopeName='system',$name)
    {
        $res = $this->getObject()->removeGroup($scopeName,$name);
        if(count($res)){
            return $this->toRPCError(1,$res);
        }
        return $res;
    }
}