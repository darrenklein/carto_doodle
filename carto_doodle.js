//GETS THE MAP LAYER
var map = L.map('map', {scrollWheelZoom: false}).setView([40.709792, -73.991547], 10);

L.tileLayer('https://{s}.tiles.mapbox.com/v3/ebrelsford.ho06j5h0/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://mapbox.com">Mapbox</a>'
    }).addTo(map);


//SETS UP THE FEATUREGROUP AND ADDS THE DRAWING PANEL TO THE MAP
var featureGroup = L.featureGroup().addTo(map);

var drawControl = new L.Control.Draw({
    draw: {
        circle: false
    },
    edit: {
        featureGroup: featureGroup
    }
}).addTo(map);


//SETS THE POPUP CONTENT
var popUpFields = "What's here?</br><input class='popup_notes' type='text' /><button class='popup_save'>Save</button>"


//SETS BASIC DRAWING FUNCIONALITY - AFTER GEOMETRIES ARE DRAWN, A POPUP OPENS ALLOWING USER TO INPUT NOTES. CLICKING A GEOMETRY AGAIN REOPENS THE WINDOW AND ALLOWS A USER TO EDIT THEIR NOTE.
map.on('draw:created', function(e){
    featureGroup.addLayer(e.layer);
    e.layer.bindPopup(popUpFields).openPopup();

    e.layer.on('click', function(){
        if(e.layer.notes){
            e.layer.bindPopup("What's here?</br><input class='popup_notes' type='text' value='"+e.layer.notes+"' /><button class='popup_save'>Save</button>").openPopup();
        }
        else{
            e.layer.bindPopup(popUpFields).openPopup();
        };

        $('.popup_save').click(function(){
            e.layer.notes = $('.popup_notes').val();
        });
    });

    $('.popup_save').click(function(){
        e.layer.notes = $('.popup_notes').val();
    });
});


point_array = [];
polygon_array = [];
linestring_array = [];


$("#doodle_form").submit(function(){

    if(Object.keys(featureGroup._layers).length == 0){
        alert("You haven't added anything to the map.");
        return false;
    }
    else{
        $.each(featureGroup._layers, function(key, value){

            geoObject = value.toGeoJSON();
            geoObjectString = JSON.stringify(value.toGeoJSON());
            type = geoObject.geometry.type;
            notes = value.notes;

            input_array = [geoObjectString, notes];

            if(type === 'Point'){
                point_array.push(input_array);
            }
            else if(type === 'Polygon'){
                polygon_array.push(input_array);
            }
            else{
                linestring_array.push(input_array);
            };

         });

        for(i = 0; i < point_array.length; i++){
            $('#doodle_form').append('<input type="hidden" name="point['+i+']" value='+point_array[i][0]+' />');
            $('#doodle_form').append('<input type="hidden" name="point_notes['+i+']" value="'+point_array[i][1]+'" />');
        };

        for(j = 0; j < polygon_array.length; j++){
            $('#doodle_form').append('<input type="hidden" name="polygon['+j+']" value='+polygon_array[j]+' />');
            $('#doodle_form').append('<input type="hidden" name="polygon_notes['+j+']" value="'+polygon_array[j][1]+'" />');
        };

        for(k = 0; k < linestring_array.length; k++){
            $('#doodle_form').append('<input type="hidden" name="linestring['+k+']" value='+linestring_array[k]+' />');
            $('#doodle_form').append('<input type="hidden" name="linestring_notes['+k+']" value="'+linestring_array[k][1]+'" />');
        };
    }; 

});
    
    
    

      








function save(){
    if(Object.keys(featureGroup._layers).length == 0){
        alert("You haven't added anything to the map.");
        return false;
    }
    else{
        $.each(featureGroup._layers, function(key, value){

            geoObject = value.toGeoJSON();
            geoObjectString = JSON.stringify(value.toGeoJSON());
            type = geoObject.geometry.type;
            notes = value.notes;

            input_array = [geoObjectString, notes];

            if(type === 'Point'){
                point_array.push(input_array);
            }
            else if(type === 'Polygon'){
                polygon_array.push(input_array);
            }
            else{
                linestring_array.push(input_array);
            };

         });

        for(i = 0; i < point_array.length; i++){
            
                geoObject.geometry.properties = {"notes": "test"};

                console.log(geoObject.geometry)
            
//            $('#doodle_form').append('<input type="hidden" name="point['+i+']" value='+point_array[i][0]+' />');
//            $('#doodle_form').append('<input type="hidden" name="point_notes['+i+']" value="'+point_array[i][1]+'" />');
        };

        for(j = 0; j < polygon_array.length; j++){
//            $('#doodle_form').append('<input type="hidden" name="polygon['+j+']" value='+polygon_array[j]+' />');
//            $('#doodle_form').append('<input type="hidden" name="polygon_notes['+j+']" value="'+polygon_array[j][1]+'" />');
        };

        for(k = 0; k < linestring_array.length; k++){
//            $('#doodle_form').append('<input type="hidden" name="linestring['+k+']" value='+linestring_array[k]+' />');
//            $('#doodle_form').append('<input type="hidden" name="linestring_notes['+k+']" value="'+linestring_array[k][1]+'" />');
        };
    };
};












function exportGeoJSON(){
  save();  
};