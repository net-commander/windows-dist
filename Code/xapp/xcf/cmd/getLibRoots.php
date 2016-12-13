<?php
$_REQUEST_URI = $_SERVER["PHP_SELF"]."?".$_SERVER["QUERY_STRING"];
putenv("REQUEST_URI=$_REQUEST_URI");
$_SERVER["REQUEST_URI"] = $_REQUEST_URI;
$_ENV["REQUEST_URI"] = $_REQUEST_URI;

$lib = $_GET['libId'];
$result = '';
if($lib==='dojo'){
    echo '[{"libRoot":{"root":"lib/dojo"}}]';
}
if($lib==='maqetta'){
    echo '[{"libRoot":{"root":"lib/maqetta"}}]';
}
if($lib==='xide'){
	echo '[{"libRoot":{"root":"lib/xide"}}]';
}