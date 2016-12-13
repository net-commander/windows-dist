<?php
    /** PHPSandbox class declaration
     * @package PHPSandbox
     */
    namespace PHPSandbox;
    use FunctionParser\FunctionParser;

    /**
     * PHPSandbox class for PHP Sandboxes.
     *
     * This class encapsulates the entire functionality of a PHPSandbox so that an end user
     * only has to create a PHPSandbox instance, configure its options, and run their code
     *
     * @namespace PHPSandbox
     *
     * @author  Elijah Horton <fieryprophet@yahoo.com>
     * @version 1.3.11
     */
    class PHPSandbox implements \IteratorAggregate {
        /**
         * @const    string      The prefix given to the obfuscated sandbox key passed to the generated code
         */
        const SANDBOX_PREFIX = '__PHPSandbox_';
        /**
         * @const    int           A bit flag for the import() method, signifies to import all data from a template
         */
        const IMPORT_ALL = 0;
        /**
         * @const    int           A bit flag for the import() method, signifies to import only options from a template
         */
        const IMPORT_OPTIONS = 1;
        /**
         * @const    int           A bit flag for the import() method, signifies to import only definitions from a template
         */
        const IMPORT_DEFINITIONS = 2;
        /**
         * @const    int           A bit flag for the import() method, signifies to import only whitelists from a template
         */
        const IMPORT_WHITELIST = 4;
        /**
         * @const    int           A bit flag for the import() method, signifies to import only blacklists from a template
         */
        const IMPORT_BLACKLIST = 8;
        /**
         * @const    int           A bit flag for the import() method, signifies to import only trusted code from a template
         */
        const IMPORT_TRUSTED_CODE = 16;
        /**
         * @const    int           A bit flag for the import() method, signifies to import only sandboxed code from a template
         */
        const IMPORT_CODE = 32;
        /**
         * @static
         * @var    array         A static array of superglobal names used for redefining superglobal values
         */
        public static $superglobals = array(
            '_GET',
            '_POST',
            '_COOKIE',
            '_FILES',
            '_ENV',
            '_REQUEST',
            '_SERVER',
            '_SESSION',
            'GLOBALS'
        );
        /**
         * @static
         * @var    array        A static array of magic constant names used for redefining magic constant values
         */
        public static $magic_constants = array(
            '__LINE__',
            '__FILE__',
            '__DIR__',
            '__FUNCTION__',
            '__CLASS__',
            '__TRAIT__',
            '__METHOD__',
            '__NAMESPACE__'
        );
        /**
         * @static
         * @var    array          A static array of defined_* and declared_* functions names used for redefining defined_* and declared_* values
         */
        public static $defined_funcs = array(
            'get_defined_functions',
            'get_defined_vars',
            'get_defined_constants',
            'get_declared_classes',
            'get_declared_interfaces',
            'get_declared_traits',
            'get_included_files'
        );
        /**
         * @static
         * @var    array          A static array of func_get_args, func_get_arg, and func_num_args used for redefining those functions
         */
        public static $arg_funcs = array(
            'func_get_args',
            'func_get_arg',
            'func_num_args'
        );
        /**
         * @static
         * @var    array          A static array of var_dump, print_r and var_export, intval, floatval, is_string, is_object,
         *                          is_scalar and is_callable for redefining those functions
         */
        public static $sandboxed_string_funcs = array(
            'var_dump',
            'print_r',
            'var_export',
            'intval',
            'floatval',
            'boolval',
            'is_string',
            'is_object',
            'is_scalar',
            'is_callable'
        );
        /**
         * @var    string       The randomly generated name of the PHPSandbox variable passed to the generated closure
         */
        public $name = '';
        /**
         * @var    array       Array of defined functions, superglobals, etc. If an array type contains elements, then it overwrites its external counterpart
         */
        protected $definitions = array(
            'functions' => array(),
            'variables' => array(),
            'superglobals' => array(),
            'constants' => array(),
            'magic_constants' => array(),
            'namespaces' => array(),
            'aliases' => array(),
            'classes' => array(),
            'interfaces' => array(),
            'traits' => array()
        );
        /**
         * @var    array       Array of whitelisted functions, classes, etc. If an array type contains elements, then it overrides its blacklist counterpart
         */
        protected $whitelist = array(
            'functions' => array(),
            'variables' => array(),
            'globals' => array(),
            'superglobals' => array(),
            'constants' => array(),
            'magic_constants' => array(),
            'namespaces' => array(),
            'aliases' => array(),
            'classes' => array(),
            'interfaces' => array(),
            'traits' => array(),
            'keywords' => array(),
            'operators' => array(),
            'primitives' => array(),
            'types' => array()
        );
        /**
         * @var    array       Array of blacklisted functions, classes, etc. Any whitelisted array types override their counterpart in this array
         */
        protected $blacklist = array(
            'functions' => array(),
            'variables' => array(),
            'globals' => array(),
            'superglobals' => array(),
            'constants' => array(),
            'magic_constants' => array(),
            'namespaces' => array(),
            'aliases' => array(),
            'classes' => array(),
            'interfaces' => array(),
            'traits' => array(),
            'keywords' => array(
                'declare' => true,
                'eval' => true,
                'exit' => true,
                'halt' => true
            ),
            'operators' => array(),
            'primitives' => array(),
            'types' => array()
        );
        /**
         * @var     array       Array of custom validation functions
         */
        protected $validation = array(
            'function' => null,
            'variable' => null,
            'global' => null,
            'superglobal' => null,
            'constant' => null,
            'magic_constant' => null,
            'namespace' => null,
            'alias' => null,
            'class' => null,
            'interface' => null,
            'trait' => null,
            'keyword' => null,
            'operator' => null,
            'primitive' => null,
            'type' => null
        );
        /**
         * @var     array       Array of sandboxed included files
         */
        protected $includes = array();
        /**
         * @var     PHPSandbox[]       Array of PHPSandboxes
         */
        protected static $sandboxes = array();
        /* CONFIGURATION OPTION FLAGS */
        /**
         * @var    bool       Flag to indicate whether the sandbox should validate functions
         * @default true
         */
        public $validate_functions          = true;
        /**
         * @var    bool       Flag to indicate whether the sandbox should validate variables
         * @default true
         */
        public $validate_variables          = true;
        /**
         * @var    bool       Flag to indicate whether the sandbox should validate globals
         * @default true
         */
        public $validate_globals            = true;
        /**
         * @var    bool       Flag to indicate whether the sandbox should validate superglobals
         * @default true
         */
        public $validate_superglobals       = true;
        /**
         * @var    bool       Flag to indicate whether the sandbox should validate constants
         * @default true
         */
        public $validate_constants          = true;
        /**
         * @var    bool       Flag to indicate whether the sandbox should validate magic constants
         * @default true
         */
        public $validate_magic_constants    = true;
        /**
         * @var    bool       Flag to indicate whether the sandbox should validate namespaces
         * @default true
         */
        public $validate_namespaces         = true;
        /**
         * @var    bool       Flag to indicate whether the sandbox should validate aliases (aka use)
         * @default true
         */
        public $validate_aliases            = true;
        /**
         * @var    bool       Flag to indicate whether the sandbox should validate classes
         * @default true
         */
        public $validate_classes            = true;
        /**
         * @var    bool       Flag to indicate whether the sandbox should validate interfaces
         * @default true
         */
        public $validate_interfaces         = true;
        /**
         * @var    bool       Flag to indicate whether the sandbox should validate traits
         * @default true
         */
        public $validate_traits             = true;
        /**
         * @var    bool       Flag to indicate whether the sandbox should validate keywords
         * @default true
         */
        public $validate_keywords           = true;
        /**
         * @var    bool       Flag to indicate whether the sandbox should validate operators
         * @default true
         */
        public $validate_operators          = true;
        /**
         * @var    bool       Flag to indicate whether the sandbox should validate primitives
         * @default true
         */
        public $validate_primitives         = true;
        /**
         * @var    bool       Flag to indicate whether the sandbox should validate types
         * @default true
         */
        public $validate_types              = true;
        /**
         * @var    int        The error_reporting level to set the PHPSandbox scope to when executing the generated closure, if set to null it will use parent scope error level.
         * @default true
         */
        public $error_level                 = null;
        /**
         * @var    bool       Flag to indicate whether the sandbox should allow included files
         * @default false
         */
        public $allow_includes            = false;
        /**
         * @var    bool       Flag to indicate whether the sandbox should automatically sandbox included files
         * @default true
         */
        public $sandbox_includes            = true;
        /**
         * @var    bool       Flag to indicate whether the sandbox should return error_reporting to its previous level after execution
         * @default true
         */
        public $restore_error_level         = true;
        /**
         * @var    bool       Flag to indicate whether the sandbox should convert errors to exceptions
         * @default false
         */
        public $convert_errors              = false;
        /**
         * @var    bool       Flag whether to return output via an output buffer
         * @default false
         */
        public $capture_output              = false;
        /**
         * @var    bool       Should PHPSandbox automagically whitelist prepended and appended code?
         * @default true
         */
        public $auto_whitelist_trusted_code = true;
        /**
         * @var    bool       Should PHPSandbox automagically whitelist functions created in sandboxed code if $allow_functions is true?
         * @default true
         */
        public $auto_whitelist_functions    = true;
        /**
         * @var    bool       Should PHPSandbox automagically whitelist constants created in sandboxed code if $allow_constants is true?
         * @default true
         */
        public $auto_whitelist_constants    = true;
        /**
         * @var    bool       Should PHPSandbox automagically whitelist global variables created in sandboxed code if $allow_globals is true? (Used to whitelist them in the variables list)
         * @default true
         */
        public $auto_whitelist_globals      = true;
        /**
         * @var    bool       Should PHPSandbox automagically whitelist classes created in sandboxed code if $allow_classes is true?
         * @default true
         */
        public $auto_whitelist_classes      = true;
        /**
         * @var    bool       Should PHPSandbox automagically whitelist interfaces created in sandboxed code if $allow_interfaces is true?
         * @default true
         */
        public $auto_whitelist_interfaces   = true;
        /**
         * @var    bool       Should PHPSandbox automagically whitelist traits created in sandboxed code if $allow_traits is true?
         * @default true
         */
        public $auto_whitelist_traits       = true;
        /**
         * @var    bool       Should PHPSandbox automagically define variables passed to prepended, appended and prepared code closures?
         * @default true
         */
        public $auto_define_vars            = true;
        /**
         * @var    bool       Should PHPSandbox overwrite get_defined_functions, get_defined_vars, get_defined_constants, get_declared_classes, get_declared_interfaces and get_declared_traits?
         * @default true
         */
        public $overwrite_defined_funcs     = true;
        /**
         * @var    bool       Should PHPSandbox overwrite func_get_args, func_get_arg and func_num_args?
         * @default true
         */
        public $overwrite_func_get_args     = true;
        /**
         * @var    bool       Should PHPSandbox overwrite functions to help hide SandboxedStrings?
         * @default true
         */
        public $overwrite_sandboxed_string_funcs         = true;
        /**
         * @var    bool       Should PHPSandbox overwrite $_GET, $_POST, $_COOKIE, $_FILES, $_ENV, $_REQUEST, $_SERVER, $_SESSION and $GLOBALS superglobals? If so, unless alternate superglobal values have been defined they will return as empty arrays.
         * @default true
         */
        public $overwrite_superglobals      = true;
        /**
         * @var    bool       Should PHPSandbox allow sandboxed code to declare functions?
         * @default false
         */
        public $allow_functions             = false;
        /**
         * @var    bool       Should PHPSandbox allow sandboxed code to declare closures?
         * @default false
         */
        public $allow_closures              = false;
        /**
         * @var    bool       Should PHPSandbox allow sandboxed code to create variables?
         * @default true
         */
        public $allow_variables             = true;
        /**
         * @var    bool       Should PHPSandbox allow sandboxed code to create static variables?
         * @default true
         */
        public $allow_static_variables      = true;
        /**
         * @var    bool       Should PHPSandbox allow sandboxed code to create objects of allow classes (e.g. new keyword)?
         * @default true
         */
        public $allow_objects               = true;
        /**
         * @var    bool       Should PHPSandbox allow sandboxed code to define constants?
         * @default false
         */
        public $allow_constants             = false;
        /**
         * @var    bool       Should PHPSandbox allow sandboxed code to use global keyword to access variables in the global scope?
         * @default false
         */
        public $allow_globals               = false;
        /**
         * @var    bool       Should PHPSandbox allow sandboxed code to declare namespaces (utilizing the define_namespace function?)
         * @default false
         */
        public $allow_namespaces            = false;
        /**
         * @var    bool       Should PHPSandbox allow sandboxed code to use namespaces and declare namespace aliases (utilizing the define_alias function?)
         * @default false
         */
        public $allow_aliases               = false;
        /**
         * @var    bool       Should PHPSandbox allow sandboxed code to declare classes?
         * @default false
         */
        public $allow_classes               = false;
        /**
         * @var    bool       Should PHPSandbox allow sandboxed code to declare interfaces?
         * @default false
         */
        public $allow_interfaces            = false;
        /**
         * @var    bool       Should PHPSandbox allow sandboxed code to declare traits?
         * @default false
         */
        public $allow_traits                = false;
        /**
         * @var    bool       Should PHPSandbox allow sandboxed code to create generators?
         * @default true
         */
        public $allow_generators            = true;
        /**
         * @var    bool       Should PHPSandbox allow sandboxed code to escape to HTML?
         * @default false
         */
        public $allow_escaping              = false;
        /**
         * @var    bool       Should PHPSandbox allow sandboxed code to cast types? (This will still be subject to allowed classes)
         * @default false
         */
        public $allow_casting               = false;
        /**
         * @var    bool       Should PHPSandbox allow sandboxed code to suppress errors (e.g. the @ operator?)
         * @default false
         */
        public $allow_error_suppressing     = false;
        /**
         * @var    bool       Should PHPSandbox allow sandboxed code to assign references?
         * @default true
         */
        public $allow_references            = true;
        /**
         * @var    bool       Should PHPSandbox allow sandboxed code to use backtick execution? (e.g. $var = \`ping google.com\`; This will also be disabled if shell_exec is not whitelisted or if it is blacklisted, and will be converted to a defined shell_exec function call if one is defined)
         * @default false
         */
        public $allow_backticks             = false;
        /**
         * @var    bool       Should PHPSandbox allow sandboxed code to halt the PHP compiler?
         * @default false
         */
        public $allow_halting               = false;
        /* TRUSTED CODE STRINGS */
        /**
         * @var    string     String of prepended code, will be automagically whitelisted for functions, variables, globals, constants, classes, interfaces and traits if $auto_whitelist_trusted_code is true
         */
        public $prepended_code = '';
        /**
         * @var    string     String of appended code, will be automagically whitelisted for functions, variables, globals, constants, classes, interfaces and traits if $auto_whitelist_trusted_code is true
         */
        public $appended_code = '';
        /* OUTPUT */
        /**
         * @var float|null    Float of the number of microseconds it took to prepare the sandbox
         */
        public $prepare_time = null;
        /**
         * @var float|null    Float of the number of microseconds it took to execute the sandbox
         */
        public $execution_time = null;
        /**
         * @var    string     String of preparsed code, for debugging and serialization purposes
         */
        public $preparsed_code = '';
        /**
         * @var    array      Array of parsed code broken down into AST tokens, for debugging and serialization purposes
         */
        public $parsed_ast = array();
        /**
         * @var    string     String of prepared code, for debugging and serialization purposes
         */
        public $prepared_code = '';
        /**
         * @var    array      Array of prepared code broken down into AST tokens, for debugging and serialization purposes
         */
        public $prepared_ast = array();
        /**
         * @var    string     String of generated code, for debugging and serialization purposes
         */
        public $generated_code = '';
        /**
         * @var    null|callable       Callable that handles any errors when set
         */
        protected $error_handler;
        /**
         * @var    int                 Integer value of the error types to handle (default is E_ALL)
         */
        protected $error_handler_types = E_ALL;
        /**
         * @var    array               The last error thrown by the sandbox
         */
        protected $last_error;
        /**
         * @var    null|callable       Callable that handles any thrown exceptions when set
         */
        protected $exception_handler;
        /**
         * @var    \Exception          The last exception thrown by the sandbox
         */
        protected $last_exception;
        /**
         * @var    null|callable       Callable that handles any thrown validation errors when set
         */
        protected $validation_error_handler;
        /**
         * @var    \Exception|Error    The last validation error thrown by the sandbox
         */
        protected $last_validation_error;
        /** PHPSandbox class constructor
         *
         * @example $sandbox = new PHPSandbox\PHPSandbox;
         *
         * You can pass optional arrays of predefined functions, variables, etc. to the sandbox through the constructor
         *
         * @param   array   $options            Optional array of options to set for the sandbox
         * @param   array   $functions          Optional array of functions to define for the sandbox
         * @param   array   $variables          Optional array of variables to define for the sandbox
         * @param   array   $constants          Optional array of constants to define for the sandbox
         * @param   array   $namespaces         Optional array of namespaces to define for the sandbox
         * @param   array   $aliases            Optional array of aliases to define for the sandbox
         * @param   array   $superglobals       Optional array of superglobals to define for the sandbox
         * @param   array   $magic_constants    Optional array of magic constants to define for the sandbox
         * @param   array   $classes            Optional array of classes to define for the sandbox
         * @param   array   $interfaces         Optional array of interfaces to define for the sandbox
         * @param   array   $traits             Optional array of traits to define for the sandbox
         * @return  PHPSandbox                       The returned PHPSandbox variable
         */
        public function __construct(array $options = array(),
                                    array $functions = array(),
                                    array $variables = array(),
                                    array $constants = array(),
                                    array $namespaces = array(),
                                    array $aliases = array(),
                                    array $superglobals = array(),
                                    array $magic_constants = array(),
                                    array $classes = array(),
                                    array $interfaces = array(),
                                    array $traits = array()){
            $this->name = static::SANDBOX_PREFIX . md5(uniqid());
            $this->set_options($options)
                ->define_funcs($functions)
                ->define_vars($variables)
                ->define_consts($constants)
                ->define_namespaces($namespaces)
                ->define_aliases($aliases)
                ->define_superglobals($superglobals)
                ->define_magic_consts($magic_constants)
                ->define_classes($classes)
                ->define_interfaces($interfaces)
                ->define_traits($traits);
            return $this;
        }
        /** PHPSandbox static factory method
         *
         * You can pass optional arrays of predefined functions, variables, etc. to the sandbox through the constructor
         *
         * @example $sandbox = PHPSandbox\PHPSandbox::create();
         *
         * @param   array   $options            Optional array of options to set for the sandbox
         * @param   array   $functions          Optional array of functions to define for the sandbox
         * @param   array   $variables          Optional array of variables to define for the sandbox
         * @param   array   $constants          Optional array of constants to define for the sandbox
         * @param   array   $namespaces         Optional array of namespaces to define for the sandbox
         * @param   array   $aliases            Optional array of aliases to define for the sandbox
         * @param   array   $superglobals       Optional array of superglobals to define for the sandbox
         * @param   array   $magic_constants    Optional array of magic constants to define for the sandbox
         * @param   array   $classes            Optional array of classes to define for the sandbox
         * @param   array   $interfaces         Optional array of interfaces to define for the sandbox
         * @param   array   $traits             Optional array of traits to define for the sandbox
         *
         * @return  PHPSandbox                  The returned PHPSandbox variable
         */
        public static function create(array $options = array(),
                                      array $functions = array(),
                                      array $variables = array(),
                                      array $constants = array(),
                                      array $namespaces = array(),
                                      array $aliases = array(),
                                      array $superglobals = array(),
                                      array $magic_constants = array(),
                                      array $classes = array(),
                                      array $interfaces = array(),
                                      array $traits = array()){
            return new static($options, $functions, $variables, $constants, $namespaces, $aliases, $superglobals, $magic_constants, $classes, $interfaces, $traits);
        }
        /** PHPSandbox __invoke magic method
         *
         * Besides the code or closure to be executed, you can also pass additional arguments that will overwrite the default values of their respective arguments defined in the code
         *
         * @example $sandbox = new PHPSandbox\PHPSandbox; $sandbox(function(){ echo 'Hello world!'; });
         *
         * @param   \Closure|callable|string   $code          The closure, callable or string of code to execute
         *
         * @return  mixed                      The output of the executed sandboxed code
         */
        public function __invoke($code){
            return call_user_func(array($this, 'execute'), $code);
        }
        /** PHPSandbox __sleep magic method
         *
         * @example $sandbox = new PHPSandbox\PHPSandbox; serialize($sandbox);
         *
         * @return  array                      An array of property keys to be serialized
         */
        public function __sleep(){
            return array_keys(get_object_vars($this));
        }
        /** PHPSandbox __wakeup magic method
         *
         * @example $sandbox = unserialize($sandbox_string);
         */
        public function __wakeup(){}
        /** Import JSON template into sandbox
         *
         * @example $sandbox->import(array('code' => 'echo "Hello World!";'));
         * @example $sandbox->import(file_get_contents("template.json"));
         *
         * @param   array|string    $template          The JSON array or string template to import
         * @param   int             $import_flag       Binary flags signifying which parts of the JSON template to import
         *
         * @throws  Error           Throws exception if JSON template could not be imported
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function import($template, $import_flag = 0){
            if(is_string($template)){
                $template = json_decode($template);
            }
            if(!is_array($template)){
                $this->validation_error("Sandbox could not import malformed JSON template!", Error::IMPORT_ERROR, null, $template);
            }
            if(isset($template['options']) && is_array($template['options']) && (!$import_flag || ($import_flag & static::IMPORT_OPTIONS))){
                $this->set_options($template['options']);
            }
            if(isset($template['definitions']) && is_array($template['definitions']) && (!$import_flag || ($import_flag & static::IMPORT_DEFINITIONS))){
                foreach($template['definitions'] as $type => $data){
                    if(method_exists($this, 'define_' . $type)){
                        switch($type){
                            case 'func':
                                foreach($data as $key => $value){
                                    $function = function(){};
                                    @eval('$function = ' . $value["fullcode"] .';');
                                    if(!is_callable($function)){
                                        $this->validation_error("Could not import function $key! Please check your code for errors!", Error::IMPORT_ERROR, null, $function);
                                    }
                                    $this->define_func($key, $function, $value["pass"]);
                                }
                                break;
                            case 'superglobal':
                                foreach($data as $key => $value){
                                    $this->define_superglobal($key, $value["key"], $value["value"]);
                                }
                                break;
                            case 'namespace':
                                foreach($data as $key => $value){
                                    $this->define_namespace($key);
                                }
                                break;
                            case 'alias':
                                foreach($data as $key => $value){
                                    $this->define_alias($key, $value ? $value : null);
                                }
                                break;
                            case 'class':
                                foreach($data as $key => $value){
                                    $this->define_class($key, $value);
                                }
                                break;
                            case 'interface':
                                foreach($data as $key => $value){
                                    $this->define_interface($key, $value);
                                }
                                break;
                            case 'trait':
                                foreach($data as $key => $value){
                                    $this->define_trait($key, $value);
                                }
                                break;

                            default:
                                foreach($data as $key => $value){
                                    call_user_func_array(array($this, 'define_' . $type), array($key, $value["value"]));
                                }
                                break;
                        }
                    }
                }
            }
            if(isset($template['whitelist']) && is_array($template['whitelist']) && (!$import_flag || ($import_flag & static::IMPORT_WHITELIST))){
                foreach($template['whitelist'] as $type => $data){
                    if(method_exists($this, 'whitelist_' . $type)){
                        call_user_func_array(array($this, 'whitelist_' . $type), array($data));
                    }
                }
            }
            if(isset($template['blacklist']) && is_array($template['blacklist']) && (!$import_flag || ($import_flag & static::IMPORT_BLACKLIST))){
                foreach($template['blacklist'] as $type => $data){
                    if(method_exists($this, 'blacklist_' . $type)){
                        call_user_func_array(array($this, 'blacklist_' . $type), array($data));
                    }
                }
            }
            if(!$import_flag || ($import_flag & static::IMPORT_TRUSTED_CODE)){
                $this->clear_trusted_code();
                if(isset($template['prepend_code']) && $template['prepend_code']){
                    $this->prepend($template['prepend_code']);
                }
                if(isset($template['append_code']) && $template['append_code']){
                    $this->append($template['append_code']);
                }
            }
            if(!$import_flag || ($import_flag & static::IMPORT_CODE)){
                $this->clear_code();
                if(isset($template['code']) && $template['code']){
                    $this->prepare($template['code']);
                }
            }
            return $this;
        }
        /** Import JSON template into sandbox
         *
         * @alias   import();
         *
         * @example $sandbox->importJSON(array('code' => 'echo "Hello World!";'));
         * @example $sandbox->importJSON(file_get_contents("template.json"));
         *
         * @param   array|string    $template          The JSON array or string template to import
         * @param   int             $import_flag       Binary flags signifying which parts of the JSON template to import
         *
         * @throws  Error           Throws exception if JSON template could not be imported
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function importJSON($template, $import_flag = 0){
            return $this->import($template, $import_flag);
        }
        /** Get name of PHPSandbox variable
         * @return  string                     The name of the PHPSandbox variable
         */
        public function get_name(){
            return $this->name;
        }
        /** Set PHPSandbox option
         *
         * You can pass an $option name to set to $value, an array of $option names to set to $value, or an associative array of $option names and their values to set.
         *
         * @example $sandbox->set_option(array('allow_functions' => true));
         *
         * @example $sandbox->set_option(array('allow_functions', 'allow_classes'), true);
         *
         * @example $sandbox->set_option('allow_functions', true);
         *
         * @param   string|array    $option     String or array of strings or associative array of keys of option names to set $value to
         * @param   bool|int|null   $value      Boolean, integer or null $value to set $option to (optional)
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function set_option($option, $value = null){
            if(is_array($option)){
                return $this->set_options($option, $value);
            }
            $option = strtolower($option); //normalize option names
            switch($option){
                case 'error_level':
                    $this->error_level = is_numeric($value) ? intval($value) : null;
                    break;
                case 'validate_functions':
                case 'validate_variables':
                case 'validate_globals':
                case 'validate_superglobals':
                case 'validate_constants':
                case 'validate_magic_constants':
                case 'validate_namespaces':
                case 'validate_aliases':
                case 'validate_classes':
                case 'validate_interfaces':
                case 'validate_traits':
                case 'validate_keywords':
                case 'validate_operators':
                case 'validate_primitives':
                case 'validate_types':
                case 'sandbox_includes':
                case 'restore_error_level':
                case 'convert_errors':
                case 'capture_output':
                case 'auto_whitelist_trusted_code':
                case 'auto_whitelist_functions':
                case 'auto_whitelist_constants':
                case 'auto_whitelist_globals':
                case 'auto_whitelist_classes':
                case 'auto_whitelist_interfaces':
                case 'auto_whitelist_traits':
                case 'auto_define_vars':
                case 'overwrite_defined_funcs':
                case 'overwrite_sandboxed_string_funcs':
                case 'overwrite_func_get_args':
                case 'overwrite_superglobals':
                case 'allow_functions':
                case 'allow_closures':
                case 'allow_variables':
                case 'allow_static_variables':
                case 'allow_objects':
                case 'allow_constants':
                case 'allow_globals':
                case 'allow_namespaces':
                case 'allow_aliases':
                case 'allow_classes':
                case 'allow_interfaces':
                case 'allow_traits':
                case 'allow_generators':
                case 'allow_escaping':
                case 'allow_casting':
                case 'allow_error_suppressing':
                case 'allow_references':
                case 'allow_backticks':
                case 'allow_halting':
                    $this->{$option} = !!$value;
                    break;
            }
            return $this;
        }
        /** Set PHPSandbox options by array
         *
         * You can pass an array of option names to set to $value, or an associative array of option names and their values to set.
         *
         * @example $sandbox->set_option(array('allow_functions' => true));
         *
         * @example $sandbox->set_option(array('allow_functions', 'allow_classes'), true);
         *
         * @param   array|string    $options    Array of strings or associative array of keys of option names to set $value to, or JSON array or string template to import
         * @param   bool|int|null   $value      Boolean, integer or null $value to set $option to (optional)
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function set_options($options, $value = null){
            if(is_string($options) || (is_array($options) && isset($options["options"]))){
                return $this->import($options);
            }
            foreach($options as $name => $_value){
                $this->set_option(is_int($name) ? $_value : $name, is_int($name) ? $value : $_value);
            }
            return $this;
        }
        /** Reset PHPSandbox options to their default values
         *
         * @example $sandbox->reset_options();
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function reset_options(){
            foreach(get_class_vars(__CLASS__) as $option => $value){
                if($option == 'error_level' || is_bool($value)){
                    $this->set_option($option, $value);
                }
            }
            return $this;
        }
        /** Get PHPSandbox option
         *
         * You pass a string $option name to get its associated value
         *
         * @example $sandbox->get_option('allow_functions');
         *
         * @param   string          $option     String of $option name to get
         *
         * @return  boolean|int|null            Returns the value of the requested option
         */
        public function get_option($option){
            $option = strtolower($option);  //normalize option names
            switch($option){
                case 'validate_functions':
                case 'validate_variables':
                case 'validate_globals':
                case 'validate_superglobals':
                case 'validate_constants':
                case 'validate_magic_constants':
                case 'validate_namespaces':
                case 'validate_aliases':
                case 'validate_classes':
                case 'validate_interfaces':
                case 'validate_traits':
                case 'validate_keywords':
                case 'validate_operators':
                case 'validate_primitives':
                case 'validate_types':
                case 'error_level':
                case 'sandbox_includes':
                case 'restore_error_level':
                case 'convert_errors':
                case 'capture_output':
                case 'auto_whitelist_trusted_code':
                case 'auto_whitelist_functions':
                case 'auto_whitelist_constants':
                case 'auto_whitelist_globals':
                case 'auto_whitelist_classes':
                case 'auto_whitelist_interfaces':
                case 'auto_whitelist_traits':
                case 'auto_define_vars':
                case 'overwrite_defined_funcs':
                case 'overwrite_sandboxed_string_funcs':
                case 'overwrite_func_get_args':
                case 'overwrite_superglobals':
                case 'allow_functions':
                case 'allow_closures':
                case 'allow_variables':
                case 'allow_static_variables':
                case 'allow_objects':
                case 'allow_constants':
                case 'allow_globals':
                case 'allow_namespaces':
                case 'allow_aliases':
                case 'allow_classes':
                case 'allow_interfaces':
                case 'allow_traits':
                case 'allow_generators':
                case 'allow_escaping':
                case 'allow_casting':
                case 'allow_error_suppressing':
                case 'allow_references':
                case 'allow_backticks':
                case 'allow_halting':
                    return $this->{$option};
            }
            return null;
        }
        /** Set validation callable for specified $type
         *
         * Validator callable must accept two parameters: a string of the normalized name of the checked element,
         * and the PHPSandbox instance
         *
         * @example $sandbox->set_validator('function', function($function, PHPSandbox $sandbox){ return true; });
         *
         * @param   string          $type       String of $type name to set validator for
         * @param   callable        $callable   Callable that validates the passed element
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function set_validator($type, $callable){
            $type = strtolower($type);  //normalize type
            if(array_key_exists($type, $this->validation)){
                $this->validation[$type] = $callable;
            }
            return $this;
        }
        /** Get validation callable for specified $type
         *
         * @example $sandbox->get_validator('function'); //return callable
         *
         * @param   string          $type       String of $type to return
         *
         * @return  callable|null
         */
        public function get_validator($type){
            $type = strtolower($type);  //normalize type
            return isset($this->validation[$type]) ? $this->validation[$type] : null;
        }
        /** Unset validation callable for specified $type
         *
         * @example $sandbox->unset_validator('function'); //clear custom validation
         *
         * @param   string          $type       String of $type to unset
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function unset_validator($type){
            $type = strtolower($type);  //normalize type
            if(isset($this->validation[$type])){
                $this->validation[$type] = null;
            }
            return $this;
        }
        /** Set validation callable for functions
         *
         * Validator callable must accept two parameters: a string of the normalized name of the checked element,
         * and the PHPSandbox instance. NOTE: Normalized function names include the namespace and are lowercase!
         *
         * @example $sandbox->set_func_validator(function($function, PHPSandbox $sandbox){ return true; });
         *
         * @param   callable        $callable   Callable that validates the normalized passed function name
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function set_func_validator($callable){
            $this->validation['function'] = $callable;
            return $this;
        }
        /** Get validation for functions
         *
         * @example $sandbox->get_func_validator(); //return callable
         *
         * @return  callable|null
         */
        public function get_func_validator(){
            return isset($this->validation['function']) ? $this->validation['function'] : null;
        }
        /** Unset validation callable for functions
         *
         * @example $sandbox->unset_func_validator(); //clear custom validation
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function unset_func_validator(){
            $this->validation['function'] = null;
            return $this;
        }
        /** Set validation callable for variables
         *
         * Validator callable must accept two parameters: a string of the normalized name of the checked element,
         * and the PHPSandbox instance
         *
         * @example $sandbox->set_var_validator(function($variable, PHPSandbox $sandbox){ return true; });
         *
         * @param   callable        $callable   Callable that validates the passed variable name
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function set_var_validator($callable){
            $this->validation['variable'] = $callable;
            return $this;
        }
        /** Get validation callable for variables
         *
         * @example $sandbox->get_var_validator(); //return callable
         *
         * @return  callable|null
         */
        public function get_var_validator(){
            return isset($this->validation['variable']) ? $this->validation['variable'] : null;
        }
        /** Unset validation callable for variables
         *
         * @example $sandbox->unset_var_validator(); //clear custom validation
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function unset_var_validator(){
            $this->validation['variable'] = null;
            return $this;
        }
        /** Set validation callable for globals
         *
         * Validator callable must accept two parameters: a string of the normalized name of the checked element,
         * and the PHPSandbox instance
         *
         * @example $sandbox->set_global_validator(function($global, PHPSandbox $sandbox){ return true; });
         *
         * @param   callable        $callable   Callable that validates the passed global name
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function set_global_validator($callable){
            $this->validation['global'] = $callable;
            return $this;
        }
        /** Get validation callable for globals
         *
         * @example $sandbox->get_global_validator(); //return callable
         *
         * @return  callable|null
         */
        public function get_global_validator(){
            return isset($this->validation['global']) ? $this->validation['global'] : null;
        }
        /** Unset validation callable for globals
         *
         * @example $sandbox->unset_global_validator(); //clear custom validation
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function unset_global_validator(){
            $this->validation['global'] = null;
            return $this;
        }
        /** Set validation callable for superglobals
         *
         * Validator callable must accept two parameters: a string of the normalized name of the checked element,
         * and the PHPSandbox instance. NOTE: Normalized superglobal names are uppercase and without a leading _
         *
         * @example $sandbox->set_superglobal_validator(function($superglobal, PHPSandbox $sandbox){ return true; });
         *
         * @param   callable        $callable   Callable that validates the passed superglobal name
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function set_superglobal_validator($callable){
            $this->validation['superglobal'] = $callable;
            return $this;
        }
        /** Get validation callable for superglobals
         *
         * @example $sandbox->get_superglobal_validator(); //return callable
         *
         * @return  callable|null
         */
        public function get_superglobal_validator(){
            return isset($this->validation['superglobal']) ? $this->validation['superglobal'] : null;
        }
        /** Unset validation callable for superglobals
         *
         * @example $sandbox->unset_superglobal_validator(); //clear custom validation
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function unset_superglobal_validator(){
            $this->validation['superglobal'] = null;
            return $this;
        }
        /** Set validation callable for constants
         *
         * Validator callable must accept two parameters: a string of the normalized name of the checked element,
         * and the PHPSandbox instance
         *
         * @example $sandbox->set_const_validator(function($constant, PHPSandbox $sandbox){ return true; });
         *
         * @param   callable        $callable   Callable that validates the passed constant name
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function set_const_validator($callable){
            $this->validation['constant'] = $callable;
            return $this;
        }
        /** Get validation callable for constants
         *
         * @example $sandbox->get_const_validator(); //return callable
         *
         * @return  callable|null
         */
        public function get_const_validator(){
            return isset($this->validation['constant']) ? $this->validation['constant'] : null;
        }
        /** Unset validation callable for constants
         *
         * @example $sandbox->unset_const_validator(); //clear custom validation
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function unset_const_validator(){
            $this->validation['constant'] = null;
            return $this;
        }
        /** Set validation callable for magic constants
         *
         * Validator callable must accept two parameters: a string of the normalized name of the checked element,
         * and the PHPSandbox instance. NOTE: Normalized magic constant names are upper case and trimmed of __
         *
         * @example $sandbox->set_magic_const_validator(function($magic_constant, PHPSandbox $sandbox){ return true; });
         *
         * @param   callable        $callable   Callable that validates the passed magic constant name
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function set_magic_const_validator($callable){
            $this->validation['magic_constant'] = $callable;
            return $this;
        }
        /** Get validation callable for magic constants
         *
         * @example $sandbox->get_magic_const_validator(); //return callable
         *
         * @return  callable|null
         */
        public function get_magic_const_validator(){
            return isset($this->validation['magic_constant']) ? $this->validation['magic_constant'] : null;
        }
        /** Unset validation callable for magic constants
         *
         * @example $sandbox->unset_magic_const_validator(); //clear custom validation
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function unset_magic_const_validator(){
            $this->validation['magic_constant'] = null;
            return $this;
        }
        /** Set validation callable for namespaces
         *
         * Validator callable must accept two parameters: a string of the normalized name of the checked element,
         * and the PHPSandbox instance
         *
         * @example $sandbox->set_namespace_validator(function($namespace, PHPSandbox $sandbox){ return true; });
         *
         * @param   callable        $callable   Callable that validates the passed namespace name
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function set_namespace_validator($callable){
            $this->validation['namespace'] = $callable;
            return $this;
        }
        /** Get validation callable for namespaces
         *
         * @example $sandbox->get_namespace_validator(); //return callable
         *
         * @return  callable|null
         */
        public function get_namespace_validator(){
            return isset($this->validation['namespace']) ? $this->validation['namespace'] : null;
        }
        /** Unset validation callable for namespaces
         *
         * @example $sandbox->unset_namespace_validator(); //clear custom validation
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function unset_namespace_validator(){
            $this->validation['namespace'] = null;
            return $this;
        }
        /** Set validation callable for aliases
         *
         * Validator callable must accept two parameters: a string of the normalized name of the checked element,
         * and the PHPSandbox instance
         *
         * @example $sandbox->set_alias_validator(function($alias, PHPSandbox $sandbox){ return true; });
         *
         * @param   callable        $callable   Callable that validates the passed alias name
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function set_alias_validator($callable){
            $this->validation['alias'] = $callable;
            return $this;
        }
        /** Get validation callable for aliases
         *
         * @example $sandbox->get_alias_validator(); //return callable
         *
         * @return  callable|null
         */
        public function get_alias_validator(){
            return isset($this->validation['alias']) ? $this->validation['alias'] : null;
        }
        /** Unset validation callable for aliases
         *
         * @example $sandbox->unset_alias_validator(); //clear custom validation
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function unset_alias_validator(){
            $this->validation['alias'] = null;
            return $this;
        }
        /** Set validation callable for uses (aka aliases)
         *
         * Validator callable must accept two parameters: a string of the normalized name of the checked element,
         * and the PHPSandbox instance
         *
         * @alias set_alias_validator();
         *
         * @example $sandbox->set_use_validator(function($use, PHPSandbox $sandbox){ return true; });
         *
         * @param   callable        $callable   Callable that validates the passed use (aka alias) name
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function set_use_validator($callable){
            return $this->set_alias_validator($callable);
        }
        /** Get validation callable for uses (aka aliases)
         *
         * @alias get_alias_validator();
         *
         * @example $sandbox->get_use_validator(); //return callable
         *
         * @return  callable|null
         */
        public function get_use_validator(){
            return $this->get_alias_validator();
        }
        /** Unset validation callable for uses (aka aliases)
         *
         * @alias unset_alias_validator();
         *
         * @example $sandbox->unset_use_validator(); //clear custom validation
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function unset_use_validator(){
            return $this->unset_alias_validator();
        }
        /** Set validation callable for classes
         *
         * Validator callable must accept two parameters: a string of the normalized name of the checked element,
         * and the PHPSandbox instance. NOTE: Normalized class names are lowercase
         *
         * @example $sandbox->set_class_validator(function($class, PHPSandbox $sandbox){ return true; });
         *
         * @param   callable        $callable   Callable that validates the passed class name
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function set_class_validator($callable){
            $this->validation['class'] = $callable;
            return $this;
        }
        /** Get validation callable for classes
         *
         * @example $sandbox->get_class_validator(); //return callable
         *
         * @return  callable|null
         */
        public function get_class_validator(){
            return isset($this->validation['class']) ? $this->validation['class'] : null;
        }
        /** Unset validation callable for classes
         *
         * @example $sandbox->unset_class_validator(); //clear custom validation
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function unset_class_validator(){
            $this->validation['class'] = null;
            return $this;
        }
        /** Set validation callable for interfaces
         *
         * Validator callable must accept two parameters: a string of the normalized name of the checked element,
         * and the PHPSandbox instance. NOTE: Normalized interface names are lowercase
         *
         * @example $sandbox->set_interface_validator(function($interface, PHPSandbox $sandbox){ return true; });
         *
         * @param   callable        $callable   Callable that validates the passed interface name
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function set_interface_validator($callable){
            $this->validation['interface'] = $callable;
            return $this;
        }
        /** Get validation callable for interfaces
         *
         * @example $sandbox->get_interface_validator(); //return callable
         *
         * @return  callable|null
         */
        public function get_interface_validator(){
            return isset($this->validation['interface']) ? $this->validation['interface'] : null;
        }
        /** Unset validation callable for interfaces
         *
         * @example $sandbox->unset_interface_validator(); //clear custom validation
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function unset_interface_validator(){
            $this->validation['interface'] = null;
            return $this;
        }
        /** Set validation callable for traits
         *
         * Validator callable must accept two parameters: a string of the normalized name of the checked element,
         * and the PHPSandbox instance. NOTE: Normalized trait names are lowercase
         *
         * @example $sandbox->set_trait_validator(function($trait, PHPSandbox $sandbox){ return true; });
         *
         * @param   callable        $callable   Callable that validates the passed trait name
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function set_trait_validator($callable){
            $this->validation['trait'] = $callable;
            return $this;
        }
        /** Get validation callable for traits
         *
         * @example $sandbox->get_trait_validator(); //return callable
         *
         * @return  callable|null
         */
        public function get_trait_validator(){
            return isset($this->validation['trait']) ? $this->validation['trait'] : null;
        }
        /** Unset validation callable for traits
         *
         * @example $sandbox->unset_trait_validator(); //clear custom validation
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function unset_trait_validator(){
            $this->validation['trait'] = null;
            return $this;
        }
        /** Set validation callable for keywords
         *
         * Validator callable must accept two parameters: a string of the normalized name of the checked element,
         * and the PHPSandbox instance
         *
         * @example $sandbox->set_keyword_validator(function($keyword, PHPSandbox $sandbox){ return true; });
         *
         * @param   callable        $callable   Callable that validates the passed keyword name
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function set_keyword_validator($callable){
            $this->validation['keyword'] = $callable;
            return $this;
        }
        /** Get validation callable for keywords
         *
         * @example $sandbox->get_keyword_validator(); //return callable
         *
         * @return  callable|null
         */
        public function get_keyword_validator(){
            return isset($this->validation['keyword']) ? $this->validation['keyword'] : null;
        }
        /** Unset validation callable for keywords
         *
         * @example $sandbox->unset_keyword_validator(); //clear custom validation
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function unset_keyword_validator(){
            $this->validation['keyword'] = null;
            return $this;
        }
        /** Set validation callable for operators
         *
         * Validator callable must accept two parameters: a string of the normalized name of the checked element,
         * and the PHPSandbox instance
         *
         * @example $sandbox->set_operator_validator(function($operator, PHPSandbox $sandbox){ return true; });
         *
         * @param   callable        $callable   Callable that validates the passed operator name
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function set_operator_validator($callable){
            $this->validation['operator'] = $callable;
            return $this;
        }
        /** Get validation callable for operators
         *
         * @example $sandbox->get_operator_validator(); //return callable
         *
         * @return  callable|null
         */
        public function get_operator_validator(){
            return isset($this->validation['operator']) ? $this->validation['operator'] : null;
        }
        /** Unset validation callable for operators
         *
         * @example $sandbox->unset_operator_validator(); //clear custom validation
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function unset_operator_validator(){
            $this->validation['operator'] = null;
            return $this;
        }
        /** Set validation callable for primitives
         *
         * Validator callable must accept two parameters: a string of the normalized name of the checked element,
         * and the PHPSandbox instance
         *
         * @example $sandbox->set_primitive_validator(function($primitive, PHPSandbox $sandbox){ return true; });
         *
         * @param   callable        $callable   Callable that validates the passed primitive name
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function set_primitive_validator($callable){
            $this->validation['primitive'] = $callable;
            return $this;
        }
        /** Get validation callable for primitives
         *
         * @example $sandbox->get_primitive_validator(); //return callable
         *
         * @return  callable|null
         */
        public function get_primitive_validator(){
            return isset($this->validation['primitive']) ? $this->validation['primitive'] : null;
        }
        /** Unset validation callable for primitives
         *
         * @example $sandbox->unset_primitive_validator(); //clear custom validation
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function unset_primitive_validator(){
            $this->validation['primitive'] = null;
            return $this;
        }
        /** Set validation callable for types
         *
         * Validator callable must accept two parameters: a string of the normalized name of the checked element,
         * and the PHPSandbox instance
         *
         * @example $sandbox->set_type_validator(function($type, PHPSandbox $sandbox){ return true; });
         *
         * @param   callable        $callable   Callable that validates the passed type name
         *
         * @return PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function set_type_validator($callable){
            $this->validation['type'] = $callable;
            return $this;
        }
        /** Get validation callable for types
         *
         * @example $sandbox->get_type_validator(); //return callable
         *
         * @return  callable|null
         */
        public function get_type_validator(){
            return isset($this->validation['type']) ? $this->validation['type'] : null;
        }
        /** Unset validation callable for types
         *
         * @example $sandbox->unset_type_validator(); //clear custom validation
         *
         * @return  PHPSandbox      Returns the PHPSandbox instance for chainability
         */
        public function unset_type_validator(){
            $this->validation['type'] = null;
            return $this;
        }
        /** Set PHPSandbox prepended code
         *
         * @param   string         $prepended_code      Sets a string of the prepended code
         *
         * @return  PHPSandbox     Returns the PHPSandbox instance for chainability
         */
        public function set_prepended_code($prepended_code = ''){
            $this->prepended_code = $prepended_code;
            return $this;
        }
        /** Set PHPSandbox appended code
         *
         * @param   string         $appended_code       Sets a string of the appended code
         *
         * @return  PHPSandbox     Returns the PHPSandbox instance for chainability
         */
        public function set_appended_code($appended_code = ''){
            $this->appended_code = $appended_code;
            return $this;
        }
        /** Set PHPSandbox preparsed code
         *
         * @param   string         $preparsed_code       Sets a string of the preparsed code
         *
         * @return  PHPSandbox     Returns the PHPSandbox instance for chainability
         */
        public function set_preparsed_code($preparsed_code = ''){
            $this->preparsed_code = $preparsed_code;
            return $this;
        }
        /** Set PHPSandbox parsed AST array
         *
         * @param   array          $parsed_ast          Sets an array of the parsed AST code
         *
         * @return  PHPSandbox     Returns the PHPSandbox instance for chainability
         */
        public function set_parsed_ast(array $parsed_ast = array()){
            $this->parsed_ast = $parsed_ast;
            return $this;
        }
        /** Set PHPSandbox prepared code
         *
         * @param   string         $prepared_code       Sets a string of the prepared code
         *
         * @return  PHPSandbox     Returns the PHPSandbox instance for chainability
         */
        public function set_prepared_code($prepared_code = ''){
            $this->prepared_code = $prepared_code;
            return $this;
        }
        /** Set PHPSandbox prepared AST array
         *
         * @param   array          $prepared_ast        Sets an array of the prepared AST code
         *
         * @return  PHPSandbox     Returns the PHPSandbox instance for chainability
         */
        public function set_prepared_ast(array $prepared_ast = array()){
            $this->prepared_ast = $prepared_ast;
            return $this;
        }
        /** Set PHPSandbox generated code
         *
         * @param   string         $generated_code      Sets a string of the generated code
         *
         * @return  PHPSandbox     Returns the PHPSandbox instance for chainability
         */
        public function set_generated_code($generated_code = ''){
            $this->generated_code = $generated_code;
            return $this;
        }
        /** Set PHPSandbox generated code
         *
         * @alias   set_generated_code();
         *
         * @param  string          $generated_code      Sets a string of the generated code
         *
         * @return  PHPSandbox     Returns the PHPSandbox instance for chainability
         */
        public function set_code($generated_code = ''){
            $this->generated_code = $generated_code;
            return $this;
        }
        /** Get PHPSandbox prepended code
         * @return  string          Returns a string of the prepended code
         */
        public function get_prepended_code(){
            return $this->prepended_code;
        }
        /** Get PHPSandbox appended code
         * @return  string          Returns a string of the appended code
         */
        public function get_appended_code(){
            return $this->appended_code;
        }
        /** Get PHPSandbox preparsed code
         * @return  string          Returns a string of the preparsed code
         */
        public function get_preparsed_code(){
            return $this->preparsed_code;
        }
        /** Get PHPSandbox parsed AST array
         * @return  array           Returns an array of the parsed AST code
         */
        public function get_parsed_ast(){
            return $this->parsed_ast;
        }
        /** Get PHPSandbox prepared code
         * @return  string          Returns a string of the prepared code
         */
        public function get_prepared_code(){
            return $this->prepared_code;
        }
        /** Get PHPSandbox prepared AST array
         * @return  array           Returns an array of the prepared AST code
         */
        public function get_prepared_ast(){
            return $this->prepared_ast;
        }
        /** Get PHPSandbox generated code
         * @return  string          Returns a string of the generated code
         */
        public function get_generated_code(){
            return $this->generated_code;
        }
        /** Get PHPSandbox generated code
         * @alias   get_generated_code();
         * @return  string          Returns a string of the generated code
         */
        public function get_code(){
            return $this->generated_code;
        }
        /** Get PHPSandbox redefined functions in place of get_defined_functions(). This is an internal PHPSandbox function but requires public access to work.
         *
         * @param   array           $functions      Array result from get_defined_functions() is passed here
         *
         * @return  array           Returns the redefined functions array
         */
        public function _get_defined_functions(array $functions = array()){
            if(count($this->whitelist['functions'])){
                $functions = array();
                foreach($this->whitelist['functions'] as $name => $value){
                    if(isset($this->definitions['functions'][$name]) && is_callable($this->definitions['functions'][$name])){
                        $functions[$name] = $name;
                    } else if(is_callable($name) && is_string($name)){
                        $functions[$name] = $name;
                    }
                }
                foreach($this->definitions['functions'] as $name => $function){
                    if(is_callable($function)){
                        $functions[$name] = $name;
                    }
                }
                return array_values($functions);
            } else if(count($this->blacklist['functions'])){
                foreach($functions as $index => $name){
                    if(isset($this->blacklist['functions'][$name])){
                        unset($functions[$index]);
                    }
                }
                reset($functions);
                return $functions;
            }
            return array();
        }
        /** Get PHPSandbox redefined variables in place of get_defined_vars(). This is an internal PHPSandbox function but requires public access to work.
         *
         * @param   array           $variables      Array result from get_defined_vars() is passed here
         *
         * @return  array           Returns the redefined variables array
         */
        public function _get_defined_vars(array $variables = array()){
            if(isset($variables[$this->name])){
                unset($variables[$this->name]); //hide PHPSandbox variable
            }
            return $variables;
        }
        /** Get PHPSandbox redefined superglobal. This is an internal PHPSandbox function but requires public access to work.
         *
         * @param   string          $name      Requested superglobal name (e.g. _GET, _POST, etc.)
         *
         * @return  array           Returns the redefined superglobal
         */
        public function _get_superglobal($name){
            $original_name = strtoupper($name);
            $name = $this->normalize_superglobal($name);
            if(isset($this->definitions['superglobals'][$name])){
                $superglobal = $this->definitions['superglobals'][$name];
                if(is_callable($superglobal)){
                    return call_user_func_array($superglobal, array($this));
                }
                return $superglobal;
            } else if(isset($this->whitelist['superglobals'][$name])){
                if(count($this->whitelist['superglobals'][$name])){
                    if(isset($GLOBALS[$original_name])){
                        $whitelisted_superglobal = array();
                        foreach($this->whitelist['superglobals'][$name] as $key => $value){
                            if(isset($GLOBALS[$original_name][$key])){
                                $whitelisted_superglobal[$key] = $GLOBALS[$original_name][$key];
                            }
                        }
                        return $whitelisted_superglobal;
                    }
                } else if(isset($GLOBALS[$original_name])) {
                    return $GLOBALS[$original_name];
                }
            } else if(isset($this->blacklist['superglobals'][$name])){
                if(count($this->blacklist['superglobals'][$name])){
                    if(isset($GLOBALS[$original_name])){
                        $blacklisted_superglobal = $GLOBALS[$original_name];
                        foreach($this->blacklist['superglobals'][$name] as $key => $value){
                            if(isset($blacklisted_superglobal[$key])){
                                unset($blacklisted_superglobal[$key]);
                            }
                        }
                        return $blacklisted_superglobal;
                    }
                }
            }
            return array();
        }
        /** Get PHPSandbox redefined magic constant. This is an internal PHPSandbox function but requires public access to work.
         *
         * @param   string          $name      Requested magic constant name (e.g. __FILE__, __LINE__, etc.)
         *
         * @return  array           Returns the redefined magic constant
         */
        public function _get_magic_const($name){
            $name = $this->normalize_magic_const($name);
            if(isset($this->definitions['magic_constants'][$name])){
                $magic_constant = $this->definitions['magic_constants'][$name];
                if(is_callable($magic_constant)){
                    return call_user_func_array($magic_constant, array($this));
                }
                return $magic_constant;
            }
            return null;
        }
        /** Get PHPSandbox redefined constants in place of get_defined_constants(). This is an internal PHPSandbox function but requires public access to work.
         *
         * @param   array           $constants      Array result from get_defined_constants() is passed here
         *
         * @return  array           Returns the redefined constants
         */
        public function _get_defined_constants(array $constants = array()){
            if(count($this->whitelist['constants'])){
                $constants = array();
                foreach($this->whitelist['constants'] as $name => $value){
                    if(defined($name)){
                        $constants[$name] = $name;
                    }
                }
                foreach($this->definitions['constants'] as $name => $value){
                    if(defined($name)){ //these shouldn't be undefined, but just in case they are we don't want to report inaccurate information
                        $constants[$name] = $name;
                    }
                }
                return array_values($constants);
            } else if(count($this->blacklist['constants'])){
                foreach($constants as $index => $name){
                    if(isset($this->blacklist['constants'][$name])){
                        unset($constants[$index]);
                    }
                }
                reset($constants);
                return $constants;
            }
            return array();
        }
        /** Get PHPSandbox redefined classes in place of get_declared_classes(). This is an internal PHPSandbox function but requires public access to work.
         *
         * @param   array           $classes      Array result from get_declared_classes() is passed here
         *
         * @return  array           Returns the redefined classes
         */
        public function _get_declared_classes(array $classes = array()){
            if(count($this->whitelist['classes'])){
                $classes = array();
                foreach($this->whitelist['classes'] as $name => $value){
                    if(class_exists($name)){
                        $classes[strtolower($name)] = $name;
                    }
                }
                foreach($this->definitions['classes'] as $name => $value){
                    if(class_exists($value)){
                        $classes[strtolower($name)] = $value;
                    }
                }
                return array_values($classes);
            } else if(count($this->blacklist['classes'])){
                $valid_classes = array();
                foreach($classes as $class){
                    $valid_classes[$this->normalize_class($class)] = $class;
                }
                foreach($this->definitions['classes'] as $name => $value){
                    if(class_exists($value)){
                        $valid_classes[$this->normalize_class($name)] = $value;
                    }
                }
                foreach($valid_classes as $index => $name){
                    if(isset($this->blacklist['classes'][$this->normalize_class($name)])){
                        unset($valid_classes[$index]);
                    }
                }
                return array_values($classes);
            }
            $classes = array();
            foreach($this->definitions['classes'] as $value){
                if(class_exists($value)){
                    $classes[strtolower($value)] = $value;
                }
            }
            return array_values($classes);
        }
        /** Get PHPSandbox redefined interfaces in place of get_declared_interfaces(). This is an internal PHPSandbox function but requires public access to work.
         *
         * @param   array           $interfaces      Array result from get_declared_interfaces() is passed here
         *
         * @return  array           Returns the redefined interfaces
         */
        public function _get_declared_interfaces(array $interfaces = array()){
            if(count($this->whitelist['interfaces'])){
                $interfaces = array();
                foreach($this->whitelist['interfaces'] as $name => $value){
                    if(interface_exists($name)){
                        $interfaces[strtolower($name)] = $name;
                    }
                }
                foreach($this->definitions['interfaces'] as $name => $value){
                    if(interface_exists($value)){
                        $interfaces[strtolower($name)] = $value;
                    }
                }
                return array_values($interfaces);
            } else if(count($this->blacklist['interfaces'])){
                $valid_interfaces = array();
                foreach($interfaces as $interface){
                    $valid_interfaces[$this->normalize_interface($interface)] = $interface;
                }
                foreach($this->definitions['interfaces'] as $name => $value){
                    if(interface_exists($value)){
                        $valid_interfaces[$this->normalize_interface($name)] = $value;
                    }
                }
                foreach($valid_interfaces as $index => $name){
                    if(isset($this->blacklist['interfaces'][$this->normalize_interface($name)])){
                        unset($valid_interfaces[$index]);
                    }
                }
                return array_values($interfaces);
            }
            $interfaces = array();
            foreach($this->definitions['interfaces'] as $value){
                if(interface_exists($value)){
                    $interfaces[strtolower($value)] = $value;
                }
            }
            return array_values($interfaces);
        }
        /** Get PHPSandbox redefined traits in place of get_declared_traits(). This is an internal PHPSandbox function but requires public access to work.
         *
         * @param   array           $traits      Array result from get_declared_traits() is passed here
         *
         * @return  array           Returns the redefined traits
         */
        public function _get_declared_traits(array $traits = array()){
            if(count($this->whitelist['traits'])){
                $traits = array();
                foreach($this->whitelist['traits'] as $name => $value){
                    if(trait_exists($name)){
                        $traits[strtolower($name)] = $name;
                    }
                }
                foreach($this->definitions['traits'] as $name => $value){
                    if(trait_exists($value)){
                        $traits[strtolower($name)] = $value;
                    }
                }
                return array_values($traits);
            } else if(count($this->blacklist['traits'])){
                $valid_traits = array();
                foreach($traits as $trait){
                    $valid_traits[$this->normalize_trait($trait)] = $trait;
                }
                foreach($this->definitions['traits'] as $name => $value){
                    if(trait_exists($value)){
                        $valid_traits[$this->normalize_trait($name)] = $value;
                    }
                }
                foreach($valid_traits as $index => $name){
                    if(isset($this->blacklist['traits'][$this->normalize_trait($name)])){
                        unset($valid_traits[$index]);
                    }
                }
                return array_values($traits);
            }
            $traits = array();
            foreach($this->definitions['traits'] as $value){
                if(trait_exists($value)){
                    $traits[strtolower($value)] = $value;
                }
            }
            return array_values($traits);
        }
        /** Get PHPSandbox redefined function arguments array
         *
         * @param   array           $arguments      Array result from func_get_args() is passed here
         *
         * @return  array           Returns the redefined arguments array
         */
        public function _func_get_args(array $arguments = array()){
            foreach($arguments as $index => $value){
                if($value instanceof self){
                    unset($arguments[$index]); //hide PHPSandbox variable
                }
            }
            return $arguments;
        }
        /** Get PHPSandbox redefined function argument
         *
         * @param   array           $arguments      Array result from func_get_args() is passed here
         *
         * @param   int             $index          Requested func_get_arg index is passed here
         *
         * @return  array           Returns the redefined argument
         */
        public function _func_get_arg(array $arguments = array(), $index = 0){
            if($arguments[$index] instanceof self){
                $index++;   //get next argument instead
            }
            return isset($arguments[$index]) && !($arguments[$index] instanceof self) ? $arguments[$index] : null;
        }
        /** Get PHPSandbox redefined number of function arguments
         *
         * @param   array           $arguments      Array result from func_get_args() is passed here
         *
         * @return  int             Returns the redefined number of function arguments
         */
        public function _func_num_args(array $arguments = array()){
            $count = count($arguments);
            foreach($arguments as $argument){
                if($argument instanceof self){
                    $count--;
                }
            }
            return $count > 0 ? $count : 0;
        }
        /** Get PHPSandbox redefined var_dump
         *
         * @return  array           Returns the redefined var_dump
         */
        public function _var_dump(){
            $arguments = func_get_args();
            foreach($arguments as $index => $value){
                if($value instanceof self){
                    unset($arguments[$index]); //hide PHPSandbox variable
                } else if($value instanceof SandboxedString){
                    $arguments[$index] = strval($value);
                }
            }
            return call_user_func_array('var_dump', $arguments);
        }
        /** Get PHPSandbox redefined print_r
         *
         * @return  array           Returns the redefined print_r
         */
        public function _print_r(){
            $arguments = func_get_args();
            foreach($arguments as $index => $value){
                if($value instanceof self){
                    unset($arguments[$index]); //hide PHPSandbox variable
                } else if($value instanceof SandboxedString){
                    $arguments[$index] = strval($value);
                }
            }
            return call_user_func_array('print_r', $arguments);
        }
        /** Get PHPSandbox redefined var_export
         *
         * @return  array           Returns the redefined var_export
         */
        public function _var_export(){
            $arguments = func_get_args();
            foreach($arguments as $index => $value){
                if($value instanceof self){
                    unset($arguments[$index]); //hide PHPSandbox variable
                } else if($value instanceof SandboxedString){
                    $arguments[$index] = strval($value);
                }
            }
            return call_user_func_array('var_export', $arguments);
        }
        /** Return integer value of SandboxedString or mixed value
         *
         * @param   mixed           $value      Value to return as integer
         *
         * @return  int             Returns the integer value
         */
        public function _intval($value){
            return intval($value instanceof SandboxedString ? strval($value) : $value);
        }
        /** Return float value of SandboxedString or mixed value
         *
         * @param   mixed           $value      Value to return as float
         *
         * @return  float           Returns the float value
         */
        public function _floatval($value){
            return floatval($value instanceof SandboxedString ? strval($value) : $value);
        }
        /** Return boolean value of SandboxedString or mixed value
         *
         * @param   mixed           $value      Value to return as boolean
         *
         * @return  boolean           Returns the boolean value
         */
        public function _boolval($value){
            if($value instanceof SandboxedString){
                return (bool)strval($value);
            }
            return is_bool($value) ? $value : (bool)$value;
        }
        /** Return array value of SandboxedString or mixed value
         *
         * @param   mixed           $value      Value to return as array
         *
         * @return  array           Returns the array value
         */
        public function _arrayval($value){
            if($value instanceof SandboxedString){
                return (array)strval($value);
            }
            return is_array($value) ? $value : (array)$value;
        }
        /** Return object value of SandboxedString or mixed value
         *
         * @param   mixed           $value      Value to return as object
         *
         * @return  object          Returns the object value
         */
        public function _objectval($value){
            if($value instanceof SandboxedString){
                return (object)strval($value);
            }
            return is_object($value) ? $value : (object)$value;
        }
        /** Return is_string value of SandboxedString or mixed value
         *
         * @param   mixed           $value      Value to check if is_string
         *
         * @return  bool            Returns the is_string value
         */
        public function _is_string($value){
            return ($value instanceof SandboxedString) ? true : is_string($value);
        }
        /** Return is_object value of SandboxedString or mixed value
         *
         * @param   mixed           $value      Value to check if is_object
         *
         * @return  bool            Returns the is_object value
         */
        public function _is_object($value){
            return ($value instanceof SandboxedString) ? false : is_object($value);
        }
        /** Return is_scalar value of SandboxedString or mixed value
         *
         * @param   mixed           $value      Value to check if is_scalar
         *
         * @return  bool            Returns the is_scalar value
         */
        public function _is_scalar($value){
            return ($value instanceof SandboxedString) ? true : is_scalar($value);
        }
        /** Return is_callable value of SandboxedString or mixed value
         *
         * @param   mixed           $value      Value to check if is_callable
         *
         * @return  bool            Returns the is_callable value
         */
        public function _is_callable($value){
            if($value instanceof SandboxedString){
                $value = strval($value);
            }
            return is_callable($value);
        }
        /** Return get_included_files() and sandboxed included files
         *
         * @return  array           Returns array of get_included_files() and sandboxed included files
         */
        public function _get_included_files(){
            return array_merge(get_included_files(), $this->includes);
        }
        /** Sandbox included file
         *
         * @param   string          $file      Included file to sandbox
         *
         * @return  mixed           Returns value passed from included file
         */
        public function _include($file){
            if($file instanceof SandboxedString){
                $file = strval($file);
            }
            $code = @file_get_contents($file, true);
            if($code === false){
                trigger_error("include('" . $file . "') [function.include]: failed to open stream. No such file or directory", E_USER_WARNING);
                return false;
            }
            if(!in_array($file, $this->_get_included_files())){
                $this->includes[] = $file;
            }
            return $this->execute($code);
        }
        /** Sandbox included once file
         *
         * @param   string          $file      Included once file to sandbox
         *
         * @return  mixed           Returns value passed from included once file
         */
        public function _include_once($file){
            if($file instanceof SandboxedString){
                $file = strval($file);
            }
            if(!in_array($file, $this->_get_included_files())){
                $code = @file_get_contents($file, true);
                if($code === false){
                    trigger_error("include_once('" . $file . "') [function.include-once]: failed to open stream. No such file or directory", E_USER_WARNING);
                    return false;
                }
                $this->includes[] = $file;
                return $this->execute($code);
            }
            return null;
        }
        /** Sandbox required file
         *
         * @param   string          $file      Required file to sandbox
         *
         * @return  mixed           Returns value passed from required file
         */
        public function _require($file){
            if($file instanceof SandboxedString){
                $file = strval($file);
            }
            $code = @file_get_contents($file, true);
            if($code === false){
                trigger_error("require('" . $file . "') [function.require]: failed to open stream. No such file or directory", E_USER_WARNING);
                trigger_error("Failed opening required '" . $file . "' (include_path='" . get_include_path() . "')", E_USER_ERROR);
                return false;
            }
            if(!in_array($file, $this->_get_included_files())){
                $this->includes[] = $file;
            }
            return $this->execute($code);
        }
        /** Sandbox required once file
         *
         * @param   string          $file      Required once file to sandbox
         *
         * @return  mixed           Returns value passed from required once file
         */
        public function _require_once($file){
            if($file instanceof SandboxedString){
                $file = strval($file);
            }
            if(!in_array($file,  $this->_get_included_files())){
                $code = @file_get_contents($file, true);
                if($code === false){
                    trigger_error("require_once('" . $file . "') [function.require-once]: failed to open stream. No such file or directory", E_USER_WARNING);
                    trigger_error("Failed opening required '" . $file . "' (include_path='" . get_include_path() . "')", E_USER_ERROR);
                    return false;
                }
                $this->includes[] = $file;
                return $this->execute($code);
            }
            return null;
        }
        /** Get PHPSandbox redefined function. This is an internal PHPSandbox function but requires public access to work.
         *
         * @throws  Error           Will throw exception if invalid function requested
         *
         * @return  mixed           Returns the redefined function result
         */
        public function call_func(){
            $arguments = func_get_args();
            $name = array_shift($arguments);
            $original_name = $name;
            $name = $this->normalize_func($name);
            if(isset($this->definitions['functions'][$name]) && is_callable($this->definitions['functions'][$name]['function'])){
                $function = $this->definitions['functions'][$name]['function'];
                if($this->definitions['functions'][$name]['pass_sandbox']){            //pass the PHPSandbox instance to the defined function?
                    array_unshift($arguments, $this);  //push PHPSandbox instance into first argument so user can test against it
                }
                return call_user_func_array($function, $arguments);
            }
            if(is_callable($name)){
                return call_user_func_array($name, $arguments);
            }
            return $this->validation_error("Sandboxed code attempted to call invalid function: $original_name", Error::VALID_FUNC_ERROR, null, $original_name);
        }
        /** Define PHPSandbox definitions, such as functions, constants, namespaces, etc.
         *
         * You can pass a string of the $type, $name and $value, or pass an associative array of definitions types and
         * an associative array of their corresponding values
         *
         * @example $sandbox->define('functions', 'test', function(){ echo 'test'; });
         *
         * @example $sandbox->define(array('functions' => array('test' => function(){ echo 'test'; }));
         *
         * @param   string|array        $type       Associative array or string of definition type to define
         * @param   string|array|null   $name       Associative array or string of definition name to define
         * @param   mixed|null          $value      Value of definition to define
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function define($type, $name = null, $value = null){
            if(is_array($type)){
                foreach($type as $_type => $name){
                    if(is_string($_type) && $_type && is_array($name)){
                        foreach($name as $_name => $_value){
                            $this->define($_type, (is_int($_name) ? $_value : $_name), (is_int($_name) ? $value : $_value));
                        }
                    }
                }
            } else if($type && is_array($name)){
                foreach($name as $_name => $_value){
                    $this->define($type, (is_int($_name) ? $_value : $_name), (is_int($_name) ? $value : $_value));
                }
            } else if($type && $name){
                switch($type){
                    case 'functions':
                        return $this->define_func($name, $value);
                    case 'variables':
                        return $this->define_var($name, $value);
                    case 'superglobals':
                        return $this->define_superglobal($name, $value);
                    case 'constants':
                        return $this->define_const($name, $value);
                    case 'magic_constants':
                        return $this->define_magic_const($name, $value);
                    case 'namespaces':
                        return $this->define_namespace($name);
                    case 'aliases':
                        return $this->define_alias($name, $value);
                    case 'classes':
                        return $this->define_class($name, $value);
                    case 'interfaces':
                        return $this->define_interface($name, $value);
                    case 'traits':
                        return $this->define_trait($name, $value);
                }
            }
            return $this;
        }
        /** Undefine PHPSandbox definitions, such as functions, constants, namespaces, etc.
         *
         * You can pass a string of the $type and $name to undefine, or pass an associative array of definitions types
         * and an array of key names to undefine
         *
         * @example $sandbox->undefine('functions', 'test');
         *
         * @example $sandbox->undefine(array('functions' => array('test'));
         *
         * @param   string|array    $type       Associative array or string of definition type to undefine
         * @param   string|array    $name       Associative array or string of definition name to undefine
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function undefine($type, $name = null){
            if(is_array($type)){
                foreach($type as $_type => $name){
                    if(is_string($_type) && $_type && is_array($name)){
                        foreach($name as $_name){
                            if(is_string($_name) && $_name){
                                $this->undefine($type, $name);
                            }
                        }
                    }
                }
            } else if(is_string($type) && $type && is_array($name)){
                foreach($name as $_name){
                    if(is_string($_name) && $_name){
                        $this->undefine($type, $name);
                    }
                }
            } else if($type && $name){
                switch($type){
                    case 'functions':
                        return $this->undefine_func($name);
                    case 'variables':
                        return $this->undefine_var($name);
                    case 'superglobals':
                        return $this->undefine_superglobal($name);
                    case 'constants':
                        return $this->undefine_const($name);
                    case 'magic_constants':
                        return $this->undefine_magic_const($name);
                    case 'namespaces':
                        return $this->undefine_namespace($name);
                    case 'aliases':
                        return $this->undefine_alias($name);
                    case 'classes':
                        return $this->undefine_class($name);
                    case 'interfaces':
                        return $this->undefine_interface($name);
                    case 'traits':
                        return $this->undefine_trait($name);
                }
            }
            return $this;
        }
        /** Define PHPSandbox function
         *
         * You can pass the function $name and $function closure or callable to define, or an associative array of
         * functions to define, which can have callable values or arrays of the function callable and $pass_sandbox flag
         *
         * @example $sandbox->define_func('test', function(){ echo 'test'; });
         *
         * @example $sandbox->define_func(array('test' => function(){ echo 'test'; }));
         *
         * @example $sandbox->define_func(array('test' => array(function(){ echo 'test'; }, true)));
         *
         * @param   string|array    $name           Associative array or string of function $name to define
         * @param   callable        $function       Callable to define $function to
         * @param   bool            $pass_sandbox   Pass PHPSandbox instance to defined function when called? Default is false
         *
         * @throws  Error           Throws exception if unnamed or uncallable $function is defined
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function define_func($name, $function, $pass_sandbox = false){
            if(is_array($name)){
                return $this->define_funcs($name);
            }
            if(!$name){
                $this->validation_error("Cannot define unnamed function!", Error::DEFINE_FUNC_ERROR, null, '');
            }
            if(is_array($function) && count($function)){    //so you can pass array of function names and array of function and pass_sandbox flag
                $pass_sandbox = isset($function[1]) ? $function[1] : false;
                $function = $function[0];
            }
            $original_name = $name;
            $name = $this->normalize_func($name);
            if(!is_callable($function)){
                $this->validation_error("Cannot define uncallable function : $original_name", Error::DEFINE_FUNC_ERROR, null, $original_name);
            }
            $this->definitions['functions'][$name] = array(
                'function' => $function,
                'pass_sandbox' => $pass_sandbox
            );
            return $this;
        }
        /** Define PHPSandbox functions by array
         *
         * You can pass an associative array of functions to define
         *
         * @example $sandbox->define_funcs(array('test' => function(){ echo 'test'; }));
         *
         * @param   array           $functions       Associative array of $functions to define
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function define_funcs(array $functions = array()){
            foreach($functions as $name => $function){
                $this->define_func($name, $function);
            }
            return $this;
        }
        /** Query whether PHPSandbox instance has defined functions
         *
         * @example $sandbox->has_defined_funcs(); //returns number of defined functions, or zero if none defined
         *
         * @return  int           Returns the number of functions this instance has defined
         */
        public function has_defined_funcs(){
            return count($this->definitions['functions']);
        }
        /** Check if PHPSandbox instance has $name function defined
         *
         * @example $sandbox->is_defined_func('test');
         *
         * @param   string          $name       String of function $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has defined function, false otherwise
         */
        public function is_defined_func($name){
            $name = $this->normalize_func($name);
            return isset($this->definitions['functions'][$name]);
        }
        /** Undefine PHPSandbox function
         *
         * You can pass a string of function $name to undefine, or pass an array of function names to undefine
         *
         * @example $sandbox->undefine_func('test');
         *
         * @example $sandbox->undefine_func(array('test', 'test2'));
         *
         * @param   string|array          $name       String of function name or array of function names to undefine
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function undefine_func($name){
            if(is_array($name)){
                return $this->undefine_funcs($name);
            }
            $name = $this->normalize_func($name);
            if(isset($this->definitions['functions'][$name])){
                unset($this->definitions['functions'][$name]);
            }
            return $this;
        }
        /** Undefine PHPSandbox functions by array
         *
         * You can pass an array of function names to undefine, or an empty array or null argument to undefine all functions
         *
         * @example $sandbox->undefine_funcs(array('test', 'test2'));
         *
         * @example $sandbox->undefine_funcs(); //WILL UNDEFINE ALL FUNCTIONS!
         *
         * @param   array           $functions       Array of function names to undefine. Passing an empty array or no argument will result in undefining all functions
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function undefine_funcs($functions = array()){
            if(count($functions)){
                foreach($functions as $function){
                    $this->undefine_func($function);
                }
            } else {
                $this->definitions['functions'] = array();
            }
            return $this;
        }
        /** Define PHPSandbox variable
         *
         * You can pass the variable $name and $value to define, or an associative array of variables to define
         *
         * @example $sandbox->define_var('test', 1);
         *
         * @example $sandbox->define_var(array('test' => 1));
         *
         * @param   string|array    $name       String of variable $name or associative array to define
         * @param   mixed           $value      Value to define variable to
         *
         * @throws  Error           Throws exception if unnamed variable is defined
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function define_var($name, $value){
            if(is_array($name)){
                return $this->define_vars($name);
            }
            if(!$name){
                $this->validation_error("Cannot define unnamed variable!", Error::DEFINE_VAR_ERROR, null, '');
            }
            $this->definitions['variables'][$name] = $value;
            return $this;
        }
        /** Define PHPSandbox variables by array
         *
         * You can pass an associative array of variables to define
         *
         * @example $sandbox->define_vars(array('test' => 1));
         *
         * @param   array           $variables  Associative array of $variables to define
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function define_vars(array $variables = array()){
            foreach($variables as $name => $value){
                $this->define_var($name, $value);
            }
            return $this;
        }
        /** Query whether PHPSandbox instance has defined variables
         *
         * @example $sandbox->has_defined_vars(); //returns number of defined variables, or zero if none defined
         *
         * @return  int           Returns the number of variables this instance has defined
         */
        public function has_defined_vars(){
            return count($this->definitions['variables']);
        }
        /** Check if PHPSandbox instance has $name variable defined
         *
         * @example $sandbox->is_defined_var('test');
         *
         * @param   string          $name       String of variable $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has defined variable, false otherwise
         */
        public function is_defined_var($name){
            return isset($this->definitions['variables'][$name]);
        }
        /** Undefine PHPSandbox variable
         *
         * You can pass a string of variable $name to undefine, or an array of variable names to undefine
         *
         * @example $sandbox->undefine_var('test');
         *
         * @example $sandbox->undefine_var(array('test', 'test2'));
         *
         * @param   string|array          $name       String of variable name or an array of variable names to undefine
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function undefine_var($name){
            if(is_array($name)){
                return $this->undefine_vars($name);
            }
            if(isset($this->definitions['variables'][$name])){
                unset($this->definitions['variables'][$name]);
            }
            return $this;
        }
        /** Undefine PHPSandbox variables by array
         *
         * You can pass an array of variable names to undefine, or an empty array or null argument to undefine all variables
         *
         * @example $sandbox->undefine_vars(array('test', 'test2'));
         *
         * @example $sandbox->undefine_vars(); //WILL UNDEFINE ALL VARIABLES!
         *
         * @param   array           $variables       Array of variable names to undefine. Passing an empty array or no argument will result in undefining all variables
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function undefine_vars(array $variables = array()){
            if(count($variables)){
                foreach($variables as $variable){
                    $this->undefine_var($variable);
                }
            } else {
                $this->definitions['variables'] = array();
            }
            return $this;
        }
        /** Define PHPSandbox superglobal
         *
         * You can pass the superglobal $name and $value to define, or an associative array of superglobals to define, or a third variable to define the $key
         *
         * @example $sandbox->define_superglobal('_GET',  array('page' => 1));
         *
         * @example $sandbox->define_superglobal(array('_GET' => array('page' => 1)));
         *
         * @example $sandbox->define_superglobal('_GET', 'page', 1);
         *
         * @param   string|array    $name       String of superglobal $name or associative array of superglobal names to define
         * @param   mixed           $value      Value to define superglobal to, can be callable
         *
         * @throws  Error           Throws exception if unnamed superglobal is defined
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function define_superglobal($name, $value){
            if(is_array($name)){
                return $this->define_superglobals($name);
            }
            if(!$name){
                $this->validation_error("Cannot define unnamed superglobal!", Error::DEFINE_SUPERGLOBAL_ERROR, null, '');
            }
            $name = $this->normalize_superglobal($name);
            if(func_num_args() > 2){
                $key = $value;
                $value = func_get_arg(2);
                $this->definitions['superglobals'][$name][$key] = $value;
            } else {
                $this->definitions['superglobals'][$name] = $value;
            }
            return $this;
        }
        /** Define PHPSandbox superglobals by array
         *
         * You can pass an associative array of superglobals to define
         *
         * @example $sandbox->define_superglobals(array('_GET' => array('page' => 1)));
         *
         * @param   array           $superglobals  Associative array of $superglobals to define
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function define_superglobals(array $superglobals = array()){
            foreach($superglobals as $name => $value){
                $this->define_superglobal($name, $value);
            }
            return $this;
        }
        /** Query whether PHPSandbox instance has defined superglobals, or if superglobal $name has defined keys
         *
         * @example $sandbox->has_defined_superglobals(); //returns number of defined superglobals, or zero if none defined
         *
         * @example $sandbox->has_defined_superglobals('_GET'); //returns number of defined superglobal _GET keys, or zero if none defined
         *
         * @param   string|null     $name       String of superglobal $name to check for keys
         *
         * @return  int|bool        Returns the number of superglobals or superglobal keys this instance has defined, or false if invalid superglobal name specified
         */
        public function has_defined_superglobals($name = null){
            $name = $name ? $this->normalize_superglobal($name) : null;
            return $name ? (isset($this->definitions['superglobals'][$name]) ? count($this->definitions['superglobals'][$name]) : false) : count($this->definitions['superglobals']);
        }
        /** Check if PHPSandbox instance has $name superglobal defined, or if superglobal $name key is defined
         *
         * @example $sandbox->is_defined_superglobal('_GET');
         *
         * @example $sandbox->is_defined_superglobal('_GET', 'page');
         *
         * @param   string          $name       String of superglobal $name to query
         * @param   string|null     $key        String of key to to query in superglobal
         *
         * @return  bool            Returns true if PHPSandbox instance has defined superglobal, false otherwise
         */
        public function is_defined_superglobal($name, $key = null){
            $name = $this->normalize_superglobal($name);
            return $key !== null ? isset($this->definitions['superglobals'][$name][$key]) : isset($this->definitions['superglobals'][$name]);
        }
        /** Undefine PHPSandbox superglobal or superglobal key
         *
         * You can pass a string of superglobal $name to undefine, or a superglobal $key to undefine, or an array of
         * superglobal names to undefine, or an an associative array of superglobal names and keys to undefine
         *
         * @example $sandbox->undefine_superglobal('_GET');
         *
         * @example $sandbox->undefine_superglobal('_GET', 'page');
         *
         * @example $sandbox->undefine_superglobal(array('_GET', '_POST'));
         *
         * @param   string|array          $name       String of superglobal $name, or array of superglobal names, or associative array of superglobal names and keys to undefine
         * @param   string|null           $key        String of superglobal $key to undefine
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function undefine_superglobal($name, $key = null){
            if(is_array($name)){
                return $this->undefine_superglobals($name);
            }
            $name = $this->normalize_superglobal($name);
            if($key !== null && is_array($this->definitions['superglobals'][$name])){
                if(isset($this->definitions['superglobals'][$name][$key])){
                    unset($this->definitions['superglobals'][$name][$key]);
                }
            } else if(isset($this->definitions['superglobals'][$name])){
                $this->definitions['superglobals'][$name] = array();
            }
            return $this;
        }
        /** Undefine PHPSandbox superglobals by array
         *
         * You can pass an array of superglobal names to undefine, or an associative array of superglobals names and key
         * to undefine, or an empty array or null to undefine all superglobals
         *
         * @example $sandbox->undefine_superglobals(array('_GET', '_POST'));
         *
         * @example $sandbox->undefine_superglobals(array('_GET' => 'page', '_POST' => 'page'));
         *
         * @example $sandbox->undefine_superglobals(); //WILL UNDEFINE ALL SUPERGLOBALS!
         *
         * @param   array          $superglobals       Associative array of superglobal names and keys or array of superglobal names to undefine
         *
         * @return  PHPSandbox          Returns the PHPSandbox instance for chainability
         */
        public function undefine_superglobals(array $superglobals = array()){
            if(count($superglobals)){
                foreach($superglobals as $superglobal => $name){
                    $name = $this->normalize_superglobal($name);
                    $this->undefine_superglobal(is_int($superglobal) ? $name : $superglobal, is_int($superglobal) || !is_string($name) ? null : $name);
                }
            } else {
                $this->definitions['superglobals'] = array();
            }
            return $this;
        }
        /** Define PHPSandbox constant
         *
         * You can pass the constant $name and $value to define, or an associative array of constants to define
         *
         * @example $sandbox->define_const('TEST', 1);
         *
         * @example $sandbox->define_const(array('TEST' => 1));
         *
         * @param   string|array    $name       String of constant $name or associative array to define
         * @param   mixed           $value      Value to define constant to
         *
         * @throws  Error           Throws exception if unnamed constant is defined
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function define_const($name, $value){
            if(is_array($name)){
                return $this->define_consts($name);
            }
            if(!$name){
                $this->validation_error("Cannot define unnamed constant!", Error::DEFINE_CONST_ERROR, null, '');
            }
            $this->definitions['constants'][$name] = $value;
            return $this;
        }
        /** Define PHPSandbox constants by array
         *
         * You can pass an associative array of constants to define
         *
         * @example $sandbox->define_consts(array('test' => 1));
         *
         * @param   array           $constants  Associative array of $constants to define
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function define_consts(array $constants = array()){
            foreach($constants as $name => $value){
                $this->define_const($name, $value);
            }
            return $this;
        }
        /** Query whether PHPSandbox instance has defined constants
         *
         * @example $sandbox->has_defined_consts(); //returns number of defined constants, or zero if none defined
         *
         * @return  int           Returns the number of constants this instance has defined
         */
        public function has_defined_consts(){
            return count($this->definitions['constants']);
        }
        /** Check if PHPSandbox instance has $name constant defined
         *
         * @example $sandbox->is_defined_const('test');
         *
         * @param   string          $name       String of constant $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has defined constant, false otherwise
         */
        public function is_defined_const($name){
            return isset($this->definitions['constants'][$name]);
        }
        /** Undefine PHPSandbox constant
         *
         * You can pass a string of constant $name to undefine, or an array of constant names to undefine
         *
         * @example $sandbox->undefine_const('test');
         *
         * @example $sandbox->undefine_const(array('test', 'test2'));
         *
         * @param   string|array          $name       String of constant name or array of constant names to undefine
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function undefine_const($name){
            if(is_array($name)){
                return $this->undefine_consts($name);
            }
            if(isset($this->definitions['constants'][$name])){
                unset($this->definitions['constants'][$name]);
            }
            return $this;
        }
        /** Undefine PHPSandbox constants by array
         *
         * You can pass an array of constant names to undefine, or an empty array or null argument to undefine all constants
         *
         * @example $sandbox->undefine_consts(array('test', 'test2'));
         *
         * @example $sandbox->undefine_consts(); //WILL UNDEFINE ALL CONSTANTS!
         *
         * @param   array           $constants       Array of constant names to undefine. Passing an empty array or no argument will result in undefining all constants
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function undefine_consts(array $constants = array()){
            if(count($constants)){
                foreach($constants as $constant){
                    $this->undefine_const($constant);
                }
            } else {
                $this->definitions['constants'] = array();
            }
            return $this;
        }
        /** Define PHPSandbox magic constant
         *
         * You can pass the magic constant $name and $value to define, or an associative array of magic constants to define
         *
         * @example $sandbox->define_magic_const('__LINE__', 1);
         *
         * @example $sandbox->define_magic_const(array('__LINE__' => 1));
         *
         * @param   string|array    $name       String of magic constant $name or associative array to define
         * @param   mixed           $value      Value to define magic constant to, can be callable
         *
         * @throws  Error           Throws exception if unnamed magic constant is defined
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function define_magic_const($name, $value){
            if(is_array($name)){
                return $this->define_magic_consts($name);
            }
            if(!$name){
                $this->validation_error("Cannot define unnamed magic constant!", Error::DEFINE_MAGIC_CONST_ERROR, null, '');
            }
            $name = $this->normalize_magic_const($name);
            $this->definitions['magic_constants'][$name] = $value;
            return $this;
        }
        /** Define PHPSandbox magic constants by array
         *
         * You can pass an associative array of magic constants to define
         *
         * @example $sandbox->define_magic_consts(array('__LINE__' => 1));
         *
         * @param   array           $magic_constants  Associative array of $magic_constants to define
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function define_magic_consts(array $magic_constants = array()){
            foreach($magic_constants as $name => $value){
                $this->define_magic_const($name, $value);
            }
            return $this;
        }
        /** Query whether PHPSandbox instance has defined magic constants
         *
         * @example $sandbox->has_defined_magic_consts(); //returns number of defined magic constants, or zero if none defined
         *
         * @return  int           Returns the number of magic constants this instance has defined
         */
        public function has_defined_magic_consts(){
            return count($this->definitions['magic_constants']);
        }
        /** Check if PHPSandbox instance has $name magic constant defined
         *
         * @example $sandbox->is_defined_magic_const('__LINE__');
         *
         * @param   string          $name       String of magic constant $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has defined magic constant, false otherwise
         */
        public function is_defined_magic_const($name){
            $name = $this->normalize_magic_const($name);
            return isset($this->definitions['magic_constants'][$name]);
        }
        /** Undefine PHPSandbox magic constant
         *
         * You can pass an a string of magic constant $name to undefine, or array of magic constant names to undefine
         *
         * @example $sandbox->undefine_magic_const('__LINE__');
         *
         * @example $sandbox->undefine_magic_const(array('__LINE__', '__FILE__'));
         *
         * @param   string|array          $name       String of magic constant name, or array of magic constant names to undefine
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function undefine_magic_const($name){
            if(is_array($name)){
                return $this->undefine_magic_consts($name);
            }
            $name = $this->normalize_magic_const($name);
            if(isset($this->definitions['magic_constants'][$name])){
                unset($this->definitions['magic_constants'][$name]);
            }
            return $this;
        }
        /** Undefine PHPSandbox magic constants by array
         *
         * You can pass an array of magic constant names to undefine, or an empty array or null argument to undefine all magic constants
         *
         * @example $sandbox->undefine_magic_consts(array('__LINE__', '__FILE__'));
         *
         * @example $sandbox->undefine_magic_consts(); //WILL UNDEFINE ALL MAGIC CONSTANTS!
         *
         * @param   array           $magic_constants       Array of magic constant names to undefine. Passing an empty array or no argument will result in undefining all magic constants
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function undefine_magic_consts(array $magic_constants = array()){
            if(count($magic_constants)){
                foreach($magic_constants as $magic_constant){
                    $this->undefine_magic_const($magic_constant);
                }
            } else {
                $this->definitions['magic_constants'] = array();
            }
            return $this;
        }
        /** Define PHPSandbox namespace
         *
         * You can pass the namespace $name and $value to define, or an array of namespaces to define
         *
         * @example $sandbox->define_namespace('Foo');
         *
         * @example $sandbox->define_namespace(array('Foo', 'Bar'));
         *
         * @param   string|array    $name       String of namespace $name, or an array of namespace names to define
         *
         * @throws  Error           Throws exception if unnamed namespace is defined
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function define_namespace($name){
            if(is_array($name)){
                return $this->define_namespaces($name);
            }
            if(!$name){
                $this->validation_error("Cannot define unnamed namespace!", Error::DEFINE_NAMESPACE_ERROR, null, '');
            }
            $normalized_name = $this->normalize_namespace($name);
            $this->definitions['namespaces'][$normalized_name] = $name;
            return $this;
        }
        /** Define PHPSandbox namespaces by array
         *
         * You can pass an array of namespaces to define
         *
         * @example $sandbox->define_namespaces(array('Foo', 'Bar'));
         *
         * @param   array           $namespaces  Array of $namespaces to define
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function define_namespaces(array $namespaces = array()){
            foreach($namespaces as $name){
                $this->define_namespace($name);
            }
            return $this;
        }
        /** Query whether PHPSandbox instance has defined namespaces
         *
         * @example $sandbox->has_defined_namespaces(); //returns number of defined namespaces, or zero if none defined
         *
         * @return  int           Returns the number of namespaces this instance has defined
         */
        public function has_defined_namespaces(){
            return count($this->definitions['namespaces']);
        }
        /** Check if PHPSandbox instance has $name namespace defined
         *
         * @example $sandbox->is_defined_namespace('Foo');
         *
         * @param   string          $name       String of namespace $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has defined namespace, false otherwise
         */
        public function is_defined_namespace($name){
            $name = $this->normalize_namespace($name);
            return isset($this->definitions['namespaces'][$name]);
        }
        /** Get defined namespace of $name
         *
         * @example $sandbox->get_defined_namespace('Test');
         *
         * @param   string          $name       String of namespace $name to get
         *
         * @throws  Error           Throws an exception if an invalid namespace name is requested
         *
         * @return  string          Returns string of defined namespace value
         */
        public function get_defined_namespace($name){
            $name = $this->normalize_namespace($name);
            if(!isset($this->definitions['namespaces'][$name])){
                $this->validation_error("Could not get undefined namespace: $name", Error::VALID_NAMESPACE_ERROR, null, $name);
            }
            return $this->definitions['namespaces'][$name];
        }
        /** Undefine PHPSandbox namespace
         *
         * You can pass a string of namespace $name to undefine, or an array of namespace names to undefine
         *
         * @example $sandbox->undefine_namespace('Foo');
         *
         * @example $sandbox->undefine_namespace(array('Foo', 'Bar'));
         *
         * @param   string|array          $name       String of namespace $name, or an array of namespace names to undefine
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function undefine_namespace($name){
            if(is_array($name)){
                return $this->undefine_namespaces($name);
            }
            $name = $this->normalize_namespace($name);
            if(isset($this->definitions['namespaces'][$name])){
                unset($this->definitions['namespaces'][$name]);
            }
            return $this;
        }
        /** Undefine PHPSandbox namespaces by array
         *
         * You can pass an array of namespace names to undefine, or an empty array or null argument to undefine all namespaces
         *
         * @example $sandbox->undefine_namespaces(array('Foo', 'Bar'));
         *
         * @example $sandbox->undefine_namespaces(); //WILL UNDEFINE ALL NAMESPACES!
         *
         * @param   array           $namespaces       Array of namespace names to undefine. Passing an empty array or no argument will result in undefining all namespaces
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function undefine_namespaces(array $namespaces = array()){
            if(count($namespaces)){
                foreach($namespaces as $namespace){
                    $this->undefine_namespace($namespace);
                }
            } else {
                $this->definitions['namespaces'] = array();
            }
            return $this;
        }
        /** Define PHPSandbox alias
         *
         * You can pass the namespace $name and $alias to use, an array of namespaces to use, or an associative array of namespaces to use and their aliases
         *
         * @example $sandbox->define_alias('Foo');  //use Foo;
         *
         * @example $sandbox->define_alias('Foo', 'Bar');  //use Foo as Bar;
         *
         * @example $sandbox->define_alias(array('Foo', 'Bar')); //use Foo; use Bar;
         *
         * @example $sandbox->define_alias(array('Foo' => 'Bar')); //use Foo as Bar;
         *
         * @param   string|array    $name       String of namespace $name to use, or  or an array of namespaces to use, or an associative array of namespaces and their aliases to use
         * @param   string|null     $alias      String of $alias to use
         *
         * @throws  Error           Throws exception if unnamed namespace is used
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function define_alias($name, $alias = null){
            if(is_array($name)){
                return $this->define_aliases($name);
            }
            if(!$name){
                $this->validation_error("Cannot define unnamed namespace alias!", Error::DEFINE_ALIAS_ERROR, null, '');
            }
            $original_name = $name;
            $name = $this->normalize_alias($name);
            $this->definitions['aliases'][$name] = array('original' => $original_name, 'alias' => $alias);
            return $this;
        }
        /** Define PHPSandbox aliases by array
         *
         * You can pass an array of namespaces to use, or an associative array of namespaces to use and their aliases
         *
         * @example $sandbox->define_aliases(array('Foo', 'Bar')); //use Foo; use Bar;
         *
         * @example $sandbox->define_aliases(array('Foo' => 'Bar')); //use Foo as Bar;
         *
         * @param   array           $aliases       Array of namespaces to use, or an associative array of namespaces and their aliases to use
         *
         * @throws  Error           Throws exception if unnamed namespace is used
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function define_aliases(array $aliases = array()){
            foreach($aliases as $name => $alias){
                $this->define_alias($name, $alias);
            }
            return $this;
        }
        /** Query whether PHPSandbox instance has defined aliases
         *
         * @example $sandbox->has_defined_aliases(); //returns number of defined aliases, or zero if none defined
         *
         * @return  int           Returns the number of aliases this instance has defined
         */
        public function has_defined_aliases(){
            return count($this->definitions['aliases']);
        }
        /** Check if PHPSandbox instance has $name alias defined
         *
         * @example $sandbox->is_defined_alias('Foo');
         *
         * @param   string          $name       String of alias $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has defined aliases, false otherwise
         */
        public function is_defined_alias($name){
            $name = $this->normalize_alias($name);
            return isset($this->definitions['aliases'][$name]);
        }
        /** Undefine PHPSandbox alias
         *
         * You can pass a string of alias $name to undefine, or an array of alias names to undefine
         *
         * @example $sandbox->undefine_alias('Foo');
         *
         * @example $sandbox->undefine_alias(array('Foo', 'Bar'));
         *
         * @param   string|array          $name       String of alias name, or array of alias names to undefine
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function undefine_alias($name){
            if(is_array($name)){
                return $this->undefine_aliases($name);
            }
            $name = $this->normalize_alias($name);
            if(isset($this->definitions['aliases'][$name])){
                unset($this->definitions['aliases'][$name]);
            }
            return $this;
        }
        /** Undefine PHPSandbox aliases by array
         *
         * You can pass an array of alias names to undefine, or an empty array or null argument to undefine all aliases
         *
         * @example $sandbox->undefine_aliases(array('Foo', 'Bar'));
         *
         * @example $sandbox->undefine_aliases(); //WILL UNDEFINE ALL ALIASES!
         *
         * @param   array           $aliases       Array of alias names to undefine. Passing an empty array or no argument will result in undefining all aliases
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function undefine_aliases(array $aliases = array()){
            if(count($aliases)){
                foreach($aliases as $alias){
                    $this->undefine_alias($alias);
                }
            } else {
                $this->definitions['aliases'] = array();
            }
            return $this;
        }
        /** Define PHPSandbox use (or alias)
         *
         * @alias   define_alias();
         *
         * You can pass the namespace $name and $alias to use, an array of namespaces to use, or an associative array of namespaces to use and their aliases
         *
         * @example $sandbox->define_use('Foo');  //use Foo;
         *
         * @example $sandbox->define_use('Foo', 'Bar');  //use Foo as Bar;
         *
         * @example $sandbox->define_use(array('Foo', 'Bar')); //use Foo; use Bar;
         *
         * @example $sandbox->define_use(array('Foo' => 'Bar')); //use Foo as Bar;
         *
         * @param   string|array    $name       String of namespace $name to use, or  or an array of namespaces to use, or an associative array of namespaces and their aliases to use
         * @param   string|null     $alias      String of $alias to use
         *
         * @throws  Error           Throws exception if unnamed namespace is used
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function define_use($name, $alias = null){
            return $this->define_alias($name, $alias);
        }
        /** Define PHPSandbox uses (or aliases) by array
         *
         * @alias   define_aliases();
         *
         * You can pass an array of namespaces to use, or an associative array of namespaces to use and their aliases
         *
         * @example $sandbox->define_uses(array('Foo', 'Bar')); //use Foo; use Bar;
         *
         * @example $sandbox->define_uses(array('Foo' => 'Bar')); //use Foo as Bar;
         *
         * @param   array           $uses       Array of namespaces to use, or an associative array of namespaces and their aliases to use
         *
         * @throws  Error           Throws exception if unnamed namespace is used
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function define_uses(array $uses = array()){
            return $this->define_aliases($uses);
        }
        /** Query whether PHPSandbox instance has defined uses (or aliases)
         *
         * @alias   has_defined_aliases();
         *
         * @example $sandbox->has_defined_uses(); //returns number of defined uses (or aliases) or zero if none defined
         *
         * @return  int           Returns the number of uses (or aliases) this instance has defined
         */
        public function has_defined_uses(){
            return $this->has_defined_aliases();
        }
        /** Check if PHPSandbox instance has $name uses (or alias) defined
         *
         * @alias   is_defined_alias();
         *
         * @example $sandbox->is_defined_use('Foo');
         *
         * @param   string          $name       String of use (or alias) $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has defined uses (or aliases) and false otherwise
         */
        public function is_defined_use($name){
            return $this->is_defined_alias($name);
        }
        /** Undefine PHPSandbox use (or alias)
         *
         * You can pass a string of use (or alias) $name to undefine, or an array of use (or alias) names to undefine
         *
         * @example $sandbox->undefine_use('Foo');
         *
         * @example $sandbox->undefine_use(array('Foo', 'Bar'));
         *
         * @param   string|array          $name       String of use (or alias) name, or array of use (or alias) names to undefine
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function undefine_use($name){
            return $this->undefine_alias($name);
        }
        /** Undefine PHPSandbox uses (or aliases) by array
         *
         * @alias   undefine_aliases();
         *
         * You can pass an array of use (or alias) names to undefine, or an empty array or null argument to undefine all uses (or aliases)
         *
         * @example $sandbox->undefine_uses(array('Foo', 'Bar'));
         *
         * @example $sandbox->undefine_uses(); //WILL UNDEFINE ALL USES (OR ALIASES!)
         *
         * @param   array           $uses       Array of use (or alias) names to undefine. Passing an empty array or no argument will result in undefining all uses (or aliases)
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function undefine_uses(array $uses = array()){
            return $this->undefine_aliases($uses);
        }
        /** Define PHPSandbox class
         *
         * You can pass the class $name and $value to define, or an associative array of classes to define
         *
         * @example $sandbox->define_class('Test', 'Test2');
         *
         * @example $sandbox->define_class(array('Test' => 'Test2'));
         *
         * @param   string|array    $name       String of class $name or associative array to define
         * @param   mixed           $value      Value to define class to
         *
         * @throws  Error           Throws exception if unnamed class is defined
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function define_class($name, $value){
            if(is_array($name)){
                return $this->define_classes($name);
            }
            if(!$name){
                $this->validation_error("Cannot define unnamed class!", Error::DEFINE_CLASS_ERROR, null, '');
            }
            $name = $this->normalize_class($name);
            $this->definitions['classes'][$name] = $value;
            return $this;
        }
        /** Define PHPSandbox classes by array
         *
         * You can pass an associative array of classes to define
         *
         * @example $sandbox->define_classes(array('Test' => 'Test2'));
         *
         * @param   array           $classes  Associative array of $classes to define
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function define_classes(array $classes = array()){
            foreach($classes as $name => $value){
                $this->define_class($name, $value);
            }
            return $this;
        }
        /** Query whether PHPSandbox instance has defined classes
         *
         * @example $sandbox->has_defined_classes(); //returns number of defined classes, or zero if none defined
         *
         * @return  int           Returns the number of classes this instance has defined
         */
        public function has_defined_classes(){
            return count($this->definitions['classes']);
        }
        /** Check if PHPSandbox instance has $name class defined
         *
         * @example $sandbox->is_defined_class('Test');
         *
         * @param   string          $name       String of class $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has defined class, false otherwise
         */
        public function is_defined_class($name){
            $name = $this->normalize_class($name);
            return isset($this->definitions['classes'][$name]);
        }
        /** Get defined class of $name
         *
         * @example $sandbox->get_defined_class('Test');
         *
         * @param   string          $name       String of class $name to get
         *
         * @throws  Error           Throws an exception if an invalid class name is requested
         *
         * @return  string          Returns string of defined class value
         */
        public function get_defined_class($name){
            $name = $this->normalize_class($name);
            if(!isset($this->definitions['classes'][$name])){
                $this->validation_error("Could not get undefined class: $name", Error::VALID_CLASS_ERROR, null, $name);
            }
            return $this->definitions['classes'][$name];
        }
        /** Undefine PHPSandbox class
         *
         * You can pass a string of class $name to undefine, or an array of class names to undefine
         *
         * @example $sandbox->undefine_class('Test');
         *
         * @example $sandbox->undefine_class(array('Test', 'Test2'));
         *
         * @param   string|array          $name       String of class name or an array of class names to undefine
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function undefine_class($name){
            if(is_array($name)){
                return $this->undefine_classes($name);
            }
            $name = $this->normalize_class($name);
            if(isset($this->definitions['classes'][$name])){
                unset($this->definitions['classes'][$name]);
            }
            return $this;
        }
        /** Undefine PHPSandbox classes by array
         *
         * You can pass an array of class names to undefine, or an empty array or null argument to undefine all classes
         *
         * @example $sandbox->undefine_classes(array('Test', 'Test2'));
         *
         * @example $sandbox->undefine_classes(); //WILL UNDEFINE ALL CLASSES!
         *
         * @param   array           $classes       Array of class names to undefine. Passing an empty array or no argument will result in undefining all classes
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function undefine_classes(array $classes = array()){
            if(count($classes)){
                foreach($classes as $class){
                    $this->undefine_class($class);
                }
            } else {
                $this->definitions['classes'] = array();
            }
            return $this;
        }
        /** Define PHPSandbox interface
         *
         * You can pass the interface $name and $value to define, or an associative array of interfaces to define
         *
         * @example $sandbox->define_interface('Test', 'Test2');
         *
         * @example $sandbox->define_interface(array('Test' => 'Test2'));
         *
         * @param   string|array    $name       String of interface $name or associative array to define
         * @param   mixed           $value      Value to define interface to
         *
         * @throws  Error           Throws exception if unnamed interface is defined
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function define_interface($name, $value){
            if(is_array($name)){
                return $this->define_interfaces($name);
            }
            if(!$name){
                $this->validation_error("Cannot define unnamed interface!", Error::DEFINE_INTERFACE_ERROR, null, '');
            }
            $name = $this->normalize_interface($name);
            $this->definitions['interfaces'][$name] = $value;
            return $this;
        }
        /** Define PHPSandbox interfaces by array
         *
         * You can pass an associative array of interfaces to define
         *
         * @example $sandbox->define_interfaces(array('Test' => 'Test2'));
         *
         * @param   array           $interfaces  Associative array of $interfaces to define
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function define_interfaces(array $interfaces = array()){
            foreach($interfaces as $name => $value){
                $this->define_interface($name, $value);
            }
            return $this;
        }
        /** Query whether PHPSandbox instance has defined interfaces
         *
         * @example $sandbox->has_defined_interfaces(); //returns number of defined interfaces, or zero if none defined
         *
         * @return  int           Returns the number of interfaces this instance has defined
         */
        public function has_defined_interfaces(){
            return count($this->definitions['interfaces']);
        }
        /** Check if PHPSandbox instance has $name interface defined
         *
         * @example $sandbox->is_defined_interface('Test');
         *
         * @param   string          $name       String of interface $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has defined interface, false otherwise
         */
        public function is_defined_interface($name){
            $name = $this->normalize_interface($name);
            return isset($this->definitions['interfaces'][$name]);
        }
        /** Get defined interface of $name
         *
         * @example $sandbox->get_defined_interface('Test');
         *
         * @param   string          $name       String of interface $name to get
         *
         * @throws  Error           Throws an exception if an invalid interface name is requested
         *
         * @return  string          Returns string of defined interface value
         */
        public function get_defined_interface($name){
            $name = $this->normalize_interface($name);
            if(!isset($this->definitions['interfaces'][$name])){
                $this->validation_error("Could not get undefined interface: $name", Error::VALID_INTERFACE_ERROR, null, $name);
            }
            return $this->definitions['interfaces'][$name];
        }
        /** Undefine PHPSandbox interface
         *
         * You can pass a string of interface $name to undefine, or an array of interface names to undefine
         *
         * @example $sandbox->undefine_interface('Test');
         *
         * @example $sandbox->undefine_interface(array('Test', 'Test2'));
         *
         * @param   string|array          $name       String of interface name or an array of interface names to undefine
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function undefine_interface($name){
            if(is_array($name)){
                return $this->undefine_interfaces($name);
            }
            $name = $this->normalize_interface($name);
            if(isset($this->definitions['interfaces'][$name])){
                unset($this->definitions['interfaces'][$name]);
            }
            return $this;
        }
        /** Undefine PHPSandbox interfaces by array
         *
         * You can pass an array of interface names to undefine, or an empty array or null argument to undefine all interfaces
         *
         * @example $sandbox->undefine_interfaces(array('Test', 'Test2'));
         *
         * @example $sandbox->undefine_interfaces(); //WILL UNDEFINE ALL INTERFACES!
         *
         * @param   array           $interfaces       Array of interface names to undefine. Passing an empty array or no argument will result in undefining all interfaces
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function undefine_interfaces(array $interfaces = array()){
            if(count($interfaces)){
                foreach($interfaces as $interface){
                    $this->undefine_interface($interface);
                }
            } else {
                $this->definitions['interfaces'] = array();
            }
            return $this;
        }
        /** Define PHPSandbox trait
         *
         * You can pass the trait $name and $value to define, or an associative array of traits to define
         *
         * @example $sandbox->define_trait('Test', 'Test2');
         *
         * @example $sandbox->define_trait(array('Test' => 'Test2'));
         *
         * @param   string|array    $name       String of trait $name or associative array to define
         * @param   mixed           $value      Value to define trait to
         *
         * @throws  Error           Throws exception if unnamed trait is defined
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function define_trait($name, $value){
            if(is_array($name)){
                return $this->define_traits($name);
            }
            if(!$name){
                $this->validation_error("Cannot define unnamed trait!", Error::DEFINE_TRAIT_ERROR, null, '');
            }
            $name = $this->normalize_trait($name);
            $this->definitions['traits'][$name] = $value;
            return $this;
        }
        /** Define PHPSandbox traits by array
         *
         * You can pass an associative array of traits to define
         *
         * @example $sandbox->define_traits(array('Test' => 'Test2'));
         *
         * @param   array           $traits  Associative array of $traits to define
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function define_traits(array $traits = array()){
            foreach($traits as $name => $value){
                $this->define_trait($name, $value);
            }
            return $this;
        }
        /** Query whether PHPSandbox instance has defined traits
         *
         * @example $sandbox->has_defined_traits(); //returns number of defined traits, or zero if none defined
         *
         * @return  int           Returns the number of traits this instance has defined
         */
        public function has_defined_traits(){
            return count($this->definitions['traits']);
        }
        /** Check if PHPSandbox instance has $name trait defined
         *
         * @example $sandbox->is_defined_trait('Test');
         *
         * @param   string          $name       String of trait $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has defined trait, false otherwise
         */
        public function is_defined_trait($name){
            $name = $this->normalize_trait($name);
            return isset($this->definitions['traits'][$name]);
        }
        /** Get defined trait of $name
         *
         * @example $sandbox->get_defined_trait('Test');
         *
         * @param   string          $name       String of trait $name to get
         *
         * @throws  Error           Throws an exception if an invalid trait name is requested
         *
         * @return  string          Returns string of defined trait value
         */
        public function get_defined_trait($name){
            $name = $this->normalize_trait($name);
            if(!isset($this->definitions['traits'][$name])){
                $this->validation_error("Could not get undefined trait: $name", Error::VALID_TRAIT_ERROR, null, $name);
            }
            return $this->definitions['traits'][$name];
        }
        /** Undefine PHPSandbox trait
         *
         * You can pass a string of trait $name to undefine, or an array of trait names to undefine
         *
         * @example $sandbox->undefine_trait('Test');
         *
         * @example $sandbox->undefine_trait(array('Test', 'Test2'));
         *
         * @param   string|array          $name       String of trait name or an array of trait names to undefine
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function undefine_trait($name){
            if(is_array($name)){
                return $this->undefine_traits($name);
            }
            $name = $this->normalize_trait($name);
            if(isset($this->definitions['traits'][$name])){
                unset($this->definitions['traits'][$name]);
            }
            return $this;
        }
        /** Undefine PHPSandbox traits by array
         *
         * You can pass an array of trait names to undefine, or an empty array or null argument to undefine all traits
         *
         * @example $sandbox->undefine_traits(array('Test', 'Test2'));
         *
         * @example $sandbox->undefine_traits(); //WILL UNDEFINE ALL TRAITS!
         *
         * @param   array           $traits       Array of trait names to undefine. Passing an empty array or no argument will result in undefining all traits
         *
         * @return  PHPSandbox           Returns the PHPSandbox instance for chainability
         */
        public function undefine_traits(array $traits = array()){
            if(count($traits)){
                foreach($traits as $trait){
                    $this->undefine_trait($trait);
                }
            } else {
                $this->definitions['traits'] = array();
            }
            return $this;
        }
        /** Normalize function name.  This is an internal PHPSandbox function.
         *
         * @param   string|array          $name       String of the function $name, or array of strings to normalize
         *
         * @return  string|array          Returns the normalized function string or an array of normalized strings
         */
        protected function normalize_func($name){
            if(is_array($name)){
                foreach($name as &$value){
                    $value = $this->normalize_func($value);
                }
                return $name;
            }
            return strtolower($name);
        }
        /** Normalize superglobal name.  This is an internal PHPSandbox function.
         *
         * @param   string|array           $name       String of the superglobal $name, or array of strings to normalize
         *
         * @return  string|array           Returns the normalized superglobal string or an array of normalized strings
         */
        protected function normalize_superglobal($name){
            if(is_array($name)){
                foreach($name as &$value){
                    $value = $this->normalize_superglobal($value);
                }
                return $name;
            }
            return strtoupper(ltrim($name, '_'));
        }
        /** Normalize magic constant name.  This is an internal PHPSandbox function.
         *
         * @param   string|array           $name       String of the magic constant $name, or array of strings to normalize
         *
         * @return  string|array           Returns the normalized magic constant string or an array of normalized strings
         */
        protected function normalize_magic_const($name){
            if(is_array($name)){
                foreach($name as &$value){
                    $value = $this->normalize_magic_const($value);
                }
                return $name;
            }
            return strtoupper(trim($name, '_'));
        }
        /** Normalize namespace name.  This is an internal PHPSandbox function.
         *
         * @param   string|array           $name       String of the namespace $name, or array of strings to normalize
         *
         * @return  string|array           Returns the normalized namespace string or an array of normalized strings
         */
        protected function normalize_namespace($name){
            if(is_array($name)){
                foreach($name as &$value){
                    $value = $this->normalize_namespace($value);
                }
                return $name;
            }
            return strtolower($name);
        }
        /** Normalize alias name.  This is an internal PHPSandbox function.
         *
         * @param   string|array           $name       String of the alias $name, or array of strings to normalize
         *
         * @return  string|array           Returns the normalized alias string or an array of normalized strings
         */
        protected function normalize_alias($name){
            if(is_array($name)){
                foreach($name as &$value){
                    $value = $this->normalize_alias($value);
                }
                return $name;
            }
            return strtolower($name);
        }
        /** Normalize use (or alias) name.  This is an internal PHPSandbox function.
         *
         * @alias   normalize_alias();
         *
         * @param   string|array           $name       String of the use (or alias) $name, or array of strings to normalize
         *
         * @return  string|array           Returns the normalized use (or alias) string or an array of normalized strings
         */
        protected function normalize_use($name){
            return $this->normalize_alias($name);
        }
        /** Normalize class name.  This is an internal PHPSandbox function.
         *
         * @param   string|array           $name       String of the class $name to normalize
         *
         * @return  string|array           Returns the normalized class string or an array of normalized strings
         */
        protected function normalize_class($name){
            if(is_array($name)){
                foreach($name as &$value){
                    $value = $this->normalize_class($value);
                }
                return $name;
            }
            return strtolower($name);
        }
        /** Normalize interface name.  This is an internal PHPSandbox function.
         *
         * @param   string|array           $name       String of the interface $name, or array of strings to normalize
         *
         * @return  string|array           Returns the normalized interface string or an array of normalized strings
         */
        protected function normalize_interface($name){
            if(is_array($name)){
                foreach($name as &$value){
                    $value = $this->normalize_interface($value);
                }
                return $name;
            }
            return strtolower($name);
        }
        /** Normalize trait name.  This is an internal PHPSandbox function.
         *
         * @param   string|array           $name       String of the trait $name, or array of strings to normalize
         *
         * @return  string|array           Returns the normalized trait string or an array of normalized strings
         */
        protected function normalize_trait($name){
            if(is_array($name)){
                foreach($name as &$value){
                    $value = $this->normalize_trait($value);
                }
                return $name;
            }
            return strtolower($name);
        }
        /** Normalize keyword name.  This is an internal PHPSandbox function.
         *
         * @param   string|array           $name       String of the keyword $name, or array of strings to normalize
         *
         * @return  string|array           Returns the normalized keyword string or an array of normalized strings
         */
        protected function normalize_keyword($name){
            if(is_array($name)){
                foreach($name as &$value){
                    $value = $this->normalize_keyword($value);
                }
                return $name;
            }
            $name = strtolower($name);
            switch($name){
                case 'die':
                    return 'exit';
                case 'include_once':
                case 'require':
                case 'require_once':
                    return 'include';
                case 'label':   //not a real keyword, only for defining purposes, can't use labels without goto
                    return 'goto';
                case 'print':   //for our purposes print is treated as functionally equivalent to echo
                    return 'echo';
                case 'else':    //no point in using ifs without else
                case 'elseif':  //no point in using ifs without elseif
                    return 'if';
                case 'case':
                    return 'switch';
                case 'catch':    //no point in using catch without try
                case 'finally':  //no point in using try, catch or finally without try
                    return 'try';
                case 'do':       //no point in using do without while
                    return 'while';
                case 'foreach':  //no point in using foreach without for
                    return 'for';
                case '__halt_compiler':
                    return 'halt';
                case 'alias':   //for consistency with alias and use descriptions
                    return 'use';
            }
            return $name;
        }
        /** Normalize operator name.  This is an internal PHPSandbox function.
         *
         * @param   string|array           $name       String of the operator $name, or array of strings to normalize
         *
         * @return  string|array           Returns the normalized operator string or an array of normalized strings
         */
        protected function normalize_operator($name){
            if(is_array($name)){
                foreach($name as &$value){
                    $value = $this->normalize_operator($value);
                }
                return $name;
            }
            $name = strtolower($name);
            if(strpos($name, '++') !== false){
                $name = (strpos($name, '++') === 0) ? '++n' : 'n++';
            } else if(strpos($name, '--') !== false){
                $name = (strpos($name, '--') === 0) ? '--n' : 'n--';
            } else if(strpos($name, '+') !== false && strlen($name) > 1){
                $name = '+n';
            } else if(strpos($name, '-') !== false && strlen($name) > 1){
                $name = '-n';
            }
            return $name;
        }
        /** Normalize primitive name.  This is an internal PHPSandbox function.
         *
         * @param   string|array           $name       String of the primitive $name, or array of strings to normalize
         *
         * @return  string|array           Returns the normalized primitive string or an array of normalized strings
         */
        protected function normalize_primitive($name){
            if(is_array($name)){
                foreach($name as &$value){
                    $value = $this->normalize_primitive($value);
                }
                return $name;
            }
            $name = strtolower($name);
            if($name == 'double'){
                $name = 'float';
            } else if($name == 'integer'){
                $name = 'int';
            }
            return $name;
        }
        /** Normalize type name.  This is an internal PHPSandbox function.
         *
         * @param   string|array          $name       String of the type $name, or array of strings to normalize
         *
         * @return  string|array          Returns the normalized type string or an array of normalized strings
         */
        protected function normalize_type($name){
            if(is_array($name)){
                foreach($name as &$value){
                    $value = $this->normalize_type($value);
                }
                return $name;
            }
            return strtolower($name);
        }
        /** Whitelist PHPSandbox definitions, such as functions, constants, classes, etc. to set
         *
         * You can pass an associative array of whitelist types and their names, or a string $type and array of $names, or pass a string of the $type and $name
         *
         * @example $sandbox->whitelist(array('functions' => array('test')));
         *
         * @example $sandbox->whitelist('functions', array('test'));
         *
         * @example $sandbox->whitelist('functions', 'test');
         *
         * @param   string|array        $type       Associative array or string of whitelist type to set
         * @param   string|array|null   $name       Array or string of whitelist name to set
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function whitelist($type, $name = null){
            if(is_array($type)){
                foreach($type as $_type => $name){
                    if(is_string($name) && $name && isset($this->whitelist[$_type])){
                        $this->whitelist[$_type][$name] = true;
                    } else if(isset($this->whitelist[$_type]) && is_array($name)){
                        foreach($name as $_name){
                            if(is_string($_name) && $_name){
                                $this->whitelist[$_type][$_name] = true;
                            }
                        }
                    }
                }
            } else if(isset($this->whitelist[$type]) && is_array($name)){
                foreach($name as $_name){
                    if(is_string($_name) && $_name){
                        $this->whitelist[$type][$_name] = true;
                    }
                }
            } else if(is_string($name) && $name && isset($this->whitelist[$type])){
                $this->whitelist[$type][$name] = true;
            }
            return $this;
        }
        /** Blacklist PHPSandbox definitions, such as functions, constants, classes, etc. to set
         *
         * You can pass an associative array of blacklist types and their names, or a string $type and array of $names, or pass a string of the $type and $name
         *
         * @example $sandbox->blacklist(array('functions' => array('test')));
         *
         * @example $sandbox->blacklist('functions', array('test'));
         *
         * @example $sandbox->blacklist('functions', 'test');
         *
         * @param   string|array        $type       Associative array or string of blacklist type to set
         * @param   string|array|null   $name       Array or string of blacklist name to set
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function blacklist($type, $name = null){
            if(is_array($type)){
                foreach($type as $_type => $name){
                    if(is_string($name) && $name && isset($this->blacklist[$_type])){
                        $this->blacklist[$_type][$name] = true;
                    } else if(isset($this->blacklist[$_type]) && is_array($name)){
                        foreach($name as $_name){
                            if(is_string($_name) && $_name){
                                $this->blacklist[$_type][$_name] = true;
                            }
                        }
                    }
                }
            } else if(isset($this->blacklist[$type]) && is_array($name)){
                foreach($name as $_name){
                    if(is_string($_name) && $_name){
                        $this->blacklist[$type][$_name] = true;
                    }
                }
            } else if(is_string($name) && $name && isset($this->blacklist[$type])){
                $this->blacklist[$type][$name] = true;
            }
            return $this;
        }
        /** Remove PHPSandbox definitions, such as functions, constants, classes, etc. from whitelist
         *
         * You can pass an associative array of whitelist types and their names, or a string $type and array of $names, or pass a string of the $type and $name to unset
         *
         * @example $sandbox->dewhitelist(array('functions' => array('test')));
         *
         * @example $sandbox->dewhitelist('functions', array('test'));
         *
         * @example $sandbox->dewhitelist('functions', 'test');
         *
         * @param   string|array        $type       Associative array or string of whitelist type to unset
         * @param   string|array|null   $name       Array or string of whitelist name to unset
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function dewhitelist($type, $name){
            if(is_array($type)){
                foreach($type as $_type => $name){
                    if(isset($this->whitelist[$_type]) && is_string($name) && $name && isset($this->whitelist[$_type][$name])){
                        unset($this->whitelist[$_type][$name]);
                    } else if(isset($this->whitelist[$_type]) && is_array($name)){
                        foreach($name as $_name){
                            if(is_string($_name) && $_name && isset($this->whitelist[$_type][$_name])){
                                unset($this->whitelist[$_type][$_name]);
                            }
                        }
                    }
                }
            } else if(isset($this->whitelist[$type]) && is_string($name) && $name && isset($this->whitelist[$type][$name])){
                unset($this->whitelist[$type][$name]);
            }
            return $this;
        }
        /** Remove PHPSandbox definitions, such as functions, constants, classes, etc. from blacklist
         *
         * You can pass an associative array of blacklist types and their names, or a string $type and array of $names, or pass a string of the $type and $name to unset
         *
         * @example $sandbox->deblacklist(array('functions' => array('test')));
         *
         * @example $sandbox->deblacklist('functions', array('test'));
         *
         * @example $sandbox->deblacklist('functions', 'test');
         *
         * @param   string|array        $type       Associative array or string of blacklist type to unset
         * @param   string|array|null   $name       Array or string of blacklist name to unset
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function deblacklist($type, $name){
            if(is_array($type)){
                foreach($type as $_type => $name){
                    if(isset($this->blacklist[$_type]) && is_string($name) && $name && isset($this->blacklist[$_type][$name])){
                        unset($this->blacklist[$_type][$name]);
                    } else if(isset($this->blacklist[$_type]) && is_array($name)){
                        foreach($name as $_name){
                            if(is_string($_name) && $_name && isset($this->blacklist[$_type][$_name])){
                                unset($this->blacklist[$_type][$_name]);
                            }
                        }
                    }
                }
            } else if(isset($this->blacklist[$type]) && is_string($name) && $name && isset($this->blacklist[$type][$name])){
                unset($this->blacklist[$type][$name]);
            }
            return $this;
        }
        /** Query whether PHPSandbox instance has whitelist type
         *
         * @example $sandbox->has_whitelist('functions'); //returns number of whitelisted functions, or zero if none whitelisted
         *
         * @param   string        $type     The whitelist type to query
         *
         * @return  int           Returns the number of whitelists this instance has defined
         */
        public function has_whitelist($type){
            return count($this->whitelist[$type]);
        }
        /** Query whether PHPSandbox instance has blacklist type.
         *
         * @example $sandbox->has_blacklist('functions'); //returns number of blacklisted functions, or zero if none blacklisted
         *
         * @param   string        $type     The blacklist type to query
         *
         * @return  int           Returns the number of blacklists this instance has defined
         */
        public function has_blacklist($type){
            return count($this->blacklist[$type]);
        }
        /** Check if PHPSandbox instance has whitelist type and name set
         *
         * @example $sandbox->is_whitelisted('functions', 'test');
         *
         * @param   string          $type       String of whitelist $type to query
         * @param   string          $name       String of whitelist $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has whitelisted $type and $name, false otherwise
         */
        public function is_whitelisted($type, $name){
            return isset($this->whitelist[$type][$name]);
        }
        /** Check if PHPSandbox instance has blacklist type and name set
         *
         * @example $sandbox->is_blacklisted('functions', 'test');
         *
         * @param   string          $type       String of blacklist $type to query
         * @param   string          $name       String of blacklist $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has blacklisted $type and $name, false otherwise
         */
        public function is_blacklisted($type, $name){
            return isset($this->blacklist[$type][$name]);
        }
        /** Query whether PHPSandbox instance has whitelisted functions.
         *
         * @example $sandbox->has_whitelist_funcs(); //returns number of whitelisted functions, or zero if none whitelisted
         *
         * @return  int           Returns the number of whitelisted functions this instance has defined
         */
        public function has_whitelist_funcs(){
            return count($this->whitelist['functions']);
        }
        /** Query whether PHPSandbox instance has blacklisted functions.
         *
         * @example $sandbox->has_blacklist_funcs(); //returns number of blacklisted functions, or zero if none blacklisted
         *
         * @return  int           Returns the number of blacklisted functions this instance has defined
         */
        public function has_blacklist_funcs(){
            return count($this->blacklist['functions']);
        }
        /** Check if PHPSandbox instance has whitelisted function name set
         *
         * @example $sandbox->is_whitelisted_func('test');
         *
         * @param   string          $name       String of function $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has whitelisted function $name, false otherwise
         */
        public function is_whitelisted_func($name){
            $name = $this->normalize_func($name);
            return isset($this->whitelist['functions'][$name]);
        }
        /** Check if PHPSandbox instance has blacklisted function name set
         *
         * @example $sandbox->is_blacklisted_func('test');
         *
         * @param   string          $name       String of function $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has blacklisted function $name, false otherwise
         */
        public function is_blacklisted_func($name){
            $name = $this->normalize_func($name);
            return isset($this->blacklist['functions'][$name]);
        }
        /** Query whether PHPSandbox instance has whitelisted variables.
         *
         * @example $sandbox->has_whitelist_vars(); //returns number of whitelisted variables, or zero if none whitelisted
         *
         * @return  int           Returns the number of whitelisted variables this instance has defined
         */
        public function has_whitelist_vars(){
            return count($this->whitelist['variables']);
        }
        /** Query whether PHPSandbox instance has blacklisted variables.
         *
         * @example $sandbox->has_blacklist_vars(); //returns number of blacklisted variables, or zero if none blacklisted
         *
         * @return  int           Returns the number of blacklisted variables this instance has defined
         */
        public function has_blacklist_vars(){
            return count($this->blacklist['variables']);
        }
        /** Check if PHPSandbox instance has whitelisted variable name set
         *
         * @example $sandbox->is_whitelisted_var('test');
         *
         * @param   string          $name       String of variable $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has whitelisted variable $name, false otherwise
         */
        public function is_whitelisted_var($name){
            return isset($this->whitelist['variables'][$name]);
        }
        /** Check if PHPSandbox instance has blacklisted variable name set
         *
         * @example $sandbox->is_blacklisted_var('test');
         *
         * @param   string          $name       String of variable $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has blacklisted variable $name, false otherwise
         */
        public function is_blacklisted_var($name){
            return isset($this->blacklist['variables'][$name]);
        }
        /** Query whether PHPSandbox instance has whitelisted globals.
         *
         * @example $sandbox->has_whitelist_globals(); //returns number of whitelisted globals, or zero if none whitelisted
         *
         * @return  int           Returns the number of whitelisted globals this instance has defined
         */
        public function has_whitelist_globals(){
            return count($this->whitelist['globals']);
        }
        /** Query whether PHPSandbox instance has blacklisted globals.
         *
         * @example $sandbox->has_blacklist_globals(); //returns number of blacklisted globals, or zero if none blacklisted
         *
         * @return  int           Returns the number of blacklisted globals this instance has defined
         */
        public function has_blacklist_globals(){
            return count($this->blacklist['globals']);
        }
        /** Check if PHPSandbox instance has whitelisted global name set
         *
         * @example $sandbox->is_whitelisted_global('test');
         *
         * @param   string          $name       String of global $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has whitelisted global $name, false otherwise
         */
        public function is_whitelisted_global($name){
            return isset($this->whitelist['globals'][$name]);
        }
        /** Check if PHPSandbox instance has blacklisted global name set
         *
         * @example $sandbox->is_blacklisted_global('test');
         *
         * @param   string          $name       String of global $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has blacklisted global $name, false otherwise
         */
        public function is_blacklisted_global($name){
            return isset($this->blacklist['globals'][$name]);
        }
        /** Query whether PHPSandbox instance has whitelisted superglobals, or superglobal keys
         *
         * @example $sandbox->has_whitelist_superglobals(); //returns number of whitelisted superglobals, or zero if none whitelisted
         *
         * @example $sandbox->has_whitelist_superglobals('_GET'); //returns number of whitelisted superglobal keys, or zero if none whitelisted
         *
         * @param   string        $name     The whitelist superglobal key to query
         *
         * @return  int           Returns the number of whitelisted superglobals or superglobal keys this instance has defined
         */
        public function has_whitelist_superglobals($name = null){
            $name = $this->normalize_superglobal($name);
            return $name !== null ? (isset($this->whitelist['superglobals'][$name]) ? count($this->whitelist['superglobals'][$name]) : 0) : count($this->whitelist['superglobals']);
        }
        /** Query whether PHPSandbox instance has blacklisted superglobals, or superglobal keys
         *
         * @example $sandbox->has_blacklist_superglobals(); //returns number of blacklisted superglobals, or zero if none blacklisted
         *
         * @example $sandbox->has_blacklist_superglobals('_GET'); //returns number of blacklisted superglobal keys, or zero if none blacklisted
         *
         * @param   string        $name     The blacklist superglobal key to query
         *
         * @return  int           Returns the number of blacklisted superglobals or superglobal keys this instance has defined
         */
        public function has_blacklist_superglobals($name = null){
            $name = $this->normalize_superglobal($name);
            return $name !== null ? (isset($this->blacklist['superglobals'][$name]) ? count($this->blacklist['superglobals'][$name]) : 0) : count($this->blacklist['superglobals']);
        }
        /** Check if PHPSandbox instance has whitelisted superglobal or superglobal key set
         *
         * @example $sandbox->is_whitelisted_superglobal('_GET');
         *
         * @example $sandbox->is_whitelisted_superglobal('_GET', 'page');
         *
         * @param   string          $name       String of whitelisted superglobal $name to query
         * @param   string          $key        String of whitelisted superglobal $key to query
         *
         * @return  bool            Returns true if PHPSandbox instance has whitelisted superglobal key or superglobal, false otherwise
         */
        public function is_whitelisted_superglobal($name, $key = null){
            $name = $this->normalize_superglobal($name);
            return $key !== null ? isset($this->whitelist['superglobals'][$name][$key]) : isset($this->whitelist['superglobals'][$name]);
        }
        /** Check if PHPSandbox instance has blacklisted superglobal or superglobal key set
         *
         * @example $sandbox->is_blacklisted_superglobal('_GET');
         *
         * @example $sandbox->is_blacklisted_superglobal('_GET', 'page');
         *
         * @param   string          $name       String of blacklisted superglobal $name to query
         * @param   string          $key        String of blacklisted superglobal $key to query
         *
         * @return  bool            Returns true if PHPSandbox instance has blacklisted superglobal key or superglobal, false otherwise
         */
        public function is_blacklisted_superglobal($name, $key = null){
            $name = $this->normalize_superglobal($name);
            return $key !== null ? isset($this->blacklist['superglobals'][$name][$key]) : isset($this->blacklist['superglobals'][$name]);
        }
        /** Query whether PHPSandbox instance has whitelisted constants.
         *
         * @example $sandbox->has_whitelist_consts(); //returns number of whitelisted constants, or zero if none whitelisted
         *
         * @return  int           Returns the number of whitelisted constants this instance has defined
         */
        public function has_whitelist_consts(){
            return count($this->whitelist['constants']);
        }
        /** Query whether PHPSandbox instance has blacklisted constants.
         *
         * @example $sandbox->has_blacklist_consts(); //returns number of blacklisted constants, or zero if none blacklisted
         *
         * @return  int           Returns the number of blacklisted constants this instance has defined
         */
        public function has_blacklist_consts(){
            return count($this->blacklist['constants']);
        }
        /** Check if PHPSandbox instance has whitelisted constant name set
         *
         * @example $sandbox->is_whitelisted_const('TEST');
         *
         * @param   string          $name       String of constant $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has whitelisted constant $name, false otherwise
         */
        public function is_whitelisted_const($name){
            return isset($this->whitelist['constants'][$name]);
        }
        /** Check if PHPSandbox instance has blacklisted constant name set
         *
         * @example $sandbox->is_blacklisted_const('TEST');
         *
         * @param   string          $name       String of constant $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has blacklisted constant $name, false otherwise
         */
        public function is_blacklisted_const($name){
            return isset($this->blacklist['constants'][$name]);
        }
        /** Query whether PHPSandbox instance has whitelisted magic constants.
         *
         * @example $sandbox->has_whitelist_magic_consts(); //returns number of whitelisted magic constants, or zero if none whitelisted
         *
         * @return  int           Returns the number of whitelisted magic constants this instance has defined
         */
        public function has_whitelist_magic_consts(){
            return count($this->whitelist['magic_constants']);
        }
        /** Query whether PHPSandbox instance has blacklisted magic constants.
         *
         * @example $sandbox->has_blacklist_magic_consts(); //returns number of blacklisted magic constants, or zero if none blacklisted
         *
         * @return  int           Returns the number of blacklisted magic constants this instance has defined
         */
        public function has_blacklist_magic_consts(){
            return count($this->blacklist['magic_constants']);
        }
        /** Check if PHPSandbox instance has whitelisted magic constant name set
         *
         * @example $sandbox->is_whitelisted_magic_const('__LINE__');
         *
         * @param   string          $name       String of magic constant $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has whitelisted magic constant $name, false otherwise
         */
        public function is_whitelisted_magic_const($name){
            $name = $this->normalize_magic_const($name);
            return isset($this->whitelist['magic_constants'][$name]);
        }
        /** Check if PHPSandbox instance has blacklisted magic constant name set
         *
         * @example $sandbox->is_blacklisted_magic_const('__LINE__');
         *
         * @param   string          $name       String of magic constant $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has blacklisted magic constant $name, false otherwise
         */
        public function is_blacklisted_magic_const($name){
            $name = $this->normalize_magic_const($name);
            return isset($this->blacklist['magic_constants'][$name]);
        }
        /** Query whether PHPSandbox instance has whitelisted namespaces.
         *
         * @example $sandbox->has_whitelist_namespaces(); //returns number of whitelisted namespaces, or zero if none whitelisted
         *
         * @return  int           Returns the number of whitelisted namespaces this instance has defined
         */
        public function has_whitelist_namespaces(){
            return count($this->whitelist['namespaces']);
        }
        /** Query whether PHPSandbox instance has blacklisted namespaces.
         *
         * @example $sandbox->has_blacklist_namespaces(); //returns number of blacklisted namespaces, or zero if none blacklisted
         *
         * @return  int           Returns the number of blacklisted namespaces this instance has defined
         */
        public function has_blacklist_namespaces(){
            return count($this->blacklist['namespaces']);
        }
        /** Check if PHPSandbox instance has whitelisted namespace name set
         *
         * @example $sandbox->is_whitelisted_namespace('Test');
         *
         * @param   string          $name       String of namespace $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has whitelisted namespace $name, false otherwise
         */
        public function is_whitelisted_namespace($name){
            $name = $this->normalize_namespace($name);
            return isset($this->whitelist['namespaces'][$name]);
        }
        /** Check if PHPSandbox instance has blacklisted namespace name set
         *
         * @example $sandbox->is_blacklisted_namespace('Test');
         *
         * @param   string          $name       String of namespace $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has blacklisted namespace $name, false otherwise
         */
        public function is_blacklisted_namespace($name){
            $name = $this->normalize_namespace($name);
            return isset($this->blacklist['namespaces'][$name]);
        }
        /** Query whether PHPSandbox instance has whitelisted aliases.
         *
         * @example $sandbox->has_whitelist_aliases(); //returns number of whitelisted aliases, or zero if none whitelisted
         *
         * @return  int           Returns the number of whitelisted aliases this instance has defined
         */
        public function has_whitelist_aliases(){
            return count($this->whitelist['aliases']);
        }
        /** Query whether PHPSandbox instance has blacklisted aliases.
         *
         * @example $sandbox->has_blacklist_aliases(); //returns number of blacklisted aliases, or zero if none blacklisted
         *
         * @return  int           Returns the number of blacklisted aliases this instance has defined
         */
        public function has_blacklist_aliases(){
            return count($this->blacklist['aliases']);
        }
        /** Check if PHPSandbox instance has whitelisted alias name set
         *
         * @example $sandbox->is_whitelisted_alias('Test');
         *
         * @param   string          $name       String of alias $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has whitelisted alias $name, false otherwise
         */
        public function is_whitelisted_alias($name){
            $name = $this->normalize_alias($name);
            return isset($this->whitelist['aliases'][$name]);
        }
        /** Check if PHPSandbox instance has blacklisted alias name set
         *
         * @example $sandbox->is_blacklisted_alias('Test');
         *
         * @param   string          $name       String of alias $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has blacklisted alias $name, false otherwise
         */
        public function is_blacklisted_alias($name){
            $name = $this->normalize_alias($name);
            return isset($this->blacklist['aliases'][$name]);
        }
        /** Query whether PHPSandbox instance has whitelisted uses (or aliases.)
         *
         * @alias   has_whitelist_aliases();
         *
         * @example $sandbox->has_whitelist_uses(); //returns number of whitelisted uses (or aliases) or zero if none whitelisted
         *
         * @return  int           Returns the number of whitelisted uses (or aliases) this instance has defined
         */
        public function has_whitelist_uses(){
            return $this->has_whitelist_aliases();
        }
        /** Query whether PHPSandbox instance has blacklisted uses (or aliases.)
         *
         * @alias   has_blacklist_aliases();
         *
         * @example $sandbox->has_blacklist_uses(); //returns number of blacklisted uses (or aliases) or zero if none blacklisted
         *
         * @return  int           Returns the number of blacklisted uses (or aliases) this instance has defined
         */
        public function has_blacklist_uses(){
            return $this->has_blacklist_aliases();
        }
        /** Check if PHPSandbox instance has whitelisted use (or alias) name set
         *
         * @alias   is_whitelisted_alias();
         *
         * @example $sandbox->is_whitelisted_use('Test');
         *
         * @param   string          $name       String of use (or alias) $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has whitelisted use (or alias) $name, false otherwise
         */
        public function is_whitelisted_use($name){
            return $this->is_whitelisted_alias($name);
        }
        /** Check if PHPSandbox instance has blacklisted use (or alias) name set
         *
         * @alias   is_blacklisted_alias();
         *
         * @example $sandbox->is_blacklisted_use('Test');
         *
         * @param   string          $name       String of use (or alias) $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has blacklisted use (or alias) $name, false otherwise
         */
        public function is_blacklisted_use($name){
            return $this->is_blacklisted_alias($name);
        }
        /** Query whether PHPSandbox instance has whitelisted classes.
         *
         * @example $sandbox->has_whitelist_classes(); //returns number of whitelisted classes, or zero if none whitelisted
         *
         * @return  int           Returns the number of whitelisted classes this instance has defined
         */
        public function has_whitelist_classes(){
            return count($this->whitelist['classes']);
        }
        /** Query whether PHPSandbox instance has blacklisted classes.
         *
         * @example $sandbox->has_blacklist_classes(); //returns number of blacklisted classes, or zero if none blacklisted
         *
         * @return  int           Returns the number of blacklisted classes this instance has defined
         */
        public function has_blacklist_classes(){
            return count($this->blacklist['classes']);
        }
        /** Check if PHPSandbox instance has whitelisted class name set
         *
         * @example $sandbox->is_whitelisted_class('Test');
         *
         * @param   string          $name       String of class $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has whitelisted class $name, false otherwise
         */
        public function is_whitelisted_class($name){
            $name = $this->normalize_class($name);
            return isset($this->whitelist['classes'][$name]);
        }
        /** Check if PHPSandbox instance has blacklisted class name set
         *
         * @example $sandbox->is_blacklisted_class('Test');
         *
         * @param   string          $name       String of class $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has blacklisted class $name, false otherwise
         */
        public function is_blacklisted_class($name){
            $name = $this->normalize_class($name);
            return isset($this->blacklist['classes'][$name]);
        }
        /** Query whether PHPSandbox instance has whitelisted interfaces.
         *
         * @example $sandbox->has_whitelist_interfaces(); //returns number of whitelisted interfaces, or zero if none whitelisted
         *
         * @return  int           Returns the number of whitelisted interfaces this instance has defined
         */
        public function has_whitelist_interfaces(){
            return count($this->whitelist['interfaces']);
        }
        /** Query whether PHPSandbox instance has blacklisted interfaces.
         *
         * @example $sandbox->has_blacklist_interfaces(); //returns number of blacklisted interfaces, or zero if none blacklisted
         *
         * @return  int           Returns the number of blacklisted interfaces this instance has defined
         */
        public function has_blacklist_interfaces(){
            return count($this->blacklist['interfaces']);
        }
        /** Check if PHPSandbox instance has whitelisted interface name set
         *
         * @example $sandbox->is_whitelisted_interface('Test');
         *
         * @param   string          $name       String of interface $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has whitelisted interface $name, false otherwise
         */
        public function is_whitelisted_interface($name){
            $name = $this->normalize_interface($name);
            return isset($this->whitelist['interfaces'][$name]);
        }
        /** Check if PHPSandbox instance has blacklisted interface name set
         *
         * @example $sandbox->is_blacklisted_interface('Test');
         *
         * @param   string          $name       String of interface $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has blacklisted interface $name, false otherwise
         */
        public function is_blacklisted_interface($name){
            $name = $this->normalize_interface($name);
            return isset($this->blacklist['interfaces'][$name]);
        }
        /** Query whether PHPSandbox instance has whitelisted traits.
         *
         * @example $sandbox->has_whitelist_traits(); //returns number of whitelisted traits, or zero if none whitelisted
         *
         * @return  int           Returns the number of whitelisted traits this instance has defined
         */
        public function has_whitelist_traits(){
            return count($this->whitelist['traits']);
        }
        /** Query whether PHPSandbox instance has blacklisted traits.
         *
         * @example $sandbox->has_blacklist_traits(); //returns number of blacklisted traits, or zero if none blacklisted
         *
         * @return  int           Returns the number of blacklisted traits this instance has defined
         */
        public function has_blacklist_traits(){
            return count($this->blacklist['traits']);
        }
        /** Check if PHPSandbox instance has whitelisted trait name set
         *
         * @example $sandbox->is_whitelisted_trait('Test');
         *
         * @param   string          $name       String of trait $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has whitelisted trait $name, false otherwise
         */
        public function is_whitelisted_trait($name){
            $name = $this->normalize_trait($name);
            return isset($this->whitelist['traits'][$name]);
        }
        /** Check if PHPSandbox instance has blacklisted trait name set
         *
         * @example $sandbox->is_blacklisted_trait('Test');
         *
         * @param   string          $name       String of trait $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has blacklisted trait $name, false otherwise
         */
        public function is_blacklisted_trait($name){
            $name = $this->normalize_trait($name);
            return isset($this->blacklist['traits'][$name]);
        }
        /** Query whether PHPSandbox instance has whitelisted keywords.
         *
         * @example $sandbox->has_whitelist_keywords(); //returns number of whitelisted keywords, or zero if none whitelisted
         *
         * @return  int           Returns the number of whitelisted keywords this instance has defined
         */
        public function has_whitelist_keywords(){
            return count($this->whitelist['keywords']);
        }
        /** Query whether PHPSandbox instance has blacklisted keywords.
         *
         * @example $sandbox->has_blacklist_keywords(); //returns number of blacklisted keywords, or zero if none blacklisted
         *
         * @return  int           Returns the number of blacklisted keywords this instance has defined
         */
        public function has_blacklist_keywords(){
            return count($this->blacklist['keywords']);
        }
        /** Check if PHPSandbox instance has whitelisted keyword name set
         *
         * @example $sandbox->is_whitelisted_keyword('echo');
         *
         * @param   string          $name       String of keyword $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has whitelisted keyword $name, false otherwise
         */
        public function is_whitelisted_keyword($name){
            $name = $this->normalize_keyword($name);
            return isset($this->whitelist['keywords'][$name]);
        }
        /** Check if PHPSandbox instance has blacklisted keyword name set
         *
         * @example $sandbox->is_blacklisted_keyword('echo');
         *
         * @param   string          $name       String of keyword $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has blacklisted keyword $name, false otherwise
         */
        public function is_blacklisted_keyword($name){
            $name = $this->normalize_keyword($name);
            return isset($this->blacklist['keywords'][$name]);
        }
        /** Query whether PHPSandbox instance has whitelisted operators.
         *
         * @example $sandbox->has_whitelist_operators(); //returns number of whitelisted operators, or zero if none whitelisted
         *
         * @return  int           Returns the number of whitelisted operators this instance has defined
         */
        public function has_whitelist_operators(){
            return count($this->whitelist['operators']);
        }
        /** Query whether PHPSandbox instance has blacklisted operators.
         *
         * @example $sandbox->has_blacklist_operators(); //returns number of blacklisted operators, or zero if none blacklisted
         *
         * @return  int           Returns the number of blacklisted operators this instance has defined
         */
        public function has_blacklist_operators(){
            return count($this->blacklist['operators']);
        }
        /** Check if PHPSandbox instance has whitelisted operator name set
         *
         * @example $sandbox->is_whitelisted_operator('+');
         *
         * @param   string          $name       String of operator $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has whitelisted operator $name, false otherwise
         */
        public function is_whitelisted_operator($name){
            $name = $this->normalize_operator($name);
            return isset($this->whitelist['operators'][$name]);
        }
        /** Check if PHPSandbox instance has blacklisted operator name set
         *
         * @example $sandbox->is_blacklisted_operator('+');
         *
         * @param   string          $name       String of operator $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has blacklisted operator $name, false otherwise
         */
        public function is_blacklisted_operator($name){
            $name = $this->normalize_operator($name);
            return isset($this->blacklist['operators'][$name]);
        }
        /** Query whether PHPSandbox instance has whitelisted primitives.
         *
         * @example $sandbox->has_whitelist_primitives(); //returns number of whitelisted primitives, or zero if none whitelisted
         *
         * @return  int           Returns the number of whitelisted primitives this instance has defined
         */
        public function has_whitelist_primitives(){
            return count($this->whitelist['primitives']);
        }
        /** Query whether PHPSandbox instance has blacklisted primitives.
         *
         * @example $sandbox->has_blacklist_primitives(); //returns number of blacklisted primitives, or zero if none blacklisted
         *
         * @return  int           Returns the number of blacklisted primitives this instance has defined
         */
        public function has_blacklist_primitives(){
            return count($this->blacklist['primitives']);
        }
        /** Check if PHPSandbox instance has whitelisted primitive name set
         *
         * @example $sandbox->is_whitelisted_primitive('array');
         *
         * @param   string          $name       String of primitive $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has whitelisted primitive $name, false otherwise
         */
        public function is_whitelisted_primitive($name){
            $name = $this->normalize_primitive($name);
            return isset($this->whitelist['primitives'][$name]);
        }
        /** Check if PHPSandbox instance has blacklisted primitive name set
         *
         * @example $sandbox->is_blacklisted_primitive('array');
         *
         * @param   string          $name       String of primitive $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has blacklisted primitive $name, false otherwise
         */
        public function is_blacklisted_primitive($name){
            $name = $this->normalize_primitive($name);
            return isset($this->blacklist['primitives'][$name]);
        }
        /** Query whether PHPSandbox instance has whitelisted types.
         *
         * @example $sandbox->has_whitelist_types(); //returns number of whitelisted types, or zero if none whitelisted
         *
         * @return  int           Returns the number of whitelisted types this instance has defined
         */
        public function has_whitelist_types(){
            return count($this->whitelist['types']);
        }
        /** Query whether PHPSandbox instance has blacklisted types.
         *
         * @example $sandbox->has_blacklist_types(); //returns number of blacklisted types, or zero if none blacklisted
         *
         * @return  int           Returns the number of blacklisted types this instance has defined
         */
        public function has_blacklist_types(){
            return count($this->blacklist['types']);
        }
        /** Check if PHPSandbox instance has whitelisted type name set
         *
         * @example $sandbox->is_whitelisted_type('array');
         *
         * @param   string          $name       String of type $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has whitelisted type $name, false otherwise
         */
        public function is_whitelisted_type($name){
            $name = $this->normalize_type($name);
            return isset($this->whitelist['types'][$name]);
        }
        /** Check if PHPSandbox instance has blacklisted type name set
         *
         * @example $sandbox->is_blacklisted_type('array');
         *
         * @param   string          $name       String of type $name to query
         *
         * @return  bool            Returns true if PHPSandbox instance has blacklisted type $name, false otherwise
         */
        public function is_blacklisted_type($name){
            $name = $this->normalize_type($name);
            return isset($this->blacklist['types'][$name]);
        }
        /** Whitelist function
         *
         * You can pass a string of the function name, or pass an array of function names to whitelist
         *
         * @example $sandbox->whitelist_func('var_dump');
         *
         * @example $sandbox->whitelist_func('var_dump', 'print_r');
         *
         * @example $sandbox->whitelist_func(array('var_dump', 'print_r'));
         *
         * @param   string|array        $name       String of function name, or array of function names to whitelist
         *
         * @return  PHPSandbox          Returns the PHPSandbox instance for chainability
         */
        public function whitelist_func($name){
            if(func_num_args() > 1){
                return $this->whitelist_func(func_get_args());
            }
            $name = $this->normalize_func($name);
            return $this->whitelist('functions', $name);
        }
        /** Blacklist function
         *
         * You can pass a string of the function name, or pass an array of function names to blacklist
         *
         * @example $sandbox->blacklist_func('var_dump');
         *
         * @example $sandbox->blacklist_func(array('var_dump', 'print_r'));
         *
         * @param   string|array        $name       String of function name, or array of function names to blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function blacklist_func($name){
            if(func_num_args() > 1){
                return $this->blacklist_func(func_get_args());
            }
            $name = $this->normalize_func($name);
            return $this->blacklist('functions', $name);
        }
        /** Remove function from whitelist
         *
         * You can pass a string of the function name, or pass an array of function names to remove from whitelist
         *
         * @example $sandbox->dewhitelist_func('var_dump');
         *
         * @example $sandbox->dewhitelist_func(array('var_dump', 'print_r'));
         *
         * @param   string|array        $name       String of function name or array of function names to remove from whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function dewhitelist_func($name){
            if(func_num_args() > 1){
                return $this->dewhitelist_func(func_get_args());
            }
            $name = $this->normalize_func($name);
            return $this->dewhitelist('functions', $name);
        }
        /** Remove function from blacklist
         *
         * You can pass a string of the function name, or pass an array of function names to remove from blacklist
         *
         * @example $sandbox->deblacklist_func('var_dump');
         *
         * @example $sandbox->deblacklist_func(array('var_dump', 'print_r'));
         *
         * @param   string|array        $name       String of function name or array of function names to remove from blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function deblacklist_func($name){
            if(func_num_args() > 1){
                return $this->deblacklist_func(func_get_args());
            }
            $name = $this->normalize_func($name);
            return $this->deblacklist('functions', $name);
        }
        /** Whitelist variable
         *
         * You can pass a string of variable name, or pass an array of the variable names to whitelist
         *
         * @example $sandbox->whitelist_var('a');
         *
         * @example $sandbox->whitelist_var(array('a', 'b'));
         *
         * @param   string|array        $name       String of variable name or array of variable names to whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function whitelist_var($name){
            if(func_num_args() > 1){
                return $this->whitelist_var(func_get_args());
            }
            return $this->whitelist('variables', $name);
        }
        /** Blacklist variable
         *
         * You can pass a string of variable name, or pass an array of the variable names to blacklist
         *
         * @example $sandbox->blacklist_var('a');
         *
         * @example $sandbox->blacklist_var(array('a', 'b'));
         *
         * @param   string|array        $name       String of variable name or array of variable names to blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function blacklist_var($name){
            if(func_num_args() > 1){
                return $this->blacklist_var(func_get_args());
            }
            return $this->blacklist('variables', $name);
        }
        /** Remove variable from whitelist
         *
         * You can pass a string of variable name, or pass an array of the variable names to remove from whitelist
         *
         * @example $sandbox->dewhitelist_var('a');
         *
         * @example $sandbox->dewhitelist_var(array('a', 'b'));
         *
         * @param   string|array        $name       String of variable name or array of variable names to remove from whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function dewhitelist_var($name){
            if(func_num_args() > 1){
                return $this->dewhitelist_var(func_get_args());
            }
            return $this->dewhitelist('variables', $name);
        }
        /** Remove function from blacklist
         *
         * You can pass a string of variable name, or pass an array of the variable names to remove from blacklist
         *
         * @example $sandbox->deblacklist_var('a');
         *
         * @example $sandbox->deblacklist_var(array('a', 'b'));
         *
         * @param   string|array        $name       String of variable name or array of variable names to remove from blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function deblacklist_var($name){
            if(func_num_args() > 1){
                return $this->deblacklist_var(func_get_args());
            }
            return $this->deblacklist('variables', $name);
        }
        /** Whitelist global
         *
         * You can pass a string of global name, or pass an array of the global names to whitelist
         *
         * @example $sandbox->whitelist_global('a');
         *
         * @example $sandbox->whitelist_global(array('a', 'b'));
         *
         * @param   string|array        $name       String of global name or array of global names to whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function whitelist_global($name){
            if(func_num_args() > 1){
                return $this->whitelist_global(func_get_args());
            }
            return $this->whitelist('globals', $name);
        }
        /** Blacklist global
         *
         * You can pass a string of global name, or pass an array of the global names to blacklist
         *
         * @example $sandbox->blacklist_global('a');
         *
         * @example $sandbox->blacklist_global(array('a', 'b'));
         *
         * @param   string|array        $name       String of global name or array of global names to blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function blacklist_global($name){
            if(func_num_args() > 1){
                return $this->blacklist_global(func_get_args());
            }
            return $this->blacklist('globals', $name);
        }
        /** Remove global from whitelist
         *
         * You can pass a string of global name, or pass an array of the global names to remove from whitelist
         *
         * @example $sandbox->dewhitelist_global('a');
         *
         * @example $sandbox->dewhitelist_global(array('a', 'b'));
         *
         * @param   string|array        $name       String of global name or array of global names to remove from whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function dewhitelist_global($name){
            if(func_num_args() > 1){
                return $this->dewhitelist_global(func_get_args());
            }
            return $this->dewhitelist('globals', $name);
        }
        /** Remove global from blacklist
         *
         * You can pass a string of global name, or pass an array of the global names to remove from blacklist
         *
         * @example $sandbox->deblacklist_global('a');
         *
         * @example $sandbox->deblacklist_global(array('a', 'b'));
         *
         * @param   string|array        $name       String of global name or array of global names to remove from blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function deblacklist_global($name){
            if(func_num_args() > 1){
                return $this->deblacklist_global(func_get_args());
            }
            return $this->deblacklist('globals', $name);
        }
        /** Whitelist superglobal or superglobal key
         *
         * You can pass a string of the superglobal name, or a string of the superglobal name and a string of the key,
         * or pass an array of superglobal names, or an associative array of superglobal names and their keys to whitelist
         *
         * @example $sandbox->whitelist_superglobal('_GET');
         *
         * @example $sandbox->whitelist_superglobal('_GET', 'page');
         *
         * @example $sandbox->whitelist_superglobal(array('_GET', '_POST'));
         *
         * @example $sandbox->whitelist_superglobal(array('_GET' => 'page'));
         *
         * @param   string|array        $name       String of superglobal name, or an array of superglobal names, or an associative array of superglobal names and their keys to whitelist
         * @param   string              $key        String of superglobal key to whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function whitelist_superglobal($name, $key = null){
            if(is_string($name)){
                $name = $this->normalize_superglobal($name);
            }
            if(is_string($name) && $name && !isset($this->whitelist['superglobals'][$name])){
                $this->whitelist['superglobals'][$name] = array();
            }
            if(is_array($name)){
                foreach($name as $_name => $key){
                    if(is_int($_name)){
                        if(is_string($key) && $key){
                            $this->whitelist['superglobals'][$key] = array();
                        }
                    } else {
                        $_name = $this->normalize_superglobal($_name);
                        if(is_string($_name) && $_name && !isset($this->whitelist['superglobals'][$_name])){
                            $this->whitelist['superglobals'][$_name] = array();
                        }
                        if(is_string($key) && $key && isset($this->whitelist['superglobals'][$_name])){
                            $this->whitelist['superglobals'][$_name][$key] = true;
                        } else if(isset($this->whitelist['superglobals'][$_name]) && is_array($key)){
                            foreach($key as $_key){
                                if(is_string($_key) && $_key){
                                    $this->whitelist['superglobals'][$_name][$_name] = true;
                                }
                            }
                        }
                    }
                }
            } else if(isset($this->whitelist['superglobals'][$name]) && is_array($key)){
                foreach($key as $_key){
                    if(is_string($_key) && $_key){
                        $this->whitelist['superglobals'][$name][$_key] = true;
                    }
                }
            } else if(is_string($key) && $key && isset($this->whitelist['superglobals'][$name])){
                $this->whitelist['superglobals'][$name][$key] = true;
            }
            return $this;
        }
        /** Blacklist superglobal or superglobal key
         **
         * You can pass a string of the superglobal name, or a string of the superglobal name and a string of the key,
         * or pass an array of superglobal names, or an associative array of superglobal names and their keys to blacklist
         *
         * @example $sandbox->blacklist_superglobal('_GET');
         *
         * @example $sandbox->blacklist_superglobal('_GET', 'page');
         *
         * @example $sandbox->blacklist_superglobal(array('_GET', '_POST'));
         *
         * @example $sandbox->blacklist_superglobal(array('_GET' => 'page'));
         *
         * @param   string|array        $name       String of superglobal name, or an array of superglobal names, or an associative array of superglobal names and their keys to blacklist
         * @param   string              $key        String of superglobal key to blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function blacklist_superglobal($name, $key = null){
            if(is_string($name)){
                $name = $this->normalize_superglobal($name);
            }
            if(is_string($name) && $name && !isset($this->blacklist['superglobals'][$name])){
                $this->blacklist['superglobals'][$name] = array();
            }
            if(is_array($name)){
                foreach($name as $_name => $key){
                    if(is_int($_name)){
                        if(is_string($key) && $key){
                            $this->blacklist['superglobals'][$key] = array();
                        }
                    } else {
                        $_name = $this->normalize_superglobal($_name);
                        if(is_string($_name) && $_name && !isset($this->blacklist['superglobals'][$_name])){
                            $this->blacklist['superglobals'][$_name] = array();
                        }
                        if(is_string($key) && $key && isset($this->blacklist['superglobals'][$_name])){
                            $this->blacklist['superglobals'][$_name][$key] = true;
                        } else if(isset($this->blacklist['superglobals'][$_name]) && is_array($key)){
                            foreach($key as $_key){
                                if(is_string($_key) && $_key){
                                    $this->blacklist['superglobals'][$_name][$_name] = true;
                                }
                            }
                        }
                    }
                }
            } else if(isset($this->blacklist['superglobals'][$name]) && is_array($key)){
                foreach($key as $_key){
                    if(is_string($_key) && $_key){
                        $this->blacklist['superglobals'][$name][$_key] = true;
                    }
                }
            } else if(is_string($key) && $key && isset($this->blacklist['superglobals'][$name])){
                $this->blacklist['superglobals'][$name][$key] = true;
            }
            return $this;
        }
        /** Remove superglobal or superglobal key from whitelist
         **
         * You can pass a string of the superglobal name, or a string of the superglobal name and a string of the key,
         * or pass an array of superglobal names, or an associative array of superglobal names and their keys to remove from whitelist
         *
         * @example $sandbox->dewhitelist_superglobal('_GET');
         *
         * @example $sandbox->dewhitelist_superglobal('_GET', 'page');
         *
         * @example $sandbox->dewhitelist_superglobal(array('_GET', '_POST'));
         *
         * @example $sandbox->dewhitelist_superglobal(array('_GET' => 'page'));
         *
         * @param   string|array        $name       String of superglobal name, or an array of superglobal names, or an associative array of superglobal names and their keys to remove from whitelist
         * @param   string              $key        String of superglobal key to remove from whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function dewhitelist_superglobal($name, $key = null){
            if(is_string($name)){
                $name = $this->normalize_superglobal($name);
            }
            if(is_array($name)){
                foreach($name as $_name => $key){
                    if(is_int($_name)){
                        if(isset($this->whitelist['superglobals'][$key])){
                            $this->whitelist['superglobals'][$key] = array();
                        }
                    } else if(isset($this->whitelist['superglobals'][$_name]) && is_string($key) && $key && isset($this->whitelist['superglobals'][$_name][$key])){
                        unset($this->whitelist['superglobals'][$_name][$key]);
                    } else if(isset($this->whitelist['superglobals'][$_name]) && is_array($key)){
                        foreach($key as $_key){
                            if(is_string($_key) && $_key && isset($this->whitelist['superglobals'][$_name][$_key])){
                                unset($this->whitelist['superglobals'][$_name][$_key]);
                            }
                        }
                    }
                }
            } else if(isset($this->whitelist['superglobals'][$name]) && is_string($key) && $key && isset($this->whitelist['superglobals'][$name][$key])){
                unset($this->whitelist['superglobals'][$name][$key]);
            } else if(isset($this->whitelist['superglobals'][$name]) && is_array($key)){
                foreach($key as $_key){
                    if(is_string($_key) && $_key && isset($this->whitelist['superglobals'][$name][$_key])){
                        unset($this->whitelist['superglobals'][$name][$_key]);
                    }
                }
            } else if(isset($this->whitelist['superglobals'][$name])){
                unset($this->whitelist['superglobals'][$name]);
            }
            return $this;
        }
        /** Remove superglobal or superglobal key from blacklist
         **
         * You can pass a string of the superglobal name, or a string of the superglobal name and a string of the key,
         * or pass an array of superglobal names, or an associative array of superglobal names and their keys to remove from blacklist
         *
         * @example $sandbox->deblacklist_superglobal('_GET');
         *
         * @example $sandbox->deblacklist_superglobal('_GET', 'page');
         *
         * @example $sandbox->deblacklist_superglobal(array('_GET', '_POST'));
         *
         * @example $sandbox->deblacklist_superglobal(array('_GET' => 'page'));
         *
         * @param   string|array        $name       String of superglobal name, or an array of superglobal names, or an associative array of superglobal names and their keys to remove from blacklist
         * @param   string              $key        String of superglobal key to remove from blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function deblacklist_superglobal($name, $key = null){
            if(is_string($name)){
                $name = $this->normalize_superglobal($name);
            }
            if(is_array($name)){
                foreach($name as $_name => $key){
                    if(is_int($_name)){
                        if(isset($this->blacklist['superglobals'][$key])){
                            $this->blacklist['superglobals'][$key] = array();
                        }
                    } else if(isset($this->blacklist['superglobals'][$_name]) && is_string($key) && $key && isset($this->blacklist['superglobals'][$_name][$key])){
                        unset($this->blacklist['superglobals'][$_name][$key]);
                    } else if(isset($this->blacklist['superglobals'][$_name]) && is_array($key)){
                        foreach($key as $_key){
                            if(is_string($_key) && $_key && isset($this->blacklist['superglobals'][$_name][$_key])){
                                unset($this->blacklist['superglobals'][$_name][$_key]);
                            }
                        }
                    }
                }
            } else if(isset($this->blacklist['superglobals'][$name]) && is_string($key) && $key && isset($this->blacklist['superglobals'][$name][$key])){
                unset($this->blacklist['superglobals'][$name][$key]);
            } else if(isset($this->blacklist['superglobals'][$name]) && is_array($key)){
                foreach($key as $_key){
                    if(is_string($_key) && $_key && isset($this->blacklist['superglobals'][$name][$_key])){
                        unset($this->blacklist['superglobals'][$name][$_key]);
                    }
                }
            } else if(isset($this->blacklist['superglobals'][$name])){
                unset($this->blacklist['superglobals'][$name]);
            }
            return $this;
        }
        /** Whitelist constant
         *
         * You can pass a string of constant name, or pass an array of the constant names to whitelist
         *
         * @example $sandbox->whitelist_const('FOO');
         *
         * @example $sandbox->whitelist_const(array('FOO', 'BAR'));
         *
         * @param   string|array        $name       String of constant name or array of constant names to whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function whitelist_const($name){
            if(func_num_args() > 1){
                return $this->whitelist_const(func_get_args());
            }
            return $this->whitelist('constants', $name);
        }
        /** Blacklist constant
         *
         * You can pass a string of constant name, or pass an array of the constant names to blacklist
         *
         * @example $sandbox->blacklist_const('FOO');
         *
         * @example $sandbox->blacklist_const(array('FOO', 'BAR'));
         *
         * @param   string|array        $name       String of constant name or array of constant names to blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function blacklist_const($name){
            if(func_num_args() > 1){
                return $this->blacklist_const(func_get_args());
            }
            return $this->blacklist('constants', $name);
        }
        /** Remove constant from whitelist
         *
         * You can pass a string of constant name, or pass an array of the constant names to remove from whitelist
         *
         * @example $sandbox->dewhitelist_const('FOO');
         *
         * @example $sandbox->dewhitelist_const(array('FOO', 'BAR'));
         *
         * @param   string|array        $name       String of constant name or array of constant names to remove from whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function dewhitelist_const($name){
            if(func_num_args() > 1){
                return $this->dewhitelist_const(func_get_args());
            }
            return $this->dewhitelist('constants', $name);
        }
        /** Remove constant from blacklist
         *
         * You can pass a string of constant name, or pass an array of the constant names to remove from blacklist
         *
         * @example $sandbox->deblacklist_const('FOO');
         *
         * @example $sandbox->deblacklist_const(array('FOO', 'BAR'));
         *
         * @param   string|array        $name       String of constant name or array of constant names to remove from blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function deblacklist_const($name){
            if(func_num_args() > 1){
                return $this->deblacklist_const(func_get_args());
            }
            return $this->deblacklist('constants', $name);
        }
        /** Whitelist magic constant
         *
         * You can pass a string of magic constant name, or pass an array of the magic constant names to whitelist
         *
         * @example $sandbox->whitelist_magic_const('__LINE__');
         *
         * @example $sandbox->whitelist_magic_const(array('__LINE__', '__FILE__'));
         *
         * @param   string|array        $name       String of magic constant name or array of magic constant names to whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function whitelist_magic_const($name){
            if(func_num_args() > 1){
                return $this->whitelist_magic_const(func_get_args());
            }
            $name = $this->normalize_magic_const($name);
            return $this->whitelist('magic_constants', $name);
        }
        /** Blacklist magic constant
         *
         * You can pass a string of magic constant name, or pass an array of the magic constant names to blacklist
         *
         * @example $sandbox->blacklist_magic_const('__LINE__');
         *
         * @example $sandbox->blacklist_magic_const(array('__LINE__', '__FILE__'));
         *
         * @param   string|array        $name       String of magic constant name or array of magic constant names to blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function blacklist_magic_const($name){
            if(func_num_args() > 1){
                return $this->blacklist_magic_const(func_get_args());
            }
            $name = $this->normalize_magic_const($name);
            return $this->blacklist('magic_constants', $name);
        }
        /** Remove magic constant from whitelist
         *
         * You can pass a string of magic constant name, or pass an array of the magic constant names to remove from whitelist
         *
         * @example $sandbox->dewhitelist_magic_const('__LINE__');
         *
         * @example $sandbox->dewhitelist_magic_const(array('__LINE__', '__FILE__'));
         *
         * @param   string|array        $name       String of magic constant name or array of magic constant names to remove from whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function dewhitelist_magic_const($name){
            if(func_num_args() > 1){
                return $this->dewhitelist_magic_const(func_get_args());
            }
            $name = $this->normalize_magic_const($name);
            return $this->dewhitelist('magic_constants', $name);
        }
        /** Remove magic constant from blacklist
         *
         * You can pass a string of magic constant name, or pass an array of the magic constant names to remove from blacklist
         *
         * @example $sandbox->deblacklist_magic_const('__LINE__');
         *
         * @example $sandbox->deblacklist_magic_const(array('__LINE__', '__FILE__'));
         *
         * @param   string|array        $name       String of magic constant name or array of magic constant names to remove from blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function deblacklist_magic_const($name){
            if(func_num_args() > 1){
                return $this->deblacklist_magic_const(func_get_args());
            }
            $name = $this->normalize_magic_const($name);
            return $this->deblacklist('magic_constants', $name);
        }
        /** Whitelist namespace
         *
         * You can pass a string of namespace name, or pass an array of the namespace names to whitelist
         *
         * @example $sandbox->whitelist_namespace('Foo');
         *
         * @example $sandbox->whitelist_namespace(array('Foo', 'Bar'));
         *
         * @param   string|array        $name       String of namespace name or array of namespace names to whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function whitelist_namespace($name){
            if(func_num_args() > 1){
                return $this->whitelist_namespace(func_get_args());
            }
            $name = $this->normalize_namespace($name);
            return $this->whitelist('namespaces', $name);
        }
        /** Blacklist namespace
         *
         * You can pass a string of namespace name, or pass an array of the namespace names to blacklist
         *
         * @example $sandbox->blacklist_namespace('Foo');
         *
         * @example $sandbox->blacklist_namespace(array('Foo', 'Bar'));
         *
         * @param   string|array        $name       String of namespace name or array of namespace names to blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function blacklist_namespace($name){
            if(func_num_args() > 1){
                return $this->blacklist_namespace(func_get_args());
            }
            $name = $this->normalize_namespace($name);
            return $this->blacklist('namespaces', $name);
        }
        /** Remove namespace from whitelist
         *
         * You can pass a string of namespace name, or pass an array of the namespace names to remove from whitelist
         *
         * @example $sandbox->dewhitelist_namespace('Foo');
         *
         * @example $sandbox->dewhitelist_namespace(array('Foo', 'Bar'));
         *
         * @param   string|array        $name       String of namespace name or array of namespace names to remove from whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function dewhitelist_namespace($name){
            if(func_num_args() > 1){
                return $this->dewhitelist_namespace(func_get_args());
            }
            $name = $this->normalize_namespace($name);
            return $this->dewhitelist('namespaces', $name);
        }
        /** Remove namespace from blacklist
         *
         * You can pass a string of namespace name, or pass an array of the namespace names to remove from blacklist
         *
         * @example $sandbox->deblacklist_namespace('Foo');
         *
         * @example $sandbox->deblacklist_namespace(array('Foo', 'Bar'));
         *
         * @param   string|array        $name       String of namespace name or array of namespace names to remove from blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function deblacklist_namespace($name){
            if(func_num_args() > 1){
                return $this->deblacklist_namespace(func_get_args());
            }
            $name = $this->normalize_namespace($name);
            return $this->deblacklist('namespaces', $name);
        }
        /** Whitelist alias
         *
         * You can pass a string of alias name, or pass an array of the alias names to whitelist
         *
         * @example $sandbox->whitelist_alias('Foo');
         *
         * @example $sandbox->whitelist_alias(array('Foo', 'Bar'));
         *
         * @param   string|array        $name       String of alias names  or array of alias names to whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function whitelist_alias($name){
            if(func_num_args() > 1){
                return $this->whitelist_alias(func_get_args());
            }
            $name = $this->normalize_alias($name);
            return $this->whitelist('aliases', $name);
        }
        /** Blacklist alias
         *
         * You can pass a string of alias name, or pass an array of the alias names to blacklist
         *
         * @example $sandbox->blacklist_alias('Foo');
         *
         * @example $sandbox->blacklist_alias(array('Foo', 'Bar'));
         *
         * @param   string|array        $name       String of alias name or array of alias names to blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function blacklist_alias($name){
            if(func_num_args() > 1){
                return $this->blacklist_alias(func_get_args());
            }
            $name = $this->normalize_alias($name);
            return $this->blacklist('aliases', $name);
        }
        /** Remove alias from whitelist
         *
         * You can pass a string of alias name, or pass an array of the alias names to remove from whitelist
         *
         * @example $sandbox->dewhitelist_alias('Foo');
         *
         * @example $sandbox->dewhitelist_alias(array('Foo', 'Bar'));
         *
         * @param   string|array        $name       String of alias name or array of alias names to remove from whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function dewhitelist_alias($name){
            if(func_num_args() > 1){
                return $this->dewhitelist_alias(func_get_args());
            }
            $name = $this->normalize_alias($name);
            return $this->dewhitelist('aliases', $name);
        }
        /** Remove alias from blacklist
         *
         * You can pass a string of alias name, or pass an array of the alias names to remove from blacklist
         *
         * @example $sandbox->deblacklist_alias('Foo');
         *
         * @example $sandbox->deblacklist_alias(array('Foo', 'Bar'));
         *
         * @param   string|array        $name       String of alias name or array of alias names to remove from blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function deblacklist_alias($name){
            if(func_num_args() > 1){
                return $this->deblacklist_alias(func_get_args());
            }
            $name = $this->normalize_alias($name);
            return $this->deblacklist('aliases', $name);
        }
        /** Whitelist use (or alias)
         *
         * You can pass a string of use (or alias) name, or pass an array of the use (or alias) names to whitelist
         *
         * @alias   whitelist_alias();
         *
         * @example $sandbox->whitelist_use('Foo');
         *
         * @example $sandbox->whitelist_use(array('Foo', 'Bar'));
         *
         * @param   string|array        $name       String of use (or alias) name or array of use (or alias) names to whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function whitelist_use($name){
            if(func_num_args() > 1){
                return $this->whitelist_alias(func_get_args());
            }
            return $this->whitelist_alias($name);
        }
        /** Blacklist use (or alias)
         *
         * You can pass a string of use (or alias) name, or pass an array of the use (or alias) names to blacklist
         *
         * @alias   blacklist_alias();
         *
         * @example $sandbox->blacklist_use('Foo');
         *
         * @example $sandbox->blacklist_use(array('Foo', 'Bar'));
         *
         * @param   string|array        $name       String of use (or alias) name or array of use (or alias) names to blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function blacklist_use($name){
            if(func_num_args() > 1){
                return $this->blacklist_alias(func_get_args());
            }
            return $this->blacklist_alias($name);
        }
        /** Remove use (or alias) from whitelist
         *
         * You can pass a string of use (or alias name, or pass an array of the use (or alias) names to remove from whitelist
         *
         * @alias   dewhitelist_alias();
         *
         * @example $sandbox->dewhitelist_use('Foo');
         *
         * @example $sandbox->dewhitelist_use(array('Foo', 'Bar'));
         *
         * @param   string|array        $name       String of use (or alias) name or array of use (or alias) names to remove from whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function dewhitelist_use($name){
            if(func_num_args() > 1){
                return $this->dewhitelist_alias(func_get_args());
            }
            return $this->dewhitelist_alias($name);
        }
        /** Remove use (or alias) from blacklist
         *
         * You can pass a string of use (or alias name, or pass an array of the use (or alias) names to remove from blacklist
         *
         * @alias   deblacklist_alias();
         *
         * @example $sandbox->deblacklist_use('Foo');
         *
         * @example $sandbox->deblacklist_use(array('Foo', 'Bar'));
         *
         * @param   string|array        $name       String of use (or alias) name or array of use (or alias) names to remove from blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function deblacklist_use($name){
            if(func_num_args() > 1){
                return $this->deblacklist_alias(func_get_args());
            }
            return $this->deblacklist_alias($name);
        }
        /** Whitelist class
         *
         * You can pass a string of class name, or pass an array of the class names to whitelist
         *
         * @example $sandbox->whitelist_class('Foo');
         *
         * @example $sandbox->whitelist_class(array('Foo', 'Bar'));
         *
         * @param   string|array        $name       String of class name or array of class names to whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function whitelist_class($name){
            if(func_num_args() > 1){
                return $this->whitelist_class(func_get_args());
            }
            $name = $this->normalize_class($name);
            return $this->whitelist('classes', $name);
        }
        /** Blacklist class
         *
         * You can pass a string of class name, or pass an array of the class names to blacklist
         *
         * @example $sandbox->blacklist_class('Foo');
         *
         * @example $sandbox->blacklist_class(array('Foo', 'Bar'));
         *
         * @param   string|array        $name       String of class name or array of class names to blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function blacklist_class($name){
            if(func_num_args() > 1){
                return $this->blacklist_class(func_get_args());
            }
            $name = $this->normalize_class($name);
            return $this->blacklist('classes', $name);
        }
        /** Remove class from whitelist
         *
         * You can pass a string of class name, or pass an array of the class names to remove from whitelist
         *
         * @example $sandbox->dewhitelist_class('Foo');
         *
         * @example $sandbox->dewhitelist_class(array('Foo', 'Bar'));
         *
         * @param   string|array        $name       String of class name or array of class names to remove from whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function dewhitelist_class($name){
            if(func_num_args() > 1){
                return $this->dewhitelist_class(func_get_args());
            }
            $name = $this->normalize_class($name);
            return $this->dewhitelist('classes', $name);
        }
        /** Remove class from blacklist
         *
         * You can pass a string of class name, or pass an array of the class names to remove from blacklist
         *
         * @example $sandbox->deblacklist_class('Foo');
         *
         * @example $sandbox->deblacklist_class(array('Foo', 'Bar'));
         *
         * @param   string|array        $name       String of class name or array of class names to remove from blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function deblacklist_class($name){
            if(func_num_args() > 1){
                return $this->deblacklist_class(func_get_args());
            }
            $name = $this->normalize_class($name);
            return $this->deblacklist('classes', $name);
        }
        /** Whitelist interface
         *
         * You can pass a string of interface name, or pass an array of the interface names to whitelist
         *
         * @example $sandbox->whitelist_interface('Foo');
         *
         * @example $sandbox->whitelist_interface(array('Foo', 'Bar'));
         *
         * @param   string|array        $name       String of interface name or array of interface names to whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function whitelist_interface($name){
            if(func_num_args() > 1){
                return $this->whitelist_interface(func_get_args());
            }
            $name = $this->normalize_interface($name);
            return $this->whitelist('interfaces', $name);
        }
        /** Blacklist interface
         *
         * You can pass a string of interface name, or pass an array of the interface names to blacklist
         *
         * @example $sandbox->blacklist_interface('Foo');
         *
         * @example $sandbox->blacklist_interface(array('Foo', 'Bar'));
         *
         * @param   string|array        $name       String of interface name or array of interface names to blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function blacklist_interface($name){
            if(func_num_args() > 1){
                return $this->blacklist_interface(func_get_args());
            }
            $name = $this->normalize_interface($name);
            return $this->blacklist('interfaces', $name);
        }
        /** Remove interface from whitelist
         *
         * You can pass a string of interface name, or pass an array of the interface names to remove from whitelist
         *
         * @example $sandbox->dewhitelist_interface('Foo');
         *
         * @example $sandbox->dewhitelist_interface(array('Foo', 'Bar'));
         *
         * @param   string|array        $name       String of interface name or array of interface names to remove from whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function dewhitelist_interface($name){
            if(func_num_args() > 1){
                return $this->dewhitelist_interface(func_get_args());
            }
            $name = $this->normalize_interface($name);
            return $this->dewhitelist('interfaces', $name);
        }
        /** Remove interface from blacklist
         *
         * You can pass a string of interface name, or pass an array of the interface names to remove from blacklist
         *
         * @example $sandbox->deblacklist_interface('Foo');
         *
         * @example $sandbox->deblacklist_interface(array('Foo', 'Bar'));
         *
         * @param   string|array        $name       String of interface name or array of interface names to remove from blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function deblacklist_interface($name){
            if(func_num_args() > 1){
                return $this->deblacklist_interface(func_get_args());
            }
            $name = $this->normalize_interface($name);
            return $this->deblacklist('interfaces', $name);
        }
        /** Whitelist trait
         *
         * You can pass a string of trait name, or pass an array of the trait names to whitelist
         *
         * @example $sandbox->whitelist_trait('Foo');
         *
         * @example $sandbox->whitelist_trait(array('Foo', 'Bar'));
         *
         * @param   string|array        $name       String of trait name or array of trait names to whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function whitelist_trait($name){
            if(func_num_args() > 1){
                return $this->whitelist_trait(func_get_args());
            }
            $name = $this->normalize_trait($name);
            return $this->whitelist('traits', $name);
        }
        /** Blacklist trait
         *
         * You can pass a string of trait name, or pass an array of the trait names to blacklist
         *
         * @example $sandbox->blacklist_trait('Foo');
         *
         * @example $sandbox->blacklist_trait(array('Foo', 'Bar'));
         *
         * @param   string|array        $name       String of trait name or array of trait names to blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function blacklist_trait($name){
            if(func_num_args() > 1){
                return $this->blacklist_trait(func_get_args());
            }
            $name = $this->normalize_trait($name);
            return $this->blacklist('traits', $name);
        }
        /** Remove trait from whitelist
         *
         * You can pass a string of trait name, or pass an array of the trait names to remove from whitelist
         *
         * @example $sandbox->dewhitelist_trait('Foo');
         *
         * @example $sandbox->dewhitelist_trait(array('Foo', 'Bar'));
         *
         * @param   string|array        $name       String of trait name or array of trait names to remove from whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function dewhitelist_trait($name){
            if(func_num_args() > 1){
                return $this->dewhitelist_trait(func_get_args());
            }
            $name = $this->normalize_trait($name);
            return $this->dewhitelist('traits', $name);
        }
        /** Remove trait from blacklist
         *
         * You can pass a string of trait name, or pass an array of the trait names to remove from blacklist
         *
         * @example $sandbox->deblacklist_trait('Foo');
         *
         * @example $sandbox->deblacklist_trait(array('Foo', 'Bar'));
         *
         * @param   string|array        $name       String of trait name or array of trait names to remove from blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function deblacklist_trait($name){
            if(func_num_args() > 1){
                return $this->deblacklist_trait(func_get_args());
            }
            $name = $this->normalize_trait($name);
            return $this->deblacklist('traits', $name);
        }
        /** Whitelist keyword
         *
         * You can pass a string of keyword name, or pass an array of the keyword names to whitelist
         *
         * @example $sandbox->whitelist_keyword('echo');
         *
         * @example $sandbox->whitelist_keyword(array('echo', 'eval'));
         *
         * @param   string|array        $name       String of keyword name or array of keyword names to whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function whitelist_keyword($name){
            if(func_num_args() > 1){
                return $this->whitelist_keyword(func_get_args());
            }
            $name = $this->normalize_keyword($name);
            return $this->whitelist('keywords', $name);
        }
        /** Blacklist keyword
         *
         * You can pass a string of keyword name, or pass an array of the keyword names to blacklist
         *
         * @example $sandbox->blacklist_keyword('echo');
         *
         * @example $sandbox->blacklist_keyword(array('echo', 'eval'));
         *
         * @param   string|array        $name       String of keyword name or array of keyword names to blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function blacklist_keyword($name){
            if(func_num_args() > 1){
                return $this->blacklist_keyword(func_get_args());
            }
            $name = $this->normalize_keyword($name);
            return $this->blacklist('keywords', $name);
        }
        /** Remove keyword from whitelist
         *
         * You can pass a string of keyword name, or pass an array of the keyword names to remove from whitelist
         *
         * @example $sandbox->dewhitelist_keyword('echo');
         *
         * @example $sandbox->dewhitelist_keyword(array('echo', 'eval'));
         *
         * @param   string|array        $name       String of keyword name or array of keyword names to remove from whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function dewhitelist_keyword($name){
            if(func_num_args() > 1){
                return $this->dewhitelist_keyword(func_get_args());
            }
            $name = $this->normalize_keyword($name);
            return $this->dewhitelist('keywords', $name);
        }
        /** Remove keyword from blacklist
         *
         * You can pass a string of keyword name, or pass an array of the keyword names to remove from blacklist
         *
         * @example $sandbox->deblacklist_keyword('echo');
         *
         * @example $sandbox->deblacklist_keyword(array('echo', 'eval'));
         *
         * @param   string|array        $name       String of keyword name or array of keyword names to remove from blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function deblacklist_keyword($name){
            if(func_num_args() > 1){
                return $this->deblacklist_keyword(func_get_args());
            }
            $name = $this->normalize_keyword($name);
            return $this->deblacklist('keywords', $name);
        }
        /** Whitelist operator
         *
         * You can pass a string of operator name, or pass an array of the operator names to whitelist
         *
         * @example $sandbox->whitelist_operator('+');
         *
         * @example $sandbox->whitelist_operator(array('+', '-'));
         *
         * @param   string|array        $name       String of operator name or array of operator names to whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function whitelist_operator($name){
            if(func_num_args() > 1){
                return $this->whitelist_operator(func_get_args());
            }
            $name = $this->normalize_operator($name);
            return $this->whitelist('operators', $name);
        }
        /** Blacklist operator
         *
         * You can pass a string of operator name, or pass an array of the operator names to blacklist
         *
         * @example $sandbox->blacklist_operator('+');
         *
         * @example $sandbox->blacklist_operator(array('+', '-'));
         *
         * @param   string|array        $name       String of operator name or array of operator names to blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function blacklist_operator($name){
            if(func_num_args() > 1){
                return $this->blacklist_operator(func_get_args());
            }
            $name = $this->normalize_operator($name);
            return $this->blacklist('operators', $name);
        }
        /** Remove operator from whitelist
         *
         * You can pass a string of operator name, or pass an array of the operator names to remove from whitelist
         *
         * @example $sandbox->dewhitelist_operator('+');
         *
         * @example $sandbox->dewhitelist_operator(array('+', '-'));
         *
         * @param   string|array        $name       String of operator name or array of operator names to remove from whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function dewhitelist_operator($name){
            if(func_num_args() > 1){
                return $this->dewhitelist_operator(func_get_args());
            }
            $name = $this->normalize_operator($name);
            return $this->dewhitelist('operators', $name);
        }
        /** Remove operator from blacklist
         *
         * You can pass a string of operator name, or pass an array of the operator names to remove from blacklist
         *
         * @example $sandbox->deblacklist_operator('+');
         *
         * @example $sandbox->deblacklist_operator(array('+', '-'));
         *
         * @param   string|array        $name       String of operator name or array of operator names to remove from blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function deblacklist_operator($name){
            if(func_num_args() > 1){
                return $this->deblacklist_operator(func_get_args());
            }
            $name = $this->normalize_operator($name);
            return $this->deblacklist('operators', $name);
        }
        /** Whitelist primitive
         *
         * You can pass a string of primitive name, or pass an array of the primitive names to whitelist
         *
         * @example $sandbox->whitelist_primitive('int');
         *
         * @example $sandbox->whitelist_primitive(array('int', 'float'));
         *
         * @param   string|array        $name       String of primitive name or array of primitive names to whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function whitelist_primitive($name){
            if(func_num_args() > 1){
                return $this->whitelist_primitive(func_get_args());
            }
            $name = $this->normalize_primitive($name);
            return $this->whitelist('primitives', $name);
        }
        /** Blacklist primitive
         *
         * You can pass a string of primitive name, or pass an array of the primitive names to blacklist
         *
         * @example $sandbox->blacklist_primitive('int');
         *
         * @example $sandbox->blacklist_primitive(array('int', 'float'));
         *
         * @param   string|array        $name       String of primitive name or array of primitive names to blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function blacklist_primitive($name){
            if(func_num_args() > 1){
                return $this->blacklist_primitive(func_get_args());
            }
            $name = $this->normalize_primitive($name);
            return $this->blacklist('primitives', $name);
        }
        /** Remove primitive from whitelist
         *
         * You can pass a string of primitive name, or pass an array of the primitive names to remove from whitelist
         *
         * @example $sandbox->dewhitelist_primitive('int');
         *
         * @example $sandbox->dewhitelist_primitive(array('int', 'float'));
         *
         * @param   string|array        $name       String of primitive name or array of primitive names to remove from whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function dewhitelist_primitive($name){
            if(func_num_args() > 1){
                return $this->dewhitelist_primitive(func_get_args());
            }
            $name = $this->normalize_primitive($name);
            return $this->dewhitelist('primitives', $name);
        }
        /** Remove primitive from blacklist
         *
         * You can pass a string of primitive name, or pass an array of the primitive names to remove from blacklist
         *
         * @example $sandbox->deblacklist_primitive('int');
         *
         * @example $sandbox->deblacklist_primitive(array('int', 'float'));
         *
         * @param   string|array        $name       String of primitive name or array of primitive names to remove from blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function deblacklist_primitive($name){
            if(func_num_args() > 1){
                return $this->deblacklist_primitive(func_get_args());
            }
            $name = $this->normalize_primitive($name);
            return $this->deblacklist('primitives', $name);
        }
        /** Whitelist type
         *
         * You can pass a string of type name, or pass an array of the type names to whitelist
         *
         * @example $sandbox->whitelist_type('PHPSandbox');
         *
         * @example $sandbox->whitelist_type(array('PHPSandbox', 'PHPParser'));
         *
         * @param   string|array        $name       String of type name or array of type names to whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function whitelist_type($name){
            if(func_num_args() > 1){
                return $this->whitelist_type(func_get_args());
            }
            $name = $this->normalize_type($name);
            return $this->whitelist('types', $name);
        }
        /** Blacklist type
         *
         * You can pass a string of type name, or pass an array of the type names to blacklist
         *
         * @example $sandbox->blacklist_type('PHPSandbox');
         *
         * @example $sandbox->blacklist_type(array('PHPSandbox', 'PHPParser'));
         *
         * @param   string|array        $name       String of type name or array of type names to blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function blacklist_type($name){
            if(func_num_args() > 1){
                return $this->blacklist_type(func_get_args());
            }
            $name = $this->normalize_type($name);
            return $this->blacklist('types', $name);
        }
        /** Remove type from whitelist
         *
         * You can pass a string of type name, or pass an array of the type names to remove from whitelist
         *
         * @example $sandbox->dewhitelist_type('PHPSandbox');
         *
         * @example $sandbox->dewhitelist_type(array('PHPSandbox', 'PHPParser'));
         *
         * @param   string|array        $name       String of type name or array of type names to remove from whitelist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function dewhitelist_type($name){
            if(func_num_args() > 1){
                return $this->dewhitelist_type(func_get_args());
            }
            $name = $this->normalize_type($name);
            return $this->dewhitelist('types', $name);
        }
        /** Remove type from blacklist
         *
         * You can pass a string of type name, or pass an array of the type names to remove from blacklist
         *
         * @example $sandbox->deblacklist_type('PHPSandbox');
         *
         * @example $sandbox->deblacklist_type(array('PHPSandbox', 'PHPParser'));
         *
         * @param   string|array        $name       String of type name or array of type names to remove from blacklist
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function deblacklist_type($name){
            if(func_num_args() > 1){
                return $this->deblacklist_type(func_get_args());
            }
            $name = $this->normalize_type($name);
            return $this->deblacklist('types', $name);
        }
        /** Check function name against PHPSandbox validation rules. This is an internal PHPSandbox function but requires public access to work.
         * @param   string   $name      String of the function name to check
         * @throws  Error    Throws exception if validation error occurs
         *
         * @return  bool     Returns true if function is valid, this is also used for testing closures
         */
        public function check_func($name){
            if(!$this->validate_functions){
                return true;
            }
            $original_name = $name;
            if($name instanceof \Closure){
                if(!$this->allow_closures){
                    $this->validation_error("Sandboxed code attempted to call closure!", Error::CLOSURE_ERROR);
                }
                return true;
            } else if($name instanceof SandboxedString){
                $name = strval($name);
            }
            if(!$name || !is_string($name)){
                $this->validation_error("Sandboxed code attempted to call unnamed function!", Error::VALID_FUNC_ERROR, null, '');
            }
            $name = $this->normalize_func($name);
            if(is_callable($this->validation['function'])){
                return call_user_func_array($this->validation['function'], array($name, $this));
            }
            if(!isset($this->definitions['functions'][$name]) || !is_callable($this->definitions['functions'][$name]['function'])){
                if(count($this->whitelist['functions'])){
                    if(!isset($this->whitelist['functions'][$name])){
                        $this->validation_error("Sandboxed code attempted to call non-whitelisted function: $original_name", Error::WHITELIST_FUNC_ERROR, null, $original_name);
                    }
                } else if(count($this->blacklist['functions'])){
                    if(isset($this->blacklist['functions'][$name])){
                        $this->validation_error("Sandboxed code attempted to call blacklisted function: $original_name", Error::BLACKLIST_FUNC_ERROR, null, $original_name);
                    }
                } else {
                    $this->validation_error("Sandboxed code attempted to call invalid function: $original_name", Error::VALID_FUNC_ERROR, null, $original_name);
                }
            }
            return true;
        }
        /** Check variable name against PHPSandbox validation rules. This is an internal PHPSandbox function but requires public access to work.
         * @param   string   $name      String of the variable name to check
         * @throws  Error    Throws exception if validation error occurs
         *
         * @return  bool     Returns true if variable is valid
         */
        public function check_var($name){
            if(!$this->validate_variables){
                return true;
            }
            $original_name = $name;
            if($name instanceof SandboxedString){
                $name = strval($name);
            }
            if(!$name){
                $this->validation_error("Sandboxed code attempted to call unnamed variable!", Error::VALID_VAR_ERROR, null, '');
            }
            if(is_callable($this->validation['variable'])){
                return call_user_func_array($this->validation['variable'], array($name, $this));
            }
            if(!isset($this->definitions['variables'][$name])){
                if(count($this->whitelist['variables'])){
                    if(!isset($this->whitelist['variables'][$name])){
                        $this->validation_error("Sandboxed code attempted to call non-whitelisted variable: $original_name", Error::WHITELIST_VAR_ERROR, null, $original_name);
                    }
                } else if(count($this->blacklist['variables'])){
                    if(isset($this->blacklist['variables'][$name])){
                        $this->validation_error("Sandboxed code attempted to call blacklisted variable: $original_name", Error::BLACKLIST_VAR_ERROR, null, $original_name);
                    }
                } else if(!$this->allow_variables){
                    $this->validation_error("Sandboxed code attempted to call invalid variable: $original_name", Error::VALID_VAR_ERROR, null, $original_name);
                }
            }
            return true;
        }
        /** Check global name against PHPSandbox validation rules. This is an internal PHPSandbox function but requires public access to work.
         * @param   string   $name      String of the global name to check
         * @throws  Error    Throws exception if validation error occurs
         *
         * @return  bool     Returns true if global is valid
         */
        public function check_global($name){
            if(!$this->validate_globals){
                return true;
            }
            $original_name = $name;
            if($name instanceof SandboxedString){
                $name = strval($name);
            }
            if(!$name){
                $this->validation_error("Sandboxed code attempted to call unnamed global!", Error::VALID_GLOBAL_ERROR, null, '');
            }
            if(is_callable($this->validation['global'])){
                return call_user_func_array($this->validation['global'], array($name, $this));
            }
            if(count($this->whitelist['globals'])){
                if(!isset($this->whitelist['globals'][$name])){
                    $this->validation_error("Sandboxed code attempted to call non-whitelisted global: $original_name", Error::WHITELIST_GLOBAL_ERROR, null, $original_name);
                }
            } else if(count($this->blacklist['globals'])){
                if(isset($this->blacklist['globals'][$name])){
                    $this->validation_error("Sandboxed code attempted to call blacklisted global: $original_name", Error::BLACKLIST_GLOBAL_ERROR, null, $original_name);
                }
            } else {
                $this->validation_error("Sandboxed code attempted to call invalid global: $original_name", Error::VALID_GLOBAL_ERROR, null, $original_name);
            }
            return true;
        }
        /** Check superglobal name against PHPSandbox validation rules. This is an internal PHPSandbox function but requires public access to work.
         * @param   string   $name      String of the superglobal name to check
         * @throws  Error    Throws exception if validation error occurs
         *
         * @return  bool     Returns true if superglobal is valid
         */
        public function check_superglobal($name){
            if(!$this->validate_superglobals){
                return true;
            }
            $original_name = $name;
            if($name instanceof SandboxedString){
                $name = strval($name);
            }
            if(!$name){
                $this->validation_error("Sandboxed code attempted to call unnamed superglobal!", Error::VALID_SUPERGLOBAL_ERROR, null, '');
            }
            $name = $this->normalize_superglobal($name);
            if(is_callable($this->validation['superglobal'])){
                return call_user_func_array($this->validation['superglobal'], array($name, $this));
            }
            if(!isset($this->definitions['superglobals'][$name])){
                if(count($this->whitelist['superglobals'])){
                    if(!isset($this->whitelist['superglobals'][$name])){
                        $this->validation_error("Sandboxed code attempted to call non-whitelisted superglobal: $original_name", Error::WHITELIST_SUPERGLOBAL_ERROR, null, $original_name);
                    }
                } else if(count($this->blacklist['superglobals'])){
                    if(isset($this->blacklist['superglobals'][$name]) && !count($this->blacklist['superglobals'][$name])){
                        $this->validation_error("Sandboxed code attempted to call blacklisted superglobal: $original_name", Error::BLACKLIST_SUPERGLOBAL_ERROR, null, $original_name);
                    }
                } else if(!$this->overwrite_superglobals){
                    $this->validation_error("Sandboxed code attempted to call invalid superglobal: $original_name", Error::VALID_SUPERGLOBAL_ERROR, null, $original_name);
                }
            }
            return true;
        }
        /** Check constant name against PHPSandbox validation rules. This is an internal PHPSandbox function but requires public access to work.
         * @param   string   $name      String of the constant name to check
         * @throws  Error    Throws exception if validation error occurs
         *
         * @return  bool     Returns true if constant is valid
         */
        public function check_const($name){
            if(!$this->validate_constants){
                return true;
            }
            $original_name = $name;
            if($name instanceof SandboxedString){
                $name = strval($name);
            }
            if(!$name){
                $this->validation_error("Sandboxed code attempted to call unnamed constant!", Error::VALID_CONST_ERROR, null, '');
            }
            if(strtolower($name) == 'true' || strtolower($name) == 'false'){
                return $this->check_primitive('bool');
            }
            if(strtolower($name) == 'null'){
                return $this->check_primitive('null');
            }
            if(is_callable($this->validation['constant'])){
                return call_user_func_array($this->validation['constant'], array($name, $this));
            }
            if(!isset($this->definitions['constants'][$name])){
                if(count($this->whitelist['constants'])){
                    if(!isset($this->whitelist['constants'][$name])){
                        $this->validation_error("Sandboxed code attempted to call non-whitelisted constant: $original_name", Error::WHITELIST_CONST_ERROR, null, $original_name);
                    }
                } else if(count($this->blacklist['constants'])){
                    if(isset($this->blacklist['constants'][$name])){
                        $this->validation_error("Sandboxed code attempted to call blacklisted constant: $original_name", Error::BLACKLIST_CONST_ERROR, null, $original_name);
                    }
                } else {
                    $this->validation_error("Sandboxed code attempted to call invalid constant: $original_name", Error::VALID_CONST_ERROR, null, $original_name);
                }
            }
            return true;
        }
        /** Check magic constant name against PHPSandbox validation rules. This is an internal PHPSandbox function but requires public access to work.
         * @param   string   $name      String of the magic constant name to check
         * @throws  Error    Throws exception if validation error occurs
         *
         * @return  bool     Returns true if magic constant is valid
         */
        public function check_magic_const($name){
            if(!$this->validate_magic_constants){
                return true;
            }
            $original_name = $name;
            if($name instanceof SandboxedString){
                $name = strval($name);
            }
            if(!$name){
                $this->validation_error("Sandboxed code attempted to call unnamed magic constant!", Error::VALID_MAGIC_CONST_ERROR, null, '');
            }
            $name = $this->normalize_magic_const($name);
            if(is_callable($this->validation['magic_constant'])){
                return call_user_func_array($this->validation['magic_constant'], array($name, $this));
            }
            if(!isset($this->definitions['magic_constants'][$name])){
                if(count($this->whitelist['magic_constants'])){
                    if(!isset($this->whitelist['magic_constants'][$name])){
                        $this->validation_error("Sandboxed code attempted to call non-whitelisted magic constant: $original_name", Error::WHITELIST_MAGIC_CONST_ERROR, null, $original_name);
                    }
                } else if(count($this->blacklist['magic_constants'])){
                    if(isset($this->blacklist['magic_constants'][$name])){
                        $this->validation_error("Sandboxed code attempted to call blacklisted magic constant: $original_name", Error::BLACKLIST_MAGIC_CONST_ERROR, null, $original_name);
                    }
                } else {
                    $this->validation_error("Sandboxed code attempted to call invalid magic constant: $original_name", Error::VALID_MAGIC_CONST_ERROR, null, $original_name);
                }
            }
            return true;
        }
        /** Check namespace name against PHPSandbox validation rules. This is an internal PHPSandbox function but requires public access to work.
         * @param   string   $name      String of the namespace name to check
         * @throws  Error    Throws exception if validation error occurs
         *
         * @return  bool     Returns true if namespace is valid
         */
        public function check_namespace($name){
            if(!$this->validate_namespaces){
                return true;
            }
            $original_name = $name;
            if($name instanceof SandboxedString){
                $name = strval($name);
            }
            if(!$name){
                $this->validation_error("Sandboxed code attempted to call unnamed namespace!", Error::VALID_NAMESPACE_ERROR, null, '');
            }
            $name = $this->normalize_namespace($name);
            if(is_callable($this->validation['namespace'])){
                return call_user_func_array($this->validation['namespace'], array($name, $this));
            }
            if(!isset($this->definitions['namespaces'][$name])){
                if(count($this->whitelist['namespaces'])){
                    if(!isset($this->whitelist['namespaces'][$name])){
                        $this->validation_error("Sandboxed code attempted to call non-whitelisted namespace: $original_name", Error::WHITELIST_NAMESPACE_ERROR, null, $original_name);
                    }
                } else if(count($this->blacklist['namespaces'])){
                    if(isset($this->blacklist['namespaces'][$name])){
                        $this->validation_error("Sandboxed code attempted to call blacklisted namespace: $original_name", Error::BLACKLIST_NAMESPACE_ERROR, null, $original_name);
                    }
                } else if(!$this->allow_namespaces){
                    $this->validation_error("Sandboxed code attempted to call invalid namespace: $original_name", Error::VALID_NAMESPACE_ERROR, null, $original_name);
                }
            }
            return true;
        }
        /** Check alias name against PHPSandbox validation rules. This is an internal PHPSandbox function but requires public access to work.
         * @param   string   $name      String of the alias name to check
         * @throws  Error    Throws exception if validation error occurs
         *
         * @return  bool     Returns true if alias is valid
         */
        public function check_alias($name){
            if(!$this->validate_aliases){
                return true;
            }
            $original_name = $name;
            if($name instanceof SandboxedString){
                $name = strval($name);
            }
            if(!$name){
                $this->validation_error("Sandboxed code attempted to call unnamed alias!", Error::VALID_ALIAS_ERROR, null, '');
            }
            $name = $this->normalize_alias($name);
            if(is_callable($this->validation['alias'])){
                return call_user_func_array($this->validation['alias'], array($name, $this));
            }
            if(count($this->whitelist['aliases'])){
                if(!isset($this->whitelist['aliases'][$name])){
                    $this->validation_error("Sandboxed code attempted to call non-whitelisted alias: $original_name", Error::WHITELIST_ALIAS_ERROR, null, $original_name);
                }
            } else if(count($this->blacklist['aliases'])){
                if(isset($this->blacklist['aliases'][$name])){
                    $this->validation_error("Sandboxed code attempted to call blacklisted alias: $original_name", Error::BLACKLIST_ALIAS_ERROR, null, $original_name);
                }
            } else if(!$this->allow_aliases){
                $this->validation_error("Sandboxed code attempted to call invalid alias: $original_name", Error::VALID_ALIAS_ERROR, null, $original_name);
            }
            return true;
        }
        /** Check use (or alias) name against PHPSandbox validation rules. This is an internal PHPSandbox function but requires public access to work.
         *
         * @alias check_alias();
         *
         * @param   string   $name      String of the use (or alias) name to check
         * @throws  Error    Throws exception if validation error occurs
         *
         * @return  bool     Returns true if use (or alias) is valid
         */
        public function check_use($name){
            return $this->check_alias($name);
        }
        /** Check class name against PHPSandbox validation rules. This is an internal PHPSandbox function but requires public access to work.
         * @param   string   $name      String of the class name to check
         * @param   bool     $extends   Flag whether this is an extended class
         * @throws  Error    Throws exception if validation error occurs
         *
         * @return  bool     Returns true if class is valid
         */
        public function check_class($name, $extends = false){
            if(!$this->validate_classes){
                return true;
            }
            $original_name = $name;
            if($name instanceof SandboxedString){
                $name = strval($name);
            }
            $action = $extends ? 'extend' : 'call';
            if(!$name){
                $this->validation_error("Sandboxed code attempted to $action unnamed class!", Error::VALID_CLASS_ERROR, null, '');
            }
            $name = $this->normalize_class($name);
            if($name == 'self' || $name == 'static' || $name == 'parent'){
                return true;
            }
            if(is_callable($this->validation['class'])){
                return call_user_func_array($this->validation['class'], array($name, $this));
            }
            if(!isset($this->definitions['classes'][$name])){
                if(count($this->whitelist['classes'])){
                    if(!isset($this->whitelist['classes'][$name])){
                        $this->validation_error("Sandboxed code attempted to $action non-whitelisted class: $original_name", Error::WHITELIST_CLASS_ERROR, null, $original_name);
                    }
                } else if(count($this->blacklist['classes'])){
                    if(isset($this->blacklist['classes'][$name])){
                        $this->validation_error("Sandboxed code attempted to $action blacklisted class: $original_name", Error::BLACKLIST_CLASS_ERROR, null, $original_name);
                    }
                } else {
                    $this->validation_error("Sandboxed code attempted to $action invalid class: $original_name", Error::VALID_CLASS_ERROR, null, $original_name);
                }
            }
            return true;
        }
        /** Check interface name against PHPSandbox validation rules. This is an internal PHPSandbox function but requires public access to work.
         * @param   string   $name      String of the interface name to check
         * @throws  Error    Throws exception if validation error occurs
         *
         * @return  bool     Returns true if interface is valid
         */
        public function check_interface($name){
            if(!$this->validate_interfaces){
                return true;
            }
            $original_name = $name;
            if($name instanceof SandboxedString){
                $name = strval($name);
            }
            if(!$name){
                $this->validation_error("Sandboxed code attempted to call unnamed interface!", Error::VALID_INTERFACE_ERROR, null, '');
            }
            $name = $this->normalize_interface($name);
            if(is_callable($this->validation['interface'])){
                return call_user_func_array($this->validation['interface'], array($name, $this));
            }
            if(!isset($this->definitions['interfaces'][$name])){
                if(count($this->whitelist['interfaces'])){
                    if(!isset($this->whitelist['interfaces'][$name])){
                        $this->validation_error("Sandboxed code attempted to call non-whitelisted interface: $original_name", Error::WHITELIST_INTERFACE_ERROR, null, $original_name);
                    }
                } else if(count($this->blacklist['interfaces'])){
                    if(isset($this->blacklist['interfaces'][$name])){
                        $this->validation_error("Sandboxed code attempted to call blacklisted interface: $original_name", Error::BLACKLIST_INTERFACE_ERROR, null, $original_name);
                    }
                } else {
                    $this->validation_error("Sandboxed code attempted to call invalidnterface: $original_name", Error::VALID_INTERFACE_ERROR, null, $original_name);
                }
            }
            return true;
        }
        /** Check trait name against PHPSandbox validation rules. This is an internal PHPSandbox function but requires public access to work.
         * @param   string   $name      String of the trait name to check
         * @throws  Error    Throws exception if validation error occurs
         *
         * @return  bool     Returns true if trait is valid
         */
        public function check_trait($name){
            if(!$this->validate_traits){
                return true;
            }
            $original_name = $name;
            if($name instanceof SandboxedString){
                $name = strval($name);
            }
            if(!$name){
                $this->validation_error("Sandboxed code attempted to call unnamed trait!", Error::VALID_TRAIT_ERROR, null, '');
            }
            $name = $this->normalize_trait($name);
            if(is_callable($this->validation['trait'])){
                return call_user_func_array($this->validation['trait'], array($name, $this));
            }
            if(!isset($this->definitions['traits'][$name])){
                if(count($this->whitelist['traits'])){
                    if(!isset($this->whitelist['traits'][$name])){
                        $this->validation_error("Sandboxed code attempted to call non-whitelisted trait: $original_name", Error::WHITELIST_TRAIT_ERROR, null, $original_name);
                    }
                } else if(count($this->blacklist['traits'])){
                    if(isset($this->blacklist['traits'][$name])){
                        $this->validation_error("Sandboxed code attempted to call blacklisted trait: $original_name", Error::BLACKLIST_TRAIT_ERROR, null, $original_name);
                    }
                } else {
                    $this->validation_error("Sandboxed code attempted to call invalid trait: $original_name", Error::VALID_TRAIT_ERROR, null, $original_name);
                }
            }
            return true;
        }
        /** Check keyword name against PHPSandbox validation rules. This is an internal PHPSandbox function but requires public access to work.
         * @param   string   $name      String of the keyword name to check
         * @throws  Error    Throws exception if validation error occurs
         *
         * @return  bool     Returns true if keyword is valid
         */
        public function check_keyword($name){
            if(!$this->validate_keywords){
                return true;
            }
            $original_name = $name;
            if($name instanceof SandboxedString){
                $name = strval($name);
            }
            if(!$name){
                $this->validation_error("Sandboxed code attempted to call unnamed keyword!", Error::VALID_KEYWORD_ERROR, null, '');
            }
            $name = $this->normalize_keyword($name);
            if(is_callable($this->validation['keyword'])){
                return call_user_func_array($this->validation['keyword'], array($name, $this));
            }
            if(count($this->whitelist['keywords'])){
                if(!isset($this->whitelist['keywords'][$name])){
                    $this->validation_error("Sandboxed code attempted to call non-whitelisted keyword: $original_name", Error::WHITELIST_KEYWORD_ERROR, null, $original_name);
                }
            } else if(count($this->blacklist['keywords'])){
                if(isset($this->blacklist['keywords'][$name])){
                    $this->validation_error("Sandboxed code attempted to call blacklisted keyword: $original_name", Error::BLACKLIST_KEYWORD_ERROR, null, $original_name);
                }
            }
            return true;
        }
        /** Check operator name against PHPSandbox validation rules. This is an internal PHPSandbox function but requires public access to work.
         * @param   string   $name      String of the type operator to check
         * @throws  Error    Throws exception if validation error occurs
         *
         * @return  bool     Returns true if operator is valid
         */
        public function check_operator($name){
            if(!$this->validate_operators){
                return true;
            }
            $original_name = $name;
            if($name instanceof SandboxedString){
                $name = strval($name);
            }
            if(!$name){
                $this->validation_error("Sandboxed code attempted to call unnamed operator!", Error::VALID_OPERATOR_ERROR, null, '');
            }
            $name = $this->normalize_operator($name);
            if(is_callable($this->validation['operator'])){
                return call_user_func_array($this->validation['operator'], array($name, $this));
            }
            if(count($this->whitelist['operators'])){
                if(!isset($this->whitelist['operators'][$name])){
                    $this->validation_error("Sandboxed code attempted to call non-whitelisted operator: $original_name", Error::WHITELIST_OPERATOR_ERROR, null, $original_name);
                }
            } else if(count($this->blacklist['operators'])){
                if(isset($this->blacklist['operators'][$name])){
                    $this->validation_error("Sandboxed code attempted to call blacklisted operator: $original_name", Error::BLACKLIST_OPERATOR_ERROR, null, $original_name);
                }
            }
            return true;
        }
        /** Check primitive name against PHPSandbox validation rules. This is an internal PHPSandbox function but requires public access to work.
         * @param   string   $name      String of the primitive name to check
         * @throws  Error    Throws exception if validation error occurs
         *
         * @return  bool     Returns true if primitive is valid
         */
        public function check_primitive($name){
            if(!$this->validate_primitives){
                return true;
            }
            $original_name = $name;
            if($name instanceof SandboxedString){
                $name = strval($name);
            }
            if(!$name){
                $this->validation_error("Sandboxed code attempted to call unnamed primitive!", Error::VALID_PRIMITIVE_ERROR, null, '');
            }
            $name = $this->normalize_primitive($name);
            if(is_callable($this->validation['primitive'])){
                return call_user_func_array($this->validation['primitive'], array($name, $this));
            }
            if(count($this->whitelist['primitives'])){
                if(!isset($this->whitelist['primitives'][$name])){
                    $this->validation_error("Sandboxed code attempted to call non-whitelisted primitive: $original_name", Error::WHITELIST_PRIMITIVE_ERROR, null, $original_name);
                }
            } else if(count($this->blacklist['primitives'])){
                if(isset($this->blacklist['primitives'][$name])){
                    $this->validation_error("Sandboxed code attempted to call blacklisted primitive: $original_name", Error::BLACKLIST_PRIMITIVE_ERROR, null, $original_name);
                }
            }
            return true;
        }
        /** Check type name against PHPSandbox validation rules. This is an internal PHPSandbox function but requires public access to work.
         * @param   string   $name      String of the type name to check
         * @throws  Error    Throws exception if validation error occurs
         *
         * @return  bool     Returns true if type is valid
         */
        public function check_type($name){
            if(!$this->validate_types){
                return true;
            }
            $original_name = $name;
            if($name instanceof SandboxedString){
                $name = strval($name);
            }
            if(!$name){
                $this->validation_error("Sandboxed code attempted to call unnamed type!", Error::VALID_TYPE_ERROR, null, '');
            }
            $name = $this->normalize_type($name);
            if(is_callable($this->validation['type'])){
                return call_user_func_array($this->validation['type'], array($name, $this));
            }
            if(!isset($this->definitions['classes'][$name])){
                if(count($this->whitelist['types'])){
                    if(!isset($this->whitelist['types'][$name])){
                        $this->validation_error("Sandboxed code attempted to call non-whitelisted type: $original_name", Error::WHITELIST_TYPE_ERROR, null, $original_name);
                    }
                } else if(count($this->blacklist['types'])){
                    if(isset($this->blacklist['types'][$name])){
                        $this->validation_error("Sandboxed code attempted to call blacklisted type: $original_name", Error::BLACKLIST_TYPE_ERROR, null, $original_name);
                    }
                } else {
                    $this->validation_error("Sandboxed code attempted to call invalid type: $original_name", Error::VALID_TYPE_ERROR, null, $original_name);
                }
            }
            return true;
        }
        /** Prepare defined variables for execution
         *
         * @throws  Error       Throws exception if variable preparation error occurs
         * @return  string      Prepared string of variable output
         */
        protected function prepare_vars(){
            $output = array();
            foreach($this->definitions['variables'] as $name => $value){
                if(is_int($name)){  //can't define numeric variable names
                    $this->validation_error("Cannot define variable name that begins with an integer!", Error::DEFINE_VAR_ERROR, null, $name);
                }
                if(is_scalar($value) || is_null($value)){
                    if(is_bool($value)){
                        $output[] = '$' . $name . ' = ' . ($value ? 'true' : 'false');
                    } else if(is_int($value)){
                        $output[] = '$' . $name . ' = ' . ($value ? $value : '0');
                    } else if(is_float($value)){
                        $output[] = '$' . $name . ' = ' . ($value ? $value : '0.0');
                    } else if(is_string($value)){
                        $output[] = '$' . $name . " = '" . addcslashes($value, "'") . "'";
                    } else {
                        $output[] = '$' . $name . " = null";
                    }
                } else {
                    $output[] = '$' . $name . " = unserialize('" . addcslashes(serialize($value), "'\\") . "')";
                }
            }
            return count($output) ? "\r\n" . implode(";\r\n", $output) . ";\r\n" : '';
        }
        /** Prepare defined constants for execution
         */
        protected function prepare_consts(){
            $output = array();
            foreach($this->definitions['constants'] as $name => $value){
                if(is_scalar($value) || is_null($value)){
                    if(is_bool($value)){
                        $output[] = '\define(' . "'" . $name . "', " . ($value ? 'true' : 'false') . ');';
                    } else if(is_int($value)){
                        $output[] = '\define(' . "'" . $name . "', " . ($value ? $value : '0') . ');';
                    } else if(is_float($value)){
                        $output[] = '\define(' . "'" . $name . "', " . ($value ? $value : '0.0') . ');';
                    } else if(is_string($value)){
                        $output[] = '\define(' . "'" . $name . "', '" . addcslashes($value, "'") . "');";
                    } else {
                        $output[] = '\define(' . "'" . $name . "', null);";
                    }
                } else {
                    $this->validation_error("Sandboxed code attempted to define non-scalar constant value: $name", Error::DEFINE_CONST_ERROR, null, $name);
                }
            }
            return count($output) ? implode("\r\n", $output) ."\r\n" : '';
        }
        /** Prepare defined namespaces for execution
         */
        protected function prepare_namespaces(){
            $output = array();
            foreach($this->definitions['namespaces'] as $name){
                if(is_string($name) && $name){
                    $output[] = 'namespace ' . $name . ';';
                } else {
                    $this->validation_error("Sandboxed code attempted to create invalid namespace: $name", Error::DEFINE_NAMESPACE_ERROR, null, $name);
                }
            }
            return count($output) ? implode("\r\n", $output) ."\r\n" : '';
        }
        /** Prepare defined aliases for execution
         */
        protected function prepare_aliases(){
            $output = array();
            foreach($this->definitions['aliases'] as $alias){
                if(is_array($alias) && isset($alias['original']) && is_string($alias['original']) && $alias['original']){
                    $output[] = 'use ' . $alias['original'] . ((isset($alias['alias']) && is_string($alias['alias']) && $alias['alias']) ? ' as ' . $alias['alias'] : '') . ';';
                } else {
                    $this->validation_error("Sandboxed code attempted to use invalid namespace alias: " . $alias['original'], Error::DEFINE_ALIAS_ERROR, null, $alias['original']);
                }
            }
            return count($output) ? implode("\r\n", $output) ."\r\n" : '';
        }
        /** Prepare defined uses (or aliases) for execution
         * @alias   prepare_aliases();
         */
        protected function prepare_uses(){
            return $this->prepare_aliases();
        }
        /** Disassemble callable to string
         *
         * @param   callable    $closure                The callable to disassemble
         *
         * @throws  Error       Throw exception if callable is passed and FunctionParser library is missing
         *
         * @return  string      Return the disassembled code string
         */
        protected function disassemble($closure){
            if(is_string($closure) && !is_callable($closure)){
                return substr($closure, 0, 2) == '<?' ? $closure : '<?php ' . $closure;
            }
            $disassembled_closure = FunctionParser::fromCallable($closure);
            if($this->auto_define_vars){
                $this->auto_define($disassembled_closure);
            }
            return '<?php' . $disassembled_closure->getBody();
        }
        /** Automatically whitelisted trusted code
         *
         * @param   string    $code         String of trusted $code to automatically whitelist
         * @param   bool      $appended     Flag if this code ir prended or appended (true = appended)
         *
         * @return  mixed     Return result of error handler if $code could not be parsed
         *
         * @throws  Error     Throw exception if code cannot be parsed for whitelisting
         */
        protected function auto_whitelist($code, $appended = false){
            $parser = new \PHPParser_Parser(new \PHPParser_Lexer);
            try {
                $statements = $parser->parse($code);
            } catch (\PHPParser_Error $error) {
                return $this->validation_error('Error parsing ' . ($appended ? 'appended' : 'prepended') . ' sandboxed code for auto-whitelisting!', Error::PARSER_ERROR, null, $code, $error);
            }
            $traverser = new \PHPParser_NodeTraverser;
            $whitelister = new WhitelistVisitor($this);
            $traverser->addVisitor($whitelister);
            $traverser->traverse($statements);
            return true;
        }
        /** Automatically define variables passed to disassembled closure
         * @param FunctionParser    $disassembled_closure
         */
        protected function auto_define(FunctionParser $disassembled_closure){
            $parameters = $disassembled_closure->getReflection()->getParameters();
            foreach($parameters as $param){
                /**
                 * @var \ReflectionParameter $param
                 */
                $this->define_var($param->getName(), $param->isDefaultValueAvailable() ? $param->getDefaultValue() : null);
            }
        }
        /** Prepend trusted code
         * @param   string|callable     $code         String or callable of trusted $code to prepend to generated code
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function prepend($code){
            if(!$code){
                return $this;
            }
            $code = $this->disassemble($code);
            if($this->auto_whitelist_trusted_code){
                $this->auto_whitelist($code);
            }
            $this->prepended_code .= substr($code, 6) . "\r\n"; //remove opening php tag
            return $this;
        }
        /** Append trusted code
         * @param   string|callable     $code         String or callable of trusted $code to append to generated code
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function append($code){
            if(!$code){
                return $this;
            }
            $code = $this->disassemble($code);
            if($this->auto_whitelist_trusted_code){
                $this->auto_whitelist($code, true);
            }
            $this->appended_code .= "\r\n" . substr($code, 6) . "\r\n"; //remove opening php tag
            return $this;
        }
        /** Clear all trusted and sandboxed code
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function clear(){
            $this->prepended_code = '';
            $this->generated_code = null;
            $this->appended_code = '';
            return $this;
        }
        /** Clear all trusted code
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function clear_trusted_code(){
            $this->prepended_code = '';
            $this->appended_code = '';
            return $this;
        }
        /** Clear all prepended trusted code
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function clear_prepend(){
            $this->prepended_code = '';
            return $this;
        }
        /** Clear all appended trusted code
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function clear_append(){
            $this->appended_code = '';
            return $this;
        }
        /** Clear generated code
         *
         * @return  PHPSandbox               Returns the PHPSandbox instance for chainability
         */
        public function clear_code(){
            $this->generated_code = null;
            return $this;
        }
        /** Return the amount of time the sandbox spent preparing the sandboxed code
         *
         * You can pass the number of digits you wish to round the return value
         *
         * @example $sandbox->get_prepared_time();
         *
         * @example $sandbox->get_prepared_time(3);
         *
         * @param   int|null        $round      The number of digits to round the return value
         *
         * @return  float           The amount of time in microseconds it took to prepare the sandboxed code
         */
        public function get_prepared_time($round = null){
            return $round ? round($this->prepare_time, $round) : $this->prepare_time;
        }
        /** Return the amount of time the sandbox spent executing the sandboxed code
         *
         * You can pass the number of digits you wish to round the return value
         *
         * @example $sandbox->get_execution_time();
         *
         * @example $sandbox->get_execution_time(3);
         *
         * @param   int|null        $round      The number of digits to round the return value
         *
         * @return  float           The amount of time in microseconds it took to execute the sandboxed code
         */
        public function get_execution_time($round = null){
            return $round ? round($this->execution_time, $round) : $this->execution_time;
        }
        /** Return the amount of time the sandbox spent preparing and executing the sandboxed code
         *
         * You can pass the number of digits you wish to round the return value
         *
         * @example $sandbox->get_time();
         *
         * @example $sandbox->get_time(3);
         *
         * @param   int|null        $round      The number of digits to round the return value
         *
         * @return  float           The amount of time in microseconds it took to prepare and execute the sandboxed code
         */
        public function get_time($round = null){
            return $round ? round($this->prepare_time + $this->execution_time, $round) : ($this->prepare_time + $this->execution_time);
        }
        /** Validate passed callable for execution
         *
         * @example $sandbox->validate('<?php echo "Hello World!"; ?>');
         *
         * @param   callable|string $code      The callable or string of code to validate
         *
         * @return  PHPSandbox      Returns the PHPSandbox instance for chainability
         */
        public function validate($code){
            $this->preparsed_code = $this->disassemble($code);
            $parser = new \PHPParser_Parser(new \PHPParser_Lexer_Emulative);

            try {
                $this->parsed_ast = $parser->parse($this->preparsed_code);
            } catch (\PHPParser_Error $error) {
                $this->validation_error("Could not parse sandboxed code!", Error::PARSER_ERROR, null, $this->preparsed_code, $error);
            }

            $prettyPrinter = new \PHPParser_PrettyPrinter_Default;

            if(($this->allow_functions && $this->auto_whitelist_functions) ||
                ($this->allow_constants && $this->auto_whitelist_constants) ||
                ($this->allow_classes && $this->auto_whitelist_classes) ||
                ($this->allow_interfaces && $this->auto_whitelist_interfaces) ||
                ($this->allow_traits && $this->auto_whitelist_traits) ||
                ($this->allow_globals && $this->auto_whitelist_globals)){

                $traverser = new \PHPParser_NodeTraverser;
                $whitelister = new SandboxWhitelistVisitor($this);
                $traverser->addVisitor($whitelister);
                $traverser->traverse($this->parsed_ast);
            }

            $traverser = new \PHPParser_NodeTraverser;

            $validator = new ValidatorVisitor($this);

            $traverser->addVisitor($validator);

            $this->prepared_ast = $traverser->traverse($this->parsed_ast);

            $this->prepared_code = $prettyPrinter->prettyPrint($this->prepared_ast);

            return $this;
        }
        /** Prepare passed callable for execution
         *
         * This function validates your code and automatically whitelists it according to your specified configuration
         *
         * @example $sandbox->prepare(function(){ var_dump('Hello world!'); });
         *
         * @param   callable    $code               The callable to prepare for execution
         * @param   boolean     $skip_validation    Boolean flag to indicate whether the sandbox should skip validation. Default is false.
         *
         * @throws  Error       Throws exception if error occurs in parsing, validation or whitelisting
         *
         * @return  string      The generated code (this can also be accessed via $sandbox->generated_code)
         */
        public function prepare($code, $skip_validation = false){
            $this->prepare_time = microtime(true);

            if($this->allow_constants && !$this->is_defined_func('define') && ($this->has_whitelist_funcs() || !$this->has_blacklist_funcs())){
                $this->whitelist_func('define');    //makes no sense to allow constants if you can't define them!
            }

            if(!$skip_validation){
                $this->validate($code);
            }

            static::$sandboxes[$this->name] = $this;

            $this->generated_code = $this->prepare_namespaces() .
                $this->prepare_aliases() .
                $this->prepare_consts() .
                "\r\n" . '$closure = function(){' . "\r\n" .
                $this->prepare_vars() .
                $this->prepended_code .
                ($skip_validation ? $code : $this->prepared_code) .
                $this->appended_code .
                "\r\n" . '};' .
                "\r\n" . 'if(method_exists($closure, "bindTo")){ $closure = $closure->bindTo(null); }' .
                "\r\n" . 'return $closure();';

            usleep(1); //guarantee at least some time passes
            $this->prepare_time = (microtime(true) - $this->prepare_time);
            return $this->generated_code;
        }
        /** Prepare and execute callable and return output
         *
         * This function validates your code and automatically whitelists it according to your specified configuration, then executes it.
         *
         * @example $sandbox->execute(function(){ var_dump('Hello world!'); });
         *
         * @param   callable|string     $callable           Callable or string of PHP code to prepare and execute within the sandbox
         * @param   boolean             $skip_validation    Boolean flag to indicate whether the sandbox should skip validation of the pass callable. Default is false.
         *
         * @throws  Error       Throws exception if error occurs in parsing, validation or whitelisting or if generated closure is invalid
         *
         * @return  mixed       The output from the executed sandboxed code
         */
        public function execute($callable = null, $skip_validation = false){
            if($callable !== null){
                $this->prepare($callable, $skip_validation);
            }
            $saved_error_level = null;
            if($this->error_level !== null){
                $saved_error_level = error_reporting();
                error_reporting(intval($this->error_level));
            }
            if(is_callable($this->error_handler) || $this->convert_errors){
                set_error_handler(array($this, 'error'), $this->error_handler_types);
            }
            $this->execution_time = microtime(true);
            $exception = null;
            $result = null;
            try {
                if($this->capture_output){
                    ob_start();
                    eval($this->generated_code);
                    $result = ob_get_clean();
                } else {
                    $result = eval($this->generated_code);
                }
            } catch(\Exception $exception){
                //swallow any exceptions
            }
            if(is_callable($this->error_handler) || $this->convert_errors){
                restore_error_handler();
            }
            usleep(1); //guarantee at least some time passes
            $this->execution_time = (microtime(true) - $this->execution_time);
            if($this->error_level !== null && $this->restore_error_level){
                error_reporting($saved_error_level);
            }
            return $exception instanceof \Exception ? $this->exception($exception) : $result;
        }
        /** Set callable to handle errors
         *
         * This function sets the sandbox error handler and the handled error types. The handler accepts the error number,
         * the error message, the error file, the error line, the error context and the sandbox instance as arguments.
         * If the error handler does not handle errors correctly then the sandbox's security may become compromised!
         *
         * @example $sandbox->set_error_handler(function($errno, $errstr, $errfile, $errline, $errcontext, PHPSandbox $s){
         *  return false;
         * }, E_ALL);  //ignore all errors, INSECURE
         *
         * @param   callable        $handler       Callable to handle thrown Errors
         * @param   int             $error_types   Integer flag of the error types to handle (default is E_ALL)
         *
         * @return  PHPSandbox      Returns the PHPSandbox instance for chainability
         */
        public function set_error_handler($handler, $error_types = E_ALL){
            $this->error_handler = $handler;
            $this->error_handler_types = $error_types;
            return $this;
        }
        /** Get error handler
         *
         * This function returns the sandbox error handler.
         *
         * @example $sandbox->get_error_handler();  //callable
         *
         * @return null|callable
         */
        public function get_error_handler(){
            return $this->error_handler;
        }
        /** Unset error handler
         *
         * This function unsets the sandbox error handler.
         *
         * @example $sandbox->unset_error_handler();
         *
         * @return  PHPSandbox      Returns the PHPSandbox instance for chainability
         */
        public function unset_error_handler(){
            $this->error_handler = null;
            return $this;
        }
        /** Gets the last sandbox error
         * @return array
         */
        public function get_last_error(){
            return $this->last_error;
        }
        /** Invoke sandbox error handler
         *
         * @example $sandbox->error(0, "Unknown error");
         *
         * @param   int                         $errno          Error number
         * @param   string                      $errstr         Error message
         * @param   string                      $errfile        Error file
         * @param   int                         $errline        Error line number
         * @param   array                       $errcontext     Error context array
         * @return  mixed
         */
        public function error($errno, $errstr, $errfile, $errline, $errcontext){
            $this->last_error = error_get_last();
            if($this->convert_errors){
                return $this->exception(new \ErrorException($errstr, 0, $errno, $errfile, $errline));
            }
            return is_callable($this->error_handler) ? call_user_func_array($this->error_handler, array($errno, $errstr, $errfile, $errline, $errcontext, $this)) : null;
        }
        /** Set callable to handle thrown exceptions
         *
         * This function sets the sandbox exception handler. The handler accepts the thrown exception and the sandbox instance
         * as arguments. If the exception handler does not handle exceptions correctly then the sandbox's security may
         * become compromised!
         *
         * @example $sandbox->set_exception_handler(function(Exception $e, PHPSandbox $s){});  //ignore all thrown exceptions, INSECURE
         *
         * @param   callable        $handler       Callable to handle thrown exceptions
         *
         * @return  PHPSandbox      Returns the PHPSandbox instance for chainability
         */
        public function set_exception_handler($handler){
            $this->exception_handler = $handler;
            return $this;
        }
        /** Get exception handler
         *
         * This function returns the sandbox exception handler.
         *
         * @example $sandbox->get_exception_handler();  //callable
         *
         * @return null|callable
         */
        public function get_exception_handler(){
            return $this->exception_handler;
        }
        /** Unset exception handler
         *
         * This function unsets the sandbox exception handler.
         *
         * @example $sandbox->unset_exception_handler();
         *
         * @return  PHPSandbox      Returns the PHPSandbox instance for chainability
         */
        public function unset_exception_handler(){
            $this->exception_handler = null;
            return $this;
        }
        /** Gets the last exception thrown by the sandbox
         * @return \Exception|Error
         */
        public function get_last_exception(){
            return $this->last_exception;
        }
        /** Invoke sandbox exception handler
         *
         * @example $sandbox->exception(new Exception("Unknown error!", 0));
         *
         * @param   \Exception                  $exception      Error number
         * @throws  \Exception
         *
         * @return  mixed
         */
        public function exception(\Exception $exception){
            $this->last_exception = $exception;
            if(is_callable($this->exception_handler)){
                return call_user_func_array($this->exception_handler, array($exception, $this));
            }
            throw $exception;
        }
        /** Set callable to handle thrown validation Errors
         *
         * This function sets the sandbox validation Error handler. The handler accepts the thrown Error and the sandbox
         * instance as arguments. If the error handler does not handle validation errors correctly then the sandbox's
         * security may become compromised!
         *
         * @example $sandbox->set_validation_error_handler(function(Error $e, PHPSandbox $s){});  //ignore all thrown Errors, INSECURE
         *
         * @param   callable        $handler       Callable to handle thrown validation Errors
         *
         * @return  PHPSandbox      Returns the PHPSandbox instance for chainability
         */
        public function set_validation_error_handler($handler){
            $this->validation_error_handler = $handler;
            return $this;
        }
        /** Get validation error handler
         *
         * This function returns the sandbox validation error handler.
         *
         * @example $sandbox->get_validation_error_handler();  //callable
         *
         * @return null|callable
         */
        public function get_validation_error_handler(){
            return $this->validation_error_handler;
        }
        /** Unset validation error handler
         *
         * This function unsets the sandbox validation error handler.
         *
         * @example $sandbox->unset_validation_error_handler();
         *
         * @return  PHPSandbox      Returns the PHPSandbox instance for chainability
         */
        public function unset_validation_error_handler(){
            $this->validation_error_handler = null;
            return $this;
        }

        /** Gets the last validation error thrown by the sandbox
         * @return \Exception|Error
         */
        public function get_last_validation_error(){
            return $this->last_validation_error;
        }
        /** Invoke sandbox error validation handler if it exists, throw Error otherwise
         *
         * @example $sandbox->validation_error("Error!", 10000);
         *
         * @param   \Exception|Error|string     $error      Error to throw if Error is not handled, or error message string
         * @param   int                         $code       The error code
         * @param   \PHPParser_Node|null        $node       The error parser node
         * @param   mixed                       $data       The error data
         * @param   \Exception|Error|null       $previous   The previous Error thrown
         *
         * @throws  \Exception|Error
         * @return  mixed
         */
        public function validation_error($error, $code = 0, \PHPParser_Node $node = null, $data = null, \Exception $previous = null){
            $error = ($error instanceof \Exception)
                ? (($error instanceof Error)
                    ? new Error($error->getMessage(), $error->getCode(), $error->getNode(), $error->getData(), $error->getPrevious() ?: $this->last_validation_error)
                    : new Error($error->getMessage(), $error->getCode(), null, null, $error->getPrevious() ?: $this->last_validation_error))
                : new Error($error, $code, $node, $data, $previous ?: $this->last_validation_error);
            $this->last_validation_error = $error;
            if($this->validation_error_handler && is_callable($this->validation_error_handler)){
                $result = call_user_func_array($this->validation_error_handler, array($error, $this));
                if($result instanceof \Exception){
                    throw $result;
                }
                return $result;
            } else {
                throw $error;
            }
        }
        /** Get a named PHPSandbox instance (used to retrieve the sandbox instance from within sandboxed code)
         * @param $name
         * @return null|PHPSandbox
         */
        public static function getSandbox($name){
            return isset(static::$sandboxes[$name]) ? static::$sandboxes[$name] : null;
        }
        /** Get an iterator of all the public PHPSandbox properties
         * @return array
         */
        public function getIterator(){
            return new \ArrayIterator(get_object_vars($this));
        }
    }