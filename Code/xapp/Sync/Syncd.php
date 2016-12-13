<?php

/**
 * TODO: make a real is writeable test in test modus
 * TODO: make ftp client
 * TODO: follow symbolic links
 * TODO: ssh user on shared server must not have full path in all action in target path. define xml node to use target root path or not
 * TODO: copy file must be a stream write procedure since copy/fopen are asyncron operations and there is no way of determining the eof event to set chmod after file has been copied
 */

/**
 * @desc
 * linux/unix directory staging/sync script for php cli
 *
 * this script will copy contents of a source directory to a target directory as defined in a config xml file emulating a (s)ftp client.
 * the script will only run in cli modus from shell/command line and can be called like:
 *
 * - bash:~$ php -f /path/to/syncd.php
 *
 * in order for the script to run 2 mandatory parameter/argument must be passed in the shell/command line, e.g.:
 *
 * - bash:~$ php -f /path/to/syncd.php "config.xml" "test-logged"
 * - bash:~$ php -f /path/to/syncd.php "/var/www/tmp/config.xml" "live"
 * - bash:~$ php -f /path/to/syncd.php "/var/www/tmp/config.xml" "live-logged" -option1
 * - bash:~$ php -f /path/to/syncd.php "/var/www/tmp/config.xml" "test" -option1 -option2=1
 *
 * the first mandatory argument expects the path to the config xml file. path must be absolute or filename only if config.xml resides in same
 * directory as the script. the second mandatory argument expects the run modus as explained here:
 *
 * - "test" = simulates sync testing the basic requirements for a successful sync echoing everything in the shell
 * - "test-logged" = does the same as "test" with logging everything to a log report file
 * - "live" = executes the jobs defined in the config xml
 * - "live-logged" = does the same as "live" with logging everything to log report file
 *
 * the > third argument or all arguments after the run modus argument are considered to be optional options which are lined up linux style with a trailing "-"
 * to signify that the argument is an option like: "-option1" but also "-option2=yes" which are options with key => value pairs. the following options are supported
 * - "-force" = will force the job to be executed regardless of any scheduled values for type "once|daily"
 * - "-silent" = suppress all log message output in shell and allow only logging to log file
 *
 * NOTE: the directory in which this script resides must be writeable in order to write the log report if the config.logdir value is not set
 * NOTE: the script currently supports only sftp with ssh2 and normal user/pass authentification!
 * NOTE: when defining job type and date attributes a history log file in the same directory or the config.logdir as the script named "jobs.log" will be created to log when jobs are executed
 *
 * The following displays are complete config xml file:
 *
<?xml version="1.0" encoding="utf-8"?>
<root>
<config>
<ini>
<memory_limit>512mb</memory_limit>
</ini>
(<target>
<host>xx.xx.xx.xx</host>
<port>22</port>
<user>root</user>
<pass></pass>
<class includes="/var/www/syncd/seclib:Net/SFTP.php">Phpseclib_SFTP</class>
</target>)
<sourcebase></sourcebase>
<targetbase></targetbase>
<compare>date</compare>
<resync>1</resync>
<skip>*.svn,*.git,*.log</skip>
<modified_since>10.11.09 15:20:21</modified_since>
<chmod>0755</chmod>
<chown>www-data</chown> //numeric value for Phpseclib_Sftp
<chgrp>www-data</chgrp> //numeric value for Phpseclib_Sftp
<logdir>/logs</logdir>
<logclean>30</logclean>
<profile>1</profile>
</config>
<jobs>
<job id="job1" compare="size" resync="1" type="daily" date="00:00">
<target><![CDATA[/backup]]></target>
<source><![CDATA[/var/www/website/private]]></source>
<excludes>
<exclude><![CDATA[/var/www/website/private/tpls/*]]></exclude>
<exclude><![CDATA[/backup]]></exclude>
<exclude><![CDATA[/config/config.inc.php]]></exclude>
<exclude><![CDATA[functions.php]]></exclude>
</excludes>
<actions>
<action type="delete"><![CDATA[/.htaccess]]></action>
<action type="delete"><![CDATA[/var/www/website/temp/]]></action>
</actions>
</job>
</jobs>
</root>
 * The optional ini node can be used to set ini key => values for php
 *
 * The config parameters are the following:
 *
 * NOTE: Use target node only when dealing with (S)FTP sync else omit target node and child nodes!!!
 *
 * config.target (optional!)
 *
 * 1) config.target.host (mandatory)
 * expects the host name or ip for the remote target
 *
 * 2) config.target.port (mandatory)
 * expects the port (crucial to decide which protocol to use)
 *
 * 3) config.target.user (mandatory)
 * expects the user for normal user/pass authentification
 *
 * 4) config.target.pass (optional)
 * expects the ssh user password (if not set will asked for in shell)
 *
 * 5) config.target.class (optional)
 * expects the optional class to force use, e.g. Sftp. the class node can also have attributes for using external classes:
 * - includes - for a ":" separated string of include paths or include files
 *
 * 6) config.sourcebase (optional)
 * expects the source root/base path. if set the job source path must be relative because basepath + jobpath
 *
 * 7) config.targetbase (optional)
 * expects the target root/base path. if set the job target path must be relative because basepath + jobpath
 * the targetbase path also set the current working directory on the target server. if not set the app will look for the cwd
 * automatically using the unix pwd command.
 * NOTE: on shared hosts the pwd command still will return the correct path from root but ftp/sftp can only write to relative path.
 * in this case the targetbase path should be set like "/" forcing the cwd to the path of the logged in user (relative)
 *
 * 8) config.compare (optional)
 * if set expects a compare modus (size|date) which will compare files and sync only if rule does not apply
 *
 * 9) config.resync (optional)
 * expects a value (0 = off|1 = on) if the process should also delete orphaned files on target remote server
 *
 * 10) config.skip (optional)
 * expects optional skip rules which is a comma separated list of file extensions
 *
 * 11) config.modified_since (optional)
 * if set syncs only files which are newer then modification date
 *
 * 12) config.chmod (optional)
 * expects a chmod value to set to remote file once syncd to remote server
 *
 * 13) config.chown (optional)
 * expects a username as string to set after copy of file/dir has been successful. the username will be tested before sync to check if username does exist on target server.
 * the new username will only be set if the to be copied source file/dir does have a different user as owner
 *
 * 14) config.chgrp (optional)
 * expects a group name as string to set after copy of file/dir has been successful. the group will be tested before sync to check if group does exist on target server.
 * the new group name will only be set if the to be copied source file/dir does have a different user as owner
 *
 * 15) config.logdir (optional)
 * expects absolute or relative path to log file directory, the directory where log files are written to. relative must be from the location of base syncd.php file.
 *
 * 16) config.logclean (optional)
 * if set and an integer value of x days will delete all report log files older then that value in days
 *
 * 17) config.profile (optional)
 * if set to 1 will use profiling (time, cpu, ram) and write profiling values to log file
 *
 * The following parameters must/can be defined in job nodes as attribute:
 *
 * 1) id
 * 2) type
 * 3) date
 *
 * 1) job.id (optional)
 * defines a job id for cron automated syncing as well as defining a job as reference for future implementation. if not set will be filled with numeric index starting for 0 for first job.
 * NOTE: that if changing the id and when automating scripts the reference to the job history will be lost resulting in wrong cron/automatization behaviour. delete jobs.log file after changing!
 *
 * 2) job.type (optional)
 * defines the type of job when running under automated scripts. the values can be (once, daily). in "once" modus the job will be executed only once (see job.date for date attribute) since its job timestamp will be logged to
 * prevent calling of job more then once. in "daily" modus the job will be executed only once daily at a defined hour (see job.date attribute)
 *
 * 3) job.date (mandatory if job.type is set)
 * defines the date on when the job is supposed to be executed according to attribute job.type.
 * "once" = accepts a valid php strtotime value, see http://php.net/manual/en/datetime.formats.php like "2013-05-03 10:55:00"
 * "daily" = expects a hourly value like "14:00", "09:30"
 *
 * The following parameters can be defined in job nodes as attribute to overwrite global values:
 *
 * 1) compare
 * 2) resync
 * 3) skip
 * 4) chmod
 * 5) chown
 * 6) chgrp
 * 7) modified_since
 *
 * (see descriptions for global parameters)
 *
 * Each job can be defined with the following parameter:
 *
 * 1) job.source (mandatory)
 * defines the source path to sync files from -> to remote target path. The path must be absolute if source basepath is not set.
 *
 * 2) job.target (mandatory)
 * defines the target path on remote server where to sync files from source -> target. The path must be absolute if target basepath is not set.
 *
 * 3) job.excludes (optional)
 * defines the exclude rules which can be:
 * - absolute path in source or target
 * - relative path to job source or target dir
 * - filename + extension (will exclude all files of the same name in all directories of job source/target path!)
 * - path + filename # extension will exclude a specific file from job source/target path (defined relative or absolute)
 * excluded can be files/dir from source AND target - syncd will autodetect according to dir where to exclude.
 * it is advised to always use absolute paths to avoid possible conflicts! in case of target excludes rules use always
 * absolute path without targetbase. always test your rules before running syncd live
 *
 * 4) job.actions (optional)
 * defines a list of actions applied after sync on target server - currently only type "delete" supported. this option is mend to perform actions
 * on the target server after the sync providing for more flexibility. the action will work on:
 * - absolute path/folder in target
 * - relative path/folder in target
 * - absolute file pointer in target
 * - relative file pointer in target
 *
 * @author setcookie <set@cooki.me>
 * @link set.cooki.me
 * @copyright Copyright &copy; 2011-2012 setcookie
 * @license http://www.gnu.org/copyleft/gpl.html
 * @package syncd
 * @version 0.1.2
 * @desc base class for sync
 * @throws Exception
 */
class Syncd
{
    const MODE_LIVE             = "live";
    const MODE_LIVE_LOGGED      = "live-logged";
    const MODE_TEST             = "test";
    const MODE_TEST_LOGGED      = "test-logged";
    const LOG_NOTICE            = "notice";
    const LOG_SUCCESS           = "success";
    const LOG_ERROR             = "error";
    const LOG_EXCEPTION         = "exception";
    protected                   $_start = null;
    protected                   $_xml = null;
    protected                   $_dir = null;
    protected                   $_mode = null;
    protected                   $_profile = false;
    protected                   $_options = array();
    protected                   $_xmlArray = null;
    protected                   $_conn = null;
    protected                   $_log = array();
    protected                   $_err = 0;
    protected                   $_logDir = null;
    protected                   $_logFile = null;
    protected                   $_jobFile = null;
    protected                   $_jobPool = null;
    protected static            $_instance = null;


