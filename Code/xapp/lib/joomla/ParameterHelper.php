<?php
/**
 * @version 0.1.0
 *
 * @author https://github.com/mc007
 * @license : GPL v2. http://www.gnu.org/licenses/gpl-2.0.html
 */

/***
 * joomla param sh*
 * Class XApp_Joomla_Parameter_Helper
 */
class XApp_Joomla_Parameter_Helper
{
    public static  function getActiveMenuItemParameters(){
        jimport( 'joomla.html.parameter' );
        $app		= JFactory::getApplication();
        $active	= $app->getMenu()->getActive();
        if($active){
            return $active->params;
        }
        return null;
    }
    public static  function getComponentParameters($component='com_xappcommander'){

        jimport('joomla.application.component.helper');
        $params = JComponentHelper::getParams($component);
        if($params){
            return $params;
        }
        return null;
    }
    public static function isOptionEnabled($searchArray,$option){

        foreach($searchArray as $key =>$value){
            if($value===$option){
                return true;
            }
        }
        return false;
    }
    public static function parsePanelOptions($prefix='FILE_PANEL_OPTIONS_',$name,$jParams,&$result){

        $result[$prefix.$name]=array();
        $result[$prefix.$name]['LAYOUT']=2;
        $result[$prefix.$name]['AUTO_OPEN']=true;
        if($jParams->get($prefix.'LAYOUT_'.$name)!==null){
            $result[$prefix.$name]['LAYOUT']=$jParams->get($prefix.'LAYOUT_'.$name);
        }

        if($jParams->get($prefix.'AUTO_OPEN_'.$name)!=null){
            $result[$prefix.$name]['AUTO_OPEN']=$jParams->get($prefix.'AUTO_OPEN_'.$name);
        }


    }

