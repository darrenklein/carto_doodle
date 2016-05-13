$(document).ready(function(){

    //GETS THE MAP LAYER
    var map = L.map('map', {scrollWheelZoom: false}).setView([40.709792, -73.991547], 10);

    L.tileLayer('https://{s}.tiles.mapbox.com/v3/ebrelsford.ho06j5h0/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>'
        }).addTo(map);

            
    var featureGroup = new L.FeatureGroup();

    var url_array = ["https://skwidbreth.cartodb.com/api/v2/sql?format=geojson&q=SELECT cartodb_id,the_geom,notes FROM carto_doodle_point", "https://skwidbreth.cartodb.com/api/v2/sql?format=geojson&q=SELECT cartodb_id,the_geom,notes FROM carto_doodle_polygon", "https://skwidbreth.cartodb.com/api/v2/sql?format=geojson&q=SELECT cartodb_id,the_geom,notes FROM carto_doodle_line"];
    
    
    //USED LATER, AS PART OF FORM VALIDATION
    edited_array = [];
    
            
    //ADDS THE JSON OF EACH LAYER TO THE FEATUREGROUP, ADDS THE VALUES OF THE CARTODB_ID AND NOTES COLUMNS AS PROPERTIES, AND POPULATES THE POPUP WITH THE OBJECT'S NOTES
    $.each(url_array, function(key, url){

        $.getJSON(url, function(data){
            geojsonLayer = L.geoJson(data, {
                onEachFeature: function(feature, layer){
                    layer.cartodb_id = feature.properties.cartodb_id;
                    layer.notes = feature.properties.notes;

                    featureGroup.addLayer(layer);

                    layer.on('click', function(){
                        layer.bindPopup("CartoDB ID "+layer.cartodb_id+" </br><input class='popup_notes' type='text' value='"+layer.notes+"' /><button class='popup_save'>Save</button>").openPopup();

                        $('.popup_save').click(function(){
                            layer.notes = $('.popup_notes').val();
                            layer.edit = true;
                            edited_array.push(layer);
                        }); 

                    });
                }
            });
            map.addLayer(featureGroup);
        });

    });
            

    //ADDS THE DRAWING PANEL TO THE MAP
    var drawControl = new L.Control.Draw({
        draw: {
            circle: false,
            polygon: false,
            marker: false,
            rectangle: false,
            polyline: false
        },
        edit: {
            featureGroup: featureGroup
        }
    }).addTo(map);
    
    
    //WHEN AN OBJECT HAS BEEN EDITED, THE EDIT PROPERTY IS ADDED TO THAT OBJECT
    map.on('draw:edited', function(e){
        e.layers.eachLayer(function(layer){
            layer.edit = true;
            edited_array.push(layer);
        });
    });
    
    //CAPTURES KEY ATTRIBUTES ABOUT DELETED OBJECTS FOR PROCESSING BY PHP - USED TO GET LENGTH COUNTS AND ADD INDEXES TO INPUTS CREATED ON SUBMIT FOR PROCESSING BY PHP
    deletedPointID_array = [];
    deletedPolygonID_array = [];
    deletedLineStringID_array = [];

    map.on('draw:deleted', function(e){
        
        e.layers.eachLayer(function(layer){
            type = layer.feature.geometry.type;
            
            if(type === 'Point'){
                deletedPointID_array.push(layer.feature.properties.cartodb_id); 
            }
            else if(type === 'Polygon'){
                deletedPolygonID_array.push(layer.feature.properties.cartodb_id); 
            }
            else{
                deletedLineStringID_array.push(layer.feature.properties.cartodb_id);
            }; 
        });
        
    });


    //ARRAYS TO HOLD INPUT VALUES - USED TO GET LENGTH COUNTS AND ADD INDEXES TO INPUTS CREATED ON SUBMIT FOR PROCESSING BY PHP
    editedPoint_array = [];
    editedPolygon_array = [];
    editedLineString_array = [];
    
    
    
    $("#test").click(function(){
        if(edited_array.length == 0 && deletedPointID_array.length == 0 && deletedPolygonID_array.length == 0 && deletedLineStringID_array.length == 0){
            alert("You haven't made any changes.");
            return false;
        }
        else{
            $.each(featureGroup._layers, function(key, value){
                    if(value.edit){

                        geoObject = value.toGeoJSON();
                        cartodbID = geoObject.properties.cartodb_id;
                        notes = value.notes;
                        type = geoObject.geometry.type;

                        //DELETE THESE PROPERTIES SO THEY ARE NOT PASSED INTO THE GEOJSON ITSELF - CARTODB CAN'T SEEM TO HANDLE GEOJSON THE WAY IT WOULD BE FORMATTED IF THESE WERE INCLUDED
                        delete geoObject.properties.cartodb_id;
                        delete geoObject.properties.notes;

                        geoObjectString = JSON.stringify(value.toGeoJSON());

                        input_array = [geoObjectString, "'" + notes + "'", cartodbID];

                        if(type === 'Point'){
                            editedPoint_array.push(input_array);
                        }
                        else if(type === 'Polygon'){
                            editedPolygon_array.push(input_array);
                        }
                        else{
                            editedLineString_array.push(input_array);
                        };

                    }
                });


            //EDITED INPUTS
            for(a = 0; a < editedPoint_array.length; a++){
                $('#admin_doodle_form').append('<input type="hidden" name="editedPoint['+a+']" value='+editedPoint_array[a][0]+' />');
                $('#admin_doodle_form').append('<input type="hidden" name="editedPointNotes['+a+']" value='+editedPoint_array[a][1]+' />');
                $('#admin_doodle_form').append('<input type="hidden" name="editedPointID['+a+']" value='+editedPoint_array[a][2]+' />');
            };

            for(b = 0; b < editedPolygon_array.length; b++){
                $('#admin_doodle_form').append('<input type="hidden" name="editedPolygon['+b+']" value='+editedPolygon_array[b][0]+' />');
                $('#admin_doodle_form').append('<input type="hidden" name="editedPolygonNotes['+b+']" value='+editedPolygon_array[b][1]+' />');
                $('#admin_doodle_form').append('<input type="hidden" name="editedPolygonID['+b+']" value='+editedPolygon_array[b][2]+' />');
            };

            for(c = 0; c < editedLineString_array.length; c++){
                $('#admin_doodle_form').append('<input type="hidden" name="editedLineString['+c+']" value='+editedLineString_array[c][0]+' />');
                $('#admin_doodle_form').append('<input type="hidden" name="editedLineStringNotes['+c+']" value='+editedLineString_array[c][1]+' />');
                $('#admin_doodle_form').append('<input type="hidden" name="editedLineStringID['+c+']" value='+editedLineString_array[c][2]+' />');
            };

            //DELETED INPUTS
            for(i = 0; i < deletedPointID_array.length; i++){
                $('#admin_doodle_form').append('<input type="hidden" name="deletedPointID['+i+']" value='+deletedPointID_array[i]+' />');
            };

            for(j = 0; j < deletedPolygonID_array.length; j++){
                $('#admin_doodle_form').append('<input type="hidden" name="deletedPolygonID['+j+']" value='+deletedPolygonID_array[j]+' />');
            };

            for(k = 0; k < deletedLineStringID_array.length; k++){
                $('#admin_doodle_form').append('<input type="hidden" name="deletedLineStringID['+k+']" value='+deletedLineStringID_array[k]+' />');
            };
        };
        
    });
    

    /*
    $("#admin_doodle_form").submit(function(){
        
        if(edited_array.length == 0 && deletedID_array.length == 0){
            alert("You haven't made any changes.");
            return false;
        }
        else{
            $.each(featureGroup._layers, function(key, value){
                if(value.edit){

                    geoObject = value.toGeoJSON();

                    cartodbID = geoObject.properties.cartodb_id;
                    cartodbID_array.push(cartodbID);

                    notes = value.notes;
                    notes_array.push(notes);

                    type = geoObject.geometry.type;
                    type_array.push(type);

                    //DELETE THESE PROPERTIES SO THEY ARE NOT PASSED INTO THE GEOJSON ITSELF - CARTODB CAN'T SEEM TO HANDLE GEOJSON THE WAY IT WOULD BE FORMATTED IF THESE WERE INCLUDED
                    delete geoObject.properties.cartodb_id;
                    delete geoObject.properties.notes;

                    geoObjectString = JSON.stringify(value.toGeoJSON());
                    geoObjectString_array.push(geoObjectString);
                }
            });

            for(i = 0; i < geoObjectString_array.length; i++){
                $('#admin_doodle_form').append('<input type="hidden" name="geoObject['+i+']" value='+geoObjectString_array[i]+' />');
                $('#admin_doodle_form').append('<input type="hidden" name="cartodbID['+i+']" value='+cartodbID_array[i]+' />');
                $('#admin_doodle_form').append('<input type="hidden" name="type['+i+']" value='+type_array[i]+' />');
                $('#admin_doodle_form').append('<input type="hidden" name="notes['+i+']" value="'+notes_array[i]+'" />');
            };

            for(j = 0; j < deletedID_array.length; j++){
                $('#admin_doodle_form').append('<input type="hidden" name="deletedID['+j+']" value='+deletedID_array[j]+' />');
                $('#admin_doodle_form').append('<input type="hidden" name="deletedType['+j+']" value='+deletedType_array[j]+' />');
            };
        };
        
    });
    */
});