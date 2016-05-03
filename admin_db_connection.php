<?php


//UPDATED CARTODB CONNECTION - DOESN'T WORK FROM LOCAL SERVER


$cartodb_username = "***";
$api_key = "***";



    
    $cartoDBsql = "UPDATE carto_doodle_point SET notes='update' WHERE cartodb_id = '74'";
    
    // Initializing curl
    $ch = curl_init( "https://".$cartodb_username.".cartodb.com/api/v2/sql" );
    $query = http_build_query(array('q'=>$cartoDBsql,'api_key'=>$api_key));
    // Configuring curl options
    curl_setopt($ch, CURLOPT_POST, TRUE);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $query);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    $result_not_parsed = curl_exec($ch);
    //---------------- 




?>