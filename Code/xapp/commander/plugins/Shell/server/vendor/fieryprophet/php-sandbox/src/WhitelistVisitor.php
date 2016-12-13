<?php
    /** WhitelistVisitor class declaration
     * @package PHPSandbox
     */
    namespace PHPSandbox;

    /**
     * Whitelister class for PHP Sandboxes.
     *
     * This class takes parsed AST code and checks it against the passed PHPSandbox instance configuration to
     * autmatically whitelist trusted code functions, classes, etc. if the appropriate settings are configured.
     *
     * @namespace PHPSandbox
     *
     * @author  Elijah Horton <fieryprophet@yahoo.com>
     * @version 1.3.11
     */
    class WhitelistVisitor extends \PHPParser_NodeVisitorAbstract {
        /** The PHPSandbox instance to check against
         * @var PHPSandbox
         */
        protected $sandbox;
        /** WhitelistVisitor class constructor
         *
         * This constructor takes a passed PHPSandbox instance to check against for whitelisting trusted code.
         *
         * @param   PHPSandbox   $sandbox            The PHPSandbox instance to check against
         */
        public function __construct(PHPSandbox $sandbox){
            $this->sandbox = $sandbox;
        }
        /** Examine the current PHPParser_Node node against the PHPSandbox configuration for whitelisting trusted code
         *
         * @param   \PHPParser_Node   $node          The trusted $node to examine
         *
         * @return  null|bool         Return false if node must be removed, or null if no changes to the node are made
         */
        public function leaveNode(\PHPParser_Node $node){
            if($node instanceof \PHPParser_Node_Expr_FuncCall && $node->name instanceof \PHPParser_Node_Name && !$this->sandbox->has_blacklist_funcs()){
                $this->sandbox->whitelist_func($node->name->toString());
            } else if($node instanceof \PHPParser_Node_Stmt_Function && is_string($node->name) && $node->name && !$this->sandbox->has_blacklist_funcs()){
                $this->sandbox->whitelist_func($node->name);
            } else if(($node instanceof \PHPParser_Node_Expr_Variable || $node instanceof \PHPParser_Node_Stmt_StaticVar) && is_string($node->name) && $this->sandbox->has_whitelist_vars() && !$this->sandbox->allow_variables){
                $this->sandbox->whitelist_var($node->name);
            } else if($node instanceof \PHPParser_Node_Expr_FuncCall && $node->name instanceof \PHPParser_Node_Name && $node->name->toString() == 'define' && !$this->sandbox->is_defined_func('define') && !$this->sandbox->has_blacklist_consts()){
                $name = isset($node->args[0]) ? $node->args[0] : null;
                if($name && $name instanceof \PHPParser_Node_Arg && $name->value instanceof \PHPParser_Node_Scalar_String && is_string($name->value->value) && $name->value->value){
                    $this->sandbox->whitelist_const($name->value->value);
                }
            } else if($node instanceof \PHPParser_Node_Expr_ConstFetch && $node->name instanceof \PHPParser_Node_Name && !$this->sandbox->has_blacklist_consts()){
                $this->sandbox->whitelist_const($node->name->toString());
            } else if($node instanceof \PHPParser_Node_Stmt_Class && is_string($node->name) && !$this->sandbox->has_blacklist_classes()){
                $this->sandbox->whitelist_class($node->name);
            } else if($node instanceof \PHPParser_Node_Stmt_Interface && is_string($node->name) && !$this->sandbox->has_blacklist_interfaces()){
                $this->sandbox->whitelist_interface($node->name);
            } else if($node instanceof \PHPParser_Node_Stmt_Trait && is_string($node->name) && !$this->sandbox->has_blacklist_traits()){
                $this->sandbox->whitelist_trait($node->name);
            } else if($node instanceof \PHPParser_Node_Expr_New && $node->class instanceof \PHPParser_Node_Name && !$this->sandbox->has_blacklist_types()){
                $this->sandbox->whitelist_type($node->class->toString());
            } else if($node instanceof \PHPParser_Node_Stmt_Global && $this->sandbox->has_whitelist_vars()){
                foreach($node->vars as $var){
                    /**
                     * @var \PHPParser_Node_Expr_Variable    $var
                     */
                    if($var instanceof \PHPParser_Node_Expr_Variable){
                        $this->sandbox->whitelist_var($var->name);
                    }
                }
            } else if($node instanceof \PHPParser_Node_Stmt_Namespace){
                if($node->name instanceof \PHPParser_Node_Name){
                    $name = $node->name->toString();
                    $this->sandbox->check_namespace($name);
                    if(!$this->sandbox->is_defined_namespace($name)){
                        $this->sandbox->define_namespace($name);
                    }
                }
                return false;
            } else if($node instanceof \PHPParser_Node_Stmt_Use){
                foreach($node->uses as $use){
                    /**
                     * @var \PHPParser_Node_Stmt_UseUse    $use
                     */
                    if($use instanceof \PHPParser_Node_Stmt_UseUse && $use->name instanceof \PHPParser_Node_Name && (is_string($use->alias) || is_null($use->alias))){
                        $name = $use->name->toString();
                        $this->sandbox->check_alias($name);
                        if(!$this->sandbox->is_defined_alias($name)){
                            $this->sandbox->define_alias($name, $use->alias);
                        }
                    }
                }
                return false;
            }
            return null;
        }
    }