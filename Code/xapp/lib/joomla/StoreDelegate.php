<?php
/**
 * @version 0.1.0
 *
 * @author https://github.com/mc007
 * @license : GPL v2. http://www.gnu.org/licenses/gpl-2.0.html
 */
class XApp_Joomla_Store_Delegate extends XApp_Store_Base implements Xapp_Store_Interface
{

    /**
     * class constructor
     * call parent constructor for class initialization
     *
     * @error 14601
     * @param null|array|object $options expects optional options
     */
    public function __construct($options = null)
    {
        xapp_set_options($options, $this);
    }

    public function read(){
        $params = JComponentHelper::getParams(xapp_get_option(self::IDENTIFIER));
        $data = $params->get('settings');
        if($data==null){
            $params->set('settings','{}');

            // Get a new database query instance
            $db = JFactory::getDBO();
            $query = $db->getQuery(true);



            // Build the query
            $query->update('#__extensions AS a');
            $query->set('a.params = ' . $db->quote((string)$params));
            $query->where('a.element = "'.xapp_get_option(self::IDENTIFIER) . '"');

// Execute the query
            $db->setQuery($query);
            $db->query();
            $data = new stdClass();
        }else{
            $data = json_decode($data);
        }
        return $data;
    }

    public  function write($data){
        $params = JComponentHelper::getParams(xapp_get_option(self::IDENTIFIER));


        $params->set('settings',$data);

        // Get a new database query instance
        $db = JFactory::getDBO();
        $query = $db->getQuery(true);

// Build the query
        $query->update('#__extensions AS a');
        $query->set('a.params = ' . $db->quote((string)$params));
        $query->where('a.element = "'.xapp_get_option(self::IDENTIFIER) . '"');

// Execute the query
        $db->setQuery($query);
        $db->query();
    }

}