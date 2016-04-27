$(document).ready(function(){
    
    var map = L.map('map', {scrollWheelZoom: false}).setView([40.709792, -73.991547], 10);
    
    L.tileLayer('https://{s}.tiles.mapbox.com/v3/ebrelsford.ho06j5h0/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>'
        }).addTo(map);
    
    
    
    var featureGroup = L.featureGroup().addTo(map);

    var drawControl = new L.Control.Draw({
        edit: {
            featureGroup: featureGroup
        }
    }).addTo(map);
    

    
    geoObjectString_array = [];
    type_array = [];

    map.on('draw:created', function(e){
        
        featureGroup.addLayer(e.layer);
        
        //geoObject = JSON.stringify(e.layer.toGeoJSON());
        
        //geoObject_array.push(geoObject);
        
        //geoObject_index = geoObject_array.length - 1;
        
        //$('#doodle_form').append('<input name="geoObject['+geoObject_index+']" value='+geoObject+' />')
        

        
        
        
        /*
        $('#layer_type').val(e.layerType);
        
        if(e.layerType == 'polygon' || e.layerType == 'rectangle'){
            
            polyGroup = "";

            for(i = 0; i < e.layer._latlngs.length; i++){
                lng = e.layer._latlngs[i].lng;
                lat = e.layer._latlngs[i].lat;
                
                if(i == e.layer._latlngs.length - 1){
                    //THIS IS NECESSARY FOR A POLYGON - POLYGONS WILL ALWAYS HAVE AN EXTRA SET OF COORDINATES AT THE END WHICH ARE IDENTIAL TO THE FIRST SET OF COORDINATES - CLOSES IT UP, OTHERWISE IT WOULD BE A LINE...
                    lngLatGroup = lng + ' ' + lat + ', ' + e.layer._latlngs[0].lng + ' ' + e.layer._latlngs[0].lat;
                }
                else{
                    lngLatGroup = lng + ' ' + lat + ', ';
                };
                
                polyGroup += lngLatGroup;
            };
            
            $('#polygon').val(polyGroup);
        }
        else if(e.layerType == 'polyline'){
            
            lineGroup = "";

            for(i = 0; i < e.layer._latlngs.length; i++){
                lng = e.layer._latlngs[i].lng;
                lat = e.layer._latlngs[i].lat;
                
                if(i == e.layer._latlngs.length - 1){
                    lngLatGroup = lng + ' ' + lat;
                }
                else{
                    lngLatGroup = lng + ' ' + lat + ', ';
                };
                
                lineGroup += lngLatGroup;
            };
            
            $('#line').val(lineGroup);  
        }
        else if(e.layerType == 'circle'){
            console.log(e.layer.toGeoJSON());
            $('#latitude').val(e.layer._latlng.lat);
            $('#longitude').val(e.layer._latlng.lng); 
            $('#radius').val(e.layer._mRadius);
        }
        else{
            $('#latitude').val(e.layer._latlng.lat);
            $('#longitude').val(e.layer._latlng.lng);
        };
        */

    });

    

    
    
        $("#test").click(function(){
            
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