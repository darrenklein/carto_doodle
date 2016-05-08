<?php

$cartodb_username = "**";
$api_key = "**";

$geoObject_array = $_POST['geoObject'];
$type_array = $_POST['type'];
$notes_array = $_POST['notes'];

foreach($geoObject_array as $key => $value){
    
    //THE ORIGINAL GEOJSON STRING HAS A FIXED NUMBER OF EXTRA LEADING/TRAILING CHARACTERS
    $value = substr($value, 45, -1);
    $value = "'" . $value . "'";
    
    $type = strtolower($type_array[$key]);
    
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

echo "<a href='/carto_doodle/index.html'>Return to drawing tool</a></br><a href='/carto_doodle/admin.html'>Proceed to admin tool</a>";
die();

?>