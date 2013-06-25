$(document).ready(function() {
  /**************************************************/
  // Create the map.
  /**************************************************/
  var map = L.mapbox.map('map', 'flipside.map-epnw0q4t', {minZoom: 7, maxZoom: 14, gridLayer: false}).setView([40, -7.5], 6);
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
      
      if (res == null) return;
      
      // Style markers.      
      for (index in res.features) {
        var prop = res.features[index].properties;
        res.features[index].properties['marker-color'] = '#c0392b';
        res.features[index].properties['marker-symbol'] = 'fire-station';
        res.features[index].properties['marker-size'] = 'large';
        
        res.features[index].properties['title'] = prop['data_alerta'];
        res.features[index].properties['description'] = '<strong>' + t('Area') + ':</strong> ' + number_format(prop['aa_total']) + ' Ha<br/><strong>' + t('Cause') + ':</strong> ' + prop['tipocausa'];
      }

      var v = L.mapbox.markerLayer(res).addTo(map);
      map.removeControl();
    });
      
  }

  
  // This must be the last thing to do because the
  // content will change the sidebar height.
  set_map_height();
  
});