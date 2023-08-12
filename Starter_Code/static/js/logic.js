var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl).then(function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p><h3>${feature.properties.mag}</h3><hr><p><h3>${feature.geometry.coordinates[2]}</h3>`);
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            var geojsonMarkerOptions = {
                radius: feature.properties.mag * 2,
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    });

    createMap(earthquakes);
}

function createMap(earthquakes) {
    var topo = L.tileLayer('http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png');
    var streetView = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetView, earthquakes]
    });

    var baseMaps = {
        "Topographic Map": topo,
        "Street View": streetView
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);

    createLegend(myMap);
}

function getColor(depth) {
    return depth > 700 ? '#800026' :
           depth > 300 ? '#BD0026' :
           depth > 200 ? '#E31A1C' :
           depth > 100 ? '#FC4E2A' :
           depth > 50  ? '#FD8D3C' :
           depth > 20  ? '#FEB24C' :
           depth > 10  ? '#FED976' :
                        '#FFEDA0';
}

function createLegend(myMap) {
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function(map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10, 20, 50, 100, 200, 300, 700],
            labels = [];

        // Generate a label with a colored background for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '; width: 18px; height: 18px; float: left; margin-right: 8px; opacity: 0.7"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + ' <br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);
}





