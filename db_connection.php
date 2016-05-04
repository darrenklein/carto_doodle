<?php


/*
require '../../credentials/local_credentials.php';


//TO POSTGIS
$conn = pg_connect("host=localhost dbname=postgis user=$user password=$password");

$geoObject_array = $_POST['geoObject'];

$objects = '';

foreach($geoObject_array as $key => $value){
    $value = substr($value, 45, -1);
    $value = "'" . $value . "'";
    
    if($key === (count($geoObject_array) - 1)){
        $objects .= "(ST_SetSRID(ST_GeomFromGeoJSON($value), 4326))";
    }
    else{
        $objects .= "(ST_SetSRID(ST_GeomFromGeoJSON($value), 4326)),";
    };
    
};

$sql = "INSERT INTO carto_doodle (point_geom) VALUES $objects";



//WORKING EXAMPLE
//$sql = "INSERT INTO carto_doodle (point_geom) VALUES (ST_SetSRID(ST_GeomFromGeoJSON($value), 4326))";


//WORKING EXAMPLE
//$sql = 'INSERT INTO carto_doodle (point_geom) VALUES (ST_SetSRID(ST_GeomFromGeoJSON(\'{"type":"Point","coordinates":[-48.23456, 20.12345]}\'), 4326))';



$success = pg_query($conn, $sql);

if ($success){
    pg_close();
    echo "Big ups from PostgreSQL and PostGIS";
};
*/














/*
//TO CARTODB - DOESN'T WORK FROM LOCAL SERVER
$cartodb_username = "***";
$api_key = "***";


$geoObject_array = $_POST['geoObject'];

$objects = '';


foreach($geoObject_array as $key => $value){

    $value = substr($value, 45, -1);
    $value = "'" . $value . "'";
    
    if($key == (count($geoObject_array) - 1)){
        $objects .= "(ST_SetSRID(ST_GeomFromGeoJSON($value), 4326))";
    }
    else{
        $objects .= "(ST_SetSRID(ST_GeomFromGeoJSON($value), 4326)),";
    };
    
};

$cartoDBsql = "INSERT INTO carto_doodle (the_geom) VALUES $objects";


//WORKING EXAMPLE
//$cartoDBsql = 'INSERT INTO carto_doodle (the_geom) VALUES (ST_SetSRID(ST_GeomFromGeoJSON(\'{"type":"Point","coordinates":[-48.23456, 20.12345]}\'), 4326)), (ST_SetSRID(ST_GeomFromGeoJSON(\'{"type":"Point","coordinates":[-48.33456, 20.12345]}\'), 4326))';


//---------------
// Initializing curl
$ch = curl_init( "https://".$cartodb_username.".cartodb.com/api/v2/sql" );
$query = http_build_query(array('q'=>$cartoDBsql,'api_key'=>$api_key));
// Configuring curl options
curl_setopt($ch, CURLOPT_POST, TRUE);
curl_setopt($ch, CURLOPT_POSTFIELDS, $query);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
$result_not_parsed = curl_exec($ch);
//----------------

echo "cool";
*/
















//UPDATED CARTODB CONNECTION - DOESN'T WORK FROM LOCAL SERVER


$cartodb_username = "***";
$api_key = "***";


$geoObject_array = $_POST['geoObject'];
$type_array = $_POST['type'];
$notes_array = $_POST['notes'];

foreach($geoObject_array as $key => $value){
    
    $value = substr($value, 45, -1);
    $value = "'" . $value . "'";
    
    $type = strtolower($type_array[$key]);
    
    $notes = "'" . $notes_array[$key] . "'";
        
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
    
    echo $GeoJSON;
    
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


?>