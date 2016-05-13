<?php

$cartodb_username = "***";
$api_key = "***";

$point_array = $_POST['point'];
$pointNotes_array = $_POST['point_notes'];
$polygon_array = $_POST['polygon'];
$polygonNotes_array = $_POST['polygon_notes'];
$lineString_array = $_POST['linestring'];
$lineStringNotes_array = $_POST['linestring_notes'];

$point_values = '';

foreach($point_array as $key => $value){
    $value = substr($value, 45, -1);
    $value = str_replace("'", "", $value);
    $GeoJSON = "(ST_SetSRID(ST_GeomFromGeoJSON('$value'), 4326))";
    
    $notes = str_replace("'", "", $pointNotes_array[$key]);
    
    if($key == (count($point_array) - 1)){
        $point_values .= "($GeoJSON, '$notes')";
        
        $cartoDBsql = "INSERT INTO carto_doodle_point (the_geom, notes) VALUES $point_values";

        // Initializing curl
        $ch = curl_init( "https://".$cartodb_username.".cartodb.com/api/v2/sql" );
        $query = http_build_query(array('q'=>$cartoDBsql,'api_key'=>$api_key));
        // Configuring curl options
        curl_setopt($ch, CURLOPT_POST, TRUE);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $query);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        $result_not_parsed = curl_exec($ch);
        //----------------
    }
    else{
        $point_values .= "($GeoJSON, '$notes'),";
    };
};



/*
$geoObject_array = $_POST['geoObject'];
$type_array = $_POST['type'];
$notes_array = $_POST['notes'];

foreach($geoObject_array as $key => $value){
    
    //THE ORIGINAL GEOJSON STRING HAS A FIXED NUMBER OF EXTRA LEADING/TRAILING CHARACTERS
    $value = substr($value, 45, -1);
    $value = "'" . str_replace("'", "", $value) . "'";
    
    $type = str_replace("'", "", strtolower($type_array[$key]));
    
    $notes = "'" . str_replace("'", "", $notes_array[$key]) . "'";
        
    $destination;
    
    
    if($type == 'polygon'){
        $GeoJSON = "(ST_SetSRID(ST_GeomFromGeoJSON($value), 4326))";
        $destination = "$type";
    }
    elseif($type == 'point'){
        $GeoJSON = "(ST_SetSRID(ST_GeomFromGeoJSON($value), 4326))";
        $destination = "$type";
    }
    else{
        $GeoJSON = "(ST_SetSRID(ST_GeomFromGeoJSON($value), 4326))";
        $destination = "line";
    };
    
        
    $cartoDBsql = "INSERT INTO carto_doodle_$destination (the_geom, notes) VALUES ($GeoJSON, $notes)";
    
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
*/

/*
echo "<a href='/carto_doodle/index.html'>Return to drawing tool</a></br><a href='/carto_doodle/admin.html'>Proceed to admin tool</a>";
die();
*/

?>