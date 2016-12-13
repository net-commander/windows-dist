<?php
/**
 * @version 0.1.0
 *
 * @author https://github.com/mc007
 * @license : GPL v2. http://www.gnu.org/licenses/gpl-2.0.html
 * @package XApp-Commander\Plugin\XZoho
 */
class XZoho extends Xapp_Commander_Plugin{



    /***
     * @param $str
     * @return string
     */
    public function encodeURIComponent($str) {
        $revert = array('%21'=>'!', '%2A'=>'*', '%27'=>"'", '%28'=>'(', '%29'=>')');
        return strtr(rawurlencode($str), $revert);
    }
    public function setupKey(){
        $thisPath = dirname(__FILE__) . DIRECTORY_SEPARATOR .'data' . DIRECTORY_SEPARATOR;
        $keyFile = $thisPath . "agent.pem";
        if(!file_exists($keyFile)){
            return false;
        }

        $config = array(
            "digest_alg" => "sha1",
            "private_key_bits" => 1024,
            "private_key_type" => OPENSSL_KEYTYPE_RSA,
        );

        // Create the private and public key
        $res = openssl_pkey_new($config);
        if($res === false){
            while($message = openssl_error_string()){

            }
        }else{
            openssl_pkey_export_to_file($res, $keyFile);
        }
    }
    /***
     * RPC method for the client. The Zoho editor is nothing but an iFrame.
     * Calling iFrame URL will result in posting the document to Zoho, afterwards Zoho will return
     * an URL to an editor instance.
     *
     * @param $file
     */
    public function get($file){

        $this->setupKey();
        $sheetExt =  explode(",", "xls,xlsx,ods,sxc,csv,tsv");
        $presExt = explode(",", "ppt,pps,odp,sxi");
        $docExt = explode(",", "doc,docx,rtf,odt,sxw");

        require_once(dirname(__FILE__)."/http_class.php");

        $components  = parse_url(XApp_Service_Entry_Utils::getUrl());

        $target="http".(!empty($_SERVER['HTTPS'])?"s":"").
            "://".$_SERVER['SERVER_NAME'] . ':' . $components['port'] . strtok($_SERVER["REQUEST_URI"],'?');

        $target.='?service=Xapp_FileService.zohoUpload&view=upload';
        $target.='&fileName='.$this->encodeURIComponent($file);

        $tmp = $newdir = $this->xfile->resolve($file);


        $extension = strtolower(pathinfo(urlencode(basename($file)), PATHINFO_EXTENSION));
        $httpClient = new http_class();
        $httpClient->request_method = "POST";


        $_SESSION["ZOHO_CURRENT_EDITED"] = $file;
        $_SESSION["ZOHO_CURRENT_UUID"]   = md5(rand()."-".microtime());
        $saveUrl=''.$target;

        $params = array(
            'id' => $_SESSION["ZOHO_CURRENT_UUID"],
            'apikey' => '93d546f57c52cb8ade778ea6f78bef6e',
            'output' => 'url',
            'lang' => "en",
            'filename' => urlencode(basename($file)),
            'persistence' => 'false',
            'format' => $extension,
            'mode' => 'normaledit',
            'saveurl'   => $saveUrl
        );

        $service = "exportwriter";
        if (in_array($extension, $sheetExt)) {
            $service = "sheet";
        } else if (in_array($extension, $presExt)) {
            $service = "show";
        } else if (in_array($extension, $docExt)) {
            $service = "exportwriter";
        }
        $arguments = array();
        $httpClient->GetRequestArguments("https://".$service.".zoho.com/remotedoc.im", $arguments);
        $arguments["PostValues"] = $params;
        $arguments["PostFiles"] = array(
            "content"   => array("FileName" => $tmp, "Content-Type" => "automatic/name")
        );

        /*
         *
         */
        $err = $httpClient->Open($arguments);
        $response='';
        if (empty($err)) {
            $err = $httpClient->SendRequest($arguments);
            if (empty($err)) {
                $response = "";
                while (true) {
                    $body = "";
                    $error = $httpClient->ReadReplyBody($body, 1000);
                    if($error != "" || strlen($body) == 0) break;
                    $response .= $body;
                }
                $result = trim($response);
                xapp_dump($result);
                $matchlines = explode("\n", $result);
                $resultValues = array();
                foreach ($matchlines as $line) {
                    list($key, $val) = explode("=", $line, 2);
                    $resultValues[$key] = $val;
                }
                if ($resultValues["RESULT"] == "TRUE" && isSet($resultValues["URL"])) {
                    header("Location: ".$resultValues["URL"]);
                } else {
                    echo "Zoho API Error ".$resultValues["ERROR_CODE"]." : ".$resultValues["WARNING"];
                    echo "<script>window.parent.setTimeout(function(){parent.hideLightBox();}, 2000);</script>";
                }
            }else{
            }
            $httpClient->Close();
        }else{
        }
    }

    /***
     * Invoked by the plugin manager, before 'load'!. time to register our subscriptions
     * @deprecated
     * @return int|void
     */
    public function setup(){

    }
    /***
     * Sign the filename
     * @param $id
     * @return bool|string
     */
    public function signID($id){
        $keyFile = $thisPath = dirname(__FILE__) . DIRECTORY_SEPARATOR .'data' . DIRECTORY_SEPARATOR . "agent.pem";
        if(file_exists($keyFile)){
            $keyId = openssl_get_privatekey(file_get_contents($keyFile));
            $message = $id;
            openssl_sign($message, $signature, $keyId);
            openssl_free_key($keyId);
            return urlencode(base64_encode($signature));
        }
        return false;
    }

    /**
     * XApp-Commander standard call, invoked before any method invoked through the RPC router.
     * @param array $options
     * @return bool|int
     */
    public function load($options=array()){

        if(!extension_loaded("openssl")){
            return false;
        }
        return true;

    }

}