$(document).ready(function(){
  
  // Create the map.
  var map = L.mapbox.map('map').setView([40, -74.50], 9);
  //map.addLayer(L.mapbox.tileLayer('flipside.map-epnw0q4t'));
  map.addLayer(L.mapbox.tileLayer('examples.map-4l7djmvo'));
  
  var aaid = get_requested_aaid();
  $.ajax({
    type: "GET",
    url: '/geo/' + aaid + '/json',
    async: false,
    dataType: "json",
    context: document.body
  }).done(function(admin_area) {
    
    var southWest = new L.LatLng(admin_area.geo.min.y, admin_area.geo.min.x);
    var northEast = new L.LatLng(admin_area.geo.max.y, admin_area.geo.max.x);
    var bounds = new L.LatLngBounds(southWest, northEast);
    
    map.fitBounds(bounds);
    
    var gj = [{
    // this feature is in the GeoJSON format: see geojson.org
    // for the full specification
    type: 'Feature',
    geometry: {
        type: 'Point',
        // coordinates here are in longitude, latitude order because
        // x, y is the standard for GeoJSON and many formats
        coordinates: [admin_area.geo.min.x, admin_area.geo.min.y]
    },
    properties: {
        title: 'A Single Marker',
        description: 'Just one of me',
        // one can customize markers by adding simplestyle properties
        // http://mapbox.com/developers/simplestyle/
        'marker-size': 'large',
        'marker-color': '#0AF'
    }
   },
   {
    // this feature is in the GeoJSON format: see geojson.org
    // for the full specification
    type: 'Feature',
    geometry: {
        type: 'Point',
        // coordinates here are in longitude, latitude order because
        // x, y is the standard for GeoJSON and many formats
        coordinates: [admin_area.geo.max.x, admin_area.geo.max.y]
    },
    properties: {
        title: 'A Single Marker',
        description: 'Just one of me',
        // one can customize markers by adding simplestyle properties
        // http://mapbox.com/developers/simplestyle/
        'marker-size': 'large',
        'marker-color': '#0AF'
    }}];
    
    // Add features to the map
    map.markerLayer.setGeoJSON(gj);
    
  });
  
});


/**
 * Get the aaid from the URL
 * @return aaid [int]
 *
 * @todo change this when we have final API paths
 */
function get_requested_aaid() {
  return window.location.pathname.split('/')[2];
}