$(document).ready(function(){

    //GETS THE MAP LAYER
    var map = L.map('map', {scrollWheelZoom: false}).setView([40.709792, -73.991547], 10);

    L.tileLayer('https://{s}.tiles.mapbox.com/v3/ebrelsford.ho06j5h0/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>'
        }).addTo(map);

            
    var featureGroup = new L.FeatureGroup();

    var url_array = ["https://YOUR_USERNAME_HERE.cartodb.com/api/v2/sql?format=geojson&q=SELECT cartodb_id,the_geom,notes FROM carto_doodle_point", "https://YOUR_USERNAME_HERE.cartodb.com/api/v2/sql?format=geojson&q=SELECT cartodb_id,the_geom,notes FROM carto_doodle_polygon", "https://YOUR_USERNAME_HERE.cartodb.com/api/v2/sql?format=geojson&q=SELECT cartodb_id,the_geom,notes FROM carto_doodle_line"];
    
    
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
    deletedID_array = [];
    deletedType_array = [];

    map.on('draw:deleted', function(e){
        e.layers.eachLayer(function(layer){
            deletedID_array.push(layer.feature.properties.cartodb_id);
            deletedType_array.push(layer.feature.geometry.type);
        });
    });


    //ARRAYS TO HOLD INPUT VALUES - USED TO GET LENGTH COUNTS AND ADD INDEXES TO INPUTS CREATED ON SUBMIT FOR PROCESSING BY PHP
    geoObjectString_array = [];
    cartodbID_array = [];
    type_array = [];
    notes_array = [];


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
    
});