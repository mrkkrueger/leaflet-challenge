// All earthquakes from past 7 days url https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson

let basemap = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'", {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

let map = L.map("map", {
    center: [40, -125],
    zoom: 4
});

basemap.addTo(map)

// add markers
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(data => {

    function styleInfo(feature) {
        return {
            opacity: 1,
            color: "black",
            fillOpacity: 1,
            fillColor: getColor(feature.geometry.coordinates[2]),
            radius: getMag(feature.properties.mag),
            weight: 0.5
        }
    }

    function getMag(mag) {
        if (mag === 0) {
            return 1
        }
        return mag * 3
    }

    function getColor(depth) {
        if (depth>50) {
            return "red"
        }
        else if (depth>30){
            return "orange"
        }
        else if (depth>10){
            return "yellow"
        }
        return "white"
    }

    // add geojson layer to map
    L.geoJson(data, { 
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng)
        },
        style: styleInfo,
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "Magnitude: " + feature.properties.mag
                + "<br>Depth: " + feature.geometry.coordinates[2]
                + "<br>Location " + feature.properties.place
            );
        }
    }).addTo(map)

    let legend = L.control({
        position: "bottomright"
    });

    // Add legend info
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
    
        let colors = ["white", "yellow", "orange", "red"];
        let grades = [0, 10, 30, 50]

        for (let i = 0; i < grades.length; i++){
            div.innerHTML += "<i style='background: " + colors[i] +"'></i>"
            + grades[i] + (grades[i+1] ? "&ndash;" + grades[i+1] + "<br>" : "+")
        }
        return div
    }


    legend.addTo(map);
});