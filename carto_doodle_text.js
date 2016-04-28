$(document).ready(function(){
    
    var map = L.map('map', {scrollWheelZoom: false}).setView([40.709792, -73.991547], 10);
    
    L.tileLayer('https://{s}.tiles.mapbox.com/v3/ebrelsford.ho06j5h0/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>'
        }).addTo(map);
    
    
    
    var featureGroup = L.featureGroup().addTo(map);

    var drawControl = new L.Control.Draw({
        draw: {
            circle: false
        },
        edit: {
            featureGroup: featureGroup
        }
    }).addTo(map);
    

    
    
    var popUpFields = "What's here?</br><input type='text' />"
    
    
    
    
    

    map.on('draw:created', function(e){
        featureGroup.addLayer(e.layer);
        e.layer.bindPopup(popUpFields).openPopup();
    });
    


    
    geoObjectString_array = [];
    type_array = [];


    $("#doodle_form").submit(function(){

        $.each(featureGroup._layers, function(key, value){
            geoObject = value.toGeoJSON();
            type = geoObject.geometry.type;
            geoObjectString = JSON.stringify(value.toGeoJSON());
            geoObjectString_array.push(geoObjectString);
            type_array.push(type);
        });

        for(i = 0; i < geoObjectString_array.length; i++){
            $('#doodle_form').append('<input type="text" name="geoObject['+i+']" value='+geoObjectString_array[i]+' />');
            $('#doodle_form').append('<input type="text" name="type['+i+']" value='+type_array[i]+' />');
        };

    });
    
    
});