$(window).resize(function(){ set_map_height(); });

$(document).ready(function() {
  // Init!
  set_sidebar_height();
  set_map_height();
  
  /**************************************************/
  // Create the map.
  /**************************************************/
  var map = L.mapbox.map('map_pages', 'flipside.map-epnw0q4t', {minZoom: 7, maxZoom: 14}).setView([40, -74.50], 9);
  map.doubleClickZoom.disable(); 

  
  // This must be the last thing to do because the
  // content will change the sidebar height.
  set_map_height();
  
});