<?php
/**
 * @version 0.1.0
 * @package XApp-Connect
 *
 * @author https://github.com/mc007
 * @license : GPL v2. http://www.gnu.org/licenses/gpl-2.0.html
 */

class CustomTypesUtils {


    public static $cache=null;
    /***
     * Creates the arguments for the Schema Processor by a give Custom Type and ref id.
     *
     * @param $cType
     * @param $refId
     * @param $options
     * @return stdClass
     */
    public static function toSchemaProcessorArgStructEx($cType,$refId,$options){

        return null;
    }

    /**
     * Appends the CT's queries with the default group select statement and a ref id.
     * @param $cType
     * @param $queries
     * @param $refId
     * @return mixed
     */
    protected static function _completeQueries($cType,$queries,$refId){
        $cTypeGroupSelectStatment = CustomTypesUtils::getCIStringValue($cType,'groupSelectStatement');
        if($cTypeGroupSelectStatment){
            foreach($queries as $q) {
                $q->query = $q->query . ' ' . $cTypeGroupSelectStatment . ' ' . $refId;
            }
        }
        return $queries;
    }

    private  static function _resolveJSONPathQuery($json,$query){
        $result = null;
        $jsonPathObject = JsonStore::asObj($json);
        if($jsonPathObject){
            $x =&JsonStore::get($jsonPathObject,$query);
            if($x!=null){
                $result=$x;
            }else{
                error_log('couldnt find anything with ' . $query);
            }
        }else{
            error_log('$jsonPathObject ==null');
        }
        return $result;
    }
    /***
     * @param $cTypeName
     * @param $refId
     * @param $options
     * @param $query
     * @return null | string
     */
    public static function customTypeQuery($cTypeName,$refId,$options,$query,$subQuery){

        if(CustomTypesUtils::$cache==null){
            CustomTypesUtils::$cache = CacheFactory::createDefaultCache();
        }

        $cacheKey = md5( $cTypeName . $refId . $query . $subQuery).'.subCTypeQuery';
        $cached = CustomTypesUtils::$cache->get_cache($cacheKey);
        if($cached!=null){
            return $cached;
        }

        $result = null;
        $json = CustomTypesUtils::runCType($cTypeName,$refId,$options);
        if($json){
            $jsonPathObject = JsonStore::asObj($json);
            if($jsonPathObject){
                $x =&JsonStore::get($jsonPathObject,$query);
                if($x){
                    if(is_string($x) && $subQuery!=null){
                        $y = CustomTypesUtils::_resolveJSONPathQuery($x,$subQuery);
                        if($y!=null){
                            $x=''.$y;
                        }
                    }
                    $result=$x;

                }
            }
        }

        //store response in cache
        if($result!=null ){
            CustomTypesUtils::$cache->set_cache($cacheKey,$result);
        }
        return $result;
    }
    /***
     * @param $cType
     * @param $refId
     * @param $options
     * @return string
     */
    public static function runCType($cTypeName,$refId,$options){


        $platform   = 'IPHONE_NATIVE';
        $rtConfig   = 'debug';
        $appId      = '';
        $uuid       = '';

        if($options){
            if($options->vars->UUID){
                $uuid=$options->vars->UUID;
            }
            if($options->vars->APPID){
                $appId=$options->vars->APPID;
            }
            if($options->vars->RT_CONFIG){
                $rtConfig=$options->vars->RT_CONFIG;
            }
        }


        /**
         * Pickup the custom type
         */
        $cType = CustomTypesUtils::getType($cTypeName,$uuid,$appId,$platform,$rtConfig);
        if(!$cType){
            return null;
        }

        /***
         * adjust queries
         */
        $cTypeQueries = CustomTypesUtils::getCIStringValue($cType,'queries');
        if($cTypeQueries){
            $cTypeQueries = json_decode($cTypeQueries);
        }

        if($cTypeQueries){
            $cTypeQueries = CustomTypesUtils::_completeQueries($cType,$cTypeQueries,$refId);
        }

        /***
         * prepare schemas
         */
        $cTypeSchemas = CustomTypesUtils::getCIStringValue($cType,'schemas');
        if($cTypeSchemas){
            $cTypeSchemas = json_decode($cTypeSchemas);
        }

        /***
         * Now run the processor
         */
        $IProcessor = new ISchemaProcessor();

        $result = $IProcessor->templatedQuery($cTypeQueries,$cTypeSchemas,$options);

        return $result;
    }


    /**
     * Downloads all custom types as a single array from xapp-studio.com
     * @param $serviceUrl
     * @param string $uuid
     * @param string $appId
     * @param string $platform
     * @param string $rtConfig
     * @return null|string
     */