    /**
     * @desc validates parameter and checks for valid environment
     * @throws Exception
     * @param string $xml expects absolute or relative path to config xml
     * @param string $mode expects the run mode
     * @param array $options expects optional options array
     */
    public function __construct($xml, $mode, Array $options = null)
    {
        $this->_start = microtime(true);

        @set_time_limit(0);
        @error_reporting(E_ALL);
        @ini_set("display_errors", 1);
        @ini_set('memory_limit', '512M');

        if(!defined("DIRECTORY_SEPARATOR"))
        {
            define('DIRECTORY_SEPARATOR', ((isset($_ENV["OS"]) && stristr('win',$_ENV["OS"]) !== false) ? '\\' : '/'));
        }

        $xml = DIRECTORY_SEPARATOR . ltrim(trim($xml), DIRECTORY_SEPARATOR);
        $mode = strtolower(trim((string)$mode));
        if(in_array($mode, array(self::MODE_LIVE, self::MODE_LIVE_LOGGED, self::MODE_TEST, self::MODE_TEST_LOGGED)))
        {
            $this->_mode = $mode;
        }else{
            throw new Exception("syncd run mode: $mode is not a valid run mode");
        }
        if($options !== null)
        {
            foreach($options as $o)
            {
                if(substr($o, 0, 1) === '-')
                {
                    $o = trim($o, " -");
                    if(strpos($o, '=') !== false)
                    {
                        $this->_options[strtolower(substr($o, 0, strpos($o, '=')))] = substr($o, strpos($o, '=') + 1, strlen($o));
                    }else{
                        $this->_options[strtolower($o)] = null;
                    }
                }
            }
        }
        if(strtolower(trim(php_sapi_name())) !== 'cli')
        {
            throw new Exception("script can only be called from command line (cli)");
        }
        if(!(bool)ini_get('allow_url_fopen'))
        {
            throw new Exception("system does not support open (s)ftp protocol wrapper");
        }
        if(!class_exists('RecursiveDirectoryIterator', false))
        {
            throw new Exception("system does not support recursive iterators");
        }
        if(!class_exists('DOMDocument'))
        {
            throw new Exception('system does not support dom document functions');
        }

        if(stristr($xml, realpath(dirname(__FILE__))) === false)
        {
            $this->_xml = $xml = rtrim(realpath(dirname(__FILE__)), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim($xml, DIRECTORY_SEPARATOR);
        }else{
            $this->_xml = $xml;
        }
        $dom = new DOMDocument();
        if($dom->load($this->_xml, LIBXML_NOBLANKS | LIBXML_NOCDATA))
        {
            $this->_xmlArray = $this->xmlToArray($dom);
            $this->_xmlArray = array_shift($this->_xmlArray);
            $this->init();
            $this->exec();
        }else{
            throw new Exception("xml config file: $xml not found or invalid");
        }
    }


    /**
     * @desc singleton run method to shortcut run syncd
     * @static
     * @param string $xml expects absolute or relative path to config xml
     * @param string $mode expects the run mode
     * @param array $options expects optional options array
     * @return null|Syncd
     */
    public static function run($xml, $mode, Array $options = null)
    {
        if(self::$_instance === null)
        {
            self::$_instance = new self($xml, $mode, $options);
        }
        return self::$_instance;
    }


    /**
     * @desc init global config settings and check for job log file
     * @access protected
     * @throws Exception
     */
    protected function init()
    {
        $tmp = array();

        $xml =& $this->_xmlArray;

        if(isset($xml['ini']))
        {
            foreach((array)$xml['ini'] as $k => $v)
            {
                @ini_set($k, $v);
            }
        }

        if(isset($xml['config']['profile']) && (int)$xml['config']['profile'] === 1)
        {
            $this->_profile = true;
        }

        if(isset($xml['config']['logdir']))
        {
            if(stristr($xml['config']['logdir'], DIRECTORY_SEPARATOR) === false || (substr($xml['config']['logdir'], 0, 1) === DIRECTORY_SEPARATOR &&  substr_count($xml['config']['logdir'], DIRECTORY_SEPARATOR) === 1))
            {
                $this->_logDir = $xml['config']['logdir'] = rtrim(realpath(dirname(__FILE__)), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim($xml['config']['logdir'], DIRECTORY_SEPARATOR);
            }else{
                $this->_logDir = $xml['config']['logdir'];
            }
            $this->_logDir = $this->_logDir . DIRECTORY_SEPARATOR;
            if(!is_dir($this->_logDir) || !is_writable($this->_logDir))
            {
                throw new Exception("config.logdir log directory does not exist or is not writeable");
            }
        }else{
            $this->_logDir = rtrim(realpath(dirname($this->_xml)), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
            if(!is_dir($this->_logDir) || !is_writable($this->_logDir))
            {
                throw new Exception("config.logdir log directory does not exist or is not writeable");
            }
        }

        $this->_jobFile = $this->_logDir . 'jobs.log';
        $this->_logFile = $this->_logDir . basename($this->_xml, ".xml") . "-". strftime("%Y%m%d-%H%M%S", time()) . ".report.log";

        if(isset($xml['config']['logclean']) && (int)$xml['config']['logclean'] > 0)
        {
            if(($dir = glob($this->_logDir . '*.log')) !== false)
            {
                foreach($dir as $d)
                {
                    if(preg_match('/([0-9]{8})\-([0-9]{6})\.report\.log$/i', $d, $match))
                    {
                        if(mktime(0, 0, 0, (int)substr($match[0], 4, 2), (int)substr($match[0], 6, 2), (int)substr($match[0], 0, 4)) < time() - ((int)$xml['config']['logclean'] * 86400))
                        {
                            @unlink($d);
                        }
                    }
                }
            }
        }

        if(is_file($this->_jobFile))
        {
            if(($this->_jobPool = file($this->_jobFile, FILE_SKIP_EMPTY_LINES)) !== false)
            {
                foreach($this->_jobPool as $k => $v)
                {
                    $t = explode(",", $v);
                    if(!empty($t))
                    {
                        if(array_key_exists(0, $t) && !array_key_exists($t[0], $tmp))
                        {
                            $tmp[$t[0]] = array();
                        }
                        if(array_key_exists(1, $t) && !array_key_exists($t[1], $tmp[$t[0]]))
                        {
                            $tmp[$t[0]][$t[1]] = array();
                        }
                        if(array_key_exists(0, $t) && array_key_exists(1, $t))
                        {
                            $tmp[$t[0]][$t[1]][] = $t[2];
                        }
                    }
                }
                $this->_jobPool = $tmp;
            }else{
                throw new Exception("job.log file could not be opened");
            }
        }

        $this->log("starting syncd with the following arguments: " . implode(" ", $GLOBALS['argv']), self::LOG_NOTICE);

        $this->initJobs();
        $this->initConfig();
    }


    /**
     * @desc validates and inits the job entries
     * @throws Exception
     * @return void
     */
    protected function initJobs()
    {
        try
        {
            $tmp = array();
            $xml =& $this->_xmlArray;

            if(isset($xml['jobs']) && !empty($xml['jobs']))
            {
                if(!isset($xml['jobs']['job'][0]))
                {
                    $xml['jobs']['job'] = array($xml['jobs']['job']);
                }
                $j = 0;
                foreach($xml['jobs']['job'] as $k => &$v)
                {
                    if(isset($v['actions']['action']) && !isset($v['actions']['action'][0]))
                    {
                        $v['actions']['action'] = array($v['actions']['action']);
                    }
                    if(!$this->is("jobs.job.$j.@attributes.id"))
                    {
                        $v['@attributes']['id'] = $j;
                    }

                    $id = $v['@attributes']['id'];
                    $this->log(".validating job: $j with id: $id", self::LOG_NOTICE);

                    //validate actions
                    if(isset($v['actions']))
                    {
                        foreach($v['actions']['action'] as $r)
                        {
                            if(!array_key_exists('@attributes', $r) || !array_key_exists('type', $r['@attributes']))
                            {
                                throw new Exception("job entry must contain a valid attribute for jobs.job.actions.action.@attribute.type");
                            }
                            if(!in_array($r['@attributes']['type'], array('delete')))
                            {
                                throw new Exception("job entry must contain a valid attribute for jobs.job.actions.action.@attribute.type");
                            }
                        }
                    }
                    //validate date
                    if($this->is("jobs.job.$j.@attributes.date"))
                    {
                        if(!array_key_exists('force', $this->_options))
                        {
                            if($this->is("jobs.job.$j.@attributes.type"))
                            {
                                $type = strtolower(trim($this->get("jobs.job.$j.@attributes.type")));
                            }else{
                                $type = $v['@attributes']['type'] = 'once';
                            }
                            $date = trim($this->get("jobs.job.$j.@attributes.date"));
                            $id = trim($this->get("jobs.job.$j.@attributes.id"));

                            if(!in_array($type, array('once', 'daily')))
                            {
                                throw new Exception("job entry must contain a valid attribute for jobs.job.@attributes.type");
                            }
                            if(empty($date))
                            {
                                throw new Exception("job entry must contain a valid attribute for jobs.job.@attributes.date");
                            }
                            if(strlen($id) < 1)
                            {
                                throw new Exception("job entry must contain a valid attribute for jobs.job.@attributes.id");
                            }
                            switch($type)
                            {
                                case 'once':
                                    if(($date = strtotime($date)) !== false)
                                    {
                                        if(time() >= $date)
                                        {
                                            if($this->_jobPool !== null && isset($this->_jobPool[basename($this->_xml)][$id]))
                                            {
                                                $v = null;
                                                $this->log("..job has been scheduled to run once and has already been executed", self::LOG_NOTICE);
                                            }
                                        }else{
                                            $v = null;
                                            $this->log("..job has been scheduled to run once but can not be executed before schedule date", self::LOG_NOTICE);
                                        }
                                    }else{
                                        throw new Exception("job attribute value for jobs.job.@attributes.date is not a valid date value");
                                    }
                                    break;
                                case 'daily':
                                    if((bool)preg_match('/([0-9]{1,2})\:([0-9]{1,2})$/i', $date, $m) !== false)
                                    {
                                        if(time() < mktime((int)$m[1], (int)$m[2], (int)strftime('%S', time()), (int)strftime('%m', time()), (int)strftime('%d', time()), (int)strftime('%Y', time())))
                                        {
                                            $v = null;
                                            $this->log("..job has been scheduled to run daily but can not be executed before schedule date", self::LOG_NOTICE);
                                        }
                                        if($this->_jobPool !== null && isset($this->_jobPool[basename($this->_xml)][$id]))
                                        {
                                            $time = (int)trim($this->_jobPool[basename($this->_xml)][$id][sizeof($this->_jobPool[basename($this->_xml)][$id]) - 1]);
                                            if(time() > mktime((int)strftime('%H', $time), (int)strftime('%M', $time), (int)strftime('%S', $time), (int)strftime('%m', time()), (int)strftime('%d', time()), (int)strftime('%Y', time())))
                                            {
                                                $v = null;
                                                $this->log("..job has been scheduled to run daily and has already been executed", self::LOG_NOTICE);
                                            }
                                        }
                                    }else{
                                        throw new Exception("job attribute value for jobs.job.@attributes.date is not a valid hourly value");
                                    }
                                    break;
                                default:
                                    throw new Exception("job schedule type is not supported");
                            }
                        }
                    }
                    $j++;
                }
            }else{
                throw new Exception("config file must have at least one valid job entry", self::LOG_EXCEPTION);
            }
        }
        catch(Exception $e)
        {
            $this->log($e->getMessage(), self::LOG_EXCEPTION);
        }
    }


    /**
     * @desc init method validates xml config and inits remote connection
     * @throws Exception
     * @return void
     */
    protected function initConfig()
    {
        try
        {
            if($this->_xmlArray !== null)
            {
                $xml =& $this->_xmlArray;

                if(isset($xml['config']['target']))
                {
                    if(!isset($xml['config']['target']['host']))
                    {
                        $this->log("config file must define config.target.host", self::LOG_EXCEPTION);
                    }
                    if(!isset($xml['config']['target']['port']))
                    {
                        $this->log("config file must define config.target.port", self::LOG_EXCEPTION);
                    }
                    if(!isset($xml['config']['target']['user']))
                    {
                        $this->log("config file must define config.target.user", self::LOG_EXCEPTION);
                    }
                    if(!isset($xml['config']['target']['pass']) || empty($xml['config']['target']['pass']))
                    {
                        echo "Password for target: ";
                        $pass = preg_replace('/\r?\n$/', '', `stty -echo; head -n1 ; stty echo`);
                        if(!empty($pass))
                        {
                            $xml['config']['target']['pass'] = $pass;
                        }else{
                            echo "Please run script again an enter correct password";
                            exit(0);
                        }
                    }
                }
                if(isset($xml['config']['target']))
                {
                    if(isset($xml['config']['target']['class']) && !empty($xml['config']['target']['class']))
                    {
                        if(is_array($xml['config']['target']['class']))
                        {
                            if(isset($xml['config']['target']['class']['@attributes']) && isset($xml['config']['target']['class']['@attributes']['includes']))
                            {
                                $includes = explode(':', trim($xml['config']['target']['class']['@attributes']['includes']));
                                foreach($includes as $i)
                                {
                                    if(strpos($i, '.') !== false)
                                    {
                                        include_once(trim($i));
                                    }else{
                                        if(!set_include_path(get_include_path() . PATH_SEPARATOR . trim($i)))
                                        {
                                            echo "unable to set include path: $i";
                                            exit(0);
                                        }
                                    }
                                }
                            }
                            $class = strtolower(trim($xml['config']['target']['class']['@value']));
                        }else{
                            $class = strtolower(trim($xml['config']['target']['class']));
                        }
                    }else{
                        $class = ((int)$xml['config']['target']['port'] === 21 || strtolower(trim($xml['config']['target']['port'])) === "ftp") ? "Ftp" : "Sftp";
                    }
                    $this->_conn = new $class($this);
                    $this->_conn->init
                        (
                            $xml['config']['target']['host'],
                            $xml['config']['target']['port'],
                            $xml['config']['target']['user'],
                            $xml['config']['target']['pass']
                        );
                    $this->_conn->connect();
                }else{
                    $this->_conn = new Fs($this);
                }
            }
        }
        catch(Exception $e)
        {
            $this->log($e->getMessage(), self::LOG_EXCEPTION);
        }
    }


    /**
     * @desc executes the sync with all config settings
     * @throws Exception
     * @return void
     */
    protected function exec()
    {
        $tmp = array();
        $xml =& $this->_xmlArray['jobs'];
        $j = 0;

        foreach($xml['job'] as $k => $v)
        {
            try
            {
                if($v !== null)
                {
                    $id = $v['@attributes']['id'];
                    $this->log(".executing job: $j with id: $id", self::LOG_NOTICE);

                    $resync = (bool)$this->get("config.resync", false);
                    if($this->is("jobs.job.$j.@attributes.resync"))
                    {
                        $resync = (bool)$this->get("jobs.job.$j.@attributes.resync", false);
                    }
                    $skip = trim($this->get("config.skip"));
                    if($this->is("jobs.job.$j.@attributes.skip"))
                    {
                        $skip = trim($this->get("jobs.job.$j.@attributes.skip"));
                    }
                    $chmod = trim($this->get("config.chmod"));
                    if($this->is("jobs.job.$j.@attributes.chmod"))
                    {
                        $chmod = trim($this->get("jobs.job.$j.@attributes.chmod"));
                    }
                    $chown = trim($this->get("config.chown"));
                    if($this->is("jobs.job.$j.@attributes.chown"))
                    {
                        $chown = trim($this->get("jobs.job.$j.@attributes.chown"));
                    }
                    $chgrp = trim($this->get("config.chgrp"));
                    if($this->is("jobs.job.$j.@attributes.chgrp"))
                    {
                        $chgrp = trim($this->get("jobs.job.$j.@attributes.chgrp"));
                    }
                    $compare = strtolower($this->get("config.compare"));
                    if($this->is("jobs.job.$j.@attributes.compare"))
                    {
                        $compare = strtolower($this->get("jobs.job.$j.@attributes.compare"));
                    }
                    $modified_since = trim($this->get("config.modified_since"));
                    if($this->is("jobs.job.$j.@attributes.modified_since"))
                    {
                        $modified_since = (bool)$this->get("jobs.job.$j.@attributes.modified_since");
                    }
                    $time_offset = $this->get("config.time_offset", 0);
                    $exclude = null;
                    if($this->is("jobs.job.$j.excludes.exclude"))
                    {
                        $exclude = $this->get("jobs.job.$j.excludes.exclude");
                        if(!is_array($exclude))
                        {
                            $exclude = array($exclude);
                        }
                    }
                    $this->log("..using class: " . get_class($this->_conn), self::LOG_NOTICE);
                    $this->log("..using compare mode: $compare", self::LOG_NOTICE);
                    $this->log("..using resync option: " . (($resync) ? "yes" : "no"), self::LOG_NOTICE);
                    $this->log("..using skip rules: $skip", self::LOG_NOTICE);
                    $this->log("..using chmod value: $chmod", self::LOG_NOTICE);
                    $this->log("..using chown value: $chown", self::LOG_NOTICE);
                    $this->log("..using chgrp value: $chgrp", self::LOG_NOTICE);
                    $this->log("..using modified since value: ".((!empty($modified_since)) ? $modified_since : ""), self::LOG_NOTICE);
                    $this->log("..using time offset value: ".$time_offset, self::LOG_NOTICE);

                    //testing source dir
                    $source = rtrim($this->get("config.sourcebase"), DIRECTORY_SEPARATOR."*") . DIRECTORY_SEPARATOR . trim($v['source'], DIRECTORY_SEPARATOR."*") . DIRECTORY_SEPARATOR;
                    $source = DIRECTORY_SEPARATOR . ltrim($source, DIRECTORY_SEPARATOR);
                    $this->log("...validating source dir: $source", self::LOG_NOTICE);
                    if(!is_dir($source) && is_readable($source))
                    {
                        $this->log("....dir: $source FAILED (not found or not readable)", self::LOG_ERROR, true);
                    }

                    //testing target dir and setting current working directory
                    if($this->is("config.targetbase"))
                    {
                        $cwd = $this->get("config.targetbase");
                        if($cwd === DIRECTORY_SEPARATOR)
                        {
                            $this->_conn->setCwd("/");
                        }else{
                            $this->_conn->setCwd(DIRECTORY_SEPARATOR . trim($this->get("config.targetbase"), DIRECTORY_SEPARATOR."*") .  DIRECTORY_SEPARATOR);
                        }
                    }else{
                        $this->_conn->setCwd();
                    }
                    $target = DIRECTORY_SEPARATOR . trim($v['target'], DIRECTORY_SEPARATOR."*") . DIRECTORY_SEPARATOR;
                    $this->log("...validating target dir: $target", self::LOG_NOTICE);

                    //testing target dir
                    if(!$this->_conn->testDir($target))
                    {
                        $this->log("....dir: $target FAILED (not found or not writeable)", self::LOG_ERROR, true);
                    }

                    //testing for user
                    if(!empty($chown))
                    {
                        if(!$this->_conn->isOwn($chown, $target))
                        {
                            $this->log("....user: $chown does not exist on target server or permissions for chown denied", self::LOG_ERROR, true);
                        }
                    }

                    //testing for group
                    if(!empty($chgrp))
                    {
                        if(!$this->_conn->isGrp($chgrp, $target))
                        {
                            $this->log("....group: $chgrp does not exist on target server or permissions for chgrp denied", self::LOG_ERROR, true);
                        }
                    }

                    $skip = explode(",", str_replace(array(";", ".", "*"), array(",", "", ""), $skip));

                    //prepare actions
                    $actions = false;
                    if($this->is("jobs.job.$j.actions.action"))
                    {
                        $actions = array();
                        foreach($v['actions']['action'] as &$a)
                        {
                            $a['@value'] = trim($a['@value'], ' *');
                            if(preg_match('/\.([a-z0-9]{2,})$/i', $a['@value']))
                            {
                                if(stristr($a['@value'], $target))
                                {
                                    $p = DIRECTORY_SEPARATOR . ltrim($a['@value'], DIRECTORY_SEPARATOR);
                                    $r = "#^" . addslashes(DIRECTORY_SEPARATOR . ltrim($a['@value'], DIRECTORY_SEPARATOR)) . "$#i";
                                }else{
                                    $p = $target . ltrim($a['@value'], DIRECTORY_SEPARATOR);
                                    $r = "#^" . addslashes($target . ltrim($a['@value'], DIRECTORY_SEPARATOR)) . "$#i";
                                }
                            }else{
                                if(stristr($a['@value'], $target))
                                {
                                    $p = DIRECTORY_SEPARATOR . trim($a['@value'], DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
                                    $r = "#^" . addslashes(DIRECTORY_SEPARATOR  . trim($a['@value'], DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR) . ".*#i";
                                }else{
                                    $p = $target . trim($a['@value'], DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
                                    $r = "#^" . addslashes($target . trim($a['@value'], DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR) . ".*#i";
                                }
                            }
                            $actions[md5($p)] = array($a['@attributes']['type'], $r, $p);
                        }
                    }

                    //prepare modified since value
                    if(!empty($modified_since))
                    {
                        $modified_since = trim($modified_since);
                        //assume timestamp
                        if(is_numeric($modified_since) && (int)$modified_since == $modified_since){
                            $modified_since = (int)$modified_since;
                            //assume date/time
                        }else if((bool)preg_match("/^([\d]{1,2})(?:\-|\/|\.)([\d]{1,2})(?:\-|\/|\.)([\d]{2,4})\s+([\d]{2})(?:\:)([\d]{2})(?:\:)([\d]{2})$/i", $modified_since, $m)){
                            $modified_since = mktime((int)$m[4], (int)$m[5], (int)$m[6], (int)$m[1], (int)$m[2], (int)$m[3]);
                            //assume date
                        }else if((bool)preg_match("/^([\d]{1,2})(?:\-|\/.)([\d]{1,2})(?:\-|\/.)([\d]{2,4})$/i", $modified_since, $m)){
                            $modified_since = mktime(0, 0, 0, (int)$m[1], (int)$m[2], (int)$m[3]);
                        }else{
                            throw new Exception("modified since date: $modified_since is not a valid date/time");
                        }
                    }

                    //prepare offset value
                    if(!empty($time_offset))
                    {
                        if(is_numeric($time_offset)){
                            $time_offset = (int)$time_offset;
                        }else{
                            throw new Exception("server time offset: $time_offset is not a valid value");
                        }
                    }

                    //prepare exclude values
                    if($exclude !== null)
                    {
                        foreach($exclude as &$ex)
                        {
                            $ex = DIRECTORY_SEPARATOR . ltrim(trim($ex, " *"), DIRECTORY_SEPARATOR);
                            //the exclude rule is a absolute path to a source directory
                            if(@is_dir($ex)){
                                $ex = "#^" . preg_quote(DIRECTORY_SEPARATOR . trim($ex, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR) . ".*#i";
                                //the exclude rule is a relative path to directory
                            }else if(@is_dir($source . ltrim($ex, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR)){
                                $ex = "#^" . preg_quote($source . trim($ex, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR). ".*#i";
                                //the exclude rule is a absolute path to a source file
                            }else if(is_file($ex)){
                                $ex = "#^" . preg_quote($ex) . "$#i";
                                //the exclude rule is a relative path to a source file
                            }else if(is_file($source . ltrim($ex, DIRECTORY_SEPARATOR))){
                                $ex = "#^" . preg_quote($source . ltrim($ex, DIRECTORY_SEPARATOR)) . "$#i";
                                //the exclude rule is a dir
                            }else if(stristr($ex, ((strpos($ex, $source) !== false) ? $source : $target)) !== false && !preg_match('/\.([\w]{2,})$/i', $ex)){
                                $ex = "#^" . preg_quote($ex). ".*#i";
                                //the exclude rule is a file
                            }else{
                                $ex = "#(.*)" . preg_quote($ex) . "$#i";
                            }
                        }
                        unset($ex);
                    }

                    //iterate to source directories and sync
                    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($source), RecursiveIteratorIterator::SELF_FIRST);
                    foreach($iterator as $i)
                    {
                        $source_absolute_path   = ($i->isDir()) ? rtrim($i->__toString(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR : $i->__toString();
                        $source_relative_path   = DIRECTORY_SEPARATOR . trim(str_replace($source, "", $source_absolute_path), DIRECTORY_SEPARATOR);
                        $target_absolute_path   = $target . trim($source_relative_path, DIRECTORY_SEPARATOR);
                        $tmp[]                  = $source_relative_path;

                        //get permissions and convert accordingly
                        if(($source_permission = @fileperms($source_absolute_path)) !== false)
                        {
                            if(!empty($chmod))
                            {
                                $source_permission_num = octdec((string)(int)$chmod);
                                $source_permission_str = str_pad(trim($chmod), 4, 0, STR_PAD_LEFT);
                            }else{
                                $source_permission_num = $this->getMod($source_permission);
                                $source_permission_str = substr(decoct($source_permission), -4);
                            }
                        }else{
                            $this->log("...file/dir: $source_absolute_path is skipped because unable to get file permission from source file/dir", self::LOG_ERROR);
                            continue 1;
                        }

                        //get chown user
                        $owner = fileowner($source_absolute_path);
                        if($owner !== false && ($owner = posix_getpwuid((int)$owner)) !== false)
                        {
                            if(!empty($chown))
                            {
                                if($this->_conn instanceof Phpseclib_Sftp)
                                {
                                    if((int)$owner['uid'] === (int)$chown)
                                    {
                                        $chown = "";
                                    }
                                }else{
                                    if(strtolower(trim($owner['name'])) === strtolower(trim((string)$chown)))
                                    {
                                        $chown = "";
                                    }
                                }
                            }
                        }else{
                            $this->log("...file/dir: $source_absolute_path is skipped because unable to get owner from source file/dir", self::LOG_ERROR);
                            continue 1;
                        }

                        //get chgrp group
                        $group = filegroup($source_absolute_path);
                        if($group !== false && ($group = posix_getgrgid((int)$group)) !== false)
                        {
                            if(!empty($chgrp))
                            {
                                if($this->_conn instanceof Phpseclib_Sftp)
                                {
                                    if((int)$group['gid'] === (int)$chgrp)
                                    {
                                        $chgrp = "";
                                    }
                                }else{
                                    if(strtolower(trim($group['name'])) === strtolower(trim((string)$chgrp)))
                                    {
                                        $chgrp = "";
                                    }
                                }
                            }
                        }else{
                            $this->log("...file/dir: $source_absolute_path is skipped because unable to get group from source file/dir", self::LOG_ERROR);
                            continue 1;
                        }

                        if($exclude !== null)
                        {
                            foreach($exclude as $ex)
                            {
                                if((bool)preg_match($ex, $source_absolute_path))
                                {
                                    $this->log("...file/dir: $source_absolute_path is skipped from sync since file/dir was found in exclude rule: $ex", self::LOG_NOTICE);
                                    continue 2;
                                }
                            }
                        }

                        if(!empty($modified_since) !== null && !$i->isDir() && ((int)$i->getMTime() + $time_offset) < $modified_since)
                        {
                            $this->log("...file: $source_absolute_path is skipped from sync since file modification time: ".strftime("%Y-%m-%d %H:%M:%S", $i->getMTime()) . (($time_offset > 0) ? "+ time offset" : "")." is < ".strftime("%m-%d-%y %H:%M:%S", $modified_since), self::LOG_NOTICE);
                            continue 1;
                        }

                        if(!$i->isDir())
                        {
                            $ext = strtolower(str_replace(".", "", trim(substr($source_absolute_path, strrpos($source_absolute_path, ".") + 1))));
                            if(sizeof($skip) > 0 && in_array($ext, $skip))
                            {
                                $this->log("...file: $source_absolute_path is skipped from sync because of skip rule in place", self::LOG_NOTICE);
                                continue;
                            }
                            if($this->_conn->isFile($target_absolute_path))
                            {
                                if($compare === "date")
                                {
                                    if((int)$i->getMTime() > $this->_conn->fileTime($target_absolute_path))
                                    {
                                        $this->log("...file: $source_absolute_path already exists on target server at: $target_absolute_path and will be overwritten since source file is newer", self::LOG_NOTICE);
                                        if($this->_mode === self::MODE_LIVE || $this->_mode === self::MODE_LIVE_LOGGED)
                                        {
                                            if($this->_conn->copy($source_absolute_path, $target_absolute_path, $source_permission_num))
                                            {
                                                $this->log("....file: $source_absolute_path OK", self::LOG_SUCCESS);
                                            }else{
                                                $this->log("....file: $source_absolute_path FAILED", self::LOG_ERROR);
                                            }
                                            if(!empty($chown))
                                            {
                                                $this->_conn->chOwn($target_absolute_path, $chown);
                                            }
                                            if(!empty($chgrp))
                                            {
                                                $this->_conn->chGrp($target_absolute_path, $chgrp);
                                            }
                                        }
                                    }else{
                                        $this->log("...file: $source_absolute_path already exists on target server at: $target_absolute_path and will NOT be overwritten since target file is newer", self::LOG_NOTICE);
                                    }
                                }else if($compare === "size"){
                                    if((int)$i->getSize() !== $this->_conn->fileSize($target_absolute_path))
                                    {
                                        $this->log("...file: $source_absolute_path already exists on target server at: $target_absolute_path and will be overwritten since file size has changed", self::LOG_NOTICE);
                                        if($this->_mode === self::MODE_LIVE || $this->_mode === self::MODE_LIVE_LOGGED)
                                        {
                                            if($this->_conn->copy($source_absolute_path, $target_absolute_path, $source_permission_num))
                                            {
                                                $this->log("....file: $source_absolute_path OK", self::LOG_SUCCESS);
                                            }else{
                                                $this->log("....file: $source_absolute_path FAILED", self::LOG_ERROR);
                                            }
                                            if(!empty($chown))
                                            {
                                                $this->_conn->chOwn($target_absolute_path, $chown);
                                            }
                                            if(!empty($chgrp))
                                            {
                                                $this->_conn->chGrp($target_absolute_path, $chgrp);
                                            }
                                        }
                                    }else{
                                        $this->log("...file: $source_absolute_path already exists on target server at: $target_absolute_path and will NOT be overwritten since file size has NOT changed", self::LOG_NOTICE);
                                    }
                                }else{
                                    $this->log("...file: $source_absolute_path already exists on target server and will be overwritten without comparing", self::LOG_NOTICE);
                                    if($this->_mode === self::MODE_LIVE || $this->_mode === self::MODE_LIVE_LOGGED)
                                    {
                                        if($this->_conn->copy($source_absolute_path, $target_absolute_path, $source_permission_num))
                                        {
                                            $this->log("....file: $source_absolute_path OK", self::LOG_SUCCESS);
                                        }else{
                                            $this->log("....file: $source_absolute_path FAILED", self::LOG_ERROR);
                                        }
                                        if(!empty($chown))
                                        {
                                            $this->_conn->chOwn($target_absolute_path, $chown);
                                        }
                                        if(!empty($chgrp))
                                        {
                                            $this->_conn->chGrp($target_absolute_path, $chgrp);
                                        }
                                    }
                                }
                            }else{
                                $this->log("...file: $source_absolute_path does not exists on target server and will be copied", self::LOG_NOTICE);
                                if($this->_mode === self::MODE_LIVE || $this->_mode === self::MODE_LIVE_LOGGED)
                                {
                                    if($this->_conn->copy($source_absolute_path, $target_absolute_path, $source_permission_num))
                                    {
                                        $this->log("....file: $source_absolute_path OK", self::LOG_SUCCESS);
                                    }else{
                                        $this->log("....file: $source_absolute_path FAILED", self::LOG_ERROR);
                                    }
                                    if(!empty($chown))
                                    {
                                        $this->_conn->chOwn($target_absolute_path, $chown);
                                    }
                                    if(!empty($chgrp))
                                    {
                                        $this->_conn->chGrp($target_absolute_path, $chgrp);
                                    }
                                }
                            }
                        }else{
                            if(!$this->_conn->isDir($target_absolute_path))
                            {
                                $this->log("...dir: $target_absolute_path does not exists on target server and will be created", self::LOG_NOTICE);
                                if($this->_mode === self::MODE_LIVE || $this->_mode === self::MODE_LIVE_LOGGED)
                                {
                                    if($this->_conn->mkDir($target_absolute_path, $source_permission_num))
                                    {
                                        $this->log("....dir: $source_absolute_path OK", self::LOG_SUCCESS);
                                    }else{
                                        $this->log("....dir: $source_absolute_path FAILED", self::LOG_ERROR);
                                    }
                                    if(!empty($chown))
                                    {
                                        $this->_conn->chOwn($target_absolute_path, $chown);
                                    }
                                    if(!empty($chgrp))
                                    {
                                        $this->_conn->chGrp($target_absolute_path, $chgrp);
                                    }
                                }
                            }
                        }
                        @clearstatcache();
                    }

                    //iterate to target directories and apply actions if exist
                    if($actions)
                    {
                        $this->log("..applying additional actions for target directory", self::LOG_NOTICE);
                        if(($iterator = $this->_conn->lsDir($target)) !== false)
                        {
                            foreach($iterator as $i)
                            {
                                $i = DIRECTORY_SEPARATOR . ltrim($i, DIRECTORY_SEPARATOR);
                                $i = (is_dir($i)) ? rtrim($i, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR : $i;
                                foreach($actions as $a)
                                {
                                    if(preg_match($a[1], $i))
                                    {
                                        $this->log("...target file/dir: $i has been detected matching additional action: " . $a[0], self::LOG_NOTICE);
                                        if($this->_mode === self::MODE_LIVE || $this->_mode === self::MODE_LIVE_LOGGED)
                                        {
                                            switch($a[0])
                                            {
                                                case 'delete':
                                                    $type = $this->_conn->fileType($i);
                                                    if($type !== false)
                                                    {
                                                        if($type === "dir")
                                                        {
                                                            if($this->_conn->rmDir($i))
                                                            {
                                                                $this->log("....dir: $i deleted OK", self::LOG_SUCCESS);
                                                            }else{
                                                                $this->log("....dir: $i deleted FAILED", self::LOG_ERROR);
                                                            }
                                                        }else{
                                                            if($this->_conn->rmFile($i))
                                                            {
                                                                $this->log("....file: $i deleted OK", self::LOG_SUCCESS);
                                                            }else{
                                                                $this->log("....file: $i deleted FAILED", self::LOG_ERROR);
                                                            }
                                                        }
                                                    }
                                                    break;
                                                default:
                                                    $this->log("...additional action type: ".$a[0]." is not valid - skipping action", self::LOG_ERROR);
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                        }else{
                            $this->log("..dir: $target could not be opened for additional actions", self::LOG_ERROR);
                        }
                        @clearstatcache();
                    }

                    //resync to find orphaned files
                    if($resync)
                    {
                        $this->log("..searching for orphaned files/dirs", self::LOG_NOTICE);
                        if(($iterator = $this->_conn->lsDir($target)) !== false)
                        {
                            foreach($iterator as $i)
                            {
                                $_i = DIRECTORY_SEPARATOR . ltrim(str_replace($target, "", $i), DIRECTORY_SEPARATOR);
                                if($exclude !== null)
                                {
                                    foreach($exclude as $ex)
                                    {
                                        //skip all files/dir that match exclude rule for target OR source
                                        if((bool)preg_match($ex, $i) || (bool)preg_match(preg_replace('#'.preg_quote($source).'#i', $target, $ex), $i))
                                        {
                                            continue 2;
                                        }
                                    }
                                }
                                if(!in_array($_i, $tmp))
                                {
                                    $this->log("...file/dir: $i has been detected as orphaned and will be deleted", self::LOG_NOTICE);
                                    if($this->_mode === self::MODE_LIVE || $this->_mode === self::MODE_LIVE_LOGGED)
                                    {
                                        $type = $this->_conn->fileType($i);
                                        if($type !== false)
                                        {
                                            if($type === "dir")
                                            {
                                                if($this->_conn->rmDir($i))
                                                {
                                                    $this->log("....dir: $i deleted OK", self::LOG_SUCCESS);
                                                }else{
                                                    $this->log("....dir: $i deleted FAILED", self::LOG_ERROR);
                                                }
                                            }else{
                                                if($this->_conn->rmFile($i))
                                                {
                                                    $this->log("....file: $i deleted OK", self::LOG_SUCCESS);
                                                }else{
                                                    $this->log("....file: $i deleted FAILED", self::LOG_ERROR);
                                                }
                                            }
                                        }else{
                                            $this->log("....file/dir: $i type could not be identified", self::LOG_ERROR);
                                        }
                                    }
                                }
                            }
                        }else{
                            $this->log("..dir: $target could not be opened for orphaned files lookup", self::LOG_ERROR);
                        }
                    }
                    $this->log(".job: $j with id: $id completed", self::LOG_NOTICE);
                    if(($this->_mode === self::MODE_LIVE || $this->_mode === self::MODE_LIVE_LOGGED) && !array_key_exists('force', $this->_options))
                    {
                        @file_put_contents($this->_jobFile, implode(",", array(basename($this->_xml), $id, time(), strftime('%Y-%m-%d %H:%M:%S', time()))) . "\n", FILE_APPEND);
                    }
                }else{
                    $this->log("there is nothing to sync for job: $j", self::LOG_NOTICE);
                }
            }
            catch(Exception $e)
            {
                $this->log($e->getMessage(), self::LOG_ERROR);
            }
            @clearstatcache();
            $j++;
        }
        if($this->_conn->hasError())
        {
            $this->log("sync complete with errors: " .$this->_conn->countError(), self::LOG_NOTICE);
            if($this->_mode === self::MODE_TEST || $this->_mode === self::MODE_TEST_LOGGED)
            {
                $this->log("please run again in test logged (test-logged) mode for extended error logging", self::LOG_NOTICE);
            }else{
                $this->log("please see log report: ".$this->_logFile." for extended errors", self::LOG_NOTICE);
            }
        }else{
            $this->log("sync complete", self::LOG_NOTICE);
        }
    }


    /**
     * @desc gets value from config file
     * @param null|string $key expects string key in form of node.node.node
     * @param string $default optional return value if key was not found
     * @return mixed|null|string
     */
    protected function get($key = null, $default = "")
    {
        $val = null;

        if(($val = $this->is($key)) !== false)
        {
            return $val;
        }
        return $default;
    }


    /**
     * @desc checks whether a key (config parameter) is set in config xml or not
     * @param null|string $key expects string key in form of node.node.node
     * @return bool
     */
    protected function is($key = null)
    {
        if($key !== null)
        {
            $keys = explode(".", strtolower(trim($key)));
            $xml =& $this->_xmlArray;
            $res = @eval("return \$xml['".implode("']['", $keys)."'];");
            if($res !== null && !empty($res))
            {
                return $res;
            }
        }
        return false;
    }


    /**
     * @desc recieved log messages and decides to output to console and/or log
     * @param array|string $mixed expects log entry
     * @param string $level optional expects log level
     * @param boolean $quit optional whether to quit sync or not
     * @throws Exception
     * @return void
     */
    public function log($mixed, $level = self::LOG_NOTICE, $quit = false)
    {
        if($level === self::LOG_ERROR || $level === self::LOG_EXCEPTION)
        {
            $this->_err += (is_array($mixed)) ? sizeof($mixed) : 1;
        }
        foreach((array)$mixed as $m)
        {
            if($this->_profile)
            {
                $this->_log[] = array(time(), number_format(round(microtime(true) - $this->_start, 2), 2, '.', ''), memory_get_usage(false), (string)$m, (string)$level);
            }else{
                $this->_log[] = array(time(), (string)$m, (string)$level);
            }
        }
        if($level === self::LOG_EXCEPTION)
        {
            $this->__destruct();
            throw new Exception($mixed);
        }
        if(!array_key_exists('silent', $this->_options))
        {
            $this->console($mixed, $level);
        }
        if((bool)$quit)
        {
            exit(0);
        }
    }


    /**
     * @param null|array|string $mixed expects log entry
     * @param string $level optional expects log level
     * @return void
     */
    protected function console($mixed = null, $level = null)
    {
        if($mixed !== null)
        {
            if($level === null)
            {
                $level = self::LOG_NOTICE;
            }
            $level = strtolower(trim($level));
            switch($level)
            {
                case self::LOG_ERROR:
                    foreach((array)$mixed as $m)
                    {
                        echo "\033[01;31m".trim($m)."\033[0m\n";
                    }
                    break;
                case self::LOG_EXCEPTION:
                    foreach((array)$mixed as $m)
                    {
                        echo "\033[01;31m".trim($m)."\033[0m\n";
                    }
                    break;
                case self::LOG_SUCCESS:
                    foreach((array)$mixed as $m)
                    {
                        echo "\033[01;34m".trim($m)."\033[0m\n";
                    }
                    break;
                default:
                    foreach((array)$mixed as $m)
                    {
                        echo $m . "\n";
                    }
            }
        }
    }


    /**
     * @desc translates DOM xml structure/object into array
     * @param DOMNode|null $node expects the root/child node to recursive transform childs into array
     * @return array
     */
    protected function xmlToArray(DOMNode $node = null)
    {
        $result = array();
        $group = array();
        $attributes = null;
        $children = null;
        if($node->hasAttributes())
        {
            $attributes = $node->attributes;
            foreach($attributes as $k => $v)
            {
                $result['@attributes'][$v->name] = $v->value;
            }
        }
        $children = $node->childNodes;
        if(!empty($children))
        {
            if((int)$children->length === 1)
            {
                $child = $children->item(0);

                if($child !== null && $child->nodeType === XML_TEXT_NODE)
                {
                    $result['@value'] = $child->nodeValue;
                    if(count($result) == 1)
                    {
                        return $result['@value'];
                    }else{
                        return $result;
                    }
                }
            }
            for($i = 0; $i < (int)$children->length; $i++)
            {
                $child = $children->item($i);

                if($child !== null)
                {
                    if(!isset($result[$child->nodeName]))
                    {
                        $result[$child->nodeName] = $this->xmlToArray($child);
                    }else{
                        if(!isset($group[$child->nodeName]))
                        {
                            $result[$child->nodeName] = array($result[$child->nodeName]);
                            $group[$child->nodeName] = 1;
                        }
                        $result[$child->nodeName][] = $this->xmlToArray($child);
                    }
                }
            }
        }
        return $result;
    }


    /**
     * @desc gets file permission from file
     * @static
     * @param null $mixed expects the file permission as octal or none octal
     * @return bool|int
     */
    public static function getMod($mixed = null)
    {
        if($mixed !== null)
        {
            $val = 0;
            if(!is_numeric($mixed))
            {
                $perms = (int)@fileperms($mixed);
            }else{
                $perms = (int)$mixed;
            }
            if($perms !== 0)
            {
                // Owner; User
                $val += (($perms & 0x0100) ? 0x0100 : 0x0000); //Read
                $val += (($perms & 0x0080) ? 0x0080 : 0x0000); //Write
                $val += (($perms & 0x0040) ? 0x0040 : 0x0000); //Execute
                // Group
                $val += (($perms & 0x0020) ? 0x0020 : 0x0000); //Read
                $val += (($perms & 0x0010) ? 0x0010 : 0x0000); //Write
                $val += (($perms & 0x0008) ? 0x0008 : 0x0000); //Execute
                // Global; World
                $val += (($perms & 0x0004) ? 0x0004 : 0x0000); //Read
                $val += (($perms & 0x0002) ? 0x0002 : 0x0000); //Write
                $val += (($perms & 0x0001) ? 0x0001 : 0x0000); //Execute
                // Misc
                $val += (($perms & 0x40000) ? 0x40000 : 0x0000); //temporary file (01000000)
                $val += (($perms & 0x80000) ? 0x80000 : 0x0000); //compressed file (02000000)
                $val += (($perms & 0x100000) ? 0x100000 : 0x0000); //sparse file (04000000)
                $val += (($perms & 0x0800) ? 0x0800 : 0x0000); //Hidden file (setuid bit) (04000)
                $val += (($perms & 0x0400) ? 0x0400 : 0x0000); //System file (setgid bit) (02000)
                $val += (($perms & 0x0200) ? 0x0200 : 0x0000); //Archive bit (sticky bit) (01000)
                return $val;
            }
        }
        return false;
    }


    /**
     * @desc class destructor writes log report if existent
     */
    public function __destruct()
    {
        if($this->_mode === self::MODE_TEST_LOGGED || $this->_mode === self::MODE_LIVE_LOGGED)
        {
            if(sizeof($this->_log) >= 1)
            {
                $txt = "Sync report for: ".$this->_xml." on: ". strftime("%Y-%m-%d %H:%M:%S", time())."\r\n";
                foreach($this->_log as $log)
                {
                    if($this->_profile)
                    {
                        $txt .= strftime("%Y-%m-%d %H:%M:%S", $log[0]). ", ". $log[1] .", " . $log[2] . ", " . strtoupper($log[4]).", " . $log[3] . "\n";
                    }else{
                        $txt .= strftime("%Y-%m-%d %H:%M:%S", $log[0]). ", " . strtoupper($log[2]).", " . $log[1] . "\n";
                    }
                }
                @file_put_contents($this->_logFile, $txt);
            }
        }
    }
}


/**
 * @author setcookie <set@cooki.me>
 * @link set.cooki.me
 * @copyright Copyright &copy; 2011-2012 setcookie
 * @license http://www.gnu.org/copyleft/gpl.html
 * @package syncd
 * @since 0.0.1
 * @desc abstract file transfer class serves as base class for all protocol dependend sub classes/adapters
 */
abstract class Ft
{
    /**
     * set with the connection resource handler depending on protocol implementation
     * @var resource $_conn
     */
    protected $_conn = null;

    /**
     * contains the host name/url/ip according to protocol
     * @var string $_host
     */
    protected $_host = null;

    /**
     * contains the port number according to protocol
     * @var int $_port
     */
    protected $_port = null;

    /**
     * contains the user name if authentication is done by user/pass
     * @var string $_user
     */
    protected $_user = null;

    /**
     * contains the password if authentication is done by user/pass
     * @var string $_pass
     */
    protected $_pass = null;

    /**
     * contains all errors in form of error pool
     * @var array $_err
     */
    protected $_err = array();

    /**
     * contains syncd class instance so protocol adapter can be embeded in workflow
     * @var null|Syncd $_syncd
     */
    protected $_syncd = null;

    /**
     * contains current working directory accoring to adapter
     * @var string $_cwd
     */
    protected $_cwd = "";


    /**
     * @desc initializes base class
     * @param null|Syncd $syncd expects the syncd instance as parent workflow container
     * @public
     * @throws Exception
     */
    public function __construct(Syncd $syncd = null)
    {
        if($syncd !== null)
        {
            $this->_syncd = $syncd;
        }else{
            throw new Exception("syncd instance must be passed in first parameter");
        }
    }

    /**
     * @desc init default method setting connection settings only used in s(ftp) protocols
     * @param string $host (mandatory) expects the host name string
     * @param int $port (optional) expects the port to connect to host
     * @param string $user (mandatory) expects the user name for authentication
     * @param string $pass (mandatory) expects the password for authentication
     * @public
     * @return void
     */
    public function init($host = null, $port = 22, $user = null, $pass = null)
    {
        if($host !== null && $user !== null && $pass !== null)
        {
            $this->_host = trim((string)$host);
            $this->_port = (int)$port;
            $this->_user = trim((string)$user);
            $this->_pass = trim((string)$pass);
        }
    }

    /**
     * @desc return boolean value if error has occured or not
     * @public
     * @return bool
     */
    public function hasError()
    {
        return (sizeof($this->_err) > 0) ? true : false;
    }

    /**
     * @desc returns error pool containing all errors as array
     * @public
     * @return array
     */
    public function getError()
    {
        return $this->_err;
    }

    /**
     * @desc returns the error count - number of total errors
     * @public
     * @return int
     */
    public function countError()
    {
        return sizeof($this->_err);
    }

    /**
     * @desc log error to console via syncd instance passed in class constructor
     * @param string $err expects error string
     * @protected
     * @return void
     */
    protected function error($err = null)
    {
        if($err !== null)
        {
            $this->_err[] = $err;
            if($this->_syncd !== null)
            {
                $this->_syncd->log("...." . $err, Syncd::LOG_ERROR);
            }
        }
    }

    abstract public function connect();
    abstract public function testDir();
    abstract public function isDir();
    abstract public function isFile();
    abstract public function fileTime($file = null, $m = "m");
    abstract public function fileSize($file = null);
    abstract public function copy($source = null, $target = null, $mode = null);
    abstract public function mkDir($dir = null);
    abstract public function lsDir($dir = null);
    abstract public function rmDir($dir = null);
    abstract public function rmFile($file = null);
    abstract public function fileType($file = null);
    abstract public function setCwd($cwd = null);
    abstract public function chOwn($file = null, $user = null);
    abstract public function chGrp($file = null, $group = null);
    abstract public function isOwn($user = null, $dir = null);
    abstract public function isGrp($group = null, $dir = null);
}

/**
 * @author setcookie <set@cooki.me>
 * @link set.cooki.me
 * @copyright Copyright &copy; 2011-2012 setcookie
 * @license http://www.gnu.org/copyleft/gpl.html
 * @package syncd
 * @since 0.0.1
 * @desc concrete implementation for external phpseclib sftp protocol class
 */
class Phpseclib_Sftp extends Ft
{
    /**
     * @var null
     */
    public $_sftp = null;

    /**
     * @throws Exception
     */
    public function connect()
    {
        $this->_sftp = new Net_SFTP($this->_host, $this->_port);
        if(!$this->_sftp->login($this->_user, $this->_pass))
        {
            throw new Exception("unable to authenticate to sftp connection");
        }
    }

    /**
     * @param null $dir
     * @return bool
     */
    public function testDir($dir = null)
    {
        if($this->isDir($dir))
        {
            $file = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$dir, DIRECTORY_SEPARATOR) . ".tmp";
            if($this->_sftp->put($file, "") !== false)
            {
                $this->_sftp->delete($file);
                return true;
            }
        }
        return false;
    }

    /**
     * @param null $dir
     * @return bool
     */
    public function isDir($dir = null)
    {
        if($dir !== null)
        {
            $dir = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$dir, DIRECTORY_SEPARATOR);
            if($this->_sftp->nlist($dir) !== false)
            {
                return true;
            }
        }
        return false;
    }

    /**
     * @param null $file
     * @return bool
     */
    public function isFile($file = null)
    {
        if($file !== null)
        {
            $file = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$file, DIRECTORY_SEPARATOR);
            if($this->_sftp->size($file) !== false)
            {
                return true;
            }
        }
        return false;
    }

    /**
     * @param null $file
     * @param string $m
     * @return int
     */
    public function fileTime($file = null, $m = "m")
    {
        if($file !== null)
        {
            $file = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$file, DIRECTORY_SEPARATOR);
            if(($stat = $this->_sftp->stat($file)) !== false)
            {
                switch(strtolower(trim((string)$m)))
                {
                    case "a":
                        return (int)$stat['atime'];
                    default:
                        return (int)$stat['mtime'];
                }
            }else{
                $this->error("unable to obtain file stats from: $file");
            }
        }
        return 0;
    }

    /**
     * @param null $file
     * @return int
     */
    public function fileSize($file = null)
    {
        if($file !== null)
        {
            $file = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$file, DIRECTORY_SEPARATOR);
            if(($size = $this->_sftp->size($file)) !== false)
            {
                return (int)$size;
            }else{
                $this->error("unable to obtain filesize from: $file");
            }
        }
        return 0;
    }

    /**
     * @param null $source
     * @param null $target
     * @param null $mode
     * @return bool
     */
    public function copy($source = null, $target = null, $mode = null)
    {
        $return = false;

        if($source !== null && $target !== null)
        {
            if($this->_cwd === "/"){
                $target = $this->_cwd . ltrim((string)$target, DIRECTORY_SEPARATOR);
            }else{
                $target = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$target, DIRECTORY_SEPARATOR);
            }
            if($mode !== null)
            {
                $return = $this->_sftp->put($target, $source, NET_SFTP_LOCAL_FILE);
                if($return !== false)
                {
                    $return = $this->_sftp->chmod($mode, $target, false);
                }
            }else{
                $return = $this->_sftp->put($target, $source, NET_SFTP_LOCAL_FILE);
            }
            if(!$return)
            {
                $this->error("unable to scp copy file: $source to: $target");
            }
        }
        @clearstatcache();
        return $return;
    }

    /**
     * @param null $dir
     * @param int $mode
     * @return bool
     */
    public function mkDir($dir = null, $mode = 0775)
    {
        if($dir !== null)
        {
            $dir = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$dir, DIRECTORY_SEPARATOR);
            if($this->_sftp->mkdir($dir, $mode))
            {
                return true;
            }else{
                $this->error("unable to create dir: $dir with permissions: $mode");
            }
        }
        return false;
    }

    /**
     * @param null $dir
     * @return array|bool
     */
    public function lsDir($dir = null)
    {
        $ls = false;

        if($dir !== null)
        {
            if(!function_exists('_lsDir'))
            {
                function _lsDir($b = null, $d = null, &$t,  Array &$tmp = array())
                {
                    $b = rtrim($b, DIRECTORY_SEPARATOR);
                    $d = DIRECTORY_SEPARATOR . trim($d, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;

                    if($t->isDir($d))
                    {
                        foreach((array)$t->_sftp->nlist($b . $d) as $f)
                        {
                            $f = ltrim($f, DIRECTORY_SEPARATOR);
                            if(substr($f, 0, 1) !== "." && substr($f, 0, 2) !== "..")
                            {
                                $tmp[] = $d . $f;
                                if($t->isDir($d . $f))
                                {
                                    _lsDir($b, $d . $f, $t, $tmp);
                                }
                            }
                        }
                    }else{
                        return false;
                    }
                    @clearstatcache();
                    return array_reverse($tmp);
                }
            }

            $base = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
            $dir = ltrim((string)$dir, DIRECTORY_SEPARATOR);

            if(($ls = _lsDir($base, $dir, $this)) !== false)
            {
                return $ls;
            }else{
                $this->error("unable to list dir: " . $base.$dir);
            }
        }
        return false;
    }

    /**
     * @param null $dir
     * @return bool
     */
    public function rmDir($dir = null)
    {
        if($dir !== null)
        {
            $dir = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$dir, DIRECTORY_SEPARATOR);
            if($this->_sftp->delete($dir, true) !== false)
            {
                return true;
            }else{
                $this->error("unable to delete dir: $dir");
            }
        }
        return false;
    }

    /**
     * @param null $file
     * @return bool
     */
    public function rmFile($file = null)
    {
        if($file !== null)
        {
            $file = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$file, DIRECTORY_SEPARATOR);
            if(!$this->_sftp->delete($file, false))
            {
                if($this->_sftp->chmod(0777, $file, false) !== false && $this->_sftp->delete($file, false) !== false)
                {
                    return true;
                }
                $this->error("unable to delete file: $file");
            }else{
                return true;
            }
        }
        return false;
    }

    /**
     * @param null $file
     * @return bool|string
     */
    public function fileType($file = null)
    {
        if($file !== null)
        {
            $file = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$file, DIRECTORY_SEPARATOR);
            if(($stat = $this->_sftp->stat($file)) !== false)
            {
                switch((int)$stat['type'])
                {
                    case 1:
                        return 'file';
                    case 2:
                        return 'dir';
                    default:
                        return false;
                }
            }else{
                $this->error("unable to obtain file type from: $file");
            }
        }
        return false;
    }

    /**
     * @param null $cwd
     * @return string
     * @throws Exception
     */
    public function setCwd($cwd = null)
    {
        if($cwd !== null)
        {
            $this->_cwd = trim((string)$cwd);
        }else{
            if($this->_cwd === "")
            {
                if(($pwd = $this->_sftp->pwd()) !== false)
                {
                    $this->_cwd = rtrim($pwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
                }else{
                    throw new Exception("unable to obtain current working directory from stream");
                }
            }
        }
        return $this->_cwd;
    }

    /**
     * @param null $file
     * @param null $user
     * @return bool
     */
    public function chOwn($file = null, $user = null)
    {
        if($file !== null && $user !== null)
        {
            if($this->_cwd === "/"){
                $file = $this->_cwd . ltrim((string)$file, DIRECTORY_SEPARATOR);
            }else{
                $file = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$file, DIRECTORY_SEPARATOR);
            }
            if($this->_sftp->chown($file, (int)$user) !== false)
            {
                return true;
            }else{
                $this->error("unable to chown file: $file to: $user");
            }
        }
        return false;
    }

    /**
     * @param null $file
     * @param null $group
     * @return bool
     */
    public function chGrp($file = null, $group = null)
    {
        if($file !== null && $group !== null)
        {
            if($this->_cwd === "/"){
                $file = $this->_cwd . ltrim((string)$file, DIRECTORY_SEPARATOR);
            }else{
                $file = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$file, DIRECTORY_SEPARATOR);
            }
            if($this->_sftp->chgrp($file, (int)$group) !== false)
            {
                return true;
            }else{
                $this->error("unable to chgrp file: $file to: $group");
            }
        }
        return false;
    }

    /**
     * @param null $user
     * @param null $dir
     * @return bool
     */
    public function isOwn($user = null, $dir = null)
    {
        $return = false;

        if($user !== null && $dir !== null)
        {
            if($this->isDir($dir))
            {
                $file1 = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$dir, DIRECTORY_SEPARATOR) . ".tmp";
                $file2 = DIRECTORY_SEPARATOR . ltrim((string)$dir, DIRECTORY_SEPARATOR) . ".tmp";
                if($this->_sftp->put($file1, "") !== false)
                {
                    if($this->chOwn($file2, $user))
                    {
                        $return = true;
                    }
                    $this->_sftp->delete($file1);
                }
            }
        }
        return $return;
    }

    /**
     * @param null $group
     * @param null $dir
     * @return bool
     */
    public function isGrp($group = null, $dir = null)
    {
        $return = false;

        if($group !== null && $dir !== null)
        {
            if($this->isDir($dir))
            {
                $file1 = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$dir, DIRECTORY_SEPARATOR) . ".tmp";
                $file2 = DIRECTORY_SEPARATOR . ltrim((string)$dir, DIRECTORY_SEPARATOR) . ".tmp";
                if($this->_sftp->put($file1, "") !== false)
                {
                    if($this->chGrp($file2, $group))
                    {
                        $return = true;
                    }
                    $this->_sftp->delete($file1);
                }
            }
        }
        return $return;
    }
}

/**
 * @author setcookie <set@cooki.me>
 * @link set.cooki.me
 * @copyright Copyright &copy; 2011-2012 setcookie
 * @license http://www.gnu.org/copyleft/gpl.html
 * @package syncd
 * @since 0.0.1
 * @desc concrete implementation of sftp protocol
 */
class Sftp extends Ft
{
    protected $_sftp = null;

    /**
     * @throws Exception
     * @return void
     */
    public function connect()
    {
        if(!$this->_conn = ssh2_connect($this->_host, $this->_port))
        {
            throw new Exception("unable to obtain ssh connection");
        }
        if(!ssh2_auth_password($this->_conn, $this->_user, $this->_pass))
        {
            throw new Exception("unable to authenticate to ssh connection");
        }
        if(!$this->_sftp = ssh2_sftp($this->_conn))
        {
            throw new Exception('unable to obtain sftp connection');
        }
    }

    /**
     * @throws Exception
     * @param null $cwd
     * @return null
     */
    public function setCwd($cwd = null)
    {
        if($cwd !== null)
        {
            $this->_cwd = trim((string)$cwd);
        }else{
            if($this->_cwd === "")
            {
                if(($stream = ssh2_exec($this->_conn, "pwd")) !== false)
                {
                    @stream_set_blocking($stream, true);
                    $this->_cwd = rtrim(trim(stream_get_contents($stream)), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
                    @fclose($stream);
                }else{
                    throw new Exception("unable to obtain current working directory from stream");
                }
            }
        }
        return $this->_cwd;
    }


    /**
     * @param null $dir
     * @return bool
     */
    public function testDir($dir = null)
    {
        if($this->isDir($dir))
        {
            $file = "ssh2.sftp://".$this->_sftp . rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$dir, DIRECTORY_SEPARATOR) . ".tmp";
            if((bool)@file_put_contents($file, " "))
            {
                @unlink($file);
                return true;
            }
        }
        return false;
    }


    /**
     * @param null $dir
     * @return bool
     */
    public function isDir($dir = null)
    {
        if($dir !== null)
        {
            $dir = "ssh2.sftp://".$this->_sftp . rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$dir, DIRECTORY_SEPARATOR);
            if(is_dir($dir))
            {
                return true;
            }
        }
        return false;
    }

    /**
     * @param null $file
     * @return bool
     */
    public function isFile($file = null)
    {
        if($file !== null)
        {
            $file = "ssh2.sftp://".$this->_sftp . rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$file, DIRECTORY_SEPARATOR);
            if(is_file($file))
            {
                return true;
            }
        }
        return false;
    }

    /**
     * @param null $file
     * @param string $m
     * @return int
     */
    public function fileTime($file = null, $m = "m")
    {
        if($file !== null)
        {
            $file = "ssh2.sftp://".$this->_sftp . rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$file, DIRECTORY_SEPARATOR);
            $m = strtolower(trim((string)$m));
            switch($m)
            {
                case "a":
                    if(($t = fileatime($file)) !== false)
                    {
                        return (int)$t;
                    }else{
                        $this->error("unable to obtain fileatime from: $file");
                    }
                    break;
                default:
                    if(($t = filemtime($file)) !== false)
                    {
                        return (int)$t;
                    }else{
                        $this->error("unable to obtain filemtime from: $file");
                    }
            }
        }
        return 0;
    }

    /**
     * @param null $file
     * @return int
     */
    public function fileSize($file = null)
    {
        if($file !== null)
        {
            $file = "ssh2.sftp://".$this->_sftp . rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$file, DIRECTORY_SEPARATOR);
            if(($s = filesize($file)) !== false)
            {
                return (int)$s;
            }else{
                $this->error("unable to obtain filesize from: $file");
            }
        }
        return 0;
    }


    /**
     * @param null $source
     * @param null $target
     * @param null $mode
     * @return bool
     */
    public function copy($source = null, $target = null, $mode = null)
    {
        $return = false;

        if($source !== null && $target !== null)
        {
            if($this->_cwd === "/"){
                $target = $this->_cwd . ltrim((string)$target, DIRECTORY_SEPARATOR);
            }else{
                $target = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$target, DIRECTORY_SEPARATOR);
            }
            if($mode !== null)
            {
                $return = @ssh2_scp_send($this->_conn, $source, $target, $mode);
            }else{
                $return = @ssh2_scp_send($this->_conn, $source, $target);
            }
            if(!$return)
            {
                $this->error("unable to scp copy file: $source to: $target");
            }
        }
        @clearstatcache();
        return $return;
    }

