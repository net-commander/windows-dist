<?php
/**
 * @version 0.1.0
 *
 * @author https://github.com/mc007
 * @license : GPL v2. http://www.gnu.org/licenses/gpl-2.0.html
 */

class XApp_Joomla_Resource_Renderer extends  XApp_Resource_Renderer
{
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
        xapp_set_options($options, $this);
    }

    /***
     * Register default resource variables
     */
    public function registerDefault(){
        parent::registerDefault();
    }

    /***
     *  Add CSS includes
     */
    public function renderCSS(){

        $renderDelegate = xapp_get_option(self::RENDER_DELEGATE,$this);

        if($renderDelegate!==null){
            $cssItems = $this->getResourcesByType(XAPP_RESOURCE_TYPE_CSS,true);
            if($cssItems!=null && count($cssItems)){

                foreach($cssItems as $resourceItem){

                    if($resourceItem==null || !is_object($resourceItem)){
	                    error_log('have no s');
                        continue;
                    }
                    if(!xapp_property_exists($resourceItem,XAPP_RESOURCE_URL_RESOLVED)){
                        $resourceItem = $this->resolveResource($resourceItem);
                    }
                    if(xapp_property_exists($resourceItem,XAPP_RESOURCE_URL_RESOLVED)){

                        $sheetUrl = xapp_property_get($resourceItem,XAPP_RESOURCE_URL_RESOLVED);
                        if(!in_array($sheetUrl,$this->_cssQueue)){
                            $renderDelegate->addStyleSheet($sheetUrl);
                            $this->_cssQueue[]=$sheetUrl;
                        }
                    }else{
	                    error_log('not resolved r');
                    }
                }
            }
        }else{
	        error_log('have no sr');
        }
    }

    /***
     *
     */
    public function renderJavascriptHeaderTags(){
        $renderDelegate = xapp_get_option(self::RENDER_DELEGATE,$this);
        if($renderDelegate!==null){
            $cssItems = $this->getResourcesByType(XAPP_RESOURCE_TYPE_JS_HEADER_SCRIPT_TAG,true);
            if($cssItems!=null && count($cssItems)){

                foreach($cssItems as $resourceItem){
                    if(!is_object($resourceItem)){
                        continue;
                    }
                    if(!xapp_property_exists($resourceItem,XAPP_RESOURCE_URL_RESOLVED)){
                        $resourceItem = $this->resolveResource($resourceItem);
                    }

                    if(xapp_property_exists($resourceItem,XAPP_RESOURCE_PATH_ABSOLUTE)){
                        $path = xapp_property_get($resourceItem,XAPP_RESOURCE_PATH_ABSOLUTE);
                        if(file_exists($path)){
                            $content = file_get_contents($path);
                            if(($content !== false)){
                                $content = $this->resolveRelative($content);
                                $renderDelegate->addScriptDeclaration($content);
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * @return mixed|null
     */
    public function getJavascriptPlugins(){
        $plugins = array();
        $items = $this->getResourcesByType(XAPP_RESOURCE_TYPE_JS_PLUGIN,true);
        if($items!=null && count($items)){
            foreach($items as $resourceItem){
                $plugins[]=$resourceItem;
            }
        }else{
            return null;
        }
        $plugins = json_encode($plugins);
        $plugins = $this->resolveRelative($plugins);//replace user variables
        return json_decode($plugins);

    }
    /***
     *
     */
    public function addJSIncludes(){
        $renderDelegate = xapp_get_option(self::RENDER_DELEGATE,$this);
        if($renderDelegate!==null){
            $cssItems = $this->getResourcesByType(XAPP_RESOURCE_TYPE_JS_INCLUDE,true);
            if($cssItems!=null && count($cssItems)){

                foreach($cssItems as $resourceItem){

                    if(!is_object($resourceItem)){
                        continue;
                    }
                    if(!xapp_property_exists($resourceItem,XAPP_RESOURCE_URL_RESOLVED)){
                        $resourceItem = $this->resolveResource($resourceItem);
                    }
                    if(xapp_property_exists($resourceItem,XAPP_RESOURCE_URL_RESOLVED)){
                        $jsUrl = xapp_property_get($resourceItem,XAPP_RESOURCE_URL_RESOLVED);
                        if(!in_array($jsUrl,$this->_cssQueue)){
                            $renderDelegate->addScript($jsUrl);
                            $this->_jsQueue[]=$jsUrl;
                        }
                    }
                }
            }
        }
    }

}
