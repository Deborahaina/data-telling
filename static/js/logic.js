// Creating map object
let myMap = L.map("map", {
  center: [40.7128, -74.0059],
  zoom: 12
});

// Adding tile layer to the map
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(myMap);

// Store API query variables
let baseURL = "https://data.cityofnewyork.us/resource/fhrw-4uyv.json?";
// Add the dates in the ISO formats
let date = "$where=created_date between '2019-01-01T12:00:00' and '2020-01-01T12:00:00'";
// Add the complaint type
let complaint = "&complaint_type=Rodent";
// Add a limit
let limit = "&$limit=10000";


// Assemble API query URL
let url = baseURL+ date + complaint+ limit;

let geojson;

// Grab the data with d3
d3.json(url,function(data){

  // Create a new marker cluster group
  let markers = L.markerClusterGroup();

  // Loop through data
  for (let i=0; i < data.length; i++){

  // Set the data location property to a variable
  let location = data[i].location;

     // Check for location property
    if(location)

     // Add a new marker to the cluster group and bind a pop-up
    {
      markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
      .bindPopup(data[i].descriptor, + '<hr>' + data[i].cross_street_1 + '<br>' + data[i].cross_street_2))
    }
  }
  //Add our marker cluster layer to the map
  myMap.fitBounds(markers.getBounds(),
  {padding:[20,20]}); 
  myMap.addLayer(markers);
})

 
