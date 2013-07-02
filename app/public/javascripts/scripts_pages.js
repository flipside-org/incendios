$(document).ready(function() {
  /**************************************************/
  // Create the map.
  /**************************************************/
  var southWest = new L.LatLng(35, -11.5),
  northEast = new L.LatLng(44, -3),
  bounds = new L.LatLngBounds(southWest, northEast);
  var map = L.mapbox.map('map', 'flipside.map-epnw0q4t', {minZoom: 7, maxZoom: 14, maxBounds : bounds}).setView([40, -7.5], 6);
  map.doubleClickZoom.disable(); 

  
  // This must be the last thing to do because the
  // content will change the sidebar height.
  set_map_height();
  
});