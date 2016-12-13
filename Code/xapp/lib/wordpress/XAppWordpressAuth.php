<?php

class XAppWordpressAuth {

    var $logger=null;

	/**
	 * secret salt for creating api keys
	 *
	 * @var string
	 */
	private  static $_salt = 'k?Ur$0aE#9j1+7ui';

	/**
	 * @return mixed
	 */
    public static function  isLoggedIn(){
        return is_user_logged_in();
    }

	/**
	 * @TODO : verify time by nounce
	 * @param $token
	 * @param $userHash
	 * @return bool
	 * @throws Exception
	 */
	public static  function  loginUserByToken($token,$userHash){

		$theUser = null;
		$users= get_users();

		/*
		$nouncePart = substr($token,40,10);
		$tokenPart = substr($token,0,40);*/

		/**
		 * find the user by hash match on the login name
		 */
		foreach ($users as $user) {
			if($userHash===md5($user->user_login)){
				$theUser=$user;
				break;
			}
		}

		if($theUser==null){
			return false;
		}

		$userToken = self::sign(array(
				'pw'=>$theUser->user_pass,
				'name'=>$theUser->user_login
			),self::$_salt);

		if($token===$userToken){

			wp_clear_auth_cookie();
			wp_set_current_user ( $theUser->ID );
			wp_set_auth_cookie  ( $theUser->ID );
			return true;
		}
		return false;
	}

    /***
     * @param $action
     * @param string $component
     * @return bool
     */
    public static function getToken(){
	    return self::createToken();
    }




	/**
	 * Salt setter
	 * @param $salt
	 */
	public static function setSalt($salt){
		self::$_salt = $salt;
	}

	/**
	 * Salt setter
	 * @param $salt
	 */
	public static function getSalt(){
		return self::$_salt;
	}

	/**
	 * basic data sign method converting an array/object to string to be hashed and signed with key passed in second
	 * parameter using the algorithm in third parameter. the same function must be used server and client side.
	 * use your own implementation by setting valid callback function in option SIGNED_REQUEST_CALLBACK - this
	 * is the preferred behaviour since rpc client may not support internal sign function used here. the callback
	 * will receive three values data, user, key where the last will only exist if key has been set to key chain.
	 * the callback must return boolean value whether signature verification was successful or not. the function
	 * will return false if the encoding and/or hashing produced errors
	 *
	 * @error 14013
	 * @param mixed $data expects data as string or array
	 * @param string $key the api/gateway key with which the request was signed
	 * @param string $algo expects the hashing algorithm
	 * @throws Xapp_Rpc_Gateway_Exception
	 * @return string|boolean false
	 */
	public static function sign($data, $key, $algo = 'sha1')
	{
		$algo = strtolower(trim($algo));
		if(!is_array($data))
		{
			$data = (array)$data;
		}

		if(!in_array($algo, hash_algos()))
		{
			throw new Exception("passed hashing algorithm is not recognized", 1401301);
		}

		if(!function_exists('xapp_rpc_sign'))
		{
			function xapp_rpc_sign($data, $key, $algo = 'sha1')
			{
				$data = json_encode($data);
				$data = str_replace('\\/', '/',$data);
				if($data !== false)
				{
					return hash_hmac((string)$algo, $data, (string)$key);
				}else{
					return false;
				}
			}
		}
		return xapp_rpc_sign($data, $key, $algo);
	}

	/**
	 * @param string $name
	 * @return bool|null|string
	 * @throws Exception
	 */
	public static function createToken($name='xfToken'){

		if(self::isLoggedIn()){
			global $current_user;
			get_currentuserinfo();
			return  self::sign(array(
					'pw'=>$current_user->user_pass,
					'name'=>$current_user->user_login
				),self::$_salt);//.wp_create_nonce('xfToken');//add some time limits (valid for 24h)
		}
		return null;
	}

    /***
     * @param $action
     * @param string $component
     * @return bool
     */
    public static function getUserName(){
        global $current_user;
        get_currentuserinfo();
	    if($current_user && $current_user->user_login){
		    return $current_user->user_login;
	    }
	    return 'guest';
    }

	/**
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

	/**
	 * @param $username
	 * @param $password
	 * @return int
	 */
    function loginUserEx($username, $password)
    {
        $userId = -1;

        $user = wp_authenticate($username, $password);
        if (is_wp_error($user)) {
            return -1;
        } else {
            return 1;
        }
    }

	/**
	 * @param $username
	 * @param $password
	 * @return int
	 */
    function loginUser($username, $password)
    {
        //do the auth
        $userId = -1;
        try{
            $userId= $this->loginUserEx($username,$password);
        }catch (Exception $e){
            $this->log('XAppWordpressAuth::loginUserfailed ' . $e->getMessage());
            return -1;
        }
        return $userId;

    }

}