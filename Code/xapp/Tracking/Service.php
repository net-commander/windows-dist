<?php
/**
 * @version 0.1.0
 *
 * @author https://github.com/mc007
 * @license : GPL v2. http://www.gnu.org/licenses/gpl-2.0.html
 * @package XApp\Resource
 */

xapp_import('xapp.Service.Service');

class XApp_Tracking_Service extends XApp_Service
{

    public function get($section, $path, $query = null)
    {
        return $this->getObject()->get($section, $path, $query);
    }

    public function set($section, $path = '.', $query = null, $value = null, $decodeValue = true)
    {
        return $this->getObject()->set($section, $path = '.', $query, $value, $decodeValue);
    }
}