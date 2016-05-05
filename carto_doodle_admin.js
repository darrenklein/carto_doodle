$(document).ready(function(){

    
    
                var map = L.map('map', {scrollWheelZoom: false}).setView([40.709792, -73.991547], 10);

            L.tileLayer('https://{s}.tiles.mapbox.com/v3/ebrelsford.ho06j5h0/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>'
                }).addTo(map);
            
            
            
            
            
            var featureGroup = new L.FeatureGroup();
            
            var url_array = ["https://skwidbreth.cartodb.com/api/v2/sql?format=geojson&q=SELECT cartodb_id,the_geom,notes FROM carto_doodle_point", "https://skwidbreth.cartodb.com/api/v2/sql?format=geojson&q=SELECT cartodb_id,the_geom,notes FROM carto_doodle_polygon", "https://skwidbreth.cartodb.com/api/v2/sql?format=geojson&q=SELECT cartodb_id,the_geom,notes FROM carto_doodle_line"];
            
            
            $.each(url_array, function(key, url){
                
                $.getJSON(url, function(data){
                    geojsonLayer = L.geoJson(data, {
                        onEachFeature: function (feature, layer) {
                            layer.cartodb_id = feature.properties.cartodb_id;
                            featureGroup.addLayer(layer);
                            
                            console.log(layer.cartodb_id);
                            console.log(layer.feature.properties.notes);
                        }
                    });
                    map.addLayer(featureGroup);
                });
                
            });
            


            var drawControl = new L.Control.Draw({
                draw: {
                    circle: false
                },
                edit: {
                    featureGroup: featureGroup
                }
            }).addTo(map);
    
    
    
    
    
    
    map.on('draw:edited', function(e){
        e.layers.eachLayer(function(layer){
            layer.edit = true;
            //console.log(layer);
        });
    });


    
    geoObjectString_array = [];
    cartodbID_array = [];
    type_array = [];
    notes_array = [];


    $("#admin_doodle_form").submit(function(){
    //$("#test").click(function(){
        
        $.each(featureGroup._layers, function(key, value){
            if(value.edit){
                
                geoObject = value.toGeoJSON();
                
                cartodbID = geoObject.properties.cartodb_id;
                cartodbID_array.push(cartodbID);
            
                type = geoObject.geometry.type;
                type_array.push(type);
                
                //DELETE THESE PROPERTIES SO THEY ARE NOT PASSED INTO THE GEOJSON ITSELF
                delete geoObject.properties.notes;
                delete geoObject.properties.cartodb_id;
                
                geoObjectString = JSON.stringify(value.toGeoJSON());
                geoObjectString_array.push(geoObjectString);
                
            
            }
            /*
            geoObject = value.toGeoJSON();
            geoObjectString = JSON.stringify(value.toGeoJSON());
            geoObjectString_array.push(geoObjectString);
            
            type = geoObject.geometry.type;
            type_array.push(type);
            
            notes = value.notes;
            notes_array.push(notes);
            */
        });

        
        
        
        for(i = 0; i < geoObjectString_array.length; i++){
            $('#admin_doodle_form').append('<input type="text" name="geoObject['+i+']" value='+geoObjectString_array[i]+' />');
            $('#admin_doodle_form').append('<input type="text" name="cartodbID['+i+']" value='+cartodbID_array[i]+' />');
            $('#admin_doodle_form').append('<input type="text" name="type['+i+']" value='+type_array[i]+' />');
            //$('#doodle_form').append('<input type="hidden" name="notes['+i+']" value="'+notes_array[i]+'" />');
        };
        
        
    });
    
    
});