    public static function checkServiceUrl($serviceUrl){

        if( !(bool)xc_conf(XC_CONF_CHECK_SERVICE_HOST)){
            return true;
        }
        $rDiff =strcmp($serviceUrl,xc_conf(XC_CONF_SERVICE_HOST));
        if($rDiff>2){
            return false;
        }else{

        }
        $host = parse_url($serviceUrl);

        if(!$host){
            return false;
        }
        if($host['host']){
            $host=$host['host'];
        }else{
            return false;
        }
        $ip = gethostbyname($host);
        if(!$ip){
            return false;
        }
        $rDiff =strcmp($serviceUrl,"144.76.12.121");
        if($rDiff!=0){
        }else{
            return false;
        }
        return true;

    }
    /***
     * Receives a JSON formatted copy of system custom types for verification
     * @param $serviceUrl
     *
     * @param string $uuid
     * @param string $appId
     * @param string $platform
     * @param string $rtConfig
     * @return null|string
     */
    public static function getCTypesFromUrl($serviceUrl,$uuid='',$appId='',$platform='IPHONE_NATIVE',$rtConfig='debug'){

        if(!CustomTypesUtils::checkServiceUrl($serviceUrl)){

            return null;
        }
        $url = $serviceUrl . 'client?action=getCustomTypes&uuid=' . $uuid . '&appIdentifier=' . $appId .'&rtConfig='.$rtConfig;
        xapp_hide_errors();
        $content = file_get_contents($url);
        if($content && count($content) >0){
            if(CustomTypesUtils::$cache==null){
                CustomTypesUtils::$cache = CacheFactory::createDefaultCache();
            }
            $cacheKey = md5($platform.$rtConfig).'.ctypes';
            CustomTypesUtils::$cache->set_cache($cacheKey,$content);
            return $content;
        }else{

        }
        return null;
    }

    /**
     * Returns a custom type by name from an array of custom types
     * @param $ctypes
     * @param $name
     * @return null
     */
    public static function getCType($ctypes,$name){
        if(!$ctypes){
            return null;
        }
        foreach($ctypes as $ct) {
            $cTypename = CustomTypesUtils::getCIStringValue($ct,'name');
            if($cTypename && $cTypename===$name){
                return $ct;
            }
        }

        return null;
    }
    /***
     * @param $ctype
     * @param $name
     * @return null
     */
    public static function setCIStringValue($ctype,$name,$value){
        if(!$ctype){
            return null;
        }

        $inputs = null;

        //weird
        if(is_object($ctype) && isset($ctype->inputs)){
            $inputs=$ctype->inputs;
        }else if(is_array($ctype) && is_array($ctype['inputs'])){
            $inputs=$ctype['inputs'];
        }

        //still very weird
        foreach($inputs as $ci) {
            if(is_array($ci)){
                if($ci['name']===$name){
                    $ci['value']=$value;
                }
            }else if(is_object($ci)){
                if($ci->name===$name){
                    $ci->value=$value;
                }
            }
        }
        return null;
    }
    /***
     * @param $ctype
     * @param $name
     * @return null
     */
    public static function getCIStringValue($ctype,$name){
        if(!$ctype){
            return null;
        }

        $inputs = null;

        //weird
        if(is_object($ctype) && isset($ctype->inputs)){
            $inputs=$ctype->inputs;
        }else if(is_array($ctype) && is_array($ctype['inputs'])){
            $inputs=$ctype['inputs'];
        }

        //still very weird
        foreach($inputs as $ci) {
            if(is_array($ci)){
                if($ci['name']===$name){
                    return $ci['value'];
                }
            }else if(is_object($ci)){
                if($ci->name===$name){
                    return $ci->value;
                }
            }
        }
        return null;
    }
    /***
     * Returns a custom type from cache
     * @param $name
     * @param string $uuid
     * @param string $appId
     * @param string $platform
     * @param string $rtConfig
     * @return CustomType
     */
    public static function getTypeFromCache($name,$uuid='',$appId='',$platform='IPHONE_NATIVE',$rtConfig='debug'){

        if(CustomTypesUtils::$cache==null){
            CustomTypesUtils::$cache = CacheFactory::createDefaultCache();
        }
        $cacheKey = md5($platform.$rtConfig).'.ctypes';
        $ctypeContent = CustomTypesUtils::$cache->get_cache($cacheKey);
        if($ctypeContent){
            $ctype = CustomTypesUtils::getCType(json_decode($ctypeContent),$name);
            if($ctype){
                return $ctype;
            }else{
            }
        }
        return null;
    }

    /***
     * Main search function to get a custom type
     * @param $name
     * @param string $uuid
     * @param string $appId
     * @param string $platform
     * @param string $rtConfig
     * @return CustomType|mixed|null
     */
    public static function getType($name,$uuid='',$appId='',$platform='IPHONE_NATIVE',$rtConfig='debug'){

        $cTypeCached = CustomTypesUtils::getTypeFromCache($name,$uuid,$appId,$platform,$rtConfig);
        if($cTypeCached){
            if($cTypeCached!=null){
                return $cTypeCached;
            }
        }

        $filePath = XAPP_CTYPES . $platform . DS. $rtConfig . DS . $name .'.json';
        if(file_exists($filePath)){
            $ctype = json_decode(file_get_contents($filePath), true);
            if($ctype){
                return $ctype;
            }
        }else{
            //bad!
        }
        return null;
    }
}