    /**
     * @param $jParams
     * @param $key
     * @param $result
     */
    public static function toGatewayOption($jParams,$key,&$result){
        if($jParams->get($key)!==null){
            $list = explode(',',$jParams->get($key));
            if($list &&  is_array($list) && count($list)){
                $result[$key]=$list;
            }
        }else{
            $result[$key]=null;
        }
    }
    public static  function toXFileConfig($jParams,$XAPP_ACL_SETTINGS_PREFIX='xcom.',$XAPP_COMPONENT_NAME='com_xappcommander'){

        if($jParams){
            $result = array();

            $defaultPanelOption = true;
            $result['LAYOUT_PRESET']=1;
            $result['PANEL_OPTIONS']['ALLOW_NEW_TABS']=$defaultPanelOption;
            $result['PANEL_OPTIONS']['ALLOW_MULTI_TAB']=false;//dosnt work
            $result['PANEL_OPTIONS']['ALLOW_INFO_VIEW']=$defaultPanelOption;
            $result['PANEL_OPTIONS']['ALLOW_LOG_VIEW']=$defaultPanelOption;
            $result['PANEL_OPTIONS']['ALLOW_BREADCRUMBS']=$defaultPanelOption;
            $result['PANEL_OPTIONS']['ALLOW_CONTEXT_MENU']=$defaultPanelOption;
            $result['PANEL_OPTIONS']['ALLOW_LAYOUT_SELECTOR']=$defaultPanelOption;
            $result['PANEL_OPTIONS']['ALLOW_SOURCE_SELECTOR']=$defaultPanelOption;

	        $result['PANEL_OPTIONS']['ALLOW_COLUMN_RESIZE']=$defaultPanelOption;
	        $result['PANEL_OPTIONS']['ALLOW_COLUMN_REORDER']=$defaultPanelOption;
	        $result['PANEL_OPTIONS']['ALLOW_COLUMN_HIDE']=$defaultPanelOption;
	        $result['PANEL_OPTIONS']['ALLOW_MAIN_MENU']=$defaultPanelOption;
	        $result['PANEL_OPTIONS']['ALLOW_ACTION_TOOLBAR']=$defaultPanelOption;



            if($jParams->get('LAYOUT_PRESET')!==null){
                $result['LAYOUT_PRESET']=$jParams->get('LAYOUT_PRESET');
            }
            if($jParams->get('PANEL_OPTIONS')!==null){
                $options = $jParams->get('PANEL_OPTIONS');
                foreach($result['PANEL_OPTIONS'] as $key =>$value){
                    $result['PANEL_OPTIONS'][$key] = self::isOptionEnabled($options,$key);
                }
            }

            /***
             * @TODO : Joomla bug, acl settings key doesnt allow underscores
             */

	        if(!XAppJoomlaAuth::authorize($XAPP_ACL_SETTINGS_PREFIX.'contextMenu',$XAPP_COMPONENT_NAME)){
                $result['PANEL_OPTIONS']['ALLOW_CONTEXT_MENU']=false;
            }
	        if(!XAppJoomlaAuth::authorize($XAPP_ACL_SETTINGS_PREFIX.'sourceSelector',$XAPP_COMPONENT_NAME)){
                $result['PANEL_OPTIONS']['ALLOW_SOURCE_SELECTOR']=false;
            }
            if(!XAppJoomlaAuth::authorize($XAPP_ACL_SETTINGS_PREFIX.'layoutSelector',$XAPP_COMPONENT_NAME)){
                $result['PANEL_OPTIONS']['ALLOW_LAYOUT_SELECTOR']=false;
            }


            $XCOM__DEFAULT_ACTIONS = array(
                XC_OPERATION_NONE=>0,
                XC_OPERATION_EDIT=>XAppJoomlaAuth::authorize($XAPP_ACL_SETTINGS_PREFIX.XC_OPERATION_EDIT_STR,$XAPP_COMPONENT_NAME),
                XC_OPERATION_COPY=>XAppJoomlaAuth::authorize($XAPP_ACL_SETTINGS_PREFIX.XC_OPERATION_COPY_STR,$XAPP_COMPONENT_NAME),
                XC_OPERATION_MOVE=>XAppJoomlaAuth::authorize($XAPP_ACL_SETTINGS_PREFIX.XC_OPERATION_MOVE_STR,$XAPP_COMPONENT_NAME),
                XC_OPERATION_INFO=>XAppJoomlaAuth::authorize($XAPP_ACL_SETTINGS_PREFIX.XC_OPERATION_MOVE_STR,$XAPP_COMPONENT_NAME),
                XC_OPERATION_DOWNLOAD=>XAppJoomlaAuth::authorize($XAPP_ACL_SETTINGS_PREFIX.XC_OPERATION_DOWNLOAD_STR,$XAPP_COMPONENT_NAME),
                XC_OPERATION_COMPRESS=>XAppJoomlaAuth::authorize($XAPP_ACL_SETTINGS_PREFIX.XC_OPERATION_COMPRESS_STR,$XAPP_COMPONENT_NAME),
                XC_OPERATION_DELETE=>XAppJoomlaAuth::authorize($XAPP_ACL_SETTINGS_PREFIX.XC_OPERATION_DELETE_STR,$XAPP_COMPONENT_NAME),
                XC_OPERATION_RENAME=>XAppJoomlaAuth::authorize($XAPP_ACL_SETTINGS_PREFIX.XC_OPERATION_RENAME_STR,$XAPP_COMPONENT_NAME),
                XC_OPERATION_DND=>XAppJoomlaAuth::authorize($XAPP_ACL_SETTINGS_PREFIX.XC_OPERATION_DND_STR,$XAPP_COMPONENT_NAME),
                XC_OPERATION_COPY_PASTE=>XAppJoomlaAuth::authorize($XAPP_ACL_SETTINGS_PREFIX.XC_OPERATION_COPY_PASTE_STR,$XAPP_COMPONENT_NAME),
                XC_OPERATION_OPEN=>true,
                XC_OPERATION_RELOAD=>XAppJoomlaAuth::authorize($XAPP_ACL_SETTINGS_PREFIX.XC_OPERATION_RELOAD_STR,$XAPP_COMPONENT_NAME),
                XC_OPERATION_NEW_FILE=>XAppJoomlaAuth::authorize($XAPP_ACL_SETTINGS_PREFIX.XC_OPERATION_NEW_FILE_STR,$XAPP_COMPONENT_NAME),
                XC_OPERATION_NEW_DIRECTORY=>XAppJoomlaAuth::authorize($XAPP_ACL_SETTINGS_PREFIX.XC_OPERATION_NEW_DIRECTORY_STR,$XAPP_COMPONENT_NAME),
	            XC_OPERATION_UPLOAD=>XAppJoomlaAuth::authorize($XAPP_ACL_SETTINGS_PREFIX.XC_OPERATION_UPLOAD_STR,$XAPP_COMPONENT_NAME),
	            XC_OPERATION_READ=>XAppJoomlaAuth::authorize($XAPP_ACL_SETTINGS_PREFIX.XC_OPERATION_READ_STR,$XAPP_COMPONENT_NAME),
	            XC_OPERATION_ADD_MOUNT=>XAppJoomlaAuth::authorize($XAPP_ACL_SETTINGS_PREFIX.XC_OPERATION_ADD_MOUNT_STR,$XAPP_COMPONENT_NAME),
	            XC_OPERATION_REMOVE_MOUNT=>XAppJoomlaAuth::authorize($XAPP_ACL_SETTINGS_PREFIX.XC_OPERATION_REMOVE_MOUNT_STR,$XAPP_COMPONENT_NAME),
	            XC_OPERATION_EDIT_MOUNT=>XAppJoomlaAuth::authorize($XAPP_ACL_SETTINGS_PREFIX.XC_OPERATION_EDIT_MOUNT_STR,$XAPP_COMPONENT_NAME)
            );

            $result['ALLOWED_ACTIONS']=$XCOM__DEFAULT_ACTIONS;

            /***
             * Panel configs
             */

            //left
            self::parsePanelOptions('FILE_PANEL_OPTIONS_','LEFT',$jParams,$result);
            //main
            self::parsePanelOptions('FILE_PANEL_OPTIONS_','MAIN',$jParams,$result);
            //right
            self::parsePanelOptions('FILE_PANEL_OPTIONS_','RIGHT',$jParams,$result);


	        /***
             * Security config
             */

            self::toGatewayOption($jParams,'RPC_GATEWAY_ALLOW_IP',$result);
	        self::toGatewayOption($jParams,'RPC_GATEWAY_ALLOW_HOST',$result);
	        self::toGatewayOption($jParams,'RPC_GATEWAY_DENY_IP',$result);
	        self::toGatewayOption($jParams,'RPC_GATEWAY_DENY_HOST',$result);

	        //plugins
            if($jParams->get('XAPP_BOOTSTRAP_PROHIBITED_PLUGINS')!==null){
                $result['XAPP_BOOTSTRAP_PROHIBITED_PLUGINS']=$jParams->get('XAPP_BOOTSTRAP_PROHIBITED_PLUGINS');
            }else{
                $result['XAPP_BOOTSTRAP_PROHIBITED_PLUGINS']='';
            }

            return $result;

        }
        return null;
    }
    /***
     * @return bool
     */
    public static  function isFrontEnd(){
        $pageURL = XApp_Service_Entry_Utils::getReferer(false);
        if(strpos($pageURL,'option=com_xappcommander&view=folder')!==false){
            return true;
        }
        return false;
    }

    /**
     * @param $url
     * @return array
     */
    public static function extractGETParams($url)
    {
        $query_str = parse_url($url, PHP_URL_QUERY);
        $parts = explode('&', $query_str);
        $return = array();

        foreach ( $parts as $part )
        {
            $param = explode('=', $part);
            $return[$param[0]] = $param[1];

        }

        return $return;
    }

    /***
     * @return null
     */
    public static  function getMenu(){

        /*
        $pageURL = XApp_Service_Entry_Utils::getReferer(false);
        if(strpos($pageURL,'Itemid')!==false){
            $app = JFactory::getApplication('site');
            if($app!=null){
                $menu= $app->getMenu('site');
                if($menu){
                    $items= $menu->getMenu();
                    $arr = self::extractGETParams($pageURL);
                    if($arr && array_key_exists('Itemid',$arr)){
                    }
                }
            }
        }
        */
        return null;
    }
}
