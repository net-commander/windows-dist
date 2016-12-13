<?php
/**
 * @version 0.1.0
 *
 * @author https://github.com/mc007
 * @license : GPL v2. http://www.gnu.org/licenses/gpl-2.0.html
 * @package XApp-Commander\Plugin\XLESS
 */
if(!class_exists('lessc')){
    require dirname(__FILE__).'/lessphp/lessc.inc.php';
}

/**
 * LESS compiler
 * @extends lessc
 */
class XApp_Less_Compiler extends lessc
{
	/**
	 * Instantiate a compiler
	 *
   * @api
	 * @see	lessc::__construct
	 * @param $file	string [optional]	Additional file to parse
	 */
	public function __construct($file = null)
	{
  	    parent::__construct($file);
	}

  /**
   * Registers a set of functions
   *
   * @param array $functions
   */
  public function registerFunctions(array $functions = array())
  {
    foreach ($functions as $name => $args)
    {
      $this->registerFunction($name, $args['callback']);
    }
  }

	/**
	 * Returns available variables
	 *
	 * @since 1.5
	 * @return array Already defined variables
	 */
	public function getVariables()
	{
		return $this->registeredVars;
	}

	public function setVariable($name, $value)
	{
		$this->registeredVars[ $name ] = $value;
	}

	public function getImportDir()
	{
		return (array)$this->importDir;
	}
}
