
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



var popupFields = "Properties</br><button class='add_property'>Add property</button><table class='properties_container'><tr class='header_row' style='display:none'><th>Property</th><th>Value</th></tr></table><button class='popup_save'>Save</button>";



$(document).on("click", ".add_property", function(){
    $(this).next(".properties_container").find(".header_row").show();
    $(this).next(".properties_container").append("<tr class='properties_row'><td><input type='text' class='property' /></td><td><input type='text' class='value' /></td></tr>");
});






//SETS BASIC DRAWING FUNCIONALITY - AFTER GEOMETRIES ARE DRAWN, A POPUP OPENS ALLOWING USER TO INPUT NOTES. CLICKING A GEOMETRY AGAIN REOPENS THE WINDOW AND ALLOWS A USER TO EDIT THEIR NOTE.
map.on('draw:created', function(e){
    featureGroup.addLayer(e.layer);
    e.layer.bindPopup(popupFields).openPopup();
    
    
    
    
    
    function popupSave(x){

        propertiesTable = $(x).prev();
        propertiesRows = propertiesTable.find(".properties_row");
        
        propertiesObject = {};
        
        $(propertiesRows).each(function(){
            
            property = $(this).find(".property").val();
            value = $(this).find(".value").val();
            
            propertiesObject[property] = value;
        });
        
        return propertiesObject;
    };
    
    
    
    

    $('.popup_save').click(function(){
        popupSave(this);
        e.layer.properties = propertiesObject;
    });
    
    
    
    

    e.layer.on('click', function(){
        if(e.layer.properties){
            popupFieldsEdit = "Properties</br><button class='add_property'>Add property</button><table class='properties_container'><tr class='header_row'><th>Property</th><th>Value</th></tr>";
            
            $.each(e.layer.properties, function(attribute, value){
                popupFieldsEdit += "<tr class='properties_row'><td><input type='text' class='property' value='"+attribute+"' /></td><td><input type='text' class='value' value='"+value+"' /></td></tr>";
            });
            
            popupFieldsEdit += "</table><button class='popup_save'>Save</button>";
            
            e.layer.bindPopup(popupFieldsEdit).openPopup();
            
            $('.popup_save').click(function(){
                popupSave(this);
                e.layer.properties = propertiesObject;
            });
        }
        else{
            e.layer.bindPopup(popupFields).openPopup();
        };
    });

});















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
    





    
    





















/*
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








function addPropertyFields(x){
    $(x).next(".properties_container").find(".header_row").show();
    $(x).next(".properties_container").append("<tr class='properties_row'><td><input type='text' class='property' /></td><td><input type='text' class='value' /></td></tr>");
}




var popupFields = "Properties</br><button class='add_property'>Add property</button><table class='properties_container'><tr class='header_row' style='display:none'><th>Property</th><th>Value</th></tr></table><button class='popup_save'>Save</button>";


    $(document).on("click", ".add_property", function(){
        addPropertyFields(this);
    });


//SETS BASIC DRAWING FUNCIONALITY - AFTER GEOMETRIES ARE DRAWN, A POPUP OPENS ALLOWING USER TO INPUT NOTES. CLICKING A GEOMETRY AGAIN REOPENS THE WINDOW AND ALLOWS A USER TO EDIT THEIR NOTE.
map.on('draw:created', function(e){
    
    
    
    
    
    featureGroup.addLayer(e.layer);
    e.layer.bindPopup(popupFields).openPopup();
    
    

    e.layer.on('click', function(){
        
        if(e.layer.properties){
            
            popupFieldsEdit = "Properties</br><button class='add_property'>Add property</button><table class='properties_container'><tr class='header_row'><th>Property</th><th>Value</th></tr>";
            
            $.each(e.layer.properties, function(attribute, value){
                popupFieldsEdit += "<tr class='properties_row'><td><input type='text' class='property' value='"+attribute+"' /></td><td><input type='text' class='value' value='"+value+"' /></td></tr>";
            });
            
            popupFieldsEdit += "</table><button class='popup_save'>Save</button>";
            
            e.layer.setPopupContent(popupFieldsEdit);
            

        }
        else{
            e.layer.bindPopup(popupFields).openPopup();
        };
    });
    
    
    
    $(document).on("click", ".popup_save", function(){
            
        propertiesTable = $(this).prev();
        propertiesRows = propertiesTable.find(".properties_row");
        
        propertiesObject = {};
        
        $(propertiesRows).each(function(){
            
            property = $(this).find(".property").val();
            value = $(this).find(".value").val();
            
            propertiesObject[property] = value;
        });
        
        e.layer.properties = propertiesObject;
    });
});






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
*/