    /**
     * @param null $file
     * @param null $user
     * @return bool
     */
    public function chOwn($file = null, $user = null)
    {
        if($file !== null && $user !== null)
        {
            if($this->_cwd === "/"){
                $file = $this->_cwd . ltrim((string)$file, DIRECTORY_SEPARATOR);
            }else{
                $file = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$file, DIRECTORY_SEPARATOR);
            }
            $return = $this->exec("sudo chown ".trim((string)$user)." $file");
            if(empty($return))
            {
                return true;
            }else{
                $this->error("unable to chown file: $file to: $user");
            }
        }
        return false;
    }

    /**
     * @param null $file
     * @param null $group
     * @return bool
     */
    public function chGrp($file = null, $group = null)
    {
        if($file !== null && $group !== null)
        {
            if($this->_cwd === "/"){
                $file = $this->_cwd . ltrim((string)$file, DIRECTORY_SEPARATOR);
            }else{
                $file = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$file, DIRECTORY_SEPARATOR);
            }
            $return = $this->exec("sudo chgrp ".trim((string)$group)." $file");
            if(empty($return))
            {
                return true;
            }else{
                $this->error("unable to chgrp file: $file to: $group");
            }
        }
        return false;
    }

    /**
     * @param null $user
     * @param null $dir
     * @return bool
     */
    public function isOwn($user = null, $dir = null)
    {
        if($user !== null)
        {
            $return = $this->exec("sudo grep \"^".trim((string)$user).":\" /etc/passwd");
            if(!empty($return))
            {
                return true;
            }
        }
        return false;
    }

    /**
     * @param null $group
     * @param null $dir
     * @return bool
     */
    public function isGrp($group = null, $dir = null)
    {
        if($group !== null)
        {
            $return = $this->exec("sudo grep \"^".trim((string)$group).":\" /etc/group");
            if(!empty($return))
            {
                return true;
            }
        }
        return false;
    }

    /**
     * @param null $dir
     * @param int $mode
     * @return bool
     */
    public function mkDir($dir = null, $mode = 0775)
    {
        if($dir !== null)
        {
            $dir = "ssh2.sftp://".$this->_sftp . rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$dir, DIRECTORY_SEPARATOR);
            if(@mkdir($dir, $mode))
            {
                return true;
            }else{
                $this->error("unable to create dir: $dir with permissions: $mode");
            }
        }
        return false;
    }

    /**
     * @param null $dir
     * @return mixed
     */
    public function lsDir($dir = null)
    {
        $ls = false;

        if($dir !== null)
        {
            if(!function_exists('_lsDir'))
            {
                function _lsDir($b = null, $d = null, Array &$tmp = array())
                {
                    $b = rtrim($b, DIRECTORY_SEPARATOR);
                    $d = DIRECTORY_SEPARATOR . trim($d, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;

                    if(is_dir($b . $d) && ($h = @opendir($b . $d)) !== false)
                    {
                        while(($f = readdir($h)) !== false)
                        {
                            $f = ltrim($f, DIRECTORY_SEPARATOR);
                            if(substr($f, 0, 1) !== "." && substr($f, 0, 2) !== "..")
                            {
                                $tmp[] = $d . $f;
                                if(is_dir($b . $d . $f))
                                {
                                    _lsDir($b, $d . $f, $tmp);
                                }
                            }
                        }
                        @closedir($h);
                    }else{
                        return false;
                    }
                    @clearstatcache();
                    return array_reverse($tmp);
                }
            }

            $base = "ssh2.sftp://".$this->_sftp . rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
            $dir = ltrim((string)$dir, DIRECTORY_SEPARATOR);

            if(($ls = _lsDir($base, $dir)) !== false)
            {
                return $ls;
            }else{
                $this->error("unable to list dir: " . $base.$dir);
            }
        }
        return false;
    }

    /**
     * @param null $dir
     * @return mixed
     */
    public function rmDir($dir = null)
    {
        $e = false;

        if($dir !== null)
        {
            $dir = "ssh2.sftp://".$this->_sftp . rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$dir, DIRECTORY_SEPARATOR);

            if(!function_exists('_rmDir'))
            {
                function _rmDir($d = null, &$e)
                {
                    if($d !== null)
                    {
                        $d = rtrim($d, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
                        if(is_dir($d) && ($files = @scandir($d)) !== false)
                        {
                            foreach($files as $f)
                            {
                                if(substr($f, 0, 1) !== "." && substr($f, 0, 2) !== "..")
                                {
                                    if(is_dir($d . $f))
                                    {
                                        _rmDir($d . $f, $e);
                                    }else{
                                        if(!@unlink($d . $f))
                                        {
                                            Ft::error("unable to delete file: $d . $f", "error"); $e = true;
                                        }
                                    }
                                }
                            }
                            @reset($files);
                            if(!@rmdir($d))
                            {
                                Ft::error("unable to delete dir: $d", "error"); $e = true;
                            }
                        }
                    }
                }
            }

            _rmDir($dir, $e);

            if(!$e)
            {
                return true;
            }else{
                $this->error("unable to delete dir: $dir");
            }
        }
        return false;
    }

    /**
     * @param null $file
     * @return bool
     */
    public function rmFile($file = null)
    {
        if($file !== null)
        {
            $_file = "ssh2.sftp://".$this->_sftp . rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$file, DIRECTORY_SEPARATOR);
            if(!@unlink($_file))
            {
                if($this->exec("chmod 0777 ". DIRECTORY_SEPARATOR . ltrim((string)$file, DIRECTORY_SEPARATOR)) && @unlink($_file))
                {
                    return true;
                }
                $this->error("unable to delete file: $_file");
            }else{
                return true;
            }
        }
        return false;
    }

    /**
     * @param null $file
     * @return bool|string
     */
    public function fileType($file = null)
    {
        if($file !== null)
        {
            $file = "ssh2.sftp://".$this->_sftp . rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$file, DIRECTORY_SEPARATOR);
            if(($type = @filetype($file)) !== false)
            {
                return strtolower($type);
            }else{
                $this->error("unable to obtain file type from: $file");
            }
        }
        return false;
    }

    /**
     * @param null $cmd
     * @return string
     */
    public function exec($cmd = null)
    {
        $stream = null;
        $err_stream = null;

        if($cmd !== null)
        {
            if(($stream = ssh2_exec($this->_conn, escapeshellcmd((string)$cmd), false)) !== false)
            {
                stream_set_blocking($stream, true);
                $err_stream = ssh2_fetch_stream($stream, SSH2_STREAM_STDERR);
                stream_set_blocking($err_stream, true);
                $out = trim(stream_get_contents($stream));
                $err = trim(stream_get_contents($err_stream));
                @fclose($stream);
                @fclose($err_stream);
                if(!empty($err))
                {
                    $this->error("unable to exec command: $cmd in terminal - $err");
                    return $err;
                }else{
                    return $out;
                }
            }else{
                $this->error("unable to exec command: $cmd in terminal");
            }
        }
        return false;
    }
}

