<?php
/**
 * @version 0.1.0
 *
 * @author https://github.com/mc007
 * @license : GPL v2. http://www.gnu.org/licenses/gpl-2.0.html
 */
class XAppJoomlaAuth {


    var $logger=null;

    public  static function jPath($componentName){
        $res = JURI::root( true );

        $res = str_replace('components/' . $componentName . '/xapp','',$res);
        return $res;
    }
    public static function getSiteUrl($url,$componentName='com_xappcommander'){
        if(!strpos($url,'http')||!strpos($url,'https')){
            $siteUrl = self::jPath($componentName);
            $siteUrl = str_replace('/','',$siteUrl);
            $url = str_replace('components/' . $componentName .  '/xapp','/',$url);
            $url = str_replace( $siteUrl ,'/',$url);
            $url = str_replace( 'administrator' ,'',$url);

            $basePath = JURI::base( false );
            $basePath = str_replace('components/'. $componentName .'/xapp','',$basePath);
            $basePath = str_replace( 'administrator' ,'',$basePath);
            $res = $basePath .'/'. $url;
            $res = str_replace( '///' ,'/',$res);
            return $res;
        }
        return $url;
    }
    /***
     * @param $action
     * @param string $component
     * @return bool
     */
    public static function authorize($action,$component='com_xappcommander'){
        $user = JFactory::getUser();
        return $user !==null ? $user->authorise($action, $component) : false;
    }

    /***
     * @param $action
     * @param string $component
     * @return bool
     */
    public static function getUserName(){
        $user = JFactory::getUser();
        return $user !==null ? $user->name : null;
    }

    /***
     * @param $action
     * @param string $component
     * @return bool
     */
    public static function getToken(){
        return JFactory::getSession()->get('session.token');
    }

    /***
     * @param $action
     * @param string $component
     * @return bool
     */
    public static function isValidIP(){
        $user = JFactory::getUser();

        // Get web client's IP address (NB ip2long() returns false if not a valid IP string)
        $incoming_ip = ip2long(JRequest::getVar('REMOTE_ADDR', '', 'SERVER', 'STRING'));
    }

    /***
     * @param string $version
     * @param string $operator
     * @param bool $compare_minor_versions
     * @return bool|mixed
     */
    public  static  function version( $version='', $operator='=', $compare_minor_versions=true) {
        $this_version = '';
        if( !empty($GLOBALS['_VERSION']) && is_object($GLOBALS['_VERSION'])) {
            $jversion =& $GLOBALS['_VERSION'];
            $this_version = $jversion->RELEASE .'.'. $jversion->DEV_LEVEL;
        }
        elseif ( class_exists('JVersion') ) {
            $jversion = new JVersion();
            $this_version = $jversion->RELEASE .'.'. $jversion->DEV_LEVEL;
        } else {
            return false;
        }
        if( empty( $version ) ) {
            return !empty($this_version);
        }
        $allowed_operators = array( '<', 'lt', '<=', 'le', '>', 'gt', '>=', 'ge', '==', '=', 'eq', '!=', '<>', 'ne' );

        if( $compare_minor_versions ) {
            $this_version = $jversion->RELEASE;
        }
        if( in_array($operator, $allowed_operators )) {

            return version_compare( $this_version, $version, $operator );
        }
        return false;
    }

    /***
     * @param int $userId
     */
    function logout($userId=0)
    {

        $user   = JFactory::getUser();
        $my 		= JFactory::getUser();
        $session 	= JFactory::getSession();
        $app 		= JFactory::getApplication();

        $my->setLastVisit();
        if($userId!=0){
            $app->logout($userId);;
        }


        // Destroy the php session for this user
        $session->destroy();

        try{

            // Force logout all users with that userid
            $db = JFactory::getDBO();
            $db->setQuery(
                'DELETE FROM '.$db->quoteName('#__session') .
                ' WHERE '.$db->quoteName('userid').' = '.(int) $user->id
            );
            $db->query();
            $app = JFactory::getApplication();
            $session = JFactory::getSession();
            /*jimport('joomla.database.table');*/

            //$storage = JTable::getInstance('session');
            //$storage->delete($sessionId);

            /*
            $user   = JFactory::getUser();
            if($user){
                $userId = (int) $user->get('id');
                error_log('logging out user by id' . $userId);
                //$app->logout($userId);;
            }
            */

        }catch (Exception $e){
            /*error_log('auth crash');*/
        }

    }
    /***
     * Temp. back compat solution to enable authorized content
     * @param $query
     */
    public function adjustSQLQuery($query){

        if($this->isLoggedIn()){
            if($query!==null){

                if(strpos($query,'AND access= 1')){
                    $query=str_replace('AND access= 1','AND access = 2 OR access = 1',$query);
                }
                if(strpos($query,'#__k2_items.access = 1')){
                    $query=str_replace('#__k2_items.access = 1','(#__k2_items.access = 1 OR #__k2_items.access = 2)',$query);
                }
            }
        }
        return $query;
    }
    public function isLoggedIn(){
        $session = JFactory::getSession();
        $user   = JFactory::getUser();
        $userId = 0;
        if($user){
            $userId = (int) $user->get('id');
        }else{
        }
        return $userId !=0;
    }
    function loginUserEx($username, $password)
    {

        $userId = -1;
        $credentials = array('username' => $username, 'password' => $password);
        $options = array(
	        'silent' => false,
            'remember'=>true);

        $app = JFactory::getApplication();

        // Save our guest session so we can destroy it.
        $session = JFactory::getSession();
        $successfulLogin = $app->login($credentials, $options);

        if($successfulLogin)
        {
            $userId = JUserHelper::getUserId($username);
            $user = JUser::getInstance($userId);
            /*
            if($user){
                //$hash = JApplication::getHash($user->get('id', 0) . $session->getToken(false));
                //error_log('XAppJoomlaAuth :: login auth hash '. $hash . ' ' . $user->get('name'));
            }
            */
        }
        return $userId;
    }

