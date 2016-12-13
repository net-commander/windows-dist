<?php
xapp_import('xapp.Store.Store');
xapp_import('xapp.lib.standalone.StoreDelegate');

class XApp_Tracking_Store extends XApp_Store
{

//
    //  Available Options, keyed as constants
    //
    ///////////////////////////////////////////////////////////////////////////
    const STORE_CLASS = "XAPP_USER_STORE_CLASS";
    const STORE_CONF = "XAPP_USER_STORE_CONF";
    const STORE_DATA = "XAPP_USER_STORE_DATA";
    /**
     * options dictionary for this class containing all data type values
     *
     * @var array
     */
    public static $optionsDict = array
    (
        self::STORE_CLASS => XAPP_TYPE_STRING,
        self::STORE_CONF => XAPP_TYPE_ARRAY,
        self::STORE_DATA => XAPP_TYPE_OBJECT
    );

    /**
     * options mandatory map for this class contains all mandatory values
     *
     * @var array
     */
    public static $optionsRule = array
    (
        self::STORE_CLASS => 0,
        self::STORE_CONF => 0,
        self::STORE_DATA => 0,
    );
    /**
     * options default value array containing all class option default values
     *
     * @var array
     */
    public $options = array
    (
        self::STORE_CLASS => 'XApp_Store_JSON',
        self::STORE_CONF => null,
        self::STORE_DATA => null,
    );

    public function init()
    {
        if ($this->initStore()) {
        }
    }

    /***
     * Parse options and init the store
     * @param bool $force does force to re-create the store
     * @return bool
     */
    public function initStore($force = false)
    {

        //skip
        if ($force === false && $this->_store) {
            return true;
        }

        //Try with store data first
        if (xo_has(self::STORE_DATA) && is_object(xo_get(self::STORE_DATA))) {
            //$this->initWithData(xo_get(self::STORE_DATA));
            return true;
        }

        //No store data provided from outside, use the store class

        if (xo_has(self::STORE_CLASS)) {
            $_storeClz = xo_get(self::STORE_CLASS);

            //check its an instance already :
            if (is_object($_storeClz)) {
                $this->_store = $_storeClz;
                return true;
            } //its a class name
            elseif (is_string($_storeClz) && class_exists($_storeClz)) {
                $_ctrArgs = xo_has(self::STORE_CONF) ? xo_get(self::STORE_CONF) : array();
                $this->_store = new $_storeClz($_ctrArgs);
                return true;
            }
        }

        return false;
    }
}