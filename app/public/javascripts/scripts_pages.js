$(document).ready(function() {
  /**************************************************/
  // Create the map.
  /**************************************************/
  var southWest = new L.LatLng(35, -11.5),
  northEast = new L.LatLng(44, -3),
  bounds = new L.LatLngBounds(southWest, northEast);
  var map = L.mapbox.map('map', 'flipside.map-epnw0q4t', {minZoom: 7, maxZoom: 14, maxBounds : bounds}).setView([40, -7.5], 6);
  map.doubleClickZoom.disable();
  
  // *** Layer. Grid of administrative borders. Used for interactivity.
  // Changes location upon click. Depends on zoom level.
  var grid_layer = L.mapbox.gridLayer('flipside.pt-admin-areas');
  // Setup the interactivity.
  grid_layer.on('click', function(data){
    if (typeof data.data == 'undefined') {
      //Nothing to do here!
      return;
    }

    // We assume that the aaid always has 6 digits.
    if (map.getZoom() <= 9) {
      // Distrito.
      var destination = data.data.AAID.substring(0,2);
    }
    else if (map.getZoom() >= 10 && map.getZoom() <= 12) {
      // Concelho.
      var destination = data.data.AAID.substring(0,4);
    }
    else {
      // Freguesia.
      var destination = data.data.AAID;
    }

    window.location.href = '/' + Incendios.page_meta.lang + '/por/' + destination;
  });
  // Add layer to map.
  map.addLayer(grid_layer);
  
  // This must be the last thing to do because the
  // content will change the sidebar height.
  set_map_height();
  
});