    function loginUser($username, $password)
    {


        //handle K2 bug
        $k2SystemPlugin = JPATH_ADMINISTRATOR.DIRECTORY_SEPARATOR.'components'.DIRECTORY_SEPARATOR.'com_k2'.DIRECTORY_SEPARATOR.'lib'.DIRECTORY_SEPARATOR.'k2plugin.php';
        if(file_exists($k2SystemPlugin)){
            JTable::addIncludePath(JPATH_ADMINISTRATOR.DS.'components'.DS.'com_k2'.DS.'tables');
            JLoader::register('K2Table', JPATH_ADMINISTRATOR.'/components/com_k2/tables/table.php');
        }

	    //do the auth
        $userId = -1;
        try{
            $userId= $this->loginUserEx($username,$password);
        }catch (Exception $e){
            $this->log('XAppJoomlaAuth::loginUserfailed ' . $e->getMessage());
            return -1;
        }
        return $userId;
    }

    /***
     * @param $message
     * @param bool $stdError
     */
    public function log($message,$stdError=true){
        if($this->logger){
            $this->logger->log($message);
        }
        if($stdError){
            error_log('Error : '.$message);
        }
    }

    /***
     * SSO Impl.
     */
    function getTableName() {
        return 'xapp_authsessions';
    }
    function initSessions() {
        $db =JFactory::getDBO();
        $sql = "CREATE TABLE " . $this->getTableName() . " ( "
            . "id varchar(32) not null primary key,
created timestamp
)";
        $db->setQuery($sql);
        $result = $db->query();
        if ($result === False) {
        }
    }
    function getUserSearchColumn() {
        $permitted = array("username" => true,
            "name" => true,
            "email" => true,
        );
        $col = $this->params->get('user_column');
        if ($permitted[$col]) {
            return $col;
        }
        return "username";

    }

    function onAuthenticate ($cred,$opts,&$resp) {
        // Is the session still valid?

        $db = JFactory::getDBO();
        $sharedSecret = 's3cr3t';

        $htmlVerb = $_GET;

        $sql = "SELECT COUNT(*) AS c FROM " . $this->getTableName()
            . " WHERE id=" . $db->quote($cred['session'])
            . " AND created > DATE_SUB(NOW(), INTERVAL 4 HOUR)";

        $db->setQuery($sql);
        $res = $db->loadAssoc();

        if ($res === False || $res['c'] < 1) {
            // No session
            error_log("Invalid session '{$cred['session']}'");
            $resp->status = 'JAUTHENTICATE_STATUS_FAILURE';
            return;
        }

        $checksum = md5($cred['username'] . $cred['session'] . $sharedSecret);

        if (array_key_exists('sum',$cred ) &&  $cred['sum'] == $checksum) {
            // Find this user
            $ret = $this->findUser($cred['username'], $this->getUserSearchColumn());
            if ($ret !== false) {
                // Log this user into the common account
                error_log("Token login successful!");

                $resp->status   = 'JAUTHENTICATE_STATUS_SUCCESS';
                $resp->fullname = $ret["fullname"];
                $resp->email    = $ret["email"];
                $resp->username = $ret["username"];
            } else {
                error_log("Could not find {$_GET['username']} in DB");
            }
            return;
        }

        $resp->status = 'JAUTHENTICATE_STATUS_FAILURE';
        $resp->error_message = "Not a known user";
        if(array_key_exists('sum',$cred)){
            error_log("Checksums did not match: '{$cred['sum']}' does not match '$checksum'");
        }

        return;
    }

    function getNewSession($session) {
        $db =JFactory::getDBO();
        $id = md5(uniqid());
        $sql = "INSERT INTO " . $this->getTableName()
            . " (id) VALUES (" . $db->quote($session) . ")";
        $db->setQuery($sql);

        return $id;
    }
    function removeOldSessions() {
        $db =JFactory::getDBO();

        $sql = "DELETE FROM " . $this->getTableName()
            . " WHERE created < DATE_SUB(NOW(), INTERVAL 4 HOUR)";
        $db->setQuery($sql);
    }
    function initSSOSession($sessionId){
        $this->initSessions();
        $this->removeOldSessions();
        $this->getNewSession($sessionId);
    }


}