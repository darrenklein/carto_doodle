<?php



$cartodb_username = "***";
$api_key = "***";



$geoObject_array = $_POST['geoObject'];
$cartodbID_array = $_POST['cartodbID'];
$type_array = $_POST['type'];


foreach($geoObject_array as $key => $value){
    
    //$value = substr($value, 45, -1);
    //$value = "'" . $value . "'";
    
    $value = '{"type":"Polygon","coordinates":[[[-74.50927734375,40.76494141246851],[-74.50927734375,40.83874913796459],[-74.12887573242188,40.83874913796459],[-74.12887573242188,40.76494141246851],[-74.50927734375,40.76494141246851]]]}';
    
    $value = "'" . $value . "'";
    
    $cartodbID = $cartodbID_array[$key];
    
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
    
    
    $cartoDBsql = "UPDATE carto_doodle_$destination SET the_geom = $GeoJSON WHERE cartodb_id = $cartodbID";
    
    echo $cartoDBsql;
    
    
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