const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Fetch the JSON data 
d3.json(url).then(function(data) {
    console.log(data);
    features = [];
    // get object with the features info
    features = data.features;
    var number_items = features.length;
    // console.log("this is features in  " + features[5].properties.mag);
    // console.log("this is number in  "+ number_items);
    
    get_data(features);
    
});


function get_data(features_data){
    
    // Define a function  to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}<br><br>Latitude : ${feature.geometry.coordinates[1]}<br> Longitude :${feature.geometry.coordinates[0]}<br> magnitude :${feature.properties.mag}<br> Depth :${feature.geometry.coordinates[2]}</p>`);
    }

        
    function point_To_Layer(feature, latlng) {
        let color;
        
        color = getColor(feature.geometry.coordinates[2]);
        var earthquakeMarkers = {
            radius: feature.properties.mag,
            fillColor: color,
            //opacity: 1,
            color: color,
            //color: "white",
            weight: feature.properties.mag,//1,
            fillOpacity: 1
            };
            
        return L.circleMarker(latlng, earthquakeMarkers);
    }

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    let earthquakes = L.geoJSON(features_data, {
    onEachFeature: onEachFeature,
    pointToLayer: point_To_Layer
    });
    console.log("este es el valor the erthqukes " + earthquakes)
    // call function create_map
    load_map(earthquakes);
}


function load_map(earthquakes_data){
    // Adding a tile layer (the background map image) to our map:
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    })

    console.log("este es el valor the erthqukes_data " + earthquakes_data)

    // Create our map, giving it the street map and earthquakes layers to display on load.
    let earthquakes_map = L.map("map", {
        center: [0, 0],//[37.09, -95.71],
        zoom: 2,
        layers: [street, earthquakes_data]
        });

    // ********************************************************
    //the following code will build and add a legend for the 
    // earthquakes_map
    const legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        let div = L.DomUtil.create('div', 'legend');
	    let grades = [-10, 10, 30, 50, 70, 90];
	    let labels = [];
	    let from, to;
        //the following line add the title to the legend
        //for this reason i start = 1 in the for loop
        labels.push(` Earthquake depths from<br> the past 7 days (Km)<hr>`);
        //the following for create the convention colors for the legend
	    for (let i = 1; i < grades.length + 1; i++) {
		    from = grades[i-1];
		    to = grades[i];
		    labels.push(`<i style="background:${getColor(from + 1)}"></i> ${from}${to ? `&ndash;${to}` : '+'}`);
		}
		div.innerHTML = labels.join('<br>');
		return div;
	};
	legend.addTo(earthquakes_map);
        
}


// the function getColor get the color for the legend and circle marker
function getColor(d) {
    return d > 89 ? '#800026' :
        d > 69  ? '#BD0026' :
        d > 49  ? '#E31A1C' :
        d > 29  ? '#FC4E2A' :
        d > 9   ? '#FD8D3C' :
                '#FEB24C';
        
    }