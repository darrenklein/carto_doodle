<?php

$cartodb_username = "***";
$api_key = "***";

$editedPoint_array = $_POST['editedPoint'];
$editedPointNotes_array = $_POST['editedPointNotes'];
$editedPointID_array = $_POST['editedPointID'];

$editedPolygon_array = $_POST['editedPolygon'];
$editedPolygonNotes_array = $_POST['editedPolygonNotes'];
$editedPolygonID_array = $_POST['editedPolygonID'];

$editedLineString_array = $POST['editedLineString'];
$editedLineStringNotes_array = $_POST['editedLineStringNotes'];
$editedLineStringID_array = $_POST['editedLineStringID'];

$editedPoint_values = '';
$editedPolygon_values = '';
$editedLineString_values = '';

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

foreach($editedPoint_array as $key => $value){
    $value = substr($value, 29, -1);
    $value = str_replace("'", "", $value);
    $GeoJSON = "(ST_SetSRID(ST_GeomFromGeoJSON('$value'), 4326))";
    
    $notes = str_replace("'", "", $editedPointNotes_array[$key]);
    $cartodbID = $editedPointID_array[$key];
    
    if($key == (count($editedPoint_array) - 1)){
        $editedPoint_values .= "()";
        $cartoDBsql = "UPDATE carto_doodle_point AS t SET the_geom = c.the_geom FROM (values ($GeoJSON, $cartodbID)) AS c(the_geom, cartodb_id) WHERE c.cartodb_id = t.cartodb_id";
        cURL($cartodb_username, $cartoDBsql, $api_key);
        
        echo $cartoDBsql;
    }
    else{
        $point_values .= "(),";
    };
};


/*
$geoObject_array = $_POST['geoObject'];
$cartodbID_array = $_POST['cartodbID'];
$notes_array = $_POST['notes'];
$type_array = $_POST['type'];

//FIRST, WE HANDLE EDITED OBJECTS
foreach($geoObject_array as $key => $value){
    
    //THE ORIGINAL GEOJSON STRING HAS A FIXED NUMBER OF EXTRA LEADING/TRAILING CHARACTERS
    $value = substr($value, 29, -1);
    $value = "'" . str_replace("'", "", $value) . "'";
    
    $cartodbID = str_replace("'", "", $cartodbID_array[$key]);
    
    $notes = "'" . str_replace("'", "", $notes_array[$key]) . "'";
    
    $type = str_replace("'", "", strtolower($type_array[$key]));
        
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

echo "<a href='/carto_doodle/index.html'>Return to drawing tool</a></br><a href='/carto_doodle/admin.html'>Return to admin tool</a>";
die();
*/
?>