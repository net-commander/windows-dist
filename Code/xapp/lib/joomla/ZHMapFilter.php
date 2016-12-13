<?php
/**
 * @version 0.1.0
 *
 * @author https://github.com/mc007
 * @license : GPL v2. http://www.gnu.org/licenses/gpl-2.0.html
 */
function xappJFilterZHMaps($string){
    $regexMap		= '/({zhgooglemap:\s*)(.*?)(})/is';
    $matchesMap 		= array();
    $count_matches_Map	= preg_match_all($regexMap, $string, $matchesMap, PREG_PATTERN_ORDER | PREG_OFFSET_CAPTURE);

    $parameterDefaultLine = ';;;;;;;;;;;;;;;;;;;;';

    if (($count_matches_Map > 0)
        /* There is no need to load API
         || ($count_matches_Lght > 0)
        */
    )
    {
        // Begin loop for Map
        for($i = 0; $i < $count_matches_Map; $i++)
        {
            $cur_article_id ="";
            $pars = explode(";", $matchesMap[2][$i][0].$parameterDefaultLine);
            $basicID = $pars[0];
            $compoundID ='com_content_article_'.$basicID.'_'.'map';
            $map = xappZHGetMap($matchesMap[2][$i][0], $compoundID, "0", "0", "0", "0");
            if ($map!=null)
            {
                $mapUrl = 'tt://map/' .$map->latitude .'|'. $map->longitude;
                $onClickUrl = "ctx.getUrlHandler().openUrl(" . $mapUrl . ",null)";
                $linkInnerHTML = "Map";
                $newNode = "<span onClick=" .$onClickUrl. "  class=" . 'articleLink' . ">" .$linkInnerHTML. "</span>";
                $string = str_replace($matchesMap[$i][0][0],$newNode,$string);
            }
        }
    }

    return $string;
}
function xappZHGetMap($mapWithPars, $currentArticleId, $placemarkIdWithPars, $groupIdWithPars, $categoryIdWithPars, $placemarkListWithPars)
{
    $parameterDefaultLine = ';;;;;;;;;;;;;;;;;;;;';

    if (($mapWithPars == "0") &&
        ($placemarkIdWithPars == "0") &&
        ($placemarkListWithPars == "0") &&
        ($groupIdWithPars == "0") &&
        ($categoryIdWithPars == "0")
    )
    {
        return null;
    }

    $db = JFactory::getDBO();

    if ($mapWithPars != "0")
    {
        $pars = explode(";", $mapWithPars.$parameterDefaultLine);
        $mapId = $pars[0];
        $mapZoom = $pars[1];
        $mapMapType = $pars[2];
        $mapMapWidth = $pars[3];
        $mapMapHeight = $pars[4];

        if ($mapMapWidth != "")
        {
            $currentMapWidth = $mapMapWidth;
        }

        if ($mapMapHeight != "")
        {
            $currentMapHeight = $mapMapHeight;
        }

        if ((int)$mapId == 0)
        {
            return null;
        }
        else
        {

            $query = $db->getQuery(true);
            $query->select('h.*')
                ->from('#__zhgooglemaps_maps as h')
                ->where('h.id = '.(int) $mapId);

            $db->setQuery($query);
            $map = $db->loadObject();

            if($map!=null){
                return $map;
            }else{
                return null;
            }
        }

    }
    return null;
}

?>