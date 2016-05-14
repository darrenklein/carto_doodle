<?php

$cartodb_username = "***";
$api_key = "***";

$editedPoint_array = $_POST['editedPoint'];
$editedPointNotes_array = $_POST['editedPointNotes'];
$editedPointID_array = $_POST['editedPointID'];

$editedPolygon_array = $_POST['editedPolygon'];
$editedPolygonNotes_array = $_POST['editedPolygonNotes'];
$editedPolygonID_array = $_POST['editedPolygonID'];

$editedLineString_array = $_POST['editedLineString'];
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
        $editedPoint_values .= "($GeoJSON, '$notes', $cartodbID)";
        $cartoDBsql = "UPDATE carto_doodle_point AS t SET the_geom = c.the_geom, notes = c.notes FROM (values $editedPoint_values) AS c(the_geom, notes, cartodb_id) WHERE c.cartodb_id = t.cartodb_id";
        cURL($cartodb_username, $cartoDBsql, $api_key);
    }
    else{
        $editedPoint_values .= "($GeoJSON, '$notes', $cartodbID),";
    };
};

foreach($editedPolygon_array as $key => $value){
    $value = substr($value, 29, -1);
    $value = str_replace("'", "", $value);
    $GeoJSON = "(ST_SetSRID(ST_GeomFromGeoJSON('$value'), 4326))";
    
    $notes = str_replace("'", "", $editedPolygonNotes_array[$key]);
    $cartodbID = $editedPolygonID_array[$key];
    
    if($key == (count($editedPolygon_array) - 1)){
        $editedPolygon_values .= "($GeoJSON, '$notes', $cartodbID)";
        $cartoDBsql = "UPDATE carto_doodle_polygon AS t SET the_geom = c.the_geom, notes = c.notes FROM (values $editedPolygon_values) AS c(the_geom, notes, cartodb_id) WHERE c.cartodb_id = t.cartodb_id";
        cURL($cartodb_username, $cartoDBsql, $api_key);
    }
    else{
        $editedPolygon_values .= "($GeoJSON, '$notes', $cartodbID),";
    };
};

foreach($editedLineString_array as $key => $value){
    $value = substr($value, 29, -1);
    $value = str_replace("'", "", $value);
    $GeoJSON = "(ST_SetSRID(ST_GeomFromGeoJSON('$value'), 4326))";
    
    $notes = str_replace("'", "", $editedLineStringNotes_array[$key]);
    $cartodbID = $editedLineStringID_array[$key];
    
    if($key == (count($editedLineString_array) - 1)){
        $editedLineString_values .= "($GeoJSON, '$notes', $cartodbID)";
        $cartoDBsql = "UPDATE carto_doodle_line AS t SET the_geom = c.the_geom, notes = c.notes FROM (values $editedLineString_values) AS c(the_geom, notes, cartodb_id) WHERE c.cartodb_id = t.cartodb_id";
        cURL($cartodb_username, $cartoDBsql, $api_key);
    }
    else{
        $editedLineString_values .= "($GeoJSON, '$notes', $cartodbID),";
    };
};



$deletedPointID_array = $_POST['deletedPointID'];
$deletedPolygonID_array = $_POST['deletedPolygonID'];
$deletedLineStringID_array = $_POST['deletedLineStringID'];

$deletedPoint_values = '';
$deletedPolygon_values = '';
$deletedLineString_values = '';


foreach($deletedPointID_array as $key => $value){
    
    $cartodbID = $deletedPointID_array[$key];
    
    if($key == (count($deletedPointID_array) - 1)){
        $deletedPoint_values .= $cartodbID;
        $cartoDBsql = "DELETE FROM carto_doodle_point WHERE cartodb_id IN ($deletedPoint_values)";
        cURL($cartodb_username, $cartoDBsql, $api_key);
    }
    else{
        $deletedPoint_values .= "$cartodbID,";
    };
};

foreach($deletedPolygonID_array as $key => $value){
    
    $cartodbID = $deletedPolygonID_array[$key];
    
    if($key == (count($deletedPolygonID_array) - 1)){
        $deletedPolygon_values .= $cartodbID;
        $cartoDBsql = "DELETE FROM carto_doodle_polygon WHERE cartodb_id IN ($deletedPolygon_values)";
        cURL($cartodb_username, $cartoDBsql, $api_key);
    }
    else{
        $deletedPolygon_values .= "$cartodbID,";
    };
};

foreach($deletedLineStringID_array as $key => $value){
    
    $cartodbID = $deletedLineStringID_array[$key];
    
    if($key == (count($deletedLineStringID_array) - 1)){
        $deletedLineString_values .= $cartodbID;
        $cartoDBsql = "DELETE FROM carto_doodle_line WHERE cartodb_id IN ($deletedLineString_values)";
        cURL($cartodb_username, $cartoDBsql, $api_key);
    }
    else{
        $deletedLineString_values .= "$cartodbID,";
    };
};


echo "<a href='/carto_doodle/index.html'>Return to drawing tool</a></br><a href='/carto_doodle/admin.html'>Return to admin tool</a>";
die();

?>