var dojoConfig = {
    async: true,
    parseOnLoad: false,
    isDebug: 0,
    baseUrl: './administrator/components/com_xappcommander/client/xfile/',
    tlmSiblingOfDojo: 0,
    useCustomLogger:false,
    packages: [
        { name: "dojo", location: "dojo" },
        { name: "dojox", location: "dojox" },
        { name: "dijit", location: "dijit" },
        { name: "cbtree",location: "cbtree" },
        { name: "xjoomla",location: "xjoomla" },
        { name: "xfile",location: "xfile" }
    ],
    has:{
        'dojo-undef-api': true,
        'dojo-firebug': false
    },
    locale:'en'
};

var isMaster = true;
var debug=true;
var device=null;
var sctx=null;
var ctx=null;
var cctx=null;
var mctx=null;
var rtConfig="debug";
var returnUrl= "";
var dataHost ="./components/com_xappcommander/client/../server/service/";
var xFileConfig={
    FILES_STORE_URL:"./components/com_xappcommander/../../index.php?option=com_xappcommander&view=cbtree",
    CODDE_MIRROR:"./administrator/components/com_xappcommander/client/lib//external/codemirror-3.20/",
    THEME_ROOT:"administrator/components/com_xappcommander/client/themes/",
    WEB_ROOT:"./administrator/components/com_xappcommander/client/",
    FILE_SERVICE:"./components/com_xappcommander/index.php?option=com_xappcommander&view=rpc",
    REPO_URL:"%SITE_URL%",
    MEDIA_PICKER2:{
        showPreview:true,
        editorNode:'jform_articletext_parent',
        editorTextNode:'jform_articletext',
        editorNodeAfter:'editor-xtd-buttons',
        toolbarClass:'.ui-state-default',
        editorPreviewTarget:'topTabs',
        editorPreviewLayoutZone:'center',
        editorPreviewLayoutContainerClass:'contentPreviewPane'
    },
    ACTION_TOOLBAR_MODE:'self'
};
var xappFileStoreUrl ="./components/com_xappcommander/../../index.php?option=com_xappcommander&view=cbtree";
var xappCodeMirrorRoot="./components/com_xappcommander/client/lib//external/codemirror-3.20/";
var xappThemeRoot="components/com_xappcommander/client/themes/";
var xappRootPrefix="./components/com_xappcommander/client/";
var xappIsJoomla3 = %IS_JOOMLA_3%;


