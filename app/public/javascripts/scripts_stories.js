$(document).ready(function() {
  /**************************************************/
  // Create the map.
  /**************************************************/
  var map = L.mapbox.map('map', 'flipside.map-epnw0q4t', {minZoom: 7, maxZoom: 14}).setView([40, -7.5], 6);
  map.doubleClickZoom.disable();
  
  // Markers if any.
  if (typeof Incendios.settings.map.markers != "undefined") {
    var markers_id = Incendios.settings.map.markers;
    
    $.ajax({
      type : "POST",
      url : '/occurrencedetails/marker',
      data : { 'id' : markers_id },
      dataType : "json"
    }).done(function(res) {
      console.log(res);
      if (res == null) return;
      L.mapbox.markerLayer(res).addTo(map);
    });
      
  }

  
  // This must be the last thing to do because the
  // content will change the sidebar height.
  set_map_height();
  
});