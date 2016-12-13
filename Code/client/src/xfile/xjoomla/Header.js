var isMaster = true;
var debug=true;
var device=null;
var sctx=null;
var ctx=null;
var cctx=null;
var mctx=null;
var rtConfig="release";
var returnUrl= "";
var dataHost ="";
var xFileConfigMixin =%XFILE_CONFIG_MIXIN%;
function JSCOMPILER_PRESERVE(){

}

var xFileConfig={
    FILES_STORE_URL:'%FILES_STORE_URL%',
    CODDE_MIRROR:'%CODDE_MIRROR_URL%',
    THEME_ROOT:'%APP_URL%/themes/',
    WEB_ROOT:'%APP_URL%',
    FILE_SERVICE:'%FILE_SERVICE%',
    FILE_SERVICE_FULL:'%FILE_SERVICE_FULL%',
    REPO_URL:'%REPO_URL%',
    FILES_STORE_SERVICE_CLASS:'XCOM_Directory_Service',
    RPC_PARAMS:{
        rpcUserField:'user',
        rpcUserValue:'%RPC_USER_VALUE%',
        rpcSignatureField:'sig',
        rpcSignatureToken:'%RPC_SIGNATURE_TOKEN%',
        rpcFixedParams:{
            "option":"com_xappcommander"
        }
    },
    ACTION_TOOLBAR_MODE:'self'
};
var xappPluginResources=%XAPP_PLUGIN_RESOURCES%;
var xappIsJoomla3 =%IS_JOOMLA3%;
