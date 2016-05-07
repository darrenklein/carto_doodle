<?php

$cartodb_username = "***";
$api_key = "***";

$geoObject_array = $_POST['geoObject'];
$cartodbID_array = $_POST['cartodbID'];
$notes_array = $_POST['notes'];
$type_array = $_POST['type'];

//FIRST, WE HANDLE EDITED OBJECTS
foreach($geoObject_array as $key => $value){
    
    //THE ORIGINAL GEOJSON STRING HAS A FIXED NUMBER OF EXTRA LEADING/TRAILING CHARACTERS
    $value = substr($value, 29, -1);
    $value = "'" . $value . "'";
    
    $cartodbID = $cartodbID_array[$key];
    
    $notes = "'" . $notes_array[$key] . "'";
    
    $type = strtolower($type_array[$key]);
        
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
    
    
    $cartoDBsql = "UPDATE carto_doodle_$destination SET the_geom = $GeoJSON, notes = $notes WHERE cartodb_id = $cartodbID";
    

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




$deletedID_array = $_POST['deletedID'];
$deletedType_array = $_POST['deletedType'];

//THEN WE HANDLE DELETED OBJECTS
foreach($deletedID_array as $key => $value){
    
    $cartodbID = $value;
    $type = strtolower($deletedType_array[$key]);

    if($type == 'polygon'){
        $destination = "$type";
    }
    elseif($type == 'point'){
        $destination = "$type";
    }
    else{
        $destination = "line";
    };
    
    $cartoDBsql = "DELETE FROM carto_doodle_$destination WHERE cartodb_id = $cartodbID";
    
   
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

?>