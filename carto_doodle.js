$(document).ready(function(){
    
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
    

    //ARRAYS TO HOLD INPUT VALUES - USED TO GET LENGTH COUNTS AND ADD INDEXES TO INPUTS CREATED ON SUBMIT FOR PROCESSING BY PHP
    geoObjectString_array = [];
    //type_array = [];
    notes_array = [];
    
    
    //YOU'LL NEED ARRAYS HERE FOR THE THREE TYPES OF OJBECTS - POINT, LINE, POLYGON
    //CAN ACTUALLY GET RID OF TYPE ARRAY ABOVE - CAN JUST FILL THIS IN IN PHP


    $("#doodle_form").submit(function(){

        if(Object.keys(featureGroup._layers).length == 0){
            alert("You haven't added anything to the map.");
            return false;
        }
        else{
            $.each(featureGroup._layers, function(key, value){
                
                //IN HERE, GET THE TYPE - FOR EACH TYPE, PUSH TO THE ARRAYS ABOVE WITH IFS
                
                geoObject = value.toGeoJSON();
                geoObjectString = JSON.stringify(value.toGeoJSON());
                geoObjectString_array.push(geoObjectString);

                type = geoObject.geometry.type;
                //type_array.push(type);

                notes = value.notes;
                notes_array.push(notes);
            });

            //WILL NEED THREE FOR LOOPS AS BELOW, ONE FOR EACH GEOMETRY TYPE
            
            for(i = 0; i < geoObjectString_array.length; i++){
                $('#doodle_form').append('<input type="hidden" name="geoObject['+i+']" value='+geoObjectString_array[i]+' />');
                $('#doodle_form').append('<input type="hidden" name="type['+i+']" value='+type_array[i]+' />');
                $('#doodle_form').append('<input type="hidden" name="notes['+i+']" value="'+notes_array[i]+'" />');
            };
        };

    });
     
});