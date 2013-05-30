$(document).ready(function() {
  /**************************************************/
  // Create the map.
  /**************************************************/
  var map = L.mapbox.map('map', 'flipside.map-epnw0q4t', {minZoom: 7, maxZoom: 14}).setView([40, -7.5], 6);
  map.doubleClickZoom.disable(); 

  
  // This must be the last thing to do because the
  // content will change the sidebar height.
  set_map_height();
  
});