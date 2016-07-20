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
//var popUpFields = "Properties</br><input class='popup_notes' type='text' /><button class='popup_save'>Save</button>";

var popUpFields = "Properties</br><button class='add_property'>Add property</button><table class='properties_container'><tr class='header_row' style='display:none'><th>Property</th><th>Value</th></tr></table><button class='popup_save'>Save</button>";



$(document).on("click", ".add_property", function(){
    $(this).next(".properties_container").find(".header_row").show();
    $(this).next(".properties_container").append("<tr class='properties_row'><td><input type='text' class='property' /></td><td><input type='text' class='value' /></td></tr>");
});






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
            
        propertiesTable = $(this).prev();
        propertiesRows = propertiesTable.find(".properties_row");
        
        propertiesObject = {};
        
        $(propertiesRows).each(function(){
            
            property = $(this).find(".property").val();
            value = $(this).find(".value").val();
            
            propertiesObject[property] = value;
        });
        
        e.layer.properties = propertiesObject;
        console.log(e.layer)
    });
});

/*
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
    
    
  */  



























      





function save(){    
    
    
    geoJSONArray = [];
    
    if(Object.keys(featureGroup._layers).length == 0){
        alert("You haven't added anything to the map.");
        return false;
    }
    else{
        $.each(featureGroup._layers, function(key, value){

            geoObject = value.toGeoJSON();
            geoObject.properties = value.properties;
            type = geoObject.geometry.type;
            
            geoObjectString = JSON.stringify(geoObject);
            //geoObjectString = geoObjectString.slice(45, -1);
            
            
            
            geoJSONArray.push(geoObjectString);

         });
    };
    
    return geoJSONArray;
};










    function exportTableToCSV($table, filename){

        var $rows = $table.find('tr:has(td)'),

            // Temporary delimiter characters unlikely to be typed by keyboard
            // This is to avoid accidentally splitting the actual contents
            tmpColDelim = String.fromCharCode(11), // vertical tab character
            tmpRowDelim = String.fromCharCode(0), // null character

            // actual delimiter characters for CSV format
            colDelim = '","',
            rowDelim = '"\r\n"',

            // Grab text from table into CSV formatted string
            csv = '"' + $rows.map(function (i, row) {
                var $row = $(row),
                    $cols = $row.find('td');

                return $cols.map(function (j, col) {
                    var $col = $(col),
                        text = $col.text();

                    return text.replace(/"/g, '""'); // escape double quotes

                }).get().join(tmpColDelim);

            }).get().join(tmpRowDelim)
                .split(tmpRowDelim).join(rowDelim)
                .split(tmpColDelim).join(colDelim) + '"',

            // Data URI
            csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
    
        

        $(this)
            .attr({
            'download': filename,
                'href': csvData,
                'target': '_blank'
        });
    };