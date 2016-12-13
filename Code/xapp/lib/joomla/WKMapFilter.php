<?php
/**
 * @version 0.1.0
 *
 * @author https://github.com/mc007
 * @license : GPL v2. http://www.gnu.org/licenses/gpl-2.0.html
 */
function xappJFilterWKMaps($string){

    require_once(JPATH_ADMINISTRATOR.'/components/com_widgetkit/widgetkit.php');
    require_once(JPATH_ADMINISTRATOR.'/components/com_widgetkit/helpers/widget.php');
    preg_match_all('#\[widgetkit id=(\d+)\]#', $string, $matches);
    $db = JFactory::getDBO();

    foreach ($matches[1] as $i => $widget_id) {
        $db->setQuery('SELECT * FROM #__widgetkit_widget WHERE id='.$widget_id);
        // get widget
        $widget = $db->loadObject();
        $wKitWidget = is_object($widget) ? new WidgetkitWidget($widget_id, $widget->type, $widget->style, $widget->name, $widget->content, $widget->created, $widget->modified) : null;
        if($wKitWidget){
            if($wKitWidget->type==='map'){

                $items = $wKitWidget->__get('items');
                if($items){
                    $first_value = reset($items);
                    if($first_value){
                        $mapUrl = 'tt://map/' .$first_value['lat'] .'|'. $first_value['lng'];
                        $onClickUrl = "ctx.getUrlHandler().openUrl(" . $mapUrl . ",null)";
                        $linkInnerHTML = "Map";
                        $newNode = "<span onClick=" .$onClickUrl. "  class=" . 'articleLink' . ">" .$linkInnerHTML. "</span>";
                        $string = str_replace($matches[0][$i], $newNode, $string);
                    }
                }
            }
        }
    }
    return $string;
}
?>