/**
 * @author setcookie <set@cooki.me>
 * @link set.cooki.me
 * @copyright Copyright &copy; 2011-2012 setcookie
 * @license http://www.gnu.org/copyleft/gpl.html
 * @package syncd
 * @since 0.0.3
 * @desc concrete implementation of local to local filesystem operations
 */
class Fs extends FT
{
    /**
     *
     */
    public function connect(){}

    /**
     * @throws Exception
     * @param null $cwd
     * @return null
     */
    public function setCwd($cwd = null)
    {
        if($cwd !== null)
        {
            $this->_cwd = trim((string)$cwd);
        }
        return $this->_cwd;
    }

    /**
     * @param null $dir
     * @return bool
     */
    public function testDir($dir = null)
    {
        if($this->isDir($dir))
        {
            $file = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . rtrim((string)$dir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ".tmp";
            if((bool)@file_put_contents($file, " "))
            {
                @unlink($file);
                return true;
            }
        }
        return false;
    }

    /**
     * @param null $dir
     * @return bool
     */
    public function isDir($dir = null)
    {
        $dir = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$dir, DIRECTORY_SEPARATOR);
        if($dir !== null)
        {
            if(is_dir($dir))
            {
                return true;
            }
        }
        return false;
    }

    /**
     * @param null $file
     * @return bool
     */
    public function isFile($file = null)
    {
        $file = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$file, DIRECTORY_SEPARATOR);
        if($file !== null)
        {
            if(is_file($file))
            {
                return true;
            }
        }
        return false;
    }

    /**
     * @param null $file
     * @param string $m
     * @return int
     */
    public function fileTime($file = null, $m = "m")
    {
        if($file !== null)
        {
            $m = strtolower(trim((string)$m));
            $file = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$file, DIRECTORY_SEPARATOR);
            switch($m)
            {
                case "a":
                    if(($t = fileatime($file)) !== false)
                    {
                        return (int)$t;
                    }else{
                        $this->error("unable to obtain fileatime from: $file");
                    }
                    break;
                default:
                    if(($t = filemtime($file)) !== false)
                    {
                        return (int)$t;
                    }else{
                        $this->error("unable to obtain filemtime from: $file");
                    }
            }
        }
        return 0;
    }

    /**
     * @param null $file
     * @return int
     */
    public function fileSize($file = null)
    {
        if($file !== null)
        {
            $file = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$file, DIRECTORY_SEPARATOR);
            if(($s = filesize($file)) !== false)
            {
                return (int)$s;
            }else{
                $this->error("unable to obtain filesize from: $file");
            }
        }
        return 0;
    }

    /**
     * @param null $source
     * @param null $target
     * @param null $mode
     * @return bool
     */
    public function copy($source = null, $target = null, $mode = null)
    {
        $return = false;

        if($source !== null && $target !== null)
        {
            if($this->_cwd === "/"){
                $target = $this->_cwd . DIRECTORY_SEPARATOR . ltrim((string)$target, DIRECTORY_SEPARATOR);
            }else{
                $target = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$target, DIRECTORY_SEPARATOR);
            }
            $return = @copy($source, $target);
            if($return)
            {
                if($mode !== null)
                {
                    $mask = @umask(0);
                    if(@chmod($target, $mode))
                    {
                        @umask($mask);
                        $return = true;
                    }else{
                        $this->error("unable to chmod file: $target to: $mode");
                    }
                }else{
                    $return = true;
                }
            }else{
                $this->error("unable to copy file: $source to: $target");
            }
        }
        @clearstatcache();
        return $return;
    }

    /**
     * @param null $file
     * @param null $user
     * @return bool
     */
    public function chOwn($file = null, $user = null)
    {
        if($file !== null && $user !== null)
        {
            if($this->_cwd === "/"){
                $file = $this->_cwd . DIRECTORY_SEPARATOR . ltrim((string)$file, DIRECTORY_SEPARATOR);
            }else{
                $file = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$file, DIRECTORY_SEPARATOR);
            }
            $return = @chown($file, (string)$user);
            if($return)
            {
                return true;
            }else{
                $this->error("unable to chown file: $file to: $user");
            }
        }
        return false;
    }

    /**
     * @param null $file
     * @param null $group
     * @return bool
     */
    public function chGrp($file = null, $group = null)
    {
        if($file !== null && $group !== null)
        {
            if($this->_cwd === "/"){
                $file = $this->_cwd . DIRECTORY_SEPARATOR . ltrim((string)$file, DIRECTORY_SEPARATOR);
            }else{
                $file = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$file, DIRECTORY_SEPARATOR);
            }
            $return = @chgrp($file, (string)$group);
            if($return)
            {
                return true;
            }else{
                $this->error("unable to chgrp file: $file to: $group");
            }
        }
        return false;
    }

    /**
     * @param null $user
     * @param null $dir
     * @return bool
     */
    public function isOwn($user = null, $dir = null)
    {
        if($user !== null)
        {
            return (bool)posix_getpwnam((string)$user);
        }
        return false;
    }

    /**
     * @param null $group
     * @param null $dir
     * @return bool
     */
    public function isGrp($group = null, $dir = null)
    {
        if($group !== null)
        {
            return (bool)posix_getgrnam((string)$group);
        }
        return false;
    }

    /**
     * @param null $dir
     * @param int $mode
     * @return bool
     */
    public function mkDir($dir = null, $mode = 0755)
    {
        $mask = null;

        if($dir !== null)
        {
            $dir = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$dir, DIRECTORY_SEPARATOR);
            $mask = @umask(0);
            if(@mkdir($dir, $mode))
            {
                @umask($mask);
                return true;
            }else{
                $this->error("unable to create dir: $dir with permissions: $mode");
            }
        }
        return false;
    }

    /**
     * @param null $dir
     * @return mixed
     */
    public function lsDir($dir = null)
    {
        $ls = false;

        if($dir !== null)
        {
            if(!function_exists('_lsDir'))
            {
                function _lsDir($b = null, $d = null, Array &$tmp = array())
                {
                    $b = rtrim($b, DIRECTORY_SEPARATOR);
                    $d = DIRECTORY_SEPARATOR . trim($d, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;

                    if(is_dir($b . $d) && ($h = @opendir($b . $d)) !== false)
                    {
                        while(($f = readdir($h)) !== false)
                        {
                            $f = ltrim($f, DIRECTORY_SEPARATOR);
                            if(substr($f, 0, 1) !== "." && substr($f, 0, 2) !== "..")
                            {
                                $tmp[] = $d . $f;
                                if(is_dir($b . $d . $f))
                                {
                                    _lsDir($b, $d . $f, $tmp);
                                }
                            }
                        }
                        @closedir($h);
                    }else{
                        return false;
                    }
                    @clearstatcache();
                    return array_reverse($tmp);
                }
            }

            $base = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
            $dir = ltrim((string)$dir, DIRECTORY_SEPARATOR);

            if(($ls = _lsDir($base, $dir)) !== false)
            {
                return $ls;
            }else{
                $this->error("unable to list dir: " . $base.$dir);
            }
        }
        return false;
    }

    /**
     * @param null $dir
     * @return bool
     */
    public function rmDir($dir = null)
    {
        $e = false;

        if($dir !== null)
        {
            $dir = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$dir, DIRECTORY_SEPARATOR);

            if(!function_exists('_rmDir'))
            {
                function _rmDir($d = null, &$e)
                {
                    if($d !== null)
                    {
                        $d = rtrim($d, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
                        if(is_dir($d) && ($files = @scandir($d)) !== false)
                        {
                            foreach($files as $f)
                            {
                                if(substr($f, 0, 1) !== "." && substr($f, 0, 2) !== "..")
                                {
                                    if(is_dir($d . $f))
                                    {
                                        _rmDir($d . $f, $e);
                                    }else{
                                        if(!@unlink($d . $f))
                                        {
                                            Ft::error("unable to delete file: $d . $f", "error"); $e = true;
                                        }
                                    }
                                }
                            }
                            @reset($files);
                            if(!@rmdir($d))
                            {
                                Ft::error("unable to delete dir: $d", "error"); $e = true;
                            }
                        }
                    }
                }
            }

            _rmDir($dir, $e);

            if(!$e)
            {
                return true;
            }else{
                $this->error("unable to delete dir: $dir");
            }
        }
        return false;
    }

    /**
     * @param null $file
     * @return bool
     */
    public function rmFile($file = null)
    {
        if($file !== null)
        {
            $_file = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$file, DIRECTORY_SEPARATOR);
            if(!@unlink($_file))
            {
                if(chmod(DIRECTORY_SEPARATOR . ltrim($file, DIRECTORY_SEPARATOR), 0777) && @unlink($_file))
                {
                    return true;
                }
                $this->error("unable to delete file: $_file");
            }else{
                return true;
            }
        }
        return false;
    }

    /**
     * @param null $file
     * @return bool|string
     */
    public function fileType($file = null)
    {
        if($file !== null)
        {
            $file = rtrim((string)$this->_cwd, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . ltrim((string)$file, DIRECTORY_SEPARATOR);
            if(($type = @filetype($file)) !== false)
            {
                return strtolower($type);
            }else{
                $this->error("unable to obtain file type from: $file");
            }
        }
        return false;
    }
}

/*************************************************************************************
 *
 * run script via cli
 *
 *************************************************************************************/
if(isset($argv) && (int)$argc >= 2)
{
    try
    {
        Syncd::run($argv[1], (isset($argv[2])) ? $argv[2] : null, (isset($argv[3])) ? array_slice($argv, 3) : null);
    }
    catch(Exception $e)
    {
        echo "\033[01;31m" . $e->getMessage() . ", " . $e->getCode() . ", " . $e->getLine()."\033[0m\n";
        exit(0);
    }
}

?>