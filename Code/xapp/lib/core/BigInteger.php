<?php
/**
 * @version 0.1.0
 * @package Math
 *
 * @author https://github.com/mc007
 * @license : GPL v2. http://www.gnu.org/licenses/gpl-2.0.html
 */

function _Make64 ( $hi, $lo )
{

    // on x64, we can just use int
        if ( ((int)4294967296)!=0 )
            return (((int)$hi)<<32) + ((int)$lo);

        // workaround signed/unsigned braindamage on x32
        $hi = sprintf ( "%u", $hi );
        $lo = sprintf ( "%u", $lo );

        // use GMP or bcmath if possible
        if ( function_exists("gmp_mul") )
            return gmp_strval ( gmp_add ( gmp_mul (  $hi, "4294967296" ), $lo ) );

        if ( function_exists("bcmul") )
            return bcadd ( bcmul ( $hi, "4294967296" ), $lo );

        // compute everything manually
        $a = substr ( $hi, 0, -5 );
        $b = substr ( $hi, -5 );
        $ac = $a*42949; // hope that float precision is enough
        $bd = $b*67296;
        $adbc = $a*67296+$b*42949;
        $r4 = substr ( $bd, -5 ) +  + substr ( $lo, -5 );
        $r3 = substr ( $bd, 0, -5 ) + substr ( $adbc, -5 ) + substr ( $lo, 0, -5 );
        $r2 = substr ( $adbc, 0, -5 ) + substr ( $ac, -5 );
        $r1 = substr ( $ac, 0, -5 );
        while ( $r4>100000 ) { $r4-=100000; $r3++; }
        while ( $r3>100000 ) { $r3-=100000; $r2++; }
        while ( $r2>100000 ) { $r2-=100000; $r1++; }

        $r = sprintf ( "%d%05d%05d%05d", $r1, $r2, $r3, $r4 );
        $l = strlen($r);
        $i = 0;
        while ( $r[$i]=="0" && $i<$l-1 )
            $i++;
        return substr ( $r, $i );
    }

    list(,$a) = unpack ( "N", "\xff\xff\xff\xff" );
    list(,$b) = unpack ( "N", "\xff\xff\xff\xff" );
    $q = _Make64($a,$b);
    var_dump($q);