<?php

$cartodb_username = "**";
$api_key = "**";

$point_array = $_POST['point'];
$pointNotes_array = $_POST['point_notes'];
$polygon_array = $_POST['polygon'];
$polygonNotes_array = $_POST['polygon_notes'];
$lineString_array = $_POST['linestring'];
$lineStringNotes_array = $_POST['linestring_notes'];

$point_values = '';
$polygon_values = '';
$lineString_values = '';

function cURL($cartodb_username, $cartoDBsql, $api_key){
    // Initializing curl
    $ch = curl_init( "https://".$cartodb_username.".cartodb.com/api/v2/sql" );
    $query = http_build_query(array('q'=>$cartoDBsql,'api_key'=>$api_key));
    // Configuring curl options
    curl_setopt($ch, CURLOPT_POST, TRUE);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $query);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    $result_not_parsed = curl_exec($ch);
    //----------------
};


foreach($point_array as $key => $value){
    $value = substr($value, 45, -1);
    $value = str_replace("'", "", $value);
    $GeoJSON = "(ST_SetSRID(ST_GeomFromGeoJSON('$value'), 4326))";
    
    $notes = str_replace("'", "", $pointNotes_array[$key]);
    
    if($key == (count($point_array) - 1)){
        $point_values .= "($GeoJSON, '$notes')";
        $cartoDBsql = "INSERT INTO carto_doodle_point (the_geom, notes) VALUES $point_values";
        cURL($cartodb_username, $cartoDBsql, $api_key);
    }
    else{
        $point_values .= "($GeoJSON, '$notes'),";
    };
};


foreach($polygon_array as $key => $value){
    $value = substr($value, 45, -1);
    $value = str_replace("'", "", $value);
    $GeoJSON = "(ST_SetSRID(ST_GeomFromGeoJSON('$value'), 4326))";
    
    $notes = str_replace("'", "", $polygonNotes_array[$key]);
    
    if($key == (count($polygon_array) - 1)){
        $polygon_values .= "($GeoJSON, '$notes')";
        $cartoDBsql = "INSERT INTO carto_doodle_polygon (the_geom, notes) VALUES $polygon_values";
        cURL($cartodb_username, $cartoDBsql, $api_key);
    }
    else{
        $polygon_values .= "($GeoJSON, '$notes'),";
    };
};


foreach($lineString_array as $key => $value){
    $value = substr($value, 45, -1);
    $value = str_replace("'", "", $value);
    $GeoJSON = "(ST_SetSRID(ST_GeomFromGeoJSON('$value'), 4326))";
    
    $notes = str_replace("'", "", $lineStringNotes_array[$key]);
    
    if($key == (count($lineString_array) - 1)){
        $lineString_values .= "($GeoJSON, '$notes')";
        $cartoDBsql = "INSERT INTO carto_doodle_line (the_geom, notes) VALUES $lineString_values";
        cURL($cartodb_username, $cartoDBsql, $api_key);
    }
    else{
        $lineString_values .= "($GeoJSON, '$notes'),";
    };
};


echo "<a href='/carto_doodle/index.html'>Return to drawing tool</a></br><a href='/carto_doodle/admin.html'>Proceed to admin tool</a>";
die();

?>